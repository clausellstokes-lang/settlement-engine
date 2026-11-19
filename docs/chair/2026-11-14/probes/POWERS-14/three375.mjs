import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2], dir = process.argv[3];
const { dmPowerViewOf } = await import(T + '/src/domain/people/patronage.js');
const c = {}; const ex = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/' + f)).toString().split('\n')) { if (!l) continue; const { key, s } = JSON.parse(l);
  const v = dmPowerViewOf(s); const h = v?.hall; if (!h || h.rung !== 'none') continue;
  const k = (/make their own decisions/.test(h.line) ? 'twin' : 'first') + ' three=' + v.rulingThree.map((r) => r.rank).join(',');
  c[k] = (c[k] || 0) + 1; (ex[k] ||= []).length < 5 && ex[k].push(key); }
for (const k of Object.keys(c).sort()) console.log(String(c[k]).padStart(4), k, ex[k].join(' '));
