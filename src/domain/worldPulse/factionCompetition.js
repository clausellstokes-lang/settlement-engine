import { clamp01 } from '../../kernel/math.js';
import {
  decayFactionPairStates,
  factionPairOf,
  mintFactionPairIncident,
  selectWarDecisionIncident,
} from './factionPairLedger.js';
import { stablePart } from './worldState.js';
import { factionArchetype, FACTION_ARCHETYPES as FA } from '../factionArchetypes.js';
import { governingCoalition } from './beliefMap.js';
import { memoryWeaveActive } from './relationshipEvolution.js';
import { compareCodepoint } from '../deterministicSort.js';
import { governingFactionOf } from '../rulingPower.js';
// ES-5b — a REAL cross-layer pair (INFO→INTERIOR), TAKEN rather than avoided, and
// licensed in this same commit by CPL-20 `ES5B_ABSENCE_BENCH_COUPLING`. Never baselined.
import { presenceSharesFor } from './espionage/espionagePresence.js';

// Canonical archetype → factionCompetition's local vocabulary (the FACTION_POWER_BASES
// keys). Folds the archetypes this layer doesn't model: government/other → civic,
// craft → merchant (economic production), occupation → military (an occupying force).
const CANONICAL_TO_COMPETITION = Object.freeze({
  [FA.GOVERNMENT]: 'civic', [FA.NOBLE]: 'noble', [FA.MILITARY]: 'military',
  [FA.MERCHANT]: 'merchant', [FA.RELIGIOUS]: 'religious', [FA.CRIMINAL]: 'criminal',
  [FA.ARCANE]: 'arcane', [FA.CRAFT]: 'merchant', [FA.LABOR]: 'labor',
  [FA.OUTSIDER]: 'outsider', [FA.OCCUPATION]: 'military', [FA.CIVIC]: 'civic', [FA.OTHER]: 'civic',
});

export const GOVERNMENT_PREFERENCES = Object.freeze([
  'council_rule',
  'merchant_charter',
  'military_order',
  'temple_authority',
  'noble_patronage',
  'communal_assembly',
  'criminal_shadow_rule',
  'arcane_magocracy',
]);

export const FACTION_POWER_BASES = Object.freeze({
  noble: ['legal_authority', 'land_rights', 'elite_patronage'],
  merchant: ['wealth', 'trade_connectivity', 'debt'],
  military: ['manpower', 'defense_readiness', 'security'],
  religious: ['religious_authority', 'healing_capacity', 'moral_legitimacy'],
  criminal: ['criminal_opportunity', 'blackmail', 'contraband'],
  civic: ['bureaucracy', 'public_services', 'law_order'],
  arcane: ['knowledge', 'specialist_services', 'arcane_authority'],
  labor: ['labor_capacity', 'food_security', 'resource_access'],
  outsider: ['external_patronage', 'diplomacy', 'foreign_money'],
});

export const FACTION_RULE_MATRIX = Object.freeze([
  'government_challenge',
  'institution_capture',
  'institution_suppression',
  'service_bolster',
  'law_preference_push',
  'rival_power_contest',
  'faction_exhaustion',
]);

const GOVERNMENT_BY_ARCHETYPE = Object.freeze({
  noble: 'noble_patronage',
  merchant: 'merchant_charter',
  military: 'military_order',
  religious: 'temple_authority',
  criminal: 'criminal_shadow_rule',
  civic: 'council_rule',
  arcane: 'arcane_magocracy',
  labor: 'communal_assembly',
  outsider: 'noble_patronage',
});

const LAW_PREFS_BY_ARCHETYPE = Object.freeze({
  noble: ['inheritance_rights', 'land_tenure', 'deference_laws'],
  merchant: ['contract_priority', 'tariff_control', 'debt_enforcement'],
  military: ['curfew', 'militia_tax', 'border_authority'],
  religious: ['temple_privilege', 'moral_codes', 'tithe_rights'],
  criminal: ['selective_enforcement', 'black_market_tolerance', 'protection_rackets'],
  civic: ['transparent_courts', 'service_standards', 'public_records'],
  arcane: ['licensed_magic', 'research_privilege', 'warding_authority'],
  labor: ['guild_rights', 'grain_price_limits', 'work_contracts'],
  outsider: ['extraterritorial_rights', 'patron_treaties', 'trade_immunity'],
});

/** @param {any} value */

/** @param {any} rng @param {any} arr */
function pick(rng, arr) {
  return arr[Math.floor(rng.random() * arr.length)] || arr[0];
}

/** @param {any} saveId @param {import('../settlement.schema.js').SimFaction} faction @param {any} index */
function factionId(saveId, faction, index) {
  const name = faction?.id || faction?.faction || faction?.name || faction?.label || `faction_${index}`;
  return `${saveId}:${stablePart(name)}`;
}

/**
 * Canonical faction-plane identity shared with cross-module producers. A raw
 * generator faction id is not itself a factionCompetition id: the settlement
 * scope is load-bearing because otherwise two realms may alias the same local
 * token and a deposited pair grievance becomes unreadable by this owner.
 * @param {unknown} saveId
 * @param {import('../settlement.schema.js').SimFaction} faction
 * @param {number} [index]
 */
export function factionCompetitionId(saveId, faction, index = 0) {
  return factionId(saveId, faction, index);
}

function inferFactionArchetype(faction = {}) {
  // Delegates to the shared canonical detector so world-pulse classifies a faction
  // the same way factionProfile / factionResponses / factionRoles do. (The legacy
  // matcher here ignored faction.category; the canonical detector honors it.)
  return (/** @type {any} */ (CANONICAL_TO_COMPETITION))[factionArchetype(faction)] || 'civic';
}

/** @param {import('../settlement.schema.js').SimFaction} faction @param {any} index */
function factionPower(faction = {}, index = 0) {
  const raw = faction.power ?? faction.influence ?? faction.score ?? faction.weight;
  if (Number.isFinite(raw)) return raw > 1 ? clamp01(raw / 100) : clamp01(raw);
  return Math.max(0.18, 0.72 - index * 0.16);
}

