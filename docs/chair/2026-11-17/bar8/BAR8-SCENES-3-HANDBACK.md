# BAR8 seat SCENES-3: hand-back

Seat SCENES-3 of BAR8 (ruling BR25, after READ-SCENES), 2026-11-18. Base 55b954f98 (`lane/landing-45-2026-11-17`). Branch
`lane/bar8-scenes-3-2026-11-17`. Nothing merged. Commits, one an item:

| commit | item |
|---|---|
| 342d36fa5 | 2: the empty road back at its base declaration; `drawAdmitted` answers by a line's LAST admitted twin, else its first |
| 40d97f462 | 1: the enchanting twin reworded by name |
| 949bac2ff | 3 (a) (b) (c): three older tests re-keyed by identity |
| 90ce2852d | 3 (d), the chair's message of 01:07 UTC: `politicalFlavorDeclared` re-keyed by identity |

Files touched: `src/data/arrivalProse.js` (the two rows named), `src/generators/narrative/arrivalScene.js` (one hunk on
the line 8109908e4 changed), the guard `tests/generators/bar8Scenes.test.js`, the tests below, and this file. No new line
of text beyond item 1's twin. No new field on the record. No stored figure re-taken.

## 1. The enchanting twin (BR25 (2))

- WORD FOR WORD, VETOABLE: "Magic is still a trade in {name}: the signs still offer it by the hour, but the work is slow
  and dear for want of what it takes."
  - Was: "Signs in {name} still offer enchanting by the hour, …".
  - The declaration is unchanged: needs `enchanting`, excludes `trade at work: arcane`.
- Where it prints: in none of the 900. The old words are in no stored record of the 30, the 150 or the 720, and item 1
  moves nothing else. It keeps the slot only, as before.
- The guard has two new assertions:
  - the words, verbatim;
  - in bar0-city-under_siege+famine-rand-47, whose only enchant/identif service is "Arcane identification" (asserted as
    the premise), the line names no service the page does not list.
- The same reading convicts the old words (asserted in the same test). The arm fails at 55b954f98.
- THE DOORS: `presumption-classes-door --check` and `presumed-things-door --check` give output identical line for line
  at 55b954f98 and at the tip.
  - presumption-classes: "hits 1786 · banked 1938 · fresh 0 · stale 152".
  - presumed-things: "fresh 38 · stale 72 · …", the same 38 rows at the base. No FRESH row is mine.

## 2. The two stone states no twin covered (BR25 (3))

- The empty road ("The road from the workings is empty of carts.") is back at its base declaration (`crisis: ['any']`,
  no tier exclusion).
- `drawAdmitted`'s twin resolver now reads `twins.filter(ok).pop() ?? twins[0] ?? null`: the last admitted twin, else
  the first.

