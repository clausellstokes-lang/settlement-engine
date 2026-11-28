# (A) VARIANTS: ONE THOUGHT OR SEVERAL (RANGE-MEASURE, 2026-11-28)

Tree b693c4605. Corpora C and V (900 births each, `rmeasure/tools/plan-C.json`, `plan-V.json`), rendered on this tree by the
rmeasure renderer (owner view, every tab and disclosure walked; Notes tabs left out), 0 errors of 1,800. Table:
`A-variants.tsv` (one row per key, its lines, its numbers, its classes). Tools: `tools/`. CONFIRMED = a script counted it;
PLAUSIBLE = my reading.

## What a KEY is here, and how prints were counted
- **KEY** (`tools/extract.mjs`, Babel over every `src` file but tests): an array of 2+ prose alternatives (strings, templates,
  arrow-function templates such as the tie lines' `pairProse`, or objects whose `text`/`line` is the prose, `Object.freeze`
  unwrapped); a one-line table cell is a key of one line (used in B). Two description tables keep their canonical line apart
  from its variants and are JOINED into one key (`tools/merge.mjs`: an institution's catalog `desc` + `INSTITUTION_DESC_VARIANTS`,
  363 keys; a history event's `description` + `HISTORY_DESC_VARIANTS`).
- **CAN PRINT UNDER THE SAME CONDITION**: a pair of a key's lines is co-eligible unless one declares an atom or mark the other
  negates or excludes, or one is the other's twin (`twinOf`). A key with no co-eligible pair (131: twin sets, exclusive
  declarations) and a key whose lines print TOGETHER (15: 80%+ of its lines on a page that prints it) offer no choice and are
  not classed here (they are in B).
- **PRINTS** (`tools/match.mjs`): every printed sentence (4+ words, ending . ! ?) matched to its source literal by its fixed
  parts in order (slots bounded); C 89.4%, V 89% of sentences homed. Chrome (src/copy, JSX text, a component line on 90% of
  pages) left out.

**KEYS CLASSED: 1,059 keys of 2+ co-eligible lines that print on C or V, holding 4,616 lines** (CONFIRMED).

