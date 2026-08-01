/**
 * opportunism.js — THE VULTURE WAR: appetite for the weak, and its mirror.
 *
 * DESIGN_PEACE_ENGINE.md §14.1 names this casus and this module implements it verbatim:
 *   "OPPORTUNISM: weakness smelled — a BELIEF-read of a neighbor's exhaustion, plague,
 *    calamity, or coup chaos (the vulture war; fog applies: mis-smelled weakness walks
 *    into a bear)."
 * §14.3's mirror table names its pair — `opportunism ↔ hopelessness` — and this module
 * owns BOTH sides, because they are ONE number read twice.
 *
 * WHY THIS EXISTS. The taxonomy modelled fear of the STRONG (fear_of_dominance, which
 * reads a BELIEVED strength-share) and had no appetite for the WEAK. A fat, peaceful,
 * poorly-defended neighbour generated zero motive, which taught players that being
 * harmless is safe — the wrong lesson for a world with borders. This is the mirror-image
 * of fear_of_dominance, built on the same epistemics.
 *
 * ── THE ONE NUMBER (the §14.3 symmetry law, satisfied by construction) ──────────────
 * VULNERABILITY is how little a town could resist being taken. The pair's GRADIENT is
 *       gradient = believedVulnerability(foe) − vulnerability(self)
 * and the two reasons are its two signs:
 *       opportunism  = clamp01(+gradient) × ownCapability   (they are weaker than us)
 *       hopelessness = clamp01(−gradient)                   (we are weaker than they are)
 * There is no way for the two to drift apart, because there is only one measurement. The
 * mirror is not a filler word; it is the same evidence read the other way.
 *
 * ── EPISTEMIC, EXACTLY AS fear_of_dominance IS ──────────────────────────────────────
 * The FOE half routes through the engine's ONE belief estate:
 *   • `belief(observer, subject, worldState)` classifies the read — the P4 selector
 *     (demographicsWar.js). Self carve-out, omniscient fallback, dormant fallback and
 *     ABSENCE-AS-INFORMATION all arrive for free, and none of them is re-implemented here.
 *   • `readBeliefStrength(...)` supplies the fogged strength term — the same paired
 *     truth/belief reader fear_of_dominance and the Blainey margins already ride.
 * So a court can covet a neighbour that is NOT actually weak, and the receipt says so.
 * The SELF half is truth by construction: `belief(x, x)` is the self carve-out.
 *
 * WHICH HALF THE FOG COVERS, and why. The fog lands on STRENGTH — the host a rival could
 * put in the field, which is exactly what a court guesses at and exactly where
 * fear_of_dominance puts its own fog. Garrison drill (the projected martial record) and
 * public legitimacy are PUBLIC reads: a coup, a purge and an unmanned wall are things
 * neighbours see. So the mis-smelled weakness the design asks for is a mis-read of the
 * HOST, which is the honest place for it.
 *
 * NO NEW CAP, NO NEW GAIN. The score is a bounded difference of two 0..1 readings damped
 * by the EXISTING P4 capability term; RESOURCE_ENVY_GAIN and the ×1.30 war-factor cap
 * remain the only two dials on this surface. Weights below are SHARES of one blend that
 * already summed to 1, renormalized over whichever terms the world actually publishes.
 *
 * SUBSTRATE ABSENCE IS NOT EVIDENCE OF WEAKNESS. This is the inversion that would make
 * every dark world a feeding frenzy, and it is guarded in two places:
 *   • A settlement with no projected martial record contributes NO readiness term, rather
 *     than a maximally-undrilled one. `readinessOf` returns 0 for "absent" and for
 *     "utterly unready" alike, so presence is tested STRUCTURALLY (the `rustOf`
 *     identity-short-circuit idiom) and the blend renormalizes over what is actually
 *     published. Same for a missing legitimacy score.
 *   • A pair NEITHER of whose members the snapshot carries reads a flat 0 gradient.
 * Tier and population are always present, so the strength term always contributes: a
 * settlement the world knows nothing else about reads a middling vulnerability, never a
 * defenceless one.
 *
 * Pure leaf: no rng (reasons are READS, not rolls), no wall clock, no store, no writes,
 * and no import of either reason mover (the reasons DAG stays acyclic — warReasons and
 * peaceReasons both import THIS).
 *
 * @enforced-by tests/domain/warReasonsPredationFaith.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { belief, readBeliefStrength } from './beliefMap.js';
import { readinessOf } from './martialReadiness.js';
import { settlementStrength } from './relationshipEvolution.js';
import { warReceipt, peaceReceipt } from './eventProse.js';

/**
 * Bounded, owner-retunable tuning (soak). Every weight is a SHARE of one blend; the
 * blend is renormalized over the terms actually present, so lighting a new substrate
 * never widens the 0..1 surface the existing gain and cap act on.
 */
