# SAVED-TOWN report (fortune U7), builder for FORTUNE-4, 2026-11-20

Cut from 6011487af on `lane/fortune-4-saved-2026-11-20`. Files: NEW `tests/domain/fortuneLawSavedTown.test.js`, this report. Nothing under `src/`.

**The answer: a saved town keeps its law on the lit build. No FINDING; no STOP.** Two builds sit in one file, both made with the wiring file's `vi.doMock` seam: DARK (the dial at 1) and LIT (the dial at 2). Neither reads the product's dial, and every arm opens by asserting LIT is lit and DARK is dark. The town is a metropolis (seed `saved-town-metropolis-0`) at 75 Endorsed under law 1 and 65 Approved under law 2, so "equals the dark build's" can fail.

**Mismatch, recorded:** `regenSectionAction` has no `power` or `economy` branch; only `npcs` and `history` regenerate. The arm drives `power` and `economy` and pins them as no-ops, and drives `npcs` and `history` with a "changed" control. Power and economy are re-run by the edit re-derive: a staged add-decree, EM-E1's tick, then `storedConfigFor`, then `regenerateWithLayer`.

**Arm 5 (EXECUTED):** a legacy save with no `config` regenerated against a lit form config keeps no `config` and reads 1. The same pass with the same seed, run with and without the form's marker, writes byte-identical output.

**Not driven:** the campaign re-bind (`campaignContentBindingSession.js :: previewFixture`) needs a campaign content binding.

**Gates (one at a time, each to its own file):**
- The 9 files that name fortuneLaw (`grep -rl fortuneLaw tests`; one of them is `tests/lint/densityCreateBoundary.walker.test.js`): 153/153.
- `tests/lint`: 3270/3271. The one red is the lighting census, `sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN ASSERTION…", file count 3714 to 3715 (FORTUNE-4 takes it).
- typecheck:ratchet: 167/167. domain:strict: 1113/1113. lint: 0 errors.

Each plant was planted in `src/`, run, and restored from a backup (`git status -- src` clean).

| Arm | Plant | Red title(s) | Green |
|---|---|---|---|
| 1 | `migrateSettlementConfig` spreads `newSettlementFortuneLaw()` | "1. ⛔ NO MIGRATION: …" (step `load: migrateSettlementConfig` reads 2); also 4a | 9/9 |
| 2 | `storedConfigFor` drops `_fortuneLawVersion` | "2. THE CONVERSE: …" (re-derive reads 1); "1. NEGATIVE CONTROL: …" | 9/9 |
| 3 | `validateSettlementConfig` spreads the mint | "3. THE SURVEYOR'S PREVIEW is UNMINTED, pinned as ruled: …" | 9/9 |
| 4 | generate action deletes the marker after `birthConfig` | "4a. … is a BIRTH, not a migration …"; "4b. the full reroll … is a BIRTH …" | 9/9 |
| 5 | regen writes `cfg` onto a config-less world | "5. THE LEGACY EDGE (measured): …" (hasConfig, reads 2) | 9/9 |
| 6 | `scrubImportedConfig` drops `_fortuneLawVersion` | "6. THE IMPORT: …" | 9/9 |

EXECUTED: every arm, plant and gate above. PLAUSIBLE: nothing claimed. The campaign re-bind was not driven.
