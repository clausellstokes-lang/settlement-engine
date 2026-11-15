// RECORD-MEASURE-2 · where the page prints a holder's sex-word: node kprint.mjs <before corpus> <after corpus> <dumps>
// For every card whose title the cure moved, a dump line holding the card's NAME and the OLD face (or, for an office title, its
// "Lord ") is a print of the fault; counted by section family (Summary/Systems/World/Table/PDF/Journal) and by section.
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B, D] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const fam = {}, sec = {}, towns = new Set(); let cards = 0;
const word = (t) => String(t).replace(/^the /, '').toLowerCase();
for (const { seed, s } of L(B)) {
  const moved = s.npcs.map((n, i) => [a[seed].npcs[i], n]).filter(([o, n]) => o && o.title !== n.title);
  const office = process.env.NOOFFICE ? [] : s.npcs.filter((n) => n.gender === 'female' && /^Lord /.test(String(n.role)));
  if (!moved.length && !office.length) continue;
  const f = `${D}/${seed}.txt`; if (!fs.existsSync(f)) continue;
  let cur = ''; const lines = fs.readFileSync(f, 'utf8').split('\n');
  const probes = [...moved.map(([o]) => [o.name, word(o.title)]), ...office.map((n) => [n.name, String(n.role).toLowerCase()])];
  cards += probes.length;
  for (const l of lines) { const m = /^== (.+) ==$/.exec(l); if (m) { cur = m[1]; continue; } const ll = l.toLowerCase();
    for (const [name, w] of probes) if (ll.includes(String(name).toLowerCase()) && ll.includes(w)) { const fm = cur.split('/')[0]; (fam[fm] ??= new Set()).add(seed); (sec[cur] ??= new Set()).add(seed); towns.add(seed); } }
}
console.log(`cards probed ${cards}; towns printing the old word beside the holder ${towns.size}`);
console.log(Object.entries(fam).map(([k, v]) => `${k} ${v.size}`).join(' · '));
console.log(Object.entries(sec).sort((x, y) => y[1].size - x[1].size).slice(0, 12).map(([k, v]) => `${v.size}:${k}`).join(' | '));
