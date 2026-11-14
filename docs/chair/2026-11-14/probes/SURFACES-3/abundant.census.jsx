// SURFACES-3 item 2 (r4): per born record, whether the PDF's Resources chapter prints the "Abundant" kicker, whether the
// tab's reader holds the siege (chainStateShown.js :: tradeStoppedHere), and the PDF's NEARBY RESOURCES leaves. run.sh writes __TREE__.
import { test, vi } from 'vitest';
import fs from 'node:fs';
vi.mock('__TREE__/src/store/index.js', () => { const d = { campaigns: [] }; const u = (s) => s(d); u.subscribe = () => () => {}; u.getState = () => d; return { useStore: u, default: u }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
import { ResourcesProduction } from '__TREE__/src/pdf/sections/ResourcesProduction.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { tradeStoppedHere } from '__TREE__/src/domain/display/chainStateShown.js';
const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const F = `${OUT}/abundant.${process.env.SHARD}.jsonl`;
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return leaves(node.type.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
fs.writeFileSync(F, '');
for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  const lv = leaves(ResourcesProduction({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }));
  const k = lv.indexOf('NEARBY RESOURCES'); const blk = k < 0 ? [] : lv.slice(k + 1, k + 40);
  const end = blk.findIndex((x) => /^[A-Z][A-Z ]{6,}$/.test(x)); const near = end < 0 ? blk : blk.slice(0, end);
  fs.appendFileSync(F, JSON.stringify({ seed, siege: tradeStoppedHere(town), abundant: lv.includes('Abundant'), near: near.join('|').slice(0, 300) }) + '\n');
}, 120000);
