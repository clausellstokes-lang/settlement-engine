/**
 * observed-shape-corpus.mjs — THE EXECUTED KEY CENSUS.
 *
 * The reader-with-no-writer class (TCD-1/2/3, and the recorded
 * `faction-key-defect-class`) is invisible to types and invisible to review: the
 * read is defensively guarded, so a key no writer produces degrades to a default
 * instead of throwing. The only authority on which keys a record shape ACTUALLY
 * carries is a real run of the real producers. This module is that run.
 *
 * ⚠ DERIVE, DO NOT RESTATE. Nothing in this file transcribes a key name into a
 * fixture. Every key in the corpus is read off an object a shipped producer just
 * built. A fixture that mirrors the deriver produces dead arms (recorded class,
 * 2026-07); a hand-restated derivable goes stale and greens a shrink-only walker
 * (recorded class, 2026-08-06). The three producers are:
 *
 *   1. `generateSettlementPipeline` over a MULTI-SEED × MULTI-CONFIG corpus. A
 *      single seed is vacuous here: `modifier`, `isGoverning`, `modifiers` and
 *      `legitimacyCrisis` are all situational and appear in some seeds only. THE
 *      RULE IS UNION, NEVER INTERSECTION — a key present in ANY run is written,
 *      and only a key present in NO run is a finding. Getting that backwards
 *      floods the walker with false positives and gets it turned off.
 *   2. `simulateCampaignWorldPulse` over those REAL generated saves, with every
 *      discovered `*Enabled` simulation rule LIT, for N intervals. Lighting the
 *      flags is a coverage decision in the SAFE direction: more writers run,
 *      more keys observed, fewer false findings.
 *   3. `applyRealmVerbOrder` driving FORCE_FOUND_STEADING. The satellite
 *      founding gate (seeding integrator + cooldown + tier cap) is not reached
 *      by the pulse corpus above — 40 intervals mint zero steadings — so the
 *      SatelliteRecord shape would be absent from the corpus and every read of
 *      it would go unmeasured. The verb path is the SAME mint (`mintSteading`)
 *      and the SAME ledger fold the organic path uses ("force ≡ organic by
 *      construction", settlementLifecycleKernel.js), so the record it produces
 *      is the record the engine writes. Only the ORDER is authored here; every
 *      key on the resulting record comes from the shipped writer.
 *
 * ── SHAPE IDENTITY, AND WHY DYNAMIC VALUES ARE A FACET ─────────────────
 * A record is identified by its full EXECUTED ORIGIN, not by its last container
 * name. Path segments are typed and URI-escaped: a literal key `items[]` cannot
 * collide with an array element, and a key containing a separator cannot merge
 * two unrelated records.
 *
 * JavaScript dictionaries are still ordinary objects. Choosing "dictionary OR
 * record" destroyed information: a fixed `{left:{...}, right:{...}}` could be
 * misclassified and lose `left`/`right`, while a conservative classifier left
 * thousands of runtime ids embedded in schema paths. Every parent therefore
 * remains a RECORD with its observed keys and may independently expose a
 * `dynamicValues` optimization facet. Named reads follow `fields`. A computed
 * read may use that facet after its key domain proves the dynamic subset; an
 * unconstrained read must also retain every traversable named field because the
 * facet is not the record's complete `Object.values` domain. The legacy
 * leaf-name view remains dictionary-transparent only for compatibility; the
 * reader resolver consumes the path-qualified graph.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require_ = createRequire(import.meta.url);
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Seeds and configs. Both axes matter: situational keys need seed spread, and
 *  tier/terrain/route spread reaches arms a single town never enters. */
export const SEEDS = Object.freeze(['osr-a', 'osr-b', 'osr-c', 'osr-d']);
export const CONFIGS = Object.freeze([
  { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' },
  { settType: 'city', culture: 'nordic', terrainOverride: 'coastal', tradeRouteAccess: 'river' },
  { settType: 'village', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' },
  { settType: 'town', culture: 'mediterranean', terrainOverride: 'mountain', tradeRouteAccess: 'mountain_pass' },
]);

/** Intervals of `simulateCampaignWorldPulse` driven over the generated saves. */
export const PULSE_INTERVALS = 12;

/** The prose-bearing scalar vocabulary admitted by AO-0. The scalar stream is
 * opt-in; the observed-shape scanner continues to consume only topology. */
export const OBSERVED_SCALAR_FIELDS = Object.freeze([
  'cause', 'channelType', 'headline', 'impactKind', 'kind', 'mode',
  'narrativeSummary', 'reason', 'reasons', 'scope', 'summary', 'summaryText',
  'tags', 'thesis', 'triggeredBy', 'type',
]);
export const VOLATILE_SCALAR_KEYS = Object.freeze([
  'appliedAt', 'createdAt', 'editedAt', 'id', 'time', 'timestamp', 'updatedAt',
]);

/** Every `<name>Enabled` simulation rule the domain tree reads, DISCOVERED from
 *  source rather than listed, so a new flag lights itself. */
export function discoverSimulationFlags(readFileSync, globFiles) {
  const flags = new Set();
  for (const abs of globFiles) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(/simulationRules[^\n]{0,40}?\.([A-Za-z][A-Za-z0-9]*Enabled)\b/g)) flags.add(m[1]);
    for (const m of src.matchAll(/\b([a-z][A-Za-z0-9]*Enabled)\b\s*[:=]\s*(?:true|false)/g)) flags.add(m[1]);
  }
  return [...flags].sort();
}

