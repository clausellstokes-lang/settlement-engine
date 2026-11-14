/** @vitest-environment jsdom */
// W2-C-LEAVES-7 item 8 probe: the trade lists' pills on the three surfaces, per town, from a born corpus.
// The tab: EconomicsTab rendered (the Trade Profile's Exports / Imports / Produced locally pills). The PDF: EconomicsTrade
// executed and walked to its ThreeCol (EXPORTS / IMPORTS / LOCAL PRODUCTION bullets). The journal: buildJournalPages'
// Economics & Trade page (the Exports / Imports rows). TREE, CORPUS, OUT from the environment.
import { afterEach, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import fs from 'node:fs'; import zlib from 'node:zlib';
const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('__TREE__/src/store/index.js', () => { const useStore = (sel) => sel(mocks.store); useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; return { useStore }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { EconomicsTab } from '__TREE__/src/components/new/tabs/EconomicsTab.jsx';
import { EconomicsTrade } from '__TREE__/src/pdf/sections/EconomicsTrade.jsx';
import { ThreeCol } from '__TREE__/src/pdf/primitives/Dense.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
window.matchMedia = window.matchMedia || ((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const out = [];
afterEach(cleanup);
function leaves(node, acc = []) {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node === 'object') { if (typeof node.type === 'function') return leaves(node.type(node.props), acc); return leaves(node.props?.children, acc); }
  return acc;
}
function findCols(node) {
  if (node == null || typeof node !== 'object') return null;
  if (Array.isArray(node)) { for (const n of node) { const r = findCols(n); if (r) return r; } return null; }
  if (node.type === ThreeCol) return node.props;
  if (typeof node.type === 'function') return findCols(node.type(node.props));
  return findCols(node.props?.children);
}
const bullets = (col) => { const l = leaves(col); const r = []; for (let i = 0; i < l.length; i++) if (l[i] === '•' && l[i + 1] != null) r.push(l[++i]); return { head: l[0] || null, items: r }; };
function tabPills(container, head) {
  const h = [...container.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim() === head);
  if (!h) return null; const box = h.nextElementSibling; if (!box) return [];
  return [...box.children].filter((c) => c.tagName === 'SPAN').map((c) => c.textContent.trim());
}
test('tri8', () => {
  for (const { seed, s } of rows) {
    const rec = { seed };
    try { mocks.store = { campaigns: [], settlement: s };
      const { container } = render(<EconomicsTab settlement={s} economicState={s.economicState} />);
      rec.tab = { ex: tabPills(container, 'Exports'), im: tabPills(container, 'Imports'), lo: tabPills(container, 'Produced locally') }; cleanup();
    } catch (e) { rec.tabErr = String(e.message).slice(0, 200); }
    try { const vm = buildViewModel({ settlement: s });
      const cols = findCols(EconomicsTrade({ settlement: s, narrativeMode: false, vm, stateProse: null }));
      rec.pdf = cols ? { ex: bullets(cols.a), im: bullets(cols.b), lo: bullets(cols.c) } : null;
      const page = buildJournalPages(vm, { settlement: s }).find((p) => p.name === 'Economics & Trade');
      const row = (k) => { const m = (page?.markdown || '').split('\n').find((l) => l.startsWith(`- **${k}:** `)); return m ? m.slice(`- **${k}:** `.length) : null; };
      rec.jr = { ex: row('Exports'), im: row('Imports') };
    } catch (e) { rec.pdfErr = String(e.stack).slice(0, 300); }
    out.push(rec);
  }
  fs.writeFileSync(process.env.OUT, out.map((r) => JSON.stringify(r)).join('\n') + '\n');
}, 3600000);
