/**
 * calamityKernel.js — the M11b CALAMITY kernel adapter (Phase 5.5 mover M11b).
 *
 * The pure engine (spatial/calamity.js) owns the frequency law, the terrain type
 * table, the bounded strike selection + subsumption fates, and the bounded death/
 * exodus fractions; THIS adapter supplies the LIVE reads and applies the strike +
 * its EMERGENT tail, then persists the (very rare) mutations:
 *
 *   • THE ANNUAL DRAW — on a YEAR-BOUNDARY crossing, one seeded draw per settlement
 *     (`disaster:${id}:${year}`) against the 1/(HAZARD_YEARS × N) hazard, gated by
 *     the COOLDOWN-VIA-STAMP (the settlement's own calamityHistory is the record).
 *   • THE STRIKE — pick K non-required institutions (codepoint-sorted, seeded);
 *     SUBSUMPTION FIRST demote / collapse / destroy; kill a bounded, tier-scaled
 *     aggregate fraction; mint the NAMED permanent stamp.
 *   • THE EMERGENT TAIL (zero new mechanism): destroyed producers break their
 *     activeChains ⇒ their exclusive exports drop ⇒ M2 severs the downstream links
 *     next tick (starvation risk); the mass exodus rides M4's REALIZED-DEBIT path
 *     (collectRealizedEmigrationEvents → dispatchMigrations) so the conservation
 *     ledger STILL BALANCES through it; population loss demotes the tier via
 *     popToTier (EMERGENT, never forced); a legitimacy-eroding "disaster response"
 *     condition puts the ruler under the EXISTING coup-readable pressure.
 *
 * THE GATE (byte-identity). The mover is gated behind the CL rules flag
 * `disastersEnabled` (calamityEnabled), a TOLERANT read DELIBERATELY absent from
 * DEFAULT_SIMULATION_RULES — absent ⇒ this kernel is a COMPLETE NO-OP (no draw, no
 * fork, no key, no settlement touch) ⇒ byte-identical (aspatial AND spatial
 * goldens). The SPATIAL tails (the M4 spatial exodus) ride the spatial marker; the
 * aspatial world falls back to the existing population-flight term (distributeMigrants).
 *
 * AGGREGATE-ONLY (product boundary): the death toll is a fraction of a COUNT and
 * the exodus a column of anonymous migrants — no named NPC is ever touched.
 * Deterministic: PRNG = seeded forks from stable composite keys; codepoint-sorted
 * mutation; every rate a frozen, documented constant in spatial/calamity.js.
 */

import { popToTier, TIER_ORDER } from '../../data/constants.js';
import { resolveSettlementTerrain } from '../resolveTerrain.js';
import { withActiveCondition } from '../activeConditions.js';
import { stablePart } from './stablePart.js';
import { seasonForTick } from './worldState.js';
import { collectRealizedEmigrationEvents, dispatchMigrations } from './migrationKernel.js';
import { migrationActive } from '../spatial/migration.js';
import { distributeMigrants, applyPopulationOutcomeToSettlement } from './populationDynamics.js';
import {
  calamityEnabled, annualHazard, rollStrike, withinCooldown, disasterTypeFor, stampTitle,
  selectStrikeTargets, planInstitutionFate, resolvePopulationLoss, CALAMITY_TUNING,
} from '../spatial/calamity.js';

// ── Kernel-local read shapes (0-hole discipline — no `any` holes) ─────────────
/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {{ name?: string, required?: boolean, category?: string, status?: string,
 *   processingInstitutions?: string[], [key: string]: unknown }} CalInstitution */
/** @typedef {{ resource?: unknown, dependency?: { resource?: unknown, institution?: string },
 *   processingInstitutions?: string[], outputs?: string[] }} CalChain */
/** @typedef {{ activeChains?: CalChain[], primaryExports?: unknown[] }} CalEconomicState */
/** @typedef {{ population?: number, tier?: string, name?: string, config?: unknown,
 *   institutions?: CalInstitution[], economicState?: CalEconomicState,
 *   populationHistory?: unknown[], calamityHistory?: CalStamp[], activeConditions?: unknown[] }} CalSettlement */
