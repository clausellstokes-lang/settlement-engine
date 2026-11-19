import fs from 'node:fs';
const rd = (f) => Object.fromEntries(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b] = [rd(process.argv[2]), rd(process.argv[3])];
let recMoved = 0; const leafMoves = {}; const blockMoves = {};
for (const s of Object.keys(a)) { if (!b[s]) { console.log('missing', s); continue; }
  if (a[s].rec !== b[s].rec) recMoved++;
  for (const k of new Set([...Object.keys(a[s].leaves), ...Object.keys(b[s].leaves)])) if (a[s].leaves[k] !== b[s].leaves[k]) leafMoves[k] = (leafMoves[k] || 0) + 1;
  for (const k of new Set([...Object.keys(a[s].blocks), ...Object.keys(b[s].blocks)])) if (a[s].blocks[k] !== b[s].blocks[k]) (blockMoves[k] ||= []).push(s);
}
console.log('births', Object.keys(a).length, 'records moved', recMoved, 'leaves', JSON.stringify(leafMoves));
for (const [k, v] of Object.entries(blockMoves)) console.log('publicProse', k, v.length, process.argv[4] ? v.join(' ') : v.slice(0, 5).join(' '));
