// W2-C-LEAVES-9: importsAsPrinted per town (arriving, needed). `TREE=<tree> node imp9.mjs <corpus.ndjson.gz>`
import fs from 'node:fs'; import zlib from 'node:zlib';
const { importsAsPrinted } = await import(process.env.TREE + '/src/domain/display/tradeListDisplay.js');
for (const l of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().split('\n').filter(Boolean)) {
  const { seed, s } = JSON.parse(l); const r = importsAsPrinted(s); process.stdout.write(JSON.stringify({ seed, a: r.arriving, n: r.needed }) + '\n'); }
