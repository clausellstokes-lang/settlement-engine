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

export async function generateSettlementPDF(settlement, options = {}) {
  const {
    aiSettlement = null,
    aiDailyLife = null,
    narrativeMode = false,
  } = options;

  const doc = React.createElement(SettlementPDF, {
    settlement,
    aiSettlement,
    aiDailyLife,
    narrativeMode,
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
}

export default generateSettlementPDF;
