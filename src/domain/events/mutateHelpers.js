/**
 * domain/events/mutateHelpers.js — shared entity finders, replacers, and
 * id/label utilities used across the event-mutation handlers
 * (mutateEntities.js, mutateWorld.js) and the mutate.js router.
 *
 * Pure leaf: imports nothing, so both handler groups can depend on it without
 * an import cycle. Extracted verbatim from mutate.js as part of the
 * god-module split — every function body is byte-identical to its pre-split form.
 */

const idOf        = (/** @type {any} */ i) => i?.id || i?.name || '';
const factionIdOf = (/** @type {any} */ f) => f?.id || f?.faction || f?.name || '';
const eventTime = (/** @type {any} */ event) => event.timestamp || event.createdAt;

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {any} target
 */
function findInstitution(s, target) {
  const list = s.institutions || [];
  const t = String(target || '').toLowerCase();
  return list.find((/** @type {any} */ i) =>
    String(i.id || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {any} target
 */
function findFaction(s, target) {
  // Generated settlements carry their factions on powerStructure.factions (every
  // reader and replaceFaction's write target use it); s.factions is often an empty
  // legacy array. Search the union so faction-targeted events don't silently no-op.
  const list = [...(s.powerStructure?.factions || []), ...(s.factions || [])];
  const t = String(target || '').toLowerCase();
  return list.find((/** @type {any} */ f) =>
    String(f.id || '').toLowerCase() === t ||
    String(f.faction || '').toLowerCase() === t ||
    String(f.name || '').toLowerCase() === t ||
    String(f.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {any} target
 */
function findNpc(s, target) {
  const list = s.npcs || [];
  const t = String(target || '').toLowerCase();
  return list.find((/** @type {any} */ n) =>
    String(n.id || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {import('../settlement.schema.js').SimInstitution} oldInst
 * @param {import('../settlement.schema.js').SimInstitution} newInst
 */
function replaceInstitution(s, oldInst, newInst) {
  const list = s.institutions || [];
  const idx = list.findIndex((/** @type {any} */ i) => i === oldInst);
  if (idx === -1) return s;
  return { ...s, institutions: [...list.slice(0, idx), newInst, ...list.slice(idx + 1)] };
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {import('../settlement.schema.js').SimFaction} oldF
 * @param {import('../settlement.schema.js').SimFaction} newF
 */
function replaceFaction(s, oldF, newF) {
  // Factions can live in two places — settlement.factions or
  // settlement.powerStructure.factions. Normalize on the latter.
  if (s.powerStructure?.factions) {
    const list = s.powerStructure.factions;
    const idx = list.findIndex((/** @type {any} */ f) => f === oldF);
    if (idx >= 0) {
      return {
        ...s,
        powerStructure: {
          ...s.powerStructure,
          factions: [...list.slice(0, idx), newF, ...list.slice(idx + 1)],
        },
      };
    }
  }
  if (s.factions) {
    const idx = s.factions.findIndex((/** @type {any} */ f) => f === oldF);
    if (idx >= 0) {
      return { ...s, factions: [...s.factions.slice(0, idx), newF, ...s.factions.slice(idx + 1)] };
    }
  }
  return s;
}

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @param {import('../settlement.schema.js').SimNpc} oldN
 * @param {import('../settlement.schema.js').SimNpc} newN
 */
function replaceNpc(s, oldN, newN) {
  const list = s.npcs || [];
  const idx = list.findIndex((/** @type {any} */ n) => n === oldN);
  if (idx === -1) return s;
  return { ...s, npcs: [...list.slice(0, idx), newN, ...list.slice(idx + 1)] };
}

/**
 * @param {any} targetId
 */
function labelFromTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return (/** @type {any} */ (tail)).replace(/_/g, ' ');
}

/**
 * @param {any} s
 */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export {
  idOf, factionIdOf, eventTime,
  findInstitution, findFaction, findNpc,
  replaceInstitution, replaceFaction, replaceNpc,
  labelFromTarget, slugify,
};
