/**
 * domain/regenerationDelta.js — Structured diff between two settlements.
 *
 * Tier 5.1 of the roadmap. After a user change + rerun, the UI needs
 * to show what changed at every layer: substrate variables, capacity
 * supply/demand, daily-life prose, which entities were preserved /
 * added / removed. Phase 32 composes the existing comparators from
 * Phases 17, 18, 21, 22, 23 plus an entity-catalog set diff.
 *
 *   deriveRegenerationDelta(before, after) -> {
 *     directEffects:       SystemStateDelta[]      Phase 7
 *     rippleEffects:       CausalStateDelta[]      Phase 17
 *     capacityShifts:      CapacityDelta[]         Phase 21
 *     dailyLifeShifts:     DailyLifeDelta[]        Phase 22
 *     preservedCanon:      Reference[]
 *     brokenDependencies:  string[]
 *     newEntities:         Reference[]
 *     removedEntities:     Reference[]
 *     newOpportunities:    Reference[]   newEntities of type 'hook'
 *     newRisks:            Reference[]   newEntities of type 'threat' | 'condition' | 'clock'
 *     summary:             string[]
 *     dmFields:            { roots, worldFacts }  EM-B2b
 *   }
 *
 * Pure read-only. The two settlements are never mutated.
 */

import { deriveSystemState } from './state/deriveSystemState.js';
import { compareSystemState } from './state/compareSystemState.js';
import { deriveCausalState, compareCausalState } from './causalState.js';
import { deriveAllCapacities, compareCapacityStates } from './capacityModel.js';
import { deriveDailyLife, compareDailyLife } from './dailyLife.js';
import { entityCatalog } from './explanation.js';

// ── Catalog diff ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} CatalogEntry
 * @property {string} type
 * @property {string} id
 * @property {string} [label]
 */

/**
 * Index a settlement's entity catalog by entity id.
 * @param {object|null|undefined} settlement
 * @returns {Map<string, CatalogEntry>}
 */
function catalogIndex(settlement) {
  // entityCatalog is null-tolerant and reads only loosely-shaped fields; the
  // cast bridges its narrowed ExplainSettlement param from our opaque snapshot.
  const cat = entityCatalog(/** @type {import('./explanation.js').ExplainSettlement|null|undefined} */ (settlement));
  const byId = new Map();
  for (const e of cat) byId.set(e.id, e);
  return byId;
}

/**
 * Set-diff the entity catalogs of two settlement snapshots.
 * @param {object} before
 * @param {object} after
 * @returns {{ preserved: CatalogEntry[], added: CatalogEntry[], removed: CatalogEntry[] }}
 */
function diffEntityCatalogs(before, after) {
  const beforeMap = catalogIndex(before);
  const afterMap  = catalogIndex(after);

  const preserved = [];
  const added = [];
  const removed = [];

  for (const [id, entry] of afterMap) {
    if (beforeMap.has(id)) preserved.push(entry);
    else                   added.push(entry);
  }
  for (const [id, entry] of beforeMap) {
    if (!afterMap.has(id)) removed.push(entry);
  }
  return { preserved, added, removed };
}

// ── The DM's fields (EM-B2b) ─────────────────────────────────────────────

/**
 * A plain, non-array object — the only shape either snapshot may be read through.
 * @param {unknown} value any value at all; both snapshots are opaque to this module
 * @returns {value is Record<string, unknown>}
 */
const isRecordLike = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The ENGINE'S OWN value for a declared root, read from the BEFORE snapshot at the declaration's
 * `outputKey`.
 *
 * ⛔ REGISTER-FREE BY CONSTRUCTION, AND THAT IS DELIBERATE. An array hop (`npcs[].role`) selects
 * the SOLE entry carrying `entityId` among its own values and resolves to `undefined` on zero or
 * on several rather than guessing, so this reporter can be wrong-by-silence but never
 * wrong-by-value. The AUTHORITATIVE join lives in `src/domain/edit/recordRegister.js` and is
 * deliberately NOT imported: this module renders a diff into the version-diff bundle, and an edge
 * into the edit volume for a label would carry that whole volume with it.
 *
 * @param {unknown} before @param {unknown} outputKey @param {string} entityId
 * @returns {unknown} `undefined` means "not resolvable here", never "the engine had nothing".
 */
