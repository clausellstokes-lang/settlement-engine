/**
 * domain/worldPulse/suspicion.js — IN-3, THE COUNTER-GAME: THE SUSPICION READ (J-INF-2).
 * (docs/DESIGN_FP_ARCHITECTURE.md §5 #19; docs/DESIGN_FP_ARCH_IN.md §4 IN-3, NORMATIVE;
 * docs/DESIGN_FP_INFORMATION.md §5 IN-3 "Model" and "Belief posture"; R-29.)
 *
 * `suspicionOf` is how hard the EVIDENCE a court holds presses it to believe it is watched or
 * lied to. It is DERIVED and never stored (J-INF-2: no suspicion stock; SP-5 is closed), so it
 * decays on its sources' own laws and needs no clock of its own. It is the IN-side symbol
 * ES-5a's handshake consumes lit (ES-5a consumes; not wired here: ES carries
 * `espionageMath.js :: wariness01Core` until its own lane composes this read).
 *
 * ⛔⛔ IT NEVER READS TRUTH (K3's kinship law, §1b). A court can be rightly suspicious with no
 * spy present and wrongly calm with three; this module therefore reads only RECEIPTS the court
 * itself holds: the live scandal condition on its own record (`corruption_exposed`), the
 * deception-class incidents on its own relationship edges weighted by the resentment still
 * HELD there (an exposed lie, a caught watcher, a foreign asset found: `deception_betrayal`,
 * `spy_exposed`, `foreign_corruption_exposed`), and, when a caller injects it, the mirror gap.
 * It never names the sight ledger, the disinfo ledger, the corruption web's assets or any
 * strength read. The acceptance file pins the import list, scans the tokens, and convicts a
 * planted truth read (the guard-the-guard control runs the same scan over the sweep, which
 * legitimately reads the truth it hunts).
 *   THE INCIDENT RING CARRIES NO DIRECTION: both courts on an edge read the same scar, so the
 *   offender whose watcher was caught grows wary too. That is the ring's own shape, stated.
 *   CAUGHT INTERCEPTS arrive through the same ring: a sweep's catch writes `spy_exposed` there.
 *   THE MIRROR GAP is injected (`mirrorGapOf`), never imported: IN-1's fence pins the mirror's
 *   one render-time importer. Absent, the named degraded read scores the receipts alone.
 *
 * THE BANDS ARE BORROWED, NOT MINTED: the estate's one intensity ladder (quiet, present,
 * pressing, decisive), read through the zero-import vocabulary leaf that already declares it
 * (J-WR-10-B; `tests/lint/pressureLadderMints.walker.test.js` freezes the declarations).
 *
 * SPINE 13 ENGAGED: ZEAL IS POSTURE-DERIVED. SP-4's `courtPostureOf` factor scales every entry
 * threshold (a posture that lowers bars crosses earlier, `paranoid`; one that raises them needs
 * harder evidence, `trusting`). `ZEAL_POSTURES` is the word a DM may direct a sweep with.
 *
 * TWO PULSE SEAMS, EACH ONE CALL IN THE STATECRAFT HEAD: `secrecyInAnswer` (HIDE's response
 * entry path: a court whose suspicion clears closes its gates by decision, not dice, and they
 * reopen by the ambient exit law once it decays) and `claimDoubtOf` (castDoubt's world side:
 * a suspicious court believes a planted claim less, composed on the mouthpiece plane's weight).
 * Dark, both are exact identities.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no hash, no clock, no store, no mutation.
 * @enforced-by tests/domain/counterIntelIn3.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';
import { clamp01 } from '../../kernel/math.js';
import { activeArchetypes } from '../activeConditions.js';
import { beliefsActive } from './beliefMap.js';
import { ENVOY_MORALE_EXHAUSTION_BANDS } from './envoyErrandVocabulary.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { POSTURE_TUNING, courtPostureOf } from './strategicPosture.js';

/** @typedef {Record<string, unknown>} Row */
/** @typedef {(settlementId: string) => number} MirrorGapReader */

