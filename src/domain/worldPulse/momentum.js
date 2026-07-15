/**
 * domain/worldPulse/momentum.js — W-MOMENTUM: BELIEF & DECISION MOMENTUM.
 * (design DESIGN_MOMENTUM.md — THE FINAL ENGINE WAVE, the psychology of being seen.)
 *
 * The strategy chooser is MEMORYLESS: it re-enumerates and re-samples every tick with no
 * sunk-cost term, and every CHOSEN exit (recall, de-mobilize, abandon, sue-for-peace) is
 * FREE. So the doomed-war-knowingly-pursued cannot happen — the engine's actors are more
 * rational than people. This wave adds the missing layer: a COMMITMENT STOCK per
 * actor-and-course (Stage 1, this file), an entity-appropriate THRESHOLD (Stage 2), a set
 * of bounded consumption factors (Stage 3), and a priced climb-down CONSEQUENCE (Stage 4)
 * — plus the full counterforce set that keeps the cliff FINITE (design §4). Weights, never
 * walls: no absorbing state, the crack reachable from every state.
 *
 * STAGE 1 — THE COMMITMENT LEDGER (design §1). `spatialLedgers.commitments`, keyed
 * `${actorId}>${courseKey}` over a BOUNDED course taxonomy (war/peace/campaign/contest/
 * blockade — typed, never freetext). Records { stock, sinceTick, lastDepositTick, deposits:
 * capped typed list (the receipts) }. The fold discipline is copied VERBATIM from the
 * credibility ledger (informationStatecraft.js advanceCredibility): decay-all-to-now
 * (half-life, soak-tunable), fold id-sorted deterministic deposits, clamp, prune-below-
 * epsilon, drop-when-empty, serialize-compare, gate-dark ⇒ immediate no-op.
 *
 * DEPOSITS ARE READS, NOT ROLLS (design §1): the legible public acts already in state
 * deposit deterministically — a live siege, mobilization rungs climbed (the rousing of a
 * populace), a covert supply-web campaign, a blockade thrown across a port. LOUDNESS IS THE
 * MEASURE (design §1): covert acts deposit little; inciting your own population deposits
 * most (the owner's war-despite-the-drawbacks scenario, mechanical). NO new rng draws
 * anywhere — post-sum, centered reads only (the stream-position law, constitutional §H).
 *
 * DORMANCY (constitutional §6/§8): the whole layer nests under spatialLedgers (set/get/drop)
 * and lights on momentumActive = beliefsActive AND the VIRTUAL flag
 * simulationRules.momentumEnabled === true. That flag has NO entry in
 * DEFAULT_SIMULATION_RULES (the supplyWebWarfareEnabled / infoStatecraftEnabled idiom), so
 * every existing golden — including the belief/rumor/peace tripwires that run at a LIVE
 * infoMode WITHOUT this flag — is byte-identical. Absent ledger ⇒ prior bytes exactly.
 *
 * PURE + lazy: imported ONLY by the dynamically-loaded pulse kernel (a lazy engine leaf) —
 * zero first-paint bytes. No Date, no Math.random, no tier/auth reads; all folds
 * codepoint-sorted.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive } from './beliefMap.js';
import { mobilizationSeverity } from './mobilization.js';
import { ARMY_ROLES } from '../spatial/armyTransit.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Small pure helpers (the informationStatecraft idiom) ────────────────────────
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── TUNING (bounded named constants — the soak owns the exact heights; design §7) ──
export const MOMENTUM_TUNING = Object.freeze({
  // THE LIMIT CLAUSE (design §2, owner-verbatim): past the cliff, redirecting a course is
  // ~an ORDER OF MAGNITUDE harder — a finite multiplier on the reconsideration weight,
  // NEVER a wall (Stage 3 consumes it). Soak-tunable.
  CLIFF_MULT: 10,
  // Generational half-life (ticks): a commitment fades toward nothing without reinforcement
  // (52 ≈ a game-year at one-week ticks — "the war nobody feeds quietly ends"). Past
  // MAX_LOOKBACK the stock is spent (prune ⇒ byte-identical-dormant).
  HALF_LIFE_TICKS: 52,
  MAX_LOOKBACK_TICKS: 260,
  // Stock saturation + the per-tick loudness→stock scale.
  STOCK_MAX: 12,
  DEPOSIT_SCALE: 1.0,
  // Prune a course whose decayed stock falls below this (the mark is forgotten, the ledger
  // drops it — absent ⇒ byte-identical). The one-tick read-last/write-next gap keeps this
  // off the oscillation boundary.
  PRUNE_EPSILON: 0.05,
  // The capped typed deposit list length (the receipts — the chronicle narrates these).
  RECEIPT_CAP: 8,
  // BASE cliff stock (design §2): the neutral entity's reconsideration cliff. Stage 2
  // modulates it per entity (temperament, legitimacy, court structure). A stock at/above
  // the entity's cliff ⇒ "past the cliff" ⇒ the LIMIT CLAUSE bites.
  BASE_CLIFF_STOCK: 6,
  // Per-source base LOUDNESS (design §1 — "loudness is the measure"), 0..1.
  LOUD_BLOCKADE: 0.85,      // a blockade is a maximally public act
  LOUD_SIEGE: 0.8,          // a live siege — banners in the field
  LOUD_INTERVENTION: 0.5,   // an intervention — deniable, quieter
  LOUD_CAMPAIGN: 0.4,       // indirect supply-web war is COVERT by design — a quiet deposit
  LOUD_INCITEMENT: 1.0,     // rousing your own population is the LOUDEST (the owner's scenario)
  // A covert act barely deposits (the rumor machinery knows what stays hidden).
  COVERT_LOUDNESS_MULT: 0.15,
});

// ── THE GATE (dormancy / byte-identity) ─────────────────────────────────────────
/**
 * Is the momentum layer LIT? beliefsActive (the spatial marker is present AND infoMode is
 * not omniscient — momentum is a belief-consuming psychology, which only exists then) AND
 * the virtual flag momentumEnabled === true, read defensively (absent ⇒ false ⇒ dormant).
 * NO entry in DEFAULT_SIMULATION_RULES ⇒ every existing golden is byte-identical.
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function momentumActive(worldState) {
  if (!beliefsActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).momentumEnabled === true);
}

// ── THE BOUNDED COURSE TAXONOMY (design §1 — typed, never freetext) ──────────────
/** The closed set of course kinds. A commitment is ALWAYS one of these — never freetext. */
export const COURSE_KINDS = Object.freeze(['war', 'peace', 'campaign', 'contest', 'blockade']);
const COURSE_KIND_SET = new Set(COURSE_KINDS);