/** @param {any} item */
function settlementFactions(item) {
  return item.settlement?.powerStructure?.factions
    || item.settlement?.factions
    || item.settlement?.politics?.factions
    || [];
}

/** @param {any} item */
function institutionsFor(item) {
  const fromServices = item.settlement?.services || item.settlement?.institutions || item.settlement?.infrastructure || [];
  return (Array.isArray(fromServices) ? fromServices : [])
    .map((/** @type {any} */ entry, /** @type {any} */ index) => ({
      id: stablePart(entry.id || entry.name || entry.label || `institution_${index}`),
      name: entry.name || entry.label || entry.id || `Institution ${index + 1}`,
      status: entry.status,
      inactive: entry._worldPulseInactive === true,
      impairments: Array.isArray(entry.impairments) ? entry.impairments : [],
    }))
    .slice(0, 12);
}

/** @typedef {{ id: string, name: string }} InstitutionTarget */
/** @typedef {{ id?: string, name?: string, status?: string, _worldPulseInactive?: boolean, impairments?: import('../entities/status.js').Impairment[] }} SuppressionInstitution */
/** @typedef {{ status?: string, outcome?: { proposalPayload?: { kind?: string, factionId?: unknown } } }} FactionProposal */

/** Resolve the same standing institution the apply seam will impair.
 * @param {import('./pulseShapes.js').SettlementItem} item
 * @param {InstitutionTarget} target
 * @returns {SuppressionInstitution}
 */
function standingInstitutionFor(item, target) {
  const pools = [
    item.settlement?.institutions,
    item.settlement?.services,
    item.settlement?.infrastructure,
  ];
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    const found = pool.find((entry, index) => (
      stablePart(entry?.id || entry?.name || entry?.label || `institution_${index}`) === String(target.id)
      || String(entry?.name || entry?.label || '').toLowerCase() === String(target.name).toLowerCase()
    ));
    if (found) return /** @type {SuppressionInstitution} */ (found);
  }
  return target;
}

/**
 * The top three factions and their CONTEST WEIGHT — the one producer of `entry.power`,
 * which four candidate rules read as a severity term and `candidateBase` records as
 * `metadata.power`.
 *
 * ES-5b — §3.11 THE ABSENCE COST. Under `espionageActive` a faction's contest weight is
 * discounted by the share of its roster that is abroad; `presenceSharesFor` returns null
 * in a dark world, so every existing world takes the identical branch and is
 * byte-identical. The arm is gated TWICE: candidateEvents.js admits `evaluateFactionRules`
 * only when `factionCompetitionEnabled` is true, and the leaf refuses unless espionage is
 * lit.
 *
 * ⭐ SELECTION STAYS ON RAW POWER, AND THAT IS THE LOAD-BEARING JUDGMENT (D8, chair
 * CONFIRMED at §13b). This function does two jobs in one expression: it computes a
 * WEIGHT and it SELECTS which three factions are evaluated at all. Discounting the sort
 * key too would let a lightened faction fall OUT of the evaluated set and silence all
 * four of its rules — a coverage cliff, and the opposite of the amendment's intent, which
 * is that an absent faction WEIGHS less, not that it DISAPPEARS. `rawPower` is carried
 * solely for the sort; nothing else reads it, and it equals the pre-change `power`
 * exactly, so the candidate SET is byte-stable in every world.
 *
 * ⚠ THE DECLARED ONE-TICK LAG (§0.2, CR-ES5B-2). The share reads a whereabouts mirror
 * `advanceRoads` does not write until the consequence_fold stage, LATER in this same
 * tick, so this consumer — like the two bloc consumers — sees LAST tick's whereabouts.
 * The lag is uniform at exactly one tick, it is forced (L1 banks pulseKernel.js), and it
 * is pinned rather than left to be rediscovered. See espionagePresence.js's header.
 * @param {any} item @param {unknown} [worldState]
 */
function topFactionEntries(item, worldState = null) {
  const shares = presenceSharesFor(worldState, item);
  return settlementFactions(item)
    .map((/** @type {any} */ faction, /** @type {any} */ index) => {
      const id = factionId(item.id, faction, index);
      const rawPower = factionPower(faction, index);
      return {
        faction,
        index,
        id,
        rawPower,
        power: shares ? clamp01(rawPower * (shares.byFactionId.get(id) ?? 1)) : rawPower,
        archetype: inferFactionArchetype(faction),
      };
    })
    .sort((/** @type {any} */ a, /** @type {any} */ b) => b.rawPower - a.rawPower)
    .slice(0, 3);
}

/** @param {any} worldState @param {any} snapshot @param {any} rng */
export function ensureFactionStates(worldState, snapshot, rng) {
  const factionStates = { ...(worldState.factionStates || {}) };
  for (const item of snapshot.settlements) {
    const entries = settlementFactions(item);
    entries.forEach((/** @type {any} */ faction, /** @type {any} */ index) => {
      const id = factionId(item.id, faction, index);
      if (factionStates[id]) return;
      const local = rng.fork(`faction:${id}`);
      const archetype = inferFactionArchetype(faction);
      const powerBases = (/** @type {any} */ (FACTION_POWER_BASES))[archetype] || FACTION_POWER_BASES.civic;
      const lawPreferences = (/** @type {any} */ (LAW_PREFS_BY_ARCHETYPE))[archetype] || LAW_PREFS_BY_ARCHETYPE.civic;
      factionStates[id] = {
        factionId: id,
        settlementId: item.id,
        name: faction.faction || faction.name || faction.label || `Faction ${index + 1}`,
        archetype,
        governmentPreference: faction.governmentPreference || (/** @type {any} */ (GOVERNMENT_BY_ARCHETYPE))[archetype] || pick(local, GOVERNMENT_PREFERENCES),
        powerBases: [...powerBases],
        controlledInstitutions: [],
        suppressedInstitutions: [],
        lawPreferences: [...lawPreferences],
        internalSeats: {
          leader_champion: null,
          lieutenant_operator: null,
          agent_protege: null,
        },
        rivals: [],
        legitimacyClaim: 0.2 + local.random() * 0.35,
        riskTolerance: 0.22 + local.random() * 0.5,
        momentum: 0,
        exhaustion: 0,
        captureState: faction.captureState || 'none', // the criminalCaptureState ladder rung
        lastActedTick: null,
        recentAction: null,
      };
    });
  }

  // Group faction states by settlement ONCE (insertion order preserved) so the
  // rivals-seeding pass reads each settlement's peers directly instead of
  // rescanning every faction per faction — O(F) rather than O(F^2).
  /** @type {Map<string, any[]>} */
  const factionsBySettlement = new Map();
  for (const state of Object.values(factionStates)) {
    if (!state) continue;
    const sid = String(state.settlementId);
    let list = factionsBySettlement.get(sid);
    if (!list) { list = []; factionsBySettlement.set(sid, list); }
    list.push(state);
  }
  for (const state of Object.values(factionStates)) {
    if (!state || state.rivals?.length) continue;
    state.rivals = (factionsBySettlement.get(String(state.settlementId)) || [])
      .filter((/** @type {any} */ other) => other.factionId !== state.factionId)
      .slice(0, 2)
      .map((/** @type {any} */ other) => other.factionId);
  }

  // DESIGN_DEEP_COUPLINGS §10.5 D-7c/e — THE COALITION COOPERATION deposit rides HERE (this is the
  // per-advance faction pass that carries the snapshot roster governingCoalition needs; pulseKernel
  // is frozen so the deposit cannot get its own call site). memoryWeave DARK ⇒ a byte-safe no-op.
  const weeks = Math.floor(Number(worldState?.calendar?.elapsedWeeks ?? worldState?.tick ?? 0) || 0);
  return depositCoalitionTrust({ ...worldState, factionStates }, snapshot, weeks);
}