// ── The walk ────────────────────────────────────────────────────────────────

const PATH_SEPARATOR = '/';
const ROOT_SEGMENT = 'root:';
const FIELD_SEGMENT = 'field:';
const ARRAY_ELEMENT_SEGMENT = 'element';
const DYNAMIC_VALUE_SEGMENT = 'dynamic';
const MAX_WALK_DEPTH = 64;

const jsonScalar = (value) => (
  value === null
  || typeof value === 'string'
  || typeof value === 'boolean'
  || (typeof value === 'number' && Number.isFinite(value))
);
const assertScalarFields = (fields) => {
  if (!Array.isArray(fields) || fields.some((field) => typeof field !== 'string' || !field)) {
    throw new Error('observed scalar fields must be an array of nonempty strings');
  }
  if (new Set(fields).size !== fields.length) {
    throw new Error('observed scalar fields must not repeat a field name');
  }
  return fields;
};

/**
 * Project selected scalar fields from executed producer roots without folding
 * away address, order, or multiplicity. Repeated root names remain distinct by
 * their zero-based GLOBAL caller ordinal, and repeated equal values remain
 * repeated rows. Paths are relative to the root and use typed segments so a
 * literal numeric field cannot collide with an array index.
 *
 * The walker accepts JSON values only. Unsupported leaves, non-plain records,
 * cycles, and depth loss fail loudly; an empty field selection is an isolated
 * no-op so topology-only callers do not pay for or depend on this projection.
 *
 * @param {Array<{name:string,value:unknown}>} roots
 * @param {{fields?:string[],maxDepth?:number}} options
 * @returns {Array<{
 *   root:string,
 *   rootOrdinal:number,
 *   path:Array<{kind:'field',value:string}|{kind:'index',value:number}>,
 *   value:null|string|boolean|number,
 * }>}
 */
export function scalarObservationsOf(roots, { fields = [], maxDepth = MAX_WALK_DEPTH } = {}) {
  assertScalarFields(fields);
  if (!Number.isSafeInteger(maxDepth) || maxDepth < 0) {
    throw new Error('observed scalar maxDepth must be a non-negative safe integer');
  }
  if (fields.length === 0) return [];
  if (!Array.isArray(roots)) throw new Error('observed scalar roots must be an array');

  const selected = new Set(fields);
  const rows = [];
  const ancestors = new WeakSet();
  const visit = (root, rootOrdinal, value, path, depth, capture = false) => {
    if (depth > maxDepth) {
      throw new Error(`observed scalar corpus exceeded depth ${maxDepth} at root ${JSON.stringify(root)}; refusing a truncated projection`);
    }
    if (jsonScalar(value)) {
      if (capture) rows.push({ root, rootOrdinal, path, value });
      return;
    }
    if (value === undefined || ['bigint', 'function', 'symbol'].includes(typeof value)
      || (typeof value === 'number' && !Number.isFinite(value))) {
      if (!capture) return;
      throw new Error(`observed scalar corpus encountered a non-JSON value at root ${JSON.stringify(root)} / ${JSON.stringify(path)}`);
    }
    if (!value || typeof value !== 'object') {
      throw new Error(`observed scalar corpus encountered an unsupported value at root ${JSON.stringify(root)} / ${JSON.stringify(path)}`);
    }
    if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) {
      if (!capture) return;
      throw new Error(`observed scalar corpus encountered a non-plain record at root ${JSON.stringify(root)} / ${JSON.stringify(path)}`);
    }
    if (ancestors.has(value)) {
      throw new Error(`observed scalar corpus encountered an ancestor cycle at root ${JSON.stringify(root)} / ${JSON.stringify(path)}`);
    }
    ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
          if (!Object.hasOwn(value, index)) {
            throw new Error(`observed scalar corpus encountered a sparse array at root ${JSON.stringify(root)} / ${JSON.stringify(path)}`);
          }
          visit(root, rootOrdinal, value[index], [...path, { kind: 'index', value: index }], depth + 1, capture);
        }
        return;
      }
      for (const key of Object.keys(value).sort()) {
        const nextPath = [...path, { kind: 'field', value: key }];
        if (VOLATILE_SCALAR_KEYS.includes(key)) continue;
        const child = value[key];
        // A selected container carries every JSON-primitive leaf below it.
        // This admits list/record prose fields such as reasons and tags without
        // flattening away their typed relative address or duplicate values.
        visit(root, rootOrdinal, child, nextPath, depth + 1, capture || selected.has(key));
      }
    } finally {
      ancestors.delete(value);
    }
  };

  roots.forEach((entry, rootOrdinal) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)
      || typeof entry.name !== 'string' || !entry.name) {
      throw new Error(`observed scalar root ${rootOrdinal} must carry a nonempty name and value`);
    }
    visit(entry.name, rootOrdinal, entry.value, [], 0);
  });
  return rows;
}

