# WANTS-PROPOSAL · the wants' tranche: where the new lines go, cell by cell

GOALS-3 · builder 9 · 2026-11-20, on GOALS-3's brief (`briefs/GOALS-3-BUILDER-9-BRIEF.md`, eed0a95f2) after the owner's
word ("So do what you can to comprehensively fix the sameness fault as much as you can"). Docs only: no source and no
test is changed; nothing is built until the chair has read this and the line files. Every figure below is from the
scripts beside this file, on 363cea0ab, the chair's 300 measure towns (`hxd-<size>-<i>`, 50 a size) and its masker.

## 1. The fault, measured by pool

`wants-born.mjs` births the towns and reads each want's CELL (family / sub-kind / vantage) from the deal's own receipts
(`goals.js :: goalReceiptsOf`, captured in memory as the pipeline calls the deal; `wants-hooks.mjs`); `wants-by-pool.mjs`
measures (all 2,450 ordered pairs a size; `wants-by-pool.out.txt`).

| a second town repeats, of a first town's wants | short | long |
|---|---|---|
| city (60 wants a town) | **36.4%** | **36.0%** |
| metropolis (84 a town) | **47.3%** | **47.2%** |

(The chair's 34.5% / 35.4% and 44.4% / 45.7% were 600 random pairs on its own line; same metric, this tree.)

**Where it comes from.** A dozen small cells whose holdings per town outnumber their lines. RANK/enter (six lines a
vantage, held 8.5–9.3 times a city and 12.5–12.8 a metropolis) carries 28–29% of all of a city's repeats by itself;
TIES/rival_enemy (5 lines, 5.2–7.7 a town) 15–18%; TIES/ally (5 lines) 8–12%; INSTITUTION/solvency and /charter
(6 lines) 6–10% each. When a town holds a cell more times than it has lines, every town holds every line of it, and
the repeat across towns is certain. Within a town the lane's gate holds (0 identical sentences at 363cea0ab), and the
rotation does what it was built for: RANK/enter/short's 1,048 city and metropolis holdings put 334 on its four reserve
lines. But the reserve is taken in ROTATION ORDER (the first free line after the drawn one, the reserve after the cell),
so every overflowing town takes the same reserve lines first (template use, (B): R0 106, R1 92, R2 73, R3 63): the
reserve serves repeats inside a town and does nothing across towns.

**The holders** (every cell's offices and kinds, in `wants-by-pool.out.txt` (B)): RANK/enter is held by unranked members
of a power, in cities mostly the masters of a craft or trade (senior charter master, master smith, master fishmonger,
potter, tailor, warehouse factor, bowyer), whose power is a merchant or craft guild about three times in five, else a
council or governorship, the guard, the church, an order or a noble house. TIES cells are held by every office; a
tenth of rival_enemy's and a fifth of solvency's holders are the underworld's.

## 2. The bill by cell (`wants-by-pool.out.txt` (C); verified by birth)

**The model.** A cell of N drawn lines deals its templates without replacement inside a town (the held-text filter and
the wording rule), so a want of B (template j, fill f) stands among A's with chance min(1, m_A(f)/N), where m_A(f) is
A's holdings of that cell with the same fill (names masked; an unmasked fill, a house noun or a resource, kept); the
overflow past N takes the reserve in rotation order. That gives each cell's points of the pair share at N = n + k
exactly in expectation; each cell is calibrated to its own observed points (the raw model reads 39.8% for 36.4%), and a
greedy adds one line at a time where it buys the most fall.

**Why the chair's +180 / +200 was high.** Its groups counted DISTINCT masked texts as a cell's lines (INSTITUTION/solvency
"171", charter "160": the house nouns the masker leaves unmasked), so "×1.5" on those two cells alone added 166 lines.
At the level of the lines themselves the bill is far smaller.

**The bills, each verified by a birth with placeholder lines appended in memory** (`wants-verify.bill*.out.txt`; the
placeholders are distinct drawn lines, exactly what new lines are):

| bill | lines | city short · long | metropolis short · long | holdings moved, 300 towns |
|---|---|---|---|---|
| now | 0 | 36.4% · 36.0% | 47.3% · 47.2% | – |
| BILL 1: a second city under 30% | **38** | **29.1% · 29.3%** | 41.3% · 41.2% | 6,178 (247 towns) |
| BILL 2: a second metropolis under 30% too | **129** | 20.1% · 20.3% | **29.9% · 29.9%** | 9,601 (278 towns) |
| BILL 3: to the ~380 the chair named | **380** | 11.8% · 12.3% | 16.8% · 17.3% | 13,695 (293 towns) |

Inside one town, after each: **0 identical goal sentences** (`wants-verify.*`). The town tier falls too (19.9% → 15.0%,
10.9%, 5.5% short).

## 3. The proposal: 380 drawn lines in 34 cells, in seven files, worst first

I propose BILL 3 (the owner asked for the fault fixed as far as it can be; 380 is the chair's own figure), written and
read in the BUILD ORDER of `wants-by-pool.out.txt`: every bill's lines in the order of the fall they buy, cut into files
of sixty. Each file is a usable stopping point: if the chair stops after file 1, the cities are already under 30%; after
file 2, the metropolises.

| after file | lines | city short · long | metropolis short · long |
|---|---|---|---|
| 1 (WANT-LINES-1.md, WRITTEN; born with its real lines) | 60 | **25.0% · 26.1%** | **36.4% · 37.0%** |
| 2 | 120 | 19.9% · 19.8% | 29.8% · 29.7% |
| 3 | 180 | 16.8% · 16.9% | 24.6% · 25.6% |
| 4 | 240 | 14.8% · 14.8% | 21.3% · 21.6% |
| 5 | 300 | 13.1% · 13.1% | 18.8% · 19.1% |
| 6 | 360 | 11.8% · 11.8% | 16.9% · 17.0% |
| 7 | 380 | 11.4% · 11.5% | 16.2% · 16.7% |

(Files 2–7: the calibrated model, which the births above match within a point: bill 1 projected 28.9% / 28.9%, born
29.1% / 29.3%; bill 2 projected 28.8% / 29.0% metropolis, born 29.9% / 29.9%.)

**Cell by cell** (the +bill columns are cumulative; "moved" = the holdings of that cell, on the 300 towns, whose text
changes under bill 3: onto a new line, or to another of the cell's lines; the cascade into cells not appended is 37 in
all):

| cell | lines now (+reserve) | held a town (city · metro) | its share of the repeats (city · metro) | +file 1 | +bill 1 | +bill 2 | +bill 3 | holdings moved, 300 towns (bill 3) | holders: offices (most first) · kinds |
|---|---|---|---|---|---|---|---|---|---|
| RANK/enter/short | 6 (+4) | 8.50 · 12.46 | 28.3% · 26.2% | 15 | 7 | 24 | 49 | 1212 | senior charter master, master smith, master fishmonger, potter, tailor, warehouse factor · other 55%, economy 20%, government 11% |
| RANK/enter/long | 6 (+3) | 9.26 · 12.80 | 28.8% · 26.3% | 16 | 13 | 25 | 49 | 1258 | senior charter master, customs collector, prison warden, cobbler, bowyer, glassmaker · other 52%, economy 17%, government 12% |
| TIES/rival_enemy/short | 5 (+2) | 5.20 · 7.64 | 17.3% · 17.7% | 9 | 7 | 15 | 30 | 774 | fortune teller, master fishmonger, master baker, warehouse factor, cooper, cobbler · other 51%, economy 17%, criminal 10% |
| TIES/rival_enemy/long | 5 (+4) | 5.64 · 7.70 | 16.5% · 15.1% | 4 | – | 14 | 30 | 764 | master fishmonger, chief magistrate, customs collector, whisper broker, luxury merchant, woodcarver · other 46%, economy 17%, criminal 13% |
| INSTITUTION/solvency/short | 6 (+2) | 6.18 · 9.30 | 8.7% · 9.9% | 2 | 1 | 8 | 19 | 899 | whisper broker, midwife, outfitter, senior craft-guild master, banker, warehouse factor · other 39%, economy 19%, criminal 18% |
| TIES/ally/long | 5 (+0) | 3.80 · 4.76 | 12.1% · 9.5% | 4 | 4 | 7 | 19 | 523 | customs collector, warehouse factor, midwife, brewer, fortune teller, master butcher · other 49%, economy 15%, government 12% |
| POWER/tense/short | 6 (+2) | 2.16 · 6.28 | 2.1% · 9.7% | – | – | – | 18 | 575 | apothecary, potter, master weaver, bowyer, house boss, tailor · other 58%, economy 21%, criminal 11% |
| INSTITUTION/solvency/long | 6 (+4) | 6.96 · 9.90 | 8.9% · 9.1% | 2 | 1 | 8 | 18 | 967 | network's head, black marketeer, chief magistrate, scroll scribe, dean, guildmaster of thieves · other 38%, criminal 20%, economy 15% |
| TIES/ally/short | 5 (+0) | 3.68 · 4.22 | 11.5% · 8.0% | 3 | 3 | 6 | 17 | 470 | chief magistrate, scroll scribe, bath-keeper, senior craft-guild master, master metalworker, apothecary · other 46%, economy 18%, criminal 12% |
| POWER/tense/long | 6 (+3) | 1.98 · 6.48 | 1.6% · 9.7% | – | – | – | 17 | 562 | apothecary, master weaver, master butcher, tailor, cobbler, senior guild master · other 59%, economy 22%, criminal 9% |
| INSTITUTION/charter/short | 6 (+0) | 5.60 · 7.08 | 6.8% · 6.1% | 1 | – | 4 | 14 | 743 | dean, master of granaries, enchanter, chief magistrate, hospital's master, crier · other 44%, economy 20%, government 13% |
| INSTITUTION/charter/long | 6 (+1) | 5.52 · 7.86 | 6.5% · 7.1% | 2 | 1 | 5 | 14 | 792 | garrison commander, master of granaries, chief magistrate, sawyer, outfitter, tailor · other 47%, economy 20%, government 11% |
| RANK/climb/short | 6 (+0) | 2.96 · 3.36 | 5.9% · 4.3% | 1 | 1 | 3 | 11 | 411 | hospital's master, mint master, sage, college master, chief magistrate, miller · other 35%, economy 19%, religious 13% |
| PERSONALITY/sway/long | 4 (+2) | 1.92 · 2.56 | 4.1% · 4.1% | 1 | – | 3 | 8 | 256 | apothecary, ropemaker, fortune teller, mint master, master of granaries, lady · other 46%, economy 17%, government 13% |
| PERSONALITY/grudge/long | 4 (+2) | 1.78 · 2.10 | 3.6% · 2.7% | – | – | 2 | 7 | 217 | fortune teller, ropemaker, gang boss, workhouse master, dean, warehouse factor · other 46%, economy 16%, military 9% |
| TIES/mentor_student/short | 5 (+0) | 1.88 · 2.36 | 2.8% · 2.5% | – | – | 1 | 6 | 268 | dean, lord, company captain, sage, scroll scribe, mine captain · other 42%, economy 17%, criminal 9% |
| TIES/mentor_student/long | 5 (+0) | 1.58 · 2.60 | 2.1% · 3.3% | – | – | 2 | 6 | 242 | guild archmage, scroll scribe, beast master, master fishmonger, mine captain, master weaver · other 37%, economy 22%, criminal 11% |
| PERSONALITY/sway/short | 4 (+1) | 1.44 · 1.78 | 2.4% · 2.0% | – | – | 1 | 5 | 185 | ropemaker, sawyer, senior charter master, fortune teller, chief magistrate, glassmaker · other 50%, economy 19%, criminal 10% |
| PERSONALITY/grudge/short | 4 (+1) | 1.16 · 1.94 | 1.5% · 2.3% | – | – | 1 | 5 | 172 | chief magistrate, cartographer, theatre manager, master weaver, dyer, bath-keeper · other 49%, economy 14%, criminal 11% |
| TIES/debtor/short | 5 (+0) | 1.32 · 2.10 | 1.5% · 2.1% | – | – | – | 5 | 198 | dean, garrison commander, mine captain, guild archmage, fortune teller, ropemaker · other 39%, economy 20%, government 9% |
| RANK/climb/long | 6 (+0) | 2.28 · 2.74 | 2.6% · 1.9% | – | – | – | 5 | 335 | college master, miller, lodge master, scroll scribe, mint master, chancellor · other 37%, economy 19%, magic 11% |
| TIES/debtor/long | 5 (+0) | 1.58 · 1.88 | 2.1% · 1.8% | – | – | – | 5 | 202 | tailor, dean, guild archmage, warehouse factor, potter, stable master · other 42%, economy 16%, religious 10% |
| SUPPLY/expansion/long | 6 (+0) | 2.90 · 2.28 | 3.1% · 0.9% | – | – | – | 4 | 288 | house boss, coaching-inn keeper, brewer, college master, miller, vintner · other 57%, economy 27%, criminal 8% |
| PERSONALITY/greed/short | 4 (+1) | 1.04 · 1.44 | 1.2% · 1.3% | – | – | – | 3 | 133 | lady, beast master, woodcarver, miller, glassmaker, luxury merchant · other 45%, economy 18%, criminal 14% |
| SUPPLY/expansion/short | 6 (+0) | 3.00 · 2.46 | 2.3% · 0.9% | – | – | – | 3 | 295 | cartographer, customs collector, house boss, vintner, master furrier, brewer · other 56%, economy 27%, government 11% |
| PERSONALITY/greed/long | 4 (+1) | 0.92 · 1.70 | 0.9% · 1.8% | – | – | – | 3 | 152 | banker, hospital's master, fortune teller, bowyer, master butcher, senior charter master · other 39%, economy 18%, government 15% |
| ALLEGIANCE/warrant/short | 6 (+0) | 1.52 · 1.80 | 1.4% · 1.1% | – | – | – | 2 | 141 | watch commander, garrison commander, prison warden, castellan · military 75%, government 25% |
| RANK/defend/long | 6 (+0) | 1.40 · 1.88 | 1.0% · 1.1% | – | – | – | 2 | 156 | dean, garrison commander, senior craft-guild master, lord, guild archmage, lady · economy 24%, other 20%, religious 20% |
| RANK/defend/short | 6 (+0) | 0.98 · 1.64 | 0.6% · 1.0% | – | – | – | 1 | 97 | dean, lord, lady, guild archmage, governor, garrison commander · religious 26%, other 24%, economy 19% |
| PERSONALITY/impulse/short | 4 (+1) | 0.72 · 0.94 | 0.6% · 0.5% | – | – | – | 1 | 57 | auctioneer, bath-keeper, woodcarver, whisper broker, beast master, warehouse factor · other 54%, criminal 17%, economy 12% |
| TIES/creditor/short | 5 (+0) | 1.00 · 1.34 | 0.9% · 0.8% | – | – | – | 1 | 65 | smelt master, guild archmage, Lord Mayor, harbour master, Master of the Guilds, senior craft-guild master · other 38%, economy 22%, government 10% |
| PERSONALITY/fear/long | 4 (+1) | 0.92 · 1.00 | 1.0% · 0.6% | – | – | – | 1 | 62 | banker, stable master, bowyer, enchanter, dean, master fishmonger · other 36%, economy 24%, government 11% |
| PERSONALITY/forbidden_patron/long | 4 (+2) | 0.82 · 1.08 | 0.7% · 0.7% | – | – | – | 1 | 69 | fortune teller, senior craft-guild master, enchanter, chronicler, stable master, hospital's master · other 43%, economy 17%, criminal 14% |
| PERSONALITY/impulse/long | 4 (+1) | 0.74 · 1.04 | 0.6% · 0.7% | – | – | – | 1 | 66 | cobbler, company captain, enchanter, toll-keeper, senior charter master, chief magistrate · other 44%, economy 16%, government 11% |
| **total** | | | | **60** | **38** | **129** | **380** | | |

## 4. The two facts, for every cell

**(1) Every line here is APPENDED TO A DRAWN CELL, and so moves that cell's draws once.** The deal's `fork.pick` over a
cell's unheld candidates takes its modulus from the cell's length: appending k lines moves every draw of that cell in
every town once (one signed shift, one cause), and through the held texts and pass two a few draws of other cells (the
cascade). Measured on the 300 measure towns (the `goals-final.mjs` towns), of 17,992 holdings: file 1's written lines
move **7,939** (3,954 onto a new line, 3,837 to another line of their cell, 148 the cascade) in 264 towns; bill 1
moves 6,178; bill 2 9,601; bill 3 **13,695** (10,039 · 3,619 · 37) in 293 towns. Per cell, the table's last numeric
column. A RESERVE line would move no draw, but it only serves a repeat inside a town and is taken in rotation order, so
it buys nothing across towns (section 1): **none of the 380 is a reserve line.** Because each append moves its cells'
draws, I recommend ONE build of the whole tranche (or of whatever the chair approves), so the goldens and the census
move once, for one cause, instead of once per file.

**(2) The lane's gates hold after the build.**
- *0 identical sentences inside a place:* measured, 0 after bills 1, 2, 3 and after file 1's written lines
  (`wants-verify.*.out.txt`; and the lane's own `goals-final.mjs`, run unchanged over the tree with file 1's lines in
  memory, `wants-goals-final.mjs`: identical 0 → 0).
- *The mirror rule* is the deal's (rungs (ii)/(iii) and the printed-text check, `goals.js`), untouched. No new line is
  another line of its cell with its two name slots swapped (the tranche's two-name cells: RANK/climb, RANK/defend,
  POWER/tense). On `goals-final.mjs`'s mirror column file 1 moves 83 → 85, both on an EXISTING line (POWER/tense/short #4,
  "Answer the next move by {rival} against {power}…", 9 → 11 by the cascade), none on a new line.
- *The refused want* (`goalSecretRefusals.js`): no cell of the tranche is a refused cluster (conviction, duty), and the
  post-pass is untouched; `goals-final.mjs`'s refusal column 0 → 0.
- *The harsh-tie guard:* every new TIES/rival_enemy line is written to hold on the harshest tie the cell is dealt on (a
  mortal enemy, a bitter rival, a tie of mutual leverage); none is gentle, so `GOAL_LINE_NOT_ON_TIES` gains no row (its
  test admits reserve lines only). TIES/ally lines hold for an ally, a respect and a working patron-and-client tie.

## 5. What the build must also carry (the chair's and the owner's)

- `tests/data/goalFamilies.test.js` pins every cell's count (`EXPECTED_CELLS`, `EXPECTED_TOTALS`: design §6.6's counts)
  and `goalFamilies.js`'s header states the totals; the build changes both (at bill 3: RANK 36 → 153, POWER 48 → 83, INSTITUTION 48 → 113, SUPPLY 52 → 59, TIES 60 → 179,
  PERSONALITY 96 → 131, ALLEGIANCE 128 → 130). A ruling on §6.6's counts is the chair's to make, the veto the owner's.