/** @typedef {{ saveId?: (string|number), settlement?: CalSettlement }} CalUpdate */
/** @typedef {{ id?: (string|number), name?: string, settlement?: CalSettlement }} CalSnapItem */
/** @typedef {{ settlements?: CalSnapItem[], regionalGraph?: unknown }} CalSnapshot */
/** @typedef {{ type: string, name: string, year: number, tick: number, deaths: number,
 *   exodus: number, k: number, targets: string[] }} CalStamp */
/** @typedef {{ get?: (id: string, kind: string) => { score?: number } | undefined } | null | undefined} CalPIndex */
/** @typedef {{ saveId: (string|number), delta: number, reason: string }} CalPopDelta */
/** @typedef {{ id: string, type: string, candidateType: string, ruleId: string, ruleFamily: string,
 *   targetSaveId: string, applyMode: string, populationDeltas: CalPopDelta[],
 *   metadata: { populationKind: string, spatialEmigration?: { loss: number },
 *     transferMode?: string, migrants?: number } }} CalOutcome */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── The upgrade-chain demotion map (subsumption-first "demote down its chain") ──
// PROVENANCE: generators/steps/assembleInstitutions.UPGRADE_CHAINS (the [lesser,
// greater] scale ladders). Copied here as a frozen data constant so the pure leaf
// (spatial/calamity.js) stays import-free and this adapter needs no generator
// import (which would run assembleInstitutions' registerStep side effect + pull
// the institution catalog into the pulse chunk). Keep in sync with the source.
const UPGRADE_CHAIN_PAIRS = Object.freeze([
  ['Parish church', 'Parish churches (2-5)'], ['Parish church', 'Parish churches (10-30)'],
  ['Parish churches (2-5)', 'Parish churches (10-30)'], ['Wayside shrine', 'Parish church'],
  ['Water source', 'Multiple water sources'], ['Citizen militia', 'Town watch'],
  ['Citizen militia', 'Professional city watch'], ['Town watch', 'Professional city watch'],
  ['Palisade or earthworks', 'Town walls'], ['Town walls', 'City walls and gates'],
  ['Barracks', 'Garrison'], ['Street gang', 'Multiple criminal factions'],
  ['Gambling den', 'Gambling halls'], ['Gambling halls', 'Gambling district'],
  ['Gambling den', 'Gambling district'], ['Traveling performers', 'Theaters'],
  ['Theaters', 'Multiple theaters'], ['Traveling performers', 'Multiple theaters'],
  ['River boatyard', 'Shipyard'], ['Hedge wizard', "Wizard's tower"],
  ['Traveling hedge wizard', 'Hedge wizard'], ['Alchemist shop', 'Alchemist quarter'],
  ["Wizard's tower", "Mages' guild"], ['Town granary', 'City granaries'],
  ['Town hall', 'City hall'], ['Blacksmith', 'Blacksmiths (3-10)'],
  ['Carpenter', 'Carpenters (5-15)'],
  ["Carriers' hiring hall", "Carriers' guild"], ["Carriers' guild", "Caravan masters' exchange"],
  ["Carriers' hiring hall", "Caravan masters' exchange"], ['Small prison/stocks', 'Large prison'],
  ['Courthouse', 'Multiple courthouses'], ['Craft guilds (5-15)', 'Craft guilds (30-80)'],
  ['Merchant guilds (3-8)', 'Merchant guilds (15-40)'],
  ["Adventurers' charter hall", "Multiple adventurers' guilds"],
  ['Bowyers & fletchers (guild)', 'Dungeon delving supply district'],
  ['Apothecary', 'Apothecary (established)'], ['Apothecary (established)', 'Apothecary district'],
  ['Apothecary', 'Apothecary district'], ["Cartographer's workshop", "Cartographer's guild"],
  ['Bowyer & fletcher', 'Bowyers & fletchers (guild)'], ['Small hospital', 'Major hospital'],
  ['Slave market', 'Slave market district'],
]);

