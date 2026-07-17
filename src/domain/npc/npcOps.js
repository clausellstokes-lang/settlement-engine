/**
 * domain/npc/npcOps.js — THE NPC OPS + INSTANT NPC (DESIGN_NPC_LIFECYCLE §2 + §3).
 *
 * Pure, deterministic op bodies for the three typed NPC ops and the instant-NPC
 * generator. The store's thin dispatchers (settlementSlice.commitPendingEdits)
 * call these; the lazy NPC UI calls them to build/validate op payloads. Kept in a
 * lazy leaf so the heavy bank + generator logic never touches first paint.
 *
 * ── PROPAGATION MODEL (§2 "propagation flows through the existing chokepointed reads") ──
 * Every op writes a DECLARED facet (npc.facets.<kind>) — the facet-law citizenship,
 * provenance, and S4 target. For the facets whose engine/display chokepoint reads a
 * LIVE NATIVE field, the op ALSO syncs that field so the edit propagates on
 * subsequent ticks:
 *   • temperament → npc.personality.dominant  (corruption.js npcAlignmentScore reads it live)
 *   • goal        → npc.goal.short            (the dossier card reads it; display-live)
 * alignment + role write the declared facet only: their sim chokepoints
 * (npcState.alignment seeded once; inferRoleArchetype) read the SEEDED state, and the
 * adoption block that would consult npc.facets lives in worldPulse/npcAgency.js which
 * is AT its line ceiling. That npcState-adoption is a documented SEAM (owner-gated
 * file) — for those two, an edit is display + validation + the future S4 knob today.
 *
 * ── DORMANCY ── none of this runs unless an op is used; goldens are byte-identical.
 */

import { createPRNG } from '../../kernel/prng.js';
import { makeReceipt } from '../trace.js';
import {
  validateNpcFacet, goalChainForRole, npcFacetOf,
  NPC_ALIGNMENTS, NPC_TEMPERAMENTS, NPC_ROLE_ARCHETYPES, ROLE_GOAL_CHAIN,
} from './npcBank.js';

/** A bank-editable NPC (only the fields the ops read/write; the index signature
 *  carries the arbitrary seat fields a reassignment moves).
 * @typedef {{ id?: string|number, name?: string, facets?: Record<string, unknown>,
 *   personality?: Record<string, unknown>, goal?: Record<string, unknown>, role?: string,
 *   category?: string, stasis?: { reason?: string } } & Record<string, unknown>} OpNpc */
/** @typedef {{ npcs?: OpNpc[], relationships?: unknown[] } & Record<string, unknown>} OpSettlement */
/** A naming-culture pool (data/namingData.js entry). @typedef {{ maleNames?: string[],
 *   femaleNames?: string[], surnames?: string[] } | null} NamingPool */
/** A seeded PRNG (kernel/prng.js). @typedef {{ pick: (a: readonly string[]) => string,
 *   random: () => number, randInt: (lo: number, hi: number) => number }} Prng */

// ── §2 EDIT_NPC ──────────────────────────────────────────────────────────────

/**
 * Apply a bank-bounded facet edit to an NPC. Pure — returns { ok, reason, npc }
 * with a NEW npc object (never mutates the input). Free-text / off-vocab values are
 * refused (ok:false, npc unchanged) — the bank is the validation source.
 * @param {OpNpc} npc @param {string} facetKind @param {unknown} value
 * @returns {{ ok: boolean, reason: string|null, npc: OpNpc }}
 */
export function applyEditNpcFacet(npc, facetKind, value) {
  const v = validateNpcFacet(facetKind, value);
  if (!v.ok) return { ok: false, reason: v.reason, npc };
  if (!npc || typeof npc !== 'object') return { ok: false, reason: 'no npc', npc };
  const next = { ...npc, facets: { ...(npc.facets || {}), [facetKind]: value } };
  // Sync the native field the live chokepoint reads (see PROPAGATION MODEL).
  if (facetKind === 'temperament') {
    next.personality = { ...(npc.personality || {}), dominant: value };
  } else if (facetKind === 'goal') {
    next.goal = { ...(npc.goal || {}), short: value };
  }
  return { ok: true, reason: null, npc: next };
}

// ── §2 REASSIGN_NPC (people-held travels; seat-held stays with the vacated seat) ──

/** The SEAT-HELD fields — the seat the NPC vacates on reassignment (they change to
 *  the new posting; the old seat becomes a vacancy the role-fill machinery refills).
 *  @type {readonly string[]} */
export const SEAT_HELD_FIELDS = Object.freeze([
  'institutionId', 'factionLink', 'factionAffiliation', 'settlementId', 'role',
  'linkedInstitutionIds', 'linkedFactionIds',
]);

