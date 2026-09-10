# SKEPTIC — §912 lens: THE WALKER (car 3, 9a9a7856e) + the retired helpers row (L2)
Seat: Opus 5 — Fable-unvalidated (skeptic, session 8de5f153). READ-ONLY on every tree.
Dock: $SC26/laneLMAT @ 7d96e2b72245fa465182d59dade31621f31ecf2c, porcelain 0 before and after.

## HOW I MEASURED
- Read the receipt and brief in full; read the walker (598 lines) in full; read
  `densityCreateBoundary.js` (PIPELINE_REACHERS, GENERATION_LAWS, birthConfig) in full.
- Reproduced the scan OUT OF TREE: `probe.mjs` / `probe2.mjs` / `probe3.mjs` in this
  directory re-implement `stripCommentsAndStrings`, `sourceFiles`, `pipelineReachers`,
  `names`/`mintsIn` and both the OLD (`[...reachers, MINT_HOME]`) and NEW `scanned`
  expressions character-for-character, reading the dock's files read-only and
  substituting planted content IN MEMORY. Nothing in the dock was written.
- Ran the walker once in the dock: `npx vitest run tests/lint/densityCreateBoundary.walker.test.js`
  -> **EXIT=0, Test Files 1 passed (1), Tests 14 passed (14)**, duration 1.87 s.

## (1) WHAT THE ⭐ ARM SCANS — MEASURED
`reachers` = 5 files (executed): ConstructionPanel.jsx · composeInstantWorld.js ·
campaignContentBindingSession.js · customContentPreview.worker.js · generationRequest.js.
- OLD `scanned` = 6 (those 5 + `densityCreateBoundary.js`).
- NEW `scanned` = **7** — the 6 plus `src/store/settlementGenerateAction.js`.
  `Object.keys(PIPELINE_REACHERS)` adds only that one file; the five others were already
  reachers, and the only `reachesVia` value (`generationRequest.js`) was already in the set.
  **The whole widening is worth exactly one file.**
- The tree has **2,188** `.js/.jsx` files under `src/`. The ⭐ arm therefore covers 7 of 2,188.

### WHAT IT STILL DOES NOT SCAN — three named holes, each reproduced
- **`src/store/settlementSlice.js:45` — a LIVE pipeline reacher the walker cannot see.**
  `_enginePromise = import('../generators/generateSettlementPipeline.js').then((pipe) => …)`
  pulls `regenNPCsPipeline` / `regenHistoryPipeline` out of the pipeline module. The
  identifier `generateSettlementPipeline` appears ONLY inside the import specifier string,
  which `stripCommentsAndStrings` blanks — so `pipelineReachers()` misses it. The arm at
  walker `:213` ("every module that reaches the pipeline is classified") is therefore green
  for the wrong reason: the estate's re-derivation home reaches the pipeline module, is
  absent from `PIPELINE_REACHERS`, and nothing reds. Every other reacher BINDS the
  identifier (static import or `const { generateSettlementPipeline } = await import(...)`),
  which is why this one file is the only escapee. PROBE: a plant of the off-boundary mint in
  `settlementSlice.js` is **GREEN under the widened scan**.
- **`src/generators/generateSettlementPipeline.js` (SELF) is excluded at walker `:145`**
  (`.filter(rel => rel !== SELF)`) and is not a `PIPELINE_REACHERS` key, so it is in neither
  the old nor the new `scanned`. PROBE: a plant of the off-boundary mint inside the pipeline
  module itself is **GREEN**.
- **`src/store/settlementSliceHelpers.js` — the eager leaf car 1 just de-listed — is not in
  `scanned`.** PROBE: an off-boundary mint planted there is **GREEN** under the widened scan.
  (For the two CURRENT mints this leaf is covered by the `:280` arm — see (3) — but the ⭐
  arm, which is the one that guards a NOT-WIRED law, cannot see it.)
- Scope note, not a hole: the walker never scans `tests/`; `sourceFiles()` is rooted at `src/`.

