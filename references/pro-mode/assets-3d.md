## How to get 3D Assets

Work through these steps one by one, top to bottom, to determine how to source assets. Do not assume procedural assets are sufficient or take shortcuts because of time/quota pressure or your best judgment.

### 1. Can you download an external asset?

If the user has allowed it, you can download free assets from the internet. If unspecified, assume this isn't allowed.

If unallowed or you can't find the model you need, move on to 2.

### 2. Use an image-to-3D model

The recommendation is fal.ai. Check your environment for a Fal API key. If present, use it.

For Fal requests, read [fal.md](fal.md) and use the bundled batch helper. Use Fal’s HTTP API or SDK through the shell. Only report Fal as unavailable after an actual request fails and reasonable recovery fails, or credentials/access are absent.

This does not count as "downloading assets". You are allowed to do this, even if the user says not to download internet assets (that refers to 1 above, not this).

Start with the two verified endpoint/input recipes in [fal.md](fal.md), using its offline check and batch commands. The default model roles are:
- A strong model (like tripo3d/h3.1/image-to-3d or newer equivalent) - around $0.30/asset. Use this for large assets or key, important ones like characters, buildings, scenery, greenery.
- A smaller model (like fal-ai/trellis or newer equivalent) - around $0.02/asset. Use this for things like small environmental/decorative objects, etc.

Use these for any major assets. For things like rocks, tiles, etc., you'll need some judgment. If it is detailed, image-to-3D is a good fit. If not, subsequent steps may be better. Depending on the target image you'll need to make a call.

To produce the input images for the assets, use your image gen tool. Pass the target image into it and ask it to extract a clean image of just the target asset over a solid or transparent background, then use that as the input for the image-to-3D model. This ensures it's perfectly aligned to the target image, not reimagined.

If image-to-3D is blocked, disallowed, or overkill, move on to 3.

### 3. Model it in Blender

Blender is the next option if installed locally. You can use its Python scripting interface.

You'll need to texture and add additional detail (e.g. normal maps) via image generation.

If Blender is unavailable or overkill, move on to 4.

### 4. Procedural assets

Build the asset in code and use image generation for texturing, normals, etc.

Don't do this to save time or reduce complexity. Do it only because it is either the only remaining option, or because it truly is the option that produces the best-looking result that's most closely aligned to the target image.

### Note on textures for 3D assets (in all of the above cases)

If you have an image generation tool, use it for textures, normal maps, skyboxes, etc, to enhance the visuals. This looks better and is faster than procedurally generated textures or normals. Do not replace missing generated textures with procedural noise or flat-color substitutes. Textures and normals make things look realistic and impressive, do not skip them.
