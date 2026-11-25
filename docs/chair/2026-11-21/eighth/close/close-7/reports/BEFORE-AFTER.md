# BEFORE-AFTER (CLOSE-7): the one before-and-after on C and V. A measure; no cure. DONE.

Brief: `close-7/briefs/BEFORE-AFTER.md`. No file under src/, tests/ or scripts/ changed in any tree. Nothing was committed
or pushed.

**Labels.** CONFIRMED means counted by a run in this unit. PLAUSIBLE means read from a report, or inferred and not
re-run.

## Trees, plans, runs

- **LINE** `/home/user/wt/ba-line` at ddca5c7894b8d8011a1426387a4ce03737dd79fa (point 116, before any cure).
- **CURES** `/home/user/wt/ba-cures` at 0ec96f13d8f9eb3cb229aea37e43d947049fae8f (A1, A2, the mirror, point 116, GUARD).
- **BATCH** `/home/user/wt/ba-batch` at 206e6c3ae2ab8158f4cdd7fa25e6f71d824e9543 (adds B1(i), B1(ii), C1, P3source).
- Each tree was a detached worktree with node_modules linked from the main checkout. All three were removed at the end.
- **Plans** (`before-after/plans/`), 900 births each:
  - C is `plan-C.json`, made by `read24/make-plan.mjs`.
  - V is `plan-V.json`, made by `read24/make-visitor-plan.mjs` over `plan-lit.json`. That file is copied from
    `origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json`.
- **The battery.** `read25/page-battery.mjs --views --workers=4` ran on each tree and corpus.
  - Each run was split into thorp–village and town–metropolis, so no single run went over 20 minutes. The longest took
    710 s.
  - 12 runs, all `exit=0`. Each rendered 450 of 450 births, with 0 births where a check threw. Logs are in
    `before-after/logs/battery-*.log`.
  - Per-birth record hash, page hash and rows are in `before-after/hashes/battery-{line,cures,batch}-{C,V}.tsv`.
  - The renders themselves (about 600 MB of printed views) stay in the scratchpad (`.../scratchpad/runs/`). They are not
    copied.
- **Other runs**, all through the gate mutex with `exit=0` in `before-after/logs/`:
  - born-record hashes: `bin/record-of.mjs`, writing `records/`;
  - the Daily Life slots: `mirror/food-of.mjs`, writing `food/`, on the three trees and on d447ee31e (`/home/user/wt/lit`);
  - the cross-counts: `bin/xcount.mjs`, writing `xcount/`.

**THE CROSS-COUNT (method).** LINE has no NOHEAL, FOODSEC, FEDFARE, B1land or B1furrow row. The battery's `--from` only
re-counts the rows stored at render time, so it cannot read a later tree's rows on earlier pages.
- `bin/xcount.mjs` re-births each town on the source tree exactly as the battery's renderer does. It checks the record
  hash against the stored one, then reads the stored printed views with another tree's `pageCensusFindings`.
- JSX is loaded through esbuild (`bin/jsx-hooks.mjs`).
- **Self-checks, CONFIRMED:** read with its own tree, each of the 6 renders reproduces its stored rows (0 mismatches in
  900, all six). The record hash mismatches are 0 in all 12 cross-counts.

## The units' figures, LINE -> CURES (CONFIRMED unless marked), beside d447ee31e (PLAUSIBLE, read)

| figure | d447ee31e (report) | LINE | CURES | verdict |
|---|---|---|---|---|
| NOHEAL C / V | 13 / 26 (A1) | 13 / 26 | 0 / 0 | SAME at LINE; cured |
| FOODSEC C / V | 197 / 168 (A2) | 197 / 168 | 0 / 0 | SAME at LINE; cured (battery row, and derived by `a2/resent.mjs`) |
| FEDFARE C / V | 4 / 3 (MIRROR) | **5** / 3 | 0 / 0 | C MOVED +1 (cause below); V SAME; cured |
| empty resentment slots C / V | 438 / 322 (A2) | **437 / 321** | 573 / 420 | LINE MOVED −1 each (cause below); CURES the cure's rise |
| A2's table, every cell C / V | as `reports/A2.md` | equal, cell for cell | equal, cell for cell | SAME (`food/table-all-{C,V}.tsv`) |

