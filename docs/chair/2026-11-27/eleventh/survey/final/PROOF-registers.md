# SURVEY-FINAL: the registers S-A, S-A-2, S-A-3 and S-A-4 move (named; re-recorded on this branch: none). Re-read at d2ca58a45.

- WRITER-REACH (`scripts/check-writer-reach.mjs --report`: `PROOF-writerReach-report.txt`; live against
  `scripts/.writer-reach-baseline.json`): two identities become READ, none goes the other way.
  - `isApproved on publicLegitimacy`: LIT, reach dossier-pdf N->R, web-transitive N->R. Read by
    `src/data/historyData.js:2074` (the legitimacy twins), now in the export's and the screen's closures through
    `domain/dossier/storedHookShown.js` (the event hook pools).
  - `religious on stocks`: banked DARK -> LIT-NAME (leaves the banked cohort). Read by name at `src/data/npcData.js:2545`
    (`NPC_FACTION_LOYALTY.religious`), reached through `storedHookShown.js` (the loyalty pools).
  - Population: LIT 705 -> 706, DARK 1406 -> 1405; judged 12,726 unchanged. NONE becomes dark; pending-surface debt: none.
- OBSERVED-SHAPE (`node scripts/check-observed-shape-readers.mjs`: `PROOF-observedShape-check.txt`): exit 0, unmoved (re-read after S-A-4).
- WRITER-REACH after S-A-4: the same two identities, nothing else (re-read at d2ca58a45).
- WIRING CENSUS (`node scripts/wiring-census.mjs --check`: `PROOF-wiringCensus-check.txt`, exit 1 "stale"): the
  regeneration, run in a throw-away worktree of 35faf3361 and not committed, moves ONE field: `producerIndexFiles`
  1468 -> 1472 (the four new src modules: lineOnFinal, institutionDescShown, storedHookShown, printRecord).
  `PROOF-wiringCensus-diff.txt`.
- LIGHTING CENSUS (`tests/lint/sovereigntyLightingContract.walker.test.js`, door `LIGHTING_CENSUS_REFREEZE`;
  `PROOF-lightingCensus-walker.txt`): files 3,827 -> 3,837 (the ten new test files: lineOnFinal, institutionDescShown,
  institutionDescSharedPage, storedHookShown, finalRecordCensus, finalLinesPrintGate, printRecord; S-A-4's
  searchCardAudience, defenseForceCardDesc, houseDescReader); the walker stops at
  that first figure, so credited and the title counts move with them, unmeasured here. Not re-taken.
- THE PROSE WIRING CENSUS WALKER (`tests/lint/proseWiringCensus.walker.test.js`; `PROOF-proseWiringCensus-walker.txt`):
  red for the same stale file as the wiring census above (`producerIndexFiles` only). Not re-taken.
- WALKER TABLES MOVED IN THE UNIT THAT NEEDED THEM (not registers with a door; each said in its commit):
  `ruinFilterRoster.walker.test.js` gains an EXEMPT row for `printRecord.js` (a print copy of the roster) and its reader
  count re-pinned 114 -> 115 by its own scan, as every lane that added a reader did; `scripts/mutation-coverage-manifest.json`
  names the three new invariant files under one rationale (TOTALITY).
- RED ON THE BASE TOO, NOT MINE: `domainAnyCastBaseline` (genesis.js 1 any), `proseComposed`, `proseCorpusBytes`,
  `seedLoopTotality`, `siteCoherenceRatchet`.
