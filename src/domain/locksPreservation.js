/**
 * domain/locksPreservation.js — THE LOCKS ENGINE, Phase A.
 *
 * `state.locks` is the user's standing instruction "do not reroll this". For a
 * year it was a map the store wrote, persisted and rehydrated while nothing read
 * it: the registry advertised an effect the code lacked, and domain/types.js said
 * so verbatim. This module is the read side.
 *
 * ── Why this is a LEAF (imports deepClone and nothing else) ──────────────────
 *
 * The same reason regenerationPolicy.js states in its own header: the reroll tail
 * lives in the lazy engine chunk, and reaching these rules THROUGH a heavier
 * module lets the bundler see that module imported from both an eager surface and
 * the lazy chunk, which re-parents it into the first-paint closure. The lock
 * predicates are a frozen lookup over a sparse map; they must stay reachable on
 * their own. domain/clone.js is itself importless.
 *
 * ── THE DORMANCY CONTRACT (load-bearing, pinned) ────────────────────────────
 *
 * Every function here returns its INPUT UNCHANGED — the same reference — when the
 * lock map has nothing to say. That is the contract mergePreservedNpcs and
 * historyPreservation already keep, and it is what makes the byte-identity pin
 * true: a settlement with `locks: {}` regenerates exactly as one with no locks at
 * all, which is exactly as it did before this module existed. Locks can only ever
 * ADD survivors; they can never perturb a seeded draw, because every one of these
 * functions runs over a FINISHED roll.
 *
 * ── PHASE A vs PHASE B (what this honestly does) ────────────────────────────
 *
 * Phase A — section rerolls honour every lock (a locked section refuses to roll;
 * locked NPC ids survive an npcs reroll and the lock follows the id its subject
 * inherits). A FULL regenerate honours the identity, geography and history
 * booleans.
 *
 * Phase B (deliberately deferred, documented, not a bug to re-find) — the
 * npcs/factions/institutions ID ARRAYS on a FULL regenerate. A full generate
 * mints an entirely new roster, so carrying a keeper into it needs the
 * displacement / prose-repair / faction-relink tail that regenNPCsPipeline runs,
 * extracted to run over pipeline output. That is its own lane. Until it lands,
 * `locksAfterFullGenerate` DROPS the id arrays (they name a roster that no longer
 * exists) and keeps the booleans, and the registry description promises only what
 * is built.
 */

import { deepClone } from './clone.js';

/** The sections a whole-section lock can name. */
export const LOCKABLE_SECTIONS = Object.freeze(['npcs', 'history']);

/** The config keys that DETERMINE geography, carried verbatim by a geography lock.
 *
 *  Verbatim, not through resolveTerrain: the resolver collapses the chain to one
 *  answer and drops the 'auto' sentinel, but a geography lock must reproduce the
 *  GENERATION INPUT, and 'auto' is a real input the wizard writes. Carrying the
 *  raw keys is what makes "same seed + same locks ⇒ same world" hold. */
const GEOGRAPHY_CONFIG_KEYS = Object.freeze([
  'terrainType', 'terrainOverride', 'terrain', 'tradeRouteAccess',
]);

/** @param {unknown} value @returns {string[]} */
function idArray(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const v of value) {
    const s = String(v ?? '').trim();
    if (s) out.push(s);
  }
  return out;
}

/**
 * @typedef {Object} NormalizedLocks
 * @property {boolean} identity
 * @property {boolean} geography
 * @property {boolean} history      whole-section lock on the history reroll
 * @property {boolean} npcsSection  `npcs: true` — the whole roster is frozen
 * @property {string[]} npcs        specific NPC ids to carry through a roster reroll
 * @property {string[]} factions
 * @property {string[]} institutions
 */

/**
 * Read a sparse, user-written lock map into a total, tolerant shape.
 *
 * Tolerant on purpose: this map round-trips through saves written by every
 * version of the app, so an unknown key, a string where an array belongs, or a
 * boolean where ids belong must degrade to "not locked" rather than throw inside
 * a reroll. `npcs` accepts BOTH forms — `true` freezes the section, an array
 * names individuals.
 *
 * @param {Record<string, unknown>|null|undefined} locks
 * @returns {NormalizedLocks}
 */
export function normalizeLocks(locks) {
  const l = locks && typeof locks === 'object' ? locks : {};
  return {
    identity:     l.identity === true,
    geography:    l.geography === true,
    history:      l.history === true,
    npcsSection:  l.npcs === true,
    npcs:         idArray(l.npcs),
    factions:     idArray(l.factions),
    institutions: idArray(l.institutions),
  };
}

/**
 * The NPC ids a roster reroll must carry. Empty when nothing is locked, when the
 * whole section is locked (that reroll refuses instead), or when the map is absent.
 * @param {Record<string, unknown>|null|undefined} locks
 * @returns {Set<string>}
 */
export function lockedNpcIdSet(locks) {
  return new Set(normalizeLocks(locks).npcs);
}

/**
 * Does a whole-section lock forbid rerolling this section?
 * @param {Record<string, unknown>|null|undefined} locks
 * @param {string} section  'npcs' | 'history'
 * @returns {boolean}
 */
export function sectionLocked(locks, section) {
  const n = normalizeLocks(locks);
  if (section === 'npcs') return n.npcsSection;
  if (section === 'history') return n.history;
  return false;
}

