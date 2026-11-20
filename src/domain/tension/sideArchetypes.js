/**
 * domain/tension/sideArchetypes.js — THE SIDES OF A STANDING TROUBLE, CLASSED (FRAME-1, the seventh chair's CF5).
 *
 * A town's standing tensions (`history.currentTensions`, written from `data/historyData.js ::
 * HISTORICAL_EVENTS_DATA`) each carry three side labels and nobody on them. This table classes every label the
 * template table can write (its own three, and the three of each memory form: `byMemory.dated`, `byMemory.unanchored`)
 * into ONE of a small closed set of SIDE ARCHETYPES, and gives each archetype its LADDER: the kinds of face it admits,
 * in order, each with its rate. `historyData.js` is not edited; the walker (tests/domain/tension/sideArchetypes.walker
 * .test.js) reds on a label with no archetype and on two forms of one side classed apart.
 *
 * THE OWNER'S DIALS live in ONE frozen table, `FRAME_TUNING`: every number this lane reads is there.
 *
 * Pure data. No draw.
 */

/**
 * The closed set of side archetypes.
 * @typedef {'authority' | 'establishment' | 'challenger' | 'reformer' | 'payer' | 'blamed' | 'profiteer' | 'creditor'
 *   | 'enforcer' | 'faithful' | 'outsider' | 'criminal' | 'middle'} SideArchetype
 */

/**
 * The kinds of face a side can be filled with (CF4's ladder): (a) by office, (b) by a tie on the record that speaks of
 * the matter, (c) by trade, (d) an outsider reached through an existing person, (e) the criminal power or its house.
 * @typedef {'office' | 'tie' | 'trade' | 'outsider' | 'criminal'} FaceKind
 */

/** @type {ReadonlyArray<SideArchetype>} */
export const SIDE_ARCHETYPES = Object.freeze(/** @type {SideArchetype[]} */ ([
  'authority', 'establishment', 'challenger', 'reformer', 'payer', 'blamed', 'profiteer', 'creditor',
  'enforcer', 'faithful', 'outsider', 'criminal', 'middle',
]));

/** @type {ReadonlyArray<FaceKind>} */
export const FACE_KINDS = Object.freeze(/** @type {FaceKind[]} */ (['office', 'tie', 'trade', 'outsider', 'criminal']));

/**
 * LABEL TO ARCHETYPE: every side label `HISTORICAL_EVENTS_DATA` can write, in any of its forms. Keyed by the template's
 * own words (the generator may replace a few of them with a power's name at birth; the cast reads the side's place in
 * its template to find its label again: troubleCast.js :: templateLabelOf).
 */
