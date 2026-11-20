# PLACE-1 — hand-back (kept current at every push)

Last written: 2026-11-20T18:11Z Seat: PLACE-1 of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Prompt: `docs/chair/2026-11-20/seventh/prompts/PLACE-1.txt` on `origin/lane/chair-2026-11-08` (read it whole: it is the assignment). Branch: `lane/place-1-2026-11-20`, cut at 43ab0f5eb (the working line `lane/join-2026-11-14`).

## How a successor resumes
1. Read the prompt, then this file, then the briefs in this directory (`BRIEF-*.md`); nothing else is needed.
2. The before-measure: the chair's census (`docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs`, unmodified) at 100 places a size at 43ab0f5eb, tabulated for my fields by `tools/census/fields.mjs <census.json>` into `tools/census/fields-before-100.txt`. To re-take: `node census.mjs <repo> 100 json > c.json` (about 2 minutes; needs `npm ci`), then `node tools/census/fields.mjs c.json`. A `-` cell means fewer than 5 holders (the census drops those paths).

## The before, 100 places a size (top sentence's places / holders)
```
eS.situationDesc                             thorp 67/100 | hamle 62/100 | villa 68/100 | town 89/100 | city 89/100 | metro 85/100
eS.safetyProfile.safetyDesc                  thorp 48/100 | hamle 48/100 | villa 56/100 | town 43/100 | city 58/100 | metro 66/100
eS.safetyProfile.economicDragDesc            thorp 6/6 | hamle 11/11 | villa 16/17 | town 27/53 | city 67/94 | metro 70/100
eV.dependencies[].title                      thorp - | hamle - | villa 10/19 | town 10/19 | city 100/100 | metro 100/100
eV.dependencies[].description                thorp - | hamle 3/7 | villa 35/60 | town 31/64 | city 100/100 | metro 100/100
eV.dependencies[].impact                     thorp - | hamle 4/7 | villa 60/60 | town 63/64 | city 100/100 | metro 100/100
eV.dependencies[].suggestedFixes[]           thorp - | hamle 4/7 | villa 35/60 | town 31/64 | city 100/100 | metro 100/100
eV.warnings[].description                    thorp - | hamle - | villa - | town 62/87 | city 29/99 | metro 52/96
eS.tradeDependencies[].impact                thorp - | hamle 31/38 | villa 13/13 | town 100/100 | city 99/100 | metro 96/100
eS.activeChains[].entrepotNote               thorp - | hamle 8/12 | villa 13/22 | town 31/47 | city 81/89 | metro 76/86
```