/**
 * Build a bounded, typed courseKey. Returns null for an unknown kind or a missing subject
 * (the taxonomy is closed — a freetext course cannot be minted). Shapes:
 *   war:<target>  peace:<target>  campaign:<target>  contest:<target>|<side>  blockade:<port>
 * @param {{ kind: string, target?: string|number|null, side?: string|number|null, port?: string|number|null }} spec
 * @returns {string | null}
 */
export function courseKeyOf(spec) {
  const kind = spec && typeof spec === 'object' ? String(spec.kind || '') : '';
  if (!COURSE_KIND_SET.has(kind)) return null;
  if (kind === 'blockade') {
    const port = spec.port != null ? String(spec.port) : '';
    return port ? `blockade:${port}` : null;
  }
  const target = spec.target != null ? String(spec.target) : '';
  if (!target) return null;
  if (kind === 'contest') {
    const side = spec.side != null ? String(spec.side) : '';
    return side ? `contest:${target}|${side}` : null;
  }
  return `${kind}:${target}`;
}

/**
 * Parse a courseKey back into its typed parts (null for a malformed key). The inverse of
 * courseKeyOf — the narration + threshold seams read the kind/target off the key.
 * @param {string} courseKey @returns {{ kind: string, target: string, side: string|null } | null}
 */
export function parseCourseKey(courseKey) {
  const raw = String(courseKey || '');
  const colon = raw.indexOf(':');
  if (colon <= 0) return null;
  const kind = raw.slice(0, colon);
  if (!COURSE_KIND_SET.has(kind)) return null;
  const rest = raw.slice(colon + 1);
  if (!rest) return null;
  if (kind === 'contest') {
    const bar = rest.indexOf('|');
    if (bar <= 0 || bar >= rest.length - 1) return null;
    return { kind, target: rest.slice(0, bar), side: rest.slice(bar + 1) };
  }
  return { kind, target: rest, side: null };
}

/**
 * The ledger key for an (actor, course) pair: `${actorId}>${courseKey}`. Null when the
 * courseKey is malformed. @param {string} actorId @param {string} courseKey @returns {string|null}
 */
