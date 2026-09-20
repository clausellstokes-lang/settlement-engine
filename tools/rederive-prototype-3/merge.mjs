/**
 * merge.mjs — §22.1's THREE-WAY MERGE, built. `merge(record, R0, R1)`.
 *
 *   held facts   → taken from the EDITED record untouched (heldFrom:'edited', the §22.1 literal)
 *                  or from R1 (heldFrom:'R1', the arm that lets a MIRROR writer through)
 *   readings     → leaf by leaf with R0 as base: leaf identical in R0 and R1 keeps the RECORD's
 *                  own value (absent counts as a value); a leaf that differs takes R1's
 *   collections  → merged BY KEY when the collection carries one (registry below); order from R1
 *   receipts     → recomputed LAST over the merged record
 *
 * No tree edit anywhere; imports only.
 */
import { clone } from './lib.mjs';
import { TREE } from './instrument.mjs';

const { fingerprintPowerEconomyInput } = await import(`${TREE}/src/generators/power/economyReconciliation.js`);

/** §22 ruling 1's held set (the world facts arrive as `config′`, not as a merge input). */
export const HELD_KEYS = ['institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure', 'name'];
/** The record's copies of the INPUT. Never merged: the edited config is the input to both runs. */
export const WORLD_KEYS = ['config', '_config', '_seed'];
/** Receipts: a digest of OTHER fields of the same record. Recomputed last. */
export const RECEIPT_PATHS = ['powerStructure.economyInputFingerprint'];

/**
 * Collections that carry a stable key. Path is COLLAPSED (`foo[].bar`), `*` matches one segment.
 * A spec is a field name, an array of fields (composite), or a function.
 */
export const KEY_REGISTRY = {
  'institutions': 'name',
  'npcs': 'id',
  'factions': 'name',
  'factions[].members': 'id',
  'powerStructure.factions': 'faction',
  'powerStructure.factionRelationships': 'pair',
  'powerStructure.conflicts': ['parties', 'issue'],
  'conflicts': ['parties', 'issue'],
  'relationships': ['npc1Id', 'npc2Id', 'type'],
  'availableServices.*': 'name',
  'defenseProfile.institutions.*': 'name',
  'economicState.activeChains': 'label',
  'economicState.institutionalServices': 'label',
  'economicState.incomeSources': 'source',
  'economicState.tradeDependencies': ['institution', 'resource'],
  'economicState.safetyProfile.crimeTypes': 'type',
  'economicViability.dependencies': 'title',
  'economicViability.warnings': 'title',
  'economicViability.plotHooks': 'category',
  'history.eventsTimeline': 'name',
  'history.historicalEvents': 'name',
  'history.currentTensions': 'type',
  'history.legacyAnnotations': ['eventName', 'yearsAgo'],
  'resourceAnalysis.resourceConditions': 'key',
  'resourceAnalysis.resourceChains': 'chainKey',
  'resourceAnalysis.exploitation.*': 'chainKey',
  'resourceAnalysis.gaps': 'chain',
  'resourceAnalysis.exports': 'chain',
  'generationCoherenceReceipt.checks': 'id',
  'generationCoherenceReceipt.judgments': 'id',
  'generationCoherenceReceipt.repairs': ['type', 'subject', 'action'],
  'activeConditions': 'archetype',
  'spatialLayout.quarters': 'name',
};

export const collapse = (p) => p.replace(/\[\d+\]/g, '[]');

export function specFor(path) {
  const c = collapse(path);
  if (KEY_REGISTRY[c] !== undefined) return KEY_REGISTRY[c];
  const parts = c.split('.');
  for (let i = 0; i < parts.length; i += 1) {
    const probe = parts.map((p, j) => (j === i ? '*' : p)).join('.');
    if (KEY_REGISTRY[probe] !== undefined) return KEY_REGISTRY[probe];
  }
  return null;
}