// greater(lowercased) → the IMMEDIATE lesser it demotes to. Multi-lesser greaters
// (e.g. Professional city watch ← {Citizen militia, Town watch}) demote to the
// CLOSEST rung — the lesser that is itself a greater of another lesser — else the
// codepoint-first lesser (deterministic tiebreak). Built once at module load.
const DEMOTES_TO = (() => {
  /** @type {Map<string, string[]>} */
  const lessersOf = new Map();
  for (const [lesser, greater] of UPGRADE_CHAIN_PAIRS) {
    const key = greater.toLowerCase();
    const list = lessersOf.get(key) || [];
    if (!list.includes(lesser)) list.push(lesser);
    lessersOf.set(key, list);
  }
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const [greaterLc, lessers] of lessersOf) {
    if (lessers.length === 1) { out.set(greaterLc, lessers[0]); continue; }
    const closest = lessers.find((l) => lessers.some((l2) =>
      l2 !== l && UPGRADE_CHAIN_PAIRS.some(([ll, gg]) => gg.toLowerCase() === l.toLowerCase() && ll === l2)));
    out.set(greaterLc, closest || lessers.slice().sort()[0]);
  }
  return out;
})();

/** The lesser an upgrade-chain greater demotes to (case-insensitive), or null. */
function demotesTo(/** @type {string} */ name) {
  return DEMOTES_TO.get(String(name || '').toLowerCase()) || null;
}

/** The tier/density scalar 0..1 (thorp 0 … metropolis 1). @param {CalSettlement|undefined} s */
function density01Of(s) {
  const tier = String(s?.tier || popToTier(num(s?.population, 0)));
  const idx = TIER_ORDER.indexOf(tier);
  return idx < 0 ? 0 : idx / (TIER_ORDER.length - 1);
}

/**
 * The tier-capped strike breadth K (1..4). Unknown tier ⇒ 1 (the smallest strike).
 * The tier READ lives here in the kernel — the spatial leaf (calamity.js) stays
 * tier-blind (the KEYSTONE invariant). @param {string|null|undefined} tier @returns {number}
 */
export function strikeCapForTier(tier) {
  const cap = /** @type {Record<string, number>} */ (CALAMITY_TUNING.STRIKE_K_CAP_BY_TIER)[String(tier || '')];
  return Math.max(1, Math.min(4, Number.isFinite(cap) ? Number(cap) : 1));
}

/** The most recent stamp year for cooldown, or null. @param {CalSettlement|undefined} s */
function lastStampYear(s) {
  const hist = Array.isArray(s?.calamityHistory) ? s.calamityHistory : [];
  let last = null;
  for (const stamp of hist) {
    const y = Number(stamp?.year);
    if (Number.isFinite(y) && (last == null || y > last)) last = y;
  }
  return last;
}

// ── Apply ONE strike's institution fates to a settlement (pure over the roster) ─
/**
 * Apply the subsumption-first fates to the roster: demote a greater to its lesser,
 * collapse a multi-instance category to one survivor, destroy a singleton. Returns
 * the new institutions array + the set of institution NAMES that ceased producing
 * (destroyed or collapsed-away — the demoted institution still stands, renamed).
 * @param {CalInstitution[]} institutions
 * @param {string[]} targets  the selected non-required names (codepoint-sorted)
 * @returns {{ institutions: CalInstitution[], removedNames: string[], fates: import('../spatial/calamity.js').FatePlan[] }}
 */
