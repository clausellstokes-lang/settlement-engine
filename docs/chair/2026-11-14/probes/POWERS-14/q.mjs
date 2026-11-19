// q.mjs <birthsdir> <js expr over (s,key)> [max] : prints key + output where truthy (non-empty array)
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, expr, max] = process.argv.slice(2);
const f = new Function('s','key', 'return (' + expr + ')');
let n = 0, hit = 0;
for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort()) {
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const r = JSON.parse(line); n++;
    const o = f(r.s, r.key); if (o && (!Array.isArray(o) || o.length)) { hit++; if (hit <= Number(max || 50)) console.log(r.key, typeof o==='string'?o:JSON.stringify(o)); }
  }
}
console.log('rows', n, 'hits', hit);