export function commitmentLedgerKey(actorId, courseKey) {
  const actor = actorId != null ? String(actorId) : '';
  const course = String(courseKey || '');
  if (!actor || !parseCourseKey(course)) return null;
  return `${actor}>${course}`;
}

/**
 * Split a ledger key back into { actorId, courseKey } (null when malformed). The first `>`
 * separates the actor from the course (courseKeys never contain `>`). @param {string} key
 * @returns {{ actorId: string, courseKey: string } | null}
 */
export function splitCommitmentKey(key) {
  const raw = String(key || '');
  const gt = raw.indexOf('>');
  if (gt <= 0 || gt >= raw.length - 1) return null;
  const actorId = raw.slice(0, gt);
  const courseKey = raw.slice(gt + 1);
  if (!parseCourseKey(courseKey)) return null;
  return { actorId, courseKey };
}

// ── THE ENTRY (the commitment stock + its receipts) ─────────────────────────────
/**
 * @typedef {{ tick: number, kind: string, mag: number }} CommitmentDepositReceipt
 * @typedef {Object} CommitmentEntry
 * @property {number} stock            the accumulated commitment stock (0..STOCK_MAX)
 * @property {number} sinceTick        the tick the course was first committed
 * @property {number} lastDepositTick  the tick of the most recent deposit
 * @property {CommitmentDepositReceipt[]} deposits  the capped typed receipts
 */

/** @param {unknown} raw @returns {CommitmentEntry} */
function normalizeCommitmentEntry(raw) {
  const e = asObject(raw);
  const depositsRaw = Array.isArray(e.deposits) ? e.deposits : [];
  const deposits = depositsRaw
    .map((d) => {
      const o = asObject(d);
      return { tick: Math.floor(finiteNumber(o.tick, 0)), kind: String(o.kind || ''), mag: round4(finiteNumber(o.mag, 0)) };
    })
    .filter((d) => d.kind);
  return {
    stock: clamp(finiteNumber(e.stock, 0), 0, MOMENTUM_TUNING.STOCK_MAX),
    sinceTick: Math.floor(finiteNumber(e.sinceTick, 0)),
    lastDepositTick: Math.floor(finiteNumber(e.lastDepositTick, 0)),
    deposits,
  };
}

/**
 * The decayed commitment stock as of `tick` (the generational regression toward nothing).
 * Pure arithmetic, no rng (the belief-decay discipline). Past MAX_LOOKBACK the stock is
 * fully spent (0). @param {CommitmentEntry | null | undefined} entry @param {number} tick
 * @returns {number}
 */
export function decayedCommitmentStock(entry, tick) {
  if (!entry || typeof entry !== 'object') return 0;
  const stock = finiteNumber(entry.stock, 0);
  if (stock <= 0) return 0;
  const T = MOMENTUM_TUNING;
  const age = Math.max(0, Math.floor(finiteNumber(tick, 0)) - Math.floor(finiteNumber(entry.lastDepositTick, 0)));
  if (age > T.MAX_LOOKBACK_TICKS) return 0;
  return stock * Math.pow(0.5, age / Math.max(1, T.HALF_LIFE_TICKS));
}

/**
 * Read an actor's decayed commitment stock on a course from the live ledger (0 when absent
 * — the uncommitted anchor). @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} actorId @param {string} courseKey @param {number} tick @returns {number}
 */
export function commitmentStockOf(worldState, actorId, courseKey, tick) {
  const key = commitmentLedgerKey(actorId, courseKey);
  if (!key) return 0;
  const ledger = asObject(getSpatialLedger(worldState, 'commitments'));
  return decayedCommitmentStock(normalizeCommitmentEntry(ledger[key]), Math.floor(finiteNumber(tick, 0)));
}

// ── DEPOSITS ARE READS (design §1 — the legible public acts already in state) ────
/**
 * @typedef {{ actorId: string, courseKey: string, kind: string, magnitude01: number }} CommitmentDeposit
 */

