# BRIEF-BIRTH-AUDIT · the houses a town is born with and no supply for: a counted design, no cure

The chair, 2026-11-17. ONE SEAT, READ-ONLY: you measure, you prototype in scratch, you recommend. You push documents
and probe scripts only. The builders come after you, on the chair's ruling of what you hand back.

## The question

The round BAR6 made the page honest about a house whose trade has nothing to work: its card and its rows now print
"Short of wool.", "Short of clay.", "Short of iron." (`src/domain/facts/houseInputAtHand.js :: housesShortOf`, THE ONE
FACT; the marks seat's hand-back counts about 1,030 such marks in 365 towns of the census's 720). The mark is true. What
it shows is that TOWNS ARE BORN WITH HOUSES NOBODY SUPPLIES: by the chair's count at afa46d644, a house with no source
and no import of its one input stands in 372 towns of the census's 720, 154 of the fresh 300 and 167 of the 525 reference
towns (the potter 172, the vintner 148, the brickmaker 132, the commercial sawmill 81, the charcoal burner 63, the stone
quarry 45, the dairy farmer 36, the salt works 30 of the 720). A calm metropolis on a good road has a fuller "Short of
wool." while its chain card lists fulled cloth and its exports name it; a scene shows cloth drying beside weavers marked
short. Seven of the ten instances the detectors still count at the joined tree are this one thing.

The chair put the design to the owner on 2026-11-16 at 23:18 UTC with a plan unless the owner says otherwise: A RULE BY
KIND OF HOUSE: a house that BUYS AND WORKS its material may have it brought in; a house that IS THE SOURCE of its material
stands only where the land gives it; the salt works' input on a coast is modelled wrong. No answer yet: the default
stands, and the owner's word either way governs. YOUR WORK MAKES THAT RULE EXACT AND COUNTED, so that the builders'
brief can be written from it with nothing guessed.

## What you read first, and no more (your context is your budget)