const encodePathValue = (value) => encodeURIComponent(String(value));
const decodePathValue = (value) => decodeURIComponent(value);
const rootPathOf = (name) => `${ROOT_SEGMENT}${encodePathValue(name)}`;
const fieldPathOf = (path, key) => `${path}${PATH_SEPARATOR}${FIELD_SEGMENT}${encodePathValue(key)}`;
const elementPathOf = (path) => `${path}${PATH_SEPARATOR}${ARRAY_ELEMENT_SEGMENT}`;
const dynamicPathOf = (path) => `${path}${PATH_SEPARATOR}${DYNAMIC_VALUE_SEGMENT}`;

/** @typedef {{
 *   recordInstances: number,
 *   arrayInstances: number,
 *   recordObservations: Set<number>,
 *   arrayObservations: Set<number>,
 *   keys: Map<string, number>,
 *   fieldKinds: Map<string, Set<'array'|'object'|'scalar'>>,
 *   fieldOccurrences: Map<string, number>,
 *   fieldIdMatches: Map<string, number>,
 *   instanceKeySets: Set<string>[],
 *   elementKinds: Set<'array'|'object'|'scalar'>,
 * }} PathNode */

function pathNode(paths, path) {
  let node = paths.get(path);
  if (!node) {
    node = {
      recordInstances: 0,
      arrayInstances: 0,
      recordObservations: new Set(),
      arrayObservations: new Set(),
      keys: new Map(),
      fieldKinds: new Map(),
      fieldOccurrences: new Map(),
      fieldIdMatches: new Map(),
      instanceKeySets: [],
      elementKinds: new Set(),
    };
    paths.set(path, node);
  }
  return node;
}

/** Runtime value kind retained for the provenance graph. `null`, Date, Map and
 * Set are scalar from the JSON-record walker's point of view: none exposes a
 * producer-owned record shape that a normal property reader may safely follow. */
function observedFieldKind(value) {
  if (Array.isArray(value)) return 'array';
  if (value && typeof value === 'object'
    && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof Date)) return 'object';
  return 'scalar';
}

/** Collect typed locations. A selected dynamic key is routed to the wildcard
 * value location while its spelling remains on the parent record. The ancestor
 * guard applies to arrays as well as objects, so cycles stop by identity rather
 * than by a silent depth cut. */
function collectPaths(path, value, observation, paths, dynamicPlans, ancestors, stats, depth = 0) {
  if (value == null) return;
  const kind = observedFieldKind(value);
  if (kind === 'scalar') return;
  if (depth > MAX_WALK_DEPTH) {
    throw new Error(`observed-shape corpus exceeded depth ${MAX_WALK_DEPTH} at ${path}; refusing a truncated graph`);
  }
  stats.maxDepth = Math.max(stats.maxDepth, depth);
  if (ancestors.has(value)) {
    stats.cycleCuts += 1;
    throw new Error(`observed-shape corpus encountered an ancestor cycle at ${path}; refusing a cycle-truncated provenance graph`);
  }
  ancestors.add(value);
  try {
    const node = pathNode(paths, path);
    if (kind === 'array') {
      node.arrayInstances += 1;
      node.arrayObservations.add(observation);
      const childPath = elementPathOf(path);
      for (const element of value) {
        const elementKind = observedFieldKind(element);
        node.elementKinds.add(elementKind);
        collectPaths(childPath, element, observation, paths, dynamicPlans, ancestors, stats, depth + 1);
      }
      return;
    }

    node.recordInstances += 1;
    node.recordObservations.add(observation);
    const entries = Object.entries(value);
    node.instanceKeySets.push(new Set(entries.map(([key]) => key)));
    const collapsed = dynamicPlans.get(path)?.collapsed || new Set();
    for (const [key, child] of entries) {
      const childKind = observedFieldKind(child);
      node.keys.set(key, (node.keys.get(key) || 0) + 1);
      node.fieldOccurrences.set(key, (node.fieldOccurrences.get(key) || 0) + 1);
      if (!node.fieldKinds.has(key)) node.fieldKinds.set(key, new Set());
      node.fieldKinds.get(key).add(childKind);
      if (childKind === 'object' && String(child.id ?? '') === key) {
        node.fieldIdMatches.set(key, (node.fieldIdMatches.get(key) || 0) + 1);
      }
      // Named-property provenance is never collapsed: `left` and `right` may
      // carry different shapes even when both also participate in a computed-id
      // facet. The wildcard is a second observation of the value, used only by
      // computed/Object.values traversal.
      collectPaths(
        fieldPathOf(path, key),
        child,
        observation,
        paths,
        dynamicPlans,
        ancestors,
        stats,
        depth + 1,
      );
      if (collapsed.has(key)) {
        collectPaths(
          dynamicPathOf(path),
          child,
          observation,
          paths,
          dynamicPlans,
          ancestors,
          stats,
          depth + 1,
        );
      }
    }
  } finally {
    ancestors.delete(value);
  }
}

