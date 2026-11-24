/** @vitest-environment jsdom */
/**
 * READ-25 (CLOSE-7, chain two; RULING-R24 R24-0): THE PAGE BATTERY OVER A PLAN, its renderer. Run ONLY by
 * `page-battery.mjs` beside it, through the vitest config that script writes (root = the tree measured).
 *
 * It is `scripts/census/page-census.render.census.jsx` with two changes and no other: (1) THE TREE is a parameter
 * (`PAGE_BATTERY_TREE`), so every src module, the walk and the mocks are the measured tree's own (imported by absolute
 * path after `vi.doMock`, so this file can live outside the tree and the tree stays untouched); (2) THE BIRTH reads the
 * plan row: a row carrying `config` is born `birthConfig(row.config)` (the close's corpora C and V,
 * `close-7/read24/make-plan.mjs`, `make-visitor-plan.mjs`); a row without one is born as the page census births it
 * (`pageCensusWalk.shared.mjs :: configOf`, the census's dials; the `--grid` proof). Options `{ seed, customContent: {} }`
 * either way, as the page census. The walk (`walkDossier`) and the checks (`pageCensusFindings`) are the tree's, unchanged.
 *
 * Writes `<PAGE_BATTERY_OUT>/<seed>.json`: the rows, the findings, and two hashes for a cure's "what else moved":
 * `recordHash` (sha256 of the born record, before the public prose is stamped) and `pageHash` (sha256 of the walked views).
 * No JSX is written (createElement), so nothing but `vitest`, `react` and `@testing-library/react` resolves from this file's own place
 * (the trees' node_modules are links to the main checkout's).
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const TREE = String(process.env.PAGE_BATTERY_TREE);
const OUT = String(process.env.PAGE_BATTERY_OUT);
const PLAN = JSON.parse(readFileSync(String(process.env.PAGE_BATTERY_PLAN), 'utf8'));
const S = `${TREE}/src/`;

/** @type {{ store: any }} */ const mocks = { store: {} };
vi.doMock(`${S}store/index.js`, () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.doMock(`${S}lib/supabase.js`, () => ({ supabase: {}, isConfigured: false }));
vi.doMock(`${S}generators/aiLayer.js`, () => ({ runTemplateNarrative: vi.fn() }));
vi.doMock(`${S}lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
afterEach(cleanup);

const sha = (/** @type {unknown} */ v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
/** @type {any} */ let M = null;
const load = async () => {
  if (M) return M;
  const [oc, pipe, pub, ppc, dens, cfg, find, walk] = await Promise.all([
    import(/* @vite-ignore */ `${S}components/OutputContainer.jsx`),
    import(/* @vite-ignore */ `${S}generators/generateSettlementPipeline.js`),
    import(/* @vite-ignore */ `${S}domain/display/publicProse.js`),
    import(/* @vite-ignore */ `${S}components/new/publicProseCompose.js`),
    import(/* @vite-ignore */ `${S}domain/density/densityCreateBoundary.js`),
    import(/* @vite-ignore */ `${S}store/configSlice.js`),
    import(/* @vite-ignore */ `${S}domain/coherence/pageCensusFindings.js`),
    import(/* @vite-ignore */ `${TREE}/tests/components/pageCensusWalk.shared.mjs`),
  ]);
  await dens.loadGenerationLawPayloads();
  M = { OutputContainer: oc.default, generateSettlementPipeline: pipe.generateSettlementPipeline, withPublicProse: pub.withPublicProse,
    composePublicProse: ppc.composePublicProse, birthConfig: dens.birthConfig, DEFAULT_CONFIG: cfg.DEFAULT_CONFIG,
    pageCensusFindings: find.pageCensusFindings, configOf: walk.configOf, storeFor: walk.storeFor, walkDossier: walk.walkDossier };
  return M;
};

for (const row of PLAN) {
  test(row.seed, async () => {
    const m = await load();
    const config = row.config ? m.birthConfig(row.config) : m.configOf(row, m.DEFAULT_CONFIG, m.birthConfig);
    let town = m.generateSettlementPipeline(config, null, { seed: row.seed, customContent: {} });
    const recordHash = sha(town);
    town = m.withPublicProse(town, m.composePublicProse(town));
    mocks.store = m.storeFor(town, vi.fn);
    const { container } = render(createElement(m.OutputContainer, { settlement: town }));
    const views = await m.walkDossier(container, { fireEvent, waitFor, expect });
    const findings = m.pageCensusFindings(town, views);
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, size: row.size, crisis: row.crisis ?? null,
      views: Object.keys(views).length, recordHash, pageHash: sha(views), rows: [...new Set(findings.map((f) => f.row))].sort(), findings,
      ...(process.env.PAGE_BATTERY_VIEWS ? { printed: views } : {}) }));
  }, 300000);
}
