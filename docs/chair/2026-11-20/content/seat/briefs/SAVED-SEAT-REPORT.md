# SAVED-SEAT — report (builder BSV, for SEAT-7)

**Outcome: all five arms GREEN; no path re-stamps or wrongly re-reads the seat law. No STOP was fired.** A town born dark stays law 1 on the LIT build through every hop. A town born lit keeps 2. "Apply Saved Configuration & Regenerate" is a birth. The legacy edge (SEAT-6-TO-LIGHT §3, PLAUSIBLE there) is MEASURED here: the town stays law 1. A gallery file and a reconciled export both keep a carried 2, and a markerless one stays markerless.

- **Base:** `450beaba9`. **Branch:** `lane/seat-7-2026-11-20-saved`. Not pushed.
- **Files:** `tests/domain/seat/seatLawSavedTown.test.js` (new) and this report. Nothing under `src/`.

## The arms (each red first by a plant, then restored)

Every plant is ONE hoisted `vi.mock` of a src module, added above the test file's imports. No src file was written. Each plant was run against its one arm (`-t`), then the file was restored from a `cp` backup and verified with `cmp`. The script that applies the plants is `plants/plant.py` in the builder's scratchpad (not committed).

| arm | plant | red title (the failing message) | green |
|---|---|---|---|
| 1 NO MIGRATION | `settlementLifecycleHelpers.js :: activateFaithIfEntitled` (inside `hydrateFromSave`) spreads `newSettlementSeatLaw()` into `config` | `1. ⛔ NO MIGRATION: …` — "the store's load (hydrateFromSave): config acquired _seatLawVersion on the lit build. There is NO MIGRATION, deliberately." | 1/1 |
| 2 THE CONVERSE | the same seam drops `config._seatLawVersion` | `2. THE CONVERSE: …` — "the store's load (hydrateFromSave): config lost _seatLawVersion" | 1/1 |
| 3 THE BIRTH | `generateSettlementPipeline` strips `_seatLawVersion` from its output (a re-derive keeping the saved law, not a birth) | `3. "Apply Saved Configuration & Regenerate" … is a BIRTH, not a migration …` — "markerless: a BIRTH on the lit build is born under the seat law" | 1/1 |
| 4 THE LEGACY EDGE | `regenNPCsPipeline` returns `config: cfg` (the regen writes the config it fell back to) | `4. THE LEGACY EDGE (measured): …` — "no config, no _config: the regen wrote a config onto the legacy town" | 1/1 |
| 5 THE IMPORT | `importScrub.js :: scrubGalleryImportLivingContent` also drops `_seatLawVersion` | `5. THE IMPORT: …` — "the gallery import dropped a carried _seatLawVersion 2" | 1/1 |

Each plant red 1 arm (1 failed, 4 skipped). The restored file is green: 5/5.

## What each arm drives (the LIT build: seat dial = `HOLDER_SEAT_LAW_VERSION`, `SEAT_CONTEST_LIT = true`, every factor 1)

**The fixture.** A born town (`settType: 'town'`, seed `saved-seat-12`): a Town Council whose Merchant Guilds hold the seat by R2. Its Craft Guilds read `merchant` dark and `craft` lit, so the lit contest is a different field from the dark one. The arm asserts this as an anchor.

**Arm 1.**
- The hops: JSON save/load, then `hydrateFromSave` under a LIT form config, then `regenSection` `npcs`, `history` and `'power'`, then `deepClone`, then the pulse `powerTransfer` (`applyWorldPulse.js`) and the roster's `government_change`.
- At every hop:
  - neither echo (`config` or `_config`) carries the key;
  - `resolveSeatLawVersion` reads 1;
  - `coupContenders` equals the dark build's reading, and the holder is still in the field.
- Both transfers are byte-equal to the dark build's, and the form is renamed.
- **Negative control:** the same transfers on the same town stamped 2 keep "Town Council", and `holderOf` reads Merchant Guilds.