- The goldens and census corpora that print goals move (fact (1)); re-signing them is the owner's hand, as ever.
- No line carries `needs` or `excludes`, so no fact-vocabulary atom is touched (`factVocabulary.js`, `drawDeclared.js`
  read only). No line is keyed to a trade or title (J-16): each cell's lines are written to the common ground of the
  offices that hold it, so each reads true for every holder.
- The checker: `want-lines-check.mjs` lifts the test's `shapeViolations` verbatim and runs it over the cells, the
  reserve and the new lines together; file 1: 0 violations (`want-lines-check.out.txt`).

## 6. The files

`wants-born.mjs` · `wants-hooks.mjs` · `wants-by-pool.mjs` (+ `.out.txt`, `wants-bill.json`: the bills and the build
order) · `wants-verify.mjs` (+ `.bill1/2/3`, `.file1` (placeholders), `.lines1` (written lines) `.out.txt`) ·
`wants-goals-final.mjs` (+ `.base`, `.lines1` `.out.txt`) · `want-lines-append.mjs` · `want-lines-check.mjs` (+ `.out.txt`)
· `WANT-LINES-1.md` (60 lines; files 2–7 follow the build order when GOALS-3 resumes me).

## Addendum (17:0x UTC): POWER/competitive put first in file 6, the tranche still 380

