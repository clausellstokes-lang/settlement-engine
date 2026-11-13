// REVIEW-W2-FIX-DATA render: births a list of towns in TREE and writes, per town, the soak harness's text of
// the 20 dossier tabs, the Tonight sheet, the PDF and the Foundry journal (OUT/<id>.txt) plus the record (OUT/<id>.json.gz).
//   TREE=<tree> OUT=<dir> LIST=<towns.json> node render.mjs
// towns.json: [{id, seed, config, opts}] — config spread over DEFAULT_CONFIG through birthConfig; opts.customContent:{} when set.
import fs from 'node:fs'; import zlib from 'node:zlib';
const TREE=process.env.TREE, OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const list=JSON.parse(fs.readFileSync(process.env.LIST,'utf8'));
process.chdir(TREE);
const R=TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const H = await import(TREE+'/scripts/audit/soak-review/renderHarness.mjs');
const h = await H.bootHarness();
for (const t of list) {
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...t.config });
  const s = generateSettlementPipeline(cfg, null, { seed: t.seed, ...(t.opts||{}) });
  const r = H.renderSurfaces(h, s);
  const parts=[];
  for (const [k,v] of Object.entries(r.tabs)) parts.push(`== tab:${k} ==`, v);
  parts.push('== tonight ==', r.tonight, '== pdf ==', r.pdf, '== foundry ==', r.foundry, '== errors ==', JSON.stringify(r.errors));
  fs.writeFileSync(`${OUT}/${t.id}.txt`, parts.join('\n')+'\n');
  fs.writeFileSync(`${OUT}/${t.id}.json.gz`, zlib.gzipSync(JSON.stringify(s)));
  console.log(t.id, s.name, s.tier||s.settType, s.population, Object.keys(r.errors).length?'ERR '+Object.keys(r.errors).join(','):'');
}
await h.server.close();
