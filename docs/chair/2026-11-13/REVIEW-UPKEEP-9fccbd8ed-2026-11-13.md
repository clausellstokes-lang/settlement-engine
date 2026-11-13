# REVIEW-UPKEEP-2, second read — `lane/coherence-upkeep-2026-11-12` at 9fccbd8ed, each group apart

> The chair's second, shorter read: A (de371fc40, the band in whole points; with cd7242c00 F4, 05b8ee712 F7,
> 808ed6e3e documents), B (da09e1221 the kind of wall, 9300dbba2 its refreeze), C (385d4b678 wartime,
> 9fccbd8ed). Read on MY births (the 1,200 of the first read, `rv2-<crisis>-<size>-<i>`, the app's own
> config shape), each group against its own parent: A against ce3bceda9 (its src equals 73b1304de's),
> B against 808ed6e3e, C against 9300dbba2. Pages first; the builder's notes were not read. The first
> read's findings stand where nothing here cures them; the chair's rulings (1)–(8) on them are not yet
> built at this tip and are not judged here.

## VERDICT, per group

| Group | Verdict | Findings |
|---|---|---|
| **A — the band in whole points** | **CLEAR** | none |
| **B — the kind of wall** | **CLEAR** | LOW B1 (the earthwork weight is never reached on the roster's names) |
| **C — wartime as a crisis row** | **CLEAR** for what it builds | LOW C1 (wartime still also acts through the crime reading: the first read's C6, ruled (3), not yet cured) |
| F4 / F7 (light) | F4's words cured; the first read's H2 stands | — |

## A — de371fc40: the score is stored in the whole points the page prints

- **The parts still sum exactly:** 1,200 of 1,200 births, the tenths of the parts equal the score
  × 10; the rounding is one LIMIT line (`rounding`, "Rounded to the whole point the page prints"),
  in the record only. Every score is an integer (1,200/1,200).
- **Band against number:** `readinessBandOf(score)` agrees with the stored score on 1,200/1,200. No live
  surface prints the readiness number (the export prints it beside its label, from one record: agree;
  the causal sentence is in a section nothing mounts). The posture line's second ladder (first read §4,
  ruled (6)) is unchanged at A and is the chair's ruling, not judged here.
- **Movement against 73b1304de:** 39 births change band, every one UP by one band, every one a birth
  whose exact sum sat within half a point below a cut (e.g. `rv2-calm-city-3` 54.9 → 55 Well-Defended,
  `rv2-calm-city-32` 75.8 → 76 Fortress). Largest score move 0.5.
- **A saved town does not move:** the ten towns born on `origin/master` (db832c892) and stored as JSON
  render identically at 9fccbd8ed and at 73b1304de on every surface (`saved-render.mjs`).

## B — da09e1221: the kind of wall

- **No stone-walled birth moves:** 537 births with Town walls, City walls and gates, Massive walls and
  fortifications or a Citadel: the walls part is unchanged on every one, and so is the score.
- **Who moves:** 151 births, every one with "Palisade" (62) or "Palisade or earthworks" (89), all thorps,
  hamlets and villages; the walls part falls 4.0 readiness points on each (10 × 0.6 → 6); mean score
  move −4.2. **44 change band**, all down one.
- **Do their pages read true:** all 44 rendered at both sides and read by class and by eye. No sentence
  class grows; the cannot-hold posture beside an Adequate or Strong invasion bar FALLS (37 → 25), because
  the invasion bars fall with the walls. The 29 "all but undefended" lines beside a palisade and a militia
  are there before and after (the posture's own ladder; ruled (6)). No line on any surface of the 44 is a
  string that no page at 808ed6e3e, 73b1304de or 69b53decd prints (masked line diff: 0).
- **The two weights sit in the table:** `DEFENCE_TUNING.wallKind = { stone: 1, palisade: 0.6,
  earthwork: 0.4 }`, with its reason row; the generator reads it through `defenseWallOf` (the roster home).
- **LOW B1:** `defenseWallOf` takes the first keyword it matches, so the roster's "Palisade or earthworks"
  reads as a palisade (0.6) and the earthwork row (0.4) is reached by no birth of my 1,200. The ruling of
  record 1148 asked that the weights be fixed only after every roster name that sets walls is listed;
  this name is both kinds at once. (It also reads `walls[0]` only: a place listing "Citadel" first reads
  stone by default, which is right for every birth I have.)

## C — 385d4b678: wartime as one more row of the crisis table

- **Only what sustains:** on 240 wartime births the row's take sits on SUSTAINS parts only (stores 240,
  purse 236, market 138, hospital 86, alchemists 83, food processing 24); no BUILT or STANDS part carries a
  wartime take. Six STANDS parts show a ±0.1 change, all the tenths' apportionment, not a take.
- **Only wartime:** of 1,200 births, the 176 that move are all wartime; no other crisis moves.
- **Its cost:** median −3 readiness points (min −3.1, max −0.2) taken by the row; score change on the
  births that move: mean −2.72. **40 change band**, all down one: 30 small places, 5 towns, 4 cities,
  1 metropolis.
- **Pages:** all 40 rendered at both sides. No sentence class grows ("war takes most of the money" beside
  a can-pay line falls 10 → 8). No new string (the 3 masked lines no earlier page prints are combinations
  of a band word with roster words already printed elsewhere: "Lightly defended: no walls; the
  adventurers' charter hall is all that stands guard.").
- **The weight sits in the table:** `DEFENCE_TUNING.crises.wartime = { sup: 15 }`, with its reason.
- **LOW C1:** wartime still also reaches the Crime part through `getInstFlags`'s criminal reading (×1.2),
  as the first read measured (C6, 40/40). Ruled (3); not yet built at this tip.

## F4 and F7, lightly

- **F4:** on twelve sieges that printed "paid from what the hunger leaves" at 73b1304de, the line now reads
  *"Hired swords back the garrison, paid from what the siege leaves."* The words are cured.
- **The first read's H2 stands:** the same twenty births still print the short-purse guard line beside
  "can pay its way through it" / "money in hand" / "Money enough to ride out a long crisis"
  (e.g. `rv2-under_siege-city-10`, `rv2-famine-city-13`). Ruled (1); not yet built.

## Probes
`docs/chair/2026-11-13/probes/REVIEW-UPKEEP-2/`: `scan.{A,B,C}.ndjson` (the 1,200 at de371fc40, 9300dbba2,
9fccbd8ed), `abc.py` (the comparisons above), `cls2.py` (the classes before and after), `war.mjs` (the
wartime takes), `B.all`, `C.all` (the band-changers).
