// BIRTH-AUDIT Q4 · R1's page: a house the base marks short and the rule no longer marks, beside a page line that still says
// its good is "Needed, and not brought in" (`tradeListDisplay.js :: importsAsPrinted().needed`, matched by `needMetBy`),
// or a chain card / made list / Imports line naming the good. (The vintner on a road today is the comparison.)
//   BASE=<base root> TIP=<rule root> BIRTH_RULE=<rule> node docs/chair/2026-11-17/birth/probes/q4needed.mjs <base.gz> <rule.gz>
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const B0 = await import(path.resolve(process.env.BASE) + '/src/domain/facts/houseInputAtHand.js');
const T0 = await import(path.resolve(process.env.TIP) + '/src/domain/facts/houseInputAtHand.js');
const TL = await import(path.resolve(process.env.TIP) + '/src/domain/display/tradeListDisplay.js');
const [fb, ft] = process.argv.slice(2); const B = load(fb), T = load(ft);
const out = {}; let lifted = 0;
for (const [seed, sb] of B) { const st = T.get(seed); if (!st) continue;
  const was = B0.housesShortOf(sb), now = T0.housesShortOf(st);
  const needed = TL.importsAsPrinted(st).needed;
  for (const [h, good] of was) { if (now.has(h)) continue; lifted++;
    const hit = needed.find((x) => TL.needMetBy(x, good) || TL.needMetBy(good, x) || String(x).toLowerCase().includes(good.split(' ')[0]));
    const k = hit ? `${h.replace(/\s*\(.*\)/, '')} unmarked beside "Needed, and not brought in: ${hit}"` : `${h.replace(/\s*\(.*\)/, '')} unmarked, the page silent of ${good}`;
    (out[k] ||= []).push(seed); } }
console.log('houses no longer marked', lifted);
for (const [k, v] of Object.entries(out).sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(4), k, '·', v.slice(0, 3).join(', '));
