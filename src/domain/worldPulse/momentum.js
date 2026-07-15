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
// Stage 2 threshold reads (all EXPORTED, already eager via disposition ⇒ zero first-paint
// delta when pulled through this lazy leaf): the entity's alignment coordinates + the
// authored-importance weight + the legitimacy ledger.
import { computeLawfulness, computeMalice } from './disposition.js';
import { importanceWeight } from '../entities/npcs.js';
import { governanceLedger } from '../governanceLedger.js';
// Stage 4 crack — the climb-down folds its 'climb_down' charge through the credibility
// stock (a no-op when info-statecraft is dark ⇒ no credibility ledger). A lazy worldPulse
// leaf, imported only through this lazy leaf ⇒ zero first-paint. NO cycle (informationStatecraft
// does not import momentum; the belief seam threads the discount as a closure, not an import).
import { advanceCredibility } from './informationStatecraft.js';

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

/**
 * Every LIVE committed course in the ledger — (actor, course) pairs whose decayed
 * stock is still positive as of `tick`, codepoint-ordered. EXPORTED (W-COMPOSER-2):
 * the realm manifest's FORCE_RECONSIDERATION dial options and the DM apply arm wrap
 * THIS read (the same-function law over the same commitments ledger the fold owns).
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {number} [tick]
 * @returns {Array<{ actorId: string, courseKey: string, stock: number }>}
 */