export const SIDE_ARCHETYPE = Object.freeze(/** @type {Record<string, SideArchetype>} */ ({
  // succession_crisis
  'Legitimate heir': 'authority',
  'Popular candidate': 'challenger',
  'Power behind throne': 'profiteer',
  // economic_disparity
  'Wealthy merchants': 'profiteer',
  'Poor workers': 'payer',
  'Moderate reformers': 'reformer',
  // religious_tension
  'Orthodox believers': 'faithful',
  'Reformists': 'challenger',
  'Secular camp': 'middle',
  // guild_conflict
  'Established guilds': 'establishment',
  'Upstart guilds': 'challenger',
  'Non-guild workers': 'payer',
  'Guild members': 'establishment',
  'Those who would trade outside the guild': 'challenger',
  // external_threat
  'Prepare for war': 'enforcer',
  'Seek diplomacy': 'reformer',
  'Flee/hide': 'middle',
  // resource_scarcity
  'Hoarders': 'profiteer',
  'Desperate poor': 'payer',
  'Price regulators': 'reformer',
  'Those hoarding what they can': 'profiteer',
  'Those who cannot pay the prices': 'payer',
  'Those who would fix a fair price': 'reformer',
  // crime_wave
  'Official guards': 'enforcer',
  'Vigilantes': 'challenger',
  'Criminal organisations': 'criminal',
  'Those who would take the law into their own hands': 'challenger',
  // magical_controversy
  'Pro-magic': 'challenger',
  'Anti-magic': 'establishment',
  'Regulation advocates': 'reformer',
  // generational_divide
  'Traditionalists': 'establishment',
  'Progressives': 'challenger',
  'Pragmatic middle': 'middle',
  // corruption_scandal
  'Corrupt officials': 'authority',
  'Reformers': 'reformer',
  'Complicit beneficiaries': 'profiteer',
  // outside_debt
  'Debtors who took the loans': 'authority',
  'Those who will bear the cost': 'payer',
  'Those who profited and escaped': 'profiteer',
  'Those who took the loans': 'authority',
  'Those who profited and want no questions asked': 'profiteer',
  // occupation_legacy
  'Former collaborators': 'blamed',
  'Former resistance': 'challenger',
  'New generation wanting to move on': 'reformer',
  'Collaborator families': 'blamed',
  'Resistance families': 'challenger',
  'Those who want it forgotten': 'reformer',
  // infiltration_fear
  'Security hardliners': 'enforcer',
  'Civil libertarians': 'reformer',
  'Actual agents exploiting the confusion': 'outsider',
  // disputed_land
  'Original claimants': 'establishment',
  'Current occupants': 'payer',
  'Legal class profiting from ambiguity': 'profiteer',
  // population_friction
  'Old families': 'establishment',
  'Newcomers': 'outsider',
  'Merchants who benefit from cheap newcomer labour': 'profiteer',
  // leadership_vacuum
  'Multiple weak claimants': 'challenger',
  'Pragmatists who want stability': 'reformer',
  'Those who prefer the vacuum': 'profiteer',
  'Rival claimants, none strong enough to win': 'challenger',
  'Those who prefer things unsettled': 'profiteer',
  // market_crash
  'Ruined speculators': 'payer',
  'Creditors calling in debts': 'creditor',
  'Those who sold in time': 'profiteer',
  'Those buying as if prices can only rise': 'payer',
  'Those who have sold and are waiting': 'profiteer',
  // trade_collapse
  'Displaced traders': 'payer',
  'Workers left without wages': 'payer',
  'Rivals who profited from the diversion': 'profiteer',
  'Traders who fear the buyers are going elsewhere': 'payer',
  'Workers afraid for their wages': 'payer',
  'Rivals who would gain if the trade moved': 'profiteer',
  // great_fire
  'Survivors seeking someone to blame': 'payer',
  'Rebuilders and profiteers': 'profiteer',
  'Those accused of setting it': 'blamed',
  'Families still seeking someone to blame': 'payer',
  'Those who want timber and thatch forbidden': 'reformer',
  'Households who cannot afford to build in anything else': 'payer',
  'Those who say the danger is overblown': 'middle',
  // plague_years
  'Quarantine hardliners': 'enforcer',
  'The bereaved and the blamed': 'payer',
  'Healers and charlatans alike': 'middle',
  'Those who would shut the sick away': 'enforcer',
  'Families who refuse to be shut in': 'payer',
  'Those who trust to prayer and old remedies': 'faithful',
  // great_flood
  'Displaced families': 'payer',
  'Landowners pressing newly-convenient claims': 'profiteer',
  'Those who profited from the redrawing': 'profiteer',
  'Households on the low ground': 'payer',
  'Landowners on the high ground': 'establishment',
  'Those who say the water will never come': 'middle',
  // heresy_trial
  'The accusers': 'faithful',
  'The accused and their sympathizers': 'blamed',
  'Authorities exploiting the rift': 'authority',
  'Those in authority who would exploit the rift': 'authority',
  // pilgrimage_surge
  'Temple beneficiaries': 'profiteer',
  'Overwhelmed old residents': 'payer',
  'Sceptics who doubt the miracle': 'middle',
  'Those who would proclaim the miracle': 'faithful',
  'Residents who want no crowds of strangers': 'payer',
  // popular_uprising
  'Former rebels': 'challenger',
  'The restored order': 'authority',
  'Those who changed sides at the right moment': 'profiteer',
  'Those pressing their demands': 'challenger',
  'Those in charge, who will not give way': 'authority',
  'Those waiting to see which side wins': 'middle',
  // tyranny
  'Old loyalists': 'establishment',
  'Those who suffered under the regime': 'payer',
  'Beneficiaries who kept their gains': 'profiteer',
  'Loyalist families': 'establishment',
  'Families the regime wronged': 'payer',
  "Families who kept the regime's gains": 'profiteer',
  'Those who want a strong hand': 'establishment',
  'Those who fear a tyrant in the making': 'payer',
  'Those who will serve whoever wins': 'profiteer',
  // wild_magic
  'The changed and their descendants': 'blamed',
  'Those who fear them': 'middle',
  'Scholars studying the residue': 'reformer',
  'Those touched by the flares': 'blamed',
  'Those who would study the flares': 'reformer',
  // legitimacy_crisis
  'The sitting authority': 'authority',
  'Those who deny its mandate': 'challenger',
  'Pragmatists who want any stable answer': 'reformer',
  // demographic_pressure
  'Established residents': 'establishment',
  'The newly arrived or departing': 'outsider',
  'Those profiting from the churn': 'profiteer',
  // trade_dispute
  'Merchants tied to the old partner': 'establishment',
  'Those who want new partners': 'challenger',
  'Authorities caught between them': 'authority',
  'Merchants who trade with the partner': 'establishment',
}));

