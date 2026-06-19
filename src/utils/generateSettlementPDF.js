/**
 * generateSettlementPDF — entry point that builds and downloads the dossier PDF.
 *
 * Replaces the legacy hand-painted jsPDF generator with a thin wrapper around
 * @react-pdf/renderer. The actual layout lives in src/pdf/SettlementPDF.jsx
 * and its supporting primitives / sections under src/pdf/.
 *
 * Signature is backward-compatible — existing callers may invoke
 *   generateSettlementPDF(settlement)
 * and get a clean dossier. To export the AI narrative edition, callers should
 * pass:
 *   generateSettlementPDF(settlement, { aiSettlement, narrativeMode: true })
 *
 * The function is async (the PDF blob is generated off the main render path)
 * and resolves once the browser download has been triggered.
 */
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { SettlementPDF } from '../pdf/SettlementPDF.jsx';
import { normalizeSettlement } from '../domain/normalizeSettlement.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';

/** duration_band vocabulary (taxonomy §Banding): lt_5s · 5_15s · 15_60s · 1_5m · 5_30m · gt_30m */
function durationBand(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n < 0) return 'unknown';
  if (n < 5000) return 'lt_5s';
  if (n < 15000) return '5_15s';
  if (n < 60000) return '15_60s';
  if (n < 300000) return '1_5m';
  if (n < 1800000) return '5_30m';
  return 'gt_30m';
}

export async function generateSettlementPDF(settlement, options = {}) {
  const {
    aiSettlement = null,
    aiDailyLife = null,
    narrativeMode = false,
    // Campaign-state engine extras — when present, the PDF emits the
    // SystemStateSnapshot chapter (always) and the Timeline chapter
    // (canon mode only). Optional; PDFs from before this feature still
    // render cleanly without them.
    systemState = null,
    eventLog = [],
    phase = 'draft',
    // UX Phase 7 — the LIVE campaign world ({ worldState, regionalGraph,
    // settlements?, nameFor? }) for the Faith & War chapter. Passed ONLY for
    // premium exports (the caller gates at the data layer). Absent/null for
    // free/anon/non-campaign exports ⇒ the base PDF renders unchanged.
    campaign = null,
    // Audit recommendation: three export variants. Default preserves
    // the previous behavior so any pre-existing caller gets the same
    // PDF it always got.
    variant = 'canon_dossier',
    // Founder Lifetime exporters get a "Founder Edition" badge on the
    // cover. The flag is read at export time so revoking founder status
    // (refund, etc.) immediately stops the badge appearing on new
    // exports. Existing exported PDFs are obviously unchanged.
    isFounder = false,
    // Anonymous / unauthenticated exporters get a small parchment-stripe
    // watermark in the cover footer. Used by the single-dossier success
    // page (no account) and any other unauthenticated PDF path. Real
    // accounts (even Wanderer/free) get clean exports. The watermark
    // discourages bulk scraping of the anonymous homepage hero for
    // resale and signals "free preview" without being obnoxious.
    isAnonymous = false,
  } = options;

  const startedAt = Date.now();

  // Run the canonical-shape adapter at the export boundary. Saves loaded
  // from before Phase 6 don't yet carry version stamps; normalizing here
  // means every PDF chapter can rely on the canonical contract without
  // each section adding its own defensive guards.
  const normalizedSettlement = normalizeSettlement(settlement);

  const doc = React.createElement(SettlementPDF, {
    settlement: normalizedSettlement,
    aiSettlement,
    aiDailyLife,
    narrativeMode,
    systemState,
    eventLog,
    phase,
    campaign,
    variant,
    isFounder,
    isAnonymous,
  });

  const blob = await pdf(doc).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const safeName = (settlement?.name || 'settlement')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'settlement';
  const suffix = narrativeMode ? '_narrative' : '_dossier';
  a.download = `${safeName}${suffix}.pdf`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Export succeeded (download triggered) — emit the success event + structural
  // snapshot. Both are fire-and-forget; a fault here must never surface as an
  // export failure to the caller. captureFingerprint silently skips when no
  // stable uuid is available (anonymous exports).
  try {
    track(EVENTS.PDF_EXPORT_COMPLETED, {
      scope: 'settlement',
      narrative_mode: !!narrativeMode,
      canon_phase: typeof phase === 'string' ? phase : 'draft',
      duration_band: durationBand(Date.now() - startedAt),
    });
    captureFingerprint('exported', settlement, { settlementUuid: options.settlementUuid });
  } catch { /* analytics never breaks export */ }
}

export default generateSettlementPDF;
