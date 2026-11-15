# BAR3-PEOPLE · hand-back (groups POWERS and TIES; REVIEW-BAR-3 and the wide read)

Base: the joined line at 59185b62a (read back from origin: the tip was 59185b62a). Branch `lane/bar3-people-2026-11-15`.
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

## THE (filled after the books are run: below) MY CURES MOVE (named; NOT re-taken)

(filled after the books are run: below)

## Rows named for other seats

- C35097 (old_debt d4 "<r> owes <s> a large sum" against <s>'s secret "Owes <r> a debt ..."): THE SECRET'S WRITER IS `src/generators/npcGenerator.js :: generateCrimeLevel` (CRIME_KNOWLEDGE row 3, its `otherNpc` drawn at random), not a file of mine: for its seat: the row needs the pair's debt direction (the town's ties) at that draw, or the secret's `otherNpc` refused where a tie of that pair says the debt runs the other way. Not cured.

## What is left, IN ORDER (for a successor: read this and nothing else)

1. (P2, MEASURED, NOT CURED) `src/domain/dossier/powerStrata.js :: crisisNoteFor` "Holds the title; the decisions that matter are made by <power>." (C5598, C7553): prints in 91 of the 720; in 67 of them the record holds a relation row of the same pair that says otherwise ("tense": "the two do not agree on who decides"; "competitive": "taxes are bargained over, not ordered"; "dependent": "each props up the other"). THE CURE (page only, no record move): generalise BAR2-PEOPLE's PP2 `relationNamesDecider` to ANY relation row of the governing power and the decider: the relation line is the pair's one home and the note is then silent (67 towns lose a false line; the fracture reading stands, no slot mute). Guard on births: r2r-village-1, -9, -41 (red), a no-relation town (KEEP).
2. (P3) `stressFactions.js` "Wartime has transformed this power ... into a primary power centre" (C9941, 13 towns) for a Minor power; `rulingStructure.js` "Undermanned and underfunded" (C11669, 34) for a reinforced, paid garrison under war; `factionStanding.js` C14176 and C45570; `factionDynamics.js` C21481, C51168 (a bargain beside an open conflict of the same pair); `governanceNarrative.js` C27440 ("The merchants have stopped attending" beside "subordinate, stable"), C36418 ("The last harvest failed badly" where the failed source is the fish); `governanceAccount.js` C31100 (the hall bargains with an occupier). The stressFactions and rulingStructure texts are registered presumed things (rows keyed by text): a reword moves register rows (amendment 3's door).
3. (P4, P5 rest) "Military/Guard" in a secret (`powerSentenceName.js`); `faceHonorifics.js` "Lord Mayor"/"Lord Marshal" for a woman (C7390, C47468); `rulingStructure.js` C5398 "elected aldermen" under a theocracy; `powerSiblings.js` C34874 (a grazing dispute where QUARRELS is none).
4. THE SET-APART HOOKS (amendment 5: 3 bar rows and 14 wide rows): not read this round.
5. C35097 (named above, for npcGenerator's seat).

## How the instruments are re-made

- THE CENSUS: `git archive` `docs/chair/2026-11-14/probes/CENSUS-3` out of `origin/lane/census-3-2026-11-14` and `docs/chair/2026-11-14/probes/READ-ALL/{inventory,inventory_diff}.py` out of `origin/lane/chair-2026-11-08` into a scratch directory; `sh census3.sh <tree> <out> 4 --count-only` (the before at the base tree, the after at the tip tree; about 25 minutes each, two at once fit in memory but a third process is killed); `inventory.py <out> <inv.json>`; `inventory_diff.py before.json after.json <rows.json>`.
- THE ROW MEASURE (by record, not by render): `measure1.py <corpus.ndjson.gz>` (kept in this hand-back's appendix below): per tie line, the printings and the printings the record makes false (the voter's seat: any membership; the pair's power in common; the pair's trade: one house family or one category not `other`; the siege: `stress[].type === 'under_siege'`). A tie's `r` is its `from` card unless its `proseVariant` is `REVERSED_TIE` (65536) or more.
