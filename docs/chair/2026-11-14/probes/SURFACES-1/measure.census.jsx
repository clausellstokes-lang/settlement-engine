/** @vitest-environment jsdom */
// SURFACES-1 item 0: per born record (RECORDS/<seed>.json), each fact as the tab's reader gives it and as the PDF and the
// Foundry journal print it. Writes OUT/<seed>.facts.json. Named *.census.jsx so no repository glob picks it up.
import { test, vi } from 'vitest';
import fs from 'node:fs';
vi.mock('__TREE__/src/store/index.js', () => { const d = { campaigns: [] }; const u = (s) => s(d); u.subscribe = () => () => {}; u.getState = () => d; return { useStore: u, default: u }; });
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { EconomicsTrade } from '__TREE__/src/pdf/sections/EconomicsTrade.jsx';
import { Services } from '__TREE__/src/pdf/sections/Services.jsx';
import { ThreeCol } from '__TREE__/src/pdf/primitives/Dense.jsx';
import { StatusCard } from '__TREE__/src/pdf/primitives/Visuals.jsx';
import { FLOW_STATUS } from '__TREE__/src/components/new/tabs/EconomicsTab.jsx';
import { chainAsShown } from '__TREE__/src/domain/display/chainStateShown.js';
import { chainOutputsShown, tradeListsAsPrinted } from '__TREE__/src/domain/display/tradeListDisplay.js';
import { chainPrintName } from '__TREE__/src/domain/display/chainPrintName.js';
import { resourceDisplayName } from '__TREE__/src/domain/display/resourceDisplayName.js';
import { foodBandOf } from '__TREE__/src/domain/summary/tonightSheet.js';

const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return leaves(node.type.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** every element under node (functions executed) whose test holds; @returns {any[]} */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') { let r; try { r = node.type(node.props); } catch (e) { acc.push({ error: String(e.message) }); return acc; } return find(r, pred, acc); }
  if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return find(node.type.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
const fname = (n) => (typeof n?.type === 'function' ? n.type.name : '');
const column = (col) => { const l = leaves(col); const items = []; for (let i = 0; i < l.length; i++) if (l[i] === '•' && l[i + 1] != null) items.push(l[++i]); return { head: l[0] ?? null, items }; };

for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  const vm = buildViewModel({ settlement: town, phase: 'canon' });
  const rec = town.economicState?.activeChains || [];
  const out = { seed, tier: town.tier, stresses: (town.stresses || town.activeStresses || []).map?.((s) => s?.type || s?.key || s) ?? null };
  // the tab's chain cards (EconomicsTab.jsx :: EconomicFlowsSection: chainAsShown, FLOW_STATUS, chainOutputsShown)
  const tab = rec.map((c) => { const sh = chainAsShown(c, town); const k = String(sh.status ?? ''); return { label: chainPrintName(c, town).label, key: k, word: k === '' ? '' : (FLOW_STATUS[k] || FLOW_STATUS.operational).label, outs: chainOutputsShown(c, town).slice(0, 3), raw: c.status }; });
  // the PDF's Services chain cards
  const sv = Services({ settlement: town, narrativeMode: false, vm, stateProse: null });
  const cards = find(sv, (n) => n.type === StatusCard).map((n) => ({ name: n.props.name, status: n.props.statusLabel, description: n.props.description }));
  // the PDF's Economics chapter: the flow rows and the group headers, the trade flows
  const et = EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null });
  const rows = find(et, (n) => fname(n) === 'ChainRow').map((n) => ({ label: chainPrintName(n.props.chain, town).label, status: n.props.chain.status,
    outs: find(n.type(n.props), (m) => typeof m.key === 'string' && m.key.startsWith('o-')).map((m) => leaves(m).join('').replace(/^Normally yields: /, '').replace(/\s+EXPORT$/, '')) }));
  const groups = find(et, (n) => fname(n) === 'CategoryGroup').map((n) => ({ needKey: n.props.needKey, text: leaves(n).join(' ') }));
  const cols = find(et, (n) => n.type === ThreeCol)[0]?.props;
  const trade = tradeListsAsPrinted(town);
  const page = buildJournalPages(vm, { settlement: town, variant: 'canon_dossier', faithUnlocked: true }).find((p) => p.name === 'Economics & Trade');
  const md = String(page?.markdown || '');
  const jrRow = (k) => { const l = md.split('\n').find((x) => x.startsWith(`- **${k}:** `)); return l ? l.slice(`- **${k}:** `.length).replace(/\\(.)/g, '$1') : null; };
  const jrChains = md.split('## Supply chains')[1]?.split('\n').filter((l) => l.startsWith('- **')).map((l) => { const m = l.match(/^- \*\*(.*?)\*\*(?: \*\((.*?)\)\*)?/); return { name: m?.[1], state: m?.[2] ?? '' }; }) || [];
  out.chains = { tab, cards, rows, groups, jr: jrChains };
  out.trade = { tab: { exports: trade.exports, imports: trade.imports, local: trade.local, stopped: trade.tradeStopped },
    tabShown: { exports: trade.exports.map((x) => resourceDisplayName(x)), imports: trade.imports.map((x) => resourceDisplayName(x)) },
    pdf: cols ? { exports: column(cols.a), imports: column(cols.b), local: column(cols.c) } : null, jr: { exports: jrRow('Exports'), imports: jrRow('Imports') } };
  const eco = town.economicState || {};
  out.food = { stored: eco.foodSecurity?.label ?? null, band: foodBandOf(eco.foodSecurity?.foodRecord)?.label ?? null, pdfDeficit: vm.economics?.foodBalance?.deficit ?? null };
  const fac = town.powerStructure?.factions || [];
  out.mods = fac.map((f) => ({ faction: f.faction, modifier: f.modifier ?? null, modifiers: f.modifiers ?? null }));
  fs.writeFileSync(`${OUT}/${seed}.facts.json`, JSON.stringify(out));
}, 120000);
