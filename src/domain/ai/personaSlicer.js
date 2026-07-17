/**
 * domain/ai/personaSlicer.js — the CLIENT persona slicer for THE PARLEY (Surveyor S3,
 * DESIGN_AI_CONTROL_SURFACE §2d + THE TOTAL-GROUNDING LAW).
 *
 * Mirroring S1's retrieval architecture (the client builds the grounding and POSTs it), this
 * builds the entity's PERSONA SLICE from belief-scoped read-models and posts it to the parley
 * edge. Two structural guarantees:
 *
 *   1. EPISTEMIC FIDELITY BY CONSTRUCTION: every facet is drawn from what the ENTITY knows —
 *      its own traits/goals, its settlement's self-knowledge (economy, season, deity, its
 *      own web), and FOGGED reads (the hegemony it BELIEVES in, its reframe stance on the
 *      asker). It never reaches into another entity's ground truth. The edge then enforces
 *      that the persona speaks ONLY from this slice (parleyCore, the citation law).
 *   2. TOTAL-GROUNDING COVERAGE: it emits EVERY required manifest key (groundingManifest.js) —
 *      so the persona slice is a superset of the entity's engine-consumer census. A dormant
 *      read degrades to a muted facet (the character "knows little there"), never a gap.
 *
 * PURE, lazy-only (rides the parley panel chunk), zero eager bytes.
 */

import { requiredManifestKeys, PERSON_FACET_KEYS } from './groundingManifest.js';

/** Guard a read-model call: degrade to `fallback` on any throw (dormant/partial worldState).
 *  @param {() => any} fn @param {any} [fallback] @returns {any} */
function safe(fn, fallback = null) {
  try { const v = fn(); return v == null ? fallback : v; } catch { return fallback; }
}

/** @param {string} manifestKey @param {string} entityId @param {string} [label] @param {any} [data] */
function facet(manifestKey, entityId, label, data) {
  return { id: `${manifestKey}:${entityId}`, manifestKey, label, data: data ?? {} };
}

/** Resolve the collective voice for a settlement/faction from its dominant bloc glue (an NPC
 *  is always 'self'). Patronage (people-held, personal loyalty) ⇒ patron; anything else, or
 *  no live bloc, ⇒ the governing seat.
 *  @param {string} entityClass @param {any} entity @param {any} settlement @returns {string} */
function resolveVoice(entityClass, entity, settlement) {
  if (entityClass === 'npc') return 'self';
  const blocs = safe(() => (settlement?.politicsLedgers?.[settlement?.id]?.blocs) || entity?.blocs || settlement?.blocs, []) || [];
  const dominant = Array.isArray(blocs) && blocs.length
    ? blocs.slice().sort((/** @type {any} */ a, /** @type {any} */ b) => (b?.strain ?? 0) - (a?.strain ?? 0))[0] : null;
  const glueType = dominant && Array.isArray(dominant.glue) && dominant.glue[0] ? dominant.glue[0].type : dominant?.glueType;
  return glueType === 'patronage' ? 'patron' : 'seat';
}

/** The person facets (NPC only) — alignment / temperament / role / goal from the NPC's own
 *  fields + live sim state (never another NPC's). Always emits all four keys (parity).
 *  @param {any} entity @param {any} npcState @param {string} entityId */
function personFacets(entity, npcState, entityId) {
  const p = entity?.personality || {};
  /** @type {Record<string, any>} */
  const values = {
    alignment: entity?.alignment ?? npcState?.alignment ?? p.alignment ?? null,
    temperament: p.dominant ?? entity?.temperament ?? p.temperament ?? null,
    role: entity?.role ?? npcState?.role ?? null,
    goal: entity?.goal?.short ?? npcState?.shortGoal ?? entity?.goal ?? null,
  };
  return PERSON_FACET_KEYS.map((/** @type {string} */ k) => facet(k, entityId, k, { [k]: values[k] }));
}

/**
 * Build the persona slice payload the client POSTs to the parley edge. Belief-scoped,
 * manifest-complete. Pure (the read-model calls are all pure + guarded).
 *
 * @param {{
 *   entity?: any, entityClass?: 'npc'|'settlement'|'faction',
 *   settlement?: any, worldState?: any, settlements?: any[],
 *   tick?: number, askerId?: string|null, personaLabel?: string,
 *   deps?: { hegemonyFear?: Function, season?: Function, reframe?: Function },
 * }} [args]
 * @returns {{ entityId: string, entityClass: string, voice: string, personaLabel: string, facets: any[] }}
 */
