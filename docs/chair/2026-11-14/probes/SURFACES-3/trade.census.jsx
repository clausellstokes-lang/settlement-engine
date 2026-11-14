/** @vitest-environment jsdom */
// SURFACES-3 item 2 (r3): per born record, the trade pills as the Economics tab prints them (exports: the list's own word;
// imports: resourceDisplayName, EconomicsTab.jsx's Trade Profile) against the PDF's EXPORTS/IMPORTS columns and the
// journal's Exports/Imports rows. Writes OUT/trade.<SHARD>.jsonl. run.sh writes __TREE__.
import { test, vi } from 'vitest';
import fs from 'node:fs';
vi.mock('__TREE__/src/store/index.js', () => { const d = { campaigns: [] }; const u = (s) => s(d); u.subscribe = () => () => {}; u.getState = () => d; return { useStore: u, default: u }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
import { EconomicsTrade } from '__TREE__/src/pdf/sections/EconomicsTrade.jsx';
import { ThreeCol } from '__TREE__/src/pdf/primitives/Dense.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { tradeListsAsPrinted } from '__TREE__/src/domain/display/tradeListDisplay.js';
import { resourceDisplayName } from '__TREE__/src/domain/display/resourceDisplayName.js';
const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const F = `${OUT}/trade.${process.env.SHARD}.jsonl`;
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return leaves(node.type.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return find(node.type.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
const column = (col) => { const l = leaves(col); const items = []; for (let i = 0; i < l.length; i++) if (l[i] === '•' && l[i + 1] != null) items.push(l[++i]); return items; };
fs.writeFileSync(F, '');
for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  const t = tradeListsAsPrinted({ ...town, economicState: town.economicState });
  const tab = { exports: t.exports.map(String), imports: t.tradeStopped ? [] : t.arriving.map((x) => resourceDisplayName(x)) };
  const vm = buildViewModel({ settlement: town });
  const cols = find(EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null }), (n) => n.type === ThreeCol)[0]?.props;
  const pdf = cols ? { exports: column(cols.a), imports: column(cols.b) } : null;
  const md = String(buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Economics & Trade')?.markdown || '').split('\n');
  const row = (k) => { const l = md.find((x) => x.startsWith(`- **${k}:** `)); return l ? l.slice(`- **${k}:** `.length).replace(/\\(.)/g, '$1').split(', ') : []; };
  fs.appendFileSync(F, JSON.stringify({ seed, crisis: (Array.isArray(town.stress) ? town.stress : town.stress ? [town.stress] : []).map((s) => s.type).join('+') || 'calm', tab, pdf, jr: { exports: row('Exports'), imports: row('Imports') } }) + '\n');
}, 120000);
