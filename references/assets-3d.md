## How to get 3D Assets

Use custom models everywhere, and only optimize when needed, not prematurely. Only do procedural graphics when the concept art calls for it. Aim for the best visual result as your top priority. Optimize only when there's a problem.

To get 3D assets, follow this decision tree strictly, top to bottom. Run through this before even starting the Dream Loop and validate the requirements. DO NOT jump to procedural assets. DO NOT make your own decisions based on time, quota, etc. Follow this tree so assets are consistent and the highest quality possible.

### 1. Can you download an external asset?

The simplest approach is to download free open-license assets from online. However, only do this if the user has granted you permission explicitly.

If not permitted, or you can't find the model you need online, proceed to 2.

### 2. Use a 2D-to-3D model

The recommendation is to use fal.ai. Check your environment for a Fal API key. If present, use it.

A missing dedicated Fal tool or Blender integration is not a blocker. Use Fal’s HTTP API or SDK through the shell. Only report Fal as unavailable after an actual request fails and reasonable recovery fails, or credentials/access are absent. If generation is blocked, stop and report the evidence; do not automatically replace nontrivial assets with procedural geometry.

You are allowed to do this by default. Even if the user says "don't download assets" - that refers to step 1, not this step. Only if the user tells you not to use Fal or 2D-to-3D models should you skip this step.

Assuming you find a fal.ai API key in your environment, find 2 models:
- A strong model (like tripo3d/h3.1/image-to-3d or newer equivalent) - around $0.30/asset. Use this for large assets or key, important ones like characters, buildings, scenery.
- A smaller model (like fal-ai/trellis or newer equivalent) - around $0.02/asset. Use this for tiles, rocks, other small environmental objects, fine details like leaves, etc.

Use these liberally. Don't resort to plain procedural assets. Those almost always look bad, unless the art style really leans into them.

To produce the 2D images for the assets, use your image gen tool. Pass the concept image into it and ask it to extract a clean image of just the target asset over a solid or transparent background, then use that as the input for the 2D-to-3D model. This ensures it's perfectly aligned to the concept, not reimagined.

If explicitly told not to use Fal/2D-to-3D, proceed to 3. If credentials or access are absent, stop and report that blocker before proceeding with an alternative.

### 3. Model it in Blender

Blender is the next option if installed locally. You can use its Python scripting interface.

For complex assets, consider delegating to subagents. If the user allows the use of external assets, prefer that over modeling it yourself, unless the asset is simple. If not specified, assume you should not use external assets from the web. Do not be lazy and resort to simple shapes or procedural assets for key environmental details like scenery, flooring, buildings, etc. These will look blocky, shiny, flat, and fake. The tiny details and texturing matter and require custom sculpting.

If Blender is unavailable, or you are in Dream Loop Plus mode, proceed to 4.

### 4. Procedural

If all else fails OR the asset is truly, intentionally trivial, build it in code. If you are resorting to this because you have no other option, flag this clearly to the user and inform them that the results will be worse, and that they should install Blender or add a Fal API key for best results.

DO NOT just skip to 4 out of laziness or performance concerns. Follow the decision tree.

### Note on textures for 3D assets (in all of the above cases)

If you have an image generation tool, use it for textures, normal maps, skyboxes, etc, to enhance the visuals. This looks better and is faster than procedurally generated textures or normals. Do not settle for plain, flat, procedural looks unless the art style demands it. Textures and normals make things look realistic and impressive, do not neglect them.
