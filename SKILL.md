---
name: dream-loop
description: Build a game or app from a description so that a live screenshot matches a generated rendering. Use when the user says "dream loop" or asks for something built to a very high level of graphical fidelity.
license: MIT
---

# dream-loop

This is a process for you to autonomously build extremely impressive visuals, especially for 3D scenes (e.g. in a game or app).

Your first step is to determine which workflow to use:
- If the user told you to use the Plus or Pro workflow explicitly, that's your answer
- If not, check if the user is on a low or high tier coding subscription. "Low tier" means ChatGPT Plus or equivalent. "High tier" means ChatGPT Pro. For low-tier subscriptions, use the Plus workflow. For high-tier, use the Pro workflow.

Plus workflow: read [references/plus-mode/workflow.md](references/plus-mode/workflow.md)

Pro workflow: read [references/pro-mode/workflow.md](references/pro-mode/workflow.md)

Do not read both documents. They are not inter-compatible.

# Guidance applicable to both workflows

## General

Create and use a `.dream-loop` folder for working context/files, and gitignore it.

## The target image

The key piece of Dream Loop is to first create the "dream version" of the user request using image generation, then iterate to build it.

If the user supplies this, use that directly.
If not, you need to generate it.

If you don't have an image generation tool, stop and ask the user to either provide the target image, or connect you to an image generation API.

Before generating the image, determine if there is an existing product or if you're starting fresh. If fresh, you can directly generate a new image. If there's an existing product, you should capture a screenshot of the current version of it, then use that as the baseline input to the image model and generate a refined version of it based on the user direction, so that it is an improvement over the original and not a divergence.

When generating images, avoid using words like "concept art" in the prompt. This is not an artist's interpretation. It is meant to be an exact, realistic target screenshot. You will try to match it down to the pixel. For example, if the user is asking you to make a game, you should prompt the image model for a real in-engine screenshot of the target. Not a cinematic shot, photo, painting, artist concept, etc.

Store the image in `.dream-loop/target.png`.

## Time budget

If the user gives a time budget, record the time at start of the loop (after locking target.png), and check the clock between rounds.

Don't degrade visual fidelity to hit the time budget. Don't take shortcuts. It's better to hit the time limit with meaningful, beautiful progress than with something roughly complete but ugly.

If the user doesn't give a time budget, run until you hit an exit criterion, but warn that this may consume a lot of tokens.