- **NOHEAL, by seed (C):** village-50, village-103, village-124, village-136, town-28, town-109, town-144, city-3,
  city-28, city-36, city-71, city-91 and city-140.
- **FEDFARE C, LINE 5:** the mirror's four cell places (hamlet-117, village-51, village-54, village-76) and
  **dp-city-81**.
  - dp-city-81 is the deficit|adequate place A2 named among the mirror cells (C 1). On LINE and on d447ee31e
    (CONFIRMED, `food/food-d447-C.jsonl`) its fare reads "every household has enough" beside a printed Deficit.
  - CURES's FEDFARE row reads Deficit as well as Famine, so it counts this place.
  - The tree does not move here. The move is between the MIRROR's figure, which was the famine cell, and the row as built.
    PLAUSIBLE as to why MIRROR printed 4: I did not re-run the mirror tree.
- **K1 and K2 (CONFIRMED, from the printed pages and the derived slots):**
  - K1 prints in World/Daily Life, Dawn Work, on C dp-hamlet-117 and V dp-hamlet-139, on CURES and on BATCH. It prints
    nowhere on LINE.
  - K2 prints nowhere on any tree or corpus.
- **Empty resentment slots, d447ee31e -> LINE (CONFIRMED by `food-of.mjs` on both trees):**
  - C: one place gains a resentment (dp-city-59, "Working people are pressing the City Council for a fairer deal").
  - V: two places gain one (town-66, city-74) and one place loses one (city-91), a net change of 1.
  - Other places gain a second sentence of the same "demands / pressing / asked for fair treatment" family.
  - These are the troubles lines of point 116, which lands between d447ee31e and ddca5c789. Which commit carries them is
    PLAUSIBLE.
  - CURES reads 573 / 420 against A2's own after figure of 575 / 424 (fca95c197). The difference is the same point 116
    lines, because CURES contains them and fca95c197 did not. That cause is PLAUSIBLE.
- **A2's table:** the printed band × production band counts are equal cell for cell on d447ee31e, LINE and CURES, for C
  and for V. The record does not move, and the cure changes which branch each cell takes (A2's column), not the cell.
- **The grievance slot's top share by size** (`commoner_resentments`; the commonest sentence's places out of 150;
  `food/grievshare-{C,V}.tsv`):
  - This is my own measure over the derived slot. It is not the sameness door's `measureSlots` over its text renders,
    which A2 used on the visitor-lines slot `DailyLifeTab.0.0.3.*`, because the battery's views carry no slot positions.
    A2's figure at d447ee31e (PLAUSIBLE) was C .133/.140/.147/.153/.133/.127 and V .120/.147/.113/.100/.100/.100.

  | size | C d447 | C LINE | C CURES | C BATCH | V d447 | V LINE | V CURES | V BATCH |
  |---|---|---|---|---|---|---|---|---|
  | thorp | .040 | .040 | .040 | .040 | .047 | .047 | .047 | .047 |
  | hamlet | .027 | .027 | .027 | .027 | .053 | .053 | .053 | .053 |
  | village | .047 | .047 | .047 | .047 | .053 | .053 | .053 | .053 |
  | town | .047 | .047 | **.040** | .040 | .053 | .053 | **.040** | .040 |
  | city | .060 | .060 | **.027** | .027 | .060 | .060 | **.047** | .047 |
  | metropolis | .087 | .087 | **.027** | .027 | .093 | .093 | **.033** | .033 |

  The share falls on the cure. The food grievances ("Households that go short…", "Many households are eating less…")
  were the commonest sentences, and they leave fed places.
- **Pages moved, LINE -> CURES (`diff/line-cures-{C,V}.txt`, `diff/pages-line-cures-{C,V}.tsv`):**
  - **C 226:** all in World/Daily Life. These are exactly the 226 births whose derived Daily Life slots moved: fare 215,
    grievance 202, Dawn Work 49, visitor 40. They are the union of A1, A2 and the mirror.
  - **V 260:** 255 in World/Daily Life, exactly the births whose slots moved, plus 5 in Systems/Power only (the artifact
    below).
  - **Rows moved: 0** on both corpora.

## GUARD, LINE -> CURES: born records (CONFIRMED, `records/record-{line,cures}-{C,V}.tsv`)