/**
 * Read this tick's commitment DEPOSITS off the legible public acts already in state, each
 * scaled by LOUDNESS (design §1). PURE — reads only; NO rng (the stream-position law). The
 * sources covered here (a clean first set; declareCasus decrees, treaties-signed, and
 * lies-in-service are seam-noted below for the follow-up pass):
 *   • BLOCKADES (navalTransit BLOCKADE records) — course blockade:<port>, maximally loud.
 *   • LIVE SIEGES / WARS (deployments) — course war:<target>, loud by role.
 *   • INCITEMENT (warPosture mobilization on a live war) — rousing the populace is loudest;
 *     a COVERT preparation barely deposits.
 *   • SUPPLY-WEB CAMPAIGNS (campaignPlans) — course campaign:<target>, quiet (covert war).
 * Empty when dormant ⇒ the fold is a no-op ⇒ byte-identical.
 * @param {{ spatialLedgers?: unknown, deployments?: unknown, warPosture?: unknown, simulationRules?: Record<string, unknown>, spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {CommitmentDeposit[]}
 */
export function commitmentDepositsFor(worldState) {
  if (!momentumActive(worldState)) return [];
  const T = MOMENTUM_TUNING;
  /** @type {CommitmentDeposit[]} */
  const out = [];
  const push = (/** @type {string} */ actorId, /** @type {string|null} */ courseKey, /** @type {string} */ kind, /** @type {number} */ mag01) => {
    if (!actorId || !courseKey) return;
    const m = clamp01(finiteNumber(mag01, 0));
    if (m <= 0) return;
    out.push({ actorId: String(actorId), courseKey, kind, magnitude01: m });
  };

  // 1. BLOCKADES — the loudest single act (a fleet across a hostile port's approaches).
  const naval = asObject(getSpatialLedger(worldState, 'navalTransit'));
  for (const k of Object.keys(naval).sort(compareCodepoint)) {
    const rec = asObject(naval[k]);
    if (String(rec.role) !== ARMY_ROLES.BLOCKADE) continue;
    const port = rec.targetId != null ? String(rec.targetId) : '';
    const owner = rec.ownerId != null ? String(rec.ownerId) : '';
    if (!port || !owner) continue;
    push(owner, courseKeyOf({ kind: 'blockade', port }), 'blockade', T.LOUD_BLOCKADE);
  }

  // 2. LIVE SIEGES / WARS + INCITEMENT (a live deployment on a target IS a committed war).
  // The gate guaranteed a non-null worldState; asObject narrows it for the property reads.
  const ws = asObject(worldState);
  const deployments = asObject(ws.deployments);
  const warPosture = asObject(ws.warPosture);
  for (const actorId of Object.keys(deployments).sort(compareCodepoint)) {
    const dep = asObject(deployments[actorId]);
    if (dep.recalled || dep.targetId == null) continue;
    const target = String(dep.targetId);
    const role = String(dep.role || 'siege');
    const warCourse = courseKeyOf({ kind: 'war', target });
    push(actorId, warCourse, 'siege', role === 'intervene' ? T.LOUD_INTERVENTION : T.LOUD_SIEGE);
    // INCITEMENT: an OVERT mobilization on this war = rousing the populace (the loudest
    // deposit — the owner's scenario). mobilizationSeverity peaks at 0.5 (mobilized) —
    // normalize to 0..1 so a full war-footing is the maximum. A COVERT preparation barely
    // deposits (the population was never publicly rallied).
    const posture = asObject(warPosture[actorId]);
    const sev01 = clamp01(mobilizationSeverity(String(posture.state)) / 0.5);
    if (sev01 > 0) {
      const covertMult = posture.covert === true ? T.COVERT_LOUDNESS_MULT : 1;
      push(actorId, warCourse, 'incitement', T.LOUD_INCITEMENT * sev01 * covertMult);
    }
  }

  // 3. SUPPLY-WEB CAMPAIGNS — indirect war, covert by design ⇒ a quiet deposit.
  const campaigns = asObject(getSpatialLedger(worldState, 'campaignPlans'));
  for (const actorId of Object.keys(campaigns).sort(compareCodepoint)) {
    const plan = asObject(campaigns[actorId]);
    if (plan.targetId == null) continue;
    push(actorId, courseKeyOf({ kind: 'campaign', target: String(plan.targetId) }), 'campaign', T.LOUD_CAMPAIGN);
  }

  // SEAM NOTES — the remaining legible-act deposit sources (design §1), deferred to the
  // follow-up pass with clean boundaries (each is a pure read added to this reader):
  //   • declareCasus decrees → deposit into war:<target> at DECREE loudness (warReasons ledger).
  //   • treaties signed → deposit into peace:<counterparty> (the celebrated-peace commitment,
  //     the unification law — a peace is as hard to abandon as a war).
  //   • lies-in-service → a LIE seeded in a course's service deposits into that course
  //     (informationStatecraft posture ledger, the loudness of the lie's spread).
  return out;
}

