/** @vitest-environment jsdom */
/**
 * PAGE-9 THIN-MEASURE, section B's rendered arm. Run ONLY through run-render.thin.mjs (under scripts/gate-mutex.sh --run).
 * Helper B's render.b.jsx (measures/B/) with ONE addition: beside the owner's page walk (walkDossier, the real
 * OutputContainer as the owner sees it), the PDF's DM document (SettlementPDF, variant canon_dossier, phase canon)
 * walked to its text leaves by houseLabelEverySurface.test.jsx's pdfText. Writes <out>/<seed>.json = { seed, size, views }.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { storeFor, walkDossier } from '../../../../../../../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../../../../../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {};
  return { useStore };
});
vi.mock('../../../../../../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../../../../../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../../../../../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../../../../../../src/components/OutputContainer.jsx';
import { SettlementPDF } from '../../../../../../../src/pdf/SettlementPDF.jsx';
import { generateSettlementPipeline } from '../../../../../../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../../../../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../../../../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';

function pdfText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') { out.push('\n'); pdfText(node.type(node.props), out); out.push('\n'); return out; }
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return pdfText({ type: node.type.type, props: node.props }, out);
    out.push('\n'); pdfText(node.props?.children, out); out.push('\n');
  }
  return out;
}

const OUT = process.env.PAGETHIN_OUT;
const PLAN = JSON.parse(readFileSync(process.env.PAGETHIN_PLAN, 'utf8'));
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

afterEach(cleanup);
let ready = false;
for (const row of PLAN) {
  test(row.seed, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    let town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: row.size }), null, { seed: row.seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, { fireEvent, waitFor, expect });
    let pdf;
    try { pdf = pdfText({ type: SettlementPDF, props: { settlement: town, phase: 'canon', variant: 'canon_dossier', faithUnlocked: true } }).join(' ').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean); }
    catch (e) { pdf = [`[PDF THREW] ${e.message}`]; }
    views['PDF/canon_dossier'] = pdf;
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, size: row.size, views }));
  }, 300000);
}
