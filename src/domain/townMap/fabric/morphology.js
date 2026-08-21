/**
 * domain/townMap/fabric/morphology.js — THE MORPHOLOGY LAW (§5.0), now derivable.
 *
 * "Pure geometry is reserved for the most orderly; the DEFAULT is historical organic
 * accretion." Most real medieval towns never had a plan. Leonardo's own Imola is a
 * decayed Roman grid gone organic. So ORGANIC is the base morphology at every tier
 * unless the canonical facts argue otherwise — and the facts, not a preference, decide.
 *
 * ⭐ THIS MEMBER IS THE REASON MF-0F EXISTS. Before the typed founding field, the only
 * inputs that could reach this selector were civic-order proxies (legitimacy, stability,
 * faction concentration), and MF-P1 measured what that meant across 120 live
 * settlements: the observed order maximum was 35 against any threshold high enough to
 * keep organic dominant — so the PLANNED band was UNREACHABLE, 0% of the corpus, and
 * §5.0's "both ends of the scale" acceptance could only be met by an authored override.
 * `history.founding.kind` closes it with the fact history actually turns on: a town is
 * planned because somebody PLANNED it, and that is a founding fact, not a governance
 * one. A prose regex may not stand in for it (§5.0's own words), so the field is typed
 * at its authoring site and read here.
 *
 * TWO INPUTS, DELIBERATELY WEIGHTED THAT WAY:
 *   FOUNDING (0.55) — what the settlement was laid out as. Dominant, because a street
 *     plan outlives every government that ever ruled it. A bastide is still a bastide
 *     eight hundred years and six regimes later.
 *   CIVIC ORDER (0.45) — whether an authority has been able to ACT on the fabric since.
 *     Strong enough to matter: a planned foundation whose order has collapsed reads as
 *     REGULARIZED, not planned — the grid is still legible under the encroachment but it
 *     is no longer being kept. That is Imola exactly, and it falls out of the arithmetic
 *     rather than being special-cased.
 *
 * DETERMINISM: pure; no draws at all. The band is a function of the dossier.
 */

import { readFoundingKind, foundingOrderPressure } from '../../foundingKind.js';

/**
 * The three morphology bands and their subdivision character. Every field is consumed
 * by the organism/street/parcel members; the row IS the difference between a grown town
 * and a laid-out one.
 *
 *  wobble      — angular jitter (trig-table indices) applied to a street grain
 *  offset      — how far off-centre a subdividing cut may fall
 *  lobeSpread  — accretion lobe size variance; low means even, planned growth
 *  roadBias    — how strongly growth follows the road (ribbon development)
 *  wallRough   — how much the wall trace wanders off the built edge
 *  blockRegular— 0..1 how nearly rectangular a block is cut
 * @type {Readonly<Record<string, { wobble:number, offset:number, lobeSpread:number, roadBias:number, wallRough:number, blockRegular:number }>>}
 */
export const MORPHOLOGY_BANDS = Object.freeze({
  organic:     { wobble: 42, offset: 0.17, lobeSpread: 1.00, roadBias: 0.62, wallRough: 0.085, blockRegular: 0.15 },
  regularized: { wobble: 26, offset: 0.12, lobeSpread: 0.84, roadBias: 0.70, wallRough: 0.060, blockRegular: 0.55 },
  planned:     { wobble: 5,  offset: 0.04, lobeSpread: 0.52, roadBias: 0.34, wallRough: 0.018, blockRegular: 0.94 },
});

/**
 * BAND THRESHOLDS on the 0..1 order scale. §42/§43 VALUES, DERIVED from the input
 * weights rather than chosen: with founding weighted 0.55, an `organic` founding
 * (pressure 0) tops out at 0.45 whatever its governance, so ORGANIC IS UNREACHABLE-FROM-
 * ABOVE for organically-founded settlements by construction — which is the law, made
 * arithmetic. `planned` at 0.72 requires a planned founding (0.55) plus real civic order
 * (≥0.38 of the remaining 0.45); a charter founding cannot reach it at any legitimacy.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const REGULARIZED_THRESHOLD = 0.42;
/** @see REGULARIZED_THRESHOLD */
export const PLANNED_THRESHOLD = 0.72;

/** Stability prose → a civic-order contribution. The field is typed-ish prose on the
 * landed powerStructure, so the read is a bounded set of anchored patterns rather than
 * a free parse, and an unrecognised value contributes nothing (never a guess). */
