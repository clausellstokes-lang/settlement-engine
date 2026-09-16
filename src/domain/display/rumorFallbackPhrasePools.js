/**
 * domain/display/rumorFallbackPhrasePools.js — THE FALLBACK-VOICED SUBJECT-PHRASE CORPUS
 * (RECEIPT_POOLS_LEGACY.md §4), and the HEAD of its two-file family.
 *
 * ── THE FINDING THIS FILE DISCHARGES ────────────────────────────────────────────────────
 * One hundred and seven of the legacy routed tokens have NO AUTHORED VOICE AT ALL. They
 * carry no WHAT_PHRASES row; their live subject phrase is whatever `whatPhrase()` COMPUTES
 * at call time, by stripping a leading engine prefix and de-underscoring the remainder.
 * The spine (DESIGN_FP_SPINE.md §2 SP-6, AMENDED 2026-08-03) calls the legacy tokens
 * "largely single-voiced"; for these it was worse than single-voiced, it was UNVOICED — a
 * reader could be told, on the flagship fiction surface, of "word of realm verb force
 * found steading". This corpus gives all 107 a voice, and closes the R1 half of the
 * legacy retrofit at 170 of 170 kinds.
 *
 * ── THE FAMILY ─────────────────────────────────────────────────────────────────────────
 * This file owns §4a (war), §4b (trade), §4c (faith) and §4d (divination) — 66 kinds —
 * and merges in `rumorFallbackPhrasePoolsEvents.js`, which owns §4e (events, 41 kinds).
 * The split is a SIZE split and nothing more: the domain layer's 800-effective-line
 * ceiling does not admit 107 pools in one file. R-BLD-4 governs — the single-writer law
 * reads one writer FAMILY, never one file. `FALLBACK_PHRASE_POOLS` below is the single
 * map `settlementRumors.js` reads; nothing else should import the events leaf directly.
 *
 * ── WHY THIS IS A SEPARATE CORPUS FROM rumorPhrasePools.js ──────────────────────────────
 * `rumorPhrasePools.js` widens kinds that HAVE a WHAT_PHRASES row (§3, 63 kinds). These
 * have none. The two corpora are keyed the same way and selected by the same fold, but
 * their variant-1 provenance differs — authored there, COMPUTED here — and the code path
 * that consults them differs accordingly (the canonical arm versus the fallback arm of
 * `whatPhrase`). Keeping them apart keeps that distinction legible; merging them would
 * hide which anchors are authored strings and which are engine output.
 *
 * ── THE CANONICAL-AT-ZERO CONTRACT (identical in force, different in provenance) ────────
 * Variant 1 is NOT stored in this file. `whatPhrase()` computes the fallback and PREPENDS
 * it, so index 0 cannot drift from the live string — it IS the live string rather than a
 * transcription of it. Two properties follow by construction:
 *   • SEEDLESS IS BYTE-IDENTICAL — no seed means index 0, so every caller that asks for a
 *     phrase without a telling to key on reads exactly what it read before this wiring.
 *   • AN UNREGISTERED TOKEN IS UNTOUCHED — a token absent from this map still degrades to
 *     its computed fallback exactly as before, so the blast radius is these 107 kinds and
 *     nothing else, seeded or not.
 *
 * ⚠️ TWELVE ANCHORS ARE MUTILATED, AND THAT IS DELIBERATE. For twelve kinds the strip
 * regex ate the meaningful half of the token — `coup_detat` computes to "detat",
 * `institution_capture` to "capture". J-LEG-4 rules that variant 1 STAYS that string:
 * retiring it replaces a live string rather than widening a pool, a larger disclosed shift
 * with its own golden, OWNER-GATED as DEFECT-1/2/3 under wiring note LEG-7 and explicitly
 * not to be bundled into a pool-wiring wave. Widening around a mutilated anchor is still a
 * strict improvement: it stops being the ONLY voice and becomes one of six or eight. Each
 * is marked inline.
 *
 * ORDER IS LOAD-BEARING. Selection is `hash(seed) % pool.length` over
 * `[computedFallback, ...variants]`. APPEND ONLY — never insert, never re-sort.
 *
 * NO SLOTS, R1 REGISTER: a lowercase noun phrase, no terminal stop, no digits, no engine
 * token, reading correctly in both live frames.
 *
 * PURE DATA: frozen string literals plus the one sibling merge — no logic, no
 * interpolation.
 *
 * @enforced-by tests/domain/rumorFallbackPhrasePools.test.js
 */
import {
  EVENTS_FALLBACK_KINDS,
  EVENTS_FALLBACK_POOLS,
} from './rumorFallbackPhrasePoolsEvents.js';

