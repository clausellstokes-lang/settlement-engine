import fs from 'node:fs'; import zlib from 'node:zlib';
const F = await import('/home/user/wt-tip/src/domain/facts/houseInputAtHand.js');
const { hasTradeRouteConnection } = await import('/home/user/wt-tip/src/domain/tradeRouteSemantics.js');
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const [fa, fb] = process.argv.slice(2); const A = load(fa), B = load(fb); const d = {};
for (const [seed, a] of A) { const b = B.get(seed); const ma = F.housesShortOf(a), mb = F.housesShortOf(b);
  for (const h of new Set([...ma.keys(), ...mb.keys()])) { if (!/Charcoal|Salt works|Dairy|quarry/i.test(h)) continue; if (ma.get(h) === mb.get(h)) continue;
    const calm = !(b.config.stressTypes || []).length && hasTradeRouteConnection(String(b.config.tradeRouteAccess));
    const k = `${h}: ${ma.get(h) ?? '-'} -> ${mb.get(h) ?? '-'}${calm ? ' (calm connected)' : ''}`; (d[k] ||= []).push(seed); } }
for (const [k, v] of Object.entries(d)) console.log(v.length, k, v.slice(0, 3).join(' '));