/**
 * THE SIDES THE GENERATOR WRITES OVER AT BIRTH (generators/historyGenerator.js :: substituteNames replaces seven template
 * labels with a power's name or fallback words), by type and place, so a stored side finds its label again without the
 * template table. The walker pins this to the generator's own replacements and to the template's places.
 */
export const GENERATOR_REPLACED_SIDES = Object.freeze(/** @type {Record<string, Readonly<Record<number, string>>>} */ ({
  succession_crisis: Object.freeze({ 0: 'Legitimate heir', 2: 'Power behind throne' }),
  economic_disparity: Object.freeze({ 0: 'Wealthy merchants' }),
  religious_tension: Object.freeze({ 0: 'Orthodox believers' }),
  crime_wave: Object.freeze({ 0: 'Official guards', 2: 'Criminal organisations' }),
  corruption_scandal: Object.freeze({ 0: 'Corrupt officials' }),
}));

/**
 * THE LADDERS: for each archetype, the kinds of face it admits, in the order they are tried. Which admitted kind
 * fires in a town is decided by the town's own facts first (a face whose record SPEAKS of the trouble), then by the
 * hash against the kind's rate in `FRAME_TUNING.rates`, then by the first admitted kind the town can fill at all.
 */
export const ARCHETYPE_LADDER = Object.freeze(/** @type {Record<SideArchetype, ReadonlyArray<FaceKind>>} */ ({
  authority: Object.freeze(/** @type {FaceKind[]} */ (['office', 'tie', 'trade'])),
  establishment: Object.freeze(/** @type {FaceKind[]} */ (['office', 'trade', 'tie'])),
  challenger: Object.freeze(/** @type {FaceKind[]} */ (['tie', 'trade', 'office'])),
  reformer: Object.freeze(/** @type {FaceKind[]} */ (['tie', 'trade', 'office'])),
  payer: Object.freeze(/** @type {FaceKind[]} */ (['tie', 'trade'])),
  blamed: Object.freeze(/** @type {FaceKind[]} */ (['tie', 'trade'])),
  profiteer: Object.freeze(/** @type {FaceKind[]} */ (['criminal', 'tie', 'trade', 'office'])),
  creditor: Object.freeze(/** @type {FaceKind[]} */ (['outsider', 'criminal', 'tie'])),
  enforcer: Object.freeze(/** @type {FaceKind[]} */ (['office', 'tie', 'trade'])),
  faithful: Object.freeze(/** @type {FaceKind[]} */ (['office', 'trade', 'tie'])),
  outsider: Object.freeze(/** @type {FaceKind[]} */ (['outsider', 'criminal', 'tie'])),
  criminal: Object.freeze(/** @type {FaceKind[]} */ (['criminal', 'outsider'])),
  middle: Object.freeze(/** @type {FaceKind[]} */ (['tie', 'trade'])),
}));

