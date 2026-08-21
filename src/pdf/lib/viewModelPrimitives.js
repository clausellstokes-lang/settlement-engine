/**
 * viewModelPrimitives.js — the small shared readers of the PDF view model,
 * moved out of viewModel.js verbatim by THE DECOMPOSITION WAVE (lane D).
 *
 * These four are the only helpers the head AND the body-slice leaf both need,
 * so they live below both and neither imports the other — the split is
 * cycle-free by construction. Every body is byte-identical to its pre-split
 * source; this module adds no behaviour of its own.
 */
import { flag } from '../../lib/flags.js';
import { deriveFoodBalance } from '../../domain/display/dossierViewModel.js';

/**
 * settlement.stress is sometimes an array, sometimes a single stress
 * object, sometimes null/undefined — depends on which generator path
 * produced the settlement. Normalize to array at every read site so the
 * downstream code can iterate uniformly. Caught by the PDF section
 * smoke tests in tests/pdf/sections.smoke.test.js.
 */
export function stressArray(s) {
  if (Array.isArray(s?.stress)) return s.stress;
  if (s?.stress) return [s.stress];
  return [];
}

// imports cover this % of the pre-import gap (qty ÷ rawDeficit). Mirrors the web
// EconomicsTab ("Trade covers X% of gap"). importCoverage is a QUANTITY (lb/day),
// NOT a percent — printing it directly produced the bogus "imports cover 15929%".
// Falls back to 100% of the import qty when the gap is unknown.
// Private: foodCore below is its only reader, here as in viewModel.js before the split.
function coveragePct(ic, rd) {
  return ic > 0 ? Math.round((ic / (rd || ic)) * 100) : null;
}

/**
 * Food-balance core fields, shared by the raw + active slices. Behind the
 * canonicalViewModel flag these come from the display model (which reads the
 * real dailyProduction/dailyNeed fields and applies the §1c "Not calculated"
 * fallback); otherwise the legacy shape is preserved verbatim. `viability`
 * is the economicViability object (not the whole settlement).
 */
export function foodCore(viability) {
  const fb = viability?.metrics?.foodBalance || null;
  if (flag('canonicalViewModel')) {
    const m = deriveFoodBalance({ economicViability: viability });
    return {
      production: m.produced,
      need:       m.needed,
      deficit:    m.deficit || null,
      surplus:    m.surplus || null,
      importCoverage: m.importCoverage,
      rawDeficit: m.rawDeficit,
      coveragePct: coveragePct(m.importCoverage, m.rawDeficit),
      deficitPct: m.deficitPct,
      display:    m.display,
      detail:     m.detail,
    };
  }
  // The engine emits dailyProduction/dailyNeed; the old .production/.need reads
  // left the flag-off PDF showing "Not calculated" and losing the deficit %.
  const prod = fb?.dailyProduction ?? fb?.production ?? null;
  const need = fb?.dailyNeed ?? fb?.need ?? null;
  const legacyNeed = Number(need) || 0;
  const legacyDef = Number(fb?.deficit) || 0;
  return {
    production: prod,
    need,
    deficit:    fb?.deficit ?? null,
    surplus:    fb?.surplus ?? null,
    importCoverage: fb?.importCoverage ?? null,
    rawDeficit: fb?.rawDeficit ?? null,
    coveragePct: coveragePct(fb?.importCoverage, fb?.rawDeficit),
    // Residual deficit ÷ daily need — the SAME "% of need" the flag-on branch and
    // the screen show. NOT the engine's gross fb.deficitPercent (deficit ÷
    // adjustedNeed, pre-import), which disagrees on every import-dependent
    // settlement. (A+ pdf.2 — one fact, one derivation, even on the killswitch path.)
    deficitPct: legacyNeed > 0 && legacyDef > 0 ? Math.round((legacyDef / legacyNeed) * 100) : null,
  };
}

export function avgScore(scores) {
  const vals = Object.values(scores || {}).filter(v => typeof v === 'number');
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