**(a) Moves nothing.** I compared the base with a tree holding item 2 alone (342d36fa5's src). Births were done with
PAGE-COPY's `births.mjs` and `seedcfg.mjs`. Each `corpus.ndjson.gz` was decompressed and hashed with sha1:

| corpus | sha1 at base | at item 2 |
|---|---|---|
| the 30 | 83cd1e49e975… | equal |
| the 150 | 02155df4f622… | equal |
| the 720 | 6280d38e5854… | equal |

The 525 (`bar5/THINGS/ref525.mjs`): `ref525.json` is byte-equal (sha1 85f8e43f4567…).

**(b) The two states, planted** on bar0-hamlet-calm-rand-45, whose stone is at work and whose unplanted slot prints the
small cart:
- (i) its stone idle: every ground it has is spent (`nearbyResourcesDepleted`);
- (ii) a siege over its stone at work.

| | base | tip |
|---|---|---|
| admitted [endless line, road, cart] | [false, false, false] | [false, true, false] |
| the pool's admitted slots | 2 | 3 |
| the road prints (of 200 streams) | never | (i) 61, (ii) 58 |
| the cart prints | never | never |

The guard holds both states as two new tests. They are red at 55b954f98 and red under a scratch mutation that puts back
the FIRST-admitted resolver.

**(c)** Over the 900 (item 2's tree, `measure2.mjs`):
- No town admits the cart and prints the road, and none prints the cart without admitting it.
- The cart prints in 6: bar0-hamlet-calm-rand-45, -47, r2r-hamlet-6, -32, -40, -58.
- The road prints in 1: bar0-city-wartime-rand-31, whose stone is not at work.

**(d)** The arrival tables have two lines with two twins: the endless line, and "Magic is a trade …".
- 262 towns of the 900 admit two twins of one line (all on the endless line: a thorp or a hamlet whose stone is at work).
- The scene prints a twin of it in 6 of those, and in all 6 the LAST twin answers (the cart). The FIRST answers in 0.
- The arcane line's two twins are disjoint by `enchanting`.

**Re-keyed by identity:**
- The guard, C15891 (bar0-hamlet-calm-rand-45). The road is admitted there again, so the claim "a cart or two prints,
  never the empty road" now stands on the scene over sixty streams, with an anchored negative (`expectAbsentWithAnchor`).
- The guard, "the endless line has exactly the two twins". Same claim, with a dated note: their order is now the draw's
  rule, and the later twin is the narrower (its needs are asserted).
- `bar6ScenesGoods.test.js` B7's helper: a dated note only. The count it makes (a slot holds where ANY twin is admitted)
  is unchanged by which twin answers, and it stays green.
- `bar4ScenePresumption.test.js` MU1: nothing in it is made untrue (it names no "first" twin; it is green at the tip),
  so I left it unchanged.

## 3. The older tests the cure made untrue (BR25 (4))

Each was red at 55b954f98 and green at the tip. Each was shown red once in a scratch tree under a mutation of the line it
reads, and the scratch tree was then discarded.

- (a) `tests/data/tailHistoryBatch6.test.js`, "the fish sense".
  - Re-key: the twin's needs are the original's minus ANY key of `trade at work` for the fish: `trade at work: fish` and
    `trade at work: ${FISH_TAKEN_HERE}` (imported).
  - Shown red when the racks' twin gains a need.
- (b) `tests/generators/bar2PlacesRows.test.js` [9] C10029, r2r-hamlet-6.
  - Re-key: the same claim (no ore; the slot says what the record bears) on the line that prints there now, "A laden
    cart or two …".
  - Beside it, a new row on r2r-city-30, a city where the endless line still prints. Only r2r-city-30 and
    r2s-recently_betrayed-town-1 print it in the 900.
  - Shown red when the two lines are reworded.
- (c) `tests/generators/tailNarrativeRows.test.js` 00138, r2r-thorp-46 (a thorp under a famine).
  - Re-key: keyed on "A settlement shaped by the accumulated weight of The Succession Crisis, The Iron Dispute, The Great
    Fire and The Trade Collapse: …".
  - Shown red when "accumulated" is reworded.
  - IS IT TRUE: yes in every fact it names. The record holds exactly these four events, in that order: minor political
    64 years ago, major economic 52, catastrophic disaster 28, major economic 6. It names all of them and nothing more.
    Its gloss, "no single defining moment", is a reading rather than a field. No field marks one event as defining, but
    the catastrophic Great Fire is the softest point of that reading.
  - A style nit, not mine: "of The Succession Crisis" keeps the capital article mid-sentence.
- (d) `tests/generators/politicalFlavorDeclared.test.js`, "under a crisis, a stable character is one of the crisis-safe
  rows" (the chair's message).
  - Re-key: a row is crisis-safe for the test's crisis (the siege) where its declaration ADMITS it (`any`, or
    `under_siege` named and not excluded), with no other need. The calm test keeps its claim.
  - Shown red when `drawDeclared` is made to print a refused drawn row.

**THE SWEEP** ran each file alone, at 917c915bc and at the tip.
- The grep list: 33 files.
  - The first words of every changed or new line of `git diff 917c915bc..HEAD -- src` (arrivalProse, narrativeText).
  - `trade at work: fish|trade at work: ironwork`.
  - The seat's readers and keys (`tradeAtWorkOf`, `IN_FULL`, `FISH_TAKEN_HERE`, `twinKey`, `flavorOf`, `drawAdmitted`,
    `composeArrivalScene`).
  - The consumers of the two registers and the law helpers the grep hit.