export function commitmentCoursesOf(worldState, tick = 0) {
  const ledger = asObject(getSpatialLedger(worldState, 'commitments'));
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  /** @type {Array<{ actorId: string, courseKey: string, stock: number }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const split = splitCommitmentKey(key);
    if (!split) continue;
    const stock = decayedCommitmentStock(normalizeCommitmentEntry(ledger[key]), now);
    if (stock <= 0) continue;
    out.push({ actorId: split.actorId, courseKey: split.courseKey, stock: round4(stock) });
  }
  return out;
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

// ════════════════════════════════════════════════════════════════════════════════
// STAGE 2 — THE THRESHOLD (design §2: entity-appropriate, alignment-shaped, NPC-rooted)
// ════════════════════════════════════════════════════════════════════════════════
// Below the cliff, reconsideration is FREE PHYSICS (today's behavior, unchanged bytes).
// Past the cliff, THE LIMIT CLAUSE (owner-verbatim): redirecting is ~an ORDER OF MAGNITUDE
// harder (CLIFF_MULT), NEVER certain — weights, never walls, no absorbing state. The cliff
// HEIGHT derives from all-existing, all-bounded, all-receipted reads: the leader's
// temperament, lawful×chaos, good×evil, legitimacy fragility, and court structure.
//
// PLACEMENT (JUDGMENT — say "veto" to move it): TRAIT_MOMENTUM lives in THIS lazy leaf, not
// data/npcTraitWeights.js beside its TRAIT_ALIGNMENT/TRAIT_AGGRESSION siblings. Rationale:
// momentum's ONLY consumer is the lazy pulse kernel, so the map here is ZERO first-paint;
// adding it to the light npcTraitWeights leaf (an EAGER member via corruption.js) would add
// ~1 kB to the entry closure for no eager consumer — the strongest form of the FP-G3
// light-leaf principle the design §5 cites ("placement follows the light-leaf pattern
// consciously").

/**
 * TRAIT_MOMENTUM — signed commitment-momentum weights over the AUTHORED personality
 * descriptor vocabulary (the npcTraitWeights idiom EXACTLY: lowercase descriptor → signed
 * |w| ≤ 1; a descriptor absent from this map contributes EXACTLY 0 — neutral, so adding
 * vocabulary never silently churns a score). A POSITIVE weight RAISES the reconsideration
 * cliff (holds a course past reason); a NEGATIVE weight LOWERS it (reconsiders cheap). Keys
 * are lowercased; lookups normalize case + trim. Pure data — frozen so a typo'd key reads
 * as `undefined` (→ 0). `cautious` is special: it lowers commitment ENTRY (Stage 1 deposits,
 * a seam) but not exit, so it carries a NEGATIVE cliff weight but is flagged below.
 * @type {Readonly<Record<string, number>>}
 */
export const TRAIT_MOMENTUM = Object.freeze({
  // ── raise the cliff (the crown that will not bend) ─────────────────────────
  proud: 0.7,
  arrogant: 0.65,
  stubborn: 0.8,
  obstinate: 0.75,
  tenacious: 0.7,
  dogged: 0.6,
  zealous: 0.65,
  fanatical: 0.85,
  wrathful: 0.55,
  vengeful: 0.6,
  vindictive: 0.55,
  obsessive: 0.7,
  domineering: 0.5,
  imperious: 0.5,
  ambitious: 0.4,
  ruthless: 0.45,
  defiant: 0.55,
  // ── lower the cliff (the court that reconsiders) ───────────────────────────
  humble: -0.6,
  patient: -0.55,
  pragmatic: -0.7,
  'level-headed': -0.6,
  'fair-minded': -0.4,
  opportunistic: -0.5,
  diplomatic: -0.55,
  flexible: -0.55,
  adaptable: -0.5,
  'open-minded': -0.5,
  reasonable: -0.45,
  cynical: -0.3,
  // ── cautious: lowers ENTRY not exit (Stage 1-facing; flagged in ENTRY_ONLY) ─
  cautious: -0.4,
  wary: -0.3,
});

/** Descriptors whose weight applies to commitment ENTRY (deposits) only, NOT the exit
 * cliff (design §2: "cautious lowers commitment ENTRY but not exit"). */
export const TRAIT_MOMENTUM_ENTRY_ONLY = Object.freeze(new Set(['cautious', 'wary']));

export const THRESHOLD_TUNING = Object.freeze({
  // How far temperament (signed −1..+1) swings the cliff off BASE_CLIFF_STOCK. Proud (+1) ⇒
  // ×1.7; humble (−1) ⇒ ×0.3. Soak-tunable.
  TEMPERAMENT_SPAN: 0.7,
  // A fragile seat (legitimacyFragility01 → 1) doubles down hardest — it cannot look weak.
  FRAGILITY_SPAN: 0.5,
  // A consolidated autocratic court raises the cliff (no voices force the question).
  CONSOLIDATION_SPAN: 0.4,
  // Live opposition blocs lower it (the question keeps being asked); saturating.
  OPPOSITION_SPAN: 0.5,
  OPPOSITION_SAT: 3,
  // The cliff never falls below this fraction of BASE (a finite, always-crackable floor —
  // the anti-absorbing-state guard applies to the HEIGHT too, not only CLIFF_MULT).
  CLIFF_FLOOR_FRAC: 0.2,
  // Lawful×chaos: lawfulness (0..1, 0.5 neutral) scales DEPOSITS — a lawful court is bound
  // hard by formal public acts (oaths mean things); a chaotic one loosely (reversal cheap).
  DEPOSIT_LAW_SPAN: 0.6,
  // The PROCEDURAL CRACK: a lawful court reconsidering through legitimate process pays a
  // reduced climb-down price (Stage 4 consumes this); chaotic reversals are cheap but erratic.
  PROCEDURAL_CRACK_SPAN: 0.5,
  // Good×evil: the counter-evidence EFFECTIVENESS floor for humanitarian evidence heard by a
  // fully-evil court (it hears only power). A saintly court hears humanitarian at ~full weight.
  HUMANITARIAN_EVIL_FLOOR: 0.2,
  // Power/strategic evidence penetrates every court at ~full weight (lost battles count).
  POWER_PENETRATION: 1.0,
});

// ── TEMPERAMENT (the leader's character, aggregated) ────────────────────────────
/** @param {unknown} v @returns {string[]} the authored personality descriptors of an NPC. */
function authoredMomentumTraits(v) {
  const npc = asObject(v);
  const p = npc.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  const o = asObject(p);
  return [o.dominant, o.flaw, o.modifier].filter((x) => typeof x === 'string').map(String);
}

/** The DECLARED npcTemperament facet on a custom NPC, or null (the facet law: a declared
 * facet COUNTS; inference falls back to the authored traits — byte-identical degradation).
 * Read defensively off `npc.facets.npcTemperament` / `npc.temperament` (string | string[]).
 * SEAM: formal registration of an `npcTemperament` kind through cohesionWeave.facetOf is the
 * wiring-pass follow-up; the declared read here honors the design intent today.
 * @param {unknown} v @returns {string[] | null} */
function declaredTemperamentFacet(v) {
  const npc = asObject(v);
  const facets = asObject(npc.facets);
  const raw = facets.npcTemperament != null ? facets.npcTemperament : npc.temperament;
  if (raw == null) return null;
  if (typeof raw === 'string') return raw.trim() ? [raw] : null;
  if (Array.isArray(raw)) {
    const list = raw.filter((x) => typeof x === 'string' && x.trim());
    return list.length ? list.map(String) : null;
  }
  return null;
}

/**
 * The signed commitment-momentum score for ONE NPC's temperament (Σ of TRAIT_MOMENTUM
 * weights, clamped to −1..+1). FACET LAW: a declared npcTemperament facet wins; else the
 * authored personality descriptors are read (byte-identical degradation). A trait-free NPC
 * scores EXACTLY 0 (the neutral anchor). @param {unknown} npc @returns {number}
 */
export function npcMomentumScore(npc) {
  const declared = declaredTemperamentFacet(npc);
  const traits = declared && declared.length ? declared : authoredMomentumTraits(npc);
  let score = 0;
  for (const t of traits) {
    const w = /** @type {Record<string, number>} */ (TRAIT_MOMENTUM)[String(t).trim().toLowerCase()];
    if (Number.isFinite(w)) score += w;
  }
  return clamp(score, -1, 1);
}

/**
 * The settlement's aggregate temperament momentum: the importance-weighted mean of its NPCs'
 * npcMomentumScore (the personalityDrive shape — the governing-power factor is a single
 * settlement-level scalar applied to every NPC, so it CANCELS in the weighted mean; the
 * operative lens is authored importance, exactly as personalityDrive resolves in practice).
 * A settlement with NO scoring NPCs — personality-less structural leaders, the trait-free
 * anchor — returns EXACTLY 0 (the neutral anchor, the absent-⇒-0 law). Order-independent.
 * @param {{ npcs?: unknown } | null | undefined} settlement @returns {number} signed −1..+1
 */
export function temperamentMomentumOf(settlement) {
  const s = asObject(settlement);
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  if (!npcs.length) return 0;
  let weighted = 0;
  let totalWeight = 0;
  for (const npc of npcs) {
    const score = npcMomentumScore(npc);
    if (score === 0) continue; // no authored temperament signal — contributes nothing
    const w = importanceWeight(/** @type {import('../entities/npcs.js').NpcLike} */ (/** @type {unknown} */ (npc)));
    if (!(w > 0)) continue;
    weighted += score * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? clamp(weighted / totalWeight, -1, 1) : 0;
}

// ── THE CLIFF (the entity-appropriate reconsideration threshold) ────────────────
/**
 * Derive an entity's reconsideration cliff STOCK from the bounded reads (design §2). All
 * inputs default to the NEUTRAL value, so an unmodulated entity's cliff is EXACTLY
 * BASE_CLIFF_STOCK. The cliff is always ≥ CLIFF_FLOOR_FRAC×BASE (a finite, always-crackable
 * height — the anti-absorbing-state guard). PURE.
 * @param {{ temperament?: number, legitimacyFragility01?: number, consolidation01?: number, oppositionBlocs?: number }} [inputs]
 * @returns {number}
 */
export function cliffStockFor(inputs = {}) {
  const H = THRESHOLD_TUNING;
  const base = MOMENTUM_TUNING.BASE_CLIFF_STOCK;
  const temperament = clamp(finiteNumber(inputs.temperament, 0), -1, 1);
  const fragility = clamp01(finiteNumber(inputs.legitimacyFragility01, 0));
  const consolidation = clamp01(finiteNumber(inputs.consolidation01, 0));
  const opposition = Math.max(0, finiteNumber(inputs.oppositionBlocs, 0));
  let cliff = base * (1 + H.TEMPERAMENT_SPAN * temperament);   // proud raises, humble lowers
  cliff *= (1 + H.FRAGILITY_SPAN * fragility);                  // fragile seat doubles down hardest
  cliff *= (1 + H.CONSOLIDATION_SPAN * consolidation);         // consolidated court: no voices
  cliff *= (1 - H.OPPOSITION_SPAN * clamp01(opposition / H.OPPOSITION_SAT)); // blocs keep asking
  return Math.max(cliff, base * H.CLIFF_FLOOR_FRAC);
}

/**
 * THE LIMIT CLAUSE (design §2, owner-verbatim). The reconsideration MULTIPLIER at a given
 * commitment stock vs the entity's cliff: EXACTLY 1.0 below the cliff (free physics —
 * today's bytes), ramping to CLIFF_MULT (the order-of-magnitude wall) as the stock climbs
 * to 2× the cliff, then CAPPED at CLIFF_MULT — FINITE, never a wall. Weights, never walls:
 * counter-pressure past the cliff still cracks the course; there is no absorbing state.
 * @param {number} stock @param {number} cliff @returns {number} 1..CLIFF_MULT
 */
export function reconsiderationMultiplier(stock, cliff) {
  const s = Math.max(0, finiteNumber(stock, 0));
  const c = Math.max(1e-6, finiteNumber(cliff, MOMENTUM_TUNING.BASE_CLIFF_STOCK));
  if (s < c) return 1; // below the cliff ⇒ EXACTLY 1.0 (byte-identity anchor)
  const over = clamp01((s - c) / c); // 0 at the cliff, 1 at 2×cliff
  return 1 + (MOMENTUM_TUNING.CLIFF_MULT - 1) * over;
}

/** True iff the stock is at or past the entity's cliff (the doubling-down regime).
 * @param {number} stock @param {number} cliff @returns {boolean} */
export function pastCliff(stock, cliff) {
  return Math.max(0, finiteNumber(stock, 0)) >= Math.max(1e-6, finiteNumber(cliff, MOMENTUM_TUNING.BASE_CLIFF_STOCK));
}

// ── LAWFUL × CHAOS (deposits + the procedural crack) ────────────────────────────
/**
 * The deposit SCALE for a court's lawfulness (design §2): a lawful court (lawfulness01 → 1)
 * is bound HARD by formal public acts (its oaths mean things); a chaotic one (→ 0) loosely
 * (its public expects caprice — reversal is cheap because nothing was ever quite promised).
 * NEUTRAL (0.5) ⇒ EXACTLY 1.0 (byte-neutral). @param {number} lawfulness01 @returns {number}
 */
export function depositScaleFor(lawfulness01) {
  const l = clamp01(finiteNumber(lawfulness01, 0.5));
  return 1 + THRESHOLD_TUNING.DEPOSIT_LAW_SPAN * (2 * l - 1);
}

/**
 * The PROCEDURAL-CRACK relief (design §2): a lawful court reconsidering through legitimate
 * process pays a REDUCED climb-down price (Stage 4 consumes this as a 0..1 discount on the
 * priced consequence). A chaotic court gets no procedural relief (its reversals are cheap
 * but erratic). NEUTRAL/chaotic ⇒ 0 (no relief). @param {number} lawfulness01 @returns {number}
 */
export function proceduralCrackRelief(lawfulness01) {
  const l = clamp01(finiteNumber(lawfulness01, 0.5));
  return THRESHOLD_TUNING.PROCEDURAL_CRACK_SPAN * clamp01(2 * l - 1); // 0 at/below neutral, up at lawful
}

// ── GOOD × EVIL (the evidence-class-aware conscience door) ───────────────────────
/** The two evidence classes a counter-report can carry (design §2). */
export const EVIDENCE_CLASSES = Object.freeze(['humanitarian', 'power']);

/**
 * The counter-evidence EFFECTIVENESS through a court's cliff, EVIDENCE-CLASS-AWARE (design
 * §2 — "same cliff height, different doors through it"). Returns a 0..1 weight on
 * contradicting evidence past the cliff (1 = penetrates at full weight; lower = discounted):
 *  • POWER evidence (lost battles, broken supply, counter-coalitions) penetrates EVERY court
 *    at ~full weight — even an evil court hears power.
 *  • HUMANITARIAN evidence (atrocity receipts, civilian cost, a court's own suffering) cuts
 *    through a GOOD court (malice → 0) at near-full weight (the conscience hears the dead),
 *    but an EVIL court (malice → 1) discounts it toward HUMANITARIAN_EVIL_FLOOR (it hears
 *    only power). A neutral court (malice 0.5) sits in between.
 * @param {{ malice01?: number, evidenceClass?: string }} args @returns {number}
 */
export function counterEvidenceEffectiveness({ malice01 = 0.5, evidenceClass = 'power' } = {}) {
  const H = THRESHOLD_TUNING;
  if (evidenceClass !== 'humanitarian') return H.POWER_PENETRATION; // power (or unknown) — full
  const malice = clamp01(finiteNumber(malice01, 0.5));
  // Saintly (malice 0) ⇒ ~1; fully evil (malice 1) ⇒ HUMANITARIAN_EVIL_FLOOR.
  return H.HUMANITARIAN_EVIL_FLOOR + (1 - H.HUMANITARIAN_EVIL_FLOOR) * (1 - malice);
}

// ── THE ENTITY WIRING (all-existing reads → the cliff) ──────────────────────────
/**
 * Gather an entity's cliff inputs from state: temperament (its NPCs' TRAIT_MOMENTUM), the
 * legitimacy fragility (governanceLedger — a low legitimacyScore ⇒ fragile ⇒ doubles down),
 * and the alignment coordinates (computeLawfulness/computeMalice) the deposit-scale and
 * conscience-door read. Court structure (consolidation / opposition blocs) is passed through
 * from `courtStructure` — the settlementPolitics bloc reader is a bounded wiring-pass seam
 * (defaults to neutral 0 ⇒ byte-neutral until wired). PURE.
 * @param {{ settlement?: unknown } | Record<string, unknown> | null | undefined} item a snapshot settlement item
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {{ consolidation01?: number, oppositionBlocs?: number }} [courtStructure]
 * @returns {{ temperament: number, lawfulness01: number, malice01: number, legitimacyFragility01: number, cliff: number, depositScale: number }}
 */
export function entityThreshold(item, worldState, courtStructure = {}) {
  const settlement = asObject(asObject(item).settlement || item);
  const alignItem = /** @type {import('./disposition.js').AlignmentItem} */ (/** @type {unknown} */ (item));
  const alignSrc = /** @type {import('./disposition.js').AlignmentActsSource} */ (/** @type {unknown} */ (worldState));
  const temperament = temperamentMomentumOf(settlement);
  const lawfulness01 = clamp01(finiteNumber(computeLawfulness(alignItem, alignSrc), 0.5));
  const malice01 = clamp01(finiteNumber(computeMalice(alignItem, alignSrc), 0.5));
  const gl = governanceLedger(/** @type {import('../governanceLedger.js').GovernanceLedgerSource} */ (/** @type {unknown} */ (settlement)));
  // Fragility: a LOW legitimacyScore is a fragile seat. present:false ⇒ neutral 50 ⇒ 0 fragility.
  const legitimacyFragility01 = gl && gl.present
    ? clamp01((50 - finiteNumber(gl.legitimacyScore, 50)) / 50)
    : 0;
  const consolidation01 = clamp01(finiteNumber(courtStructure.consolidation01, 0));
  const oppositionBlocs = Math.max(0, finiteNumber(courtStructure.oppositionBlocs, 0));
  const cliff = cliffStockFor({ temperament, legitimacyFragility01, consolidation01, oppositionBlocs });
  return { temperament, lawfulness01, malice01, legitimacyFragility01, cliff, depositScale: depositScaleFor(lawfulness01) };
}

// ════════════════════════════════════════════════════════════════════════════════
// STAGE 3 — CONSUMPTION FACTORS (design §3: each a bounded centered-on-1.0 factor;
// dormant ⇒ EXACTLY ×1). Built here PURE + DORMANT, matching the existing consumption
// idioms (warReasonFactor / blocDecisionFactor.factorFor / makeBlaineyCredibilityFn) so
// the injection into settlementStrategy, reconcileBelief, and the pulse kernel is
// MECHANICAL. Nothing here is wired yet ⇒ byte-identical by construction.
// ════════════════════════════════════════════════════════════════════════════════

export const CONSUMPTION_TUNING = Object.freeze({
  // The strategy chooser (design §3.1): a course-CONSISTENT move is weighted UP; a
  // course-REVERSING move DOWN, and past the cliff the reversal weight divides by the
  // LIMIT CLAUSE multiplier (up to ÷CLIFF_MULT). Bounded; ×1 at stock 0.
  CONSISTENT_W: 0.4,
  REVERSAL_W: 0.5,
  // The belief discount (design §3.2): a bounded, course-scoped motivated-reasoning
  // discount on reports contradicting the observer's own committed course. FLOOR > 0 so it
  // can only SLOW convergence, never invert it (the recon's limit-clause guarantee). Scaled
  // by how far past the cliff the observer is committed.
  DISCOUNT_FLOOR: 0.4,
  DISCOUNT_W: 0.6,
  // The plan/doctrine abandon floor (design §3.3): supplyWebWarfare's ABANDON floor scales
  // UP with commitment (a committed strangler holds a marginal campaign longer).
  ABANDON_FLOOR_W: 0.5,
});

/** The relation a candidate move bears to a committed course (design §3.1). */
export const COURSE_RELATIONS = Object.freeze(['consistent', 'reversal', 'neutral']);

/**
 * The course-consistency FACTOR (design §3.1) — a centered-on-1.0 multiplier on a move's
 * weight given the actor's commitment stock, the entity cliff, and the move's relation to
 * the committed course. EXACTLY 1.0 at stock 0 (byte-identity: an uncommitted actor behaves
 * as today). A CONSISTENT move is weighted up (bounded); a REVERSAL down, DIVIDED by the
 * LIMIT CLAUSE multiplier past the cliff (up to ÷CLIFF_MULT — the order-of-magnitude wall,
 * finite). NEUTRAL ⇒ 1. @param {{ stock?: number, cliff?: number, relation?: string }} args
 * @returns {number}
 */
export function courseConsistencyFactor({ stock = 0, cliff = MOMENTUM_TUNING.BASE_CLIFF_STOCK, relation = 'neutral' } = {}) {
  const s = Math.max(0, finiteNumber(stock, 0));
  if (s <= 0) return 1; // uncommitted ⇒ EXACTLY 1.0 (byte-identity anchor)
  const c = Math.max(1e-6, finiteNumber(cliff, MOMENTUM_TUNING.BASE_CLIFF_STOCK));
  const depth = clamp01(s / c); // 0..1 approach to the cliff
  const C = CONSUMPTION_TUNING;
  if (relation === 'consistent') return 1 + C.CONSISTENT_W * depth;
  if (relation === 'reversal') {
    const base = 1 - C.REVERSAL_W * depth;      // harder to reverse the deeper the commitment
    return base / reconsiderationMultiplier(s, c); // past the cliff ⇒ ÷ up to CLIFF_MULT
  }
  return 1;
}

/** The bounded move→course-relation map (design §3.1). A move consistent with pursuing a
 * committed WAR/CAMPAIGN course vs the same target vs a move that reverses it. Anything not
 * listed is NEUTRAL (×1) ⇒ byte-identity for the untouched moves. @param {string} move
 * @returns {'consistent'|'reversal'|'neutral'} */
export function moveCourseRelation(move) {
  const m = String(move || '');
  if (m === 'deploy' || m === 'reinforce' || m === 'intercept' || m === 'blockade') return 'consistent';
  if (m === 'sue_for_peace' || m === 'recall' || m === 'withdraw' || m === 'demobilize') return 'reversal';
  return 'neutral';
}

/**
 * Build the strategy-chooser COMMITMENT-LOAD closure (design §3.1) — the coalitionLoad
 * idiom. Returns null when momentum is dormant OR the actor holds no committed course (so
 * settlementStrategy is passed nothing ⇒ byte-identical). When present, factorFor(move,
 * targetId) is centered on 1.0: a move consistent with the actor's committed war/campaign
 * course against targetId is weighted up; a reversing move down (÷ the LIMIT CLAUSE past the
 * cliff). @param {{ spatialLedgers?: unknown, simulationRules?: Record<string, unknown>, spatialCanonVersion?: unknown } | null | undefined} worldState
 * @param {{ settlement?: unknown } | Record<string, unknown> | null | undefined} item the actor's snapshot item
 * @param {string} actorId @param {number} tick
 * @returns {{ factorFor: (move: string, targetId?: string|null) => number } | null}
 */
export function makeCommitmentLoad(worldState, item, actorId, tick) {
  if (!momentumActive(worldState)) return null;
  const ledger = asObject(getSpatialLedger(worldState, 'commitments'));
  const actor = String(actorId);
  // The actor's committed WAR/CAMPAIGN courses, keyed by target ⇒ decayed stock.
  /** @type {Map<string, number>} */
  const byTarget = new Map();
  for (const key of Object.keys(ledger)) {
    const split = splitCommitmentKey(key);
    if (!split || split.actorId !== actor) continue;
    const parsed = parseCourseKey(split.courseKey);
    if (!parsed || (parsed.kind !== 'war' && parsed.kind !== 'campaign')) continue;
    const stock = decayedCommitmentStock(normalizeCommitmentEntry(ledger[key]), Math.floor(finiteNumber(tick, 0)));
    if (stock <= 0) continue;
    byTarget.set(parsed.target, Math.max(byTarget.get(parsed.target) || 0, stock));
  }
  if (byTarget.size === 0) return null; // uncommitted ⇒ byte-identical
  const cliff = entityThreshold(item, worldState).cliff;
  return {
    factorFor: (/** @type {string} */ move, /** @type {string|null} */ targetId = null) => {
      const relation = moveCourseRelation(move);
      if (relation === 'neutral') return 1;
      // A reversal (sue_for_peace) is checked against the STRONGEST committed course when no
      // target is named; a consistent move (deploy toward T) against T's own stock.
      let stock = 0;
      if (targetId != null && byTarget.has(String(targetId))) stock = /** @type {number} */ (byTarget.get(String(targetId)));
      else if (relation === 'reversal') { for (const v of byTarget.values()) stock = Math.max(stock, v); }
      if (stock <= 0) return 1;
      return courseConsistencyFactor({ stock, cliff, relation });
    },
  };
}

/**
 * Build the BELIEF-DISCOUNT closure the belief layer consumes at reconcileBelief (design
 * §3.2 — the makeBlaineyCredibilityFn precedent EXACTLY). Returns null when momentum is
 * dormant OR no commitments ledger has materialized ⇒ reconcileBelief is passed nothing ⇒
 * byte-identical. When present, discountFor(observerId, subjectId) is a bounded 0..1 weight
 * on a report about `subject` that CONTRADICTS the observer's committed course against that
 * subject: EXACTLY 1.0 when the observer holds no such committed course (byte-identity), and
 * regressing toward DISCOUNT_FLOOR (never 0 — it can only SLOW convergence, never invert it)
 * as the observer's commitment climbs past its cliff. The re-anchoring + contradiction-
 * widens-uncertainty terms in reconcileBelief run REGARDLESS — reality always eventually
 * wins (the limit clause held structurally). @param {{ spatialLedgers?: unknown, simulationRules?: Record<string, unknown>, spatialCanonVersion?: unknown } | null | undefined} worldState
 * @param {number} tick @param {((observerId: string, subjectId: string) => number) | null} [cliffOf] the observer's cliff read (defaults to BASE)
 * @returns {((observerId: string, subjectId: string) => number) | null}
 */
export function makeCommitmentDiscountFn(worldState, tick, cliffOf = null) {
  if (!momentumActive(worldState)) return null;
  const ledger = asObject(getSpatialLedger(worldState, 'commitments'));
  if (Object.keys(ledger).length === 0) return null; // no materialized commitments ⇒ byte-identical
  const now = Math.floor(finiteNumber(tick, 0));
  const C = CONSUMPTION_TUNING;
  return (/** @type {string} */ observerId, /** @type {string} */ subjectId) => {
    // The observer's committed WAR/CAMPAIGN stock against THIS subject (max across kinds).
    let stock = 0;
    for (const kind of ['war', 'campaign']) {
      const key = commitmentLedgerKey(String(observerId), `${kind}:${String(subjectId)}`);
      if (!key || !(key in ledger)) continue;
      stock = Math.max(stock, decayedCommitmentStock(normalizeCommitmentEntry(ledger[key]), now));
    }
    if (stock <= 0) return 1; // uncommitted about this subject ⇒ EXACTLY 1.0 (byte-identity)
    const cliff = typeof cliffOf === 'function'
      ? Math.max(1e-6, finiteNumber(cliffOf(String(observerId), String(subjectId)), MOMENTUM_TUNING.BASE_CLIFF_STOCK))
      : MOMENTUM_TUNING.BASE_CLIFF_STOCK;
    const depth = clamp01(stock / cliff);
    // Weight regresses toward DISCOUNT_FLOOR as commitment deepens — bounded below by the
    // floor so it only SLOWS convergence (never inverts it).
    return clamp(1 - C.DISCOUNT_W * depth, C.DISCOUNT_FLOOR, 1);
  };
}

/**
 * The plan/doctrine ABANDON-FLOOR scale (design §3.3): supplyWebWarfare's abandon floor
 * scales UP with the aggressor's commitment on the campaign course (a committed strangler
 * holds a marginal campaign longer). Centered so an uncommitted / dormant read is EXACTLY
 * 1.0 (byte-identity). @param {{ spatialLedgers?: unknown, simulationRules?: Record<string, unknown>, spatialCanonVersion?: unknown } | null | undefined} worldState
 * @param {string} aggressorId @param {string} targetId @param {number} tick @param {number} [cliff]
 * @returns {number} ≥ 1.0
 */
export function abandonFloorScale(worldState, aggressorId, targetId, tick, cliff = MOMENTUM_TUNING.BASE_CLIFF_STOCK) {
  if (!momentumActive(worldState)) return 1;
  const stock = commitmentStockOf(worldState, aggressorId, courseKeyOf({ kind: 'campaign', target: targetId }) || '', tick);
  if (stock <= 0) return 1;
  const depth = clamp01(stock / Math.max(1e-6, finiteNumber(cliff, MOMENTUM_TUNING.BASE_CLIFF_STOCK)));
  return 1 + CONSUMPTION_TUNING.ABANDON_FLOOR_W * depth;
}

// ════════════════════════════════════════════════════════════════════════════════
// STAGE 4 — THE CRACK (design §4). The climb-down as a PRICED CONSEQUENCE — E0-exempt
// (consequences are never censored). Built here PURE + DORMANT: the priced-crack
// primitives (the credibility 'climb_down' delta producer + the face-saving relief) + the
// FORCE_RECONSIDERATION verb (registrable shape — the W-COMPOSER-2 lift). The live crack
// event (legitimacyDeltas landing, succession-rerolls-the-cliff, wiring into the pulse) is
// the wiring-pass follow-up; the union kind + tuning it needs are already in place
// (informationStatecraft CredibilityDelta 'climb_down').
// ════════════════════════════════════════════════════════════════════════════════

export const CRACK_TUNING = Object.freeze({
  // The base credibility charge magnitude for a climb-down (0..1, folded through the
  // informationStatecraft CLIMB_DOWN_FALL scale). A full, un-face-saved public reversal.
  CLIMB_DOWN_MAGNITUDE: 1.0,
  // The base legitimacy hit for a climb-down (the upswingKernel legitimacyDeltas idiom —
  // consumed at the wiring pass). A public reversal spends the seat's legitimacy.
  CLIMB_DOWN_LEGITIMACY_HIT: 6,
});

/** The face-saving OFF-RAMPS (design §4 — recon-confirmed cheap exits). Each reduces the
 * climb-down price because the exit can be TOLD as a victory. `declared_resolution` is the
 * new symbolic seam-executor term ("declared victory and went home", receipted). */
export const FACE_SAVING_EXITS = Object.freeze({
  white_peace: 0.35,
  non_aggression: 0.3,
  mediation: 0.2,          // mediation's 20% soften
  declared_resolution: 0.6, // the loudest face-save — the price drops sharply
});

/** The 0..1 face-saving relief for an exit kind (0 when the exit is not a face-save ⇒ full
 * price). @param {string} exitKind @returns {number} */
export function faceSavingReliefOf(exitKind) {
  const r = /** @type {Record<string, number>} */ (FACE_SAVING_EXITS)[String(exitKind || '')];
  return Number.isFinite(r) ? clamp01(r) : 0;
}

/**
 * The PRICED climb-down (design §4). Returns the credibility delta + legitimacy hit for a
 * publicly-reversed course, REDUCED by (1) the lawful court's procedural crack and (2) any
 * face-saving off-ramp — but NEVER to zero (a reversal is always felt; the consequence is
 * never censored). Deterministic + pure. The caller folds `credibilityDelta` through
 * advanceCredibility and lands `legitimacyHit` via the upswingKernel legitimacyDeltas seam.
 * @param {{ actorId: string, lawfulness01?: number, exitKind?: string }} args
 * @returns {{ credibilityDelta: { id: string, kind: 'climb_down', magnitude01: number }, legitimacyHit: number, price01: number }}
 */
export function climbDownConsequence({ actorId, lawfulness01 = 0.5, exitKind = '' }) {
  const relief = clamp01(proceduralCrackRelief(lawfulness01) + faceSavingReliefOf(exitKind));
  // Price floor: even the most face-saved, most procedural climb-down still costs a fraction
  // (a reversal is always felt — the anti-censorship guard on consequences).
  const price01 = clamp(1 - relief, 0.15, 1);
  return {
    credibilityDelta: { id: String(actorId), kind: 'climb_down', magnitude01: round4(clamp01(CRACK_TUNING.CLIMB_DOWN_MAGNITUDE * price01)) },
    legitimacyHit: round4(CRACK_TUNING.CLIMB_DOWN_LEGITIMACY_HIT * price01),
    price01: round4(price01),
  };
}

/**
 * FORCE_RECONSIDERATION verb (design §4/§7) — the DM's voice of reason or the final push. In
 * REGISTRABLE SHAPE, NOT manifest-registered (the W-COMPOSER-2 lift takes it with the rest,
 * exactly like orderConvoyVerbFactory). The dial is the pressure MAGNITUDE (0..1) applied
 * against the target course's commitment stock. Force ≡ organic: the same priced crack the
 * counterforces reach, delivered by the DM. @returns {{ verb: string, scope: string, candidateType: string, dials: Record<string, unknown>, registered: boolean, note: string }}
 */
export function forceReconsiderationVerbFactory() {
  return Object.freeze({
    verb: 'FORCE_RECONSIDERATION',
    scope: 'realm',
    candidateType: 'reconsideration_forced',
    dials: Object.freeze({ target: 'settlementId', course: 'courseKey', pressure: 'magnitude01' }),
    registered: true,
    note: 'REGISTERED in realmManifest.js (the W-COMPOSER-2 lift). Force ≡ organic — the same priced climbDownConsequence the counterforces reach.',
  });
}

// ── THE LIVE CRACK MOVER (design §4 — the priced climb-down as a pulse consequence) ──
/**
 * Apply a signed publicLegitimacy.score delta to a settlement's snapshot update (the
 * applyLegitimacyDeltasToUpdates idiom, reimplemented so the crack stays self-contained):
 * integer, clamped [0,100], skipping a legacy bare-number / absent legitimacy. Pure.
 * EXPORTED (W-COMPOSER-2): the FORCE_RECONSIDERATION apply arm lands its hit
 * through THIS writer (the same-function law).
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} updates
 * @param {Map<string, number>} hits actorId → signed delta (a climb-down hit is negative)
 * @returns {Array<{ saveId?: unknown, settlement?: unknown }>}
 */
export function applyLegitimacyHits(updates, hits) {
  if (!hits.size) return updates;
  const index = new Map();
  updates.forEach((u, i) => index.set(String(u && u.saveId), i));
  let next = updates;
  let cloned = false;
  for (const [id, delta] of hits) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = asObject(entry && entry.settlement);
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? /** @type {Record<string, unknown>} */ (plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(clamp(Number(pl.score) + delta, 0, 100));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } } } };
  }
  return next;
}

