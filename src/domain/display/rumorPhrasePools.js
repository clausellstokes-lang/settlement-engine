/**
 * domain/display/rumorPhrasePools.js — THE WIDENED SUBJECT-PHRASE CORPUS (R1).
 *
 * A PURE DATA LEAF of the rumor-display family (ruling R-BLD-4: the single-writer law
 * reads ONE WRITER FAMILY, never one file — the same split warReceiptPools.js makes from
 * eventProse.js). settlementRumors.js remains the family HEAD: it owns WHAT_PHRASES, the
 * `whatPhrase` selector, the FNV-1a fold and every consumer contract. This leaf holds only
 * the authored variants that widen a phrase already registered there.
 *
 * ── WHAT THIS DISCHARGES ────────────────────────────────────────────────────────────────
 * The spine's frequency-scaled floor (DESIGN_FP_SPINE.md §2 SP-6, AMENDED 2026-08-03)
 * extends to the ~269 LIVE routed tokens, which are today largely single-voiced. Their
 * pools are pre-authored in docs/content/RECEIPT_POOLS_LEGACY.md §3 and wired here, one
 * DESK at a time in firing-cadence order. §3 carries sixty-three kinds; the desks wired
 * so far are named by the rosters at the foot of this file, and every kind absent from
 * them is still single-voiced and still renders its WHAT_PHRASES row unconditionally.
 *
 * ── THE CANONICAL-AT-ZERO CONTRACT (read before adding a pool) ──────────────────────────
 * The doc's VARIANT 1 is the string the reader is shown today, and it is NOT repeated
 * here — it stays in WHAT_PHRASES, and `whatPhrase` prepends it. That is deliberate and
 * it is the strongest available form of the annex's byte-identity rule: the canonical
 * line cannot drift from the live line, because it IS the live line rather than a copy of
 * it. Everything below is doc variants 2..N, in doc order.
 *
 * ORDER IS LOAD-BEARING. Selection is `hash(seed) % pool.length` over
 * `[canonical, ...variants]`, so inserting or re-sorting moves every later index and
 * changes what an existing seed draws. APPEND ONLY — never insert, never re-sort.
 *
 * NO SLOTS. R1 subject phrases take none: the live frame supplies the settlement name and
 * the address chain around the phrase (RECEIPT_POOLS_LEGACY.md, THE SLOT CONVENTION), so
 * the news address law is satisfied without the phrase carrying a name.
 *
 * THE REGISTER (R1). A lowercase noun phrase, no terminal stop, no digits, no engine
 * token, reading correctly in BOTH live frames — capitalized-first ("Families leaving in
 * Thornwall") and after "word of …" ("Merchants bring word of families leaving in
 * Thornwall"). A phrase that only reads in one frame is a defect, not a variant.
 *
 * PURE DATA: frozen string literals only — no logic, no imports, no interpolation.
 *
 * @enforced-by tests/domain/rumorPhrasePools.test.js
 */