## State of each field
| field | brief | measure | PLACE-LINES | builder | merged (PLACE line) |
|---|---|---|---|---|---|
| situationDesc | 948acb88e | 0bfd7e7b8 (merged da1579e8c): `situationDesc-MEASURE.md`; after 9/13/11/7/5/7 | sent as da1579e8c | NOT BUILT: the chair, 16:25 UTC: no page prints it (G1); the lines stay as a record | — | — | — |
| safetyDesc | df3b1f1a8 | running (told 16:2x to prove it prints first, section 0) (builder branch place-1/safetyDesc-measure) | — | — | — |
| economicDragDesc | c33953282 | stopped unfinished (no commit) | — | — | DROPPED by the chair 16:30 (SAME-1: printed in 0–7 places a size) |
| economicViability.dependencies[] + warnings[] + summary | c33953282 | 50384de85 (merged 6571cf474): NOTHING REPEATED PRINTS (Outlook tab and PDF drop severity `dependency`; the one warning hidden by its title; the pages print their own verdict, not `summary`) | DROPPED, reported | — | — | — |
| tradeDependencies[].impact | c33953282 | — | — | — | DROPPED by the chair 16:30 (printed in 0–4 places a size) |
| activeChains[].entrepotNote | c33953282 | 5ef59564a (merged 0899d93e6): PRINTS on Economics › Economic Flows cards (entrepot && !dependency) and the PDF; held top 3/8/13/31/81/76 → 1/3/4/7/12/13 WITH the carrier atom (metro 24 without) | APPROVED 17:18 (atom granted; 8 rewordings; 3 conditions) | building: place-1/entrepotNote-build from 0b41e9fd4 | the chair's SECOND unit |
| economicViability.plotHooks[].hook | f18e3c59c | 903ab1d5d (merged bc5ed1792): PRINTS on Summary › Plot Hooks (DM, player), PDF via `collectPlotHooks`; all-places top 11/10/12/19/15/16 → 5/3/3/8/11/12 (two pools: merchant food line, iron hooks) | APPROVED 17:38 as written (25 rows; iron pool in; today's text drawable; the grade: cure if printed, else survivor) | brief `BRIEF-BUILD-viabilityHooks.md`; builder cut when a seat frees (re-measure on 150 a size) | added by the chair 16:38, after entrepotNote |
| safetyProfile.plotHooks[] | f18e3c59c | — | — | — | added by the chair 16:38, after entrepotNote |

## Laws I hold (from the prompt; short)
Builders build, I integrate: one builder a field, red first; I read its diff once at the merge, re-run red and green, take the lighting and wiring censuses by their doors, prove confinement with `docs/chair/2026-11-20/content/tools/confinement/trees.mjs` (0 non-string differences), then send "PLACE <field> <commit>". Lines go to the chair as "PLACE-LINES <field> <commit>" BEFORE a builder is cut. `prosperity.js`: ONE call line, sent to the chair before the merge. Push: `git ls-remote` first, plain push, never while committing, never a PR.

## Build brief
`BRIEF-BUILD-COMMON.md` (the how for every builder). A field's build brief names its MEASURE and the lines the chair read.

## Rulings received
- 16:10 UTC: `factVocabulary.js` read-only; an atom only by the chair's leave, one line "ATOM <key> : <home> : <wording>", appended.
- 16:25 UTC: PROVE A FIELD PRINTS BEFORE MEASURING IT (render through the page census's walker, name the surface); a field no page prints is reported in one line and dropped. `situationDesc` not built.

- 16:30 UTC: order: safetyDesc FIRST, entrepotNote SECOND; economicDragDesc, tradeDependencies, viability DROPPED (SAME-1's render of 300 places).
- 16:38 UTC: two hook fields added after entrepotNote; THE RULE FOR A HOOK: a lead a DM can use tonight, may propose a twist, may not name a house the place lacks. `publicProse.blocks.*` are PROSE-1's, not mine.
- 16:47 UTC: safetyDesc lines APPROVED (all 78 rows; my four calls; walls row 4 reworded "The walls keep the outside out; the trouble there is starts within."); re-measure on the built tree and give both.
- 16:51 UTC: NO ROW MAY NEED A HIDEABLE FACT (`factLayers.js`) on a field a player or public page prints; say in the hand-back how it is held and which reads serve the field.
- 17:13 UTC: the 16:51 condition CORRECTED: the test is `cardVeil.js :: isHideableHouse` (criminal or clandestine) or any crime/clandestine fact (red); every other house a row needs is LISTED here, pool by pool, for the security reader at the join (see 'Houses the pools need').
- 17:18 UTC: entrepotNote APPROVED (verbatim in `BRIEF-BUILD-entrepotNote.md`). EVERY LANE MERGES `lane/kernel-mix-2026-11-20` at bd42d63c7 (`pickVariantMixed`): merged here as 550d7d8b3; every new pool uses `pickVariantMixed`. The chair's count of this seat: 258,692 at 16:53; PLACE-2's prompt is ready (the successor).
- 17:38 UTC: economy hooks APPROVED (verbatim in `BRIEF-BUILD-viabilityHooks.md`). The chair's count: 291,799 at 17:32; PLACE-2 is seated past 360,000.
- STILL TO MEASURE: `safetyProfile.plotHooks[]` (brief `BRIEF-MEASURE-safetyHooks.md`, not yet dispatched).
- AT EACH MERGE (mine): read the diff once; re-run red and green; `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs a331a4a19 <tip> <workdir>` (base births cached in the scratchpad `conf/`; 0 non-string differences, list the moved string fields); the lighting census (`LIGHTING_CENSUS_REFREEZE=... npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`), the wiring census (`node scripts/wiring-census.mjs` then `--check`), the page census (`node scripts/census/page-census.mjs`); the chair's census after (`census.mjs` 100, or 150 where ruled); then "PLACE <field> <commit>".
- 18:10 UTC: the chair's read of this seat: 311,573 at 18:03; PLACE-1 KEEPS THE LANE to 420,000, through the safety line's merge; PLACE-2 seated beside, reading only. safetyDesc's reds ruled: (1) THREE more village rows each for MIXED_FORCE none and MIXED_OPENING (≥7 eligible at a village), sent as "PLACE-LINES safetyDesc-village <commit>"; pick NOT reverted; re-measure on 150 a size, both shares (all places; among printers). (2) classes walker by declaration only: the moved "Travelers are advised…" keeps today's classes; the three "safe enough" openings declare `threat` only if the walker's definition fits, else walker line + sentence to the chair. (3) registers mine at the merge; the 12 rows' count in "PLACE safetyDesc <commit>". ORDER: village rows → chair's read → builder's cure → my one read of the diff → merge → "PLACE safetyDesc <commit>". If this seat passes 400,000 before the trade note's merge: push its branch `-wip`, write this file, send "PLACE-PART <commit>, HANDED OVER".

## Houses the pools need (for the security reader at the join)
- safetyDesc (builder's list, 232c8d3e4): TINY_MODERATE: Household levy, Citizen militia · MIXED_OPENING: market houses · MIXED_FORCE garrison: Barracks, Garrison, Multiple garrisons, the three watch houses, walls and gate houses, the three militia houses, market houses · watch: watches, walls and gates, force houses, market houses · militia: the two militia houses · none: market houses · MODERATE_WALLS: Palisade, Palisade or earthworks, Town walls, Gates (if walled), Citadel, City walls and gates, Massive walls and fortifications, force houses incl. Free company hall and Mercenary quarter, garrison · UNSAFE_GARRISON: garrison, watch · UNSAFE_ADVICE: market houses · UNSAFE_WALLS: walls, gates, force houses · MIXED_CORNERS, UNSAFE_OPENING: none. Facts read: `factsOf` defence, guardPresence, market, forceWalksByDay, route, tier. No hideable house or crime fact.

## Named survivors (found, not mine to build)
- The economy's merchant hook ("grows less food than it eats…") is graded "Survival Crisis / critical" in 56 of its 78 places: the grade reads the raw food band while the page shows Pressured (`viabilityHooks-MEASURE.md`). Sent to the chair 17:3x.
- `resourceDynamicsKernel.js` overwrites a stored `entrepotNote` with the chain's stock note when a resource changes (an edit lifecycle): after the cure, an edited town's note reverts to the stock one. The chair, 17:18: a named survivor.
- The economy's output never reaches 70 in 600 default births, so every busy-trade branch of `prosperity.js :: situationDescOf` (and the label bonus at 70) is dead (`situationDesc-MEASURE.md` §A). The chair: a named survivor, not the fortune lane's to build now.
