# S-D: THE PROSPERITY FAMILY (measure only; code tip held at a518d4244)

SURVEY-TABLE, 2026-11-28. Asked by the chair's rulings file (RULINGS-SURVEY-BRANCHES.md, 951755e67): the census's 29
`prosperity` pages (`scripts/.page-clash-census.json`; SURVEY-FINAL's `PROSPERITY-29.tsv`): is the census row MIS-CASTING
the clause, (i), or is this a TRUE CLASH, (ii)?

## VERDICT: (i), THE ROW MIS-CASTS THE CLAUSE

The clause ("The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short.")
declares `prosperity: ≤ poor`, but that atom is never answered by the record's rung. `keptGuardLine`
(src/generators/safetyProfile.js) answers its declarations from `factsOf({ institutions, economicState: { prosperity } })`,
and the caller (src/generators/steps/assembleSettlement.js:524) hands it `purseWordOfBand(economicSurvivalBandOf(settlement), …)`:
STRONG→Prosperous, ADEQUATE→Moderate, WEAK and CRITICAL→Poor (COHERENCE-UPKEEP-6, ruling A). The clause's real atom is
therefore the Economic Survival band at Weak or Critical, which is the atom `nothing laid by` (`facts/nothingLaidBy.js`).
The ledger notes it under the rung's word, and the census reads that word against the rung.
The two sides are different facts. The rung is the place's general standing. The clause is about the defence purse. The
page's own Economic Survival row ties the two together in words (quoted below: "well off, but little of its wealth is set
aside for its defence"). These are not two claims ruling each other out, so no side has to yield by order of hardness.
The row's `source` gives the wrong cause ("drawn at birth before the rung settled"). On this tree the clause is resolved
at the end of the assembly, after the defence profile, on the band.

Measured on 1,800 owner pages (C 900, V 900, S-B tree renders; the base tree's renders tally the same). Each page's band
was read from its printed Economic Survival row. The row prints on every one of the 1,800 pages, so `purseWordOfBand`'s
no-band fallback is never reached.

| line (SAFETY_LINE_SIBLINGS) | declared | pages | band on every such page | rung beside it |
|---|---|---|---|---|
| charter hall, "coin for bounties runs short" | `prosperity: ≤ poor` | 40 | WEAK 33, CRITICAL 7 | ≥ Moderate on **29** (Weak 27, Critical 2), ≤ Poor on 11 |
| charter hall, "as far as the purse runs" | `prosperity: ≤ comfortable` | 20 | ADEQUATE 20 | Moderate 3, Comfortable 6, **Prosperous 9, Wealthy 2** |
| "Hired swords back the garrison when the purse allows." | `prosperity: ≤ comfortable` | 52 | ADEQUATE 52 | Poor 32, Struggling 20 |
| hired company, "the coin to keep it runs short" | `prosperity: ≤ poor` | 0 | none | none |
| hired company, "paid to keep the peace" | `prosperity: ≥ moderate` | 0 | none | none |

On every page each line follows the band and never the rung. The 29 census pages are exactly the short clause's pages
whose rung is Moderate or better. All 29 pairs in the register are `SAFETY_LINE_SIBLINGS#0 (prosperity: ≤ poor) || the
record: prosperity: ≥ moderate`.

## FIVE OF THE 29, QUOTED (Overview rung · Defense desk's Economic Survival row · the guard clause)

1. **C:dp-hamlet-33**: Prosperity *Prosperous*. Economic Survival: "Ringham is well off, but little of its wealth is set
   aside for its defence, and a long crisis would soon outrun what is." Guard: "The adventurers' charter hall takes
   bounty work against threats, but the coin for bounties runs short."
2. **V:dp-hamlet-130**: Prosperity *Wealthy*. Economic Survival: "Shangou is well off, but little of its wealth is set
   aside for its defence, and a long crisis would soon outrun what is." Guard: the same clause.
3. **C:dp-hamlet-2**: Prosperity *Comfortable*. Economic Survival: "Ingitun pays nobody to defend it, and could not find
   the wages if it had to hire someone in a hurry." Guard: the same clause.
4. **C:dp-hamlet-5**: Prosperity *Comfortable*. Economic Survival: "Qaryahbazaar's defence has been short of money for
   years, and each lean season leaves less to spend on it when a real crisis comes." Guard: the same clause.
5. **C:dp-village-103** (CRITICAL): Prosperity *Moderate*. Economic Survival: "The village could not pay for a bad month
   at Buyanköl, and the people who would have to be paid know it." Guard: the same clause.

In each, the clause says what the page's Economic Survival row already says. Nothing beside it is ruled out.

## THE CURE (named, not built)

- **ATOMS.** `nothing laid by` already exists and needs no new vocabulary. The `≤ comfortable` pair has no atom: "the
  band is not Strong" is not in the vocabulary (see HELD below).
- **LINES TO DECLARE** (src/generators/safetyProfile.js, SAFETY_LINE_SIBLINGS; each declaration says only what the
  sentence leans on, per ruling S-B-2):
  - charter hall "coin for bounties runs short": `prosperity: ≤ poor` → `nothing laid by`
  - hired company "the coin to keep it runs short": `prosperity: ≤ poor` → `nothing laid by`
  - hired company "paid to keep the peace": `prosperity: ≥ moderate` → `no nothing laid by`
  - The facts these declarations read must answer `nothingLaidBy` from the band. `keptGuardLine`'s `read` would carry
    the band, or `defenseProfile.scores.economic`, from the caller (assembleSettlement.js:524), so the line is answered
    by `nothingLaidByShown` itself. There is a smaller but less honest alternative: answer the atom from the purse word
    (`Poor` ⇔ nothing laid by). It keeps `keptGuardLine`'s signature, but it reads the no-band fallback as the standing
    label. That fallback is unreached in the corpora, as it is today. This is the chair's call.
- **TABLE ROWS.** None new. The clause moves to side `a` of the existing row `nothing laid by`. That side is already
  `recorded` and holds on all 40 of its pages, so the row stays at 0. The row `prosperity` stays, because other
  pools declare its sides (foodCulture, tensionCauses, childWarnings, stressNarrative, narrativeData, troubleHooks,
  dossier prose; their facts were not read in this measure). Its `source` and `why` would be corrected: the 29 are the clause mis-cast, not a line drawn before
  the rung settled. The walker's `said` words are unchanged: "runs short" is not added, since it would catch the food
  and stock lines.
- **WHAT WOULD MOVE.** Census `prosperity` falls from 29 to 0. `nothing laid by` stays at 0, as does every other row.
  **Pages and lines move: 0.** For each line, `≤ poor` on the purse word holds exactly when the band is WEAK or CRITICAL,
  which is exactly when `nothing laid by` holds. Likewise `≥ moderate` holds exactly when the band is STRONG or ADEQUATE,
  which is `no nothing laid by`. That covers 1,800 of 1,800 pages, so no draw changes. **Empty slots: 0**, because the
  chain of twins is untouched.
- **REGISTERS AND TESTS THAT WOULD BE TOUCHED.** No register row moves: presumedThings.widened rows are keyed on the
  charter-hall thing and the text, which are unchanged, and pool-dominance counts draws, which are unchanged.
  tests/generators/upkeepHired.test.js finds lines by their declaration words (`lineOf('prosperity: ≤ poor')`, lines
  283–391), so those re-pin to the new words. safetyLineSiblings.test.js still has to be read at build time. The
  declarations live in code, not in a receipt, so there is no generated leaf.

## HELD: THE `≤ comfortable` PAIR (the same mis-cast, which the census does not see today)

"As far as the purse runs" (20 pages) and "when the purse allows" (52 pages) declare `prosperity: ≤ comfortable` but
stand on "band not Strong". The charter-hall line prints beside a Prosperous or Wealthy rung on 11 pages. The census
counts none of them, because no specific row reads `≤ comfortable` against `≥ prosperous`, and the generic band row
pairs notes with notes, never a note with the record. They are not a true clash either. The cure would need a band atom
on the Economic Survival band, which is new vocabulary and so on the owner's veto list. The other route is a census
reading that translates SAFETY_LINE_SIBLINGS' purse words to the band, which changes no source line. I name both; I build
neither.
