/**
 * domain/worldPulse/npcRulingRegister.js — W-H4: THE DM RULING REGISTER.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §8 "every transition is address-chain news with
 * typed causes"; law 5 DORMANCY.)
 *
 * WHY THIS LEDGER EXISTS. The Herald has two news sinks and neither can honestly carry
 * a DM verb. The PULSE RECORD is what an advance produced, and a button press is not an
 * advance; minting a pulse to carry one would be a lie about what a pulse is, and every
 * pulse consumer (undo depth, the advance report, the certification census) would have
 * to be taught the exception. The WIZARD-NEWS feed belongs to another program's writer,
 * and a second writer on somebody else's record is how two lanes start disagreeing about
 * one truth. So the rulings a DM hands down get their own small register, single-writer,
 * which the Wanderers door reads back as the realm's recent rulings.
 *
 * THE SHAPE IS THE armyTransit CONDITIONAL-LEDGER PATTERN, and every part of it is
 * load-bearing: absent while the lane is dark, absent while empty, and DROPPED again the
 * moment the last ruling is withdrawn, so a realm that has ruled on nobody serializes
 * byte-identically to one that never could. Capped, because a DM's paper is a
 * recent-events page rather than an archive: the receipts that matter durably are the
 * ledger's own state, and the register is the reader's view of what just happened.
 *
 * ── A WALKER HAZARD, WRITTEN DOWN SO IT IS NOT REINTRODUCED ─────────────────────
 * The spatial-ledger coverage walker scans for `setSpatialLedger(<arg>, <key>` with a
 * NON-GREEDY first argument, so a call whose key is a CONSTANT lets the literal branch
 * of that scan run forward through the rest of the file and bind the next comma-then-
 * quoted-token sequence it finds as a phantom ledger key. That is exactly what happened
 * when these two writers lived inside npcDmVerbs.js: the walker reported a ledger named
 * for one of that module's refusal tokens, picked up from a refuse(...) call two hundred
 * lines below. The cure, which the sibling ledgers (routeNetworkLedger, npcLedger)
 * already follow without stating it: THE WRITE SITES GO LAST, in a file with no quoted
 * token after them, comments included. Keep new helpers ABOVE the two writers at the
 * bottom. (This paragraph is itself written to avoid tripping the same scan.)
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/npcDmVerbs.test.js
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';

/** The conditional sub-ledger key under worldState.spatialLedgers. */
export const NPC_RULINGS_KEY = 'npcRulings';

/**
 * How many rulings the register keeps, oldest evicted first. Forty is roughly a long
 * campaign's worth of exiles, deaths and pardons: enough that a DM can scroll back
 * through a session's rulings, small enough that the key can never become a second,
 * unbounded copy of the campaign's history.
 */
export const NPC_RULINGS_CAP = 40;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/**
 * The rulings this world has recorded, OLDEST FIRST. Total on garbage: an absent,
 * malformed or partially-shaped register reads as the empty list, so every consumer is
 * total without a guard.
 *
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {ReadonlyArray<Record<string, unknown>>}
 */
export function npcRulingsOf(worldState) {
  const entries = asObject(getSpatialLedger(worldState, NPC_RULINGS_KEY)).entries;
  return Object.freeze(
    (Array.isArray(entries) ? entries : [])
      .filter((e) => e && typeof e === 'object' && !Array.isArray(e))
      .map((e) => /** @type {Record<string, unknown>} */ (e)),
  );
}

/**
 * Append one ruling. Returns a NEW worldState; never mutates. A null item, or one the
 * register already holds by id, is a no-op returning the CALLER'S OWN reference, so a
 * re-run of the same verb cannot double-print the same sentence in the paper.
 *
 * @param {Record<string, unknown>} worldState
 * @param {Record<string, unknown>|null|undefined} ruling
 * @returns {Record<string, unknown>}
 */
export function recordNpcRuling(worldState, ruling) {
  if (!ruling || typeof ruling !== 'object') return worldState;
  const id = text(ruling.id);
  const prior = npcRulingsOf(worldState);
  if (id && prior.some((entry) => text(entry.id) === id)) return worldState;
  const kept = [...prior, ruling].slice(-NPC_RULINGS_CAP);
  return setSpatialLedger(worldState, NPC_RULINGS_KEY, { entries: kept });
}

/**
 * Withdraw one ruling by id (the undo half). Drops the WHOLE key when the last one
 * goes, which is what keeps a fully-undone session byte-identical to one that never
 * ruled on anybody. An id the register does not hold is a no-op returning the caller's
 * own reference.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} rulingId
 * @returns {Record<string, unknown>}
 */
export function withdrawNpcRuling(worldState, rulingId) {
  const id = text(rulingId);
  if (!id) return worldState;
  const prior = npcRulingsOf(worldState);
  const kept = prior.filter((entry) => text(entry.id) !== id);
  if (kept.length === prior.length) return worldState;
  if (kept.length === 0) return dropSpatialLedger(worldState, NPC_RULINGS_KEY);
  return setSpatialLedger(worldState, NPC_RULINGS_KEY, { entries: kept });
}
