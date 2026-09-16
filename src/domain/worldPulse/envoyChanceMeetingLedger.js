/**
 * envoyChanceMeetingLedger.js — ENC-2. THE CHANCE-MEETING LEDGER LEAF.
 *
 * The two deposit ledgers a chance meeting mints, and the two readers that consume
 * them. Nothing else. The resolution that decides what to deposit is ENC-1's pure leaf;
 * the stage that calls both is ENC-3; the writers that APPLY these deposits are the
 * ladder kernel (marks) and the corruption web (leans), each of which already owns its
 * own ledger and is not displaced here.
 *
 * ── WHY THE READERS LIVE IN THE WRITER'S LEAF ───────────────────────────────────
 *
 * The estate's shape is unambiguous and this file copies it rather than inventing one:
 * `gratitudeBonds.js` hosts `applyGratitudeBondLedger` and `readGratitudeBondEvents`
 * together, `espionageCareerCredit.js` hosts its deposit writer and
 * `readMissionCreditEvents` together, and `npcLadderKernel.js` imports each reader FROM
 * that leaf. The reader belongs beside the write site and beside the literal key,
 * because the two must agree about a shape and a tick filter, and a reader one module
 * away from its writer is a drift waiting to happen.
 *
 * It is also what makes ENC-2 BUILDABLE. Homing these readers in the STAGE would hoist
 * the kernel's import over a name that does not resolve until a later car, and the
 * kernel's own proof — a deposit row minting a friendship — cannot run without a reader.
 *
 * ⛔ THE LITERAL KEYS LIVE HERE AND NOWHERE ELSE. `tests/lib/spatialLedgerCoverage.walker.test.js`
 * scans for BARE STRING LITERALS at the write site; a key assembled from a constant is
 * invisible to it. Both are registered in `spatialUsage.js` EXEMPT_LEDGER_KEYS beside
 * `gratitudeBondEvents`, whose kind they share: a hand-off in flight, not an exercised
 * mover.
 *
 * ── THE DROP PASS, AND THE BUG IT EXISTS TO PREVENT (P-7) ───────────────────────
 *
 * `applyMeetingMarkLedger` is called by the stage as its FIRST act, BEFORE the flag
 * read, with an empty `writes` on a dark tick. That ordering is not decoration:
 *   - a NEVER-LIT world has no prior, so the call returns `changed: false` and is
 *     byte-identical — the dark arm is untouched;
 *   - a world lit today and DARKENED tomorrow drops its stale key on the very next
 *     pulse, instead of carrying its last deposits forever behind a stage that returns
 *     before reaching them. A one-tick ledger whose drop pass sits behind the flag is
 *     not a one-tick ledger; it is a leak, and the spatial namespace cannot drain while
 *     one key survives in it.
 *
 * ── FINITE SEMANTICS: THIS LEAF CARRIES NO NUMBER IT DID NOT HAVE TO ────────────
 *
 * A mark deposit's severity is the WORD `half`, never the float. The ladder's own
 * `LADDER_TUNING.BOND_MINT_SEV` is the number, it is the owner's to sign, and it stays
 * in the ladder — so the deposit says what happened and the CONSUMER says how much it
 * is worth. A tuning value spelled in two files is a tuning value that will be signed
 * once and drift twice.
 *
 * ── TOTAL ROWS, ON PURPOSE ──────────────────────────────────────────────────────
 *
 * Every field is present on every row of both ledgers; neither has an optional field.
 * The OSR reader ratchet mints a GROWTH row for a read of a key the corpus never
 * writes, and a total row shape gives it nothing to judge. That is also why `mark`
 * rides every mark row, and BOTH grains are now reachable: the owner ruled the rivalry
 * word (§12 row 3), so the stage grains a mark by its kind. What is still unreachable is
 * the ladder-side FOLD of a `grudge` row, which ENC-5 owns; the shape was settled first,
 * so lifting that fold owes no migration.
 *
 * @enforced-by tests/domain/envoyChanceMeetingLedger.test.js
 */
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/spatialLedgerAccess.js';
import { compareCodepoint } from '../deterministicSort.js';

/** @typedef {{ mark: string, otherNid: string, foreignSid: string, kind: string, sev: string, depositTick: number }} MeetingMarkEvent */
/** @typedef {{ patronId: string, targetId: string, npcKey: string, depositTick: number, band: string, willed: boolean }} MeetingLeanChannel */

/** The mark grains a deposit may carry. `grudge` is REACHABLE (the rivalry word is ruled,
 *  §12 row 3) and INERT: the stage deposits it and `applyMeetingMark` declines to fold it,
 *  so it is written, read back and ignored. ENC-5 lifts the fold. */
export const MEETING_MARK_GRAINS = Object.freeze(['bond', 'grudge']);

/** The severity WORDS a deposit may carry. One member today; the consumer owns the
 *  number it maps to (see the FINITE SEMANTICS note above). */
export const MEETING_SEV_WORDS = Object.freeze(['half']);

