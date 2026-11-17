// BIRTH-2-COUNT W1 · THE SAVED TOWN'S ROUND TRIP. For the first N towns of a V-late corpus that V-late changed (against
// R25s): generate again from the produced record's OWN config, as a regenerate would, in two forms: (a) `record.config`
// (the resolved config the record stores, its native sidecar included), (b) `record._config` (the input the record keeps),
// each with `record._seed`, under the same rule (BIRTH_RULE, BIRTH_VSITE in the environment); and (c) form (a) with
// `nearbyResourcesRandom: false` (the wizard's manual roster: the stored list read as the DM's word). Same town?
//   TREE=<prototype root> BIRTH_RULE=R2,R5,V BIRTH_VSITE=late node docs/chair/2026-11-17/birth/probes/w1roundtrip.mjs <R25s.gz> <VL.gz> [N]
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE = path.resolve(process.env.TREE);
const { generateSettlementPipeline } = await import(TREE + '/src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await import(TREE + '/src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const [fb, fv, n] = process.argv.slice(2); const B = load(fb), V = load(fv);
const VOL = /^(generatedAt|createdAt|updatedAt|_ts|timestamp|id)$/;
const j = (x) => JSON.stringify(x, (k, v) => (VOL.test(k) ? undefined : v));
const fams = (a, b) => Object.keys({ ...a, ...b }).filter((k) => !VOL.test(k) && j(a[k]) !== j(b[k]));
let k = 0; const out = {};
for (const [seed, s] of V) {
  if (j(B.get(seed)?.config?.nearbyResources) === j(s.config?.nearbyResources)) continue;
  if (k++ >= Number(n || 10)) break;
  for (const [form, cfg] of [['a record.config', s.config], ['b record._config', s._config], ['c record.config, manual roster', { ...s.config, nearbyResourcesRandom: false }]]) {
    let r; try { r = generateSettlementPipeline(structuredClone(cfg), null, { seed: s._seed ?? seed, customContent: {} }); } catch (e) { (out[form] ||= []).push(`${seed}: ERROR ${e.message}`); continue; }
    const f = fams(s, r);
    (out[form] ||= []).push(`${seed}: ${f.length ? 'DIFFERS in ' + f.join(', ') : 'SAME'}${j(r.config?.nearbyResources) !== j(s.config?.nearbyResources) ? ' · roster ' + j(r.config?.nearbyResources) : ''}`);
  }
}
for (const [form, rows] of Object.entries(out)) { console.log(`\n== ${form}: same ${rows.filter((x) => x.endsWith('SAME')).length} of ${rows.length}`); for (const r of rows) console.log('  ' + r.slice(0, 300)); }