/** The climb-down receipt (§G — the chronicle names the seat, the depth held, and the
 * face-saving off-ramp if any).
 * @param {string} actorId @param {string} targetId @param {(id: string) => string} name
 * @param {number} stock @param {number} cliff @param {{ price01: number }} crack
 * @param {string} exitKind @param {number} tick @returns {Record<string, unknown>} */
export function climbDownNews(actorId, targetId, name, stock, cliff, crack, exitKind, tick) {
  const A = name(actorId);
  const Tn = name(targetId);
  const faced = exitKind ? String(exitKind).replace(/_/g, ' ') : '';
  const depth = cliff > 0 ? Math.round((stock / cliff) * 100) / 100 : 0;
  return {
    kind: 'momentum_climb_down',
    headline: faced ? `${A} climbs down from its war on ${Tn} — with honour intact` : `${A} climbs down from its war on ${Tn}`,
    summary: faced
      ? `${A} had held its war on ${Tn} well past the point of easy return (commitment ${depth}× its cliff), but a ${faced} let the crown reverse course and still call it a victory — the reversal cost less.`
      : `${A} had held its war on ${Tn} well past the point of easy return (commitment ${depth}× its cliff). Reversing it now spends real credibility and legitimacy — the price of the proud hold come due.`,
    reasons: [
      `The commitment stock (${depth}× the reconsideration cliff) put ${A} past the cliff — a genuine climb-down, not a free reversal.`,
      faced
        ? `The ${faced} off-ramp softened the price (relief ${Math.round((1 - crack.price01) * 100)}%); the reversal could be told as a win.`
        : `No face-saving off-ramp — the full climb-down price fell on the seat.`,
    ],
    settlementIds: [String(actorId), String(targetId)],
    significance: 'major',
    score: 68,
    tick,
  };
}