/**
 * Reassign an NPC to a new institution / settlement. Pure — returns { ok, reason,
 * settlement }. The bloc-glue typology answers "what travels":
 *   • SEAT-HELD ties (institutionId / factionLink / settlementId / role …) STAY with
 *     the vacated seat — i.e. the NPC gives them up; the values are OVERWRITTEN from
 *     `target`, and the old seat becomes a vacancy the existing role-fill machinery
 *     (successorNpc / seatNpcsIntoFactions on the next tick) refills.
 *   • PEOPLE-HELD ties (personal relationship edges, keyed by NPC id on
 *     settlement.relationships / the regional graph) TRAVEL with the NPC — this
 *     function never touches them, so they follow the person by construction.
 * @param {OpSettlement} settlement @param {number} npcIndex
 * @param {Record<string, unknown>} target  the new seat fields (a subset of SEAT_HELD_FIELDS)
 * @returns {{ ok: boolean, reason: string|null, settlement: OpSettlement }}
 */
export function reassignNpc(settlement, npcIndex, target) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs[npcIndex]) return { ok: false, reason: 'no npc at index', settlement };
  if (!target || typeof target !== 'object') return { ok: false, reason: 'no target', settlement };
  const prev = npcs[npcIndex];
  const nextNpc = { ...prev };
  // Seat-held: overwrite ONLY the seat fields present on the target (the vacated
  // seat keeps nothing — this NPC no longer holds it).
  for (const f of SEAT_HELD_FIELDS) {
    if (f in target) nextNpc[f] = target[f];
  }
  // Record the reassignment as a declared facet-style provenance stamp (no free-text).
  nextNpc.reassignedTo = {
    institutionId: target.institutionId ?? null,
    settlementId: target.settlementId ?? null,
  };
  const nextNpcs = npcs.slice();
  nextNpcs[npcIndex] = nextNpc;
  // People-held ties (settlement.relationships) are returned BY REFERENCE — untouched
  // — so they travel with the NPC's stable id.
  return { ok: true, reason: null, settlement: { ...settlement, npcs: nextNpcs } };
}

// ── §2 STASIS / RETURN (a revocable lifecycle state; STATE-NEVER-FATE) ────────

/** The typed stasis reasons. @type {readonly string[]} */
export const STASIS_REASONS = Object.freeze(['journey', 'imprisoned', 'missing', 'sequestered']);

/**
 * Put an NPC into stasis with a typed reason. Pure. In stasis the NPC is excluded
 * from ALL participation reads (agency / recruitment / blocs) at the buildWorldSnapshot
 * chokepoint, while their relationship edges keep decaying per D5 (memory flows). A
 * shelf, not a grave — reversible via returnNpc. Refuses an unknown reason.
 * @param {OpSettlement} settlement @param {number} npcIndex @param {string} reason
 * @returns {{ ok: boolean, reason: string|null, settlement: OpSettlement }}
 */
export function enterStasis(settlement, npcIndex, reason) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs[npcIndex]) return { ok: false, reason: 'no npc at index', settlement };
  if (!STASIS_REASONS.includes(reason)) return { ok: false, reason: `unknown stasis reason "${String(reason)}"`, settlement };
  const nextNpcs = npcs.slice();
  nextNpcs[npcIndex] = { ...npcs[npcIndex], stasis: { reason } };
  return { ok: true, reason: null, settlement: { ...settlement, npcs: nextNpcs } };
}

/** Return an NPC from stasis (the reunion inherits the interim). Pure. No-op-safe on
 *  an NPC not in stasis. @param {OpSettlement} settlement @param {number} npcIndex */
export function returnNpc(settlement, npcIndex) {
  const npcs = settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs[npcIndex]) return { ok: false, reason: 'no npc at index', settlement };
  const prev = npcs[npcIndex];
  if (!prev.stasis) return { ok: true, reason: null, settlement }; // already active
  const nextNpc = { ...prev };
  delete nextNpc.stasis;
  const nextNpcs = npcs.slice();
  nextNpcs[npcIndex] = nextNpc;
  return { ok: true, reason: null, settlement: { ...settlement, npcs: nextNpcs } };
}

/** True when an NPC is on the stasis shelf (the participation-exclusion predicate the
 *  buildWorldSnapshot chokepoint filters on). @param {OpNpc} npc */
export function isInStasis(npc) {
  return !!(npc && typeof npc === 'object' && npc.stasis);
}

// ── §2 THE DECREE-TRACKER RECEIPT (comes free via receipts — asserted by a pin) ──

/**
 * Build the causal receipt for an NPC op — the "lands in the Decree Tracker with its
 * causal cone automatically" integration. A Receipt is DERIVED (never stored), so the
 * cone attaches free: source:'edit', kind:'npc', causes = the op, effects = the facets
 * it will move on subsequent reads. Runtime emission rides the existing commit-snapshot
 * receipt today (like renameNPC); this builder is the typed, pinnable proof of the cone.
 * @param {'edit-npc'|'reassign-npc'|'stasis-npc'|'return-npc'} opType
 * @param {{ id?: string|number, name?: string }} npc
 * @param {{ facetKind?: string, effects?: string[], detail?: string }} [meta]
 */
