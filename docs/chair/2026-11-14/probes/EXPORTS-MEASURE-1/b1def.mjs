// node b1def.mjs <corpus> <tree>: towns whose Economic Survival sentence names the defenders where no force stands (forceStands), by tier
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const f = (await import(T + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness;
const { forceStands } = await import(T + '/src/domain/display/threatAssessment.js'); const c = {}; let n = 0;
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { s } = JSON.parse(l);
  const e = f(s).find((r) => r.label === 'Economic Survival')?.assess || ''; if (/defenders|defend the place/.test(e) && !forceStands(s)) { n++; c[s.tier] = (c[s.tier] || 0) + 1; } }
console.log('defenders named, no force stands:', n, JSON.stringify(c));
