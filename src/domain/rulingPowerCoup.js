/**
 * domain/rulingPowerCoup.js — the coup CONTEST model (the field + the verdict).
 *
 * Split out of rulingPower.js: COUP_COERCION, coupContenders() and
 * resolveCoupVerdict() are reached ONLY by lazy worldPulse tick modules
 * (coup / stressorDynamics / stressorGates / deploymentReturn / disposition),
 * never by first-paint code. rulingPower.transferRulingPower (the eager
 * entrance via events/mutateWorld) uses none of them, so co-locating them in
 * rulingPower.js dragged the whole contest model into the first-paint static
 * closure for zero eager consumer. Living in this leaf keeps them lazy.
 *
 * Imports the shared helpers (num/round2/nameOf/governingFactionOf) back from
 * rulingPower.js — the safe lazy → eager import direction (this leaf is lazy;
 * rulingPower is first-paint). Pure + deterministic: the verdict threads an
 * injected rng; sorts tiebreak on plain codepoint order (never localeCompare).
 *
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

import { clamp01 } from '../kernel/math.js';
import { factionArchetype, FACTION_ARCHETYPES } from './factionArchetypes.js';
import { governingFactionOf, num, round2, nameOf } from './rulingPower.js';

/** @typedef {import('./rulingPower.js').RulingPowerSettlement} RulingPowerSettlement */

const A = FACTION_ARCHETYPES;

/**
 * Per-archetype coup-coercion factor. Also the single-source aggression baseline
 * the war-layer disposition model (worldPulse/disposition.js) re-centers into a
 * signed government tilt — exported (dormant for legacy campaigns; the disposition
 * consumer is gated behind warLayerEnabled).
 * @type {Readonly<Record<string, number>>}
 */
export const COUP_COERCION = Object.freeze({
  [A.MILITARY]: 1.25,
  [A.NOBLE]: 1.1,
  [A.ARCANE]: 1.05,
  [A.GOVERNMENT]: 1.0,
  [A.CIVIC]: 1.0,
  [A.RELIGIOUS]: 1.0,
  [A.OCCUPATION]: 1.0,
  [A.MERCHANT]: 0.95,
  [A.OUTSIDER]: 0.9,
  [A.CRAFT]: 0.85,
  [A.LABOR]: 0.85,
  [A.OTHER]: 0.9,
});

const MIN_CONTENDER_POWER = 5;

/**
 * @param {{name: string, power: number, weight: number}} a
 * @param {{name: string, power: number, weight: number}} b
 * @returns {number}
 */
