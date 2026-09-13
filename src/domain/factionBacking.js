/**
 * factionBacking.js — A POWER EXISTS ONLY WHERE AN INSTITUTION CAN REPRESENT IT
 * (brief ADDENDUM 18 ruling 16; the owner, 2026-09-13; car 8b-W-18e).
 *
 * *"The appearance of a power is directly tied to if there is an institution that can
 * represent it. for example, there can't be a religious authorities power if there are
 * no institutions in the settlement to contribute to its influence … so that becomes the
 * floor and ceiling of the variance in terms of powers."*
 *
 * ── THE RULE, AS SHARPENED THE SAME DAY ──────────────────────────────────────────────
 *   1. STRICT. Only an INSTITUTION ROW in the town's LIVE roster backs a power. A person
 *      ('Priest (resident)', 'Hedge wizard', 'Local fence') is not an institution; a
 *      service ('Access to parish church' — a walk to the next village) is not either.
 *      A shrine / chapel / church / temple / monastery ROW is. A market day needs a
 *      market row. Places with less have fewer powers — that is the intended output.
 *   2. THE TABLE IS INSTITUTION-CLASS → POWERS. Every power-bearing institution class maps
 *      to one or more powers (multi-mapping is expected: a guild government backs the
 *      hall AND the guilds; a Royal seat backs the crown AND the noble house). An
 *      institution with no power (a well, a mill, a burial ground, a wall) maps to
 *      nothing, and that is correct.
 *   3. CRISIS FACTIONS ARE EVENTS, NOT STANDING POWERS. The stress-minted factions (War
 *      Council, Grain Holders, Occupation Authority, the hidden faction, the resistance …)
 *      are minted by their crisis, EXEMPT from this rule, stamped `crisis: true`, and
 *      expire with the crisis. One becomes a standing power only if an institution row
 *      comes to back it, at which point the ordinary rule applies.
 *   4. CUSTOM CONTENT COUNTS. A game-master-built chapel backs the religious power. A
 *      custom row's class is its OPTIONAL `backsPowers` field where present (validated
 *      against GATED_ARCHETYPES), else its declared `authority`, else its declared
 *      `category`, else its tags, else its name — the declared class, never the empty
 *      string `nativeSemanticName` returns for materialized custom content.
 *
 * ── WHAT THIS MODULE IS ─────────────────────────────────────────────────────────────
 * The ONE table and the ONE predicate. Generation (`generators/power/rulingStructure.js`,
 * `generators/steps/neighbourFactions.js`) asks `backedArchetypesOf` before minting; the
 * pulse (`worldPulse/factionBackingKernel.js`) asks it after every tick and stamps
 * `unbacked: true` on a standing power whose last backing row was ruined (and clears the
 * mark when a backing row stands again — the symmetric half of the mark); the density
 * cadence (`worldPulse/factionDensityKernel.js`, R8) draws its candidate pool from it, so
 * a temple that appears in a v2 world lets the pulse mint the power it now backs.
 *
 * ── ENUMERATED, NEVER GUESSED ───────────────────────────────────────────────────────
 * The `rows` of every class are EXACT catalogue names, lowercased. This module does not
 * import `data/institutionalCatalog.js` (the pulse chunk keeps the whale tables out —
 * see calamityKernel's UPGRADE_CHAIN_PAIRS note); instead
 * `tests/domain/factionBacking.test.js` cross-checks every listed name against the
 * catalogue (no ghost rows) and PINS the classification of every catalogue row, so a
 * catalogue row added later lands as "unclassified" in a visible diff rather than in a
 * silent verdict. The keyword fallback below applies ONLY to names that are not
 * catalogue rows at all (custom rows, test fixtures); a catalogue row's verdict is the
 * enumeration's and nothing else's — which is why NON_BACKING_ROWS exists: it names the
 * catalogue rows that CONTAIN a keyword ('Access to parish church', 'Black market'
 * under the market keyword) and back nothing, so the fallback can never re-admit them.
 *
 * PURE, HEADLESS: no state, no clock, no RNG, no store. Every table is frozen.
 * The roster read routes through the canonical ruin filter (`liveInstitutions`).
 *
 * @enforced-by tests/domain/factionBacking.test.js
 */
import { FACTION_ARCHETYPES, factionArchetype } from './factionArchetypes.js';
import { isMaterializedCustomContent, nativeSemanticName } from './content/customContentSemanticAuthority.js';
import { liveInstitutions } from './institutions/institutionRoster.js';