export const OPPORTUNISM_TUNING = Object.freeze({
  /** The host a rival could field — the FOGGED term (believed, never omniscient). */
  STRENGTH_W: 0.50,
  /** Garrison drill: an undrilled town is an open gate. PUBLIC (the projected record). */
  READINESS_W: 0.30,
  /** Coup chaos and a contested seat — the design's "coup chaos". PUBLIC. */
  INSTABILITY_W: 0.20,
  /** The causal legitimacy midpoint; below it a seat reads unstable (scoreLegitimacyHunger's own default). */
  NEUTRAL_LEGITIMACY: 50,
  /** What a court with NO picture at all assumes — the middle, and it knows it is assuming. */
  NEUTRAL_VULNERABILITY: 0.50,
  /** How far a believed reading must sit from the truth before the receipt calls the court wrong. */
  MISTAKEN_AT: 0.25,
});

const W = OPPORTUNISM_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * ONE SNAPSHOT MEMBER as this module reads it — the same shape warReasons.js declares,
 * spelled once so the two views of a member cannot disagree.
 * @typedef {{ id?: string, name?: string,
 *   settlement?: { config?: { faithProfile?: { martial?: unknown } } } | null,
 *   causal?: { scores?: Record<string, number> } | null }} VulnerableItem
 */

/**
 * @typedef {Object} VulnerabilityRead
 * @property {number} value01   0..1 — how little this town could resist being taken
 * @property {number} terms     how many substrates actually contributed (0 ⇒ nothing published)
 */

/**
 * Is a projected martial record present? The record's ABSENCE must not read as an
 * undrilled garrison (`readinessOf` returns 0 for both), so presence is tested
 * structurally — the `rustOf` identity-short-circuit idiom.
 * @param {VulnerableItem | null | undefined} item @returns {boolean}
 */
function hasMartialRecord(item) {
  const m = asObject(asObject(asObject(item).settlement).config).faithProfile;
  return !!asObject(m).martial;
}

/**
 * The PUBLIC half of vulnerability — garrison drill and a shaky seat, each contributing
 * only where the world actually publishes it. Returned as parallel weight/value arrays so
 * the caller can renormalize one blend across the public and fogged halves together.
 * @param {VulnerableItem | null | undefined} item
 * @returns {Array<{ w: number, v: number }>}
 */
function publicVulnerabilityTerms(item) {
  /** @type {Array<{ w: number, v: number }>} */
  const terms = [];
  if (hasMartialRecord(item)) {
    const settlement = /** @type {Parameters<typeof readinessOf>[0]} */ (asObject(item).settlement);
    terms.push({ w: W.READINESS_W, v: clamp01(1 - clamp01(readinessOf(settlement))) });
  }
  const legit = Number(asObject(asObject(item).causal).scores
    ? /** @type {Record<string, number>} */ (asObject(asObject(item).causal).scores).public_legitimacy
    : undefined);
  if (Number.isFinite(legit)) {
    terms.push({ w: W.INSTABILITY_W, v: clamp01((W.NEUTRAL_LEGITIMACY - legit) / W.NEUTRAL_LEGITIMACY) });
  }
  return terms;
}

/** Renormalized weighted mean over the terms a world actually published.
 *  @param {Array<{ w: number, v: number }>} terms @returns {VulnerabilityRead} */
function blend(terms) {
  let sumW = 0;
  let sum = 0;
  for (const t of terms) { sumW += t.w; sum += t.w * t.v; }
  if (sumW <= 0) return { value01: 0, terms: 0 };
  return { value01: clamp01(sum / sumW), terms: terms.length };
}

/**
 * THE GROUND TRUTH: how vulnerable this town actually is. Used verbatim for the SELF
 * half (the belief selector's self carve-out returns exactly this), and carried alongside
 * the believed read so a receipt can name the error.
 * @param {VulnerableItem | null | undefined} item @returns {VulnerabilityRead}
 */
