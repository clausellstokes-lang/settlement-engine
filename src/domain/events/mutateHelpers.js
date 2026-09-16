/**
 * domain/events/mutateHelpers.js — shared entity finders, replacers, and
 * id/label utilities used across the event-mutation handlers
 * (mutateEntities.js, mutateWorld.js) and the mutate.js router.
 *
 * Pure leaf: imports only the kernel slugify primitive and the import-free faction
 * reference contract, so both handler groups can depend on it without an import
 * cycle. Extracted from mutate.js as part of the god-module split; slugify delegates
 * to the shared kernel primitive (proven in tests/kernel/slugify.parity.test.js),
 * while faction targeting delegates to the shared id-first reference contract.
 */

import { slugify as kernelSlugify } from '../../kernel/slugify.js';
import {
  factionMatchesRef,
  factionRefOf,
  resolveFactionRef,
} from '../factionRefs.js';

// Schemaless open objects at this layer (see mutateEntities.js).
/** @typedef {any} MutSettlement */
/** @typedef {any} MutEntity */
/** @typedef {{ kind: 'none' } | { kind: 'ambiguous' } | { kind: 'found', faction: MutEntity }} FactionMatch */

const idOf        = (/** @type {MutEntity} */ i) => i?.id || i?.name || '';
const factionIdOf = (/** @type {MutEntity} */ f) => factionRefOf(f);
const eventTime = (/** @type {MutEntity} */ event) => event.timestamp || event.createdAt;

/**
 * @param {MutSettlement} s
 * @param {MutEntity} target
 */
