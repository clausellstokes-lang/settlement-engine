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
    const w = importanceWeight(/** @type {any} */ (npc));
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
  const temperament = temperamentMomentumOf(/** @type {any} */ (settlement));
  const lawfulness01 = clamp01(finiteNumber(computeLawfulness(/** @type {any} */ (item), /** @type {any} */ (worldState)), 0.5));
  const malice01 = clamp01(finiteNumber(computeMalice(/** @type {any} */ (item), /** @type {any} */ (worldState)), 0.5));
  const gl = governanceLedger(/** @type {any} */ (settlement));
  // Fragility: a LOW legitimacyScore is a fragile seat. present:false ⇒ neutral 50 ⇒ 0 fragility.
  const legitimacyFragility01 = gl && gl.present
    ? clamp01((50 - finiteNumber(gl.legitimacyScore, 50)) / 50)
    : 0;
  const consolidation01 = clamp01(finiteNumber(courtStructure.consolidation01, 0));
  const oppositionBlocs = Math.max(0, finiteNumber(courtStructure.oppositionBlocs, 0));
  const cliff = cliffStockFor({ temperament, legitimacyFragility01, consolidation01, oppositionBlocs });
  return { temperament, lawfulness01, malice01, legitimacyFragility01, cliff, depositScale: depositScaleFor(lawfulness01) };
}
