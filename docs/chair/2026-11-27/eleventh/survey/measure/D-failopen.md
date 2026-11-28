# (D) WHAT FAIL-OPEN ON UNKNOWN WOULD LIFT (tree 682667fe2)

**How it was counted (CONFIRMED by script).** Plans C and V from `tools/plan-C.json`, `tools/plan-V.json`: 900 births each,
six tiers × 150, so 1,800 pages. Each birth was rendered as the app renders it (birth, then the stamp `withPublicProse`, then
the owner dossier tab by tab, then the share page) inside one esbuild bundle (`/tmp/survey/tools3/build3.mjs`). The bundle
transforms four src files in memory and writes nothing to the tree. Every refused line was caught where it was refused:
- `drawDeclared` (a drawn line refused: **draw**);
- `filterDeclared` (an item of a list printed whole: **filter**);
- the kernel's `drawVariant`, where the facts moved the argmax (**kswap**);
- `eligibleVariants`, where the facts emptied a pool (**kempty**);
- every other `declarationAdmits` caller (**direct**).

For each refusal the hook kept each atom that refused, its side (needs / excludes / crisis), and its answer (true / false /
UNKNOWN). Refusals are counted once per page, pool, line and reason; one refusal repeated across the phases of a page
counts once. Classes are B's (`B-atoms.tsv`); a crisis atom reads as STATE. Scripts: `an/d.mjs`, `an/dmd.mjs`.

**Not counted:** the hand-written `=== false` gates of A §9 (they are fail-open already), `held` aside from its own row,
`fillSlots` nulls, Daily Life's `pickNameable` / `yields`, and the text vetoes of A §8 that do not call `declarationAdmits`.

## Refusals today, by kind (C + V, 1,800 pages; CONFIRMED)

| primary kind (first in: held, pool, noun, state, both, judgment, other; answered before unknown) | refusals | share |
|---|---:|---:|
| NOUN, answered (the noun is absent / present) | 96,047 | 59.5% |
| BOTH (noun + judgment), answered | 38,058 | 23.6% |
| STATE, answered (crisis, war, season of the record) | 15,300 | 9.5% |
| JUDGMENT, answered (a band or a verdict read off the record) | 9,707 | 6.0% |
| held (MERGE-R2: the roster already prints the text) | 1,842 | 1.1% |
| OTHER, answered | 502 | 0.3% |
| pool-level atoms (`poolDeclares` / `crisisScoped`) | 58 | 0.04% |
| **JUDGMENT, UNKNOWN** | **43** | **0.03%** |
| NOUN / STATE / BOTH / OTHER, UNKNOWN; no facts | 0 | 0 |
| **all** | **161,557** | |

- **Per page:** median 91, p10 66, p90 113, mean 89.8. By tier (median): thorp 101, hamlet 106, village 96, town 72,
  city 77, metropolis 77. C alone: 80,839, median 91. V alone: 80,718, median 91.
- **By door:** filter 115,591; draw 27,893; kswap 15,464; direct 2,331; kempty 278.
- **By phase:** birth 69,244; owner + share 72,291; owner + stamp 17,619; the rest 2,403.
- **Any entry of the kind** (a refusal can carry atoms of several kinds): BOTH 49,720; STATE 17,811; JUDGMENT answered 10,265.

## THE ONE NUMBER: refusals with a JUDGMENT atom UNKNOWN (CONFIRMED)

**43 refusals, on 43 pages of 1,800 (2.4%): 23 on C, 20 on V.** Widening the rule to "JUDGMENT or BOTH unknown", or to
"any atom unknown", gives the same 43: no other atom came back UNKNOWN at a refusal anywhere in the corpus.

**Top pools (there is only one).**

| # | pool | refusals | pages |
|---|---|---:|---:|
| 1 | `troubleHooks:TROUBLE_HOOKS:outside_debt` (`src/data/troubleHooks.js`, drawn by `src/generators/history/troubleHooksOf.js :: troubleHooksOf`) | 43 | 43 |
| 2–10 | none | 0 | 0 |

The line is "A wealthy household offers to pay the debt itself, in return for a say in how the place is run". It needs
`prosperity: ≥ prosperous`. It is drawn in the history step at birth, before the economy writes `prosperity`, so the reader
answers UNKNOWN and THE ONE RULE refuses it. This is a **birth-order unknown**, not an unanswerable fact: on every final
record the sweep read, `prosperity` answers (see B). The pool ranks its lines and keeps the first three admitted, so the
refused line's slot goes to the next admitted hook. The line printed on none of the 43 pages.

**What fail-open would lift:** these 43 lines, at most one a page. On 5 of the 43 that would print a true line; on 33 it
would print a line whose own need fails on the final record. Ordering the history draw after prosperity, or re-drawing
the pool at stamp, would let the 5 print without opening the door (PLAUSIBLE).

## The samples (all 43; the population is smaller than 50, so no seeded draw was needed and none was filled)

Order: a seeded shuffle (FNV-1a of `survey-measure-D::<plan>:<seed>`). **Reading (PLAUSIBLE, read by me against the page's
printed prosperity, Economics tab line 1, and its gloss):**
- **TRUE:** the refusal was right; the need fails on the final record.
- **FALSE:** the need holds on the final record; the refusal lost a true line.
- **CANNOT TELL:** the record moved under the line. The place was Prosperous before the crisis it is in now, and the hook
  speaks to that crisis.

**Tally: TRUE 33, FALSE 5, CANNOT TELL 5.**

