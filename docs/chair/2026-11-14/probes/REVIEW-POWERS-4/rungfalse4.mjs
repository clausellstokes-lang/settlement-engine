// REVIEW-POWERS-4 rungfalse4.mjs — BASE= TIP= node rungfalse4.mjs : the rungs the stage PLACED (the base opened with a
// commanding claim, the tip opens with a rung), each read against the town's FINAL roster: "without yet being the dominant
// commercial voice" (a merchant power governs or a stronger one stands), "competitive with merchant capital" (a merchant
// power stands), "outpaced by merchant capital" (a stronger one stands), "present in council discussions" (a council governs).
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP);
const M = /merchant|trade|commerc|consortium|mercantile/i, CO = /council|assembly|senate|parliament|moot/i;
const TESTS = [['without yet being the dominant commercial voice', (f, F, g) => M.test(g) || F.some((m) => m !== f && M.test(m.faction) && m.power > f.power)],
  ['competitive with merchant capital', (f, F) => F.some((m) => m !== f && M.test(m.faction))], ['outpaced by merchant capital', (f, F) => F.some((m) => m !== f && M.test(m.faction) && m.power > f.power)],
  ['present in council discussions', (f, F, g) => CO.test(g)]];
const C = {}; const ex = [];
for (const [seed, t] of T) { const bf = new Map((B.get(seed)?.powerStructure?.factions || []).map((f) => [f.faction, f])); const F = t.powerStructure.factions; const g = F.find((x) => x.isGoverning)?.faction || '';
  for (const f of F) { const o = bf.get(f.faction); if (!o) continue; const o1 = String(o.desc).split(/[.;]/)[0], t1 = String(f.desc).split(/[.;]/)[0]; if (o1 === t1) continue;
    for (const [needle, ok] of TESTS) if (String(f.desc).includes(needle) && !String(o.desc).includes(needle)) { const v = ok(f, F, g); const k = `${needle} · ${v ? 'TRUE' : 'FALSE'}`; C[k] = (C[k] || 0) + 1; if (!v) ex.push(`${seed} ${f.faction} ${f.power}/${f.powerLabel} gov=${g} | ${F.map((x) => x.faction + ':' + x.power).join(', ')} | BASE ${o1.slice(0, 70)}`); } } }
console.log(C); for (const e of ex) console.log('  ', e.slice(0, 330));
