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

## R24e (added 21:02 UTC on 2026-11-24, on B1(i) as built: c6c244964 and its door commit 9d0f85e01 on `-b1i-wip`)
AS BUILT, AS R24b SET IT: the desert's `withholds` (fish, timber, game), the seven rows' declared livings, a givers
table, one function `landWithholdsHouse` asked after each draw (the roll made as today, the withheld house then not
taken; the cascade and the faction boost ask it after theirs; `getResourceMultiplier` untouched). C: 0 of 900 records
move. V: 27 move, exactly the deserts holding a withheld house with no giver. The base draw loses Fish market 24,
Sawmill (commercial) 15, Charcoal burner 12, Hunter's lodge 2, and gains nothing. Pattern B1land 0 on C and V.
- **(1) THE CASCADE RE-DEALS in 25 of the 27 (about 1 to 9 houses each): ACCEPTED AS WHAT FOLLOWS.** The cascade's
  candidates are boosted by the houses that stand; the withheld houses' chain boosts go with them. The alternative
  (keeping a withheld house as a phantom source) is a new fault. The chair's words "no other house's draw shifts" were
  about the base draw, which holds. OWED BEFORE THE MERGE: the table of the 27 (counts before and after; lost and gained
  by name); two checks over every gained house, each 0 (none withheld by the land; none naming a puller that does not
  stand); AND WHAT HAPPENS TO A SAVED DESERT PLACE on the user's own re-roll, on a re-derive after an edit, and on the
  world pulse: only the first may change its houses; if another re-deals a saved place, STOP.
- **(2) EIGHT NEW TEST REDS on desert births the cure moves:** a page test is re-anchored BY ITS OWN FINDER to a
  birth that is not a desert's, the reason beside it; the three counts are re-stated with their cause (24 golden rows,
  all desert). NO FINGERPRINT AND NO GOLDEN IS RE-RECORDED (the owner's one signing). `goals` I-13 (a keying fault of
  `dealGoals` that the moved birth exposes) IS ITS OWN FINDING: a measure on C and V first, the cure on the chair's
  ruling; its red is carried in the landing line as ruled.
- **(3) THE `B1land` ROW AT ZERO BY HAND:** accepted, as NOHEAL.