function findInstitution(s, target) {
  const list = s.institutions || [];
  const t = String(target || '').toLowerCase();
  return list.find((/** @type {MutEntity} */ i) =>
    String(i.id || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

/**
 * @param {MutSettlement} s
 * @param {MutEntity} target
 */
function findFaction(s, target) {
  // Generated settlements carry their factions on powerStructure.factions (every
  // reader and replaceFaction's write target use it); s.factions is often an empty
  // legacy array. Resolve each authority tier separately so a mirrored legacy
  // copy cannot make the canonical roster look ambiguous.
  const rosters = [s.powerStructure?.factions || [], s.factions || []];
  for (const roster of rosters) {
    const exact = resolveFactionRef(roster, target);
    if (exact) return exact;
    // An exact alias that did not resolve is ambiguous. Fail closed instead of
    // letting the legacy case-insensitive fallback pick the first matching seat.
    if (roster.some((/** @type {MutEntity} */ f) => factionMatchesRef(f, target))) return null;

    // Finish this authority tier before consulting the next one. A stale exact
    // alias in settlement.factions must not override a unique case-folded match
    // in the canonical powerStructure roster.
    const legacy = resolveLegacyFactionTarget(roster, target);
    if (legacy.kind === 'found') return legacy.faction;
    if (legacy.kind === 'ambiguous') return null;
  }
  return undefined;
}

/**
 * Resolve the old case-insensitive / dotted-label event syntax without reviving
 * first-match behavior. IDs retain priority over names, and every fallback tier
 * must identify exactly one record or fail closed.
 *
 * @param {MutEntity[]} roster
 * @param {MutEntity} target
 * @returns {FactionMatch}
 */
function resolveLegacyFactionTarget(roster, target) {
  const t = String(target || '').toLowerCase();
  if (!t) return { kind: 'none' };

  const byId = uniqueFactionMatch(
    roster,
    (f) => String(f.id || '').toLowerCase() === t,
  );
  if (byId.kind !== 'none') return byId;

  const byName = uniqueFactionMatch(
    roster,
    (f) => String(f.faction || '').toLowerCase() === t
      || String(f.name || '').toLowerCase() === t,
  );
  if (byName.kind !== 'none') return byName;

  const label = labelFromTarget(target).toLowerCase();
  if (!label || label === t) return { kind: 'none' };
  return uniqueFactionMatch(
    roster,
    (f) => String(f.name || '').toLowerCase() === label,
  );
}

/**
 * @param {MutEntity[]} roster
 * @param {(faction: MutEntity) => boolean} predicate
 * @returns {FactionMatch}
 */
function uniqueFactionMatch(roster, predicate) {
  /** @type {MutEntity | null} */
  let found = null;
  for (const faction of roster) {
    if (!predicate(faction)) continue;
    if (found && found !== faction) return { kind: 'ambiguous' };
    found = faction;
  }
  return found ? { kind: 'found', faction: found } : { kind: 'none' };
}

/**
 * @param {MutSettlement} s
 * @param {MutEntity} target
 */
function findNpc(s, target) {
  const list = s.npcs || [];
  const t = String(target || '').toLowerCase();
  return list.find((/** @type {MutEntity} */ n) =>
    String(n.id || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

/**
 * @param {MutSettlement} s
 * @param {MutEntity} oldInst
 * @param {MutEntity} newInst
 */
function replaceInstitution(s, oldInst, newInst) {
  const list = s.institutions || [];
  const idx = list.findIndex((/** @type {MutEntity} */ i) => i === oldInst);
  if (idx === -1) return s;
  return { ...s, institutions: [...list.slice(0, idx), newInst, ...list.slice(idx + 1)] };
}

/**
 * @param {MutSettlement} s
 * @param {MutEntity} oldF
 * @param {MutEntity} newF
 */
function replaceFaction(s, oldF, newF) {
  // Factions can live in two places — settlement.factions or
  // settlement.powerStructure.factions. Normalize on the latter.
  if (s.powerStructure?.factions) {
    const list = s.powerStructure.factions;
    const idx = list.findIndex((/** @type {MutEntity} */ f) => f === oldF);
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
    const idx = s.factions.findIndex((/** @type {MutEntity} */ f) => f === oldF);
    if (idx >= 0) {
      return { ...s, factions: [...s.factions.slice(0, idx), newF, ...s.factions.slice(idx + 1)] };
    }
  }
  return s;
}

/**
 * @param {MutSettlement} s
 * @param {MutEntity} oldN
 * @param {MutEntity} newN
 */
function replaceNpc(s, oldN, newN) {
  const list = s.npcs || [];
  const idx = list.findIndex((/** @type {MutEntity} */ n) => n === oldN);
  if (idx === -1) return s;
  return { ...s, npcs: [...list.slice(0, idx), newN, ...list.slice(idx + 1)] };
}

/**
 * @param {MutEntity} targetId
 */
function labelFromTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return (/** @type {MutEntity} */ (tail)).replace(/_/g, ' ');
}

/**
 * @param {MutEntity} s
 */
function slugify(s) {
  return kernelSlugify(s, { sep: '_' });
}

// ── The handler-veto channel (Composer V2 §2 — closes the phantom-event hole) ──
// A mutation handler whose in-handler gate fails RETURNS a veto marker instead
// of the unchanged settlement. mutate.js unwraps it: the legacy mutateSettlement
// keeps the silent-no-op contract byte-for-byte, while mutateSettlementChecked
// (used by runEventPipeline) surfaces the refusal so deltas and narration never
// commit on a vetoed mutation. Every `vetoMutation('code', …)` call site in
// mutateEntities.js / mutateWorld.js is enumerated by the predicate-parity
// walker (tests/domain/events/predicateParity.walker.test.js): a code without a
// matching affordance-manifest predicate fails the build.
// @enforced-by tests/domain/events/predicateParity.walker.test.js

/**
 * @typedef {Object} MutationVeto
 * @property {true} __mutationVeto
 * @property {string} code    stable machine code (the walker's join key)
 * @property {string} detail  short interpolation datum (a target label) — the
 *   DM-facing PROSE lives in the LAZY manifest's vetoProse(code, detail), so
 *   the eager handlers never carry sentence strings (first-paint budget).
 */

/**
 * @param {string} code
 * @param {string} [detail]
 * @returns {MutationVeto}
 */
function vetoMutation(code, detail = '') {
  return Object.freeze({ __mutationVeto: /** @type {true} */ (true), code, detail });
}

/**
 * @param {MutEntity} x
 * @returns {MutationVeto|null}
 */
function mutationVetoOf(x) {
  return x && x.__mutationVeto === true ? x : null;
}

/**
 * Clamped numeric severity read (Composer V2 §3 — clampAtCommit). Handlers and
 * registry stateDeltas read dialed numeric fields through this instead of a bare
 * `Number(v ?? def)`: an out-of-band value (severity 5, −1) clamps into [0,1]
 * identically in preview and apply, retiring the silent forgiveness. In-band
 * values are byte-identical to the old read.
 * @param {MutEntity} v
 * @param {number} def
 * @returns {number}
 */
function sev01(v, def) {
  const n = Number(v ?? def);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : def;
}

export {
  idOf, factionIdOf, eventTime,
  findInstitution, findFaction, findNpc,
  replaceInstitution, replaceFaction, replaceNpc,
  labelFromTarget, slugify,
  vetoMutation, mutationVetoOf, sev01,
};
