// R4I-TONIGHT item C: the owner's page, before the cure vs cured.  node owner-moves.mjs <before dir> <after dir> [label]
// Each dir holds owner-shard*.json of owner-sheet.probe.jsx. Prints every cast person whose line moved (place, person, role,
// the line before and after) and every other byte of the sheet that moved (it must be none but the want and its sameAs).
import { readFileSync, readdirSync } from 'node:fs';
const load = (dir) => new Map(readdirSync(dir).filter((f) => /^owner-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births).map((b) => [b.seed, b]));
const [A, B] = [load(process.argv[2]), load(process.argv[3])];
const label = process.argv[4] || '';
const moves = []; const other = []; let places = 0; let persons = 0;
for (const [seed, a] of A) {
  const b = B.get(seed); if (!b) { other.push(`${seed}: not in the cured dump`); continue; }
  places += 1; persons += a.people.length;
  if (a.people.length !== b.people.length || a.crisis !== b.crisis) other.push(`${seed}: the people or the crisis line moved`);
  a.people.forEach((p, i) => {
    const q = b.people[i] || {};
    const { line: l1, sameAs: s1, ...rest1 } = p; const { line: l2, sameAs: s2, ...rest2 } = q;
    if (JSON.stringify(rest1) !== JSON.stringify(rest2)) other.push(`${seed}: person ${i} moved beside the line: ${JSON.stringify(rest1)} | ${JSON.stringify(rest2)}`);
    if (l1 !== l2 || s1 !== s2) moves.push({ seed, name: p.name, castLabel: p.castLabel || p.why, castKind: p.castKind || '', before: s1 ? `Wants the same as ${s1}.` : l1, after: s2 ? `Wants the same as ${s2}.` : l2, cast: p.why === 'cast' });
  });
}
console.log(`${label} places ${places} | people on the owner's sheets ${persons} | lines moved ${moves.length} (of them cast-voiced ${moves.filter((m) => m.cast).length}) in ${new Set(moves.map((m) => m.seed)).size} places | other bytes moved ${other.length}`);
for (const m of moves) console.log(`| ${m.seed} | ${m.name} | ${m.castLabel}${m.castKind ? ` (${m.castKind})` : ''} | ${m.before} | ${m.after} |`);
for (const o of other.slice(0, 20)) console.log('OTHER', o);
