/**
 * data/tensionCauses.js — WHY THE TROUBLE IS HERE: the causes of eight tension kinds, and their wordings (PAGE-7, the
 * brief `docs/chair/2026-11-20/content/page/briefs/CAUSES-DATA.md` at 9e4ba24b6 and its addendum; the chair's shape of
 * 15:10 UTC and rulings of 15:18). DATA ONLY: no function, no pattern. Vetoable wording (the owner's).
 *
 * THE SOURCES. The causes, their ranks and their predicates are the chair's rulings of 14:21 and 14:33
 * (`PAGE-5-HANDBACK.md` §4-5, origin/lane/page-5-2026-11-20, verbatim from `measures/page-5/sim.mjs`). Every wording is
 * the chair's, copied verbatim and in the files' own order from `lines/CAUSES-LINES-A.md` and `lines/CAUSES-LINES-B.md`
 * (f8ee0ed50) and `lines/CAUSES-crime_wave-guild_conflict.md` (19e7f7932; `old_crime_wave` dropped, no lines).
 *
 * THE SHAPE. `TENSION_CAUSES[kind] = { causes, plain }`:
 *   causes   in the ruled order, each `{ id, rank, holds, hideable, wordings }`:
 *              rank      1: the trouble's own engine (a stress, a band, a past event of the kind, who holds the hall, a
 *                        rival power, rival rings); 2: a standing feature (a house, the route, the water);
 *              holds     the key of the predicate (`domain/display/tensionCauseHolds.js :: TENSION_CAUSE_HOLDS`) that
 *                        says the cause holds in the document in hand;
 *              hideable  see below;
 *              wordings  three for a cause that speaks for more than about a quarter of its kind (the ruled `WORDS`),
 *                        two for the others;
 *   plain    the wordings where no cause holds: three a kind, four for great_flood.
 *   withoutItsHouse  guild_conflict only (the chair's ruling of 15:35, addendum 2 of the brief): where the guild's home
 *            (`facts/guild.js :: guildOf`, factsOf's `guild`) answers no on the document in hand, this one sentence is
 *            used and NO cause and NO plain line, read before the ranks (the quarrel stands without a guild to have it).
 * `{power}` (outside_debt's `merchants_rule` only) is the governing power's name, filled by the reader
 * (`domain/display/tensionCause.js`); a cause whose wordings hold `{power}` does not hold where it cannot be filled.
 *
 * THE READER (`tensionCause.js :: tensionCauseSentenceOf`): the rank-1 causes that hold, one picked by keyed hash; only if
 * none, the same among rank 2; else plain; then the wording by keyed hash.
 *
 * ⛔ HIDEABLE (the chair's rulings of 14:21, 14:33 and 15:18). A CAUSE HOLDS ONLY WHERE THE DOCUMENT IN HAND SHOWS IT,
 * ONE RULE FOR EVERY AUDIENCE: the predicate reads the document it is handed (the DM's whole record, or the shared
 * document with its hidden houses and powers already gone), never a fuller one. `hideable: true` marks a cause whose
 * predicate reads a criminal or covert house, a criminal power, the roster of powers at all, the law band or the force
 * that keeps order. It is a LIST for the security reader at the join, NOT A BRANCH: nothing reads it to choose a line.
 *
 * Pure data. No draw.
 */

/**
 * @typedef {object} TensionCause
 * @property {string} id the cause's ruled name
 * @property {1 | 2} rank 1: the trouble's own engine; 2: a standing feature
 * @property {string} holds the key of its predicate in `TENSION_CAUSE_HOLDS`
 * @property {boolean} hideable the security reader's list (never a branch)
 * @property {ReadonlyArray<string>} wordings the chair's wordings, in the lines file's order
 */
/** @typedef {{ causes: ReadonlyArray<Readonly<TensionCause>>, plain: ReadonlyArray<string>, withoutItsHouse?: string }} TensionCauseTable */

