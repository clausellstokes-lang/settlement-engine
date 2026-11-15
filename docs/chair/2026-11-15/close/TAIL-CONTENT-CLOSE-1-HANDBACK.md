# TAIL-CONTENT-CLOSE-1: hand-back (the false lines a reader reads, cured where they are drawn)

Branch `lane/tail-content-close-2026-11-15`, cut from the joined line at `bb75314d6`. One commit per cure. To veto a cure,
revert its commit. Handed back at about 48 minutes.

## FOR THE OWNER, IN PLAIN WORDS

| # | what a reader saw | what a reader sees now | count | commit | a veto | goldens and registers it moves (for the final seats) |
|---|---|---|---|---|---|---|
| 1a | On the landing page, the town Cnocby, which has no market: "Caravans are passing Cnocby by, and its market stalls stand half empty." | "Caravans are passing Cnocby by, and its traders have little to sell." A town that does have a market still hears of its stalls. | the landing town (after its weeks); 0 of the 720 births (a world-pulse line: no birth prints it) | `805452e8f` | revert it: the stalls line prints again in towns with no market | the landing fixture (`src/components/home/landingFixture.js`: **re-emit**, the doors' final seat); `tests/domain/modeSpeedsWy1.test.js` pulse hash, re-keyed by identity in the commit (9 leaves, all this line); the presumed-things door: no new row (the fixture's old line stays fresh until the re-emit) |
| 1b | On the landing page, the trade chip's reason: "Wartime pressure disrupts trade flows." | **Unchanged: the line is true.** After its weeks Cnocby holds an active "Wartime pressure" condition (`war_pressure`, set in week 5 when "Cnocby goes onto a war footing"). The measuring seat's reader asks for a war; the chip names the condition that stands. | | none | | row 25 is the instrument's reading |
| 2 | In 9 of the 720 births (all metropolises), a power's description: "Magical practitioners are consulted but not formally empowered …" where no one works magic | "The arcane interest is consulted but not formally empowered. Its influence is advisory, transactional, and quietly resented." (and the seat twin: "The arcane interest outside the seat holds no office of its own; …") | 13 descriptions in 9 of 720 towns | **NOT PUSHED** (built, guarded, measured: the test sweep is unfinished) | n/a | goldens expected to move (the 9 towns' `powerStructure.factions[].desc`): `generatorGoldenMaster`, the driven goldens. Patch: `probes/TAIL-CONTENT-CLOSE-1/cure2-practitioners.patch` |
| 3 | A brewery "supplies alehouses and households" in villages the measuring seat counted as having no alehouse | **Unchanged: the line is true.** It is already declared (`needs: ['institution: tavern']`, with twins). In every birth that prints it, an "Ale house" stands: 4 of 4 in the walker's 60 villages (presume-village-9 and -10 among them), and 4 of 4 among the 720. The walker's `house: alehouse` reader misses the two-word name "Ale house". | 0 false | none | | rows 5, 9 are the instrument's reading (its reader, not the line) |
| 4 | In presume-town-25 (no smithy, no smith): "Being on the right side of it keeps the forges of Shankou running day and night …" | "Being on the right side of it, Shankou's fish trade has never paid better, and the place now needs the war to go on to pay for what the war has already cost it." | 1 town in the walker's 360 births; 0 of the 720 | **NOT PUSHED** (built, guarded, measured: the test sweep is unfinished) | n/a | none known. Patch: `probes/TAIL-CONTENT-CLOSE-1/cure4-forges.patch` |

## THE PROOF, CURE BY CURE

### Cure 1 (pushed, `805452e8f`): the trade fact names the market only where one stands

- **Where it is drawn:** `src/domain/worldPulse/heraldDeeds.js` (`CONDITION_FACT_SIBLINGS.trade`: the original
  `needs: ['market']`; its twin carries no declaration and is true with a market or without one) and
  `src/domain/worldPulse/candidateEvents.js` (`conditionFactOf`: the summary is resolved through
  `drawDeclared.js :: resolveDeclared` against `factsOf(record)` of the town in the pulse's snapshot; a record not in the
  snapshot is unanswered and takes the twin, fail-closed).
- **The 720 births:** 0 of 720 towns moved; 0 families (`births-only.sh` + `fielddiff.mjs`, base `bb75314d6`).
- **The landing town (`lf-033`), as born and after its weeks:** no market either time (`factsOf(...).market` false). One
  field moved: the week-12 advance entry's text, as above. The why-trace (the three chips) is byte-identical.
- **The guard:** `tests/domain/worldPulse/tradeFactMarket.test.js`. It births 16 towns (hamlet to city) and judges each
  with an anchored negative whose anchors are the shipped sibling set's own texts at the town's name. RED at the base (the
  new data with the old door): 7 towns with no market printed the stalls. GREEN after.