function applyStrikeToRoster(institutions, targets) {
  const list = institutions.map((i) => ({ ...i }));
  // De-dup guard: a demote must not rename-and-mint a second institution with the
  // same NAME/ID as an existing row of ANY status (e.g. a ruined/remnant lesser
  // from a prior strike) — downstream name/id-indexed passes (institutionLifecycle,
  // calamity's own findIndex-by-name) would become ambiguous. Considering ALL rows,
  // not just active, means a same-name lesser blocks the demote and the greater
  // falls through to collapse/destroy instead. [spatial-engine-6]
  const alreadyStanding = (/** @type {string} */ n) => list.some((i) => String(i.name).toLowerCase() === n.toLowerCase());
  /** @param {string} name @returns {string[]} the OTHER active non-required names sharing this name's category */
  const categoryMembers = (name) => {
    const self = list.find((i) => String(i.name) === name);
    const cat = self ? String(self.category || '') : '';
    if (!cat) return [];
    return list
      .filter((i) => String(i.name) !== name && i.required !== true
        && String(i.status || 'active') === 'active' && String(i.category || '') === cat)
      .map((i) => String(i.name))
      .sort();
  };
  /** @type {string[]} */
  const removedNames = [];
  /** @type {import('../spatial/calamity.js').FatePlan[]} */
  const fates = [];
  const ruin = (/** @type {CalInstitution} */ inst, /** @type {string} */ reason) => ({
    ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
    worldPulseFate: 'destroyed_by_disaster', remnantReason: reason,
  });
  for (const name of targets) {
    const idx = list.findIndex((i) => String(i.name) === name && String(i.status || 'active') === 'active');
    if (idx < 0) continue; // already fell (collapsed away by a prior target this strike)
    const plan = planInstitutionFate({ name, demotesTo, alreadyStanding, categoryMembers });
    fates.push(plan);
    if (plan.fate === 'demote' && plan.demotedTo) {
      // The greater falls a rung: rename in place, keeping the slot standing. Drop
      // the GREATER's identity prose + tags — a 'Wizard's tower' must not carry the
      // Mages' guild's description/tags (a dossier-visible incoherence). Description
      // clears to '' (downstream re-infers from the lesser's name); tags clear to [].
      // Category is retained: the lesser shares the greater's domain (arcane→arcane)
      // and it is load-bearing for a later strike's category-collapse read. Re-deriving
      // the lesser's catalog category/tags would require importing the institution
      // catalog the kernel deliberately keeps OUT of the pulse chunk (see the
      // UPGRADE_CHAIN_PAIRS provenance note). [spatial-engine-6]
      list[idx] = {
        ...list[idx], name: plan.demotedTo,
        id: `institution.${stablePart(plan.demotedTo)}`,
        description: '',
        tags: [],
        worldPulseFate: 'demoted_by_disaster',
        demotedFrom: name,
      };
    } else if (plan.fate === 'collapse') {
      // Everyone in the category except the survivor is razed (target included unless
      // it IS the survivor). The survivor is the codepoint-first eligible sibling.
      for (const gone of plan.collapsedAway) {
        const gi = list.findIndex((i) => String(i.name) === gone && String(i.status || 'active') === 'active');
        if (gi >= 0) { list[gi] = ruin(list[gi], 'Razed as the district collapsed to a single survivor after the disaster.'); removedNames.push(gone); }
      }
    } else {
      // DESTROY — the singleton is razed (hand of god).
      list[idx] = ruin(list[idx], 'Destroyed outright by the disaster.');
      removedNames.push(name);
    }
  }
  return { institutions: list, removedNames, fates };
}

// ── Reconcile production after the strike (the M2 sever seam) ──────────────────
/**
 * Break the activeChains whose processing institutions were ALL destroyed, and drop
 * from primaryExports the goods no surviving chain still produces. A destroyed
 * producer therefore stops exporting ⇒ M2's next-tick producer index omits it ⇒
 * the downstream consuming links sever (fail over, or drain toward supply_starved).
 * "Broken activeChains re-reconcile the economy." Pure over the economicState.
 * @param {CalEconomicState|undefined} economicState
 * @param {string[]} removedNames  the razed institution names
 * @returns {{ economicState: CalEconomicState, severedExports: string[] }}
 */
