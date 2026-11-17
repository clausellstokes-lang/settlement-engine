// BIRTH-2-COUNT W2 · THE HOUSE WINS WHERE THE ROLL TABLE DENIES: in a VFORCE corpus, every ground written against the
// terrain's compatibility (`getCompatibleResources`), by kind: how the Resources tab's Nearby Resources line prints it
// (`RESOURCE_DISPLAY_LABELS`, under "Abundant" unless a siege stops trade), three towns each; the stored objections that
// name it (structuralViolations' "is not compatible with" text, read by `coherence/readerBattery.js`); and, for the salt
// works, the route (connected: the existing "Salt" import could carry it instead; isolated: nothing can).
//   TREE=<root> node docs/chair/2026-11-17/birth/probes/w2denied.mjs <R25s.gz> <VLF.gz>
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE = path.resolve(process.env.TREE);
const { getCompatibleResources } = await import(TREE + '/src/domain/resourceTerrainCompatibility.js');
const { RESOURCE_DISPLAY_LABELS } = await import(TREE + '/src/domain/display/resourceDisplayName.js');
const { getTerrainType } = await import(TREE + '/src/generators/terrainHelpers.js');
const { hasTradeRouteConnection } = await import(TREE + '/src/domain/tradeRouteSemantics.js');
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const [fb, fv] = process.argv.slice(2); const B = load(fb), V = load(fv);
const HOUSE = { stone_quarry: 'Stone quarry', iron_deposits: 'Mine', marshlands: 'Peat cutter', salt_flats: 'Salt works', grazing_land: 'Dairy farmer', managed_forest: 'Charcoal burner' };
const t = {}; let objections = 0;
for (const [seed, s] of V) {
  const before = new Set(B.get(seed)?.config?.nearbyResources || []);
  const added = (s.config?.nearbyResources || []).filter((k) => !before.has(k));
  if (!added.length) continue;
  const route = s.config?.tradeRouteAccess; const terrain = getTerrainType(route, s.config?.terrainOverride && s.config.terrainOverride !== 'auto' ? s.config.terrainOverride : null);
  const ok = new Set(getCompatibleResources(route, terrain).filter((x) => x.compatible).map((x) => x.key));
  const siege = (s.config?.stressTypes || []).includes('under_siege');
  for (const k of added) {
    if (ok.has(k)) continue;
    const r = (t[k] ||= { houses: 0, connected: 0, isolated: 0, towns: [], routes: {} });
    r.houses++; hasTradeRouteConnection(String(route)) ? r.connected++ : r.isolated++; r.routes[`${route}/${terrain}`] = (r.routes[`${route}/${terrain}`] || 0) + 1;
    if (r.towns.length < 3) r.towns.push(`${seed} (${route}, ${terrain}): Nearby Resources ${siege ? '(siege: unlabelled)' : 'Abundant'} · "${RESOURCE_DISPLAY_LABELS[k] ?? k}"`);
    objections += (s.structuralViolations || []).filter((v) => /is not compatible with/.test(String(v?.reason ?? '')) && String(v?.reason).toLowerCase().includes(String(RESOURCE_DISPLAY_LABELS[k] ?? k).toLowerCase())).length;
  }
}
for (const [k, r] of Object.entries(t)) { console.log(`${HOUSE[k] ?? k} on ${k}: ${r.houses} (connected ${r.connected}, isolated ${r.isolated}) · route/terrain ${JSON.stringify(r.routes)}`); for (const x of r.towns) console.log('   ' + x); }
console.log('stored "is not compatible with" objections naming a written ground:', objections);
