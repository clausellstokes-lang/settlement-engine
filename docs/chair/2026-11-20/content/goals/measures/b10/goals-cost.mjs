// GOALS-4 builder 10 (2026-11-20), a scratch tool kept as the receipt of its output beside it.
// usage: node cost.mjs <base.json> <build.json> <lines380.json>
import fs from 'node:fs';
const [, , A, B, J] = process.argv;
const a = JSON.parse(fs.readFileSync(A, 'utf8')), b = JSON.parse(fs.readFileSync(B, 'utf8'));
const appended = new Set(JSON.parse(fs.readFileSync(J, 'utf8')).map((c) => `${c.family}.${c.sub}.${c.vantage}`));
let goals = 0, changed = 0, inAppended = 0, noNew = 0, intentMoved = 0, rosterOff = 0; const bySize = {}; const noNewCells = {}; const famKindChange = { same: 0, diff: 0 };
const braces = [];
for (const [seed, cards] of Object.entries(a)) {
  const nb = b[seed]; const size = seed.split('-')[1];
  if (!nb || nb.length !== cards.length || nb.some((c, k) => c.id !== cards[k].id)) { rosterOff += 1; continue; }
  cards.forEach((c, k) => { const d = nb[k];
    for (const [v, ik] of [['short', 'is'], ['long', 'il']]) {
      if (c[v] != null || d[v] != null) goals += 1;
      if (d[v] && /[{}]/.test(d[v])) braces.push(`${seed} ${d.id}.${v}: ${d[v]}`);
      if (c[v] === d[v]) continue;
      changed += 1; (bySize[size] ||= 0); bySize[size] += 1;
      const cellA = c[ik] && `${c[ik]}.${v}`, cellB = d[ik] && `${d[ik]}.${v}`;
      if (c[ik] === d[ik]) famKindChange.same += 1; else famKindChange.diff += 1;
      if (appended.has(cellA) || appended.has(cellB)) inAppended += 1;
      else { noNew += 1; const key = `${cellA} -> ${cellB}`; noNewCells[key] = (noNewCells[key] || 0) + 1; }
    }
    if (c.intent !== d.intent) intentMoved += 1;
  });
}
console.log(`towns ${Object.keys(a).length}, rosters differing ${rosterOff}; goals (card x vantage holding text) ${goals}`);
console.log(`goals changing text base -> build: ${changed} (by size ${JSON.stringify(bySize)})`);
console.log(`  in an appended cell (at base or build): ${inAppended}; in cells with no new line at both trees (the held-text knock-on): ${noNew}`);
console.log(`  family.kind the same ${famKindChange.same}, changed ${famKindChange.diff}; cards whose intent JSON moved ${intentMoved}`);
console.log('no-new-line movers by cell (base -> build):'); for (const [k, n] of Object.entries(noNewCells).sort((x, y) => y[1] - x[1])) console.log(`  ${n}  ${k}`);
console.log(`goal texts with a brace at the build: ${braces.length}`); braces.slice(0, 10).forEach((x) => console.log('  ' + x));
