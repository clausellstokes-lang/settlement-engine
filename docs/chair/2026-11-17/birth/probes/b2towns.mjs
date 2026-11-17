// BIRTH-2-COUNT item 5: towns that would hold a kept source house on no ground (worked out or bought in) at share 1:
// the barren houses of the base corpus (kind (ii), ground absent: q2land.mjs), counted by town, tier, calm-and-connected.
//   TREE=<base root> node docs/chair/2026-11-17/birth/probes/b2towns.mjs <label>=<base corpus.gz> ...
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf } from './kinds.mjs'; import { landOf } from './q2land.mjs';
const TREE = path.resolve(process.env.TREE || '.');
const { catalogIdForName } = await import(TREE + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(TREE + '/src/domain/tradeRouteSemantics.js');
const BARREN = new Set(process.env.KINDS ? process.env.KINDS.split(',') : ['stone_quarry', 'charcoal_burner', 'salt_works', 'dairy_farmer', 'mine', 'mine_open_cast', 'peat_cutter']); // KINDS=<ids> narrows it
const arr = (x) => (Array.isArray(x) ? x : []);
for (const a of process.argv.slice(2)) { const [label, file] = a.split('=');
  const rows = zlib.gunzipSync(fs.readFileSync(file)).toString().trim().split('\n').map((l) => JSON.parse(l));
  let towns = 0, calm = 0, calmTowns = 0, houses = 0; const byTier = {}, ofTier = {};
  for (const { seed, s } of rows) { const tier = s.tier || s.config?.settType; ofTier[tier] = (ofTier[tier] || 0) + 1;
    const c = !arr(s.config?.stressTypes).length && hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? ''));
    if (c) calmTowns++;
    const n = arr(s.institutions).filter((i) => i && typeof i.name === 'string' && i.status !== 'ruined' && BARREN.has(String(i.catalogId || catalogIdForName(i.name) || '')) && landOf(s, String(i.catalogId || catalogIdForName(i.name))).land === 'absent').length;
    if (n) { towns++; houses += n; byTier[tier] = (byTier[tier] || 0) + 1; if (c) calm++; } }
  console.log(`${label}: towns ${rows.length} · holding a source house on no ground ${towns} (${(100 * towns / rows.length).toFixed(1)}%; houses ${houses}) · of the ${calmTowns} calm connected towns ${calm} · by tier: ${Object.entries(byTier).map(([k, v]) => `${k} ${v} of ${ofTier[k]}`).join(', ')}`); }
