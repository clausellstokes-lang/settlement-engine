/** @vitest-environment jsdom */
// SURFACES-3 item 1: per born record, the food figures on the tab's Food Security row, the PDF's FOOD SECURITY block and
// the journal's Economics "Food" row; and the food word's leaf. Writes OUT/foodblock.<SHARD>.jsonl. run.sh writes __TREE__.
import React from 'react';
import { test, vi } from 'vitest';
import fs from 'node:fs';
import { cleanup, render } from '@testing-library/react';
vi.mock('__TREE__/src/store/index.js', () => { const d = { campaigns: [] }; const u = (s) => s(d); u.subscribe = () => () => {}; u.getState = () => d; return { useStore: u, default: u }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('__TREE__/src/hooks/useIsMobile.js', () => ({ default: () => false }));
import { EconomicsTab } from '__TREE__/src/components/new/tabs/EconomicsTab.jsx';
import { EconomicsTrade } from '__TREE__/src/pdf/sections/EconomicsTrade.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { foodWordShown } from '__TREE__/src/domain/display/foodWordShown.js';
const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const F = `${OUT}/foodblock.${process.env.SHARD}.jsonl`;
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return leaves(node.type.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
const fig = (t, re) => { const m = t.match(re); return m ? Number(m[1].replace(/,/g, '')) : null; };
fs.writeFileSync(F, '');
for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  const o = { seed, tier: town.tier, crisis: (Array.isArray(town.stress) ? town.stress : town.stress ? [town.stress] : []).map((s) => s.type).join('+') || 'calm' };
  const { container } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const t = [...container.querySelectorAll('div')].map((d) => d.textContent || '').find((x) => /^Production: [\d,]+ lbs\/day/.test(x) && x.length < 200) || '';
  cleanup();
  o.tab = { text: t, production: fig(t, /^Production: ([\d,]+) lbs/), imported: fig(t, /\+ ([\d,]+) imported/), provision: fig(t, /\+ ([\d,]+) by \w+ provision/), need: fig(t, /Need: ([\d,]+) lbs/), short: fig(t, /Short: ([\d,]+) lbs/) };
  const vm = buildViewModel({ settlement: town });
  const lv = leaves(EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null }));
  const k = lv.indexOf('FOOD SECURITY');
  if (k >= 0) {
    const blk = []; for (let i = k + 1; i < lv.length && blk.length < 30; i++) { if (/^[A-Z][A-Z ]{6,}$/.test(lv[i]) && !/^(PRODUCED|NEEDED|DEFICIT|PRODUCED \/ NEEDED)$/.test(lv[i])) break; blk.push(lv[i]); }
    const b = blk.join('|');
    o.pdf = { text: b, production: fig(b, /PRODUCED\|([\d.]+)/), need: fig(b, /NEEDED\|([\d.]+)/), deficit: fig(b, /DEFICIT\|([\d.]+)/), pct: fig(b, /\|(\d+)\|% of need/), cover: fig(b, /imports cover \|(\d+)\|/), provision: fig(b, /provision covers \|?([\d.]+)/), surplus: fig(b, /Surplus\|([\d.]+)/) };
  } else o.pdf = null;
  const md = buildJournalPages(vm, { settlement: town }).map((p) => String(p.markdown || '')).join('\n').split('\n');
  o.jrEcon = md.find((l) => l.startsWith('- **Food:** ') || l.startsWith('- **Food deficit') || l.startsWith('- **Food surplus')) || null;
  o.word = foodWordShown(town)?.label ?? null;
  fs.appendFileSync(F, JSON.stringify(o) + '\n');
}, 120000);
