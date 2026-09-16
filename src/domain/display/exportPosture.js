/**
 * domain/display/exportPosture.js — the export-posture read-model (§1d),
 * extracted to a dependency-free leaf.
 *
 * WHY ITS OWN MODULE (the dossier read-model split, first-paint program FP-1):
 * deriveSystemState.js — EAGER, statically reachable from the store's event
 * pipeline — needs exactly one display derivation: deriveExportPosture. While
 * that function lived inside dossierViewModel.js, the eager graph dragged the
 * ENTIRE canonical display model (plus its magicProfile edge) into the
 * first-paint entry chunk. This leaf carries only the posture derivation +
 * its label table; dossierViewModel re-exports it verbatim, so every lazy
 * display surface keeps its import path and the derivation stays single-
 * source. Zero imports here — keep it that way: an import edge from this
 * leaf into display/domain machinery re-drags that machinery eager.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 *
 * Pure; no store / React / time dependencies.
 */

const EXPORT_STATUS_LABEL = Object.freeze({
  none:             'No exports — economic isolation',
  limited:          'Limited export access',
  vulnerable:       'Exports exist but trade routes are vulnerable',
  entrepot:         'Entrepôt — re-exports transit goods',
  import_dependent: 'Import-dependent',
  established:      'Active exports',
});

/**
 * @param {unknown} v
 * @returns {unknown[]}
 */
function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  return v ? [v] : [];
}

/**
 * Export posture (§1d). Single source for "does this settlement export, and
 * how exposed is that trade?". Reads economicState.primaryExports (what the
 * Economics surface shows), falling back to the legacy economicState.exports.
 *
 * @param {import('./dossierViewModel.js').DossierSettlementView | null | undefined} settlement
 */
export function deriveExportPosture(settlement) {
  /** @type {import('./dossierViewModel.js').EconStateView} */
  const eco = settlement?.economicState || {};
  const primary = toArray(eco.primaryExports);
  const exports = primary.length ? primary : toArray(eco.exports);
  const count = exports.length;
  const isEntrepot = !!eco.isEntrepot;
  const access = settlement?.economicViability?.metrics?.tradeAccess
              || settlement?.config?.tradeRouteAccess
              || 'unknown';

  /** @type {keyof typeof EXPORT_STATUS_LABEL} */
  let status;
  if (count === 0)               status = 'none';
  else if (isEntrepot)           status = 'entrepot';
  else if (access === 'isolated') status = 'vulnerable';
  else if (count === 1)          status = 'limited';
  else                           status = 'established';

  return { status, label: EXPORT_STATUS_LABEL[status], exports, count, isEntrepot, access };
}
