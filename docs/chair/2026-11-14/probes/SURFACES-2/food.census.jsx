/** @vitest-environment jsdom */
// SURFACES-2 item 1: per born record, the food word on every surface. Writes OUT/food.jsonl lines.
import React from 'react';
import { test, vi } from 'vitest';
import fs from 'node:fs';
import { cleanup, render } from '@testing-library/react';
vi.mock('__TREE__/src/store/index.js', () => { const d = { campaigns: [] }; const u = (s) => s(d); u.subscribe = () => () => {}; u.getState = () => d; return { useStore: u, default: u }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { OverviewTab } from '__TREE__/src/components/new/tabs/OverviewTab.jsx';
import SubstrateTab from '__TREE__/src/components/new/tabs/SubstrateTab.jsx';
import { IdentityDailyLife } from '__TREE__/src/pdf/sections/IdentityDailyLife.jsx';
import { TonightAtTheTable } from '__TREE__/src/pdf/sections/TonightAtTheTable.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { foodBandOf } from '__TREE__/src/domain/summary/tonightSheet.js';
const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
const textNodes = (root) => { const w = root.ownerDocument.createTreeWalker(root, 4); const out = []; for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim()) out.push(n); return out; };
const after = (root, label) => { const ns = textNodes(root); const i = ns.findIndex((n) => n.nodeValue.trim() === label); return i >= 0 && ns[i + 1] ? { w: ns[i + 1].nodeValue.trim(), c: ns[i + 1].parentElement.style.color, bg: ns[i + 1].parentElement.style.background } : null; };
fs.writeFileSync(`${OUT}/food.jsonl`, '');
for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  const eco = town.economicState || {}; const band = foodBandOf(eco.foodSecurity?.foodRecord);
  const o = { seed, tier: town.tier, crisis: (Array.isArray(town.stress) ? town.stress : town.stress ? [town.stress] : []).map((s) => s.type).join('+') || 'calm', stored: eco.foodSecurity?.label ?? null, band: band?.label ?? null, bandColor: band?.color ?? null };
  const ov = render(<OverviewTab settlement={town} />); o.overview = after(ov.container, 'Food Security'); cleanup();
  const sb = render(<SubstrateTab settlement={town} />); o.substrate = after(sb.container, 'Food'); cleanup();
  const vm = buildViewModel({ settlement: town });
  const id = leaves(IdentityDailyLife({ settlement: town, narrativeMode: false, vm, stateProse: null })); const k = id.indexOf('Food'); o.pdfIdentity = k >= 0 ? String(id[k + 1]).trim() : null;
  const tn = leaves(TonightAtTheTable({ settlement: town, narrativeMode: false })); const t = tn.findIndex((x) => /^Food:?$/.test(String(x).trim())); o.pdfTonight = t >= 0 ? tn.slice(t + 1, t + 3).join(' ').trim() : null;
  const md = buildJournalPages(vm, { settlement: town }).map((p) => String(p.markdown || '')).join('\n').split('\n');
  o.jrTonight = md.find((l) => l.startsWith('- **Food**: ')) || null; o.jrEcon = md.find((l) => l.startsWith('- **Food:** ') || l.startsWith('- **Food deficit') || l.startsWith('- **Food surplus')) || null;
  fs.appendFileSync(`${OUT}/food.jsonl`, JSON.stringify(o) + '\n');
}, 120000);
