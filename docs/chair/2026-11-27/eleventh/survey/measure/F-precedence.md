# (F) WHICH LINE STANDS: AN ORDER OF HARDNESS (tree 682667fe2; the order is the seat's reading: PLAUSIBLE)

## The order (hardest first)

| rank | kind of claim | where it lives (examples) | why it ranks here |
|---:|---|---|---|
| 1 | **A state in force** | the crisis record and `config.stressTypes` (`crisis: indebted`, `under_siege`), war state | Every other reading is taken through it. The engine already writes "X before the crisis; Y while it lasts". |
| 2 | **A stored figure or roster** | the institution list (`guild`, `market`), the NPC roster, food stores in months, population, the guard | The record's nouns: what is there. Most refusals (D: 59.5% NOUN) answer here. |
| 3 | **A computed grade or verdict** | the prosperity rung (`prosperityLabelOf`), the Defense grades (Economic Survival, Internal Security), Economic Resilience, the viability verdict (`deriveViability`) | Derived from 1 and 2 at read time, so it yields to them and binds everything drawn from it. |
| 4 | **A stored history or a live tension** | `history.currentTensions` (`outside_debt`: "owes a heavy debt to an outside power…"), past events | A live tension is present tense and outranks prose. A past event can never clash with a present claim; it only sequences. |
| 5 | **A keyed prose line** | state-prose pools keyed on a rung or a grade (DS-ECO-8 COMFORTABLE, DS-DEF-2 Economic Survival: WEAK, DS-ECO-1 C3, DS-GEN-13) | One below its key's fact. Two keyed lines tie at 5; the one whose key measures the claim itself stands. |
| 6 | **Drawn flavour** | trouble and plot hooks, the safety line, Daily Life lines, NPC secrets | Drawn at birth, often before 1–3 settle (D's 43, E's rows 13–14). It yields to anything it disagrees with. |
| — | **A quoted voice** | rumours, "Families who lived through it tell it this way", NPC speech | Outside the order. A voice may be wrong by design. It never yields and never makes another line yield, so long as it is marked as a voice. |

## The top 10 clashes: which stands, which yields, what prints in the yielding slot

The pages counted are E's (owner pages, C + V, of 1,800). "Prints instead" is read from the pool as it stands (twin,
sibling or nothing). Nothing here was run.

| # | clash (E row) | pages | stands (rank) | yields (rank) | prints in the yielding slot |
|---:|---|---:|---|---|---|
| 1 | DL "purse closes every year ahead… money laid by" / "put things by, and can" **vs** DS-DEF-2 WEAK "would have to borrow the money first" / "nothing laid by" (row 10) | 76 | **DS-DEF-2** (5, keyed on the Economic Survival grade: 3). Its key measures reserves, the very claim. | **DS-ECO-8 COMFORTABLE vid 1 and vid 2** (5, keyed on the prosperity rung, which does not measure savings) | DS-ECO-8 COMFORTABLE **vid 3 / vid 4** ("The town is plainly comfortable…"; both need `food: ≥ secure`). Where food is below secure: **nothing** (no twin). Vid 2 is colour and cannot yield until it declares. |
| 2 | Safety "…the coin for bounties runs short" / "the coin to keep it runs short" (`prosperity: ≤ poor`, birth) **vs** the printed prosperity rung, Comfortable to Wealthy (row 13) | 23 | **the prosperity rung** (3) | **the safety line** (6, drawn before the rung settled) | its **twin**, which already exists (`safetyProfile.js:950–952`): "…takes bounty work against threats, as far as the purse runs."; for the hired company, its twin "A mercenary company provides enforcement…" (needs `mercenary`; else nothing). A draw against the final record selects it. |
| 3 | DL savings line **vs** the `outside_debt` tension "owes a heavy debt to an outside power" (row 11) | 27 | **the tension** (4) | **DS-ECO-8 vid 1** (5) | DS-ECO-8 vid 3 / vid 4, else **nothing**. No atom names the tension (B has none), so no declaration can see it today. |
| 4 | DS-ECO-1 C3 vid 2 "pays its way from year to year" (undeclared) **vs** the `outside_debt` tension (row 12) | 18 | **the tension** (4) | **C3 vid 2** (5) | **C3 vid 3** ("Nothing about {S} looks rich or poor…", needs no crisis and a market) or vid 1 (needs a crisis), else **nothing**. |
| 5 | guild_conflict plot hook "Someone is sabotaging both guilds…" **vs** DS-GEN-13 "a market, no guild" (row 14) | 6 | **DS-GEN-13** (5, keyed on the institution roster: 2) | **the hook** (6, admitted at birth when `guild` held) | **nothing**: every guild_conflict hook needs `guild` (`historyData.js:1194–1196`), so the event prints one hook fewer. |
| 6 | "pays its way" / DL savings **vs** the outside_debt hooks ("a creditor's agent is in town…", "the debt could be voided…") (row 7, place half) | ≈ 1/3 of 70 | **the hooks' tension** (4) | **the solvency line** (5) | as #3 and #4. |
| 7 | "pays its way" **vs** Economic Resilience **Weak** (row 2) | 238 | **both** | — | No clash as worded: resilience to shocks beside a margin in ordinary years. Nothing yields. |
| 8 | "pays its way" **vs** Economic Survival **Weak** (row 5) | 101 | **both** | — | Paying its way in ordinary years beside no reserve for a long defence. Nothing yields. |
| 9 | HISTORY_DESC_SIBLINGS "…the guilds negotiated a formal compact… held for a generation" **vs** "No guild keeps a house…" (row 15) | 3 | **both** | — | Past against present: a sequence. The artefact is the line's `needs: guild`, a present atom on a past fact. That presumption reads too hard; it is not a clash. |
| 10 | the siege-excluding institution description **vs** a service's siege twin (row 16) | 7 | **the state in force** (1) | the description (5): it **already yields** | Its **late sibling** prints already ("…cut off while the siege holds the roads"). The ledger still notes the original, so the ledger is the only place the clash exists. |

**The general rule the ten share (PLAUSIBLE).**
- Every true clash is a pair where the lower line was answered against a DIFFERENT record from the higher one (birth
  against stamp: #2, #5), or where the shared claim has no atom at all (savings: #1; the outside_debt tension: #3,
  #4, #6).
- The order decides the first kind without a new atom: re-answer the lower line on the final record.
- The second kind needs an atom before any precedence can act. Today no declaration can name "savings" or "a debt
  owed now outside a crisis".