/** Mean pairwise Jaccard over a list of key sets (1 when fewer than two sets). */
function meanJaccard(sets) {
  if (sets.length < 2) return 1;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < sets.length; i += 1) {
    for (let j = i + 1; j < sets.length; j += 1) {
      const a = sets[i];
      const b = sets[j];
      let inter = 0;
      for (const k of a) if (b.has(k)) inter += 1;
      const union = a.size + b.size - inter;
      total += union ? inter / union : 1;
      pairs += 1;
    }
  }
  return pairs ? total / pairs : 1;
}

/** Add computed-value optimization facets without deleting record identity. Exact child-id
 * matches are selected per key, so an impure `{id1: entity, summary: record}`
 * container never lends summary-only keys to entity values. With no such strong
 * subset proof, homogeneous object/array fields and churned traversable fields
 * are useful dynamic-map candidates. This facet is deliberately not a claim
 * that other named fields cannot be returned by unconstrained `record[k]` or
 * `Object.values(record)`; the reader must retain those alternatives too. */
function discoverDynamicPlans(paths, known) {
  const next = new Map([...known].map(([path, plan]) => [path, {
    collapsed: new Set(plan.collapsed),
    union: new Set(plan.union),
  }]));
  for (const [path, node] of paths) {
    if (!node.recordInstances || node.keys.size === 0) continue;
    if (!next.has(path)) next.set(path, { collapsed: new Set(), union: new Set() });
    const plan = next.get(path);
    const collapse = (keys) => {
      for (const key of keys) {
        plan.union.delete(key);
        plan.collapsed.add(key);
      }
    };
    const summarize = (keys) => {
      for (const key of keys) if (!plan.collapsed.has(key)) plan.union.add(key);
    };
    const exactIdKeys = [...node.keys.keys()].filter((key) => {
      const matches = node.fieldIdMatches.get(key) || 0;
      const occurrences = node.fieldOccurrences.get(key) || 0;
      return matches > 0 && matches === occurrences;
    });
    if (exactIdKeys.length) {
      collapse(exactIdKeys);
      continue;
    }

    const keys = [...node.keys.keys()];
    const allObject = keys.length >= 2 && keys.every((key) => (
      node.fieldKinds.get(key)?.size === 1 && node.fieldKinds.get(key).has('object')
    ));
    if (allObject) {
      const childNodes = keys.map((key) => paths.get(fieldPathOf(path, key))).filter(Boolean);
      if (childNodes.length === keys.length) {
        const similar = meanJaccard(childNodes.map((child) => new Set(child.keys.keys()))) >= 0.6;
        if (!similar) continue;
        // A small fixed record gets a non-destructive union of its exact child
        // origins. High-cardinality homogeneous keys are runtime data and are
        // summarized to one wildcard to keep ids out of schema paths.
        if (keys.length >= 8) collapse(keys);
        else summarize(keys);
        continue;
      }
    }

    const allArray = keys.length >= 2 && keys.every((key) => (
      node.fieldKinds.get(key)?.size === 1 && node.fieldKinds.get(key).has('array')
    ));
    if (allArray) {
      if (keys.length >= 8) collapse(keys);
      else summarize(keys);
      continue;
    }

    const sets = node.instanceKeySets;
    if (sets.length < 2) continue;
    const frequencies = new Map();
    for (const set of sets) for (const key of set) frequencies.set(key, (frequencies.get(key) || 0) + 1);
    const churned = keys.filter((key) => {
      const kinds = node.fieldKinds.get(key) || new Set();
      return (frequencies.get(key) || 0) / sets.length < 0.8
        && kinds.size === 1 && (kinds.has('object') || kinds.has('array'));
    });
    if (churned.length >= 2) collapse(churned);
  }
  for (const [path, plan] of [...next]) {
    if (!plan.collapsed.size && !plan.union.size) next.delete(path);
  }
  return next;
}

/** Resolve the human label of a typed path. Container markers deliberately do
 * not change it, so `factions/element` and `steadings/dynamic` retain the label
 * a report reader recognizes while their origin ids remain disjoint. */
export function shapeNameOf(path) {
  let name = '';
  for (const segment of path.split(PATH_SEPARATOR)) {
    if (segment.startsWith(ROOT_SEGMENT)) name = decodePathValue(segment.slice(ROOT_SEGMENT.length));
    else if (segment.startsWith(FIELD_SEGMENT)) name = decodePathValue(segment.slice(FIELD_SEGMENT.length));
  }
  return name;
}

function sameDynamicPlans(a, b) {
  if (a.size !== b.size) return false;
  for (const [path, plan] of a) {
    const other = b.get(path);
    if (!other) return false;
    for (const part of ['collapsed', 'union']) {
      if (plan[part].size !== other[part].size) return false;
      for (const key of plan[part]) if (!other[part].has(key)) return false;
    }
  }
  return true;
}