| # | town (plan:seed) | atom UNKNOWN at refusal | phase, door | reading | why |
|---|---|---|---|---|---|
| 1 | V:dp-city-65 (Vatanbash) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 2 | V:dp-metropolis-75 (Spitzwalde) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 3 | C:dp-town-60 (Koltun) | `prosperity: ≥ prosperous` | birth draw | CANNOT TELL | prints Comfortable, "Prosperous before the debt crisis; Comfortable while it lasts.": prosperous before the crisis the hook is about |
| 4 | V:dp-hamlet-78 (Svetomir) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Struggling (Poor before the crisis): below prosperous, the need fails on the final record |
| 5 | V:dp-town-23 (Steinkoppel) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 6 | C:dp-city-138 (Langsteig) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate: below prosperous, the need fails on the final record |
| 7 | C:dp-village-92 (Rathwood) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 8 | C:dp-metropolis-79 (Kallipyrgos) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 9 | C:dp-thorp-0 (Linyuan) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 10 | C:dp-metropolis-63 (Campocolonia) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 11 | V:dp-village-48 (Loughsike) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 12 | C:dp-metropolis-75 (Lykotopia) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 13 | V:dp-city-140 (Ventoaltum) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Poor: below prosperous, the need fails on the final record |
| 14 | V:dp-city-43 (Sundstrand) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Poor: below prosperous, the need fails on the final record |
| 15 | V:dp-thorp-0 (Wadihaven) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Poor (Moderate before the crisis): below prosperous, the need fails on the final record |
| 16 | V:dp-metropolis-119 (Filopskala) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate: below prosperous, the need fails on the final record |
| 17 | C:dp-metropolis-138 (Teoticoatl) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 18 | V:dp-thorp-17 (Khanhiid) | `prosperity: ≥ prosperous` | birth draw | FALSE | prints Prosperous: the need holds on the final record; the refusal was a birth-order unknown |
| 19 | V:dp-town-103 (Burjmela) | `prosperity: ≥ prosperous` | birth draw | CANNOT TELL | prints Moderate, "Prosperous before the debt crisis; Moderate while it lasts.": prosperous before the crisis the hook is about |
| 20 | C:dp-metropolis-119 (Uaymmul) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 21 | C:dp-city-64 (Lidopagus) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 22 | C:dp-city-67 (Tihoka) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 23 | V:dp-metropolis-15 (Palenqchihua) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 24 | C:dp-metropolis-115 (Saltocivitas) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 25 | V:dp-town-45 (Hákonvik) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate: below prosperous, the need fails on the final record |
| 26 | C:dp-town-16 (Bayankhurel) | `prosperity: ≥ prosperous` | birth draw | FALSE | prints Prosperous: the need holds on the final record; the refusal was a birth-order unknown |
| 27 | C:dp-town-23 (Novoki) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 28 | V:dp-town-60 (Hagiotopia) | `prosperity: ≥ prosperous` | birth draw | CANNOT TELL | prints Comfortable, "Prosperous before the debt crisis; Comfortable while it lasts.": prosperous before the crisis the hook is about |
| 29 | V:dp-town-65 (Bellacivitas) | `prosperity: ≥ prosperous` | birth draw | CANNOT TELL | prints Comfortable, "Prosperous before the debt crisis; Comfortable while it lasts.": prosperous before the crisis the hook is about |
| 30 | C:dp-village-116 (Kaltenwalde) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Poor (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 31 | C:dp-thorp-17 (Steinbrunn) | `prosperity: ≥ prosperous` | birth draw | FALSE | prints Prosperous: the need holds on the final record; the refusal was a birth-order unknown |
| 32 | C:dp-village-21 (Ásaker) | `prosperity: ≥ prosperous` | birth draw | FALSE | prints Prosperous: the need holds on the final record; the refusal was a birth-order unknown |
| 33 | C:dp-thorp-99 (Olympousa) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 34 | C:dp-village-27 (Goraka) | `prosperity: ≥ prosperous` | birth draw | FALSE | prints Prosperous: the need holds on the final record; the refusal was a birth-order unknown |
| 35 | C:dp-metropolis-47 (Cerromonte) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 36 | V:dp-village-5 (Nandao) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 37 | V:dp-city-104 (Campomagnum) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate: below prosperous, the need fails on the final record |
| 38 | V:dp-village-92 (Breitenbrunn) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate (Comfortable before the crisis): below prosperous, the need fails on the final record |
| 39 | C:dp-city-2 (Warmberg) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 40 | V:dp-city-2 (Warmberg) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |
| 41 | V:dp-city-98 (Vishnukot) | `prosperity: ≥ prosperous` | birth draw | CANNOT TELL | prints Comfortable, "Prosperous before the migration; Comfortable while it lasts.": prosperous before the crisis the hook is about |
| 42 | C:dp-city-27 (Izamcoatl) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Moderate: below prosperous, the need fails on the final record |
| 43 | C:dp-city-58 (Doirebridge) | `prosperity: ≥ prosperous` | birth draw | TRUE | prints Comfortable: below prosperous, the need fails on the final record |

All 43 share the line "A wealthy household offers to pay the debt itself, in return for a say in how the place is run".

## The three counts

1. **Refusals today: 161,557 on 1,800 pages, median 91 a page** (CONFIRMED). 99.97% refuse on an ANSWERED atom: the
   record said no.
2. **Refusals with a JUDGMENT atom UNKNOWN: 43, on 43 pages, from 1 pool** (CONFIRMED). These are all fail-open would lift.
3. **Of the 43: 5 FALSE, 33 TRUE, 5 CANNOT TELL** (PLAUSIBLE: my reading).

**What it means for the charter (PLAUSIBLE).** Fail-closed on UNKNOWN is not where the engine loses lines. The door's
UNKNOWN branch fires once in 42 pages, and then on a birth-order gap. Opening it would print more wrong lines (33) than
right ones (5). What refuses lines is the record answering FALSE, mostly for nouns: a line naming a thing the place does
not have.