// Grace window before a roster-absent faction state is pruned: long enough to
// survive a transient roster hiccup (a save that briefly fails to surface its
// factions), short enough that a coup-renamed ghost doesn't haunt the capture
// rollup and rivals[] lists for a season.
export const FACTION_STATE_PRUNE_GRACE_TICKS = 3;

/**
 * Prune faction states whose faction no longer exists on its settlement's
 * roster (faction ids are name-keyed, so a coup-renamed governing faction
 * leaves a permanent ghost that settlementCaptureState still scans and
 * rivals[] still references). Mirrors the settlementTickStates pruning in
 * advanceCampaignWorld, with two deliberate differences:
 *  • a grace window (missingSinceTick, FACTION_STATE_PRUNE_GRACE_TICKS) so a
 *    transient absence doesn't amnesia faction history;
 *  • a captureState floor — a state above 'none' on a LIVE settlement is an
 *    active capture arc and survives pruning until the arc recedes (a ghost
 *    whose settlement left the campaign gets no floor: a reused save id must
 *    not inherit a dead settlement's arc).
 * Pruned ids are also stripped from surviving rivals[] lists (ensureFactionStates
 * refills an emptied list from the live roster on the next pulse). Identity
 * no-op when nothing changes. Deterministic — derived purely from the snapshot.
 */
/** @param {any} worldState @param {any} snapshot @param {any} [options] */
export function pruneFactionStates(worldState, snapshot, { tick = 0, graceTicks = FACTION_STATE_PRUNE_GRACE_TICKS } = {}) {
  const states = worldState?.factionStates || {};
  const ids = Object.keys(states);
  if (!ids.length) return worldState;

  const liveFactionIds = new Set();
  const liveSettlementIds = new Set();
  for (const item of snapshot?.settlements || []) {
    liveSettlementIds.add(String(item.id));
    settlementFactions(item).forEach((/** @type {any} */ faction, /** @type {any} */ index) => {
      liveFactionIds.add(factionId(item.id, faction, index));
    });
  }

  let changed = false;
  const prunedIds = new Set();
  /** @type {any} */
  const next = {};
  for (const [fid, state] of Object.entries(states)) {
    if (liveFactionIds.has(fid)) {
      // Back on (or still on) the roster: clear any absence stamp.
      if (state.missingSinceTick != null) {
        const { missingSinceTick: _gone, ...rest } = state;
        next[fid] = rest;
        changed = true;
      } else {
        next[fid] = state;
      }
      continue;
    }
    const since = Number.isFinite(state.missingSinceTick) ? state.missingSinceTick : tick;
    if (tick - since >= graceTicks) {
      const settlementLive = liveSettlementIds.has(String(state.settlementId));
      const activeCaptureArc = settlementLive && (state.captureState || 'none') !== 'none';
      if (!activeCaptureArc) {
        prunedIds.add(fid);
        changed = true;
        continue;
      }
    }
    if (state.missingSinceTick === since) {
      next[fid] = state;
    } else {
      next[fid] = { ...state, missingSinceTick: since };
      changed = true;
    }
  }

  if (prunedIds.size) {
    for (const [fid, state] of Object.entries(next)) {
      const rivals = state.rivals || [];
      const kept = rivals.filter((/** @type {any} */ rid) => !prunedIds.has(rid));
      if (kept.length !== rivals.length) next[fid] = { ...state, rivals: kept };
    }
  }

  if (!changed) return worldState;
  return { ...worldState, factionStates: next };
}

// Per-tick mean-reversion for faction momentum (exhaustion already self-limits
// upward; this relaxes the build-up of momentum on quiet ticks).
/** @param {any} worldState */
export function relaxFactionStates(worldState) {
  const factionStates = { ...(worldState?.factionStates || {}) };
  for (const [id, s] of Object.entries(factionStates)) {
    factionStates[id] = { ...s, momentum: clamp01((s.momentum || 0) * 0.85) };
  }
  const relaxed = { ...worldState, factionStates };
  // D-7c: the faction-pair ledger's D5-band decay rides the SAME relax pass. Absent
  // factionPairStates (memoryWeave never lit a pair) ⇒ a byte-safe no-op (dormancy).
  const weeks = Math.floor(Number(worldState?.calendar?.elapsedWeeks ?? worldState?.tick ?? 0) || 0);
  return decayFactionPairStates(relaxed, weeks);
}

