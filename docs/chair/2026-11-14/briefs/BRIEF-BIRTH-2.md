# BRIEF-BIRTH-2 · the supply rule whole: the seed picks one story for a house and its material, and every part of the page tells it

The chair, 2026-11-17. ONE BUILDER SEAT, seated when BIRTH-1 has landed. You build the owner's rule as rulings BR4 and BR5
state it, on the counts of a read-only audit (sections V and W of `docs/chair/2026-11-17/birth/BIRTH-2-COUNT.md`). NO
PERSON, TIE, NAME OR HOUSE MOVES IN ANY TOWN BY YOUR WORK: you edit no draw, the seed's choice takes no draw, and YOU
STORE NO GROUND.

## The owner's rule (the six sentences are verbatim in rulings BR3, BR4 and BR5)

The owner, last: "So what I want to establish is that you have multiple way rng to treat these situations: 1. Exhausted
resources, bought in 2. Not exhausted Resources, no buy in 3. Bought in, no resources at all past or present 4. Exhausted
resources, no buy in. And any other configuration." Before it: "Doesn't the stone quary here in and of itself stipulate
that there is stone in the ground?"; "they have the supplies because they buy it in despite the exhausted resource";
of a siege: "those failings are simply true because in normal times it would be bought in ... Rather than reworked";
"making sure they align with imports". AND, AFTER IT, of the story the chair had left out and offered as "an abandoned
works": "I like this. Infrastructure from a by gone era. It's abandoned a failed business venture, but very rare"; and of
its words: "Say abandoned or failing: a failed venture."

SO: FOR EACH HOUSE AND ITS MATERIAL THE SEED PICKS ONE STORY, AND EVERY PART OF THE PAGE TELLS THAT STORY:

| the story | the land | bought in | what the page shows, in its existing words |
|---|---|---|---|
| the owner's 2 | has it | no | the ground on the land list; the house at work |
| the owner's 1 | used up | yes | the ground under "Depleted"; the material on the imports ("Iron ore (local iron mines exhausted)"); the house at work |
| the owner's 3 | never had it | yes | no such ground; the material on the imports ("Iron ore"); the house at work |
| the owner's 4 | used up | no | the ground under "Depleted"; nothing of it on the imports; the house marked "Short of ...", idle |
| other | has it | as well | as today (a larger town that uses more than it has): nothing to build |
| other | any bought-in story, under a siege | cut off | the same story; the house reads "Curtailed by the siege."; nothing is reworked |
| other | no route even in ordinary times | impossible | only "has it" or "used up, idle" |
| THE OWNER'S FIFTH, VERY RARE | never had it | no | THE FAILED VENTURE, in one of two versions the seed picks: the house stays, marked "Abandoned: a failed venture." or "Failing: a failed venture."; no such ground on the land list, nothing of it on the imports; the mark covers its rows; ONE line says why |

THE STARTING ODDS (told to the owner as one small table, easy to change): THE GROUND USED UP AND THE TOWN CAN TRADE: bought
in 3 times in 4, not bought in 1 in 4. A SOURCE HOUSE WHERE THE LAND LIST HOLDS NO GROUND OF ITS KIND: the ground is there
3 times in 4 (the house proves it), used up 1 in 4. A HOUSE THAT USES A MATERIAL THE LAND NEVER HAD: bought in. THE
ABANDONED WORKS: ABOUT ONE TOWN IN FIFTY HAS ONE (told to the owner so), ONLY EVER ONE HOUSE IN A TOWN, never a whole trade.