/**
 * THE GATED ARCHETYPES — the standing powers the engine mints and the values a custom
 * institution's `backsPowers` may name. `government` is listed because a custom hall
 * may declare it, but the GOVERNING SEAT ITSELF IS NEVER GATED (§810.3 R14: "the
 * density roll dissolved the government" is not a story, it is a hole).
 * @type {ReadonlyArray<string>}
 */
export const GATED_ARCHETYPES = Object.freeze([
  'merchant', 'noble', 'military', 'religious', 'craft', 'criminal', 'arcane', 'government',
]);

/**
 * INSTITUTION CLASS → { rows, keywords, powers }.
 *
 * `rows`     exact catalogue names (lowercased) — the enumeration.
 * `keywords` substrings tried ONLY on a name that is not a catalogue row (and not
 *            listed in NON_BACKING_ROWS): custom rows, fixtures.
 * `powers`   the archetypes this class represents.
 *
 * @type {Readonly<Record<string, Readonly<{rows: ReadonlyArray<string>, keywords: ReadonlyArray<string>, powers: ReadonlyArray<string>}>>>}
 */
export const INSTITUTION_CLASSES = Object.freeze({
  // The town's own seat of government. Backs the governing power (never gated) and,
  // where the hall is the guilds' or the merchants', those powers too.
  hall: Object.freeze({
    rows: Object.freeze([
      'informal elder consensus', 'head-of-household consensus', 'household elder',
      'village headman', 'village elder', 'village reeve', 'mayor and council',
      'town council', 'city administration', 'city-state government',
      'democratic assembly', 'town hall', 'city hall', 'courthouse',
      'multiple courthouses', 'multiple court buildings',
    ]),
    keywords: Object.freeze(['council', 'assembly', 'town hall', 'city hall', 'administration', 'senate']),
    powers: Object.freeze(['government']),
  }),
  guild_hall: Object.freeze({
    rows: Object.freeze(['guild governance', 'guild consortium']),
    keywords: Object.freeze(['guild governance', 'guild consortium', 'guild council']),
    powers: Object.freeze(['government', 'craft', 'merchant']),
  }),
  merchant_seat: Object.freeze({
    rows: Object.freeze(['merchant oligarchy']),
    keywords: Object.freeze(['merchant oligarchy', 'merchant senate']),
    powers: Object.freeze(['government', 'merchant']),
  }),
  // A lord's office, a governor, a crown, a palace: the noble house is represented.
  lordship: Object.freeze({
    rows: Object.freeze([
      "lord's reeve", "lord's steward", "lord's appointee", 'noble governor',
      'royal seat', 'palace/government complex',
    ]),
    keywords: Object.freeze(['manor', "lord's", 'noble', 'royal seat', 'palace', 'castle', 'estate', 'ducal']),
    powers: Object.freeze(['noble', 'government']),
  }),
  // A house of faith — a building the clergy keep, or a church-run charitable house.
  // NOT a resident priest (a person), NOT a walk to the next village's church, NOT a
  // burial ground (no clergy speak over it — the row's own text).
  faith_house: Object.freeze({
    rows: Object.freeze([
      'wayside shrine', 'parish church', 'parish churches (2-5)', 'parish churches (10-30)',
      'parish churches (50-100+)', 'monastery or friary', 'multiple monasteries',
      'major monasteries (5-10)', 'cathedral (10,000+ only)', 'great cathedral',
      'almshouse', 'foundling home', 'small hospital', 'major hospital', 'hospital network',
      'druid circle', 'elder grove council',
    ]),
    keywords: Object.freeze(['shrine', 'chapel', 'church', 'temple', 'monaster', 'cathedral', 'friary', 'abbey', 'priory', 'basilica']),
    powers: Object.freeze(['religious']),
  }),
  // Where trade is held: a market row backs the merchant interest.
  market: Object.freeze({
    rows: Object.freeze([
      'periodic market', 'weekly market', 'market square', 'multiple market squares',
      'daily markets', 'district markets (5-10)', 'annual fair', 'major annual fairs',
      'fish market', 'auction house', 'international trade center', 'slave market',
      'slave market district',
    ]),
    keywords: Object.freeze(['market', 'fair', 'bazaar', 'exchange', 'trade cent', 'emporium']),
    powers: Object.freeze(['merchant']),
  }),
  // The merchants' own houses: guilds, warehouses, banks, carriers, docks.
  merchant_house: Object.freeze({
    rows: Object.freeze([
      'merchant guilds (3-8)', 'merchant guilds (15-40)', 'merchant guilds (50-100+)',
      'merchant warehouses', 'warehouse district', 'banking houses', 'banking district',
      'money changers', 'pawnbroker', 'mint (official)', 'caravanserai',
      "caravan masters' exchange", "caravaneer's post", "carriers' guild",
      "carriers' hiring hall", 'docks/port facilities',
      'barge and river transport company', 'planar traders',
    ]),
    keywords: Object.freeze(['merchant', 'warehouse', 'bank', 'counting house', 'money changer', 'caravanserai', 'dock', 'port facilit', 'carrier', 'trading house', 'factor']),
    powers: Object.freeze(['merchant']),
  }),
  // The crafts' own guilds.
  craft_guild: Object.freeze({
    rows: Object.freeze([
      'craft guilds (5-15)', 'craft guilds (30-80)', 'craft guilds (100-150+)',
      "cobbler's guild", "tailor's guild", 'bowyers & fletchers (guild)',
      "cartographer's guild",
    ]),
    keywords: Object.freeze(['craft guild', 'artisan', "'s guild", 'guildhall', 'guild hall']),
    powers: Object.freeze(['craft']),
  }),
  // A workshop with premises (the owner's word: "guild/workshop rows back the crafts").
  // NOT a part-time individual, NOT a primary producer (a quarry, a fishery, a shepherd),
  // NOT a mill (the owner's own example of a row that maps to nothing).
  workshop: Object.freeze({
    rows: Object.freeze([
      'blacksmith', 'blacksmiths (3-10)', 'carpenter', 'carpenters (5-15)', 'cooper',
      'apothecary', 'apothecary (established)', 'apothecary district', 'bowyer & fletcher',
      'sawmill', 'sawmill (commercial)', 'tannery', 'tanner (established)', 'tanners',
      'fuller', 'dyer', 'potter', 'brickmaker', 'brewer', 'brewery', 'cobbler', 'tailor',
      'weavers/textile workers', 'butchers (3-8)', 'bakers (5-15)', 'smelter',
      'chandler', 'glassblower', 'glassmakers', 'ropemaker', 'specialized metalworkers',
      'luxury goods quarter', 'printing house', "furrier's district",
      "cartographer's workshop", 'jeweller', 'vintner', 'shipyard', 'river boatyard',
    ]),
    keywords: Object.freeze(['workshop', 'smithy', 'forge', 'foundry', 'atelier', 'manufactory']),
    powers: Object.freeze(['craft']),
  }),
  // THE FORCE ROWS — the town's own armed institutions. NOT walls, gates, a citadel or a
  // palisade: fabric is not a force (the desk's `standingDefenseForces` partitions walls
  // separately for the same reason).
  force: Object.freeze({
    rows: Object.freeze([
      'citizen militia', 'town watch', 'professional city watch', 'barracks', 'garrison',
      'multiple garrisons', 'free company hall', "veteran's lodge", 'household levy',
      'mercenary quarter', 'hired blades', "adventurers' charter hall",
      "multiple adventurers' guilds", 'hireling hall', "warden's lodge",
    ]),
    keywords: Object.freeze(['garrison', 'barracks', 'militia', 'watch', 'mercenar', 'levy', 'company hall', 'charter hall', 'guardhouse', 'armoury', 'armory']),
    powers: Object.freeze(['military']),
  }),
  // The underworld's own places and bodies. NOT a lone fence or a contract killer (a
  // person), NOT a bandit affiliate (a household's arrangement).
  underworld: Object.freeze({
    rows: Object.freeze([
      'outlaw shelter', 'smuggling waypoint', 'smuggling network', 'smuggling operation',
      'underground network', 'street gang', 'front businesses', 'rookery',
      "thieves' guild chapter", "thieves' guild (powerful)", 'multiple criminal factions',
      'black market', 'black market bazaar', 'kidnapping ring', 'human trafficking network',
      'whisper market', 'underground city', "assassins' guild",
    ]),
    keywords: Object.freeze(['thiev', 'smuggl', 'black market', 'gang', 'syndicate', 'underworld', 'rookery', 'assassin', 'racket', 'cartel']),
    powers: Object.freeze(['criminal']),
  }),
  // A house of the arcane. NOT a hedge wizard or a scroll scribe (a person), NOT a
  // teleportation circle (infrastructure), NOT a library or a planar embassy.
  arcane_house: Object.freeze({
    rows: Object.freeze([
      "mages' guild", "wizard's tower", "enchanter's shop", 'alchemist shop',
      'alchemist quarter', 'academy of magic', "mages' district",
    ]),
    keywords: Object.freeze(['mage', 'wizard', 'arcane', 'alchem', 'enchant', 'sorcer', 'academy of magic', 'spellcast']),
    powers: Object.freeze(['arcane']),
  }),
});

