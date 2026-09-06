# dream-loop

By [@anshuc](https://x.com/anshuc).

An agent skill that builds a game, app, or scene with impressive visuals, by creating a closed loop:

1. AI "dreams" up a high-quality target screenshot using image generation
2. AI builds with this target in mind
3. A separate AI critic compares the live screenshot to the target and provides feedback
4. AI loops back to step 2 until critic is satisfied
5. Optionally, AI loops back to step 1 and dreams up an even better target based on the current state.

## Installation

`npx skills add achimala/dream-loop`, or clone into your agent's skills directory, or paste the link into your agent and tell it to figure it out.

## Prerequisites

You need an AI agent with:

- access to image generation, either built-in (e.g. Codex, Grok) or via API (e.g. give it a Gemini API key)
- vision input
- subagents (optional but strongly preferred)

Install Blender if you want custom 3D modeling. The Blender MCP or scripting interface is preferred to computer use; it produces better results.

At the moment this is only tested with GPT-6 Astra in Codex. Other strong models like Claude Fable 5.1 can likely work too.

## Example

Prompt:
> Build me a graphics demo: isometric camera, voxel-ish art style with realistic shading and reflective wet floors, a character in an interesting scene. Fantasy setting (think Elden Ring, Diablo). Three.js in browser, >60fps. Don't download assets. Time limit of 1 hour. Controls: click to move the character, camera lazy-follows; drag to rotate camera; scroll to zoom in/out. No gameplay for now. World should feel alive: motion, animations, subtle environmental behaviors. Area around player should look expansive, but only allow movement in a limited space. No need to confirm the art with me or ask questions, just go!

GPT-6 Astra on high effort in Codex:

![Vesper demo: an isometric fantasy scene](assets/vesper-preview.gif)

[Try the live demo](https://dream-loop-demo.anshu.dev)

## Contributing

I'd love to hear feedback, see results, and accept edits to the skill.

If you open a PR, please provide example results produced by the skill, to ensure the changes don't regress performance.
