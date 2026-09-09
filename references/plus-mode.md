## "Dream Loop Plus" Mode

Important: Dream Loop Plus only means the modifications described in this document. It does not mean you take shortcuts or compromise on the result. Your goal remains to produce the most visually impressive result aligned to the concept, not to prematurely optimize on your own.

Make these workflow modifications for Plus mode:
- The outer loop should be run by a small, efficient model (e.g. GPT-5.6 Luna xhigh or Terra/Sol, Claude Opus/Sonnet). Use this same model for subagents. If you are a large, expensive model (Astra/Fable-tier) being told to run the loop, stop and ask the user to choose the smaller coordinator, and only proceed if they insist.
- You own the full loop execution and coordination: plan the asset kit, generate independent assets in parallel, resolve and validate the complete kit, then compose the scene and implement its functionality. Your first goal is to pass Tiers 1 and 2 on your own. You only invoke an Astra-tier model for judging and feedback against the concept. All implementation is done by you or subagents using your model.
- After passing the Astra Enablement Gate below, to work on the remaining rubric tiers, start involving a single powerful subagent (e.g. GPT-6 Astra on high effort), for visual completion only. Give it the concept, current live screenshot, asset manifest, and unresolved gaps from the judge. Tell it to overhaul everything as needed to reach the concept, including environmental coverage and depth, layout, lighting, reflections, materials, textures, animation, rigging, HUD elements, and player behaviors. It may generate missing or replacement assets through the approved pipeline. Review the completed live screenshot before submitting to the final judge.
- Do not build 3D assets in Blender. Use the other options, in priority order. Do not compromise on visual quality just because it's Plus mode. Before implementing any 3D scene, read [assets-3d.md](assets-3d.md) and follow its decision tree strictly. Plus mode skips Blender; it does not skip Fal.
- After judge submissions, if Tier <= 2, address the feedback yourself. If Tier > 2, but the feedback is structural and not aesthetic (e.g. moving elements around, adjusting camera position), do it yourself. If the feedback is aesthetic (lighting, materials, model quality, etc), ask an Astra-tier subagent to address it.
- Track quota % at start of loop, and monitor consumption. If approaching the 5h limit, or approaching 20% of weekly usage consumed by the loop, wrap up, get into as complete a state as possible, and end the loop.
- Use an Astra-tier model on lowest reasoning as the judge subagent, in all cases.

## Astra Enablement Gate

You, the smaller builder, are responsible for getting the project in a good state before looping in the Astra-tier model for polish. You must build it out and achieve a score beyond Tier 2 on your own, first, using the Dream Loop judge flow.

ONLY after you have a score > Tier 2, you are allowed to use Astra-tier subagents to help address judge feedback, as described above.

This does not apply to the judge. The judge is always an Astra-tier model.