// ── DESIGN_DEEP_COUPLINGS §10.5 D-7c/D-7e — THE COALITION COOPERATION deposit ──────────────
// Factions standing together in a settlement's GOVERNING COALITION slowly BUILD alliance-trust —
// the POSITIVE sign of the symmetric faction-pair ledger, the mirror of the contest-loss resentment
// deposit. A slow accrual (a TRUST step per co-governing YEAR), gated off the pair's OWN incident
// history so it never spams the ≤8 incident ring, and decayed by relaxFactionStates on the 156-week
// half-life. memoryWeave-gated: DARK ⇒ zero deposit, byte-identical (the dormancy contract). The
// pair ledger's OWN writer (mintFactionPairIncident) does the write — single-writer preserved.
export const COALITION_TRUST_TUNING = Object.freeze({
  YEAR_WEEKS: 52,       // year-cadence gate: at most one deposit per co-governing pair per ~year
  TRUST_STEP: 0.15,     // trust accrued per co-governing year (equilibrium ≈ 0.7 under the D5 decay)
  SEV: 0.3,             // the coalition_standing incident severity
  MAX_PAIRS_PER_SETTLEMENT: 6, // bound the per-tick write fan-out (deterministic: codepoint-sorted ids)
});

/**
 * The co-governing faction IDs of a settlement item: the roster factions whose archetype sits in the
 * GOVERNING COALITION's members and not among its opponents (the SEAT's real declared-rivals politics,
 * via governingCoalition — NOT the auto-seeded factionStates peers). Faction ids match factionPairKey.
 * Codepoint-sorted for deterministic pairing under the cap. Pure.
 * @param {import('./beliefMap.js').SnapItem} item @returns {string[]}
 */
function coGoverningFactionIds(item) {
  const coalition = governingCoalition(item);
  const members = coalition.members instanceof Set ? coalition.members : new Set();
  const opponents = coalition.opponents instanceof Set ? coalition.opponents : new Set();
  /** @type {string[]} */
  const ids = [];
  settlementFactions(item).forEach((/** @type {import('../settlement.schema.js').SimFaction} */ faction, /** @type {number} */ index) => {
    const a = factionArchetype(faction);
    if (a && a !== FA.OTHER && members.has(a) && !opponents.has(a)) ids.push(factionId(item.id, faction, index));
  });
  return ids.sort(compareCodepoint);
}

/**
 * Deposit the coalition-cooperation trust for every co-governing faction pair across the snapshot's
 * settlements (year-cadence gated per pair; capped fan-out). memoryWeave DARK ⇒ the ORIGINAL worldState
 * back (no factionPairStates touched ⇒ byte-identical). Pure.
 * @param {Record<string, unknown>} worldState @param {import('./beliefMap.js').BeliefSnapshot} snapshot
 * @param {number} weeks @returns {Record<string, unknown>}
 */
export function depositCoalitionTrust(worldState, snapshot, weeks) {
  if (!memoryWeaveActive(worldState)) return worldState;
  const T = COALITION_TRUST_TUNING;
  const now = Math.floor(Number(weeks) || 0);
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  let ws = worldState;
  for (const item of items) {
    const ids = coGoverningFactionIds(item);
    if (ids.length < 2) continue;
    let deposited = 0;
    for (let i = 0; i < ids.length && deposited < T.MAX_PAIRS_PER_SETTLEMENT; i++) {
      for (let j = i + 1; j < ids.length && deposited < T.MAX_PAIRS_PER_SETTLEMENT; j++) {
        // Year-cadence: skip a pair that already banked a coalition_standing incident this year (the
        // pair's incident history IS the tenure clock — no new persisted field, catch-up-tolerant).
        const rec = factionPairOf(ws, ids[i], ids[j]);
        const banked = !!(rec && Array.isArray(rec.incidents) && rec.incidents.some(
          (/** @type {{ type?: string, tick?: number }} */ inc) => inc && inc.type === 'coalition_standing' && (now - Math.floor(Number(inc.tick) || 0)) < T.YEAR_WEEKS));
        if (banked) continue;
        ws = mintFactionPairIncident(ws, { a: ids[i], b: ids[j], type: 'coalition_standing', trustDelta: T.TRUST_STEP, sev: T.SEV, tick: now, weeks: now });
        deposited += 1;
      }
    }
  }
  return ws;
}

// Coherence: seat each settlement's NPCs into the faction they belong to, so a
// faction's internalSeats reflect who actually holds its leader / lieutenant /
// agent roles (wired from NPC dotRank + factionSeat). Highest dotRank wins each
// seat. Also records memberNpcIds so faction power can read its roster.
/** @param {any} worldState */
export function seatNpcsIntoFactions(worldState) {
  const npcStates = worldState?.npcStates || {};
  const factionStates = { ...(worldState?.factionStates || {}) };
  // Group NPC states by settlement ONCE (insertion order preserved) so each
  // faction only scans its OWN settlement's NPCs instead of the full roster —
  // O(F + N) rather than O(F·N).
  /** @type {Map<string, any[]>} */
  const npcsBySettlement = new Map();
  for (const npc of Object.values(npcStates)) {
    const sid = String(npc.settlementId);
    let list = npcsBySettlement.get(sid);
    if (!list) { list = []; npcsBySettlement.set(sid, list); }
    list.push(npc);
  }
  for (const [fid, faction] of Object.entries(factionStates)) {
    const factionName = stablePart(faction.name);
    const members = (npcsBySettlement.get(String(faction.settlementId)) || []).filter((/** @type {any} */ npc) =>
      stablePart(npc.factionId) === factionName
        || `${faction.settlementId}:${stablePart(npc.factionId)}` === fid
        || npc.factionId === fid,
    );
    /** @type {any} */
    const seats = { leader_champion: null, lieutenant_operator: null, agent_protege: null };
    for (const seat of Object.keys(seats)) {
      const best = members
        .filter((/** @type {any} */ m) => m.factionSeat === seat)
        .sort((/** @type {any} */ a, /** @type {any} */ b) => (b.dotRank || 0) - (a.dotRank || 0))[0];
      if (best) seats[seat] = { npcId: best.npcId, name: best.name, dotRank: best.dotRank };
    }
    factionStates[fid] = { ...faction, internalSeats: seats, memberNpcIds: members.map(m => m.npcId) };
  }
  return { ...worldState, factionStates };
}