/**
 * kind → the widened variants (doc variants 2..N). A kind absent from this map is
 * single-voiced and renders its WHAT_PHRASES row unconditionally, which is exactly what
 * every unwired kind does today.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const WHAT_PHRASE_POOLS = Object.freeze({
  // ── THE POPULATION / DEMOGRAPHICS DESK (RECEIPT_POOLS_LEGACY.md §3c) ────────────────
  // Four kinds the engine already routes. Two of them — flow_migration and
  // migration_pressure — share the SAME live string today ('people on the move'), so a
  // reader watching a slow depopulation saw one sentence for two different engine facts.
  // Their widened pools are deliberately different: flow_migration is the movement SEEN
  // (carts, roads, arrivals at the gate), migration_pressure is the departure BUILDING
  // (talk in the lanes, requests to the clerk, what people are weighing). The kinds stay
  // distinguishable at the reading surface for the first time.

  // flow_migration — doc variants 2..8; variant 1 ('people on the move') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8.
  flow_migration: Object.freeze([
    'carts on the road with everything a house holds',
    'arrivals entered at the gate faster than the clerk can write',
    'villages that were there last year and are thinner now',
    'a road busier than the market',
    'travellers sharing the verge with families',
    'more feet on the road than the season usually brings',
    'a child asleep on a load of bedding',
  ]),

  // migration_flight — doc variants 2..8; variant 1 ('families taking to the road') is
  // the WHAT_PHRASES row. CADENCE chronic → floor 8.
  migration_flight: Object.freeze([
    'houses left with the doors standing open',
    'names coming off one gate roll and onto another',
    "a column that will be somebody else's business by winter",
    'what people do before they are asked to',
    'a verge lined with folk resting their loads',
    'a hearth left cold in a cold season',
    'more leaving than the town can afford to lose',
  ]),

  // migration_pressure — doc variants 2..8; variant 1 ('people on the move') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8. BELIEF ATTRIBUTION: this kind is the
  // BUILDING of a departure, read from talk as much as from carts, so its variants
  // report what is said and weighed rather than asserting that anyone has left.
  migration_pressure: Object.freeze([
    'talk in the lanes about where else there is to go',
    'more requests to leave than the clerk has taken in a year',
    'families weighing what they can carry',
    'a road that is about to get busier',
    'travellers asked, over and over, what it is like where they came from',
    'a spring in which nobody is planting as much',
    'a town that has begun to think of itself as somewhere to leave',
  ]),

  // population_emigration — doc variants 2..8; variant 1 ('families leaving') is the
  // WHAT_PHRASES row. CADENCE chronic → floor 8.
  population_emigration: Object.freeze([
    'carts going out that do not come back',
    'names struck from the town roll',
    'work going unclaimed for want of hands',
    'a lane with more empty houses than full ones',
    'travellers passing whole households headed the other way',
    'a departure season that has not ended with the season',
    'fewer at the market, and nobody saying why',
  ]),

  // ── THE WAR DESK (RECEIPT_POOLS_LEGACY.md §3a) ──────────────────────────────────────
  // Twelve kinds the engine already routes. The register is DELIBERATELY UNGLAMOROUS:
  // a rumor is what a townsperson noticed, not a chronicler's verdict, so a battle is
  // heard as carts of wounded and a shut market rather than as a feat of arms. Two of
  // the twelve are the 'major/rare' cadence (conquest, occupation_vassalized) and take
  // the floor-4 pool the spine prices for a once-a-world event; the rest take floor 6,
  // except momentum_climb_down, whose chronic cadence earns floor 8.

  // army_homecoming — doc variants 2..6; variant 1 ('soldiers returning home') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  army_homecoming: Object.freeze([
    'the columns coming back down the road',
    'a muster roll read off at the gate',
    'beds wanted in every house on the lane',
    'the watch standing down for the first time since the spring',
    'carters passing a column headed the other way, homeward',
  ]),

  // blockade_declared — doc variants 2..6; variant 1 ('a harbour sealed off') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  blockade_declared: Object.freeze([
    'hulls waiting outside the mole with nowhere to put in',
    'an order posted at the harbour office',
    'the price of everything that comes by water beginning to move',
    'a quay with nothing on it but gulls',
    'shipmasters turning back at the roads and asking why',
  ]),

  // blockade_lifted — doc variants 2..6; variant 1 ('a harbour opened again') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  blockade_lifted: Object.freeze([
    'sails standing in past the mole again',
    'the harbour order struck from the book',
    "a season's worth of cargo coming in all at once",
    'a quay crowded enough to quarrel over',
    'shipmasters on the coast road spreading word that the way is clear',
  ]),

  // conquest — doc variants 2..4; variant 1 ('a conquest') is the WHAT_PHRASES row. CADENCE
  //   major/rare → floor 4 · live 1 · +3.
  conquest: Object.freeze([
    'a town taken and held',
    'new arms hung over an old gate',
    "one court's writ running where another's did",
  ]),

  // field_battle — doc variants 2..6; variant 1 ('a battle in the field') is the WHAT_PHRASES
  //   row. CADENCE notable → floor 6 · live 1 · +5.
  field_battle: Object.freeze([
    'hosts meeting on open ground',
    "a day's fighting entered in the war ledger",
    'the ground beyond the meadows left to the crows',
    'a long baggage train going out and a shorter one coming back',
    'travellers turned back from the road where the armies stood',
  ]),

  // infowar_lie_exposed — doc variants 2..6; variant 1 ('a court caught in its own lie') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  infowar_lie_exposed: Object.freeze([
    'a story falling apart in the telling',
    'a proclamation that no longer matches the record',
    'men asking what else was said that season',
    'a court that has stopped repeating something',
    'word on the road that the tale was made up at the top',
  ]),

  // infowar_spy_exposed — doc variants 2..6; variant 1 ('paid eyes found among us') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  infowar_spy_exposed: Object.freeze([
    'a familiar face taken up at the gate',
    "a name entered against another court's account",
    'everyone recalling who else that man drank with',
    'a clerk who is suddenly not at his desk',
    'travellers warned to keep their business to themselves here',
  ]),

  // intervention — doc variants 2..6; variant 1 ('a foreign hand at work') is the WHAT_PHRASES
  //   row. CADENCE notable → floor 6 · live 1 · +5.
  intervention: Object.freeze([
    'outside men in the square who answer to nobody local',
    "a patron's writ arriving before his soldiers",
    "a local dispute with a distant court's interest in it",
    'help nobody here asked for',
    'word on the road of a patron taking sides',
  ]),

  // intervention_clash — doc variants 2..6; variant 1 ('rival patrons come to blows') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  intervention_clash: Object.freeze([
    "other people's soldiers fighting in our fields",
    'rival writs claiming the same ground',
    'a local quarrel with foreign banners on both sides',
    'a war nobody here declared',
    'travellers counting strange colours on the road',
  ]),

  // momentum_climb_down — doc variants 2..8; variant 1 ('a proud course reversed') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  momentum_climb_down: Object.freeze([
    'a council unsaying what it said last season',
    'an order withdrawn before it was carried out',
    'a course set down quietly and not spoken of again',
    'what a court does when the cost is finally written out',
    'word on the road that the great plan has been dropped',
    'a proclamation taken down from the assize door',
    "a hard winter's arithmetic reaching the council chamber",
  ]),

  // occupation_lifted — doc variants 2..6; variant 1 ('an occupation ended') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  occupation_lifted: Object.freeze([
    'a garrison marching out of a town it did not come from',
    "the town's own seal on its own orders again",
    'a settlement finding out what it still owns',
    'a gate that opens on its own hinges again',
    'travellers no longer stopped at the walls',
  ]),

  // occupation_vassalized — doc variants 2..4; variant 1 ('a town brought to heel') is the
  //   WHAT_PHRASES row. CADENCE major/rare → floor 4 · live 1 · +3.
  occupation_vassalized: Object.freeze([
    "a court taking its orders from another court's clerks",
    'tribute added to everything the market sells',
    'a seal that still says the old name over a hand that is not the old hand',
  ]),

  // ── THE EVENTS DESK (RECEIPT_POOLS_LEGACY.md §3d) ───────────────────────────────────
  // Twenty-eight kinds — the estate's LOUDEST desk by firing cadence, and therefore the
  // one whose single-voicing a reader notices first: an authority wobbling for thirty
  // ticks used to say 'a shaken authority' thirty times. Ten of the twenty-eight belong
  // to the four generosity/commons families, whose members are near-neighbours in
  // meaning; their pools are written to keep the DISTINCTION the engine already draws
  // (asked for versus given versus refused) audible at the reading surface.

  // assize_verdict — doc variants 2..6; variant 1 ('a judgement handed down at the assize') is
  //   the WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  assize_verdict: Object.freeze([
    'a case decided and read out',
    'a ruling entered in the assize book',
    'a matter that will not be raised again',
    'a crowd at the court door that came for the reading',
    'travellers waiting on the outcome before they move on',
  ]),

  // authority_instability — doc variants 2..8; variant 1 ('a shaken authority') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  authority_instability: Object.freeze([
    'orders given that are not quite obeyed',
    'a seat whose writ is being tested',
    'men waiting to see who is answered before they answer',
    'a council that meets more often and decides less',
    'travellers advised to ask twice who is in charge',
    'a proclamation nobody has taken down and nobody is reading',
    'a winter in which the usual arrangements stopped being usual',
  ]),

  // cause_lifecycle — doc variants 2..8; variant 1 ('shifting fortunes') is the WHAT_PHRASES
  //   row. CADENCE chronic → floor 8 · live 1 · +7.
  cause_lifecycle: Object.freeze([
    'a cause that has begun to lose its people',
    'a movement entered, revised, and entered again',
    'what a town believes in changing shape',
    "yesterday's certainty, mildly held",
    'travellers finding a different argument than last time',
    'a banner that has not been carried since spring',
    'a season in which the loud thing went quiet',
  ]),

  // commons_gathering — doc variants 2..6; variant 1 ('the commons gathered in the square') is
  //   the WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  commons_gathering: Object.freeze([
    'a crowd that came without being called',
    'a gathering the clerks have started counting',
    'voices the council will have to answer',
    'more people in the square than at market',
    'travellers unable to get through the middle of the town',
  ]),

  // commons_petition — doc variants 2..8; variant 1 ('a petition raised by the common folk') is
  //   the WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  commons_petition: Object.freeze([
    'a paper carried from door to door',
    'a petition entered for the next sitting',
    'a demand the seat will have to hear or refuse',
    'names in every hand there is, and some in none',
    'travellers asked to make their mark on the way through',
    'a request put politely, and put again',
    "a winter's grievance arriving at the spring session",
  ]),

  // commons_riot — doc variants 2..4; variant 1 ('the streets risen in a riot-band') is the
  //   WHAT_PHRASES row. CADENCE major/rare → floor 4 · live 1 · +3.
  commons_riot: Object.freeze([
    'a crowd that stopped asking',
    'shutters up on every street off the square',
    'a night the watch could not hold',
  ]),

  // coup_succeeded — doc variants 2..6; variant 1 ('a seizure of power') is the WHAT_PHRASES
  //   row. CADENCE notable → floor 6 · live 1 · +5.
  coup_succeeded: Object.freeze([
    'new men in the council chamber by morning',
    'a seat changed hands without a vote',
    'orders arriving under a different seal',
    'the same offices, answering to somebody else',
    'travellers hailed at the gate by men who were not there last season',
  ]),

  // coup_suppressed — doc variants 2..6; variant 1 ('an uprising put down') is the WHAT_PHRASES
  //   row. CADENCE notable → floor 6 · live 1 · +5.
  coup_suppressed: Object.freeze([
    'a rising that did not last the night',
    'names taken and entered against the seat',
    'loyalty being asked for in writing',
    'a council very sure of itself this week',
    'travellers questioned harder than usual at the gate',
  ]),

  // criminal_pressure — doc variants 2..8; variant 1 ('a rise in lawlessness') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  criminal_pressure: Object.freeze([
    'locks bought that were never wanted before',
    'more matters brought to the watch than the watch can take',
    'business done earlier in the day than it used to be',
    'a town that has started walking home in company',
    'travellers warned off certain lanes after dark',
    'a watch roster with gaps in it',
    'a winter in which the takings got worse each month',
  ]),

  // faction_capture — doc variants 2..6; variant 1 ('a faction seizing control') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  faction_capture: Object.freeze([
    'one interest holding every seat that matters',
    'a body whose members all answer the same way',
    'decisions arriving already made',
    'a council with nothing left to argue about',
    'travellers told which house to approach for anything',
  ]),

  // faction_exhaustion — doc variants 2..8; variant 1 ('a faction spent and failing') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  faction_exhaustion: Object.freeze([
    'a hall that used to be full at meetings',
    'dues unpaid and rolls unrenewed',
    'an interest that will not be able to answer the next call',
    'a banner still up over an empty room',
    'travellers finding nobody left to speak for it',
    'old men keeping something going out of habit',
    'a winter that finished what the year had started',
  ]),

  // faction_government_challenge — doc variants 2..6; variant 1 ('a challenge to those in
  //   power') is the WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  faction_government_challenge: Object.freeze([
    "an interest putting its claim to the seat's face",
    'a challenge entered and dated',
    'a council that has to answer or be seen not to',
    'a question asked out loud that was asked quietly for years',
    'travellers advised to wait and see how it lands',
  ]),

  // faction_rival_power_contest — doc variants 2..6; variant 1 ('a contest between rival
  //   powers') is the WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  faction_rival_power_contest: Object.freeze([
    'rival houses bidding for the same room',
    'a contest recorded with neither side conceding',
    'every appointment turned into a battle',
    "a town whose business waits on somebody else's quarrel",
    'travellers asked whose man they are before anything else',
  ]),

  // generosity_refuge — doc variants 2..8; variant 1 ('refuge given to the displaced') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  generosity_refuge: Object.freeze([
    'strangers billeted in the outbuildings',
    "arrivals entered and fed at the town's cost",
    'mouths the town will still be feeding at winter',
    'room made where there was not room',
    'travellers directed here because here takes people',
    'a hall cleared of its tables for beds',
    'a door left open through a hard season',
  ]),

  // generosity_refusal — doc variants 2..8; variant 1 ('aid turned away') is the WHAT_PHRASES
  //   row. CADENCE chronic → floor 8 · live 1 · +7.
  generosity_refusal: Object.freeze([
    'carts sent back the way they came',
    'aid asked for, entered, and not granted',
    'a neighbour who will remember this',
    'a very reasonable refusal',
    'travellers told there is nothing to spare here',
    'a gate that stayed shut on a bad day',
    "a winter's decision the spring will be asked about",
  ]),

  // generosity_relief — doc variants 2..8; variant 1 ('aid sent to the stricken') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  generosity_relief: Object.freeze([
    'wagons going out to somewhere worse off',
    'stores signed away that the town may want back',
    'a stock given away that may be wanted here',
    'help sent before it was asked for',
    'travellers passing a laden column headed the wrong way for trade',
    "a granary opened for somebody else's town",
    'a hard season answered out of a barely easier one',
  ]),

  // hierarchy_cascade — doc variants 2..6; variant 1 ('an upheaval in the ranks') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  hierarchy_cascade: Object.freeze([
    'everybody below a vacancy moving up a place',
    'new faces where the old ones sat',
    'a chain of changes out of one departure',
    'a great deal of promotion and no new posts',
    'travellers unsure which of them to ask for now',
  ]),

  // information_shock — doc variants 2..8; variant 1 ('unsettling news') is the WHAT_PHRASES
  //   row. CADENCE chronic → floor 8 · live 1 · +7.
  information_shock: Object.freeze([
    'word arriving that nobody was ready for',
    'a report entered before anyone could confirm it',
    'a market that moved before the council did',
    'news everybody repeats and nobody has checked',
    'riders coming in ahead of the ordinary post',
    'a crowd at the assize door reading the same sheet',
    'a week in which nothing else was talked about',
  ]),

  // moral_reckoning — doc variants 2..6; variant 1 ('a reckoning') is the WHAT_PHRASES row.
  //   CADENCE notable → floor 6 · live 1 · +5.
  moral_reckoning: Object.freeze([
    'an old wrong finally being answered for',
    'a matter reopened in the record',
    'a town deciding what it will admit to',
    'a question nobody wanted asked, asked',
    'travellers finding the town short-tempered about its own history',
  ]),

  // npc_contest — doc variants 2..6; variant 1 ('a rivalry over the same ambition') is the
  //   WHAT_PHRASES row. CADENCE notable → floor 6 · live 1 · +5.
  npc_contest: Object.freeze([
    'rival names after the same prize',
    'a contest the record now carries under both',
    'every favour in town suddenly worth asking for',
    'a friendship that has stopped being one',
    'travellers told to choose a side or say nothing',
  ]),

  // npc_growth — doc variants 2..8; variant 1 ("a change in a leader's temper") is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  npc_growth: Object.freeze([
    'a familiar hand doing an unfamiliar thing',
    'a temper the record has begun to note',
    'what the next hard decision will be made by',
    'the same person, weathered',
    'travellers greeted by the same name in a different humour',
    'a habit at council that was not there before',
    'a season that left its mark on somebody who matters',
  ]),

  // npc_ladder — doc variants 2..8; variant 1 ('a change in who holds rank within a faction')
  //   is the WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  npc_ladder: Object.freeze([
    'a new order of precedence at the table',
    'rank entered afresh on the house roll',
    'who has to be asked first, changed',
    'the same faces in different chairs',
    'travellers directed to a different door than before',
    'a name moved up the list without a word said',
    'a settling everybody saw coming since spring',
  ]),

  // npc_support — doc variants 2..8; variant 1 ("a cause bound to a patron's") is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  npc_support: Object.freeze([
    "one name standing behind another's work",
    'a sponsorship the record ties to two names',
    'a design that now has money behind it',
    'a cause that has acquired a bill',
    'travellers told whose interest it really is',
    "a house sending its own men to somebody else's business",
    'an arrangement made at the turn of the year and honoured since',
  ]),

  // party_stressor_residual — doc variants 2..8; variant 1 ('lingering troubles') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  party_stressor_residual: Object.freeze([
    'the part of it that did not go away',
    'a matter left open on the rolls',
    'something that will make the next trouble worse',
    'an ending that did not quite end',
    'travellers finding the town still careful about it',
    'a repair nobody has got round to',
    'a season on from the worst of it, and still there',
  ]),

  // plague_arrival — doc variants 2..6; variant 1 ('a sickness spreading') is the WHAT_PHRASES
  //   row. CADENCE notable → floor 6 · live 1 · +5.
  plague_arrival: Object.freeze([
    'houses marked and shut',
    'the first cases entered in the parish book',
    'a market that will empty before the week is out',
    'a season nobody here will need reminding of',
    'travellers turned back short of the walls',
  ]),

  // protection_gap — doc variants 2..8; variant 1 ('defences grown thin') is the WHAT_PHRASES
  //   row. CADENCE chronic → floor 8 · live 1 · +7.
  protection_gap: Object.freeze([
    'a wall with nobody on it',
    'a watch roster short of names',
    'a town that would not stop much',
    'gates shut out of habit rather than strength',
    'travellers coming and going without being asked anything',
    'a tower with its stair unsafe',
    'a winter watch kept by too few',
  ]),

  // queue_refused — doc variants 2..8; variant 1 ('a petition denied') is the WHAT_PHRASES row.
  //   CADENCE chronic → floor 8 · live 1 · +7.
  queue_refused: Object.freeze([
    'a matter heard and set aside',
    'a request entered and refused',
    'a party that will find another way to ask',
    'a very courteous nothing',
    'travellers told the council is not taking that today',
    'a paper handed back across the table',
    'a sitting that ended the way the last one did',
  ]),

  // realm_verb_refused — doc variants 2..8; variant 1 ('a decree set aside') is the
  //   WHAT_PHRASES row. CADENCE chronic → floor 8 · live 1 · +7.
  realm_verb_refused: Object.freeze([
    'an order that was not carried out',
    'a decree entered and then struck',
    'a seat that has learned the limit of its writ',
    'a command everybody agreed with and nobody obeyed',
    'travellers finding the old arrangement still in force',
    'a proclamation still on the door with nothing behind it',
    'a decision unmade before the season turned',
  ]),
});

/*
 * ── THE DESK ROSTERS ────────────────────────────────────────────────────────────────────
 * Each wired desk names its own kinds, in doc order, and WIRED_DESK_KINDS is their
 * concatenation. These are AUTHORED lists, not `Object.keys(WHAT_PHRASE_POOLS)`, and that
 * is the point: they are an INDEPENDENT DENOMINATOR. A kind silently dropped from the map
 * would otherwise shrink the census and its own coverage together, and the pin that
 * compares the two would keep passing while the retrofit quietly un-wired itself.
 */

