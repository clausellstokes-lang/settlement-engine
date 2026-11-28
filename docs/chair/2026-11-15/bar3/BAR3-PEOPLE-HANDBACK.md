# BAR3-PEOPLE · hand-back (groups POWERS and TIES; REVIEW-BAR-3 and the wide read)

Base: the joined line at 59185b62a (read back from origin: the tip was 59185b62a); 52f0a1684 merged at the chair's word (1e33478e6), the second tree since. Branch `lane/bar3-people-2026-11-15`.
Worked in two scratch worktrees (tip; a detached 59185b62a), one `npm ci`, the base's `node_modules` a symlink.

## The directions I worked to (BRIEF-BAR3, section BAR3-PEOPLE; each measured first)

- (P1) A secret or a tie the record contradicts (the siege's cut; the famine's failed source; the debt's direction; the holder's seat): admitted by the record's fact, or a twin.
- (P2) "Holds the title; the decisions that matter are made by <power>." naming a power the page says does not decide: measure the other states as PP2 did the occupation's.
- (P3) A power's line against its own strength or its relation ("primary power centre" for a Minor power; "Undermanned and underfunded" for a reinforced garrison; a bargain beside an open conflict; trade-and-tithes under a Strong seat; "<N> member").
- (P4) "Military/Guard" as a power's name in a sentence: the sentence name from the one leaf.
- (P5) A vote or a seat given to a person who holds none: admitted by the roster's seats.

## Batch 1 · TIES: the tie lines (`src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS`) and the coaching-inn keeper's secrets