function byWeightDescThenName(a, b) {
  if (b.weight !== a.weight) return b.weight - a.weight;
  if (b.power !== a.power) return b.power - a.power;
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * The coup field: the top-3 most powerful non-governing, non-criminal
 * factions, plus the incumbent's amplified defense.
 *
 * The incumbent's weight = power × govMultiplier — the legitimacy band the
 * settlement already maintains (1.30 Endorsed → 0.60 Crisis). `gated` is
 * the user-facing rule "the ruler only presents a case if it re-enters the
 * top 3 post-amplification": with a full field of three challengers the
 * amplified weight must match or beat the weakest challenger; a thinner
 * field always admits the incumbent (the pool is the top 3 by definition).
 *
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {{ governing: Object|null,
 *            challengers: Array<{ name:string, archetype:string, power:number, weight:number }>,
 *            incumbent: { name:string|null, power:number, govMultiplier:number,
 *                         amplifiedWeight:number, gated:boolean } }}
 */
export function coupContenders(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = governingFactionOf(settlement);
  const govMultiplier = num(ps.publicLegitimacy?.govMultiplier, 1);

  const challengers = factions
    .filter(f => f && f !== governing)
    .map(f => {
      const archetype = factionArchetype(f);
      const power = num(f.power);
      return {
        name: nameOf(f),
        archetype,
        power,
        weight: round2(power * (COUP_COERCION[archetype] ?? COUP_COERCION[A.OTHER])),
      };
    })
    // Criminal factions never vie for power openly — the capture ladder is
    // their path. Powerless factions can't field a coup at all.
    .filter(c => c.archetype !== A.CRIMINAL && c.power >= MIN_CONTENDER_POWER && c.name)
    .sort(byWeightDescThenName)
    .slice(0, 3);

  const incumbentPower = num(governing?.power);
  const amplifiedWeight = round2(incumbentPower * govMultiplier);
  const gated = challengers.length < 3
    || amplifiedWeight >= challengers[challengers.length - 1].weight;

  return {
    governing,
    challengers,
    incumbent: {
      name: governing ? nameOf(governing) : null,
      power: incumbentPower,
      govMultiplier,
      amplifiedWeight,
      gated,
    },
  };
}

// ── The verdict ────────────────────────────────────────────────────────────

/**
 * Resolve a coup contest. RNG is preserved — strengths shift the odds,
 * never guarantee the outcome (except the ungated collapse case, where the
 * ruler's case is too weak to even be heard: the fall is near-certain).
 *
 * @param {Object} args
 * @param {RulingPowerSettlement} args.settlement
 * @param {{ random: () => number }} args.rng
 * @param {number} [args.severity]              coup severity at the verdict (0..1)
 * @param {number|null} [args.rulingAuthorityScore]  causal ruling_authority 0..100 when available
 * @param {number} [args.warSentimentAdj]  P2 flag: signed shift to the incumbent hold-chance from war sentiment (0 = off)
 * @returns {{ holds:boolean, pHold:number, roll:number,
 *            winner:{name:string,archetype:string}|null,
 *            challengers:Array<{name:string, archetype:string, power:number, weight:number}>,
 *            incumbent:Object, reason:string }}
 */
export function resolveCoupVerdict({ settlement, rng, severity = 0.6, rulingAuthorityScore = null, warSentimentAdj = 0 }) {
  const { challengers, incumbent } = coupContenders(settlement);
  if (!challengers.length) {
    return {
      holds: true, pHold: 1, roll: 0, winner: null, challengers, incumbent,
      reason: 'No faction holds enough power to move against the seat — the plot collapses on its own.',
    };
  }

  let pHold;
  if (!incumbent.gated) {
    // The amplified case never re-entered the top 3: the ruler has no
    // standing left to argue from. The seat falls; only the heir is in question.
    pHold = 0.08;
  } else {
    const totalChallenger = challengers.reduce((sum, c) => sum + c.weight, 0);
    const share = incumbent.amplifiedWeight / Math.max(1e-6, incumbent.amplifiedWeight + totalChallenger);
    // A hotter coup (higher severity) erodes the incumbent's edge; the
    // ruling-authority score nudges ±0.125 across its full range.
    const severityDrag = 1.15 - 0.4 * clamp01(severity);
    const authorityAdj = Number.isFinite(rulingAuthorityScore) ? (/** @type {number} */ (rulingAuthorityScore) - 50) / 400 : 0;
    // warSentimentAdj (P2): 0 when the flag is off ⇒ byte-identical. A war turning sour
    // (negative sentiment) lowers the seat's hold-chance; a sustainable one raises it.
    pHold = Math.max(0.1, Math.min(0.9, share * severityDrag + authorityAdj + (Number(warSentimentAdj) || 0)));
  }

  const roll = rng.random();
  if (roll <= pHold) {
    return {
      holds: true, pHold: round2(pHold), roll: round2(roll), winner: null, challengers, incumbent,
      reason: incumbent.gated
        ? `${incumbent.name || 'The ruling power'} presented the stronger case (amplified weight ${incumbent.amplifiedWeight} at ×${incumbent.govMultiplier} legitimacy) and held the seat.`
        : 'Against the odds, the conspirators lost their nerve at the door.',
    };
  }

  // The seat falls. Winner sampled ∝ weight — highest influence, best chance.
  const total = challengers.reduce((sum, c) => sum + c.weight, 0);
  let pick = rng.random() * total;
  let winner = challengers[challengers.length - 1];
  for (const c of challengers) {
    pick -= c.weight;
    if (pick <= 0) { winner = c; break; }
  }
  return {
    holds: false, pHold: round2(pHold), roll: round2(roll),
    winner: { name: winner.name, archetype: winner.archetype }, challengers, incumbent,
    reason: incumbent.gated
      ? `${winner.name} out-maneuvered both the seat and its rivals (weight ${winner.weight} of ${round2(total)}).`
      : `${incumbent.name || 'The ruling power'}'s case never re-entered the field — ${winner.name} took the seat near-unopposed.`,
  };
}
