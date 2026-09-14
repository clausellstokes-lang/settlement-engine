// seam4-keyab.mjs <tree> <out.json>  — the key-by-key leaf snapshot for SEAM car 4.
// Records, per (leaf, block, pool): the variant count and the ordered list of
// {angle, marks, text, slots} — the four keys that existed before car 4 — plus the
// whole block's non-pool fields. A later run diffs two snapshots and prints
// ADDED / REMOVED / CHANGED pools and every key added per variant.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const tree = resolve(process.argv[2] || ''); const out = process.argv[3];
if (!tree || !out) { console.error('usage: <tree> <out.json>'); process.exit(2); }
const DIR = join(tree, 'src/data/dossierStateProse');
const CAUSAL = join(tree, 'src/data/dossierCausalProse.generated.js');
const snap = { leaves: {}, pools: {}, variantKeys: {}, blockKeys: {}, bytes: {} };
const files = [...readdirSync(DIR).filter((f) => f.endsWith('.generated.js')).map((f) => [`src/data/dossierStateProse/${f}`, join(DIR, f)]),
  ['src/data/dossierCausalProse.generated.js', CAUSAL]];
for (const [rel, abs] of files) {
  snap.bytes[rel] = readFileSync(abs).length;
  const mod = await import(pathToFileURL(abs).href);
  const table = Object.values(mod)[0];
  snap.leaves[rel] = Object.keys(table).length;
  for (const [block, b] of Object.entries(table)) {
    snap.blockKeys[`${rel}::${block}`] = Object.keys(b).sort().join(',');
    for (const [pool, variants] of Object.entries(b.pools || {})) {
      const id = `${rel}::${block}::${pool}`;
      snap.pools[id] = variants.map((v) => JSON.stringify({
        angle: v.angle ?? null, marks: v.marks ?? null, text: v.text, slots: v.slots,
      }));
      snap.variantKeys[id] = variants.map((v) => Object.keys(v).sort().join(','));
    }
  }
}
writeFileSync(out, JSON.stringify(snap, null, 1));
const pools = Object.keys(snap.pools).length;
const variants = Object.values(snap.pools).reduce((n, p) => n + p.length, 0);
console.log(`[seam4-keyab] ${Object.keys(snap.bytes).length} leaves · ${pools} pools · ${variants} variants · wrote ${out}`);