/**
 * WHAT A TROUBLE TOUCHES, by its template type (the cast's FACTS; no draw):
 *   ties   the tie archetypes (`relationships[].typeName`, data/npcData.js's labels) that SPEAK of the matter: a person
 *          on such a tie stands on a side by tie (CF4 b);
 *   words  the words a person's own hook or secret uses when it speaks of the matter (CF4 b: "a person whose own hook
 *          is about it");
 *   trade  the houses the trouble touches, read on a person's role, title and house (CF4 c);
 *   office the kinds of power (data: factionArchetypes.js's words) whose head stands for an establishment side.
 * A type absent here reads `TROUBLE_MATTER_DEFAULT`.
 * @typedef {{ ties: ReadonlyArray<string>, words: RegExp, trade: RegExp, office: ReadonlyArray<string> }} TroubleMatter
 */
const DEBT_TIES = Object.freeze(['Outstanding Debt', 'Financial Dependence', 'Silent Partnership', 'The Patron No One Names']);
const CROOKED_TIES = Object.freeze(['Corrupt Arrangement', 'Held Over Them', 'Active Suppression', 'Silent Partnership', 'The Patron No One Names']);
const HEIR_TIES = Object.freeze(['Mentor and Successor', 'Family Complication', 'Professional Rivalry']);
const TRADE_TIES = Object.freeze(['Professional Rivalry', 'Outstanding Debt']);
const FAITH_TIES = Object.freeze(['Active Suppression', 'Unresolved History']);
// A trouble with no tie of its own kind (a fire, a flood, a plague, an uprising, a flare of magic): no tie speaks of it,
// only a person's own hook or secret does (`words`).
const OLD_TIES = Object.freeze(/** @type {string[]} */ ([]));
const MONEY_WORDS = /\b(?:debts?|owes?|owed|loans?|lender|creditor|repay\w*|unpaid|pay chest|coin|ledgers?|accounts?)\b/i;
const CROOKED_WORDS = /\b(?:brib\w*|skim\w*|payroll|smuggl\w*|stolen|theft|protection|fence|forged|corrupt\w*)\b/i;
const RECORDS_TRADE = /\b(?:scribe|clerk|notary|herald|steward|chancer\w*|archiv\w*|registr\w*)\b/i;
const MONEY_TRADE = /\b(?:bank\w*|money\w*|exchequer|treasur\w*|counting|factor|merchant|broker|pawn\w*)\b/i;
const MARKET_TRADE = /\b(?:merchant|trader|factor|broker|caravan\w*|docks?|harbou?r\w*|market|chandler|warehouse\w*)\b/i;

export const TROUBLE_MATTER_DEFAULT = Object.freeze(/** @type {TroubleMatter} */ ({
  ties: OLD_TIES, words: /(?!)/, trade: RECORDS_TRADE, office: Object.freeze(['noble', 'government']),
}));