/**
 * §4a — the war desk. kind → the widened variants (doc variants 2..N).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const WAR_FALLBACK_POOLS = Object.freeze({
  // alliance_burden — doc variants 2..8; variant 1 ('alliance burden') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  alliance_burden: Object.freeze([
    'a friendship that costs more than it returns',
    'relief columns going out and nothing coming back',
    "a debit the town's own books carry for a friend's sake",
    'carts sent to an ally while the market here goes short',
    'help given so often it has become an expectation',
    "travellers passing this town's grain on somebody else's road",
    'a winter spent keeping a neighbour standing',
  ]),

  // ally_burden — doc variants 2..8; variant 1 ('ally burden') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  ally_burden: Object.freeze([
    'an ally who is more weight than shield',
    'calls answered until the answering shows',
    'an obligation the ledger keeps renewing',
    'men and grain going wherever the compact says',
    'a compact that has been all giving',
    "travellers finding this town's soldiers billeted elsewhere",
    "a season of somebody else's war paid for here",
  ]),

  // army_deployed — doc variants 2..6; variant 1 ('army deployed') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  army_deployed: Object.freeze([
    'the host gone and the walls left to the watch',
    'a garrison entered as absent',
    'a town that would be slow to defend itself',
    'an empty muster field in the middle of the year',
    'travellers finding the gate kept by old men',
  ]),

  // casus_declared — doc variants 2..6; variant 1 ('casus declared') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  casus_declared: Object.freeze([
    'a reason for war read out and entered',
    'a grievance put in writing at last',
    'what a court says before it calls a levy',
    'an old quarrel given a date',
    'travellers repeating a reason for war they heard read out',
  ]),

  // cold_war — doc variants 2..8; variant 1 ('cold war') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  cold_war: Object.freeze([
    'neighbours not at war and not at ease',
    'an edge the record keeps open and cold',
    'borders watched from both sides and crossed by neither army',
    'courtesies exchanged and nothing else',
    'a quarrel kept just below the muster',
    'travellers questioned at both ends of the same road',
    "a winter of waiting on somebody else's temper",
  ]),

  // cold_war_sanctions — doc variants 2..8; variant 1 ('cold war sanctions') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  cold_war_sanctions: Object.freeze([
    'inspections at a gate that used to wave carts through',
    'a trade permitted on paper and obstructed in practice',
    'tolls that have grown teeth',
    'goods arriving a season late and costing accordingly',
    'a quarrel being fought with clerks',
    'carters allowing an extra day for the crossing',
    'a market squeezed without a shot fired',
  ]),

  // cold_war_supply_sanctions — doc variants 2..8; variant 1 ('cold war supply sanctions') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  cold_war_supply_sanctions: Object.freeze([
    "a neighbour's suppliers being leaned on",
    'contracts entered and then quietly not renewed',
    "the roads to one town's workshops going quiet",
    'a pressure applied where nobody can point to the hand',
    'factors told which house they may not deal with',
    'travellers noticing which wagons no longer run',
    'a season in which the pinch was arranged, not suffered',
  ]),

  // convoy_ordered — doc variants 2..8; variant 1 ('convoy ordered') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  convoy_ordered: Object.freeze([
    'cargo sailing under escort',
    'a sailing entered with soldiers on the manifest',
    'hulls that will not go out alone any more',
    'protection costing as much as the cargo',
    'a quay full of ships waiting on a warship',
    "shipmasters comparing the escort's schedule",
    'a season in which nothing crosses the water unaccompanied',
  ]),

  // hostile — doc variants 2..8; variant 1 ('hostile') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  hostile: Object.freeze([
    'an open enemy across the border',
    'an edge the record carries as hostile',
    'gates barred against a named neighbour',
    'trade that has to go the long way or not at all',
    'neighbours with nothing left to say to each other',
    'travellers advised not to mention where they came from',
    'a border that is a front',
  ]),

  // hostile_raid — doc variants 2..8; variant 1 ('hostile raid') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  hostile_raid: Object.freeze([
    'outlying farms burned and left',
    'a raid entered against a named neighbour',
    "a harvest lost to somebody else's riders",
    'smoke on the horizon and no army near it',
    'a hamlet the town will have to feed this winter',
    'carters keeping to the main road after dark',
    'a raiding season that came early',
  ]),

  // intercept_ordered — doc variants 2..8; variant 1 ('intercept ordered') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  intercept_ordered: Object.freeze([
    'a column sent to meet a column that may not be coming',
    'an order entered against a believed march',
    'men waiting on a road for something they have been told about',
    'a strike made on word rather than on sight',
    'an ambush laid where the rumour says',
    'travellers sent the long way round by men who will not say why',
    "a season's soldiering spent on a guess",
  ]),

  // intervention_ordered — doc variants 2..8; variant 1 ('intervention ordered') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  intervention_ordered: Object.freeze([
    "a patron sending men into somebody else's quarrel",
    "an intervention entered under a patron's seal",
    'soldiers on the road who answer to a distant court',
    'help arriving that nobody local asked for',
    'a local matter about to become a regional one',
    'travellers passing foreign columns headed inland',
    'an order given far away and felt here',
  ]),

  // military_protection — doc variants 2..8; variant 1 ('military protection') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  military_protection: Object.freeze([
    "a garrison kept for somebody else's walls",
    'an obligation to defend, written down and dated',
    'soldiers here who are not from here',
    'safety bought at a standing price',
    'a shield held over a town that cannot hold its own',
    'travellers noticing whose colours the watch wears',
    'an arrangement everybody has stopped remarking on',
  ]),

  // occupation — doc variants 2..8; variant 1 ('occupation') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  occupation: Object.freeze([
    'a town held by men who came from elsewhere',
    'a garrison entered where the council used to sit',
    'orders posted under a foreign seal',
    'a curfew nobody voted for',
    'a market that trades under watch',
    'travellers stopped and asked their business at the gate',
    "a year of being somebody else's",
  ]),

  // occupation_burden — doc variants 2..8; variant 1 ('burden') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  occupation_burden: Object.freeze([
    'holding a town costing more than taking it did',
    "garrisons entered against the occupier's own strength",
    'men tied down where there is no battle',
    'an army that cannot be anywhere else',
    'a conquest that has to be fed and paid for',
    'travellers counting the same colours in every square',
    'a season of keeping what was won',
  ]),

  // occupation_burden_cleared — doc variants 2..8; variant 1 ('burden cleared') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  occupation_burden_cleared: Object.freeze([
    'a garrison called back off a held town',
    "an obligation struck from the occupier's rolls",
    'men free to be somewhere else at last',
    'a strength that is a strength again',
    'a hold given up rather than lost',
    'travellers finding the road unwatched for the first time in years',
    'a weight put down at the turn of the season',
  ]),

  // occupation_resistance — doc variants 2..8; variant 1 ('resistance') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7. ⚠️ MUTILATED variant 1 (owner-gated DEFECT — kept verbatim).
  occupation_resistance: Object.freeze([
    'a held town that will not be quiet',
    "sabotage entered in the garrison's own record",
    'orders posted at night and torn down by morning',
    'a curfew broken more often than it is kept',
    'a town obeying slowly and on purpose',
    'travellers warned to be indoors after dark',
    'a winter in which nothing the garrison did stuck',
  ]),

  // peace_sued — doc variants 2..6; variant 1 ('peace sued') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  peace_sued: Object.freeze([
    'a court asking for terms',
    'an offer of peace entered and dated',
    'what a seat does when a war has cost more than it can carry',
    'a legate sent with terms instead of a levy',
    'travellers carrying word that terms have been asked for',
  ]),

  // rebellion_vassal — doc variants 2..6; variant 1 ('rebellion vassal') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  rebellion_vassal: Object.freeze([
    'a client town refusing its overlord',
    'a rising entered against the tribute rolls',
    'a tribute that has stopped arriving',
    'an arrangement that has stopped being agreed to',
    "travellers finding the overlord's men turned back at the gate",
  ]),

  // reinforcement_cost — doc variants 2..8; variant 1 ('reinforcement cost') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  reinforcement_cost: Object.freeze([
    'the home bleeding men and grain to keep a field army standing',
    'a levy entered on top of a levy',
    'what it costs to keep an army where it already is',
    'carts going to the front that will not come back loaded',
    'a war paid for in instalments',
    'travellers passing supply columns headed one way only',
    'a season of feeding an army at a distance',
  ]),

  // reinforcement_ordered — doc variants 2..8; variant 1 ('reinforcement ordered') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  reinforcement_ordered: Object.freeze([
    'a relief column marching for an ally under siege',
    "a march entered under the treaty's name",
    "men sent to hold somebody else's wall",
    'help despatched before anyone knows whether it can arrive in time',
    'a column on the road with a long way to go',
    'travellers giving way to soldiers headed for the fighting',
    'a compact answered with feet',
  ]),

  // realm_verb_declare_blockade — doc variants 2..6; variant 1 ('realm verb declare blockade') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_declare_blockade: Object.freeze([
    'a decree closing a harbour',
    'a port closed in writing before it is closed by hulls',
    'an order that will be felt on every quay',
    'a decision taken far from the water it closes',
    'shipmasters learning at the roads that the port is shut',
  ]),

  // realm_verb_declare_casus — doc variants 2..6; variant 1 ('realm verb declare casus') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_declare_casus: Object.freeze([
    'a decree naming a reason for war',
    "a cause entered by the realm's own hand",
    'a grievance made official',
    'what is read out before the levies are called',
    'travellers carrying word that a cause has been declared from above',
  ]),

  // realm_verb_intercept — doc variants 2..6; variant 1 ('realm verb intercept') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_intercept: Object.freeze([
    'a decree sending men against a believed column',
    'a road watched on instructions carried from far off',
    'an order given on word rather than on sight',
    'a strike arranged before anybody has seen the target',
    'travellers turned off the road by men acting under a decree',
  ]),

  // realm_verb_order_convoy — doc variants 2..6; variant 1 ('realm verb order convoy') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_order_convoy: Object.freeze([
    'a decree putting escorts on the sea lanes',
    'sailings arranged by a court that owns no cargo',
    'warships assigned to merchant hulls',
    'protection made a matter of decree rather than of price',
    'shipmasters told when they may sail and with whom',
  ]),

  // realm_verb_order_intervention — doc variants 2..6; variant 1 ('realm verb order intervention') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_order_intervention: Object.freeze([
    "a decree sending men into another town's quarrel",
    "a fight entered into on another town's behalf",
    'a distant decision arriving with soldiers behind it',
    'a local matter taken out of local hands',
    'travellers passing columns that answer to no town on this road',
  ]),

  // realm_verb_order_supply_raid — doc variants 2..6; variant 1 ('realm verb order supply raid') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_order_supply_raid: Object.freeze([
    "a decree loosing raiders on a neighbour's supply roads",
    'a slow strangling ordered from above',
    'an order aimed at granaries rather than at walls',
    'a campaign that will be felt at market before it is seen in the field',
    'carters warned off the roads a decree has marked',
  ]),

  // realm_verb_reinforce — doc variants 2..6; variant 1 ('realm verb reinforce') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_reinforce: Object.freeze([
    'a decree sending a relief column to a treaty-ally',
    "muster rolls drawn against somebody else's promise",
    'a compact honoured by decree',
    'men committed to a siege they did not choose',
    'travellers giving way to a column marching under a distant seal',
  ]),

  // realm_verb_sue_for_peace — doc variants 2..6; variant 1 ('realm verb sue for peace') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_sue_for_peace: Object.freeze([
    'a decree instructing a court to ask for terms',
    'peace sued for from above',
    'an order that ends a war somebody else was fighting',
    "terms asked for over a captain's objection",
    'travellers carrying word that the realm has called a halt',
  ]),
});

/**
 * §4b — the trade desk. Relationship-label tokens dominate this desk, and they
 * fire every tick a relationship holds — which is why almost all of them take the
 * chronic floor of eight.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const TRADE_FALLBACK_POOLS = Object.freeze({
  // allied — doc variants 2..8; variant 1 ('allied') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  allied: Object.freeze([
    'neighbours bound by a standing compact',
    'an alliance entered on both rolls',
    'a neighbour who answers when called',
    "gates that open for each other's carts without question",
    'a friendship with terms attached',
    'travellers passing freely between the pair',
    'an arrangement old enough that nobody argues it',
  ]),

  // ceasefire_commerce — doc variants 2..8; variant 1 ('ceasefire commerce') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  ceasefire_commerce: Object.freeze([
    'trade permitted while the fighting is paused',
    'commerce entered under a temporary exception',
    'carts crossing a line that soldiers may not',
    'a market that exists because the field is quiet',
    'business done in the space a truce leaves',
    'carters hurrying while the arrangement holds',
    'a season of trading against the clock',
  ]),

  // client — doc variants 2..8; variant 1 ('client') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  client: Object.freeze([
    'a town that looks to a stronger one',
    'a dependence entered on both books',
    'decisions taken elsewhere and lived with here',
    'protection that arrives with instructions',
    'the lesser partner in a partnership',
    'travellers told whose word carries here',
    'an arrangement nobody calls by its name',
  ]),

  // creditor — doc variants 2..8; variant 1 ('creditor') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  creditor: Object.freeze([
    "a town holding another's paper",
    'a claim entered and not yet called',
    'an obligation that gives one court a lever',
    'money owed and remembered',
    'a friendship with a ledger under it',
    'factors comparing whose debt is where',
    'a term coming due at the turn of the year',
  ]),

  // critical_supplier — doc variants 2..8; variant 1 ('critical supplier') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  critical_supplier: Object.freeze([
    'the one source the town cannot do without',
    'a supply the market book marks before all others',
    'a tie that would hurt to lose',
    'everything resting on a single road',
    'a dependence nobody planned and everybody uses',
    'carters running the same route year on year',
    'a season in which that road not opening would be the news',
  ]),

  // debtor — doc variants 2..8; variant 1 ('debtor') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  debtor: Object.freeze([
    'a town that owes and is known to owe',
    'an obligation entered against its name',
    'terms that will have to be met or renegotiated',
    'borrowing that has become a standing arrangement',
    'a court doing its arithmetic more often than it likes',
    'factors asking politely and then less politely',
    'a term coming due before the harvest does',
  ]),

  // diplomacy_trade — doc variants 2..8; variant 1 ('diplomacy trade') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  diplomacy_trade: Object.freeze([
    'terms settled and the roads opened with them',
    'a trade normalisation entered beside the accord',
    'commerce that follows a signature',
    'carts moving because clerks agreed',
    'an agreement whose first proof is at market',
    'carters finding the crossing simpler than last season',
    'a peace that shows up in the price of things',
  ]),

  // embargo — doc variants 2..8; variant 1 ('embargo') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  embargo: Object.freeze([
    "a town barred from another's markets",
    'a prohibition the clerks copy forward each year',
    'goods that may not lawfully move',
    'a quarrel conducted through the customs house',
    'a road open to feet and closed to cargo',
    'carters turned back with full loads',
    'a season of finding another way round',
  ]),

  // export_market — doc variants 2..8; variant 1 ('export market') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  export_market: Object.freeze([
    'the town that buys what this one makes',
    'an outward tie entered in the market book',
    'a staple with somewhere to go',
    'what the workshops here are actually for',
    'a dependence dressed up as a friendship',
    'carters running loaded one way and light the other',
    'a trading season with a fixed destination',
  ]),

  // food_anchor_lost — doc variants 2..8; variant 1 ('food anchor lost') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  food_anchor_lost: Object.freeze([
    'the mill that fed the town gone',
    "a granary struck from the town's own rolls",
    'bread that has to come from somewhere else now',
    'a shortage with a single cause',
    'a wheel that has stopped turning',
    'carters sent further for what used to be at hand',
    'a winter facing the town without its anchor',
  ]),

  // forced_tribute — doc variants 2..8; variant 1 ('forced tribute') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  forced_tribute: Object.freeze([
    'goods taken under an arrangement nobody agreed to',
    'an extraction entered as commerce',
    'trade at a price set by the stronger party',
    'a market that is really a levy',
    'wagons that go out because they must',
    'carters counting what is taken at the crossing',
    "a season's surplus decided elsewhere",
  ]),

  // indebtedness — doc variants 2..8; variant 1 ('indebtedness') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  indebtedness: Object.freeze([
    'a town living on borrowed terms',
    'obligations entered faster than they are cleared',
    "interest that has begun to shape the council's choices",
    'a treasury working for its creditors',
    'borrowing to pay the last borrowing',
    "factors watching the town's paper closely",
    'a year in which the terms outran the harvest',
  ]),

  // market_shock — doc variants 2..8; variant 1 ('market shock') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  market_shock: Object.freeze([
    'prices that moved overnight and stayed moved',
    'a market entered as disordered',
    'bargains struck yesterday that make no sense today',
    'a crash with a very short cause',
    'traders who cannot say what anything is worth',
    'carters holding loads rather than selling them',
    "a week that undid a season's reckoning",
  ]),

  // mass_migration — doc variants 2..8; variant 1 ('mass migration') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  mass_migration: Object.freeze([
    'whole districts on the road at once',
    'arrivals and departures both entered in bulk',
    'a movement no gate roll can keep up with',
    'towns emptying into towns',
    'a road that has become a settlement of its own',
    "travellers unable to find a bed for a week's ride",
    'a season that redrew where people are',
  ]),

  // mediated_commerce — doc variants 2..8; variant 1 ('mediated commerce') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  mediated_commerce: Object.freeze([
    'trade between enemies conducted through a third house',
    "commerce entered under a broker's name",
    'goods that change hands twice to change hands once',
    'a market kept open by somebody standing in the middle',
    "business done at arm's length and at a price",
    'factors who profit by the quarrel they bridge',
    'an arrangement that lasts as long as the broker does',
  ]),

  // military_supplier — doc variants 2..8; variant 1 ('military supplier') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  military_supplier: Object.freeze([
    "the house that arms a neighbour's soldiers",
    "a supply entered against a war's account",
    "iron and grain moving toward somebody else's front",
    'a trade that prospers when the fighting does',
    'a workshop with a standing order it cannot refuse',
    'carters running weapons on an ordinary road',
    "a season's making that will not come home",
  ]),

  // neutral — doc variants 2..8; variant 1 ('neutral') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  neutral: Object.freeze([
    'neighbours on speaking terms and no more',
    'a relation entered with nothing attached',
    'towns that trade a little and expect nothing',
    'an absence of quarrel and of compact both',
    'a border crossed without ceremony',
    'travellers passing without anybody asking why',
    'a standing arrangement that is mostly the lack of one',
  ]),

  // patron — doc variants 2..8; variant 1 ('patron') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  patron: Object.freeze([
    'a town that keeps a lesser one standing',
    'a patronage entered on both rolls',
    'protection given and obedience expected',
    'a stronger hand over a weaker seat',
    'an arrangement described as friendship by one side of it',
    'travellers told which court to petition for anything here',
    'a compact renewed without ever being renegotiated',
  ]),

  // population_decline — doc variants 2..8; variant 1 ('population decline') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  population_decline: Object.freeze([
    'a town with fewer in it than the last reckoning found',
    'a roll that comes back shorter than the clerk expects',
    'lanes with houses standing empty',
    'work that will not get done for want of people',
    'a settlement quietly getting older',
    'travellers remarking how much room there is now',
    'a year in which more left or were lost than arrived',
  ]),

  // population_growth — doc variants 2..8; variant 1 ('population growth') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  population_growth: Object.freeze([
    'a town bigger this year than last',
    'more names on the roll each time it is taken',
    'building going up beyond the old bounds',
    'more mouths, and more hands with them',
    'a market that has had to find more room',
    'travellers finding the outskirts changed since last time',
    'a year in which the town outgrew its own arrangements',
  ]),

  // preferred_supplier — doc variants 2..8; variant 1 ('preferred supplier') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  preferred_supplier: Object.freeze([
    'the house this town buys from first',
    'a preference entered in the market book',
    'a tie of habit as much as of terms',
    'business that goes one way without being competed for',
    'an arrangement renewed by nobody bothering to change it',
    'carters running a route they could run asleep',
    'a standing order that survives most seasons',
  ]),

  // proxy — doc variants 2..8; variant 1 ('proxy') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  proxy: Object.freeze([
    "courts fighting through other people's towns",
    'a quarrel recorded under two names and owned by neither',
    'soldiers paid by one court and sworn to another',
    'a war conducted at a polite distance',
    "somebody else's men doing somebody else's fighting",
    'travellers unsure whose quarrel they have wandered into',
    'a conflict everyone can see and nobody has declared',
  ]),

  // relationship_label_change — doc variants 2..8; variant 1 ('relationship label change') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  relationship_label_change: Object.freeze([
    'neighbours calling each other something new',
    'a relation struck and re-entered under another name',
    'a tie the record now describes differently',
    'a change of standing between neighbours',
    'an old arrangement given a new word',
    'travellers finding the crossing works differently than it did',
    'a turn in a long acquaintance',
  ]),

  // compound_calling_of_debts — doc variants 2..4; variant 1 ('compound calling of debts') is the live
  // anchor and is NOT stored here. CADENCE major/rare → floor 4 · live 1 · +3.
  compound_calling_of_debts: Object.freeze([
    'a crash, and the creditors calling anyway',
    'debts made unpayable and demanded in the same season',
    'pledged property being seized ahead of rivals',
  ]),

  // realm_verb_declare_trade_embargo — doc variants 2..6; variant 1 ('realm verb declare trade embargo') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_declare_trade_embargo: Object.freeze([
    "a decree barring a neighbour's goods",
    'a market closed by a court that does not buy in it',
    'a bar on trade the realm will not have to enforce itself',
    'a ruling the stallholders feel before they read it',
    'carters turned back by a decree made far away',
  ]),

  // realm_verb_force_resettle — doc variants 2..6; variant 1 ('realm verb force resettle') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_force_resettle: Object.freeze([
    "a decree moving a settlement's people",
    'a village emptied into a place chosen for it',
    'households told where they will live next',
    'a map redrawn by writ',
    'travellers passing a column moving under orders',
  ]),

  // realm_verb_repudiate_treaty — doc variants 2..6; variant 1 ('realm verb repudiate treaty') is the live
  // anchor and is NOT stored here. CADENCE notable → floor 6 · live 1 · +5.
  realm_verb_repudiate_treaty: Object.freeze([
    'a decree tearing up an accord',
    'a signature made worthless from a long way off',
    'terms struck out by a hand that never signed them',
    'an oath ended by decree rather than by breach',
    'travellers finding a crossing closed that was open last season',
  ]),
});

/**
 * §4c — the faith desk. LAW ONE governs every line: temples, chapters and
 * believers act; the god never does. Note that `major`, `minor` and `pantheon` are
 * DEITY-TIER tokens, not adjectives — their computed fallbacks are the bare words, which
 * is precisely the unvoiced defect this corpus cures.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const FAITH_FALLBACK_POOLS = Object.freeze({
  // cult — doc variants 2..8; variant 1 ('cult') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  cult: Object.freeze([
    'a small following that keeps to itself',
    'an observance entered at the fringe of the register',
    'a rite kept behind a closed door',
    'a faith with more conviction than numbers',
    'a gathering the parish clerk cannot quite account for',
    'travellers noticing marks on doorposts they do not know',
    'a following that has outlasted several predictions of its end',
  ]),

  // major — doc variants 2..8; variant 1 ('major') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  major: Object.freeze([
    'a pillar of the pantheon',
    'an observance the register puts first',
    'a rite the whole town keeps whether it believes or not',
    'the faith the council schedules around',
    'a temple everybody can find without asking',
    'travellers told which festival they have arrived in time for',
    'a calendar that shapes the working year',
  ]),

  // minor — doc variants 2..8; variant 1 ('minor') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  minor: Object.freeze([
    "a lesser god's observance",
    'a rite entered below the great ones in the register',
    'a chapel with a steady congregation and no ambitions',
    'a faith kept by the households that have always kept it',
    'an altar tended by the same family for generations',
    'travellers finding a shrine they had not heard of',
    'a feast day that only part of the town keeps',
  ]),

  // pantheon — doc variants 2..8; variant 1 ('pantheon') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  pantheon: Object.freeze([
    "the whole company of a town's gods",
    "the register's full list of observances",
    'a calendar of rites that has to be fitted together',
    'temples that share a town and argue about precedence',
    'the arrangement of faiths a settlement lives inside',
    'travellers working out which altar answers which need',
    "a year's worth of festivals with their own politics",
  ]),

  // compound_gods_abandonment — doc variants 2..4; variant 1 ('compound gods abandonment') is the live
  // anchor and is NOT stored here. CADENCE major/rare → floor 4 · live 1 · +3.
  compound_gods_abandonment: Object.freeze([
    'hunger, plague, and a fracturing faith feeding one another',
    'flagellants walking between the afflicted towns',
    'scapegoats named from pulpits and prophets nobody ordained',
  ]),
});

/**
 * §4d — the divination desk. Five forecast/pressure tokens, under BELIEF
 * ATTRIBUTION: every variant reads as what is feared, counted or seen, never as engine
 * truth about what will happen.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const DIVINATION_FALLBACK_POOLS = Object.freeze({
  // crime_pressure — doc variants 2..8; variant 1 ('crime pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  crime_pressure: Object.freeze([
    'what the watch expects before it happens',
    'a drift toward lawlessness the record keeps confirming',
    'conditions that usually end in a crime wave',
    'a town that feels less safe than the tally says',
    'more locks bought than incidents reported',
    'travellers picking up warnings before they see cause',
    'a winter the watch is already dreading',
  ]),

  // disease_pressure — doc variants 2..8; variant 1 ('disease pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  disease_pressure: Object.freeze([
    'conditions that sickness usually follows',
    'a health mark the record keeps moving the wrong way',
    'crowding, hunger, and bad water in one place',
    'what the healers are quietly preparing for',
    'a town one bad season from an outbreak',
    'travellers advised to water their horses elsewhere',
    'a summer everybody is watching more closely than usual',
  ]),

  // food_pressure — doc variants 2..8; variant 1 ('food pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  food_pressure: Object.freeze([
    'stores that will not reach the next harvest',
    'a food reading the record shows falling',
    'arithmetic the reeve has done and does not like',
    'what comes before hunger',
    'a town counting further ahead than it usually does',
    'carters asked what grain costs three valleys over',
    'a spring measured against a granary',
  ]),

  // legitimacy_pressure — doc variants 2..8; variant 1 ('legitimacy pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  legitimacy_pressure: Object.freeze([
    'a seat being obeyed a little less each season',
    'a standing the record shows slipping',
    'orders that men are said to be waiting out rather than obeying',
    'men beginning to ask who decided that',
    'a council that has started explaining itself',
    'travellers hearing the seat spoken of without much respect',
    'a year in which authority thinned quietly',
  ]),

  // regional_pressure — doc variants 2..8; variant 1 ('regional pressure') is the live
  // anchor and is NOT stored here. CADENCE chronic → floor 8 · live 1 · +7.
  regional_pressure: Object.freeze([
    'trouble building somewhere up the road',
    'a reading taken from the whole district and not this town',
    'what the neighbours are carrying that will arrive here',
    'a strain that is not local yet and will be',
    'news from three directions saying the same thing',
    'travellers arriving with worse reports each week',
    'a season in which the whole district is uneasy',
  ]),
});

/**
 * THE SINGLE MAP THE SELECTOR READS — all 107 §4 kinds, this file's four desks plus the
 * events desk merged in from the sibling leaf. `settlementRumors.js` imports this and
 * nothing else from the family.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const FALLBACK_PHRASE_POOLS = Object.freeze({
  ...WAR_FALLBACK_POOLS,
  ...TRADE_FALLBACK_POOLS,
  ...FAITH_FALLBACK_POOLS,
  ...DIVINATION_FALLBACK_POOLS,
  ...EVENTS_FALLBACK_POOLS,
});

/*
 * ── THE DESK ROSTERS ────────────────────────────────────────────────────────────────────
 * The blast radius of this wiring is exactly the concatenation below. A token absent from
 * it renders today exactly as it rendered before the retrofit, seeded or not.
 */

