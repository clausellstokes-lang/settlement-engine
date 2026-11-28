# SURVEY-FINAL: the registers S-A, S-A-2 and S-A-3 move (named; re-recorded on this branch: none). Tip 35faf3361.

- WRITER-REACH (`scripts/check-writer-reach.mjs --report`: `PROOF-writerReach-report.txt`; live against
  `scripts/.writer-reach-baseline.json`): two identities become READ, none goes the other way.
  - `isApproved on publicLegitimacy`: LIT, reach dossier-pdf N->R, web-transitive N->R. Read by
    `src/data/historyData.js:2074` (the legitimacy twins), now in the export's and the screen's closures through
    `domain/dossier/storedHookShown.js` (the event hook pools).
  - `religious on stocks`: banked DARK -> LIT-NAME (leaves the banked cohort). Read by name at `src/data/npcData.js:2545`
    (`NPC_FACTION_LOYALTY.religious`), reached through `storedHookShown.js` (the loyalty pools).
  - Population: LIT 705 -> 706, DARK 1406 -> 1405; judged 12,726 unchanged. NONE becomes dark; pending-surface debt: none.
- OBSERVED-SHAPE (`node scripts/check-observed-shape-readers.mjs`: `PROOF-observedShape-check.txt`): exit 0, unmoved.
- WIRING CENSUS (`node scripts/wiring-census.mjs --check`: `PROOF-wiringCensus-check.txt`, exit 1 "stale"): the
  regeneration, run in a throw-away worktree of 35faf3361 and not committed, moves ONE field: `producerIndexFiles`
  1468 -> 1472 (the four new src modules: lineOnFinal, institutionDescShown, storedHookShown, printRecord).
  `PROOF-wiringCensus-diff.txt`.
- LIGHTING CENSUS (`tests/lint/sovereigntyLightingContract.walker.test.js`, door `LIGHTING_CENSUS_REFREEZE`): see the
  whole-lint sweep's line for it in the TIP report.
