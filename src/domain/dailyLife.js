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
import { deriveAllCapacities, CAPACITY_NAMES, VISIBLE_CAPACITY_LENSES } from './capacityModel.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveCausalState } from './causalState.js';
import { fillAgreement, powerNameWithArticle } from './display/powerSentenceName.js';
import { GATHERING_NAMED, GATHERING_PLAIN, GATHERING_DOES } from '../data/dailyLife/gatheringPlaces.js';
import { DAWN_WORK, DAWN_WORK_DOES } from '../data/dailyLife/dawnWork.js';
import { CHILD_WARNINGS, CHILD_WARNINGS_DOES } from '../data/dailyLife/childWarnings.js';
import { COMMONER_RESENTMENTS_DM, COMMONER_RESENTMENTS_DM_DOES } from '../data/dailyLife/commonerResentmentsDm.js';
import { COMMONER_RESENTMENTS, COMMONER_RESENTMENTS_DOES } from '../data/dailyLife/commonerResentments.js';
import { FOOD_CULTURE, FOOD_CULTURE_DOES } from '../data/dailyLife/foodCulture.js';
import { OUTSIDER_IMPRESSIONS, OUTSIDER_IMPRESSIONS_DOES } from '../data/dailyLife/outsiderImpressions.js';
import { UNSPOKEN_TOPICS, UNSPOKEN_TOPICS_DOES } from '../data/dailyLife/unspokenTopics.js';
import { RECENT_CHANGES, RECENT_CHANGES_DOES } from '../data/dailyLife/recentChanges.js';
import { filterDeclared } from './facts/drawDeclared.js';
import { atomHolds } from './facts/factVocabulary.js';
import { factsOf } from './facts/factsOf.js';
import { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } from './facts/institutions.js';
import { isMarketInstitution } from './facts/market.js';
import { liveInstitutions } from './institutions/institutionRoster.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';
import { isHideableHouse, isVeiledPower } from './people/cardVeil.js';
import { leaderLeadOfRecord } from './facts/leaderLead.js';
import { institutionSentenceNoun } from './display/institutionSentenceNoun.js';
import { pickRendezvous } from '../kernel/proseHash.js'; import { pickKeyOf } from './display/pickKey.js';

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
 * @typedef {{key: string, label: string, text: string, source: string, references?: { eventName?: unknown } | null}} HistoryBeatLike
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
 * @property {Set<string>} [stated] the conditions the slots derived so far have STATED (D4C-1; `composePublic`)
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

/**
 * WHAT EACH BRANCH DOES (D4C-1, the chair's E133 (1)): every pool file's per-branch declaration (`<POOL>_DOES`:
 * `{ states: '<condition key>' }`, `{ consequence: true }` or `{ names: true }`), read here and never the line's words.
 * @typedef {Readonly<{ states: string }> | Readonly<{ consequence: true }> | Readonly<{ names: true }>} PoolDoes
 * @type {Readonly<Record<string, Readonly<Record<string, PoolDoes>>>>}
 */
const POOL_DOES = Object.freeze({
  food_culture: FOOD_CULTURE_DOES,
  dawn_work: DAWN_WORK_DOES,
  gathering_places: GATHERING_DOES,
  child_warnings: CHILD_WARNINGS_DOES,
  commoner_resentments: COMMONER_RESENTMENTS_DOES,
  outsider_impressions: OUTSIDER_IMPRESSIONS_DOES,
  unspoken_topics: UNSPOKEN_TOPICS_DOES,
  recent_changes: RECENT_CHANGES_DOES,
  [OWNER_ONLY_DAILY_LIFE_SLOT]: COMMONER_RESENTMENTS_DM_DOES,
});

/** @param {string} slotKey @param {string} branch @returns {string|null} the condition the branch's line states, if it states one */
const statesOf = (slotKey, branch) => {
  const d = POOL_DOES[slotKey]?.[branch];
  return d && 'states' in d ? d.states : null;
};

/** @param {string} slotKey @param {string} branch @param {Set<string>|undefined} stated @returns {boolean} the branch states a condition already stated */
const statedAlready = (slotKey, branch, stated) => {
  const k = statesOf(slotKey, branch);
  return !!k && !!stated?.has(k);
};

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

// ── food_culture (DAILY-1 LINES-2 § 1 and LINES-2b § 7, as the chair ruled at 18:47 and 18:56; DAILY-3 B3 E2) ──
//
// THE BRANCH is the food band (`capacity.food_production`), as today; a surplus place under a famine or a siege threat
// takes `surplus.wanting` (BAR5-WORLD, LAW 5: a town in want is told what it still has). Today's chain sub-branches are
// folded into their band: they printed a chain's own output and name. The branch's pool
// (`data/dailyLife/foodCulture.js :: FOOD_CULTURE`) goes by THE ROUTE (`pickNameable`), keyed
// `<name>::dailyLife.food_culture::<branch>`; what people eat is said from the food record by each line's declared atoms.
// No line true: the EMPTY string (ruling 3).

