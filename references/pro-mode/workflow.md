# Dream Loop Pro Workflow

## Loop Structure

Prerequisites:
- The target image

The loop:
1. Take a first pass at implementing the target
2. Test and validate the product yourself and ensure it works and looks as you intend
3. Capture a screenshot of the product's current state
4. Submit the screenshot + target image to an independent judge subagent with a fresh context (see below for how to set up the judge).
5. Address all of the judge's feedback carefully
6. Test and validate the product yourself and ensure it works and looks as you intend
7. Evaluate exit criteria (below). If you should exit, stop here. If not, return to step 3 and loop again.

## 3D Assets

During implementation, you may need 3D assets. At such times, consult [references/pro-mode/assets-3d.md](assets-3d.md) to decide how to get them. Do not just make procedural assets out of laziness, read the doc and make the correct decision.

## Judge

Judging should ideally be done by a fresh subagent with a clean context each time, to keep it objective and cheap.

The judge should be given the latest live screenshot, the target image, the previous round's screenshot and verdict if any, and this prompt:

> You are judging how close the current product is relative to the target image. Score along this rubric:
>
> - **Composition (0-3):** Are the camera, framing, and layout correct? Are the position and scale of all major components correct compared to the target image?
> - **Lighting (0-3):** Check color palette, exposure, shadows, contrast, and atmosphere. Pay attention to reflections, glows, etc. Ensure the scene overall is not too dark or too light compared to the target.
> - **Materials (0-3):** Check that every surface looks right, with the expected textures, roughness, translucency, wetness, etc. Ensure assets don't look blocky, plasticky, smooth, or fake, unless the target image specifically also does this.
> - **Details (0-1):** Go through everything with a fine-toothed comb. Not a single pixel should be different. Every tiny speck and detail should match between the two images.
>
> You can give fractional scores. You should be nitpicky and precise, and include a list of all gaps and blockers that need to be resolved for a perfect score on each category. It's OK to output a gigantic list if the current product is nowhere close to the target. It needs to be comprehensive and actionable so that another agent could go fix everything on the list, come back, and get a substantially improved score. Avoid non-actionable feedback like "This tree looks fake." You need to name exactly what's giving that impression and how the agent should fix it.
> Everything is within reason. If models or scenes need to be completely redesigned, say so. Don't sugarcoat it. The goal is for both images to be identical. The product should exactly reach the target. Do not settle for less.
>
> You should lastly also provide a total score out of 10 by summing these up.
>
> If a previous verdict and screenshot are provided, maintain consistency with prior judgment, but do not feel obligated to match or increase score. If the product regressed, it should score worse.

## Exit criteria

- **score >= 8 and target FPS acceptable**: done! Show the user the latest screenshot and ask if they want more iterations.
- **score >= 8 but target FPS unacceptable**: optimize, aiming for lossless wins first, then optimizations that have minimal visual impact. Re-judge after optimizations to ensure you didn't regress visuals.
- **Stall approaching**: the best score hasn't improved by a full point in 2 rounds, or the judge has named the same gap 2 times in a row. Stop making incremental tweaks. Step back and rethink the entire approach and scene, and try to find architectural or big-picture reasons why you're not reaching the target image. It may be that assets are just not good enough, in completely wrong places, the lighting needs to be reworked entirely, the camera is totally wrongly positioned, or other such major issues. Do not make small changes, aim for a dramatic improvement.
- **Stalled**: you tried the **Stall approaching** large architectural change but it didn't work; the judge still gave the same score or worse. Don't waste tokens trying other dramatic changes. Stop and ask the user to weigh in on if the current state looks good enough or if something is significantly off compared to the target.
- **None of the above**: Continue looping. Do not exit.