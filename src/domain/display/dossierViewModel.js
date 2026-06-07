/**
 * domain/display/dossierViewModel.js
 *
 * The canonical display model (feature doc §1). ONE derivation of
 * display-ready settlement facts that every surface — UI tabs, PDF, gallery,
 * AI grounding — consumes, so a single rule change fixes all surfaces and
 * they cannot silently drift apart.
 *
 * Today, three surfaces re-derive facts independently and contradict:
 *   - PDF (src/pdf/lib/viewModel.js) read foodBalance.production / .need —
 *     fields that don't exist (the generator emits dailyProduction /
 *     dailyNeed) — so the PDF showed "Produced 0 / Needed 0" beside a real
 *     surplus (§1c).
 *   - Current State (src/domain/state/deriveSystemState.js) read
 *     economicState.exports — a field economicState doesn't populate — and
 *     so reported "No exports" while Economics listed economicState
 *     .primaryExports (§1d).
 *
 * M0.1 proves the spine end-to-end on those two field-families; later
 * milestones extend the same model (viability, score labels, timeline, AI
 * grounding, public-safe projection).
 *
 * Pure; no store / React / time dependencies.
 */

import { cleanNum } from './placeholders.js';

const EXPORT_STATUS_LABEL = Object.freeze({
  none:             'No exports — economic isolation',
  limited:          'Limited export access',
  vulnerable:       'Exports exist but trade routes are vulnerable',
  entrepot:         'Entrepôt — re-exports transit goods',
  import_dependent: 'Import-dependent',
  established:      'Active exports',
});

function fmtInt(n) {
  const v = cleanNum(n);
  return v == null ? null : Math.round(v).toLocaleString('en-US');
}

function toArray(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  return v ? [v] : [];
}

/**
 * Food balance (§1c). Reads the generator output at
 * economicViability.metrics.foodBalance, whose real fields are
 * dailyProduction / dailyNeed (NOT production / need). Enforces the rule:
 * never show produced=0 & needed=0 next to a non-zero surplus/deficit —
 * fall back to "Not calculated".
 */
export function deriveFoodBalance(settlement) {
  const fb = settlement?.economicViability?.metrics?.foodBalance || null;
  if (!fb) {
    return {
      available: false,
      display: 'Not calculated',
      detail: 'Produced/Needed: Not calculated',
      surplus: 0, deficit: 0, deficitPercent: null,
      produced: null, needed: null, importCoverage: null,
    };
  }
  const produced = cleanNum(fb.dailyProduction);
  const needed   = cleanNum(fb.dailyNeed);
  const surplus  = Math.max(cleanNum(fb.surplus, 0), 0);
  const deficit  = Math.max(cleanNum(fb.deficit, 0), 0);
  const rawKnown = produced != null && needed != null && (produced > 0 || needed > 0);

  let display;
  if (deficit > 0)      display = `Deficit −${fmtInt(deficit)}`;
  else if (surplus > 0) display = `Surplus +${fmtInt(surplus)}`;
  else                  display = 'Balanced';

  return {
    available: true,
    display,
    detail: rawKnown
      ? `Produced/Needed: ${fmtInt(produced)} / ${fmtInt(needed)} lb/day`
      : 'Produced/Needed: Not calculated',
    surplus,
    deficit,
    deficitPercent: cleanNum(fb.deficitPercent),
    produced: rawKnown ? produced : null,
    needed: rawKnown ? needed : null,
    importCoverage: cleanNum(fb.importCoverage),
  };
}

/**
 * Export posture (§1d). Single source for "does this settlement export, and
 * how exposed is that trade?". Reads economicState.primaryExports (what the
 * Economics surface shows), falling back to the legacy economicState.exports.
 */
export function deriveExportPosture(settlement) {
  const eco = settlement?.economicState || {};
  const primary = toArray(eco.primaryExports);
  const exports = primary.length ? primary : toArray(eco.exports);
  const count = exports.length;
  const isEntrepot = !!eco.isEntrepot;
  const access = settlement?.economicViability?.metrics?.tradeAccess
              || settlement?.config?.tradeRouteAccess
              || 'unknown';

  let status;
  if (count === 0)               status = 'none';
  else if (isEntrepot)           status = 'entrepot';
  else if (access === 'isolated') status = 'vulnerable';
  else if (count === 1)          status = 'limited';
  else                           status = 'established';

  return { status, label: EXPORT_STATUS_LABEL[status], exports, count, isEntrepot, access };
}

/**
 * The canonical display model. M0.1 surfaces foodBalance + exportPosture.
 * The `aiOverlay` option is reserved for later milestones (prose-field
 * overlays); food + exports are canonical simulation facts and always read
 * from the base settlement, never an AI clone.
 */
export function deriveDossierViewModel(settlement, { aiOverlay: _aiOverlay = null } = {}) {
  return {
    foodBalance: deriveFoodBalance(settlement),
    exportPosture: deriveExportPosture(settlement),
  };
}
