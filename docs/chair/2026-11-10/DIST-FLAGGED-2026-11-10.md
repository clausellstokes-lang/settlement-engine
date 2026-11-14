# DIST-FLAGGED: the dist gate builds and boots the production artifact (2026-11-10)

Seat BOOT-TIP, session `session_01FbPLbdzUMFRegg4kskMYG6`, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). Lane `lane/dist-flagged-2026-11-10`, cut from the integration tip `25b5617e6` (point 31). The brief is the chair's message (D1–D5). Roster `dated` 223 -> 224 for this record.

## 1. What was wrong (the chair's measure, confirmed)

`npm run verify:dist` could not exit 0. The strict dist phase reads a SKIPPED build row as a failure, and `tests/build/engineAbsentWhenRemote.test.js`'s four "read from the build" arms are `describe.runIf(REMOTE_DIST_EXISTS)`, run on a flagged dist that nothing built. They have been red since ENGINE-3 unit 1 (a9bbf581e).

The artifact that ships is the FLAGGED build: Vercel sets VITE_ENGINE_REMOTE=true (docs/DEPLOY.md). No gate ever built or booted it.

## 2. The forms chosen

| ruling | form | commit |
|---|---|---|
| D1 | The flagged build lives INSIDE the ratchet's `--verify-dist` runner (`scripts/check-test-ratchet.mjs :: remoteDistBuildCommandOf`), not in a new npm script. package.json is a governed detector source (OPERATING_STANDARD rule 11), so `verify:dist`, `npm run check` and CI's build job keep calling the one unchanged line, and ciCheckParity has nothing to move. The command is the test's own documented one at its own default path, with vercel.json's heap: `VITE_ENGINE_REMOTE=true NODE_OPTIONS=--max-old-space-size=4096 npx vite build --outDir "node_modules/.cache/engine-remote-dist" --emptyOutDir`. A failing build fails closed. The strict runner gets VERIFY_ENGINE_REMOTE_DIST=1, so a missing flagged dist is a hard red, never a skip. `--dry` prints the line; `--from-log` builds nothing. The seam is TEST_RATCHET_REMOTE_BUILD_CMD. | `7201a70f8` |
| D2, boot | `tests/build/bootSmoke.test.js` gains a sibling arm: boot-smoke.mjs `--dist` on the flagged dist, hard-required under VERIFY_ENGINE_REMOTE_DIST=1, overridable by ENGINE_REMOTE_DIST. | `d3f3d9722` |
| D2, graph | `tests/architecture/engineCoreLazyEdge.test.js` gains a FLAGGED arm. It applies the plugin's own swap of the three seam ids to `src/lib/localEngine.absent.js`. The plugin swaps only those ids and manualChunks does not read the flag, so this is the shipped graph, checked with no build. | `cb3eafcad` |
| — | The lighting census was re-frozen through its ritual: titles 28997 -> 29001, suite titles +1. | `78a8c3a84` |

## 3. Red first, by plant

| arm | plant | red |
|---|---|---|
| testRatchet "the flagged dist" (3 tests) | the build call disabled in the runner | 2 failed: fail-closed, and builds-under-`--verify-dist` |
| bootSmoke, the flagged boot | ENGINE_REMOTE_DIST pointed at the preserved unbootable build from ecadf531a | "THE PRODUCTION (FLAGGED) BUNDLE DOES NOT BOOT" |
| bootSmoke, the flagged dist is required | ENGINE_REMOTE_DIST at an empty path, with VERIFY_ENGINE_REMOTE_DIST=1 | "the flagged dist exists", 1 failed |
| engineCoreLazyEdge, both arms | the FIRSTPAINT-4 row removed from vite.config.js | 2 failed, each naming governanceAccount.js -> powerStrata.js |

Every plant was restored, and each arm is green at the tip.

## 4. The gate at the tip (`npm run build`, then `sh scripts/gate-tail.sh npm run verify:dist`)

No SKIPPED row. engineAbsentWhenRemote is 10/10. bootSmoke is 21/21; both bundles boot, and the shell mounts in each. There is no boot red and no lazy-placement red. The remaining reds:

- **The byte ceilings, pure:**
  - vendorPdfLazy raw / gz / Brotli: 1,121,177 / 357,201 / 299,758, against 1,104,215 / 351,590 / 295,016
  - generationWorkerLazy: 2,007,681 against 1,976,655
- **brandDerivatives ×3:** the cure is on another lane and is not in this base.

## 5. D3: the flagged build beside the unflagged one (measured, not pinned)

| first-paint closure (8 files each) | raw | gzip | Brotli |
|---|---|---|---|
| unflagged `dist/` | 1,121,177 | 357,201 | 299,758 |
| FLAGGED (production) | **1,097,336** | **348,293** | **292,542** |

Per chunk in the closure, flagged minus unflagged:
- engine-core −21,045 B: the generator-only ESD vocabulary tree-shakes out once the pipeline is absent
- data −1,768 B
- kernel −798 B
- index −130 B
- content-identity −126 B
- vendor-state +26 B

The flagged first paint is UNDER every current budget.

Whole build:

| | JS files | JS bytes | no longer emitted |
|---|---|---|---|
| unflagged | 596 | 22,950,040 | |
| flagged | 593 | 17,958,756 | the generation worker (2,007,681 B) |

Largest flagged chunks:
- advanceInterval.worker 2,834,127
- pdfRender.worker 2,565,466
- vendor-pdf 1,852,205
- data-lazy 1,114,862 (unflagged 1,501,168)
- index 488,985
- advanceInterval 471,227

## 6. D4: the CI job's clock

Measured on this container: `npm run build` 48 s, then the new `npm run verify:dist` 174 s (the flagged build included), 222 s end to end.

CI's own build-and-dist job ran faster than this container, not 3.5–4.6× slower. The factor belongs to the test ratchet job. In run 42366537542 the build step took 38 s, verify:dist 37 s, and the whole job about 2 minutes.

Projection: the flagged build adds about 40 s and the flagged boot about 20 s, so the job lands near 3–4 minutes against `timeout-minutes: 10`. **ci.yml is left untouched.**

## 7. The other gates

- `npm run typecheck:ratchet`: 167
- `npm run typecheck:domain:strict`: exit 0
- eslint: 0 on the four touched JS files
- ciCheckParity, deployConfig and deployRunbookFreshness: green, as the hand-back recounts
- tests/lint, tests/scripts and tests/architecture: against the base, as the hand-back recounts

## 8. CONFIRMED against PLAUSIBLE

CONFIRMED by execution: everything above.

PLAUSIBLE: the CI job's projected 3–4 minutes. It is extrapolated from one green run's step times plus this container's flagged-build cost, and has not been read off a CI run of this tip.
