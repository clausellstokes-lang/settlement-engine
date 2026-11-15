# BAR3-DEFECON-2 hand-back (2026-11-15)

Seat BAR3-DEFECON-2, successor of BAR3-DEFECON. Start: `lane/bar3-defecon-2026-11-15` at 7a4b48a84, as named (the line's
merge 52f0a1684 is in it). Worked in a scratch worktree detached at 7a4b48a84 (pushed by explicit refspec), beside detached
trees at 7a4b48a84 (the tip census), 8b45191a5 (the predecessor's `before`) and 52f0a1684 (the books' second tree).

## The rulings I worked to
- BRIEF-BAR2 (the method) with BRIEF-BAR3's twelve amendments; the chair's prompt (items 0 to 7, each measured first).
- GRANT AS1 (the chair's, 20:36 UTC; vetoable): the one key `tensions: settlement.history?.currentTensions` on the existing
  line of the late re-read `settleCrimeLinesToSignal` in `src/generators/steps/assembleSettlement.js` (line 331; no line
  added, removed or moved there; nothing else touched there).
- RULING T28b (the chair's, 20:58 UTC; vetoable): the crime structure's key stays as T28 ruled it; the one-ring note declares.
- The chair's word on C7614 (strike unless the chain model says a link is missing).

## Batch 1 (items 1, 2, 5): measured on the census's 720 at 7a4b48a84 by script over `corpus.ndjson.gz`

| row(s) | the state that makes the line false | false / printing (720) | cure (file :: where) |
|---|---|---|---|
| C17459 "Crime exists but is well-managed." | a live `crime_wave` tension | 9 / 33 | `safetyLineTruth.js :: CRIME_WAVE_TWINS`, `settleCrimeWaveLines`, at assembly through `safetyProfile.js :: settleCrimeLinesToSignal` (grant AS1) |
| C22802 "It is noticed, and so far it does little harm." | the same | 37 / 136 | the same: the line's own first sentence, alone (the organised-crime branch's existing words) |
| C31257 "Thieves are scarce now; …" (the occupation's curfew line) | the same | 6 / 28 | the same |
| C30870 "Ask who runs crime here and the answer is one ring." and the class (every one-ring vantage of the organized note) | the live houses hold several gangs (`crimeSignal.js :: gangHousesOf` ≥ 2: a "Multiple criminal factions" house, or two street gangs) | 6 / 149 organized towns (each a several-gangs house) | `defenseDisplay.js :: ringNoteAmongRivalGangs` (T28b): the note's twin `RING_AMONG_RIVAL_GANGS_NOTE`; the key and label stay |
| C48585 "The timber carts stopped coming a month ago…" and its sibling "The timber rafts stopped coming…" | the record's import list holds no timber (the iron hooks' rule, `importHeld`) | carts 19 / 30 (one of them imports only "Sandalwood and camphor"), rafts 1 / 16; the forest line prints in none | `foodBalance.js` (the existing hook line; no line moved): the twin `outlookHookSiblings.js :: TIMBER_SHORT_HOOK`; the slot keeps its draw (`pick`, no roll) |

T28b's reach, for the chair: the ruling's words "more than one criminal house" read by the estate's one criminal detector
(`corruption.js :: isCriminalInstitution`) would silence a true one-ring note in 120 of the 149 organized towns (a fence, a
front business, a black market: the ring's own trade). I read it as the crime home's own gang count (6 towns, every one a
several-gangs house); the wider reading is the chair's to order.

STRUCK, true by the record (or the premise false on the 720):
- Item 3 (C32888 C32884 C30646, and the wide read's dates header flag): "a commodity whose only ground is depleted, still
  listed or exported": 0 of the 720. In both read towns the commodity has a second, live ground (bar0-city-wartime-rand-11:
  sea fishing grounds give salt, `resourceData.js :: fishing_grounds.commodities`; bar0-city-wartime-rand-12: the oasis
  chain's crops give dates). NAMED, not cured: the trade record IMPORTS "Dates and desert produce (local orchards
  unproductive)" and EXPORTS "Dates and fruit" (the oasis chain's output, `supplyChainData.js :: oasis_agriculture`, no seat's
  of mine) in 2 of the 720 (r2r-city-39, r2s-famine-city-1) and the read town: the collision is between two writers' leaves
  (the shortage import, `resourceSemantics.js`; the chain's outputs): for the chair. (Salt imported beside salted fish
  exported, arcane reagents beside arcane services, glass sand beside glassware: an input beside its product, true.)
- Item 4 (L5's first header flag, bar0-city-under_siege+famine-rand-13): the record's `defenseProfile.institutions.mercenary`
  is the bucket of mercenary companies the town fields (`defenseInstitutionBuckets.js`: 'mercenary company', 'mercenary
  quarter', 'hired muscle'); "Hired blades" is an Adventuring house of private work, and its page row says so. No page line
  says the town has no hired force in any of the 720's dumps of the 32 towns with a Hired blades house and an empty bucket:
  the contradiction is the readers' digest's ("hired: none"), not the record's: no cure.
- Item 6 (C7614 "Complete production chain in place" over a vulnerable chain): in none of the 62 printing rows (grain 39,
  iron ore 11, hot springs 5, clay 4, herbs 3) does the chain model mark the chain's input missing (`resourceInputAvailable`
  false, or `resourceDepleted`): complete and vulnerable both stand: STRUCK, as the chair ruled.

## Every new or changed line (the veto list)
- "Crime is on the rise." (leads the Safe label's line in place of "Crime exists but is well-managed."): r2r-village-7
  (village), r2r-city-21 (city), r2r-metropolis-20 (metropolis).
- "Some goods change hands here without a licence or a duty paid." (the existing words, now also under a crime wave):
  r2r-village-10 (village), r2r-town-18 (town), r2r-town-22.
- "Theft is rising even under the curfew, and the greater danger is informers and occupation officials; the resistance
  works out of sight.": r2r-thorp-1 (thorp, an occupation), r2s-occupied-town-3, r2s-occupied-metropolis-0 (metropolis).
- "Ask who runs crime here and the answer depends on the street: rival gangs dispute the turf, and whoever holds a street
  lives on the protection money it pays and on any official it can buy.": r2s-wartime-city-2 (city, a war), r2r-metropolis-0
  (metropolis), r2s-recently_betrayed-metropolis-3.
- "Timber is short this season, and the builders are bidding against each other for what is left in the yards.":
  r2r-town-34 (town), r2r-city-53 (city), r2r-metropolis-2 (metropolis); r2s-insurgency-city-3 (the rafts' slot).

## The declared moves (field diff by family on the 720, base 7a4b48a84 -> tip; births of the census's 720 in both trees)
66 towns move: `economicState.safetyProfile.economicDragDesc` 37 (C22802); `economicViability.plotHooks[].hook` 20 (C48585:
19 carts, 1 rafts, every one beside no timber import); `economicState.safetyProfile.safetyDesc` 15 (C17459 9, C31257 6). No
other leaf moves; no draw moves (every cure is a twin in the slot that drew; the fork register's draws are unmoved). The
T28b cure is display only (the Defense tab's crime structure note; no record leaf).

## THE 525
97 of the 525 reference configurations move against 52f0a1684 (the branch's cures): the predecessor's 36 (`economicState`;
reproduced exactly at 7a4b48a84) and mine 61 (`economicState` 60, `economicViability` 1). Hashed per configuration at the
three trees through the golden's own corpus and hash (`tests/helpers/goldenMasterCorpus.js`, `JSON.stringify` of the record),
families by top-level key.

## Guard
`tests/domain/bar3Defecon2Lines.test.js` (6 NOT pairs under a crime wave, each anchored on the twin that prints instead; 3
KEEP pairs with no crime wave; the T28b NOT arm on two towns, the key held organized; a KEEP arm of a drawn one-ring
vantage): green at the tip; shown able to red by a plant not committed (the two settles disabled: both NOT arms red, both
KEEP arms green). The three corpus walkers (`negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`) name no line
of it (their reds name the base's own `bar2*`, `settlementOriginProse` and dormancy-fence files). Manifest entry owed: none
(not under `tests/generators`). Roster row owed: none (no goods module imported).

## THE BOOKS (amendments 2, 10, 11), each run ALONE through `sh scripts/gate-tail.sh`, at my tip and, where red, at 7a4b48a84 and 52f0a1684
Gates: eslint on the touched files 0; the strict-domain gate 0 (1113, ceiling 1113); the type ratchet 0 (167, ceiling 167).
Item 1's six, after the key (each alone at my tree): `sourceCitationIntegrity` GREEN (the assembly line's citations hold:
no line moved); `writerReach` GREEN (the predecessor's feared stale reach row does not read stale: nothing NAMED);
`generationForkRegistry.contract` GREEN; `proseWiringCensus` RED, 2 arms ("the committed census is byte-identical to a fresh
build, and the stamp is live": stale-bytes), RED IDENTICALLY AT 7a4b48a84, GREEN at 52f0a1684: THE PREDECESSOR'S
(its declared twins enter the wiring census): a stored figure (the committed census JSON) moved by a declared cure: NAMED,
not re-taken; `generationForkCensus` RED, 2 arms: A1 (golden-derived, red at 7a4b48a84 too, amendment 10) and THE FORK
REGISTER'S TALLIES, MOVED BY MY LATE RE-READ (NAMED, not re-taken): `generateEconomy|economicState.onRecord.same` 52 -> 49,
`.onRecord.transformed` 11 -> 14, and the same two for `economyReconcilePass` (`onRecord` and `producedOnRecord`): three
of the register's 63 configurations now have their economic state transformed at assembly (the crime wave's twins);
`pipelinePinnedMode` RED, 3 arms (A1 the null change, EM-B2a2 A2 the lift, EM-R1b A5): every one a golden-corpus arm
(amendment 10: red at the base on purpose; my cures move 61 of the 525 besides): no NEW arm red.
THE PREDECESSOR'S OWED SUITES (each alone at my tree; my tree holds its cures): `observedShapeReaders` GREEN, `writerReach`
GREEN, `proseComposed` GREEN, `proseEntryContradiction` GREEN, `proseWiringCensus` (above), `engineCoreLazyEdge` GREEN (the
`criminalStructureKey.js` import reds no lazy edge; nor does my `crimeSignal.js :: gangHousesOf` import in
`defenseDisplay.js`), `tuningRegister` GREEN, `chainPrintSites` GREEN (no `dist/` in the tree), `presumedThings` RED, 1 arm:
its fresh hits are EXACTLY the predecessor's five already named for the close (foodBalance `siege`, safetyLineTruth
`armedForce`, safetyProfile `temple`/`clergy`/`walls`): none of mine.
THE OTHER LAW SUITES (amendment 2): `defenceFactReaders`, `ruinFilterRoster`, `factLayers`, `layerBoundaries`,
`noLegacyFactionReaders`, `siteCoherenceRatchet` GREEN. The three corpus walkers RED as at the base (they name the base's
`bar2Places2Rows`, `bar2People3Funding`, `bar2CorpusGuards`, `settlementOriginProse` and two dormancy-fence files): none
names my guard.
`defenseWordsFindings` (a file that pins the defence lines): RED, 2 arms, IDENTICALLY AT 7a4b48a84: BAR3-CORPUS's C6, not mine.

AT THE FINAL TIP (08859baf5's tree, the chair's 21:02 word): `node scripts/wiring-census.mjs --dry` reads STALE with
`sections that would move: stamp`, ROWS that would move 0, bytes 2,635,207 committed and fresh (delta 0), no stamped sha
moving; IDENTICAL at 7a4b48a84; CURRENT at 52f0a1684: the predecessor's (the stamp section only), my batches move nothing
there. `generationForkCensus` at the final tip: the same four tallies as batch 1 (above), A1 as at the base: batch 2 moves
no tally.
THE BOOKS MY CURES MOVE (named, not re-taken): the 525 (61 mine; 97 the branch's against 52f0a1684); the fork register's
four tallies (above); `tradeListWriters` F2's row for `economicState.js` (8 -> 9, batch 2); the predecessor's: the wiring census's committed JSON (`proseWiringCensus` car 0) and the presumed
things' five fresh hits.
THE FILES THAT PIN A SYMBOL I CHANGED (`settleCrimeLinesToSignal`, `deriveCriminalStructure` and the ring notes,
`OUTLOOK_HOOK_SIBLINGS` / `TIMBER_RAFT_HOOK` / `deriveSupplyRiskAnalysis`, and the changed lines' words: 32 files, each
alone): GREEN but `defenseWordsFindings` (above: not mine) and ONE REGRESSION OF MINE, CURED AT ITS CAUSE:
`tests/generators/outlookHooksResolved.test.js` (2 arms red: "a coastal port keeps the shipbuilding line", and its plains
sibling): its fixture town must import timber (`mustImport: ['timber']`) but its record held no import list, the very state
the cure reads; the fixture's record now lists the import it presumes (`economicState.primaryImports: ['Timber']`, a dated
note); the arms are unchanged: 8 of 8 green. FOR THE CHAIR'S VETO.

## Batch 2 (the chair's word, 21:27 UTC): a good brought in as a shortage is not also exported
| row | state | false / printing (720) | cure |
|---|---|---|---|
| the wide read's dates header flag (bar0-city-wartime-rand-12: "Dates and fruit" exported while "Dates and desert produce (local orchards unproductive)" is imported) | a depleted ground's shortage import names a good an export names (its lead words, whole) | 2 of the 720 (r2r-city-39, r2s-famine-city-1) and the read town | `economicState.js :: dropExportsImportedShort`, called on the existing line 800 (no line moved); the chain's card keeps its output |
DECLARED MOVE: 2 towns move, `economicState.primaryExports[]` only (births of the 720, batch 1 -> batch 2); no draw; the
economic complexity (which counts exports) moves in neither. In the read town the export list loses "Dates and fruit" and
nothing else. No new line prints (a good leaves a list): nothing for the veto list but the rule itself.
Guard: `bar3Defecon2Lines.test.js`'s dates arm (r2r-city-39; red by a plant, the rule's call disabled; the chain card's
dates kept). BOOK MOVED, NAMED, NOT RE-TAKEN: `tests/lint/tradeListWriters.walker.test.js`'s F2 arm "a classed file holds no
more writer lines than its row": `src/generators/economy/economicState.js` 8 -> 9 (the rule's one splice line, a TAKES_AWAY
writer: it adds no good); its door re-classes the row.
NOT TAKEN (the chair's "no further rows", 21:27): the corpus seat's C47622 (MODERATE_GAP_TWIN's "cannot pay in coin" beside a
STRONG economic survival, 3 of 78 by its count): not measured by me; left, in order, below.

## Item 0: what my predecessor owed
- Its eight law suites not run: run above (each alone at my tree, which holds its cures): all GREEN but `proseWiringCensus`
  (its stored figure, NAMED) and `presumedThings` (its five fresh hits, as it named them).
- Its inventory diff, RE-MADE BY ME (its `before` at 8b45191a5 re-rendered; its tip 7a4b48a84), read whole: 30,017 -> 30,008
  sentences; gone 15, new 6, fewer 10, more 3, moved 0. Every cured row fell by exactly its measure (the stores note 31 -> 0;
  the quarrel 72 -> 54; the gates 20 -> 12; the monster drill 13 -> 5; the few-ways 8 -> 0; no-dominant 29 -> 28; the
  theocratic note and its siblings gone or fewer: "Whoever controls trade and tithes…" 16 -> 1, "A merchant arriving … the
  religious house has the last word" 5 -> 1). The inheritors are its six twins and two knock-ons:
  (a) THE "Patron deity" / premium religion block 717 -> 716 the predecessor's run saw DOES NOT REPRODUCE in my two runs (no
  such sentence among the fewer): a render flake of that run, not a cure's move.
  (b) "Its Underground network works below its streets…" -> "<the town>'s Underground network…" in r2s-insurgency-city-1 and
  r2s-slave_revolt-metropolis-3: TRUE. Read in both dumps: "Its" leaned on the theocratic sentence before it on the same
  line ("The clergy have more say over Qaracaravansarai's market…"; "A merchant arriving at Anoarion soon learns…"); with
  that sentence gone (the flag false there by the record), the Underground line leads and names its town. The same house,
  the same fact: nothing to narrow.

## My batches' inventory diff (the census's 720 rendered at 7a4b48a84 and at my final tip 08859baf5), read whole
30,008 -> 30,012 sentences: gone 0, new 4, fewer 9, more 0, moved 0. Every cured line fell by exactly its measure where the
page prints it: "Crime exists but is well-managed." 33 -> 24 (9); "Thieves are scarce now; …" 28 -> 22 (6); "It is noticed,
and so far it does little harm." 52 -> 34 (18: the record holds the line in 136 towns and the page prints it in 52; every
crime-wave town among the 52 lost it, none other); the timber carts 30 -> 11 (19), the rafts 16 -> 15 (1); the one-ring
vantages 6 towns in all ("Shopkeepers here pay one ring…" and its sibling sentence 24 -> 20; "Ask who runs crime here and
the answer is one ring." and its sibling 26 -> 24). No other sentence moved. THE INHERITORS are my four twins only: "Timber
is short this season…" + 20 (e.g. r2r-city-53), "Crime is on the rise." + 9 (e.g. r2r-city-21), "Theft is rising even under
the curfew…" + 6 (e.g. r2r-thorp-1), "Ask who runs crime here and the answer depends on the street…" + 6 (e.g.
r2r-metropolis-0): each read true where it prints by the measures above. The dates rule moves no sentence (an export list's
entry).

## Registrations owed
None: no new test file under `tests/generators` (my guard is `tests/domain/bar3Defecon2Lines.test.js`); no new import of a
goods module; no new module.

## What is left, IN ORDER
1. C47622 (named to me by the chair at 21:04, then "no further rows" at 21:27): MODERATE_GAP_TWIN's "…at a price the
   settlement cannot pay in coin." beside a STRONG economic survival: measure on the 720, then a twin that reads the
   survival band or the purse.
(T28b: the chair's word at 21:27 holds my reading; do not widen it. The dates: cured, batch 2.)

## Instruments (scratchpad; each a few lines; re-made from the probes)
- The census: `census3.sh <tree> <out> <workers> --count-only` from `lane/census-3-2026-11-14`'s probes, git-archived out;
  `inventory.py` / `inventory_diff.py` from the chair's READ-ALL probes; births alone: `births.mjs` (TREE, OUT, SEEDS).
- The measures: `cw.mjs` (the crime-wave lines), `ring2.mjs` (the gang count among organized towns), `depl.mjs` (a depleted
  ground's commodity; a shortage import beside an export), `hired.mjs` (the hired blades against the page), `timber.mjs`,
  `c6c.mjs` (the complete chain against the chain model), `fdiff.mjs <a.gz> <b.gz>` (the field diff by family), `g525.mjs` /
  `g525cmp.mjs` (the 525's hashes and families, `TREE= OUTF=`), `runall.sh <tree> <label> <files>` (each file alone).
