// K2 measure: stored string leaves holding the town's name, counted by path (indices folded), and the hazards
import { readFileSync } from 'node:fs';
for (const C of ['C', 'V']) {
  const L = readFileSync(`/home/user/scratch/work/F2-${C}.jsonl`, 'utf8').trim().split('\n').map(JSON.parse);
  const byPath = {}; const hz = { part: {}, inName: {}, exact: {} }; let pages = 0; const multiword = L.filter((j) => j.words > 1).length; const person = L.filter((j) => j.personHolds.length);
  const ex = {};
  for (const j of L) {
    if (j.leaves.length) pages++;
    const seen = new Set();
    for (const [p, n, t] of j.leaves) { const k = p.replace(/\[\d+\]/g, '[]'); const B = (byPath[k] ||= { towns: 0, leaves: 0, hits: 0 }); B.leaves++; B.hits += n; if (!seen.has(k)) { seen.add(k); B.towns++; } ex[k] ||= `${j.seed} ${j.name}: ${t.slice(0, 160)}`; }
    for (const [kind, p, t] of j.hazards) { const k = p.replace(/\[\d+\]/g, '[]'); const H = (hz[kind][k] ||= { n: 0, ex: null }); H.n++; H.ex ||= `${j.seed} ${j.name}: ${t.slice(0, 140)}`; }
  }
  console.log(`== ${C}: ${L.length} births, ${pages} hold the name in a stored string; multi-word names ${multiword}; a person's name holds the town's ${person.length}${person.length ? ' e.g. ' + person[0].seed + ' ' + person[0].name + ' / ' + person[0].personHolds[0] : ''}`);
  for (const [k, B] of Object.entries(byPath).sort((a, b) => b[1].towns - a[1].towns)) console.log(`  ${k}: towns ${B.towns}, leaves ${B.leaves}, hits ${B.hits} | ${ex[k]}`);
  for (const kind of ['part', 'inName', 'exact']) for (const [k, H] of Object.entries(hz[kind]).sort((a, b) => b[1].n - a[1].n).slice(0, 12)) console.log(`  HAZARD ${kind} ${k}: ${H.n} | ${H.ex}`);
}
