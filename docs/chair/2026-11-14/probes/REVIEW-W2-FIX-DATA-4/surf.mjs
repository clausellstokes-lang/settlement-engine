// Every surface (tabs, Tonight, PDF text, Foundry journal) through the tree's soak harness. TREE= SEEDS= OUT= node surf.mjs
import fs from 'node:fs';
const TREE=process.env.TREE, OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true}); process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const H = await import(TREE+'/scripts/audit/soak-review/renderHarness.mjs'); const h = await H.bootHarness();
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) {
  const s = born(seed); const r = H.renderSurfaces(h, s);
  const surf = { tabs: Object.entries(r.tabs).map(([k,v])=>`-- tab ${k} --\n${v}`).join('\n'), tonight: r.tonight||'', pdf: r.pdf||'', foundry: r.foundry||'' };
  fs.writeFileSync(`${OUT}/${seed}.txt`, Object.entries(surf).map(([k,v])=>`== ${k} ==\n${v}`).join('\n')+'\n');
  fs.writeFileSync(`${OUT}/${seed}.rec.json`, JSON.stringify(s));
}
await h.server.close(); console.log('done');
