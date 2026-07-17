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

/**
 * Structural slices of the store/world shapes THIS module reads (typed narrowly so the
 * slicer carries zero any-holes — the domain ratchet — while accepting the real objects).
 * @typedef {{ type?: string, glueType?: string, glue?: Array<{ type?: string }>, strain?: number }} BlocLite
 * @typedef {{ dominant?: string, alignment?: string, temperament?: string }} PersonalityLite
 * @typedef {{ id?: string|number, name?: string, settlementId?: string|number,
 *            alignment?: string, temperament?: string, role?: string,
 *            personality?: PersonalityLite, goal?: { short?: string }|string,
 *            factionAffiliation?: unknown, factionLink?: unknown, factionArchetype?: unknown,
 *            blocs?: BlocLite[] }} EntityLite
 * @typedef {{ npc1Id?: string|number, npc2Id?: string|number, type?: string }} RelationshipLite
 * @typedef {{ prosperity?: unknown, foodSecurity?: unknown,
 *            primaryExports?: unknown[], primaryImports?: unknown[] }} EconomyLite
 * @typedef {{ id?: string|number, name?: string, _seed?: number,
 *            npcs?: EntityLite[], relationships?: RelationshipLite[],
 *            economicState?: EconomyLite, economy?: EconomyLite, prosperity?: unknown,
 *            config?: { primaryDeitySnapshot?: unknown, cultDeitySnapshots?: unknown[] },
 *            primaryDeity?: unknown,
 *            powerStructure?: { factions?: Array<string|{ name?: string }> },
 *            factions?: Array<string|{ name?: string }>,
 *            appliedDecrees?: unknown[], decrees?: unknown[],
 *            politicsLedgers?: Record<string, { blocs?: BlocLite[] }>,
 *            blocs?: BlocLite[] }} HomeLite
 * @typedef {{ alignment?: string, role?: string, shortGoal?: string, rivalryTargets?: unknown[] }} NpcStateLite
 * @typedef {{ clock?: unknown, npcStates?: Record<string, NpcStateLite> }} WorldStateLite
 */

/** Guard a read-model call: degrade to `fallback` on any throw (dormant/partial worldState).
 *  @template T @param {() => T} fn @param {T|null} [fallback] @returns {T|null} */
function safe(fn, fallback = null) {
  try { const v = fn(); return v == null ? fallback : v; } catch { return fallback; }
}

/** @param {string} manifestKey @param {string} entityId @param {string} [label] @param {unknown} [data] */
function facet(manifestKey, entityId, label, data) {
  return { id: `${manifestKey}:${entityId}`, manifestKey, label, data: data ?? {} };
}

/** Resolve the collective voice for a settlement/faction from its dominant bloc glue (an NPC
 *  is always 'self'). Patronage (people-held, personal loyalty) ⇒ patron; anything else, or
 *  no live bloc, ⇒ the governing seat.
 *  @param {string} entityClass @param {EntityLite|HomeLite} entity @param {HomeLite|null} settlement @returns {string} */
function resolveVoice(entityClass, entity, settlement) {
  if (entityClass === 'npc') return 'self';
  const blocs = safe(() => (settlement?.politicsLedgers?.[String(settlement?.id)]?.blocs) || entity?.blocs || settlement?.blocs, []) || [];
  const dominant = Array.isArray(blocs) && blocs.length
    ? blocs.slice().sort((a, b) => (b?.strain ?? 0) - (a?.strain ?? 0))[0] : null;
  const glueType = dominant && Array.isArray(dominant.glue) && dominant.glue[0] ? dominant.glue[0].type : dominant?.glueType;
  return glueType === 'patronage' ? 'patron' : 'seat';
}

/** The person facets (NPC only) — alignment / temperament / role / goal from the NPC's own
 *  fields + live sim state (never another NPC's). Always emits all four keys (parity).
 *  @param {EntityLite} entity @param {NpcStateLite|null|undefined} npcState @param {string} entityId */
function personFacets(entity, npcState, entityId) {
  const p = entity?.personality || {};
  const goal = entity?.goal;
  /** @type {Record<string, unknown>} */
  const values = {
    alignment: entity?.alignment ?? npcState?.alignment ?? p.alignment ?? null,
    temperament: p.dominant ?? entity?.temperament ?? p.temperament ?? null,
    role: entity?.role ?? npcState?.role ?? null,
    goal: (typeof goal === 'object' && goal ? goal.short : undefined) ?? npcState?.shortGoal ?? goal ?? null,
  };
  return PERSON_FACET_KEYS.map((k) => facet(k, entityId, k, { [k]: values[k] }));
}

