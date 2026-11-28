# S-D: THE MONEY FAMILY'S RESIDUE (measure only; code tip held at a518d4244)

SURVEY-TABLE, 2026-11-28, for the chair's rulings file (RULINGS-SURVEY-BRANCHES.md, 951755e67).

**METHOD.**
- **The six desks.** I ran a word net over all 3,189 lines of the six generated desks: 180 rows on the first net, 247 on
  a second, wider net (coin, purse, treasury, accounts, wages, afford, wealth). Every row was read by me. Food stores,
  persons' debts (NPCs, Relationships, the personal plot hooks), an institution's wealth and "balance" used as a figure
  of speech are left out.
- **Everything else that prints.** Daily Life, the Outlook and viability rows, the hooks, and the Overview and History
  lines: printed sentences from 1,800 owner pages (C 900, V 900) were netted, and each recurring one was traced to its
  source.
- **What counts as printed.**
  - The four S-B2 slots (DS-ECO-1 header, DS-ECO-8 rung tile, DS-DEF-2 Economic Survival row) are read AT THE TIP
    a518d4244, from the function-level picks (S-B2's after-measure).
  - Every other line is read off the S-B tree's rendered pages, which are byte-equal to the base (S-B's proof). A line
    counts as printed when one of its fixed fragments is on the page.
- **The facts.** These are the final record's desk facts (`deskFactsOf`): `place debt` with its hook leg as it stands
  today, and `nothing laid by`.
- **Kinds of line.**
  - Claims: **S** savings, money in hand or a reserve; **Y** a yearly surplus, the accounts balancing, or "pays its way";
    **F** free of debt.
  - Wants: **D** the place owes now; **R** no reserve, or short of coin.
- **What rules a line out.**
  - S: `nothing laid by` or `place debt`.
  - Y and F: `place debt`.
  - D: the record holds no debt. No printed line states that, so these are counted apart as UNSOURCED.
  - R: the survival row reads Strong or Adequate.

## 1. THE PAGES THAT PRINT A CLAIM BESIDE A FACT RULING IT OUT

A claim is ruled out on a page when its kind's fact holds on that page's record (see METHOD). REAL means a cold reader sees two
things that cannot both be true. SOFT means two different things a page can say together, the kind of pair RULING-R's R5 and
S-B-3's neighbour table ruled. Each verdict is my reading.

