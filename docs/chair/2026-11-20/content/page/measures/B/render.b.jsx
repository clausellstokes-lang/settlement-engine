/** @vitest-environment jsdom */
/**
 * Helper B's rendered arm (PAGE-1 MEASURE brief, section B). Run ONLY through run-render.b.mjs.
 * Copied from NAMES-3's render.census.jsx (origin/lane/names-3-2026-11-20, docs/chair/2026-11-20/content/tools/confinement/),
 * with ONE change: the birth is the brief's 300-recipe (`hxd-<size>-<i>`, DEFAULT_CONFIG untouched, settType = size),
 * not the census plan. Each town is stamped with its public prose, rendered through the real OutputContainer, walked by
 * the page census's own walker (walkDossier) and written as `<out>/<seed>.json` = { seed, size, views }.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { storeFor, walkDossier } from '../../../../../../../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../../../../../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../../../../../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../../../../../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../../../../../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../../../../../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../../../../../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../../../../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../../../../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';

const OUT = process.env.PAGEB_OUT;
const PLAN = JSON.parse(readFileSync(process.env.PAGEB_PLAN, 'utf8'));
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
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, size: row.size, views }));
  }, 300000);
}
