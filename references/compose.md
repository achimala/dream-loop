## Compose and self-review

After the asset-readiness gate passes, look at the concept art and do your best to compose and implement it in one go, and make that first pass count across every tier of the score ladder. Try to nail the composition, textures, lighting, details. Use the validated asset kit for all visible models and surfaces. Code may assemble and instance assets, drive controls and animation, and render lighting, water, particles, or other effects; it must not substitute procedural models or textures for unresolved assets.

Write intermediate files/plans to `.dream-loop` to keep yourself on track.

Before placement, note the major objects' approximate centers and footprints in the target image. Use those image-space landmarks to check camera angle, framing, scale, and occlusion in the first live capture. Correct large layout errors before polishing materials; plausible world-space coordinates alone do not establish a match.

Also inspect the spaces around those landmarks: does the environment have the target's surrounding mass, surface variation, and depth across the frame? Exercise the permitted camera movement to catch exposed backdrop edges and empty surroundings. Reopen asset resolution when the available kit cannot supply that coverage; camera cropping, repeated hero props, and lighting cannot be assumed to solve a missing environment.

Establish whole-frame lighting before adding bloom and other finishing effects. Compare the target's shadow readability, light-source hierarchy, and reflection coverage across the main surfaces. If tuning emission repeatedly trades blown-out highlights for crushed shadows, revise the material or lighting setup instead of continuing intensity adjustments. Return to asset resolution when baked lighting or missing surface maps cause the mismatch.

When you've done everything you think is needed to achieve the target (i.e. built the product fully to the user's specifications and the standard set by the concept art), you'll submit a screenshot to the judge for review (see [judge.md](judge.md) for details).

Important: Before submitting to the judge, each time, review the candidate screenshot yourself and ensure it actually achieves the goals. Do not submit half-baked work to the judge. Step back, look at the screenshot and concept side-by-side, and log an honest assessment of whether it is or is not judge-ready. Only submit if you are confident you have significantly improved the score. You must be rigorous, objective, and transparent in this self-assessment; look at every pixel and detail. Even small touches make a big difference. Look for big stuff like missing or incorrect objects, wrong scale, perspective, or positioning. Look for small stuff like rendering glitches, flat untextured surfaces, ugly lighting (overly bright or dark), poor contrast (washed out, or overly dark, or desaturated colors), speckles, ugly shadows, etc. Scan through surface by surface, object by object, audit everything and list them out.

When submitting a screenshot to the judge, target the same resolution and aspect ratio as the concept art, so the comparison is fair.

Measure FPS and capture the judged frame with the same rendering settings. Do not enable capture-only quality or measure performance at a lower render scale than the judged frame. Recheck both after changing resolution, shadows, effects, or asset detail.

When ready, use a subagent for the judge (see [judge.md](judge.md)). This presupposes that you have a subagent tool or capability built into your harness. If your harness doesn't support that, consider if it is possible to do via CLI (e.g. invoke a recursive instance of your harness). Otherwise, fall back to doing the judgment yourself (but note to the user that this is happening, and that results may be degraded or costs inflated).

If you don't think you have the tools needed to execute this full loop in your build environment, flag that to the user early and stop.
