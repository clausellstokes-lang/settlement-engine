// the structural rows a card had at base and has not at tip (cured by silence?): who, which body, its rank, the row
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP); const C = {}; const out = [];
for (const [seed, t] of T) { const b = B.get(seed); const bc = new Map(b.npcs.map((n) => [n.id, n]));
  for (const c of t.npcs) { const o = bc.get(c.id); if (!o || !o.structuralPosition || c.structuralPosition) continue;
    const m = (c.memberships || []).find((x) => x.rank === 1) || (c.memberships || [])[0]; const body = t.powerStructure.factions.find((f) => f.faction === m?.power);
    const kindTop = t.powerStructure.factions.filter((f) => f.category === body?.category).sort((x, y) => y.power - x.power)[0];
    const k = `${c.category} ${o.structuralPosition.split(/[,;]| while| in quiet| among/)[0]}`; C[k] = (C[k] || 0) + 1;
    out.push(`${seed} | ${c.name} (${c.title}, ${c.category}) rank ${m?.rank} of ${m?.power} ${body?.power}/${body?.powerLabel}; strongest of kind: ${kindTop?.faction} ${kindTop?.power} | ${o.structuralPosition.slice(0, 120)}`); } }
console.log(JSON.stringify(C, null, 1)); console.log(out.filter((_, i) => i % 3 === 0).slice(0, 30).join('\n'));
