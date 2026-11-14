import fs from 'node:fs'; import zlib from 'node:zlib';
export function load(f){ return zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l)); }