/** Every class key, for a consumer that must be total over the vocabulary. */
export const INSTITUTION_CLASS_KEYS = Object.freeze(Object.keys(INSTITUTION_CLASSES));

/**
 * POWER → the classes that can represent it (the inverse of INSTITUTION_CLASSES,
 * derived rather than hand-written so the two can never disagree).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const FACTION_BACKING = Object.freeze(Object.fromEntries(
  GATED_ARCHETYPES.map((power) => [
    power,
    Object.freeze(INSTITUTION_CLASS_KEYS.filter((cls) => INSTITUTION_CLASSES[cls].powers.includes(power))),
  ]),
));

/**
 * Catalogue rows that CONTAIN a class keyword and back NOTHING — named so the keyword
 * fallback (which applies only to non-catalogue names) can never re-admit them, and so
 * the reason each is refused is written where the refusal lives.
 * @type {Readonly<Record<string, string>>} row (lowercased) → reason
 */
export const NON_BACKING_ROWS = Object.freeze({
  'access to parish church': 'a walk to the next village; the church is not here',
  'priest (resident)': 'a person, not an institution',
  'village musician': 'a person, not an institution',
  'hedge wizard': 'a person, not an institution',
  'traveling hedge wizard': 'a person passing through',
  'scroll scribe': 'a person, not an institution',
  'local fence': 'a person, not an institution',
  'fence (word of mouth)': 'a person, not an institution',
  'contract killer': 'a person, not an institution',
  'bandit affiliate': "a household's arrangement, not an institution",
  'burial ground': 'no clergy speak over it (the row\'s own text); a burial ground maps to nothing',
  'graveyard': 'a burial ground maps to nothing',
  'parish burial grounds': 'a burial ground maps to nothing',
  'burial grounds and charnel house': 'a burial ground maps to nothing',
  'cemetery network': 'a burial ground maps to nothing',
  'teleportation circle': 'infrastructure, not an order',
  'planar embassy': "a foreign power's house, not the town's",
  'great library': 'a library is scholarship, not an arcane order',
  "sage's quarter": 'scholarship, not an arcane order',
  'golem workforce': 'arcane labour, not an order',
  'undead labor': 'arcane labour, not an order',
  'dream parlors (high magic)': 'a trade in dreams, not an order',
  'airship docking (high magic)': 'infrastructure',
  'message network (high magic)': 'infrastructure',
  "harbour master's office": "a port officer, not a force and not a merchant house",
  'customs house': "the crown's office, not a merchant house",
  'assay office': "the crown's office, not a merchant house",
  'town walls': 'fabric is not a force',
  'city walls and gates': 'fabric is not a force',
  'massive walls and fortifications': 'fabric is not a force',
  'gates (if walled)': 'fabric is not a force',
  'palisade': 'fabric is not a force',
  'palisade or earthworks': 'fabric is not a force',
  'citadel': 'fabric is not a force',
  'gladiatorial school': 'entertainment, not a force',
  'fighting pits': 'entertainment',
  'colosseum/arena': 'entertainment',
  'gambling den': 'entertainment, not the underworld',
  'gambling halls': 'entertainment, not the underworld',
  'gambling district': 'entertainment, not the underworld',
  'mill': 'a mill maps to nothing (the owner\'s own example)',
  'mills (2-5)': 'a mill maps to nothing',
  'access to external mill': 'a mill maps to nothing',
  'resident smith (part-time)': 'a part-time individual',
  'carpenter (part-time)': 'a part-time individual',
  'woodcarver': 'an individual craftsman; the religious tag is decoration',
  'stable master': 'an individual',
  'stable yard': 'a yard, not a workshop',
  'stable district': 'a yard, not a workshop',
  'pack animal trader': 'an individual trader',
  'town crier': 'a person',
  'village scribe': 'a person',
  'midwife': 'a person',
  'thatcher': 'an individual',
  'charlatan fortune tellers': 'persons',
  'beast trainers': 'persons',
  'traveling performers': 'persons passing through',
  'dungeon delving supply district': 'a shop district for outsiders',
  'listening post': 'information brokerage',
  "chroniclers' exchange": 'information brokerage',
  'public bathhouse': 'infrastructure',
  'post relay station': 'infrastructure',
  'toll bridge': 'infrastructure',
  'river ferry': 'infrastructure',
  'waystation': 'lodging',
  'coaching inn': 'lodging',
  'inn (multiple)': 'lodging',
  'inns and taverns (district)': 'lodging',
  "travelers' inn": 'lodging',
  'wayside inn': 'lodging',
  'taverns (5-20)': 'lodging',
  'ale house': 'lodging',
  'alehouse': 'lodging',
  'workhouse': 'civic relief, not a guild',
  'mint': 'the crown\'s office at town (the city\'s official mint is a banking house)',
});

