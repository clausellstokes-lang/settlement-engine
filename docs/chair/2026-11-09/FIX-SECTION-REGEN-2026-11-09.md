# FIX-SECTION-REGEN — a section regeneration holds the derived state the full generation holds (2026-11-09)

**Seat:** FIX-SECTION-REGEN, an Opus 5.5 build seat (session `session_01FbPLbf5ncRhMmR9LGUhdsH`), child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). **Lane:** `lane/fix-section-regen-2026-11-09`, cut from the merge train's final tip `bd07005b9`. **Row:** the brief's FIX-SECTION-REGEN (car 2's finding, ruled 04:3x): a section regen derives the hall-capture state on its own view and returns no `powerStructure`. **Not this lane's:** the tier gates (TIER-PARITY-FIX), the goal draws (car 4), any prose.

## 1. The measurement (before the first edit)

**The harness.** For a seed and config: the born record `S`; the NPC section regen `P = regenNPCsPipeline(S, S.config, { seed: <seed>::regen })`; the regenerated record `S ⊕ P` as the store folds it (`settlementSliceHelpers.js :: foldRegeneratedRoster`, an `Object.assign` of the parts); the REFERENCE `F`, the full generation of the same seed and config with the regenerated cast and ties held (`pins: { npcs, relationships }`), whose coherence seam derives the hall from exactly that cast (`narrativeGenerator.js :: generateCoherence`, its held-roster arm) — the full generation's own derivation, by its own single writer. Forty seeds `fsr-0..39`, the four tiers in turn.

**Every derived field the regen recomputes.** `regenNPCsPipeline` recomputes: the cast (`npcs`, re-rolled), the ties (`relationships`, re-rolled), the conflicts (`conflicts`, re-rolled draws), the allegiance receipts (`simulationTrace`'s `people-allegiance` run, the regen's own deal) — and, on its PRIVATE view `{ ...settlement, npcs, config }` inside `enrichNpcCoherence`'s seam, the hall: `powerStructure.criminalCaptureState`, the governing row's birth `captureState` seed and the relation matrix's capture rows (`factionDynamics.js :: withCaptureRelations`). The view was dropped; no `powerStructure` was returned.

| derived field (S ⊕ P vs F) | bd07005b9 | tip |
|---|---|---|
| `powerStructure.criminalCaptureState` | 7/40 disagree (fsr-6 city: record `equilibrium`, F `adversarial`; fsr-10, fsr-15, fsr-29 …) | 0/40 |
| governing row `captureState` seed | 7/40 (the same seeds) | 0/40 |
| `powerStructure.factionRelationships` (capture rows) | 6/40 | 0/40 |
| all of `powerStructure` but `conflicts` | 7/40 — the hall alone | 0/40 |
| `powerStructure.conflicts` vs root `conflicts` (the dual address) | 36/40 (F: 0/40) | 0/40 |
| false stored hooks on the regenerated record (`hookTruthRecord.js :: withoutFalseHooks`) | 0/40 | 0/40 |

**Measured and NOT this lane's (named for the chair).** (a) The conflicts' DRAWS and the allegiance receipts differ from F by construction: they are the regen's own re-roll on its own stream (F takes the assembly's `faction-conflicts` child stream and, with the cast held, deals no allegiance). (b) Record-level PROSE that reads the cast — `prominentRelationship`, `pressureSentence`, `coherenceNotes` — and `stress`/`stressors`, `generationCoherenceReceipt` differ between `S ⊕ P` and F on some seeds (6-seed probe: 2, 1, —, 3, 5); the regen does not recompute them (prose is outside this lane's row). (c) The history regen (`regenHistoryPipeline`) derives nothing on a private view outside `history`; its full-generation reference could not be planted (a held `history` pin does not hold through `generateNarratives`: F.history.age read the born 75, not the regen's 203, on fsr-1) — named, not chased.

## 2. The causes (one per commit, red-first)

| # | commit | cause | red-first | cure |
|---|---|---|---|---|
| 1 | `8047c02cd` | the regen derived the hall on its own view and returned no `powerStructure` | `tests/generators/regenDerivedState.test.js` — the state, the governing seed, the capture rows and the whole `powerStructure` but `conflicts` equal F's on fsr-6/10/15/29: **2 failed** at bd07005b9, 3/3 green | the regen re-derives the hall over its FINAL roster (the user's canon merged in) through the full generation's seam `narrativeGenerator.js :: withHallCapture` (exported; an optional `opts`) and the ONE writer `hallCapture.js :: writeHallCapture`, from the RECORD's power structure, and returns it; `opts.rederive` lets the writer re-read a born record — the seed it stamped at birth (equal to the prior state) is re-derived as birth derives it, a seed another hand moved is kept |
| 2 | `157cb756e` | the regen returned its conflicts at the root only; assembly dual-writes them on `powerStructure.conflicts` (the address aiLayer, dailyLifeLogic and generate-narrative read) | the same file, "the conflicts' two addresses are one list": **1 failed** at 8047c02cd, 4/4 green | the returned power structure carries `conflicts`, spelled as assembly spells it |

