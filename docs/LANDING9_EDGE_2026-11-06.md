# LANDING-9-EDGE — the six edge-shared bundle arms (2026-11-06)

Seat: LANDING-9-EDGE (Opus 5.5), a child session of the cloud chair (Fable 5.1, session
`01FE9mEvGxnFx6WTBkEC6ie9`). Branch `lane/landing9-edge-2026-11-06` from `3c62e8ef5`.
No golden moved; record 38 not used.

## The table

| Red | Cause (step, commit) | Door | What moved (files, bytes, blob before → after) | State |
|---|---|---|---|---|
| aiCharter freshness + reproducibility | `471780f4a` (L7E merge) → `20c0139c5` R-E8 pt 1, `demographicsRates.js` DENSITY_CEILINGS; then `18fd6b442` (L7H merge) → `8e92c0440` R-H2, `institutionalCatalog.js` Village watch line | `npm run build:edge-shared` | `aiCharterBundle.js` 548260 B `e9cca0b97 → f54fc22f2`; `.meta.json` 4684 B `803e02ae7 → da32d34f4`; sourceHash `989ac314494c8341 → 639346a2ddcc1652` | GREEN |
| aiGrounding freshness + reproducibility | `18fd6b442` (L7H merge) → `8e92c0440` R-H2, `institutionalCatalog.js` | same | `aiGroundingBundle.js` 439049 B `78ad6ce1f → 7cdef7b2a`; `.meta.json` 3298 B `6510c8c7f → 43c14cd29`; sourceHash `1a0d3f8ade9a5839 → 2fb1ca77d8257327` | GREEN |
| aiOutputSchema freshness + reproducibility | as aiCharter (`20c0139c5`, then `8e92c0440`) | same | `aiOutputSchemaBundle.js` 544574 B `d6647e4f6 → 917e35b9b`; `.meta.json` 4739 B `a6b450f13 → fcf2c35b6`; sourceHash `178033fd39d915b7 → 63e45ed061a95431` | GREEN |
| (not red; one-build-window pin) | — | same run | `analyticsEventsBundle.meta.json` 211 B `a6eda6788 → 539e20dca`, `intentAtlasBundle.meta.json` 226 B `e22388aaa → bd73d08e6`: generatedAt only | GREEN |

## The bisect

Each step's committed tree was read with `git show <step>:<path>`, and each meta's sourceHash was
recomputed over its recorded inputs. Inputs under `node_modules/` came from disk, which is lockfile-pinned.
The measured states across `3d8a74e4b..3c62e8ef5` (first parent):

- `3d8a74e4b` … `b37bbf395`: aiCharter and aiOutputSchema RED, aiGrounding OK. They were stale at the base on
  `stressorsCore.js`.
- `3da1104da` (lane F merge, its rebuild `27e2425c3`) … `b3a4aaf1c`: all three OK. The brief's suspect
  `f93c69938` sits in this green run, so it is **not** the cause.
- `471780f4a` (L7E merge): aiCharter and aiOutputSchema RED. Its one bundled input change,
  `src/domain/worldPulse/demographicsRates.js`, is diff-equal to `20c0139c5`.
- `18fd6b442` (L7H merge): aiGrounding RED as well. Its one bundled input change,
  `src/data/institutionalCatalog.js`, is diff-equal to `8e92c0440`.
- The run stays RED through to the tip `3c62e8ef5`.

The generated diff contains exactly those two causes. In aiCharter and aiOutputSchema, the DENSITY_CEILINGS rows
moved (thorp 90→36, hamlet 600→131, village 1400→543, town 7500→3374, city 38e3→22798). In all three
bundles, the Village watch desc changed ("the headman keeps the rota" → "the rota is their own"). Banner hash,
meta sourceHash and generatedAt changed with them. The input lists did not change.

## The suites' own runs

| Run | Result | Exit |
|---|---|---|
| The four files carrying the six arms (three `*Bundle.freshness.test.js` + `edgeSharedBundleReproducibility.test.js`), before | 6 failed | 1 |
| Same four files, after | 87 of 87 | 0 |
| `tests/edgeFunctions/` whole, before → after | 937/943 → 943 of 943 | 1 → 0 |
| `tests/lint/mutationCoverageManifest.test.js` | 10 of 10 | 0 |
| `npm run check:edge-behavior` (deno `check:edge` + `test:edge`) | SKIPPED: deno is not on PATH on this box. The script fails open by design. Installing it needs the network, so it was not attempted. CI's deno-tests job gates it. | 0 (skip) |

The full check was not run: it is red on the siblings' eighteen tests, and the chair runs the merged check.