/** The custom-institution `authority` enum → the powers it declares. */
const AUTHORITY_POWERS = Object.freeze({
  religious: Object.freeze(['religious']),
  martial: Object.freeze(['military']),
  economic: Object.freeze(['merchant']),
  arcane: Object.freeze(['arcane']),
  civic: Object.freeze(['government']),
  noble: Object.freeze(['noble']),
  criminal: Object.freeze(['criminal']),
  // 'popular' names no standing power: a popular authority is a crowd, not an institution.
  popular: Object.freeze([]),
});

/** A custom row's declared catalogue SECTION → the powers it backs by default. */
const CATEGORY_POWERS = Object.freeze({
  religious: Object.freeze(['religious']),
  defense: Object.freeze(['military']),
  military: Object.freeze(['military']),
  criminal: Object.freeze(['criminal']),
  magic: Object.freeze(['arcane']),
  arcane: Object.freeze(['arcane']),
  economy: Object.freeze(['merchant']),
  economic: Object.freeze(['merchant']),
  crafts: Object.freeze(['craft']),
  government: Object.freeze(['government']),
});

/** A custom row's tags → powers (any tag hits). */
const TAG_POWERS = Object.freeze({
  religious: 'religious', church: 'religious', monastery: 'religious',
  market: 'merchant', banking: 'merchant', warehouse: 'merchant', port: 'merchant',
  guild: 'craft',
  military: 'military', defense: 'military', law_enforcement: 'military',
  criminal: 'criminal', underground: 'criminal', smuggling: 'criminal',
  arcane: 'arcane', alchemy: 'arcane', enchanting: 'arcane',
  noble: 'noble', civic: 'government',
});

