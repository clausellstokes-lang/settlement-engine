/** @vitest-environment jsdom */
/**
 * page-census.render.census.jsx — the rendered-dossier arm's renderer (W2-A-LEAVES, 2026-11-12); W2-C-LEAVES-10 item 6 COPY (bar0-/rr2s- seeds born in the app shape, render.bar0.jsx cfgFor): counts the two SERVICE_OUTPUTS words on every view; run ONLY by
 * scripts/census/page-census.mjs through its own vitest config (named `*.census.jsx` so the repository's test
 * glob never picks it up). Each plan row is born, stamped with its public prose, rendered through the real
 * OutputContainer as the owner sees it, walked (tests/components/pageCensusWalk.shared.mjs) and counted by
 * the page arm's checks (src/domain/coherence/pageCensusFindings.js). Writes `<out>/<seed>.json`.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { configOf, storeFor, walkDossier } from '__TREE__/tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('__TREE__/src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '__TREE__/src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '__TREE__/src/domain/display/publicProse.js';
import { composePublicProse } from '__TREE__/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { pageCensusFindings } from '__TREE__/src/domain/coherence/pageCensusFindings.js';

const OUT = process.env.PAGE_CENSUS_OUT;
const PLAN = JSON.parse(readFileSync(process.env.PAGE_CENSUS_PLAN, 'utf8'));
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

afterEach(cleanup);
let ready = false;
for (const row of PLAN) {
  test(row.seed, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    const c = row.seed.match(/^(?:bar0|rr2s)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
    let town = c ? generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...(c[3] === 'rand' ? {} : { tradeRouteAccess: c[3] }), settType: c[1], selectedStressesRandom: false, selectedStresses: c[2] === 'calm' ? [] : c[2].split('+'), _randomizePriorities: true }), null, { seed: row.seed, customContent: {} })
      : generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, { fireEvent, waitFor, expect });
    if (process.env.DUMP) { writeFileSync(`${OUT}/${row.seed}.views.json`, JSON.stringify(views)); return; } const WORDS = ["international banking services", "magical item market"]; const hits = {}; let lines = 0;
    for (const [view, ls] of Object.entries(views)) for (const l of ls) { lines++; for (const w of WORDS) if (l.toLowerCase().includes(w)) (hits[w] ??= []).push(`${view}: ${l.slice(0, 200)}`); }
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, views: Object.keys(views).length, lines, hits }));
  }, 300000);
}

