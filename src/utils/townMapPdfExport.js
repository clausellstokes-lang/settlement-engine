/**
 * townMapPdfExport.js — the SINGLE-MAP PDF export builder (MAP EXPORTS).
 *
 * Builds a one-page town-map PDF (src/pdf/TownMapDocument.jsx) under the current
 * lens and triggers the browser download. The heavy stack — @react-pdf/renderer
 * and the react-pdf document — arrives via dynamic import() INSIDE the builder, so
 * nothing here drags PDF vendor bytes into first paint (the vendor-pdf lazy
 * contract, tests/build/vendorPdfLazy.test.js); this module is itself reached only
 * through the export menu's on-click dynamic import.
 *
 * WHY src/utils (not src/lib): tsconfig.full.json's tsc gate includes src/lib/**.js
 * but DELIBERATELY excludes the PDF/component .jsx tree (which carries ~650 latent
 * JSDoc inferred-prop errors — its own remediation project) AND excludes src/utils.
 * A checked src/lib .js that imports a .jsx would drag that untyped .jsx subtree
 * into the checkJs program and surface those latent errors. So this PDF builder
 * lives beside its sibling src/utils/generateSettlementPDF.js — the exact same
 * "PDF export entry that dynamically imports a react-pdf .jsx" shape, kept out of
 * the tsc include for the same reason.
 */
import React from 'react';
import { downloadBlob, exportLens, townMapExportFilename } from '../lib/townMapExport.js';

/**
 * Render + download the single-map PDF for a settlement under a lens. Resolves to
 * the PDF Blob (so a caller could also preview/upload it). Browser-only (needs a
 * document to trigger the download).
 * @param {any} settlement
 * @param {{ style?: string, filename?: string, date?: Date }} [opts]
 * @returns {Promise<Blob>}
 */
export async function generateTownMapPdf(settlement, opts = {}) {
  const [{ pdf }, { TownMapDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../pdf/TownMapDocument.jsx'),
  ]);
  const style = opts.style;
  const blob = await pdf(
    React.createElement(TownMapDocument, { settlement, style }),
  ).toBlob();

  const lens = exportLens(settlement, style);
  const filename = opts.filename || townMapExportFilename(settlement?.name, lens, 'pdf', opts.date);
  downloadBlob(blob, filename);
  return blob;
}

export default generateTownMapPdf;