// R24-A2 (CLOSE-7; the chair's RULING-R24 and his rulings R24a, R24c and R24d of 2026-11-24, vetoable by the owner): THE
// FARE READS THE BAND THE PAGE PRINTS. A line that says people go short read the production band alone (what the place
// grows against what it eats), so a place that buys what it does not grow, and whose page prints Food Security "Secure",
// was told its portions are small (197 of the census 900, 168 of the visitor 900). THE ONE FOOD FACT IS THE WORD THE PAGE
// PRINTS (the `food` atom on `facts/foodBandShown.js`'s printed band). R24d: THE PRINTED BAND BOUNDS THE FARE; PRODUCTION
// PLACES IT WITHIN THE BOUND. A cell inside its bound is unchanged; a cell outside moves to the nearest branch inside:
//   printed Secure or Surplus            `surplus` .. `adequate`
//   printed Pressured                    `adequate` .. `strained`
//   printed Import-Dependent or Deficit  `strained` .. `critical`
//   printed Famine                       `critical` .. `collapsed`
// ONE DERIVATION (`fareBandOf`), which the fare (`deriveFoodCulture`), the food grievance (R24h: it fires on the fare band
// alone), the food visitor lens and Dawn Work's food branch all read, never each its own.
// THE MIRROR (CLOSE-7, R24d's words; A2 held it): a printed Famine over a production band of `adequate` or `surplus` reads
// `critical` like every other Famine; there the lines that say the source failed (the fare's C7, Dawn Work's F6) exclude
// the vocabulary's `food production: ≥ adequate`, and the chair's lines in their place (K2, K1) need it. The two pools are
// handed the capacity profile as the atom's context (`facts/foodProduction.js`).

/** The fare bands, plentiful to collapsed: the order the bound is read in. */
const FARE_LADDER = Object.freeze(['surplus', 'adequate', 'strained', 'critical', 'collapsed']);
/** THE BOUNDS (R24d): the printed band → [the most plentiful, the most short] fare it admits. */
const FARE_BOUNDS = Object.freeze({
  surplus: Object.freeze(['surplus', 'adequate']), secure: Object.freeze(['surplus', 'adequate']),
  pressured: Object.freeze(['adequate', 'strained']),
  importDependent: Object.freeze(['strained', 'critical']), deficit: Object.freeze(['strained', 'critical']),
  famine: Object.freeze(['critical', 'collapsed']),
});

/**
 * THE FARE BAND (R24-A2, R24d): the production band, placed within the bound the page's printed food band sets.
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {string}
 */
function fareBandOf(s, ctx) {
  const band = ctx.capacities.capacities.food_production.band;
  const printed = Object.keys(FARE_BOUNDS).find((p) => atomHolds(`food: = ${p}`, factsFor(s)) === true);
  const at = FARE_LADDER.indexOf(band);
  if (!printed || at < 0) return band;
  const [most, least] = FARE_BOUNDS[/** @type {keyof typeof FARE_BOUNDS} */ (printed)].map((b) => FARE_LADDER.indexOf(b));
  return FARE_LADDER[Math.min(Math.max(at, most), least)];
}

/**
 * THE FARE BAND OF A RECORD (R24-A2): the one derivation, for a reader outside the slots (a test that re-derives a branch).
 * @param {DailyLifeSettlement} settlement
 * @returns {string}
 */