// ── THE FOLD (design §1 — copied VERBATIM from advanceCredibility's discipline) ──
/**
 * Fold this tick's deposits into the commitments ledger: decay every prior course's stock
 * to `now` (the generational regression), apply the deposits (loudness→stock, clamped to
 * STOCK_MAX), append the typed receipts (capped), prune spent courses, persist
 * codepoint-sorted (drop-when-empty ⇒ byte-identical-dormant). Deterministic; order-stable
 * (deposits folded ledger-key-sorted then kind then magnitude, so same-course folds are
 * permutation-independent under the clamp). DORMANT ⇒ an immediate no-op (no key, no change).
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, deployments?: unknown, warPosture?: unknown } | null | undefined} args.worldState
 * @param {number} args.tick
 * @param {CommitmentDeposit[] | null} [args.deposits] pre-read deposits; defaults to commitmentDepositsFor(worldState)
 * @returns {{ worldState: unknown, changed: boolean }}
 */
export function advanceCommitments({ worldState, tick, deposits = null }) {
  if (!momentumActive(worldState)) {
    return { worldState, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const T = MOMENTUM_TUNING;
  const prior = asObject(getSpatialLedger(worldState, 'commitments'));
  const reads = Array.isArray(deposits) ? deposits : commitmentDepositsFor(worldState);

  // Decay every prior course to `now`, carrying the decayed stock forward.
  /** @type {Map<string, CommitmentEntry>} */
  const carried = new Map();
  for (const key of Object.keys(prior).sort(compareCodepoint)) {
    const e = normalizeCommitmentEntry(prior[key]);
    const decayed = decayedCommitmentStock(e, now);
    if (decayed >= T.PRUNE_EPSILON) {
      carried.set(key, { stock: decayed, sinceTick: e.sinceTick, lastDepositTick: e.lastDepositTick, deposits: e.deposits });
    }
  }

  // Fold the deposits — ledger-key-sorted, then kind, then magnitude (permutation-
  // independent under the 0..STOCK_MAX clamp, the applyDispositionDeltas discipline).
  /** @type {Array<CommitmentDeposit & { ledgerKey: string }>} */
  const ordered = [];
  for (const d of reads) {
    if (!d || d.actorId == null) continue;
    const ledgerKey = commitmentLedgerKey(String(d.actorId), String(d.courseKey));
    if (!ledgerKey) continue;
    ordered.push({ ...d, ledgerKey });
  }
  ordered.sort((a, b) => compareCodepoint(a.ledgerKey, b.ledgerKey)
    || compareCodepoint(String(a.kind), String(b.kind))
    || (clamp01(a.magnitude01) - clamp01(b.magnitude01)));
  for (const d of ordered) {
    const cur = carried.get(d.ledgerKey)
      || { stock: 0, sinceTick: now, lastDepositTick: now, deposits: [] };
    const add = clamp01(finiteNumber(d.magnitude01, 0)) * T.DEPOSIT_SCALE;
    const stock = clamp(cur.stock + add, 0, T.STOCK_MAX);
    const nextDeposits = [...cur.deposits, { tick: now, kind: String(d.kind), mag: round4(add) }].slice(-T.RECEIPT_CAP);
    carried.set(d.ledgerKey, { stock, sinceTick: cur.sinceTick, lastDepositTick: now, deposits: nextDeposits });
  }

  // Rebuild codepoint-sorted; prune spent courses (stock < epsilon) ⇒ drop-when-empty.
  /** @type {Record<string, CommitmentEntry>} */
  const next = {};
  for (const key of [...carried.keys()].sort(compareCodepoint)) {
    const e = /** @type {CommitmentEntry} */ (carried.get(key));
    const stock = round4(e.stock);
    if (stock < T.PRUNE_EPSILON) continue;
    next[key] = { stock, sinceTick: e.sinceTick, lastDepositTick: e.lastDepositTick, deposits: e.deposits };
  }

  const hasNext = Object.keys(next).length > 0;
  const prevSerialized = JSON.stringify(Object.keys(prior).length ? prior : null);
  const nextSerialized = JSON.stringify(hasNext ? next : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false };
  }
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  const nextWorldState = hasNext
    ? setSpatialLedger(ws, 'commitments', next)
    : dropSpatialLedger(ws, 'commitments');
  return { worldState: nextWorldState, changed: true };
}
