# UK-CURE — report (builder BUC to SEAT-7, 2026-11-20; brief `UK-CURE.md`; base `fad107fcc`)

**Outcome.** BUILT, dark, one code commit `64dbec56c` on `lane/seat-7-2026-11-20-uk-cure` (not pushed). `npcGenerator.js` measures **941 → 930** (eslint `max-lines`, skipBlankLines + skipComments; the sizeBaseline test's own rule); its baseline was LOWERED to 930 by the test's door, with a reason row. One red is NEW, caused by the move and outside this unit's files: `tests/generators/roleCategory.test.js`. STOPPED there, not widened: SEAT-7 rules.

- **The leaf** `src/generators/npc/powerBand.js`: `powerBandOfRole`, `HIGH_POWER`, `MID_POWER`, `MID_POWER_UNDER_LAW`, the fold and the `seatsByHolder` import. Behaviour is verbatim, one statement per line, with the comments carried. UK's `const law, fold, r` declaration is split into three `const` statements in the same order.
- **`npcGenerator.js`**:
  - It imports the leaf on a line of its own and re-exports it with `export { powerBandOfRole };`, so `castPowers.js` and every importer are untouched.
  - UK's packed import line is back to the one import it was at `fb937f369`.
  - `generateNPCPowerLevel` is one statement per line and keeps its one `_rng()` draw.
- **First paint (step 4):** not touched, and `vite.config.js` is not touched. `manualChunks`, executed, routes both `npcGenerator.js` and the leaf to the lazy `engine` chunk by the blanket `/src/generators/` rule. Neither is in `EAGER_FIRST_PAINT_MODULES`. `seatLaw.js` was already eager (engine-core). `FIRSTPAINT2_LAZY_DOMAIN` and `factHomesLazy` cover `src/domain` modules, so neither applies.

| proof | result |
|---|---|
| the 61 test files naming `npcGenerator` or `powerBandOfRole` | 5 failed / 56 passed; tests 6 failed / 659 passed / 37 skipped |
| the known three | `generatorGoldenMaster` 521, `espionageDormancyFence` `dba9ff26…`, `worldFactRederive` A7 7: as UK reported |
| NEW: `roleCategory.test.js` "the mirrored power bands are EXACTLY npcGenerator's own" | red. The test reads `HIGH_POWER` and `MID_POWER` out of `npcGenerator.js`'s source. Its own regex, run over `npc/powerBand.js`, returns the identical arrays. The cure is to point its read at the leaf, a file outside this unit's list |
| NEW, census (not mine): `proseWiringCensus` "THE DRY READ" and "car 0" | red; green at `fad107fcc` (run on an archived base tree). The cause is `producerIndexFiles` 1439 → 1440, which is this unit's one new file (counted in each tree). Not re-recorded, and no census was run |
| `seatBandFold`, `sizeBaseline`, `layerBoundaries`, `engineCoreLazyEdge` | green |
| `typecheck:ratchet` / `typecheck:domain:strict` / `lint` | 167/167, 1113/1113, 0 errors |
| `confine-two.sh fad107fcc 64dbec56c` | EQUAL. Both sides read `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245` |

**Not run (the box is loaded):** `tests/lint` whole. It is expected to name `sovereigntyLightingContract`'s file census (+1, the leaf) and possibly `mutationCoverageManifest`, but both of those are PLAUSIBLE and were not executed.

**CONFIRMED:** everything in the table was executed. **PLAUSIBLE:** that `producerIndexFiles` is the census's only delta. That comes from reading the census code and counting the files, not from running a census.
