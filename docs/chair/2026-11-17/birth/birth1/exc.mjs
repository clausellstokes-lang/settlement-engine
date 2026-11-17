// the guard's counted exceptions at a tip, and the "none twice" check, over corpora
import fs from 'node:fs'; import zlib from 'node:zlib';
const tree = process.argv[2]; const files = process.argv.slice(3);
const F = await import(tree + '/src/domain/facts/houseInputAtHand.js');
const { hasTradeRouteConnection } = await import(tree + '/src/domain/tradeRouteSemantics.js');
const { catalogIdForName } = await import(tree + '/src/data/institutionalCatalog.js');
const K = await import(tree + '/src/domain/facts/houseKinds.js');
const out = []; const twice = [];
const w = (x) => String(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
for (const f of files) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const imps = (s.economicState?.primaryImports || []).map(w); const dup = imps.filter((x, i) => imps.indexOf(x) !== i); if (dup.length) twice.push(`${seed}: ${dup.join(', ')}`);
  if (!/^(r2r-|bar0-\w+-calm-)/.test(seed)) continue;
  const st = s.config?.stressTypes || []; if (st.length || !hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''))) continue;
  const spent = F.housesOnSpentGround(s); const dep = new Set(s.config?.nearbyResourcesDepleted || []);
  for (const [h] of F.housesShortOf(s)) { const inst = (s.institutions || []).find((i) => i?.name === h) || { name: h }; const id = String(inst.catalogId || catalogIdForName(h) || '');
    const kind = K.BUYS_AND_WORKS.has(id) ? 'i' : K.isSourceHouse(id) ? 'ii' : 'iii';
    const own = kind === 'ii' && (spent.has(h) || K.SOURCE_GROUNDS[id].some((k) => dep.has(k)));
    if (kind === 'i' || (kind === 'ii' && !own)) out.push(`${seed} · ${h}`); } }
console.log(JSON.stringify(out)); console.error('exceptions', out.length, 'twice', twice.length, twice.slice(0, 10));
