# CLOSE-WALKERS hand-back (2026-11-18)

The seat CLOSE-WALKERS of THE CLOSE (the sixth chair's `docs/chair/2026-11-18/close/BRIEF-CLOSE.md`, rules C1 to C10).
Base `70e557d5bdffdf00ac45fb2ec4566674e6a33674` (`lane/join-2026-11-14`, frozen); branch `lane/close-walkers-2026-11-18`.
No file under `src/` is touched. Files written: test files, `scripts/mutation-sweep.sh`, `scripts/mutation-coverage-manifest.json`,
and this hand-back. No stored figure is re-taken (no register, census, ledger, golden, ceiling or bundle is written), so the
table of C3 has no rows.

## The class of every red of the list (C1)

All five are class (b) in substance: a law of the test corpus, red because test files written during the rounds broke it; the
cure is the law's own rule applied to the test file, never the law's figure.

| item | law (its own test) | message at the base | at the tip |
|---|---|---|---|
| W1 | `tests/lint/mutationCoverageManifest.test.js` "TOTALITY: every enumerated invariant file has a manifest entry" | 7 files with NO mutation-coverage entry: `tests/generators/bar5WorldLines.test.js`, `bar7Lines.test.js`, `bar7Scenes.test.js`, `bar8FishRows.test.js`, `bar8Rows.test.js`, `bar8Scenes.test.js`, `rareSecretsLaw.test.js` | green (10 of 10 tests of the file) |
| W2 | `tests/lint/seedLoopTotality.walker.test.js` "no NEW bare seed loop anywhere in the test corpus" | `tests/pdf/seamPdfReadsTheTabs.test.jsx: 2 bare seed loop(s) at line(s) 93, 120 (frozen ceiling 0)` | green |
| W3 | `tests/lint/negativeAssertionAnchor.walker.test.js` "no NEW un-anchored negative assertion anywhere in the test corpus" | 7 files, 21 sites: `bar7EconTab.test.jsx` 134, 160, 243; `leftChainCards.test.jsx` 194, 198, 224, 267; `bar6ScenesGoods.test.js` 225; `bar6SeamDesks.test.js` 66, 112, 134, 148, 162; `bar6SeamEcon.test.js` 57, 96, 104, 116, 117, 130; `leftLines.test.js` 137; `seamPdfReadsTheTabs.test.jsx` 115 (each "frozen ceiling 0") | green (the list empty) |
| W4 | `tests/lint/proseDrawnAnchors.walker.test.js` "no NEW file carries a literal state-prose anchor, and no frozen row grows" | `tests/domain/bar6SeamDesks.test.js: 1 (frozen none)` (line 133, DS-GEN-16 LEGACY-RECOVERED vid 2, 70 fixed chars); `tests/security/staffUnlockSurveyorEntitlement.pglite.test.js: 1 (frozen none)` (line 149, a test's label aligning on DS-POW-5 autocrat vid 6, 19 fixed chars) | green |
| W5 | `tests/lint/sovereigntyLightingContract.walker.test.js` "THE EACH-FAMILY PARK DEBT ONLY SHRINKS" | `expected 113 to be less than or equal to 108` | green: 106 (≤ 108) |

## W1 · the manifest entries, each with the planted regression that earns it

Each entry is `kind: "mutation"`; each label joins one `check_caught` call of `scripts/mutation-sweep.sh` (plants #125 to #131, before the results block), and `MUTATED_FILES` gains the six new targets (`settlementOriginProse.js` was already guarded). MEASURED: the seven plant blocks, verbatim, run through the sweep's own `check_caught` in a scratch git worktree of the base (`git worktree add --detach`, my checkout never mutated): every one `CAUGHT  ok` with its expected title matched exactly once, its target restored byte-identically (`git diff --quiet`), its gate green again on the restored tree. No guard was found that no revert reds (no class (c) to name).

**`tests/generators/bar5WorldLines.test.js`**
```json
    "tests/generators/bar5WorldLines.test.js": {
      "kind": "mutation",
      "label": "bar5-world/the road arm's origin row founds no town"
    },
```
Plant: `ORIGIN_POOLS.road`'s row put back to "Founded roadside, …" (BAR5-WORLD (a)'s reword reverted), in `src/generators/narrative/settlementOriginProse.js`. Clean 6 passed; planted 2 red, 4 passed (title_matches=1); restored 6 passed.
```sh
perl -0pi -e "s/'It stands roadside, where the day is measured in traffic/'Founded roadside, where the day is measured in traffic/" src/generators/narrative/settlementOriginProse.js
check_caught "bar5-world/the road arm's origin row founds no town" src/generators/narrative/settlementOriginProse.js "npx vitest run tests/generators/bar5WorldLines.test.js --no-file-parallelism" "no row of the road arm founds the town; the row says where it stands"
```

**`tests/generators/bar7Lines.test.js`**
```json
    "tests/generators/bar7Lines.test.js": {
      "kind": "mutation",
      "label": "bar7-lines/forty to sixty years is two generations"
    },
```
Plant: `yearBand`'s two-generations reading switched off (BAR7-LINES low.generation reverted), in `src/domain/display/stateProse/generalStateProse.js`. Clean 7 passed; planted 1 red, 6 passed (title_matches=1); restored 7 passed.
```sh
perl -0pi -e "s/return generation\.id === 'a_generation' && years >= 40 \?/return false ?/" src/domain/display/stateProse/generalStateProse.js
check_caught "bar7-lines/forty to sixty years is two generations" src/domain/display/stateProse/generalStateProse.js "npx vitest run tests/generators/bar7Lines.test.js --no-file-parallelism" "low.generation: forty to sixty years is two generations; the band keeps its id"
```

**`tests/generators/bar7Scenes.test.js`**
```json
    "tests/generators/bar7Scenes.test.js": {
      "kind": "mutation",
      "label": "bar7-scenes/the kilns are answered by a house that fires a kiln"
    },
```
Plant: the `kilns` key reads every kiln-trade house again (`kilnHousesAnswering` bypassed: BAR7-SCENES item 1 reverted), in `src/domain/facts/tradeAtWork.js`. Clean 14 passed; planted 1 red, 13 passed (title_matches=1); restored 14 passed.
```sh
perl -0pi -e "s/const answering = key === 'kilns' \? kilnHousesAnswering\(houses\) : houses;/const answering = houses;/" src/domain/facts/tradeAtWork.js
check_caught "bar7-scenes/the kilns are answered by a house that fires a kiln" src/domain/facts/tradeAtWork.js "npx vitest run tests/generators/bar7Scenes.test.js --no-file-parallelism" "rand-32's houses, planted: the Potter, the Brickmaker and the Charcoal burner all short beside working Glassmakers: no \"kilns are lit\""
```

**`tests/generators/rareSecretsLaw.test.js`**
```json
    "tests/generators/rareSecretsLaw.test.js": {
      "kind": "mutation",
      "label": "rare-secrets/a magic row stands only where magic works"
    },
```
Plant: the dealer's `(!r.magic || place.magic)` filter removed (SECRETS-1's magic arm reverted), in `src/generators/people/rareSecrets.js`. Clean 22 passed; planted 1 red, 21 passed (title_matches=1); restored 22 passed.
```sh
perl -0pi -e 's/const lawful = rows\.filter\(\(r\) => \(!r\.magic \|\| place\.magic\) && /const lawful = rows.filter((r) => /' src/generators/people/rareSecrets.js
check_caught "rare-secrets/a magic row stands only where magic works" src/generators/people/rareSecrets.js "npx vitest run tests/generators/rareSecretsLaw.test.js --no-file-parallelism" "a world without magic holds no magic row (planted, every row; and over a hundred seeds of a large roster)"
```

**`tests/generators/bar8Rows.test.js`**
```json
    "tests/generators/bar8Rows.test.js": {
      "kind": "mutation",
      "label": "bar8-j-rows/one house, one material, one gap line"
    },
```
Plant: both strikes of the told goods in `resourceGapLines` reverted (`left = goods` / `left = nouns`: BAR8-J-ROWS G1), in `src/domain/display/validationOnPage.js`. Clean 6 passed; planted 3 red, 3 passed (title_matches=1); restored 6 passed.
```sh
perl -0pi -e 's/const left = goods\.filter\(\(x\) => !told\.nouns\.has\(x\.noun\)\);/const left = goods;/; s/const left = nouns\.filter\(\(n\) => !told\.nouns\.has\(n\)\);/const left = nouns;/' src/domain/display/validationOnPage.js
check_caught "bar8-j-rows/one house, one material, one gap line" src/domain/display/validationOnPage.js "npx vitest run tests/generators/bar8Rows.test.js --no-file-parallelism" "no town prints the general line beside the story line of the same house; the story line still prints"
```

**`tests/generators/bar8Scenes.test.js`**
```json
    "tests/generators/bar8Scenes.test.js": {
      "kind": "mutation",
      "label": "bar8-scenes/nobody looks hungry wants the food band secure or better"
    },
```
Plant: the row's `needs: ['food: ≥ secure']` removed (BAR8-SCENES item 7 reverted to its base form, `git show 680a5b2a7`), in `src/data/arrivalProse.js`. Clean 25 passed; planted 1 red, 24 passed (title_matches=1); restored 25 passed.
```sh
perl -0pi -e 's/(nobody looks hungry\.\x27, )needs: \[\x27food: [^\x27]*secure\x27\], /$1/' src/data/arrivalProse.js
check_caught "bar8-scenes/nobody looks hungry wants the food band secure or better" src/data/arrivalProse.js "npx vitest run tests/generators/bar8Scenes.test.js --no-file-parallelism" "bar0-metropolis-calm-rand-29: a prosperous metropolis whose food band is pressured"
```

**`tests/generators/bar8FishRows.test.js`**
```json
    "tests/generators/bar8FishRows.test.js": {
      "kind": "mutation",
      "label": "bar8-fish-rows/where the fish is bought in the catch row is its inland alternative"
    },
```
Plant: the narratives step's call of `boughtFishRowsInPlace` disabled (BAR8-FISH-ROWS BR24 reverted), in `src/generators/steps/generateNarratives.js`. Clean 9 passed; planted 4 red, 5 passed (title_matches=1); restored 9 passed.
```sh
perl -0pi -e 's/^  boughtFishRowsInPlace\(/  if (0) boughtFishRowsInPlace(/m' src/generators/steps/generateNarratives.js
check_caught "bar8-fish-rows/where the fish is bought in the catch row is its inland alternative" src/generators/steps/generateNarratives.js "npx vitest run tests/generators/bar8FishRows.test.js --no-file-parallelism" "BOUGHT: the fish bought in, the Fish market sells its \"Preserved fish\" with its own words, and no morning catch"
```

## Each file changed, and what was done to it

| file | law(s) | what |
|---|---|---|
| `scripts/mutation-sweep.sh` | W1 | plants #125–#131 (the blocks above, each with its measured note); six `MUTATED_FILES` rows |
| `scripts/mutation-coverage-manifest.json` | W1 | the seven entries above (after `smallPlaceMarket`); `uncoveredBaseline` untouched (186) |
| `tests/pdf/seamPdfReadsTheTabs.test.jsx` | W2, W3, W5 | the two bare seed loops (93, 120) and the two `test.each` tables (78, 101) are `collectSeedFailures` loops inside plain parameterless tests; the stored-label negative (115) is `expectAbsentWithAnchor(text, stored, shown)`, the anchor the tab's own label, whose positive line is kept |
| `tests/pdf/pdf2ReadsTheTabs.test.jsx` | W5 | `test.each(NEGATIVES)` (262) → one test, rows collected |
| `tests/pdf/leftPdfReadsTheTabs.test.jsx` | W5 | `test.each(NEGATIVES)` (235) → one test, rows collected |
| `tests/domain/bar7DesksLines.test.js` | W5 | its two `test.each` (165, 273) → collected loops; the label loop's two existing `// anchored:` markers kept on their lines |
| `tests/domain/bar5LawBandFloor.test.js` | W5 | `test.each(REAL_ROWS)` and `test.each(CONTROLS)` (81, 92) → collected loops |
| `tests/generators/bar2Places2Rows.test.js` | W5 | its two `it.each` (71, 84) → collected loops (imports `seedFailures.js`) |
| `tests/domain/bar6SeamDesks.test.js` | W3, W4, W5 | four `test.each` → collected loops; 66 marker (`hit.length` is exactly 1 on the line above); 112 `expectAbsentWithAnchor(src, 'adulterating grain and leather', "Suppliers adulterating the grain and provisions sold to the army's contracts.")` (the positive line kept); 133 the DS-GEN-16 sentence computed: `variantByVid({ leaf: 'general', blockId: 'DS-GEN-16', poolKey: 'LEGACY-RECOVERED', vid: 2 })` with its three slots filled by their own braces, which returns the literal byte for byte at the base (probed: `===` true); 134 `expectAbsentWithAnchor(Object.values(CLASS_DIMS).flat(), 'legacy ruin', 'court sits')` (`court sits` is in the `law` and `office` classes at the base; item 6 asserts it); 148 `expectAbsentWithAnchor(nobles(rival), 'The merchant guilds now have more say', 'the noble families keep their titles, their land and their precedence, but the money has moved.')` (printed beside each of the three rivals at the base, probed); 162 marker (a literal list built here; the line above proves the word moved) |
| `tests/security/staffUnlockSurveyorEntitlement.pglite.test.js` | W4 | the test LABEL "the paying subscriber is unaffected — the original question still answers" (it aligned on DS-POW-5 autocrat v6) re-worded "the paying subscriber is unaffected: a subscriber still reads entitled"; its assertion untouched |
| `tests/components/bar7EconTab.test.jsx` | W3 | 134 `expectAbsentWithAnchor(cards.alchemical, 'Operational', 'Alchemical Trade')` (the card's own title, which the card text opens with); 160 `expectPresentThenAbsent(record.outputs, outs, 'Ship construction')` (the record yields it, the line above asserts it); 243 `expectAbsentWithAnchor(text, METAL_SHORT_LINE, METAL_WORKED_LINE)` (the positive line kept) |
| `tests/components/leftChainCards.test.jsx` | W3 | 194: the Via's non-empty check moved above it, one-line marker; 198: a new positive (the rendered Via names the card's first other house) and a marker on the assertion's line; 224 `expectAbsentWithAnchor(SOURCE_GROUNDS[id], chain.resourceKey, OWN_GROUND_OF[id])` with `OWN_GROUND_OF = { charcoal_burner: 'managed_forest', salt_works: 'salt_flats' }`, both in their rows at the base; 267 `expectAbsentWithAnchor(textOnTab(s), twin, METAL_WORKED_LINE)` (the line above pins the share to it) |
| `tests/domain/bar6ScenesGoods.test.js` | W3 | 225 `expectAbsentWithAnchor(GOOD_TRADES.ironwork.houses, 'smelter', 'blacksmith')` |
| `tests/domain/bar6SeamEcon.test.js` | W3 | 57 and 96 anchored on the sibling the line above already asserts prints (`still`, 'Flour and meal'); 104 `expectPresentThenAbsent` (the Fuller with its wool, then without); 116, 117 `expectPresentThenAbsent(record.primaryExports / record.localProduction, printed, g)` (probed at the base: both arms goods are on both record lists, on neither printed list); 130 `expectAbsentWithAnchor(desc, 'poor road', 'operating on stockpiles only')` (the next line's positive) |
| `tests/domain/leftLines.test.js` | W3 | 137: one-line marker (a literal list built here; the next line pins the impression to the cautious line) |

Every converted or re-anchored test keeps its claim: no assertion dropped or loosened (`expect(...).toContain` positives beside the helpers are kept, two assertions became the helper's own pair only where the helper asserts both). The `each` titles carried `%s`; each table is now one literal title, and the failing row is named by `collectSeedFailures`.

## W5 · the count after each conversion (newest first)

The ceiling froze at 108 in `72de052f3` (2026-11-07 06:39). The seven each-only files whose `.each(` landed after it (`git log -S".each("` on each of the 113, after `git fetch --unshallow`): `pdf2ReadsTheTabs` (26276ad39, 11-17 21:43), `leftPdfReadsTheTabs` (bd7ea103d), `bar7DesksLines` (ccf62fa52), `bar6SeamDesks` (6947abd6d), `seamPdfReadsTheTabs` (8d0c1924b), `bar5LawBandFloor` (6c7068c05, 11-16), `bar2Places2Rows` (534c29fac, 11-15). Every other each-only file is dated on or before 2026-11-04. Each converted file leaves the set alone, so the count falls by one each: 113 → 112 → 111 → 110 → 109 → 108 → 107 → 106. MEASURED (a scratch copy of the walker that writes its `eachOnly` set to a file, run in place and deleted): 113 at the base; 107 with all but `seamPdfReadsTheTabs` converted; **106 at the tip**, none of the seven in the set. No file was found whose `each` could not become a loop. (113 − 7 = 106 while the ceiling sat at 108 means two earlier files left the set since the freeze; the ceiling is a stored figure, not mine: it is not lowered here.)

THE CENSUS ARM ("THE CENSUS IS AN ASSERTION … the estate's file count moved") reads at my tip exactly as at the base: `expected 3682 to be 3641`. I added no file. Its test-title figures move with my conversions (each `%s` table is now one title): a stored figure re-taken LAST by another seat (C8).

## The proofs

- Each law ALONE at the tip, green: the manifest test (10 passed); the three walkers W2/W3/W4 together (24 passed); W5's arm green in the full `tests/lint` run. Each red at the base (the base run below).
- Each changed test file ALONE at the tip, green: bar7EconTab 13, leftChainCards 8, bar5LawBandFloor 3, bar6ScenesGoods 11, bar6SeamDesks 18, bar6SeamEcon 6, bar7DesksLines 17, leftLines 4, bar2Places2Rows 5, leftPdfReadsTheTabs 6, pdf2ReadsTheTabs 6, seamPdfReadsTheTabs 4, staffUnlockSurveyorEntitlement.pglite 9.
- Each shown ABLE TO FAIL in scratch (one expectation broken in a copy in the scratch worktree, run, restored by `git checkout` there): all thirteen red, one test each. W2's proof: with `r2s-under_siege-metropolis-0`'s expectation broken, the collected message reads "every OPS town holds an operation the tab marks — 1 of 3 case(s) failed … [1] r2s-under_siege-metropolis-0 — expected true to be false". The loops name their row likewise (bar7DesksLines: `[10] ["Desert/Arid"]`); a broken anchor reds as `LIVENESS ANCHOR` (bar7EconTab, leftChainCards, bar6ScenesGoods, bar6SeamEcon, bar2Places2Rows, bar6SeamDesks); leftLines and the pglite label test red on their own assertions.

## The net (C7)

Every gate alone, through `sh scripts/gate-tail.sh`.
- `npm run typecheck:ratchet`: base OK (167 errors, ceiling 167); tip OK (167, ceiling 167).
- `npm run typecheck:domain:strict`: base ✓ (1113, ceiling 1113); tip ✓ (1113, ceiling 1113). (`src/` is byte-identical to the base.)
- `npx eslint` on the 13 changed test files (the two `scripts/` files are a shell script and a JSON file, which eslint does not read): exit 0, no problems; the pre-commit `eslint --fix` changed nothing.
- ALL of `tests/lint` (781 files, 3226 tests), base (a scratch worktree at the base) and tip: base 66 failed and one suite that cannot load; tip 61 failed and the same suite. The five that left are exactly my five laws. EVERY OTHER RED HAS THE SAME MESSAGE at the base and the tip (compared by test name and the first 900 characters of the message, paths normalized): the any-cast baseline, factLayers, noLegacyFactionReaders, observedShapeReaders, poolDominance, presumedThings, presumptionClasses, proseComposed, proseCorpusBytes, proseEntryContradiction, proseFamilyContract, proseMoveGrammar, proseNumerics, proseWaveGate, proseWiringCensus, ruinFilterRoster, siteCoherenceRatchet, the census arm (3682 vs 3641), tuningRegister, wiringCensusDeclared, writerReach. No count moved by me.
- Class (d), the machine's own: `tests/lint/ledgerCitationIntegrity.test.js` cannot load here: `git ls-tree … refs/heads/review-fixes-2026-07-08` — "Not a valid object name" (the docs ledger branch is not a local ref in a cloud clone). The same at the base and the tip; not mine.

## What I left, by name

- No red of my list is left.
- Nothing of the other seats' files was touched (none of LEFT-KEYS' files was named by my five laws).
- No stored figure moved: the each-family ceiling stays 108 (the tree reads 106: lowering it is a stored figure, C8); the census arm's 3641 and its title figures; `uncoveredBaseline` 186.