## R24f (added 22:30 UTC on 2026-11-24): A SAVED PLACE AND A CURE; "THE CORRECTIONS LAW"; AND A MEASURE FOR THE OWNER
CLOSE-7's STOP under R24e (1)(c), executed (`close-7/b1i/rederive-saved.*`): A RE-DERIVE AFTER AN EDIT RE-DEALS A SAVED
DESERT PLACE. `dmLayer.rederive` re-runs the whole birth (`run(config′, null, {seed})`) by the code of the day; only what
the DM's layer holds is pinned. dp-town-39, born at the flip and re-derived on the cure with an empty layer, lost Fish
market, Hunter's lodge, Vintner and Fuller and gained Customs house, Ropemaker and Barracks; dp-city-20 lost six houses and
gained two. A section's re-roll touches only people and history (the houses stand); the world pulse never reaches the cure.
THE SEAT OF IT IS THE RE-DERIVE, NOT THE CURE: every cure that moves what a place holds moves a saved place the same way.
1. **THE RULE FOR EVERY CURE FROM NOW:** a cure that changes what a place HOLDS (its houses, people, powers, events, its
   government's name) reaches only places born after it; a saved place keeps what it holds through a re-derive. A cure
   that changes only what the page SAYS of what the place holds may reach a saved place on its next re-derive.
2. **"THE CORRECTIONS LAW":** B1(i), B1(ii) if it moves a record, and C1 ride ONE marker in the generation laws' form: a
   zero-import leaf (`_correctionsVersion`; law 1 as the line stands; law 2 these corrections, each asked by name:
   `landWithholds`, `fieldNeedsFarmland`, `governmentNames`), a sixth row of `GENERATION_LAWS`, its clamp and mint in
   `birthConfig`, the saved-place test's row walk. IT LANDS LIT: it is the cure the owner ordered and holds no number of
   his. A1 and A2 are what the page says: no marker. PROOFS: law 1 forced: C and V byte-equal to the line; lit: each
   cure's counts; dp-town-39, dp-city-20 and a saved "Corrupt Council" re-derived on the cure: red first, then nothing held
   moves.
3. **A MEASURE FIRST, FOR THE OWNER:** 30 places a size born by MASTER's engine, saved, then re-derived on the line's tip
   with an empty layer: what each holds before and after. If the line already re-deals what live towns hold on their next
   edit, the corrections law is not the whole answer and the owner decides before any release.
4. **P3SOURCE** (three besieged places that state a reliance on magic with no source; the same at point 112; the one
   source is stopped by the siege): the reliance NAMES its source even when the source is stopped and says the stop in the
   page's own mark; the composed line comes to the chair before a build.

## R24g (added 22:33 UTC on 2026-11-24): THE BESIEGED PLACES' LINE; THE TOWN's NAME
1. **P3SOURCE, the one-line form:** "Reliance on magic: Relied upon · for food (magical provision) · supplied by Access to
   parish church · Stopped by the siege." The source by `magicSourceOf`'s own name; the stop in `crisisStoppedRow.js ::
   rowMarkText`'s own words. What the page says: no marker. If the pattern reads the last segment as a printed condition,
   it is taught that the page's own stop mark (read from that table) is not a catalogue condition, and nothing more.
2. **C1's NAME FOR THE TOWN IS "COUNCIL OF ALDERMEN"** (in place of R24b's "Board of Aldermen": CLOSE-7's check showed that
   name fails the council word tests, so `claimStanding.js` would re-word the place's prose and `factionArchetype` re-class
   it: a name that moves more than the name is not the cure). Not "Aldermen's Council" (a possessive inside a name). THE
   THREE: "Council of Aldermen" (town), "Council of Syndics" (city), "Senate" (metropolis). R24b's proof decides every
   name-keyed reader: with the names mapped back the 39 V births are byte for byte the old ones; a reader for which that
   cannot be had is a STOP.
3. CLOSE-7's context has begun with a summary twice in three hours: its hand-back's first section is made its whole memory
   and pushed; a third summary before its hand-in seats a successor on that hand-back.
ITS NEW GUESS FOR "CLOSE-7 <commit>": 08:30 UTC on 2026-11-25 (the measure of master-born places to about 00:15; the
corrections law's leaf 02:15; B1(i) 03:15; B1(ii) 04:45; C1 06:15; the landing branch 08:30).

## R24h (added 22:59 UTC on 2026-11-24): A2's RISE; R24a's PRICE-ONLY KEEP IS REVERSED ON THE MEASURE
CLOSE-7's A2 as built (`lane/close-7-2026-11-24-a2-wip` c92a301fa; read by the chair: `src/domain/dailyLife.js ::
fareBandOf`, the one derivation the fare, Dawn Work's food branch, the food visitor lens and the food grievance read):
FOODSEC C 197 to 0, V 168 to 0; pages moved C 211, V 223; born records moved 0; goldens none. Its table matches R24d's
bounds cell by cell. THE RISE IT REPORTED: under R24a a place the page prints as fed, with production strained, kept the
three price-only food grievances (F0, F6, F8, each gated on a market); the slot's commonest sentence then rose to C city
0.23 and metropolis 0.37, V city 0.21 and metropolis 0.32 (the bar is 0.15). THE CAUSE IS THE RULING, NOT THE BUILD: a
metropolis fed by trade is the common case, so "production strained, page Secure" is about four metropolises in ten.
**RULED:** A PLACE THE PAGE PRINTS AS FED HAS NO FOOD GRIEVANCE. `deriveCommonerResentments` pushes 'food' only where
`GRIEVANCE_BANDS.includes(fareBandOf(s, ctx))`; `PRICE_ONLY_FOOD_GRIEVANCES` and its filter are removed. WHY: no record
holds a price; a complaint about one on a third of big cities is drama the place does not hold (the owner's rule: "Don't
invent drama capitalize on what's already there if it's there"), and it breaks the sameness bar he asked to have cured.
NO NEW LINES are authored. OWED WITH THE MERGE: the slot's commonest-sentence share by size, C and V, before and after;
the pages whose resentments slot is empty, before and after; FOODSEC 0. An empty slot that leaves a heading over nothing
is said, not cured in A2. THE CHAIR'S OWN LESSON, AGAIN: R24a kept a signal without counting where it would print.

## R24i (added 22:59 UTC on 2026-11-24): MASTER-REDERIVE; THE CORRECTIONS LEAF IS WITHDRAWN; THE OWNER'S DECISION
CLOSE-7's measure (`close-7/reports/MASTER-REDERIVE.md`; CONFIRMED by its runs): 30 places a size born by master's engine
(db832c892), saved in master's shape, loaded by the line's own path, re-derived on f9531eb3a through `dmLayer.rederive`
with an EMPTY layer and carried forward: 180 OF 180 MOVE. People keeping their name: 12 of 1,804. Places of 30 that move,
by houses / people / powers / government name / events: thorp 6/30/5/0/10; hamlet 7/30/14/0/13; village 11/30/9/0/16; town
13/30/3/1/5; city 16/30/15/6/11; metropolis 12/30/5/0/8. CONTROL: master re-deriving its own saves moves 0 of 180.
WHAT THE CHAIR READ ITSELF (CONFIRMED by read, on the line at a3721fc83f and master db832c8926):
 1. THE CAUSE IS NOT THE LAWS. The line's law-1 engine is not master's engine: `tests/fixtures/generator-golden-master.json`
    was re-recorded through the signed door at each close round (2026-11-15 to 19; all 525 rows differ from master's);
    `tests/fixtures/x46-npc-band-dark-digests.json` re-keyed six times. One changed draw re-deals all that follows.
 2. `src/domain/settlement.schema.js :: GENERATOR_VERSION` is '0.9.0' on master AND on the line: every record carries
    `generatorVersion`, and it cannot say which engine bore it.
 3. THE LIVE PATH IS ONE, and it is on master too: `src/store/campaignAdvanceSession.js` calls
    `editSlice.js :: applyRosterDecreesAtTick` (a newcomer added by decree, applied at a campaign tick), which calls
    `settlementRederiveAction.js :: regenerateWithLayer`, which runs the WHOLE pipeline (`dmLayer.js :: rederive`:
    `run(config', null, { seed, pins })`) and writes `carryForward(live, derived)`: the derived record wins every key it
    holds. On master the engine reproduces the place, so the DM sees the newcomer and nothing else. After this release the
    same act on a place made before it rebuilds the place by the new engine. IN THAT PATH THE LAYER HOLDS THE NEWCOMER'S
    ROW, so its pins are not empty: INFERRED from `editSlice.js`'s own comment (the roster collection is cloned from the
    record and held), NOT YET MEASURED: the people would be held and everything around them rebuilt.
**RULED:** (a) R24f's CORRECTIONS LEAF IS WITHDRAWN: no marker of ours protects a master-born place on a full
re-derivation, and every live place is master-born. B1(i) stays as built, plain; R24e's "saved-place paths" item is
dropped; B1(ii) and C1 are built plain. R24f's RULE STANDS AS A RULE (a cure that changes what a place holds reaches only
places born after it): it is to be kept by ONE guard on the re-derivation, not by a marker a cure. (b) ONE MEASURE OWED
(CLOSE-7, a fresh builder): the live path as it runs: the same 180, one roster decree each, in
`applyRosterDecreesAtTick`'s own shape; the same columns plus people who keep their name and people whose house or power
is gone; control on master. (c) THE CURE IS THE OWNER'S DECISION (a ruled design re-decided: the edit model's design 14,
"consequence by design"; rule 10, rule 17) AND IS NOT BUILT. THE CHAIR'S LEAN, to be put to him in plain words: the
engine's version goes up with this release (an existing field, no new stored shape); a place is re-derived only by the
engine that bore it; for any other place a decree's newcomer is appended and nothing else moves, which is what a DM sees
today. IN THE CHAIR'S JUDGMENT THIS HOLDS THE RELEASE until he has answered.