/**
 * THE CRISIS CLASS — every faction the stress injector mints (`power/stressFactions.js`),
 * by name: events, not standing powers. Exempt from the institution rule; stamped
 * `crisis: true` at mint; they expire with their crisis. A row listed here is never
 * gated and never marked `unbacked`. If one is ever backed by an institution row it has
 * become a standing power and the ordinary rule applies (`factionIsBacked` answers for
 * it like any other) — but the exemption from GATING stays until the owner lifts it.
 *
 * `needs` names the class a later gate would read, so the owner's decision is a table
 * edit. `retiredBy` names the one retirement road that exists today.
 * @type {Readonly<Record<string, Readonly<{stress: string, needs: ReadonlyArray<string>, retiredBy: string|null}>>>}
 */
export const CRISIS_FACTIONS = Object.freeze({
  'War Council': Object.freeze({ stress: 'under_siege|wartime', needs: Object.freeze(['force', 'hall']), retiredBy: null }),
  'Occupation Authority': Object.freeze({ stress: 'occupied', needs: Object.freeze([]), retiredBy: 'applyWorldPulseOccupationAuthority (liberation)' }),
  'Resistance Network': Object.freeze({ stress: 'occupied', needs: Object.freeze([]), retiredBy: 'applyWorldPulseOccupationAuthority (liberation)' }),
  'Loyalist Noble Bloc': Object.freeze({ stress: 'politically_fractured', needs: Object.freeze(['lordship']), retiredBy: null }),
  'Rival Faction B': Object.freeze({ stress: 'politically_fractured', needs: Object.freeze([]), retiredBy: null }),
  'Reform Noble Bloc': Object.freeze({ stress: 'politically_fractured', needs: Object.freeze(['lordship']), retiredBy: null }),
  'Third Bloc (Neutrals)': Object.freeze({ stress: 'politically_fractured', needs: Object.freeze([]), retiredBy: null }),
  'Crown Creditors (Noble Coalition)': Object.freeze({ stress: 'indebted', needs: Object.freeze(['lordship', 'merchant_house']), retiredBy: null }),
  "Creditor's Representative": Object.freeze({ stress: 'indebted', needs: Object.freeze([]), retiredBy: null }),
  'Investigation Faction': Object.freeze({ stress: 'recently_betrayed', needs: Object.freeze([]), retiredBy: null }),
  'Unknown Faction (hidden)': Object.freeze({ stress: 'infiltrated', needs: Object.freeze([]), retiredBy: null }),
  'Noble Claimant (Senior Line)': Object.freeze({ stress: 'succession_void', needs: Object.freeze(['lordship']), retiredBy: null }),
  'Claimant Bloc A': Object.freeze({ stress: 'succession_void', needs: Object.freeze([]), retiredBy: null }),
  'Noble Claimant (Reform Faction)': Object.freeze({ stress: 'succession_void', needs: Object.freeze(['lordship']), retiredBy: null }),
  'Claimant Bloc B': Object.freeze({ stress: 'succession_void', needs: Object.freeze([]), retiredBy: null }),
  'Grain Holders': Object.freeze({ stress: 'famine', needs: Object.freeze(['granary (no class today: a granary maps to nothing)']), retiredBy: null }),
  'Quarantine Council': Object.freeze({ stress: 'plague_onset', needs: Object.freeze(['faith_house', 'hall']), retiredBy: null }),
  'Monster Hunters / Adventurers': Object.freeze({ stress: 'monster_pressure', needs: Object.freeze(['force']), retiredBy: null }),
  "Commons' Reform Assembly": Object.freeze({ stress: 'insurgency', needs: Object.freeze([]), retiredBy: null }),
  "Journeymen's League": Object.freeze({ stress: 'insurgency', needs: Object.freeze(['craft_guild', 'workshop']), retiredBy: null }),
  "People's Council": Object.freeze({ stress: 'insurgency', needs: Object.freeze([]), retiredBy: null }),
  'Loyalist Noble Opposition': Object.freeze({ stress: 'insurgency', needs: Object.freeze(['lordship']), retiredBy: null }),
  "Reform Stewards' Coalition": Object.freeze({ stress: 'insurgency', needs: Object.freeze(['lordship']), retiredBy: null }),
  'Reformist Faction': Object.freeze({ stress: 'insurgency', needs: Object.freeze([]), retiredBy: null }),
  "Newcomers' Settlement": Object.freeze({ stress: 'mass_migration', needs: Object.freeze([]), retiredBy: null }),
  'Departure Committee': Object.freeze({ stress: 'mass_migration', needs: Object.freeze([]), retiredBy: null }),
  'Peace Faction': Object.freeze({ stress: 'wartime', needs: Object.freeze(['merchant_house', 'faith_house']), retiredBy: null }),
  'New Faith Community': Object.freeze({ stress: 'religious_conversion', needs: Object.freeze([]), retiredBy: null }),
  'Reform Congregation': Object.freeze({ stress: 'religious_conversion', needs: Object.freeze(['faith_house']), retiredBy: null }),
  'Conversion Enforcement Office': Object.freeze({ stress: 'religious_conversion', needs: Object.freeze([]), retiredBy: null }),
  'Underground Old Faith': Object.freeze({ stress: 'religious_conversion', needs: Object.freeze(['faith_house']), retiredBy: null }),
  'Revolt Leadership': Object.freeze({ stress: 'slave_revolt', needs: Object.freeze([]), retiredBy: null }),
  'Abolitionist Network': Object.freeze({ stress: 'slave_revolt', needs: Object.freeze([]), retiredBy: null }),
});

