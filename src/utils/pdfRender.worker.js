/**
 * pdfRender.worker.js — the dossier PDF render lane, off the main thread (F41).
 *
 * @react-pdf's toBlob() runs its reconcile + layout + serialization
 * synchronously — a multi-second main-thread freeze on a large dossier, at the
 * exact moment a paying DM judges the product. This worker owns that render:
 * it receives the SettlementPDF props (plain, structured-cloneable data — the
 * settlement is normalized on the main thread first), builds the element tree,
 * renders the blob, and posts it back. The page stays interactive throughout.
 *
 * Protocol (matched by src/utils/generateSettlementPDF.js):
 *   in  : { id, props }            — props = SettlementPDF component props
 *   out : { id, ok: true,  blob }  — rendered PDF Blob
 *         { id, ok: false, error } — render threw; error is the message string
 *
 * The `id` correlates request/response so overlapping exports (double-click,
 * two tabs' worth of state) can't hand the wrong blob to a caller.
 *
 * Environment notes:
 *   - pdfWorkerShim MUST stay the first import — it aliases `window` to the
 *     worker global before @react-pdf's module scope evaluates (the vendor
 *     build reads `window.*` unguarded). See pdfWorkerShim.js.
 *   - Font TTFs are fetched INSIDE the worker (theme.js Font.register URLs
 *     resolve against the worker's same-origin scope; workers have fetch).
 *     The FontStore caches them, so repeat exports skip the fetch — one more
 *     reason the worker is a keep-alive singleton, not per-export.
 *   - This module graph must stay free of dynamic import(). That is a LATENCY
 *     contract, not a build constraint: vite.config.js sets worker.format to
 *     'es', and townScene.worker code-splits under it today, so a split PDF
 *     graph would build fine. But this worker is constructed lazily on first
 *     export and is deliberately never preloaded, so a split would land a
 *     second cold fetch inside the export the user is already waiting on —
 *     the exact freeze the worker exists to remove.
 *   - This file lives in src/utils (NOT src/pdf) on purpose: tsconfig.full
 *     includes src/pdf/**\/*.js, and a checked .js file that statically
 *     imports SettlementPDF.jsx would drag the whole deliberately-unchecked
 *     PDF JSX tree into the tsc gate (~200 pre-existing inferred-prop
 *     errors — see the tsconfig.full.json docblock). src/utils is excluded,
 *     exactly like generateSettlementPDF.js, this worker's only consumer.
 */
import './pdfWorkerShim.js';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { SettlementPDF } from '../pdf/SettlementPDF.jsx';

self.onmessage = async (event) => {
  const { id, props } = event.data || {};
  try {
    const blob = await pdf(React.createElement(SettlementPDF, props)).toBlob();
    self.postMessage({ id, ok: true, blob });
  } catch (err) {
    self.postMessage({ id, ok: false, error: err?.message || String(err) });
  }
};