- C: 900 of 900 records differ. With every `generatorVersion` key removed, **0 differ**.
- V: the same, 900 differ and **0 differ** once the key is removed.
- The only difference is `generatorVersion` "0.9.0" -> "0.10.0", on all 1,800.
- The battery's record hash agrees: every record moved LINE -> CURES.

## The batch, CURES -> BATCH (CONFIRMED)

- **Born records moved: C 0, V 63** (`records/moved-cures-batch-V.tsv`).
  - **39 C1 carriers:** 18 Corrupt Council, 14 Corrupt City Council and 7 Shadow Senate (expected 39). **C carriers: 0**
    (expected 0).
  - **27 B1(i) desert places:** each loses Fish market, Hunter's lodge or Sawmill (`records/moved-*-institutions-V.tsv`).
    Three of them (town-147, city-127 and city-149) are also carriers, so the total is 39 + 24 = 63. The 27 is B1I's own
    figure.
- **Pages moved: C 291, V 226** (`diff/cures-batch-{C,V}.txt`, `diff/pages-cures-batch-{C,V}.tsv`).
  - C: 290 in World/Traditions only. This is B1(ii) (3388806b4, "no tradition blesses fields the place does not have",
    `field` weighs 0). All 140 B1furrow pages are among them, and the rest re-deal their traditions.
  - C: 1 in Systems/Power only (artifact).
  - V: the 63 pages of the moved records, all moved.
  - V: 157 in World/Traditions only, from B1(ii). All 73 B1furrow pages are among the 209 Traditions moves.
  - V: 6 in Systems/Power only (artifact).
  - No page moved anywhere else. P3source moved no page whose record holds, on either corpus.
- **The rows:**

  | row | C CURES | C BATCH | V CURES | V BATCH |
  |---|---|---|---|---|
  | B1land | 0 | 0 | 26 | **0** |
  | B1furrow | 140 | **0** | 73 | **0** |
  | P3source | 0 | 0 | 0 | 0 |

  - B1land on V CURES: 26 of the 27 desert movers. dp-city-17 moves without holding the row.
  - C1 has no row of its own. Its carriers are counted above.
- **The artifact (CONFIRMED that only these lines differ; the cause is PLAUSIBLE):** every Systems/Power-only move is the
  "Patron deity" card, two lines, present on one render and absent on the other.
  - The places are C dp-thorp-0, and on V thorp-0..3, town-1 and town-3.
  - The card is missing on the first births a battery worker renders, on every tree. On C, town-0..3 lack it on all three
    trees.
  - This is the first-birth render effect that MIRROR and GUARD reported. It is not a cure.

## Every other battery row: LINE, CURES, BATCH (CONFIRMED; `counts/rows-all-trees-{C,V}.txt`)

| row | C LINE | C CURES | C BATCH | V LINE | V CURES | V BATCH |
|---|---|---|---|---|---|---|
| P5b | 1 | 1 | 1 | 0 | 0 | 0 |
| P8any | 60 | 60 | 60 | 134 | 134 | 134 |
| P9 | 0 | 0 | 0 | 129 | 129 | 129 |
| P14 | 1 | 1 | 1 | 1 | 1 | 1 |
| P16three | 348 | 348 | 348 | 237 | 237 | 237 |
| P17 | 603 | 603 | 603 | 486 | 486 | 486 |
| P18 | 419 | 419 | 419 | 416 | 416 | 416 |
| P19 | 0 | 0 | 0 | 2 | 2 | 2 |
| NEW2 | 0 | 0 | 0 | 6 | 6 | 6 |
| P2siege, P3source, P4, P5false, P6need, P7a, P7b, P10, P11, F4, P13, P16powers, P20, NEW1 | 0 | 0 | 0 | 0 | 0 | 0 |

**No other row moves.** `--diff` reads rows moved 0, birth by birth, on LINE -> CURES and on CURES -> BATCH for both
corpora, so the same births hold each row.

## Also seen (V, CURES -> BATCH; CONFIRMED; not asked)

- A2's table moves on V because 5 records' production bands and 1 printed band move with the B1(i) and C1 records:
  - pressured|adequate 75 -> 72;
  - pressured|critical 22 -> 24;
  - pressured|strained 84 -> 83;
  - pressured|surplus 13 -> 14;
  - secure|strained 136 -> 137.
- Empty resentment slots stay at 420 overall (town +1, city −1).
- C's table is unmoved.