function reconcileProductionAfterStrike(economicState, removedNames) {
  if (!economicState || typeof economicState !== 'object') return { economicState: economicState || {}, severedExports: [] };
  const removed = new Set(removedNames.map((n) => n.toLowerCase()));
  if (!removed.size) return { economicState, severedExports: [] };
  const chains = Array.isArray(economicState.activeChains) ? economicState.activeChains : [];
  /** @type {CalChain[]} */
  const surviving = [];
  const brokenOutputs = new Set();
  for (const chain of chains) {
    const procs = (Array.isArray(chain?.processingInstitutions) ? chain.processingInstitutions : []).map(String);
    const allGone = procs.length > 0 && procs.every((p) => removed.has(p.toLowerCase()));
    if (allGone) {
      for (const o of (Array.isArray(chain?.outputs) ? chain.outputs : [])) brokenOutputs.add(String(o).toLowerCase());
    } else {
      surviving.push(chain);
    }
  }
  if (!brokenOutputs.size && surviving.length === chains.length) return { economicState, severedExports: [] };
  // Outputs a SURVIVING chain still produces stay exported (only fully-lost goods drop).
  const stillProduced = new Set();
  for (const chain of surviving) for (const o of (Array.isArray(chain?.outputs) ? chain.outputs : [])) stillProduced.add(String(o).toLowerCase());
  /** @type {string[]} */
  const severedExports = [];
  const exports = Array.isArray(economicState.primaryExports) ? economicState.primaryExports : [];
  const nextExports = exports.filter((exp) => {
    const e = String(exp).toLowerCase();
    const lost = [...brokenOutputs].some((o) => e.includes(o) || o.includes(e));
    const kept = [...stillProduced].some((o) => e.includes(o) || o.includes(e));
    if (lost && !kept) { severedExports.push(String(exp)); return false; }
    return true;
  });
  return {
    economicState: { ...economicState, activeChains: surviving, primaryExports: nextExports },
    severedExports,
  };
}

// ── The "disaster response" legitimacy condition (coup-readable pressure) ──────
/**
 * Attach the disaster-response governance condition — a legitimacy-eroding
 * activeCondition the EXISTING pressure model reads (a custom_crisis carrying
 * public_legitimacy + ruling_authority + social_trust), so the ruler comes under
 * the ordinary coup-readable pressure. No new coup mechanism — the disaster simply
 * feeds the standing legitimacy pressure. Pure.
 * @param {CalSettlement} settlement @param {string} typeLabel @param {number} tick
 * @returns {CalSettlement}
 */
function withDisasterResponseCondition(settlement, typeLabel, tick) {
  return /** @type {CalSettlement} */ (withActiveCondition(settlement, {
    id: `condition.disaster_response.${tick}`,
    archetype: 'custom_crisis',
    label: 'Disaster Response Crisis',
    severity: 0.6,
    affectedSystems: ['public_legitimacy', 'ruling_authority', 'social_trust'],
    description: `The ${typeLabel} has overwhelmed the seat of power; the response is contested and legitimacy bleeds.`,
  }));
}

// ── The advance ───────────────────────────────────────────────────────────────
/**
 * @typedef {Object} CalamityAdvanceResult
 * @property {CalUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} receipts
 */

/**
 * Advance the calamity layer one tick. DORMANT (flag off) ⇒ everything unchanged,
 * byte-identical. On a YEAR-BOUNDARY crossing with the flag on, roll each mapped
 * settlement's annual draw and, on a strike, apply the bounded shock + its emergent
 * tail. The exodus routes through M4's realized-debit path (spatial) or the existing
 * population-flight term (aspatial); conservation is asserted inside dispatchMigrations.
 * @param {Object} args
 * @param {CalUpdate[]} args.settlementUpdates  this tick's post-apply settlement updates
 * @param {Record<string, unknown>} args.worldState  memoryState (post-apply)
 * @param {CalSnapshot} args.snapshot  postTimeSnapshot (pre-strike reads)
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {{ get?: (id: string, kind: string) => { score?: number } | undefined }|null} args.pIndex
 * @param {Record<string, unknown>|null|undefined} args.rules  simulationRules (the gate)
 * @param {{ fork?: (k: string) => { random: () => number } }|null} args.rng
 * @param {string|null} args.season
 * @param {number} args.prevWeeks  the pre-tick elapsed weeks (year-boundary detection)
 * @param {number} args.weeks  the post-tick elapsed weeks
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {CalamityAdvanceResult}
 */