/**
 * §4a roster in doc order. AUTHORED, never `Object.keys(...)` — an independent
 * denominator, so a kind silently dropped from the map cannot shrink the census and its
 * own coverage together.
 * @type {ReadonlyArray<string>}
 */
export const WAR_FALLBACK_KINDS = Object.freeze([
  'alliance_burden',
  'ally_burden',
  'army_deployed',
  'casus_declared',
  'cold_war',
  'cold_war_sanctions',
  'cold_war_supply_sanctions',
  'convoy_ordered',
  'hostile',
  'hostile_raid',
  'intercept_ordered',
  'intervention_ordered',
  'military_protection',
  'occupation',
  'occupation_burden',
  'occupation_burden_cleared',
  'occupation_resistance',
  'peace_sued',
  'rebellion_vassal',
  'reinforcement_cost',
  'reinforcement_ordered',
  'realm_verb_declare_blockade',
  'realm_verb_declare_casus',
  'realm_verb_intercept',
  'realm_verb_order_convoy',
  'realm_verb_order_intervention',
  'realm_verb_order_supply_raid',
  'realm_verb_reinforce',
  'realm_verb_sue_for_peace',
]);

/**
 * §4b roster in doc order. AUTHORED, never `Object.keys(...)` — an independent
 * denominator, so a kind silently dropped from the map cannot shrink the census and its
 * own coverage together.
 * @type {ReadonlyArray<string>}
 */
