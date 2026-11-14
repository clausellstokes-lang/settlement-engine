// UPKEEP-10, item 2: over a gzipped corpus ({seed, s}), (a) the grain line GRAIN_OWN_FIELDS_LINE beside a failed grain
// harvest (foodRecord.failedSource === 'grain') or a flour export (the final export list); (b) the coal lines under a
// siege in force (stress under_siege), and every income desc printed under a siege that says "trade route", "bought in",
// "sold to", "imported", "other towns" (what still speaks of the road).
// usage: TREE=<tree> node m10income.mjs <corpus.gz> [--list]
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const L = await import(T + '/src/generators/economy/incomeLineSiblings.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const out = { births: 0, grainOwn: 0, grainOwnFailedGrain: 0, grainOwnFlourSold: 0, grainOwnEither: 0, sieges: 0, coalUnderSiege: 0, coalSoldUnderSiege: 0, roadWordsUnderSiege: {} };
const list = [];
const ROAD = /trade route|bought in|sold to|imported|other towns|nearby settlements|passing merchants|regional|surrounding settlements|export/i;
for await (const line of rl) {
  if (!line.trim()) continue; out.births++;
  const { seed, s } = JSON.parse(line);
  const es = s.economicState || {};
  const inc = es.incomeSources || [];
  const fr = es.foodSecurity?.foodRecord || {};
  const exports = (es.primaryExports || []).map(String);
  const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type);
  const besieged = st.includes('under_siege');
  if (inc.some((e) => e.desc === L.GRAIN_OWN_FIELDS_LINE)) {
    out.grainOwn++;
    const fg = fr.failedSource === 'grain'; const fl = exports.some((x) => /flour/i.test(x));
    if (fg) out.grainOwnFailedGrain++; if (fl) out.grainOwnFlourSold++;
    if (fg || fl) { out.grainOwnEither++; list.push(`grain ${seed} ${s.tier} failed=${fr.failedSource} flour=${fl} stress=${st.join('+')}`); }
  }
  if (besieged) {
    out.sieges++;
    if (inc.some((e) => e.desc === L.LOCAL_COAL_LINE)) { out.coalUnderSiege++; list.push(`coal ${seed}`); }
    if (inc.some((e) => e.desc === L.LOCAL_COAL_SOLD_LINE)) { out.coalSoldUnderSiege++; list.push(`coalsold ${seed}`); }
    for (const e of inc) if (e.desc && ROAD.test(e.desc)) { const k = `${e.source} :: ${e.desc.slice(0, 90)}`; out.roadWordsUnderSiege[k] = (out.roadWordsUnderSiege[k] || 0) + 1; }
  }
}
console.log(JSON.stringify(out, null, 1));
if (process.argv.includes('--list')) console.log(list.join('\n'));