export function keyOfEntry(entry, spec) {
  if (entry === null || typeof entry !== 'object') return null;
  const fields = Array.isArray(spec) ? spec : [spec];
  const vals = fields.map(f => entry[f]);
  if (vals.some(v => v === undefined || v === null)) return null;
  return JSON.stringify(vals);
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const eqLeaf = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const allObjects = (a) => Array.isArray(a) && a.length > 0 && a.every(x => isObj(x));

/**
 * @param {object} stats  collects the merge's own receipts:
 *   takenR1: [path]           leaves that took R1's value
 *   ridealong: [path]         ... of those, leaves where the RECORD already differed from R0
 *   keptRecord: count         leaves identical in R0/R1 (the record's own value kept)
 *   settled: [path]           leaves where R0===R1 but the RECORD differs (the settling shift, CANCELLED)
 *   unkeyed: Map(path->n)     object collections merged POSITIONALLY for want of a key
 *   keyed:   Map(path->key)
 */
function mergeNode(rec, r0, r1, path, stats) {
  // ── ⭐ the SUBTREE short-circuit: "a reading IDENTICAL in R0 and R1 keeps the record's own
  //    value" applied at every node, not only at leaves. Without it the merge is not the
  //    identity with no edit (Q2 arm A: 9/63) — it pads the record's shorter collections with
  //    empty objects and re-orders its keyed collections into R1's order.
  if (stats.subtree && eqLeaf(r0, r1)) {
    stats.keptNodes += 1;
    if (!eqLeaf(rec, r0)) stats.settled.push(path);
    return clone(rec);
  }
  // ── array handling
  if (Array.isArray(r0) && Array.isArray(r1)) {
    const spec = allObjects(r0) || allObjects(r1) ? specFor(path) : null;
    if (spec) {
      const k0 = new Map(); const k1 = new Map(); const kr = new Map();
      let ok = true;
      for (const [arr, m] of [[r0, k0], [r1, k1], [Array.isArray(rec) ? rec : [], kr]]) {
        for (const e of arr) {
          const k = keyOfEntry(e, spec);
          if (k === null || m.has(k)) { ok = false; break; }
          m.set(k, e);
        }
        if (!ok) break;
      }
      if (ok) {
        stats.keyed.set(collapse(path), Array.isArray(spec) ? spec.join('+') : spec);
        const addedByEdit = [...k1.keys()].filter(k => !k0.has(k));
        const removedByEdit = new Set([...k0.keys()].filter(k => !k1.has(k)));
        const keep = [...kr.keys()].filter(k => !removedByEdit.has(k));
        const out = [];
        const done = new Set();
        // order from R1
        for (const k of k1.keys()) {
          if (removedByEdit.has(k)) continue;
          if (kr.has(k)) { out.push(mergeNode(kr.get(k), k0.get(k), k1.get(k), `${path}[]`, stats)); done.add(k); }
          else if (!k0.has(k)) { out.push(clone(k1.get(k))); stats.takenR1.push(`${path}[+${k}]`); done.add(k); }
          else { /* in R0 and R1 but NOT the record: a settling ADDITION — cancelled */ stats.settled.push(`${path}[~add ${k}]`); done.add(k); }
        }
        // record entries neither derivation produced (a settling REMOVAL — cancelled): kept, in record order
        for (const k of keep) {
          if (done.has(k)) continue;
          out.push(clone(kr.get(k)));
          stats.settled.push(`${path}[~del ${k}]`);
          stats.orderUndefined.push(`${path}[${k}]`);
        }
        for (const k of removedByEdit) if (kr.has(k)) stats.takenR1.push(`${path}[-${k}]`);
        // ORDER: taken from R1. Did that MOVE an entry the record already had?
        const recOrder = [...kr.keys()].filter(k => !removedByEdit.has(k));
        const outOrder = out.map(e => keyOfEntry(e, spec));
        const recKept = recOrder.filter(k => outOrder.includes(k));
        const outKept = outOrder.filter(k => k !== null && recOrder.includes(k));
        if (JSON.stringify(recKept) !== JSON.stringify(outKept)) stats.reorder.push(collapse(path));
        return out;
      }
    }
    if (allObjects(r0) || allObjects(r1)) stats.unkeyed.set(collapse(path), (stats.unkeyed.get(collapse(path)) || 0) + 1);
    // arrays of scalars (or unkeyable object arrays): positional leaf merge
    const n = Math.max(r0.length, r1.length, Array.isArray(rec) ? rec.length : 0);
    const out = [];
    for (let i = 0; i < n; i += 1) {
      const v = mergeNode(Array.isArray(rec) ? rec[i] : undefined, r0[i], r1[i], `${path}[${i}]`, stats);
      out.push(v);
    }
    while (out.length && out[out.length - 1] === undefined) out.pop();
    return out;
  }
  // ── object handling
  if (isObj(r0) && isObj(r1)) {
    const out = {};
    const keys = new Set([...Object.keys(r0), ...Object.keys(r1), ...(isObj(rec) ? Object.keys(rec) : [])]);
    for (const k of keys) {
      const v = mergeNode(isObj(rec) ? rec[k] : undefined, r0[k], r1[k], path ? `${path}.${k}` : k, stats);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  // ── leaf (or a shape change between R0 and R1)
  if (eqLeaf(r0, r1)) {
    stats.keptRecord += 1;
    if (!eqLeaf(rec, r0)) stats.settled.push(path);
    return clone(rec);
  }
  stats.takenR1.push(path);
  if (!eqLeaf(rec, r0)) stats.ridealong.push({ path, rec: rec, r0, r1 });
  return clone(r1);
}

export function newStats(subtree = true) {
  return { subtree, takenR1: [], ridealong: [], keptRecord: 0, keptNodes: 0, settled: [],
    unkeyed: new Map(), keyed: new Map(), orderUndefined: [], reorder: [] };
}

/**
 * @param {object} record   the record the DM saved (with the EDIT applied to its held facts)
 * @param {object} R0       rederive(record)
 * @param {object} R1       rederive(record + edit)
 * @param {object} [opts]   heldFrom: 'edited' | 'R1' | 'merge';
 *                          receipts: true | false;
 *                          receiptPaths: RECEIPT_PATHS
 */
export function merge(record, R0, R1, opts = {}) {
  const { heldFrom = 'edited', receipts = true } = opts;
  const rec = clone(record); const r0 = clone(R0); const r1 = clone(R1);
  const stats = newStats(opts.subtree !== false);
  const out = {};
  const keys = new Set([...Object.keys(rec), ...Object.keys(r0), ...Object.keys(r1)]);
  for (const k of keys) {
    if (WORLD_KEYS.includes(k)) { out[k] = clone(r1[k] !== undefined ? r1[k] : rec[k]); continue; }
    if (HELD_KEYS.includes(k) && heldFrom !== 'merge') {
      out[k] = clone(heldFrom === 'R1' ? r1[k] : rec[k]);
      continue;
    }
    const v = mergeNode(rec[k], r0[k], r1[k], k, stats);
    if (v !== undefined) out[k] = v;
  }
  // ── receipts LAST, over the merged record
  if (receipts) {
    if (out.powerStructure && out.economicState) {
      const before = out.powerStructure.economyInputFingerprint;
      const after = fingerprintPowerEconomyInput(out.economicState, out.tier ?? out.economicState?.tier);
      out.powerStructure.economyInputFingerprint = after;
      stats.receipt = { before, after, moved: before !== after };
    }
  }
  return { out, stats };
}
