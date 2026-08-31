/**
 * domain/worldPulse/regenIdentityFold.js — THE THIRD AND FOURTH MAPS THE ROSTER
 * REROLL HAS TO REWRITE (W-LIVES car L2 bridge; recon R-L2-UID-RECON PART 1).
 *
 * ── WHAT WAS BROKEN, AND WHY NOTHING RED ────────────────────────────────────
 *
 * NPC ids are POSITIONAL. `generateNPCs` stamps `npc_${idx + 1}` over a finished
 * roster, so a section reroll re-issues npc_1..npc_N to entirely different people,
 * and a preserved keeper does not rejoin the roster: it TAKES OVER a fresh slot and
 * inherits that slot's id (regenerationPreservation.js documents the substitution
 * and why it is the only safe shape). The pipeline therefore reports every keeper as
 * `{ fromId, id }`, and `foldRegeneratedRoster` rewrites two id-keyed maps from that
 * report so neither can follow the stranger who took the old slot: `locks.npcs` and
 * the save row's `aiData.pinnedNpcs`.
 *
 * A THIRD id-keyed map was never in that fold: `worldState.npcStates`, keyed
 * `npcId(settlementId, npc, index)` = `${settlementId}:${npc.id}`. It holds a
 * person's corruption, exposure history, momentum, leverage and rivalries. Left
 * alone across a reroll it does not merely dangle - it REBINDS. Executed at the
 * pinned seeds in the recon: a locked keeper moved npc_6 -> npc_8 while `npc_6`
 * came to name a different human being, so the map's `save:npc_6` row - a
 * corruption record, a compromise - silently became the stranger's. No prune can
 * ever catch that: `pruneNpcStates` fires on a key whose NPC has left the roster,
 * and this key never leaves the roster. No existence census catches it either: the
 * entry exists, it is simply about the wrong person.
 *
 * A FOURTH map has the mirror-image defect. `npcLedger`'s reverse lookup is
 * `(settlementId, rosterId, name)`; the NAME in that key is what makes a stranger
 * at the old slot resolve to null (verified by execution), so the ledger can never
 * REBIND. What it does instead is LOSE: the same person at a MOVED slot also
 * resolves to null, so the next graduation mints them a SECOND durable identity and
 * one soul stands in the world ledger twice. The cure is one refresh of the stored
 * `originRef.rosterId`, and it lives in npcLedger.js because that module is the
 * ledger's single writer.
 *
 * ── THE ALGEBRA, AND WHY IT IS A PRUNE RATHER THAN A REMAP ──────────────────
 *
 * `locks.npcs` and `pinnedNpcs` are SELECTIONS: they name the few people the user
 * singled out, and every one of those is a keeper, so remapping the report's pairs
 * covers the whole map and an unmentioned id is left alone (locksPreservation.js
 * explains why tolerance is right there - an undo can restore an older blob).
 *
 * `npcStates` is a CENSUS: every roster member may have a row. After a reroll the
 * only people still alive are the keepers, so the honest fold is
 *
 *     keep the keepers, re-keyed fromId -> id;  DROP everything else for this town.
 *
 * Dropping is not aggressive, it is the repair: a row that is neither moved nor
 * dropped is a dead person's simulation state sitting under the id of the living
 * stranger who replaced them. This mirrors `locksAfterFullGenerate`'s rule - called
 * with no report at all, every id is stale by definition - and it is why an
 * unlocked reroll (which preserves nobody, so the pipeline omits `_preservation`
 * entirely) clears this settlement's rows rather than handing all of them to
 * strangers. The next tick re-mints defaults for the new cast through
 * `ensureNpcStates`, which is exactly what a brand-new cast should get.
 *
 * `rivalryTargets[]` hold npcState KEYS, so they are rewritten by the same pass:
 * a target that moved follows its person, a target that was dropped is stripped.
 * `pruneNpcStates` already strips pruned ids from surviving lists; leaving that to
 * a later prune here would leave a rivalry pointing at a stranger in the meantime.
 *
 * ── SCOPE, STATED SO NOBODY LOOKS FOR MORE ──────────────────────────────────
 *
 * ONLY the settlement being rerolled is touched. Keys for every other settlement
 * are carried verbatim in their original order, and a person graduated in town A
 * but hosted in town B keeps an originRef naming A, so the ledger half filters on
 * `originRef.settlementId` and cannot reach across.
 *
 * NO FULL-GENERATE TWIN, for the reason remapPinnedNpcsAfterRegen states for its
 * own absence: a full generate mints a NEW town and resets activeSaveId to null
 * without touching any save row, so the previous save keeps both its roster and its
 * world state, and folding there would destroy correct rows rather than repair
 * stale ones.
 *
 * DELIBERATELY DEFERRED - documented, not a bug to re-find. A RENAME also
 * invalidates the ledger's `(settlementId, rosterId, name)` lookup, and it has no
 * hook here because it is a different seam: `renameNPC`
 * (settlementRenameHelpers.js) has no component caller at this tip, and the one
 * live rename lane is the AI clerk path (narrativeMutations.js). The refresh a
 * rename needs is the mirror of this one (same rosterId, moved name) and belongs
 * with whichever car wires that seam.
 *
 * PURE. No store, no clock, no PRNG, no React, no I/O, no mutation. Returns the
 * SAME worldState reference whenever nothing moved, so a caller's change detector
 * cannot be defeated by a no-op pass.
 *
 * @enforced-by tests/domain/regenIdentityFold.test.js,
 *   tests/store/npcStateRegenRebind.test.js
 */

import { refreshOriginRefsAfterRegen } from '../worldPulse/npcLedger.js';