export function fareBandOfRecord(settlement) {
  return fareBandOf(settlement, /** @type {DailyLifeContext} */ (/** @type {unknown} */ ({ capacities: deriveAllCapacities(settlement) })));
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveFoodCulture(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const band = fareBandOf(s, ctx); // R24-A2: the band the page prints, where it prints the place fed
  const wanting = ctx.threats.some((t) => t.type === 'famine' || t.type === 'siege');
  /** @type {keyof typeof FOOD_CULTURE} */
  const branch = band === 'surplus' ? (wanting ? 'surplus.wanting' : 'surplus')
    : band === 'adequate' || band === 'strained' || band === 'critical' ? band
    : 'collapsed';

  const house = houseFinder(s);
  const eligible = filterDeclared(FOOD_CULTURE[branch], { facts: factsFor(s), ctx: { capacities: ctx.capacities }, poolId: `dailyLife.food_culture.${branch}`, surface: 'dailyLife' }); // the mirror: `food production` reads the handed profile
  const text = sayDeclared(pickNameable(s, eligible, 'food_culture', branch, house, ctx.stated), house, refs);
  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  // The slot still cites its food-security chains (references, not text: the slot keeps explaining itself).
  const foodChains = ctx.chains.filter(c => c.needKey === 'food_security');
  for (const c of foodChains) refs.push({ id: c.id, label: c.name, type: 'chain' });

  return slot('food_culture', text, 'capacity.food_production + the food record, by the lines\' declared atoms (LINES-2)', refs);
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
  const defense = ctx.capacities.capacities.defense;
  const dominantCraftPower = ctx.profiles.find(p => p.archetype === 'craft')?.power || 0;
  const dominantMerchantPower = ctx.profiles.find(p => p.archetype === 'merchant')?.power || 0;
  const outside = ctx.threats.some((t) => OUTSIDE_THREATS.includes(t.type) && MEDIUM_OR_ABOVE.includes(t.severityBand));

  // BAR5-WORLD (2026-11-16; LAW 5): under a siege no caravan rolls; the merchants' dawn is a count of their stock.
  /** @type {keyof typeof DAWN_WORK} */
  const branch = WANTING_BANDS.includes(fareBandOf(s, ctx)) ? 'food' // R24-A2 (R24c (c)): the fare band, the band the page prints
    : WANTING_BANDS.includes(defense.band) && outside ? 'defence'
    : dominantCraftPower >= 25 ? 'craft'
    : dominantMerchantPower >= 30 && ctx.threats.some((t) => t.type === 'siege') ? 'merchant_siege'
    : dominantMerchantPower >= 30 ? 'merchant'
    : 'default';

  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  refs.push({ id: 'capacity.defense', label: 'Defense', type: 'capacity' });

  const house = houseFinder(s);
  const eligible = filterDeclared(DAWN_WORK[branch], { facts: factsFor(s), ctx: { capacities: ctx.capacities }, poolId: `dailyLife.dawn_work.${branch}`, surface: 'dailyLife' }); // the mirror: `food production` reads the handed profile
  const text = sayDeclared(pickNameable(s, eligible, 'dawn_work', branch, house, ctx.stated), house, refs);

  return slot('dawn_work', text, 'capacity.food_production + capacity.defense + dominant faction', refs);
}

// ── gathering_places (DAILY-1 LINES-1 § gathering_places, as the chair ruled at 18:37 and 18:56) ──
//
// THE RE-CUT: `named` when the record holds a live sacred house, market or inn the page may name, else `plain`.
// THE ROUTE (ruling 12): a branch's pool (`data/dailyLife/gatheringPlaces.js`) is filtered to the lines the record
// admits by their declared atoms (`facts/drawDeclared.js :: filterDeclared`) and whose every named house the live roster
// can name; then `kernel/proseHash.js :: pickRendezvous(eligible, '<name>::dailyLife.gathering_places::<branch>', id)`
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
 * `kernel/proseHash.js :: pickRendezvous(eligible, '<name>::dailyLife.<slot>::<branch>', id)` picks one (a nameless
 * record takes index 0 of the eligible list; no eligible line, nothing). A line picked (and so said) adds the condition
 * its branch DECLARES it states to `stated` (D4C-1), where the caller hands one.
 * @template {{ id: string, text: string }} T
 * @param {DailyLifeSettlement} s @param {ReadonlyArray<T>} admitted the door's lines @param {string} slotKey @param {string} branch
 * @param {HouseFinder} house
 * @param {Set<string>} [stated]
 * @returns {T|undefined}
 */
function pickNameable(s, admitted, slotKey, branch, house, stated) {
  const eligible = admitted.filter((l) => housesNamedIn(l.text).every((k) => !!house(k)));
  // the rendezvous (point 120, D13 STABLE-PICKS): the eligible line whose own `id` hashes highest with the slot's key
  // (point 124: the key stands on the town's id, spelled once, by `pickKey` below)
  const pick = pickRendezvous(eligible, pickKey(s, slotKey, branch), (l) => l.id);
  const k = pick ? statesOf(slotKey, branch) : null;
  if (k) stated?.add(k);
  return pick;
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
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveGatheringPlaces(s, ctx) {
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
  const text = sayDeclared(pickNameable(s, eligible, 'gathering_places', branch, house, ctx.stated), house, refs);

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
    text = sayDeclared(pickNameable(s, eligible, 'child_warnings', 'none', house, ctx.stated), house, refs);
  } else {
    const parts = [];
    for (const kind of kinds) {
      const eligible = filterDeclared(CHILD_WARNINGS[kind], { facts, poolId: `dailyLife.child_warnings.${kind}`, surface: 'dailyLife' });
      const said = sayDeclared(pickNameable(s, eligible, 'child_warnings', kind, house, ctx.stated), house, refs);
      if (!said) continue;
      const t = /** @type {ThreatProfile} */ (byKind.get(kind));
      refs.push({ id: t.id, label: t.label, type: 'threat' });
      parts.push(said);
    }
    text = parts.length ? `Children are warned about ${parts.join(', and about ')}.` : '';
  }

  return slot('child_warnings', text, 'top threats by severity', refs);
}

// ── commoner_resentments (PUBLIC; DAILY-1 LINES-2 § 2 and LINES-2b § 5, as the chair ruled at 18:26, 18:47 and 18:56;
// DAILY-3 B3 E2) ──
//
// One sentence for each grievance the record holds, in this order: `legitimacy` (public legitimacy strained or worse),
// `food` (the food band strained or worse), `uprising` (a live popular-uprising tension, the vocabulary's `uprising`).
// Chosen by NO crime fact (ruling 6: the crime clauses are the owner-only slot's, below) and naming no veiled power
// (ruling 7). THE CALM RULE (ruling 8): no grievance held, nothing said; this slot has no calm pool, so the EMPTY string
// (ruling 3). Each branch's pool (`data/dailyLife/commonerResentments.js`) goes by THE ROUTE (`pickNameable`), keyed
// `<name>::dailyLife.commoner_resentments::<branch>`; `{gov}` is the government's label with its article.

/** The bands of a grievance held (today's: strained or worse). */
const GRIEVANCE_BANDS = Object.freeze(['strained', 'critical', 'collapsed']);
/** What each grievance branch cites when it is said (the uprising branch cites no variable). @type {Readonly<Record<string, SlotReference>>} */
const GRIEVANCE_REFS = Object.freeze({
  legitimacy: Object.freeze({ id: 'var.public_legitimacy', label: 'Public legitimacy', type: 'system_variable' }),
  food: Object.freeze({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' }),
});

/**
 * A line's `{gov}` said: the government's label with its article (`display/powerSentenceName.js ::
 * powerNameWithArticle`), its `{gov|one|many}` in the name's number (`fillAgreement`). A line that says it declares
 * `government named`, so the label stands wherever it is said.
 * @template {{ text: string }} T
 * @param {ReadonlyArray<T>} lines @param {DailyLifeSettlement} s @returns {T[]}
 */
function withGovernment(lines, s) {
  const gov = String(/** @type {{ powerStructure?: { government?: unknown } | null }} */ (s)?.powerStructure?.government ?? '');
  return lines.map((l) => ({ ...l, text: fillAgreement(l.text, { gov }).replace(/\{gov\}/g, powerNameWithArticle(gov)) }));
}

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveCommonerResentments(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const facts = factsFor(s);
  /** @type {Array<keyof typeof COMMONER_RESENTMENTS>} */
  const branches = [];
  if (GRIEVANCE_BANDS.includes(ctx.causal.bands.public_legitimacy)) branches.push('legitimacy');
  // R24-A2 (the chair's R24h, reversing R24a's price-only keep): the food grievance fires only where THE FARE BAND says
  // people go short. A page that prints its place as fed has NO food grievance: a metropolis fed by trade is the common
  // case, and a third of them would have printed one sentence about a price no record holds.
  if (GRIEVANCE_BANDS.includes(fareBandOf(s, ctx))) branches.push('food');
  if (atomHolds('uprising', facts) === true) branches.push('uprising');

  const house = houseFinder(s);
  const parts = [];
  for (const branch of branches) {
    const eligible = withGovernment(filterDeclared(COMMONER_RESENTMENTS[branch], { facts, poolId: `dailyLife.commoner_resentments.${branch}`, surface: 'dailyLife' }), s);
    const said = sayDeclared(pickNameable(s, eligible, 'commoner_resentments', branch, house, ctx.stated), house, refs);
    if (!said) continue;
    const cited = GRIEVANCE_REFS[branch];
    if (cited) refs.push({ ...cited });
    parts.push(said);
  }

  return slot('commoner_resentments', parts.join(' '), 'public_legitimacy + food_production + popular_uprising, by the lines\' declared atoms (LINES-2)', refs);
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
  // D4C-1: derived after the public eight (`deriveDailyLife`), it avoids a condition they stated; it never changes them
  if (branch && !statedAlready(OWNER_ONLY_DAILY_LIFE_SLOT, branch, ctx.stated)) {
    const house = houseFinder(s);
    const eligible = filterDeclared(COMMONER_RESENTMENTS_DM[branch], { facts: factsFor(s), poolId: `dailyLife.commoner_resentments_dm.${branch}`, surface: 'dailyLife' });
    text = sayDeclared(pickNameable(s, eligible, OWNER_ONLY_DAILY_LIFE_SLOT, branch, house), house, refs);
    if (text) refs.push({ id: 'var.criminal_opportunity', label: 'Criminal opportunity', type: 'system_variable' });
  }
  return slot(OWNER_ONLY_DAILY_LIFE_SLOT, text, 'criminal_opportunity (owner only)', refs);
}

// ── outsider_impressions (DAILY-1 LINES-2 § 3 and LINES-2b § 3 and § 4, as the chair ruled at 18:47, 18:56 and 19:03;
// DAILY-3 B3 E3) ──
//
// Up to three parts, each its own sentence, joined by a space. THE POWER PART: the top power, never a veiled one
// (`people/cardVeil.js :: isVeiledPower`, or a criminal power: nothing is said, ruling 7); where it clearly leads
// (`facts/leaderLead.js :: leaderLeadOfRecord(r).leadOverSecond` over 6, the `topTwoGap <= 6` cut of
// `generators/power/factionStanding.js`, or no second power) the branch `power`, named; else `power.level` (ruling 15).
// THE THREAT PART: the most severe OPEN threat above low that is not a defence RATING (ruling 8: the order and supply
// ratings are no threat), by its kind and form. THE SECOND PART: at a place with no real threat said, the keyed pick
// ('<name>::dailyLife.outsider_impressions::second') among the strained VISIBLE lenses (`capacityModel.js ::
// VISIBLE_CAPACITY_LENSES`, `services.<lens>`; the order lines live in `services.defense`) and `ordinary`; at a place
// with one, a strained visible lens where three or more of the nine are strained, without `ordinary`. Each branch's pool
// (`data/dailyLife/outsiderImpressions.js`) goes by THE ROUTE (`pickNameable`). No line true: the EMPTY string (ruling 3).

/** The bands of a strained capacity. */
const STRAINED_BANDS = Object.freeze(['strained', 'critical', 'collapsed']);
/** Ruling 8: the defence's ratings (`threatProfile.js` step 2, `defenseProfile.scores`) are no threat in any slot. */
const RATING_KINDS = Object.freeze(['unrest', 'economic_collapse']);
/** @param {ThreatProfile} t @returns {boolean} the order or supply rating ("Civic stability at risk", "Economic fragility") */
const isRating = (t) => t.originSurface === RATING_SURFACE && RATING_KINDS.includes(t.type);
/** @param {ThreatProfile} t @returns {boolean} imminent or realized */
const isAcute = (t) => t.currentStage === 'imminent' || t.currentStage === 'realized';
/** @param {ThreatProfile} a @param {ThreatProfile} b */
const bySeverity = (a, b) => b.severity - a.severity;
/** LINES-2 § 3: a threat's FORM by the surface that raised it, for the kinds split by form (else `any`). @type {Readonly<Record<string, Readonly<Record<string, string>>>>} */
const THREAT_FORMS = Object.freeze({
  unrest: Object.freeze({ activeConditions: 'void' }),
  economic_collapse: Object.freeze({ activeConditions: 'route' }),
  monster_pressure: Object.freeze({ config: 'config' }),
});
/** The monster form of `config.monsterThreat` (`threatProfile.js` step 1). @type {Readonly<Record<string, string>>} */
const MONSTER_CONFIG_FORMS = Object.freeze({ plagued: 'overrun', frontier: 'frontier' });

/**
 * @param {ThreatProfile} t @param {DailyLifeSettlement} s
 * @returns {string} the form a threat is said in: a kind split by form takes its surface's form, else `stressor`
 */
function threatForm(t, s) {
  const forms = THREAT_FORMS[t.type];
  if (!forms) return 'any';
  const form = forms[t.originSurface] ?? 'stressor';
  return form === 'config' ? (MONSTER_CONFIG_FORMS[String(s.config?.monsterThreat ?? '')] ?? 'frontier') : form;
}

/** @param {DailyLifeSettlement} s @param {string} slotKey @param {string} branch @returns {string|null} every Daily Life pick's key: the town's id (point 124, `pickKeyOf`), else its name, else null, as before */
const pickKey = (s, slotKey, branch) => {
  const name = /** @type {{ name?: unknown }} */ (s).name, town = pickKeyOf(s, typeof name === 'string' && name ? name : null);
  return town ? `${town}::dailyLife.${slotKey}::${branch}` : null;
};

/**
 * Each line's `{power}` and kin said: the name with its article, `{Power}` at a sentence's head, `{power|one|many}` in
 * the name's number (`display/powerSentenceName.js`). No possessive filler (D4C-1, the chair's E133 (3)): a power's name
 * may itself hold "'s", so no line appends one.
 * @template {{ text: string }} T
 * @param {ReadonlyArray<T>} lines @param {string} name @returns {T[]}
 */
function withPower(lines, name) {
  return lines.map((l) => ({ ...l, text: fillAgreement(l.text, { power: name })
    .replace(/\{Power\}/g, powerNameWithArticle(name, true)).replace(/\{power\}/g, powerNameWithArticle(name)) }));
}

/** @param {string} branch @returns {keyof typeof OUTSIDER_IMPRESSIONS | null} the branch, where the slot has its pool */
const outsiderBranch = (branch) => (Object.hasOwn(OUTSIDER_IMPRESSIONS, branch) ? /** @type {keyof typeof OUTSIDER_IMPRESSIONS} */ (branch) : null);

/**
 * THE OUTSIDER LINE YIELDS (D4C-1, the chair's E133 (1)): it is derived after the other seven public slots
 * (`composePublic`) and drops a part whose branch DECLARES a condition another printed slot STATES (`ctx.stated`),
 * taking its next part by its own ranking: the threat part the next open threat by severity, the second part the
 * keyed pick among the options left. NO SLOT IS EMPTIED by this rule: where no part is left, the line keeps the first
 * part it says without the rule.
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveOutsiderImpressions(s, ctx) {
  let parts = outsiderParts(s, ctx, ctx.stated);
  if (!parts.length && ctx.stated?.size) parts = outsiderParts(s, ctx, undefined).slice(0, 1);
  for (const p of parts) if (p.states) ctx.stated?.add(p.states);
  return slot('outsider_impressions', parts.map((p) => p.said).join(' '), 'dominant faction + top open threat + strained visible capacities, by the lines\' declared atoms (LINES-2)', parts.flatMap((p) => p.refs));
}

/** @typedef {{ said: string, refs: SlotReference[], states: string|null }} OutsiderPart */

/**
 * The outsider line's parts, in order, each its own sentence and its own citations; a part whose branch states a
 * condition in `stated` is not said.
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @param {Set<string>|undefined} stated the conditions the other slots stated (none: the line without the rule)
 * @returns {OutsiderPart[]}
 */
function outsiderParts(s, ctx, stated) {
  const facts = factsFor(s);
  const house = houseFinder(s);
  /** @param {keyof typeof OUTSIDER_IMPRESSIONS} branch @returns {ReadonlyArray<{ id: string, text: string }>} the branch's admitted lines */
  const admitted = (branch) => filterDeclared(OUTSIDER_IMPRESSIONS[branch], { facts, poolId: `dailyLife.outsider_impressions.${branch}`, surface: 'dailyLife' });
  /** @param {keyof typeof OUTSIDER_IMPRESSIONS} branch @param {ReadonlyArray<{ id: string, text: string }>} lines @returns {OutsiderPart} */
  const say = (branch, lines) => {
    /** @type {SlotReference[]} */
    const refs = [];
    return { said: sayDeclared(pickNameable(s, lines, 'outsider_impressions', branch, house), house, refs), refs, states: statesOf('outsider_impressions', branch) };
  };
  /** @param {string} branch */
  const yields = (branch) => statedAlready('outsider_impressions', branch, stated);
  /** @type {OutsiderPart[]} */
  const parts = [];

  const top = [...ctx.profiles].sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  const factions = /** @type {{ powerStructure?: { factions?: unknown } | null }} */ (s)?.powerStructure?.factions;
  const row = top && Array.isArray(factions)
    ? factions.find((f) => /** @type {{ faction?: unknown }} */ (f)?.faction === top.name)
    : undefined;
  if (top && !isVeiledPower(row) && top.archetype !== 'criminal') {
    const lead = leaderLeadOfRecord(s).leadOverSecond;
    // the `topTwoGap <= 6` cut: a lead over the second power of 6 or less is no clear lead
    const branch = lead === null || lead > 6 ? 'power' : 'power.level';
    const part = yields(branch) ? null : say(branch, withPower(admitted(branch), String(top.name ?? '')));
    if (part?.said) {
      part.refs.push({ id: top.id, label: top.name, type: 'faction' });
      parts.push(part);
    }
  }

  // the most severe open threat above low; one whose condition another slot states yields to the next by severity
  let real = false;
  for (const open of ctx.threats.filter((t) => t.visibility === 'open' && !isRating(t)).sort(bySeverity)) {
    if (open.severityBand === 'low') break;
    const branch = outsiderBranch(`threat.${open.type}.${threatForm(open, s)}`);
    const part = branch ? say(branch, admitted(branch)) : null;
    if (!part?.said) break;
    real = true;
    if (branch && yields(branch)) continue;
    part.refs.push({ id: open.id, label: open.label, type: 'threat' });
    parts.push(part);
    break;
  }

  // R24-A2: the food lens is strained as the fare band says (the band the page prints, where it prints the place fed)
  const lenses = VISIBLE_CAPACITY_LENSES.filter((n) => STRAINED_BANDS.includes(n === 'food_production' ? fareBandOf(s, ctx) : ctx.capacities.bands[n]));
  const strained = CAPACITY_NAMES.filter((n) => STRAINED_BANDS.includes(ctx.capacities.bands[n])).length;
  /** @type {Array<{ branch: keyof typeof OUTSIDER_IMPRESSIONS, lens: string|null, lines: ReadonlyArray<{ id: string, text: string }> }>} */
  const options = [];
  for (const lens of real && strained < 3 ? [] : lenses) {
    const branch = outsiderBranch(`services.${lens}`);
    // `{gov}` (the administrative lens) is the government's label with its article
    if (branch) options.push({ branch, lens, lines: withGovernment(admitted(branch), s) });
  }
  if (!real) options.push({ branch: 'ordinary', lens: null, lines: admitted('ordinary') });
  const sayable = options.filter((o) => o.lines.length > 0);
  // the rendezvous over the options, each its branch's name as its id (point 120, D13 STABLE-PICKS)
  let second = pickRendezvous(sayable, pickKey(s, 'outsider_impressions', 'second'), (o) => o.branch);
  // an option whose condition another slot states yields: the keyed pick among the options left
  if (second && yields(second.branch)) second = pickRendezvous(sayable.filter((o) => !yields(o.branch)), pickKey(s, 'outsider_impressions', 'second'), (o) => o.branch);
  if (second) {
    const part = say(second.branch, second.lines);
    if (part.said && second.lens) {
      const cap = ctx.capacities.capacities[second.lens];
      part.refs.push({ id: `capacity.${second.lens}`, label: String(/** @type {{ label?: unknown }} */ (cap)?.label ?? second.lens), type: 'capacity' });
    }
    if (part.said) parts.push(part);
  }

  return parts;
}

// ── unspoken_topics (DAILY-1 LINES-2 § 4 and LINES-2b § 2, as the chair ruled at 18:47 and 18:56; DAILY-3 B3 E3) ──
//
// THE WOUND (`historyBeats.js :: deriveUnresolvedWound`, the record's first tension) said BY WHAT IT IS: its tension
// type's pool (`data/dailyLife/unspokenTopics.js`), by THE ROUTE (`pickNameable`), keyed
// `<name>::dailyLife.unspoken_topics::wound.<type>`. RULING 7: a crime wound falls to the first LATER tension the record
// holds whose type has a pool; no hidden or rumoured threat is said; no corruption clause. THE CALM RULE: a wound with no
// pool, a crime wound with no sayable tension after it, or no wound: the EMPTY string (ruling 3).

/** Rule 6: the crime wounds (no pool; they fall through). */
const CRIME_WOUNDS = Object.freeze(['crime_wave', 'corruption_scandal']);

/** @param {DailyLifeSettlement} s @returns {Array<string|undefined>} each tension's type, by position */
function tensionTypesAt(s) {
  const t = /** @type {{ history?: { currentTensions?: unknown } | null }} */ (s)?.history?.currentTensions;
  return (Array.isArray(t) ? t : []).map((e) => {
    const type = e && typeof e === 'object' ? /** @type {{ type?: unknown }} */ (e).type : undefined;
    return typeof type === 'string' ? type : undefined;
  });
}

/** @param {string|undefined} type @returns {keyof typeof UNSPOKEN_TOPICS | null} */
const woundBranch = (type) => (type && Object.hasOwn(UNSPOKEN_TOPICS, `wound.${type}`) ? /** @type {keyof typeof UNSPOKEN_TOPICS} */ (`wound.${type}`) : null);

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveUnspokenTopics(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const wound = ctx.history.unresolvedWound;
  const types = tensionTypesAt(s);
  const at = !wound ? -1
    : types[0] !== undefined && CRIME_WOUNDS.includes(types[0])
      ? types.findIndex((x, i) => i > 0 && x !== undefined && !CRIME_WOUNDS.includes(x) && woundBranch(x) !== null)
      : 0;
  const branch = at >= 0 ? woundBranch(types[at]) : null;
  let text = '';
  if (wound && branch) {
    const house = houseFinder(s);
    const eligible = filterDeclared(UNSPOKEN_TOPICS[branch], { facts: factsFor(s), poolId: `dailyLife.unspoken_topics.${branch}`, surface: 'dailyLife' });
    text = sayDeclared(pickNameable(s, eligible, 'unspoken_topics', branch, house, ctx.stated), house, refs);
    // the wound beat is cited where it is the tension said (a fallen crime wound is not cited: rule 6)
    if (text && at === 0) refs.push({ id: 'history.unresolvedWound', label: wound.label, type: 'history_beat' });
  }

  return slot('unspoken_topics', text, 'history.unresolvedWound by its tension type (a crime wound falls through), by the lines\' declared atoms (LINES-2)', refs);
}

// ── recent_changes (DAILY-1 LINES-2 § 5 and LINES-2b § 1, § 3 and § 8, as the chair ruled at 18:47 and 18:56; DAILY-3
// B3 E3) ──
//
// Each its own sentence, joined by a space: `beat`, the recent-disruption beat BY ITS EVENT'S NAME (no age, no "founding
// survey"; an event of a crime or corruption kind not said); `condition.<archetype>`,
// a condition new this turn (`elapsedTicks < 2`, the first two); `threat.<kind>.<form>.<stage>`, an acute OPEN threat that
// is not a defence RATING (ruling 8), the first two by severity. `calm` only where none of the three sources is held at
// all; a source held but none sayable: the EMPTY string (ruling 3). Each branch's pool (`data/dailyLife/recentChanges.js`)
// goes by THE ROUTE (`pickNameable`), keyed `<name>::dailyLife.recent_changes::<branch>`.

/**
 * Rule 6 (LINES-2b § 1): is the beat's event of a crime or corruption kind? The record's own event of that name
 * (`history.historicalEvents[]`, the rows both of the beat's sources name) is read by its template's kind
 * (`templateType`, the kinds `data/historyData.js` names "The Crime Wave" and "The Scandal"), the same two kinds as the
 * crime wounds. An event the record does not hold by that name is not said (fails closed).
 * @param {DailyLifeSettlement} s @param {string} name @returns {boolean} true where the beat may be said
 */
function beatSayable(s, name) {
  const events = /** @type {{ history?: { historicalEvents?: unknown } | null }} */ (s)?.history?.historicalEvents;
  const row = Array.isArray(events) ? events.find((e) => /** @type {{ name?: unknown }} */ (e)?.name === name) : undefined;
  const kind = /** @type {{ templateType?: unknown } | undefined} */ (row)?.templateType;
  return !!row && !(typeof kind === 'string' && CRIME_WOUNDS.includes(kind));
}

/** @param {string} branch @returns {keyof typeof RECENT_CHANGES | null} the branch, where the slot has its pool */
const recentBranch = (branch) => (Object.hasOwn(RECENT_CHANGES, branch) ? /** @type {keyof typeof RECENT_CHANGES} */ (branch) : null);

/**
 * @param {DailyLifeSettlement} s
 * @param {DailyLifeContext} ctx
 * @returns {DailyLifeSlot}
 */
function deriveRecentChanges(s, ctx) {
  /** @type {SlotReference[]} */
  const refs = [];
  const facts = factsFor(s);
  const house = houseFinder(s);
  /** @type {string[]} */
  const said = [];
  /** @type {string[]} */
  const taken = [];
  /** @param {keyof typeof RECENT_CHANGES} branch @param {(t: string) => string} [fill] @returns {string} */
  const say = (branch, fill = (t) => t) => {
    taken.push(branch);
    const eligible = filterDeclared(RECENT_CHANGES[branch], { facts, poolId: `dailyLife.recent_changes.${branch}`, surface: 'dailyLife' })
      .map((l) => ({ ...l, text: fill(l.text) }));
    return sayDeclared(pickNameable(s, eligible, 'recent_changes', branch, house, ctx.stated), house, refs);
  };

  const beat = ctx.history.recentDisruption;
  const event = String(beat?.references?.eventName ?? '');
  if (beat && event && beatSayable(s, event)) {
    const bare = event.replace(/^the\s+/i, '');
    const text = say('beat', (t) => t.replace(/\{Event\}/g, `The ${bare}`).replace(/\{event\}/g, `the ${bare}`));
    if (text) {
      refs.push({ id: 'history.recentDisruption', label: beat.label, type: 'history_beat' });
      said.push(text);
    }
  }

  const fresh = ctx.conditions.filter((c) => (c.duration?.elapsedTicks ?? 0) < 2);
  for (const c of fresh.slice(0, 2)) {
    const branch = recentBranch(`condition.${c.archetype}`);
    if (!branch || taken.includes(branch)) continue;
    const text = say(branch);
    if (!text) continue;
    refs.push({ id: c.id, label: c.label, type: 'condition' });
    said.push(text);
  }

  const acute = ctx.threats.filter((t) => t.visibility === 'open' && !isRating(t) && isAcute(t)).sort(bySeverity);
  for (const t of acute.slice(0, 2)) {
    const branch = recentBranch(`threat.${t.type}.${threatForm(t, s)}.${t.currentStage}`);
    if (!branch || taken.includes(branch)) continue;
    const text = say(branch);
    if (!text) continue;
    refs.push({ id: t.id, label: t.label, type: 'threat' });
    said.push(text);
  }

  const anySource = !!beat || fresh.length > 0 || ctx.threats.some((t) => !isRating(t) && isAcute(t));
  if (!said.length && !anySource) {
    const text = say('calm');
    if (text) said.push(text);
  }

  return slot('recent_changes', said.join(' '), 'history.recentDisruption by its event\'s name + new conditions + acute open threats, by the lines\' declared atoms (LINES-2)', refs);
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
  // the outsider line reads what the other seven state (D4C-1): the same line the page and the PDF print
  return key === 'outsider_impressions' ? composePublic(settlement, ctx)[key] : DERIVERS[key](settlement, ctx);
}

/**
 * THE PUBLIC EIGHT, COMPOSED (D4C-1, the chair's E133 (1)): the seven slots other than `outsider_impressions` first,
 * each adding to `ctx.stated` the condition its printed lines' branches DECLARE they state; then the outsider line,
 * which yields a part whose condition is already stated (`deriveOutsiderImpressions`). Keyed picks only: no draw, and
 * the slots come back in `DAILY_LIFE_SLOTS` order.
 * @param {DailyLifeSettlement} settlement @param {DailyLifeContext} ctx (its `stated` set here)
 * @returns {Record<string, DailyLifeSlot>}
 */
function composePublic(settlement, ctx) {
  ctx.stated = new Set();
  /** @type {Record<string, DailyLifeSlot>} */
  const derived = {};
  for (const key of DAILY_LIFE_SLOTS) if (key !== 'outsider_impressions') derived[key] = DERIVERS[key](settlement, ctx);
  derived.outsider_impressions = DERIVERS.outsider_impressions(settlement, ctx);
  /** @type {Record<string, DailyLifeSlot>} */
  const slots = {};
  for (const key of DAILY_LIFE_SLOTS) slots[key] = derived[key];
  return slots;
}
export const DAILY_LIFE_EMPTY_SLOT_TEXT = /** @type {string} */ (deriveDailyLifeSlot(DAILY_LIFE_SLOTS[0], null)?.text); // the empty slot's marker, read from the one place that writes it (no second spelling)
/**
 * THE PAGE'S PUBLIC SLOTS, IN THE PAGE'S ORDER (DAILY-3 U4c, the chair's E59 of 2026-11-22): the slots the Daily Life tab
 * prints (`components/new/tabs/DailyLifeTab.jsx :: ENGINE_SLOTS`) and the PDF's chapter prints
 * (`pdf/sections/IdentityDailyLife.jsx`), one home for both callers. Public slots only: never the owner-only slot.
 * ALL EIGHT, IN THE CHAIR'S ORDER (DAILY-4 unit P, the chair's E110 of 2026-11-22; not `DAILY_LIFE_SLOTS`' own order):
 * a newcomer's eye first, what lies beneath next, what is new last.
 * @type {readonly string[]}
 */
export const DAILY_LIFE_PAGE_SLOTS = Object.freeze([
  'outsider_impressions',
  'dawn_work',
  'food_culture',
  'gathering_places',
  'child_warnings',
  'commoner_resentments',
  'unspoken_topics',
  'recent_changes',
]);

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
  const slots = composePublic(settlement, ctx);
  const summary = DAILY_LIFE_SLOTS.map((key) => `${slots[key].label}: ${slots[key].text}`);
  // the owner-only line after the public eight: it reads what they stated and never changes what they print
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
