/**
 * domain/events/targetRosters.js — THE SESSION LEDGER'S TARGET ROSTERS.
 *
 * Two surfaces let a human name an entity for an engine event: the COMPOSER
 * (events/affordanceManifest.js, the authoring desk) and the SESSION LEDGER
 * (domain/tableLedger.js, the table desk). Both must offer exactly the entities
 * the mutation handlers can actually resolve — an offered target the handler
 * vetoes is a lie the UI told. This leaf is the LEDGER's half.
 *
 * ── WHY THIS IS A MIRROR AND NOT A SINGLE SOURCE (measured, not assumed) ─────
 * The obvious design is one leaf both desks import, making parity identity
 * rather than a pinned invariant. That was BUILT AND REVERTED. The manifest and
 * the ledger live in two DIFFERENT lazy chunks, and Rollup hoists a module
 * shared by two lazy chunks into the ENTRY chunk — the recorded lazy-import
 * re-parenting hazard. Measured cost: +3,985 B of first paint, against a
 * closure budget with 1,512 B of headroom. So the composer keeps its copies,
 * this leaf serves the ledger alone (ONE static parent, so it stays in the
 * ledger's lazy chunk), and the two are held together by behavioral parity pins
 * in tests/domain/tableLedger.test.js that compare these rosters against the
 * manifest's own RESTORE_INSTITUTION / DEPLETE_RESOURCE / RECOVERED_RESOURCE
 * targetOptions. Drift reds there.
 *
 * DO NOT import this from affordanceManifest.js (that is the reverted design),
 * from the store, from the eager event pipeline, or from any eager module.
 *
 * PURE: no store, no React, no wall-clock. Every roster returns
 * Array<{id, name}> keyed the way findInstitution / resolveRosterKey resolve —
 * id-or-name, never an array index (an index-keyed ref is the ghost that vetoes
 * to target_not_found).
 *
 * @enforced-by tests/domain/tableLedger.test.js (roster pins + manifest parity)
 */

import { canonExports, canonImports, canonStressors } from '../canonicalAccessors.js';

/** @typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Mut */

/** Build {id, name} options from a dossier collection for the target picker.
 * @param {Mut} settlement
 * @param {string|null|undefined} collectionKey
 * @returns {Array<{id: string, name: string}>}
 */
export function buildTargetOptions(settlement, collectionKey) {
  if (!collectionKey || !settlement) return [];
  let list;
  switch (collectionKey) {
    case 'institutions': list = settlement.institutions || []; break;
    case 'npcs':         list = settlement.npcs || []; break;
    case 'factions':     list = settlement.powerStructure?.factions || []; break;
    case 'neighbours':   {
      const net = settlement.neighbourNetwork || settlement.neighbourLinks || [];
      list = net.map((/** @type {Mut} */ l) => ({ id: l.name || l.neighbourName || l.id, name: l.name || l.neighbourName || l.id }));
      break;
    }
    case 'resources':    {
      const fromConfig = (settlement.config?.nearbyResources || []).map((/** @type {Mut} */ k) => ({ id: k, name: k }));
      const fromList   = (settlement.resources || []).map((/** @type {Mut} */ r) => ({
        id: r.id || r.key || r.name,
        name: r.name || r.id || r.key,
      }));
      list = [...fromList, ...fromConfig];
      break;
    }
    case 'stressors':    {
      list = canonStressors(settlement).filter(Boolean).map((/** @type {Mut} */ st) => ({
        id: st.type || st.name || st.label,
        name: st.label || st.name || st.type,
      }));
      break;
    }
    case 'tradeGoods':   {
      const ec = settlement.economicState || {};
      const labels = [
        ...canonExports(settlement),
        ...canonImports(settlement),
        ...(Array.isArray(ec.transit) ? ec.transit : []),
      ]
        .map((/** @type {Mut} */ e) => (typeof e === 'string' ? e : e?.name || e?.good || ''))
        .filter(Boolean);
      list = labels.map((/** @type {Mut} */ l) => ({ id: l, name: l }));
      break;
    }
    default: return [];
  }
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = item.id || item.faction || item.name;
    const name = item.faction || item.name || item.id;
    if (!id || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id: String(id), name: String(name) });
  }
  return out;
}

/** The wounded-entity gate RESTORE_INSTITUTION's predicate runs.
 * @param {Mut} list
 */
export const impairedEntities = (/** @type {Mut} */ list) =>
  (list || []).filter((/** @type {Mut} */ e) =>
    (e?.impairments || []).length > 0 || e?.status === 'impaired' || e?.status === 'removed' || e?.status === 'destroyed');

/** The depleted-resource key set, unioned across BOTH storage formats the
 * handlers write (the nearbyResourcesDepleted array and the
 * nearbyResourcesState map) — a resource depleted in either is depleted.
 * @param {Mut} s
 * @returns {Set<string>}
 */
export const depletedKeys = (/** @type {Mut} */ s) => {
  const state = s?.config?.nearbyResourcesState || {};
  const dep = new Set((s?.config?.nearbyResourcesDepleted || []).map(String));
  for (const [k, v] of Object.entries(state)) if (v === 'depleted') dep.add(String(k));
  return dep;
};

// ── The four composed rosters (one per economy verb both desks offer) ────────

/** Every institution — IMPAIR_INSTITUTION can wound any of them.
 * @param {Mut} s @returns {Array<{id: string, name: string}>} */
export function institutionTargets(s) {
  return buildTargetOptions(s, 'institutions');
}

/** Only WOUNDED institutions — RESTORE_INSTITUTION has nothing else to mend.
 * @param {Mut} s @returns {Array<{id: string, name: string}>} */
export function impairedInstitutionTargets(s) {
  return buildTargetOptions(s, 'institutions').filter((o) =>
    impairedEntities(s?.institutions).some((/** @type {Mut} */ e) =>
      String(e.id || e.name) === o.id || String(e.name) === o.name));
}

/** Worked resources not already gone — what DEPLETE_RESOURCE can still take.
 * @param {Mut} s @returns {Array<{id: string, name: string}>} */
export function depletableResourceTargets(s) {
  const dep = depletedKeys(s);
  return buildTargetOptions(s, 'resources').filter((o) => !dep.has(o.id));
}

/** Only depleted resources — what RECOVERED_RESOURCE can bring back.
 * @param {Mut} s @returns {Array<{id: string, name: string}>} */
export function depletedResourceTargets(s) {
  const dep = depletedKeys(s);
  return buildTargetOptions(s, 'resources').filter((o) => dep.has(o.id));
}