/**
 * STAGE 4 — THE LIVE CRACK (design §4). Detect this tick's fresh climb-downs — an actor PAST
 * its cliff on a committed WAR course whose deployment just took a fresh `sue_for_peace*`
 * recall stamp — and land the priced consequence ONCE per crack (the recall stamp's own tick
 * makes it idempotent): the 'climb_down' credibility charge (folded through advanceCredibility,
 * a no-op when info-statecraft is dark), the legitimacy hit on the seat, and a receipt that
 * names the polity, the depth held past the cliff, and any face-saving off-ramp. The price is
 * reduced by the lawful court's PROCEDURAL crack + the face-saving exit (mediation / …), never
 * to zero (a reversal is always felt). SUCCESSION-REROLLS-THE-CLIFF is EMERGENT: the cliff is
 * a live entityThreshold read of the CURRENT roster, so a new ruler meets a new cliff — no code
 * here; the proud old king's war that could not crack cracks under a pragmatic heir. DORMANT
 * ⇒ a complete no-op (no fresh reversal / momentum off) ⇒ byte-identical.
 * @param {Object} args
 * @param {{ byId?: Map<string, unknown> } | null | undefined} args.snapshot
 * @param {{ deployments?: unknown, spatialLedgers?: unknown, simulationRules?: Record<string, unknown>, spatialCanonVersion?: unknown } | null | undefined} args.worldState
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} args.settlementUpdates
 * @param {number} args.tick
 * @param {((id: string) => string) | null} [args.nameFor]
 * @param {((actorId: string, targetId: string) => string) | null} [args.exitKindFor] the face-saving exit resolver (mediation / …); '' ⇒ full price
 * @returns {{ worldState: unknown, settlementUpdates: Array<{ saveId?: unknown, settlement?: unknown }>, newsEntries: Array<Record<string, unknown>>, changed: boolean }}
 */