### A SECOND OBSERVATION ABOUT THE ARM'S PRESENT REACH
Car 2 flipped `livingContent` to WIRED, so `offTheBoundary` now holds **exactly one** law —
the off-boundary layout row (`newSettlementMapEdits` / `NEW_SETTLEMENT_LAYOUT_LAW_VERSION`).
The ⭐ arm today is 7 files × 1 symbol pair. The lane's own L4 (widen `MINT_SYMBOLS` in the
same car) is what keeps the living-content mint guarded, by the `:251` and `:280` arms which
scan all 2,188 files — that compensation is real and verified.

## (2) THE PLANT — REPRODUCED, BOTH DIRECTIONS
| run | scan | my result |
|---|---|---|
| `const _PLANT_L_MAT = newSettlementMapEdits;` in `settlementGenerateAction.js` | WIDENED | **strays = ["src/store/settlementGenerateAction.js names newSettlementMapEdits"]** -> RED |
| the same plant | pre-widening `[...reachers, MINT_HOME]` | **strays = []** -> GREEN |
| no plant | WIDENED | strays = [] -> GREEN |
The receipt's failure message reproduces verbatim, and the old scan really would have
passed. The receipt's restore digests also verify exactly: walker
`a8b662af7440514981d93a8f1818b394` == the file at `9a9a7856e` and at the tip;
`settlementGenerateAction.js` `1d0e38ff5a669f52744caf73fa5958fd` == the file at `fe8eb3f56`
and at the tip. **CONFIRMED.**

## (3) DELETING THE `MINT_HOMES` HELPERS ROW (L2) — SAFE, AND IT STRENGTHENS
`MINT_HOMES` has exactly one consumer, walker `:282`, inside "the mint is not named outside
its homes and its declared BIRTH callers" (`:280`), where it is an ALLOWLIST over all 2,188
`src/` files. The row asserted "this leaf may name a mint symbol". Measured: the leaf names
**0** of the three mint symbols at the tip. PROBE with the re-export planted back
(`export { birthConfig } from '../domain/density/densityCreateBoundary.js';`):
- tip `MINT_HOMES` (row deleted): strays = `["src/store/settlementSliceHelpers.js"]` -> **RED**
- old `MINT_HOMES` (row kept): strays = `[]` -> **GREEN**
So the deletion converts the exact regression car 1 cured (an eager leaf re-exporting the
mint) from silent to red. No other arm reads `MINT_HOMES`. **CONFIRMED; nothing weakened.**
Attribution correction: the deletion landed in **car 1 (442c7f988)**, not car 3.

## (4) AN ASSERTION THAT CANNOT FAIL — walker `:502-504`
```
for (const rel of Object.keys(PIPELINE_REACHERS)) {
  expect(scanned, `${rel} is a declared row but is not scanned`).toContain(rel);
}
```
`scanned` is constructed eleven lines above as `[...new Set([..., ...Object.keys(PIPELINE_REACHERS), ...])]`.
Every element this loop looks for was spread into the set by the expression under test, so
the loop is a tautology: it cannot fail for any tree. Its comment claims it guards "a
declared row that fell out of the scan", which cannot happen by construction. The sibling
`expect(scanned.length).toBeGreaterThan(reachers.length)` is near-tautological for the same
reason (it fails only if `densityCreateBoundary.js` itself becomes a pipeline reacher).
The `toContain('src/store/settlementGenerateAction.js')` assertion at `:506-509` IS
meaningful — it fails if that row leaves `PIPELINE_REACHERS` — and is the only one of the
three that can die. Cosmetic sibling: the stray message always says `names ${law.mint}` even
when the DIAL is what matched (`:513-514`).

## (5) TEST COUNT
14 passed / exit 0 at the dock tip, reproduced. Car 3 adds no `it(` — its 32 added lines are
all inside the existing ⭐ arm — so "14 before and 14 after" is right, and the plant's
"1 failed | 13 passed" is arithmetically consistent with the same 14.

## VERDICT SUMMARY
CONFIRMED: the reacher set is 5 and excludes the generate action; the plant reds widened and
passes pre-widening; the restore digests; 14/14 exit 0; the `MINT_HOMES` deletion is safe and
strengthening.
PARTLY: "the walker's second hole closed" — one hole closed (worth one file), three named
holes remain, the largest being a live dynamic-import reacher (`settlementSlice.js:45`) that
makes the `:213` classification arm green for the wrong reason.
REFUTED: the `:502-504` denominator loop's stated purpose — it is an assertion that cannot fail.