export function npcOpReceipt(opType, npc, meta = {}) {
  const targetId = String(npc?.id ?? npc?.name ?? 'npc');
  // effects: each moved facet is a TraceEffect { target, effect } — the cone's WHAT.
  const effects = (meta.effects || []).map((e) => ({ target: e, effect: 'facet moves' }));
  return makeReceipt({
    source: 'edit',
    kind: 'npc',
    targetId,
    // causes: a TraceCause { source, reason } — the cone's WHY (the typed op).
    causes: [{ source: opType, reason: meta.detail || (meta.facetKind ? `${meta.facetKind} edited` : opType) }],
    effects,
    tick: null,
  });
}

// ── §3 INSTANT NPC (the instant-world pattern at person scale; tier-blind) ────

const _GENDERS = Object.freeze(['male', 'female']);
const _FLAWS = Object.freeze(['prideful', 'greedy', 'cowardly', 'vengeful', 'naive', 'paranoid', 'zealous', 'indulgent']);
const _CATEGORY_BY_ARCHETYPE = Object.freeze({
  ruler: 'government', heir: 'noble', military: 'military', merchant: 'economy',
  religious: 'religious', criminal: 'criminal', arcane: 'magic', civic: 'government',
  healer: 'religious', labor_resource: 'economy', diplomat_outsider: 'noble', dissident: 'government',
});

/** @param {Prng} rng @param {NamingPool} cultureData @param {string} gender @returns {string} */
function pickFromNaming(rng, cultureData, gender) {
  const first = (gender === 'female' ? cultureData?.femaleNames : cultureData?.maleNames) || cultureData?.maleNames || [];
  const last = cultureData?.surnames || [];
  const fn = first.length ? rng.pick(first) : 'Anon';
  const ln = last.length ? rng.pick(last) : '';
  return ln ? `${fn} ${ln}` : fn;
}

/**
 * INSTANT NPC — one seeded, fully bank-valid NPC, deterministic per seed. Optionally
 * constrained (role / institutionId / settlementId); constraints NARROW the seeded
 * context, they never replace it (§4a — generation reads the world). The output shape
 * mirrors a generated NPC (name / role / category / personality / goal / influence /
 * power) PLUS declared bank facets, so it is indistinguishable at every read (the
 * COUNTERPART criterion). The generator is TIER-BLIND — the premium seam wraps the
 * button, never this (§3 / §6).
 *
 * @param {Object} [args]
 * @param {string|number} [args.seed]       deterministic seed (same seed ⇒ same NPC)
 * @param {NamingPool} [args.namingData]           the culture's NAMING_DATA entry (names)
 * @param {string|null} [args.role]         a role archetype constraint (else seeded)
 * @param {string|number|null} [args.institutionId]        seat constraint
 * @param {string|number|null} [args.settlementId]         seat constraint
 * @returns {OpNpc} a bank-valid SimNpc-shaped NPC
 */
export function instantNpc({ seed = '', namingData = null, role = null, institutionId = null, settlementId = null } = {}) {
  const rng = createPRNG(`instant-npc:${seed}`);
  const archetype = (role && NPC_ROLE_ARCHETYPES.includes(role)) ? role : rng.pick(NPC_ROLE_ARCHETYPES);
  const gender = rng.pick(_GENDERS);
  const name = pickFromNaming(rng, namingData, gender);
  const temperament = rng.pick(NPC_TEMPERAMENTS);
  const alignment = rng.pick(NPC_ALIGNMENTS);
  const flaw = rng.pick(_FLAWS);
  const chain = goalChainForRole(archetype) || ROLE_GOAL_CHAIN.civic;
  const category = (/** @type {Record<string, string>} */ (_CATEGORY_BY_ARCHETYPE))[archetype] || 'government';
  const powerLevel = rng.randInt(1, 11);
  const influence = powerLevel >= 8 ? 'high' : powerLevel >= 4 ? 'moderate' : 'low';
  const id = `npc.instant_${rng.random().toString(36).slice(2, 9)}`;

  return {
    id,
    name,
    gender,
    role: archetype,
    title: '',
    category,
    personality: { dominant: temperament, flaw, modifier: '', tell: '', speech: '' },
    goal: { short: chain.short, long: chain.long },
    influence,
    power: powerLevel,
    // Declared bank facets — a permanent citizen of the facet law (declared over inferred).
    facets: { alignment, temperament, role: archetype, goal: chain.short },
    ...(institutionId != null ? { institutionId } : {}),
    ...(settlementId != null ? { settlementId } : {}),
    generatedAs: 'instant',
  };
}

/** The bank facets an instant NPC declares — used by the counterpart pin to assert an
 *  instant NPC resolves to a valid value through the facet law at every facet kind.
 *  @param {OpNpc} npc */
export function instantNpcFacetSummary(npc) {
  return {
    alignment: npcFacetOf(npc, 'alignment'),
    temperament: npcFacetOf(npc, 'temperament'),
    role: npcFacetOf(npc, 'role'),
    goal: npcFacetOf(npc, 'goal'),
  };
}
