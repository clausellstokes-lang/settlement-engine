// trad-load.mjs <tree> <dir>: each saved record through the tree's normalizeSettlement, then its founding traditions; prints {file: [gv, sha]}
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [,, tree, dir] = process.argv;
const { normalizeSettlement } = await import(`${tree}/src/domain/normalizeSettlement.js`);
const { deriveFoundingTraditions } = await import(`${tree}/src/domain/traditions/genesis.js`);
const out = {};
for (const f of readdirSync(dir).sort()) {
  const r = normalizeSettlement(JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
  out[f] = [r.generatorVersion ?? null, createHash('sha256').update(JSON.stringify(deriveFoundingTraditions(r))).digest('hex')];
}
console.log(JSON.stringify(out));