function parentPathOf(path) {
  const cut = path.lastIndexOf(PATH_SEPARATOR);
  return cut < 0 ? '' : path.slice(0, cut);
}

function descriptorEdges(descriptors) {
  let count = 0;
  for (const descriptor of descriptors) {
    if (descriptor.kind === 'record') count += descriptor.origins.length;
    else if (descriptor.kind === 'array') count += descriptor.arrays.length;
  }
  return count;
}

/**
 * Fold a set of walked roots into `{ shapeName -> { rows, keys[] } }`.
 *
 * The walk runs to a FIXED POINT because dynamic containers nest: the satellites
 * ledger is `satellites[parentId].steadings[satId]`. The first pass discovers a
 * computed-value facet for `satellites`; only the summarized second pass can see
 * all `steadings` values at one typed location and discover its facet in turn.
 * @param {Array<{ name: string, value: unknown }>} roots
 */
export function foldCorpus(roots) {
  let dynamicPlans = new Map();
  let paths = new Map();
  let walkStats = { maxDepth: 0, cycleCuts: 0 };
  // Monotone fixed point, with no silent iteration ceiling. A dynamic-value
  // summary can reveal another dynamic container underneath it; rebuild until
  // no location gains a selected key.
  for (;;) {
    paths = new Map();
    walkStats = { maxDepth: 0, cycleCuts: 0 };
    roots.forEach(({ name, value }, observation) => {
      collectPaths(rootPathOf(name), value, observation, paths, dynamicPlans, new WeakSet(), walkStats);
    });
    const next = discoverDynamicPlans(paths, dynamicPlans);
    if (sameDynamicPlans(next, dynamicPlans)) break;
    dynamicPlans = next;
  }
  // Monotone discovery retains pre-summary locations that no longer exist in
  // the final walk. Only live record locations are graph facets or telemetry.
  const liveDynamic = new Map([...dynamicPlans].filter(([path]) => paths.has(path)));
  /** @type {Map<string, { rows: number, keys: Set<string> }>} */
  const shapes = new Map();
  /** Names whose container was observed holding an ARRAY. The reader scan needs
   *  this: without it every `factions.map(...)` reads as a key no writer wrote. */
  const arrayShapes = new Set();
  /** Legacy compatibility metadata only. The schema-2 reader must never use a
   * leaf-name home as provenance; exact graph transitions replaced that prior. */
  /** @type {Map<string, Set<string>>} */
  const homes = new Map();
  for (const [path, node] of paths) {
    if (!node.recordInstances) continue;
    const plan = liveDynamic.get(path);
    if (plan?.collapsed.size === node.keys.size) continue; // compatibility view remains map-transparent
    const name = shapeNameOf(path);
    if (!name) continue;
    if (path.endsWith(`${PATH_SEPARATOR}${ARRAY_ELEMENT_SEGMENT}`)) arrayShapes.add(name);
    const parentPath = parentPathOf(path);
    const parent = parentPath ? shapeNameOf(parentPath) : '';
    if (parent && parent !== name) {
      if (!homes.has(name)) homes.set(name, new Set());
      homes.get(name).add(parent);
    }
    let e = shapes.get(name);
    if (!e) { e = { rows: 0, keys: new Set() }; shapes.set(name, e); }
    e.rows += node.recordInstances;
    for (const k of node.keys.keys()) e.keys.add(k);
  }
  /** @type {Record<string, { rows: number, keys: string[] }>} */
  const out = {};
  for (const [name, e] of [...shapes].sort((a, b) => a[0].localeCompare(b[0]))) {
    out[name] = { rows: e.rows, keys: [...e.keys].sort() };
  }
  const singleHome = [...homes].filter(([, v]) => v.size === 1).map(([k]) => k).sort();

  // Schema-v2 provenance graph. The legacy aggregate above remains as a
  // reporting/compatibility view for the executed-corpus assertions, but the
  // reader resolver must use these path-qualified origins. Two unrelated
  // records called `edges`, `members`, `plan`, or `raw` therefore never pool
  // their keys or lend one another child transitions.
  /** @type {Record<string, {
   *   id:string, path:string, label:string, rows:number, instances:number,
   *   keys:string[], requiredKeys:string[],
   *   fields:Record<string, Array<
   *     {kind:'scalar'} | {kind:'record', origins:string[]} | {kind:'array', arrays:string[]}
   *   >>,
   *   dynamicValues:Array<
   *     {kind:'record', origins:string[]} | {kind:'array', arrays:string[]}
   *   >,
   * }>} */
  const origins = {};
  /** @type {Record<string, {
   *   id:string, path:string, label:string, rows:number, instances:number,
   *   elements:Array<{kind:'scalar'} | {kind:'record', origins:string[]} | {kind:'array', arrays:string[]}>,
   * }>} */
  const arrays = {};
  let transitions = 0;

  const descriptorsAt = (path, kinds) => {
    const target = paths.get(path);
    const descriptors = [];
    if (kinds.has('scalar')) descriptors.push({ kind: 'scalar' });
    if (kinds.has('object') && target?.recordInstances) {
      descriptors.push({ kind: 'record', origins: [path] });
    }
    if (kinds.has('array') && target?.arrayInstances) {
      descriptors.push({ kind: 'array', arrays: [path] });
    }
    return descriptors;
  };

  const mergeDescriptors = (groups) => {
    const records = new Set();
    const arrayNodes = new Set();
    let scalar = false;
    for (const descriptors of groups) {
      for (const descriptor of descriptors) {
        if (descriptor.kind === 'scalar') scalar = true;
        else if (descriptor.kind === 'record') {
          for (const origin of descriptor.origins) records.add(origin);
        } else if (descriptor.kind === 'array') {
          for (const array of descriptor.arrays) arrayNodes.add(array);
        }
      }
    }
    const out = [];
    if (scalar) out.push({ kind: 'scalar' });
    if (records.size) out.push({ kind: 'record', origins: [...records].sort() });
    if (arrayNodes.size) out.push({ kind: 'array', arrays: [...arrayNodes].sort() });
    return out;
  };

  for (const [path, node] of [...paths].sort(([a], [b]) => a.localeCompare(b))) {
    if (node.recordInstances) {
      const fields = {};
      const plan = liveDynamic.get(path) || { collapsed: new Set(), union: new Set() };
      for (const key of [...node.keys.keys()].sort()) {
        const descriptors = descriptorsAt(
          fieldPathOf(path, key),
          node.fieldKinds.get(key) || new Set(),
        );
        if (descriptors.length) {
          fields[key] = descriptors;
          transitions += descriptorEdges(descriptors);
        }
      }
      const collapsedKinds = new Set();
      for (const key of plan.collapsed) {
        for (const kind of node.fieldKinds.get(key) || []) collapsedKinds.add(kind);
      }
      const dynamicGroups = [];
      if (plan.collapsed.size) dynamicGroups.push(descriptorsAt(dynamicPathOf(path), collapsedKinds));
      for (const key of plan.union) {
        dynamicGroups.push(descriptorsAt(fieldPathOf(path, key), node.fieldKinds.get(key) || new Set()));
      }
      const dynamicValues = mergeDescriptors(dynamicGroups);
      transitions += descriptorEdges(dynamicValues);
      origins[path] = {
        id: path,
        path,
        label: shapeNameOf(path),
        rows: node.recordObservations.size,
        instances: node.recordInstances,
        keys: [...node.keys.keys()].sort(),
        requiredKeys: [...node.fieldOccurrences]
          .filter(([, occurrences]) => occurrences === node.recordInstances)
          .map(([key]) => key)
          .sort(),
        fields,
        dynamicValues,
      };
    }
    if (node.arrayInstances) {
      const elements = descriptorsAt(elementPathOf(path), node.elementKinds);
      transitions += descriptorEdges(elements);
      arrays[path] = {
        id: path,
        path,
        label: shapeNameOf(path),
        rows: node.arrayObservations.size,
        instances: node.arrayInstances,
        elements,
      };
    }
  }

  /** @type {Record<string, Array<{kind:'record', origins:string[]} | {kind:'array', arrays:string[]}>>} */
  const graphRoots = {};
  for (const { name } of roots) {
    if (graphRoots[name]) continue;
    const rootPath = rootPathOf(name);
    const descriptors = [];
    if (origins[rootPath]) descriptors.push({ kind: 'record', origins: [rootPath] });
    if (arrays[rootPath]) descriptors.push({ kind: 'array', arrays: [rootPath] });
    if (descriptors.length) graphRoots[name] = descriptors;
  }

  return {
    shapes: out,
    arrayShapes: [...arrayShapes].sort(),
    singleHome,
    graph: {
      schema: 2,
      pathEncoding: 'typed-uri-v1',
      separator: PATH_SEPARATOR,
      origins,
      arrays,
      roots: graphRoots,
      meta: {
        origins: Object.keys(origins).length,
        arrays: Object.keys(arrays).length,
        nodes: Object.keys(origins).length + Object.keys(arrays).length,
        transitions,
        dynamicContainers: liveDynamic.size,
        maxDepth: walkStats.maxDepth,
        cycleCuts: walkStats.cycleCuts,
        depthTruncations: 0,
      },
    },
  };
}

