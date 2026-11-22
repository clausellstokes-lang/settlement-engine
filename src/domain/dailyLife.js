/**
 * domain/dailyLife.js — Daily-life prose grounded in structural state.
 *
 * Tier 4.19 of the roadmap. The most consumed output a dossier
 * produces is the "what is life like here?" prose. Until Phase 22,
 * this had to be hand-authored or AI-invented. Phase 22 derives it
 * directly from the substrate that earlier phases built:
 *
 *   - Phase 9  faction profiles (archetype + power)
 *   - Phase 10 supply chain states (food + trade)
 *   - Phase 11 escalation clocks (recent / completed)
 *   - Phase 12 history beats (recentDisruption + unresolvedWound)
 *   - Phase 16 active conditions (current pressures)
 *   - Phase 17 substrate (14 system variables)
 *   - Phase 20 threats (typed pressures, visibility)
 *   - Phase 21 capacity model (supply vs demand for 9 capacities)
 *
 * The 8 canonical daily-life slots — the same shape as Phase 12
 * history beats so consumers render them the same way:
 *
 *   food_culture           What people eat / who controls grain
 *   dawn_work              What work starts at dawn
 *   gathering_places       Where people congregate
 *   child_warnings         What children are warned about
 *   commoner_resentments   What commoners resent
 *   outsider_impressions   What outsiders notice first
 *   unspoken_topics        What locals refuse to discuss
 *   recent_changes         What changed in the last month/season
 *
 * Pure read-only derivation. Returns structured prose with `references`
 * arrays so the UI can let the user click through to the explainEntity
 * envelope for any cited subsystem (Phase 19).
 *
 * No imports from src/lib. No mutation. No AI — this is the pre-AI
 * substrate the AI overlay later grounds in.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllCapacities, CAPACITY_NAMES } from './capacityModel.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveCausalState } from './causalState.js';
import { powerPossessive } from './display/powerSentenceName.js';
import { GATHERING_NAMED, GATHERING_PLAIN } from '../data/dailyLife/gatheringPlaces.js';
import { DAWN_WORK } from '../data/dailyLife/dawnWork.js';
import { CHILD_WARNINGS } from '../data/dailyLife/childWarnings.js';
import { COMMONER_RESENTMENTS_DM } from '../data/dailyLife/commonerResentmentsDm.js';
import { filterDeclared } from './facts/drawDeclared.js';
import { atomHolds } from './facts/factVocabulary.js';
import { factsOf } from './facts/factsOf.js';
import { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } from './facts/institutions.js';
import { isMarketInstitution } from './facts/market.js';
import { liveInstitutions } from './institutions/institutionRoster.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';
import { isHideableHouse } from './people/cardVeil.js';
import { institutionSentenceNoun } from './display/institutionSentenceNoun.js';
import { pickVariantMixed } from '../kernel/proseHash.js';

// ── Local typedefs ───────────────────────────────────────────────────────

/** @typedef {import('./factionProfile.js').FactionProfile} FactionProfile */
/** @typedef {import('./activeConditions.js').ActiveCondition} ActiveCondition */
/** @typedef {import('./supplyChainState.js').DerivedSupplyChainState} DerivedSupplyChainState */
/** @typedef {import('./threatProfile.js').ThreatProfile} ThreatProfile */
/** @typedef {import('./capacityModel.js').CapacityState} CapacityState */
/** @typedef {import('./causalState.js').CausalState} CausalState */

/**
 * A structured reference pointer consumers can hand to explainEntity.
 * @typedef {{id: string, label: string, type: string}} SlotReference
 */

/**
 * One canonical daily-life slot.
 * @typedef {Object} DailyLifeSlot
 * @property {string} key
 * @property {string} label
 * @property {string} text
 * @property {string} source
 * @property {SlotReference[]} references
 */

/**
 * Institution entry as this module reads it.
 * @typedef {{id?: string, name: string}} InstitutionLike
 */

/**
 * Settlement fields this module reads directly (everything else flows
 * through the substrate derivers, which take the full settlement).
 * @typedef {Object} DailyLifeSettlement
 * @property {InstitutionLike[]} [institutions]
 * @property {import('./supplyChainState.js').ChainsSettlementSource['economicState']} [economicState]
 * @property {import('./threatProfile.js').ThreatSurfaceSettlement['config']} [config]
 * @property {import('./settlement.schema.js').StressorEntry[] | import('./settlement.schema.js').StressorEntry} [stressors]
 */

/**
 * History-beat fields this module reads (historyBeats.js is still untyped).
 * @typedef {{key: string, label: string, text: string, source: string}} HistoryBeatLike
 */

