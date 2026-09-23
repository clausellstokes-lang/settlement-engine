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

/**
 * ⭐ THE STANDING PEACE OFFER — the record design §19 ruling 7 found missing, and the ONE
 * key it needs (EM-E4, wave 3; the chair's judgment 265 (d)).
 *
 * MEASURED BEFORE IT WAS WRITTEN: `draftTerms` above is pure and both of its callers
 * consume its output inside the same call stack (`mintTreaty` and the negotiation
 * evaluation), and the peace family persists only `treaties` and `envoyErrands`. So no
 * draft ever STANDS, and ruling 7's finding is exact: without a standing record, design
 * §17's "Write the terms" collapses into the moment of acceptance, and §18's condition for
 * the "Accept the peace" and "Refuse it" seals — a PENDING offer from the counterparty —
 * has nothing to read.
 *
 * ⛔ ONE RECORD IS BOTH, AND THAT IS THE POINT. The offer IS the draft: an offer with no
 * terms is precisely the collapse ruling 7 names, so the terms ride on the offer rather
 * than in a second key that could go missing beside it.
 *
 * ⛔ THE KEY LANDS ON THE SETTLEMENT RECORD, WHICH IS A MEASUREMENT AND A RULING. The save
 * path writes the settlement blob WHOLE (`src/lib/saves.js` assigns the settlement to the
 * row's data field on both the insert and the update), and EM-B3a's landed persistence
 * suite proves the sibling `decrees` key survives save, list and write-all byte-exact, so
 * this key needs no column and no migration. Judgment 265 (d) rules it the launch shape
 * rather than a migration of anyone's data.
 *
 * ⛔ THE KEY IS NEVER MINTED ON A RECORD THAT HOLDS NO OFFER. `withPeaceOffer` returns its
 * argument BY REFERENCE for anything that is not a real offer, because the preset lighting
 * witness hashes a serialized year and a key minted with no cause moves a byte golden with
 * no cause (design §12.11).
 *
 * PURE. No clock, no draw, no id: the tick and the parties are the caller's, exactly as
 * EM-C1's `stage` takes its own stamp.
 */
export const PEACE_OFFER_KEY = 'peaceOffers';