**Arm 2.** The same walk under a DARK form config. Both echoes stay 2, the town reads 2, and `coupContenders` is never the dark reading of the unmarked town. The holder leaves the field, and both transfers keep the civic form.

**Arm 3.** `SettlementsPanel.jsx :: onLoad`'s two hops, verbatim, then `generateSettlement` through `settlementGenerateAction.js`.
- The new world is born 2, on both echoes, for three incoming configs: markerless, an incoming 1 and an incoming 3.
- The form config and the saved town are left byte-unchanged.

**Arm 4.**
- **The setup:** a lit world is Library-loaded first, so the form config carries 2 (measured). Then a legacy save with no `config` is opened and regenerated, in two variants: with no `_config`, and with a markerless `_config`.
- **The result:** the town gains no `config` and reads 1. `coupContenders` equals the dark reading.
- **The control:** the two regen passes on a fixed seed are byte-equal with and without the seat marker in the fallback config.

**Arm 5.**
- **Gallery:** the real `importGallerySettlementImpl`. Only the RPC is answered. `stripImportConfidential` and the veil run for real.
- **Reconciliation:** the real `admitExistingCampaignImport`.
- **Anchor:** the living-content marker is dropped on the same configs, which proves both strips ran.

## Gates (every one through `scripts/gate-tail.sh`, to a file)

- The new file: 5/5. Every test file naming `seatLaw.js` (`holderOfSeat`, `seatLawSavedTown`, `seatTransfer`, `seatLawWiring`, `densityCreateBoundary.walker`): 118/118, run twice.
- `tests/lint` WHOLE, last run (JSON reporter): 3270/3271 passed. The one red is `sovereigntyLightingContract.walker` "THE CENSUS IS AN ASSERTION, NOT A SENTENCE": file count 3710 → 3711. That +1 is exactly my new file, `tests/domain/seat/seatLawSavedTown.test.js`. It is SEAT-7's to re-take; not re-recorded. `proseWiringCensus` stayed green.
- The first whole run also red `negativeAssertionAnchor.walker` on MY file: two bare `not.toContain`, at the two "the holder leaves the field" lines. Both are now `expectPresentThenAbsent`, anchored on the dark build's field. The walker re-ran green, and plants 1 and 2 re-ran red after the edit.
- The second whole run printed 219 of 220 files and 3224 of 3271 tests, with no skip category. The third run (JSON) accounts for all 3271. Recorded; not chased further.
- `npm run typecheck:ratchet`: OK (167, ceiling 167).
- `npm run typecheck:domain:strict`: OK (1113, ceiling 1113).
- `npm run lint`: 0 errors, 38 warnings, none in the new file.

## For SEAT-7 to rule

1. **A brief mismatch.** The brief asks for "`regenSection` of the POWER section". `settlementRegenAction.js :: regenSectionAction` has only `npcs` and `history` branches. I drove both of them, and drove `'power'` as a MEASURED no-op on `powerStructure`. That pin reds the day a power branch lands. (`operationRegistry.js`'s `regenSection` description, "for example its power structure or economy", describes no live branch. Recorded only.)
2. **The census delta is mine by name.** The new file `tests/domain/seat/seatLawSavedTown.test.js` (see the lint line above). Neither census was re-recorded.
3. **A first-cut defect, recorded.**
   - The first cut swapped module registries for each build (`vi.resetModules` + `vi.doMock`, the template's seam). Run beside four other files, it red its own build guard once, in arm 4: the lit birth minted nothing.
   - The cure: one hoisted mock per dial module, read live off one switch. There is no registry to go stale.
   - The template's `boundaryWithLitLaw` idiom carries the same exposure. I PLAUSIBLY attribute the cause to a stale in-flight import refilling the fresh registry, but did not isolate the import.

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED (run): every claim above, each arm red by its plant and green restored.
- PLAUSIBLE: the attribution of the first cut's one red to a stale import.
- Not tested: the account-file import path (`accountImportBody.js`), and the DM's `CHANGE_RULING_POWER` path.
