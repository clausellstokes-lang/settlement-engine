# RULING R24 (the tenth chair, 2026-11-24, on CLOSE-7's measure "READ-24", 5274979f1)

THE MEASURE IS TAKEN, read whole by the chair (`close-7/reports/READ-24.md`). THE OWNER'S WORD, verbatim: "I leave all
judgement to you" / "Fix those findings as well". EVERY ITEM BELOW IS CURED BEFORE THE FIRST DEPLOY, each cut to what
the measure shows. A cure is built on its own `lane/close-7-2026-11-24-<unit>-wip` branch CUT AT THE FLIP'S COMMIT
d447ee31e5b2836736d22778a91ce66721a6d00e (it is an ancestor of point 113, whose first phase is clean and whose whole
suite runs now; the landing request for the cures comes after my "THE LINE IS <commit>"). Red first, always.

## R24-0. THE CORPUS (your finding, and the most important one)
THE CLOSE'S 900 IS NOT WHAT A VISITOR GETS: all plains, all road, every priority 50, never Wealthy. So it could not
hold three of the five faults a reader met in ten places. FROM NOW, IN THIS LANE: every measure and every proof of a
cure is taken on BOTH corpora: C (the census 900) and V (your visitor 900, `read24/make-visitor-plan.mjs`: keep it
committed). A cure's proof says, for each: the count before, the count after (0), and what else moved.
"READ-25", A MEASURE, NO CURE: the page census's whole battery of patterns (`src/domain/coherence/
pageCensusFindings.js`, as the page census's script applies it) run over V, LIT: every pattern that fires, its count
by size, three seeds each. No door is changed and no register is touched for it. ONE MESSAGE to me. It answers: what
else has the plains-only corpus hidden?

## R24-A1. THE HEALER: CURED BY ONE READING
Three readings of "is there someone here who tends the sick" disagree (a house by its name; a service by its
category; the capacity's count). THE CURE: ONE FACT, declared in the vocabulary: SICK CARE AT HAND = a sick house by
name, OR a RESIDENT service (a house on the live roster, never an "Access to" row) that tends the sick or injured.
WHICH SERVICES TEND THE SICK IS DATA, a flag on the service's own catalogue row, never a list in a script: your thirty
names are the proposal: send me the list as it would stand (one line a name) BEFORE the build; mine to strike:
"Birth assistance" alone does not make a healer; "Burial", rites, alms, bathing and counsel never do.
EVERY LINE THAT SAYS NO HEALER STANDS HERE (H2, H3, H7, H8, H9 of `OUTSIDER_IMPRESSIONS['services.healing']`, and any
other pool your grep finds saying it) excludes that fact. Where the healing lens is strained AND sick care is at
hand, the pool must still hold a true line: if it holds none, SEND ME THREE CANDIDATES in the page's own voice (care
is here, and stretched); I rule the words. NOT IN THIS UNIT, listed in your hand-back for a later one: the capacity's
`healerCount` not counting a healing priest or a midwife (it would move the lens for hundreds of places).
PROOF: red first on the five by name (C: dp-village-103, dp-town-144, dp-city-3; V: dp-village-83,
dp-metropolis-114); the rule made a PATTERN of the page battery (a no-healer line beside resident sick care), bar
zero, on C and V.

## R24-A2. RICH AND HUNGRY: CURED AT THE FACT THE LINES READ
A line that says PEOPLE GO SHORT (small portions, thin stew, less to go round) reads the same food fact the page
prints as Food Security (`economicState.foodSecurity`), never the production band alone: a place that buys what it
does not grow, and whose own ledger reads Secure, does not go short. A line about WHERE FOOD COMES FROM (bought in,
not grown) keeps reading production and imports. Class each line of `foodCulture` and of `commonerResentments`' food
family as SAYS SHORTAGE or SAYS SOURCE (send me the two lists with the build's first line; I strike), and declare the
need on each. PROOF: red first on dp-city-83 and dp-metropolis-57 (V) and the twin of dm24-hamlet-1; a PATTERN of the
battery (a shortage line on a place whose food ledger reads Secure), bar zero, C and V; AND SAY HOW MANY PAGES' FOOD
LINES CHANGE on C and on V, and the slot's commonest-sentence share before and after (the Daily Life lane tuned it).

## R24-B1(i). THE LAND AND WHAT STANDS ON IT: CURED AT THE DRAW, ON THE TERRAIN'S OWN TABLE
28 of 52 desert places hold a fish market, a sawmill or a hunter's lodge. FIRST A SHORT MEASURE ON V (one table, one
message): for every house that lives on a thing the land gives (fish, timber, game, ore, stone, a harbour, and the
like: you name the rows from the catalogue), the count by terrain where it stands though neither the terrain, the
route nor the place's nearby resources give that thing. THEN THE CURE'S FORM, which I rule on that table: ROWS ON THE
TERRAIN'S OWN MODIFIER TABLE (`TERRAIN_DATA[terrain].institutionModifiers`) that take the house's chance to nothing
where the land gives none of it AND the place's resources give none of it; a place whose resources or route DO give
it keeps its plain chance (read how `getResourceMultiplier` combines before you propose: a zero that also kills the
resource's boost is wrong). THE CASCADE'S PATH (`applyCascadeInstitutions`) obeys the same rule. NO CATALOGUE GATE THAT
WOULD REFUSE THE ROW ON PLAINS (it would move every census birth): the roll must still be made, so that no other
house's draw shifts. PROOF: C byte-identical (the hash of the 900 births); on V, only the places of the named
terrains differ, and each only by the loss of those houses and what follows from them: say what follows.

## R24-B1(ii). THE FURROWS: CURED
Where the record says the grain is bought in and the place has no farmland, the `field` element weighs nothing in
`deriveFoundingTraditions` (it reads the same fact the grain line reads). PROOF: red first on dp-city-0 (C) and
dp-metropolis-77 (V); a pattern of the battery, bar zero. Say whether a born record moves.

## R24-C1. THE LABEL THAT TELLS: THE NAME IS CURED HERE; THE PLAYER'S PAGE IS NAMED FOR THE VEIL
THREE FORMS name, on the first screen, what belongs to the game master: "Corrupt Council" (18 towns of V), "Corrupt
City Council" (14 cities), "Shadow Senate" (7 metropolises). THE CHAIR'S WORDS: they print as "Town Council", "City
Council" and "Senate". THAT THE HALL IS BOUGHT is said where the page already speaks to the game master alone (the
block headed "Who really runs this town", "For the DM only"): there the form's own description is said, word for
word ("The governing body is systematically compromised; offices are sold and justice is purchasable."), and nowhere
that a player's page prints.
BEFORE THE BUILD, ONE MESSAGE: (a) does a clean form already carry one of the three plain names at that size (then
the two print alike, which is right: say it); (b) HOW MANY PLACES IN src/ READ THE STORED NAME TO PRINT IT
(`powerStructure.government`, `governingName`, the governing faction's `faction`): if few, the name is given by ONE
reader that every print site uses, and old saves read right with no change to their record; if many, propose the
change at birth with a marker in the record and a load-time reading for old saves; (c) every test that pins one of the
three strings. I rule on (b).
NAMED FOR THE PAUSED VEIL, NOT BUILT: whatever else the player's projection carries that says the hall is bought (the
form's description, a composed sentence). Write it into `FOR-THE-OWNER.md` section 0 beside the secret tie's item,
with its count (39 of the visitor 900).

## R24-D. THE REPEATS
D2, THE GUILD QUARREL (36% of towns, 51% of cities): its cure is the troubles rule, which is built dark on another
lane and was kept out of this deploy by the eighth chair (E28). The chair takes it up after point 113 has landed. NOT
YOURS.
D4, DAILY LIFE'S VISITOR LINES HAVE NO ROW ON THE SAMENESS DOOR (its register was taken dark, before that page): AFTER
THE CURES ABOVE, ON THE LINE'S NEW TIP: the door run lit by its own command, its report to me; a slot over the bar is
then cured by more ways to say its commonest line (the words are mine to rule). Not before.

## ORDER, AND TWO BUILDERS
TWO BUILDERS AT ONCE where their files do not touch (COMMON-EIGHTH 12 (a) and 13): CHAIN ONE: A1, then A2, then
B1(ii). CHAIN TWO: READ-25 (the measure), then B1(i)'s table, then its build. C1's message when a builder is free;
its build after my word on (b). ONE LINE to me after each unit; each diff read once by you; `tests/copy` whole after a
change under src/data or src/domain; `tests/lint` whole after any change to a test file. Then "CLOSE-7 <commit>": one
branch that holds the cures merged, for one stacked landing.

## R24c (added 20:26 UTC on 2026-11-24, on A2's table, sent by CLOSE-7 before the unit's commit)
THE TABLE (printed band by production band, on d447ee31e): two cells change under a printed Secure: secure|strained
(C 159, V 136) and secure|critical (C 38, V 32): the fare reads `adequate`, the grievance family says only F0, F6 and
F8 where a market stands, the food lens is not strained. THE FAULT WAS C 197 AND V 168: ONE PAGE IN FIVE. Taken.
- **(c) A FOURTH READER, TAKEN INTO A2:** Dawn Work's food branch ("Dawn work is the search for food…") beside a
  printed Secure: C 38, V 32, the secure|critical cell; it was on neither classed list. It reads the same one fact;
  the pattern counts it; red first on one place of each corpus.
- **(a) THE MIRROR CELLS, TAKEN INTO A2:** a plain or plentiful fare beside a printed Deficit or Famine (C 5, V 3).
  ONE RULE FOR EVERY CELL: the lines that say whether people go short read the band the page PRINTS: printed Deficit
  reads the strained fare, printed Famine the critical fare, the grievance family and the lens following; production
  alone decides only between `adequate` and `surplus` under a printed Secure, and where food comes from. A line that
  cannot be said of a place whose own fields are full: STOP on that cell, the line and three candidates to the chair.
  If the mirror needs more than the mapping it is its own small unit after A2.
- **(b) PRESSURED BESIDE A PLAIN FARE (C 13, V 88): COHERENT** (pressure is not shortage). ONE CELL NOT ACCEPTED
  UNSEEN: where the fare under a printed Pressured is `surplus`, it reads `adequate`; the split by production band is
  owed; an empty cell builds nothing.
- **THE TOTALITY ARM:** the whole list of what in `src` reads the production band or the fare's band to choose a
  line, each classed SAYS SHORTAGE, SAYS SOURCE or NEITHER, with a lint arm that reds on an unclassed reader.
- **THE PROOF, C AND V:** the pattern (with Dawn Work and the mirror) to 0; pages changed; the slot's commonest
  sentence's share before and after; whether a born record moves (the goldens then move: the owner's one signing).

## R24d (added 20:40 UTC on 2026-11-24): A CORRECTION OF R24c, AND THE WORDS
**THE CHAIR'S OWN ERROR, CORRECTED BEFORE A2's COMMIT:** R24c said "printed Deficit reads the strained fare". Too
blunt: under it the builder moved deficit|critical (C 16, V 9) DOWN to the strained lines, though critical lines beside a
printed Deficit were coherent. The chair had ruled the mapping without reading the ladder or the pools. It has now
read both (`src/data/bandLadders.js :: FOOD_SECURITY_CUTS`: pressured over 5, import-dependent over 15, deficit over
40, famine by the stress; `src/data/dailyLife/foodCulture.js`: the strained, critical and collapsed pools).
**THE RULE IN ITS RIGHT FORM: THE PRINTED BAND BOUNDS THE FARE; PRODUCTION PLACES IT WITHIN THE BOUND.** A cell inside
its bound is unchanged; a cell outside moves to the nearest branch inside.
| the page prints | the fare may read | so these cells move |
|---|---|---|
| Secure or Surplus | `surplus` (production surplus) or `adequate` | secure over strained, critical or collapsed production reads `adequate` (C 197, V 168: the fault) |
| Pressured | `adequate` or `strained` | production surplus reads `adequate` (C 5, V 13); production critical or collapsed reads `strained` (C 1, V 22) |
| Import-Dependent or Deficit | `strained` or `critical` | production adequate or surplus reads `strained` (C 1); production collapsed reads `critical` (C 1); production critical STAYS |
| Famine | `critical` or `collapsed` | every production but collapsed reads `critical` (famine over strained C 6, V 20; over adequate or surplus C 4, V 3) |
The grievance family, the visitor's lens and Dawn Work's food branch read that same band by one derivation.
**THE WORDS** for the one cell where the page prints Famine and the place's own production is adequate or surplus (the
lines there that say the source failed), each a NEW line with its declared condition, the old lines kept where the
source did fail; both on the owner's veto list:
- fare, in place of C7: "Every fish that comes in is counted, and the shares are measured out house by house."
- Dawn Work, in place of F6: "Every hand that can be spared is out at first light, and what comes in is counted before it is eaten."
A2 merges without that cell; the mirror is its own small unit after it, with a pattern at a bar of zero.
