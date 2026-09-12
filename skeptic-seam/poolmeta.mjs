import fs from 'node:fs';
const dir = process.argv[2];
const files = fs.readdirSync(dir+'/src/data/dossierStateProse');
let blocks=0, pools=0, variants=0;
const bad = {role:[], fc:[], attach:[], vidmissing:[], vcount:[], vidsmatch:[], nonAsc:[], readsCount:[]};
const census = JSON.parse(fs.readFileSync(dir+'/docs/content/wiring-census.json','utf8'));
const censusReads = new Map();
for (const r of census.rows) { const k = r.blockId+'::'+r.poolKey; if (r.reads) censusReads.set(k, r.reads); }
const poolMetaKeys = new Set();
const allBlocks = [];
for (const f of files) {
  const mod = await import(dir+'/src/data/dossierStateProse/'+f);
  const obj = Object.values(mod)[0];
  for (const [bid, block] of Object.entries(obj)) {
    blocks++; allBlocks.push([bid, block]);
    const pm = block.poolMeta;
    if (!pm) { bad.role.push(bid+' NO poolMeta'); continue; }
    for (const k of Object.keys(block.pools)) {
      pools++;
      const m = pm[k];
      if (!m) { bad.role.push(bid+'::'+k+' pool with no poolMeta row'); continue; }
      Object.keys(m).forEach(x=>poolMetaKeys.add(x));
      if (m.role !== 'spine') bad.role.push(bid+'::'+k+' role='+m.role);
      if (!Array.isArray(m.faceCounts) || m.faceCounts.some(x=>x!==1)) bad.fc.push(bid+'::'+k);
      if (!Array.isArray(m.attach) || m.attach.length!==0) bad.attach.push(bid+'::'+k);
      const vs = block.pools[k];
      variants += vs.length;
      if (m.variantCount !== vs.length) bad.vcount.push(bid+'::'+k+' pin='+m.variantCount+' actual='+vs.length);
      const vids = vs.map(v=>v.vid);
      if (vids.some(v=>typeof v!=='number')) bad.vidmissing.push(bid+'::'+k);
      if (JSON.stringify(vids)!==JSON.stringify(m.vids)) bad.vidsmatch.push(bid+'::'+k);
      for (let i=1;i<vids.length;i++) if (!(vids[i]>vids[i-1])) bad.nonAsc.push(bid+'::'+k);
      const ck = bid+'::'+k;
      const cr = censusReads.get(ck);
      if (cr === undefined) { if ('readsCount' in m) bad.readsCount.push(ck+' readsCount present, census has none'); }
      else if (m.readsCount !== cr.length) bad.readsCount.push(ck+' rc='+m.readsCount+' census='+cr.length);
    }
    // poolMeta rows with no pool
    for (const k of Object.keys(pm)) if (!(k in block.pools)) bad.role.push(bid+'::'+k+' poolMeta row with no pool');
  }
}
console.log('blocks',blocks,'pools',pools,'variants',variants);
console.log('poolMeta key union:', [...poolMetaKeys].sort().join(','));
for (const [k,v] of Object.entries(bad)) console.log(k, v.length, v.slice(0,5).join(' | '));
// readsCount present/absent tally
let present=0, absent=0;
for (const [bid,block] of allBlocks) for (const [k,m] of Object.entries(block.poolMeta||{})) { if ('readsCount' in m) present++; else absent++; }
console.log('readsCount present', present, 'absent', absent);
