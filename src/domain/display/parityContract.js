/**
 * parityContract.js — the screen↔PDF parity contract, as DATA (A+ pdf.5).
 *
 * SHARED_FIELDS enumerates the dossier facts that BOTH render paths surface and
 * that MUST therefore render the same value: the canonical display model the web
 * reads (deriveDossierViewModel) and the PDF view-model (buildViewModel). The
 * parity test (tests/pdf/viewModelParity.test.js) walks this list and asserts
 * canon === vm for every row — so the DEFAULT for any new shared fact is "must
 * match", and a divergence fails the build naming the exact fact.
 *
 * PARITY_EXEMPT enumerates the facts that legitimately differ — AI-only prose and
 * pure layout/formatting — each with a one-line reason. Adding a fact to one
 * renderer without either a SHARED_FIELDS row or an exemption is the thing this
 * contract exists to make impossible to do silently.
 *
 * Each SHARED_FIELDS row:
 *   - fact:        human label for the assertion message.
 *   - canonPath:   dot-path into deriveDossierViewModel(settlement).
 *   - vmPaths:     one or more dot-paths into buildViewModel({settlement}) that
 *                  must all equal the canon value (a fact often appears in several
 *                  PDF slices — overview + economics — and all must agree).
 *   - normalizeVm: optional (vmValue) => value, for slices that coalesce 0→null.
 *
 * Extending this (pdf.4 follow-on): add rows for export posture (status/label),
 * viability (verdict/label), prosperity/safety label+tone, defense readiness, and
 * headcounts once each is read from the shared layer by BOTH surfaces. Each new
 * row needs its canonPath in deriveDossierViewModel and matching vmPath(s).
 */

/**
 * A shared dossier fact that both render paths must agree on.
 * @typedef {Object} SharedField
 * @property {string} fact                       human label for the assertion message
 * @property {string} canonPath                  dot-path into deriveDossierViewModel()
 * @property {string[]} vmPaths                  dot-path(s) into buildViewModel() that must equal canon
 * @property {(v: unknown) => unknown} [normalizeVm]  optional vm-value normalizer (e.g. 0↔null)
 */

/**
 * Read a dot-path (e.g. 'overview.foodBalance.deficitPct') off an object.
 * @param {unknown} obj
 * @param {string} path
 * @returns {unknown}
 */
export function getByPath(obj, path) {
  return path.split('.').reduce((/** @type {unknown} */ o, /** @type {string} */ k) => {
    if (o == null || typeof o !== 'object') return undefined;
    return /** @type {Record<string, unknown>} */ (o)[k];
  }, /** @type {unknown} */ (obj));
}

/** @type {readonly SharedField[]} */
export const SHARED_FIELDS = Object.freeze([
  {
    fact: 'food.deficitPct (residual deficit ÷ daily need)',
    canonPath: 'foodBalance.deficitPct',
    vmPaths: ['overview.foodBalance.deficitPct', 'economics.foodBalance.deficitPct'],
  },
  {
    // overview slice coalesces 0 → null (`m.deficit || null`); normalize for compare.
    fact: 'food.deficit (lb/day)',
    canonPath: 'foodBalance.deficit',
    vmPaths: ['overview.foodBalance.deficit'],
    normalizeVm: (v) => v ?? 0,
  },
  {
    fact: 'food.surplus (lb/day)',
    canonPath: 'foodBalance.surplus',
    vmPaths: ['overview.foodBalance.surplus'],
    normalizeVm: (v) => v ?? 0,
  },
]);

export const PARITY_EXEMPT = Object.freeze([
  { fact: 'summary.arrivalScene',  reason: 'AI-only prose (narrativeMode); no canonical scalar equivalent.' },
  { fact: 'overview.thesis',       reason: 'AI-only prose (narrativeMode).' },
  { fact: 'aiAppendix.*',          reason: 'AI-narrative path only; absent from the data dossier.' },
  { fact: 'daily.passages',        reason: 'AI-only prose passages (narrativeMode).' },
  { fact: 'tone color hex / bar widths', reason: 'Pure layout/formatting, not a shared data value.' },
]);
