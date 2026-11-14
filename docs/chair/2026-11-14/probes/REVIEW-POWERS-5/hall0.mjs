// REVIEW-POWERS-5 hall0.mjs — TREE= CORPUS= node hall0.mjs : the none rung's first line ("no criminal power here is strong
// enough to push it") where it still prints, by the town's crime structure and the criminal powers on its roster.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const { dmPowerViewOf } = await import(T + '/src/domain/people/patronage.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { criminalPowersOf } = await import(T + '/src/domain/people/allegiance.js');
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const c = {}; const ex = [];
for (const { seed, s } of rows) { const h = dmPowerViewOf(s)?.hall; if (!h || !/no criminal power here is strong enough/.test(h.line)) continue;
  const cp = criminalPowersOf(s); const k = factsOf(s).crime + ' | criminal powers ' + cp.length; c[k] = (c[k] || 0) + 1;
  if (cp.length && ex.length < 12) ex.push(seed + ': ' + cp.map((p) => `${p.faction || p.name} ${p.power}% ${p.powerLabel || ''}`).join(', ')); }
console.log(c); console.log(ex.join('\n'));