## The script (v1, then the one correction v2) and my reading
Content stems (a stop list, slots removed, a crude suffix stemmer: the part-of-speech tagger I asked for was refused by my
permission check and not retried), over co-eligible pairs: J = mean Jaccard, O = mean overlap coefficient, and the share of a
key's lines holding its commonest stem ("shared main word"; the noun/verb split is not available without the tagger).
- v1: PARAPHRASE if O >= 0.5 or J >= 0.3; DISTINCT if O < 0.2 and the commonest stem is in under 60% of lines; else ANGLES.
- v2 (set once, after the read): DISTINCT if O < 0.10 and the stem is in at most half; PARAPHRASE if O >= 0.30, or a stem in
  every line of a key of 3 or fewer, or O >= 0.18 with a stem in two thirds of a key of 3 or fewer; else (O < 0.10: DISTINCT)
  ANGLES. The read showed paraphrase hides in synonyms ("Lodging for traveling merchants." / "Beds for merchants on the
  road."): v1 called 42 of my PARAPHRASE keys ANGLES.

**THE READ** (PLAUSIBLE): 170 keys: 150 by a seeded shuffle weighted by prints on C (seed `range-measure-A`,
Efraimidis-Spirakis), and 20 more by the same draw over the keys not yet read after the extractor learned the arrow-function
tie lines (seed `range-measure-A2`). My classes: `tools/A-hand170.json`. PARAPHRASE 107, ANGLES 22, DISTINCT 41.

| hand \ script v1 | PARAPHRASE | ANGLES | DISTINCT |
|---|---|---|---|
| PARAPHRASE | 55 | 42 | 10 |
| ANGLES | 1 | 14 | 7 |
| DISTINCT | 0 | 7 | 34 |

v1 agrees on 103 of 170 (61%).

| hand \ script v2 | PARAPHRASE | ANGLES | DISTINCT |
|---|---|---|---|
| PARAPHRASE | 78 | 17 | 9 |
| ANGLES | 7 | 9 | 6 |
| DISTINCT | 3 | 7 | 31 |

v2 agrees on 118 of 170 (69%). It still misses about a quarter of the paraphrase, and ANGLES is where it is weakest (9 of 22).

## TOTALS
| | PARAPHRASE | ANGLES | DISTINCT |
|---|---|---|---|
| keys, script v2 (CONFIRMED) | 532 (50%) | 196 (19%) | 331 (31%) |
| lines, script v2 | 1,666 (36%) | 1,093 (24%) | 1,857 (40%) |
| prints C, script v2 | 57,198 (26.7%) | 33,859 (15.8%) | 122,846 (57.4%) |
| prints V, script v2 | 55,875 (27.0%) | 31,692 (15.3%) | 119,490 (57.7%) |
| **keys, HAND-CALIBRATED** | **638 (60%)** | **139 (13%)** | **282 (27%)** |
| **lines, hand-calibrated** | **2,353 (51%)** | **693 (15%)** | **1,570 (34%)** |
| **prints C, hand-calibrated** | **76,074 (35.6%)** | **24,457 (11.4%)** | **113,371 (53.0%)** |
| **prints V, hand-calibrated** | **74,187 (35.8%)** | **23,045 (11.1%)** | **109,825 (53.0%)** |

HAND-CALIBRATED: a read key takes my class; every other key is split as my read split the sampled keys of its v2 class (the
v2 table's columns). It is the estimate I would stand on; the script rows are its floor for PARAPHRASE.

## Where the classes live (by file; the class is mine where read, else v2; share of prints on C+V)
| file | keys | P / A / D | prints C+V | share of its prints from PARAPHRASE keys |
|---|---|---|---|---|
| data/npcData.js (secrets, tie lines) | 45 | 0 / 3 / 42 | 180,983 (43.0%) | 0% |
| data/institutionDescVariants.js (house descriptions, joined) | 305 | 292 / 9 / 4 | 84,450 (20.1%) | 97% |
| data/people/goalFamilies.js (what a person wants) | 53 | 2 / 9 / 42 | 51,376 (12.2%) | 1% |
| data/dossierStateProse/*.generated.js (the state annex) | 216 | 83 / 86 / 47 | 38,547 (9.2%) | 41% |
| data/npcStructureVariants.js | 27 | 14 / 7 / 6 | 5,913 | 36% |
| data/dailyLife/outsiderImpressions.js | 13 | 4 / 7 / 2 | 4,771 | 31% |
| domain/display/governanceAccount.js | 12 | 11 / 0 / 1 | 3,963 | 99% |
| generators/safetyProfile.js | 5 | 4 / 0 / 1 | 3,192 | 83% |
| data/safetyDescLines.js | 12 | 9 / 3 / 0 | 3,092 | 75% |
| data/people/dmPowerLines.js | 4 | 2 / 0 / 2 | 2,500 | 93% |

## What the reading saw (PLAUSIBLE)
- **THE HOUSE DESCRIPTIONS ARE PARAPHRASE BY DESIGN.** The file says so: the variants were written "2 variants each … every
  stated fact … preserved verbatim in meaning". 292 of 305 printing keys class PARAPHRASE: "Wells, fountains, or piped water." /
  "Water from wells, fountains, or pipe." / "Wells and fountains, or water carried in by pipe." They are a fifth of all pool
  prints, and every house card on Institutions shows one.
- **THE DM CAPTURE LINES ARE TRUE UNDER ONE KEY BY RULE**: "Every rung's three lines hold for EVERY way §3.4's derivation reaches
  that rung (the test walks each path)" (`dmPowerLines.js`). The method the owner suspected, written in a header.
- **THE SEAT SENTENCE IS ONE FACT IN THREE WORD ORDERS** (`governanceAccountOf`: "X is governed by Y. Z holds its seat." / "Z holds
  the seat of Y. Y governs X." / "Y governs X. Its seat is held by Z."), on 93% of pages; the owner struck the joining phrases
  on 11-09 ("No."), which left the order as the only variation.
- **THE STATE ANNEX is mixed** (83 / 86 / 47): its frames were given "vantage variants" (visitor, ledger, street) and many keys
  are genuine angles; its narrowed keys ("claim no more than every printing town bears") read as paraphrase: DS-DEF-5 arcane
  ABSENT, 7 ways of "no defence against magic"; DS-ECO-10 POSTURE established, 9 ways of "it sells more than one thing".
- **THE MOST-PRINTED POOLS ARE DISTINCT**: secrets (`NPC_FACTION_LOYALTY`, 18 to 40 different scenes a key), goals, the tie lines
  (each line a different scene between two people). Their sameness is not paraphrase but depth against use: an 8-line tie
  key is drawn twenty times on a city page (see C).
- Daily Life is between: `MIXED_CORNERS` is 13 wordings of "locals know which corners to avoid"; `DAWN_WORK.defence` and the
  gathering lines are angles; `CHILD_WARNINGS` distinct.