// Momentum (0..1) → the qualitative band the dossier shows. Bands, not the raw
// scalar: momentum mean-reverts ×0.85 every tick, so projecting the number
// would dirty every settlement on every pulse; the band only moves when the
// faction's posture genuinely changes.
const MOMENTUM_BANDS = Object.freeze([
  { min: 0.55, band: 'surging' },
  { min: 0.3, band: 'mobilized' },
  { min: 0.12, band: 'stirring' },
  { min: -Infinity, band: 'quiet' },
]);

/** @param {any} momentum */
export function factionMomentumBand(momentum) {
  const m = Number.isFinite(momentum) ? momentum : 0;
  return (/** @type {any} */ (MOMENTUM_BANDS.find(b => m >= b.min))).band;
}

// Shared with the apply seam so the producer's "already live" check cannot
// drift from the impairment an approved suppression actually writes.
export const INSTITUTION_SUPPRESSION_SEVERITY = 0.4;

/** @param {any} a @param {any} b */
function sameStringList(a, b) {
  const left = Array.isArray(a) ? a : [];
  const right = Array.isArray(b) ? b : [];
  return left.length === right.length && left.every((v, i) => String(v) === String(right[i]));
}

/**
 * The dossier stops lying: project each faction's LIVE state
 * (worldState.factionStates) onto the settlement's powerStructure.factions
 * roster, which until now stayed generation-frozen while the pulse moved
 * capture rungs, momentum, rivalries, and institution control around it.
 *
 * Projected per roster entry (minimal additive fields, no reshaping):
 *   • captureState   — the capture rung (ensureFactionStates
 *                      already reads this field back, so the loop closes)
 *   • momentumBand   — qualitative band of live momentum (see above)
 *   • rivals         — live rival faction NAMES (ids resolved via states)
 *   • controlledInstitutions / suppressedInstitutions — institution ids
 *
 * Live faction POWER is deliberately NOT projected: factionStates carry no
 * power scalar — the roster IS the live power source (competition normalizes
 * from it each tick; power transfers and the guild floor already write it).
 *
 * Discipline matches the neighbourNetwork write-back: identity no-op when
 * nothing moved (same settlement reference back), per-entry identity, and an
 * updatedByPulse provenance stamp only on entries that actually changed.
 * Quiet/empty live state is not materialized onto entries that never carried
 * the field — a fresh campaign's first pulse must not dirty every roster
 * with 'none'/'quiet'/[] noise.
 */
/** @param {import('../settlement.schema.js').SimSettlement} settlement @param {any} factionStates @param {any} settlementId @param {any} [options] */
export function projectFactionStatesOntoSettlement(settlement, factionStates, settlementId, { tick = 0 } = {}) {
  const factions = settlement?.powerStructure?.factions;
  if (!Array.isArray(factions) || !factions.length) return settlement;
  const states = factionStates || {};
  let touched = false;
  const next = factions.map((/** @type {any} */ faction, /** @type {any} */ index) => {
    const state = states[factionId(settlementId, faction, index)];
    if (!state) return faction;
    const patch = {};

    const captureState = state.captureState || 'none';
    if (faction.captureState != null || captureState !== 'none') {
      if (faction.captureState !== captureState) patch.captureState = captureState;
    }

    const band = factionMomentumBand(state.momentum);
    if (faction.momentumBand != null || band !== 'quiet') {
      if (faction.momentumBand !== band) patch.momentumBand = band;
    }

    const rivals = (state.rivals || []).map((/** @type {any} */ rid) => states[rid]?.name).filter(Boolean);
    if (faction.rivals != null || rivals.length) {
      if (!sameStringList(faction.rivals, rivals)) patch.rivals = rivals;
    }

    const controlled = state.controlledInstitutions || [];
    if (faction.controlledInstitutions != null || controlled.length) {
      if (!sameStringList(faction.controlledInstitutions, controlled)) patch.controlledInstitutions = [...controlled];
    }

    const suppressed = state.suppressedInstitutions || [];
    if (faction.suppressedInstitutions != null || suppressed.length) {
      if (!sameStringList(faction.suppressedInstitutions, suppressed)) patch.suppressedInstitutions = [...suppressed];
    }

    if (!Object.keys(patch).length) return faction; // identity no-op
    touched = true;
    return { ...faction, ...patch, updatedByPulse: tick };
  });
  if (!touched) return settlement;
  return {
    ...settlement,
    powerStructure: { ...settlement.powerStructure, factions: next },
  };
}

/** @param {any} pressureIdx @param {any} settlementId @param {any} kind */
function pressure(pressureIdx, settlementId, kind) {
  return pressureIdx.get?.(settlementId, kind)?.score || 0;
}

/** @param {any} score */
function legitimacyBand(score) {
  if (score >= 0.66) return 'crisis';
  if (score >= 0.44) return 'contested';
  return 'stable';
}

/**
 * content-immersion-r2-7: the per-candidateType verb-phrase map. The old generic
 * builder de-underscored the raw candidateType after "may" → a noun jammed after
 * "may" ('X may exhaustion', 'X may government challenge') that read as debug output
 * on the feed and the proposal queue. This table derives BOTH the
 * hedged candidate headline (`may {may}`) AND the applied twin (`{did}`) from ONE
 * source, so the de-hedger's straggler class disappears at the source (no downstream
 * exception). A NEW faction candidateType must extend this table (pinned by the
 * register-guard test) or it falls to a grammatical generic phrasing.
 * @type {Record<string, { may: string, did: string }>}
 */
export const FACTION_VERB_PHRASES = Object.freeze({
  faction_government_challenge:    { may: 'press a challenge to the government', did: 'presses a challenge to the government' },
  faction_institution_suppression: { may: 'move to suppress an institution',     did: 'moves to suppress an institution' },
  faction_institution_capture:     { may: 'move to capture an institution',      did: 'moves to capture an institution' },
  faction_service_bolster:         { may: 'bolster its services',                did: 'bolsters its services' },
  faction_law_preference_push:     { may: 'push its preferred laws',             did: 'pushes its preferred laws' },
  faction_exhaustion:              { may: 'exhaust itself',                      did: 'exhausts itself' },
  faction_rival_power_contest:     { may: "contest a rival's power",             did: "contests a rival's power" },
});

