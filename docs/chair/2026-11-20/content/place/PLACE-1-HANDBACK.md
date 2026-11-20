# PLACE-1 — hand-back (kept current at every push)

Last written: 2026-11-20T16:26Z Seat: PLACE-1 of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Prompt: `docs/chair/2026-11-20/seventh/prompts/PLACE-1.txt` on `origin/lane/chair-2026-11-08` (read it whole: it is the assignment). Branch: `lane/place-1-2026-11-20`, cut at 43ab0f5eb (the working line `lane/join-2026-11-14`).

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
| economicDragDesc | — | — | — | — | — |
| economicViability.dependencies[] + warnings[] | c33953282 | running (place-1/viability-measure; prove-it-prints first) | — | — | — |
| tradeDependencies[].impact | — | — | — | — | — |
| activeChains[].entrepotNote | — | — | — | — | — |

## Laws I hold (from the prompt; short)
Builders build, I integrate: one builder a field, red first; I read its diff once at the merge, re-run red and green, take the lighting and wiring censuses by their doors, prove confinement with `docs/chair/2026-11-20/content/tools/confinement/trees.mjs` (0 non-string differences), then send "PLACE <field> <commit>". Lines go to the chair as "PLACE-LINES <field> <commit>" BEFORE a builder is cut. `prosperity.js`: ONE call line, sent to the chair before the merge. Push: `git ls-remote` first, plain push, never while committing, never a PR.

## Build brief
`BRIEF-BUILD-COMMON.md` (the how for every builder). A field's build brief names its MEASURE and the lines the chair read.

## Rulings received
- 16:10 UTC: `factVocabulary.js` read-only; an atom only by the chair's leave, one line "ATOM <key> : <home> : <wording>", appended.
- 16:25 UTC: PROVE A FIELD PRINTS BEFORE MEASURING IT (render through the page census's walker, name the surface); a field no page prints is reported in one line and dropped. `situationDesc` not built.

## Named survivors (found, not mine to build)
- The economy's output never reaches 70 in 600 default births, so every busy-trade branch of `prosperity.js :: situationDescOf` (and the label bonus at 70) is dead (`situationDesc-MEASURE.md` §A). The chair: a named survivor, not the fortune lane's to build now.