export function vulnerabilityTruthOf(item) {
  if (!item) return { value01: 0, terms: 0 };
  const strength01 = clamp01(Number(settlementStrength(item, {})) || 0);
  return blend([{ w: W.STRENGTH_W, v: clamp01(1 - strength01) }, ...publicVulnerabilityTerms(item)]);
}

/**
 * @typedef {Object} PerceivedVulnerability
 * @property {number} value01   the vulnerability the observer BELIEVES the subject is under
 * @property {string} source    'truth' | 'belief' | 'unknown'
 * @property {boolean} mistaken the believed reading differs from the truth by a band or more
 * @property {number} truth01   the ground truth, carried so a receipt can name the error
 */

/**
 * PERCEIVED, NEVER OMNISCIENT — the P4 shape, routed through the same selector. Dark on
 * every path (self / omniscient / unmarked world) means the truth verbatim, which is what
 * keeps a dormant world byte-identical; a marked world with no record read at all falls to
 * the NEUTRAL assumption rather than to truth, because a court that has heard nothing
 * knows it is guessing.
 * @param {{ observerId: string, subjectId: string,
 *   worldState: Record<string, unknown> | null | undefined,
 *   item: VulnerableItem | null | undefined }} input
 * @returns {PerceivedVulnerability}
 */
export function perceivedVulnerabilityOf(input) {
  const observerId = String(asObject(input).observerId || '');
  const subjectId = String(asObject(input).subjectId || '');
  const worldState = /** @type {Record<string, unknown>} */ (asObject(input).worldState);
  const item = /** @type {VulnerableItem | null} */ (asObject(input).item || null);
  const truth = vulnerabilityTruthOf(item);
  const resolved = belief(observerId, subjectId, /** @type {Parameters<typeof belief>[2]} */ (worldState));

  if (resolved.source === 'truth') {
    return { value01: truth.value01, source: 'truth', mistaken: false, truth01: truth.value01 };
  }
  if (resolved.source === 'unknown') {
    // A court that has had no word assumes the middle, and knows it is assuming.
    return {
      value01: W.NEUTRAL_VULNERABILITY,
      source: 'unknown',
      mistaken: Math.abs(W.NEUTRAL_VULNERABILITY - truth.value01) >= W.MISTAKEN_AT,
      truth01: truth.value01,
    };
  }
  // BELIEVED: the host is fogged (the paired reader every other actor read rides); the
  // garrison and the seat stay public, so the misjudgement lands on the army — which is
  // exactly where the design's "mis-smelled weakness walks into a bear" lives.
  const truthStrength01 = clamp01(Number(settlementStrength(item, {})) || 0);
  const believedStrength01 = clamp01(Number(
    readBeliefStrength(observerId, subjectId, worldState, truthStrength01)) || 0);
  const value01 = blend([
    { w: W.STRENGTH_W, v: clamp01(1 - believedStrength01) },
    ...publicVulnerabilityTerms(item),
  ]).value01;
  return {
    value01,
    source: 'belief',
    mistaken: Math.abs(value01 - truth.value01) >= W.MISTAKEN_AT,
    truth01: truth.value01,
  };
}

/**
 * THE CLAUSE A RECEIPT APPENDS when the court judged a picture rather than the ground.
 * Empty when the read WAS the ground, so a dormant world appends nothing. This is the
 * §14.4 bar P4 set ("The court believes their granaries are full and the court is wrong
 * about it.") applied to the host instead of the harvest.
 * @param {PerceivedVulnerability} perceived @returns {string}
 */
export function perceivedVulnerabilityClause(perceived) {
  if (!perceived || perceived.source === 'truth') return '';
  const picture = perceived.source === 'unknown'
    ? 'No rider has come from that place in a long while, and the court has filled the silence with a guess'
    : perceived.value01 > perceived.truth01
      ? 'The court believes their walls are thinly held'
      : 'The court believes their walls are well manned';
  return ` ${picture}${perceived.mistaken ? ' and the court is wrong about it.' : ' and it happens to be so.'}`;
}

/**
 * OPPORTUNISM (§14.1) — the vulture war. The believed gap between what the foe could
 * resist with and what WE could, damped by whether we can actually march (armies eat —
 * the P4 capability term, ABSENT ⇒ 1 ⇒ byte-identical for every pre-P4 and demographics-
 * dark world). Bounded 0..1 by construction; no gain, no second cap.
 * @param {{ gradient: number, capability01?: number, note?: string }} args
 * @param {string} [seed] the directed-pair phrasing seed (absent ⇒ canonical wording)
 * @returns {{ score: number, receipt: string }}
 */
