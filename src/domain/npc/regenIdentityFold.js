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
// The four spatial accessors, from the leaf that has ZERO imports of its own — so the
// FIFTH map below costs this store-reached leaf no import graph at all.
import { getSpatialLedger, setSpatialLedger } from '../spatial/spatialLedgerAccess.js';

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
 * ENC-6 — THE FIFTH MAP, AND IT HAS BOTH OF THIS DEFECT'S GRAINS.
 *
 * ── WHAT WAS BROKEN, AND WHY IT WAS INVISIBLE ───────────────────────────────
 *
 * `spatialLedgers.npcLadder[sid]` holds a person's STANDING — their stock, their
 * stigma, their grudges and their bonds — under `npcs[nid]` with
 * `nid = ${sid}:${npc.id}`, and their seat under `factions[fkey].rungs[]`, which is a
 * list of the same keys. `regenIdentityFold.js` named `npcLadder` NOWHERE. So a reroll
 * of a man's OWN settlement handed his standing, his stigma, his grudges and every
 * mark he held to whichever stranger took his slot — the exact rebind class the header
 * above describes for `npcStates`, on a map nobody had folded.
 *
 * It stayed invisible for the reason every rebind does: the key never leaves the
 * roster, so no prune fires and no existence census objects. The entry exists; it is
 * simply about the wrong person. And it stayed SMALL because almost nothing writes
 * those records today.
 *
 * ── WHY IT IS BEING FIXED NOW, AND ON WHOSE CLOCK ───────────────────────────
 *
 * ENC's chance meetings mint a standing record per stop for nearly every operative and
 * notable, which makes this defect load-bearing the day the flag lights. The defect is
 * PRE-EXISTING and this design does not claim to have caused it — but a lit
 * `chanceEncountersEnabled` over an unfolded ladder ghosts on the reroll path THE
 * PROMISE names, and that is not a thing to discover in the soak. The gate this must
 * not pass is the LIGHTING gate, not the landing.
 *
 * ── THE TWO GRAINS, AND WHY ONE OF THEM IS NOT ENOUGH ───────────────────────
 *
 *  1. THE RECORD KEY, for the settlement being rerolled. `npcs[nid]` and every
 *     `factions[*].rungs[]` entry take the `npcStates` algebra verbatim: keepers
 *     re-keyed `fromId -> id`, everybody else DROPPED. This is the grain a first
 *     reading misses, because the obvious cross-border pointer below looks like the
 *     whole problem and is in fact the smaller half.
 *  2. THE CROSS-BORDER POINTER, held by OTHER settlements. A bond or grudge minted
 *     across a border is keyed by the counterpart's composite id and carries
 *     `foreignSid` naming their town (the D-7f convention). When THAT town rerolls,
 *     every mark pointing into it must follow the same two verdicts: a keeper's mark
 *     is re-keyed, a stranger's is dropped. Without this half a magistrate in one town
 *     goes on holding a friendship with a name that now belongs to somebody else.
 *
 * THE ROADS RANSOM BOND IS CURED BY THE SAME ENTRY — it carries the identical
 * `foreignSid` shape and was never folded either.
 *
 * ⚠ ONE-TIME DECLARED SHIFT: on a save that has BOTH a lit memory weave and a
 * completed reroll, cross-border marks that were silently rebound now move or vanish.
 * There are no such saves in product (the weave is lit in no preset), which is why the
 * cure can ride here rather than a migration.
 *
 * PURE, and same-reference-when-nothing-moved like its siblings.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId  the SAVE id the ladder's nids are built from
 * @param {Array<{id?: string, fromId?: string}>|null|undefined} preserved
 * @returns {{ worldState: Record<string, unknown>|null|undefined, changed: boolean,
 *   moved: string[], dropped: string[], marksRekeyed: string[], marksDropped: string[] }}
 */
