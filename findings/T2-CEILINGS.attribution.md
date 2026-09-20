# T2-CEILINGS — the per-module attribution (Opus lane, 2026-09-19)

Control: `ed9d99295` (train EM-T1's green terminal, run 14 green end to end), a detached
worktree at `$SP/attrib-base-ed9d99295`, `npm ci` from the committed lockfile (exit 0).
Tip: `023eda2ec` (the EM-T2 cure commit) in the slot `$SP/lane-em-b3b`, branch
`fixes-2026-09-18-consist`, clean.

Instrument: the chair kit's one-off Vite wrapper `attrib.config.mjs`, which records every
module's `renderedLength` inside every emitted chunk and merges across the worker's own
Rollup pass. Run in each tree through the EXCLUSIVE gate mutex.

## The generation worker — `generation.worker-*.js`

| module | base (rendered B) | tip (rendered B) | delta |
| --- | ---: | ---: | ---: |
| `src/generators/pipeline.js` | 9,843 | 12,548 | +2,705 |
| `src/generators/steps/generatePopulation.js` | 6,864 | 9,702 | +2,838 |
| **sum of rendered deltas** | | | **+5,543** |

- base chunk `assets/generation.worker-CDQRNnkK.js`, 230 modules
- tip chunk `assets/generation.worker-DlyAm0eS.js`, 230 modules
- module count unchanged; no module entered or left the chunk
- **emitted (real `npm run build`): 1,399,946 B → 1,401,128 B = +1,182 B minified**

## The lazy engine chunk — `engine-*.js` (NOT `engine-core*`)

| module | base (rendered B) | tip (rendered B) | delta |
| --- | ---: | ---: | ---: |
| `src/generators/pipeline.js` | 9,843 | 12,548 | +2,705 |
| `src/generators/steps/generatePopulation.js` | 6,864 | 9,702 | +2,838 |
| **sum of rendered deltas** | | | **+5,543** |

- base chunk `assets/engine-DbLPMVNN.js`, 114 modules
- tip chunk `assets/engine-B1QAr5WC.js`, 114 modules
- module count unchanged; no module entered or left the chunk
- **emitted (real `npm run build`): 676,949 B → 678,131 B = +1,182 B minified**

## THE CONDITION — HELD

The moved modules are exactly `src/generators/pipeline.js` and
`src/generators/steps/generatePopulation.js` in BOTH chunks. No module outside those two
moved at all, let alone by more than 16 rendered bytes.

A whole-build adversarial sweep (all 545 emitted chunks, matched by hash-stripped name,
no chunk present in only one build) finds exactly TWO distinct modules whose rendered
length moved ANYWHERE in the build — the same two — appearing in three chunks:
`generation.worker`, `engine`, and `customContentPreview.worker`. The third carries no
byte ceiling (`tests/build/customContentPreviewLazy.test.js` is a source-shape contract
only), which is why the chair's measurement saw exactly two build reds.

## Instrument note — why the control was ALSO built for real

The wrapper's `generateBundle` hook records `chunk.code` before a late main-graph
post-processing step, so its emitted sizes are exact for the worker (its own Rollup pass)
but read main-graph chunks low by a constant 742 B:

| chunk | attrib wrapper | real `npm run build` | offset |
| --- | ---: | ---: | ---: |
| worker @ tip | 1,401,128 | 1,401,128 | 0 |
| engine @ tip | 677,389 | 678,131 | +742 |
| worker @ base | 1,399,946 | 1,399,946 | 0 |
| engine @ base | 676,207 | 676,949 | +742 |

Quoting the wrapper's 676,207 as "E at base" would have produced a false +1,924 B delta
across two different instruments. A real `npm run build` was therefore run in the control
worktree as well, and the two deltas then agree exactly: **+1,182 B in each chunk**, which
is what the identical pair of moved modules predicts. The chunk content hashes are
identical between the two instruments at both commits.

## Cross-check against the chair's measurement

The chair measured the worker at 1,401,131 B at `fefb2bb29`. The tip is `023eda2ec`, whose
only `src/` change is the T2 cure replacing ` — ` with `. ` in the partial-pin refusal
message — an em dash is 3 bytes in UTF-8, and 1,401,131 − 3 = 1,401,128, the measured W.
