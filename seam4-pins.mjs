// seam4-pins.mjs <tree> — compute every SHIFT REGISTER pin from the leaves, exactly as the
// contract test recomputes them, so the register's committed values are a MEASUREMENT.
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const tree = resolve(process.argv[2] || '');
const DIR = join(tree, 'src/data/dossierStateProse');
const sha256 = (t) => createHash('sha256').update(t).digest('hex');

const blocks = [];
for (const f of readdirSync(DIR).filter((n) => n.endsWith('.generated.js')).sort()) {
  const mod = await import(pathToFileURL(join(DIR, f)).href);
  for (const [id, b] of Object.entries(Object.values(mod)[0])) blocks.push([id, b]);
}
const rows = [];
for (const [id, b] of blocks) {
  for (const [pool, variants] of Object.entries(b.pools)) {
    rows.push({ id, pool, variants, meta: b.poolMeta[pool] });
  }
}
rows.sort((x, y) => (`${x.id} :: ${x.pool}` < `${y.id} :: ${y.pool}` ? -1 : 1));
const lines = (fn) => rows.map((r) => `${r.id} :: ${r.pool} :: ${fn(r)}`).join('\n');

const norms = Object.entries((await import(pathToFileURL(join(tree, 'src/data/proseNorms.generated.js')).href))
  .DOSSIER_PROSE_NORMS).sort(([a], [b]) => (a < b ? -1 : 1));
const conn = (await import(pathToFileURL(join(tree, 'src/data/dossierConnectives.generated.js')).href))
  .DOSSIER_CONNECTIVES;
const rel = await import(pathToFileURL(join(tree, 'src/data/dossierRelations.generated.js')).href);

const out = {
  blocks: blocks.length,
  pools: rows.length,
  variantCountTotal: rows.reduce((n, r) => n + r.meta.variantCount, 0),
  faceTotal: rows.reduce((n, r) => n + r.meta.faceCounts.reduce((m, c) => m + c, 0), 0),
  maxFaceCount: Math.max(...rows.flatMap((r) => r.meta.faceCounts)),
  poolKeysDigest: sha256(rows.map((r) => `${r.id} :: ${r.pool}`).join('\n')),
  variantCountsDigest: sha256(lines((r) => r.meta.variantCount)),
  faceCountsDigest: sha256(lines((r) => r.meta.faceCounts.join(','))),
  vidsDigest: sha256(lines((r) => r.meta.vids.join(','))),
  attachDigest: sha256(lines((r) => r.meta.attach.join('|'))),
  attachAllEmpty: rows.every((r) => r.meta.attach.length === 0),
  readsCountPresent: rows.filter((r) => r.meta.readsCount !== undefined).length,
  readsCountAbsent: rows.filter((r) => r.meta.readsCount === undefined).length,
  normRows: norms.length,
  normOnes: norms.filter(([, v]) => v.departure === 1).length,
  normBitsDigest: sha256(norms.map(([k, v]) => `${k} ${v.departure}`).join('\n')),
  connectiveLengths: Object.fromEntries(Object.entries(conn)
    .flatMap(([r, bySeat]) => Object.entries(bySeat).map(([seat, list]) => [`${r}.${seat}`, list.length]))),
  relationPairs: Object.keys(rel.DOSSIER_RELATIONS).length,
  relationRows: Object.values(rel.DOSSIER_RELATIONS).reduce((n, v) => n + v.length, 0),
  aliasRows: rel.DOSSIER_RELATION_ALIASES.length,
};
console.log(JSON.stringify(out, null, 2));
