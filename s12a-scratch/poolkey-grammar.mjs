// measure the pool-key grammar across every block in the state leaves
import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2];
const gdir = path.join(D, 'src/data/dossierStateProse');
const blocks = [];
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) blocks.push({ file: f, block, keys: Object.keys(b.pools || {}), counts: Object.fromEntries(Object.entries(b.pools||{}).map(([k,v])=>[k,v.length])) });
}
let nk = 0;
for (const b of blocks) nk += b.keys.length;
console.log(`blocks: ${blocks.length}  pool keys: ${nk}`);
for (const b of blocks) { console.log(`\n## ${b.block}  (${b.file})  ${b.keys.length} keys`); for (const k of b.keys) console.log(`    "${k}"  [${b.counts[k]}]`); }