/**
 * The precomputed substrate context shared by every slot deriver.
 * @typedef {Object} DailyLifeContext
 * @property {FactionProfile[]} profiles
 * @property {DerivedSupplyChainState[]} chains
 * @property {ActiveCondition[]} conditions
 * @property {ThreatProfile[]} threats
 * @property {CapacityState} capacities
 * @property {CausalState} causal
 * @property {{recentDisruption?: HistoryBeatLike|null, unresolvedWound?: HistoryBeatLike|null}} history
 */

// ── Canonical catalog ────────────────────────────────────────────────────

export const DAILY_LIFE_SLOTS = Object.freeze([
  'food_culture',
  'dawn_work',
  'gathering_places',
  'child_warnings',
  'commoner_resentments',
  'outsider_impressions',
  'unspoken_topics',
  'recent_changes',
]);

/** @type {Readonly<Record<string, string>>} */
const SLOT_LABELS = Object.freeze({
  food_culture:         'Food culture',
  dawn_work:            'Dawn work',
  gathering_places:     'Gathering places',
  child_warnings:       'Child warnings',
  commoner_resentments: 'Commoner resentments',
  outsider_impressions: 'Outsider impressions',
  unspoken_topics:      'Unspoken topics',
  recent_changes:       'Recent changes',
  commoner_resentments_dm: 'Commoner resentments (owner only)',
});

/**
 * THE OWNER-ONLY SLOT (the chair's ruling 6 of 2026-11-20; DAILY-3 B3 E1): carries the crime clauses, and is derived
 * ONLY when the caller passes the audience `'owner'` (`deriveDailyLife(record, { audience: 'owner' })`). It is not one of
 * `DAILY_LIFE_SLOTS`: no default derives it, `deriveDailyLifeSlot` does not know it, `compareDailyLife` never diffs it,
 * and on every other read the key is ABSENT (`tests/domain/dailyLifeOwnerSlot.test.js`).
 */
const OWNER_ONLY_DAILY_LIFE_SLOT = 'commoner_resentments_dm';

// ── Per-slot derivers ────────────────────────────────────────────────────
//
// Every deriver takes the settlement + a precomputed substrate context
// and returns a single slot:
//
//   { key, label, text, source, references }
//
// references[] is an array of structured pointers (id + type + label)
// that consumers can hand to Phase 19's explainEntity. The deriver
// always produces a slot — even when data is thin, it falls back to
// a generic but truthful line.

/**
 * @param {unknown} s
 * @returns {string}
 */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveFoodCulture(s, ctx) {
  const refs = [];
  const food = ctx.capacities.capacities.food_production;
  const foodChains = ctx.chains.filter(c => c.needKey === 'food_security');
  const stableFood = foodChains.find(c => c.status === 'stable');
  const disruptedFood = foodChains.find(c => c.status !== 'stable');

  // BAR5-WORLD (2026-11-16; LAW 5): a town under a famine or a siege is not told its bread is plentiful: the surplus band
  // takes its twin, true while the stores hold (the measure's rule 3: a town in want is told what it still has).
  const wanting = ctx.threats.some((t) => t.type === 'famine' || t.type === 'siege');
  let text;
  switch (food.band) {
    case 'surplus':
      text = wanting
        ? 'The stores still hold: bread and broth reach most tables, and the households count what is left.'
        : stableFood
        ? `Bread, broth, and ${stableFood.outputs?.[0] || 'staple grains'} are plentiful; markets close their stalls without empty crates.`
        : 'Bread and broth are plentiful; few households go to bed hungry.';
      break;
    case 'adequate':
      text = 'Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets.';
      break;
    case 'strained':
      text = disruptedFood
        ? `Loaves shrink each month; ${disruptedFood.name.toLowerCase()} is ${disruptedFood.status}, and householders stretch what arrives.`
        : 'Loaves shrink each month; householders stretch what they can.';
      break;
    case 'critical':
      text = disruptedFood
        ? `Rations are tight: ${disruptedFood.name.toLowerCase()} is ${disruptedFood.status}, and the poor eat watered stew.`
        : 'Rations are tight; the poor eat watered stew and the well-off hoard quietly.';
      break;
    default:  // collapsed
      text = 'Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived.';
      break;
  }

  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  for (const c of foodChains) refs.push({ id: c.id, label: c.name, type: 'chain' });

  return slot('food_culture', text, 'capacity.food_production + supply chains', refs);
}

