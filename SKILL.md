---
name: dream-loop
description: Build a game or app from a description so that a live screenshot matches a generated rendering. Use when the user says "dream loop" or asks for something built to a very high level of graphical fidelity.
license: MIT
---

# dream-loop

This is a process for you to autonomously build extremely impressive visuals, especially for 3D scenes (e.g. in a game or app). Your goal is to produce the most visually stunning result while hitting acceptable frame rate for the target platform (e.g. 60 fps for a browser game, 120 fps for modern mobile devices).

## The target concept

If the user provided you a target, such as a description of a game, scene, or app, you're good to go. Don't ask for clarification unless it's so vague that you don't think you can generate concept art for it.

If they did not provide this, ask for it.

Put working context/files in `.dream-loop` and gitignore this file (unless told otherwise by the user).

## Concept art

The concept is a realistic, high-quality, impressive target: the look of a current AAA game running in real time. Physically plausible materials (wet stone, brushed metal, cloth, glass) with real roughness and normal detail, correct proportions, atmosphere (fog, haze, rain, dust, volumetric light), cinematic lighting with a clear key and rich shadows. It should NOT be stylized or an artistic rendition, it should look like a true screenshot of the ideal result.

Ensure you avoid these failure modes when generating concept art with an image gen model:

- **Overbaked**: photographic clutter, film grain, hundreds of unique small objects, excessive detail on every surface that starts to look like noise. A real-time build with modeled assets won't match this, and it won't even look good to the user if it's so over-detailed.

- **Oversimplified**: cartoon or toy look, flat shading, blobby primitive shapes, empty surfaces. This is boring and will not impress the user.

Aim for the middle ground: Beautiful surfaces and materials that shaders render well, strong atmosphere and lighting, visually interesting color palette, and focused hero elements with fine details that enhance the look and draw the eye (not every element filled with detail fighting for attention).

Prompt the image model for "in-engine screenshot" more than "concept art" and discourage the noisy or grainy look. Review the image carefully, and if it hits one of the failure modes, feed the image back to the model and ask it to fix the issue. Save it as `.dream-loop/concept.png`.

If you don't have an image-generation tool, stop and ask the user for a concept image, or ask them to connect you to an image generation API.

If you generated the art (it wasn't given by the user), you should pause and confirm that it matches the user's vision before kicking off the build loop.

## Time budget

If the user gives a time budget, record the start time and check the clock between rounds. Don't degrade visual fidelity to hit the time budget, strive for the absolute best result. Don't rush work to the judge. Consider what you can do to parallelize or distribute work to hit the time goal, but don't take shortcuts - it's better to hit the time limit with meaningful, beautiful progress than to hit it with something broadly complete but ugly.

If the user doesn't give a time budget, run until you hit an exit criterion, but warn upfront that this is the case and may consume a lot of tokens.

## Build loop

First, look at the concept art and do your best to implement it in one go, and make that first pass count across every tier of the score ladder. Try to nail the composition, textures, lighting, details. Sculpt and model assets carefully or use external ones if allowed for great detail, don't just settle for basic procedural elements and flat surfaces unless the art style calls for it.

Write intermediate files/plans to `.dream-loop` to keep yourself on track.

When you've done everything you think is needed to achieve the target (i.e. built the product fully to the user's specifications and the standard set by the concept art), you'll submit a screenshot to the judge for review (see next section for details).

Important: Before submitting to the judge, each time, review the candidate screenshot yourself and ensure it actually achieves the goals. Do not submit half-baked work to the judge. Step back, look at the screenshot and concept side-by-side, and log an hoenst assessment of whether it is or is not judge-ready. Only submit if you are confident you have significantly improved the score. You must be rigorous, objective, and transparent in this self-assessment; look at every pixel and detail. Even small touches make a big difference. Look for big stuff like missing or incorrect objects, wrong scale, perspective, or positioning. Look for small stuff like rendering glitches, flat untextured surfaces, ugly lighting (overly bright or dark), poor contrast (washed out, or overly dark, or desaturated colors), speckles, ugly shadows, etc. Scan through surface by surface, object by object, audit everything and list them out.

When submitting a screenshot to the judge, target the same resolution and aspect ratio as the concept art, so the comparison is fair.

When ready, use a subagent for the judge (see below). This presupposes that you have a subagent tool or capability built into your harness. If your harness doesn't support that, consider if it is possible to do via CLI (e.g. invoke a recursive instance of your harness). Otherwise, fall back to doing the judgment yourself (but note to the user that this is happening, and that results may be degraded or costs inflated).

If you don't think you have the tools needed to execute this full loop in your build environment, flag that to the user early and stop.

## Judge

Judging should ideally be done by a fresh subagent with a clean context each time, to keep it objective and cheap.

The judge should be given the latest live screenshot, the concept image, and (from round 2 on) the previous round's screenshot and verdict, and this prompt:

