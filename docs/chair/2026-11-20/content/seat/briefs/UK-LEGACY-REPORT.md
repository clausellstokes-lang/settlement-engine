# UK-LEGACY — report. Builder BUL, for SEAT-10.

Written 2026-11-22T03:11:14Z (date -u). Tree: the scratch clone `bul`, branch `uk-legacy`, from the brief's commit `18e291616`. The commit sha is in the hand-back message (a commit cannot name its own sha).

## THE CURE (diff summary)

- `src/domain/seat/seatLaw.js :: withRecordSeatLaw(config, record)` — the ONE new export. It reads the record's law through `resolveSeatLawVersion(record)` (the one resolver; no second reader of the key) and returns the handed config with the seat key set to the record's: the same reference when the two already resolve alike (so a regen whose handed config IS the record's config is untouched, byte for byte); else the key stripped (record law 1, no marker) or set to the record's version. Every other key is the handed config's. Imports nothing (the leaf stays a leaf).
- `src/generators/generateSettlementPipeline.js :: regenNPCsPipeline`, `:: regenHistoryPipeline` — the parameter is renamed `handedConfig`, and the first line binds `const config = withRecordSeatLaw(handedConfig, settlement)`; every later use of `config` in each pass (`createGenerationContext`, `generateRepresentatives`, the enrichment view `{ ...settlement, npcs, config }`, `drawTies`, `generateConflicts`, `dealGoals` / `dealRareSecrets` / `refuseWantsBesideSecrets` views, `withHallCapture`, `generateHistory`) now reads the record's seat law. One seam: the store (`settlementRegenAction.js`) and the engine service (`serviceEntry.js` re-export) both call these two passes. JSDoc `@param` renamed.
- `src/generators/npc/powerBand.js :: powerBandOfRole` — comment only: the "born config" note now names the regen rule.
- Nothing in `tests/`. At BIRTH nothing changes (the helper is called only in the two regen passes).
- The mechanism the brief marked PLAUSIBLE is now CONFIRMED by the cure's effect: with only this seam changed the red goes green (below), and a pre-cure copy (HEAD's two source files restored) reproduces the red.

## GREEN (each run single-file through `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 <file>`, output to a file, read after; final runs 03:07:05Z–03:10:28Z)