// Owner decision (W6#4): labor/craft/transport are noise lenses — this
// slot no longer reads or cites them. Dawn work re-anchors on the
// canonical food_production + defense lenses (what the first hours of
// the day are FOR: bread and walls); the guild/merchant flavor the
// craft band used to gate now keys off faction power alone.
//
// DAILY-2 B2 D1 (LINES-1 § dawn_work and LINES-1b, as the chair ruled at 18:37, 18:53 and 18:56): the six branches are
// kept, but the defence branch needs a real outside threat (ruling 8: a siege, monster pressure, bandit raids or a hostile
// neighbour at medium or above; a rating low because a place is small is no danger). Each branch's pool
// (`data/dailyLife/dawnWork.js :: DAWN_WORK`) goes by THE ROUTE (`pickNameable`, below); no line true: the EMPTY string (ruling 3).

/** The capacity bands that are a want. */
const WANTING_BANDS = Object.freeze(['critical', 'collapsed']);
/** Ruling 8: the threats to people outside (`threatProfile.js`'s kinds), taken at `severityBand` medium or above. */
const OUTSIDE_THREATS = Object.freeze(['siege', 'monster_pressure', 'bandit_raids', 'rival_neighbor']);
const MEDIUM_OR_ABOVE = Object.freeze(['medium', 'high', 'critical']);

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveDawnWork(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const food = ctx.capacities.capacities.food_production;
  const defense = ctx.capacities.capacities.defense;
  const dominantCraftPower = ctx.profiles.find(p => p.archetype === 'craft')?.power || 0;
  const dominantMerchantPower = ctx.profiles.find(p => p.archetype === 'merchant')?.power || 0;
  const outside = ctx.threats.some((t) => OUTSIDE_THREATS.includes(t.type) && MEDIUM_OR_ABOVE.includes(t.severityBand));

  // BAR5-WORLD (2026-11-16; LAW 5): under a siege no caravan rolls; the merchants' dawn is a count of their stock.
  /** @type {keyof typeof DAWN_WORK} */
  const branch = WANTING_BANDS.includes(food.band) ? 'food'
    : WANTING_BANDS.includes(defense.band) && outside ? 'defence'
    : dominantCraftPower >= 25 ? 'craft'
    : dominantMerchantPower >= 30 && ctx.threats.some((t) => t.type === 'siege') ? 'merchant_siege'
    : dominantMerchantPower >= 30 ? 'merchant'
    : 'default';

  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  refs.push({ id: 'capacity.defense', label: 'Defense', type: 'capacity' });

  const house = houseFinder(s);
  const eligible = filterDeclared(DAWN_WORK[branch], { facts: factsFor(s), poolId: `dailyLife.dawn_work.${branch}`, surface: 'dailyLife' });
  const text = sayDeclared(pickNameable(s, eligible, 'dawn_work', branch, house), house, refs);

  return slot('dawn_work', text, 'capacity.food_production + capacity.defense + dominant faction', refs);
}

// ── gathering_places (DAILY-1 LINES-1 § gathering_places, as the chair ruled at 18:37 and 18:56) ──
//
// THE RE-CUT: `named` when the record holds a live sacred house, market or inn the page may name, else `plain`.
// THE ROUTE (ruling 12): a branch's pool (`data/dailyLife/gatheringPlaces.js`) is filtered to the lines the record
// admits by their declared atoms (`facts/drawDeclared.js :: filterDeclared`) and whose every named house the live roster
// can name; then `kernel/proseHash.js :: pickVariantMixed(eligible, '<name>::dailyLife.gathering_places::<branch>')`
// picks one (a nameless record takes index 0 of the eligible list). No line true: the EMPTY string (ruling 3).

/** @typedef {{ id?: string, name?: string }} RosterRow */

/** The sacred house by preference: a cathedral, then a temple/church/abbey/chapel, then a shrine, then a monastery. */
const SACRED_ORDER = Object.freeze([/\bcathedral/i, /\btemple|\bchurch|\babbey|\bchapel/i, /\bshrine/i, /\bmonaster|\bfriary\b/i]);
/** The same without the shrine (a wayside shrine is no church). */
const CHURCH_ORDER = Object.freeze([SACRED_ORDER[0], SACRED_ORDER[1], SACRED_ORDER[3]]);
const MARKET_NAME = /\bmarkets?\b(?!\s*squares?)/i;
const DOCKS_NAME = /\bdocks?\b|\bwharf|\bquays?\b/i;

/** @param {unknown} inst @returns {string} the row's native name */
const rowName = (inst) => String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {RosterRow} */ (inst)?.name || '');

/**
 * The rows a line may name: live (`liveInstitutions`), never hideable (`cardVeil.js :: isHideableHouse`), never
 * an access-only row (`ACCESS_ONLY`), in roster order.
 * @param {DailyLifeSettlement} s @returns {RosterRow[]}
 */
function nameableRows(s) {
  return /** @type {RosterRow[]} */ (liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (/** @type {unknown} */ (s)))).filter((i) => !isHideableHouse(/** @type {Record<string, unknown>} */ (i)) && !ACCESS_ONLY.test(rowName(i)));
}