| line | kind | declares today | pages C\|V | ruled out C\|V | what rules it out | verdict |
|---|---|---|---|---|---|---|
| DS-ECO-1 C1#2 "…ends each year with money to spare." | Y | `no crisis: indebted` | 20\|29 | **4\|3** | place debt (the tension or the hook leg; the crisis is guarded) | **REAL**. Same claim as C3 v2 "pays its way" (122-B-2 F2) |
| DS-ECO-8 MODERATE#4 "…accounts still balance…" | Y | `no crisis: indebted` | 66\|20 | **1\|1** | place debt (C:dp-hamlet-116, V:dp-village-38) | **REAL**, if "the accounts balance" is "pays its way" (the chair's word) |
| DS-DEF-12 MAGIC-DEPENDENT#1 "…accounts … balance only because supplies arrive by magic" | Y | none | 0\|4 | 0\|2 | place debt | SOFT. The claim is the magic, and "balance only because" is conditional |
| DS-DEF-2 STRONG#2 "…could go through a bad season with its arrangements intact…" | S | `no crisis` | 98\|90 | 14\|9 | place debt (23 towns, cities and metropolises) | SOFT. It says nothing of money in hand or debt, and STRONG v14 shows the two together |
| DS-DEF-2 ADEQUATE#1, #2, #3 ("can fund a short crisis…", "…for a while…", "…the money would run out") | S | none (keyed: the band is Adequate) | 36\|76, 43\|84, 26\|77 | 3\|5, 4\|8, 3\|9 | place debt | SOFT. These are thin, limited funds, which a debt does not rule out (v14's precedent). Their `no nothing laid by` holds by the key |
| DS-ECO-8 PROSPEROUS#1 "…has money to spend, and spends it…" | S | `no crisis: indebted` | 14\|19 | 9\|4 | nothing laid by: beside WEAK#6 on 10, beside **CRITICAL #1 or #3 on 3** | SOFT beside WEAK#6, which is written for this case ("well off, but little … set aside"). **REAL beside CRITICAL** ("could not pay for a bad month") |
| DS-ECO-8 PROSPEROUS#3 "There is money here and it goes into the town." | S | none (`colour`) | 20\|18 | 15\|4 | nothing laid by: beside WEAK#6 on 16, beside **CRITICAL#2 on 1** ("has no money to meet trouble"); place debt on 3 | SOFT, except **REAL** beside CRITICAL#2 (C:dp-thorp-14) |
| DS-ECO-8 WEALTHY#3 "…What would be a crisis elsewhere is an expense here." | S | none | 0\|38 | **0\|10** | nothing laid by: beside WEAK#6 ("…a long crisis would soon outrun what is") on 8 V; place debt on 3 | **REAL** beside WEAK#6. SOFT beside Adequate (20) |
| DS-ECO-8 WEALTHY#1 "…reserves deep enough to ride out most of what could happen…" | S | none (`stores: ≥ 3`) | 0\|19 | 0\|1 | place debt (V:dp-city-126, beside STRONG v14 "money in hand, but it is owed elsewhere") | SOFT (v14's own pair) |
| DS-ECO-8 POOR#4 "Money is short in …" | R | none | 13\|67 | 8\|39 | the Adequate band (all 47; never Strong) | SOFT. Both say the funds are thin |
| DS-ECO-8 STRUGGLING#2 "…waits for money that does not come." | R | none | 5\|17 | 0\|3 | the Adequate band | SOFT |
| tier line "…none has much put by." (narrativeGenerator SMALL_PLACE_TIER_LINES#2) | R | none | 57\|57 | 0\|10 | Strong or Adequate | SOFT. It speaks of the households, not the treasury |
| DS-POW-6 capture ADVANCING#4 "…too poor to pay the few people who hold office…" | R | none | 14\|36 | 0\|1 | Adequate | SOFT |

**These are ruled out on 0 pages, and need nothing:**
- C3 #1 and #2; MODERATE #1 and #3; COMFORTABLE #1 and #2; STRONG #1, #3, #8, #9 and #12. These are S-B2's
  declarations.
- The viability rows SS1, SS2, SS4 and SS5. They are gated by `owesDebtShown`, which is the same reader.
- Every D line beside a debt: C3 #4 and #5, MODERATE#5, COMFORTABLE#5, STRONG #5 to #7 and #14, DS-DEF-3's debt
  compound, DS-DEF-8 UNDER TRIBUTE, DS-CND-1's indebted lines, the outside_debt tension line. STRONG #5 to #7 declare
  `crisis: debt`, which this note's first draft missed.
- Every R line beside the band: DS-DEF-2 WEAK and CRITICAL, COMFORTABLE#6, the safety clause (40 pages, all Weak or
  Critical: see S-D-PROSPERITY.md).

**UNSOURCED DEBTS: a line says the place owes where the record holds no debt.**
- DS-ECO-8 STRUGGLING#5, "Whoever keeps {settlement}'s purse pays the most pressing debt each month…", is undeclared. It
  prints on 29 tip towns, 27 of them with no place debt. Beside it the band is Critical 13, Weak 6 and Adequate 8, and
  no Y, S or F line prints at that rung, so nothing printed contradicts it.
- The trade-dispute hook, "The partner settlement is applying pressure through a debt no one here wants to acknowledge"
  (historyData.js:1683), is a place debt the atom does not read. It prints on 61 pages with no place debt (C 25, V 36).
  On **60** of them it stands beside a declared solvency line or a survival row of Strong or Adequate. For example,
  C:dp-village-59 prints C3 v2 "pays its way from year to year" and COMFORTABLE v1 "…money laid by behind it" beside it.
  By the order of hardness the hook (drawn) is the softer side and would declare `place debt`.
  - This move is **CONFIRMED**: the hook yields on those 61 pages, by count.
  - That no slot goes empty is **PLAUSIBLE**: the event's other two hooks carry no needs, by reading.
- The moneylender hook (conflictIssues.js:115, "…from whichever side pays first") is a debt between two powers. It is a
  DIFFERENT THING, and nothing is needed.

## 2. THE READER'S "26 LINES OUTSIDE THE WALKER'S WORDS" (reader1/reader-notes.md §4), ONE BY ONE

- **On the owner page.** These are the reader's lines that print on owner pages. All of them are in §1:
  - DS-ECO-1 C1#2 and MODERATE#4: REAL, cure below.
  - PROSPEROUS #1 and #3, WEALTHY#1, and DEF-2 ADEQUATE #1 to #3: SOFT, except the CRITICAL and WEAK#6 pairs in §1.
  - DS-DEF-6 Well-funded#1: prints on 0 pages.
