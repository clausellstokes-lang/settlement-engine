// decl18.mjs <tree> <births>: the statement's 18 named literals (15 scope frames + the guild reader's row) read where they
// print: cultureScopeLine over every town; per literal, the towns it prints in, by tier, and the roster fact its words presume.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { cultureScopeLine } = await import(tree + '/src/domain/summary/settlementQuickGuide.js');
const has = (s, re) => (s.institutions || []).some((i) => re.test(i.name || ''));
const L = [
  ['streets: civic square', /civic square/, (s) => !/thorp|hamlet/.test(s.tier), 'not thorp/hamlet'],
  ['streets: agora', /agora/, (s) => !/thorp|hamlet/.test(s.tier), 'not thorp/hamlet'],
  ['streets: quarters', /in quarters by trade/, (s) => !/thorp|hamlet|village/.test(s.tier), 'town or larger'],
  ['quarters: kin districts', /kin districts/, (s) => !/thorp|hamlet|village/.test(s.tier), 'town or larger'],
  ['market', /market/, (s) => has(s, /market|fair|bazaar|exchange|merchant/i), 'a market house'],
  ['docks: harbour', /harbour/, (s) => has(s, /dock|harbou?r|port|quay|wharf|pier|landing|fish/i), 'a dock/harbour/fishing house'],
  ['temple', /temple/, (s) => has(s, /temple|church|cathedral|shrine|monaster|abbey|chapel/i), 'a temple/church house'],
  ['guild (reader row)', /guild and estate/, (s) => has(s, /guild/i), 'a guild house'],
  ['estates', /by its estates|and estate/, (s) => !/thorp|hamlet/.test(s.tier), 'not thorp/hamlet'],
];
const R = L.map(() => ({ n: 0, bad: [], tiers: {} }));
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  let v; try { v = String(cultureScopeLine(s) || ''); } catch { continue; }
  L.forEach(([, re, ok], i) => { if (!re.test(v)) return; R[i].n++; R[i].tiers[s.tier] = (R[i].tiers[s.tier] || 0) + 1; if (!ok(s)) R[i].bad.push(seed + ' (' + s.tier + ' ' + s.population + '): ' + v.slice(0, 140)); }); }
L.forEach(([name, , , fact], i) => { const r = R[i]; console.log(`${name}: prints ${r.n} ${JSON.stringify(r.tiers)}; lacking ${fact}: ${r.bad.length}`); r.bad.slice(0, 3).forEach((b) => console.log('   ', b)); });