export function scoreOpportunism({ gradient, capability01, note }, seed) {
  const appetite = clamp01(Number(gradient) || 0);
  if (appetite <= 0) return { score: 0, receipt: '' };
  const capability = Number.isFinite(Number(capability01)) ? clamp01(Number(capability01)) : 1;
  const score = clamp01(appetite * capability);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: `${warReceipt('opportunism', seed)}${typeof note === 'string' ? note : ''}` };
}

/**
 * HOPELESSNESS (§14.2 "no other options" / §14.3's named mirror) — THE SAME GRADIENT,
 * read the other way. A court that believes the foe could take far more punishment than
 * it can has a reason to end the war that is not exhaustion, not strangulation and not
 * Blainey convergence: it is the believed balance itself. No capability damper — being
 * unable to march is part of being hopeless, never a reason to keep fighting.
 * @param {{ gradient: number, note?: string }} args
 * @param {string} [seed]
 * @returns {{ score: number, receipt: string }}
 */
export function scoreHopelessness({ gradient, note }, seed) {
  const despair = clamp01(-(Number(gradient) || 0));
  if (despair <= 0) return { score: 0, receipt: '' };
  return { score: despair, receipt: `${peaceReceipt('hopelessness', seed)}${typeof note === 'string' ? note : ''}` };
}

/**
 * Build the per-tick predation context BOTH reason movers consume — the hegemonyFear
 * shape, for the same reason: one shared belief-side read, and neither mover importing
 * the other. Truth reads are memoized per settlement (they are per-town, not per-pair);
 * the believed read is per-pair and is not, because that is what the fog is.
 *
 * @param {{ snapshot: { byId?: Map<string, unknown>, settlements?: unknown[] } | null | undefined,
 *           worldState: Record<string, unknown> }} args
 */
export function makeOpportunismRead({ snapshot, worldState }) {
  const settlements = /** @type {VulnerableItem[]} */ (
    Array.isArray(asObject(snapshot).settlements) ? asObject(snapshot).settlements : []);
  /** @type {Map<string, VulnerableItem>} */
  const byId = asObject(snapshot).byId instanceof Map
    ? /** @type {Map<string, VulnerableItem>} */ (asObject(snapshot).byId)
    : new Map(settlements.map((it) => [String(asObject(it).id), it]));

  /** @type {Map<string, VulnerabilityRead>} */
  const truthCache = new Map();
  const truthFor = (/** @type {string} */ id) => {
    const key = String(id);
    const memo = truthCache.get(key);
    if (memo) return memo;
    const read = vulnerabilityTruthOf(byId.get(key) || null);
    truthCache.set(key, read);
    return read;
  };

  /** The believed foe read + the self read + their signed gap, for one directed pair.
   *  @param {string} observerId @param {string} subjectId */
  const gradientFor = (observerId, subjectId) => {
    const ownItem = byId.get(String(observerId)) || null;
    const foeItem = byId.get(String(subjectId)) || null;
    // NEITHER MEMBER CARRIED ⇒ no appetite and no despair. A pair the snapshot says
    // nothing about is not a pair of defenceless towns (see the module header).
    if (!ownItem && !foeItem) {
      return { gradient: 0, foe: { value01: 0, source: 'truth', mistaken: false, truth01: 0 }, own: truthFor(observerId) };
    }
    const own = truthFor(observerId);
    const foe = perceivedVulnerabilityOf({ observerId, subjectId, worldState, item: foeItem });
    return { gradient: foe.value01 - own.value01, foe, own };
  };

  return {
    /** opportunism for the directed pair (from covets to). `capability01` is P4's own-side
     *  means term; absent ⇒ 1. @param {string} fromId @param {string} toId @param {number} [capability01] */
    opportunismOf(fromId, toId, capability01) {
      const { gradient, foe } = gradientFor(String(fromId), String(toId));
      return scoreOpportunism(
        { gradient, capability01, note: perceivedVulnerabilityClause(foe) },
        `${fromId}>${toId}`,
      );
    },
    /** hopelessness for the directed pair (party despairs of foe). @param {string} partyId @param {string} foeId */
    hopelessnessOf(partyId, foeId) {
      const { gradient, foe } = gradientFor(String(partyId), String(foeId));
      return scoreHopelessness({ gradient, note: perceivedVulnerabilityClause(foe) }, `${partyId}>${foeId}`);
    },
  };
}
