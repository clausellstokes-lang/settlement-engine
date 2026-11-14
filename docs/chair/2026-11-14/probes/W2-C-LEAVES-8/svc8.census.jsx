/** @vitest-environment jsdom */
// W2-C-LEAVES-8 item 1 probe: the Services tab's need rows ("Needs X <impact> · covers ..."), per town, from a born corpus.
// TREE, CORPUS, OUT from the environment; writes OUT (ndjson: seed, rows = every service row's need line text).
import { afterEach, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import fs from 'node:fs'; import zlib from 'node:zlib';
const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('__TREE__/src/store/index.js', () => { const useStore = (sel) => sel(mocks.store); useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; return { useStore }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { ServicesTab } from '__TREE__/src/components/new/tabs/ServicesTab.jsx';
window.matchMedia = window.matchMedia || ((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const out = [];
afterEach(cleanup);
test('svc8', () => {
  for (const { seed, s } of rows) {
    const rec = { seed, stress: (s.stressTypes || s.stresses || []).map?.((x) => x?.type || x) };
    try { mocks.store = { campaigns: [], settlement: s };
      const { container } = render(<ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />);
      rec.rows = [...container.querySelectorAll('[data-testid="service-row"] p')].map((p) => p.textContent.trim()).filter((t) => /^Needs\b/.test(t));
      cleanup();
    } catch (e) { rec.err = String(e.message).slice(0, 200); }
    out.push(rec);
  }
  fs.writeFileSync(process.env.OUT, out.map((r) => JSON.stringify(r)).join('\n') + '\n');
});