/** @param {string} candidateType @returns {{ may: string, did: string }} */
function factionVerbPhrase(candidateType) {
  const mapped = FACTION_VERB_PHRASES[candidateType];
  if (mapped) return mapped;
  // Grammatical generic fallback for any future faction_* type (never "may <noun>").
  const stem = String(candidateType).replace(/^faction_/, '').replace(/_/g, ' ');
  return { may: `act on its ${stem}`, did: `acts on its ${stem}` };
}

function candidateBase(/** @type {any} */ { item, entry, state, tick, candidateType, ruleId, severity, probability, applyMode, recordMode = null, reasons, factionPatch, proposalPayload = null, condition = null, metadata = {}, conflictTags = [] }) {
  const verb = factionVerbPhrase(candidateType);
  return {
    id: `candidate.faction.${stablePart(candidateType)}.${stablePart(state.factionId)}.${tick}`,
    type: 'faction',
    candidateType,
    ruleId,
    ruleFamily: 'faction',
    targetSaveId: item.id,
    factionId: state.factionId,
    severity: clamp01(severity),
    probability: clamp01(probability),
    applyMode,
    ...(recordMode ? { recordMode } : {}),
    headline: `${state.name} may ${verb.may}`,
    // The applied twin (the de-hedger reads outcome.appliedHeadline first).
    appliedHeadline: `${state.name} ${verb.did}`,
    summary: `${state.name} sees an opening to press ${state.governmentPreference.replace(/_/g, ' ')} interests.`,
    reasons,
    factionPatch,
    proposalPayload,
    condition,
    metadata: {
      factionName: state.name,
      archetype: state.archetype,
      governmentPreference: state.governmentPreference,
      power: entry.power,
      ...metadata,
    },
    conflictTags: [`faction:${state.factionId}`, `settlement:${item.id}:faction`, ...conflictTags],
  };
}

/**
 * Newest bounded WR-5 war-decision grievance held by this challenger against
 * the current governing faction. The pair plane owns storage/decay; this is a
 * read-only pressure contribution, never an automatic coup.
 * @param {any} item @param {any} worldState @param {string} challengerId
 */
function warDecisionOpposition(item, worldState, challengerId) {
  if (worldState?.simulationRules?.warLayerEnabled !== true
    || worldState?.simulationRules?.warTerminationEnabled !== true) return null;
  const factions = settlementFactions(item);
  const governing = governingFactionOf(item?.settlement);
  if (!governing) return null;
  const governingIndex = factions.indexOf(governing);
  const governingId = factionId(item.id, governing, Math.max(0, governingIndex));
  const incident = selectWarDecisionIncident(worldState, governingId, challengerId);
  if (!incident) return null;
  return {
    pressure01: clamp01(Number(incident.sev) || 0),
    decisionId: String(incident.context.decisionId || ''),
    demand: {
      actorId: String(incident.context.actorId || ''),
      targetId: String(incident.context.targetId || ''),
      decisionId: String(incident.context.decisionId || ''),
      desiredAction: String(incident.context.desiredAction || ''),
    },
  };
}

/** @param {any} item @param {any} entry @param {any} state @param {any} tick @param {any} legitimacy @param {any} conflict @param {any} warOpposition */
function governmentChallenge(item, entry, state, tick, legitimacy, conflict, warOpposition = null) {
  const band = legitimacyBand(legitimacy);
  const warPressure = clamp01(Number(warOpposition?.pressure01) || 0);
  // A secure seat can weather ordinary opposition; only an exceptional, live
  // coalition grievance opens its normal challenge lane while legitimacy is
  // otherwise stable.
  if (band === 'stable' && warPressure < 0.68) return null;
  // Preserve the legacy challenge exactly when WR-5 contributes no grievance;
  // its pressure is an independent bounded addition, not a rewrite of the base.
  const baseSeverity = clamp01(legitimacy * 0.48 + entry.power * 0.28
    + state.riskTolerance * 0.14 + conflict * 0.1);
  const severity = clamp01(baseSeverity + (1 - baseSeverity) * warPressure * 0.22);
  if (severity < (band === 'crisis' ? 0.5 : 0.58)) return null;
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType: 'faction_government_challenge',
    ruleId: `faction_${band}_government_challenge`,
    severity,
    probability: (band === 'crisis' ? 0.12 : 0.04)
      + severity * (band === 'crisis' ? 0.34 : 0.22)
      + warPressure * 0.08,
    applyMode: 'proposal',
    reasons: [
      `Government legitimacy is ${band}.`,
      `${state.name} is one of the top three factions and prefers ${state.governmentPreference.replace(/_/g, ' ')}.`,
      ...(warPressure > 0 ? ['A recent war decision has organized this faction against the governing seat.'] : []),
      'Government changes preserve existing institutions unless a separate institution event changes them.',
    ],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.18),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.08),
      legitimacyClaim: clamp01((state.legitimacyClaim || 0) + severity * 0.12),
      lastActedTick: tick,
      recentAction: 'government_challenge',
    },
    proposalPayload: {
      kind: 'government_change',
      factionId: state.factionId,
      settlementId: item.id,
      governmentPreference: state.governmentPreference,
      legitimacyBand: band,
      preserveInstitutions: true,
      ...(warOpposition?.decisionId ? {
        warDecisionId: warOpposition.decisionId,
        warDemand: warOpposition.demand,
      } : {}),
    },
    condition: {
      archetype: 'faction_challenge',
      label: 'Faction challenge',
      description: `${state.name} is maneuvering to change local power dynamics.`,
      severity,
      status: severity >= 0.7 ? 'worsening' : 'stable',
      duration: { elapsedTicks: 0, expiresAtTicks: 6 },
      triggeredAt: { tick, sourceEventType: 'WORLD_PULSE_FACTION_CHALLENGE', sourceEventTargetId: state.factionId },
      affectedSystems: ['public_legitimacy', 'faction_power', 'social_trust'],
      causes: [{ source: state.factionId, effect: 'legitimacy_challenge', reason: 'Faction competition intensified under weak legitimacy.' }],
    },
    conflictTags: [`settlement:${item.id}:government_change`],
    metadata: {
      legitimacyBand: band,
      ...(warPressure > 0 ? {
        warDecisionOpposition: true,
        warDecisionId: warOpposition.decisionId,
      } : {}),
    },
  });
}