> You are an art director reviewing a real-time render against its concept art. Compare the screenshot to the
> concept and score it 0-10 using this ladder. The ladder is gated: a frame cannot score above a tier's cap
> until every requirement of the tiers below it is fully met. Be strict about the gates.
>
> - **Tier 1, shape (0-3):** camera, framing, composition, and the position and rough scale of every major
>   object match the concept. This is about layout, not finish or precision: every major element is present,
>   in the right region of the frame (within about 10% of frame width/height), at roughly the right size
>   (within about 25%). An object the right place and vaguely correct outline passes, even if its edges
>   and surface are wrong. Don't be nitpicky about precision, save that for Tier 4. The goal is just to 
>   have the right elements present in roughly the right spot at this tier. Cap 3 until this is true.
> - **Tier 2, light and color (3-5):** key light direction and color, overall exposure (no clipping to black or white), shadow depth, palette, contrast, and atmosphere.
>   Pay attention to reflections, glows, etc, and ensure they look great.
>   Ensure the scene overall is not too bright or too dark relative to the concept.
>   Judge at the level of the whole frame, not individual tiny details; those are Tier 4 polish. Cap 5
>   until the overall lighting, reflections, color, and contrast is generally right.
> - **Tier 3, materials and surfaces (5-7):** every surface reads as the right material at a glance: 
>   Textures, roughness, translucency, wetness, reflections.
>   Ensure assets don't look obviously procedural, blocky, simple, smooth/plastic; push for elements that dominate the frame to be properly sculpted and detailed (Blender assets with high quality image-gen textures). Cap 7 until this is true.
> - **Tier 4, fine detail (7-9):** the small things: texture and fine detail. Nitpick relentlessly.
>   Look at every little object up close. Layout should align near-perfectly with the concept. Materials should look extremely convincing. Cap 9 until they are right.
> - **Tier 5, indistinguishable (9-10):** holds up side by side and zoomed in. Nitpick every pixel.
>
> If a previous verdict and screenshot are provided: you are one reviewer in a sequence, not the first.
> Maintain consistency. First go through the previous directives one by one and mark each LANDED, PARTIAL, or NOT DONE based on the new screenshot. Carry forward
> anything PARTIAL or NOT DONE. Do not reverse a prior directive unless the result is clearly worse than before,
> and if you do, say so explicitly and why.
>
> Output format:
> 1. The score on the first line, then "Tier N" on the second line: the highest tier whose gate is fully passed.
> 1b. If given a previous verdict: the LANDED / PARTIAL / NOT DONE list for its directives.
> 2. "Blocking:" the specific things that fail the gate of the *next* tier. These come first and the builder
>    must clear them before anything else counts. Name the element and say what to change, with magnitudes:
>    "Rocks: replace the stacked ovoid boulders with one continuous fractured slab; cracks 2-5cm wide, dark
>    interiors, add more texture to the surfaces so they don't look flat/plastic" not just "the rocks look artificial".
> 3. Then at most 4 further directives from higher tiers, same style, ordered by points recoverable.
>
> Don't give non-actionable feedback like "This element looks synthetic." Name the specific things causing that impression. Every directive must be something a developer can act on this round.
> Don't round up score: if a gate is not fully passed, the cap holds.

## Exit criteria

