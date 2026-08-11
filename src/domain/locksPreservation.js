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
 * ── WHAT THIS HONESTLY DOES (Phase A + Phase B, both built) ─────────────────
 *
 * Section rerolls honour every lock: a locked section refuses to roll, locked NPC
 * ids survive an npcs reroll, and the lock follows the id its subject inherits.
 *
 * A FULL regenerate honours the identity, geography and history booleans, AND —
 * Phase B — carries the locked characters bodily into the new town. The tail that
 * does it lives in generators/generateSettlementPipeline.js
 * (`carryLockedRosterThroughGenerate`) because it needs the displacement /
 * prose-repair / projection-refresh / faction-relink machinery the section reroll
 * already runs; this leaf owns only what happens to the MAP afterwards.
 *
 * The three id arrays split by how they identify their subject, and the split is
 * the whole design:
 *
 *   • `npcs` is POSITIONAL-ID-keyed. A full roll re-issues npc_1..npc_N to
 *     strangers, so a locked id is meaningless unless the carry tells us which
 *     fresh slot its subject landed on. Remapped by the preservation report;
 *     an id the report does not mention is DROPPED.
 *   • `factions` is NAME-keyed — power factions carry no id at all, and the one
 *     consumer that exists (worldPulse/coup.js `lockedGoverningFaction`) matches
 *     on the stable part of the NAME, tolerating a `faction.` prefix. A name
 *     cannot misbind across a roll: it either names a same-named entity in the
 *     new town or it names nothing. So it is KEPT VERBATIM as standing intent.
 *     Dropping it, which is what this function used to do, silently disarmed the
 *     coup shield on every full regenerate.
 *
 * ⛔ THERE IS NO INSTITUTIONS LOCK, AND ITS ABSENCE IS THE FINDING. This module
 * used to normalize a third name-keyed array beside `factions`. It was dead on
 * EVERY end simultaneously: no UI ever offered it (setLock is only ever called
 * with identity/geography/npcs/history), so no writer could exist; and nothing
 * anywhere consumed the normalized field, so no reader existed either — the
 * clause above once claimed two name-keyed arrays while naming, correctly, only
 * ONE consumer. Deleted 2026-08-11 by owner ruling. ⚠ The RAW key, if some old
 * save still carries one, is untouched and still rides through persistence and
 * `locksAfterFullGenerate`'s spread: this map is key-agnostic at every boundary
 * by design, and PRUNING a persisted key would be a migration, which is
 * owner-gated and deliberately not done here.
 *
 * ── THE STALE-ID DROP, and why it diverges from remapNpcLocks ───────────────
 *
 * `remapNpcLocks` (the section-reroll path) leaves an unrecognised id ALONE: undo
 * can restore an older settlement blob whose roster ids match the map again, so
 * an unknown id there is a dormant no-op rather than an error. Across a FULL roll
 * that cure cannot apply — every old id has been reissued to a stranger, so a
 * locked id the carry did not preserve is not dormant, it is actively pointing at
 * somebody the user never locked. It is dropped. (Consequence, accepted: revert
 * to an older snapshot does not restore locks — revertToSnapshot carries the
 * settlement blob, not the map — so a full generate after such a revert prunes
 * ids that the restored roster may in fact hold.)
 *
 * ── STILL DEFERRED (documented, not bugs to re-find) ────────────────────────
 *
 *  1. `npcs: true`, the WHOLE-SECTION boolean, is kept but not enforced on a full
 *     generate. Carrying an entire roster through a full roll would nullify the
 *     roll; making it mean that is an owner call, not this lane's.
 *  2. Faction OBJECT carry — substituting the locked faction itself into the
 *     fresh town — is a new capability, owner-gated. The array survives as
 *     intent; the object does not.
 *  3. Canon and authored NPCs that are not locked still do not survive a full
 *     generate. That is the pre-Phase-B baseline, held deliberately: the carry
 *     runs under `lockedIdsOnly`, so it performs the lock map and nothing else.
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
 * @property {string[]} factions    NAME-keyed; the coup shield's standing intent
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
 * The lock map that survives a FULL regenerate (locks engine Phase B).
 *
 * The booleans are statements about the settlement — its identity, its ground,
 * its past — and remain meaningful across a fresh roll, so they are untouched.
 * The name-keyed `factions` array is a statement about names and is kept
 * verbatim. Only `npcs` needs work, because only `npcs` is keyed on ids a
 * full roll has just reissued: each locked id becomes the id its subject INHERITED
 * in the new town, and a locked id the carry did not preserve is dropped. The
 * header explains why that drop diverges from remapNpcLocks' leave-it-alone rule.
 *
 * Feed it the `preserved` half of the report `carryLockedRosterThroughGenerate`
 * returns. Called with no report at all — which is what happens when the carry sat
 * dormant — every locked id is stale by definition and the key goes away.
 *
 * Returns `locks` UNCHANGED (same reference) when there is no `npcs` ARRAY to
 * rewrite, or when rewriting it would reproduce the array already there.
 *
 * @template {Record<string, any>} L
 * @param {L} locks
 * @param {Array<{id?: string, fromId?: string}>|null|undefined} preservedEntries
 * @returns {L}
 */
export function locksAfterFullGenerate(locks, preservedEntries) {
  const l = /** @type {Record<string, unknown>} */ (locks && typeof locks === 'object' ? locks : {});
  const raw = l.npcs;
  // `npcs: true` is the whole-section boolean, not an id list — nothing to remap.
  if (!Array.isArray(raw)) return locks;

  /** @type {Map<string, string>} */
  const inherited = new Map();
  if (Array.isArray(preservedEntries)) {
    for (const entry of preservedEntries) {
      const from = String(entry?.fromId ?? '').trim();
      const to = String(entry?.id ?? '').trim();
      if (from && to) inherited.set(from, to);
    }
  }

  // Substitution can land two locked ids on one slot only if the same character
  // was locked twice; dedupe so the map cannot grow a phantom.
  const next = [...new Set(
    idArray(raw).map(id => inherited.get(id)).filter(id => typeof id === 'string' && id !== ''),
  )];
  if (next.length === raw.length && next.every((id, i) => id === raw[i])) return locks;
  const rewritten = { ...l };
  if (next.length === 0) delete rewritten.npcs;
  else rewritten.npcs = next;
  return /** @type {L} */ (rewritten);
}
