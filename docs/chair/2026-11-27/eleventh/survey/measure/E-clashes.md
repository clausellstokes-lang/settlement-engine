# (E) THE EXCLUSION TABLE AND THE PAGES THAT PRINT BOTH SIDES (tree 682667fe2)

**Corpus.** The same 1,800 pages as D (plans C and V, 900 births each, six tiers): owner page and share page. The
births sweep (`tools3/sweep.jsx`) supplies each town's NPC names, so a sentence about a person never counts as a claim
about the place. **CONFIRMED** marks a count a script made. **PLAUSIBLE** marks my reading of sentences. The row-level
table is `E-clashes.tsv` (170 rows). Its declared-exclusion rows carry the generic reading ("TRUE CLASH by
construction"); the judgment below reads the pages, and it overrides the TSV where they differ (rows 15–17).

**The four sources of the exclusion table.**
1. **Declared excludes.** 72 atoms have lines on both sides (some need X, some exclude X). Band dimensions add needs
   whose ranges do not meet (`prosperity: ≤ poor` beside `prosperity: ≥ comfortable`). On a page, the two sides were
   caught from the presumption ledger's notes for that page (`an/e-ledger2.mjs`: owner page = birth + stamp + owner
   notes).
2. **R-PAIRS.** The earlier seat's savings/solvency-against-debt sentence classes (`an/e-text.mjs`, the A and B
   classes verbatim), re-run on this tree.
3. **The site-coherence ratchet.** It sets terrain against the map's siteKind
   (`tests/lint/siteCoherenceRatchet.test.js`).
4. **The page battery's three two-tab readers** (`readerContradictionFindings.js`).

## Counts by pair (owner pages; share pages in the TSV)

| # | claim A | claim B | source | owner pages C + V (of 1,800) | judgment |
|---|---|---|---|---:|---|
| 1 | "pays its way" (Outlook SS4 / Economics C3) | a debt word, not the place (borrow / debt / owes) | R-PAIRS | 316 | ARTEFACT (loose word) |
| 2 | "pays its way" | Economic Resilience **Weak** (Overview grade) | R-PAIRS | 238 | ARTEFACT (grade, not a debt) |
| 3 | DL purse: "closes every year ahead … money laid by" | a debt word, not the place | R-PAIRS | 187 | ARTEFACT |
| 4 | DL: "People here put things by, and can" | a debt word, not the place | R-PAIRS | 171 | ARTEFACT |
| 5 | "pays its way" | Economic Survival **Weak** (Defense grade) | R-PAIRS | 101 | SOFT (no clash as worded) |
| 6 | DL purse / put things by | Resilience Weak / Survival Weak | R-PAIRS | 81–89 (Resilience), 40–43 (Survival) | ARTEFACT / SOFT |
| 7 | "pays its way" / DL savings | hook: creditor / loan / collectors | R-PAIRS | 70 / 49–55 | MIXED |
| 8 | "pays its way" / DL savings | history: borrowed from a foreign power | R-PAIRS | 40 / 19–22 | TENSE (a sequence) |
| 9 | "had money laid by" (crisis Defense line) | any debt | R-PAIRS | 52 + 15 + 5 | TENSE |
| 10 | **DL savings line** | **"would have to borrow" / "nothing laid by"** (DS-DEF-2 Weak) | R-PAIRS | **76** | **TRUE CLASH** |
| 11 | **DL savings line** | **a place debt in force** (the outside_debt tension, "External Debt", "what the place owes", DS-POW-6 v2) | R-PAIRS | **27** | **TRUE CLASH** |
| 12 | **"pays its way"** (Economics C3, undeclared) | **a place debt in force** | R-PAIRS | **18** | **TRUE CLASH** |
| 13 | **`prosperity: ≤ poor`** (safetyProfile "the coin … runs short") | **`prosperity: ≥ moderate / comfortable / prosperous`** | declared (band) | **23** | **TRUE CLASH** (late write) |
| 14 | `guild` (guild_conflict plot hook, present tense) | `no guild` (DS-GEN-13 "a market, no guild") | declared | **6** | **TRUE CLASH** (late write) |
| 15 | `guild` (HISTORY_DESC_SIBLINGS, past) | `no guild` (DS-GEN-13) | declared | 3 | ARTEFACT (a past fact on a present atom) |
| 16 | `crisis: under_siege` (service twin) | `no crisis: under_siege` (institution description) | declared | 7 | ARTEFACT (the ledger notes the original; its late sibling prints) |
| 17 | `terrain: forest` (UNCANNY goal) | `no terrain: forest` (charcoal burner twin) | declared | 1 | SOFT ("whenever wood can be had" in a forest with depleted woodland) |
| 18 | terrain | the map's siteKind | ratchet | 0 | OUT OF THE PAGE (siteKind prints only on the map and the scene) |
| 19 | the battery's three readers | | battery | 0 | none on 3,600 page reads |

