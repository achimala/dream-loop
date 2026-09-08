---
name: dream-loop
description: Build a game or app from a description so that a live screenshot matches a generated rendering. Use when the user says "dream loop" or asks for something built to a very high level of graphical fidelity.
license: MIT
---

# dream-loop

This is a process for you to autonomously build extremely impressive visuals, especially for 3D scenes (e.g. in a game or app). Your goal is to produce the most visually stunning result while hitting acceptable frame rate for the target platform (e.g. 60 fps for a browser game, 120 fps for modern mobile devices).

## References

Read references only at the indicated step; do not preload all references.

## The target concept

If the user provided you a target, such as a description of a game, scene, or app, you're good to go. Don't ask for clarification unless it's so vague that you don't think you can generate concept art for it.

If they did not provide this, ask for it.

Put working context/files in `.dream-loop` and gitignore this file (unless told otherwise by the user).

## "Plus" Fallback Version

Dream Loop can have very high token cost. If the user is not on a high subscription tier (e.g. instead of on ChatGPT Pro, they're on ChatGPT Plus), the full loop will hit their limit very fast.

If the user does not specify that they want the default/"Pro" version of Dream Loop, you should check their subscription tier. If Plus, inform them that you are applying the Dream Loop Plus workflow instead of Pro to stay within their plan's token budget.

If applying Plus mode, read [references/plus-mode.md](references/plus-mode.md) before starting the build loop.

## Concept art

Before creating or revising concept art, read [references/concept.md](references/concept.md). This also covers follow-up loops for an existing product.

## Time budget

If the user gives a time budget, record the start time and check the clock between rounds. Don't degrade visual fidelity to hit the time budget, strive for the absolute best result. Don't rush work to the judge. Consider what you can do to parallelize or distribute work to hit the time goal, but don't take shortcuts - it's better to hit the time limit with meaningful, beautiful progress than to hit it with something broadly complete but ugly.

If the user doesn't give a time budget, run until you hit an exit criterion, but warn upfront that this is the case and may consume a lot of tokens.

## How to get 3D Assets

Before implementing any 3D scene, read [references/assets-3d.md](references/assets-3d.md) and resolve the asset source. Check for Fal credentials without exposing their values. If credentials are available and generation is permitted, generate and load one representative nontrivial asset through Fal before building the remaining scene. Record the selected source and any observed blocker in `.dream-loop`. Plus mode skips Blender; it does not skip Fal. Do not substitute procedural assets merely to save time or tokens. If Fal generation is blocked, stop and report the evidence; do not automatically replace nontrivial assets with procedural geometry.

## Build loop

First, look at the concept art and do your best to implement it in one go, and make that first pass count across every tier of the score ladder. Try to nail the composition, textures, lighting, details. Sculpt and model assets carefully or use external ones if allowed for great detail, don't just settle for basic procedural elements and flat surfaces unless the art style calls for it.

Write intermediate files/plans to `.dream-loop` to keep yourself on track.

When you've done everything you think is needed to achieve the target (i.e. built the product fully to the user's specifications and the standard set by the concept art), you'll submit a screenshot to the judge for review (see next section for details).

Important: Before submitting to the judge, each time, review the candidate screenshot yourself and ensure it actually achieves the goals. Do not submit half-baked work to the judge. Step back, look at the screenshot and concept side-by-side, and log an hoenst assessment of whether it is or is not judge-ready. Only submit if you are confident you have significantly improved the score. You must be rigorous, objective, and transparent in this self-assessment; look at every pixel and detail. Even small touches make a big difference. Look for big stuff like missing or incorrect objects, wrong scale, perspective, or positioning. Look for small stuff like rendering glitches, flat untextured surfaces, ugly lighting (overly bright or dark), poor contrast (washed out, or overly dark, or desaturated colors), speckles, ugly shadows, etc. Scan through surface by surface, object by object, audit everything and list them out.

When submitting a screenshot to the judge, target the same resolution and aspect ratio as the concept art, so the comparison is fair.

When ready, use a subagent for the judge (see below). This presupposes that you have a subagent tool or capability built into your harness. If your harness doesn't support that, consider if it is possible to do via CLI (e.g. invoke a recursive instance of your harness). Otherwise, fall back to doing the judgment yourself (but note to the user that this is happening, and that results may be degraded or costs inflated).

If you don't think you have the tools needed to execute this full loop in your build environment, flag that to the user early and stop.

## Judge

When invoking the judge, give it [references/judge.md](references/judge.md) and the inputs specified there. Read that reference when preparing the submission or judging yourself.

## Exit criteria

- **score >= 8 and target FPS acceptable**: done! Show the user the latest screenshot and ask if they want more iterations.
- **score >= 8 but target FPS unacceptable**: optimize, aiming for lossless wins first, then optimizations that have minimal visual impact. Re-judge after optimizations to ensure you didn't regress visuals.
- **Stall approaching**: the best score hasn't improved by a full point in 2 rounds, or the judge has named the same gap 3 times. Stop making incremental tweaks. Step back and assess the whole frame against the concept: what about the *approach* is capping the score? Then make a big, structural change in one round: swap the asset strategy (sculpt in Blender, pull real models/textures/HDRIs from an asset library), rewrite the lighting model, rebuild the composition, change the camera. Self-check the result before it goes to the judge, since big changes break things. Only do the same-old parameter tuning if you can articulate why it would move the score this time when it didn't last time. Do not tunnel vision on incremental wins when the judge is telling you that you're completely off base.
- **Stalled**: you've already tried at least one big structural change as above, and the best score still hasn't improved in 3 rounds, and the judge is either blocking you over extremely nitpicky things or asking for improvements that are intractable (e.g. it wants raytracing but you're on a cheap laptop with no GPU). Stop and tell the user why you think you're blocked, and give options for what to do next.
- **None of the above**: address all or most of the judge's heavy-hitting gaps in this round, not just the top one. Rounds are expensive; make each one count. Prioritize the gaps that move the needle most relative to the concept (often things like improving lighting, textures, or sculpting fine details on meshes). Only revert if the score dropped by a full point or more: small dips are judge noise, and reverting a whole round throws out the good changes with the bad. If a specific change clearly caused a regression, undo just that change. Loop back around.
