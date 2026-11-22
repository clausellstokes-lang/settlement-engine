// PAGE-12, CAUSES-PARITY-2 step B: THE OWNER-SIDE CAUSE SENTENCES THAT MOVE, before -> after (two outputs of sentences.mjs).
//   node moved.mjs <before.txt> <after.txt>
// Prints: the sentences counted on each side; the moved ones by size; each move's rows (from -> to) with its count and seeds;
// the three faults' lines of the after tree.
import { readFileSync } from 'node:fs';
const [, , A, B] = process.argv;
const read = (f) => {
  const S = new Map(); const F = [];
  for (const l of readFileSync(f, 'utf8').split('\n')) {
    const m = /^S (\S+) (\S+) (\S+) (.*)$/.exec(l);
    if (m) S.set(`${m[1]} ${m[2]}`, { row: m[3], s: m[4] });
    else if (l.startsWith('FAULT ')) F.push(l);
  }
  return { S, F };
};
const a = read(A); const b = read(B);
console.log(`sentences: before ${a.S.size}, after ${b.S.size}; keys equal ${[...a.S.keys()].every((k) => b.S.has(k)) && a.S.size === b.S.size}`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const bySize = Object.fromEntries(SIZES.map((s) => [s, 0])); const moves = new Map(); let n = 0;
for (const [k, x] of a.S) {
  const y = b.S.get(k);
  if (!y || y.s === x.s) continue;
  n++;
  const size = k.split('-')[1]; bySize[size]++;
  const mv = `${k.split(' ')[1]}: ${x.row} -> ${y.row}`;
  const e = moves.get(mv) || []; e.push(k.split(' ')[0]); moves.set(mv, e);
}
console.log(`MOVED ${n} owner-side sentences; by size: ${SIZES.map((s) => `${s} ${bySize[s]}`).join(' ')}`);
for (const [mv, seeds] of [...moves].sort((p, q) => q[1].length - p[1].length)) console.log(`MOVE ${mv} ×${seeds.length}: ${seeds.join(' ')}`);
for (const l of b.F) console.log(`AFTER ${l}`);
for (const l of a.F) console.log(`BEFORE ${l}`);
