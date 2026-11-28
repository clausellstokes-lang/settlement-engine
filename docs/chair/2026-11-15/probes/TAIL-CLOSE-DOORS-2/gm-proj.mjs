// usage: node gm-proj.mjs <treeRoot> <keysFile>  -> JSON {family: hash} over the keys (families = top two path levels, indices collapsed)
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const [root, keysFile] = process.argv.slice(2);
const keys = new Set(JSON.parse(readFileSync(keysFile, 'utf8')));
const { generateSettlementPipeline } = await import(pathToFileURL(join(root, 'src/generators/generateSettlementPipeline.js')));
const { goldenCorpus, keyOf } = await import(pathToFileURL(join(root, 'tests/helpers/goldenMasterCorpus.js')));
const fam = {};
const add = (f, k, v) => { (fam[f] ||= []).push(k + '=' + v); };
function walk(x, p, depth, key) {
  if (depth === 2 || x === null || typeof x !== 'object') { add(p, key, JSON.stringify(x)); return; }
  if (Array.isArray(x)) { add(p + '#len', key, x.length); x.forEach((e) => walk(e, p + '[]', depth, key)); return; }
  for (const k of Object.keys(x)) walk(x[k], p ? `${p}.${k}` : k, depth + 1, key);
}
for (const c of goldenCorpus()) {
  const k = keyOf(c); if (!keys.has(k)) continue;
  const { _seed, ...cfg } = c;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  walk(s, '', 0, k);
}
const out = {};
for (const [f, v] of Object.entries(fam)) out[f] = createHash('sha1').update(v.join('\n')).digest('hex').slice(0, 12);
process.stdout.write(JSON.stringify(out));