// ── The executed producers ──────────────────────────────────────────────────

/**
 * Run all three producers and fold their output into the corpus.
 * @returns {Promise<{ shapes: Record<string, {rows:number, keys:string[]}>, meta: Record<string, unknown> }>}
 */
export async function buildObservedCorpus({
  intervals = PULSE_INTERVALS,
  quiet = true,
  scalarFields = [],
} = {}) {
  assertScalarFields(scalarFields);
  const { generateSettlementPipeline } = await import(`${ROOT}/src/generators/generateSettlementPipeline.js`);
  const { simulateCampaignWorldPulse } = await import(`${ROOT}/src/domain/worldPulse/index.js`);
  const { applyRealmVerbOrder } = await import(`${ROOT}/src/domain/worldPulse/realmVerbExecution.js`);
  const { ensureRegionalGraph } = await import(`${ROOT}/src/domain/region/index.js`);
  const { buildSpatialDigest } = await import(`${ROOT}/src/domain/spatial/index.js`);
  const { prepareAuthoritativeCanonEvent } = await import(`${ROOT}/src/domain/events/prepareCanonEvent.js`);
  const { appendChronicleEntry, createChronicleEntry } = await import(`${ROOT}/src/lib/chronicle.js`);
  const { makeGridPack, placeSettlements } = await import(`${ROOT}/tests/fixtures/spatialPackFixtures.js`);
  const { readFileSync, readdirSync, statSync } = require_('node:fs');

  const domainFiles = [];
  (function walkDir(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walkDir(p);
      else if (p.endsWith('.js')) domainFiles.push(p);
    }
  }(join(ROOT, 'src/domain')));
  const flags = discoverSimulationFlags(readFileSync, domainFiles);
  const simulationRules = Object.fromEntries(flags.map((f) => [f, true]));

  /** @type {Array<{name:string, value:unknown}>} */
  const roots = [];
  /** The five AO representative families. These references are also topology
   * roots where noted; keeping a second list selects scalar observation without
   * duplicating or re-authoring their values. */
  const scalarRoots = [];

  // ── Producer 1: the settlement generator, multi-seed × multi-config. ──
  /** @type {unknown[]} */
  const generated = [];
  for (const cfg of CONFIGS) {
    for (const seed of SEEDS) {
      const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
      generated.push(s);
      roots.push({ name: 'settlement', value: s });
    }
  }

  // ── Producer 2: the campaign world pulse over those REAL saves. ──
  const ids = generated.map((_, i) => `osr${String(i).padStart(3, '0')}`);
  const saves = generated.map((settlement, i) => ({
    id: ids[i], name: `Observed ${i}`, phase: 'canon', settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const pack = makeGridPack({ cols: 10, rows: 8 });
  const placed = placeSettlements(pack, ids.length);
  const spatialDigest = buildSpatialDigest({
    pack, placements: placed.map((p, i) => ({ id: ids[i], cellId: p.cellId })),
  });
  const edges = [];
  const channels = [];
  for (let i = 1; i < ids.length; i += 1) {
    const relationshipType = i % 3 === 0 ? 'rival' : 'trade_partner';
    edges.push({ id: `edge.${ids[0]}.${ids[i]}`, from: ids[0], to: ids[i], relationshipType });
    if (relationshipType === 'trade_partner') {
      channels.push({ from: ids[0], to: ids[i], type: 'trade_route', status: 'confirmed', strength: 0.6 });
    }
  }
  let campaign = {
    id: 'observed-shape-corpus', name: 'Observed Shape Corpus', settlementIds: [...ids],
    worldState: {
      rngSeed: 'observed-shape-corpus', tick: 1, simulationRules,
      calendar: { elapsedWeeks: 20, year: 1 },
      spatialCanonVersion: 1, spatialDigest,
      relationshipStates: { [`edge.${ids[0]}.${ids[1]}`]: { relationshipType: 'trade_partner', trust: 0.4, resentment: 0.2 } },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  let curSaves = saves;
  const wizardNewsUnique = new Set();
  for (let i = 0; i < intervals; i += 1) {
    const out = simulateCampaignWorldPulse({
      campaign, saves: curSaves, interval: 'one_month', commit: true, now: '2026-01-01T00:00:00.000Z',
    });
    if (out?.worldState) campaign = { ...campaign, worldState: out.worldState };
    if (out?.wizardNews) campaign = { ...campaign, wizardNews: out.wizardNews };
    for (const entry of out?.wizardNews?.entries || []) {
      if (entry?.id != null) wizardNewsUnique.add(String(entry.id));
    }
    if (Array.isArray(out?.saves) && out.saves.length) curSaves = out.saves;
    roots.push({ name: 'pulseResult', value: out });
    // F4 consumes the existing pulse result's regional event log. The bounded
    // view preserves the real relative path while excluding unrelated runtime
    // arms (including non-JSON implementation sentinels) from this second
    // consumer; no event row or prose value is copied or re-authored.
    scalarRoots.push({
      name: 'pulseResult',
      value: {
        regionalGraph: { eventLog: out?.regionalGraph?.eventLog || [] },
        wizardNews: { entries: out?.wizardNews?.entries || [] },
      },
    });
  }
  roots.push({ name: 'worldState', value: campaign.worldState });
  roots.push({ name: 'wizardNews', value: campaign.wizardNews });
  scalarRoots.push({
    name: 'worldState',
    value: { pulseHistory: campaign.worldState?.pulseHistory || [] },
  });
  scalarRoots.push({
    name: 'wizardNews',
    value: { entries: campaign.wizardNews?.entries || [] },
  });
  roots.push({ name: 'campaign', value: { ...campaign, worldState: undefined, wizardNews: undefined } });
  for (const s of curSaves) roots.push({ name: 'save', value: s });

  // ── AO family 1: one successful post-pulse authoritative canon event. ──
  const canonEventResult = prepareAuthoritativeCanonEvent({
    settlement: curSaves[0]?.settlement,
    systemState: null,
    phase: 'canon',
    eventLog: [],
    event: {
      id: 'osr.canon.cut-route',
      type: 'CUT_TRADE_ROUTE',
      targetId: 'Observed North Road',
      payload: {},
      cause: 'player_action',
    },
    now: '2026-01-01T00:00:00.000Z',
  });
  if (!canonEventResult?.ok) {
    throw new Error(`observed-shape corpus could not prepare its authoritative canon event: ${canonEventResult?.reason || 'unknown refusal'}`);
  }
  scalarRoots.push({
    name: 'canonEventResult',
    value: { nextEventLog: canonEventResult.nextEventLog },
  });

  // ── AO family 5: the pure Chronicle constructor + append projection. ──
  // id/createdAt are deliberately outside OBSERVED_SCALAR_FIELDS; they remain
  // real topology but never enter the deterministic prose stream.
  const aiChronicle = appendChronicleEntry([], createChronicleEntry({
    reason: 'progression',
    aiSettlement: { thesis: 'Observed settlement thesis' },
    aiDailyLife: { summary: 'Observed daily life summary' },
    triggeredBy: 'observed-shape-corpus',
    mode: 'full',
  }));
  scalarRoots.push({ name: 'aiChronicle', value: aiChronicle });

  // ── Producer 3: the steading mint, through the shipped realm verb. ──
  let steadingsMinted = 0;
  const settlementUpdates = new Map(curSaves.map((s) => [String(s.id), { id: s.id, settlement: s.settlement }]));
  const snapshot = { settlements: curSaves.map((s) => ({ id: s.id, settlement: s.settlement })), campaign };
  let verbState = campaign.worldState;
  for (const s of curSaves) {
    const res = applyRealmVerbOrder({
      state: verbState, snapshot, settlementUpdates,
      outcome: { id: `osr:${s.id}`, proposalPayload: { verb: 'FORCE_FOUND_STEADING', args: { parentId: String(s.id) } } },
      tick: 99, now: '2026-01-01T00:00:00.000Z',
    });
    if (res?.refusal) { if (!quiet) console.warn('steading refused', s.id, res.refusal); continue; }
    verbState = res.worldState;
    roots.push({ name: 'worldState', value: res.worldState });
    steadingsMinted += 1;
  }

  const { shapes, arrayShapes, singleHome, graph } = foldCorpus(roots);
  const wizardEntries = Array.isArray(campaign.wizardNews?.entries)
    ? campaign.wizardNews.entries : [];
  let wizardNewsAccumulatedEntries = 0;
  let regionalEventLog = 0;
  const regionalEventLogUnique = new Set();
  for (const { name, value } of scalarRoots) {
    if (name !== 'pulseResult') continue;
    wizardNewsAccumulatedEntries += Array.isArray(value?.wizardNews?.entries)
      ? value.wizardNews.entries.length : 0;
    const eventLog = Array.isArray(value?.regionalGraph?.eventLog)
      ? value.regionalGraph.eventLog : [];
    regionalEventLog += eventLog.length;
    for (const entry of eventLog) {
      if (entry?.id != null) regionalEventLogUnique.add(String(entry.id));
    }
  }
  const scalarObservations = scalarFields.length
    ? scalarObservationsOf(scalarRoots, { fields: scalarFields }) : null;
  const meta = {
    seeds: SEEDS.length,
    configs: CONFIGS.length,
    generations: generated.length,
    pulseIntervals: intervals,
    simulationFlagsLit: flags.length,
    steadingsMinted,
    shapeCount: Object.keys(shapes).length,
    originCount: graph.meta.origins,
    transitionCount: graph.meta.transitions,
  };
  return {
    shapes,
    arrayShapes,
    singleHome,
    graph,
    /** The names the walk STARTED from. Only these may bind a bare identifier
     *  the resolver could not follow; anything wider binds `window`, `raw` and
     *  `plan` to unrelated corpus shapes. */
    rootShapes: [...new Set(roots.map((r) => r.name))].sort(),
    meta,
    ...(scalarObservations ? { scalarMeta: {
      canonEventLogEntries: canonEventResult.nextEventLog.length,
      wizardNewsFinalEntries: wizardEntries.length,
      wizardNewsAccumulatedEntries,
      wizardNewsUnique: wizardNewsUnique.size,
      pulseHistory: Array.isArray(campaign.worldState?.pulseHistory)
        ? campaign.worldState.pulseHistory.length : 0,
      regionalEventLog,
      regionalEventLogUnique: regionalEventLogUnique.size,
      aiChronicle: aiChronicle.length,
    }, scalarObservations } : {}),
  };
}
