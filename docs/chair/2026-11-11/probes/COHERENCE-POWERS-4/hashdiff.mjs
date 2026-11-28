// node hashdiff.mjs a.jsonl b.jsonl — births whose whole-record sha256 differs, by corpus
import fs from 'node:fs';
const read = (f) => new Map(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.key, r.hash]));
const A = read(process.argv[2]), B = read(process.argv[3]); const d = {}; const ex = [];
for (const [k, h] of A) { const c = k.split(/[-:]/)[0]; d[c] ||= [0, 0]; d[c][1]++; if (B.get(k) !== h) { d[c][0]++; if (ex.length < 8) ex.push(k); } }
console.log('differ/total by corpus', JSON.stringify(d), 'missing in b', [...A.keys()].filter((k) => !B.has(k)).length, ex.join(' '));