## R24j (added 01:11 UTC on 2026-11-25): THE RE-DERIVATION's GUARD IS TO BE BUILT (the owner deferred the question; the chair decides yes)
THE OWNER'S WORD, verbatim, shortly before 01:08 UTC on 2026-11-25, over the chair's list of six: "To these and all future
questions I defer decisions to you". THE FIRST OF THE SIX: "Old towns rebuilt on a decree: build the guard I recommended,
yes or no. This one holds the release." THE CHAIR'S DECISION: YES. CLOSE-7 BUILDS IT, as the unit "GUARD", next after
the mirror and the live-path measure (R24i (b)), which is the guard's red.
**THE RULE:** A STORED PLACE IS RE-DERIVED ONLY BY THE ENGINE THAT BORE IT. For any other place a decree's newcomer is
appended and nothing else moves: what a DM sees on the live site today.
**THE BRIEF (each point proved, red first):**
 1. THE VERSION GOES UP WITH THIS RELEASE: `src/domain/settlement.schema.js :: GENERATOR_VERSION` '0.9.0' to '0.10.0'.
    An existing field of every record; no new stored shape. IT MOVES EVERY NEW RECORD's `generatorVersion` (and what
    hashes it): named for the owner's golden signing at the end, with the other birth-moving items.
 2. A BIRTH STAMPS THE ENGINE; A LOAD NEVER DOES. `normalizeSettlement.js` today writes the CURRENT version onto any
    record that has none, at every load, import and export: after this release that would make a record with no stamp
    look new-born. RULED: the current version is written at birth alone (`steps/assembleSettlement.js`'s path); a record
    that reaches `normalizeSettlement` with no `generatorVersion` is given the LEGACY value '0.9.0' (a named constant),
    never the current one. Walk every caller (the two gallery imports, the PDF, the Foundry export, the save loader).
 3. THE GUARD, ONE SEAM, BEFORE EITHER ENGINE PATH (local and remote): in `editSlice.js :: applyRosterDecreesAtTick`
    (the one caller of `regenerateWithLayer`, on master as on the line): where `record.generatorVersion !==
    GENERATOR_VERSION` the engine is NOT run: the tick's newcomers are appended to the stored record through the
    layer's own declared-append semantics (`dmLayer.js :: appendDeclared`'s rows, the same people the re-derivation
    would have appended), the layer is written as today, ONE write to both homes as today; `rederived: false`.
 4. WHAT CANNOT BE HONOURED IS SAID, NOT DONE: a layer whose `roots` hold a world fact (which enters only as `config'`
    and so needs the engine) on a place of another engine: each such root comes back in `unapplied` with a NEW closed
    reason, `engine_mismatch`, added to `RederiveUnappliedReason` and its frozen list in both directions; nothing is
    half-applied. Count on the 180 how often a master-born save holds one (expected 0).
 5. THE PROOFS: (a) RED FIRST: the live-path measure on the line as it stands (the 180 master-born saves, one decree
    each): places move; (b) GREEN: with the guard, 0 of 180 move beyond the newcomer's own rows, by record hash with
    the newcomer's rows set apart, and the newcomer is on the roster once (the U111 fault, a person appended twice,
    stays red-first in its own test); (c) A PLACE OF THIS ENGINE STILL RE-DERIVES, and exactly (0 of 180 line-born
    saves move beyond the newcomer): the guard must not turn the feature off for new places; (d) THE NEXT RELEASE,
    SIMULATED: with the constant moved once more in a test double, today's line-born saves take the appended path.
 6. SO THAT IT CANNOT BE FORGOTTEN AT A LATER RELEASE: a test that ties the version to the births: a committed row
    (the version and the digest of the golden manifest at the last release, master's: '0.9.0' and master's manifest
    digest) and the rule "the manifest's digest differs from the released one, so the version differs from the released
    one"; the release's own signing step adds the next row. A lint arm, not a habit.
 7. NO OTHER RE-RUN IS TOUCHED: the DM's own re-rolls (history, people, a section) are asked for by name and are meant
    to change what they re-roll; say in the hand-in which of them run the engine on a stored record, each with the
    laws it passes (`withRecord*Law`), so the list is on paper.
 8. NO PERSISTED SHAPE MOVES BUT THE VERSION's VALUE; no copy changes; no page changes.