/** @param {RosterRow[]} rows @param {RegExp} re @param {(i: RosterRow) => boolean} [extra] @returns {RosterRow|undefined} */
const firstRow = (rows, re, extra = () => true) => rows.find((i) => re.test(rowName(i)) && extra(i));

/** The house a `{placeholder}` names (every slot's), found in the nameable rows. @type {Readonly<Record<string, (rows: RosterRow[]) => RosterRow|undefined>>} */
const DAILY_HOUSES = Object.freeze({
  sacred: (rows) => SACRED_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  church: (rows) => CHURCH_ORDER.map((re) => firstRow(rows, re)).find(Boolean),
  cathedral: (rows) => firstRow(rows, /\bcathedral/i),
  market: (rows) => firstRow(rows, MARKET_NAME, isMarketInstitution),
  square: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.square, isMarketInstitution),
  inn: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.tavern),
  mill: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.mill),
  bathhouse: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bathhouse),
  bridge: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.bridge),
  docks: (rows) => firstRow(rows, DOCKS_NAME),
  theater: (rows) => firstRow(rows, INSTITUTION_KIND_PATTERNS.theatre),
});

/** @param {string} text @returns {string[]} the houses a line names */
const housesNamedIn = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

/** @typedef {import('./facts/factVocabulary.js').FactsLike} FactsLike */
/** @typedef {(k: string) => RosterRow|undefined} HouseFinder */

/** @param {DailyLifeSettlement} s @returns {FactsLike} the record's fact homes */
const factsFor = (s) => /** @type {FactsLike} */ (/** @type {unknown} */ (factsOf(s)));

/**
 * One record's house finder: a `{placeholder}` → its row among the nameable rows, each looked up once.
 * @param {DailyLifeSettlement} s @returns {HouseFinder}
 */
function houseFinder(s) {
  const rows = nameableRows(s);
  /** @type {Record<string, RosterRow|undefined>} */
  const found = {};
  return (k) => (k in found ? found[k] : (found[k] = DAILY_HOUSES[k]?.(rows)));
}

/**
 * THE ROUTE (ruling 11), one for every slot: each deriver hands its branch's pool to the door itself
 * (`facts/drawDeclared.js :: filterDeclared`, the pool named in the call so the presumed-things walker sees it drawn);
 * here the lines the record admits keep only those whose every named house the live roster can name, and
 * `kernel/proseHash.js :: pickVariantMixed(eligible, '<name>::dailyLife.<slot>::<branch>')` picks one (a nameless
 * record takes index 0 of the eligible list; no eligible line, nothing).
 * @template {{ text: string }} T
 * @param {DailyLifeSettlement} s @param {ReadonlyArray<T>} admitted the door's lines @param {string} slotKey @param {string} branch
 * @param {HouseFinder} house
 * @returns {T|undefined}
 */
function pickNameable(s, admitted, slotKey, branch, house) {
  const eligible = admitted.filter((l) => housesNamedIn(l.text).every((k) => !!house(k)));
  const name = /** @type {{ name?: unknown }} */ (s).name;
  return pickVariantMixed(eligible, typeof name === 'string' && name ? `${name}::dailyLife.${slotKey}::${branch}` : null);
}

/**
 * A picked line said: each `{house}` its row's `the <noun>` (`display/institutionSentenceNoun.js`), the row cited.
 * @param {{ text: string }|undefined} pick @param {HouseFinder} house @param {SlotReference[]} refs @returns {string} '' for no line
 */
function sayDeclared(pick, house, refs) {
  return pick ? pick.text.replace(/\{(\w+)\}/g, (_, k) => {
    const row = /** @type {RosterRow} */ (house(k));
    const label = String(row.name || '');
    refs.push({ id: row.id || `institution.${snakeCase(label)}`, label, type: 'institution' });
    return `the ${institutionSentenceNoun(label)}`;
  }) : '';
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} _ctx
 * @returns {DailyLifeSlot}
 */
function deriveGatheringPlaces(s, _ctx) {
  const facts = factsFor(s);
  const house = houseFinder(s);
  // the branch: a house of the three kinds the record holds (its atom) and the roster can name
  const named = (atomHolds('sacredHouse', facts) === true && !!house('sacred'))
    || (atomHolds('market', facts) === true && !!house('market'))
    || (atomHolds('institution: tavern', facts) === true && !!house('inn'));
  const branch = named ? 'named' : 'plain';

  /** @type {SlotReference[]} */
  const refs = [];
  const eligible = filterDeclared(named ? GATHERING_NAMED : GATHERING_PLAIN, { facts, poolId: `dailyLife.gathering_places.${branch}`, surface: 'dailyLife' });
  const text = sayDeclared(pickNameable(s, eligible, 'gathering_places', branch, house), house, refs);

  return slot('gathering_places', text, 'the live roster, by the lines\' declared atoms (LINES-1)', refs);
}