const STABILITY_PATTERNS = Object.freeze([
  { re: /^stable/i, value: 0.22 },
  { re: /^(secure|firm|entrenched)/i, value: 0.18 },
  { re: /(volatile|fractured|anxious|tense|contested)/i, value: -0.28 },
]);

/**
 * @typedef {Object} MorphologyDecision
 * @property {'organic'|'regularized'|'planned'} band
 * @property {number} order            0..1, the scale the band came off
 * @property {string} foundingKind
 * @property {number} foundingPressure
 * @property {number} civicOrder       0..1
 * @property {Record<string, unknown>} inputs
 * @property {string} reason
 * @property {{ wobble:number, offset:number, lobeSpread:number, roadBias:number, wallRough:number, blockRegular:number }} shape
 */

/**
 * CIVIC ORDER, 0..1 — can an authority act on the fabric today? Three landed reads:
 * public legitimacy (does anyone accept the authority), stability (is it holding), and
 * power CONCENTRATION (one faction holding most of the power is the only configuration
 * that can impose anything; a balanced council negotiates and the streets stay crooked).
 * @param {any} settlement @returns {{ value: number, inputs: Record<string, unknown> }}
 */
export function civicOrder(settlement) {
  const ps = (settlement && settlement.powerStructure) || {};
  const legitRaw = ps.publicLegitimacy && Number.isFinite(ps.publicLegitimacy.score)
    ? Number(ps.publicLegitimacy.score) : null;
  const stability = typeof ps.stability === 'string' ? ps.stability : '';
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  let total = 0, top = 0;
  for (const f of factions) {
    const p = Number.isFinite(f && f.power) ? Number(f.power) : 0;
    total += p;
    if (p > top) top = p;
  }
  const concentration = total > 0 ? top / total : 0;

  let v = 0.30;                                   // the ungoverned baseline
  if (legitRaw != null) v += ((legitRaw - 50) / 100) * 0.55;
  for (const p of STABILITY_PATTERNS) if (p.re.test(stability)) { v += p.value; break; }
  v += (concentration - 0.34) * 0.60;

  return {
    value: v < 0 ? 0 : v > 1 ? 1 : v,
    inputs: {
      legitimacy: legitRaw,
      stability: stability || null,
      concentration: Math.round(concentration * 100) / 100,
      factionCount: factions.length,
      government: ps.government || ps.governingName || null,
    },
  };
}

/**
 * Select the settlement's plan morphology.
 * @param {any} settlement
 * @param {{ morphologyOverride?: 'organic'|'regularized'|'planned' }} [opts]
 * @returns {MorphologyDecision}
 */
export function selectMorphology(settlement, opts = {}) {
  const civic = civicOrder(settlement);
  const kind = readFoundingKind(settlement);
  const pressure = foundingOrderPressure(settlement);
  const order = pressure * 0.55 + civic.value * 0.45;

  /** @type {'organic'|'regularized'|'planned'} */
  let band = order >= PLANNED_THRESHOLD ? 'planned'
    : order >= REGULARIZED_THRESHOLD ? 'regularized'
      : 'organic';
  let reason = band === 'planned'
    ? `founded ${kind} and still governed: an authority laid it out and has kept it`
    : band === 'regularized'
      ? (pressure >= 0.55
        ? `founded ${kind}, but civic order has slipped — the plan is legible under the encroachment, no longer enforced`
        : `founded ${kind} with concentrated authority: regularity inserted where power acted`)
      : `founded ${kind}: no canonical fact argues for imposed geometry`;

  if (opts.morphologyOverride && MORPHOLOGY_BANDS[opts.morphologyOverride]) {
    band = opts.morphologyOverride;
    reason = `EXPLICIT OVERRIDE (derived band would have been ${order >= PLANNED_THRESHOLD ? 'planned' : order >= REGULARIZED_THRESHOLD ? 'regularized' : 'organic'})`;
  }

  return {
    band,
    order: Math.round(order * 1000) / 1000,
    foundingKind: kind,
    foundingPressure: pressure,
    civicOrder: Math.round(civic.value * 1000) / 1000,
    inputs: civic.inputs,
    reason,
    shape: MORPHOLOGY_BANDS[band],
  };
}