function engineValueAt(before, outputKey, entityId) {
  let cursor = before;
  for (const segment of String(outputKey).split('.')) {
    const hop = segment.endsWith('[]');
    const name = hop ? segment.slice(0, -2) : segment;
    if (!isRecordLike(cursor) || !Object.hasOwn(cursor, name)) return undefined;
    cursor = cursor[name];
    if (!hop) continue;
    if (!Array.isArray(cursor)) return undefined;
    const hits = cursor.filter((entry) => isRecordLike(entry) && Object.values(entry).some((value) => value === entityId));
    if (hits.length !== 1) return undefined;
    cursor = hits[0];
  }
  return cursor;
}

/**
 * ⭐ THE TWELFTH KEY — "THE DM'S FIELDS", PARTITIONED BY PROVENANCE (EM-B2b, the chair's
 * judgment 241 ruling 1). §12.12's "kept" is an ENTITY diff; this is the FIELD-level section, and
 * it answers the one question the entity diff cannot: of everything that moved, which values are
 * the DM's own hand and which are the world's answer to them.
 *
 * ⛔ IT READS `after.dmLayer.roots` AND NEVER `after.dmLayer.worldFacts`. That bag is INERT —
 * written by nobody, read by nobody — so a section built from it would report EMPTY for every
 * edit a DM ever makes. A world fact lives in `roots` like every other declared edit and it is
 * the DECLARATION'S `provenance` that sorts it, which is why the partition is total.
 *
 * ⛔ THE CONSULT ARRIVES FROM THE CALLER AND NO DECLARATION TABLE IS IMPORTED HERE. A root this
 * module cannot resolve — no consult, or no declaration row, or a world fact whose declaration
 * names no engine key — reports in `roots`, which is §6's own rule that every root that is not a
 * world fact is a root. Nothing is dropped and nothing is invented.
 *
 * @param {unknown} before @param {unknown} after
 * @param {unknown} declarations the INJECTED declaration consult, read defensively
 * @returns {{ roots: Array<{ key: string, cardShape: string, entityId: string, field: string,
 *                            dmValue: unknown, engineValue: unknown }>,
 *             worldFacts: Array<{ configKey: string, dmValue: unknown, engineValue: unknown }> }}
 *   both arrays ASCII-ascending on their first field, both empty when the layer is absent or empty
 */