/**
 * Carry the locked-identity and locked-history parts of the PREVIOUS settlement
 * over a freshly generated one.
 *
 * Post-hoc by construction: the roll is already finished, so this cannot perturb
 * it. Returns `fresh` UNCHANGED (same reference) when neither lock is set, which
 * is the dormant path every unlocked generation takes.
 *
 * `history` is carried whole. It is the section the user froze, and its parts
 * (historicalEvents, currentTensions, the coherence prose) are only consistent
 * with each other.
 *
 * @template {Record<string, any>} S
 * @param {Record<string, unknown>|null|undefined} locks
 * @param {S|null|undefined} prev   the settlement being replaced
 * @param {S} fresh                 the settlement just generated
 * @returns {S}
 */
export function carryLockedSections(locks, prev, fresh) {
  const n = normalizeLocks(locks);
  const wantsIdentity = n.identity && !!prev?.name;
  const wantsHistory = n.history && prev?.history != null;
  if (!fresh || (!wantsIdentity && !wantsHistory)) return fresh;
  const next = /** @type {S} */ ({ ...fresh });
  // Write through an unknown-record view: assigning onto a bare generic's
  // properties is a strict error, and the value types are the caller's own.
  const writable = /** @type {Record<string, unknown>} */ (next);
  if (wantsIdentity) writable.name = prev.name;
  if (wantsHistory) writable.history = deepClone(prev.history);
  return next;
}

/**
 * Overlay the geography-determining config keys of the PREVIOUS settlement onto
 * the config a full generation is about to run with.
 *
 * A geography lock is the one lock that is a generation INPUT rather than a
 * post-hoc carry: terrain and trade access are drawn early and everything
 * downstream (food balance, defense, the town map) is conditioned on them, so
 * "keep the geography" can only mean "roll the same ground again". Under THE
 * PROMISE this stays deterministic — same seed + same config + same locks is the
 * same world; a DIFFERENT config legitimately gives a different one.
 *
 * Returns `config` UNCHANGED (same reference) when geography is unlocked or the
 * previous settlement carries none of these keys.
 *
 * @template {Record<string, any>} C
 * @param {Record<string, unknown>|null|undefined} locks
 * @param {{ config?: Record<string, unknown>|null }|null|undefined} prev
 * @param {C} config
 * @returns {C}
 */
export function geographyLockedConfig(locks, prev, config) {
  if (!normalizeLocks(locks).geography || !config) return config;
  const prevConfig = prev?.config;
  if (!prevConfig || typeof prevConfig !== 'object') return config;
  /** @type {Record<string, unknown>} */
  const overlay = {};
  for (const key of GEOGRAPHY_CONFIG_KEYS) {
    if (prevConfig[key] !== undefined && prevConfig[key] !== config[key]) overlay[key] = prevConfig[key];
  }
  return Object.keys(overlay).length === 0 ? config : /** @type {C} */ ({ ...config, ...overlay });
}

/**
 * THE ID REMAP — the lifecycle step that keeps a lock alive through its own
 * subject's reroll.
 *
 * A preserved character does not join the fresh roster, it TAKES OVER a fresh
 * slot and inherits that slot's id (domain/regenerationPreservation.js explains
 * why ids are positional and why substitution is the only safe shape). So the
 * moment a locked `npc_3` survives, `npc_3` may name somebody else and the lock
 * is pointing at a stranger. Rewriting each locked id to the id its subject
 * actually landed on is what stops the lock ghosting on the SECOND reroll.
 *
 * Tolerant by design: an id the report does not mention is left alone. That is
 * the documented cure for undo, which restores an older settlement blob whose
 * roster ids need not match the live lock map — an unknown id is a silent no-op
 * in every predicate here rather than an error, and versioning the lock map
 * against the event log is explicitly NOT attempted.
 *
 * Returns `locks` UNCHANGED (same reference) when no locked id moved.
 *
 * @template {Record<string, any>} L
 * @param {L} locks
 * @param {Array<{id?: string, fromId?: string}>|null|undefined} preservedEntries
 * @returns {L}
 */
export function remapNpcLocks(locks, preservedEntries) {
  const locked = normalizeLocks(locks).npcs;
  if (locked.length === 0 || !Array.isArray(preservedEntries) || preservedEntries.length === 0) return locks;
  /** @type {Map<string, string>} */
  const moved = new Map();
  for (const entry of preservedEntries) {
    const from = String(entry?.fromId ?? '').trim();
    const to = String(entry?.id ?? '').trim();
    if (from && to && from !== to) moved.set(from, to);
  }
  if (moved.size === 0) return locks;
  const next = locked.map(id => moved.get(id) || id);
  // Substitution can map two locked ids onto one slot only if the same character
  // was locked twice; dedupe so the map cannot grow a phantom.
  const deduped = [...new Set(next)];
  if (deduped.length === locked.length && deduped.every((id, i) => id === locked[i])) return locks;
  return /** @type {L} */ ({ ...locks, npcs: deduped });
}

/**
 * The lock map that survives a FULL regenerate.
 *
 * The booleans are statements about the settlement (its identity, its ground, its
 * past) and remain meaningful across a fresh roll. The id arrays name members of a
 * roster that no longer exists, and Phase A does not carry rosters through a full
 * generate — keeping them would leave the map advertising a protection nothing
 * performs, which is the exact defect this lane closes. They are dropped.
 *
 * Returns `locks` UNCHANGED (same reference) when it holds no id arrays.
 *
 * @template {Record<string, any>} L
 * @param {L} locks
 * @returns {L}
 */
export function locksAfterFullGenerate(locks) {
  const l = /** @type {Record<string, unknown>} */ (locks && typeof locks === 'object' ? locks : {});
  const doomed = ['npcs', 'factions', 'institutions'].filter(k => Array.isArray(l[k]));
  if (doomed.length === 0) return locks;
  const next = { ...l };
  for (const k of doomed) delete next[k];
  return /** @type {L} */ (next);
}
