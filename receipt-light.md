# RECEIPT — LANE LIGHT — car 1 (the dial lit and landed)

Seat: Opus 5 — Fable-unvalidated · Lane: LIGHT · Dock: `$SC/laneLIGHT`, cut at the §916 product
tip `8961388ce` (claude/composite-r4), detached HEAD, `node_modules` symlinked (never cloned, no
vite build taken).

Brief: `$SC/briefs/brief-LIGHT-car1.md` (read whole) · hazard: `$SC/briefs/LIGHT-HAZARD.md` ·
owner rows: RESUME-NOTE 09-08 13:55 ("Also feel free to land everything lit on" —
"Retroactively as well") and 09-08 13:57 (no true launched settlements; all existing are tests,
inconsequential ⇒ the retroactive half discharged as NO migration).

**Every figure below is from a command this lane executed.** CONFIRMED = executed here.

---

## THE CARS

| car | sha | what |
|---|---|---|
| 1a | `04c37d83f` | the roster loader gains its caller — `loadGenerationLawPayloads()` on the create boundary, awaited by all seven paths that can reach the pipeline, held to the tree by two new walker arms |
| 1b | `35fa42980` | the dial lit — `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION = ROSTER_LIVING_CONTENT_LAW_VERSION`; every dormancy arm inverted, never relaxed; the writer-reach dark row retired by its own premise |
| 1c | (below) | THE PROMISE under law 2 — byte-identical but the roster, on 525 + 768 |
| 1d | (below) | no migration — a law-1 world stays law-1 on every path, lit |
| 1e | (below) | the three holes' arms at dial 2 |
| 1f | (below) | the lit walkers |

---

## CAR 1a — THE LOADER'S CALLER (`04c37d83f`)

### The plant and its site
`loadGenerationLawPayloads()` — `src/domain/density/densityCreateBoundary.js`, an async export
beside `birthConfig`. It awaits `loadLivingContentRoster()` from `livingContentSeam.js`
(the dynamic `import(` form untouched). The boundary is its home because that module already
answers "which law does a birth mint"; the payload a law needs is the same question's other half.

**The seven awaiters** (declared per row in `PIPELINE_REACHERS.payloadAwaitedBy`):

| reacher (class) | awaits it in |
|---|---|
| `settlementGenerateAction.js` (BIRTH) | itself |
| `workers/generationRequest.js` (EXECUTOR) | `settlementGenerateAction.js` **and** `workers/generation.worker.js` |
| `lib/instantWorld/composeInstantWorld.js` (BIRTH) | `store/instantWorldBody.js`, `components/WorldPage.jsx`, `components/surveyor/ConstructionPanel.jsx` |
| `components/surveyor/ConstructionPanel.jsx` (PREVIEW) | itself |
| `workers/customContentPreview.worker.js` (PREVIEW) | itself |
| `store/campaignContentBindingSession.js` (PREVIEW) | itself |

Two worker shells load for themselves because **a Web Worker evaluates its own copy of the module
graph**; a main-thread load does not arm the worker's seam. Both `onmessage` handlers became
`async` with the await INSIDE the existing `try`, so a load failure answers on the shell's own
error channel instead of becoming an unhandled rejection.

`composeInstantWorld.js` is synchronous by design and RE-EXPORTS the loader rather than wrapping
it, so its three callers arm the seam from the chunk they have already paid for and no second
name for one act exists.

### The outage, demonstrated live
A lit birth with the loader NOT awaited, executed in this dock:

```
Error: [livingContentSeam] v2 world, roster payload not loaded
    at livingContentRosterFor (src/domain/content/livingContentSeam.js:121:11)
    at generateSettlementPipeline (src/generators/generateSettlementPipeline.js:180:33)
```

### The two plants (structural prevention), md5-restored
* **PLANT A** — the await deleted from `generation.worker.js`:
  `densityCreateBoundary.walker` **1 failed / 15 passed**, naming
  `src/workers/generationRequest.js: src/workers/generation.worker.js no longer awaits the payload`.
* **PLANT B** — the await deleted from all seven: **2 failed / 14 passed**,
  `nothing in src/ names the create boundary's async payload edge … expected 0 to be greater than 1`.
* Restored by `cp` from a scratchpad copy; all seven md5s **MATCH**; walker back to **16 passed**.
  No `git checkout` was used at any point.

### The eager-closure proof (no build taken)
`EAGER_FIRST_PAINT_MODULES` re-derived from `vite.config.js` before and after the car:
**263 → 263**. `densityCreateBoundary.js`, `livingContentSeam.js`, `livingContentLaw.js`,
`livingContentRoster.js`, `livingContentLawVersion.js` and all seven awaiters are OUTSIDE it in
both states. `livingContentRoster.js` carries no `ENGINE_SHARED_DOMAIN_EXCISIONS` row, so its
absence from the eager graph is also proof it never entered `ENGINE_SHARED_DOMAIN` (that set
seeds the eager derivation). The seam's own three regex arms
(`tests/build/livingContentSeamLazy.test.js`) are green: 6 passed.
⚠ **NO `dist/` EXISTS IN THIS DOCK**, so the chunk-membership read the brief names could not be
taken; the two derivations plus the excision-list read are what stand in its place, and no build
was run (the fence).

