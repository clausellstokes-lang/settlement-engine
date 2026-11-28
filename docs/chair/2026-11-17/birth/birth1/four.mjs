// the chair's four counts over the 720 at the tip (base corpus for the words the birth wrote)
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = '/home/user/wt-tip';
const F = await import(T + '/src/domain/facts/houseInputAtHand.js');
const K = await import(T + '/src/domain/facts/houseKinds.js');
const { resourceGapLines } = await import(T + '/src/domain/display/validationOnPage.js');
const { housesOnImportedInput } = await import(T + '/src/domain/display/crisisStoppedRow.js').catch(() => ({}));
const { catalogIdForName } = await import(T + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(T + '/src/domain/tradeRouteSemantics.js');
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const B = load(process.argv[2]), A = load(process.argv[3]);
const c1 = {}, c2 = {}, c3 = {}, c4 = {}; const t1 = new Set(), t2 = new Set(), t3 = new Set();
const add = (o, k, s) => (o[k] ||= []).push(s);
const idOf = (s, h) => { const i = (s.institutions || []).find((x) => x?.name === h) || { name: h }; return String(i.catalogId || catalogIdForName(h) || ''); };
const sing = (x) => ` ${String(x).toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z]+/g, ' ').replace(/\b([a-z]{3,}?)e?s\b/g, '$1').trim()} `;
for (const [seed, s] of A) { const b = B.get(seed);
  const st = s.config.stressTypes || []; const siege = st.includes('under_siege'); const conn = hasTradeRouteConnection(String(s.config.tradeRouteAccess ?? ''));
  const bi = new Set(b.economicState.primaryImports || []); const added = (s.economicState.primaryImports || []).filter((x) => !bi.has(x));
  for (const w of added) add(c4, w, seed);
  const short = F.housesShortOf(s); const lines = resourceGapLines(s).map((l) => l.impact);
  for (const [h, g] of short) { const id = idOf(s, h);
    if (siege && conn && K.BUYS_AND_WORKS.has(id)) { add(c1, `${h} · Short of ${g}.`, seed); t1.add(seed); }
    if (K.isSourceHouse(id) && added.some((w) => sing(w).includes(sing(g)) || g.split(' or ').some((x) => sing(w).includes(sing(x))))) { add(c2, `${h} short of ${g} beside "${added.filter((w) => g.split(' or ').some((x) => sing(w).includes(sing(x)))).join('", "')}"`, seed); t2.add(seed); }
    if (!st.length && conn && K.isSourceHouse(id)) { const live = new Set(s.config.nearbyResources || []); const dep = new Set(s.config.nearbyResourcesDepleted || []);
      if (!K.SOURCE_GROUNDS[id].some((k) => live.has(k) || dep.has(k))) { const line = lines.find((l) => l.toLowerCase().includes(h.toLowerCase())) || '(no gap line)'; add(c3, `${h} · Short of ${g}. · line: "${line}"`, seed); t3.add(seed); } } } }
const pr = (t, o, n) => { console.log(`== ${t} · houses ${Object.values(o).reduce((a, v) => a + v.length, 0)} in ${n} towns`); for (const [k, v] of Object.entries(o).sort((a, b) => b[1].length - a[1].length)) console.log(`${v.length} | ${k} | ${v.slice(0, 3).join(', ')}`); };
pr('(1) buyers under a siege on a connected route marked short', c1, t1.size);
pr('(2) source house short beside a word the birth brought in of its material', c2, t2.size);
pr('(3) source houses with no ground of their own marked in calm connected towns', c3, t3.size);
console.log('== (4) words the birth wrote'); for (const [k, v] of Object.entries(c4).sort((a, b) => b[1].length - a[1].length)) console.log(`${v.length} | ${k} | ${v.slice(0, 3).join(', ')}`);
