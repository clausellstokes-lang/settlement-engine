// recs2nd.mjs <records dir> <seeds file> <out.ndjson.gz>: the rendered records (as the page saw them) into one gz ndjson.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [d, sf, o] = process.argv.slice(2); const z = zlib.createGzip(); const done = new Promise((r) => z.pipe(fs.createWriteStream(o)).on('finish', r));
let n = 0; for (const seed of fs.readFileSync(sf, 'utf8').trim().split('\n')) { const f = `${d}/${seed}.json`; if (!fs.existsSync(f)) continue; z.write(JSON.stringify({ seed, s: JSON.parse(fs.readFileSync(f, 'utf8')) }) + '\n'); n++; }
z.end(); await done; console.log('records', n);
