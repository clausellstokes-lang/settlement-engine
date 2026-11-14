// node q.mjs <tree> <corpus.ndjson.gz> <query.mjs> — query.mjs default-exports async ({ tree, towns }) => void
import fs from 'node:fs'; import zlib from 'node:zlib';
const [TREE, C, Q] = process.argv.slice(2);
const towns = zlib.gunzipSync(fs.readFileSync(C)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const q = (await import(Q)).default; await q({ tree: TREE, towns });