/**
 * THE KEY FORMAT, RE-SPELLED ON PURPOSE, AND PINNED.
 *
 * `npcId(saveId, npc, index)` (npcAgency.js) is the one writer of this key, but
 * npcAgency drags 79 modules and 1.4 MB of source behind it, and this leaf is
 * reached from the store. Re-spelling the prefix keeps the import graph at five
 * files; the drift risk that creates is closed by a pin that imports BOTH and
 * asserts they agree on a real roster (tests/domain/regenIdentityFold.test.js).
 * @param {string} settlementId @returns {string}
 */
function keyPrefix(settlementId) {
  return `${String(settlementId)}:`;
}

/**
 * The keeper map the report describes: every surviving person's OLD roster id to
 * the id they inherited. Entries whose id did not move are included, because the
 * question this map answers is "did this person survive", not "did they move".
 * @param {Array<{id?: string, fromId?: string}>|null|undefined} preserved
 * @returns {Map<string, string>}
 */
function survivorsOf(preserved) {
  /** @type {Map<string, string>} */
  const survivors = new Map();
  if (!Array.isArray(preserved)) return survivors;
  for (const entry of preserved) {
    const from = String(entry?.fromId ?? '').trim();
    const to = String(entry?.id ?? '').trim();
    if (from && to) survivors.set(from, to);
  }
  return survivors;
}

/**
 * Rewrite `worldState.npcStates` for ONE settlement whose roster has just been
 * rerolled: keepers follow their person, everybody else goes.
 *
 * Returns the SAME worldState reference when there is nothing to rewrite - no
 * states at all, or no key belonging to this settlement.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId  the SAVE id npcStates keys are built from
 * @param {Array<{id?: string, fromId?: string}>|null|undefined} preserved
 *   the preservation report's `preserved` half; absent/empty means NOBODY survived
 * @returns {{ worldState: Record<string, unknown>|null|undefined, changed: boolean,
 *   moved: string[], dropped: string[] }}
 */
export function npcStatesAfterRosterReroll(worldState, settlementId, preserved) {
  const unchanged = { worldState, changed: false, moved: /** @type {string[]} */ ([]), dropped: /** @type {string[]} */ ([]) };
  const states = worldState && typeof worldState === 'object' ? worldState.npcStates : null;
  if (!states || typeof states !== 'object' || Array.isArray(states)) return unchanged;
  const prefix = keyPrefix(settlementId);
  if (!prefix || prefix === ':') return unchanged;

  const survivors = survivorsOf(preserved);
  /** @type {Record<string, unknown>} */
  const next = {};
  /** @type {Map<string, string>} */
  const rekeyed = new Map();
  /** @type {Set<string>} */
  const gone = new Set();
  let changed = false;

  // Pass 1 - re-key or drop, walking the source order so a settlement whose rows
  // did not move keeps its serialized key order byte-for-byte.
  for (const [key, state] of Object.entries(states)) {
    if (!key.startsWith(prefix)) { next[key] = state; continue; }
    const rosterId = key.slice(prefix.length);
    const inherited = survivors.get(rosterId);
    if (inherited === undefined) { gone.add(key); changed = true; continue; }
    const nextKey = prefix + inherited;
    if (nextKey !== key) { rekeyed.set(key, nextKey); changed = true; }
    next[nextKey] = state;
  }
  if (!changed) return unchanged;

  // Pass 2 - rivalryTargets hold npcState KEYS, so a rivalry has to follow the
  // same two verdicts its subject did or it points at the stranger too.
  if (rekeyed.size > 0 || gone.size > 0) {
    for (const [key, raw] of Object.entries(next)) {
      const state = raw && typeof raw === 'object' && !Array.isArray(raw)
        ? /** @type {Record<string, unknown>} */ (raw)
        : null;
      const targets = state && Array.isArray(state.rivalryTargets) ? state.rivalryTargets : null;
      if (!targets || targets.length === 0 || !state) continue;
      /** @type {unknown[]} */
      const kept = [];
      let moved = false;
      for (const target of targets) {
        const id = String(target);
        if (gone.has(id)) { moved = true; continue; }
        const to = rekeyed.get(id);
        if (to === undefined) { kept.push(target); continue; }
        kept.push(to);
        moved = true;
      }
      if (moved) next[key] = { ...state, rivalryTargets: kept };
    }
  }

  return {
    worldState: { ...worldState, npcStates: next },
    changed: true,
    moved: [...rekeyed.keys()].sort(),
    dropped: [...gone].sort(),
  };
}

/**
 * THE BRIDGE - both world-scoped identity maps folded from the one report, in the
 * one step that already folds the roster, the locks and the pins.
 *
 * The two halves are independent by construction: `npcStates` is a live map in
 * every campaign, while the ledger half only ever does anything in a world whose
 * NPC-consequence economy is LIT (npcLedger's whole surface is an early return
 * when it is dark), so a dormant world takes the npcStates repair and pays nothing
 * for the other.
 *
 * @param {Object} args
 * @param {Record<string, unknown>|null|undefined} args.worldState
 * @param {string} args.settlementId
 * @param {Array<{id?: string, fromId?: string, name?: string}>|null|undefined} args.preserved
 * @returns {{ worldState: Record<string, unknown>|null|undefined, changed: boolean, npcStatesMoved: string[],
 *   npcStatesDropped: string[], originRefsRefreshed: string[] }}
 */
export function foldRegenIdentity({ worldState, settlementId, preserved }) {
  const states = npcStatesAfterRosterReroll(worldState, settlementId, preserved);
  const ledger = refreshOriginRefsAfterRegen(states.worldState, settlementId, preserved);
  return {
    worldState: ledger.worldState,
    changed: states.changed || ledger.changed,
    npcStatesMoved: states.moved,
    npcStatesDropped: states.dropped,
    originRefsRefreshed: ledger.refreshed,
  };
}
