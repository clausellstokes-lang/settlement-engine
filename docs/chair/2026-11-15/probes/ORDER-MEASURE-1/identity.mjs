// the instrument is draw-free: node identity.mjs <snap.ndjson.gz> <plain corpus.ndjson.gz> — each town's record hash equal
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const rd = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const snap = Object.fromEntries(rd(process.argv[2]).map((r) => [r.seed, r.h]));
let eq = 0, ne = 0; for (const r of rd(process.argv[3])) { const h = crypto.createHash('sha256').update(JSON.stringify(r.s)).digest('hex').slice(0, 16); if (snap[r.seed] === h) eq++; else ne++; }
console.log('identical', eq, 'differ', ne); process.exit(ne ? 1 : 0);