/** The lean channel's two bands, in order of strength. A second successful compromise
 *  of the same person toward the same court steps `leaning` to `won_over`. */
export const MEETING_LEAN_BANDS = Object.freeze(['leaning', 'won_over']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return typeof v === 'string' ? v : '';
}

/**
 * Persist the ONE-TICK mark deposit ledger: SET when this tick minted deposits, DROP a
 * stale prior otherwise. The `gratitudeBondEvents` contract verbatim — the drop only
 * fires on the tick AFTER the last lit deposit, so a never-lit world never carries the
 * key and dark stays byte-identical.
 *
 * ⚠ CALL THIS BEFORE THE FLAG READ. See the drop-pass note in the header: a stage that
 * returns early on a dark tick without running this leaks the last lit tick's deposits
 * forever.
 *
 * @param {Record<string, unknown>} worldState  the pass's INPUT state (the prior read)
 * @param {Record<string, unknown>} nextWorldState  the pass's accumulating output state
 * @param {Record<string, MeetingMarkEvent>} writes  pass-local collector, keyed `${sid}|${nid}`
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function applyMeetingMarkLedger(worldState, nextWorldState, writes) {
  const rows = asObject(writes);
  const keys = Object.keys(rows);
  if (keys.length) {
    /** @type {Record<string, MeetingMarkEvent>} */
    const sorted = {};
    for (const k of keys.sort(compareCodepoint)) sorted[k] = /** @type {MeetingMarkEvent} */ (rows[k]);
    return { worldState: setSpatialLedger(nextWorldState, 'meetingMarkEvents', sorted), changed: true };
  }
  if (Object.keys(asObject(getSpatialLedger(worldState, 'meetingMarkEvents'))).length) {
    return { worldState: dropSpatialLedger(nextWorldState, 'meetingMarkEvents'), changed: true };
  }
  return { worldState: nextWorldState, changed: false };
}

/**
 * Persist the CARRIED lean-channel ledger (the `roadsReturnedCaptives` model: rows live
 * across ticks until something ends them). Three things end a row and all three are
 * applied here, so the pruning law lives in one place:
 *   TTL       — `tick - depositTick > ttlTicks` (the decay §881.11 asked for; the leash
 *               the web mints from a lean has no TTL of its own, so this is where a lean
 *               that was never acted on goes away);
 *   CONVERTED — the web already minted a leash for that person (`converted`);
 *   VANISHED  — the person is no longer addressable (`vanished`).
 * A fresh write for an existing key REPLACES it (that is how `leaning` steps to
 * `won_over` and how `depositTick` refreshes). Drop-when-empty: the last row leaving
 * takes the key with it, so the namespace can drain.
 *
 * @param {Record<string, unknown>} worldState  the pass's INPUT state (the prior read)
 * @param {Record<string, unknown>} nextWorldState  the pass's accumulating output state
 * @param {{ writes?: Record<string, MeetingLeanChannel>, tick: number, ttlTicks: number, converted?: ReadonlySet<string>, vanished?: ReadonlySet<string> }} args
 * @returns {{ worldState: Record<string, unknown>, changed: boolean }}
 */
export function applyMeetingLeanLedger(worldState, nextWorldState, { writes = {}, tick, ttlTicks, converted, vanished }) {
  const now = Math.max(0, Math.floor(num(tick, 0)));
  const ttl = Math.max(0, Math.floor(num(ttlTicks, 0)));
  const prior = asObject(getSpatialLedger(worldState, 'meetingLeanChannels'));
  const fresh = asObject(writes);
  /** @type {Record<string, MeetingLeanChannel>} */
  const kept = {};
  for (const key of Object.keys(prior).sort(compareCodepoint)) {
    if (Object.prototype.hasOwnProperty.call(fresh, key)) continue; // a fresh write replaces it
    const row = normalizeLeanRow(prior[key]);
    if (!row) continue;
    if (now - row.depositTick > ttl) continue;                 // TTL: an unconverted lean lapses
    if (converted && converted.has(row.npcKey)) continue;      // the web minted: the lean is spent
    if (vanished && vanished.has(row.npcKey)) continue;        // the person is gone
    kept[key] = row;
  }
  for (const key of Object.keys(fresh).sort(compareCodepoint)) {
    const row = normalizeLeanRow(fresh[key]);
    if (row) kept[key] = row;
  }
  /** @type {Record<string, MeetingLeanChannel>} */
  const sorted = {};
  for (const key of Object.keys(kept).sort(compareCodepoint)) sorted[key] = kept[key];
  const hadPrior = Object.keys(prior).length > 0;
  if (Object.keys(sorted).length) {
    if (hadPrior && sameLeanLedger(prior, sorted)) return { worldState: nextWorldState, changed: false };
    return { worldState: setSpatialLedger(nextWorldState, 'meetingLeanChannels', sorted), changed: true };
  }
  if (hadPrior) return { worldState: dropSpatialLedger(nextWorldState, 'meetingLeanChannels'), changed: true };
  return { worldState: nextWorldState, changed: false };
}