**CONFIRMED (script) totals.**
- A declared-exclusion pair on the page: **40 owner pages** (C 28, V 12).
- Any R-PAIRS pair: **755** (C 501, V 254).
- The earlier seat's "hard" pages: **295** (C 190, V 105).
- **TRUE CLASHES: rows 10–14.** They cover 103 + 18 + 23 + 6 page-hits. My reading (PLAUSIBLE) is that the hook half of
  row 7 is also true.

**Duplicate classes.** "Purse closes ahead" and "money laid by" are the two sentences of ONE line
(`economy.generated.js:2985`, DS-ECO-8 COMFORTABLE vid 1). The TSV keeps both classes as the earlier seat had them.
This file counts them once.

## One worked example each (town key :: line A :: line B)

1. C:dp-thorp-8 :: Outlook "Farofundus feeds itself and pays its way…" :: History "still keeps the shape the thorp took
   after the debt crisis". *A past crisis, not a debt now.*
2. C:dp-thorp-2 :: Outlook "Rossford feeds itself and pays its way…" :: Overview "Economic Resilience Weak". *A grade of
   resilience to shocks beside a margin in ordinary years.*
3. and 4. The loose debt word is overwhelmingly a person's debt or interface text. Of the 40 commonest B sentences beside a
   solvency line, the top six are unnamed-person plot hooks ("Their best customer owes them a year's takings…", 186
   pages), plus NPC secrets and "Attracts debt spirals and desperation crime" (Defense, 177). *Artefact.*
5. C:dp-thorp-7 :: Economics "Neadton pays its way from year to year…" :: Defense "Economic Survival / Weak".
6. As row 2, on the DL lines.
7. C:dp-thorp-8 :: "pays its way" :: Plot Hooks "The original loan documents contain a clause that was never disclosed
   publicly". *A place debt now.* The other part of the class is "Secret: Deeply in debt to a creditor who owns the debt
   as leverage" (66 pages), *a person*.
8. C:dp-thorp-8 :: "pays its way" :: History "A large debt to an outside power came due…".
9. C:dp-town-41 :: Defense "Mintarsaray had money laid by before this trouble began…" :: "Someone keeps paying off their
   small debts…".
10. **C:dp-thorp-120 :: Daily Life "Ingitun's purse closes every year ahead." :: Defense "If Ingitun ever had to hire people
    to defend it, it would have to borrow the money first."**
11. **C:dp-village-141 :: Daily Life "…there is money laid by behind it." :: Overview "The settlement owes a heavy debt to an
    outside power, and the power is preparing to collect".**
12. **C:dp-thorp-99 :: Economics "Olympousa pays its way from year to year, and nobody here calls the thorp poor." ::
    Overview "The settlement owes a heavy debt to an outside power…"**
13. **C:dp-hamlet-33 :: Overview "Prosperous" :: Defense "The adventurers' charter hall takes bounty work against threats, but
    the coin for bounties runs short."** The safety line is drawn at birth (`safetyProfile.js:951`, needs `prosperity:
    ≤ poor`) before prosperity reaches its final rung. All 23 pages print both: 18 at Comfortable or above, 3 Moderate,
    2 Wealthy.
14. **C:dp-hamlet-26 :: Overview "Anyone with goods and the stall fee can sell at Aryapeta's market without a guild's
    leave." :: Plot Hooks "Someone is sabotaging both guilds to destabilize the market for a third party".** The hook needs
    `guild` at birth; `guild` is false by the stamp.
15. V:dp-hamlet-84 :: Overview "No guild keeps a house at Staroev's market" :: History "…the major farming families and the
    guilds negotiated a formal compact… It held for a generation."
16. C:dp-town-11 :: the ledger's "Merchants from across the region, and luxuries to be had" (excludes the siege) never
    printed. Its late sibling prints instead: "A yearly gathering of the region's merchants, cut off while the siege holds
    the roads."
17. V:dp-metropolis-136 :: terrain Forest :: "A collier's kilns … turning wood into charcoal whenever wood can be had".

## Savings against debt, counted apart (CONFIRMED)

**103 owner pages of 1,800 (5.7%; C 70, V 33). Share pages: 100.** On each, a Daily Life savings line (DS-ECO-8
COMFORTABLE vid 1 or vid 2) prints beside "no savings" or a place debt in force.
- Savings against no savings (row 10): 76 pages (C 53, V 23).
- Savings against a debt in force only (row 11): the other 27 pages.

Apart from these:
- "Pays its way" against a debt in force (row 12): 18 owner pages (C 12, V 6).
- The **indebted crisis** never meets a solvency or savings line. DS-ECO-8 vid 1 excludes `crisis: indebted`, and SS4
  reads `owesDebtShown`.

**Why it stands (PLAUSIBLE):**
- DS-ECO-8 vid 1 excludes the crisis but not the `outside_debt` TENSION.
- DS-ECO-8 vid 2 ("put things by") is colour.
- DS-DEF-2 Weak keys on the Defense grade with `prosperity: ≤ comfortable`, so both pools admit at Comfortable.
- "Savings" is no atom, so no declaration can see the two as one claim.