Rows (by id; ties counted on the record, towns by the inventory diff of the census at 59185b62a against the census at the tip):
- CURED, P5 "a vote is cast only from a seat": C36622 (old_debt t3, "asked <r> for a vote": towns 255 -> 236; 40 ties whose voter holds no membership take the twin), C27108 (mutual_leverage d7, "vote together": 239 -> 152; 172 ties of a pair with no power in common), C46504 (wary_alliance t5, "voted against": 213 -> 126; 139 ties). THE CLASS, cured with them: mutual_leverage d4 "controls a vote" (240 -> 225; 31 ties), mutual_leverage t5 "The vote ... comes up next week" (231 -> 222; 26 ties), old_debt d5 "has voted with ... ever since" (261 -> 160; 163 ties). Each line declares whose vote (`votes: 'r'` or `'both'`) and a `twin`; the twin is written where the roster seats no such card (`sharedPower.js :: sharesPower`, the one home). THE DRAW IS NOT MOVED (text only: the index and the tension beside it stand). After: 0 ties print a vote from no seat.
- CURED, C22325 (mentor_legacy d3 "taught them the trade": 295 -> 37) and its class d4 ("learned the work ... seven years", 303 -> 38) and d6 ("uses <r>'s methods", 295 -> 37): declared `sharedTrade` (BAR2-PEOPLE-2's form) with twins; 308, 324 and 322 ties of a pair that shares no trade take them.
- CURED, P1 C31676 and C44190 (old_debt t7 "has fallen on hard times ... the only asset": the creditor may be the monarch or the governor): reworded to claim no ruin (331 -> 0; its new line in 331).
- CURED, C13310 (mutual_leverage t3, the second favour beside "never more than one favour ahead"): the break said ("which would put <r> two favours ahead"): 309 -> 0. C25432 (wary_alliance d1 "warm and public"): "courteous": 253 -> 0.
- CURED, P1 under a siege (C4099, C0062; the read towns only: on the 720 no siege town prints them, 0 false): econ_crim_blur d6 (the carts on the roads), d3 (the import papers and the customs house) and t2 ("The seasons keep being profitable") declare `crisis: under_siege`. C21976 (the coaching-inn keeper's "coaches ... when they leave": 33 -> 32, the one siege town) and its sibling "Changes tired horses ... travellers" (26 -> 23, three siege towns) declare it in `TITLE_LINE_DECLARATIONS`; the inn's third secret (a guest who never signs the book) stands under a siege and inherits (+4).
- THE INHERITORS READ: the twenty widest are the twins above, true where they print by construction (the rule that writes them), and one more: "A handful of things about this <tier> cannot all be true at once" (+94 metropolis, +73 city): MY REGRESSION, traced: the coherence receipt's tier-noun battery read the mentor twin's first wording "taught them the town" in a metropolis; the twin now says "the customs" (cured before the commit; the census after was taken with the first wording, and with "had a notary write it down" in the old_debt line, reworded to "written down before witnesses" because `notary` is a presumed thing: both re-measured by the guard and by `presumed-things-door --check`, which is the base's own three fresh and three stale rows, no rise).
- THE GUARD: `tests/generators/bar3PeopleTies.test.js` (7 refused pairs, each with what prints instead, red at 59185b62a: 8 of 12 failed there, the 4 KEEP green; 12 of 12 green at the tip; a plant (the C36622 line's `votes` taken off) reds it).
- THE GATES: eslint on the touched files 0; `typecheck:domain:strict` 0; `typecheck:ratchet` 0; `presumed-things-door --check` the same as the base's; the twelve-birth grid 0 falls at both trees.
- A DECLARED MOVE: the record's `relationships[].description|tension` text (the twins; no index moves) and `generationCoherenceReceipt` (none once the tier-noun is cured; to be confirmed by the next census).
- STRUCK: none of batch 1.

## Batch 2 · POWERS P2 (`src/domain/dossier/powerStrata.js :: crisisNoteFor`), and the books' first reading

- CURED, P2 C5598 and C7553 ("Holds the title; the decisions that matter are made by <power>."): at 59185b62a it prints in 91 of the 720; in 67 of them the record holds a relation row of the governing power and the named power that says otherwise ("tense": "the two do not agree on who decides"; "competitive": "taxes are bargained over, not ordered"; "dependent": "each props up the other"). BAR2-PEOPLE's PP2 test (`relationNamesDecider`) is widened to ANY relation row of the pair: the relation line is the pair's one home and the note claims no decider beside it (the rest of the note stands; where the claim was the whole note, the note is silent by design). Page only: no record moves.
- THE GUARD: `tests/generators/bar3PeoplePowers.test.js` (r2r-village-1, -9, -41 refused, each asserting the note that prints instead; KEEP r2r-thorp-25, r2r-town-5): 3 of 5 red at 52f0a1684, 5 of 5 green at the tip. Eslint on the touched files 0.
- THE AFTER CENSUS IS OWED: the container restarted at 20:05 UTC mid-render (359 of 720 dumps) and took the census and the books run with it. The measure stands on the record (67 towns by the relation rows); the inventory diff for batch 2 (and the confirmation that batch 1's two late rewordings, "the customs" and "before witnesses", leave the tier-noun battery and the presumed things where the base has them) is the successor's first act: `census3.sh <tip> <out> 4 --count-only`, `inventory.py`, `inventory_diff.py after1.json after2.json` (after1 is not kept: diff against a fresh base run at 52f0a1684).
- THE CHAIR'S THREE CORPUS WALKERS (negativeAssertionAnchor, seedLoopTotality, proseDrawnAnchors), run alone at the tip: each red, and each red the same at 52f0a1684 for the last round's files (`bar2Places2Rows`, `bar2People3Funding`, `bar2CorpusGuards`): neither of my two test files is among their offenders.
- THE BOOKS, PARTIAL (the restart cut the run at its 19th of 42 files; each run alone at the tip): green: every law suite reached before the cut but these four. `tests/generators/generationForkCensus.test.js` and `tests/generators/pipelinePinnedMode.test.js`: red on purpose at the base (the chair's list of golden-derived files): the base's. `tests/data/colourMarks4h.test.js`: MY REGRESSION OF A LAW, cured: the two siege-declared econ_crim_blur rows (desc#6 the carts, tension#2 the seasons) had kept `colour: true` beside `excludes`, and a colour line declares nothing else (R-AO, `factVocabulary.js :: isColourLine`): the mark is taken off both; the arm now reds only on the ledger's stored colour rows for those two ids (named below). `tests/generators/power/bar2PeoplePowers.test.js`: its KEEP pair r2r-village-28 was a line my P2 cure refuses (village-28 holds a "tense" relation row of the pair): RE-KEYED BY IDENTITY beside a dated note to the same sibling in a town with no relation row (r2r-thorp-25); 11 of 11 green. NOT RUN (owed, in this order): the rest of `runs/books.final` (the law suites from `tests/lint/proseComposed.walker` on, the tie pinning tests `tests/generators/tie*.test.js`, `tests/generators/people/*`, `tests/lint/hookThemeTotality.walker.test.js`, `tests/domain/roles/roleClass.test.js`, `tests/generators/blocLineSharedPower.test.js`), each alone at the tip and, if red, alone at 52f0a1684.
- THE 525 REFERENCE CONFIGURATIONS: NOT COUNTED (owed). Batch 1 moves `relationships[].description|tension` text wherever a twin, a reword or a siege refusal writes; batch 2 moves no record.

## EVERY NEW OR CHANGED LINE (the owner's veto list)

Every line read in the towns the census names for it (the smallest and the largest size; a siege among them where it prints there):
- "<s> has asked <r> for a favour against <r>'s own interests. It is the first payment <s> has asked for." (r2r-city-2; 38 towns)
- "<r> and <s> take opposite sides of most questions and stand together on the few that touch their shared interests." (r2r-city-0; 147 towns)
- "<s> spoke against <r> on a small matter last week. <r> is waiting to see whether it was small." (r2r-city-1; 114)
- "<s> kept <r>'s name out of a scandal that ruined two others. <r> has taken <s>'s side ever since." (r2s-insurgency-city-1; 141)
- "<r> has the ear of people whose votes <s> needs, and <s> controls a supply <r> needs. Their meetings are short and their bargains hold." (r2r-city-24; 31)
- "The favour <s> needs from <r> comes due next week, and <r> has named a new price." (r2r-city-36; 26)
- "<r> took <s> under their wing early and taught them the customs, the clients, and the names worth knowing." (r2r-city-1, r2r-hamlet-14; 268)
- "<s> spent seven years at <r>'s side. Half of the people <s> deals with first came through <r>'s door." (r2r-city-1; 277)
- "<s> still keeps <r>'s hours and <r>'s ledger format. Everyone who deals with <s> recognises the teacher." (r2r-city-11; 272)
- "<s> has begun to count the debt <r> owes among <s>'s assets, and has had it written down before witnesses." (r2r-city-0, r2r-hamlet-3; 331)
- "<r> has asked <s> for a second favour before repaying the first, which would put <r> two favours ahead." (r2r-city-1, r2r-thorp-0; 309)
- "... The friendship is courteous, and it lasts only while that reckoning holds." (r2r-city-0, r2r-hamlet-12; 253)
- (declarations, no new text) the three econ_crim_blur lines and the two coaching-inn secrets refused under a siege.

## THE BOOKS MY CURES MOVE (named; NOT re-taken)

| test | arm | old | new | door | batch |
|---|---|---|---|---|---|
| `tests/data/colourMarks4h.test.js` | "the tie prose: every colour variant is `{ line, colour: true }`" | the ledger `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json` rows `econ_crim_blur.desc#6` and `econ_crim_blur.tension#2` `colour: true` | the live rows are declared lines (`excludes: ['crisis: under_siege']`), no colour | the declarations ledger's door | 1 |
| `tests/property/generatorGoldenMaster.test.js` and the golden-derived files | the records | (red at the base on purpose) | batch 1's tie text moves | the close's doors, the owner's word | 1 |


## The chair's grants copied

- PG1 (19:53, vetoable): `src/generators/npcGenerator.js` is mine for C35097 only (the debt's direction in a secret reads the one debt the tie states); a declared move if the record moves; its draw not moved. WIDENED (20:14) to the crisis secret's `{faction}` filler (P4, C5844 "decisions taken by Military/Guard"): the slot takes the power's sentence name from `powerSentenceName.js`. NEITHER DONE.
- REGISTRATIONS OWED, NAMED AND NOT MADE: MANIFEST ENTRY OWED (`scripts/mutation-coverage-manifest.json`) for `tests/generators/bar3PeopleTies.test.js` (kills a removed `votes`/`sharedTrade` declaration or twin in `npcData.js :: closureFor`, a lost siege `excludes`) and `tests/generators/bar3PeoplePowers.test.js` (kills a narrowed pair test in `powerStrata.js :: relationNamesDecider`). ROSTER ROW OWED: none (no goods module imported; batch 1's one new import is `domain/facts/sharedPower.js` into `src/data/npcData.js`).

## Rows named for other seats

- P5's third clause ("No office, no title, no vote.") is `src/data/institutionDescVariants.js`'s: BAR3-PLACES's (the chair, 20:08): struck from this list.

- (now mine under PG1, not done) C35097 (old_debt d4 "<r> owes <s> a large sum" against <s>'s secret "Owes <r> a debt ..."): THE SECRET'S WRITER IS `src/generators/npcGenerator.js :: generateCrimeLevel` (CRIME_KNOWLEDGE row 3, its `otherNpc` drawn at random), not a file of mine: for its seat: the row needs the pair's debt direction (the town's ties) at that draw, or the secret's `otherNpc` refused where a tie of that pair says the debt runs the other way. Not cured.

## What is left, IN ORDER (for a successor: read this and nothing else)

1. THE AFTER CENSUS OF BATCH 2 AND THE REST OF THE BOOKS (above, "owed"), and the 525 count, at the tip against 52f0a1684.
2. C35097 and P4's C5844 under PG1 (`npcGenerator.js`: the secret's debt direction; the crisis secret's `{faction}` filler through `powerSentenceName.js`).
3. (P6, from BAR3-LABELS and BAR3-SERVICES) C35020 and C33899 "Dairyman" for a woman: `src/data/faceHonorifics.js`'s personal honorifics that name a sex take the holder's form or a neutral word (as `src/data/holderTitleForms.js` gives the face's); "Dairy Farmer" is true of either sex. Measure on the 720 first. An OFFICE's title (`officeTitles.js`: Lord Mayor, Lord Marshal) is the office's (M-1b): C7390 and C47468 are STRUCK.
4. (P7) C7806, C7914 "Flaw: corrupt" beside "Temperament: incorruptible/honest" on one card: the flaw's pool admits by the temperament; the number of draws not moved; measure the 720's pairs first.
5. (P3) `stressFactions.js` "Wartime has transformed this power ... into a primary power centre" (C9941, 13 towns) for a Minor power; `rulingStructure.js` "Undermanned and underfunded" (C11669, 34) for a reinforced, paid garrison under war; `factionStanding.js` C14176 and C45570; `factionDynamics.js` C21481, C51168 (a bargain beside an open conflict of the same pair); `governanceNarrative.js` C27440 ("The merchants have stopped attending" beside "subordinate, stable"), C36418 ("The last harvest failed badly" where the failed source is the fish); `governanceAccount.js` C31100 (the hall bargains with an occupier). The stressFactions and rulingStructure texts are registered presumed things (rows keyed by text): a reword moves register rows (amendment 3's door).
6. (P5 rest) `rulingStructure.js` C5398 "elected aldermen" under a theocracy; `powerSiblings.js` C34874 (a grazing dispute where QUARRELS is none).
7. THE SET-APART HOOKS (amendment 5: 3 bar rows and 14 wide rows): not read this round.

## How the instruments are re-made

- THE CENSUS: `git archive` `docs/chair/2026-11-14/probes/CENSUS-3` out of `origin/lane/census-3-2026-11-14` and `docs/chair/2026-11-14/probes/READ-ALL/{inventory,inventory_diff}.py` out of `origin/lane/chair-2026-11-08` into a scratch directory; `sh census3.sh <tree> <out> 4 --count-only` (the before at the base tree, the after at the tip tree; about 25 minutes each, two at once fit in memory but a third process is killed); `inventory.py <out> <inv.json>`; `inventory_diff.py before.json after.json <rows.json>`.
- THE ROW MEASURE (by record, not by render): a short script over `corpus.ndjson.gz` (scratch, not committed: re-write it from this description): per tie line, the printings and the printings the record makes false (the voter's seat: any membership; the pair's power in common; the pair's trade: one house family or one category not `other`; the siege: `stress[].type === 'under_siege'`). A tie's `r` is its `from` card unless its `proseVariant` is `REVERSED_TIE` (65536) or more.
