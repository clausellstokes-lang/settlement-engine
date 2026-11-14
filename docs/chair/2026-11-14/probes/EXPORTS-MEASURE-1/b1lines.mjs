// node b1lines.mjs <corpus> <tree>: every distinct readiness sentence (first 70 chars) with its towns, by small (thorp/hamlet/village) and large
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const f = (await import(T + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness; const c = {};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { s } = JSON.parse(l);
  const small = ['thorp', 'hamlet', 'village'].includes(s.tier) ? 0 : 1;
  for (const r of f(s)) { const k = r.label[0] + ': ' + r.assess.replace(/Internal security: [^.]*\./, 'IS: <label>.').slice(0, 75); (c[k] ||= [0, 0])[small]++; } }
for (const [k, [a, b]] of Object.entries(c).sort((x, y) => (y[1][0] + y[1][1]) - (x[1][0] + x[1][1]))) console.log(a, b, k);