- The chair's widening: 36 more files that import `POLITICAL_FLAVOR`, `ARRIVAL_SENSES`, `ARRIVAL_TENSIONS`,
  `PRESSURE_SENTENCES`, `tradeAtWorkOf` or `FACT_DIMENSIONS`.

Results:
- Changed status: only `politicalFlavorDeclared` (green at 917c915bc, red at the sweep's tip 949bac2ff), now cured, item
  3 (d). The other three were already re-keyed when the sweep ran. `bar8Scenes` is absent at 917c915bc.
- Red at both, same names and same messages, NOT MINE:
  - `tests/domain/facts/census2dTables.test.js`;
  - `tests/lint/factLayers.walker.test.js`.
- Red at both, one message changed: `tests/domain/facts/census2eTables.test.js` "every row declares what its ledger lines
  say". At 917c915bc the first offender is `stable[5]` (5 rows); at the tip it is `stable[2]` (6 rows). This is the
  ledger's stable[2], the 12c row's declaration against the stored ledger. It is the close's, left by name as the brief
  says.
- Every other file is green at both.

## 4. The net

Each gate was run alone through `gate-tail.sh` (exit codes recorded, never a pipe), at 55b954f98 and at 90ce2852d. Both
trees are `git archive` exports. Test messages were compared whole, with stack lines and timings stripped.

- Type gates: `typecheck:ratchet` 0 · 0; `typecheck:domain:strict` 0 · 0.
- `eslint` on every changed file: 0 · 0.
- `tests/architecture`: 0 · 0.
- `tests/lint`: 3211 tests at both, 72 red at both.
  - The SAME names, and every failure message identical in full (0 differ).
  - That covers every walker, register and roster test, the negative-anchor and seed-loop walkers included.
  - Some reds there (`tuningRegister`'s refreeze arms, `observedShapeSentinel`, `wiringCensusDeclared`'s channel arm) come
    from git commands that cannot run in an archive tree. They are equal at both trees.
- Each alone, base · tip:
  - the guard 0 · 0 (25 tests at the tip; the base runs its own 22);
  - `bar6ScenesGoods` 0 · 0;
  - `tailHistoryBatch6` 1 · 0;
  - `bar2PlacesRows` 1 · 0;
  - `tailNarrativeRows` 1 · 0;
  - `bar7Scenes` 0 · 0;
  - `bar4ScenePresumption` 0 · 0;
  - `textOf` 0 · 0;
  - `census2fColour` 0 · 0.
  - `politicalFlavorDeclared` is red at the base and green at the tip (§3 (d)).
- N3: `pipelineContract` 0 · 0; `isolatedTrade` 0 · 0; `pipelinePinnedMode` 3 red · the same 3; `generationForkCensus` 3
  red · the same 3; `publicProseEquality` 0 · 0. Every message is identical (0 of 487 tests differ).
- Every push ran the lane hook (the ratchet, strict and lint): all passed.

## 5. Left by name, not mine

- The reader's M1: the atom `trade at work` does not read "Stopped by the siege.", and `impairedUnderSiege` reads the
  stored chain status.
- The ledger's `stable[2]`.
- r2r-village-36.
- The small cart's own comment (`arrivalProse.js`, the cart's row, not one of my two rows) still says "the first admitted
  twin answers (`arrivalScene.js :: drawAdmitted`)": now stale. It is a comment only, outside my manifest.
- `supabase/functions/_shared/engineBundle.js` is a built bundle; it still holds older rows. It was not re-taken.