export function npcLadderAfterRosterReroll(worldState, settlementId, preserved) {
  const unchanged = {
    worldState,
    changed: false,
    moved: /** @type {string[]} */ ([]),
    dropped: /** @type {string[]} */ ([]),
    marksRekeyed: /** @type {string[]} */ ([]),
    marksDropped: /** @type {string[]} */ ([]),
  };
  const prefix = keyPrefix(settlementId);
  if (!prefix || prefix === ':') return unchanged;
  const ledgerRaw = getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState || {}), 'npcLadder');
  if (!ledgerRaw || typeof ledgerRaw !== 'object' || Array.isArray(ledgerRaw)) return unchanged;
  const ledger = /** @type {Record<string, unknown>} */ (ledgerRaw);

  const survivors = survivorsOf(preserved);
  /** @type {Map<string, string>} */
  const rekeyed = new Map();
  /** @type {Set<string>} */
  const gone = new Set();
  /** @type {Record<string, unknown>} */
  const nextLedger = {};
  let changed = false;

  // Pass 1 — the RECORD KEY grain, in the rerolled town only. Source order is walked so
  // a town whose rows did not move keeps its serialized key order byte-for-byte.
  for (const [sid, raw] of Object.entries(ledger)) {
    if (sid !== String(settlementId)) { nextLedger[sid] = raw; continue; }
    const rec = asRecord(raw);
    if (!rec) { nextLedger[sid] = raw; continue; }
    const npcs = asRecord(rec.npcs);
    /** @type {Record<string, unknown>} */
    const nextNpcs = {};
    if (npcs) {
      for (const [nid, standing] of Object.entries(npcs)) {
        if (!nid.startsWith(prefix)) { nextNpcs[nid] = standing; continue; }
        const inherited = survivors.get(nid.slice(prefix.length));
        if (inherited === undefined) { gone.add(nid); changed = true; continue; }
        const nextNid = prefix + inherited;
        if (nextNid !== nid) { rekeyed.set(nid, nextNid); changed = true; }
        nextNpcs[nextNid] = standing;
      }
    }
    // The rungs are a LIST of the same keys, so a seat follows its person or leaves with
    // them. A rung left pointing at a dropped key would seat a stranger by arithmetic.
    const factions = asRecord(rec.factions);
    /** @type {Record<string, unknown>} */
    const nextFactions = {};
    if (factions) {
      for (const [fkey, fraw] of Object.entries(factions)) {
        const frec = asRecord(fraw);
        const priorRungs = frec && Array.isArray(frec.rungs) ? frec.rungs.map((r) => String(r)) : null;
        if (!frec || !priorRungs) { nextFactions[fkey] = fraw; continue; }
        const rungs = priorRungs.filter((r) => !gone.has(r)).map((r) => rekeyed.get(r) ?? r);
        if (rungs.length !== priorRungs.length || rungs.some((r, i) => r !== priorRungs[i])) {
          nextFactions[fkey] = { ...frec, rungs };
          changed = true;
        } else nextFactions[fkey] = fraw;
      }
    }
    nextLedger[sid] = { ...rec, ...(npcs ? { npcs: nextNpcs } : {}), ...(factions ? { factions: nextFactions } : {}) };
  }

  // Pass 2 — the CROSS-BORDER POINTER grain, everywhere ELSE. A mark whose `foreignSid`
  // names the rerolled town is keyed by a composite id that town has just re-issued, so
  // it takes the same two verdicts its subject did.
  /** @type {string[]} */
  const marksRekeyed = [];
  /** @type {string[]} */
  const marksDropped = [];
  if (rekeyed.size > 0 || gone.size > 0) {
    for (const [sid, raw] of Object.entries(nextLedger)) {
      const rec = asRecord(raw);
      const npcs = rec ? asRecord(rec.npcs) : null;
      if (!rec || !npcs) continue;
      /** @type {Record<string, unknown>} */
      const nextNpcs = {};
      let townMoved = false;
      for (const [nid, standingRaw] of Object.entries(npcs)) {
        const standing = asRecord(standingRaw);
        if (!standing) { nextNpcs[nid] = standingRaw; continue; }
        /** @type {Record<string, unknown>} */
        const patch = {};
        let personMoved = false;
        for (const field of ['bonds', 'grudges']) {
          const marks = asRecord(standing[field]);
          if (!marks) continue;
          /** @type {Record<string, unknown>} */
          const nextMarks = {};
          let fieldMoved = false;
          for (const [otherNid, markRaw] of Object.entries(marks)) {
            const mark = asRecord(markRaw);
            if (!mark || mark.foreignSid !== String(settlementId)) { nextMarks[otherNid] = markRaw; continue; }
            if (gone.has(otherNid)) { marksDropped.push(`${sid}|${nid}|${otherNid}`); fieldMoved = true; continue; }
            const to = rekeyed.get(otherNid);
            if (to === undefined) { nextMarks[otherNid] = markRaw; continue; }
            nextMarks[to] = markRaw;
            marksRekeyed.push(`${sid}|${nid}|${otherNid}`);
            fieldMoved = true;
          }
          if (fieldMoved) { patch[field] = nextMarks; personMoved = true; }
        }
        if (personMoved) { nextNpcs[nid] = { ...standing, ...patch }; townMoved = true; } else nextNpcs[nid] = standingRaw;
      }
      if (townMoved) { nextLedger[sid] = { ...rec, npcs: nextNpcs }; changed = true; }
    }
  }

  if (!changed) return unchanged;
  return {
    worldState: setSpatialLedger(/** @type {Record<string, unknown>} */ (worldState), 'npcLadder', nextLedger),
    changed: true,
    moved: [...rekeyed.keys()].sort(),
    dropped: [...gone].sort(),
    marksRekeyed: marksRekeyed.sort(),
    marksDropped: marksDropped.sort(),
  };
}

/** A plain object or null. @param {unknown} v @returns {Record<string, unknown>|null} */
function asRecord(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : null;
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
 * ENC-6 adds a THIRD half on the same report and the same one step. It is independent of
 * the other two in the same way they are of each other: a world with no ladder ledger takes
 * the npcStates repair and pays nothing for it.
 *
 * @returns {{ worldState: Record<string, unknown>|null|undefined, changed: boolean, npcStatesMoved: string[],
 *   npcStatesDropped: string[], originRefsRefreshed: string[], ladderMoved: string[],
 *   ladderDropped: string[], ladderMarksRekeyed: string[], ladderMarksDropped: string[] }}
 */
export function foldRegenIdentity({ worldState, settlementId, preserved }) {
  const states = npcStatesAfterRosterReroll(worldState, settlementId, preserved);
  const ladder = npcLadderAfterRosterReroll(states.worldState, settlementId, preserved);
  const ledger = refreshOriginRefsAfterRegen(ladder.worldState, settlementId, preserved);
  return {
    worldState: ledger.worldState,
    changed: states.changed || ladder.changed || ledger.changed,
    npcStatesMoved: states.moved,
    npcStatesDropped: states.dropped,
    originRefsRefreshed: ledger.refreshed,
    ladderMoved: ladder.moved,
    ladderDropped: ladder.dropped,
    ladderMarksRekeyed: ladder.marksRekeyed,
    ladderMarksDropped: ladder.marksDropped,
  };
}