The chair's order of 17:00 UTC: meet the 24 mirrors left after file 5, all on POWER/competitive's existing lines. Measured
(placeholders appended to each vantage, files 1–5 written): k = 4 → 4 mirrors, 5 → 2, 6 → 1, 7 → 0, 8, 12, 18 → 0. Its
cross-town share is small (0.14–0.15 points), so the mirrors set the count: **+8 a vantage, 16 lines**, first in file 6.
Born with file 6's written lines: mirror 0. Kept INSIDE the 380: the build order's last 16 lines give way (their fall is
the smallest of the tranche): INSTITUTION/solvency/short 1 · PERSONALITY/grudge/long 1 · RANK/defend/long 1 · TIES/ally/short
1 · TIES/rival_enemy/long 1 · PERSONALITY/impulse/short 1 · TIES/rival_enemy/short 1 · PERSONALITY/grudge/short 1 ·
TIES/ally/long 1 · RANK/enter/short 2 · TIES/debtor/long 1 · RANK/enter/long 1 · POWER/tense/short 1 ·
INSTITUTION/charter/short 1 · TIES/debtor/short 1. File 6 = the 16 + build-order lines 301–344; file 7 = lines 345–364.
The tranche now touches 35 cells (POWER/competitive's two vantages added; none dropped whole).
