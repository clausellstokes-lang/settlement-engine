# TAIL-CONTENT-CLOSE-1: hand-back (the false lines a reader reads, cured where they are drawn)

Branch `lane/tail-content-close-2026-11-15`, cut from the joined line at `bb75314d6`. One commit per cure. To veto any one,
revert its commit.

## FOR THE OWNER, IN PLAIN WORDS

| # | what a reader saw | what a reader sees now | count | commit | a veto | goldens and registers it moves (for the final seats) |
|---|---|---|---|---|---|---|
| 1a | On the landing page, the town Cnocby, which has no market: "Caravans are passing Cnocby by, and its market stalls stand half empty." | "Caravans are passing Cnocby by, and its traders have little to sell." A town that does have a market still hears of its stalls. | the landing town (after its weeks); 0 of the 720 births (the line is a world-pulse line: no birth prints it) | (cure 1) | revert the commit: the stalls line prints again in towns with no market | the landing fixture (`src/components/home/landingFixture.js`: re-emit, the doors' final seat); `tests/domain/modeSpeedsWy1.test.js` pulse hash re-keyed in the commit (9 leaves, all this line, for a fixture town with no market); the presumed-things door: no new row (the fixture's old line stays fresh until the re-emit) |
| 1b | On the landing page, the trade chip's reason: "Wartime pressure disrupts trade flows." | **Unchanged: the line is true.** After its weeks Cnocby holds an active "Wartime pressure" condition (`war_pressure`, set when "Cnocby goes onto a war footing" in week 5). The measuring seat's reader asks for a war; the chip names the condition that stands. | | none | | the presumed-things row 25 is the instrument's reading, not a false line |

## THE PROOF, CURE BY CURE

### Cure 1: the trade fact names the market only where one stands

- **Where it is drawn:** `src/domain/worldPulse/heraldDeeds.js` (`CONDITION_FACT_SIBLINGS.trade`: the original `needs: ['market']`,
  its twin carries no declaration, true with a market or without) and `src/domain/worldPulse/candidateEvents.js`
  (`conditionFactOf`: the summary is resolved through `drawDeclared.js :: resolveDeclared` against `factsOf(record)` of the
  town in the pulse's snapshot; a record not in the snapshot is unanswered and takes the twin, fail-closed).
- **The 720 births:** towns moved 0 of 720; families 0 (`births-only.sh` + `fielddiff.mjs`, base `bb75314d6`).
- **The landing town (`lf-033`), as born and after its weeks:** no market either time (`factsOf(...).market` false). One
  field moved: the week-12 advance entry's text, as above. The why-trace (the three chips) is byte-identical.
- **The guard:** `tests/domain/worldPulse/tradeFactMarket.test.js`: 16 births (hamlet to city), each judged with an anchored
  negative whose anchors are the shipped sibling set's own texts at the town's name. RED at the base (with the new data and
  the old door): 7 towns with no market printed the stalls. GREEN after.
- **Tests that name the touched files or quote the old words (36 files):** at the base 1 red
  (`tests/copy/landingProseGrounding.test.js`, red at the base too: not this cure's); after, the same 1 plus
  `tests/domain/modeSpeedsWy1.test.js`, whose pulse hash this cure turned; RE-KEYED BY IDENTITY in the commit (leaf-diffed:
  28,265 leaves, 9 moved, all strings, all this line). After the re-key: the same 1 red as the base.
- **Gates:** eslint on the touched files 0; type ratchet 0; strict-domain 0. Presumed-things door `--check`: identical to the
  base (fresh 4 · stale 2; the fixture's old market line is one of the fresh, expected until the re-emit).
- **The twelve-birth grid:** `page-census --grid`: 0 falls at the base, 0 after (no rise).

## NOT DONE (named for the next round)

- Cure 2 (`claimStanding.js`, the practitioners line), cure 3 (the brewery's alehouses), cure 4 (the forges): see the
  latest push of this file for what was reached.