1. THIS FILE.
2. On the chair's lane (`git fetch origin lane/chair-2026-11-08`):
   `docs/chair/2026-11-16/bar6/RULINGS-AFTER-SEATING.md` (the rulings of the round; BR1 is this question; IT1 is the
   lesson below); `docs/chair/2026-11-14/briefs/BRIEF-BAR6.md`, ONLY its part B2 (the seeds and the render of the 150
   towns and of the census's 720) and B5 (a declared move).
3. At your checkout: `docs/chair/2026-11-16/bar6/BAR6-MARKS-HANDBACK.md` (the maker of the short mark: what it reads,
   what it left) and `docs/chair/2026-11-16/bar6/BAR6-RECORD-HANDBACK.md` ("WHAT IS LEFT").
4. The source, as your questions need it. START HERE:
   - `src/domain/facts/houseInputAtHand.js`: `houseInputAtHand(record, chainKey, house, chain)` answers `local`, `route`,
     `imported` or `missing`; `CHAIN_INPUTS` names each input and carries a `route` flag for the few inputs "a connected
     trade route brings" (grapes, glass sand, camels); `housesShortOf(record)` is the one fact the marks read.
   - `src/data/crisisDependence.js`: `HOUSE_TRADE_INPUT` (catalogue id to the chain key of the good its trade cannot go
     on without), `INPUT_IMPORTED_AS`, `GROUNDS_WORKED_OFF_CHAIN`, the spent-ground tables.
   - `src/generators/resourceGenerator.js :: evaluateInstitutionChain` (the record's stored gaps, `resourceAnalysis.gaps[]`).
   - Where a house is DRAWN at the birth and where the record's IMPORTS are written: find them; that map is part of
     your hand-back.

## The rules of this seat

A1. YOUR BASE is the joined line `lane/join-2026-11-14` at the tip your prompt names. Your one branch is
    `lane/birth-audit-2026-11-17`. You merge nothing.
A2. YOU CHANGE NO FILE UNDER `src/` OR `tests/` ON ANY PUSHED COMMIT. A prototype lives in a scratch worktree; its diff
    goes into your documents as a patch file. Everything you push is under `docs/chair/2026-11-17/birth/`.
A3. EVERY CLAIM IS A COUNT WITH ITS SCRIPT: a probe under `docs/chair/2026-11-17/birth/probes/`, runnable from the
    repository's root at your base, its output beside it. Say the tip, the sample and the command with each figure.
    A figure you did not see a run end with is not a figure.
A4. THE CHAIR CANNOT REACH YOU INSIDE A LONG TURN. Everything you need is here. Decide inside this brief; what you
    cannot settle, name with what you measured.
A5. ALL WORK IN SCRATCH WORKTREES, never the repository's main checkout; every gate or long run to a file through
    `sh scripts/gate-tail.sh <command...>`, never a pipe. YOUR MACHINE MAY RESTART: a background run dies with it; after
    a restart read `git status` and go on. PUSH EARLY AND OFTEN.
A6. Never `--no-verify`, never a force push, never a pull request, never master, never a deploy, a hosted database or
    production credentials. A refusal by your own permission check stands.
A7. WHAT NO RULE OF YOURS MAY PROPOSE WITHOUT SAYING "THE OWNER'S": a new field on the saved town record; a change in
    `src/generators/steps/assembleSettlement.js`, `vite.config.js` or `package.json`; a house removed from the catalogue.
A8. Budget: hand back at 400,000 of your count, then push nothing more.

## What you hand back: `docs/chair/2026-11-17/birth/BIRTH-AUDIT-HANDBACK.md`

### Q1 · THE CENSUS OF THE SHORT HOUSES
Over the census's 720 and the wide read's 150 at your base (and the fresh 300 if your count allows): every house
`housesShortOf` marks. For each: its catalogue id, the input it is short of, the reader's answer, the town's tier, its
crises, and its trade route's state (connected, isolated, shut by a siege). THEN ITS CAUSE, measured and not judged:
BORN SHORT (the same house is marked in the same town's record with every crisis taken away: the birth alone made it) or
MADE BY THE CRISIS. Tables by kind of house and by cause; and the headline: in how many towns with NO crisis and a
CONNECTED road a born-short house stands, and how many towns in all. Say where your count differs from the chair's 372
and why (the chair counted a house with no source and no import; the fact also reads the route and the ground).

### Q2 · THE KIND OF EACH HOUSE
For every catalogue id the fact can mark short (the ids of `HOUSE_TRADE_INPUT`, the houses the chains of
`RESOURCE_CHAINS` name, the spent-ground houses): ONE of
  (i) BUYS AND WORKS its material (it could stand in any town a road reaches: a smith and iron, a fuller and wool);
  (ii) IS THE SOURCE of its material and stands on it (a quarry on stone, a mine on ore; say plainly for the commercial
       sawmill, the charcoal burner, the dairy farmer, the vintner, the potter and the brickmaker, which are the cases
       that decide the rule);
  (iii) other, named.
One line of reason each. The table is the owner's to veto: write it so a person who knows no code can strike a row.

### Q3 · THE MAP OF THE CODE
(a) WHERE A HOUSE IS DRAWN at the birth and what gates the draw today (terrain, resources, tier, the priority sliders,
a required list): the files and functions, and WHY a source house is drawn where the land does not give its material
(say the actual path for a stone quarry with no stone and a salt works on a coast: is the house forced by the tier, is
the resource drawn after the house, is the resource spent by a later step?).
(b) WHERE THE IMPORTS LIST IS WRITTEN and whether an input is ever added to it because a house needs it.
(c) THE READERS: the four answers of `houseInputAtHand`, the `route` flag, the stored gaps, and every place the page
prints from them.
(d) THE ORDER OF THE DRAWS. THE LESSON OF THE ROUND (ruling IT1): a cure put into the birth's own arithmetic re-drew
people and ties in 50 of the 150 towns. For each site a rule could be put at, say whether an edit there consumes a
draw, shifts a random stream, or moves nothing but its own field; prove it by generating the same seeds before and
after a no-op at that site and after your prototype.

### Q4 · THE CANDIDATE RULES, EACH PROTOTYPED IN SCRATCH AND COUNTED over the 720 and the 150
R1 · THE READER'S RULE (no draw moves). The input of a house that buys and works comes by a connected road that no
     siege shuts, as grapes do today: the house is not short where a road reaches. Count the marks left. THEN READ THE
     PAGE: with the fuller at work and no wool on the Imports list and none produced, does any line now say something
     false, or is the page only silent? (Compare how a vintner on a road reads today.)
R2 · THE IMPORT WRITTEN AT THE BIRTH (no draw moves). The same, and the input joins the record's imports where no
     local source answers it: at which step, in which stored field, in what words (the list has its own vocabulary:
     "Wool", "Iron ore", "Clay and raw materials"); how many of the 525 reference towns move, in which field families.
R3 · THE SOURCE HOUSE GATED AT ITS DRAW. A house that is the source is not drawn where the land does not give its
     material: how many towns lose a house and which; what stands in its place; HOW FAR THE RE-DRAW SPREADS (towns
     whose people, ties or names move); what it costs the reference towns.
R4 · THE SOURCE HOUSE KEPT AND READ AS WORKED OUT (no draw moves). The house stands and the page reads its ground as
     spent (the imports list already prints "Dressed stone (local quarry depleted)" and "Coal and fuel (local seams
     exhausted)"; the spent-ground tables already exist): which lines must then agree, and is that a truer town than
     one with no quarry?
R5 · THE SALT WORKS: what its input is on a coast, what the record holds, and the smallest true reading.
For each: the born-short houses left in calm towns on a connected road (THE TARGET IS NONE), the towns changed, the
stored field families moved and how many of the 525, the new lines made printable (each with three towns), and in two
plain sentences what a reader of the page would now see.

### Q5 · YOUR RECOMMENDATION
ONE rule, as a table by kind of house; the smallest set of edits that makes it (files and functions, each edit's size);
THE GUARD that holds it (a law over fixed seeds, of the form "in a town with no crisis that cuts supply and a connected
road, no house is marked short", with its counted exceptions named); the builders' seats with DISJOINT file lists and
their order; the books the cure moves (stored figures, reference files: the close's); and WHAT SHOULD NOT BE DONE, with
the count that says why. Where two rules are close, say which you would choose and what would change your mind.

### And one line to the chair at the end (150 words at most): the headline count, the rule, the seats.
