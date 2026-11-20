# MEASURE-UK — report (builder BUK to SEAT-6, 2026-11-20; brief `MEASURE-UK.md`; tables `../uk/uk.md`)

**Outcome.** Under `_seatLawVersion: 2`, the fold f4a434660 moves NO contender and NO risk: the field or risk moved in 0 of 600 visitor places, and in 0 of 600 of the chair's 600 (S → SK and S → SKW). What it moves is the cast. On the visitor pool S → SK, 547 cards change band (Guild Master 462 and Thieves Guild Master 50 low → high, Council Member 35 low → moderate) in 313 towns. Conflicts: 2 towns gain one, 9 lose one, 34 swap parties (not exclusive), mostly town to metropolis. Powers whose first card reads low fall from 965 to 694 of 2,172 (44.4 → 32.0 %; SKW 30.6 %). Also moved: tie kind, ends or strength 1,161 (302 towns); goals 606 (244); pressure sentences 37; relationship narratives 21 (20 towns); `prominentRelationship` 59 towns; the crisis cast 4 towns. In the chair's 600: 521 cards; conflicts 4 · 3 · 18; first low 762 → 539 of 2,314.

**SKW, a separate proposal:** add the stem `'wealthiest merchant'` to `powerBandOfRole`'s `MID_POWER` list beside `'wealthy_merchant'`. Its effect: +219 cards low → moderate (printed "the luxury merchant", "the exchange master"), and 2 more swaps in metropolises.

**Calibration: PASSES**, on the trial's own corpus (k300 at 6b82c8e4a, the fold, and the fold plus the arm; cards paired by id): 9,012 cards; 221, 34 and 18 cards, 273 in 151 towns; Wealthiest Merchant 100; no other pool role moves. The instrument's first read (kRoles' printed cards, by role name) FAILED and stopped the run before any S birth. A card's `role` prints its office word ("the senior guild master"), so that read counted 0 cards under each pool-role name. It was replaced by pairing cards.

**Run:** `sh docs/chair/2026-11-20/content/seat/uk/measure-uk.sh`, 578 s, 3,600 births, 0 errors; two runs identical.

**CONFIRMED:** the counts above, on these pools and these trees. **PLAUSIBLE:** that the contest stays still because `coupContenders` reads a faction's power, not a card's band (item 36's reading; not traced here). Also PLAUSIBLE: that a law-gated build matches these figures (the scratch fold is unconditional, with the law forced).

| visitor, size | conflict gain · lose · swap, S → SK (S → SKW) | contenders per kind, S = SK = SKW (noble · craft · merchant · military · religious · arcane · criminal · gov/other; no contender) |
|---|---|---|
| thorp | 0 · 3 · 0 (same) | 0·0·0·0·0·0·0·4; none 96 |
| hamlet | 1 · 0 · 0 (same) | 0·0·1·8·0·0·1·2; none 88 |
| village | 0 · 1 · 0 (same) | 4·4·4·19·56·0·1·13; none 18 |
| town | 1 · 3 · 10 (same) | 16·39·31·47·51·0·3·7; none 1 |
| city | 0 · 1 · 13 (same) | 21·34·43·68·56·25·0·4; none 2 |
| metropolis | 0 · 1 · 11 (0 · 1 · 13) | 27·30·37·62·58·50·0·0; none 0 |