/** @param {any} item @param {any} entry @param {any} state @param {any} tick @param {any} legitimacy @param {any} trade @param {any} crime */
function institutionCandidate(item, entry, state, tick, legitimacy, trade, crime, pendingIntent = false) {
  // Capture and suppression are two forms of one institution-control intent.
  // Until the DM resolves the faction's existing question, rotating the target
  // must not mint a fresh backlog entry every week.
  if (pendingIntent) return null;
  const institutions = institutionsFor(item);
  if (!institutions.length) return null;
  const target = institutions[Math.floor((entry.index + tick) % institutions.length)];
  const pressureScore = Math.max(legitimacy, trade, crime);
  if (pressureScore < 0.38 && state.momentum < 0.2) return null;
  const criminalSuppression = state.archetype === 'criminal' || crime > 0.58;
  const candidateType = criminalSuppression ? 'faction_institution_suppression' : 'faction_institution_capture';
  const severity = clamp01(pressureScore * 0.44 + entry.power * 0.24 + state.momentum * 0.16 + state.riskTolerance * 0.08);
  const suppressionCause = `faction_suppression:${state.factionId}:${target.id}`;
  const standingInstitution = standingInstitutionFor(item, target);
  const suppressionLive = criminalSuppression
    && (state.suppressedInstitutions || []).map(String).includes(String(target.id))
    && standingInstitution?._worldPulseInactive !== true
    && !['removed', 'destroyed'].includes(String(standingInstitution?.status || '').toLowerCase())
    && (standingInstitution?.impairments || []).some((impairment) => (
      impairment?.type === 'legitimacy'
      && impairment?.causeEventId === suppressionCause
      && Number(impairment?.severity) === INSTITUTION_SUPPRESSION_SEVERITY
    ));
  const nextMomentum = clamp01((state.momentum || 0) + severity * 0.12);
  const suppressionBandChanged = suppressionLive
    && factionMomentumBand(nextMomentum) !== factionMomentumBand(state.momentum);
  const asksForApproval = criminalSuppression ? !suppressionLive : severity >= 0.68;
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType,
    ruleId: candidateType,
    severity,
    probability: 0.08 + severity * 0.3,
    applyMode: asksForApproval ? 'proposal' : 'auto',
    recordMode: suppressionLive && !suppressionBandChanged ? 'state_only' : null,
    reasons: [
      `${state.name} can convert pressure into institution ${criminalSuppression ? 'suppression' : 'control'}.`,
      `Target institution: ${target.name}.`,
    ],
    factionPatch: {
      controlledInstitutions: criminalSuppression ? state.controlledInstitutions || [] : [...new Set([...(state.controlledInstitutions || []), target.id])],
      suppressedInstitutions: criminalSuppression ? [...new Set([...(state.suppressedInstitutions || []), target.id])] : state.suppressedInstitutions || [],
      momentum: nextMomentum,
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.04),
      lastActedTick: tick,
      recentAction: criminalSuppression ? 'suppress_institution' : 'capture_institution',
    },
    proposalPayload: asksForApproval
      ? {
          kind: criminalSuppression ? 'institution_suppression' : 'institution_capture',
          factionId: state.factionId,
          settlementId: item.id,
          institutionId: target.id,
          institutionName: target.name,
        }
      : null,
    metadata: { institutionId: target.id, institutionName: target.name },
    conflictTags: [`settlement:${item.id}:institution:${target.id}`],
  });
}

/** @param {any} item @param {any} entry @param {any} state @param {any} tick @param {any} food @param {any} disease @param {any} trade */
function serviceOrLawCandidate(item, entry, state, tick, food, disease, trade) {
  const pressureScore = Math.max(food, disease, trade);
  if (pressureScore < 0.32) return null;
  const supportMove = ['religious', 'civic', 'labor', 'merchant'].includes(state.archetype) && state.exhaustion < 0.55;
  const candidateType = supportMove ? 'faction_service_bolster' : 'faction_law_preference_push';
  const severity = clamp01(pressureScore * 0.42 + entry.power * 0.2 + state.legitimacyClaim * 0.12);
  const lawPreference = state.lawPreferences?.[tick % Math.max(1, state.lawPreferences.length)] || 'local_preference';
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType,
    ruleId: candidateType,
    severity,
    probability: 0.1 + severity * 0.28,
    applyMode: severity >= 0.74 ? 'proposal' : 'auto',
    reasons: [
      supportMove
        ? `${state.name} can bolster services to convert crisis response into influence.`
        : `${state.name} can use pressure to push ${lawPreference.replace(/_/g, ' ')}.`,
    ],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.1),
      legitimacyClaim: clamp01((state.legitimacyClaim || 0) + (supportMove ? severity * 0.08 : severity * 0.03)),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.06),
      lastActedTick: tick,
      recentAction: supportMove ? 'service_bolster' : 'law_preference_push',
    },
    proposalPayload: severity >= 0.74
      ? {
          kind: supportMove ? 'service_bolster' : 'law_preference_push',
          factionId: state.factionId,
          settlementId: item.id,
          lawPreference,
        }
      : null,
    metadata: { lawPreference, supportMove },
  });
}