/** @param {unknown} v @returns {string} */
const lower = (v) => String(v || '').trim().toLowerCase();

/** The one lowercased index of every enumerated row → its class. Built once. */
const ROW_CLASS = (() => {
  /** @type {Map<string, string>} */
  const m = new Map();
  for (const cls of INSTITUTION_CLASS_KEYS) {
    for (const row of INSTITUTION_CLASSES[cls].rows) m.set(row, cls);
  }
  return m;
})();

/** Every enumerated row name, lowercased — a catalogue row's verdict is exactly this. */
export const BACKING_ROW_NAMES = Object.freeze([...ROW_CLASS.keys()].sort());

/**
 * Validate a custom row's `backsPowers` declaration: an array whose every entry is a
 * gated archetype. Anything else reads as "not declared" (derive from the class).
 * @param {unknown} value
 * @returns {ReadonlyArray<string>|null}
 */
export function declaredBacksPowers(value) {
  if (!Array.isArray(value) || !value.length) return null;
  const powers = value.map(lower).filter((p) => GATED_ARCHETYPES.includes(p));
  if (powers.length !== value.length) return null;
  return Object.freeze([...new Set(powers)]);
}

/**
 * The powers ONE institution row backs — the row's whole verdict, in one place.
 *
 * A NATIVE row is answered by the enumeration alone (its exact catalogue name); a
 * native name that is not a catalogue row (a fixture, a legacy spelling) falls to the
 * keyword fallback unless NON_BACKING_ROWS names it. A CUSTOM row is answered by its
 * declared class: `backsPowers` > `authority` > `category` > tags > its own name.
 *
 * @param {unknown} inst
 * @returns {ReadonlyArray<string>} the archetypes this row represents (possibly empty)
 */
