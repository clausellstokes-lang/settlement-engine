# LANE: HORIZON-B2 — WORKER Car 1: generation in a Web Worker behind ONE code path, a typed protocol, the store boundary async
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · chair-class · ~15 files (6 new src, 7 edited, 3 new test files) · risk HIGH · lands DARK (the flag off; the in-thread fallback is the shipped path) · unblocks `L-DOORS (ii)`⟧

## READ FIRST
1. `$SC/briefs/_PREAMBLE.md`.
2. The design on the LEDGER (always `git show`): `git show review-fixes-2026-07-08:docs/DESIGN_HORIZON.md | sed -n '834,900p'`
   — **§9 WORKER whole**: the thesis (generation is ALREADY async and worker-loadable — `customContentPreview.worker.js`
   runs `generateSettlementPipeline` in a production worker today; the item is to move the ONE entry behind a typed
   protocol, never to fork it); §1.12 (~line 128) the protocol and the ONE core; §9.2 the files; §9.5 the car plan (four
   cars; Car 3 droppable; Car 4 an owner-lit note); the standing laws (capture every exit; the mutex give-up exits 3
   WITHOUT RUNNING; outlast the gate; link the dock's own node_modules; re-prove at the tip).
3. The Car 0 receipt if it survives: `git for-each-ref refs/preserve | grep -i worker`; else the design's ⟦G0-47⟧/⟦G0-57⟧
   figures are your starting claims, to re-measure (the built probe worker bundle 1,404,723 B driven in Node
   `worker_threads` through the estate's isolate shim).

## THE SHAPE (re-derive every address)
- `src/lib/generationProtocol.js` — a ZERO-IMPORT leaf (the `customContentPreviewProtocol.js` idiom); FINITE-SEMANTICS:
  no function crosses the boundary (the slice's `onStep`/`onComplete` callbacks become typed step messages), a closed
  `GENERATION_OPS` vocabulary, `kind: 'generation.request'`, `v: 1`, `requestId`.
- `src/workers/generationRequest.js` — the core `runGenerationRequest(request, emit)`: synchronous, pure over its inputs,
  no `Date`, no `Math.random`, no store, no field reads; `structuredClone(request)` at the boundary. Under `src/workers/`
  so the FULL determinism ban (`determinismBanCoverage`'s workers layer), T13's trees and WRWALKER's STOP all cover it.
- `src/workers/generation.worker.js` — the shell: refuses `kind !== 'generation.request' || v !== 1 || !GENERATION_OPS.includes(op)`
  with `request_invalid`; posts every step (tracking `lastStepId`); posts the completion.
- `generationClient` — `runGeneration` with the in-thread fallback (`in-thread:flag-off`, `in-thread:no-worker`, …);
  the store action `generateSettlement(seedOverride?) → Promise<settlement|null>` keeps its SIGNATURE (7 UI callers, 25
  test call sites already `await` it). ⛔ `fullConfig` is read BY REFERENCE by the analytics block today — the core must
  make the in-thread and worker paths EQUAL (the design names the exact fields: `configArchetype`, `usedRandomSentinels`,
  `computeConfigSignature`).
- Edited: `settlementSliceHelpers.js` (the `loadSettlementContentRuntimeOptions` re-export removed), `densityCreateBoundary.js`,
  the slice; the governed test `engineChunkLazy.test.js` arm 2 re-anchored on a MUTATION (it pins four regexes on the
  slice's source); the create-boundary walker (`densityCreateBoundary.walker.test.js`) scans EVERY `src/*.js|jsx` —
  price its red before you commit.
- New tests (three, straight-line describes, literal titles, no `it.each`): `tests/lib/generationClient.test.js` and the
  two the design names; ⛔ each is a NEW test file — name them for the censuses; ⚠ golden-adjacent env spellings must be
  enrolled/excluded in `.golden-freeze-register.json` in the same commit.

## THE PROMISE — the dormancy instrument
NO output moves: the worker runs the same module over cloned inputs in the same JS engine. `generatorGoldenMaster` 0/525
at your tip on both arms is the standing instrument; the two things the boundary COULD move (`Map`/`Set`/`undefined`
mangled by structured clone) are pinned by `scripts/audit/generation-clone-census.mjs` (Car 0's instrument — build it if
it is absent: for each of the 525 manifest rows + one reroll fixture with a locked NPC + one instant-world, clone the
request and diff the output byte-for-byte).

## PROOF
The identity test's arm 2 (THE ONE ENTRY unchanged — a layer above it, never a fork) · the three new tests · the slice
tests · `engineChunkLazy.test.js` · the create-boundary walker · `tests/lint/` WHOLE · `typecheck:domain:strict` ·
eslint · the clone census 525/525 · plant-out (remove the shell import; the client test must red). Bytes: the chair
builds; you predict engine +236 B / closure inside the margin from ⟦G0-47⟧ and say why the eager closure is untouched
(`EAGER_FIRST_PAINT_MODULES`). Quiet-window law + mutex before any vitest.

## ⛔ FENCES
The flag stays OFF (dark); Car 2 (instant world) and Car 3 (regen ops) are NOT this car. No `--amend`; commit per
step; trailers `Seat: Opus 5 — Fable-unvalidated` + `Lane: HORIZON-B2`. Receipt `$SC/receipt-horizon-b2.md`.