- **Tests that name the touched files or quote the old words (36 files):** at the base, 1 red
  (`tests/copy/landingProseGrounding.test.js`). It is red at the base too, so it is not this cure's. After the cure, the same
  1 red plus `tests/domain/modeSpeedsWy1.test.js`, whose pulse hash this cure turned. That hash is RE-KEYED BY IDENTITY in the
  commit (leaf-diffed: 28,265 leaves, 9 moved, all strings, all this line, for the fixture town Ashford, which has no
  market). After the re-key, the reds are the same 1 as at the base.
- **Gates:** eslint on the touched files 0; type ratchet 0; strict-domain 0. Presumed-things door `--check`: identical to the
  base (fresh 4 · stale 2; the fixture's old market line is one of the fresh, expected until the re-emit).
- **The twelve-birth grid:** `page-census --grid`: 0 falls at the base, 0 after (no rise).

### Cure 2 (built, NOT pushed): the arcane advisory lines name practitioners only where someone works magic

- **The cure:** the lines are written at the power step, before the town's people and houses are final. So they are settled
  once on the final record: `claimStanding.js :: settleArcaneToPractitioners` (new; `ARCANE_WITHOUT_PRACTITIONERS`, the two
  pairs). It is called in `generateSettlementPipeline.js` beside `settleClergyToFinalRoster`, and it reads
  `magicReliance.js :: magicPractitioners`, the same reader the walker uses. Draw-free.
- **The 720 births:** 9 of 720 towns moved; 1 family (`powerStructure.factions`). Inside it, only `desc` moved: 13
  descriptions. The line now prints in 138 towns and none of them is false (it was 147 with 9 false).
- **Landing town:** unchanged.
- **The guard:** `tests/generators/power/arcanePractitioners.test.js` (r2r-metropolis-1..30, the census dials). RED at the
  base (the new pairs, but no final-record call): 5 seeds. GREEN after.
- **Gates:** eslint 0, ratchet 0, strict 0. The door is identical to the base. The grid: 0 falls (no rise).
- **UNFINISHED: the test sweep.** 690 test files name `generateSettlementPipeline.js`. The after-run had 22 red files when I
  stopped (`cure2-sweep-red-after-partial.txt`). Of the first 8, all are red at the base too, but some of their failing
  cases differ. The next round should run the sweep whole, at the base and after (`cure2-sweep-files.txt`), and re-key
  by identity any pin that only these 13 descriptions turned.

### Cure 4 (built, NOT pushed): the wartime forges are named only where a smith stands

- **Why it printed though declared:** the pressure sentence's draw (`narrativeGenerator.js`, the `R2-CODE-A P1`
  resolution) keeps the refused row when no row of the pool is admitted (`?? drawn`). Presume-town-25 has no garrison and no
  smith, so all three rows of the wartime pool were refused and the forges row printed.
- **The cure:** a declared twin row beside the forges row (`narrativeText.js`, `twinOf`). Twin rows are taken out of the
  draw's domain (no roll moves) and are reached only where nothing in the pool is admitted, in place of keeping the refused
  row. So only the towns that printed the false line move.
- **Measured:** 0 of 720 births moved. Over the walker's 360 births, exactly one field in one town moved:
  presume-town-25's `pressureSentence`. Every other field hashes the same (`ps160.mjs`).
- **The guard:** `tests/generators/wartimeForgesSmith.test.js` (the walker's town seeds 0..59). RED with the twin's
  resolution removed (presume-town-25). GREEN after.
- **UNFINISHED:** the sweep of the 59 test files that name `narrativeGenerator.js` / `narrativeText.js`
  (`cure4-sweep-files.txt`), eslint and the types, the door, the grid.

## FOR THE FINAL SEATS

- **The landing fixture:** re-emit it (`node scripts/generate-landing-fixture.mjs --seed lf-033 --emit`). After cure 1 its
  week-12 advance text becomes the twin, and the door's fresh `market` row then goes stale (to `--shrink`).
- **Expected door rows from my cures:** none fresh. After the re-emit, the landing `market` row goes stale. The `war` row is
  already stale at the base, which is the instrument and not this seat's.
- **Goldens moved by cure 1:** none. One pin was re-keyed in the commit (`modeSpeedsWy1` BASE_PULSE_HASH).

## NOT DONE (named for the next round)

- Cures 2 and 4: apply the patches (`git apply`), finish each test sweep at the base and after, then push one commit each.
- The rows the presumed-things table names for cures 1b and 3 are the instrument's readings. The walker's `house: alehouse`
  reader should learn "Ale house" (its seat's work, not this one's).