/** Defensive row normalization — a persisted row that lost a field is DROPPED rather
 *  than half-read, because a half-read lean would pin the web onto a person it cannot
 *  name. Total on garbage.
 *  @param {unknown} v @returns {MeetingLeanChannel | null} */
function normalizeLeanRow(v) {
  const o = asObject(v);
  const patronId = str(o.patronId);
  const targetId = str(o.targetId);
  const npcKey = str(o.npcKey);
  const band = str(o.band);
  if (!patronId || !targetId || !npcKey) return null;
  if (!MEETING_LEAN_BANDS.includes(band)) return null;
  if (o.willed !== true) return null; // every row this leaf writes is willed, by construction
  return { patronId, targetId, npcKey, depositTick: Math.max(0, Math.floor(num(o.depositTick, 0))), band, willed: true };
}

/** Byte-comparison of two lean ledgers, so an unchanged pass reports `changed: false`
 *  and does not churn the namespace. Key order is normalized by the caller.
 *  @param {Record<string, unknown>} a @param {Record<string, MeetingLeanChannel>} b */
function sameLeanLedger(a, b) {
  const ak = Object.keys(a).sort(compareCodepoint);
  const bk = Object.keys(b).sort(compareCodepoint);
  if (ak.length !== bk.length) return false;
  for (let i = 0; i < ak.length; i += 1) {
    if (ak[i] !== bk[i]) return false;
    const x = normalizeLeanRow(a[ak[i]]);
    const y = b[bk[i]];
    if (!x) return false;
    if (x.patronId !== y.patronId || x.targetId !== y.targetId || x.npcKey !== y.npcKey
      || x.depositTick !== y.depositTick || x.band !== y.band) return false;
  }
  return true;
}

/**
 * THE LADDER-SIDE READ: this tick's mark deposits, keyed `${sid}|${nid}` — the standing
 * record's own lookup grain, so the kernel reads it with the key it already holds in the
 * rung loop. Rows from ANY OTHER TICK are ignored: that strict filter is the consume-once
 * DOUBLE guard (the one-tick ledger is the first), and it is what makes a replayed or
 * restored tick unable to double-mint a bond.
 *
 * @param {Record<string, unknown>} worldState
 * @param {number} now  the ladder's tick
 * @returns {Map<string, MeetingMarkEvent>}
 */
export function readMeetingMarkEvents(worldState, now) {
  /** @type {Map<string, MeetingMarkEvent>} */
  const out = new Map();
  const ledger = asObject(getSpatialLedger(worldState, 'meetingMarkEvents'));
  const tick = Math.floor(num(now, 0));
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const o = asObject(ledger[key]);
    if (Math.floor(num(o.depositTick, -1)) !== tick) continue;
    const mark = str(o.mark);
    const otherNid = str(o.otherNid);
    const foreignSid = str(o.foreignSid);
    const kind = str(o.kind);
    const sev = str(o.sev);
    if (!MEETING_MARK_GRAINS.includes(mark) || !otherNid || !foreignSid || !kind) continue;
    if (!MEETING_SEV_WORDS.includes(sev)) continue;
    out.set(key, { mark, otherNid, foreignSid, kind, sev, depositTick: tick });
  }
  return out;
}

/**
 * THE WEB-SIDE READ: every live lean channel, codepoint-ordered. NO tick filter — a
 * channel is a standing intention that persists until it converts, lapses or its person
 * vanishes, and the web may reach it on the next tick or a later one (it mints at most
 * one asset per patron per tick, for that patron's strict-max target, behind a cap, a
 * pair rule and an upkeep floor). A lean that is never the max may expire unconverted,
 * and that is a lawful outcome rather than a missed write.
 *
 * @param {Record<string, unknown>} worldState
 * @returns {Array<MeetingLeanChannel>}
 */
export function readMeetingLeanChannels(worldState) {
  /** @type {Array<MeetingLeanChannel>} */
  const out = [];
  const ledger = asObject(getSpatialLedger(worldState, 'meetingLeanChannels'));
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const row = normalizeLeanRow(ledger[key]);
    if (row) out.push(row);
  }
  return out;
}

/** The ledger key a lean row is filed under: patron, target court, and the target's
 *  positional npc key. One row per (patron, target, person) — a second compromise of
 *  the same person by the same court refreshes rather than accumulates.
 *  @param {string} patronId @param {string} targetId @param {string} npcKey @returns {string} */
export function meetingLeanKey(patronId, targetId, npcKey) {
  return `${patronId}|${targetId}|${npcKey}`;
}

/** The ledger key a mark row is filed under: the settlement and the standing record's
 *  nid — the HOLDER of the mark, never the counterpart.
 *  @param {string} sid @param {string} nid @returns {string} */
export function meetingMarkKey(sid, nid) {
  return `${sid}|${nid}`;
}