/** @param {any} item @param {any} entry @param {any} state @param {any} tick @param {any} legitimacy @param {any} conflict */
function rivalryOrExhaustionCandidate(item, entry, state, tick, legitimacy, conflict) {
  if ((state.exhaustion || 0) > 0.62) {
    const severity = clamp01(0.28 + state.exhaustion * 0.44);
    return candidateBase({
      item,
      entry,
      state,
      tick,
      candidateType: 'faction_exhaustion',
      ruleId: 'faction_exhaustion',
      severity,
      probability: 0.14 + severity * 0.24,
      applyMode: 'auto',
      reasons: ['Faction campaigning, aid, and crisis response create exhaustion that slows future moves.'],
      factionPatch: {
        momentum: clamp01((state.momentum || 0) - 0.08),
        exhaustion: clamp01((state.exhaustion || 0) - 0.1),
        lastActedTick: tick,
        recentAction: 'recover_from_exhaustion',
      },
      metadata: { exhaustion: state.exhaustion },
    });
  }

  if (legitimacy < 0.36 && conflict < 0.36) return null;
  const rivalId = state.rivals?.[0] || null;
  const severity = clamp01(legitimacy * 0.26 + conflict * 0.26 + entry.power * 0.18 + state.momentum * 0.12);
  if (!rivalId || severity < 0.36) return null;
  return candidateBase({
    item,
    entry,
    state,
    tick,
    candidateType: 'faction_rival_power_contest',
    ruleId: 'faction_rival_power_contest',
    severity,
    probability: 0.08 + severity * 0.3,
    applyMode: severity >= 0.7 ? 'proposal' : 'auto',
    reasons: [`${state.name} can contest a rival faction's influence basis.`],
    factionPatch: {
      momentum: clamp01((state.momentum || 0) + severity * 0.1),
      exhaustion: clamp01((state.exhaustion || 0) + severity * 0.06),
      lastActedTick: tick,
      recentAction: 'rival_power_contest',
    },
    proposalPayload: severity >= 0.7
      ? {
          kind: 'faction_power_shift',
          factionId: state.factionId,
          rivalFactionId: rivalId,
          settlementId: item.id,
          cause: 'rival_power_contest',
        }
      : null,
    metadata: { rivalFactionId: rivalId },
    conflictTags: [`faction:${rivalId}`],
  });
}

/** @param {any} snapshot @param {any} pressureIdx @param {any} [options] */
export function evaluateFactionRules(snapshot, pressureIdx, options = {}) {
  const tick = options.tick ?? snapshot.worldState.tick + 1;
  const out = [];
  const pendingInstitutionIntentByFaction = new Set(
    (snapshot.worldState?.proposals || [])
      .filter((/** @type {FactionProposal} */ proposal) => (
        proposal?.status === 'pending'
        && ['institution_capture', 'institution_suppression'].includes(String(proposal?.outcome?.proposalPayload?.kind || ''))
        && proposal?.outcome?.proposalPayload?.factionId != null
      ))
      .map((/** @type {FactionProposal} */ proposal) => String(proposal.outcome?.proposalPayload?.factionId)),
  );

  for (const item of snapshot.settlements) {
    const legitimacy = pressure(pressureIdx, item.id, 'legitimacy');
    const conflict = pressure(pressureIdx, item.id, 'conflict');
    const trade = pressure(pressureIdx, item.id, 'trade');
    const crime = pressure(pressureIdx, item.id, 'crime');
    const food = pressure(pressureIdx, item.id, 'food');
    const disease = pressure(pressureIdx, item.id, 'disease');
    const entries = topFactionEntries(item, snapshot.worldState);

    for (const entry of entries) {
      const state = snapshot.worldState.factionStates?.[entry.id];
      if (!state) continue;
      const cooldown = state.lastActedTick != null && tick - state.lastActedTick < 2;
      if (cooldown && (state.exhaustion || 0) < 0.62) continue;
      const candidates = [
        governmentChallenge(
          item,
          entry,
          state,
          tick,
          legitimacy,
          conflict,
          warDecisionOpposition(item, snapshot.worldState, String(state.factionId)),
        ),
        institutionCandidate(
          item,
          entry,
          state,
          tick,
          legitimacy,
          trade,
          crime,
          pendingInstitutionIntentByFaction.has(String(state.factionId)),
        ),
        serviceOrLawCandidate(item, entry, state, tick, food, disease, trade),
        rivalryOrExhaustionCandidate(item, entry, state, tick, legitimacy, conflict),
      ].filter(Boolean);
      out.push(...candidates);
    }
  }

  return out;
}

/** @param {any} snapshot @param {any} pressureIdx @param {any} [options] */
export function deriveFactionCandidates(snapshot, pressureIdx, options = {}) {
  return evaluateFactionRules(snapshot, pressureIdx, options);
}

// Union of two id lists, LIVE order first, patch additions appended. Deterministic
// (both inputs are deterministically ordered) and a byte-identical no-op when the
// patch was authored against the live state (the auto/same-tick path).
/** @param {any} liveList @param {any} patchList */
function mergeInstitutionIds(liveList, patchList) {
  return [...new Set([...(liveList || []), ...(patchList || [])])];
}

/** @param {any} worldState @param {any} outcome */
export function applyFactionPatch(worldState, outcome) {
  if (!outcome?.factionId) return worldState;
  const factionStates = { ...(worldState.factionStates || {}) };
  const current = factionStates[outcome.factionId] || {};
  const patch = outcome.factionPatch || {};
  // Candidates bake ABSOLUTE next-values at authoring time, but a proposal-mode
  // outcome can be accepted many ticks later (applyWorldPulseProposal re-routes the
  // STORED outcome back through here). Wholesale replacement would roll live state
  // back to the stale authoring snapshot. Institution lists only ever ACCRETE at
  // authoring (capture/suppression add one id, never remove), so a UNION with the
  // live lists preserves both the patch's addition and every interim capture — and
  // is byte-identical on same-tick application. lastActedTick is monotonic for the
  // same reason: a late accept must not rewind the live cooldown. Clamped scalars
  // (momentum/exhaustion/legitimacyClaim) stay last-write-wins — they carry no
  // pre-value to rebase a delta from, and a bounded stale write self-corrects.
  const lastActedTick = Math.max(
    Number.isFinite(Number(current.lastActedTick)) ? Number(current.lastActedTick) : -Infinity,
    Number.isFinite(Number(patch.lastActedTick)) ? Number(patch.lastActedTick) : -Infinity,
  );
  factionStates[outcome.factionId] = {
    ...current,
    ...patch,
    controlledInstitutions: mergeInstitutionIds(current.controlledInstitutions, patch.controlledInstitutions),
    suppressedInstitutions: mergeInstitutionIds(current.suppressedInstitutions, patch.suppressedInstitutions),
    ...(Number.isFinite(lastActedTick) ? { lastActedTick } : {}),
  };
  return { ...worldState, factionStates };
}
