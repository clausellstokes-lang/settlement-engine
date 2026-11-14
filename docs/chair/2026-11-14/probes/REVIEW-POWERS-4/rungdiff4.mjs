// REVIEW-POWERS-4 rungdiff4.mjs — BASE=<corpus> TIP=<corpus> OUT=<json> node rungdiff4.mjs
// Every power whose description's OPENING changed base → tip (the claim the stage settles, or any other opening move),
// grouped by (base opening → tip opening), with the final label, figure and roster, for reading each settled rung
// against the town's own final roster. Reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP);
const open = (d) => { const m = String(d || '').match(/^.*?[.;](?=\s|$)/); return m ? m[0] : String(d || ''); };
const G = {};
for (const [seed, t] of T) { const b = B.get(seed); if (!b) continue; const bf = new Map((b.powerStructure?.factions || []).map((f) => [f.faction, f]));
  const F = t.powerStructure?.factions || [];
  for (const f of F) { const o = bf.get(f.faction); if (!o) continue; const a = open(o.desc), z = open(f.desc); if (a === z) continue;
    const k = `${a.slice(0, 90)}  →  ${z.slice(0, 90)}`; const g = (G[k] ||= { n: 0, labels: {}, ex: [] }); g.n++; g.labels[f.powerLabel] = (g.labels[f.powerLabel] || 0) + 1;
    if (g.ex.length < 40) g.ex.push(`${seed} [${t.tier}] ${f.faction} ${f.power}/${f.powerLabel}${f.isGoverning ? '/GOV' : ''} | roster ${F.map((x) => `${x.faction}:${x.power}/${x.powerLabel}${x.isGoverning ? '/GOV' : ''}`).join(', ')} | TIP ${String(f.desc).slice(0, 400)}`); } }
const out = Object.fromEntries(Object.entries(G).sort((a, b) => b[1].n - a[1].n));
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
for (const [k, g] of Object.entries(out)) console.log(`${g.n}\t${JSON.stringify(g.labels)}\t${k}`);
