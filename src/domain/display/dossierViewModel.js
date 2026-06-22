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
 * The first milestone proves the spine end-to-end on those two field-families;
 * later work extends the same model (viability, score labels, timeline, AI
 * grounding, public-safe projection).
 *
 * Pure; no store / React / time dependencies.
 */

import { cleanNum } from './placeholders.js';
import { deriveMagicProfile } from '../magicProfile.js';

const EXPORT_STATUS_LABEL = Object.freeze({
  none:             'No exports (economic isolation)',
  limited:          'Limited export access',
  vulnerable:       'Exports exist but trade routes are vulnerable',
  entrepot:         'Entrepôt (re-exports transit goods)',
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
 * The canonical display model. Surfaces foodBalance + exportPosture.
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
          ? 'survives on local production, magical provision, and stored reserves (no meaningful import channel reaches it)'
          : 'survives on local production and stored reserves (no meaningful import channel reaches it)';
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
 * Blockade relief — blockadeBypass gains its reader. The stockpile
 * bookkeeping (economicState.foodSecurity.stockpile, written every pulse by
 * advanceFoodStockpile) records whether a blockade currently grips the
 * settlement and which magical channel, if any, runs it. This is the display
 * read of that record: the dossier's food/viability surface can finally say
 * WHY the siege did or didn't bite instead of leaving the granary math
 * unexplained. Settlements the pulse has never touched (no stockpile record)
 * report available:false and say nothing. The prose field is named `display`
 * (the view-model idiom) — NOT `note`, which the publicSafe denylist strips.
 */
export function deriveBlockadeRelief(settlement) {
  const sp = settlement?.economicState?.foodSecurity?.stockpile || null;
  if (!sp) return { available: false, blockaded: false, bypass: null, display: null };
  const blockaded = !!sp.blockaded;
  const bypass = sp.blockadeBypass || null;
  let display = null;
  if (blockaded) {
    display = bypass === 'teleport'
      ? 'Supplies arrive by teleportation circle despite the siege, as much as the circle can carry.'
      : bypass === 'airship'
        ? 'Airships run the blockade. Imports continue, impaired by siege countermeasures.'
        : 'The blockade is biting: no magical channel runs it, and the import share of need goes unmet.';
  }
  return { available: true, blockaded, bypass, display };
}

const MAGIC_ROLE_LABEL = Object.freeze({
  economic:       'Economic',
  military:       'Military',
  medical:        'Medical',
  infrastructure: 'Infrastructure',
});

/**
 * Magic posture — MagicProfile surfaced. One read of the magic
 * profile for every display surface: the availability/legality/cost/risk
 * bands plus the four role lines. Dead-magic worlds (config.magicExists ===
 * false) keep the profile's honest 'absent' shape — the dossier must never
 * price a magic economy that does not exist.
 */
export function deriveMagicPosture(settlement) {
  const m = deriveMagicProfile(settlement);
  if (!m) {
    return { available: false, magicExists: null, display: 'Not assessed', roles: null, roleLines: [] };
  }
  return {
    available: true,
    magicExists: m.magicExists !== false,
    availability: m.availability,
    legality: m.legality,
    institutionalControl: m.institutionalControl,
    cost: m.cost,
    risk: m.risk,
    religiousAcceptance: m.religiousAcceptance,
    roles: { ...m.roles },
    display: m.magicExists === false
      ? 'Magic does not function in this world'
      : `Availability ${m.availability}: ${m.legality}, ${m.cost} services, ${m.risk} risk`,
    roleLines: Object.entries(m.roles).map(([role, band]) => `${MAGIC_ROLE_LABEL[role] || role} role: ${band}`),
  };
}

/**
 * The canonical display model. Surfaces foodBalance + exportPosture,
 * viability, the magic posture, and blockade relief.
 * The `aiOverlay` option is reserved for later milestones (prose-field
 * overlays); these are canonical simulation facts and always read from the
 * base settlement, never an AI clone.
 */
/**
 * Headcounts (§overview). The institution / NPC / faction totals that BOTH the
 * screen overview and the PDF overview render — sourced identically here so the
 * two surfaces can never disagree on a count.
 * @param {any} settlement
 * @returns {{ institutions: number, npcs: number, factions: number }}
 */
export function deriveHeadcounts(settlement) {
  const s = settlement || {};
  return {
    institutions: (s.institutions || []).length,
    npcs: (s.npcs || []).length,
    // PowerStructure.factions is the canonical faction roster (legacy .factions fallback).
    factions: (s.powerStructure?.factions || s.factions || []).length,
  };
}

/**
 * Prosperity label (§overview/economics) — the prosperity enum BOTH the screen and
 * the PDF render. The COLOR/tone is intentionally per-surface (the web uses an RGB
 * scale, the PDF a print palette), so only the label is a shared scalar.
 * @param {any} settlement
 * @returns {{ label: string | null }}
 */
export function deriveProsperityPosture(settlement) {
  return { label: settlement?.economicState?.prosperity || null };
}

/**
 * Safety label (§overview) — the safetyProfile.safetyLabel BOTH surfaces render.
 * Tone is per-surface (see deriveProsperityPosture); only the label is shared.
 * @param {any} settlement
 * @returns {{ label: string | null }}
 */
export function deriveSafetyPosture(settlement) {
  return { label: settlement?.economicState?.safetyProfile?.safetyLabel || null };
}

/**
 * Defense posture (§overview/defense) — the readiness label + average defense
 * score BOTH surfaces render. scoreAvg mirrors the PDF avgScore helper exactly
 * (rounded mean of the numeric score values); the parity pin guards the two copies
 * against future drift.
 * @param {any} settlement
 * @returns {{ readinessLabel: string | null, scoreAvg: number | null }}
 */
export function deriveDefensePosture(settlement) {
  const dp = settlement?.defenseProfile || {};
  const vals = Object.values(dp.scores || {}).filter((v) => typeof v === 'number');
  const scoreAvg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  return { readinessLabel: dp.readiness?.label || null, scoreAvg };
}

/**
 * Top export label (§summary) — labelOfThing(primaryExports[0]); mirrors the PDF
 * labelOfThing helper exactly (the good/name/label of the first primary export).
 * @param {any} settlement
 * @returns {{ label: string }}
 */
export function deriveTopExport(settlement) {
  const item = settlement?.economicState?.primaryExports?.[0];
  if (!item) return { label: '' };
  if (typeof item === 'string') return { label: item };
  return { label: item.good || item.name || item.label || '' };
}

export function deriveDossierViewModel(settlement, { aiOverlay: _aiOverlay = null } = {}) {
  return {
    foodBalance: deriveFoodBalance(settlement),
    exportPosture: deriveExportPosture(settlement),
    viability: deriveViability(settlement),
    magic: deriveMagicPosture(settlement),
    blockade: deriveBlockadeRelief(settlement),
    headcounts: deriveHeadcounts(settlement),
    prosperity: deriveProsperityPosture(settlement),
    safety: deriveSafetyPosture(settlement),
    defense: deriveDefensePosture(settlement),
    topExport: deriveTopExport(settlement),
  };
}