SIZE: M (the chair's guess 6 to 8 seat-hours). IT HOLDS THE RELEASE. R24i's (a) stands (no corrections leaf).

## R24k (added 05:42 UTC on 2026-11-25): THE GUARD MERGES AS BUILT; ITS PROOF (c) WAS THE CHAIR's WRONG BAR AND IS RE-STATED
ASKED by CLOSE-7 (05:41): GUARD is built (`-guard-wip` d6c941c62, cut at e2fd7caa4; `close-7/reports/GUARD.md`; every
count confirmed by run). Points 1, 2, 3, 4, 6 and 8 hold; (a) red 113 of 180; (b) green 0 of 180 beyond the newcomer,
who appears once; (d) 0 of 180 move and all 180 take the append path. (c) AS R24j WROTE IT DOES NOT HOLD: line-born
places still re-derive (180 of 180), and all 180 "move beyond the newcomer": 180 a coherence receipt counting one more
person; 9 a kept person's empty house field become null; 1 a power seated; 4 conflicts re-dealt.
**THE ERROR IS THE CHAIR's.** R24j's bar "0 of 180 line-born saves move beyond the newcomer" measured whether a
re-derivation is inert beyond the person it adds. That is a property of the re-derivation, not of the guard, and master
does not have it either (the control: 4 of 180, four thorps). What (c) was for is its last clause: "the guard must not
turn the feature off for new places".
**RULED:**
1. GUARD MERGES AS BUILT onto `-cures`.
2. (c) RE-STATED IN TWO: (c1) THE FEATURE IS ON for a place of this engine: 180 of 180 re-derive (holds). (c2) THE GUARD
   IS INERT ON ITS OWN ENGINE: the same line-born saves and the same decree, on the guard's tree and on its parent
   (e2fd7caa4), give the same record with `generatorVersion` set apart: 180 of 180 equal. One row that differs is the
   guard's fault and stops the merge. Re-taken on births of the 116 tip at the merge, as ruled.
3. THE FOUR MOVEMENTS ARE A NAMED FINDING, "REDERIVE-DRIFT", AND ARE ADVANCE TIME's (the owner's line, `SCOPE-LINE.md`):
   live on master today in the same kind, not made by this release: WRITTEN DOWN, NOT WORKED. TWO BOUNDS so the line's
   exception is honoured: (i) THE NULL: twenty minutes, no more: does any reader of that house field on a page or an
   export tell '' from null (print "null", throw, sort wrongly)? If one does, that one line is cured in this unit; if
   none, it is written down. (ii) AT THE RE-TAKE ON THE 116 TIP (the troubles rule lit) the same four counts are
   reported; if seated powers plus re-dealt conflicts exceed 10 of 180, it comes to the chair before the landing: a
   re-derivation that re-deals a new place's troubles at every decree would be this release's making.
