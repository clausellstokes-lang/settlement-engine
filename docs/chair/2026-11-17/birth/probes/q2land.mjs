// BIRTH-AUDIT Q2/Q4 · THE LAND UNDER EACH SOURCE HOUSE (kind (ii) of kinds.mjs), read-only.
// For every live house of kind (ii) in every town: are its grounds on the record LIVE, all DEPLETED, or ABSENT; is the
// town on a coast (the trade route `port` or the terrain `coastal`); is the house marked short (housesShortOf).
//   OUT=<out.json> node docs/chair/2026-11-17/birth/probes/q2land.mjs <label>=<corpus.ndjson.gz> ...
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf, groundsOf, coastGives } from './kinds.mjs';
const TREE = path.resolve(process.env.TREE || '.');
const F = await import(TREE + '/src/domain/facts/houseInputAtHand.js');
const { catalogIdForName } = await import(TREE + '/src/data/institutionalCatalog.js');
const { getTerrainType } = await import(TREE + '/src/generators/terrainHelpers.js');
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const arr = (x) => (Array.isArray(x) ? x : []);
export function landOf(s, id) {
  const g = groundsOf(id) || [];
  const near = new Set(arr(s?.config?.nearbyResources)); const spent = new Set(arr(s?.config?.nearbyResourcesDepleted));
  const have = g.filter((k) => near.has(k));
  const terrain = getTerrainType(s?.config?.tradeRouteAccess, s?.config?.terrainOverride && s.config.terrainOverride !== 'auto' ? s.config.terrainOverride : null);
  const coast = s?.config?.tradeRouteAccess === 'port' || terrain === 'coastal';
  if (have.some((k) => !spent.has(k))) return { land: 'live', terrain, coast };
  if (have.length) return { land: 'depleted', terrain, coast };
  if (coastGives(id) && coast) return { land: 'coast (the sea)', terrain, coast };
  return { land: 'absent', terrain, coast };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = [];
  for (const a of process.argv.slice(2)) {
    const [label, file] = a.split('=');
    for (const { seed, s } of load(file)) {
      const short = F.housesShortOf(s);
      for (const inst of arr(s.institutions)) {
        if (!inst || typeof inst.name !== 'string' || inst.status === 'ruined' || inst.isCustom) continue;
        const id = String(inst.catalogId || catalogIdForName(inst.name) || '');
        if (kindOf(id) !== 'ii') continue;
        const l = landOf(s, id);
        rows.push({ pop: label, seed, house: inst.name, id, source: inst.source ?? null, route: s?.config?.tradeRouteAccess ?? null, ...l, crises: arr(s?.config?.stressTypes), short: short.get(inst.name) ?? null });
      }
    }
  }
  const sum = {};
  for (const r of rows) { const k = `${r.pop} · ${r.id} · ${r.land} · ${r.short ? 'marked short' : 'not marked'}`; sum[k] = (sum[k] || 0) + 1; }
  if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify({ tree: TREE, rows }, null, 1) + '\n');
  for (const [k, v] of Object.entries(sum).sort()) console.log(k.padEnd(70), v);
}
