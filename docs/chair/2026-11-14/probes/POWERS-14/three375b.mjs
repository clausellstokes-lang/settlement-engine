import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2], dir = process.argv[3];
const { dmPowerViewOf } = await import(T + '/src/domain/people/patronage.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/' + f)).toString().split('\n')) { if (!l) continue; const { key, s } = JSON.parse(l);
  const v = dmPowerViewOf(s); const h = v?.hall; if (!h || h.rung !== 'none' || factsOf(s).crime === 'none') continue; const cr = factsOf(s).crime;
  const ranks = v.rulingThree.map((r) => r.rank); if (ranks.includes(2) && ranks.includes(3)) continue;
  const st = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).map((x) => x.type).join('+');
  console.log(key, cr, ranks.join(','), st || 'calm', v.ruler); }
