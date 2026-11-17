// BIRTH-2-COUNT item 1-2: every kind (ii) house (kinds.mjs) standing on NO ground of its own, by id, with how it entered
// the roster (the main draw or the cascade), its tier, and the causes the chair's table lets it bear here:
//   worked out (any), bought in (a connected road no siege shuts; the dairy at a town or larger only).
// The landings, the woodcutter's camp, the hunter's lodge and the shepherd are counted but judged apart (their row's own gate
// puts them on water, forest terrain or open land). Read-only.
//   node docs/chair/2026-11-17/birth/probes/b2kinds.mjs <label>=<corpus.ndjson.gz> ...
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf } from './kinds.mjs';
import { landOf } from './q2land.mjs';
const TREE = path.resolve(process.env.TREE || '.');
const { catalogIdForName } = await import(TREE + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(TREE + '/src/domain/tradeRouteSemantics.js');
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const arr = (x) => (Array.isArray(x) ? x : []);
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BUY = { charcoal_burner: true, salt_works: true, dairy_farmer: 'town' };
for (const a of process.argv.slice(2)) {
  const [label, file] = a.split('=');
  const t = {};
  for (const { seed, s } of load(file)) {
    const tier = s.tier || s.config?.settType;
    const connected = hasTradeRouteConnection(String(s.config?.tradeRouteAccess ?? '')) && !arr(s.config?.stressTypes).includes('under_siege');
    for (const inst of arr(s.institutions)) {
      if (!inst || typeof inst.name !== 'string' || inst.status === 'ruined') continue;
      const id = String(inst.catalogId || catalogIdForName(inst.name) || '');
      if (kindOf(id) !== 'ii') continue;
      const l = landOf(s, id);
      if (l.land !== 'absent') continue;
      const r = (t[id] ||= { houses: 0, towns: new Set(), main: 0, cascade: 0, tiers: {}, canBuy: 0 });
      r.houses++; r.towns.add(seed); if (inst.source === 'cascade') r.cascade++; else r.main++;
      r.tiers[tier] = (r.tiers[tier] || 0) + 1;
      const b = BUY[id]; if (b && connected && (b === true || TIERS.indexOf(tier) >= TIERS.indexOf(b))) r.canBuy++;
    }
  }
  console.log(`\n${label}: | id | houses on no ground (towns) | main draw · cascade | by tier | of them could bear "bought in" by the chair's table |`);
  for (const [id, r] of Object.entries(t).sort((x, y) => y[1].houses - x[1].houses))
    console.log(`| ${id} | ${r.houses} (${r.towns.size}) | ${r.main} · ${r.cascade} | ${Object.entries(r.tiers).map(([k, v]) => `${k} ${v}`).join(', ')} | ${BUY[id] ? r.canBuy : '-'} |`);
}
