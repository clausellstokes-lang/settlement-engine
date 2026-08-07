/**
 * lineageMemberBirth.js — WR-3's first-class satellite graduation seam.
 *
 * A satellite is population outside the campaign-member roster.  Once its
 * village charter is approved, that same population becomes a canon member;
 * it is not copied from the parent and it is never debited twice.  This leaf
 * owns the deterministic identity, the deliberately-small first-class dossier,
 * and the live regional edge.  Persistence remains a store responsibility.
 */

import { deepClone } from '../clone.js';
import { edgeIdFor, ensureRegionalGraph } from '../region/graph.js';

const INHERITED_CONFIG_KEYS = Object.freeze([
  'climate',
  'contentBoundaries',
  'contentProfile',
  'culture',
  'magicExists',
  'magicLevel',
  'primaryDeityRef',
  'primaryDeitySnapshot',
  'priorityMagic',
  'region',
  'terrain',
  'worldLawVersion',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function objectOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Deep-copy one inherited value through the sanctioned clone seam.
 *
 * This routes to `domain/clone.js` rather than round-tripping JSON itself, which is
 * what `tests/lint/deepCloneHotPath.test.js` requires.
 *
 * ⚠ THAT SOURCE-SCAN TEST IS THE ONLY ENFORCEMENT, contrary to its own header and
 * `clone.js`'s ("the eslint no-restricted-syntax selectors are the primary
 * enforcement"). MEASURED 2026-08-07: `eslint.config.js` carries NO
 * `JSON.parse(JSON.stringify(…))` selector in any block, and linting this file's
 * pre-fix HEAD content exited 0 while the walker's own regex matched it. Reported
 * to the chair; do not rely on eslint to catch a reintroduction here.
 *
 * ⚠ THE SEAM IS NOT UNIVERSALLY EQUIVALENT TO THE JSON ROUND-TRIP, and this record
 * is PERSISTED, so the swap was measured rather than assumed. `deepClone` prefers
 * `structuredClone`, which PRESERVES what JSON round-tripping destroys: `Date`
 * (JSON → ISO string), `Map`/`Set`/`RegExp` (JSON → `{}`), `undefined`-valued keys
 * and `NaN`/`Infinity`/`-0` (JSON → dropped / `null` / `0`). Any of those inside a
 * cloned subtree would move this birth record's shape.
 *
 * MEASURED 2026-08-07 against three real `generateSettlementPipeline` outputs
 * (seeds CONTAINED-A1/B2/C3, tiers city/town/village): every value that actually
 * reaches this function — the twelve `INHERITED_CONFIG_KEYS`, `parent.culture`,
 * `parent.culturalIdentity`, `satellite.site`, `satellite.conveyed` — is plain
 * JSON data, so both clones produce byte-identical AND type-identical results.
 * Same-seed persisted and structural hashes of the whole birth were unchanged.
 * A future field carrying a `Date` or a `Map` into any of those five subtrees WOULD
 * move the persisted shape; that is a declared golden shift, not a free change.
 *
 * The `null`/`undefined` short-circuit is retained deliberately. It was load-bearing
 * for the old path (`JSON.parse(JSON.stringify(undefined))` throws) and is exactly
 * behaviour-neutral for the new one (`structuredClone` returns both unchanged), so
 * keeping it preserves the drop-when-absent contract the `conveyed`/`site` spreads
 * below depend on.
 *
 * @param {unknown} value @returns {unknown}
 */
function cloneInherited(value) {
  if (value == null) return value;
  return deepClone(value);
}

/**
 * Deterministic RFC-4122-v4-shaped identity.  Four salted FNV-1a passes keep
 * retry/replay on one row without consuming the pulse RNG.
 * @param {unknown[]} parts
 * @returns {string}
 */
export function lineageMemberSaveId(parts) {
  const source = parts.map(value => String(value ?? '')).join('\u0000');
  let hex = '';
  for (let salt = 0; salt < 4; salt += 1) {
    let hash = (0x811c9dc5 ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
    const input = `${salt}:${source}`;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    hex += hash.toString(16).padStart(8, '0');
  }
  const variant = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${variant}${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-');
}

/** @param {Record<string, unknown>} source */
function inheritedConfig(source) {
  /** @type {Record<string, unknown>} */
  const next = {};
  for (const key of INHERITED_CONFIG_KEYS) {
    if (source[key] !== undefined) next[key] = cloneInherited(source[key]);
  }
  return next;
}

/**
 * Parent population-history rows are the durable proof that named transfers
 * sustained this satellite.  Copy only their ids into the immutable birth
 * record; the scorer later corroborates them against the parent's live
 * chronicle before it suppresses a claim.
 * @param {Record<string, unknown>} parent
 * @param {string} satelliteId
 * @returns {string[]}
 */
function provisioningEvidenceIds(parent, satelliteId) {
  const prefix = `lifecycle.grow.${satelliteId}.`;
  const ids = [];
  for (const row of Array.isArray(parent.populationHistory) ? parent.populationHistory : []) {
    const id = typeof row?.outcomeId === 'string' ? row.outcomeId : '';
    if (id.startsWith(prefix)) ids.push(id);
  }
  return [...new Set(ids)].sort();
}

/**
 * Materialize one chartered satellite as a canon campaign save.
 *
 * The dossier is intentionally a projection, not a clone: a child does not
 * inherit its parent's NPCs, factions, offices, incidents, or institutions.
 * It inherits only world-law/cultural context plus the satellite's own name,
 * people, ground, resources, and chronicle.
 *
 * @param {Object} args
 * @param {string} args.campaignId
 * @param {string} args.parentId
 * @param {Record<string, unknown>} args.parent
 * @param {import('./settlementLifecycleKernel.js').SatelliteRecord} args.satellite
 * @param {number} args.tick
 * @param {string|null} args.now
 */
export function buildLineageMemberBirth({ campaignId, parentId, parent, satellite, tick, now }) {
  const saveId = lineageMemberSaveId(['lineage-member', campaignId, parentId, satellite.id]);
  const birthId = `lineage.birth.${saveId}`;
  const edgeId = edgeIdFor(parentId, saveId);
  const parentConfig = objectOf(parent.config);
  const config = {
    ...inheritedConfig(parentConfig),
    settType: 'village',
    tier: 'village',
    peakTier: 'village',
    ...(Array.isArray(satellite.resources)
      ? { nearbyResources: [...satellite.resources] }
      : {}),
  };
  const evidenceIds = provisioningEvidenceIds(parent, satellite.id);
  const parentRef = {
    version: 1,
    birthId,
    parentId,
    sourceSatelliteId: satellite.id,
    liveEdgeId: edgeId,
    foundedTick: satellite.foundedTick,
    graduatedTick: tick,
    // The satellite's live tier is normally `hamlet` by charter time.  Preserve
    // the rung at which its founding population actually left the parent; older
    // satellite records predate the explicit field but every engine mint began
    // at thorp, so that is the only honest compatibility fallback.
    foundingTier: satellite.foundingTier || 'thorp',
    graduationTier: 'village',
    graduationPopulation: Math.max(0, Math.round(Number(satellite.population) || 0)),
    provenance: satellite.provenance,
    ...(satellite.site ? { site: cloneInherited(satellite.site) } : {}),
    ...(Array.isArray(satellite.resources) ? { resources: [...satellite.resources] } : {}),
    // WR-10 — THE SALE SURVIVES THE CHARTER. A steading that changed hands carries
    // `conveyed` provenance; a satellite has no relationship object, no seat and no
    // legitimacy to resent with, so until this moment the grievance has nowhere to
    // live. Graduation is where it acquires all three, and folding the provenance into
    // the immutable receipt is what lets WR-3's claims read "this town was sold by the
    // line that founded it" instead of losing the fact at the charter. Conditional and
    // drop-when-absent: a steading that was never sold graduates byte-identically.
    ...(satellite.conveyed ? { conveyed: cloneInherited(satellite.conveyed) } : {}),
    ...(evidenceIds.length ? {
      provisioningRecord: {
        id: `lineage.provisioning.${saveId}`,
        kind: 'founding_support',
        fromId: parentId,
        evidenceIds,
      },
    } : {}),
  };
  const population = parentRef.graduationPopulation;
  const charterEventId = `history.lineage-charter.${saveId}`;
  const settlement = {
    id: saveId,
    _seed: `lineage:${campaignId}:${satellite.id}`,
    name: String(satellite.name || 'The New Charter'),
    tier: 'village',
    population,
    ...(parent.culture !== undefined ? { culture: cloneInherited(parent.culture) } : {}),
    ...(parent.culturalIdentity !== undefined
      ? { culturalIdentity: cloneInherited(parent.culturalIdentity) }
      : {}),
    config,
    _config: { ...config },
    parentRef,
    activeConditions: [],
    aiOverlays: [],
    userCanon: {},
    simulationTrace: [],
    npcs: [],
    factions: [],
    institutions: [],
    services: [],
    features: [],
    populationHistory: [{
      tick,
      delta: 0,
      population,
      reason: `${String(satellite.name || 'The steading')} received its own charter.`,
      outcomeId: charterEventId,
    }],
    history: {
      historicalEvents: [{
        id: charterEventId,
        name: 'The Charter',
        type: 'settlement_chartered',
        tick,
        description: `${String(parent.name || parentId)} recognized ${String(satellite.name || 'the steading')} as a settlement in its own right.`,
      }],
    },
  };
  const campaignState = {
    phase: 'canon',
    eventLog: [],
    systemState: null,
    locks: {},
    generatedAt: now,
    editedAt: now,
    canonizedAt: now,
    lastExportAt: null,
    narrativeDrift: null,
    exportState: null,
  };
  const save = {
    id: saveId,
    name: settlement.name,
    tier: 'village',
    phase: 'canon',
    settlement,
    config: { ...config },
    seed: settlement._seed,
    aiData: {},
    campaignState,
    versionHistory: [],
    timestamp: now,
  };
  return {
    birthId,
    saveId,
    campaignId,
    parentId,
    satelliteId: satellite.id,
    tick,
    save,
    graphNode: {
      id: saveId,
      name: settlement.name,
      tier: 'village',
      settlementId: saveId,
      updatedAt: now,
    },
    graphEdge: {
      id: edgeId,
      from: parentId,
      to: saveId,
      relationshipType: 'neutral',
      status: 'active',
      channelIds: [],
      evidence: [{
        type: 'settlement_lineage',
        birthId,
        parentId,
        childId: saveId,
        sourceSatelliteId: satellite.id,
        tick,
      }],
      updatedAt: now,
    },
  };
}

/**
 * Add births to the live regional graph.  Replays replace the same node/edge
 * by deterministic id, so a lost response cannot duplicate topology.
 * @param {Record<string, unknown>} graph
 * @param {Array<ReturnType<typeof buildLineageMemberBirth>>} births
 * @param {string|null} now
 */
export function applyLineageBirthsToGraph(graph, births, now) {
  if (!Array.isArray(births) || births.length === 0) return graph;
  const current = ensureRegionalGraph(graph, { now: now || undefined });
  const nodes = new Map((current.nodes || []).map(node => [String(node.id), node]));
  const edges = new Map((current.edges || []).map(edge => [String(edge.id), edge]));
  for (const birth of births) {
    nodes.set(String(birth.graphNode.id), birth.graphNode);
    edges.set(String(birth.graphEdge.id), birth.graphEdge);
  }
  return ensureRegionalGraph({
    ...current,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    updatedAt: now || current.updatedAt,
  }, { now: now || undefined });
}

/** @param {Record<string, unknown>|null|undefined} worldState */
export function lineageMemberBirthActive(worldState) {
  const rules = worldState && typeof worldState === 'object'
    ? worldState.simulationRules
    : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).lineageClaimEnabled === true);
}
