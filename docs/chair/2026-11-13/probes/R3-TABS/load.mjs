import fs from 'node:fs'; import zlib from 'node:zlib';
export function* towns(file){ const buf=zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'); for(const l of buf.split('\n')){ if(l.trim()) yield JSON.parse(l); } }
