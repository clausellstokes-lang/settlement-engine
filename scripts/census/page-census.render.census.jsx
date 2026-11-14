/** @vitest-environment jsdom */
/**
 * page-census.render.census.jsx — the rendered-dossier arm's renderer (W2-A-LEAVES, 2026-11-12), run ONLY by
 * scripts/census/page-census.mjs through its own vitest config (named `*.census.jsx` so the repository's test
 * glob never picks it up). Each plan row is born, stamped with its public prose, rendered through the real
 * OutputContainer as the owner sees it, walked (tests/components/pageCensusWalk.shared.mjs) and counted by
 * the page arm's checks (src/domain/coherence/pageCensusFindings.js). Writes `<out>/<seed>.json`.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { configOf, storeFor, walkDossier } from '../../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { pageCensusFindings } from '../../src/domain/coherence/pageCensusFindings.js';

const OUT = process.env.PAGE_CENSUS_OUT;
const PLAN = JSON.parse(readFileSync(process.env.PAGE_CENSUS_PLAN, 'utf8'));
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
    const findings = pageCensusFindings(town, views);
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, size: row.size, crisis: row.crisis, rows: [...new Set(findings.map((f) => f.row))].sort(), findings }));
  }, 300000);
}
