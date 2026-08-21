/**
 * domain/display/rumorFallbackPhrasePoolsEvents.js — THE EVENTS DESK OF THE FALLBACK
 * CORPUS (RECEIPT_POOLS_LEGACY.md §4e).
 *
 * A PURE DATA LEAF, and the larger half of the fallback corpus by kind count.
 * `rumorFallbackPhrasePools.js` is this family's HEAD: it owns the war, trade, faith and
 * divination desks, merges this file in, and publishes the single FALLBACK_PHRASE_POOLS
 * map that `settlementRumors.js` reads. The split is a SIZE split and nothing more — the
 * domain layer's 800-effective-line ceiling does not admit all 107 fallback pools in one
 * file, and the ruling that governs it is R-BLD-4 (the single-writer law reads one writer
 * FAMILY, never one file — the same split warReceiptPools.js makes from eventProse.js).
 *
 * ── WHY A SEPARATE CORPUS FROM rumorPhrasePools.js ──────────────────────────────────────
 * The §3 pools widen a kind that HAS an authored WHAT_PHRASES row. The kinds here have
 * none. Their live subject phrase is what `whatPhrase()` COMPUTES at call time — the
 * strip regex eats a leading engine prefix and the rest is de-underscored — so before
 * this corpus a reader could be told, on the flagship fiction surface, of "word of realm
 * verb force found steading". These pools give those tokens a voice for the first time.
 *
 * ── THE CANONICAL-AT-ZERO CONTRACT (identical in force, different in provenance) ────────
 * Variant 1 of every pool is NOT stored here. It is the string `whatPhrase()` already
 * computes, and the selector PREPENDS it. So the byte-identity anchor cannot drift from
 * the live string, because it IS the live string rather than a transcription of it —
 * exactly the property the §3 leaf gets by leaving variant 1 in WHAT_PHRASES.
 *
 * ⚠️ TWELVE ANCHORS ARE MUTILATED, AND THAT IS DELIBERATE. For twelve of the 107 kinds the
 * strip regex ate the meaningful half of the token, so `coup_detat` computes to "detat"
 * and `institution_capture` to "capture". RECEIPT_POOLS_LEGACY.md's J-LEG-4 rules that
 * variant 1 stays that mutilated string: retiring it REPLACES a live string rather than
 * widening a pool, which is a larger disclosed shift with its own golden, and it is
 * OWNER-GATED as DEFECT-1/2/3 under wiring note LEG-7. Widening around it is still a
 * strict improvement — a mutilated anchor that used to be the only voice becomes one
 * voice in six or eight — and each is marked inline below.
 *
 * ORDER IS LOAD-BEARING. Selection is `hash(seed) % pool.length` over
 * `[computedFallback, ...variants]`, so inserting or re-sorting moves every later index
 * and changes what an existing seed draws. APPEND ONLY — never insert, never re-sort.
 *
 * NO SLOTS, R1 REGISTER: a lowercase noun phrase, no terminal stop, no digits, no engine
 * token, reading correctly in both live frames.
 *
 * PURE DATA: frozen string literals only — no logic, no imports, no interpolation.
 *
 * @enforced-by tests/domain/rumorFallbackPhrasePools.test.js
 */

