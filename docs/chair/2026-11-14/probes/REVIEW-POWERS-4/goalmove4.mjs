// REVIEW-POWERS-4 goalmove4.mjs — BASE= TIP= node goalmove4.mjs : every goal that moved base → tip, classed by cause:
// reworded (same family/kind/target, new words), charter refused (base charter on a criminal house or the governing power's
// head), and every other intent move, with the crisis in force (the SUPPLY lines' siege/famine refusal), for the field diff.
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP); const C = {}; const ex = {};
const inc = (k, e) => { C[k] = (C[k] || 0) + 1; (ex[k] ||= []).length < 5 && e && ex[k].push(e); };
for (const [seed, t] of T) { const b = B.get(seed); const bc = new Map(b.npcs.map((n) => [n.id, n])); const st = (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((x) => x?.type);
  const gov = t.powerStructure.factions.find((f) => f.isGoverning);
  for (const c of t.npcs) { const o = bc.get(c.id); if (!o) continue; for (const v of ['short', 'long']) {
    const a = o.goal?.intent?.[v], z = c.goal?.intent?.[v]; const same = JSON.stringify(a) === JSON.stringify(z);
    if (o.goal?.[v] === c.goal?.[v] && same) continue;
    if (same) { inc(`reworded ${a?.family}.${a?.kind}`); continue; }
    const headGov = !!gov && (c.memberships || []).some((m) => m.power === gov.faction && Number(m.rank) === 1);
    if (a?.family === 'INSTITUTION' && a?.kind === 'charter') { inc(`charter → ${z?.family}.${z?.kind} (${headGov ? 'head of the governing power' : 'not the head: criminal house?'})`, `${seed} ${c.name} (${c.title}) house=${c.institution?.key}`); continue; }
    const crisis = st.includes('under_siege') ? 'siege' : st.includes('famine') ? 'famine' : 'other';
    inc(`other move ${a?.family}.${a?.kind} → ${z?.family}.${z?.kind} [${crisis}]`, `${seed} ${c.name} (${c.title}) :: ${o.goal?.[v]} -> ${c.goal?.[v]}`); } } }
for (const [k, n] of Object.entries(C).sort((x, y) => y[1] - x[1])) { console.log(n, k); if (!/^reworded/.test(k) && n < 400) for (const e of (ex[k] || []).slice(0, 2)) console.log('     ', e.slice(0, 300)); }
