import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const LEAF_DIR = join(process.cwd(), 'src/data/dossierStateProse');
const rows = [];
for (const f of readdirSync(LEAF_DIR).filter((x) => x.endsWith('.generated.js')).sort()) {
  const mod = await import(`file://${join(LEAF_DIR, f)}`);
  for (const [block, b] of Object.entries(Object.values(mod)[0])) {
    for (const [pool, variants] of Object.entries(b.pools || {})) {
      const covert = variants.map((v, i) => ((v.marks || []).includes('dm-only') ? i : -1)).filter((i) => i >= 0);
      if (covert.length > 0 && covert.length < variants.length) {
        rows.push({ block, pool, n: variants.length, covertAt: covert });
      }
    }
  }
}
console.log('MIXED POOLS:', rows.length);
for (const r of rows) console.log(` ${r.block} :: ${r.pool} · ${r.n} variants · dm-only at [${r.covertAt.join(',')}]`);
const lastPos = rows.filter((r) => Math.min(...r.covertAt) === r.n - 1).length;
console.log('mixed pools whose ONLY covert variant is the LAST authored row:', lastPos, 'of', rows.length);
