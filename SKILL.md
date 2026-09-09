---
name: dream-loop
description: Build a game or app from a description so that a live screenshot matches a generated rendering. Use when the user says "dream loop" or asks for something built to a very high level of graphical fidelity.
license: MIT
---

# dream-loop

This is a process for you to autonomously build extremely impressive visuals, especially for 3D scenes (e.g. in a game or app). Your goal is to produce the most visually stunning result while hitting acceptable frame rate for the target platform (e.g. 60 fps for a browser game, 120 fps for modern mobile devices).

Own the complete visual environment: its spatial structure, surface variation, surrounding visual mass, and depth must support the focal subjects. Infer the needed coverage and level of detail from the concept and the user's camera controls. A collection of finished hero assets does not establish that the environment is complete.

## References

Read references only at the indicated step; do not preload all references.

## The target concept

If the user supplies a concept image or names an existing image file, open that exact image and use it as the target. Copy it unchanged to `.dream-loop/concept.png` and record its source path and dimensions. Do not generate a replacement concept or reinterpret a fresh build as permission to change the target. Derived asset images must preserve this target’s design.

If the user provided you a target, such as a description of a game, scene, or app, you're good to go. Don't ask for clarification unless it's so vague that you don't think you can generate concept art for it.

If they did not provide this, ask for it.

Put working context/files in `.dream-loop` and gitignore this file (unless told otherwise by the user).

## "Dream Loop Plus" Mode

The original Dream Loop (or "Dream Loop Pro") is designed for high-tier subscriptions like ChatGPT Pro. If the user is on a lower tier (e.g. ChatGPT Plus), you should instead use the configuraiton described in [references/plus-mode.md](references/plus-mode.md).

If the user does not specify which Dream Loop mode to use, you must first infer it by checking their subscription tier, then inform them of which mode you're using before proceeding.

This does not change your goal, which is to produce the most impressive and complete visual result possible. It only changes the workflow you follow. Do not make your own modifications or optimizations, stick to the workflow.

## Concept art

Before creating or revising concept art, read [references/concept.md](references/concept.md). This also covers follow-up loops for an existing product.

## Time budget

If the user gives a time budget, record the time at start of the loop (after locking the concept art), and check the clock between rounds.

Don't degrade visual fidelity to hit the time budget, strive for the absolute best result. Don't rush work to the judge. Parallelize or distribute work to be time-efficient, but don't take shortcuts - it's better to hit the time limit with meaningful, beautiful progress than with something roughly complete but ugly.

If the user doesn't give a time budget, run until you hit an exit criterion, but warn upfront that this may consume a lot of tokens and advise setting a quota or time budget.

## How to get 3D Assets

Before implementing any 3D scene, read [references/assets-3d.md](references/assets-3d.md). Plan the complete visible asset kit from the concept, generate independent assets in parallel, and resolve every required model and texture before composing the scene. Record asset jobs, local files, validation, and blockers in `.dream-loop/assets.json`. A submitted job or one successful asset does not pass this gate. Do not add procedural fallbacks, follow the linked doc.

The loop is: **plan assets → generate in parallel → validate assets → compose → polish → judge → repeat**. If feedback requires new or replacement assets, return to asset resolution before revising that part of the scene.

## Compose and self-review

Do not read composition instructions or write scene-composition code while assets are unresolved. Finish the asset phase, including live asset previews and a manifest with passed validation for every required asset. Then read [references/compose.md](references/compose.md), compose the scene, and perform the selected mode's polish pass.

## Judge

When invoking the judge, give it [references/judge.md](references/judge.md) and the inputs specified there. Read that reference when preparing the submission or judging yourself.

## Exit criteria

- **score >= 8 and target FPS acceptable**: done! Show the user the latest screenshot and ask if they want more iterations.
- **score >= 8 but target FPS unacceptable**: optimize, aiming for lossless wins first, then optimizations that have minimal visual impact. Re-judge after optimizations to ensure you didn't regress visuals.
- **Stall approaching**: the best score hasn't improved by a full point in 2 rounds, or the judge has named the same gap 3 times. Stop making incremental tweaks. Step back and assess the whole frame against the concept: what about the *approach* is capping the score? Then make a big, structural change in one round: swap the asset strategy (regenerate the failing assets, or use another asset source permitted by the selected mode and user), rewrite the lighting model, rebuild the composition, change the camera. Self-check the result before it goes to the judge, since big changes break things. Only do the same-old parameter tuning if you can articulate why it would move the score this time when it didn't last time. Do not tunnel vision on incremental wins when the judge is telling you that you're completely off base.
- **Stalled**: you've already tried at least one big structural change as above, and the best score still hasn't improved in 3 rounds, and the judge is either blocking you over extremely nitpicky things or asking for improvements that are intractable (e.g. it wants raytracing but you're on a cheap laptop with no GPU). Stop and tell the user why you think you're blocked, and give options for what to do next.
- **None of the above**: address all or most of the judge's heavy-hitting gaps in this round, not just the top one. Rounds are expensive; make each one count. Prioritize the gaps that move the needle most relative to the concept (often things like improving lighting, textures, or sculpting fine details on meshes). Only revert if the score dropped by a full point or more: small dips are judge noise, and reverting a whole round throws out the good changes with the bad. If a specific change clearly caused a regression, undo just that change. Loop back around.
