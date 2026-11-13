// REVIEW-W2B-3: a census-shaped corpus.ndjson.gz from a render's records/<seed>.json (for pagemeasure.mjs).
// node corpusFromRecords.mjs <render out dir> [cold-list.json]  — with a cold list, each seed is renamed to its town id
// (c01-thorp-none …) in the corpus and its dump copied to dumps-id/, because pagemeasure.mjs reads the size off the seed.
// Without a cold list the corpus keeps the seeds and pagemeasure reads dumps/ as rendered.
import fs from 'node:fs'; import zlib from 'node:zlib';
const OUT = process.argv[2]; const lines = [];
const ids = {};
if (process.argv[3]) {
  for (const l of JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).lines) ids[l.town.seed] = l.town.id;
  fs.mkdirSync(`${OUT}/dumps-id`, { recursive: true });
}
for (const f of fs.readdirSync(`${OUT}/records`).sort()) {
  const seed = f.replace(/\.json$/, ''); const id = ids[seed] || seed;
  if (process.argv[3]) fs.copyFileSync(`${OUT}/dumps/${seed}.txt`, `${OUT}/dumps-id/${id}.txt`);
  lines.push(JSON.stringify({ seed: id, s: JSON.parse(fs.readFileSync(`${OUT}/records/${f}`, 'utf8')) }));
}
fs.writeFileSync(`${OUT}/corpus.ndjson.gz`, zlib.gzipSync(lines.join('\n') + '\n'));
console.log('records', lines.length);
