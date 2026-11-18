# BAR8 · SEAT FISH-ROWS · hand-back

The fish market's catch row where the fish is bought in (auditor J's rules 11b.fish and 11b.fishTitle; ruling BR24).
Base: **917c915bc** (POINT 44; the chair's word of 23:22 UTC withdrew the branch move: the branch sits where it was cut).
Branch: `lane/bar8-fish-rows-2026-11-17`. Every gate ran alone through `sh scripts/gate-tail.sh`, never through a pipe.

## 1. The cure

`src/generators/steps/generateNarratives.js :: boughtFishRowsInPlace`, called right after `generateResourceAnalysis(…)` has
written the birth's imports. Where the town's fish grounds are used up (`supplyStory.js :: usedGroundOf(record, 'fish')`) AND
the stored imports hold the spent ground's own word (`importsHold(record, resourceShortageImport(ground))`, "Salted fish
(local … exhausted)": the bought story as every view reads it), a row whose pool names an `inlandAlternative`
(`src/data/institutionServices.js`, read, not changed) is replaced IN PLACE by that alternative with the catalogue's own
description: the Fish market's "Fresh fish retail" by its "Preserved fish", the Fishmonger's "Fresh fish" by its "Salted
fish". The row keeps its bucket, its index and its house; the toggle and the roll that kept it are the catch row's. NO DRAW.
As the roll's own inland swap does, a later row of the same house already bearing the alternative's name is not printed
twice (measured: it never occurs in the 720, the 150, the thirty or the 525). The record read is the one in the making
(`{ config: effectiveConfig, economicState, institutions, resourceAnalysis }`, no birth picks on it), so the reading is the
stored record's: over the 720 the towns it swaps are exactly the towns the auditor's own `materialStory` calls
`bought-used` and whose market prints the catch row (30 of 30, none more).

An IDLE town (grounds spent, no fish brought in) keeps its row and its "Short of fish." mark; a town with a live fishery
keeps "Fresh fish retail". No new line of text (both rows and both descriptions are the catalogue's); no new field on the
saved record.

The step's declaration: `mutates: ['economicState', 'availableServices']` (with its note) and `reads` gains
`'availableServices'`.

## 2. The rules, before and after (auditor J's runner, `docs/chair/2026-11-17/bar8/AUDIT/runJ.mjs`)

| rule | the thirty (`--controls`) | the 150 | the 720 |
|---|---|---|---|
| 11b.fish | 13 → 9 (the service rows 4 → 0) | 3 → 1 (the services 2 → 0) | 720_FISH |
| 11b.fishTitle | 7 → **0** | 3 → **0** | 720_TITLE |
| LAW 11, all | 46 → 35 | 72 → 67 | 720_ALL |

- **Every BOUGHT town's 11b.fish service rows and titles: 0** in the thirty, the 150 and the 720.
- **What is left of 11b.fish is not this hunk's** (each is a line other seats hold): the rites income line ("The waters here are
  worked thin; rites keep the catch coming", `incomeLineSiblings.js`), the scenes ("Racks of drying fish", `arrivalProse.js`),
  the fishmonger's "Talks about the boats, the catch" (`titleSecretsPresentations.js`), the market's card "Where the day's
  catch is sold" (`institutionDescVariants.js`), the fisher's landing's own rows (its pool has no alternative).
- **CONTROLS: C20700 and C36970 turn clear** (the runner exits 3 BY DESIGN for those two: `controls off: 2`). Every other
  control as at the base; the thirty's CONTROLS block differs in those two lines only.
- **NO OTHER RULE OF ANY RUNNER RISES.** Every runner of the checkout (runB, runC, runD, runE, runF, runG, runH, runI, runK)
  prints byte-equal at base and tip over the thirty and the 150, OTHER_720. In runJ only the 11b block and the totals move (the
  top-25 listing gains lines of 11d and 11e because the fish lines left it; their counts are unchanged).
- **IDLE towns byte-equal:** IDLE_LINE
- **No "Preserved fish" row in a town whose fishers land their own catch** (the auditor's `local` story): 0 at the tip over the
  720 (the Fish market's "Preserved fish" stands in the 30 bought towns and in the 162 inland towns of the A-11 swap, story
  `none`, as at the base).

## 3. The declared move (R5)

Field family **`availableServices` only**. Every top-level field of every record hashed at base and tip:

| population | records that differ | by tier | the change |
|---|---|---|---|
| the 720 | **30** | village 1, town 7, city 9, metropolis 13 | `food[Fish market]` "Fresh fish retail" → "Preserved fish", 30 rows, nothing else |
| the 150 | **2** (bar0-town-calm-rand-28, bar0-city-wartime-rand-40) | town 1, city 1 | the same row |
| the thirty | **4** (bar0-town-occupied-rand-45, bar0-metropolis-calm-rand-45, bar0-village-calm-rand-47, bar0-city-wartime-rand-47) | | the same row |
| the 525 reference configurations | **48** | town 12, city 12, metropolis 24 | the same row, 48 rows, nothing else |

No Fishmonger row moves in any population (no bought town of them holds a Fishmonger). No draw moves: no other field of any
record differs. I re-take no stored figure.

**THE PAGES:** in the thirty and the 150 the dumps differ in the bought towns only, and in the fish row only: the Services tab
(the row, its description, its house line), the house's chip ("Services · Preserved fish"), the PDF's Services and
Institutions ("Preserved fish: Smoked, dried, and salt-preserved fish for storage and inland trade.").

**THE PDF AND THE JOURNAL** read the stored services. Three towns (bar0-town-occupied-rand-45, bar0-metropolis-calm-rand-45,
bar0-city-wartime-rand-47): the PDF's view model holds "Preserved fish" at the tip ("Fresh fish retail" at the base), and its
Services and Institutions pages print it with its description. The journal's Services page prints the service CATEGORIES
only ("Lodging", "Food", …), no row, at base and tip alike: no journal line names either row in either tree.

**THE SHARED PAGE (N4):** the guard's N4 arm holds that `toPublicSafe` and the share veil (`projectShareVeil`) keep the owner's
fish market rows, row for row, in the four bought and the four idle anchors; over the 720, 150 and thirty the stored row is
the one both pages print (the public record carries `availableServices` whole: SHARED_LINE).

## 4. The registers, each row word for word with its measure

| register | the row, word for word | the measure | the test, base → tip |
|---|---|---|---|
| `src/domain/generation/generationForkRegistry.js` (GENERATION_TIER1, 76 → 77) | `  { step: 'generateNarratives', key: 'availableServices', via: 'mutates', stepDraws: 63, keyMoves: 0, rows: 63, class: 'pure', onRecord: { absent: 0, same: 63, transformed: 0 }, onRecordClass: 'same', producedOnRecord: { absent: 0, same: 63, transformed: 0 }, producedOnRecordClass: 'same', recordPath: 'record.availableServices' },` (after `generateNarratives\|economicState`, the live registry's order), with a dated note | Pasted from `generationForkCensus` A4's printed fresh literal at the tip ("generateNarratives\|availableServices: measured but not declared"). keyMoves 0 of 63, so `pure`; same on both comparands (what the step leaves is what the record stores; it rewrites 4 of the census's 63 rows) | contract A2: green at base → RED with the hunk alone ("expected 76 to be 77") → **green**. Census A3e: green → RED with the hunk alone (77 ≠ 76) → **green** |
| `tests/lint/generationForkRegistry.contract.test.js`, the five figures that follow it, each with a dated note | the denominator `toBe(76)` → `toBe(77)`; mutates-only `toBe(20)` → `toBe(21)`; the entropy tally `pure: 48` → `pure: 49`; the FINAL comparand `same: 26` → `same: 27`; the POST-STEP comparand `same: 13` → `same: 14` | Counted off the register at the tip; the disagreement count stays 13 (the new row agrees with itself), provides 56 unmoved | A2, A3s: green at base → **green** at tip (3/3) |
| `tests/lint/heldKeyWriterCensus.walker.test.js` STEP_ROSTER | **no row** | `availableServices` is not a held key: the walker's HELD_KEYS (derived from the record register and pinned) are `conflicts, institutions, name, npcs, powerStructure, relationships`. The walker is green at base and tip with the same message | 7/7 → 7/7 |
| `src/domain/goods.schema.js` | **no row** | `tests/build/vendorPdfLazy.test.js -t "WEAVE ST-2"` asks none: green at base and tip (12 passed) | green → green |

**LEFT, NAMED (a stored landing count, the close's, as DEBT-2 left `economyReconcilePass|economicState`'s):** the census A4's
fresh literal now differs in three more cells of an existing row, `economyReconcilePass|availableServices`:
`producedOnRecord` same 63 → 59, transformed 0 → 4, `producedOnRecordClass` same → varies (the narratives step rewrites four
of the census's rows after the reconcile pass). A4 is red at the base (2 cells) and at the tip (5 cells). Taking them would
move the contract's POST-STEP tally (same 14 → 13, varies 20 → 21) and its disagreement count (13 → 14): figures the brief
does not grant. The patch, if the chair grants it: in the register's row `economyReconcilePass|availableServices`,
`producedOnRecord: { absent: 0, same: 59, transformed: 4 }, producedOnRecordClass: 'varies'`; in the contract, the POST-STEP
tally `same: 13, … varies: 21` and the disagreement count `toBe(14)`.

## 5. The re-keyed tests (R8)

The three fish anchors were ALREADY RED AT THE BASE ("prints without 'Short of fish.'": the bought market's catch row printed
unmarked), and at the tip their row prints no more (the market sells "Preserved fish"). Each is re-keyed by identity, the
assertion's form kept, a dated note beside it, to an IDLE town that still bears the claim (the catch row under "Short of
fish."):
- `tests/components/bar2ServicesRows.test.jsx` SV1 MARKED: r2r-village-11 → **r2r-village-45** (a village, its fishing grounds
  spent, no fish brought in).
- `tests/components/bar3ServicesRows.test.jsx` MARKED: r2r-town-29 → **r2s-recently_betrayed-metropolis-0** (its one river
  fishery spent, idle); bar0-metropolis-calm-rand-8 → **r2r-metropolis-45** (fishing grounds spent, idle).
- `tests/domain/bar4MarkPromise.test.js`: **not touched** (its fish anchor r2s-plague_onset-thorp-2 is IDLE and keeps its row
  and mark: green at base and tip).

What stays red in those two items is not fish and is red at the base with the same message: bar2's r2r-town-45 ("Ore cut
underground …" without "Short of iron ore."), bar3's bar0-city-under_siege+famine-rand-9 ("House wine by the jug or bottle."
without "Short of grapes."). The published check of my base (`lane/checks-2026-11-17`,
`landing-43-44-917c915bc/part-1/names.final.txt`) lists bar2's SV1 MARKED red there.

## 6. The guard: `tests/generators/bar8FishRows.test.js` (5 tests; every seed loop `collectSeedFailures` / `expectNoSeedFailures`)

The story is the AUDITOR'S reading (`law11Supply.mjs :: materialStory`), not the cure's.
- BOUGHT (r2r-village-11, r2r-town-29, r2r-city-14, bar0-metropolis-calm-rand-8): the Fish market prints "Preserved fish" with
  its own words, no "Fresh fish retail" (anchored), no morning catch anywhere.
- IDLE (r2r-village-45, r2r-metropolis-45, r2s-recently_betrayed-metropolis-0, r2s-plague_onset-thorp-2): "Fresh fish retail"
  with its description, no "Preserved fish" (anchored).
- LOCAL (r2r-town-15, bar0-village-calm-rand-32, r2r-thorp-44: a fish market, a market beside a landing, a fishing
  community): the same.
- THE THIRTY: a bought story prints no catch row whose pool names an alternative; a local or idle story no "Preserved fish";
  not vacuous (at least four bought markets among the thirty, each printing its "Preserved fish").
- N4: the public record and the share veil keep the owner's fish market rows (the bought and the idle anchors).

**At the base: 2 of 5 red** (BOUGHT; THE THIRTY: "4 of 30 case(s) failed": bar0-village-calm-rand-47, bar0-town-occupied-rand-45,
bar0-city-wartime-rand-47, bar0-metropolis-calm-rand-45); IDLE, LOCAL and N4 green (the negatives hold at the base). **At the
tip 5 of 5.**

## 7. N3, the pipeline's contract (base and tip)

NET_N3

## 8. The net (base 917c915bc and tip, each gate alone)

NET_TABLE

## 9. What I left, by name

1. `generationForkCensus` A4's three `economyReconcilePass|availableServices` cells (section 4): a stored landing count, the
   close's; the patch is above.
2. The rest of 11b.fish (section 2): the rites income line (`src/generators/economy/incomeLineSiblings.js`), the scenes
   (`src/data/arrivalProse.js`, `src/domain/facts/tradeAtWork.js`), the fishmonger (`src/data/people/titleSecretsPresentations.js`),
   the market's card (`src/data/institutionDescVariants.js`): not my files.
3. The fisher's landing's "Fresh fish" (its own pool, "Fisher's Landing", names no `inlandAlternative`): 1 bought town of the
   720 (r2r-village-11, beside its market's now "Preserved fish"). A catalogue change; not my file.
4. A bought FISHING COMMUNITY (a taker, its pool resolves to the Fish market's) would swap too, by its pool's alternative:
   none occurs in the 720, the 150, the thirty or the 525 (the one thorp with a spent fishery, r2s-plague_onset-thorp-2, is
   idle). Named for the reader.
5. N5 (the scratch merge): the line's tip is still 917c915bc, my base (`origin/lane/landing-43-44-2026-11-17` and
   `lane/join-2026-11-14` are both in it), so the merge is "already up to date": clean, with no worktree made.
