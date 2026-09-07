import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2], want = process.argv[3];
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) { if (block !== want) continue;
    console.log(`# ${block} (${f})`);
    for (const [pool, vs] of Object.entries(b.pools || {})) { console.log(`\n## POOL "${pool}"  (${vs.length} variants)`);
      for (const v of vs) console.log(`   [${v.angle||'-'}] ${v.marks&&v.marks.length?JSON.stringify(v.marks)+' ':''}${v.text}`); } }
}
