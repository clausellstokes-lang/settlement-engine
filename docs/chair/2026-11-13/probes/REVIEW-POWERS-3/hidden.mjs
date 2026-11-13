// the hidden powers' descriptions (the infiltrator), and the standing sentence appended to them, base and tip
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP);
for (const [seed, t] of T) for (const f of t.powerStructure.factions) if (f.hidden || /Its presence is not known/.test(f.desc || '')) {
  const b = (B.get(seed)?.powerStructure.factions || []).find((x) => x.faction === f.faction);
  console.log(`${seed} ${f.faction} ${f.power}/${f.powerLabel}\n  TIP:  ${f.desc}\n  BASE: ${b?.desc}`); }
