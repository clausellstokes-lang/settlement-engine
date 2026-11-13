// faction descriptions whose STANDING tail changed base -> tip (the opening kept): a read sample with the final figures
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP); const out = []; let n = 0, open = 0;
for (const [seed, t] of T) { const bf = new Map(B.get(seed).powerStructure.factions.map((f) => [f.faction, f]));
  const ord = [...t.powerStructure.factions].sort((a, b) => b.power - a.power);
  for (const f of t.powerStructure.factions) { const o = bf.get(f.faction); if (!o || o.desc === f.desc) continue;
    const s1 = (o.desc || '').split('. '), s2 = (f.desc || '').split('. ');
    if (s1[0] !== s2[0]) { open++; continue; } n++;
    if (out.length < Number(process.env.N || 40) && (out.length % 1 === 0)) out.push(`${seed} | ${f.faction} #${ord.indexOf(f) + 1} ${f.power}/${f.powerLabel}${f.isGoverning ? ' GOV' : ''}${f.contestsNiche ? ' rival-of ' + f.contestsNiche : ''} | roster ${ord.map((x) => x.faction.slice(0, 18) + ':' + x.power).join(', ')}\n   BASE tail: ${(o.desc || '').slice(s2[0].length).slice(0, 220)}\n   TIP  tail: ${(f.desc || '').slice(s2[0].length).slice(0, 220)}`); } }
console.log('standing-tail changes', n, 'opening changes', open); console.log(out.join('\n'));