export function powersBackedByInstitution(inst) {
  if (!inst || typeof inst !== 'object') return Object.freeze([]);
  const row = /** @type {Record<string, unknown>} */ (inst);
  if (isMaterializedCustomContent(inst)) {
    const declared = declaredBacksPowers(row.backsPowers);
    if (declared) return declared;
    const byAuthority = AUTHORITY_POWERS[/** @type {keyof typeof AUTHORITY_POWERS} */ (lower(row.authority))];
    if (byAuthority) return byAuthority;
    const byCategory = CATEGORY_POWERS[/** @type {keyof typeof CATEGORY_POWERS} */ (lower(row.category))];
    if (byCategory) return byCategory;
    const tags = Array.isArray(row.tags) ? row.tags.map(lower) : [];
    const byTags = tags.map((t) => TAG_POWERS[/** @type {keyof typeof TAG_POWERS} */ (t)]).filter(Boolean);
    if (byTags.length) return Object.freeze([...new Set(byTags)]);
    return powersForName(lower(row.name));
  }
  return powersForName(lower(nativeSemanticName(inst)));
}

/**
 * The powers a NAME backs: the enumeration for a catalogue row, the keyword fallback
 * for anything else (never for a NON_BACKING row).
 * @param {string} name lowercased
 * @returns {ReadonlyArray<string>}
 */
function powersForName(name) {
  if (!name) return Object.freeze([]);
  const cls = ROW_CLASS.get(name);
  if (cls) return INSTITUTION_CLASSES[cls].powers;
  if (Object.prototype.hasOwnProperty.call(NON_BACKING_ROWS, name)) return Object.freeze([]);
  /** @type {string[]} */
  const out = [];
  for (const key of INSTITUTION_CLASS_KEYS) {
    const def = INSTITUTION_CLASSES[key];
    if (def.keywords.some((kw) => name.includes(kw))) {
      for (const p of def.powers) if (!out.includes(p)) out.push(p);
    }
  }
  return Object.freeze(out);
}

/**
 * The class (or null) one institution row falls in — for a surface that names the row's
 * seat rather than its powers. Native rows only; a custom row has no catalogue class.
 * @param {unknown} inst
 * @returns {string|null}
 */
export function institutionClassOf(inst) {
  if (!inst || typeof inst !== 'object' || isMaterializedCustomContent(inst)) return null;
  return ROW_CLASS.get(lower(nativeSemanticName(inst))) || null;
}

/**
 * THE LIVE READ — every archetype at least one STANDING institution row represents,
 * with the rows that carry it.
 *
 * Reads `liveInstitutions(settlementLike)`: a calamity-ruined / abandoned /
 * economically-closed row backs nothing. At generation nothing is ruined yet, so the
 * generator's roster reads whole; in play, the roster as it stands today.
 *
 * @param {{institutions?: unknown}|null|undefined} settlementLike
 * @returns {Readonly<Record<string, ReadonlyArray<string>>>} archetype → row names
 */
export function backedArchetypesOf(settlementLike) {
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const inst of liveInstitutions(settlementLike)) {
    const powers = powersBackedByInstitution(inst);
    if (!powers.length) continue;
    const name = isMaterializedCustomContent(inst)
      ? String(/** @type {Record<string, unknown>} */ (inst).name || '')
      : nativeSemanticName(inst);
    for (const p of powers) (out[p] ||= []).push(name);
  }
  return Object.freeze(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.freeze(v)])));
}

/**
 * The engine's own standing-power names → the archetype each is gated under. Read
 * BEFORE the canonical detector because `factionArchetype` answers category-first and
 * the generator files 'Craft Guilds' under category `economy` (→ merchant), which would
 * mark the crafts unbacked in a town whose market closed while its workshops stand.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const CANONICAL_NAME_ARCHETYPES = Object.freeze({
  'merchant guilds': Object.freeze(['merchant']),
  'merchant guilds (dominant)': Object.freeze(['merchant']),
  'craft guilds': Object.freeze(['craft']),
  'military/guard': Object.freeze(['military']),
  'religious authorities': Object.freeze(['religious']),
  "thieves' guild": Object.freeze(['criminal']),
  'arcane orders': Object.freeze(['arcane']),
  'manor household': Object.freeze(['noble']),
  'landed gentry': Object.freeze(['noble']),
  'noble families': Object.freeze(['noble']),
  'noble houses': Object.freeze(['noble']),
});

/**
 * The archetypes a FACTION record is gated under — ANY one of them backed keeps the
 * faction standing — or null when it is exempt: the governing seat (R14), a crisis
 * faction (an event), a DM-authored house (the author's word), or a faction of no
 * gated archetype (`other`, `civic`, `labor`, `outsider`, `occupation`).
 *
 * The engine's own names answer first (the table above); a faction filed under the
 * generator's `economy` category (a neighbour's mirror, a density-minted house) is
 * kept by a merchant OR a craft row, as its mint was gated; everything else answers
 * from the canonical detector.
 *
 * @param {unknown} faction
 * @returns {ReadonlyArray<string>|null}
 */
