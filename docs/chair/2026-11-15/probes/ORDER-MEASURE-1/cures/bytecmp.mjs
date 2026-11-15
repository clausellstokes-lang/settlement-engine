// ORDER-MEASURE-1 · byte identity of two corpora (key order counts, as the golden's sha256(JSON.stringify) counts it): node bytecmp.mjs <a> <b>
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const rd = (f) => Object.fromEntries(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, crypto.createHash('sha256').update(JSON.stringify(r.s)).digest('hex')]; }));
const a = rd(process.argv[2]), b = rd(process.argv[3]); const ks = Object.keys(a);
console.log('byte-identical', ks.filter((k) => a[k] === b[k]).length, 'of', ks.length);