export const TROUBLE_MATTER = Object.freeze(/** @type {Record<string, TroubleMatter>} */ ({
  outside_debt: { ties: DEBT_TIES, words: MONEY_WORDS, trade: MONEY_TRADE, office: ['merchant', 'government'] },
  market_crash: { ties: DEBT_TIES, words: MONEY_WORDS, trade: MONEY_TRADE, office: ['merchant'] },
  trade_collapse: { ties: TRADE_TIES, words: MONEY_WORDS, trade: MARKET_TRADE, office: ['merchant'] },
  trade_dispute: { ties: TRADE_TIES, words: MONEY_WORDS, trade: MARKET_TRADE, office: ['merchant'] },
  economic_disparity: { ties: DEBT_TIES, words: /\b(?:wages?|unpaid|ledgers?|debts?|owes?)\b/i, trade: MARKET_TRADE, office: ['merchant'] },
  resource_scarcity: { ties: TRADE_TIES, words: /\b(?:grain|stores?|hoard\w*|shortage|prices?)\b/i, trade: /\b(?:granar\w*|mill\w*|baker\w*|grain|chandler|market|merchant)\b/i, office: ['merchant'] },
  guild_conflict: { ties: TRADE_TIES, words: /\b(?:guild|mastership|journeym\w*|apprentice\w*)\b/i, trade: /\b(?:guild\w*|smith\w*|weaver\w*|mason\w*|carpenter\w*|tanner\w*|cooper\w*|potter\w*)\b/i, office: ['craft', 'merchant'] },
  crime_wave: { ties: CROOKED_TIES, words: CROOKED_WORDS, trade: /\b(?:tavern\w*|inns?|alehouse|alewife|brewster|fence|pawn\w*|stable\w*)\b/i, office: ['military'] },
  corruption_scandal: { ties: CROOKED_TIES, words: CROOKED_WORDS, trade: RECORDS_TRADE, office: ['government'] },
  succession_crisis: { ties: HEIR_TIES, words: /\b(?:heirs?|successor|succession|inherit\w*)\b/i, trade: RECORDS_TRADE, office: ['noble', 'government'] },
  generational_divide: { ties: HEIR_TIES, words: /\b(?:elders?|old guard|young)\b/i, trade: RECORDS_TRADE, office: ['noble', 'government'] },
  leadership_vacuum: { ties: HEIR_TIES, words: /\b(?:claim\w*|successor|seat)\b/i, trade: RECORDS_TRADE, office: ['noble', 'government'] },
  legitimacy_crisis: { ties: HEIR_TIES, words: /\b(?:mandate|claim\w*|legitima\w*)\b/i, trade: RECORDS_TRADE, office: ['noble', 'government'] },
  tyranny: { ties: OLD_TIES, words: /\b(?:regime|tyrant)\b/i, trade: RECORDS_TRADE, office: ['military', 'government'] },
  religious_tension: { ties: FAITH_TIES, words: /\b(?:faith\w*|heres\w*|relic|congregation|creed|theolog\w*)\b/i, trade: /\b(?:temple|shrine|chapel|church|parish|priest\w*|abbey|monaster\w*|cathedral|dean)\b/i, office: ['religious'] },
  heresy_trial: { ties: FAITH_TIES, words: /\b(?:heres\w*|heretic\w*|accus\w*|faith\w*)\b/i, trade: /\b(?:temple|shrine|chapel|church|parish|priest\w*|abbey|monaster\w*|cathedral|dean)\b/i, office: ['religious'] },
  pilgrimage_surge: { ties: FAITH_TIES, words: /\b(?:pilgrim\w*|miracle|relic|shrine)\b/i, trade: /\b(?:temple|shrine|chapel|church|inns?|tavern\w*|hostel)\b/i, office: ['religious'] },
  plague_years: { ties: OLD_TIES, words: /\b(?:sick\w*|plague|fever|quarantine|cure)\b/i, trade: /\b(?:heal\w*|physician\w*|apothecar\w*|herbal\w*|hospice|infirmar\w*|surgeon\w*|midwi\w*)\b/i, office: ['religious'] },
  great_fire: { ties: OLD_TIES, words: /\b(?:fire|burn\w*|arson\w*|thatch|timber)\b/i, trade: /\b(?:mason\w*|carpenter\w*|builder\w*|timber|thatch\w*|quarr\w*|brick\w*)\b/i, office: ['merchant'] },
  great_flood: { ties: OLD_TIES, words: /\b(?:flood\w*|water|river|low ground)\b/i, trade: /\b(?:mill\w*|ferr\w*|docks?|bridge|farm\w*|dyke|levee)\b/i, office: ['noble'] },
  magical_controversy: { ties: OLD_TIES, words: /\b(?:magic\w*|spell\w*|ward\w*|arcane)\b/i, trade: /\b(?:wizard\w*|mage\w*|alchem\w*|arcane|scholar\w*|librar\w*|academ\w*)\b/i, office: ['religious'] },
  wild_magic: { ties: OLD_TIES, words: /\b(?:magic\w*|flares?|changed|arcane)\b/i, trade: /\b(?:wizard\w*|mage\w*|alchem\w*|arcane|scholar\w*|librar\w*|academ\w*)\b/i, office: ['religious'] },
  population_friction: { ties: OLD_TIES, words: /\b(?:newcomers?|strangers?|incomers?)\b/i, trade: /\b(?:inns?|tavern\w*|hostel|market|merchant)\b/i, office: ['noble'] },
  demographic_pressure: { ties: OLD_TIES, words: /\b(?:newcomers?|strangers?|incomers?)\b/i, trade: /\b(?:inns?|tavern\w*|hostel|market|merchant)\b/i, office: ['noble'] },
  disputed_land: { ties: OLD_TIES, words: /\b(?:land|fence|deed|charter|boundar\w*)\b/i, trade: /\b(?:notary|clerk|scribe|court|magistrate|reeve|steward|surveyor\w*)\b/i, office: ['noble'] },
  external_threat: { ties: OLD_TIES, words: /\b(?:threat|enemy|raid\w*|war)\b/i, trade: /\b(?:smith\w*|armour\w*|armor\w*|fletcher\w*|stable\w*)\b/i, office: ['military'] },
  infiltration_fear: { ties: CROOKED_TIES, words: /\b(?:agents?|spies|spy|informer\w*|outsiders)\b/i, trade: /\b(?:inns?|tavern\w*|stable\w*|post\w*)\b/i, office: ['military'] },
  occupation_legacy: { ties: OLD_TIES, words: /\b(?:occupation|collaborat\w*|resist\w*)\b/i, trade: RECORDS_TRADE, office: ['noble'] },
  popular_uprising: { ties: OLD_TIES, words: /\b(?:rebel\w*|uprising|demands?)\b/i, trade: RECORDS_TRADE, office: ['military', 'government'] },
}));