/**
 * @typedef {{ fromId: string, toId: string, terms: readonly TermRecord[],
 *   budgetSpent: number, draftedTick: number }} PeaceOffer
 */

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isBag(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isId(value) {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Draft one standing offer from the drafting table's own output. REFUSED, with nothing
 * returned: a missing party, a party offering peace to itself, or a draft with no term at
 * all. A term list is copied, so the offer cannot be edited through the caller's array.
 *
 * @param {{ fromId: unknown, toId: unknown, terms: unknown, budgetSpent?: unknown, tick?: unknown }} args
 * @returns {PeaceOffer|null}
 */
export function draftPeaceOffer({ fromId, toId, terms, budgetSpent, tick }) {
  if (!isId(fromId) || !isId(toId) || fromId === toId) return null;
  if (!Array.isArray(terms) || terms.length === 0) return null;
  const spent = Number(budgetSpent);
  const at = Number(tick);
  return /** @type {PeaceOffer} */ (Object.freeze({
    fromId,
    toId,
    terms: Object.freeze([...terms]),
    budgetSpent: Number.isFinite(spent) ? spent : 0,
    draftedTick: Number.isFinite(at) ? at : 0,
  }));
}

/**
 * The offers standing on one settlement record, total on garbage and on absence.
 * @param {unknown} settlement @returns {readonly PeaceOffer[]}
 */
export function peaceOffersOf(settlement) {
  const held = isBag(settlement) ? settlement[PEACE_OFFER_KEY] : undefined;
  return /** @type {readonly PeaceOffer[]} */ (Array.isArray(held) ? held : []);
}

/**
 * ⭐ DESIGN §18's WORLD-STATE CONDITION, READ FROM THE RECORD. "Accept the peace" and
 * "Refuse it" are offered only where a PENDING offer from that counterparty stands; this
 * is the read that decides it, and a card that finds nothing says so in the herald's voice
 * and names the act that would create the condition rather than refusing anything.
 * @param {unknown} settlement @param {unknown} fromId @returns {PeaceOffer|null}
 */
export function pendingPeaceOfferFrom(settlement, fromId) {
  if (!isId(fromId)) return null;
  const found = peaceOffersOf(settlement)
    .find((offer) => isBag(offer) && offer.fromId === fromId);
  return found || null;
}

/**
 * Stand one offer on the record. An offer from a counterparty that already has one
 * REPLACES it in place, so a second suing never mints a duplicate; every other offer keeps
 * its own position. Returns the record BY REFERENCE when the offer is not a real one.
 * @param {unknown} settlement @param {unknown} offer @returns {unknown}
 */
export function withPeaceOffer(settlement, offer) {
  if (!isBag(settlement) || !isBag(offer) || !isId(offer.fromId)) return settlement;
  const standing = peaceOffersOf(settlement);
  const at = standing.findIndex((each) => isBag(each) && each.fromId === offer.fromId);
  const next = at < 0
    ? [...standing, offer]
    : standing.map((each, index) => (index === at ? offer : each));
  return { ...settlement, [PEACE_OFFER_KEY]: Object.freeze(next) };
}

/**
 * Take one counterparty's offer off the record, which is what acceptance and refusal both
 * do to it. Returns the record BY REFERENCE when no such offer stands, so a settlement
 * that never held one never gains the key.
 * @param {unknown} settlement @param {unknown} fromId @returns {unknown}
 */
export function withoutPeaceOffer(settlement, fromId) {
  if (!isBag(settlement) || !pendingPeaceOfferFrom(settlement, fromId)) return settlement;
  const kept = peaceOffersOf(settlement).filter((offer) => !isBag(offer) || offer.fromId !== fromId);
  return { ...settlement, [PEACE_OFFER_KEY]: Object.freeze(kept) };
}

/**
 * A TERM'S SHARE IN WORDS, smallest first (TE-HERALD-1). A treaty term's magnitude is a
 * share of a treasury or an export — a fraction of a quantity no reader can see, so the
 * ruled boundary retires the percentage. The YEARS beside it STAY: a term of three years
 * is an honest concrete count in world words and is census-legitimate.
 * ⚠ The two cuts are the declared quarter/half convention, not a claim about the model:
 * `PEACE_TERMS_TUNING` names no interior landmark on a term magnitude, and nothing
 * branches on these — the drafting arithmetic is untouched.
 * @type {ReadonlyArray<string>}
 */
export const TERM_SHARE_WORDS = Object.freeze(['a modest share', 'a heavy share', 'the better part']);

/** A term magnitude as a share phrase. @param {number} magnitude 0..1 @returns {string} */
export function treasuryShareWords(magnitude) {
  const m = clamp01(magnitude);
  if (m < 0.25) return TERM_SHARE_WORDS[0];
  if (m < 0.5) return TERM_SHARE_WORDS[1];
  return TERM_SHARE_WORDS[2];
}

/** @param {string} type @param {AppraisedAsset} asset @param {number} years @param {number} magnitude @returns {string} */
export function draftReceipt(type, asset, years, magnitude) {
  const shareWord = treasuryShareWords(magnitude);
  switch (type) {
    case 'tribute': return `A tribute stream: ${shareWord} of the treasury for ${years} year${years === 1 ? '' : 's'}; it was always the coin they wanted.`;
    case 'resource_share': return `${asset.good || 'The staple export'} shall flow to the victor: ${shareWord} of it for ${years} year${years === 1 ? '' : 's'}.`;
    case 'reparations': return `Reparations in ${years} year${years === 1 ? '' : 's'} of installments: the price of the war laid on the loser.`;
    case 'restitution': return `Restitution for a debt long unpaid: ${shareWord} for ${years} year${years === 1 ? '' : 's'}; the old grain-years, called in at last.`;
    case 'compelled_alliance': return `Forced allyship for ${years} year${years === 1 ? '' : 's'}. A banner compelled, and compelled loyalty rots.`;
    case 'demilitarization': return `A mobilization cap for ${years} year${years === 1 ? '' : 's'}: the beaten foe may not rearm.`;
    case 'non_aggression': return `A non-aggression pact ${years} year${years === 1 ? '' : 's'}: no war between these courts while it stands.`;
    case 'occupation_continuation': return `The occupation continues ${years} year${years === 1 ? '' : 's'}. The garrison stays at the walls.`;
    case 'puppet_seat': return `A victor-aligned seat installed (registration seam): cheap control, brittle control.`;
    case 'disclosure': return `Observer/disclosure clause (registration seam): the loser's court opened to the victor's eyes.`;
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