// ── child_warnings (DAILY-1 LINES-1 § child_warnings and LINES-1b, as the chair ruled at 18:37, 18:53 and 18:56) ──
//
// The threats by severity, each KIND said once, the first TWO kinds; a kind from a rating alone is not taken (ruling 8:
// unrest needs a live trouble, economic collapse prosperity struggling or poor or a real stress); a kind with no pool
// (corruption and cult among them) is `default` (D0); no real kind, the `none` pool's whole sentence. Each kind's pool
// (`data/dailyLife/childWarnings.js :: CHILD_WARNINGS`) goes by THE ROUTE (`pickNameable`), keyed by its kind; two kinds
// join "Children are warned about A, and about B.". No line true: the EMPTY string (ruling 3).

/** LINES-1b § 1: the tension types that are a live trouble (`history.currentTensions[].type`, the field `facts/uprising.js`
 * reads); crime_wave, corruption_scandal and infiltration_fear are left out (rule 6). */
const CIVIL_TENSIONS = Object.freeze(['popular_uprising', 'succession_crisis', 'legitimacy_crisis', 'leadership_vacuum', 'tyranny',
  'population_friction', 'disputed_land', 'religious_tension', 'guild_conflict', 'generational_divide', 'economic_disparity', 'heresy_trial']);
/** LINES-1b § 1: the tension types that are a real economic stress. */
const ECON_TENSIONS = Object.freeze(['trade_collapse', 'market_crash', 'outside_debt', 'resource_scarcity']);
/** The threats the defence profile's ratings raise (`threatProfile.js` step 2): a rating alone, no trouble held. */
const RATING_SURFACE = 'defenseProfile';