/** @type {Readonly<Record<string, Readonly<TensionCauseTable>>>} */
export const TENSION_CAUSES = Object.freeze({
  crime_wave: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'criminal_power', rank: 1, holds: 'criminalPowerSeated', hideable: true, wordings: Object.freeze([
        'Crime is rising, and a criminal power is counted among the powers of this place.',
        'The powers of this place include a criminal one, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'law_thin', rank: 1, holds: 'lawCriticalOrCollapsed', hideable: true, wordings: Object.freeze([
        'Crime is rising, and the law here is too weak to hold it back.',
        'The law in this place has broken down or come close to it, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'rival_rings', rank: 1, holds: 'rivalRings', hideable: true, wordings: Object.freeze([
        'Crime is rising as rival rings work this place and no one of them rules the rest.',
        'More than one criminal crew operates here, none master of the others, and crime is rising.',
        'With rival rings at odds and no single organisation over them, crime here is rising.',
      ]) }),
      Object.freeze({ id: 'no_force', rank: 1, holds: 'noForceKept', hideable: true, wordings: Object.freeze([
        'Crime is rising, and the place keeps no garrison, watch or militia to answer it.',
        'With no watch, no militia and no garrison of its own, this place sees crime rising.',
      ]) }),
      Object.freeze({ id: 'force_unpaid_or_cut', rank: 1, holds: 'forceUnpaidOrCut', hideable: true, wordings: Object.freeze([
        'Crime is rising, and those who keep order here serve unpaid, or on pay that is short or has been cut.',
        'The force that keeps order goes unpaid, or its pay falls short or has been cut, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'thieves_house', rank: 2, holds: 'thievesGuildHouse', hideable: true, wordings: Object.freeze([
        "Crime is rising, and a thieves' guild works out of this place.",
        "A thieves' guild has a footing here, and crime is rising.",
      ]) }),
      Object.freeze({ id: 'contraband_water', rank: 2, holds: 'smugglingByWater', hideable: true, wordings: Object.freeze([
        'Crime is rising here, where smuggling goes on and boats can come and go by water.',
        'Smugglers ply their trade here, boats can reach the place by water, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'underground', rank: 2, holds: 'undergroundHouse', hideable: true, wordings: Object.freeze([
        'Crime is rising, and tunnels beneath the place give it somewhere to hide.',
        'Those outside the law have tunnels beneath this place, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'assassins', rank: 2, holds: 'assassinsHouse', hideable: true, wordings: Object.freeze([
        'Crime is rising, and killing can be bought here.',
        'In this place a killer can be hired, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'black_market', rank: 2, holds: 'blackMarketHouse', hideable: true, wordings: Object.freeze([
        'Crime is rising, and there is a black market here.',
        'Illicit goods change hands at a black market in this place, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'whisper_market', rank: 2, holds: 'whisperMarketHouse', hideable: true, wordings: Object.freeze([
        'Crime is rising, and a whisper market here buys and sells what people know.',
        'There is a whisper market in this place, and crime is rising.',
      ]) }),
      Object.freeze({ id: 'outlaws_near', rank: 2, holds: 'outlawsHouse', hideable: true, wordings: Object.freeze([
        'Crime is rising, and someone here deals with thieves or outlaws.',
        'Those outside the law have a contact or a hiding place here, and crime is rising.',
      ]) }),
    ]),
    plain: Object.freeze([
      'Crime is on the rise here.',
      'There is more crime in this place than there was, and it is still growing.',
      'Crime here keeps climbing.',
    ]),
  }),
  guild_conflict: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'old_guild_war', rank: 1, holds: 'pastGuildConflict', hideable: false, wordings: Object.freeze([
        'Trade has been fought over here before, in an earlier guild war, and now the guild and those outside it are at odds.',
        'The place has had a guild war in its past, and the fight over trade has opened again.',
      ]) }),
      Object.freeze({ id: 'guilds_rule', rank: 1, holds: 'governedByTrade', hideable: true, wordings: Object.freeze([
        'This place is governed by a power of trade, so the quarrel over who may sell is also one over how it is run.',
        'Those who hold the hall here hold it by trade, and the guild and those outside it fight over who may sell and who has the say.',
        'Where trade governs, as it does here, who may sell outside the guild is a question of power as much as of business.',
      ]) }),
      Object.freeze({ id: 'rival_power', rank: 1, holds: 'rivalPower', hideable: true, wordings: Object.freeze([
        'The guild and those who would trade outside it are at odds, and here the say in how the place is run is not held by those who govern alone.',
        'Another power of real weight stands beside those who govern, so the quarrel over who may sell is also a quarrel over whose say counts.',
        'Those who govern here are not the only power of standing, and guild and non-guild traders each look for a say in how the place is run.',
      ]) }),
      Object.freeze({ id: 'caravans', rank: 2, holds: 'caravanHouse', hideable: false, wordings: Object.freeze([
        'Caravan trade comes through here, and the guild and those who would trade outside it are at odds over who may sell.',
        'Goods come by caravan to this place, and who may sell them, guild or not, is in dispute.',
      ]) }),
      Object.freeze({ id: 'ships', rank: 2, holds: 'docksHouse', hideable: false, wordings: Object.freeze([
        'Vessels put in here, and the guild and those who would trade outside it are at odds over who may sell their cargo.',
        'Cargo comes and goes by water here, and who may sell it outside the guild is in dispute.',
      ]) }),
      Object.freeze({ id: 'crossroads', rank: 2, holds: 'routeCrossroads', hideable: false, wordings: Object.freeze([
        'Roads meet at this place, and the guild and those who would trade outside it are at odds over who may sell.',
        'This place stands where roads cross, and who may sell here outside the guild is in dispute.',
      ]) }),
      Object.freeze({ id: 'fair', rank: 2, holds: 'fairHouse', hideable: false, wordings: Object.freeze([
        'Fair time brings sellers from elsewhere, and the guild and those outside it are at odds over who may trade.',
        'Each year at fair time traders come who are not of the guild, and who may sell becomes a quarrel.',
        'Not everyone who sells here at fair time is of the guild, and who may trade is fought over.',
      ]) }),
      Object.freeze({ id: 'trade_center', rank: 2, holds: 'exchangeHouse', hideable: false, wordings: Object.freeze([
        'Some trade here passes outside the guild, through a house of exchange or sale, and who may sell is fought over.',
        'Goods or coin change hands here away from the guild, at a place of exchange, and the guild and those outside it are at odds.',
      ]) }),
      Object.freeze({ id: 'luxury_quarter', rank: 2, holds: 'luxuryQuarterHouse', hideable: false, wordings: Object.freeze([
        'Trade in the luxury goods quarter passes outside the guild, and who may sell there is in dispute.',
        "The luxury goods quarter does business beyond the guild's hold, and guild and non-guild traders are at odds over it.",
      ]) }),
    ]),
    plain: Object.freeze([
      'The guild and those who would trade outside it are at odds here over who may sell.',
      'Who may sell in this place, and who may not, is a quarrel between the guild and those outside it.',
      'Traders who are not of the guild are pressing for the right to sell here.',
    ]),
    // the chair's ruling of 15:35 (addendum 2): where the guild's home answers no, this sentence alone, before the ranks
    withoutItsHouse: 'Traders here are fighting over who may sell what, and over a say in how the place is run.',
  }),
  resource_scarcity: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'famine', rank: 1, holds: 'famine', hideable: false, wordings: Object.freeze([
        'Famine holds the place, food is short, and those who hoard it set prices others cannot meet.',
        'With the place in famine, what food there is goes to those who keep it back or can pay what is asked.',
      ]) }),
      Object.freeze({ id: 'sickness', rank: 1, holds: 'crisisPlague', hideable: false, wordings: Object.freeze([
        'A disease outbreak is spreading through the place, and a needed resource runs short while some hoard it and others cannot pay.',
        'With sickness abroad in the place, supplies of a vital good are thin, and their price has climbed beyond many.',
      ]) }),
      Object.freeze({ id: 'war_levy', rank: 1, holds: 'warUpon', hideable: false, wordings: Object.freeze([
        'With war upon the place, a vital resource is running short, and some hoard it while others go without.',
        'War presses on the place, and the goods the people need most are scarce and dear.',
        'The place is caught up in war, and the shortage of a needed good sets those who hoard against those who cannot pay.',
      ]) }),
      Object.freeze({ id: 'source_spent', rank: 1, holds: 'foodSourceSpentOrFailed', hideable: false, wordings: Object.freeze([
        "One of the place's own food sources has given out, and what remains is hoarded or priced beyond many.",
        'With one of its own food sources given out, the place runs short, and the hoarders and the high prices follow.',
      ]) }),
      Object.freeze({ id: 'old_scarcity', rank: 1, holds: 'pastResourceScarcity', hideable: false, wordings: Object.freeze([
        'The place has gone short before and is going short again, with some hoarding while others cannot pay.',
        'Scarcity has come to the place before, and now a needed resource is scarce once more, kept back by some and priced beyond others.',
      ]) }),
      Object.freeze({ id: 'isolated', rank: 2, holds: 'routeIsolated', hideable: false, wordings: Object.freeze([
        'Lying off the trade routes, the place runs short of a needed resource, and some hoard what is left while others cannot pay.',
        'The place sits apart from the roads of trade, and a shortage of a vital good sets hoarders against those who cannot meet the price.',
      ]) }),
    ]),
    plain: Object.freeze([
      'A needed resource is scarce, and the shortage sets those who hoard against those who cannot pay.',
      'Something the place depends on is in short supply, and its price has climbed beyond many.',
      'Supplies of a vital good are thin, and some are keeping back what they have while others go without.',
    ]),
  }),
  external_threat: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'war', rank: 1, holds: 'warUponOrWartime', hideable: false, wordings: Object.freeze([
        'The war has come close, and the people are divided over whether to fight, bargain or flee.',
        'With war upon the place, the danger is close, and no one agrees how to meet it.',
        'The place stands in a time of war, and the argument over how to answer the danger sets neighbour against neighbour.',
      ]) }),
      Object.freeze({ id: 'beasts_pressing', rank: 1, holds: 'crisisMonsterPressure', hideable: false, wordings: Object.freeze([
        'Beasts and raiders are pressing on the place, and the people cannot agree on how to answer them.',
        'With beasts and raiders pressing in from the country around, the place is split over how to meet the danger.',
      ]) }),
      Object.freeze({ id: 'old_threat', rank: 1, holds: 'pastExternalThreat', hideable: false, wordings: Object.freeze([
        'Danger has threatened the place before and threatens it again, and the argument over how to answer it has returned.',
        'Once more a danger approaches the place, and once more the people are split on how to respond.',
        'The place has faced a threat from outside before, and with another coming the community is divided again.',
      ]) }),
      Object.freeze({ id: 'militia_only', rank: 2, holds: 'militiaNoGarrison', hideable: true, wordings: Object.freeze([
        'With a militia to defend the place and no garrison, news of approaching danger divides the community over what to do.',
        'Danger approaches a place that has a militia but no garrison, and the people disagree on how to meet it.',
      ]) }),
      Object.freeze({ id: 'open_road', rank: 2, holds: 'routeCrossroads', hideable: false, wordings: Object.freeze([
        'The place stands where roads cross, and news of approaching danger splits the people over how to respond.',
        'At a meeting of roads, the place hears of danger approaching and cannot agree how to meet it.',
      ]) }),
      Object.freeze({ id: 'beasts_frontier', rank: 2, holds: 'monsterFrontier', hideable: false, wordings: Object.freeze([
        'The country around is beast-haunted, and word of a coming danger leaves the place divided over how to answer.',
        'In country where beasts are a known threat, the place is split over how to meet the danger approaching.',
      ]) }),
    ]),
    plain: Object.freeze([
      'A danger is coming, and the place cannot agree whether to stand, bargain or flee.',
      'Word of a threat from outside has the community at odds over what to do.',
      'Something dangerous is approaching, and the people are divided on how to meet it.',
    ]),
  }),
  succession_crisis: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'void', rank: 1, holds: 'crisisSuccessionVoid', hideable: false, wordings: Object.freeze([
        'The place awaits a new leader, and the would-be successors are each gathering support.',
        'Big decisions wait on a new leader, and rival claimants are each building a following.',
      ]) }),
      Object.freeze({ id: 'heir_house', rank: 1, holds: 'rulerLord', hideable: false, wordings: Object.freeze([
        "The place is held under a lord's authority, and who holds it next is in open dispute among the would-be successors.",
        'Rule here passes through a lordly seat, and several who would take that seat are gathering backers.',
      ]) }),
      Object.freeze({ id: 'outranked', rank: 1, holds: 'seatOutranked', hideable: true, wordings: Object.freeze([
        'A power stronger than the government stands in the place, and the question of who leads next is wide open.',
        'With the governing power outweighed by another, the would-be successors are each gathering support.',
      ]) }),
      Object.freeze({ id: 'rival_power', rank: 1, holds: 'rivalPower', hideable: true, wordings: Object.freeze([
        'Another power of weight stands beside the government, and the would-be successors are each gathering support.',
        'With a strong power outside the seat of government, who leads next is in open dispute.',
      ]) }),
      Object.freeze({ id: 'contested', rank: 1, holds: 'legitimacyContested', hideable: false, wordings: Object.freeze([
        "The government's legitimacy is contested, and those who would lead next are each gathering support.",
        "With the people's acceptance of those in charge in question, the succession is an open quarrel.",
      ]) }),
      Object.freeze({ id: 'old_succession', rank: 1, holds: 'pastSuccessionCrisis', hideable: false, wordings: Object.freeze([
        'The place has quarrelled over its succession before, and the quarrel is back, with would-be successors gathering support.',
        'Once again the question of who will lead next divides the place, as it has before.',
        'A fight over the succession is nothing new here, and a fresh one has the claimants each building a following.',
      ]) }),
    ]),
    plain: Object.freeze([
      'Who will hold power next is unsettled, and each claimant is gathering backers.',
      'The succession is in dispute, and the would-be leaders are each building support.',
      'No one can yet say who will lead next, and the rivals for the seat are each rallying followers.',
    ]),
  }),
  outside_debt: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'creditors_sit', rank: 1, holds: 'crisisIndebted', hideable: false, wordings: Object.freeze([
        'Debt sits heavy here, and the outside power the place owes is moving to collect.',
        'Deep in debt, the place faces a creditor from beyond its bounds that means to be paid.',
        'What the place owes to a power outside is pressing hard, and the lender is preparing to collect.',
      ]) }),
      Object.freeze({ id: 'old_crash', rank: 1, holds: 'pastMarketCrashOrTradeCollapse', hideable: false, wordings: Object.freeze([
        'Trade here has crashed before, and now the place owes a heavy debt to an outside power that is preparing to collect.',
        'With a past ruin of its trade behind it, the place is deep in debt to a lender from outside who is moving to collect.',
      ]) }),
      Object.freeze({ id: 'hard_up', rank: 1, holds: 'prosperityStrugglingOrPoor', hideable: false, wordings: Object.freeze([
        'Hard up as it is, the place owes a heavy debt to an outside power that is ready to collect.',
        'The place has little money to spare, and a power beyond its bounds that it owes is preparing to collect.',
      ]) }),
      Object.freeze({ id: 'merchants_rule', rank: 1, holds: 'governedByTrade', hideable: true, wordings: Object.freeze([
        'With {power} governing, the place owes a heavy debt to an outside power that is preparing to collect.',
        'The place, governed by {power}, has borrowed heavily from outside, and the lender is moving to collect.',
      ]) }),
      Object.freeze({ id: 'old_debt', rank: 1, holds: 'pastOutsideDebt', hideable: false, wordings: Object.freeze([
        'The place has owed an outside power before, and it is in debt again, with the creditor preparing to collect.',
        'Once more a heavy debt binds the place to a power from outside that means to collect.',
      ]) }),
      Object.freeze({ id: 'through_trade', rank: 2, holds: 'entrepot', hideable: false, wordings: Object.freeze([
        'Goods pass through here on their way elsewhere, and the place owes a heavy debt to an outside power that is preparing to collect.',
        'As a waypoint of passing trade, the place owes a great deal beyond its bounds, and the creditor is moving to collect.',
      ]) }),
    ]),
    plain: Object.freeze([
      'The place is heavily in debt to a power beyond its bounds, and that power wants payment.',
      'An outside creditor is preparing to call in what the place owes.',
      'A large debt to a lender from outside hangs over the place, and collection is coming.',
    ]),
  }),
  great_flood: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'old_flood', rank: 1, holds: 'pastGreatFlood', hideable: false, wordings: Object.freeze([
        'A great flood has struck the place before, and the fear of another keeps the quarrel over who must guard against one alive.',
        'The flood has come before, and the place again argues over who must make ready for the next one and who pays.',
      ]) }),
      Object.freeze({ id: 'coast', rank: 2, holds: 'waterCoast', hideable: false, wordings: Object.freeze([
        "The place lies at the water's edge, where a flood is the standing fear, and who must guard against one and who pays is an open quarrel.",
        'With open water at hand, the place dreads a great flood and quarrels over whose labour and whose purse must answer one.',
      ]) }),
      Object.freeze({ id: 'river', rank: 2, holds: 'waterRiver', hideable: false, wordings: Object.freeze([
        'The place lies by a river, and the fear of a flood divides it over who must keep the banks and who pays.',
        "With a river at hand, a great flood is the place's standing fear, and the work of guarding against one is a quarrel.",
        'A river runs by the place, and each wet season reopens the question of who must answer its floods and at whose cost.',
      ]) }),
    ]),
    plain: Object.freeze([
      "A great flood is the place's standing fear, and the quarrel over who must guard against one and who pays never rests.",
      'The fear of a flood divides the place over who must make ready for one and who bears the cost.',
      'Whether a flood will come, and who should pay to keep one out, is a quarrel the place cannot settle.',
      'The place lives in dread of a great flood, and argues over whose work and whose purse must answer one.',
    ]),
  }),
  legitimacy_crisis: Object.freeze({
    causes: Object.freeze([
      Object.freeze({ id: 'insurgency', rank: 1, holds: 'crisisInsurgency', hideable: false, wordings: Object.freeze([
        "An insurgency is under way, and many openly deny the government's right to rule.",
        'With an insurgency defying those in charge, no one agrees who, if anyone, has the right to govern.',
      ]) }),
      Object.freeze({ id: 'creed', rank: 1, holds: 'crisisReligiousConversion', hideable: false, wordings: Object.freeze([
        "A change of faith is spreading through the place, and the government's right to rule is in question.",
        "As a new creed wins converts, the authority's claim to rule is openly disputed.",
      ]) }),
      Object.freeze({ id: 'crisis_band', rank: 1, holds: 'legitimacyCrisis', hideable: false, wordings: Object.freeze([
        'The people do not hold the government legitimate, and no one can agree who has a better claim.',
        "Public trust in the government's right to rule has given way, and no rival claim commands agreement.",
      ]) }),
      Object.freeze({ id: 'outranked', rank: 1, holds: 'seatOutranked', hideable: true, wordings: Object.freeze([
        "Another power stands above the government in the place, and the government's right to rule is openly questioned.",
        "With the governing power outweighed by another, who holds a rightful claim to rule is anyone's argument.",
      ]) }),
      Object.freeze({ id: 'lord', rank: 1, holds: 'rulerLord', hideable: false, wordings: Object.freeze([
        "The place is held under a lord's authority, and that authority's right to rule is openly questioned.",
        'Many deny that the lordly seat over the place holds any rightful claim, and none agree who does.',
      ]) }),
      Object.freeze({ id: 'rival_power', rank: 1, holds: 'rivalPower', hideable: true, wordings: Object.freeze([
        "A strong power stands beside the government, and the government's right to rule is openly questioned.",
        'With another power of weight outside the seat, no one agrees who, if anyone, rightly governs.',
        "The government's claim to rule is disputed in a place where a second strong power stands.",
      ]) }),
    ]),
    plain: Object.freeze([
      'Many in the place deny that those in charge have any right to rule.',
      "The authority's claim to govern is in open dispute, and no other claim is agreed either.",
      'Whether the government rules by right is the question of the day, and no answer satisfies.',
    ]),
  }),
});
