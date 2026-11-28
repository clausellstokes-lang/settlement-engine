// n2ties.mjs <a> <b> — of the relationships that move, how many touch the card whose influence moved
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [A, B] = process.argv.slice(2);
const load = async (f) => { const m = new Map(); for await (const l of readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()) })) { if (!l) continue; const r = JSON.parse(l); m.set(r.seed, r.s); } return m; };
const a = await load(A), b = await load(B); const C = {}; const inc = (k, n = 1) => { C[k] = (C[k] || 0) + n; }; const ex = [];
for (const [k, x] of a) { const y = b.get(k);
  const raised = (y.npcs || []).filter((c, i) => x.npcs[i] && c.influence !== x.npcs[i].influence).map((c) => [c.id, c.name]).flat();
  if (!raised.length) { if (JSON.stringify(x) !== JSON.stringify(y)) { inc('births moved with no raise'); ex.push(k); } continue; }
  inc('births raised');
  const ra = x.relationships || [], rb = y.relationships || [];
  if (ra.length !== rb.length) inc('births tie count differs');
  ra.forEach((t, i) => { const u = rb[i]; if (JSON.stringify(t) === JSON.stringify(u)) return; const ends = [t.from, t.to, t.npcA, t.npcB, t.a, t.b, u?.from, u?.to].map(String);
    inc(ends.some((e) => raised.includes(e)) ? 'ties moved touching the raised' : 'ties moved NOT touching'); if (!ends.some((e) => raised.includes(e)) && ex.length < 6) ex.push(`${k} ${JSON.stringify([t.from, t.to, t.archetypeKey, u?.archetypeKey, t.description?.slice(0,50), u?.description?.slice(0,50)])}`); });
}
console.log(C); console.log(ex.join('\n'));
