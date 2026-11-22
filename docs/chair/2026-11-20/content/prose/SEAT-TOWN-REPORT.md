# SEAT-TOWN REPORT: STAGE A, PARTIAL (parked by PROSE-5 on the owner's word, 2026-11-22T09:11Z)

The base is 482feb7f1 on `lane/prose-5-2026-11-22-seat-town`. Every claim below is marked EXECUTED (run here) or INFERRED (read in the code).

## State: RED. Part 1 has its red test only. Parts 2 and 4 were not started.

- **Part 1, the atom `seat contested`: RED TEST ONLY, NO LEAF.** EXECUTED: I added a new describe block, "the fifth atom: seat contested, over the page's own risk word", to `tests/domain/facts/seatOutranked.test.js`, with three tests. The red run went through the mutex: `Test Files 1 failed (1)`, `Tests 6 passed | 3 skipped (9)`. The cause: `Cannot find module '/src/domain/facts/seatContested.js'` in the block's beforeAll. The six existing tests stayed green. NOT WRITTEN: `src/domain/facts/seatContested.js`, the `FACT_DIMENSIONS` row and the family note in `factVocabulary.js`, the `factsOf.js` getter, the `factLayers.js` LEAVES row, the `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` pin, and the `tests/architecture/factHomesLazy.test.js` HOMES row.
- **Part 2, the challenger pool, and the addendum's item 4 (the hand-list row): NOT STARTED.** The measure is read. INFERRED from reading, to save the next seat time:
  - The pool's declared-row form is `{ text, needs: ['seat contested'], excludes: ['crisis: occupied'] }`. The negative `excludes` form follows the `historyData.js` and `arrivalProse.js` rows. The positive form follows `governanceAccount.js :: OCCUPIED_SEAT`.
  - The name helper is `governanceAccount.js :: powerNameInProse`, which calls `data/people/powerSentenceName.js :: powerNameWithArticle`.
  - The draw is `drawDeclared` with `pickVariantMixed`.
  - The new data file under `src/data/` will red `samenessHideable.walker`'s TOTALITY until its row is added (`HAND_CEILING` 74 -> 75).
  - No pool-dominance row is needed: its corpus does not compose the account.
- **Part 4, TOWN-NOUN: NOT STARTED.** INFERRED: the change is `tier: r?.tier` in `OverviewTab.jsx :: OverviewTab` (the `overviewDesk` memo) and `tier: s?.tier` in `publicProseCompose.js :: PUBLIC_PROSE_SITES` › `'general:overview'`. The `writerReach` walker is a known risk, because the memo callback attributes reads.
- **The lit law (addendum item 8).** INFERRED: this base has no lit who-rules law. There is no `SEAT_CONTEST_LIT` and no `src/domain/seat/`. `coupRiskLabel` and `coupContenders` have one law. The page's risk word is `EngineSections.jsx` and `powerDeskRead.js`, both through `coupRiskLabel(coupContenders(record))`.
- **Gates NOT RUN:** `tests/lint` whole, eslint, `typecheck:ratchet` and `typecheck:domain:strict`.

## The next step

Write `src/domain/facts/seatContested.js :: seatContestedOf`, then wire it into the vocabulary, `factsOf`, `factLayers` and the two lazy pins. Re-run the seatOutranked test to green. Then do Parts 2 and 4, then the stage-A gates.