/** Where a stranger lodges, read on a person's house, role and title: the keeper an outsider is reached through. */
export const LODGING_HOUSE = /\b(?:inns?|tavern\w*|alehouse|hostel|caravanserai)\b/i;

/**
 * THE OWNER'S DIALS (CF4, CF8: the one table of numbers this lane reads).
 *   rates            per archetype, per admitted kind: the share of towns that can fill the side by that kind in which
 *                    it does (a hash of the seed, the tension's type and the side against the rate; never a draw).
 *   criminalMinPower a criminal power is strong enough to stand on a side at this roster power or more.
 *   officeSidesMax   at most this many sides of one trouble are filled by office alone.
 *   seatSidesMax     the seat-holder fronts at most this many sides of a sheet.
 *   hookCount        the trouble's own hooks shown with it.
 */
export const FRAME_TUNING = Object.freeze({
  rates: Object.freeze(/** @type {Record<SideArchetype, Readonly<Partial<Record<FaceKind, number>>>>} */ ({
    authority: Object.freeze({ office: 0.5, tie: 0.8, trade: 0.5 }),
    establishment: Object.freeze({ office: 0.4, trade: 0.6, tie: 0.8 }),
    challenger: Object.freeze({ tie: 0.7, trade: 0.5, office: 0.5 }),
    reformer: Object.freeze({ tie: 0.6, trade: 0.5, office: 0.4 }),
    payer: Object.freeze({ tie: 0.8, trade: 0.7 }),
    blamed: Object.freeze({ tie: 0.7, trade: 0.6 }),
    profiteer: Object.freeze({ criminal: 0.4, tie: 0.7, trade: 0.6, office: 0.5 }),
    creditor: Object.freeze({ outsider: 0.6, criminal: 0.5, tie: 0.8 }),
    enforcer: Object.freeze({ office: 0.4, tie: 0.7, trade: 0.5 }),
    faithful: Object.freeze({ office: 0.4, trade: 0.6, tie: 0.7 }),
    outsider: Object.freeze({ outsider: 0.7, criminal: 0.4, tie: 0.7 }),
    criminal: Object.freeze({ criminal: 1, outsider: 1 }),
    middle: Object.freeze({ tie: 0.6, trade: 0.6 }),
  })),
  criminalMinPower: 5,
  officeSidesMax: 1,
  seatSidesMax: 1,
  hookCount: 3,
});