### Executed (one focused file at a time, runners 0 before each)
`densityCreateBoundary.walker` 16 · `livingContentSeamLazy` 6 · `livingContentLawWiring` 12 ·
`livingContentMaterialization` 11 · `livingContentRosterPublicDrop` 6 ·
`generationWorkerLazy` 6 (+4 skipped) · `customContentPreviewLazy` 1 (+2) · `worldPageLazy` 3 ·
`engineChunkLazy` 8 (+7) · `settlementSlice` 28 · `instantWorldBinding` 6 ·
`surveyorConstructionPanel` 5 · `generationClient` 17 · `generationWorkerIdentity` 8 ·
`composeInstantWorld` 20 · `campaignRuntimeCallerCoverage` 8 · `negativeAssertionAnchor` 9.
eslint 0 on all sixteen changed files.

### One instrument widened, argued not loosened
`tests/build/generationWorkerLazy.test.js`'s EXACT static-import list for the worker shell goes
from two entries to three. Kept exact rather than relaxed to `toContain`.

---

## CAR 1b — THE DIAL LIT (`35fa42980`)

### The dial line
`src/domain/content/livingContentLaw.js:96-97`

```js
export const NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION =
  ROSTER_LIVING_CONTENT_LAW_VERSION;
```

### 0 of 525 golden rows move with the dial — three-way, executed
| tree | 525 hashes, md5 of the manifest |
|---|---|
| base `8961388ce` (clean `git archive` extract) | `3d091d2400e0c9b68ea2be262a5c3e78` |
| this tree, dial temporarily DARK (control) | `3d091d2400e0c9b68ea2be262a5c3e78` |
| this tree, dial LIT (shipped) | `3d091d2400e0c9b68ea2be262a5c3e78` |

⚠ **`generatorGoldenMaster` IS RED AT THIS TIP AND IT IS NOT THIS LANE'S RED.** It reports
525 of 525 rows drifting from the COMMITTED manifest — **at the base commit exactly as here**.
That is the declared pre-existing prose shift recorded in `scripts/.test-ratchet-baseline.json`
(the fixture cannot be re-recorded before the owner-signed GENESIS freeze). This lane adds zero
rows; the three md5s above are the control.

### The dial's own arms, inverted rather than relaxed
* `livingContentMaterialization`: `is dormant by default` → `the dial is LIT, and the mint writes
  the marker and nothing else`, with the dormant branch still exercised through the leaf's closed
  test.
* `livingContentLawWiring`: `boundaryWithDarkLaw()` added as the mirror of `boundaryWithLitLaw()`;
  the file's two halves SWAP SIDES. The dark arms are kept because the dial is one line in BOTH
  directions and an estate that stops exercising the dormant branch cannot revert on a bad day.
* THE SAME-SEED CONTROL changed SHAPE without weakening: `toEqual(raw)` → equal after subtracting
  the marker's two config echoes, plus an assertion that the marker really is present (so the
  comparison is a subtraction, not two identical inputs).
* THE CLAMP (DEF-2) moved to the DORMANT dial, which is the only dial it matters at — the mint is
  spread LAST, so a non-empty mint always wins and the destructure is load-bearing only when the
  mint is `{}`. A new LIT-direction arm covers the other half: an incoming marker of 1, and an
  incoming unshipped 3, both lose to the dial.

### Nine test files and two scripts gained the async prelude
`composeInstantWorld` is a classified BIRTH and is SYNCHRONOUS, so a caller that does not await
the payload meets the seam's throw. Eight test files compose at module scope, so the await is at
module scope with them: `worldCode`, `constructRealm`, `composeInstantWorld`, `composerPipeline`,
`factionDedup`, `genesisDiplomacy`, `mundaneRealmAcceptance`, `mundaneRealmProjection`, plus
`worldGenerationClockSeam.walker`. Scripts: `observe-genesis-war-ramp.mjs` (top-level await) and
`dormancy-bit-compare.mjs` (per-tree, tolerant of an older tree with no payload edge).

### Executed after the flip
`livingContentMaterialization` 11 · `livingContentLawWiring` 14 · `livingContentRosterPublicDrop` 7 ·
`densityCreateBoundary.walker` 16 · `worldCode` 13 · `constructRealm` 6 · `composeInstantWorld` 20 ·
`composerPipeline` 17 · `factionDedup` 18 · `genesisDiplomacy` 23 · `mundaneRealmAcceptance` 21 ·
`mundaneRealmProjection` 11 · `worldGenerationClockSeam.walker` 12 · `settlementSlice` 28 ·
`instantWorldBinding` 6 · `worldConditionsRegen` 3 · `customContentTunablesRuntime` 5 ·
`locksEngine` 13 · `regenPreservation` 6 · `editProseQueueSpine` 14 · `pendingEditsQueueReset` 5 ·
`settlementSlice.sentinelTierRegate` 4 · `campaignWorldPulseSpatialCanon` 16. eslint 0.
