// usage: node gm-emit.mjs <treeRoot> <outDir>   (emits a sample of golden configs, full records, plus all hashes)
import { pathToFileURL } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const [root, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const { generateSettlementPipeline } = await import(pathToFileURL(join(root, 'src/generators/generateSettlementPipeline.js')));
const { goldenCorpus, keyOf } = await import(pathToFileURL(join(root, 'tests/helpers/goldenMasterCorpus.js')));
const rows = goldenCorpus();
const sample = rows;
const hashes = {};
for (const c of sample) {
  const { _seed, ...cfg } = c;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const txt = JSON.stringify(s);
  hashes[keyOf(c)] = createHash('sha256').update(txt).digest('hex');
  writeFileSync(join(out, keyOf(c).replace(/\|/g, '__') + '.json'), txt);
}
writeFileSync(join(out, '_hashes.json'), JSON.stringify(hashes, null, 2));
console.log('emitted', sample.length);
