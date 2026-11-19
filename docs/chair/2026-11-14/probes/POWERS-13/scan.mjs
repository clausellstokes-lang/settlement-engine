// scan.mjs <birthsdir> <js-predicate over row> [max]: prints key and the predicate's output for rows where truthy
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, expr, max] = process.argv.slice(2);
const f = new Function('r', 'return (' + expr + ')');
let n = 0, hit = 0;
for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort()) {
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const r = JSON.parse(line); n++;
    const o = f(r); if (o && (!Array.isArray(o) || o.length)) { hit++; if (hit <= Number(max || 50)) console.log(r.key, JSON.stringify(o)); }
  }
}
console.log('rows', n, 'hits', hit);
