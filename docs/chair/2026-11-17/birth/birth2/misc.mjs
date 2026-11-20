import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE; const HI = await import(T + '/src/domain/facts/houseInputAtHand.js'); const VP = await import(T + '/src/domain/display/validationOnPage.js');
const { hasTradeRouteConnection } = await import(T + '/src/domain/tradeRouteSemantics.js');
const has = !!HI.impliedGroundsOnPage;
let fishPair = [], siegeNoCause = 0, siegeTowns = new Set(), pageTowns = [], lines = {}, wc1 = null;
for (const l of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const imp = (s.economicState.primaryImports || []).map(String); const short = HI.housesShortOf(s);
  for (const [h] of short) if (/^Fish market/.test(h) && imp.some((x) => /^Salted fish/i.test(x))) fishPair.push(seed);
  const besieged = (s.config.stressTypes || []).includes('under_siege'); const conn = hasTradeRouteConnection(String(s.config.tradeRouteAccess));
  if (besieged && conn) { const spent = HI.housesOnSpentGround(s); for (const [h] of short) if (!spent.has(h) && !(HI.ventureHouseOf && HI.ventureHouseOf(s)?.name === h)) { siegeNoCause++; siegeTowns.add(seed); } }
  if (has) { const g = HI.impliedGroundsOnPage(s); if (g.there.length || g.used.length) pageTowns.push(seed); }
  for (const x of VP.resourceGapLines(s)) { const t = x.impact; if (/is worked out|stands abandoned|is failing/.test(t)) { const k = t.replace(/^The [^:]+? (is worked out|stands abandoned|is failing)/, 'The <house> $1').replace(/\(([^)]+)\)\.$/, '(<ground>).').replace(/no [a-z ]+ lies near/, 'no <material> lies near'); (lines[k] ||= []).push(seed); } }
  if (seed === 'r2s-wartime-city-1') wc1 = VP.resourceGapLines(s).map((x) => x.impact).filter((t) => /salt/i.test(t));
}
console.log(JSON.stringify({ fishPair: fishPair.length, fishEx: fishPair.slice(0, 3), siegeNoCause, siegeTowns: siegeTowns.size, siegeEx: [...siegeTowns].slice(0, 3), pageTowns: pageTowns.length, pageEx: pageTowns.slice(0, 3), wc1, lines: Object.fromEntries(Object.entries(lines).map(([k, v]) => [k, [v.length, ...new Set(v)].slice(0, 4)])) }));
