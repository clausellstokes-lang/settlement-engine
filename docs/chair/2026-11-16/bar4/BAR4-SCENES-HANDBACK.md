# BAR4-SCENES · hand-back (2026-11-16)

Base a71788851f (8aef8e7d46 + the close's hand-back, one document; the chair's 07:50 correction). One batch, one commit.
Handed back by file at about 280,000 of my count: what is left is in order below.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard · positive control |
|---|---|---|---|---|---|
| A1 · the scene's presumption (an arrival or overview line that shows what the town's present state denies) | `tests/helpers/scenePresumption.js :: scenePresumptionFindings(record, lines)`: each sense line of `ARRIVAL_SENSES` and six general-desk lines declare what they show (`SENSE_PRESUMES`, `GENERAL_PRESUMES`; a sense line not listed presumes its key's house at work), read against the record by six readers (`PRESUMES`) | 47 in 47 towns → 13 in 13 (all `house at work`, frozen: item 1 below) | 22 in 22 → arrival lines 14 → 11 (all `house at work`); the general-desk 8 (monks 6, market 2) not re-rendered: cured by their marks, 0 on the 720 | none (`EXCLUDED` is empty) | `tests/generators/bar4ScenePresumption.test.js`: 0 over the 720 but the frozen 13 (shrink-only, and each must still fire); POSITIVE CONTROL: a census town stripped of timber, enchanters and market, its herds failed and an inn on its lodging: all five presumptions fire |

By presumption, 720 before → after: monks lodge 25 → 0 · house at work 13 → 13 · market open 3 → 0 · enchanting 3 → 0 · timber at hand 2 → 0 · herds live 1 → 0. Fresh 300 before: monks 6 · house at work 11 · market 2 · herds 2 · enchanting 1.

THE K6 SPLIT (C45961): a sawmill's gap "lacks access to timber" beside a working chain that outputs milled lumber: 3 of the 720, 1 of the 30 read. Neither field is mine (the chain status and exports; the gap). Named for the chair: the page's own gap reader (`validationOnPage.js :: resourceGapLines`) drops the sawmill's gap where the river-mill chain runs, so the Institutions tab marks no shortage; the arrival line now reads the town's timber itself (`timber at hand`).

## Rows

- **C45961** CURED: "The smell of sawn timber is everywhere" needs `timber at hand`; its twin prints in bar0-village-famine-rand-21.
- **C46725** CURED: the drovers line excludes `failed: livestock`; its twin prints in bar0-village-famine-rand-22. The penned-cattle line is cured with it (1 fresh town).
- **C2056** CURED: the enchanting signs need `enchanting`; its twin prints in bar0-city-under_siege+famine-rand-22.
- **C19497** CURED: DS-GEN-13 "COMMERCE: a market, no guild" v3 declares `no crisis: under_siege`. A siege line v6 is added, so the pool's street voice is not left mute.
- **C29106** CURED: DS-GEN (GREAT HOUSE: monastery) v3 declares `no institution: tavern`. Every one of the 25 had an inn on its lodging (Inns and taverns (district) 24, Coaching inn 13, Inn (multiple) 1).
- **C19472** STRUCK (WEAK): the hamlet's open-cast mine is printed extracting with no mark, so rock moves inside the barricades. The detector's `house at work` agrees: a stone house is at work.

Each twin keeps its slot and spends no redraw. In the three read towns only the cured beat changes; every other beat of the scene is unmoved.

## New vocabulary (amendment 5b; vetoable by the owner)

New module `src/domain/facts/sceneSupply.js`, with getters on `factsOf.js` and homes on `factLayers.js` (layer 2). Each atom sits beside its own family:
- `timber at hand` (beside `iron at hand`);
- `failed: <fish|grain|game|livestock>` (beside the food-source atoms, which keep a failed source);
- `enchanting` (beside `magic`).

## The veto list (every new or changed line, with towns it is read in)

| line | towns |
|---|---|
| "Timber is scarce in {n}, and what little wood the workshops get is worked to the last shaving." (twin) | bar0-village-famine-rand-21 (village, famine); 0 of the 720 |
| "A few planks stand seasoning by the road in, and there is little timber to add to them." (twin) | r2s-recently_betrayed-town-1 (town) |
| "The saws of {n} are quiet most days, for want of timber to cut." (twin) | none yet in the 720 or the 30 |
| "The pens at the edge of the settlement stand half empty, and the drovers have little left to drive." (twin) | bar0-village-famine-rand-22 (village, famine); r2s-famine-hamlet-3 (hamlet, famine) |
| "The few cattle left in the pens of {n} low at every hour." (twin) | one fresh town (bar0-*-rand-1xx, famine) |
| "Nobody in {n} sells enchanting by the hour, and what magic is done here is done quietly." (twin) | bar0-city-under_siege+famine-rand-22 (city, siege and famine); r2s-occupied-city-3 (city, occupied); r2s-succession_void-city-0 |
| DS-GEN-13 v6 "Since the siege shut the market, what little buying and selling {settlement} still does is done face to face, door to door." | the 3 + 2 siege towns that printed v3 (e.g. r2r-village-55, bar0-hamlet-under_siege-rand-22) |
| declared, words unchanged: sawn timber, seasoning planks, saws (`timber at hand`); drovers, penned cattle (`no failed: livestock`); enchanting signs (`enchanting`); DS-GEN-13 v3 (`no crisis: under_siege`); monastery v3 (`no institution: tavern`) | where they printed before, less the towns above |

## Gates at the tip (each alone through `scripts/gate-tail.sh`)

These are GREEN:
- the guard;
- negativeAssertionAnchor, seedLoopTotality and proseDrawnAnchors;
- factLayers, engineCoreLazyEdge and layerBoundaries;
- arrivalScene, census2dTables, factVocabulary and textOf;
- styleLaw;
- eslint on the touched files.

These are RED, each a stored figure or register row moved by the declared cure, NAMED and not re-taken:

| test · arm | old → new | door |
|---|---|---|
| `tests/data/dossierStateProseProjection.contract.test.js` · SHIFT REGISTER pins (variant-count 0/1, face-count 0/2, vids 0) and the MUTANT | 2959 → 2960 variants (DS-GEN-13 v6) | the register's own re-record ("THIN-pool growth", owner-gated per landing) |
| `tests/lint/proseCorpusBytes.test.js` · RAW is EXACT | general.generated.js 298675 → 299164 raw bytes (+489: v6 and two marks) | a CEILING: not raised; this commit |
| `tests/lint/writerReach.walker.test.js` · surfaceReach round-trip | `failedSource` on foodRecord gains a real reader (`sceneSupply.js`) | WR1: the frozen row moves; named |
| `tests/lint/presumedThings.walker.test.js` · ARM 1 | fresh hit `house: tavern :: "no institution: tavern"`: it is the monastery line's own exclusion mark, not a printed word | PT3/PT4: named for the close |

Re-keyed by identity in this commit: `tests/domain/facts/textOf.test.js` (object rows 134 → 143, with a dated note).

## The books (amendment 2): NOT RUN

The books were not run within my budget: the seventeen law suites, the ten files of BRIEF-BAR4's amendment 2, the build and `verify:dist`, and the 525 reference hashes. The cure moves records: the arrival scene, wherever a twin now prints (`arrivalScene`, the narrative family). The general-desk draws change only in the two pools.

## Registrations owed

- Manifest entry owed: `tests/generators/bar4ScenePresumption.test.js` (it kills the mutation "a sense or desk line that shows a trade, a market, a service or lodging is drawn where the record denies it").
- Roster row: none is owed (no goods-module import).

## What is left, in order

1. **The `house at work` remainder (13 of the 720, 11 of the fresh 300)**:
   - a fish sense line where every fish house is "Short of fish." (8);
   - a kiln line where the potter is "Short of clay." (3);
   - "Part of {n}'s living comes out of the ground" or "Spoil heaps" where the quarry is "Short of stone.";
   - "a great deal of spellwork" where the alchemist is short of materials;
   - in the fresh 300 also an ostler and a mill wheel.

   The cure needs an atom over a house's own mark (`crisisStoppedRow.js :: rowMarkText`), which is a display leaf the facts may not import. Two ways forward: a facts-layer reading of the house gaps (`housesShortOfInput`'s inputs), or the chair's word on homing that reading. The guard freezes the 13, shrink-only.
2. **The books above, at the tip against a71788851f.**
3. **The K6 split (sawmill gap beside a lumber-exporting chain), for the chair.**

## Instruments

- The instruments are BAR3-PLACES's (`git archive` of READ-ALL and CENSUS-3 into the scratchpad).
- Before: `census3.sh <base> <out> 4`, and again with `--seeds seeds.fresh300.txt --count-only`.
- K2: `node count.mjs <tree> <out>` (scratch: the detector over each town's record and its dump's Overview).
- After: the guard (720, record and desk lines), and `births.mjs` with the fresh seeds plus `count_rec.mjs` (the detector over each record's arrival scene).
