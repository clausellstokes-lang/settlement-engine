// UPKEEP-8, F3: each threat row's sentence against (1) the band its row prints (the bands each sentence's words are
// true under: the seventh seat's f3cls.py table, carried here, the twins added), and (2) the forces the projection
// holds (a sentence that says no force stands, or names a garrison or a militia, read against standingDefenseForces).
// usage: node f3cls.mjs <f3.ndjson>  — prints the cells (family, sentence, band) that contradict, with three towns each.
import fs from 'node:fs';
export const OK = [
  ['Active frontier. Walls and garrison provide credible deterrence', ['STRONG', 'ADEQUATE']],
  ['A palisade and a militia, as most frontier', ['ADEQUATE']], ['Walls and a militia, as most frontier', ['ADEQUATE']],
  ['Active frontier with a', ['ADEQUATE', 'WEAK']],
  ['Wild country all round and nobody organised', ['WEAK', 'CRITICAL']],
  ['Quiet country and no organised defence', ['ADEQUATE', 'STRONG']],
  ['Quiet country, and far more defences', ['STRONG']],
  ['Safe heartland with minimal creature activity', ['ADEQUATE', 'STRONG']],
  ['Embattled region: constant creature pressure. Walls and garrison', ['ADEQUATE', 'STRONG']],
  ['Palisade and citizen militia provide a viable but demanding', ['ADEQUATE', 'WEAK']], ['Walls and citizen militia provide a viable but demanding', ['ADEQUATE', 'WEAK']],
  ['No perimeter, but the charter hall', ['ADEQUATE', 'WEAK']],
  ['Walls exist but no organized force', ['WEAK', 'CRITICAL']], ['A palisade stands but no organized force', ['WEAK', 'CRITICAL']],
  ['Military force present but no perimeter walls', ['ADEQUATE', 'WEAK']],
  ['embattled region with no organized defense', ['CRITICAL']],
  ['Walls and professional garrison provide', ['STRONG', 'ADEQUATE']], ['A palisade and a professional garrison provide', ['STRONG', 'ADEQUATE']],
  ['A palisade and armed townsfolk', ['ADEQUATE', 'WEAK']], ['Walls and armed townsfolk', ['ADEQUATE', 'WEAK']],
  ['Walls present but no organized military force', ['WEAK', 'CRITICAL']], ['A palisade but no organized military force', ['WEAK', 'CRITICAL']],
  ['Professional garrison without perimeter walls', ['ADEQUATE', 'WEAK']],
  ['Armed citizens who know their ground', ['ADEQUATE', 'WEAK']],
  ['No walls or garrison. Cannot resist', ['WEAK', 'CRITICAL']],
];
const ALL = ['STRONG', 'ADEQUATE', 'WEAK', 'CRITICAL'];
export const TWINS = [ // the twins (b) adds, with the bands their words are true under
  ['Quiet country, and nothing organised is kept against it', ['WEAK', 'CRITICAL']],
  ['Quiet country, and little is kept against it.', ['WEAK', 'CRITICAL']],
  ['An embattled region, and only', ['WEAK', 'CRITICAL']],
  ['Active frontier, with', ALL],
  ['Active frontier with a militia but no perimeter, and too little', ['CRITICAL']], ['Active frontier with a garrison but no perimeter, and too little', ['CRITICAL']],
  ['Walls, and a watch to keep them', ALL], ['A palisade, and a watch to keep it', ALL],
  ['A palisade and armed townsfolk who know how to hold it', ['STRONG']], ['Walls and armed townsfolk who know how to hold them', ['STRONG']],
  ['A palisade and nobody organised to man it', ['ADEQUATE']], ['Walls and nobody organised to man them', ['ADEQUATE']],
  ['Armed citizens who know their ground, and no walls', ['CRITICAL']],
  ['No walls or garrison, but enough here to turn away raiders', ['ADEQUATE']],
];
export function judge(row, forces) {
  if (!row.assess) return { key: '(band alone)', bad: [] };
  const hit = [...TWINS, ...OK].find(([p]) => row.assess.startsWith(p));
  if (!hit) return { key: 'UNCLASSED ' + row.assess.slice(0, 50), bad: ['unclassed'] };
  const has = (k) => forces.includes(k); const force = ['garrison', 'militia', 'watch', 'mercenary'].some(has);
  const bad = [];
  if (!(hit[1] === ALL || hit[1].includes(row.status))) bad.push('band');
  if (/no organi[sz]ed (?:military )?force|nobody organised|no organised defence|no organized defense/.test(row.assess) && force) bad.push('a force stands');
  if (/garrison/i.test(row.assess) && !/No walls or garrison/.test(row.assess) && !has('garrison')) bad.push('no garrison');
  if (/militia|armed townsfolk|Armed citizens/.test(row.assess) && !has('militia')) bad.push('no militia');
  if (/nothing organised|nobody organised to man/.test(row.assess) && force) bad.push('a force stands');
  if (/\ba watch to\b|and a watch\b/.test(row.assess) && !has('watch')) bad.push('no watch');
  if (/^(?:Walls|A palisade|Active frontier, with)/.test(row.assess) && /palisade|walls/i.test(row.assess.slice(0, 40)) && !has('walls')) bad.push('no walls');
  if (/and no walls|No walls|but no perimeter/.test(row.assess) && has('walls')) bad.push('walls stand');
  return { key: hit[0], bad };
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop()) && process.argv[2]) {
  const cells = new Map(); let rows = 0, badRows = 0, alone = 0; const births = new Set();
  for (const l of fs.readFileSync(process.argv[2], 'utf8').trim().split('\n')) {
    const o = JSON.parse(l);
    for (const r of o.rows) {
      rows++; const j = judge(r, o.forces); if (j.key === '(band alone)') alone++;
      if (!j.bad.length) continue; badRows++; births.add(o.seed);
      const k = `${r.label.slice(0, 7)} | ${r.status} | ${j.key} | ${j.bad.join('+')}`;
      if (!cells.has(k)) cells.set(k, []); cells.get(k).push(`${o.seed}(${o.forces.join('+') || '-'})`);
    }
  }
  console.log('rows', rows, '| contradicted', badRows, 'in', births.size, 'births | band alone', alone, '| cells', cells.size);
  for (const [k, v] of [...cells].sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(4), k, '| e.g.', v.slice(0, 3).join(', '));
}
