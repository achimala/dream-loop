# Dream Loop Plus Workflow

## Note on orchestrator model

This workflow is designed not to be run by very large models like GPT-6 Astra or Claude Fable. If you are such a model, stop, and ask the user to switch to a smaller model (e.g. GPT-5.6 Luna on xhigh reasoning, or Claude Sonnet/Opus). Only proceed if they insist.

## Loop Structure

Prerequisites:
- The target image

Your job is NOT to build the product yourself. Your job is to orchestrate more powerful subagents to build it for you.

Subagent configuration:
- Create subagents with the strongest available model at the lowest available reasoning. For example, GPT-6 Astra at Light effort
- Always give subagents a fresh, empty context; do not fork
- Always use true subagents in the same thread. Do not create separate threads/tasks
- Always give subagents the latest product screenshot (if any), the target image, and the user's asks. Prompt them to look at the product relative to the target and do everything it takes to close the gap from the product to the target, across composition, layout, lighting, materials, texturing, reflections, fine details, shaders, animations, character behaviors, controls, or anything else. Give them the absolute path to [references/plus-mode/assets-3d.md](assets-3d.md) to reference for asset generation. Instruct them to implement the code but not test/validate, as you will do this. Inform them that they are the worker and should not use the Dream Loop skill themselves. Do not give them specific tasks or opinions, only this high-level directive in a concise prompt. They are smarter than you and will figure out what to do.

The loop:
1. Create a subagent to do a pass at the target
2. Test and validate the product yourself and ensure it works as expected. In particular, generated assets often land in the wrong orientation and the subagent won't know. Fix any issues like this you spot. Don't try to improve the visuals to align to the target, only fix bugs, loading issues, etc.
3. Capture a screenshot of the product's current state
4. Loop back to 1.

Initially, only perform this loop 3 times. Keep a count and stop after 3, ask the user to review the results, and offer to perform more iteration loops to refine the visuals if they are not happy with the results yet.