4. THE ONE NEW RED, `intentAtlasSoakDistiller` (`src/domain/data/intentAtlas.distillate.json` stores '0.9.0'; the test
   wants the documented run to reproduce it byte for byte): the file is a derived data file with its own script
   (`scripts/distill-intent-atlas.mjs`), not one of the owner's two signed references. IT IS RE-MADE BY ITS OWN SCRIPT
   IN THIS UNIT, ONE COMMIT, AND THE DIFF MUST BE THE VERSION's VALUE AND NOTHING ELSE; any other moved cell stops it
   and comes to the chair. If the script or a register names a signing door for it, it is not re-made: it is listed
   for the owner's end signings and CLOSE-7 says which door.
5. THE CHAIR READS GUARD's WHOLE DIFF AT THE HAND-IN, at the top effort (a stored value and the advance path move).
**R24k item 4a (06:16 UTC): THE DISTILLATE WAS RE-MADE (4569e73aa: one line, the version; `intentAtlasSoakDistiller` green); THE
EDGE BUNDLE IT FEEDS IS NOT REBUILT BY A SEAT.** CLOSE-7 asked (06:15): the distillate is an input of
`supabase/functions/_shared/intentAtlasBundle.js`, whose freshness test now reads "Bundle is stale"; its door is
`npm run build:edge-shared`, which writes every deployable Edge bundle (the engine bundle's version among them, which a
client pins). RULED, as CLOSE-7 recommended: BUILD NOTHING MID-STREAM. A stale edge bundle is the list's standing class
"bundle freshness" (four bundles are rows today); every edge bundle is rebuilt ONCE, in one build window, in the end's
signing sequence, as the last close did (319d75ac1d on the line's history), and their deploy is the owner's hand. The
new red rows are named in CLOSE-7's hand-in by job, file and title and join `RED-AT-LINE.tsv` as "bundle freshness" at
its landing; nothing else joins.

## R24l (added 07:23 UTC on 2026-11-25): C1's NAMES AND THE TWO DRAWS KEYED ON A POWER's NAME: A DRAW KEY, FROZEN
ASKED by CLOSE-7 (07:21; `close-7/reports/BATCH.md` item 3; confirmed by run): `generators/power/conflicts.js` picks
each conflict's issue and its plot hook from a hash of the two powers' NAMES, so C1's new names (R24g (2)) draw a
different conflict and the people's goals and ties follow: 0 of the 39 carriers on V are byte-equal with the names
mapped back; no other place moves. R24g (2) made this a STOP. RULED: THE ALIAS, as CLOSE-7 recommends, on five terms:
(a) IT IS A DRAW KEY AND IS NAMED ONE: one function over one frozen table, read by exactly the two hash keys (the
    hook's `seedKey`, the issue's `key`); never printed, never stored, no vocabulary entry. The rule its comment states:
    a display name may change; the key a draw was dealt on does not.
(b) IT FIRES ONLY FOR THE RENAMED FORM. "Council of Aldermen" and "Council of Syndics" are new strings (proven: no other
    producer). "SENATE": if a clean form already prints it at that size, a string alias would re-deal every clean
    Senate; there the alias reads a fact the birth already has in hand at that call, with NO NEW STORED FIELD; if none
    reaches the function, "Senate" is not aliased: its carriers' re-deal is accepted, counted (expected 7 on V), their
    goldens named, their diff proven confined to the conflict's own downstream fields.
(c) THE PROOF IS ON ALL 900 OF V AND ALL 900 OF C: byte for byte the old births with the names mapped back, or exactly
    the accepted Senate carriers differ, confined.
(d) A test pins the table's exact contents; a later rename comes to the chair.
(e) The old strings live in that table and its test only.
WHY NOT THE RE-DEAL FOR ALL 39: it would cost users nothing (new places only; saved places are stored), but it gives up
the one proof that the cure moves the name and nothing else.

## R24m (added 07:49 UTC on 2026-11-25): C1: R24l's ALIAS IS WITHDRAWN; THE 39 RE-DEALS ARE ACCEPTED
CLOSE-7 (07:47; `close-7/reports/BATCH.md`, last section; confirmed by run): with the alias in conflicts.js's two keys
and the names in four vocabularies by exact name, C moves 0 of 900, V's 861 others are unmoved, and 0 of V's 39
carriers are byte-equal: every pipeline step matches until assembly, where the cast holds the same people in another
order: THE DENSITY LAW BREAKS POWER TIES ON THE POWER's NAME (`applyDensityLaw.js:502`, `densityRoll.js:199` via
`seatKey`), so the renamed hall sorts differently and seats, ties and conflict pairs follow. No clean "Senate" exists at
that size. CLOSE-7 recommended widening the draw key to every read of a power's name as a key.
**RULED: NOT WIDENED.** The measure changed the price: a draw key through every hash, sort and tie-break of a power's
name, the density law's and the seat's among them, is a cross-cutting change to laws the owner signed, at the end of a
release, to prove something about 39 test places; the re-deal costs users nothing (new places only; saved places are
stored and the guard keeps them). THE LINE THAT STAYS FROM R24g (2): a reader that takes MEANING from the name must read
the new name exactly as it read the old (the four vocabularies, by exact name: done); a reader that uses the name as an
ARBITRARY KEY may re-deal. THE ALIAS IS REMOVED (no dead table, no pin test). THE PROOF IN PLACE OF R24l (c): C 0 of
900; V's 861 others unmoved; the 39's per-step hashes equal up to assembly and the cause named by site; the 39 pass the
batteries of any birth and show no kind of seat outcome or conflict issue that does not occur elsewhere in V; the old
three strings on no player page; the DM block says the hall is bought, word for word. The 39's golden rows are named for
the owner's end signing. WRITTEN DOWN, NOT WORKED: a power's display name is a key in several sites; a rename re-deals.
THE CHAIR TURNED ITS OWN RULING OF 07:24 ON A MEASURE THIRTY MINUTES LATER: that is what the measure is for.
