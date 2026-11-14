import fs from 'node:fs';
const TREE = process.env.TREE;
const { DOSSIER_CAUSAL_PROSE } = await import(`${TREE}/src/data/dossierCausalProse.generated.js`);
const frags = [];
for (const [b, blk] of Object.entries(DOSSIER_CAUSAL_PROSE)) for (const [k, pool] of Object.entries(blk.pools)) for (const v of pool) {
  const f = v.text.split(/\{[a-zA-Z_]+\}/).map((x) => x.trim()).sort((a, z) => z.length - a.length)[0];
  if (f && f.length >= 20) frags.push({ b, f });
}
const seen = new Map(); let towns = 0;
for (const f of fs.readdirSync('out-base/dumps')) {
  const t = fs.readFileSync('out-base/dumps/' + f, 'utf8'); let any = false;
  for (const x of frags) if (t.includes(x.f)) { seen.set(x.b, (seen.get(x.b) || 0) + 1); any = true; }
  if (any) towns++;
}
console.log('causal variants', frags.length, 'blocks printed', seen.size, 'of', Object.keys(DOSSIER_CAUSAL_PROSE).length, 'towns with a causal line', towns);
