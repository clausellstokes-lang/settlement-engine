/**
 * THE GENEROSITY GRATITUDE LANE — deep-couplings D-7e clause (ii), the WRITE half
 * (mini-fold step 3). The design clause, verbatim: "a completed generosity act deposits
 * a cooperation/gratitude event (consumed by the ladder pass into bonds, beside the
 * obligations ledger entry the act already mints — obligation is the DEBT, the bond is
 * the FRIENDSHIP; they decay on different clocks and that difference is the drama)."
 *
 * CHOREOGRAPHY (law 5, the ONE-TICK variant): generosity (pulseKernel ~2205) DEPOSITS
 * during its pass; the ladder (pulseKernel ~2348 — later the SAME tick, the pinned
 * statecraft→generosity→ladder ordering) CONSUMES the deposit into the receiving
 * court's ruling-seat bonds through the ladder's own writer (mintBond). The ledger
 * lives EXACTLY one tick — the next generosity pass rebuilds or drops it — and the
 * consume additionally filters event.tick === now, so consume-once holds by double
 * construction (a stale ledger cannot double-mint).
 *
 * SINGLE-WRITER: generosity alone writes 'gratitudeBondEvents'; the ladder only reads.
 * GATING: deposits mint only under memoryWeaveActive (the CONSUMER's flag, read by the
 * kernel) — dark weave ⇒ no key ⇒ worldState byte-identical.
 * COURT-TO-COURT: mercy between settlements is remembered court-to-court — the
 * RECEIVER settlement's ruling-seat NPC (top rung of its governing faction's ladder)
 * bonds toward the GIVER settlement's ruling-seat NPC; cross-border by construction,
 * so the mark carries foreignSid = giver sid (the D-7f convention).
 * NO friendship rides leverage: credit verdicts and predatory-weighted gifts deposit
 * NOTHING (they mint their debt above; debt is not friendship).
 */

import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { governingFactionOf } from '../rulingPower.js';
import { ladderFactionKey, num, asObject, compareCodepoint } from './npcLadderState.js';
import { clamp01 } from '../../kernel/math.js';

/** @typedef {{ sev: number, tick: number }} GratitudeBondEvent */

/**
 * Record one qualifying generosity act into the pass-local writes collector.
 * All gating lives here so the kernel call-sites stay one line: weave lit, a real
 * pair (giver ≠ receiver), severity at/above the obligation floor. Same-tick repeat
 * gifts on a pair stack ADDITIVELY, bounded to 1 (the ladder's mintBond applies its
 * own BOND_MAX_SEV clamp on consume). Mutates `writes` (a pass-local collector,
 * never persisted state). Deterministic; no rng.
 * @param {Record<string, GratitudeBondEvent>} writes  pass-local collector, keyed `${receiverSid}|${giverSid}`
 * @param {{ lit: boolean, receiverSid: string, giverSid: string, sev: number, tick: number, floor: number }} args
 * @returns {void}
 */
export function noteGratitudeBond(writes, { lit, receiverSid, giverSid, sev, tick, floor }) {
  if (!lit) return;
  const r = String(receiverSid || '');
  const g = String(giverSid || '');
  if (!r || !g || r === g) return;
  const s = clamp01(num(sev, 0));
  if (s < num(floor, 0)) return;
  const key = `${r}|${g}`;
  const prior = writes[key];
  writes[key] = { sev: clamp01((prior ? prior.sev : 0) + s), tick: Math.floor(num(tick, 0)) };
}

