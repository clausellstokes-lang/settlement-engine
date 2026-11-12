/**
 * economy/incomeLineSiblings.js — THE INCOME LINES THAT NAME THE TOWN'S OWN LAND OR STORES, DECLARED
 * (COHERENCE-AGREE-3, 2026-11-12; the charter's §0.8: every new or changed line is declared from its
 * birth). `economicState.js :: generateEconomicState` prints these from inline branches gated on the
 * town's live resources (economy/localMaterials.js) and on the food record's one surplus rule
 * (`domain/foodSurplus.js :: offersFoodSurplus`). The vocabulary has no atom for a mineral deposit, so
 * a set declares the atoms it can name; the resource gate is held by the coherence receipt's
 * agreement arm (generationCoherence.js :: projectionAgreementFindings, its income members), which reads
 * every printed line against the town's resources and its food record. Keyed by the printed text.
 */

/** The grain line that sells a surplus, and its twin for a town whose own fields do not cover what it eats. */
export const GRAIN_SURPLUS_LINE = 'Surplus from local harvest sold to nearby settlements and passing merchants: steady income tied to the growing season.';
export const GRAIN_OWN_FIELDS_LINE = 'Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements.';

/** The metalwork line where coal stands and no iron does (COHERENCE-AGREE cure 7); it says the iron is bought in. */
export const LOCAL_COAL_LINE = 'Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.';

export const INCOME_LINE_SIBLINGS = Object.freeze({
  // F7 (REVIEW-AGREE): "surplus" only where the food record holds one — the site's gate is
  // offersFoodSurplus (grows more than it eats, and no famine); the twin is what is true otherwise.
  [GRAIN_SURPLUS_LINE]: Object.freeze([
    Object.freeze({ text: GRAIN_SURPLUS_LINE, needs: Object.freeze(['grain']), excludes: Object.freeze(['famine']) }),
    Object.freeze({ text: GRAIN_OWN_FIELDS_LINE, twinOf: GRAIN_SURPLUS_LINE, needs: Object.freeze(['grain']) }),
  ]),
  // F13 (REVIEW-AGREE): cure 7's coal line, declared from its birth at last. It says the iron is bought in, so
  // it needs the town's imports; the coal gate is the site's (the agreement arm reads the town's resources).
  [LOCAL_COAL_LINE]: Object.freeze([
    Object.freeze({ text: LOCAL_COAL_LINE, needs: Object.freeze(['imports']) }),
  ]),
});