/** @param {unknown} v @returns {Row} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Row} */ (v) : {};
}
/** @param {unknown} v @returns {readonly unknown[]} */
function listOf(v) {
  return Array.isArray(v) ? v : [];
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── THE GATE ──────────────────────────────────────────────────────────────────
/**
 * Is the counter-game LIT? Beliefs live AND the virtual flag, read BY NAME with the strict
 * idiom in ONE statement (the observed-shape corpus finds a flag only on one line). This is the
 * ONE read of the key in the tree; statecraft is a lighting-order precondition LIT-n judges.
 * @param {unknown} worldState @returns {boolean}
 */
export function counterIntelActive(worldState) {
  if (!beliefsActive(/** @type {Parameters<typeof beliefsActive>[0]} */ (asObject(worldState)))) return false;
  return asObject(asObject(worldState).simulationRules).counterIntelEnabled === true;
}

// ── THE VOCABULARIES AND THE DIALS ────────────────────────────────────────────
/** The intensity ladder, borrowed whole (quiet, present, pressing, decisive). */
export const SUSPICION_BANDS = ENVOY_MORALE_EXHAUSTION_BANDS;

/** The zeal words a sweep may be directed with, codepoint-ordered. */
export const ZEAL_POSTURES = Object.freeze(['measured', 'paranoid', 'trusting']);

/** The incident types that are deception-class evidence, codepoint-ordered. */
export const DECEPTION_INCIDENTS = Object.freeze(['deception_betrayal', 'foreign_corruption_exposed', 'spy_exposed']);

/**
 * THE DIALS (DRAFT rows in the tuning register; nothing signed). Three evidence weights, the
 * three band cuts on the borrowed ladder, the two entry thresholds before the posture factor
 * (`clearsAt` opens HIDE's answer and the sweep seal; `zealAt` turns a fruitless sweep into a
 * witch-hunt), and the doubt floor castDoubt's discount never passes.
 */
export const SUSPICION_TUNING = Object.freeze({
  scandalWeight: 0.45,
  grievanceWeight: 0.6,
  mirrorWeight: 0.35,
  presentAt: 0.15,
  pressingAt: 0.4,
  decisiveAt: 0.7,
  clearsAt: 0.4,
  zealAt: 0.55,
  doubtFloor: 0.6,
});

// ── THE READ ──────────────────────────────────────────────────────────────────
/**
 * @typedef {{ settlementId: string, band: string, rank: number, score01: number,
 *   terms: readonly string[] }} SuspicionReading
 */

/** @param {string} id @returns {SuspicionReading} */
function quietReading(id) {
  return Object.freeze({ settlementId: id, band: SUSPICION_BANDS[0], rank: 0, score01: 0, terms: Object.freeze([]) });
}

/** The court's own record off a snapshot (the participation view the pulse hands every stage).
 *  @param {unknown} snapshot @param {string} id @returns {Row} */
function courtRecordOf(snapshot, id) {
  const byId = asObject(snapshot).byId;
  const item = byId instanceof Map ? asObject(byId.get(id)) : {};
  return asObject(item.settlement);
}

/**
 * THE GRIEVANCES HELD: over this court's own edges, the resentment still standing on an edge
 * that carries a deception-class incident. The key is the writer's own (`relationshipKeyFromEdge`).
 * @param {Row} worldState @param {unknown} snapshot @param {string} id @returns {number}
 */
function heldDeception01(worldState, snapshot, id) {
  const states = asObject(worldState.relationshipStates);
  let held = 0;
  for (const raw of listOf(asObject(asObject(snapshot).regionalGraph).edges)) {
    const edge = asObject(raw);
    if (String(edge.from ?? '') !== id && String(edge.to ?? '') !== id) continue;
    const state = asObject(states[relationshipKeyFromEdge(edge)]);
    const scarred = listOf(state.recentIncidents).some((row) => DECEPTION_INCIDENTS.includes(String(asObject(row).type ?? '')));
    if (scarred) held += clamp01(finiteNumber(state.resentment, 0));
  }
  return clamp01(held);
}

/**
 * THE SUSPICION READ. Dark, or for a court the snapshot does not hold, the quiet reading. The
 * `terms` name which receipts spoke, so a surface can say why without a number.
 * @param {{ worldState: unknown, snapshot: unknown, settlementId: unknown, mirrorGapOf?: MirrorGapReader|null }} args
 * @returns {SuspicionReading}
 */
export function suspicionOf({ worldState, snapshot, settlementId, mirrorGapOf = null }) {
  const id = String(settlementId ?? '');
  if (!id || !counterIntelActive(worldState)) return quietReading(id);
  const world = asObject(worldState);
  const T = SUSPICION_TUNING;
  const record = courtRecordOf(snapshot, id);
  const scandal = Object.keys(record).length && activeArchetypes(record).includes('corruption_exposed') ? 1 : 0;
  const grievance = heldDeception01(world, snapshot, id);
  const mirror = typeof mirrorGapOf === 'function' ? clamp01(finiteNumber(mirrorGapOf(id), 0)) : 0;
  const score01 = clamp01(T.scandalWeight * scandal + T.grievanceWeight * grievance + T.mirrorWeight * mirror);
  const rank = score01 >= T.decisiveAt ? 3 : score01 >= T.pressingAt ? 2 : score01 >= T.presentAt ? 1 : 0;
  const terms = [scandal ? 'scandal' : '', grievance > 0 ? 'grievance' : '', mirror > 0 ? 'mirror' : ''].filter(Boolean);
  return Object.freeze({ settlementId: id, band: SUSPICION_BANDS[rank], rank, score01, terms: Object.freeze(terms) });
}

/**
 * THE ZEAL (SP-4 consumed, never re-derived): a DM-directed word wins; else the court's own
 * posture factor and the word its direction reads as.
 * @param {unknown} worldState @param {string} settlementId @param {unknown} [directed]
 * @returns {{ word: string, factor: number }}
 */
export function zealOf(worldState, settlementId, directed = null) {
  const cap = POSTURE_TUNING.THRESHOLD_CAP;
  if (directed === 'paranoid') return { word: 'paranoid', factor: 1 - cap };
  if (directed === 'trusting') return { word: 'trusting', factor: 1 + cap };
  if (directed === 'measured') return { word: 'measured', factor: 1 };
  const world = asObject(worldState);
  const posture = courtPostureOf({ kind: 'settlement', id: String(settlementId) }, asObject(world.dispositionStats)[String(settlementId)] ?? null, { rules: world.simulationRules });
  const word = posture.direction === 'lower' ? 'paranoid' : posture.direction === 'raise' ? 'trusting' : 'measured';
  return { word, factor: posture.factor };
}

/** Does the reading clear the (posture-scaled) entry threshold?
 *  @param {SuspicionReading} reading @param {{ factor: number }} zeal @returns {boolean} */
export function suspicionClears(reading, zeal) {
  return reading.rank > 0 && reading.score01 >= SUSPICION_TUNING.clearsAt * zeal.factor;
}

// ── castDoubt's WORLD SIDE ────────────────────────────────────────────────────
/**
 * The discount a court's suspicion lays on a claim it hears, composed onto the mouthpiece
 * plane's weight by the caller (settlement credibility times the speaker's). Quiet or dark, it
 * is EXACTLY 1, so the product is byte-identical; each band above quiet takes a third of the
 * way to the floor.
 * @param {SuspicionReading} reading @returns {number}
 */
export function suspicionDoubt(reading) {
  if (!reading.rank) return 1;
  return 1 - (1 - SUSPICION_TUNING.doubtFloor) * (reading.rank / (SUSPICION_BANDS.length - 1));
}

/**
 * The head's one call for castDoubt: the doubt the AUDIENCE of a planted claim lays on it.
 * @param {{ worldState: unknown, snapshot: unknown, settlementId: unknown }} args @returns {number}
 */
export function claimDoubtOf({ worldState, snapshot, settlementId }) {
  if (!counterIntelActive(worldState)) return 1;
  return suspicionDoubt(suspicionOf({ worldState, snapshot, settlementId }));
}

// ── HIDE-AS-ANSWER (the deliberate entry path) ────────────────────────────────
/**
 * HIDE's response entry path, wrapped around the head's own secrecy advance. Dark, the SAME
 * reference comes back. Lit, a court whose suspicion clears its posture-scaled threshold holds
 * its gates shut: a standing posture is kept (never re-stamped), and a court with none opens one
 * at the head's own entry level, by decision rather than by the loaded dice. A court whose
 * suspicion has decayed is left to the ambient exit law, so its gates reopen once the pressure
 * ebbs and the dwell passes: no ambient paranoia ratchet.
 * @param {Record<string, unknown>|null} nextSecrecy the head's `processSecrecy` result
 * @param {{ worldState: unknown, snapshot: unknown, priorSecrecy: unknown, tick: number,
 *   tuning: { HIDE_ENTER: number } }} args
 * @returns {Record<string, unknown>|null}
 */
export function secrecyInAnswer(nextSecrecy, { worldState, snapshot, priorSecrecy, tick, tuning }) {
  if (!counterIntelActive(worldState)) return nextSecrecy;
  const next = { ...asObject(nextSecrecy) };
  const prior = asObject(priorSecrecy);
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  let changed = false;
  const ids = [...new Set(listOf(asObject(snapshot).settlements).map((row) => String(asObject(row).id ?? '')))].filter(Boolean).sort(compareCodepoint);
  for (const id of ids) {
    if (next[id]) continue;
    const reading = suspicionOf({ worldState, snapshot, settlementId: id });
    if (!suspicionClears(reading, zealOf(worldState, id))) continue;
    next[id] = prior[id] ? prior[id] : { level01: clamp01(tuning.HIDE_ENTER), enteredTick: now };
    changed = true;
  }
  if (!changed) return nextSecrecy;
  /** @type {Record<string, unknown>} */
  const sorted = {};
  for (const key of Object.keys(next).sort(compareCodepoint)) sorted[key] = next[key];
  return sorted;
}
