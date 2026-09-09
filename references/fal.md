# Fal bootstrap and batch generation

Use [scripts/fal-batch.mjs](../scripts/fal-batch.mjs) for the Fal queue workflow. It requires Node 18+ and `FAL_KEY` or `FAL_API_KEY`, reads images without platform-specific shell encoding, and preserves the actual queue URLs returned by Fal. It submits independent ready jobs concurrently and never automatically repeats an accepted or uncertain submission.

Use these working recipes first; do not rebuild the API integration or search the model catalog on every run. They were checked against the official schemas on 2026-09-09. Recheck the linked schema when a real error suggests a changed contract or when choosing another model.

| Role | Exact endpoint | Starting input |
|---|---|---|
| Architecture, characters, hero props | `tripo3d/h3.1/image-to-3d` | `{"texture":true,"pbr":true,"face_limit":200000}` |
| Small props and dressing | `fal-ai/trellis` | `{"mesh_simplify":0.95,"texture_size":1024}` |

Trellis has **no `/image-to-3d` suffix**. Its documented texture sizes are 512, 1024, and 2048; start with 1024. The two models take different parameters, so do not copy one model's input wholesale to the other.

Create `.dream-loop/fal-jobs.json`. Keep its job IDs aligned with `.dream-loop/assets.json`. Adapt the two entries below to the planned assets; paths are relative to the jobs file:

```json
{
  "jobs": [
    {
      "id": "arch",
      "endpoint": "tripo3d/h3.1/image-to-3d",
      "image": "assets/arch.png",
      "output": "../models/arch.glb",
      "input": { "texture": true, "pbr": true, "face_limit": 200000 }
    },
    {
      "id": "rubble",
      "endpoint": "fal-ai/trellis",
      "image": "assets/rubble.png",
      "output": "../models/rubble.glb",
      "input": { "mesh_simplify": 0.95, "texture_size": 1024 }
    }
  ]
}
```

Resolve the script path from this skill's directory, then run:

```sh
node /path/to/dream-loop/scripts/fal-batch.mjs check .dream-loop/fal-jobs.json
node /path/to/dream-loop/scripts/fal-batch.mjs submit .dream-loop/fal-jobs.json
node /path/to/dream-loop/scripts/fal-batch.mjs collect .dream-loop/fal-jobs.json
```

`check` is offline, needs no API key, and does not change the job file. Run it before submission to catch the incorrect Trellis route, mixed-model options, missing images, and invalid image files. `--help` also prints both recipes.

`submit` skips images that do not exist yet. Run it as source images become ready, without waiting for the entire image batch. `collect` performs one status/download pass; rerun it after a reasonable interval while doing useful independent work. A fourth argument sets concurrency (default 4). Keep each command's job file intact so it can resume. Do not run overlapping commands against the same job file.

The helper sends the selected source images to Fal as data URIs; use it within the user's authorization. It prints only compact job status, never image payloads or credentials.

If the sandbox blocks network access, use the environment’s normal approved network execution path. A DNS or connection failure recorded as `not-submitted` can be retried once access is available; do not mistake it for a rejected Fal generation or invent a procedural fallback.

`downloaded` means a complete GLB was saved, not that visual validation passed. Preview the models and materials before marking assets ready.

Use `error_stage` and the sanitized `error_detail` before deciding how to recover:

- `rejected` at submission: Fal explicitly rejected the request before returning an ID. Correct the reported endpoint, input, or authorization issue, then submit again.
- `submission-uncertain` or `submitting`: acceptance is unknown. Preserve the record and reconcile it with Fal request history before any replacement submission. Do not clear IDs/URLs or create a new job just to bypass this protection.
- `result-error`: the queue finished, but fetching its result failed. `COMPLETED` alone does not mean model generation succeeded. Inspect the error detail and retry collection using the same returned URLs when appropriate. Preserve a confirmed failed job; a deliberate replacement gets a new ID and records which failed job it replaces.
- `download-error`: the result was fetched but no valid complete GLB was saved. Retry collection; do not regenerate an already accepted model merely because its download failed.

The helper keeps accepted IDs even when a submission response is incomplete and refuses to resubmit a record that still has queue URLs but lost its ID. Do not reconstruct queue URLs, overwrite failed-job history, or replace failed assets with procedural models.

Choose mesh budgets for the asset's screen size and instance count. H3.1 accepts `face_limit`; its automatic count can produce very dense meshes. Preserve silhouette and texture detail, then measure the composed scene's FPS.

Inputs are endpoint-specific. Check the linked schema before copying a job to another model: Trellis uses `mesh_simplify` and `texture_size`, rather than H3.1's `face_limit`, `texture`, and `pbr` fields.

Model inputs and outputs: [Tripo H3.1](https://fal.ai/models/tripo3d/h3.1/image-to-3d/api), [Trellis](https://fal.ai/models/fal-ai/trellis/api). Queue behavior: [Fal asynchronous inference](https://fal.ai/docs/documentation/model-apis/inference/queue).