export function advanceCalamity({ settlementUpdates, worldState, snapshot, digest, pIndex, rules, rng, season, prevWeeks, weeks, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // GATE: the flag off ⇒ a complete no-op (no draw, no fork, no key) ⇒ byte-identical.
  if (!calamityEnabled(rules)) {
    return { settlementUpdates: updates, worldState, changed: false, newsEntries: [], receipts: [] };
  }
  // Annual cadence: only evaluate on a YEAR-BOUNDARY crossing (one draw per year).
  const prevYear = seasonForTick(Math.max(0, Math.floor(num(prevWeeks, 0)))).year;
  const year = seasonForTick(Math.max(0, Math.floor(num(weeks, 0)))).year;
  if (!(year > prevYear)) {
    return { settlementUpdates: updates, worldState, changed: false, newsEntries: [], receipts: [] };
  }
  const forkFn = rng && typeof rng.fork === 'function' ? rng.fork.bind(rng) : null;
  if (!forkFn) {
    return { settlementUpdates: updates, worldState, changed: false, newsEntries: [], receipts: [] };
  }

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const n = items.length;
  const hazard = annualHazard(n);
  const spatial = migrationActive(worldState);

  // Index the settlement updates by save id (the strike mutates THESE, the persisted set).
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  let nextUpdates = updates.slice();
  let nextWorldState = worldState;
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  let changed = false;

  // Codepoint-sorted settlement order (deterministic strike sequencing).
  const ordered = items
    .map((it) => String(it.id))
    .sort();

  for (const id of ordered) {
    const item = items.find((it) => String(it.id) === id);
    const snapSettlement = item?.settlement;
    if (!snapSettlement) continue;
    // Cooldown-via-stamp: the settlement's own history IS the record.
    if (withinCooldown(lastStampYear(snapSettlement), year)) continue;
    // ONE seeded annual draw. Same year ⇒ same result (idempotent), so a re-run
    // that re-crosses the boundary produces the identical strike.
    const strikeRng = forkFn(`disaster:${id}:${year}`);
    if (!rollStrike({ rng: strikeRng, hazard })) continue;

    const ui = updateIndex.get(id);
    if (ui === undefined) continue; // no persisted update for this settlement (skip safely)
    let settlement = /** @type {CalSettlement} */ (nextUpdates[ui].settlement);
    if (!settlement) continue;

    // ── Resolve the strike (all draws forked off the settlement-year seed). ──
    const terrain = resolveSettlementTerrain(item);
    const type = disasterTypeFor(terrain);
    const typeLabel = type === 'flood' ? 'flood' : type === 'fire' ? 'fire' : type === 'quake' ? 'earthquake' : 'storm';
    const density01 = density01Of(settlement);
    const tier = String(settlement.tier || popToTier(num(settlement.population, 0)));
    const cap = strikeCapForTier(tier);
    const kRng = forkFn(`disaster:k:${id}:${year}`);
    const k = 1 + Math.floor((typeof kRng.random === 'function' ? kRng.random() : 0) * cap);
    const targets = selectStrikeTargets({
      institutions: /** @type {import('../spatial/calamity.js').StrikeInstitution[]} */ (settlement.institutions || []),
      k: Math.min(k, cap),
      rng: forkFn(`disaster:targets:${id}:${year}`),
    });
    // HARD BOUND: no required institution can be a target — selectStrikeTargets
    // filters `required` out BEFORE any draw, so it is structurally impossible to
    // strike one (the required-never-selected invariant, test-asserted over a soak).

    // ── Apply the institution fates + reconcile production (the M2 sever seam). ──
    const roster = applyStrikeToRoster(
      /** @type {CalInstitution[]} */ (settlement.institutions || []), targets);
    const prod = reconcileProductionAfterStrike(settlement.economicState, roster.removedNames);
    settlement = { ...settlement, institutions: roster.institutions, economicState: prod.economicState };

    // ── Aggregate population loss (bounded): immediate deaths, then the exodus. ──
    const popBefore = Math.max(0, Math.floor(num(settlement.population, 0)));
    const loss = resolvePopulationLoss({ population: popBefore, density01, rng: forkFn(`disaster:pop:${id}:${year}`) });
    const afterDeaths = popBefore - loss.deaths;
    settlement = {
      ...settlement,
      population: afterDeaths,
      populationHistory: [
        ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
        { tick, population: afterDeaths, delta: -loss.deaths, reason: `Killed in the ${typeLabel}.` },
      ].slice(-12),
    };
    // EMERGENT tier demotion via popToTier (never forced): the tier follows the pop.
    const demotedTier = popToTier(afterDeaths - loss.exodus);
    if (TIER_ORDER.indexOf(demotedTier) >= 0
      && TIER_ORDER.indexOf(demotedTier) < TIER_ORDER.indexOf(tier)) {
      settlement = { ...settlement, tier: demotedTier };
    }

    // ── The named permanent stamp (also the cooldown record). ──
    const settlementName = String(item?.name || settlement.name || id);
    const stamp = {
      type, name: stampTitle(type, settlementName, year), year, tick,
      deaths: loss.deaths, exodus: loss.exodus, k: targets.length, targets,
    };
    settlement = {
      ...settlement,
      calamityHistory: [
        ...(Array.isArray(settlement.calamityHistory) ? settlement.calamityHistory.slice(-7) : []),
        stamp,
      ].slice(-8),
    };
    // ── The legitimacy hit → coup-readable pressure (existing mechanism). ──
    settlement = withDisasterResponseCondition(settlement, typeLabel, tick);

    // Write the mutated settlement back into the update set.
    nextUpdates[ui] = { ...nextUpdates[ui], settlement };
    changed = true;

    // ── The mass exodus — route through M4's realized-debit path (conservation). ──
    if (loss.exodus > 0) {
      const exodusOutcome = buildExodusOutcome({
        id, exodus: loss.exodus, spatial, snapshot, pIndex, tick, typeLabel,
      });
      // Debit the origin (+ credit aspatial destinations) via the proven apply path,
      // source FIRST (the realized-fraction guard keys on the negative delta).
      nextUpdates = applyExodusToUpdates(nextUpdates, updateIndex, exodusOutcome, id);
      if (spatial) {
        // SPATIAL: the realized-debit dispatch — collectRealizedEmigrationEvents reads
        // the applied (auto-mode) shed pool; dispatchMigrations enqueues the refugee
        // columns and ASSERTS Σarrivals+Σdeaths==Σdepartures. The RELEASE half lands
        // hopWeeks later via the existing releaseMigrationArrivals (same ledger).
        const events = collectRealizedEmigrationEvents([exodusOutcome]);
        const migration = dispatchMigrations({
          events,
          snapshot: /** @type {import('./migrationKernel.js').MigSnapshot} */ (/** @type {unknown} */ (snapshot)),
          pIndex: /** @type {import('./migrationKernel.js').PressureIndex} */ (/** @type {unknown} */ (pIndex)),
          digest, worldState: nextWorldState, rng, season, tick,
        });
        if (migration.changed) nextWorldState = migration.worldState;
        for (const r of migration.receipts) receipts.push({ id, kind: 'exodus', ...r });
      } else {
        receipts.push({ id, kind: 'exodus', departures: loss.exodus, aspatial: true });
      }
    }

    receipts.push({
      id, kind: 'strike', type, deaths: loss.deaths, exodus: loss.exodus,
      k: targets.length, targets, removed: roster.removedNames, severedExports: prod.severedExports,
      demotedTier: settlement.tier,
    });
    newsEntries.push(strikeNews(id, settlementName, stamp.name, typeLabel, loss, targets.length, tick, now));
  }

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries, receipts };
}

