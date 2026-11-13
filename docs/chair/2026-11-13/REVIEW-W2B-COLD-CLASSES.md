# REVIEW-W2B — the cold list, counted three ways (2026-11-13)

The 361 sentences of the cold list (`REVIEW-W2B-COLD-LIST.json`, beside this file; the review is `REVIEW-W2B-9d5d6e091-2026-11-13.md`), thirty towns at `9d5d6e091`. Read-only: nothing on any lane changed.

**Method.** *Mechanism*: ordered rules over each sentence, its kind and its record fact, read and corrected until the residual "other" held 4 (in order: internal text; normal times under a crisis in force; two homes; content the boundaries switch off; an armed force the town lacks; a count; a size; a figure; a house, role or force the town lacks; a resource, good or chain state; then the four "other" classes). A line has one mechanism, the first that fits; a handful sit at the border of two. *Source*: each sentence matched to the tip literal or corpus variant covering most of it (case, tier noun and placeholders folded; multi-sentence literals split): 353 of 361 matched, 134 of them partially (a table or chip row matched by one cell). *New or old*: the matched source text, or the sentence's longest fixed run, searched on master `db832c892` under `src/` and the corpus document (`git grep -F -i`, with a looser 18-character fallback).

## 1. By mechanism

| mechanism | lines | HIGH | new since master |
|---|---|---|---|
| names a house, a role or a force the town lacks | 79 | 18 | 28 |
| presumes normal times under a crisis in force | 60 | 18 | 40 |
| a figure against the record's | 45 | 2 | 16 |
| names a resource, a good or a chain state that is not so | 42 | 8 | 22 |
| a size | 39 | 7 | 16 |
| two homes that disagree | 22 | 5 | 17 |
| internal text (a template name, a range, a debug or chip row) | 19 | 1 | 0 |
| a count | 14 | 7 | 11 |
| other: a ruler, a power, a threat or a history state that is not so | 14 | 0 | 5 |
| other: denies a house, force or crossing the town has | 12 | 1 | 7 |
| other: a place, a route or a coast the town lacks | 7 | 0 | 1 |
| other | 4 | 0 | 3 |
| other: content the town's own boundaries switch off | 4 | 0 | 0 |
| **total** | **361** | **67** | **166** |

"Other" is broken down until no class holds more than 20: the four "other:" rows and a residual of 4 (a gate tally where the wall is a bank with no gate; "market lives off through-traffic" with no transit recorded; "traffic … little of its money stays" in a self-sufficient village; "one criminal ring" where several gangs stand).

## 2. By source: the thirty with the most lines

Distinct = distinct source units (a corpus variant, or a file and line); instances = cold lines.

| # | source | instances | distinct | HIGH | new since master |
|---|---|---|---|---|---|
| 1 | `src/data/institutionalCatalog.js` | 21 | 12 | 1 | 0 |
| 2 | `corpus DS-GEN-18` | 21 | 5 | 5 | 21 |
| 3 | `src/data/institutionDescColour.js` | 16 | 13 | 2 | 0 |
| 4 | `corpus DS-DEF-2` | 14 | 11 | 1 | 11 |
| 5 | `corpus DS-ECO-9` | 14 | 8 | 3 | 7 |
| 6 | `corpus DS-DEF-5` | 14 | 7 | 2 | 14 |
| 7 | `src/data/historyData.js` | 13 | 9 | 3 | 2 |
| 8 | `src/generators/economy/economicState.js` | 13 | 8 | 4 | 0 |
| 9 | `src/data/npcData.js` | 12 | 9 | 0 | 3 |
| 10 | `src/domain/display/defenseDisplay.js` | 12 | 3 | 0 | 2 |
| 11 | `src/generators/economy/foodBalance.js` | 11 | 6 | 3 | 9 |
| 12 | `src/data/cultureProfiles.js` | 10 | 5 | 2 | 2 |
| 13 | `corpus DS-ECO-1` | 10 | 3 | 6 | 10 |
| 14 | `src/data/institutionDescVariants.js` | 9 | 7 | 1 | 1 |
| 15 | `src/data/supplyChainData.js` | 9 | 7 | 0 | 0 |
| 16 | `src/data/institutionBacking.js` | 9 | 4 | 0 | 0 |
| 17 | `corpus DS-POW-6` | 9 | 2 | 3 | 9 |
| 18 | `src/data/institutionServices.js` | 8 | 7 | 2 | 1 |
| 19 | `(unattributed)` | 8 | 7 | 0 | 6 |
| 20 | `src/data/arrivalProse.js` | 7 | 7 | 1 | 0 |
| 21 | `corpus DS-ECO-10` | 7 | 6 | 1 | 3 |
| 22 | `src/domain/summary/settlementQuickGuide.js` | 7 | 4 | 2 | 4 |
| 23 | `corpus DS-ECO-12` | 7 | 4 | 1 | 6 |
| 24 | `src/generators/safetyProfile.js` | 7 | 4 | 3 | 5 |
| 25 | `src/components/new/tabs/EconomicsTab.jsx` | 7 | 3 | 6 | 7 |
| 26 | `corpus DS-DEF-9` | 6 | 4 | 0 | 2 |
| 27 | `src/components/new/tabs/WhoRunsThisTownPanel.jsx` | 6 | 1 | 6 | 6 |
| 28 | `src/data/historyDescVariants.js` | 4 | 4 | 0 | 0 |
| 29 | `corpus DS-ECO-11` | 4 | 3 | 0 | 0 |
| 30 | `src/generators/historyGenerator.js` | 4 | 3 | 0 | 2 |