/**
 * §3c's population/demographics kinds — the first desk wired (2026-08-03).
 * @type {ReadonlyArray<string>}
 */
export const POPULATION_DESK_KINDS = Object.freeze([
  'flow_migration',
  'migration_flight',
  'migration_pressure',
  'population_emigration',
]);

/**
 * §3a — the war desk.
 * @type {ReadonlyArray<string>}
 */
export const WAR_DESK_KINDS = Object.freeze([
  'army_homecoming',
  'blockade_declared',
  'blockade_lifted',
  'conquest',
  'field_battle',
  'infowar_lie_exposed',
  'infowar_spy_exposed',
  'intervention',
  'intervention_clash',
  'momentum_climb_down',
  'occupation_lifted',
  'occupation_vassalized',
]);

/**
 * §3d — the events desk.
 * @type {ReadonlyArray<string>}
 */
export const EVENTS_DESK_KINDS = Object.freeze([
  'assize_verdict',
  'authority_instability',
  'cause_lifecycle',
  'commons_gathering',
  'commons_petition',
  'commons_riot',
  'coup_succeeded',
  'coup_suppressed',
  'criminal_pressure',
  'faction_capture',
  'faction_exhaustion',
  'faction_government_challenge',
  'faction_rival_power_contest',
  'generosity_refuge',
  'generosity_refusal',
  'generosity_relief',
  'hierarchy_cascade',
  'information_shock',
  'moral_reckoning',
  'npc_contest',
  'npc_growth',
  'npc_ladder',
  'npc_support',
  'party_stressor_residual',
  'plague_arrival',
  'protection_gap',
  'queue_refused',
  'realm_verb_refused',
]);

/**
 * Every kind this retrofit has wired so far, desk by desk in wiring order. The blast
 * radius of the disclosed same-seed prose shift is exactly this list — a kind that is not
 * here reads today exactly as it read before the retrofit began.
 * @type {ReadonlyArray<string>}
 */
export const WIRED_DESK_KINDS = Object.freeze([
  ...POPULATION_DESK_KINDS,
  ...WAR_DESK_KINDS,
  ...EVENTS_DESK_KINDS,
]);
