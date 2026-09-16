/**
 * generateFoundryModule — build and download a settlement as a Foundry VTT
 * module zip (docs/briefs/SESSION_FOUNDRY_SCOPE.md).
 *
 * Sibling of generateSettlementPDF with the SAME option contract, so
 * SettlementDetail threads one export context to both formats — in particular
 * `campaign` (plain structured-cloneable live-world data) and `faithUnlocked`
 * (the premium faith seam; default false is the safe one). Content comes from
 * the canonical buildViewModel slices; the Faith & War journal page is gated
 * by the literal faithChapterVisible predicate inside buildJournalPages.
 *
 * Lazy-chunk contract: this module is reached ONLY via dynamic import() from
 * the export surface (tests/build/foundryLazy.test.js). No worker needed —
 * unlike @react-pdf's multi-second layout, JSON + a store-only zip is
 * milliseconds of main-thread work.
 */
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { buildViewModel } from '../pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from './moduleBuilder.js';
import { buildZip } from './zip.js';
import { track, EVENTS } from '../lib/analytics.js';

export async function generateFoundryModule(settlement, options = {}) {
  const {
    aiSettlement = null,
    aiDailyLife = null,
    narrativeMode = false,
    systemState = null,
    eventLog = [],
    phase = 'draft',
    // Live campaign world — plain cloneable { settlementId, worldState,
    // regionalGraph, settlements?, nameById? }; null ⇒ no live Faith & War.
    campaign = null,
    // The faith premium seam (mirrors FaithSection / the PDF export). Only a
    // premium / elevated export unlocks the Faith & War page. Default false ⇒
    // free / lapsed / anon exports never carry deity names.
    faithUnlocked = false,
    variant = 'canon_dossier',
  } = options;

  // Canonical-shape adapter at the export boundary — same doctrine as the PDF
  // (saves from before the version stamps normalize here once).
  const normalized = normalizeSettlement(settlement);

  const vm = buildViewModel({
    settlement: normalized, aiSettlement, aiDailyLife, narrativeMode,
    systemState, eventLog, phase, campaign,
  });

  const { moduleId, files, pages } = buildFoundryModuleFiles({
    settlement: normalized, vm, variant, faithUnlocked,
  });

  const zipBytes = buildZip(files);
  const blob = new Blob([zipBytes], { type: 'application/zip' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${moduleId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Fire-and-forget analytics — a fault here must never surface as an export
  // failure. Props are coarse (enum/boolean) per the analytics hygiene rule.
  try {
    track(EVENTS.FOUNDRY_EXPORT_COMPLETED, {
      scope: 'settlement',
      variant,
      canon_phase: typeof phase === 'string' ? phase : 'draft',
      narrative_mode: !!narrativeMode,
      faith_included: pages.some(p => p.name === 'Faith & War'),
    });
  } catch { /* analytics never breaks export */ }
}

export default generateFoundryModule;
