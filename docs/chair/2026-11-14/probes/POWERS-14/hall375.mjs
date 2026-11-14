// hall375.mjs <tree> <births>: the DM hall line per town, counted (the denial line, the hall-only twin) by crime structure
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2], dir = process.argv[3];
const { dmPowerViewOf } = await import(T + '/src/domain/people/patronage.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const c = {}; const ex = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/' + f)).toString().split('\n')) { if (!l) continue; const { key, s } = JSON.parse(l);
  const h = dmPowerViewOf(s)?.hall; if (!h) continue; const k = `${h.rung} | crime ${factsOf(s).crime} | ${/no criminal power here is strong enough/.test(h.line) ? 'DENIES' : /make their own decisions/.test(h.line) ? 'hall-only' : 'other'}`;
  c[k] = (c[k] || 0) + 1; (ex[k] ||= []).length < 6 && ex[k].push(key); }
for (const k of Object.keys(c).sort()) console.log(String(c[k]).padStart(4), k, ex[k].join(' '));