- **The general desk prints on NO owner page of the 1,800.** That covers DS-GEN-3 scores.economic STRONG #1 and #3 and
  ADEQUATE #1 and #2; the prosperity lines Struggling/Poor#2, Moderate #1 and #2, Comfortable #1 and #2, Wealthy#2 and
  Poverty#2; DS-GEN-7 siege #1 and #4 and recovery #2 and #4; DS-GEN-11 viable#3; and the walker's three allowed rows.
  The reason is that DS-GEN-3 and DS-GEN-7 mount at the GLANCE rung, which draws no sentence (the owner's order of
  2026-09-17, dossierMounts.js:362-375), and DS-GEN-11 drew none of them. They clash nowhere today. They would need
  their declarations, `no place debt` for Y and F and `no nothing laid by` for S, on the day a mount draws them. Whether
  the PDF prints them was not measured here.
- **The six that carry only `no crisis: indebted`.** C1#2 and MODERATE#4 are among them. Each guards one leg of the
  three, and the other two legs (the tension, the hook) are where their four pages and two pages come from.

## 3. THE DEFENSE DESK BEYOND STRONG

- **DS-DEF-2 ADEQUATE #1 to #3:** SOFT beside a debt (above). They are keyed on the band, so `no nothing laid by` holds.
- **DS-DEF-2 WEAK #1 to #6 and CRITICAL #1 to #3:** keyed on `nothing laid by`, so they are never ruled out. The real
  pairs are on the other side: PROSPEROUS #1 and #3 beside CRITICAL (4 pages), and WEALTHY#3 beside WEAK#6 (8 pages).
- **DS-DEF-3 COMPOUND: debt crisis, DS-DEF-8 UNDER TRIBUTE and DS-DEF-2 STRONG #5 to #7:** D lines. They print only
  where the debt holds: 0 of their pages are ruled out.
- **DS-DEF-6 Economic Backing, DS-DEF-4 capture#1, DS-DEF-12 MAGIC#1:** 0 pages, 0 pages and 2 SOFT, respectively.

## 4. FOR THE FAMILY: ATOMS, ROWS, LINES TO DECLARE, PAGES THAT MOVE, EMPTIES

- **ATOMS.** `place debt` and `nothing laid by` are enough for every REAL pair except the CRITICAL ones. Those need one
  of two things:
  - a band atom on the Economic Survival band. This is new vocabulary, on the owner's veto list, and the same need as
    S-D-PROSPERITY's held `≤ comfortable` pair;
  - or a new CRITICAL line for a high rung, in the manner of WEAK#6. That is text, so it is the chair's.
- **TABLE ROWS.** No new row. The walker's `said` words could gain `money to spare` and `accounts (still )?balance` for
  the `place debt` row's side b, and `reserves deep enough` and `an expense here` for `nothing laid by`'s side b. Those
  are the reader's words the walker does not read today. Adding them reds exactly the lines named here until they
  declare.
