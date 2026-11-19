// node law.mjs <tree> <corpus>: the guard's law over a corpus: in a calm town on a connected road, the marked houses by kind
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, corpus] = process.argv.slice(2);
const F = await import(tree + '/src/domain/facts/houseInputAtHand.js');
const { hasTradeRouteConnection } = await import(tree + '/src/domain/tradeRouteSemantics.js');
const { catalogIdForName } = await import(tree + '/src/data/institutionalCatalog.js');
const K = await import('/home/user/wt-tip/src/domain/facts/houseKinds.js');
const by = {}; let towns = 0, bad = new Set();
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const st = Array.isArray(s.config?.stressTypes) ? s.config.stressTypes : [];
  if (st.length || !hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''))) continue; towns++;
  const spent = F.housesOnSpentGround(s); const dep = new Set(s.config?.nearbyResourcesDepleted || []);
  for (const [h, g] of F.housesShortOf(s)) {
    const inst = (s.institutions || []).find((i) => i?.name === h) || { name: h };
    const id = String(inst.catalogId || catalogIdForName(h) || '');
    const kind = K.BUYS_AND_WORKS.has(id) ? 'i' : K.isSourceHouse(id) ? 'ii' : 'iii';
    const ownSpent = kind === 'ii' && (spent.has(h) || K.SOURCE_GROUNDS[id].some((k) => dep.has(k)));
    const key = `${kind} ${ownSpent ? 'spent ' : ''}${id} · ${g}`; (by[key] ||= []).push(seed);
    if (kind === 'i' || (kind === 'ii' && !ownSpent)) bad.add(seed);
  }
}
console.log('calm connected towns', towns, '· towns with a kind (i) or a (ii)-not-on-spent-ground mark', bad.size);
for (const [k, v] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) if (!k.startsWith('iii')) console.log(String(v.length).padStart(4), k, v.slice(0, 3).join(' '));