/**
 * Build the persona slice payload the client POSTs to the parley edge. Belief-scoped,
 * manifest-complete. Pure (the read-model calls are all pure + guarded).
 *
 * @param {{
 *   entity?: EntityLite|HomeLite|null, entityClass?: 'npc'|'settlement'|'faction',
 *   settlement?: HomeLite|null, worldState?: WorldStateLite|null, settlements?: unknown[],
 *   tick?: number, askerId?: string|null, personaLabel?: string,
 *   deps?: { hegemonyFear?: Function, season?: Function, reframe?: Function },
 * }} [args]
 * @returns {{ entityId: string, entityClass: string, voice: string, personaLabel: string,
 *            facets: Array<{ id: string, manifestKey: string, label?: string, data: unknown }> }}
 */
export function buildPersonaSlice({
  entity, entityClass, settlement = null, worldState = null, settlements = [],
  tick = 0, askerId = null, personaLabel = '', deps = {},
} = {}) {
  const e = /** @type {EntityLite & HomeLite} */ (entity && typeof entity === 'object' ? entity : {});
  const cls = entityClass === 'settlement' || entityClass === 'faction' ? entityClass : 'npc';
  const entityId = String(e.id ?? (cls === 'settlement' ? settlement?.id : '') ?? 'entity');
  /** @type {HomeLite|null} */
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
    roster: (home?.powerStructure?.factions || home?.factions || []).map((f) => (typeof f === 'string' ? f : f?.name)).filter(Boolean).slice(0, 8),
  }))));

  // (b) HEGEMONY through the entity's FOG — she ranks powers as her BELIEFS rank them
  facets.push(facet('hegemony', entityId, 'Believed spheres', safe(() => {
    const hf = deps.hegemonyFear ? deps.hegemonyFear({ worldState }) : null;
    return hf && typeof hf.believedSpheresFor === 'function' ? hf.believedSpheresFor(observerId) : {};
  }, {})));

  // (c) standing rulings/decrees touching the settlement (felt through the reframe layer)
  facets.push(facet('rulings', entityId, 'Standing rulings', safe(() => ({
    decrees: (home?.appliedDecrees || home?.decrees || []).slice(0, 6),
  }))));

  // (d) deity + doctrine + imposed cult/heresy
  facets.push(facet('deity_doctrine', entityId, 'Faith', safe(() => ({
    patron: home?.config?.primaryDeitySnapshot ?? home?.primaryDeity ?? null,
    cults: (home?.config?.cultDeitySnapshots || []).slice(0, 4),
  }))));

  // (e) economy — prosperity, food security, trade dependencies (self-knowledge)
  facets.push(facet('economy', entityId, 'Livelihood', safe(() => {
    const econ = home?.economicState || home?.economy || {};
    return {
      prosperity: econ.prosperity ?? home?.prosperity ?? null,
      foodSecurity: econ.foodSecurity ?? null,
      exports: (econ.primaryExports || []).slice(0, 4),
      imports: (econ.primaryImports || []).slice(0, 4),
    };
  })));

  // (f) SEASON + its pressures (the character feels the season)
  facets.push(facet('season', entityId, 'Season', safe(() => {
    const s = deps.season ? deps.season({ rngSeed: home?._seed, clock: worldState?.clock, settlement: home, settlementId: observerId }) : null;
    return s ? { season: s.season, weekOfYear: s.weekOfYear, year: s.year } : {};
  }, {})));

  // (g) the NPC web — the entity's own patron/rival/kin/bloc edges (people-held travel here)
  facets.push(facet('npc_web', entityId, 'Ties', safe(() => ({
    ties: (home?.relationships || [])
      .filter((r) => r && (String(r.npc1Id) === entityId || String(r.npc2Id) === entityId))
      .map((r) => ({ type: r.type, with: String(r.npc1Id) === entityId ? r.npc2Id : r.npc1Id }))
      .slice(0, 10),
    rivalries: (npcState?.rivalryTargets || []).slice(0, 6),
  }))));

  // (h) reframes — the entity's current READING of the asker (the curdled gift colors it)
  facets.push(facet('reframes', entityId, 'Stance on the asker', safe(() => {
    if (!askerId || !deps.reframe) return {};
    /** @type {Record<string, unknown>} */
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
 *  @param {{ facets?: Array<{ manifestKey: string }> }|null|undefined} slice @returns {string[]} */
export function sliceManifestKeys(slice) {
  return [...new Set((slice?.facets || []).map((f) => f.manifestKey))];
}

/** True iff the built slice covers every required manifest key for its entity class.
 *  @param {{ facets?: Array<{ manifestKey: string }>, entityClass?: string }|null|undefined} slice @returns {boolean} */
export function sliceCoversManifest(slice) {
  const have = new Set(sliceManifestKeys(slice));
  return requiredManifestKeys(slice?.entityClass || 'npc').every((k) => have.has(k));
}