THE ONE DISTINCTION (the chair's, told to the owner as vetoable). Among the houses that are the source of their material
(BIRTH-1's `SOURCE_GROUNDS`): A TAKER takes the resource from the ground itself and CANNOT BUY IN WHAT IT TAKES (the stone
quarry, the mine, the open-cast mine, the peat cutter, the woodcutter's camp, the shepherd, the fisher's landing, the
fishing community, the hunter's lodge, the wildfowler): where its ground is used up it reads WORKED OUT, whatever the town
buys. A HOUSE THAT CAN RUN ON BOUGHT-IN MATERIAL (the salt works: "Salt"; the charcoal burner: "Timber"; the dairy farmer:
"Livestock") follows its material's story like any buyer. THE SALT WORKS OFF THE COAST PROVES NO GROUND ("Salt Flats" in a
mountain or riverside hamlet reads false: the audit's W2): its salt was never there and is bought in (all 39 such salt
works of the census's 720 stand on a connected route).

## What you read first, and no more

1. THIS FILE.
2. On the chair's lane (`git fetch origin lane/chair-2026-11-08`): `docs/chair/2026-11-17/bar7/RULINGS.md`: BR2 to BR5
   ONLY; `docs/chair/2026-11-14/briefs/BRIEF-BAR7.md`: ONLY its rules R1 to R12 (they bind you as a seat of that round is
   bound, except where this file says otherwise); `docs/chair/2026-11-16/bar6/RULINGS-AFTER-SEATING.md`: EG1 (a fact the
   eager closure reads imports no module pinned lazy), AX1, PL1.
3. `git fetch origin lane/birth-audit-2026-11-17`; from its tip 4720fb92c: `docs/chair/2026-11-17/birth/BIRTH-2-COUNT.md`:
   sections 1, 3, 8, V and W ONLY (the kinds on no ground; how the record carries a cause and WHERE a write moves people;
   the pairs under a siege; the stipulation counted early and late; the round trip; the denied grounds; the card);
   `PROTOTYPE-BIRTH2.patch` (a starting point, NOT your product: it writes grounds into the saved list and carries
   environment switches: you do neither; its `keepBarren` shows the seed's own hash that takes no draw); the probes under
   `docs/chair/2026-11-17/birth/probes/` are yours to run and to extend in files of your own.
4. AT YOUR CHECKOUT: BIRTH-1's hand-back `docs/chair/2026-11-17/birth/BIRTH-1-HANDBACK.md` WHOLE (what it built in four
   of your files; its guard and counted exceptions; item 3's table of what the full rule would have marked; item 4's
   contract of the gap line; item 6's pairs; every word the birth wrote and in how many towns; what it left for you by
   name; its re-keys, the smelter's KEEP on a constructed record among them: re-key that one to a born town if your
   fourth story gives one). ITS BIRTH WRITES NOTHING UNDER A SIEGE (`importsBroughtAtBirth` returns at once there): the
   houses that leaves "Short of ..." with no cause in besieged towns are yours to count first and to end (item 4).

## Your base, your branch, your files

YOUR BASE is the joined line at the tip your prompt names (it holds BIRTH-1; your prompt says whether it also holds the
round BAR7's economy seat). Your one branch is
`lane/birth-2-2026-11-17`. You merge nothing.
YOUR FILES: `src/domain/facts/houseKinds.js` (BIRTH-1's leaf: the takers, the three that run on bought-in material, the
ground each source house implies, THE ODDS; it stays import-free); `src/domain/facts/supplyStory.js` (NEW: the ONE reading
of a town's grounds and of each material's story; EG1 binds it); `src/domain/facts/houseInputAtHand.js`;
`src/generators/resourceGenerator.js`; `src/domain/display/validationOnPage.js` (the gap lines only);
`src/components/new/tabs/ResourcesTab.jsx` (the Nearby Resources section; item 8's card); your guard
`tests/domain/supplyStoryLaw.test.js` (NEW); BIRTH-1's guard `tests/domain/birthKindsLaw.test.js` where your rule changes
its arms (re-keyed by identity with a dated note: its "no import word under a siege" arm becomes "under a siege the
bought-in house carries the siege's mark"); `tests/domain/bar6MarksLaw8.test.js`: ONLY the rows of its `LEFT` list that
item 9 cures and the one control item 3 names; `tests/generators/bar4ScenePresumption.test.js`: ONLY the way its arm
"REACHABLE (MU1)" composes a refusing town (below); and, by rule R8, any other test your cure makes untrue, re-keyed
by identity with a dated note. NOT YOURS, whatever the cure seems to need (five seats of the round BAR7 hold them):
`src/data/crisisDependence.js`, `src/domain/display/crisisStoppedRow.js`, `src/domain/display/tradeListDisplay.js`,
`src/components/new/tabs/EconomicsTab.jsx`, `src/pdf/**`, `src/domain/facts/tradeAtWork.js`, the annex and its generated
files, `src/data/institutionServices.js`, any draw (`src/generators/steps/assembleInstitutions.js`,
`src/generators/cascadeGenerator.js`, `steps/cascadePass.js`), `src/generators/steps/assembleSettlement.js`,
`src/generators/steps/generateNarratives.js`, `vite.config.js`, `package.json`. NO NEW FIELD ON THE SAVED RECORD, NO WRITE
TO `config.nearbyResources` OR ITS SIDECARS, NO NEW ATOM, AND NO NEW WORDS BUT THE TWO THE ABANDONED WORKS NEEDS (its
mark of four words and its one gap line: item 6; each vetoable): the page's existing words carry every other story (the
land list's two groups, the imports' words, the short mark, BIRTH-1's worked-out gap line).
ONE HUNK OF ANOTHER SEAT'S FILE IS YOURS IF YOUR PROMPT SAYS YOUR BASE HOLDS THE ROUND BAR7's ECONOMY SEAT:
`src/domain/display/crisisStoppedRow.js`: the mark's words for an abandoned works (item 6), and nothing else of that file.

## Red at your base by BIRTH-1's cure, and yours to mend (the join's rehearsal found it)

THE SCENE GUARD's ARM "REACHABLE (MU1): every twin of the trades at work prints where its original is drawn and the
town's state refuses it" (`tests/generators/bar4ScenePresumption.test.js`) reads ONE TWIN UNPROVED at your base:
"cloth (short): Someone walks past with a measuring cord round their neck and a bolt of cloth under one arm." The arm
makes a town refuse a good by striking it from the lists; since BIRTH-1 the makers' STORED gap says `imported`, so the
struck list no longer leaves them short. Nothing on the page is false; the arm has lost the state it composed. IT IS
NEVER NARROWED AND NO TWIN LEAVES ITS PROOF: after your cure the arm composes its refusing town through YOUR reading (a
house the story leaves idle: the fourth story, or a constructed record whose stored gap says so), and every goods
twin is proved again (the seam's scenes seat proved 23). Say the count proved at your base and at your tip.

## Your items, in this order

1. THE KINDS AND THE ODDS (`houseKinds.js`). Over `SOURCE_GROUNDS`: `TAKERS` (the ten above) and `RUNS_ON_BOUGHT` (the
   three, each with its word; each word exists on the imports list today: say where), each id with its one line of
   reason. `IMPLIED_GROUND`: the ground a source house proves where none of its own grounds is on the record, live or
   spent (stone quarry: `stone_quarry`; mine and open-cast mine: `iron_deposits`; peat cutter: `marshlands`; dairy
   farmer: `grazing_land`; charcoal burner: `managed_forest`; THE SALT WORKS: NONE). AND ONE ROW OF BIRTH-1's TABLE TO MEND:
   `SOURCE_GROUNDS.salt_works` holds `fishing_grounds`, so the page prints "The salt works is worked out: its own ground
   is depleted (Fishing grounds)." (r2s-wartime-city-1): a fishery is not a salt works' ground: on a coast the sea is its
   brine whatever the fishery's state: strike that ground from its row and let the coast rule answer it. THE SECOND RING, COUNT BEFORE YOU
   KEEP: the audit judged six more source houses "not barren" though the record names no ground of theirs (the fisher's
   landing 32 and the fishing community 15 of the 720, the woodcutter's camp 28, the hunter's lodge 24, the shepherd 22,
   the wildfowler 2): give a kind its implied ground only where one line states the choice (the landing: the sea's
   grounds on a port route or coastal terrain, the river's on a river route or riverside terrain); a kind whose ground
   you cannot choose by one line is left BY NAME. `SUPPLY_ODDS`: ONE frozen table, THE OWNER'S TO CHANGE, readable by a
   person who knows no code: `groundThere` 45 of 60; `boughtIn` 45 of 60; `abandoned`: a figure YOU calibrate over the
   census's 720 so that ABOUT ONE TOWN IN FIFTY shows an abandoned works (between 10 and 20 of the 720): say the figure
   and the count it gives.
2. THE ONE READING (`supplyStory.js`), a pure function of the record (its stored land lists, its live houses, its route,
   its seed `_seed`) and of nothing else; the birth passes the generator's seed as an argument (never a global).
   (a) THE GROUNDS OF THE TOWN: the stored live grounds; the stored spent grounds; and for each live source house on no
   ground of its own (a ruined or closed house proves nothing; a custom row proves nothing) its IMPLIED GROUND, whose
   state the seed picks BY THE GROUND (two houses of one ground share it): THERE (`groundThere` of 60) or USED UP. The
   pick is the kernel's own hash of a keyed string (`<seed>::ground::<ground key>`, as `resolveResources` keys its
   refills): IT TAKES NO DRAW. A record with no seed reads THERE. The roll table's denial does not unseat a ground (W2:
   people 0, no stored objection: a quarry on a port route proves its stone).
   (b) WHETHER A MATERIAL IS BOUGHT IN, by the material's import word (the town buys "Timber" or it does not: every
   house that uses that material shares the answer, or an import would stand beside a house short of it): YES where the
   record's imports already bring it (a fact of the record is never unsaid); else on a route connected in ordinary
   times (a siege changes nothing here): where a ground of that material is used up (stored or implied): the seed's pick
   (`<seed>::bought::<the word>`: `boughtIn` of 60); where the material was never there: YES; on an isolated route: NO.
   (c) THE STORY OF A HOUSE AND ITS MATERIAL, one of: LOCAL (a ground of it there, stored or implied, or a live local
   producer supplies it); BOUGHT (not local, and (b) says yes; a TAKER is never BOUGHT); IDLE (neither: the ground used
   up); ABANDONED ((d)).
   (d) THE ABANDONED WORKS, THE OWNER'S FIFTH STORY, VERY RARE: "never had it and buys nothing" as a CHOSEN story of ONE
   house: a venture of an earlier time that failed. THE SEED MAY PICK IT (`<seed>::abandoned::<catalogue id>`, the odds
   `abandoned`) only for (i) a house that is THE ONLY LIVE HOUSE OF ITS TOWN USING A MATERIAL THE TOWN NEVER HAD (no ground
   of it stored or implied, none on the record's imports before the birth), in place of BOUGHT; or (ii) a source house on
   no ground of its own that is the only live house of that ground, in place of its implied ground. NEVER TWO IN ONE TOWN
   (where the seed picks two, the first by catalogue id keeps it and the other follows its usual story); never a house
   whose material another live house of the town uses (a whole trade is not abandoned: several houses on one material
   buy it in as usual). For that house: no ground is implied, the town does not buy the material, the reader answers
   `missing`, and the page says ABANDONED or FAILING and not short (item 5's two forms). WHICH OF THE TWO is the seed's
   pick too (`<seed>::venture::<catalogue id>`, half and half): ABANDONED: the works stands empty; FAILING: it is still
   open and going under. Both are the one story for every rule of this file; only the words differ.
   (e) OUTSIDE THAT PICK, "NEVER HAD IT AND BUYS NOTHING" IS NEVER A STORY. It can still arise for a buyer on an isolated
   route with no ground of its material: COUNT those houses over the 720 by kind, and make the page say the owner's
   fourth story of them (the ground implied USED UP, the house idle) if the count is small and the reading of five such
   towns is sound; otherwise leave them BY NAME with the count. The salt works off the coast on an isolated route: 0 of
   the 720: name it.
3. THE READER (`houseInputAtHand.js`) answers by the story: LOCAL: `local`; BOUGHT: `imported` (the list brings it; under
   a siege the leaf's own rule prints "Curtailed by the siege."); IDLE and ABANDONED: `missing`. A TAKER whose ground is used up is
   `missing` and fed by no import: read by THE KIND'S GROUNDS AND THE GROUNDS OF THE TOWN, not by the chains the house is
   listed on (the audit's c1: six peat cutters stand on a live coal chain that hides their spent marsh; the peat cutter
   is fed today by its own bog's shortage import): you read `TAKERS` beside the dependence table's `SPENT_GROUND_WORKERS`
   and do not edit that table. BIRTH-1's narrow rule (a word bought for a buyer feeds no source house) holds for the
   takers and is LIFTED for the three that run on bought-in material. THE FISH MARKET IS A BUYER (the owner's table,
   BIRTH-1's kind (i): "it sells the catch brought to it"), though the dependence table lists it among the houses that
   work the ground: on its spent fisheries it follows its material's story like any buyer (34 fish markets of the 720
   are marked there today, 18 in calm towns on a connected route): your reader reads the kinds table for it; SAY which
   other readers still read the dependence table's list for it, and name them. (BIRTH-1's birth writes "Salted fish"
   for it at its second step while its reader still answers `missing`: an import beside a house short of the same good:
   count that pair at your base; your rule ends it.) BIRTH-1's GUARD COUNTS ITS EXCEPTIONS AS A
   RATCHET (dairy farmer 14 + 5, charcoal burner 14 + 4, salt works 8 + 1, fish market 18 + 1, the 720 and the 150):
   after you each is 0 or a taker on a used-up ground or a house the seed left idle: re-key that arm by identity.
   ONE CONTROL TO GIVE BACK ITS OWN CAUSE: BIRTH-1 moved `tests/domain/bar6MarksLaw8.test.js`'s 8a.mild control from an
   input-short house (r2r-city-0's carpenters, a Vulnerable card) to a market under an outbreak (r2r-city-19), because no
   born town bore the first any more: your fourth story bears it again: re-key that control to a house the seed left idle
   whose card's state word the leaf lifts, and keep the outbreak's case beside it. COUNT over the 720 and the 150, each apart: houses
   newly unmarked; houses newly marked and what the mark says; in calm towns on a connected route and in all.
4. THE BIRTH (`resourceGenerator.js :: importsBroughtAtBirth` and the gaps after it): the birth writes a material's word
   EXACTLY where the story says BOUGHT and the list lacks it: a used-up ground: that ground's own shortage word; never
   there: the plain word (`IMPORT_WORD`; the salt works': "Salt"). UNDER A SIEGE TOO (the owner: a siege excludes
   nothing; BIRTH-1 as landed writes nothing under a siege: its hand-back counts the houses that leaves short with no
   cause). WHERE THE STORY SAYS IDLE OR ABANDONED THE BIRTH WRITES NOTHING: those are the owner's fourth and fifth stories, by the
   seed and no longer by accident. No word twice. The stored gap of each house is written as the reader answers it.
5. THE GAP LINES (`validationOnPage.js :: resourceGapLines`). THE GAP LINE'S OWN WORDS ARE A CONTRACT TWO READERS NOT
   YOURS PARSE (BIRTH-1's hand-back, item 4: the page's mark reads the good off "No <good> reaches <the house>."; the
   record's detector `tests/helpers/houseInputSplit.js` reads the house off it; a reworded line took the marks off the
   cards): YOU NEVER REWORD THAT LINE. A cause is THE LINE AFTER IT, as BIRTH-1's worked-out line is ("The stone quarry
   is worked out: its own ground is depleted (Stone quarry)."). A house whose ground is used up, stored or implied,
   prints that worked-out line by the Depleted list's label of the ground. A house the story has at work prints no gap
   line. BIRTH-1 LEFT BY NAME the pair "No timber reaches the charcoal burner." beside the "Timber" the birth brought
   in for a buyer (48 towns of the 720: 49 burners): your rule ends it (the burner stands on its implied woodland, or
   runs on the timber the town buys): count it to 0.
   THE FAILED VENTURE'S NEW FORMS (the only new words of your seat; the owner's own words; each vetoable; name them in
   your hand-back for the owner's veto list): (i) ITS LINE AFTER THE GAP LINE (the gap line itself keeps its words), once
   for the house, on the Resources tab: ABANDONED: "The <house> stands abandoned, a venture of an earlier time: no
   <material> lies near and none is brought in."; FAILING: "The <house> is failing: no <material> lies near and none
   is brought in."; (ii) ITS MARK, on the house's card and
   rows wherever the short mark would print: "Abandoned: a failed venture." or "Failing: a failed venture." (the
   owner: "Say abandoned or failing: a failed venture."; four words each: the mark law counts a sentence at five, and
   a mark repeats on a house's rows). The mark is printed by the one leaf
   (`crisisStoppedRow.js :: rowMarkText` and `shortMarkText`): IF YOUR BASE HOLDS THE ROUND BAR7's ECONOMY SEAT, the one
   hunk there is yours: a failed venture's row takes its mark in place of "Short of ...", read from your leaf
   (`supplyStory.js`), and the tab's head line for short marks ("A row marked short is what its house makes when
   supplied.") is not printed on its account; a person's card and the PDF read the same leaf and follow. IF IT DOES
   NOT, the mark stays "Short of ..." (true of it), the gap line alone says abandoned or failing, and the mark's
   words are left BY NAME.
6. THE PAGE (`ResourcesTab.jsx`, the Nearby Resources section) prints the grounds of item 2 (a): a STORED live ground as
   today ("Abundant", or unlabelled under a siege); AN IMPLIED GROUND THAT IS THERE without the word "Abundant" (one
   quarry does not prove plenty: W2): in the unlabelled form the siege already uses, under the section's title; AN
   IMPLIED GROUND THAT IS USED UP in the "Depleted" group. COUNT the towns whose section changes.
7. THE OTHER READERS OF THE LAND LIST ON THE PAGE: list every page-side reader of `config.nearbyResources` and of
   `nearbyResourcesDepleted` (the audit's W1 names `facts/registeredWords.js`, `facts/leadingSourceSpent.js`,
   `facts/chainCarrier.js`, `display/tracePresentation.js`, `display/tradeListDisplay.js`, and 73 lines in 30 files that
   name the six ground keys). FOR EACH: does a line of the page now say something FALSE in a town with an implied ground
   (above all a line declared on the ABSENCE of a ground: "no stone to build with"; or on its PRESENCE where it is
   implied used up)? Count over the 720 with three towns each. Route through your leaf the readers that are in YOUR
   files; NAME the rest with their counts (the PDF's land list among them; the world pulse's readers of the stored list:
   say in three lines what a simulated year would do to a source house on an implied ground).
8. THE CARD (only if it is one reading): the Resource Exploitation section prints no card for an implied ground (W3). If
   the tab's stage reader can print one from the house in one reading, print THE HOUSE'S OWN STAGE ONLY (never
   `exportValue`, never `finalProducts`); otherwise leave it by name with W3's count.
9. THE HELD INPUT ITEMS, last, if your count allows (two earlier seats left them for the holder of the reader): (a) THE
   HOUSE THAT WORKS ONLY A GRAIN SURPLUS (the auditor H's 8i.surplus: the maltster's card says "Requires grain surplus.";
   it reads bare in besieged hamlets about 60% short of food: 3 towns of the 720 by `runH`, and one calm town a few per
   cent short, which you LEAVE): a house that works only a surplus is short where the page's food line is short under a
   crisis that takes the food. (b) THE FOUR HOUSES of the seam's economy seat (the apothecaries of r2r-town-51 and
   r2s-religious_conversion-town-2, the butchers of r2r-town-54 and r2r-metropolis-19: `runD`'s 8a.input read 4 · 11
   over the 720 before BIRTH-1): RE-MEASURE at your base; cure what is left in the reader (its `importsBring` reads "Herbs
   and forage" as the herbs and game as livestock) and strike the cured rows from `LEFT` in
   `tests/domain/bar6MarksLaw8.test.js` in the same commit. If the cure needs the dependence table's ids, name it.
10. THE GUARD, `tests/domain/supplyStoryLaw.test.js`, over fixed seeds of the census and of the 150 (say which and why
    they are enough). (L1) EVERY LIVE HOUSE WITH A MATERIAL TELLS ONE STORY ON EVERY SURFACE: LOCAL: a ground there (stored
    or implied) or a live local producer, and no short mark; BOUGHT: the word on the imports, and no short mark (the
    siege's mark under a siege); IDLE: the short mark, the ground under Depleted, and NO word of that material on the
    imports; ABANDONED: its mark and its gap line, no ground of its material on either group of the land list, no word of
    it on the imports. (L2) "never had it and buys nothing" ONLY as an abandoned works or as the houses item 2 (e) names;
    no town holds two abandoned works; no abandoned house shares its material with another live house.
    (L3) no import feeds a taker. (L4) THE SEED'S CHOICE: the same seed twice gives the same story; an implied ground is
    on NO stored field (the record's `config` is byte-equal with and without your rule). (L5) THE ODDS HOLD: over the
    census's 720 the bought-in share of the used-up materials on connected routes, and the there-share of the implied
    grounds, each fall within a stated band of `SUPPLY_ODDS` (say the band and why); the towns with an abandoned works number
    between 10 and 20 of the 720. Its positive control: it FAILS at
    your base. THE ROUND TRIP, AS A CASE: ten towns with an implied ground, generated again from the produced record by
    the product's own regenerate (`store/settlementRegenAction.js`: the saved config and seed) AND from that config read
    as a manual roster (`nearbyResourcesRandom: false`): each is the town it was before your rule (the audit's
    `probes/w1roundtrip.mjs` is the form).
11. THE TABLE FOR THE OWNER: HOW OFTEN EACH STORY COMES UP, over the census's 720 and the 150: houses and towns for each
    row of the table at the head of this file, by tier, and by material for the owner's four; and the same before your
    rule (BIRTH-1's tree). Plain words; a person who knows no code reads it.
12. THE PAGE AFTER YOU, READ: render twenty-eight towns across the tiers (six of the owner's fourth story in a town that
    can trade; four of the first; four of the third; two abandoned and two failing works, their keepers' cards among what
    you read;
    four with an implied ground the roll table denies; three off-coast salt works; three besieged) and READ the Resources tab, the house's card, the Economics tab's Imports, Exports and
    income rows, the Outlook, the arrival scene: does any line show an idle house at work, name an import beside a house
    short of it, export a worked-out ground's good, or say "imports nothing"? Each such pair is named in your hand-back
    with its count over the 720; you cure those in your files and leave the rest BY NAME for the round's other seats.

## Your measures, before and after

The audit's probes (`q1census.mjs`: marks by cause; `q4rules.mjs`: born-short in calm connected towns; `b2align.mjs`: the
three reverse counts: after you c1 counts NO taker fed by an import and c2, c3 stay 0; `fieldDiff.mjs`: THE PROOF THAT NO
PERSON, TIE, NAME OR HOUSE MOVES over the 720, the 150 and the 525 reference configurations: print its table) and the
chair's runners over the 150 at your base and your tip (`docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs` and `runB.mjs`,
`docs/chair/2026-11-16/bar6/AUDIT/runC.mjs` to `runF.mjs`, `docs/chair/2026-11-17/bar7/AUDIT/runH.mjs` and `runI.mjs`).
THE IDLE HOUSES ARE NOW A CHOSEN SHARE: `runH`'s rules that read a marked house against another surface (8f, 8j, 8k) will
find more of them until the round BAR7's seats have landed (they make every surface read the mark): count them by rule at
your base and your tip and say which of BAR7's seats holds each; a rule that rises for any other reason is yours. A
DECLARED MOVE: the stored families you move (imports, gaps) and how many of the 525. Births over the 720 take about half
an hour at four workers: start them in the background at once.

## Your net, your hand-back

Your net is R11's, with ONE `npm run build` and the two build tests (you add a facts leaf), AND ONE THING R11 DOES NOT
HOLD, learnt at this round's join: THE WALKERS. Run `npx vitest run tests/lint` WHOLE at your base and at your tip (about
ten minutes each at four cores; each to a file through gate-tail) and compare the failing tests BY NAME: 26 files are red
at the line today, nearly all stored figures of four rounds (the close's: `docs/chair/2026-11-17/close/WALKERS-CLASSIFIED.md`
on the chair's lane names each); EVERY TEST RED AT YOUR TIP AND NOT AT YOUR BASE IS YOURS to cure or to explain. Above
all: `ruinFilterRoster.walker` (a new reader of the raw `.institutions` roster is routed through `liveInstitutions()` or
exempted with a reason: two new leaves of this round met it at the join); `domainAnyCastBaseline` (a file born now has a
baseline of NO `any`: your new leaf); `factLayers.walker` (a leaf declares every field it reads); `negativeAssertionAnchor.walker`
and `seedLoopTotality.walker` (your guard's negatives are anchored; its seed loops collect every failure:
`tests/helpers/seedFailures.js`); the two doors' walkers (no fresh line). Stored figures are the
close's (R10). Hand-back `docs/chair/2026-11-17/birth/BIRTH-2-HANDBACK.md`: each item (done with the count before and
after and its guard, or left with the reason and what you measured); item 11's table FIRST; `fieldDiff`'s table; the
round trip's table; what a reader can newly see (each with three towns); the readers of the land list you routed and
those you named; the pairs of item 12; the books your cure moves; for the owner's veto list: the tables of item 1 as a
person who knows no code can read them. Budget: hand back at 600,000 of your count, then push nothing more. PUSH EARLY
AND OFTEN. One line to the chair at the end, 150 words at most.

## AMENDED AFTER SEATING (each sent to the seat by message; the seat was seated 2026-11-17 07:14 UTC)

- **THE SEED AT THE BIRTH (ruling BR7, sent 07:26 UTC).** The seat found before it built that the birth cannot make the
  seed's picks from its own files (the resource analysis has one caller, the narratives step, which hands it no seed).
  ITS FILE LIST GROWS BY ONE HUNK in `src/generators/steps/generateNarratives.js`: the one call of the resource analysis
  gains the pipeline's seed as an explicit seventh argument; not stamped on the config; nothing else in that file. Two
  conditions: one function reads the seed for the birth and the print (an absent seed reads as the empty string in
  both); the seat's guard holds the agreement of the two.
- **THE SCENE GUARD's ARM (sent 07:42 UTC).** A rehearsal of the round BAR7's scenes seat on the line's a55162cfa0 found
  the whole scene guard GREEN with that seat in and no edit of the guard file (the seat re-words the brought-in twin).
  SO THE ARM "REACHABLE (MU1)" IS NO LONGER THIS SEAT'S TO RE-COMPOSE FOR THE CLOTH TWIN: it leaves the arm as it is
  for that twin (red at its own tip as at its base: named in the hand-back) and touches the arm only where its own cure
  makes ANOTHER twin unproved. Before it hands back it runs, in a scratch merge of the line's tip as it then stands
  (local, never pushed), the scene guard, the round's guards and its own, and NAMES whatever goes untrue there that is
  green at the line's tip: a file in its own tree is its own by R8; a file not in its tree it names and does not edit
  (an edit would collide at the merge): the chair sends those to their seats.