export const TRADE_FALLBACK_KINDS = Object.freeze([
  'allied',
  'ceasefire_commerce',
  'client',
  'creditor',
  'critical_supplier',
  'debtor',
  'diplomacy_trade',
  'embargo',
  'export_market',
  'food_anchor_lost',
  'forced_tribute',
  'indebtedness',
  'market_shock',
  'mass_migration',
  'mediated_commerce',
  'military_supplier',
  'neutral',
  'patron',
  'population_decline',
  'population_growth',
  'preferred_supplier',
  'proxy',
  'relationship_label_change',
  'compound_calling_of_debts',
  'realm_verb_declare_trade_embargo',
  'realm_verb_force_resettle',
  'realm_verb_repudiate_treaty',
]);

/**
 * §4c roster in doc order. AUTHORED, never `Object.keys(...)` — an independent
 * denominator, so a kind silently dropped from the map cannot shrink the census and its
 * own coverage together.
 * @type {ReadonlyArray<string>}
 */
export const FAITH_FALLBACK_KINDS = Object.freeze([
  'cult',
  'major',
  'minor',
  'pantheon',
  'compound_gods_abandonment',
]);

/**
 * §4d roster in doc order. AUTHORED, never `Object.keys(...)` — an independent
 * denominator, so a kind silently dropped from the map cannot shrink the census and its
 * own coverage together.
 * @type {ReadonlyArray<string>}
 */
export const DIVINATION_FALLBACK_KINDS = Object.freeze([
  'crime_pressure',
  'disease_pressure',
  'food_pressure',
  'legitimacy_pressure',
  'regional_pressure',
]);

/**
 * Every fallback-voiced kind this retrofit wires, desk by desk in doc order. Together with
 * `WIRED_DESK_KINDS` from `rumorPhrasePools.js` this is the whole R1 blast radius: 63
 * authored-anchor kinds plus these 107, which is all 170 R1 pools the corpus carries.
 * @type {ReadonlyArray<string>}
 */
export const FALLBACK_WIRED_KINDS = Object.freeze([
  ...WAR_FALLBACK_KINDS,
  ...TRADE_FALLBACK_KINDS,
  ...FAITH_FALLBACK_KINDS,
  ...DIVINATION_FALLBACK_KINDS,
  ...EVENTS_FALLBACK_KINDS,
]);