- **LINES TO DECLARE (the softer side).** Pages are C | V, counted at the tip.

  | line | today | becomes | pages that move | fills the slot |
  |---|---|---|---|---|
  | DS-ECO-1 C1#2 | `no crisis: indebted` | `no place debt` | 4 \| 3 | C1 #1, #3, #5, #6 and #7 hold there, by marks. C1#4 needs the crisis. No empty |
  | DS-ECO-8 MODERATE#4 | `no crisis: indebted` | `no place debt` | 1 \| 1 | MODERATE#5 (crisis: any, `place debt`). No empty |
  | DS-ECO-8 WEALTHY#3 | none | `no nothing laid by` | 0 \| 8 | WEALTHY #1 (`stores: ≥ 3`) or #2 (`gate, market`). **Not measured: an EMPTY tile is possible on some of the 8, and must be measured before the build** |
  | trade-dispute hook | none | `place debt` | 25 \| 36 | the event's other two hooks |

  - Each declaration says only what its line leans on (S-B-2). Where a line now names `no crisis: indebted`,
    `no place debt` replaces it, because it covers the crisis (the table's row `the indebted crisis is a place debt`).
  - The census would register none of these pairs today. C1#2, MODERATE#4 and WEALTHY#3 declare no side of a row, and
    the hook has no row. They are below its floor, not cured by it.
- **HELD FOR THE CHAIR.**
  - The four CRITICAL pages: C:dp-thorp-14, C:dp-thorp-143, C:dp-village-49 and V:dp-hamlet-98.
  - STRUGGLING#5's 27 unsourced pages: declaring `place debt` would move 27.
  - Whether "the accounts balance" is "pays its way". MODERATE#4 depends on it.
- **AT THE MERGE (ruling 122-B-5).** With the hook leg gone, the towns where `place debt` stands on the Debt Crisis hook
  alone (by my text reading 23 | 19; the reader's leg count is 25 on C) become `no place debt`. S-B2's solvency lines
  are then ADMITTED there. They would print "pays its way" or "money laid by" beside the hook that still prints: "A
  creditor's agent is in town conducting a quiet assessment before enforcement", "The debt could be voided…", "External
  Debt". This is what the trade-dispute hook does today on 60 pages. Unless those hooks declare `place debt` too, the
  merge's re-measure will show these towns move, and the census's `place debt` row cannot see them, because the hook is
  no side. **This is for the chair before the merge.**

## 5. DS-GEN-3, 7 AND 11: THE GLANCE MOUNT AND THE PDF, MEASURED (the chair's ruling at 13:45)

**METHOD.** Each of the 1,800 births of C and V was re-born on a518d4244 and stamped with its public prose. Then
`generalDeskLines(town)` (the screen's general desk) and `buildPrintProse(town)` (the PDF's state prose,
`generateSettlementPDF.js:318`) were called with the presumption ledger open. **DRAWN** means the kernel noted the line
drawn. **SCREEN** and **PDF** mean one of the line's fixed fragments is in that output. This was a scratch instrument; it
was removed and never committed.

| the reader's line | drawn C\|V | screen | PDF |
|---|---|---|---|
| DS-GEN-3 scores.economic STRONG#1, STRONG#3 | 112\|98, 114\|94 | 0 | 0 |
| DS-GEN-3 scores.economic ADEQUATE#1, ADEQUATE#2 | 45\|100, 28\|54 | 0 | 0 |
| DS-GEN-3 prosperity Struggling/Poor#2 | 14\|90 | 0 | 0 |
| DS-GEN-3 prosperity Moderate#1, Moderate#2 | 18\|40, 105\|90 | 0 | 0 |
| DS-GEN-3 prosperity Comfortable#1, Comfortable#2 | 204\|108, 206\|118 | 0 | 0 |
| DS-GEN-3 prosperity Wealthy#2 | 0\|28 | 0 | 0 |
| DS-GEN-3 prosperity Poverty#2 | 0\|0 | 0 | 0 |
| DS-GEN-7 siege #1, #4 | 2\|1, 2\|0 | 0 | 0 |
| DS-GEN-7 recovery #2, #4 | 0\|0 | 0 | 0 |
| DS-GEN-11 viable#3 "The town works, and pays its way." | 240\|234 | 0 | 0 |

**THE RESULT.**
- The lines ARE DRAWN at their mounts: DS-GEN-3 systemsHealth and DS-GEN-7 warnings are glance mounts, and DS-GEN-11's
  viable lens is drawn but unshown.
- **They print nowhere.** `drawnAtMount` strips the sentence at a glance mount, and the print desk routes through it
  (`printProse.js:75`). The viability verdict shows only the `criticalIssueCount` lens on screen (`generalDeskRead.js:389`)
  and in the PDF (`printProse.js:579`).
- No page, screen or PDF, prints any of them beside a debt. They need no declaration until a registry act gives these
  blocks a speaking position. The ledger does note their draws, so they stand on no census side that prints.
- **Two other hits, unread.** The PDF holds two fragments of OTHER lines of these blocks: DS-GEN-3 scores.monster CRITICAL#1
  on 208 towns, and DS-GEN-7 structuralSuggestions#2 on 42. Neither is a money line. They are probably a fragment shared
  with another printed sentence. I did not read them further.

## 6. THE HIGH RUNGS BESIDE A PLACE DEBT (the chair's addition at 14:55: the line's delta reader)

**THE RULING.** The middle rungs' rule applies: each line that claims a surplus, reserves or money in hand EXCLUDES
`place debt`, not only the crisis.

**METHOD.** As in §1: the slots are read at the tip from the function-level picks, and the facts from the final record.
"Today" is `place debt` with its hook leg. "After 122-B-5" counts only pages whose debt is the indebted stress (I) or a
printed outside_debt tension (T). Pages marked (H?) print neither, so they stand on the hook leg, or on a tension whose
words my text match does not catch. The ids are vids, so they match the reader's own.

| line | pages C\|V | beside place debt, today C\|V | after 122-B-5 (I or T) | the reader's towns | my reading → cure |
|---|---|---|---|---|---|
| DS-ECO-1 C1 v2 "…ends each year with money to spare." | 20\|29 | 4\|3 | 3\|1 (+ C:dp-village-27 H?) | C dp-thorp-113, dp-hamlet-8, dp-village-27, dp-village-94; V dp-city-126 | a surplus → `excludes: place debt` (as ruled at 13:45) |
| C1 v7 "…nobody there counts the margin closely." | 19\|46 | 2\|4 | 2\|3 | 2 C, 3 V | a comfortable margin is the yearly surplus → **`excludes: place debt`** |
| C1 v6 "…a lean year would cost it comfort, not bread." | 29\|47 | 3\|3 | 2\|1 | (not named) | SOFT: it claims resilience, no money in hand → no cure |
| C1 v5 "…its approach serves it, and the place does well on it." | 18\|30 | 0\|3 | 0\|2 | (not named) | SOFT: no money claim → no cure |
| DS-ECO-8 PROSPEROUS v3 "There is money here … Nobody argues about whether a thing can be afforded…" | 20\|18 | 2\|1 | 2\|1 | 2 C, 1 V | money in hand → `excludes: place debt` (and `nothing laid by`, as ruled for the CRITICAL pages) |
| PROSPEROUS v5 "Nothing … is left to fall into disrepair for want of money." | 21\|25 | 2\|1 | 1\|0 | C dp-thorp-113 | money enough → `excludes: place debt` |
| PROSPEROUS v7 "Money keeps going into what … has built, and the upkeep never waits on it." | 27\|29 | 2\|2 | 1\|1 (+1\|1 H?) | 2 C, 1 V | money in hand → `excludes: place debt` |
| PROSPEROUS v1 "…has money to spend…" | 14\|19 | 0\|0 | 0\|0 | (not named) | `excludes: nothing laid by` (as ruled); place debt 0 here, but the same claim → also `excludes: place debt` |
| PROSPEROUS v2, v4 "…visibly well off…" | 8\|20, 14\|14 | 1\|0, 1\|0 | 1\|0, 1\|0 | (not named) | SOFT: what the place looks like, not money in hand → no cure |
| PROSPEROUS v6 "…spends freely on itself, and keeps no great hoard." | 27\|24 | 1\|4 | 1\|3 | (not named) | SOFT: it disclaims a reserve; spending is not a surplus claim → no cure |
| DS-ECO-8 WEALTHY v1 "…reserves deep enough to ride out most of what could happen to it." | 0\|19 | 0\|1 | 0\|1 | V dp-city-126 | reserves → `excludes: place debt` (I had called it SOFT at §1; the ruling stands over my reading) |
| WEALTHY v3 "…What would be a crisis elsewhere is an expense here." | 0\|38 | 0\|3 | 0\|1 | V dp-village-133 | `excludes: place debt` and `excludes: nothing laid by` (13:45) |
| WEALTHY v2 "The wealth here is not the kind a stranger has to look for…" | 0\|17 | 0\|2 | 0\|1 | (not named) | SOFT: appearance → no cure |

**THE NO-EMPTY-TILE RULE, BY READING THE MARKS** (each is to be measured on the merged tree before the build):
- **C1 header: no empty.** Without v2 and v7, the header still has v1 (no mark), v3 (`no hunger`), v5 and v6
  (`no crisis: indebted`), all of which hold on a page whose debt is a tension.
- **PROSPEROUS tile: no empty.** Without v1, v3, v5 and v7, v2 (`walls`) and v4 (`no walls`) are complementary, so one
  always holds. v6 (colour) is also left.
- **WEALTHY tile: an EMPTY IS POSSIBLE.** Without v1 and v3, only v2 is left, and it needs `gate, market, crisis: any`.
  The chair's fill line, "{settlement} is rich, and spends what it has as fast as it comes in.", is `needs: nothing laid
  by`. That does not hold on a place-debt page whose band is Strong or Adequate. V:dp-city-126 (STRONG v14, place debt)
  is such a page: there, neither v1, v3 nor the fill line stands, so only v2 can, if the town has a gate and a market.
  **Measure on the merged tree.** If it empties, the fill needs a reading that covers a debt as well (the chair's word).
- **The census after the build.** Every line above declares the `place debt` row's side b, so the row counts them. They
  are refused wherever `place debt` holds, so the census's money pair is 0. That is to be shown by the census run on the
  merged tree.