- **score >= 8 and target FPS acceptable**: done! Show the user the latest screenshot and ask if they want more iterations.
- **score >= 8 but target FPS unacceptable**: optimize, aiming for lossless wins first, then optimizations that have minimal visual impact. Re-judge after optimizations to ensure you didn't regress visuals.
- **Stall approaching**: the best score hasn't improved by a full point in 2 rounds, or the judge has named the same gap 3 times. Stop making incremental tweaks. Step back and assess the whole frame against the concept: what about the *approach* is capping the score? Then make a big, structural change in one round: swap the asset strategy (sculpt in Blender, pull real models/textures/HDRIs from an asset library), rewrite the lighting model, rebuild the composition, change the camera. Self-check the result before it goes to the judge, since big changes break things. Only do the same-old parameter tuning if you can articulate why it would move the score this time when it didn't last time. Do not tunnel vision on incremental wins when the judge is telling you that you're completely off base.
- **Stalled**: you've already tried at least one big structural change as above, and the best score still hasn't improved in 3 rounds, and the judge is either blocking you over extremely nitpicky things or asking for improvements that are intractable (e.g. it wants raytracing but you're on a cheap laptop with no GPU). Stop and tell the user why you think you're blocked, and give options for what to do next.
- **None of the above**: address all or most of the judge's heavy-hitting gaps in this round, not just the top one. Rounds are expensive; make each one count. Prioritize the gaps that move the needle most relative to the concept (often things like improving lighting, textures, or sculpting fine details on meshes). Only revert if the score dropped by a full point or more: small dips are judge noise, and reverting a whole round throws out the good changes with the bad. If a specific change clearly caused a regression, undo just that change. Loop back around.

## "Plus" Fallback Version

Dream Loop can have very high token cost. If the user is not on a high subscription tier (e.g. instead of on ChatGPT Pro, they're on ChatGPT Plus), the full loop will hit their limit very fast.

If the user does not specify that they want the default/"Pro" version of Dream Loop, you should check their subscription tier. If Plus, inform them that you are applying the Dream Loop Plus workflow instead of Pro to stay within their plan's token budget.

Then make these Plus workflow modifications:
- If you are a large, expensive model (e.g. Claude Fable, GPT-6 Astra), stop and ask the user to choose a smaller model to drive the loop (e.g. GPT-5.6 Luna on Max effort or Terra/Sol, or Claude Opus/Sonnet)
- You own the full loop execution and coordination. You need to generate assets, build all the functionality, and make it look good. However, once you believe you're at an acceptable level of polish, instead of going straight to the judge, use a very powerful subagent (e.g. Claude Fable, GPT-6 Astra on high effort) to do a big final polish pass. It should make the scene as beautiful and aligned to the concept as possible, across layout and composition, lighting, reflections, materials, textures (using image gen if needed), normal maps (image gen if needed), animations, shaders, player behavior. Only then do you send it to the judge.
- Do not build 3D assets yourself in Blender. Use the other options, in priority order. Do not compromise on visual quality because it's Plus mode, follow the decision tree, just skip Blender.
- After judge submissions, for any feedback that is straightforward, fix it yourself. Only bring up more Astra-tier subagents for feedback that asks for significant improvements to its aesthetic domain described above.
- Track quota % at start of loop, and monitor consumption. If approaching the 5h limit, or approaching 20% of weekly usage consumed by the loop, wrap up, get into as complete a state as possible, and end the loop ASAP.
- Use Astra (or equivalent) as the judge, on lowest reasoning settings

Important: Dream Loop Plus only means those modifications. It does not mean you take shortcuts or compromise on the result. Your goal remains to produce the most visually impressive result aligned to the concept, within the given constraints.

## How to get 3D Assets

Use custom models everywhere, and only optimize when needed, not prematurely. Only do procedural graphics when the concept art calls for it. Aim for the best visual result as your top priority. Optimize only when there's a problem.

To get 3D assets follow this decision tree:

### 1. Can you download an external asset?

The simplest approach is to download free open-license assets from online. However, only do this if the user has granted you permission explicitly.

If not permitted, or you can't find the model you need online, proceed to 2.

### 2. Use a 2D-to-3D model

The recommendation is to use fal.ai. Check your environment for a Fal API key. If present, use it.

You are allowed to do this by default. Even if the user says "don't download assets" - that refers to step 1, not this step. Only if the user tells you not to use Fal or 2D-to-3D models should you skip this step.

Assuming you find a fal.ai API key in your environment, find 2 models:
- A strong model (like tripo3d/h3.1/image-to-3d or newer equivalent) - around $0.30/asset. Use this for large assets or key, important ones like characters, buildings, scenery.
- A smaller model (like fal-ai/trellis or newer equivalent) - around $0.02/asset. Use this for tiles, rocks, other small environmental objects, fine details like leaves, etc.

Use these liberally. Don't resort to plain procedural assets. Those almost always look bad, unless the art style really leans into them.

To produce the 2D images for the assets, use your image gen tool. Pass the concept image into it and ask it to extract a clean image of just the target asset, then use that as the input for the 2D-to-3D model. This ensures it's perfectly aligned to the concept, not reimagined.

If explicitly told not to use Fal/2D-to-3D or you can't find a Fal API key to use, proceed to 3.

### 3. Model it in Blender

Blender is the next option if installed locally. You can use its Python scripting interface.

For complex assets, consider delegating to subagents. If the user allows the use of external assets, prefer that over modeling it yourself, unless the asset is simple. If not specified, assume you should not use external assets from the web. Do not be lazy and resort to simple shapes or procedural assets for key environmental details like scenery, flooring, buildings, etc. These will look blocky, shiny, flat, and fake. The tiny details and texturing matter and require custom sculpting.

If Blender is unavailable, or you are in Dream Loop Plus mode, proceed to 4.

### 4. Procedural

If all else fails OR the asset is truly, intentionally trivial, build it in code. If you are resorting to this because you have no other option, flag this clearly to the user and inform them that the results will be worse, and that they should install Blender or add a Fal API key for best results.

DO NOT just skip to 4 out of laziness or performance concerns. Follow the decision tree.

### Note on textures for 3D assets (in all of the above cases)

If you have an image generation tool, use it for textures, normal maps, skyboxes, etc, to enhance the visuals. This looks better and is faster than procedurally generated textures or normals. Do not settle for plain, flat, procedural looks unless the art style demands it. Textures and normals make things look realistic and impressive, do not neglect them.

## Follow-up loops

In cases where there is an existing product you are building on top of, or you have completed the above build process and the user invokes this skill again or asks for further refinements, you shouldn't create new concept art completely in a vacuum as this may diverge from what's there.

Instead, capture a live screenshot of the current product and prompt the image model to render the best possible version of this (e.g. current screenshot of game -> AAA graphics version of the same screenshot). Then use that as the target.

Note that you can also have multiple screenshots and multiple judge loops running in parallel if the user asks you to improve multiple screens at once. This will of course consume more tokens.