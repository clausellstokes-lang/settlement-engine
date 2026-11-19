// UPKEEP-8: every stored field that differs between two births files (births.mjs `full`), by path with the array
// indices folded to [*]; counts the births and the values per path. usage: node fielddiff.mjs <a.ndjson> <b.ndjson> [examples]
import fs from 'node:fs'; import readline from 'node:readline'; import zlib from 'node:zlib';
const open = (p) => readline.createInterface({ input: fs.createReadStream(p).pipe(zlib.createGunzip()), crlfDelay: Infinity })[Symbol.asyncIterator]();
const A = open(process.argv[2]), B = open(process.argv[3]); const ex = Number(process.argv[4] || 0);
const paths = {}, births = {}; let n = 0, moved = 0; const examples = [];
function walk(a, b, p, hit) {
  if (a === b) return;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) walk(a[k], b[k], p + (Array.isArray(a) ? '[*]' : '.' + k), hit);
    return;
  }
  hit(p, a, b);
}
for (;;) {
  const [ra, rb] = await Promise.all([A.next(), B.next()]); if (ra.done || rb.done) break;
  const a = JSON.parse(ra.value), b = JSON.parse(rb.value); n++; if (a.seed !== b.seed) throw new Error('seed order');
  const seen = new Set();
  walk(a.s, b.s, '', (p, x, y) => { paths[p] = (paths[p] || 0) + 1; seen.add(p); if (examples.length < ex) examples.push({ seed: a.seed, p, x, y }); });
  if (seen.size) moved++; for (const p of seen) births[p] = (births[p] || 0) + 1;
}
console.log('births', n, 'moved', moved);
for (const [p, c] of Object.entries(paths).sort((x, y) => y[1] - x[1])) console.log(String(c).padStart(6), 'values in', String(births[p]).padStart(5), 'births', p);
for (const e of examples) console.log(JSON.stringify(e).slice(0, 400));
