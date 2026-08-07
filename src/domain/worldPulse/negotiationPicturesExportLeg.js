/**
 * negotiationPicturesExportLeg.js — the one place a settlement's real export
 * list becomes a negotiation subject's banded export leg.
 *
 * WHY IT IS ITS OWN LEAF AND NOT PART OF `negotiationPictures.js`. That module
 * sits inside the K3 negotiation fence: it accepts only versioned, qualitative
 * records, its reviewed import set is `./peaceTerms.js` alone, and the word
 * `economicState` is one of the true-state tokens the fence forbids it to
 * contain (tests/domain/envoyK3BeliefSeam.test.js). Turning live settlement
 * facts into a picture is exactly the job the fence pushes OUTSIDE itself —
 * `envoyNegotiationPictureBuilder.js`'s header says so in as many words — so the
 * read lives here, one hop outside, and the fenced module never learns it exists.
 *
 * WHAT IT REPAIRS. Both picture mints grew their own probe of
 * `settlement.economicState.exports`; the envoy one also probed
 * `settlement.economy` and `settlement.trade`. The economy generator writes none
 * of the three. It writes `economicState.primaryExports`, and `exports` survives
 * only as a legacy save alias. Measured through the full pipeline over 60
 * generated settlements: `economicState.exports` 0/60, `economy` 0/60, `trade`
 * 0/60, `economicState.primaryExports` 60/60. So both mints answered `unknown`
 * for every settlement in production and their `known` arms were structurally
 * unreachable — every negotiation picture said "exports unknown", and because a
 * null `loserExports` omits the whole `export_flows` asset class,
 * `appraiseLoserPortfolioFromInputs` appraised no export term at all.
 *
 * This is the same defect class that produced the capacityModel P1.2 bug and the
 * Current-State "No exports" contradiction (see display/dossierViewModel.js's
 * header). `domain/canonicalAccessors.js` was built as its cure and
 * settlement.schema.js §69-71 names it the single resolution point for this
 * alias pair. Reading through it here — one writer for both mints — is what
 * stops a third picture from re-forking the chain a fourth time.
 */

import { canonExports, canonExportsPresent } from '../canonicalAccessors.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** One export row's label, across the authored shapes legacy saves carry.
 *  @param {unknown} raw @returns {string} */
function exportLabelOf(raw) {
  if (typeof raw === 'string') return raw.trim();
  const row = recordOf(raw);
  const named = row.name || row.good || row.resource || row.label;
  return typeof named === 'string' ? named.trim() : '';
}

/**
 * The negotiation subject's export leg for one settlement.
 *
 * KNOWLEDGE IS NOT THE SAME AS EMPTINESS. An authored-but-empty list is a court
 * that knows its rival ships nothing — peaceTermsAppraisal drafts a `tribute`
 * term against it — while an absent list is real ignorance, for which no export
 * term is appraised at all. `canonExportsPresent` keeps the two apart, per the
 * picture rule that a missing observation stays `unknown` and is never
 * translated into a neutral fact.
 *
 * The returned list is trimmed, non-empty, deduped and codepoint-ordered, which
 * is byte-identical to what `negotiationPictures.js`'s own `authoredTexts`
 * derives — the form `createSubject` re-derives and `normalizeSubject` then
 * demands by JSON identity. The round-trip pin in
 * tests/domain/negotiationExportLeg.test.js is what holds the two in step.
 *
 * @param {unknown} settlement
 * @returns {{ exportKnowledge: 'known'|'unknown', exports: string[] }}
 */
export function negotiationExportLeg(settlement) {
  const row = /** @type {{ economicState?: { primaryExports?: unknown, exports?: unknown } }} */ (
    recordOf(settlement)
  );
  if (!canonExportsPresent(row)) return { exportKnowledge: 'unknown', exports: [] };
  const labels = canonExports(row).map(exportLabelOf).filter(Boolean);
  return { exportKnowledge: 'known', exports: [...new Set(labels)].sort() };
}
