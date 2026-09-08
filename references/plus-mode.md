## "Plus" Fallback Version

Make these workflow modifications for Plus mode:
- If you are a large, expensive model (e.g. Claude Fable, GPT-6 Astra), stop and ask the user to choose a smaller model to drive the loop (e.g. GPT-5.6 Luna on Max effort or Terra/Sol, or Claude Opus/Sonnet)
- You own the full loop execution and coordination. You need to generate assets, build all the functionality, and make it look good. However, once you believe you're at an acceptable level of polish, instead of going straight to the judge, use a very powerful subagent (e.g. Claude Fable, GPT-6 Astra on high effort) to do a big final polish pass. It should make the scene as beautiful and aligned to the concept as possible, across layout and composition, lighting, reflections, materials, textures (using image gen if needed), normal maps (image gen if needed), animations, shaders, player behavior. Only then do you send it to the judge.
- Do not build 3D assets in Blender. Use the other options, in priority order. Do not compromise on visual quality because it's Plus mode. Before implementing any 3D scene, read [assets-3d.md](assets-3d.md) and follow its decision tree strictly. Plus mode skips Blender; it does not skip Fal.
- After judge submissions, for any feedback that is straightforward, fix it yourself. Only bring up more Astra-tier subagents for feedback that asks for significant improvements to its aesthetic domain described above.
- Track quota % at start of loop, and monitor consumption. If approaching the 5h limit, or approaching 20% of weekly usage consumed by the loop, wrap up, get into as complete a state as possible, and end the loop ASAP.
- Use Astra (or equivalent) as the judge, on lowest reasoning settings

Important: Dream Loop Plus only means those modifications. It does not mean you take shortcuts or compromise on the result. Your goal remains to produce the most visually impressive result aligned to the concept, within the given constraints.