export function gatedArchetypesOf(faction) {
  if (!faction || typeof faction !== 'object') return null;
  const f = /** @type {Record<string, unknown>} */ (faction);
  if (f.isGoverning === true) return null;
  if (f.crisis === true) return null;
  const name = String(f.faction || f.name || '');
  if (Object.prototype.hasOwnProperty.call(CRISIS_FACTIONS, name)) return null;
  if (f.createdByEventId) return null;
  const canonical = CANONICAL_NAME_ARCHETYPES[/** @type {keyof typeof CANONICAL_NAME_ARCHETYPES} */ (lower(name))];
  if (canonical) return canonical;
  if (lower(f.category) === 'economy') return Object.freeze(['merchant', 'craft']);
  const a = factionArchetype(faction);
  if (a === FACTION_ARCHETYPES.GOVERNMENT) return null;
  return GATED_ARCHETYPES.includes(a) ? Object.freeze([a]) : null;
}

/**
 * The first gated archetype of a faction, or null when exempt — for a surface that
 * wants one word. `gatedArchetypesOf` is the predicate's own read.
 * @param {unknown} faction
 * @returns {string|null}
 */
export function gatedArchetypeOf(faction) {
  const list = gatedArchetypesOf(faction);
  return list && list.length ? list[0] : null;
}

/**
 * THE PREDICATE. Is `archetype` represented by a standing institution row here?
 * `government` is always backed (the governing seat is never gated).
 * @param {string} archetype
 * @param {{institutions?: unknown}|null|undefined} settlementLike
 * @returns {boolean}
 */
export function factionIsBacked(archetype, settlementLike) {
  const a = lower(archetype);
  if (a === 'government') return true;
  const backed = backedArchetypesOf(settlementLike);
  return Array.isArray(backed[a]) && backed[a].length > 0;
}

/**
 * Is this FACTION record kept standing by the roster — exempt, or any of its gated
 * archetypes backed?
 * @param {unknown} faction
 * @param {Readonly<Record<string, ReadonlyArray<string>>>} backed  a `backedArchetypesOf` read
 * @returns {boolean}
 */
export function factionRecordIsBacked(faction, backed) {
  const list = gatedArchetypesOf(faction);
  if (!list) return true;
  return list.some((a) => Array.isArray(backed[a]) && backed[a].length > 0);
}

/**
 * SPEAKERS = POWERS — the town's powers as the institution roster represents them,
 * beside the factions actually seated, so the chair can reconcile this against the
 * prose kernel's `sourcesOf(settlement)`.
 *
 * @param {{institutions?: unknown, powerStructure?: {factions?: unknown}|null}|null|undefined} settlement
 * @returns {Readonly<{
 *   backed: Readonly<Record<string, ReadonlyArray<string>>>,
 *   present: ReadonlyArray<Readonly<{faction: string, archetype: string|null, backed: boolean, exempt: boolean, crisis: boolean}>>,
 *   unbacked: ReadonlyArray<string>,
 * }>}
 */
export function powersOf(settlement) {
  const backed = backedArchetypesOf(settlement);
  const ps = settlement && typeof settlement === 'object' ? /** @type {Record<string, unknown>} */ (settlement).powerStructure : null;
  const list = ps && typeof ps === 'object' && Array.isArray(/** @type {Record<string, unknown>} */ (ps).factions)
    ? /** @type {Record<string, unknown>[]} */ (/** @type {Record<string, unknown>} */ (ps).factions)
    : [];
  const present = list.map((f) => {
    const archetype = gatedArchetypeOf(f);
    const name = String(f.faction || f.name || '');
    const isCrisis = f.crisis === true || Object.prototype.hasOwnProperty.call(CRISIS_FACTIONS, name);
    return Object.freeze({
      faction: name,
      archetype,
      backed: factionRecordIsBacked(f, backed),
      exempt: archetype === null,
      crisis: isCrisis,
    });
  });
  return Object.freeze({
    backed,
    present: Object.freeze(present),
    unbacked: Object.freeze(present.filter((p) => !p.backed).map((p) => p.faction)),
  });
}
