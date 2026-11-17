import fs from 'node:fs'; import zlib from 'node:zlib';
const T = '/home/user/wt-tip';
const F = await import(T + '/src/domain/facts/houseInputAtHand.js');
const { importsAsPrinted } = await import(T + '/src/domain/display/tradeListDisplay.js');
const K = await import(T + '/src/domain/facts/houseKinds.js');
const { catalogIdForName } = await import(T + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(T + '/src/domain/tradeRouteSemantics.js');
const words = [...K.BUYER_IMPORT_WORDS];
const sing = (x) => ` ${String(x).toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z]+/g, ' ').replace(/\b([a-z]{3,}?)e?s\b/g, '$1').trim()} `;
const needBeside = {}, spentBuyer = {};
for (const l of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const imps = s.economicState?.primaryImports || []; const mine = imps.filter((x) => words.includes(x));
  for (const n of importsAsPrinted(s).needed) for (const w of mine) { const a = sing(n), b = sing(w); if (b.includes(a) || a.split(' ').filter((t) => t.length > 2).some((t) => b.includes(` ${t} `))) (needBeside[`${n} | ${w}`] ||= []).push(seed); }
  const calm = !(s.config?.stressTypes || []).length && hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''));
  for (const [h, g] of F.housesOnSpentGround(s)) { const id = String(catalogIdForName(h) || ''); if (!K.BUYS_AND_WORKS.has(id)) continue; (spentBuyer[`${id} · ${g}${calm ? ' (calm connected)' : ''}`] ||= []).push(seed); } }
console.log('== need line beside the birth word of its good'); for (const [k, v] of Object.entries(needBeside)) console.log(v.length, '|', k, '|', v.slice(0, 3).join(', '));
console.log('== buyers still marked on a spent ground'); for (const [k, v] of Object.entries(spentBuyer).sort((a, b) => b[1].length - a[1].length)) console.log(v.length, '|', k, '|', v.slice(0, 3).join(', '));