1. **The red goes green** — CONFIRMED. `tests/domain/seat/seatLawSavedTown.test.js` **5/5** unflipped. Pre-cure control (copy with HEAD's `seatLaw.js` + `generateSettlementPipeline.js`, 03:03:22Z): **1 failed | 4 passed**, arm 4, "no config, no _config: the seat marker in the fallback config moved regenNPCsPipeline" — the brief's red, reproduced.
2. **Green flipped too** — CONFIRMED. A second copy of the cured tree outside the repository (`scratchpad/bul-flipped`, never committed), exactly the two dial edits (`diff -rq` of `src` and `tests` against the clone shows only these two files): `seatLawSavedTown.test.js` **5/5**. The diff is below.
3. **Unmoved** — CONFIRMED, each green unflipped:
   - `tests/generators/seatBandFold.test.js` 13/13
   - `tests/generators/roleCategory.test.js` 42/42
   - `tests/domain/seat/holderOfSeat.test.js` 51/51
   - `tests/domain/seat/seatContest.test.js` 25/25
   - `tests/domain/seat/seatLawSavedTown.test.js` 5/5
   - `tests/domain/seat/seatTable.test.js` 45/45
   - `tests/domain/seat/seatTransfer.test.js` 39/39
   - (extra, not on the list: `tests/domain/seatLawWiring.test.js` 6/6)
4. **The registers' doors** — CONFIRMED, all green, nothing moved, nothing re-taken:
   - `tests/lint/sizeBaseline.test.js` 3/3 (`generateSettlementPipeline.js` 740 → 747 lines, under its 800 layer ceiling; `seatLaw.js` 141 → 163)
   - `tests/lint/densityCreateBoundary.walker.test.js` 17/17 (the new export is not a `MINT_SYMBOLS` name)
   - `tests/lint/writerReach.walker.test.js` 52/52
   - `node scripts/wiring-census.mjs --dry`: exit 0, "the committed register is CURRENT; nothing was written", delta 0, ROWS that would move: 0
   - `tests/lint/sovereigntyLightingContract.walker.test.js` 34/34
   - Also run (not gates of the brief): `npx eslint` on the three changed files, exit 0; `node scripts/check-domain-strict.mjs` (via `gate-tail.sh`), exit 0, "1113 errors, ceiling 1113".
5. **Dark: no birth moves** — not run, by the brief (the integrator's confine-two).

## THE FLIPPED COPY'S DIFF (scratchpad/bul-flipped, against the cured tree)

```diff
--- a/src/domain/seat/seatLaw.js
+++ b/src/domain/seat/seatLaw.js
@@ -74,7 +74,7 @@
  *  kernel the day that dial was lit): a dial's type is the SPACE of versions, never today's
  *  setting, so the mint's dormant comparison stays reachable when the dial moves.
  *  @type {number} */
-export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;
+export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;
 
 /**
  * The seat-law version a value selects. Only an enabled NUMBER that is not the default selects
--- a/src/domain/seat/seatCircumstances.js
+++ b/src/domain/seat/seatCircumstances.js
@@ -47,7 +47,7 @@
  * space of settings, never today's, so a reader's dark branch stays reachable when the dial moves.
  * @type {boolean}
  */
-export const SEAT_CONTEST_LIT = false;
+export const SEAT_CONTEST_LIT = true;
 
 /**
  * THE FACTOR TABLE (CS5): circumstance -> kind -> factor (a kind absent from a row takes 1), and the ceiling the
```

## THE SWEEP

Grep: `grep -rn "seatsByHolder\|resolveSeatLawVersion\|_seatLawVersion\|SEAT_LAW_CONFIG_KEY" src`, plus the callers of each reader followed back (`coupContenders`, `transferRulingPower`, `powerBandOfRole`). All rows PLAUSIBLE (read) unless marked CONFIRMED.

| Road | `file :: symbol` | Reads | Verdict |
|---|---|---|---|
| regenerate | `generators/npc/powerBand.js :: powerBandOfRole` via `npcGenerator.js :: generateNPCPowerLevel` via `people/representatives.js :: generateRepresentatives` in `regenNPCsPipeline` | the HANDED config (`settlement.config \|\| config`: the form config for a legacy save) | **CURED HERE** (CONFIRMED by arm 4): the pass hands down `withRecordSeatLaw(handedConfig, settlement)`. |
| regenerate | `people/castPowers.js :: contendersOf` → `rulingPowerCoup.js :: coupContenders` (`seatsByHolder(settlement)`), reached through `narrativeGenerator.js` `landMemberships(settlement, …)` inside `enrichNpcCoherence(view)` | the regen's VIEW `{ ...settlement, npcs, config }`, whose `config` was the handed one (for a legacy save the view's only config) | **CURED HERE**: the view's `config` is now the record-keyed one. Same for the `{ ...settlement, config, … }` views handed `dealGoals`, `dealRareSecrets`, `refuseWantsBesideSecrets`, `withHallCapture` (no seat reader found in them by the grep; covered anyway). |
| regenerate | `regenHistoryPipeline` → `historyGenerator.js :: generateHistory({ ...config, _seed })`; `historyCoherence.js :: enrichHistoryCoherence(carried, settlement)` | handed config / the record | No seat reader found below either; the pass is re-keyed anyway, so the rule holds when one lands. **CURED HERE** (pre-emptively). |
| regenerate | `store/settlementRegenAction.js :: regenSectionAction` (`cfg = settlement.config \|\| config`) | hands the fallback; reads no law itself | **NAMED, not changed** (outside the manifest, and not needed): the passes now ignore its seat key. |
| regenerate (service) | `supabase/functions/engine-generate/index.ts` → `_shared/engineBundle.js :: regenNPCsPipeline` | the wire config | **NAMED**: the committed bundle is a BUILD (`scripts/build-edge-shared.mjs`, `builtFromCommit d989d32`, 2026-11-19) that predates the seat train — `grep -c "function seatsByHolder\|MID_POWER_UNDER_LAW"` = 0 — so the hosted pass reads no seat law at all (law 1 everywhere). The cure reaches it when the bundle is rebuilt; that rebuild is outside the manifest and not this unit's. |
| regenerate | `people/castPowers.js :: raiseToOfficeBand` → `powerBandOfRole(officeRole)` | NO config (law 1 always), at birth and regen alike | **NAMED**: its own comment says "no config: the old law" (COHERENCE-POWERS-5). Not a handed-config reader; whether a lit world's office band should fold is a seat-train question, outside the manifest. |
| re-derive | `store/editSlice.js` → `settlementRederiveAction.js :: regenerateWithLayer` → `domain/edit/dmLayer.js :: rederive` → `generateSettlementPipeline(configPrime)` | `editSlice.js :: storedConfigFor`: the save ROW's own stored `config`, else the record's `_config`, else `{}` — never the live form config | Reads the record's stored config (a BIRTH-shaped re-run under `densityLaw.js`'s header rule, classified non-minting by the walker, so it carries the stored marker, not the dial's). Its config IS the save's own. **NAMED residue**: the provenance of the row's `config` versus `settlement.config` was not traced end to end; it prefers `row.config` and never reads `record.config`. |
| birth (Library "Apply & Regenerate") | `density/densityCreateBoundary.js :: birthConfig` | strips the handed `_seatLawVersion` (`_incomingSeatLaw`) and mints the dial's | Reads the DIAL, by design (arm 3, green). Unchanged. |
| clone | `domain/clone.js :: deepClone` | no config logic (no seat-key reference) | No reader; the marker travels with the copy. |
| load | `store/settlementSlice.js :: hydrateFromSave` | sets `state.settlement`, leaves `state.config` (the form) alone | No reader. It is how the form can hold ANOTHER world's marker over a legacy save — the precondition of arm 4, now harmless to the regen passes. |
| load | the Library load (`updateConfig(migrateSettlementConfig(settlement._config \|\| config))`; the test's `libraryLoad`) | WRITES the form from the loaded town's `_config` | A writer to the form, not a reader. Unchanged. |
| load / import | `lib/importReconciliation.js` | no seat-key reference (grep empty) | No reader; a carried marker is kept (arm 5, green). |
| pulse / events (off the four roads) | `worldPulse/stressorDynamics.js` (`seatsByHolder(entry.settlement)`), `worldPulse/factionCompetition.js` (`item.settlement`), `worldPulse/convergence.js`, `worldPulse/irregularForce.js`, `worldPulse/stressorGates.js` (`coupContenders`), `worldPulse/applyWorldPulse.js` (`transferRulingPower(liftOccupationAuthority(next, …))`), `worldPulse/applyWorldPulseFactionRoster.js` (`rulingView` = the settlement), `events/mutateWorld.js :: changeRulingPower` | the RECORD (or a spread of it) | Read the record. Unchanged. |
| display (off the four roads) | `dossier/powerStrata.js :: derivePowerStrata`, `display/stateProse/printProse.js`, `components/new/powerDeskRead.js`, `components/dossier/EngineSections.jsx` (`coupContenders(settlement)`) | the record | Read the record. Unchanged. |
| birth (power) | `power/factionStanding.js :: annotateFactionStanding` (`coupContenders({ …, config: seat.config })`); callers `power/rulingStructure.js` (hands `{ publicLegitimacy }`, no config) and `power/rosterText.js` | a partial seat; with no `config` it reads law 1 (fail closed, by its comment) | **NAMED**: a birth-time partial, not on a regen road (no regen pass regenerates power). Whether the birth should hand the born config there is outside this unit. |

## NOTES

- `seatLaw.js`'s header still says its one generation-side importer is the create boundary; `npc/powerBand.js` already imported it before this unit, and the pipeline now does too. Comment drift outside the one-export allowance; NAMED, not edited.
- `npcGenerator.js:128`'s comment ("the born config … carries the seat law") is outside the manifest; NAMED.
- Run outputs: `scratchpad/bul-runs/` (not committed).
