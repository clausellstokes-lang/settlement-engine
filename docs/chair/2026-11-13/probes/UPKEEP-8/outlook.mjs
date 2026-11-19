// UPKEEP-8, step 5: the Outlook sentence (dossierViewModel.js :: deriveViability) against the town's own pages.
// usage: TREE=<tree> node outlook.mjs <births.full.ndjson>
import fs from 'node:fs'; import readline from 'node:readline';
const T = process.env.TREE;
const { deriveViability } = await import(T + '/src/domain/display/dossierViewModel.js');
const { bandForVariable } = await import(T + '/src/domain/causalState.js');
const { displayTradeList } = await import('/home/user/up8/src/domain/display/tradeListDisplay.js'); // the tab's list filter, read at the lane's tree for both
const c = {}; const ex = {}; let n = 0;
const hit = (k, seed, t) => { c[k] = (c[k] || 0) + 1; (ex[k] = ex[k] || []).length < 3 && ex[k].push(`${seed}: ${t}`); };
for await (const l of readline.createInterface({ input: fs.createReadStream(process.argv[2]) })) {
  const { seed, s } = JSON.parse(l); n++; const t = String(deriveViability(s).summary || ''); const eco = s.economicState;
  const law = bandForVariable(s, 'law_order'); const low = ['Subsistence', 'Struggling', 'Poor'].includes(eco.prosperity);
  const buys = Number(eco.foodSecurity?.foodRecord?.normalImportPct) > 0;
  const nec = (eco.necessityImports || []).map((x) => x.toLowerCase());
  const crit = (s.resourceAnalysis?.imports?.critical || []).map((x) => String(x).toLowerCase()); const rec = (eco.primaryImports || []).map(String);
  const imps = displayTradeList([...rec, ...crit.filter((t) => !rec.some((i) => i.toLowerCase().includes(t)))], s, { side: 'imports', exports: eco.primaryExports }).map((x) => x.toLowerCase());
  const needs = imps.some((i) => nec.some((x) => i.includes(x)) || crit.some((x) => i.includes(x) || x.includes(i)));
  if (/keeps order/.test(t) && ['critical', 'collapsed'].includes(law)) hit('keeps order, law critical', seed, t);
  if (/pays its (?:own )?way/.test(t) && low) hit('pays its way, poor', seed, `${eco.prosperity}: ${t}`);
  if (/feeds itself|grows what it eats|has to come from outside/.test(t) && buys) hit('feeds itself, buys food', seed, t);
  if (/grows what it eats and makes what it needs|has to come from outside/.test(t) && needs) hit('needs nothing, critical imports', seed, t);
  const m = /only while (.+?) keep arriving/.exec(t); if (m && !/ and |s$|^the goods it buys in$/.test(m[1])) hit('grammar: a mass noun keeps', seed, t);
  if (/the goods it buys in|goods brought in from elsewhere/.test(t) && imps.length === 0) hit('goods bought, none on the list', seed, t);
  const g = /only while (.+?) keeps? arriving|run on (.+?) brought in|from the (.+?) it buys in/.exec(t); const good = g && (g[1] || g[2] || g[3]);
  if (good && !/^the goods(?: it buys in)?$|^goods$/.test(good) && !good.split(' and ').every((x) => imps.some((i) => i.includes(x)))) hit('a good not on the import list', seed, t);
}
console.log('births', n, JSON.stringify(c)); for (const [k, v] of Object.entries(ex)) { console.log('##', k); for (const e of v) console.log('  ', e.slice(0, 220)); }
