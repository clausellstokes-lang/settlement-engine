// group the differ's class paths (one veil) by kind: NUMBER/BOOLEAN (a derived value), CRIME-WORDED text or label (its A or
// B value speaks of crime), HISTORY RE-DRAW (the timeline drawn again: the rng stream moved, an inference only with the
// seed, which never ships), OTHER text or label. Prints counts and every path with its example.
import { readFileSync } from 'node:fs';
const [vk, ...files] = process.argv.slice(2);
const rows = {}; for (const f of files) { const x = JSON.parse(readFileSync(f, 'utf8')); for (const r of x.rows) { const a = rows[r.path] = rows[r.path] || { B: 0, C: 0, ex: null }; a.B += r.B[vk] || 0; a.C += r.C[vk] || 0; a.ex = a.ex || r.ex[`B ${vk}`]; } }
const CRIME = /crim|crime|thie|smuggl|black.?market|underworld|gang|contraband|fence|racket|shadow|illicit|brib|extort|vice|licen[cs]e or a duty|rookery|alleys/i;
const HIST = /^history\.(historicalEvents|eventsTimeline|legacyAnnotations|historicalCharacter|founding)|general:history\.legacyLines/;
const groups = {};
for (const [p, a] of Object.entries(rows)) { if (a.B < 2 || a.C * 3 > a.B) continue;
  const m = String(a.ex).match(/: A=(.*) \| B=(.*)$/); const A = m ? m[1] : ''; const B = m ? m[2] : '';
  const g = /^-?[0-9.]+$|^true$|^false$|^null$/.test(A.trim()) || /^-?[0-9.]+$|^true$|^false$/.test(B.trim()) ? 'NUMBER/BOOLEAN' : HIST.test(p) ? 'HISTORY RE-DRAW' : (CRIME.test(A) || CRIME.test(B) || CRIME.test(p)) ? 'CRIME-WORDED' : 'OTHER text/label';
  (groups[g] = groups[g] || []).push({ p, ...a }); }
for (const [g, list] of Object.entries(groups)) { list.sort((x, y) => y.B - x.B); console.log(`\n### ${g}: ${list.length} paths`); for (const r of list) console.log(`B ${r.B} | C ${r.C} | ${r.p}\n      ${String(r.ex).slice(0, 300)}`); }