**One pin re-keyed by identity (cause 1).** `tests/generators/people/hallCapture.test.js`, J-13's seed scan: the writer's own seed lift is a second seed-write LINE inside the same function, so the scan was re-keyed from a line count to `writeHallCapture`'s body by its line span (J-13 is a law of the function: "ONE function owns the state and is its only writer"), with a control that a site outside the body reds. The state scan is untouched (still one site). A fixture arm pins the re-derivation (own seed lifted or re-stamped byte-equal to birth's; without the option the seed stands; a moved seed is kept).

## 3. Golden surfaces and registers

Expected 0, by construction: birth and the held-roster arm pass no option, so `writeHallCapture` and `withHallCapture` run byte-identically there; the change is on the regen path alone. Read at the tip by the full vitest (§4): gm /525, fence /360, prose /1,050, herald, witness, pdf. No register moved; no prose line written (no frame-bearing change, so the 1,000 was not run — the soak births records and the birth path is unchanged).

## 4. Receipts

- The regen suites at the tip: 119/119 in 10 files (regenDerivedState, hallCapture, locksSurviveReroll, regenPreservesUserCanon, regenRngRestore, departedNameProseBoundary, regenIdentityFold, tracePartition, engineRemoteRegenSection, settlementSlice).
- eslint on the five touched files: clean. `tsc --noEmit`: 167 errors at bd07005b9 and at the tip, the same set.
- Red at the base and not this lane's: `tests/generators/regenNpcEnrichment.test.js` "a regen roster carries factionAffiliation and structuralPosition like the generated one" (expected 0 to be greater than 0 — the people car retired `factionAffiliation` from the card).
- The full vitest, base and tip, in clean worktrees: see §5 (tip 28 failed, all of the base's 29; 0 new).

## 5. The full run (clean worktrees, `npx vitest run`, the whole corpus)

| tree | files | tests | read |
|---|---|---|---|
| base `bd07005b9` | 16 failed · 3,114 passed · 8 skipped (3,138) | 29 failed · 37,806 passed · 127 skipped | the base's level |
| `d9b591bc2` (causes 1–2 + record) | 19 failed (3,139) | 33 failed | FIVE new, all this lane's new test file and the engine bundle — cured below |
| tip `1d225ee0c` | 15 failed · 3,116 passed · 8 skipped (3,139) | **28 failed** · 37,813 passed · 127 skipped | **0 new**; every red is one of the base's 29 |

The five reds at `d9b591bc2` and their cures, one commit each:

| commit | red | cure |
|---|---|---|
| `294bb721c` | `seedLoopTotality` (4 bare seed loops in the new file) · `mutationCoverageManifest` TOTALITY (no entry) | the loops through `tests/helpers/seedFailures.js :: collectSeedFailures`; a `rationale` entry citing the executed red-firsts; the timeout moved to the third argument (the lighting walker's `TEST_ARG_FORM` refuses an options object) |
| `34d0c2538` | `sovereigntyLightingContract` ("the estate's file count moved") | the census refrozen by its door (`LIGHTING_CENSUS_REFREEZE` on the clean tree): files 3,138 → 3,139, credited 2,751 → 2,752, titles 28,822 → 28,828, suiteTitles 7,752 → 7,753, parked 387 |
| `1d225ee0c` | `edgeSharedBundleReproducibility` (the engine bundle's recorded sourceHash stale) | `npm run build:edge-shared`: engineBundle.js and its meta (sourceHash 2bfcfeda52a21e94, engineVersion 05db3fde3a30355b); the five sibling metas move only `generatedAt` (one build window, CR-EB-2 (b)) |

Gone at the tip and not this lane's: `domainAnyCastBaseline` "EVERY DECLARED OVERRUN IS ATTRIBUTED" (red at base, green at both lane runs; this lane touches no `src/domain` any-cast). **Golden surfaces: 0 moved** — no golden-master, fence, prose-manifest, herald, witness or PDF arm reds at the base or the tip; nothing to sign.

## 6. CONFIRMED vs PLAUSIBLE

CONFIRMED by execution: the hall's and the conflicts' disagreement at the base (7/40, 36/40) and 0/40 at the tip; the red-firsts red at their parents and green here. PLAUSIBLE: that a governing seed equal to the prior state is always the writer's own birth stamp (a draft record — the store refuses a canon regen — has no play-time ladder; a seed the ladder moved to the same rung would be re-derived).
