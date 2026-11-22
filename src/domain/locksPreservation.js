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
 * ── WHAT THIS DOES TODAY: NOTHING IS HONOURED (owner orders 2026-09-17) ─────
 *
 * EVERY LOCK KIND IS RETIRED. The owner first ordered the "What a new roll keeps"
 * section removed with every button that served it ("Keep the name", "Keep this
 * ground", "Keep them in power", "Clear all locks"), and then, the same day, "remove
 * the other padlocks": the NPCs tab's "Keep these people", the History tab's "Keep
 * this history" and the per-character padlock on the roster rows ("Lock this person
 * so they stay through any new roll"). With no control left to see, set or clear a
 * lock, a stored lock must not keep acting, so `normalizeLocks` below, the one read
 * every predicate here flows through, reads NOTHING: `sectionLocked` never refuses,
 * `lockedNpcIdSet` is always empty, `carryLockedSections` never carries history, and
 * the full-generate roster carry (`carryLockedRosterThroughGenerate` in
 * generators/generateSettlementPipeline.js) sits at its dormancy gate. The world
 * keys (`identity`, `geography`, the name-keyed seat array) went first; `npcs` and
 * `history` followed.
 *
 * ⚠ STORED DATA IS NOT PRUNED. A save's `campaignState.locks` still round-trips
 * through hydrate, pickle and persist byte for byte, because pruning a persisted key
 * is a migration (owner-gated) and because a veto of the orders restores the
 * controls with a user's old locks intact. The id ALGEBRA below (`remapNpcLocks`,
 * `locksAfterFullGenerate`) is kept too and reads the RAW map, not the honoured
 * view: `remapNpcLocks` is also the pin remap's algebra (store
 * `remapPinnedNpcsAfterRegen` wraps `aiData.pinnedNpcs` as `{ npcs }`), and a stored
 * id that follows an authored keeper to its new slot is what keeps that data true
 * for the veto. After a FULL generate the new draft's inherited `npcs` ids are
 * dropped by the existing stale-id rule (nothing was carried, so every id names a
 * stranger); the saved row the draft came from is never written by a generate.
 *
 * WHAT THE ENGINE KEPT, dormant (Phase A + Phase B were built and are unreached):
 * the section refusal, the id survival through a roster reroll, the history carry
 * and the full-generate roster carry. They stay in code so a veto is a revert of the
 * read, not a rebuild.
 *
 * `npcs` is POSITIONAL-ID-keyed. A full roll re-issues npc_1..npc_N to strangers,
 * so a stored id is meaningless unless a carry tells us which fresh slot its
 * subject landed on. Remapped by the preservation report; an id the report does
 * not mention is DROPPED.
 *
 * ⛔ THERE IS NO INSTITUTIONS LOCK, AND ITS ABSENCE IS THE FINDING. (Written
 * 2026-08-11, when the seat lock was still read; since 2026-09-17 no key is read and
 * the store's `setLock` writer is retired with its last control.) This module
 * used to normalize a third name-keyed array beside `factions`. It was dead on
 * EVERY end simultaneously: no UI ever offered it (setLock is called with exactly
 * FIVE keys — identity, geography, factions, npcs, history — and NEVER with
 * institutions. ⚠ Corrected 2026-08-11 per chair ruling H28/H29: this clause
 * enumerated only the first four, which was true when written and became false
 * when the `factions` writer landed at 73f00920. The argument is unaffected —
 * institutions is absent from the list either way), so no writer could exist; and nothing
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
 * @property {boolean} history      whole-section lock on the history reroll
 * @property {boolean} npcsSection  `npcs: true` — the whole roster is frozen
 * @property {string[]} npcs        specific NPC ids to carry through a roster reroll
 */

/**
 * The HONOURED view of a stored lock map: what generation, rerolls and the
 * simulation may act on.
 *
 * ⛔ THE CHOKEPOINT, AND IT READS NOTHING (owner orders 2026-09-17). Every lock kind
 * is retired: the world keys with the "What a new roll keeps" section, and `npcs`
 * (the whole-roster boolean and the per-character id list) and `history` with the
 * last padlocks. A save may still carry any of them; none is read here, so no
 * predicate, carry or refusal can act on one. The map is accepted and ignored rather
 * than dropped from the signature so every caller keeps its one read seat, and a
 * veto restores the reads in this one function. See the header.
 *
 * (Before the orders this was the tolerant reader: `history === true`, `npcs === true`
 * for the whole roster, and `npcs` as an array naming individuals.)
 *
 * @param {Record<string, unknown>|null|undefined} _locks  the stored map, deliberately unread
 * @returns {NormalizedLocks}
 */
export function normalizeLocks(_locks) {
  return {
    history:      false,
    npcsSection:  false,
    npcs:         [],
  };
}

/**
 * The NPC ids a roster reroll must carry. ALWAYS EMPTY since owner orders
 * 2026-09-17 retired the per-character padlock (it reads the honoured view).
 * @param {Record<string, unknown>|null|undefined} locks
 * @returns {Set<string>}
 */
export function lockedNpcIdSet(locks) {
  return new Set(normalizeLocks(locks).npcs);
}

/**
 * Does a whole-section lock forbid rerolling this section? ALWAYS NO since owner
 * orders 2026-09-17 retired "Keep these people" and "Keep this history".
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
 * Carry the locked-history part of the PREVIOUS settlement over a freshly
 * generated one. (It carried a locked NAME too until owner order 2026-09-17
 * retired the world locks; a stored `identity: true` no longer renames anything.
 * Since the same day's "remove the other padlocks" a stored `history: true` carries
 * nothing either: the honoured view reads no lock, so this is always dormant.)
 *
 * Post-hoc by construction: the roll is already finished, so this cannot perturb
 * it. Returns `fresh` UNCHANGED (same reference) when the lock is not set, which
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
  const wantsHistory = normalizeLocks(locks).history && prev?.history != null;
  if (!fresh || !wantsHistory) return fresh;
  const next = /** @type {S} */ ({ ...fresh });
  // Write through an unknown-record view: assigning onto a bare generic's
  // properties is a strict error, and the value types are the caller's own.
  const writable = /** @type {Record<string, unknown>} */ (next);
  writable.history = deepClone(prev.history);
  return next;
}

/**
 * ⛔ `geographyLockedConfig` IS RETIRED (owner order 2026-09-17). It overlaid the
 * previous settlement's terrain and trade-access config keys onto a full generation
 * when `geography: true` was stored. That key was written only by the removed "Keep
 * this ground" button, so a full generate now rolls from its own config alone.
 */

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
  // The RAW id list, not the honoured view: this is data maintenance (and the pin
  // remap's algebra), not a lock acting. See the header.
  const raw = locks && typeof locks === 'object' ? /** @type {Record<string, unknown>} */ (locks).npcs : undefined;
  const locked = idArray(raw);
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
 * The booleans are statements about the settlement (its past, and any retired
 * world-lock key a save still carries) and are untouched: every key but `npcs` is
 * spread through verbatim. Only `npcs` needs work, because only `npcs` is keyed on ids a
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