function dmFieldsOf(before, after, declarations) {
  const roots = [];
  const worldFacts = [];
  const layer = isRecordLike(after) && isRecordLike(after.dmLayer) ? after.dmLayer : null;
  const bag = layer !== null && isRecordLike(layer.roots) ? layer.roots : {};
  const consult = isRecordLike(declarations) && typeof declarations.declarationsFor === 'function'
    ? /** @type {(cardType: string) => unknown} */ (declarations.declarationsFor) : null;
  const storedConfig = isRecordLike(before) && isRecordLike(before.config) ? before.config : null;

  for (const key of Object.keys(bag).sort()) {
    // The root key is `<cardType>:<entityId>:<field>`, and the entity id is whatever lies between
    // the first and last separators, so an id carrying one cannot be mis-read.
    const parts = key.split(':');
    const cardShape = parts[0];
    const entityId = parts.length > 2 ? parts.slice(1, -1).join(':') : '';
    const field = parts.length > 2 ? parts[parts.length - 1] : '';
    let declared;
    try { declared = consult === null ? null : consult(cardShape); } catch { declared = null; }
    const row = (Array.isArray(declared) ? declared.filter(isRecordLike) : []).find((each) => each.field === field);
    const named = row?.inputKey;
    const inputKey = typeof named === 'string' && named.length > 0 ? named : null;
    if (row?.provenance === 'world-fact' && inputKey !== null) {
      worldFacts.push({ configKey: inputKey, dmValue: bag[key], engineValue: storedConfig?.[inputKey] });
      continue;
    }
    roots.push({ key, cardShape, entityId, field, dmValue: bag[key], engineValue: engineValueAt(before, row?.outputKey, entityId) });
  }
  worldFacts.sort((a, b) => (a.configKey < b.configKey ? -1 : (a.configKey > b.configKey ? 1 : 0)));
  return { roots, worldFacts };
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Diff two settlement snapshots into a structured regeneration delta.
 *
 * @param {Object} before
 * @param {Object} after
 * @param {unknown} [declarations] the INJECTED declaration consult (EM-B2b). It is read only to
 *   partition `dmFields`; every other key is derived exactly as before, and a caller that passes
 *   nothing sees the twelfth key with every root reported as a root.
 * @returns {Object}
 */
export function deriveRegenerationDelta(before, after, declarations) {
  if (!before || !after) {
    return {
      directEffects: [],
      rippleEffects: [],
      capacityShifts: [],
      dailyLifeShifts: [],
      preservedCanon: [],
      brokenDependencies: [],
      newEntities: [],
      removedEntities: [],
      newOpportunities: [],
      newRisks: [],
      summary: [],
      dmFields: { roots: [], worldFacts: [] },
    };
  }

  // Layer 1: substrate diffs (already built helpers).
  const directEffects  = compareSystemState(deriveSystemState(before), deriveSystemState(after));
  const rippleEffects  = compareCausalState(deriveCausalState(before), deriveCausalState(after));
  const capacityShifts = compareCapacityStates(deriveAllCapacities(before), deriveAllCapacities(after));
  const dailyLifeShifts = compareDailyLife(deriveDailyLife(before), deriveDailyLife(after));

  // Layer 2: entity catalog diff.
  const { preserved, added, removed } = diffEntityCatalogs(before, after);

  // A "broken dependency" in Phase 32's lean form is a removed entity id
  // that a remaining (preserved) entity's references[] points to.
  // We don't run full reference walk here (would require explaining
  // every preserved entity, expensive); instead we just surface the
  // removed ids — consumers that need full link analysis can call
  // Phase 19 explainEntity on each.
  const brokenDependencies = removed.map(e => e.id);

  // Risk-vs-opportunity split on added entities.
  const newOpportunities = added.filter(e => e.type === 'hook');
  const newRisks = added.filter(e =>
    e.type === 'threat' || e.type === 'condition' || e.type === 'clock'
  );

  // Summary lines.
  const summary = [];
  if (directEffects.length === 0
   && rippleEffects.length === 0
   && capacityShifts.length === 0
   && dailyLifeShifts.length === 0
   && added.length === 0
   && removed.length === 0) {
    summary.push('No structural changes detected between the two snapshots.');
  } else {
    if (directEffects.length)  summary.push(`${directEffects.length} system-state shift(s).`);
    if (rippleEffects.length)  summary.push(`${rippleEffects.length} substrate variable change(s).`);
    if (capacityShifts.length) summary.push(`${capacityShifts.length} capacity shift(s).`);
    if (dailyLifeShifts.length) summary.push(`${dailyLifeShifts.length} daily-life slot(s) rewritten.`);
    if (added.length)   summary.push(`${added.length} new entity(s).`);
    if (removed.length) summary.push(`${removed.length} entity(s) removed.`);
    for (const d of directEffects)  summary.push(d.explanation);
    for (const d of rippleEffects)  summary.push(d.explanation);
    for (const d of capacityShifts) summary.push(d.explanation);
  }

  return {
    directEffects,
    rippleEffects,
    capacityShifts,
    dailyLifeShifts,
    preservedCanon: preserved,
    brokenDependencies,
    newEntities: added,
    removedEntities: removed,
    newOpportunities,
    newRisks,
    summary,
    dmFields: dmFieldsOf(before, after, declarations),
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/**
 * @typedef {Object} RegenerationDeltaLike
 * @property {ReadonlyArray<unknown>} [directEffects]
 * @property {ReadonlyArray<unknown>} [rippleEffects]
 * @property {ReadonlyArray<unknown>} [capacityShifts]
 * @property {ReadonlyArray<unknown>} [dailyLifeShifts]
 * @property {CatalogEntry[]} [newEntities]
 * @property {CatalogEntry[]} [removedEntities]
 */

/**
 * Total count of structural changes across all layers.
 * @param {RegenerationDeltaLike|null|undefined} delta
 * @returns {number}
 */
export function regenerationDeltaSize(delta) {
  if (!delta) return 0;
  return (delta.directEffects?.length    || 0)
       + (delta.rippleEffects?.length    || 0)
       + (delta.capacityShifts?.length   || 0)
       + (delta.dailyLifeShifts?.length  || 0)
       + (delta.newEntities?.length      || 0)
       + (delta.removedEntities?.length  || 0);
}

/**
 * Group new entities by type. Useful for "what's new" UI sections.
 * @param {RegenerationDeltaLike|null|undefined} delta
 * @returns {Record<string, CatalogEntry[]>}
 */
export function newEntitiesByType(delta) {
  /** @type {Record<string, CatalogEntry[]>} */
  const out = {};
  for (const e of delta?.newEntities || []) {
    if (!out[e.type]) out[e.type] = [];
    out[e.type].push(e);
  }
  return out;
}