All sources: 66 (65 named and the unattributed). By kind: corpus variants 124 lines, code and data literals 229, unattributed 8.

## 3. New or old (master `db832c892`)

| | all 361 | HIGH 67 |
|---|---|---|
| NEW since master | 166 | 43 |
| OLD (same file) | 174 | 22 |
| OLD (elsewhere on master) | 21 | 2 |

Of the 166 new lines, 98 are corpus variants, 62 code or data literals, 6 unattributed. Of the 124 corpus lines, 98 are new since master. "New" includes a line rewritten since master whose earlier wording may also have been false.

## 4. The corpus blocks among the thirty

Lines false = cold instances (distinct variants); variants in block = at the tip; towns = the 720 census dumps at the tip where any variant of the block prints, and where any of its false variants prints (printed = its longest fixed run of 20 characters or more appears, case and tier noun folded).

| block | lines false (distinct) | variants in block | towns printing the block | towns printing its false variants | the false variants |
|---|---|---|---|---|---|
| DS-GEN-18 | 21 (5) | 13 | 595 | 484 | BOUGHT-IN v5; STALLED v2; BOUGHT-IN v1; BOUGHT-IN v4; BOUGHT-IN v6 |
| DS-DEF-2 | 14 (11) | 97 | 720 | 368 | Beasts & Monsters: plagued, perimeter AND organized force v1; Invasion & War: neither walls nor force v2; CHAIN: food trades working v2; Invasion & War: walls with NO force v2; Invasion & War: walls AND professional garrison v1; CHAIN: defence supplied v2; CHAIN: food trades failing v1; CHAIN: defence supplied v1; Economic Survival: STRONG v1; Economic Survival: WEAK v1; CHAIN: food trades failing v3 |
| DS-ECO-9 | 14 (8) | 51 | 710 | 463 | SECURE v1; DEFICIT v2; DEFICIT v1; IMPORT-DEPENDENT v2; IMPORT-DEPENDENT v4; FOOD SOURCES: one source v1; FOOD SOURCES: several, the largest named v1; SECURE v3 |
| DS-DEF-5 | 14 (7) | 53 | 718 | 472 | walls PRESENT v2; ARCANE: alchemists v1; NO organized force at all v3; FIXTURE: gates v1; ARCANE: alchemists v2; charter hall ABSENT where the country warrants one v2; FIXTURE: charter hall v1 |
| DS-ECO-1 | 10 (3) | 15 | 720 | 319 | COMBINATION C4: a low rung on a working approach v2; COMBINATION C4: a low rung on a working approach v1; COMBINATION C4: a low rung on a working approach v3 |
| DS-POW-6 | 9 (2) | 44 | 541 | 185 | capture pressure ADVANCING (weak security, poor prosperity) v3; capture pressure ADVANCING (weak security, poor prosperity) v1 |
| DS-ECO-10 | 7 (6) | 33 | 720 | 461 | POSTURE: established v3; POSTURE: entrepot v1; POSTURE: established v2; POSTURE: established v6; POSTURE: established v1; POSTURE: established v5 |
| DS-ECO-12 | 7 (4) | 39 | 720 | 425 | INCOME MIX: one source carries the town v3; CRITICAL IMPORT: the land cannot give it v1; INCOME WEIGHT: the religious houses v1; CRITICAL IMPORT: a house needs what the land lacks v2 |
| DS-DEF-9 | 6 (4) | 17 | 718 | 177 | magicDependency true, with a NAMED dependent chain v1; magicDependency true v4; magicDependency true v3; magicDependency true, with a NAMED dependent chain v3 |
| DS-ECO-11 | 4 (3) | 60 | 720 | 187 | EXPLOITATION: fullyExploited v3; EXPLOITATION: fullyExploited v1; EXPLOITATION: partiallyExploited v4 |
