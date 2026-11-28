# K1 MEASURE (i): DOES EVERY TOWN HOLD AN `id` FROM BIRTH, AND DOES IT HOLD?

RENAME-BUILD, tree `lane/stack-123-wip-2026-11-28` at 5ad631588 (unchanged), 2026-11-28. Every count is a script's (CONFIRMED) unless marked PLAUSIBLE.

Scripts: `tools/idroads-harness.jsx` (RENAME-MEASURE's `roads-harness.jsx` plus the mint and legacy arms), `tools/legacy-rename.jsx`; bundled by RENAME-MEASURE's `build-rename.mjs`, run by its `rboot-plain.mjs`. Corpus: ten births of C (plan rows 0, 90, ..., 810: two thorps, two hamlets, a village, two towns, two cities, a metropolis). Results: `results/idroads.jsonl`, `results/legacy.jsonl`.

## WHEN the id is minted: AT BIRTH, from `_seed`

`src/generators/steps/assembleSettlement.js:489-508` attaches `_seed` and then runs `normalizeSettlement`, whose step 2 (`src/domain/normalizeSettlement.js:196-198`) stamps `id = idFromSeed(_seed)` where none is present. `generateSettlementPipeline` always has a seed (`options.seed || config._seed || generateSeed()`, line 135).

| check (10 births) | result |
|---|---|
| the fresh, unsaved born record holds a non-empty string `id` | 10 / 10 |
| it is `idFromSeed(_seed)` (normalizing the record with its id removed gives the same id) | 10 / 10 |
| a second normalize keeps it | 10 / 10 |
| a re-generation with the same seed gives the same id | 10 / 10 |

## Is it the same on every road? YES

| road (the product's own functions; RENAME-MEASURE's (B) table) | town `id` equal to the born id | person `id` equal |
|---|---|---|
| R1 local save + reload (`saves.save` -> `saves.list`) | 10 / 10 | 10 / 10 |
| R1c cloud reload (`admitSupabaseSavedSettlementRows`) | 10 / 10 | 10 / 10 |
| R2 JSON export + import | 10 / 10 | 10 / 10 |
| R3 the share's projection (`toPublicSafe` -> `projectShareVeil`) | 10 / 10 | 10 / 10 |
| R4 gallery import (public and full share) | 10 / 10 | 10 / 10 |
| R5 the PDF's input (`buildViewModel`'s `vm.raw`) | 10 / 10 | 10 / 10 |
| R6 Foundry | the id's tail in the module id, 10 / 10 (the full id is not written; the export is frozen at export) | - |

No writer of a saved record replaces `settlement.id` (grep of `src`: `store/saveMoments.js:94` writes the save id into a TELEMETRY copy only; `store/phantomMintAction.js:531` re-addresses a PHANTOM row, and a phantom's forge takes the forged record's own id, `settlementGenerateAction.js :: carriedHistoryOf` rule (b)). The rename writers never touch it (RENAME-MEASURE (C)). So the page does NOT re-deal at the first save.

## A record with NO id (a legacy save, a hand-built fixture)

- `normalizeSettlement` stamps `contentId(record)`, which HASHES THE NAME (with tier, population and a structural fingerprint). Unstamped, the id would move with a rename: 10 / 10 (a legacy record renamed and then normalized gets another id).
- The local save stores the record as given (the stamped id is NOT written at save: 0 / 10), and `saves.list` normalizes on read, so the reloaded legacy record carries `contentId` with its CURRENT name (10 / 10).
- The store's rename (`renameSettlementImpl`, executed with a plain state) writes the NORMALIZED record (`{ ...save.settlement, name }`), so the id minted under the OLD name is persisted on the rename's own write: after the rename and a reload the id is the pre-rename id, 10 / 10. A legacy town therefore keeps its id across its first rename, and its page keeps its picks.
- PLAUSIBLE, not executed: the cloud row takes the same path (`admitSupabaseSavedSettlementRows` normalizes; `persistSaveUpdate` writes the renamed normalized record).
- THE FALLBACK, SAID IN ONE PLACE: `src/domain/display/pickKey.js :: pickKeyOf(holder, fallback)` returns the holder's id when it is a non-empty string, else `fallback`, which each site hands as the key it has today. A record that reaches a site with no id (a hand-built fixture that never passed `normalizeSettlement`) prints exactly what it printed.

Verdict: no STOP. Every town holds its id from birth; it is the same before and after its first save, a reload, the JSON round trip, the share, a gallery import and the PDF's input; Foundry keeps its tail.
