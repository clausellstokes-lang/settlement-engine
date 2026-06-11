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

const VIABILITY_LABEL = Object.freeze({
  not_viable:      'Not viable',
  strained:        'Viable but strained',
  dependent:       'Viable with critical dependencies',
  self_sufficient: 'Viable',
  unknown:         'Unknown',
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
      surplus: 0, deficit: 0, deficitPct: null, deficitPercent: null,
      produced: null, needed: null, importCoverage: null, rawDeficit: null,
      importChannel: null, magicFoodOffset: null, magicFoodNote: null,
    };
  }
  const produced = cleanNum(fb.dailyProduction);
  const needed   = cleanNum(fb.dailyNeed);
  const surplus  = Math.max(cleanNum(fb.surplus, 0), 0);
  const deficit  = Math.max(cleanNum(fb.deficit, 0), 0);
  const rawKnown = produced != null && needed != null && (produced > 0 || needed > 0);

  // Normalize the residual deficit against need. A raw absolute (e.g. −4096)
  // looks alarming out of context, but as a share of demand it reads as the
  // minor shortfall it usually is — most settlements run a little hungry, and
  // that's the baseline, not a broken settlement. Shown as a % of need.
  const deficitPct = (needed != null && needed > 0) ? Math.round((deficit / needed) * 100) : null;

  let display;
  if (deficit > 0)      display = deficitPct != null ? `Deficit −${fmtInt(deficit)} (${deficitPct}% of need)` : `Deficit −${fmtInt(deficit)}`;
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
    // Residual deficit normalized as a share of daily need (null when unknown).
    deficitPct,
    deficitPercent: cleanNum(fb.deficitPercent),
    produced: rawKnown ? produced : null,
    needed: rawKnown ? needed : null,
    // importCoverage is a QUANTITY (lb/day of the gap covered by imports), not a
    // percent. rawDeficit is the pre-import gap (need − production). The display
    // layer computes coverage% = importCoverage / rawDeficit, mirroring the web.
    importCoverage: cleanNum(fb.importCoverage),
    rawDeficit: cleanNum(fb.rawDeficit),
    // Attribution: which channel carries the imports (e.g. 'teleportation
    // circle', 'minor routes and sanctioned caravans') and how much of the
    // gap magic closes — lets displays explain deficit < (needed − produced).
    importChannel: fb.importChannel || null,
    magicFoodOffset: cleanNum(fb.magicFoodOffset),
    magicFoodNote: fb.magicFoodNote || null,
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
/**
 * Viability verdict (§1f). Reconciles the generator's verdict with the food
 * balance + trade dependencies so the wording never claims "self-sufficient"
 * while the dossier shows a food deficit. buildConflict() (economicGenerator)
 * only checks dependency warnings for its "self-sufficient" branch — it
 * ignores a food deficit — which is the contradiction this corrects.
 */
export function deriveViability(settlement) {
  const v = settlement?.economicViability || {};
  const rawSummary = v.summary || null;

  if (v.viable === false) {
    return {
      viable: false, verdict: 'not_viable', label: VIABILITY_LABEL.not_viable,
      summary: rawSummary || 'Not viable: critical issues prevent the settlement from surviving.',
      rawSummary,
    };
  }
  if (v.viable == null && !rawSummary) {
    return { viable: null, verdict: 'unknown', label: VIABILITY_LABEL.unknown, summary: 'Viability not assessed.', rawSummary };
  }

  const food = deriveFoodBalance(settlement);
  const dependencyCount = Array.isArray(v.dependencies) ? v.dependencies.length : 0;

  if (food.deficit > 0) {
    // "Depends on imports" must match what the import channel actually is:
    // an isolated settlement with 0% coverage survives on stores and local
    // production, not on imports it does not receive (the Yunwan bug).
    const access = settlement?.economicViability?.metrics?.tradeAccess
                || settlement?.config?.tradeRouteAccess
                || 'unknown';
    const covered = (food.importCoverage || 0) > 0;
    let foodClause = 'depends on imports for food security';
    if (access === 'isolated') {
      const channel = food.importChannel === 'teleportation circle'
        ? 'the teleportation circle'
        : food.importChannel;
      // "Magical provision" is only honest when magic actually closes part
      // of the gap (magicFoodOffset > 0) — a mundane caravan trickle in a
      // magicExists:false world must not read as magically fed.
      const magicFed = (food.magicFoodOffset || 0) > 0;
      if (covered) {
        // Legacy saves carry importCoverage without importChannel — the
        // imports are real (Economics shows the coverage), the route just
        // wasn't recorded. Channel-agnostic wording, never the
        // "no meaningful import channel" clause.
        const through = channel || 'trade imports';
        foodClause = magicFed
          ? `feeds itself through ${through}, magical provision, and stored reserves`
          : `feeds itself through ${through} and stored reserves`;
      } else {
        foodClause = magicFed
          ? 'survives on local production, magical provision, and stored reserves — no meaningful import channel reaches it'
          : 'survives on local production and stored reserves — no meaningful import channel reaches it';
      }
    }
    return {
      viable: true, verdict: 'strained', label: VIABILITY_LABEL.strained,
      summary: `VIABLE BUT STRAINED: historically plausible and institutionally functional, but ${foodClause}.`,
      rawSummary,
    };
  }
  if (dependencyCount > 0) {
    return {
      viable: true, verdict: 'dependent', label: VIABILITY_LABEL.dependent,
      summary: `VIABLE WITH CRITICAL DEPENDENCIES: the settlement can function, but its survival depends on ${dependencyCount} stable trade ${dependencyCount > 1 ? 'dependencies' : 'dependency'} and protected routes.`,
      rawSummary,
    };
  }
  return {
    viable: true, verdict: 'self_sufficient', label: VIABILITY_LABEL.self_sufficient,
    summary: 'VIABLE: economically self-sufficient and historically plausible.',
    rawSummary,
  };
}

/**
 * The canonical display model. M0.1 surfaced foodBalance + exportPosture; M0.2
 * adds viability. The `aiOverlay` option is reserved for later milestones
 * (prose-field overlays); these are canonical simulation facts and always read
 * from the base settlement, never an AI clone.
 */
export function deriveDossierViewModel(settlement, { aiOverlay: _aiOverlay = null } = {}) {
  return {
    foodBalance: deriveFoodBalance(settlement),
    exportPosture: deriveExportPosture(settlement),
    viability: deriveViability(settlement),
  };
}
