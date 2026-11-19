# BAR4-PEOPLE · hand-back (two ties that cannot both hold; a title against its holder's sex; a secret against the town)

Branch `lane/bar4-people-2026-11-16`, on a71788851 (8aef8e7d46 and one hand-back document, the chair's 07:50 correction;
every measure below is at 8aef8e7d46). Worked to BRIEF-BAR4 (amendment K: a detector first), BRIEF-BAR2 (the method),
BRIEF-BAR3's amendments 2 to 9, 11, 12, and the chair's rulings of 2026-11-16: TI1 (`src/generators/people/ties.js` is this
seat's; P1 is cured AT THE DRAW, not in the text) and "the priest for a woman stays excluded as an office word, on the
owner's veto list"; and the chair's ceiling ruling of 09:29 (the first paint bought back: the pair readers live beside the
lazy tie draw, not in `factsOf`; the worker bundle's rise is a named move for the close). One batch, its buy-back, and the join's follow-up (the chair's ruling of 11:07): three commits.

## THE KINDS

| kind | the detector | 720 before → after (inst / towns) | fresh 300 before → after | named exclusions (and why) | the guard and its positive control |
|---|---|---|---|---|---|
| P1 'successor': "X named Y as successor in front of witnesses" where the two share no house's trade or face and X heads no power Y sits in | `tests/helpers/peopleKinds.js :: pairTieClashes` (reads `mentor_legacy.desc#7`'s declaration `successor: true`, the two cards in the order the line names them, their `institution` and `memberships`) | 335 / 288 → 0 / 0 | 128 / 116 → 0 / 0 | X holds the FIRST RANK of a power Y sits in: the place is the head's seat (27 towns of the 720 keep the line; 6 of the 300) | `tests/domain/bar4PeopleKinds.test.js` P1 (a): zero over the 5 'broken' towns, the 3 'warm-cold' towns, every sixth of the 288 and the two KEEP towns; (b) a built town (a tanner names a joiner, a devoted teacher beside an enemy whose line declares `contact: 'none'`): all three kinds fire |
| P1 'broken': a line claiming the two do not speak beside another tie of the same two | the same (a printed row's `contact: 'none'`) | 5 / 5 → 0 / 0 | 0 / 0 → 0 / 0 | none | the same |
| P1 'warm-cold': a warm tie (a devoted or lifelong teacher, a deep respect, a line declaring `trust: 'full'`) beside an enemy's | the same (`npcData.js :: TIE_TEMPER`) | 3 / 3 → 0 / 0 | 1 / 1 → 0 / 0 | a rival's tie is no enemy's (rivals respect one another; a rival was taught); a family's is neither (blood holds whatever the quarrel) | the same; and (a') the three pairs keep both ties |
| P2 a sex-named everyday title | `tests/helpers/peopleKinds.js :: sexNamedTitleClashes` (every word a card is called by: `cardHonorificOf`, `keeperHonorificOf`, its title, its role, the role its ties style it by; `SEX_NAMED_WORDS`) | 119 / 119 (Landlord 117, Cunning-Man 2) → 0 / 0 | 38 / 38 (Landlord) → 0 / 0 | an office's title is the office's (TM1: every word of `officeTitles.js :: OFFICE_WORDS`, with "Acting", and the pools' Lord Bishop, Lord Chancellor, Lord Governor); "the lord's appointee" names the lord; Warlord (no ordinary other word); midwife (the trade's own word); Mother/Father Superior; THE PRIEST FOR A WOMAN (232 cards in 60 towns of the 720: the faiths' word for the office, her honorific is Mother; the chair's ruling, ON THE OWNER'S VETO LIST: if struck, `holderTitleForms.js` takes 'the priest' → 'the priestess', a record move in those 60 towns) | the same file, P2: (a) zero over every fourth of the 119 towns and both Cunning-Man towns; (a') EVERY POOL (the registry, the inland, each culture's): a string honorific that names a sex is a pair; (b) a woman "Landlord" and a man "Alewife" fire, a woman "Lord Mayor" does not |

Singles (K5), each measured on the record by its state and cured at its writer:

| row | the state that makes it false | 720 before → after | fresh 300 before → after |
|---|---|---|---|
| C4412 the vintner's secret "Bought the vineyard…" | no printing town holds a vineyard | 58 / 58 → 0 | 18 / 18 → 0 |
| C37293 (WEAK) "X governs on Y's credit" | X (the government's card) is not the seat's first | 21 printings / 20 towns (20 of 21 not the seat) → 0 | 5 / 5 → 0 |
| C23720 (WEAK) "a good ear on the waterfront" | the docks front no water (6 of the 32; the read's sky docks) | 32 / 32 → 0 | 15 / 15 → 0 |

## The cure (one commit)

- P1, AT THE DRAW (TI1), `src/generators/people/ties.js :: drawTies`: TWO PASSES. First every draw, card by card on its own fork exactly as before (target, kind, strength); then the prose (draw-free) in the same order. So (a) a pair's SECOND tie takes the temper of its first (`inTemperOf`; no draw added, moved or re-ordered): beside a warm first tie an enemy's kind is a rival's at the same rung (mild, serious, mortal → professional, personal, bitter); beside a cold first tie a warm strength is its kind's first (devoted → formal; deep → grudging); an enemy's lines declare `trust: 'none'` (`bitter_history.desc`), so the prose draw's own PP4 rule holds a later "trust completely" line. (b) Two pair atoms (5b: beside `shared power` in `factVocabulary.js`, one shared reader `pairFact`; leaf rows in `factLayers.js` with the walker's new `pairCall`; the draw's body in the new `src/generators/people/pairPlace.js`, beside the tie draw, read in the WRITTEN order by `ties.js :: withPairTies`; and, by the chair's ruling of 11:07, two small inline bodies in `factsOf` (`sharesPlace`, `loneTie`) read off the FINAL record, symmetric in the pair, which the presumption check re-reads every drawn line by (two delegation lines in `presumptionCheck.js :: settledFacts`)): `shared place` (one house's family or face, or the first card heads a power the second sits in; read in the order the line will be WRITTEN, which `drawTies` knows: a second tie of a kind is written in the first's order) needed by `mentor_legacy.desc#7`; `lone tie` (`pairIsLoneOf`: the two carry no other tie; `drawTies` counts its drafts before any prose) needed by `bitter_history.desc#3`. A refused index resolves by the pool's own rule (`drawDeclared`, held as printed): no pool mute, no card loses a tie. The texts of both lines are unchanged.
- P2, `src/data/faceHonorifics.js`: "Landlord" is `{ male: "Landlord", female: "Landlady" }` in the innkeeper's, the tavern keeper's and the coaching-inn keeper's pools; the hedge wizard's `{ Cunning-Man | Cunning-Woman }` (same index: no pick moves; render-only, no record moves).
- C4412, `src/data/people/titleSecretsPresentations.js`: "Came by the business by lending its old owner money at a rate that could never be paid back" / "The old owner's children work for the new owner now, and they know how their family lost it". (Not "the cellar": `npcGenerator.js :: getStressHistory` keys the presentation mode on the secret's words, and "cellar" holds "cell". Not "the vintner": a registered thing, `presumedThings`.) Its sibling "talks about the year's grapes" stands by P9/P12 (the vintner's grapes gap is the record's).
- C37293 (WEAK), `npcData.js :: gov_econ_dependence.desc#7`: "X holds office on Y's credit." One word.
- C23720 (WEAK), the wharfinger's welcoming presentation: "a good ear at the berths." (Not "the docks": a registered thing.)
- THE READ'S TWO TIE ROWS, verified on their towns: C18833 (bar0-hamlet-calm-rand-23) the devoted mentorship's second tie, an enemy's, is drawn as a rival's ("Alaa ibn Khalid and Latifa al-Amin trained together and have competed ever since."); C41801 (bar0-town-occupied-rand-22) the two sit unranked on one council (no succession: the second already sits there) and share no house: the successor index resolves to "Wei Kimura spent seven years at Bing Shimizu's side."

## The inventory diff (720, base 8aef8e7d46 → tip; `inventory_diff.py`)

Gone: the vineyard secret 58, "waterfront" 32, "governs on" 20, Cunning-Man 2+2. In fewer towns: the successor line and its index's tension 310 → 27 (the 27 true); "Landlord" 247 → 130 (the men); the silence line and its tension 123 → 119 (127 → 123 the tension, one index); "Unresolved History"/"Enemies" 310 → 308 and 326 → 324 (the two second ties now a rival's). THE INHERITORS READ: the mentor pool's own lines (+30 "spent # years at <N>'s side" and its twin's clause, +27 "took <N> under their wing early", +26 "has taken a new apprentice", +24/+22/+20 the others), each a line or a twin the pool already prints for any pair (the shared-trade ones take their PP3b twins); Landlady 117, the new secret 58, the berths line 32, "holds office" 20, Cunning-Woman 2. (THE 720 AFTER RUN READ TWO WORDS EARLIER: its render read "a good ear on the docks" and "work for the vintner now", which `presumedThings` then refused; the final words are in the fresh 300's run (15 and 18 towns) and in the guard.)

## EVERY NEW OR CHANGED LINE (the owner's veto list; the 720's towns at this tip: smallest, largest, a crisis)

| line | towns | read in |
|---|---|---|
| honorific "Landlady" (innkeeper, tavern keeper, coaching-inn keeper; a woman) | 117 | r2r-hamlet-54 (39), r2r-metropolis-13, r2s-under_siege-hamlet-0; the read's bar0-city-under_siege+famine-rand-22, bar0-hamlet-calm-rand-23 |
| honorific "Cunning-Woman" (the hedge wizard; a woman) | 2 | r2s-indebted-hamlet-2, r2r-hamlet-27 (the only two; neither in crisis) |
| the vintner's secret "Came by the business by lending its old owner money at a rate that could never be paid back" / "The old owner's children work for the new owner now, and they know how their family lost it" | 58 | r2r-town-18 (1,095), r2r-metropolis-8, r2s-under_siege-city-2; the read's bar0-city-under_siege+famine-rand-22 |
| `gov_econ_dependence.desc#7` "{A} holds office on {B}'s credit. Every loan renewed adds one more condition to the next." | 20 | r2r-town-48 (1,728), r2s-succession_void-metropolis-3; the read's bar0-town-calm-rand-22 (none of the 20 besieged, starving or occupied) |
| the wharfinger's presentation "Talks about the ships, the weather and the cargoes; a good ear at the berths." | 32 | r2s-famine-town-2 (407), r2s-indebted-metropolis-1; the read's bar0-metropolis-calm-rand-21 |
| `mentor_legacy.desc#7` (TEXT UNCHANGED; now drawn only where the place can pass) | 27 | r2s-wartime-hamlet-2 (25), r2s-mass_migration-metropolis-3, r2s-under_siege-city-1 |
| `bitter_history.desc#3` (TEXT UNCHANGED; now drawn only for a pair with no other tie) | 119 | r2r-hamlet-48 (70), r2r-metropolis-8, r2s-famine-town-3 |
| THE DRAW (TI1): a pair's second tie in the first's temper (an enemy's kind → a rival's beside a warm first; a warm strength → its kind's first beside a cold first) | 2 towns' kinds in the 720 | r2r-hamlet-15, r2r-village-11, r2s-infiltrated-town-0 (the three pairs) |
| two new atoms `shared place`, `lone tie` (5b, vocabulary) | — | `src/domain/facts/factVocabulary.js`, beside `shared power` |

## THE 525 REFERENCE CONFIGURATIONS: 221 move against 8aef8e7d46

Families: `relationships[].description`, `.tension`, `.proseVariant` (214 configurations) and `npcs[].secret.what`, `.stakes` (47: every one the vintner's reworded secret). No `type` or `strength` moves in the 525, and NO OTHER FAMILY MOVES: no later draw shifted (the STOP of TI1 is not met). Measured by hashing every configuration's record at both trees (a scratch probe in `tests/property`, never committed).

## THE BOOKS (each file alone at this tip through `sh scripts/gate-tail.sh`; a red one also alone at 8aef8e7d46; after the buy-back, alone again: `engineCoreLazyEdge`, `layerBoundaries`, `factLayers.walker`, `presumedThings`, `chainPrintSites`, `writerReach`, `observedShapeReaders`, `regenDerivedState`, `customContentPresentationClaims`, the guard, the tie-draw files: green; `tieProseDeclared`: its ledger, named; the 525: the same 221, the same families)

GREEN: the seventeen law suites but `proseWiringCensus` (below): `rosterDuplicateDraws`, `hookThemeDraws`, `upkeepVocation`, `factLayers.walker`, `layerBoundaries`, `defenceFactReaders`, `noLegacyFactionReaders`, `ruinFilterRoster`, `siteCoherenceRatchet`, `presumedThings`, `observedShapeReaders`, `proseComposed`, `proseEntryContradiction`; `engineCoreLazyEdge`, `tuningRegister`, `chainPrintSites`; the ten of BRIEF-BAR4's amendment 2 but `tieProseDeclared`: `customContentPresentationClaims`, `regenDerivedState`, `styleLaw`, `deepCraftKillList`, `economicStructure`, `proseCorpusBytes`, `stressSecretDeclared`, `defensePostureAgainstItsFacts`, `corpusEcoTailGuards`; the guard and the three corpus walkers (`negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`); the 41 files that pin a symbol I changed (the honorific, the title lines, the tie draw and its declarations) and the 17 readers of `calmFactsDouble`. The type ratchet, the strict-domain gate and eslint: green. `npm run build`: green; `dist/` removed.

## THE BOOKS MY CURES MOVE (named; NOT re-taken; each green at 8aef8e7d46)

| test | arm | old → new | door |
|---|---|---|---|
| `tests/generators/tieProseDeclared.test.js` | "the ledger's declaring rows carry exactly the ledger's declaration" and "the rendered text… byte for byte" | `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json`: `mentor_legacy.desc#7` needs [] → ["shared place"]; `bitter_history.desc#3` needs [] → ["lone tie"]; `gov_econ_dependence.desc#7` text "governs on" → "holds office on"; the declaring count 44 → 46 | the ledger's own form (as BAR3-CLOSE-DOORS-1 · 1d: each moved row re-taken from the live source by its two readers) |
| `tests/data/colourMarks4h.test.js` | the tie prose's colour marks follow the ledger | `mentor_legacy.desc#7` colour true → false (it now declares) | the same ledger |
| `tests/generators/generationForkCensus.test.js` | A1 the control row's digest | c42b5f20… → 45a4fc93… | the golden's door (the 525's re-take) |
| `tests/generators/pipelinePinnedMode.test.js` | the golden rows (18 of its rows) | moved | the golden's door |
| `tests/lint/proseWiringCensus.walker.test.js` | the committed census is current | `docs/content/wiring-census.json` stale | amendment 4: the close re-takes it once |
| `npm run verify:dist` | `engineBundleReplay` (221 of 525 rows), `engineServiceCore`, `engineServiceStoreParity`, its fence (168 of 360) | `supabase/functions/_shared/engineBundle.js` stale | `npm run build:edge-shared` |
| `npm run verify:dist` | THE BYTE CEILINGS (ruling B3), A NAMED MOVE with its figures. FIRST PAINT: 46b693c2c static 1,133,705 (+1,397 over the base's 1,132,308), gzip 361,062 (+306), Brotli 303,083 (+253); the buy-back (bbaf03b91) 1,132,583 (+275), 360,816 (+60), 302,983 (+153); the follow-up (the getters back in `factsOf`) 1,132,583 (+275), 360,817 (+61), 303,017 (+187): `factsOf`'s bodies ride a lazy chunk, and the +275 is the two atom rows in the eager vocabulary (`engine-core` 267,698 → 267,973). THE LAZY CHUNKS: the worker `generationWorkerLazy` 2,322,080 at the base → 2,326,001 (+3,898 over its ceiling 2,322,103), the engine chunk (`vendorPdfLazy`, < 878,554) 878,553 → 880,868 (+2,315) | the close re-records the size ceilings once (ruling B3); commits 46b693c2c, bbaf03b91 and the follow-up |
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived | — | 221 of 525 | the golden's door |

`verify:dist`'s boot smoke: its log at this tip names no smoke stage after the build tests above refused; a successor runs it again once the bundle is re-taken.

## Registrations owed (named, not made)

- None under `tests/generators` (the guard is `tests/domain/bar4PeopleKinds.test.js`; its helper `tests/helpers/peopleKinds.js`). New module `src/generators/people/pairPlace.js` (no goods import; `engineCoreLazyEdge` green). Changed test helpers: `tests/helpers/calmFactsDouble.js` (the double answers the two new pair atoms, as it answers `shared power`), `tests/lint/factLayers.shared.mjs` (the walker's `pairCall`: a leaf asked of the record and a pair of its roster).
- THE JOIN'S TWO REDS (found by the chair at bbaf03b91, cured in the follow-up): `tests/domain/facts/factVocabulary.test.js` ("a homed dimension names a factsOf getter") and `tests/domain/facts/ledgerBlockSupersession.test.js` R-D1 (soak1k-1185: the drawn silence line's `lone tie` read "unanswered" on the final record). ONE CAUSE: the buy-back took the readers out of `factsOf`. THE CHAIR'S RULING OF 09:29 WAS WRONG IN PART (it moved a reader without asking what the vocabulary's law and the presumption check need). AND MY LESSON: the facts' own tests (`tests/domain/facts`) were not in my net; after the follow-up `tests/domain/facts` WHOLE (57 files, 273 tests) and `tests/architecture` WHOLE (20 files, 344 tests) are green, each run alone, with the guard, `regenDerivedState`, `customContentPresentationClaims`, `factLayers.walker`, `presumedThings` and the tie-draw files; one build, `verify:dist` refusing only on the named figures, and `npm run smoke:boot` PASS (604 of 604 chunks); the 525: the same 221, the same families.

## What is left, IN ORDER (for a successor: read this and nothing else)

1. The first paint's last +275 B static (+61 gzip, +187 Brotli): the two atom rows in the eager vocabulary; named under B3 for the close.
2. The close's doors, once: the size ceilings (the worker, the engine chunk, the first paint's +275), the tie-prose ledger's three rows and its count, `colourMarks4h`, the wiring census, the edge bundle (`build:edge-shared`), the 525.
3. `npm run verify:dist` after the edge bundle's re-take, to read its boot smoke.
4. The owner's veto: "the priest" for a woman (excluded as the office's word).

## How the instruments are re-made

- THE CENSUS: `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <scratch>`; `sh census3.sh <tree> <out> 4` (720, about 13 minutes with its count) and `sh census3.sh <tree> <out> 4 --seeds <READ-ALL/packets11/seeds.fresh300.txt> --count-only` (the fresh 300, 8 minutes). Never two renders at once; never edit the tree under a render.
- THE DETECTORS over a census's records: a node script that streams `<out>/corpus.ndjson.gz` and calls `pairTieClashes(s)` and `sexNamedTitleClashes(s)` from the tree's `tests/helpers/peopleKinds.js`, counting instances and towns per kind. A BEFORE count of a declared kind is taken with the declaration in place and the cure not made; P2's before reads a copy of the helper importing the BASE tree's `src/` (the detector resolves the honorific through the live pools).
- THE SINGLES: by script on the record (`npcs[].secret`, `npcs[].presentation`, `relationships[].description`; `waterOf(s)` for the docks; the governing power's rank 1 for "governs").
- THE INVENTORY DIFF: READ-ALL's `inventory.py <out> before.json`, then `inventory_diff.py before.json after.json`.
- THE 525: a scratch vitest file in `tests/property` that writes every `goldenCorpus()` configuration's record (with its sha256) to an ndjson outside the tree, run in both trees; a python walk of the two by leaf path gives the families.