/** @param {DailyLifeSettlement} s @returns {string[]} the record's live tension types */
function tensionTypes(s) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null }} */ (s)?.history?.currentTensions;
  return (Array.isArray(t) ? t : t ? [t] : []).map((e) => /** @type {{ type?: unknown }} */ (e)?.type).filter((x) => typeof x === 'string');
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveChildWarnings(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const facts = factsFor(s);
  const tensions = tensionTypes(s);
  const conflicts = /** @type {{ conflicts?: unknown }} */ (s).conflicts;
  const prosperity = /** @type {{ prosperity?: unknown }} */ (facts).prosperity;
  const trouble = (Array.isArray(conflicts) && conflicts.length > 0) || tensions.some((t) => CIVIL_TENSIONS.includes(t))
    || ctx.threats.some((t) => t.type === 'unrest' && t.originSurface !== RATING_SURFACE);
  const econStress = prosperity === 'poor' || prosperity === 'struggling'
    || ctx.threats.some((t) => t.type === 'economic_collapse' && t.originSurface !== RATING_SURFACE)
    || tensions.some((t) => ECON_TENSIONS.includes(t));
  /** @param {ThreatProfile} t @returns {keyof typeof CHILD_WARNINGS | null} the kind a threat is said as, null if not taken */
  const kindOf = (t) => {
    if ((t.type === 'unrest' && !trouble) || (t.type === 'economic_collapse' && !econStress)) return null;
    return Object.hasOwn(CHILD_WARNINGS, t.type) && t.type !== 'none' && t.type !== 'default'
      ? /** @type {keyof typeof CHILD_WARNINGS} */ (t.type) : 'default';
  };
  /** @type {Map<keyof typeof CHILD_WARNINGS, ThreatProfile>} the first threat of each kind, by severity */
  const byKind = new Map();
  for (const t of [...ctx.threats].sort((a, b) => b.severity - a.severity)) {
    const k = kindOf(t);
    if (k && !byKind.has(k)) byKind.set(k, t);
  }
  const kinds = [...byKind.keys()].slice(0, 2);
  const house = houseFinder(s);

  let text;
  if (!kinds.length) {
    const eligible = filterDeclared(CHILD_WARNINGS.none, { facts, poolId: 'dailyLife.child_warnings.none', surface: 'dailyLife' });
    text = sayDeclared(pickNameable(s, eligible, 'child_warnings', 'none', house), house, refs);
  } else {
    const parts = [];
    for (const kind of kinds) {
      const eligible = filterDeclared(CHILD_WARNINGS[kind], { facts, poolId: `dailyLife.child_warnings.${kind}`, surface: 'dailyLife' });
      const said = sayDeclared(pickNameable(s, eligible, 'child_warnings', kind, house), house, refs);
      if (!said) continue;
      const t = /** @type {ThreatProfile} */ (byKind.get(kind));
      refs.push({ id: t.id, label: t.label, type: 'threat' });
      parts.push(said);
    }
    text = parts.length ? `Children are warned about ${parts.join(', and about ')}.` : '';
  }

  return slot('child_warnings', text, 'top threats by severity', refs);
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveCommonerResentments(s, ctx) {
  const refs = [];
  const causalState = ctx.causal;
  const resentments = [];

  // DAILY-3 B3 E1 (ruling 6): the criminal-opportunity clauses are not said here; they are the owner-only slot's
  // (`deriveCommonerResentmentsDm`, below). A shared read's public slot is chosen by no crime fact.

  // Strained merchant wealth + active food chain pressure → grain prices
  const food = ctx.capacities.capacities.food_production;
  if (food.band === 'strained' || food.band === 'critical' || food.band === 'collapsed') {
    resentments.push('rising bread prices and merchants who claim they cannot help it');
    refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  }

  // Low legitimacy → resent the council/governing body
  if (causalState.bands.public_legitimacy === 'strained' || causalState.bands.public_legitimacy === 'critical' || causalState.bands.public_legitimacy === 'collapsed') {
    resentments.push('the council\'s indifference to ordinary complaints');
    refs.push({ id: 'var.public_legitimacy', label: 'Public legitimacy', type: 'system_variable' });
  }

  // Corruption condition or threat
  const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');
  if (corruption) {
    resentments.push('the officials who keep their posts while honest folk pay the fines');
    refs.push({ id: corruption.id, label: corruption.label, type: 'condition' });
  }

  const text = resentments.length
    ? `Commoners resent ${resentments.join('; and ')}.`
    : 'Commoners voice the small grievances of any town: the gate fee, the rain on market day, the council\'s favorite tavern.';

  return slot('commoner_resentments', text, 'food_production + public_legitimacy + corruption', refs);
}

// ── commoner_resentments_dm (OWNER-ONLY; LINES-2 § 2b and LINES-2b § 6, as the chair ruled at 18:26, 18:47 and 18:56) ──
//
// Today's ladder on `deriveCausalState().scores.criminal_opportunity` (INVERTED, lower_is_better: a high score is more
// crime): `crime70` at >= 70, else `crime55` at >= 55; below 55 no branch and the slot is the EMPTY string (ruling 3).
// The branch's pool (`data/dailyLife/commonerResentmentsDm.js`) goes by THE ROUTE (`pickNameable`), keyed
// `<name>::dailyLife.commoner_resentments_dm::<branch>`. Called by `deriveDailyLife` for the owner's audience alone.

/** The ladder's rungs, highest first: the score at or above which a branch is taken. */
const CRIME_RUNGS = Object.freeze(/** @type {const} */ ([['crime70', 70], ['crime55', 55]]));

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveCommonerResentmentsDm(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const score = ctx.causal.scores.criminal_opportunity ?? 50;
  const branch = CRIME_RUNGS.find(([, at]) => score >= at)?.[0];
  let text = '';
  if (branch) {
    const house = houseFinder(s);
    const eligible = filterDeclared(COMMONER_RESENTMENTS_DM[branch], { facts: factsFor(s), poolId: `dailyLife.commoner_resentments_dm.${branch}`, surface: 'dailyLife' });
    text = sayDeclared(pickNameable(s, eligible, OWNER_ONLY_DAILY_LIFE_SLOT, branch, house), house, refs);
    if (text) refs.push({ id: 'var.criminal_opportunity', label: 'Criminal opportunity', type: 'system_variable' });
  }
  return slot(OWNER_ONLY_DAILY_LIFE_SLOT, text, 'criminal_opportunity (owner only)', refs);
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveOutsiderImpressions(s, ctx) {
  const refs = [];
  const top = [...ctx.threats].sort((a, b) => b.severity - a.severity)[0];
  const dominantFaction = ctx.profiles
    .slice()
    .sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const strainedCaps = CAPACITY_NAMES
    .filter(n => ['strained', 'critical', 'collapsed'].includes(ctx.capacities.bands[n]));

  const parts = [];
  if (dominantFaction) {
    // R3-CODE-C (the chair's C-L4): the possessive through the one leaf that forms a power's ("Merchant Guilds's" → "Merchant Guilds'").
    parts.push(`${powerPossessive(dominantFaction.name)} mark is on every door that matters`);
    refs.push({ id: dominantFaction.id, label: dominantFaction.name, type: 'faction' });
  }
  if (top && top.severityBand !== 'low') {
    parts.push(`${top.label.toLowerCase()} is the obvious unspoken weight`);
    refs.push({ id: top.id, label: top.label, type: 'threat' });
  }
  if (strainedCaps.length >= 3) {
    parts.push('several civic services run short. Visitors notice missing watch, slow service, or shuttered shops');
  }

  const text = parts.length
    ? `Outsiders notice ${parts.join('; ')}.`
    : 'The settlement reads to outsiders as ordinary. Quiet streets, predictable bells, faces that don\'t yet know yours.';

  return slot('outsider_impressions', text, 'dominant faction + top threat + strained capacities', refs);
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveUnspokenTopics(s, ctx) {
  const refs = [];
  const topics = [];

  // Hidden / rumored threats
  const hidden = ctx.threats.filter(t => t.visibility === 'hidden' || t.visibility === 'rumored');
  for (const t of hidden.slice(0, 2)) {
    topics.push(t.label.toLowerCase());
    refs.push({ id: t.id, label: t.label, type: 'threat' });
  }

  // Unresolved wound from history
  const wound = ctx.history.unresolvedWound;
  if (wound) {
    topics.push('the matter referenced as "the wound"');
    refs.push({ id: 'history.unresolvedWound', label: wound.label, type: 'history_beat' });
  }

  // Recently exposed corruption
  const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');
  if (corruption) {
    topics.push('the names spoken half-whispered in market stalls');
    refs.push({ id: corruption.id, label: corruption.label, type: 'condition' });
  }

  const said = [...new Set(topics)]; // R3-CODE-C (C-L4): a topic said once
  const text = said.length
    ? `Locals will not openly discuss ${said.join('; or ')}.`
    : 'Locals are happy to discuss most things; the usual private subjects stay private.';

  return slot('unspoken_topics', text, 'hidden threats + unresolved history wound + active corruption', refs);
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveRecentChanges(s, ctx) {
  const refs = [];
  const changes = [];

  // Recent disruption from history beats
  const recent = ctx.history.recentDisruption;
  if (recent) {
    changes.push(recent.text);
    refs.push({ id: 'history.recentDisruption', label: recent.label, type: 'history_beat' });
  }

  // Newly-active conditions (elapsedTicks < 2)
  const newConditions = ctx.conditions.filter(c => (c.duration?.elapsedTicks ?? 0) < 2);
  for (const c of newConditions.slice(0, 2)) {
    changes.push(`${c.label.toLowerCase()} is the new shape of things`);
    refs.push({ id: c.id, label: c.label, type: 'condition' });
  }

  // High-severity, near-realized threats
  const acute = ctx.threats
    .filter(t => t.currentStage === 'imminent' || t.currentStage === 'realized')
    .slice(0, 2);
  for (const t of acute) {
    changes.push(`${t.label.toLowerCase()} has come to a head`);
    refs.push({ id: t.id, label: t.label, type: 'threat' });
  }

  // R3-CODE-C (the chair's C-L4): the slot's label is "Recent changes" and every reader prints it beside the text
  // ("Recent changes: Recent changes: …"), so the text does not repeat it; a change is said once.
  const said = [...new Set(changes)].join('; ');
  const text = said
    ? `${said[0].toUpperCase()}${said.slice(1)}.`
    : 'The last few seasons have run their usual course. No notable shifts in the rhythm of the place.';

  return slot('recent_changes', text, 'history.recentDisruption + new conditions + acute threats', refs);
}

// ── Slot helper ──────────────────────────────────────────────────────────

/**
 * @param {string} key
 * @param {string} text
 * @param {string} source
 * @param {SlotReference[]} references
 * @returns {DailyLifeSlot}
 */
function slot(key, text, source, references) {
  return {
    key,
    label: SLOT_LABELS[key] || key,
    text,
    source,
    references,
  };
}

// ── Composer ─────────────────────────────────────────────────────────────

/** @type {Readonly<Record<string, (s: DailyLifeSettlement, ctx: DailyLifeContext) => DailyLifeSlot>>} */
const DERIVERS = Object.freeze({
  food_culture:         deriveFoodCulture,
  dawn_work:            deriveDawnWork,
  gathering_places:     deriveGatheringPlaces,
  child_warnings:       deriveChildWarnings,
  commoner_resentments: deriveCommonerResentments,
  outsider_impressions: deriveOutsiderImpressions,
  unspoken_topics:      deriveUnspokenTopics,
  recent_changes:       deriveRecentChanges,
});

/**
 * Build the substrate context once per call so each slot deriver
 * doesn't re-derive.
 */
/**
 * @param {DailyLifeSettlement} settlement
 * @returns {DailyLifeContext}
 */
function buildContext(settlement) {
  return {
    profiles:   deriveAllFactionProfiles(/** @type {any} */ (settlement)),
    chains:     deriveAllSupplyChainStates(settlement),
    conditions: deriveAllActiveConditions(settlement),
    threats:    deriveAllThreatProfiles(settlement),
    capacities: deriveAllCapacities(settlement),
    causal:     deriveCausalState(settlement),
    history:    deriveHistoryBeats(settlement),
    // DAILY-1 (the chair's ruling of 2026-11-20 18:19): no `npcs` here. No slot reads a person, and the dead
    // `deriveAllNpcProfiles` call (a read of every person's secret and plot hooks) is gone.
  };
}

/**
 * Derive one named daily-life slot.
 *
 * @param {string} key   One of DAILY_LIFE_SLOTS.
 * @param {DailyLifeSettlement | null | undefined} settlement
 * @returns {DailyLifeSlot | null}    DailyLifeSlot, or null for unknown key.
 */
export function deriveDailyLifeSlot(key, settlement) {
  if (!key || !DERIVERS[key]) return null;
  if (!settlement) {
    return slot(key, '—', 'no settlement', []);
  }
  const ctx = buildContext(settlement);
  return DERIVERS[key](settlement, ctx);
}

/**
 * Derive every canonical daily-life slot. Builds context once.
 *
 * THE AUDIENCE (ruling 6; fails closed): only `{ audience: 'owner' }` adds the owner-only slot
 * (`OWNER_ONLY_DAILY_LIFE_SLOT`) to `slots`; no options, no audience and any other value leave the key ABSENT. The eight
 * public slots and the summary are the same whatever the audience (the summary says the eight alone).
 *
 * @param {DailyLifeSettlement | null | undefined} settlement
 * @param {{ audience?: string } | null} [options] (`null` reads as no audience)
 * @returns {{slots: Record<string, DailyLifeSlot>, summary: string[]}} {
 *   slots: { [key]: DailyLifeSlot },
 *   summary: string[],
 * }
 */
export function deriveDailyLife(settlement, options = {}) {
  const owner = options?.audience === 'owner';
  if (!settlement) {
    /** @type {Record<string, DailyLifeSlot>} */
    const empty = {};
    for (const key of DAILY_LIFE_SLOTS) empty[key] = slot(key, '—', 'no settlement', []);
    if (owner) empty[OWNER_ONLY_DAILY_LIFE_SLOT] = slot(OWNER_ONLY_DAILY_LIFE_SLOT, '', 'no settlement', []);
    return { slots: empty, summary: [] };
  }
  const ctx = buildContext(settlement);
  /** @type {Record<string, DailyLifeSlot>} */
  const slots = {};
  /** @type {string[]} */
  const summary = [];
  for (const key of DAILY_LIFE_SLOTS) {
    const s = DERIVERS[key](settlement, ctx);
    slots[key] = s;
    summary.push(`${s.label}: ${s.text}`);
  }
  if (owner) slots[OWNER_ONLY_DAILY_LIFE_SLOT] = deriveCommonerResentmentsDm(settlement, ctx);
  return { slots, summary };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/**
 * Flat array of `${label}: ${text}` lines.
 * @param {DailyLifeSettlement | null | undefined} settlement
 * @returns {string[]}
 */
export function summarizeDailyLife(settlement) {
  return deriveDailyLife(settlement).summary;
}

/** Catalog accessor. */
export function supportedDailyLifeSlots() {
  return [...DAILY_LIFE_SLOTS];
}

// ── compareDailyLife ────────────────────────────────────────────────────
//
// Diff two daily-life envelopes. Returns one entry per slot whose
// text changed. Useful for the Phase 23 counterfactual tool — "after
// removing the granary, food_culture changed from X to Y" — and for
// Tier 5.1 (causal delta summaries after regeneration).

/**
 * @typedef {Object} DailyLifeDelta
 * @property {string} key
 * @property {string} label
 * @property {string} before
 * @property {string} after
 * @property {Array<{id: string, label: string, type: string}>} beforeReferences
 * @property {Array<{id: string, label: string, type: string}>} afterReferences
 */

/**
 * Diff two daily-life envelopes. Returns slot-level diffs for any
 * slot whose text changed.
 *
 * @param {{slots?: Record<string, DailyLifeSlot>} | null | undefined} before  Output of deriveDailyLife.
 * @param {{slots?: Record<string, DailyLifeSlot>} | null | undefined} after   Output of deriveDailyLife.
 * @returns {DailyLifeDelta[]}
 */
export function compareDailyLife(before, after) {
  if (!before || !after) return [];
  /** @type {DailyLifeDelta[]} */
  const out = [];
  for (const key of DAILY_LIFE_SLOTS) {
    const b = before.slots?.[key];
    const a = after.slots?.[key];
    if (!b || !a) continue;
    if (b.text === a.text) continue;
    out.push({
      key,
      label: SLOT_LABELS[key] || key,
      before: b.text,
      after: a.text,
      beforeReferences: b.references || [],
      afterReferences:  a.references || [],
    });
  }
  return out;
}
