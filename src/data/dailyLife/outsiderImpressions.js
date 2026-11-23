/**
 * data/dailyLife/outsiderImpressions.js — THE `outsider_impressions` POOLS (DAILY-1 `lines/L2/LINES-2.md` § 3, revised
 * by `lines/L2/LINES-2b.md` § 3 and § 4, as the chair ruled: 18:47 (ruling 8: the defence's order and supply ratings are
 * no threat; the order lines live in `services.defense`; the four supply lines and `hidden.arcane_instability` cut; the
 * power part only where the top power clearly leads), 18:56 (ruling 11: every line declared in the vocabulary's own
 * atoms, `facts/factVocabulary.js`) and 19:03 (ruling 15: `power.level` carries FOUR lines)).
 *
 * `OUTSIDER_IMPRESSIONS`: one frozen array a branch; a line is a whole sentence, `{ id, text, needs, excludes? }` as in
 * `childWarnings.js`; the id is its number in LINES-2 § 3 (LINES-2b § 3 for the order lines of `services.defense`,
 * § 4 for `power.level`). The slot says up to three parts, each its own sentence, joined by a space:
 * - THE POWER PART: the top power (`deriveAllFactionProfiles`, highest power), never a veiled one (`people/cardVeil.js ::
 *   isVeiledPower`, a criminal power among them: then nothing is said). Where it CLEARLY LEADS (`facts/leaderLead.js ::
 *   leaderLeadOfRecord(r).leadOverSecond` over 6, or no second power: the `topTwoGap <= 6` cut the standing line holds
 *   before "No one clearly leads here") the branch `power`, naming it: `{power}` is its name with its article
 *   (`display/powerSentenceName.js :: powerNameWithArticle`), `{Power}` the same at a sentence's head,
 *   `{power|one|many}` a verb in the name's number (`fillAgreement`); NO line puts "'s" on the name (D4C-1, the chair's
 *   E133 (3): a name may itself hold one, "the Headman's Authority's mark"; P0 says "the mark of {power}";
 *   `tests/lint/dailyLifePossessive.walker.test.js`). Else the branch `power.level`, naming no one.
 * - THE THREAT PART: the most severe OPEN threat that is not a defence RATING (the order and supply ratings
 *   `threatProfile.js` raises from `defenseProfile.scores`, "Civic stability at risk" and "Economic fragility", are no
 *   threat: THE CALM RULE), band above low, said as an outsider sees it: `threat.<kind>.<form>`. A hidden or rumoured
 *   threat is not seen by a visitor and is never said (ruling 7).
 * - THE SECOND PART: at a place with no real threat said, ONE part by the keyed pick among the strained VISIBLE lenses
 *   (`capacityModel.js :: VISIBLE_CAPACITY_LENSES`, `services.<lens>`) and `ordinary`; at a place with one, a strained
 *   visible lens where three or more of the nine capacities are strained (today's trigger), without `ordinary`.
 * No line names a house by its roster name (they name kinds: "the watch" needs `watch`, "the healers" a sick house,
 * "guards" a guard presence, "bells" a sacred house, "streets" a place larger than a hamlet); "{gov}" is the
 * government's label with its article (`government named`). No line says "town". No line needs a hideable house or a
 * crime atom (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * NOT BUILT (a need with no atom, ruling 10; `dailyLifeAtoms.test.js :: NOT_GRANTED`): power #9 "Trade here runs through
 * {power}, …" (`power.merchant`), #10 "The faith is everywhere here, and {power} {power|is|are} plainly its voice."
 * (`power.religious`), #11 "Guards answering to {power} are among the first faces a visitor meets." (`power.military`):
 * the dominant power's archetype has no fact home.
 * NOT BUILT (a walker's reading whose cure is a rewording, the chair's): services.defense #8 "A visitor gets the sense
 * that order here is kept by habit rather than by force." (the style law strikes "rather than"); threat.famine.any #1
 * "Food is short here, and nobody has much to spare for a stranger." (the presumption-classes walker reads "to spare" as
 * the `plenty` class, which a famine threat does not answer); power #7 "The name a stranger hears most often in any
 * dealing here is {power}." and services.defense #5 "Order here is kept lightly, and a stranger notices how little
 * stands behind it." (the style law strikes "a stranger", and its ratchet only falls); services.administrative #0
 * "Getting an answer from {gov} takes patience, and a visitor needs plenty of it." (the presumption-classes walker reads
 * "plenty" as the `plenty` class); services.defense #9 "A visitor looks in vain for a watchman; there is none." (the
 * presumed-things walker reads it as NAMING a watchman, not as denying one, so no declaration answers it).
 * STRICTER NEEDS THAN LINES-2 WROTE (the walkers' own cure, a line declares what it presumes; wordings unchanged):
 * threat.siege.any #0, #2 ("under siege", "the siege") need a siege in force (`crisis: under_siege`); monster overrun #0
 * and frontier #4 ("traveller(s)") and economic route #0, #1 ("a trade route") need a route (`route open`).
 * A line with no true need is not eligible; each branch keeps the rest.
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-1.md`,
 * taken 2026-11-22 21:55 UTC): power P12 to P14, power.level V4 and V5, frontier MF7 to MF9, services.defense D15,
 * each appended at its branch's end, its keyed pick unchanged (`tests/domain/dailyLifeNewLines.test.js`).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string>, readonly excludes?: ReadonlyArray<string> }} OutsiderLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[], excludes?: string[] }>} lines @returns {ReadonlyArray<OutsiderLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({
  ...l, needs: Object.freeze([...l.needs]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}),
})));

/** The pools by branch. */
export const OUTSIDER_IMPRESSIONS = Object.freeze({
  /** the top power, not veiled, clearly leading: named. */
  power: frozen([
    { id: 'P0', text: 'Outsiders notice the mark of {power} on every door that matters.', needs: [] },
    { id: 'P1', text: 'A visitor soon learns that little happens here without {power}.', needs: [] },
    { id: 'P2', text: 'Ask who decides things here, and the answer is {power}.', needs: [] },
    { id: 'P3', text: 'Strangers with business here are sent to {power} sooner or later.', needs: [] },
    { id: 'P4', text: 'It does not take a visitor long to see who holds sway here: {power}.', needs: [] },
    { id: 'P5', text: 'Whatever a visitor wants done, {power} {power|has|have} a say in it.', needs: [] },
    { id: 'P6', text: 'Visitors learn early that it pays to stay on good terms with {power}.', needs: [] },
    { id: 'P8', text: '{Power} {power|carries|carry} the most weight here, and nobody pretends otherwise.', needs: [] },
    { id: 'P12', text: 'A visitor who wants anything settled here is told to speak to {power} first.', needs: [] },
    { id: 'P13', text: 'Nothing of weight is agreed here without the leave of {power}.', needs: [] },
    { id: 'P14', text: 'Newcomers soon notice how often talk here comes round to {power}.', needs: [] },
  ]),
  /** the top power, not veiled, NOT clearly leading (a lead over the second of 6 or less): no one named (ruling 15). */
  'power.level': frozen([
    { id: 'V0', text: 'Ask who decides things here, and a visitor hears more than one name.', needs: [] },
    { id: 'V1', text: 'No single name comes up first when a visitor asks who holds sway here.', needs: [] },
    { id: 'V2', text: 'Several powers carry weight here, and a visitor soon learns not to assume which one matters most.', needs: [] },
    { id: 'V3', text: 'A visitor finds more than one door to knock on before anything is decided here.', needs: [] },
    { id: 'V4', text: 'Power here does not sit in one pair of hands, and a visitor learns to ask around.', needs: [] },
    { id: 'V5', text: 'There is no single master here, and getting anything done means winning over more than one side.', needs: [] },
  ]),
  /** a Leadership-void condition (`dominant_npc_removed`) raised as an unrest threat. */
  'threat.unrest.void': frozen([
    { id: 'UV0', text: 'The place has lost a leading figure, and visitors hear a good deal about who comes next.', needs: [] },
    { id: 'UV1', text: 'With a leading figure gone, a visitor finds people unsure whose word counts now.', needs: [] },
  ]),
  /** an unrest threat from a stressor or the record's own threats. */
  'threat.unrest.stressor': frozen([
    { id: 'US0', text: 'The place is unsettled, and a visitor feels it in the way people talk.', needs: [] },
    { id: 'US1', text: 'Tempers are short here, and strangers are watched with some care.', needs: [] },
  ]),
  /** a `trade_route_cut` condition raised as an economic threat. */
  'threat.economic_collapse.route': frozen([
    { id: 'ER0', text: 'A trade route the place relies on has been cut, and visitors hear about it at once.', needs: ['route open'] },
    { id: 'ER1', text: 'With a trade route cut, goods are scarce and a visitor notices the gaps.', needs: ['route open'] },
  ]),
  /** an economic threat from a stressor or the record's own threats. */
  'threat.economic_collapse.stressor': frozen([
    { id: 'ES0', text: 'Trade here is in a bad way, and a visitor can hear it in the quiet.', needs: [] },
    { id: 'ES1', text: 'Money is tight and business is slow, and it shows.', needs: [] },
  ]),
  /** `config.monsterThreat` 'plagued' ("Region overrun with monsters"). */
  'threat.monster_pressure.overrun': frozen([
    { id: 'MO0', text: 'Every traveller who arrives here has something to say about the beasts in the country around.', needs: ['route open'] },
    { id: 'MO1', text: 'People here do not travel the country around alone, and they warn visitors not to either.', needs: [] },
    { id: 'MO2', text: 'The country around is overrun with beasts, and visitors are told so almost at once.', needs: [] },
    { id: 'MO3', text: 'Talk of beasts on the roads is the first thing a visitor hears.', needs: [] },
    { id: 'MO4', text: 'Visitors are asked which way they came, and whether they met anything on the way.', needs: [] },
    { id: 'MO5', text: 'People keep close to home here, for the country around is thick with beasts.', needs: [] },
  ]),
  /** `config.monsterThreat` 'frontier' ("Frontier monster pressure"). */
  'threat.monster_pressure.frontier': frozen([
    { id: 'MF0', text: 'This is frontier country, and people speak of the wild beyond as close at hand.', needs: [] },
    { id: 'MF1', text: 'Visitors are told to keep to the roads and not to wander off them.', needs: [] },
    { id: 'MF2', text: 'People here keep an eye on the wild country and mention it often.', needs: [] },
    { id: 'MF3', text: 'The wild is not far off, and visitors hear stories of what comes out of it.', needs: [] },
    { id: 'MF4', text: 'Travellers here talk of beasts seen at the edge of the settled land.', needs: ['route open'] },
    { id: 'MF5', text: 'A visitor soon learns that the country beyond is not to be walked carelessly.', needs: [] },
    { id: 'MF6', text: 'Frontier habits show here: people go out in company and come back before dark.', needs: [] },
    { id: 'MF7', text: 'People here are used to living close to the wild, and they tell a visitor where not to go.', needs: [] },
    { id: 'MF8', text: 'Living this near the wild has made people watchful, and a visitor notices it.', needs: [] },
    { id: 'MF9', text: 'People here know the wild country well, and they warn a visitor not to go far into it.', needs: [] },
  ]),
  /** a monster threat from a stressor or the record's own threats. */
  'threat.monster_pressure.stressor': frozen([
    { id: 'MS0', text: 'There are beasts and raiders about, and visitors are warned to travel in company.', needs: [] },
    { id: 'MS1', text: 'People are wary of the roads, where beasts and raiders have both been seen.', needs: [] },
  ]),
  'threat.plague.any': frozen([
    { id: 'PL0', text: 'There is sickness in the place, and visitors are kept at a polite distance.', needs: [] },
    { id: 'PL1', text: 'People here are wary of fevers, and a visitor who coughs is watched.', needs: [] },
    { id: 'PL2', text: 'A visitor notices doors kept shut and people keeping apart for fear of sickness.', needs: [] },
    { id: 'PL3', text: 'Sickness is about, and the healers have their hands full.', needs: ['sick house'] },
  ]),
  'threat.famine.any': frozen([
    { id: 'FA0', text: 'Hunger is in the place, and a visitor sees it in thin faces.', needs: [] },
    { id: 'FA2', text: 'Food is scarce, and a visitor is offered little and asked to pay well for it.', needs: ['market'] },
  ]),
  'threat.siege.any': frozen([
    { id: 'SI0', text: 'The place is under siege, and every stranger is looked at twice.', needs: ['crisis: under_siege'] },
    { id: 'SI1', text: 'With enemies at hand, people here are tense and slow to trust a newcomer.', needs: [] },
    { id: 'SI2', text: 'The siege is the first thing anyone talks about, and the last.', needs: ['crisis: under_siege'] },
  ]),
  'threat.bandit_raids.any': frozen([
    { id: 'BR0', text: 'People are wary of the roads, where raiders have been at work.', needs: [] },
    { id: 'BR1', text: 'Visitors are asked about the road and whether anyone followed them.', needs: [] },
  ]),
  'threat.rival_neighbor.any': frozen([
    { id: 'RN0', text: 'There is bad blood with a neighbouring place, and it comes up in conversation soon enough.', needs: [] },
    { id: 'RN1', text: 'People here speak sharply of their neighbours, and visitors learn not to take sides.', needs: [] },
  ]),
  'threat.arcane_instability.any': frozen([
    { id: 'AI0', text: 'People here are uneasy about magic, and a visitor notices how they speak of it.', needs: ['magic'] },
    { id: 'AI1', text: 'Something is wrong with the magic here, and people would rather a visitor did not ask.', needs: ['magic'] },
  ]),
  /** the healing lens strained. */
  'services.healing': frozen([
    { id: 'H0', text: 'Anyone who falls ill here waits a long while to be seen.', needs: ['sick house'] },
    { id: 'H1', text: 'The healers have more sick to see than they can manage.', needs: ['sick house'] },
    { id: 'H2', text: 'There is no healer here, and the sick are nursed at home.', needs: [], excludes: ['sick house'] },
    { id: 'H3', text: 'Nobody here heals by trade, and a visitor who falls ill must make do.', needs: [], excludes: ['sick house'] },
    { id: 'H4', text: 'Care for the sick is short here, and people know better than to fall ill.', needs: [] },
    { id: 'H5', text: 'The sick are not well provided for here, and a visitor notices it.', needs: [] },
    { id: 'H6', text: 'Those who fall ill here cannot count on much care.', needs: [] },
    { id: 'H7', text: 'Anyone who falls ill here is nursed by family, for there is no healer to send for.', needs: [], excludes: ['sick house'] },
    { id: 'H8', text: 'A visitor who falls sick here will find no healer to call on.', needs: [], excludes: ['sick house'] },
    { id: 'H9', text: 'Sickness is something people here deal with at home, as best they can.', needs: [], excludes: ['sick house'] },
  ]),
  /** the administrative lens strained. */
  'services.administrative': frozen([
    { id: 'A1', text: 'Business with {gov} moves slowly; there are more matters than hands to deal with them.', needs: ['government named'] },
    { id: 'A2', text: 'Petitions and permissions take a long time here, and visitors are told to wait.', needs: [] },
    { id: 'A3', text: 'Any business with {gov} means a long wait, and visitors are warned of it.', needs: ['government named'] },
    { id: 'A4', text: 'Matters brought to {gov} pile up faster than they are settled.', needs: ['government named'] },
    { id: 'A5', text: 'Getting anything decided here takes time, for those who decide are few and busy.', needs: [] },
    { id: 'A6', text: 'A visitor who needs a ruling or a permission should expect to wait for it.', needs: [] },
  ]),
  /** the food lens strained. */
  'services.food_production': frozen([
    { id: 'F0', text: 'Food is not plentiful, and a visitor is fed but not feasted.', needs: [] },
    { id: 'F1', text: 'A visitor notices that food is counted carefully here.', needs: [] },
    { id: 'F2', text: 'Visitors find food dear here, and portions smaller than they expected.', needs: ['market'] },
  ]),
  /** the defence lens strained: its own three lines, then the ORDER lines (LINES-2b § 3, folded in from the retired
   * `threat.unrest.order`, said only here). */
  'services.defense': frozen([
    { id: 'D0', text: 'The watch is stretched thin, and a visitor can tell.', needs: ['watch'] },
    { id: 'D1', text: 'Nobody stands guard here, and a visitor walks in unchallenged.', needs: [], excludes: ['guardPresence'] },
    { id: 'D2', text: 'Its defences are thin, and a visitor sees how little stands ready.', needs: [] },
    { id: 'D3', text: 'There is little here to keep order, and a visitor can see it.', needs: [] },
    { id: 'D4', text: 'Keeping the peace here rests on goodwill more than on any force.', needs: [] },
    { id: 'D6', text: 'Order here depends on people keeping it among themselves.', needs: [] },
    { id: 'D7', text: 'The means of keeping order here are slight, and a visitor sees it soon enough.', needs: [] },
    { id: 'D10', text: 'A visitor sees no one whose task it is to keep order.', needs: [], excludes: ['guardPresence'] },
    { id: 'D11', text: 'Nobody here is paid to keep the peace, and it shows.', needs: [], excludes: ['guardPresence'] },
    { id: 'D12', text: 'The watch is small for the ground it has to cover.', needs: ['watch'] },
    { id: 'D13', text: 'Few of the watch are about, and a visitor wonders how they keep order with so few.', needs: ['watch'] },
    { id: 'D14', text: 'Those who keep order here are spread thin, and a visitor can tell.', needs: ['guardPresence'] },
    { id: 'D15', text: 'There is not much here to stop trouble once it starts, and people know it.', needs: [] },
  ]),
  /** the magical lens strained. */
  'services.magical': frozen([
    { id: 'G0', text: 'Those who work magic here have more asked of them than they can give.', needs: ['magic'] },
    { id: 'G1', text: 'Magical help is hard to come by here, however much it is wanted.', needs: ['magic'] },
  ]),
  /** one of the keyed options of the second part at a place with no real threat. */
  ordinary: frozen([
    { id: 'O0', text: 'The settlement reads to outsiders as ordinary. Quiet streets, predictable bells, faces that don\'t yet know yours.', needs: ['tier: ≥ village', 'sacredHouse'] },
    { id: 'O1', text: 'Outsiders find the place ordinary: quiet, unremarkable, and in no hurry.', needs: [] },
    { id: 'O2', text: 'Nothing about the place strikes a visitor as out of the way.', needs: [] },
    { id: 'O3', text: 'A visitor finds nothing much to remark on, which suits the people here.', needs: [] },
  ]),
});

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 * Here: the power part states the lead (`power:lead`, `power:no-clear-lead`); `threat.<kind>.<form>` states
 * `threat:<kind>`; `services.food_production` `food:want`, `services.defense` `defence:want`, any other
 * `services.<lens>` `cap:<lens>:want`; `ordinary` is the quiet as a visitor finds it.
 */
/** @param {string} b @returns {{ states: string } | { consequence: true }} */
const outsiderDoes = (b) => (b === 'power' ? { states: 'power:lead' } : b === 'power.level' ? { states: 'power:no-clear-lead' }
  : b.startsWith('threat.') ? { states: `threat:${b.split('.')[1]}` }
  : b === 'services.food_production' ? { states: 'food:want' } : b === 'services.defense' ? { states: 'defence:want' }
  : b.startsWith('services.') ? { states: `cap:${b.slice('services.'.length)}:want` } : { consequence: true });
export const OUTSIDER_IMPRESSIONS_DOES = Object.freeze(Object.fromEntries(Object.keys(OUTSIDER_IMPRESSIONS).map((b) => [b, Object.freeze(outsiderDoes(b))])));
