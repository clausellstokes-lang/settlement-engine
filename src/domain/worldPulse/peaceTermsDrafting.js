/**
 * domain/worldPulse/peaceTermsDrafting.js — §15.2 THE DRAFTING TABLE.
 *
 * Ranked assets + a budget become duration-capped TERMS. Perpetual extraction is
 * structurally unrepresentable here: every term gets an expiry inside its own
 * HARD ceiling, and a longer ask SPENDS MORE, so a thin budget buys short terms
 * rather than eternal ones. The receipt and the signing-card reason are authored
 * beside the draft so a term's prose can never drift from its arithmetic. Pure.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { affordableTreatyDuration } from './treatyClock.js';
import { PEACE_TERMS_TUNING, TERM_CATALOG, termLabel, humanTermGood } from './peaceTermsCatalog.js';
import { round4 } from './peaceTermsPrimitives.js';

/** @typedef {import('./peaceTermsCatalog.js').TermRecord} TermRecord */
/** @typedef {import('./peaceTermsCatalog.js').AppraisedAsset} AppraisedAsset */

/**
 * Draft the treaty's terms from the ranked assets and the budget (§15). Walks
 * value-desc, drafting one term per asset class (and at most one per family —
 * the §13 stacking rule) while budget remains; each term's duration scales with
 * the margin × alignment press inside its HARD ceiling, and LONGER SPENDS MORE
 * (§15.2). Pure + deterministic.
 * @param {{ ranked: AppraisedAsset[], budget: number, margin01: number, press: number, tick: number }} args
 * @returns {{ terms: TermRecord[], budgetSpent: number }}
 */
export function draftTerms({ ranked, budget, margin01, press, tick }) {
  /** @type {TermRecord[]} */
  const terms = [];
  const usedFamilies = new Set();
  const usedTypes = new Set();
  let remaining = budget;
  let drafted = 0;

  for (const asset of ranked) {
    if (drafted >= PEACE_TERMS_TUNING.TOP_ASSETS) break;
    const type = asset.termType;
    const spec = TERM_CATALOG[type];
    if (!spec) continue;
    if (usedTypes.has(type) || usedFamilies.has(spec.family)) continue; // §13: no redundant stacking

    // Duration (§15.2): decisive victories bend upward inside the hard ceiling.
    // Unaffordable asks shorten to whole years, never disappear at the margin boundary.
    const { years, weightSpent } = affordableTreatyDuration(
      spec, remaining, margin01, press, PEACE_TERMS_TUNING.DURATION_CURVE);
    if (years < 1) continue;

    const expiresTick = tick + Math.round(years * PEACE_TERMS_TUNING.TICKS_PER_YEAR);
    const magnitude = round4(clamp01(spec.baseMag * (0.5 + margin01) * Math.min(1.5, press)));

    /** @type {TermRecord} */
    const term = {
      type,
      family: spec.family,
      magnitude,
      mintedTick: tick,
      expiresTick,
      weightSpent,
      complianceState: 'honored',
      trueState: 'honored',
      burden01: 0,
      receipt: draftReceipt(type, asset, years, magnitude),
    };
    if (asset.good) term.good = asset.good;
    if (spec.executor === 'seam') term.seam = true;
    if (spec.stream) { term.deliveredToVictor = 0; term.extractedFromLoser = 0; }

    terms.push(term);
    remaining -= weightSpent;
    usedFamilies.add(spec.family);
    usedTypes.add(type);
    drafted += 1;
  }

  // Codepoint-stable term order (deterministic serialization).
  terms.sort((x, y) => (x.type < y.type ? -1 : x.type > y.type ? 1 : 0));
  const budgetSpent = round4(terms.reduce((s, t) => s + t.weightSpent, 0));
  return { terms, budgetSpent };
}

/** @param {string} type @param {AppraisedAsset} asset @param {number} years @param {number} magnitude @returns {string} */
export function draftReceipt(type, asset, years, magnitude) {
  switch (type) {
    case 'tribute': return `A tribute stream — ${(magnitude * 100).toFixed(0)}% of the treasury for ${years} year${years === 1 ? '' : 's'}; it was always the coin they wanted.`;
    case 'resource_share': return `${asset.good || 'The staple export'} shall flow to the victor — a ${(magnitude * 100).toFixed(0)}% share for ${years} year${years === 1 ? '' : 's'}.`;
    case 'reparations': return `Reparations in ${years} year${years === 1 ? '' : 's'} of installments — the price of the war laid on the loser.`;
    case 'restitution': return `Restitution for a debt long unpaid — ${(magnitude * 100).toFixed(0)}% for ${years} year${years === 1 ? '' : 's'}; the old grain-years, called in at last.`;
    case 'compelled_alliance': return `Forced allyship for ${years} year${years === 1 ? '' : 's'} — a banner compelled, and compelled loyalty rots.`;
    case 'demilitarization': return `A mobilization cap for ${years} year${years === 1 ? '' : 's'} — the beaten foe may not rearm.`;
    case 'non_aggression': return `A non-aggression pact ${years} year${years === 1 ? '' : 's'} — no war between these courts while it stands.`;
    case 'occupation_continuation': return `The occupation continues ${years} year${years === 1 ? '' : 's'} — the garrison stays at the walls.`;
    case 'puppet_seat': return `A victor-aligned seat installed (registration seam) — cheap control, brittle control.`;
    case 'disclosure': return `Observer/disclosure clause (registration seam) — the loser's court opened to the victor's eyes.`;
    default: return `Term ${type} for ${years} year${years === 1 ? '' : 's'}.`;
  }
}

/**
 * Signing-card reason for one typed term. Exact magnitudes, durations and
 * budget arithmetic stay on the treaty record; the feed names the obligation.
 * @param {TermRecord} term @param {string} victorName @param {string} loserName
 */
export function signingReason(term, victorName, loserName) {
  if (term.type === 'resource_share') return `${humanTermGood(term.good)} will flow from ${loserName} to ${victorName}.`;
  return `${loserName} accepts the ${termLabel(term.type)} demanded by ${victorName}.`;
}
