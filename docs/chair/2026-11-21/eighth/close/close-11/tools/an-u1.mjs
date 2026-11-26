// an-u1.mjs <a.jsonl> <b.jsonl>: per corpus (V / soak / DP), desert city+metro by route: furrier held in a and b, records moved
import { readFileSync } from 'node:fs';
const rd = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((o) => [o.seed, o]));
const A = rd(process.argv[2]), B = rd(process.argv[3]);
const corp = (s) => (s.startsWith('soak:') ? 'soak' : s.startsWith('dpp-') ? 'DP' : 'V');
const t = {}; const lose = []; const movedNonDesert = [];
for (const [seed, a] of A) {
  const b = B.get(seed); const c = corp(seed);
  const moved = a.recordHash !== b.recordHash;
  if (!a.desert) { if (moved) movedNonDesert.push(seed); continue; }
  const k = `${c} ${a.route}${a.hg ? '+hg' : ''}`;
  const r = (t[k] ||= { n: 0, ent: 0, heldA: 0, heldB: 0, moved: 0 });
  r.n++; if (a.ent) r.ent++; if (a.furrier.length) r.heldA++; if (b.furrier.length) r.heldB++; if (moved) r.moved++;
  if (a.furrier.length && !b.furrier.length) lose.push(`${seed} ${a.route} ent=${a.ent}`);
}
console.log(JSON.stringify(t, null, 0).replace(/},/g, '},\n'));
console.log('lose', lose.length, lose.slice(0, 12).join(' | '));
console.log('moved non-desert', movedNonDesert.length);
