import { readFileSync } from 'node:fs';
const [,, base, tree] = process.argv;
const rd = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((o) => [o.seed, o]));
const B = rd(base), T = rd(tree);
let moved = [], deserts = 0, standNoReach = [], reachDiff = [], expectedMove = [], unexplained = [];
for (const [seed, b] of B) {
  const t = T.get(seed);
  if (b.recordHash !== t.recordHash) moved.push(seed);
  if (!t.desert) { if (b.recordHash !== t.recordHash) unexplained.push(seed + ' (not desert)'); continue; }
  deserts++;
  const reach = t.hg || t.route === 'crossroads';
  if (t.furrier.some((s) => s !== 'forced') && !reach) standNoReach.push(seed);
  if (reach && (JSON.stringify(b.furrier) !== JSON.stringify(t.furrier) || b.recordHash !== t.recordHash)) reachDiff.push(seed);
  const exp = b.furrier.length > 0 && !reach;
  if (exp) expectedMove.push(seed);
  if ((b.recordHash !== t.recordHash) !== exp) unexplained.push(seed);
}
console.log(JSON.stringify({ births: B.size, deserts, moved: moved.length, movedSeeds: moved, standingWithNoGroundsNoEntrepot: standNoReach, reachBirthsChanged: reachDiff, expectedMove: expectedMove.length, unexplained }));