export function buildPersonaSlice({
  entity, entityClass, settlement = null, worldState = null, settlements = [],
  tick = 0, askerId = null, personaLabel = '', deps = {},
} = {}) {
  /** @type {any} */
  const e = entity && typeof entity === 'object' ? entity : {};
  const cls = entityClass === 'settlement' || entityClass === 'faction' ? entityClass : 'npc';
  const entityId = String(e.id ?? (cls === 'settlement' ? settlement?.id : '') ?? 'entity');
  /** @type {any} */
  const home = settlement || (cls === 'settlement' ? e : null);
  const observerId = String((cls === 'settlement' ? (home?.id ?? entityId) : (e.settlementId ?? home?.id ?? entityId)));
  const npcState = safe(() => worldState?.npcStates?.[entityId], null);
  const voice = resolveVoice(cls, e, home);

  const facets = [];

  // person facets (NPC only)
  if (cls === 'npc') facets.push(...personFacets(e, npcState, entityId));

  // (a) faction / archetype / stance — the entity's own affiliation + the home roster
  facets.push(facet('faction', entityId, 'Faction', safe(() => ({
    affiliation: e.factionAffiliation ?? e.factionLink ?? null,
    archetype: e.factionArchetype ?? null,
    roster: (home?.powerStructure?.factions || home?.factions || []).map((/** @type {any} */ f) => (typeof f === 'string' ? f : f?.name)).filter(Boolean).slice(0, 8),
  }), {})));

  // (b) HEGEMONY through the entity's FOG — she ranks powers as her BELIEFS rank them
  facets.push(facet('hegemony', entityId, 'Believed spheres', safe(() => {
    const hf = deps.hegemonyFear ? deps.hegemonyFear({ worldState }) : null;
    return hf && typeof hf.believedSpheresFor === 'function' ? hf.believedSpheresFor(observerId) : {};
  }, {})));

  // (c) standing rulings/decrees touching the settlement (felt through the reframe layer)
  facets.push(facet('rulings', entityId, 'Standing rulings', safe(() => ({
    decrees: (home?.appliedDecrees || home?.decrees || []).slice(0, 6),
  }), {})));

  // (d) deity + doctrine + imposed cult/heresy
  facets.push(facet('deity_doctrine', entityId, 'Faith', safe(() => ({
    patron: home?.config?.primaryDeitySnapshot ?? home?.primaryDeity ?? null,
    cults: (home?.config?.cultDeitySnapshots || []).slice(0, 4),
  }), {})));

  // (e) economy — prosperity, food security, trade dependencies (self-knowledge)
  facets.push(facet('economy', entityId, 'Livelihood', safe(() => {
    const econ = home?.economicState || home?.economy || {};
    return {
      prosperity: econ.prosperity ?? home?.prosperity ?? null,
      foodSecurity: econ.foodSecurity ?? null,
      exports: (econ.primaryExports || []).slice(0, 4),
      imports: (econ.primaryImports || []).slice(0, 4),
    };
  }, {})));

  // (f) SEASON + its pressures (the character feels the season)
  facets.push(facet('season', entityId, 'Season', safe(() => {
    const s = deps.season ? deps.season({ rngSeed: home?._seed, clock: worldState?.clock, settlement: home, settlementId: observerId }) : null;
    return s ? { season: s.season, weekOfYear: s.weekOfYear, year: s.year } : {};
  }, {})));

  // (g) the NPC web — the entity's own patron/rival/kin/bloc edges (people-held travel here)
  facets.push(facet('npc_web', entityId, 'Ties', safe(() => ({
    ties: (home?.relationships || [])
      .filter((/** @type {any} */ r) => r && (String(r.npc1Id) === entityId || String(r.npc2Id) === entityId))
      .map((/** @type {any} */ r) => ({ type: r.type, with: String(r.npc1Id) === entityId ? r.npc2Id : r.npc1Id }))
      .slice(0, 10),
    rivalries: (npcState?.rivalryTargets || []).slice(0, 6),
  }), {})));

  // (h) reframes — the entity's current READING of the asker (the curdled gift colors it)
  facets.push(facet('reframes', entityId, 'Stance on the asker', safe(() => {
    if (!askerId || !deps.reframe) return {};
    /** @type {Record<string, any>} */
    const readings = {};
    for (const actClass of ['aid', 'tribute', 'trade_dependence', 'kinship']) {
      const r = deps.reframe(worldState, observerId, String(askerId), actClass);
      if (r) readings[actClass] = r.reading ?? r;
    }
    return { readings };
  }, {})));

  return {
    entityId,
    entityClass: cls,
    voice,
    personaLabel: personaLabel || e.name || (cls === 'settlement' ? home?.name : '') || `a ${cls}`,
    facets,
  };
}

/** The manifest keys the built slice covers (for the client-side parity self-check).
 *  @param {any} slice @returns {string[]} */
export function sliceManifestKeys(slice) {
  return [...new Set((slice?.facets || []).map((/** @type {any} */ f) => f.manifestKey))];
}

/** True iff the built slice covers every required manifest key for its entity class.
 *  @param {any} slice @returns {boolean} */
export function sliceCoversManifest(slice) {
  const have = new Set(sliceManifestKeys(slice));
  return requiredManifestKeys(slice?.entityClass || 'npc').every((/** @type {string} */ k) => have.has(k));
}