/**
 * Persist the one-tick deposit ledger: SET when this tick minted deposits, DROP a
 * stale prior otherwise (the drop only fires on the tick after the last lit deposit —
 * a never-lit world never carries the key, so dark stays byte-identical). The literal
 * ledger key lives HERE for the spatialLedgerCoverage walker (string-literal-only scan).
 * @param {Record<string, unknown>} worldState  the pass's INPUT state (prior read)
 * @param {Record<string, unknown>} nextWorldState  the pass's accumulating output state
 * @param {Record<string, GratitudeBondEvent>} writes
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function applyGratitudeBondLedger(worldState, nextWorldState, writes) {
  const hasWrites = Object.keys(writes).length > 0;
  if (hasWrites) {
    /** @type {Record<string, GratitudeBondEvent>} */
    const sorted = {};
    for (const k of Object.keys(writes).sort(compareCodepoint)) sorted[k] = writes[k];
    return { worldState: setSpatialLedger(nextWorldState, 'gratitudeBondEvents', sorted), changed: true };
  }
  const prior = asObject(getSpatialLedger(worldState, 'gratitudeBondEvents'));
  if (Object.keys(prior).length) {
    return { worldState: dropSpatialLedger(nextWorldState, 'gratitudeBondEvents'), changed: true };
  }
  return { worldState: nextWorldState, changed: false };
}

/**
 * The ladder-side read: this tick's gratitude deposits, grouped by RECEIVER settlement,
 * givers codepoint-sorted (deterministic mint order). Events from any other tick are
 * ignored (the consume-once double guard — the one-tick ledger is the first).
 * @param {Record<string, unknown>} worldState
 * @param {number} now  the ladder's tick
 * @returns {Map<string, Array<{ giverSid: string, sev: number }>>}
 */
export function readGratitudeBondEvents(worldState, now) {
  /** @type {Map<string, Array<{ giverSid: string, sev: number }>>} */
  const out = new Map();
  const ledger = asObject(getSpatialLedger(worldState, 'gratitudeBondEvents'));
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const ev = /** @type {GratitudeBondEvent | null} */ (ledger[key] && typeof ledger[key] === 'object' ? ledger[key] : null);
    if (!ev || Math.floor(num(ev.tick, -1)) !== Math.floor(num(now, 0))) continue;
    const bar = key.indexOf('|');
    if (bar <= 0 || bar >= key.length - 1) continue;
    const receiverSid = key.slice(0, bar);
    const giverSid = key.slice(bar + 1);
    const list = out.get(receiverSid) || [];
    list.push({ giverSid, sev: clamp01(num(ev.sev, 0)) });
    out.set(receiverSid, list);
  }
  return out;
}

/**
 * The governing faction's ladder key for a settlement (null when no governing faction
 * resolves — vacant courts remember nothing). Rides the CANONICAL accessor
 * (governingFactionOf), never a hand-rolled `.name||.faction` read.
 * @param {Record<string, unknown> | null | undefined} settlement
 * @returns {string | null}
 */
export function governingLadderFkeyOf(settlement) {
  const faction = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement));
  if (!faction) return null;
  const fkey = ladderFactionKey(/** @type {Parameters<typeof ladderFactionKey>[0]} */ (faction));
  return fkey ? String(fkey) : null;
}

/**
 * A settlement's RULING-SEAT NPC id, resolved from its PERSISTED ladder record (the
 * prior tick's truth — deterministic and iteration-order-independent): the top rung
 * (index 0 — new members append at the floor) of the governing faction's ladder.
 * Null-safe at every hop: no settlement, no governing faction, no ladder record, no
 * rungs ⇒ null (the consume skips — absent machinery is a no-op, never a throw).
 * @param {unknown} rawPriorRecord  priorLedger[sid] — the raw persisted LadderRecord
 * @param {Record<string, unknown> | null | undefined} settlement
 * @returns {string | null}
 */
export function rulingSeatNidOf(rawPriorRecord, settlement) {
  const fkey = governingLadderFkeyOf(settlement);
  if (!fkey) return null;
  const factions = asObject(asObject(rawPriorRecord).factions);
  const rungs = asObject(factions[fkey]).rungs;
  if (!Array.isArray(rungs) || !rungs.length) return null;
  const top = rungs[0];
  return typeof top === 'string' && top ? top : null;
}