/**
 * Build the population_emigration outcome for the exodus — shape-identical to the
 * populationDynamics emigration candidate so it rides the EXISTING machinery:
 * spatial ⇒ the spatialEmigration shed marker (M4 dispatch); aspatial ⇒ the
 * distributeMigrants credits (the existing population-flight term). applyMode 'auto'
 * so it passes the realized-debit (never-proposal) guard.
 * @param {{ id: string, exodus: number, spatial: boolean, snapshot: CalSnapshot,
 *   pIndex: CalPIndex, tick: number, typeLabel: string }} args
 * @returns {CalOutcome}
 */
function buildExodusOutcome({ id, exodus, spatial, snapshot, pIndex, tick, typeLabel }) {
  /** @type {CalPopDelta[]} */
  const populationDeltas = [{ saveId: id, delta: -exodus, reason: `Fled the ${typeLabel}.` }];
  /** @type {CalOutcome['metadata']} */
  const metadata = { populationKind: 'emigration' };
  if (spatial) {
    metadata.spatialEmigration = { loss: exodus };
  } else {
    const migrants = Math.max(0, Math.round(exodus * 0.45));
    const transfer = distributeMigrants({ sourceId: id, migrants, snapshot, pressureIdx: pIndex, mode: 'roll', tick });
    for (const d of transfer.deltas) populationDeltas.push({ saveId: d.saveId, delta: d.delta, reason: String(d.reason || '') });
    metadata.transferMode = transfer.mode;
    metadata.migrants = migrants;
  }
  return {
    id: `calamity.exodus.${stablePart(id)}.${tick}`,
    type: 'population',
    candidateType: 'population_emigration',
    ruleId: 'population_emigration',
    ruleFamily: 'population',
    targetSaveId: id,
    applyMode: 'auto',
    populationDeltas,
    metadata,
  };
}

