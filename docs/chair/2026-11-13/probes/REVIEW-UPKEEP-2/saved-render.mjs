// Render a STORED record (JSON) through every surface of the tree TREE: no regeneration.
const T=process.env.TREE; import fs from 'node:fs';
const H = await import(T+'/scripts/audit/soak-review/renderHarness.mjs');
const AI = await import(T+'/src/generators/aiLayer.js');
const h = await H.bootHarness(); fs.mkdirSync(process.argv[3],{recursive:true});
for(const f of fs.readdirSync(process.argv[2])){ const s=JSON.parse(fs.readFileSync(process.argv[2]+'/'+f,'utf8'));
  const r=H.renderSurfaces(h,s); const parts=[];
  for(const [k,v] of Object.entries(r.tabs)) parts.push(`== tab:${k} ==\n${v}`);
  parts.push(`== tonight ==\n${r.tonight}`,`== pdf ==\n${r.pdf}`,`== foundry ==\n${r.foundry}`);
  try{ parts.push(`== ai-layer-prompt ==\n${AI.buildAiLayerPrompt(AI.extractFullContext(s))}`);}catch(e){}
  if(Object.keys(r.errors).length) parts.push(`== errors ==\n${JSON.stringify(r.errors)}`);
  fs.writeFileSync(`${process.argv[3]}/${f.replace('.json','.txt')}`, parts.join('\n')+'\n'); }
await h.server.close();