/**
 * §4e — the events desk. kind → the widened variants (doc variants 2..N).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const EVENTS_FALLBACK_POOLS = Object.freeze({
  // autoplacement — doc variants 2..6; variant 1 ('autoplacement') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  autoplacement: Object.freeze([
    "the realm's charter drawn",
    'a map settled at a stroke',
    'sites named and entered before anybody lives on them',
    'a founding decided all at once',
    'travellers finding roads laid to places not yet built',
  ]),

  // betrayal — doc variants 2..6; variant 1 ('betrayal') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  betrayal: Object.freeze([
    'an oath broken from inside',
    'a treachery entered against a trusted name',
    'a door opened that was meant to be held',
    'trust that turned out to be the weak point',
    'travellers finding the town suspicious of its own',
  ]),

  // calamity_forced — doc variants 2..6; variant 1 ('calamity forced') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  calamity_forced: Object.freeze([
    'a disaster brought about by decree',
    'a calamity entered as ordered rather than as suffered',
    "ruin arriving on somebody's instruction",
    'a blow the record says was chosen',
    'travellers finding a town undone by a decision',
  ]),

  // compound_shadow_court — doc variants 2..4; variant 1 ('compound shadow court') is the live
  // anchor and is NOT stored here. CADENCE major/rare → floor 4 · live 1 · +3.
  compound_shadow_court: Object.freeze([
    'a guild that has stopped needing the council',
    'offices held by men who answer to a corridor',
    'petitions answered faster through the wrong door',
  ]),

  // compound_starving_city — doc variants 2..4; variant 1 ('compound starving city') is the live
  // anchor and is NOT stored here. CADENCE major/rare → floor 4 · live 1 · +3.
  compound_starving_city: Object.freeze([
    'a blockade holding while the granaries empty',
    "hunger and siege doing each other's work",
    'surrender counted out in meals that do not come',
  ]),

  // compound_the_wasting — doc variants 2..4; variant 1 ('compound the wasting') is the live
  // anchor and is NOT stored here. CADENCE major/rare → floor 4 · live 1 · +3.
  compound_the_wasting: Object.freeze([
    'hunger and sickness feeding each other',
    'the hungry sickening faster and the sick unable to work the fields',
    'two troubles that have become one',
  ]),

  // coup_detat — doc variants 2..6; variant 1 ('detat') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  coup_detat: Object.freeze([
    'a seizure attempted at the top',
    'a stroke against the seat entered in the record',
    'men moving on the council chamber at an odd hour',
    'power grasped at rather than passed',
    'travellers finding the gates shut on an ordinary morning',
  ]),

  // criminal_corridor — doc variants 2..6; variant 1 ('criminal corridor') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  criminal_corridor: Object.freeze([
    'a road that moves what should not move',
    "a corridor entered in the watch's own record",
    "goods travelling with nobody's name on them",
    'a route everybody knows about and nobody polices',
    'carters offered work they should not take',
  ]),

  // criminal_network — doc variants 2..6; variant 1 ('criminal network') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  criminal_network: Object.freeze([
    'an organisation the watch cannot name a head for',
    "a network entered across several towns' records",
    'arrangements that run underneath the ordinary ones',
    'a hand in every lane and no face to it',
    'travellers advised whom to pay before they trade',
  ]),

  // custom_crisis — doc variants 2..6; variant 1 ('custom crisis') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  custom_crisis: Object.freeze([
    'an authored trouble gripping the town',
    'an affliction set down in the book before it was felt in the street',
    'a matter that has taken over everything else',
    'a town with one problem and no room for others',
    'travellers finding the place turned to a single question',
  ]),

  // disaster — doc variants 2..8; variant 1 ('disaster') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  disaster: Object.freeze([
    'a blow the town did not see coming',
    "a calamity entered against the settlement's name",
    'damage that will be years in the mending',
    'a day the town will date other things from',
    'work stopped everywhere while people dig',
    'travellers turned back by what is left of the road',
    'a season broken across the middle',
  ]),

  // disease_outbreak — doc variants 2..6; variant 1 ('disease outbreak') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  disease_outbreak: Object.freeze([
    'sickness running through the lanes',
    'cases entered faster than the healers can see them',
    'a house on every street with the door shut',
    'an illness that has stopped being unusual',
    'travellers advised to go around',
  ]),

  // dominant_npc_removed — doc variants 2..6; variant 1 ('dominant npc removed') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  dominant_npc_removed: Object.freeze([
    'a seat that has lost the person who filled it',
    'a vacancy entered with no successor named',
    'everything that went through one pair of hands, waiting',
    'a town discovering how much rested on one name',
    'travellers told there is nobody to see about it just now',
  ]),

  // faction_institution_capture — doc variants 2..8; variant 1 ('institution capture') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  faction_institution_capture: Object.freeze([
    'an interest taking a hall for its own',
    'an entry on the roll naming the interest the hall now answers to',
    'an office whose decisions now have an owner',
    'a public thing quietly become a private one',
    'business that goes one way whoever brings it',
    'travellers told which faction to approach about the hall',
    'a takeover conducted entirely in appointments',
  ]),

  // faction_institution_suppression — doc variants 2..8; variant 1 ('institution suppression') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  faction_institution_suppression: Object.freeze([
    'an interest closing a hall it could not hold',
    "a suppression entered against the hall under a faction's name",
    'an office prevented from doing its work',
    "a rival's foothold taken away rather than taken over",
    'doors shut by people who do not own them',
    'travellers sent away from a hall that is open in name',
    "a dismantling done in a faction's name and entered in no minute book",
  ]),

  // faction_law_preference_push — doc variants 2..8; variant 1 ('law preference push') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  faction_law_preference_push: Object.freeze([
    'an interest pressing for the law it wants',
    "a preference entered on the council's own record",
    'rules proposed by the people they would suit',
    'a statute with a beneficiary on its face',
    'a council asked, again, to see it one way',
    'travellers finding the same argument in every tavern',
    "a season of one faction's drafting",
  ]),

  // faction_power_shift — doc variants 2..8; variant 1 ('power shift') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  faction_power_shift: Object.freeze([
    'weight moving from one interest to another',
    'a shift entered on the faction rolls',
    'rooms that used to be full emptying into other rooms',
    'the list of people worth persuading, rewritten',
    'an old balance that no longer holds',
    'travellers directed to a different house than last year',
    'a turn that took a season and will take a generation to undo',
  ]),

  // faction_service_bolster — doc variants 2..8; variant 1 ('service bolster') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  faction_service_bolster: Object.freeze([
    'an interest paying to keep a service standing',
    'a payment entered where a levy would normally stand',
    "a hall kept open by somebody's money",
    'help given where a debt will be remembered',
    'a public good with a private sponsor',
    'travellers told whose generosity keeps the door open',
    'an arrangement renewed each season without discussion',
  ]),

  // famine — doc variants 2..6; variant 1 ('famine') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  famine: Object.freeze([
    'hunger become a public matter',
    'want entered as a crisis rather than a hardship',
    'queues where there used to be a market',
    'a town where the food question has displaced every other',
    'travellers advised to carry their own provisions',
  ]),

  // government_change — doc variants 2..6; variant 1 ('government change') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  government_change: Object.freeze([
    'a seat passing to different hands',
    'a change of rule entered and dated',
    'a new seal on business the old one had already settled',
    'the same offices with different masters',
    'travellers finding a different name at the council door',
  ]),

  // government_overthrown — doc variants 2..6; variant 1 ('government overthrown') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  government_overthrown: Object.freeze([
    'a ruling power put out by force',
    'an overthrow entered against the old seat',
    'authority being rebuilt from the ground up',
    'a council chamber under new occupancy',
    'travellers finding nobody able to say who decides',
  ]),

  // infiltration — doc variants 2..6; variant 1 ('infiltration') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  infiltration: Object.freeze([
    "another court's people quietly inside this one",
    "agents entered against a neighbour's account",
    'offices held by men who report elsewhere',
    'a town whose decisions are known before they are made',
    'travellers warned that the walls here have ears',
  ]),

  // information_flow — doc variants 2..8; variant 1 ('information flow') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  information_flow: Object.freeze([
    'word moving along a road as reliably as cargo',
    'a channel the clerks record as they would a road',
    'news that arrives here before it arrives anywhere else',
    'a town that knows things early',
    'riders whose arrival the market watches for',
    'travellers finding their news already stale on arrival',
    'a standing arrangement for knowing',
  ]),

  // institution_capture — doc variants 2..8; variant 1 ('capture') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  institution_capture: Object.freeze([
    'a hall taken over by an interest',
    "a capture entered against the institution's own roll",
    'an office that has acquired an owner',
    'decisions with a predictable direction',
    'a public body that answers privately',
    'travellers told who really runs it',
    'a takeover done entirely through appointments',
  ]),

  // institution_suppression — doc variants 2..8; variant 1 ('suppression') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  institution_suppression: Object.freeze([
    'a hall prevented from working',
    'a body entered as prevented rather than as failed',
    'an office kept from doing what it is for',
    'doors closed by people with no right to close them',
    'a service that exists on paper only',
    'travellers carrying business the hall will no longer take',
    'a dismantling nobody has announced',
  ]),

  // insurgency — doc variants 2..6; variant 1 ('insurgency') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  insurgency: Object.freeze([
    'an organised resistance the seat cannot reach',
    'cells entered in the record without names',
    'authority contested in the lanes rather than the chamber',
    'a rising that has learned patience',
    'travellers advised which quarters to avoid',
  ]),

  // magic_deadzone — doc variants 2..6; variant 1 ('magic deadzone') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  magic_deadzone: Object.freeze([
    'a place where the workings will not work',
    'an absence the ward rolls now have to account for',
    'wards that stopped holding and cannot be renewed',
    'practitioners here who have become ordinary',
    'travellers finding their charms useless within the bounds',
  ]),

  // magical_instability — doc variants 2..6; variant 1 ('magical instability') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  magical_instability: Object.freeze([
    'workings that surge and fail without pattern',
    "an instability entered in the settlement's record",
    'wards nobody trusts to hold',
    'a town that has learned not to rely on it',
    'travellers advised not to cast anything they need',
  ]),

  // monster_raider_pressure — doc variants 2..8; variant 1 ('monster raider pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  monster_raider_pressure: Object.freeze([
    'something coming down out of the wild country',
    'raider pressure entered against the frontier',
    'outlying steadings that have stopped being worth farming',
    'a militia turned out more often than it should be',
    'roads only used in daylight now',
    'travellers hiring escorts they never used to need',
    'a season the frontier is dreading',
  ]),

  // npc_action — doc variants 2..8; variant 1 ('action') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  npc_action: Object.freeze([
    'a name in the town doing something about it',
    "an act entered against a person's own record",
    'one hand moving where the council would not',
    'somebody deciding not to wait',
    'a move the town will be arguing about by evening',
    'travellers finding the place talking about one person',
    'a step taken that cannot be untaken',
  ]),

  // plague — doc variants 2..6; variant 1 ('plague') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  plague: Object.freeze([
    'a virulent sickness through the whole town',
    'an outbreak entered at its worst grade',
    'streets kept clear because nobody will use them',
    'a season measured in shut doors',
    "travellers turned back a day's ride out",
  ]),

  // political_authority — doc variants 2..8; variant 1 ('political authority') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  political_authority: Object.freeze([
    'a court whose word runs beyond its own walls',
    'an authority channel entered between two seats',
    'orders that carry in a town that did not issue them',
    'influence that does not need soldiers behind it',
    'a seat consulted about matters that are not its own',
    'travellers told whose ruling settles things here',
    'a standing arrangement of who defers to whom',
  ]),

  // political_fracture — doc variants 2..6; variant 1 ('political fracture') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  political_fracture: Object.freeze([
    'a court split down the middle',
    "a fracture entered against the seat's own record",
    'an answer for every question and no way to choose between them',
    'a council that cannot finish a sitting',
    'travellers unable to learn who speaks for the town',
  ]),

  // realm_verb_force_abandon — doc variants 2..6; variant 1 ('realm verb force abandon') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_force_abandon: Object.freeze([
    'a decree emptying a settlement',
    'a town closed the way an office is closed',
    'people told to leave somewhere that still stands',
    'a place ended by writ rather than by ruin',
    'travellers passing a town being walked out of',
  ]),

  // realm_verb_force_calamity — doc variants 2..6; variant 1 ('realm verb force calamity') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_force_calamity: Object.freeze([
    'a decree bringing a disaster down',
    'harm set down in advance the way a market day is',
    'ruin arriving because it was written',
    'a catastrophe somebody put their name to',
    "travellers finding a town undone on somebody's word",
  ]),

  // realm_verb_force_found_steading — doc variants 2..6; variant 1 ('realm verb force found steading') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_force_found_steading: Object.freeze([
    'a decree founding a steading',
    'a name given to a place before anybody lives in it',
    'ground broken because a writ said so',
    'a place that begins with an order rather than a choice',
    'travellers finding a new palisade where the map showed nothing',
  ]),

  // realm_verb_force_reconsideration — doc variants 2..6; variant 1 ('realm verb force reconsideration') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_force_reconsideration: Object.freeze([
    'a decree making a court think again',
    'a verdict sent back to the table it came from',
    'a settled course reopened by writ',
    'a decision taken back out of the book',
    'travellers finding a settled matter reopened by writ',
  ]),

  // realm_verb_order — doc variants 2..8; variant 1 ('realm verb order') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  realm_verb_order: Object.freeze([
    "a decree issued from the realm's seat",
    "an order entered under the realm's own hand",
    'a writ that will be read out in every square',
    'something decided above the town and felt inside it',
    'an instruction nobody local can appeal',
    'travellers carrying word of a decree ahead of the decree',
    'a season shaped by a decision made elsewhere',
  ]),

  // rebellion — doc variants 2..6; variant 1 ('rebellion') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  rebellion: Object.freeze([
    'a town organising against its overlord',
    'a rising entered against a coercive patron',
    'tribute withheld and men under arms',
    'an arrangement being refused rather than renegotiated',
    "travellers finding the overlord's writ ignored here",
  ]),

  // reconsideration_forced — doc variants 2..6; variant 1 ('reconsideration forced') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  reconsideration_forced: Object.freeze([
    'a court made to think again',
    'a reversal entered against a settled course',
    'a decision reopened under pressure',
    'a plan taken back off the table',
    'travellers finding the arrangement they were told of undone',
  ]),

  // regional_channel — doc variants 2..8; variant 1 ('regional channel') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  regional_channel: Object.freeze([
    'a standing connection between two towns',
    'a channel entered on the regional graph',
    'what one settlement carries to another as a matter of course',
    'a tie strong enough that trouble travels along it',
    'a road that is also a relationship',
    'travellers using a route the two towns maintain between them',
    "an arrangement that shows in both towns' records",
  ]),
});

/**
 * §4e's roster in doc order. AUTHORED, not `Object.keys(EVENTS_FALLBACK_POOLS)` — an
 * independent denominator, so a kind silently dropped from the map shrinks the census and
 * its own coverage together and the join against the corpus reds instead of agreeing
 * with itself.
 * @type {ReadonlyArray<string>}
 */
export const EVENTS_FALLBACK_KINDS = Object.freeze([
  'autoplacement',
  'betrayal',
  'calamity_forced',
  'compound_shadow_court',
  'compound_starving_city',
  'compound_the_wasting',
  'coup_detat',
  'criminal_corridor',
  'criminal_network',
  'custom_crisis',
  'disaster',
  'disease_outbreak',
  'dominant_npc_removed',
  'faction_institution_capture',
  'faction_institution_suppression',
  'faction_law_preference_push',
  'faction_power_shift',
  'faction_service_bolster',
  'famine',
  'government_change',
  'government_overthrown',
  'infiltration',
  'information_flow',
  'institution_capture',
  'institution_suppression',
  'insurgency',
  'magic_deadzone',
  'magical_instability',
  'monster_raider_pressure',
  'npc_action',
  'plague',
  'political_authority',
  'political_fracture',
  'realm_verb_force_abandon',
  'realm_verb_force_calamity',
  'realm_verb_force_found_steading',
  'realm_verb_force_reconsideration',
  'realm_verb_order',
  'rebellion',
  'reconsideration_forced',
  'regional_channel',
]);