/**
 * Apply an exodus outcome to the settlement updates via the proven population apply
 * path, SOURCE FIRST (the origin's negative delta records the realized fraction the
 * paired credits scale by). Returns a new updates array.
 * @param {CalUpdate[]} updates @param {Map<string, number>} updateIndex
 * @param {CalOutcome} outcome @param {string} originId
 * @returns {CalUpdate[]}
 */
function applyExodusToUpdates(updates, updateIndex, outcome, originId) {
  const next = updates.slice();
  const affected = [originId, ...outcome.populationDeltas.map((d) => String(d.saveId))
    .filter((sid) => sid !== originId)];
  const seen = new Set();
  for (const saveId of affected) {
    if (seen.has(saveId)) continue;
    seen.add(saveId);
    const ui = updateIndex.get(saveId);
    if (ui === undefined) continue;
    const settlement = next[ui].settlement;
    if (!settlement) continue;
    const applied = applyPopulationOutcomeToSettlement(
      /** @type {import('../settlement.schema.js').SimSettlement} */ (/** @type {unknown} */ (settlement)),
      outcome, saveId);
    if (applied !== settlement) next[ui] = { ...next[ui], settlement: /** @type {CalSettlement} */ (applied) };
  }
  return next;
}

/**
 * A calamity-strike wizard-news entry (house voice, AGGREGATE — no npc named).
 * @param {string} id @param {string} settlementName @param {string} stampName
 * @param {string} typeLabel @param {{ deaths: number, exodus: number }} loss
 * @param {number} k @param {number} tick @param {string|null} now
 * @returns {Record<string, unknown>}
 */
function strikeNews(id, settlementName, stampName, typeLabel, loss, k, tick, now) {
  return {
    id: `wizard_news.${tick}.calamity.${stablePart(id)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: 'major',
    severity: 0.8,
    score: 88,
    headline: stampName,
    summary: `A ${typeLabel} has struck ${settlementName}: ${k === 1 ? 'an institution lies' : `${k} institutions lie`} in ruin, about ${loss.deaths} dead, and many more take to the roads.`,
    kind: 'applied',
    impactKind: 'calamity',
    channelType: 'disaster',
    settlementIds: [id],
    impactIds: [],
    channelIds: [],
    sourceEventId: `calamity.${id}.${tick}`,
    tags: ['world_pulse', 'calamity', 'disaster'],
    reasons: [`The ${typeLabel} was the land's own — a legible destiny come due.`],
  };
}

export { CALAMITY_TUNING };
