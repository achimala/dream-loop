## Concept art

The concept is a realistic, high-quality, impressive target: the look of a current AAA game running in real time. Physically plausible materials (wet stone, brushed metal, cloth, glass) with real roughness and normal detail, correct proportions, atmosphere (fog, haze, rain, dust, volumetric light), cinematic lighting with a clear key and rich shadows. It should NOT be stylized or an artistic rendition, it should look like a true screenshot of the ideal result.

Ensure you avoid these failure modes when generating concept art with an image gen model:

- **Overbaked**: photographic clutter, film grain, hundreds of unique small objects, excessive detail on every surface that starts to look like noise. A real-time build with modeled assets won't match this, and it won't even look good to the user if it's so over-detailed.

- **Oversimplified**: cartoon or toy look, flat shading, blobby primitive shapes, empty surfaces. This is boring and will not impress the user.

Aim for the middle ground: Beautiful surfaces and materials that shaders render well, strong atmosphere and lighting, visually interesting color palette, and focused hero elements with fine details that enhance the look and draw the eye (not every element filled with detail fighting for attention).

Prompt the image model for "in-engine screenshot" more than "concept art" and discourage the noisy or grainy look. Review the image carefully, and if it hits one of the failure modes, feed the image back to the model and ask it to fix the issue. Save it as `.dream-loop/concept.png`.

If you don't have an image-generation tool, stop and ask the user for a concept image, or ask them to connect you to an image generation API.

If you generated the art (it wasn't given by the user), you should pause and confirm that it matches the user's vision before kicking off the build loop.

## Follow-up loops

In cases where there is an existing product you are building on top of, or you have completed the above build process and the user invokes this skill again or asks for further refinements, you shouldn't create new concept art completely in a vacuum as this may diverge from what's there.

Instead, capture a live screenshot of the current product and prompt the image model to render the best possible version of this (e.g. current screenshot of game -> AAA graphics version of the same screenshot). Then use that as the target.

Note that you can also have multiple screenshots and multiple judge loops running in parallel if the user asks you to improve multiple screens at once. This will of course consume more tokens.