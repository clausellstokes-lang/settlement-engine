/** @vitest-environment jsdom */
/**
 * NAMES-3's rendered arm (run ONLY by run.mjs, copied into the tree under measure as `.names3-run/render.census.jsx`):
 * the page census's own renderer (scripts/census/page-census.render.census.jsx) with its findings replaced by a dump:
 * each plan row is born, stamped with its public prose, rendered through the real OutputContainer, walked
 * (`walkDossier`: every group, sub-tab and disclosure) and written as `<out>/<seed>.json` = { seed, powers, views }.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { configOf, storeFor, walkDossier } from '../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../src/domain/display/publicProse.js';
import { composePublicProse } from '../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';

const OUT = process.env.NAMES3_OUT;
const PLAN = JSON.parse(readFileSync(process.env.NAMES3_PLAN, 'utf8'));
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

afterEach(cleanup);
let ready = false;
for (const row of PLAN) {
  test(row.seed, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    let town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, { fireEvent, waitFor, expect });
    const powers = (town?.powerStructure?.factions || []).map((f) => f?.faction).filter(Boolean);
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, powers, views }));
  }, 300000);
}
