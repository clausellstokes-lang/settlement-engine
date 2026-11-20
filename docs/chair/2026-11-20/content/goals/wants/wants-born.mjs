// GOALS-3 builder 9 (scratch measure, docs only): birth the chair's measure towns (seeds hxd-<size>-<i>, as the chair's
// born.mjs and goals-final.mjs) and write every card's two wants with its CELL, read from the deal's own receipts
// (goals.js :: goalReceiptsOf's array, captured by wants-hooks.mjs as the pipeline calls the deal and its post-pass).
// Usage: node wants-born.mjs <tree> <sizes, comma-separated | all> <n per size> <out.json> [append.json]
//   append.json: { "<FAMILY>/<kind>/<vantage>": k, ... } appends k placeholder lines to each named cell IN MEMORY
//   (wants-hooks.mjs), to measure what k new drawn lines do. Nothing on disk changes.
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
const [, , L, SZ = 'city,metropolis', nA = '50', OUT, APP] = process.argv;
if (!L || !OUT) { console.error('usage: node wants-born.mjs <tree> <sizes|all> <n> <out.json> [append.json]'); process.exit(2); }
const append = APP ? JSON.parse(fs.readFileSync(APP, 'utf8')) : null;
register(pathToFileURL(path.join(path.dirname(new URL(import.meta.url).pathname), 'wants-hooks.mjs')).href, { data: { append } });
const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
const t0 = Date.now();
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
const GF = await imp('src/data/people/goalFamilies.js');
await loadGenerationLawPayloads();
const LINES = GF.GOAL_FAMILY_LINES, RESERVE = GF.GOAL_RESERVE_LINES || {};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NAME_SLOTS = new Set(['above', 'below', 'other', 'handler', 'agent', 'target', 'priest', 'power', 'rival', 'guild', 'house', 'otherHouse', 'front', 'targetHouse', 'shrine', 'arcaneHouse']);
const tmplOf = (l) => (typeof l === 'string' ? l : l?.line || '');
// a cell's templates (its lines, then its reserve's), each as a regex over the WORDING (goals.js :: wordingOf: name slots
// as '§', other slots as their value, agreement forms as written)
const cache = new Map();
const cellT = (f, k, v) => { const key = `${f}/${k}/${v}`; if (!cache.has(key)) {
  const main = (LINES[f]?.[k]?.[v] || []).map(tmplOf); const res = (RESERVE[f]?.[k]?.[v] || []).map(tmplOf);
  cache.set(key, { n: main.length, all: [...main, ...res].map((t) => new RegExp('^' + t.split(/(\{\w+\})/).map((p) => { const m = /^\{(\w+)\}$/.exec(p); return m ? (NAME_SLOTS.has(m[1]) ? '§' : '(.+?)') : esc(p); }).join('') + '$', 's')) }); }
  return cache.get(key); };
const tmplIdx = (f, k, v, wording) => { if (typeof wording !== 'string') return -1; const c = cellT(f, k, v); return c.all.findIndex((re) => re.test(wording)); };
// the chair's masker (owner-q3/born.mjs, verbatim in effect)
function masker(t) {
  const names = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name);
  for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) add(f.faction);
  add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'gi') : null;
  return (s) => typeof s === 'string' ? (re ? s.replace(re, '§') : s).replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : '';
}
const sizes = SZ === 'all' ? SIZES : SZ.split(',');
const towns = []; let receiptsMissing = 0, dealCalls = 0;
for (const size of sizes) for (let i = 0; i < +nA; i++) {
  globalThis.__WANTS_RECEIPTS = [];
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  const sets = globalThis.__WANTS_RECEIPTS; dealCalls += sets.filter((s) => s.tag === 'deal').length;
  // the last deal and (if any) the post-pass after it: the final receipt of each card id
  const lastDeal = sets.map((s) => s.tag).lastIndexOf('deal');
  const byId = new Map();
  for (const s of sets.slice(lastDeal)) for (const r of s.receipts) byId.set(String(r.id), r);
  const dealById = new Map((sets[lastDeal]?.receipts || []).map((r) => [String(r.id), r]));
  const m = masker(t);
  const npcs = (t.npcs || []).map((n) => {
    const r = byId.get(String(n.id)); const d = dealById.get(String(n.id)); if (!r) receiptsMissing++;
    const o = { id: n.id, role: String(n.role || n.title || '').replace(/^the\s+/i, ''), cat: n.category || '', rank: n.structuralRank || '', inst: n.institution?.family || '' };
    for (const v of ['short', 'long']) {
      const text = n.goal?.[v]; if (!text) { o[v] = null; continue; }
      const it = n.goal?.intent?.[v] || {}; const rv = r?.[v] || {};
      const f = it.family || rv.family || '?', k = it.kind || rv.kind || '?';
      const fill = Object.fromEntries(Object.entries(rv.slots || {}).sort().map(([s, x]) => [s, NAME_SLOTS.has(s) ? m(String(x)) : String(x)]));
      o[v] = { text, masked: m(text), f, k, t: tmplIdx(f, k, v, rv.wording), n: cellT(f, k, v).n, drawnT: tmplIdx(f, k, v, rv.drawn ?? d?.[v]?.drawn), rung: r?.repeat?.[v] || null, rot: rv.rotated || null, refusedBy: rv.refusedBy || null, fill: JSON.stringify(fill), floor: !!r?.floor };
    }
    return o;
  });
  towns.push({ seed: `hxd-${size}-${i}`, tier: t.tier, npcs });
}
fs.writeFileSync(OUT, JSON.stringify({ tree: L, append, sizes, n: +nA, towns }));
console.log(`born ${towns.length} towns in ${((Date.now() - t0) / 1000).toFixed(0)}s; deal calls ${dealCalls}; cards without a receipt ${receiptsMissing}; append ${append ? Object.values(append).reduce((a, b) => a + b, 0) + ' lines in ' + Object.keys(append).length + ' cells' : 'none'}; wrote ${OUT}`);
