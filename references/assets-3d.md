## How to get 3D Assets

## Plan and resolve the asset kit

Before writing code, you need to plan out the asset requirements. Review the concept carefully and list everything needed: hero objects, characters, architecture, environmental elements, ground/wall surfaces, vegetation, background and ambient elements, etc. Include rough bounds. Go deep - even small details or one-off decorative elements should be modeled. For repetitive elements (like flooring or walls), the correct choice is to model individual components (a few bricks, tiles, etc) and then instance them and compose them together to build the element. For something like one detailed broken-down wall, however, a better choice would be to model the whole thing as one asset because it will be difficult to programmatically lay out individual bricks/tiles and match that look exactly. Use best judgment - err on the side of larger complete assets where the holistic look of the object is important, and on the side of small repetitive component pieces when the object has unclear bounds and is expansive or prevalent through the scene.

You need to account for the full scene including foreground and background elements and what's potentially offscreen. Do not overfit to the concept and model precisely what's in view and nothing else. You absolutely must not place 2D textures in front of the camera to try to trick the judge, while ignoring everything around it. When the user pans the camera around the scene should be reasonably complete. Distant regions, sky, etc, can use backdrops, layered images, instanced modules, or reduced-detail silhouttes depending on the concept. But foreground elements should be crisp and detailed as per the concept art.

For EACH asset identified, work through the decision workflow steps below ("Asset sources") and note its source. Do not make assumptions, use the workflow only.

Before the first generation request, record the plan in `.dream-loop/assets.json` with one entry per required asset: role, source, dependencies, generation status/request ID, local model and texture paths, and validation result. Update these entries after each submission, completion, and validation; a coverage list with an empty asset inventory is not a production plan. Use the source selection below for each required asset.

Start independent image-generation and 3D-generation jobs concurrently for speed. Use subagents or concurrent tool calls for independent asset work; do not serialize the entire kit behind the first asset. Save job IDs and resume polling existing jobs; avoid duplication.

Batch ready independent image calls through the harness's concurrent tool orchestration. A loop that awaits each image call before starting the next is serial; declaring jobs independent in a plan does not parallelize them. Dependent map generation may wait for its albedo source, then start the ready maps together.

While jobs run, prepare dependencies and a standalone asset viewer. Preview completed assets while other jobs finish. Do not write the product scene, placement code, controls, or placeholder geometry during this phase; those belong to composition after the kit is ready.

If the browser tool displays screenshots but cannot save them, the bundled [preview-server.py](../scripts/preview-server.py) can serve the workspace and save canvas captures locally. Run it with `--directory /path/to/workspace --port PORT`; a development viewer's capture control can send its rendered canvas PNG to `POST /__capture`. With WebGL's default cleared drawing buffer, render immediately before calling `canvas.toBlob` in the same callback. Captures are saved in `.dream-loop/captures/`. Native live inspection is valid evidence even without an exported file; do not spend the asset phase troubleshooting screenshot export.

## Asset phase handoff

Finish with a manifest listing every required asset, its local files, and its successful live-preview evidence. Include the preview's orientation, grounding/scale transforms, material mappings, and runtime overrides so the composer can reproduce the validated appearance. Unresolved or unpreviewed assets block the handoff. When working as an asset worker, return this kit to the coordinator and stop; do not start scene composition. The coordinator checks the handoff against the original concept regions before starting composition. When delegating, use a fresh coverage reviewer to compare the target with the actual kit previews; it should look for missing independently placed objects and material mismatches, not merely verify that the inventory's existing entries say “passed.” Resolve its concrete gaps during the asset phase.

## Asset sources

Work through these steps one by one, top to bottom, to determine how to source assets. Do not skip this. You need to follow this progression. Do not assume procedural assets are sufficient or take shortcuts because of time/quota pressure or your best judgment. Follow the rules exactly:

### 1. Can you download an external asset?

The simplest approach is to download free open-license assets from online. However, only do this if the user has granted you permission explicitly.

If not permitted, or you can't find the model you need online, proceed to 2.

### 2. Use a 2D-to-3D model

The recommendation is to use fal.ai. Check your environment for a Fal API key. If present, use it.

For Fal requests, read [fal.md](fal.md) and use the bundled batch helper. A missing dedicated Fal tool or Blender integration is not a blocker. Use Fal’s HTTP API or SDK through the shell. Only report Fal as unavailable after an actual request fails and reasonable recovery fails, or credentials/access are absent. If generation is blocked, stop and report the evidence; do not automatically replace nontrivial assets with procedural geometry.

You are allowed to do this by default. Even if the user says "don't download assets" - that refers to step 1, not this step. Only if the user tells you not to use Fal or not use image-to-3D models should you skip this step.

Start with the two verified endpoint/input recipes in [fal.md](fal.md), using its offline check and batch commands. This supplies the integration bootstrap; do not rediscover it for each run or worker. The default model roles are:
- A strong model (like tripo3d/h3.1/image-to-3d or newer equivalent) - around $0.30/asset. Use this for large assets or key, important ones like characters, buildings, scenery.
- A smaller model (like fal-ai/trellis or newer equivalent) - around $0.02/asset. Use this for tiles, rocks, other small environmental objects, fine details like leaves, etc.

Use these liberally. Don't resort to plain procedural assets. Those almost always look bad, unless the art style really leans into them.

To produce the input images for the assets, use your image gen tool. Pass the concept image into it and ask it to extract a clean image of just the target asset over a solid or transparent background, then use that as the input for the image-to-3D model. This ensures it's perfectly aligned to the concept, not reimagined.

If explicitly told not to use Fal/image-to-3D, proceed to 3 where the selected mode permits it. If credentials or access are absent, stop and report that blocker before proceeding with an alternative.

### 3. Model it in Blender

Blender is the next option if installed locally. You can use its Python scripting interface.

For complex assets, consider delegating to subagents. If the user allows the use of external assets, prefer that over modeling it yourself, unless the asset is simple. If not specified, assume you should not use external assets from the web. Do not be lazy and resort to simple shapes or procedural assets for key environmental details like scenery, flooring, buildings, etc. These will look blocky, shiny, flat, and fake. The tiny details and texturing matter and require custom sculpting.

Only if Blender is unavailable, or you are in Dream Loop Plus mode, proceed to 4.

### 4. Procedural assets

There are exactly 2 situations in which you are allowed to create assets procedurally in code, and only 2:
1. You worked through 1-3 above and all three were hard blocked
2. The concept EXACTLY calls for a procedural asset. It features something OBVIOUSLY procedural where 1-3 are overkill, like primitive shapes.

You CANNOT skip 1-3 and just use procedural assets because you think it is best for performance, time limits, quota limits, etc. This will look bad and defeat your goal of producing the best visual result. DO NOT trust your judgment on this, trust the above workflow.

### Note on textures for 3D assets (in all of the above cases)

If you have an image generation tool, use it for textures, normal maps, skyboxes, etc, to enhance the visuals. This looks better and is faster than procedurally generated textures or normals. Do not replace missing generated textures with procedural noise or flat-color substitutes. Textures and normals make things look realistic and impressive, do not skip them.