export function advanceMomentumCracks({ snapshot, worldState, settlementUpdates, tick, nameFor = null, exitKindFor = null }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  if (!momentumActive(worldState)) {
    return { worldState, settlementUpdates: updates, newsEntries: [], changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const deployments = asObject(asObject(worldState).deployments);
  const byId = snapshot && snapshot.byId instanceof Map ? snapshot.byId : new Map();
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);

  /** @type {Array<{ id: string, kind: 'climb_down', magnitude01: number }>} */
  const deltas = [];
  /** @type {Map<string, number>} */
  const legitimacyHits = new Map();
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  for (const actorId of Object.keys(deployments).sort(compareCodepoint)) {
    const dep = asObject(deployments[actorId]);
    const recalled = asObject(dep.recalled);
    // A FRESH sue_for_peace* recall THIS tick (the war winds down through the existing
    // sue-for-peace path). The recall stamp is idempotent, so recalled.tick pins the crack
    // to its ONE tick — charged exactly once.
    if (!String(recalled.cause || '').startsWith('sue_for_peace')) continue;
    if (Math.floor(finiteNumber(recalled.tick, -1)) !== now) continue;
    const targetId = dep.targetId != null ? String(dep.targetId) : '';
    if (!targetId) continue;
    const courseKey = courseKeyOf({ kind: 'war', target: targetId });
    if (!courseKey) continue;
    // Was the actor PAST its cliff on this war course? A below-cliff reversal is free physics
    // (today's behaviour) — a climb-down only bites a genuinely committed course.
    const stock = commitmentStockOf(worldState, actorId, courseKey, now);
    const th = entityThreshold(byId.get(actorId), worldState);
    if (!pastCliff(stock, th.cliff)) continue;
    // The face-saving exit (mediation / …) reduces the price; '' ⇒ full price.
    const exitKind = typeof exitKindFor === 'function' ? String(exitKindFor(actorId, targetId) || '') : '';
    const crack = climbDownConsequence({ actorId, lawfulness01: th.lawfulness01, exitKind });
    deltas.push(crack.credibilityDelta);
    if (crack.legitimacyHit > 0) legitimacyHits.set(actorId, -crack.legitimacyHit);
    newsEntries.push(climbDownNews(actorId, targetId, name, stock, th.cliff, crack, exitKind, now));
  }

  if (!deltas.length) {
    return { worldState, settlementUpdates: updates, newsEntries: [], changed: false };
  }
  // Fold the 'climb_down' charges into the credibility stock (a no-op — byte-identical — when
  // info-statecraft is dark, so the crack still lands its legitimacy hit + receipt regardless).
  const cred = advanceCredibility({ worldState, tick: now, deltas });
  const nextWorldState = cred.changed ? cred.worldState : worldState;
  const nextUpdates = applyLegitimacyHits(updates, legitimacyHits);
  return { worldState: nextWorldState, settlementUpdates: nextUpdates, newsEntries, changed: true };
}
