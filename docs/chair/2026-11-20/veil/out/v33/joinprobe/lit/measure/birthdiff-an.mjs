// V33-JOINPROBE PASS 2: the table of birthdiff.probe.jsx's shards: what the lit laws move in the pool's births, by size and part.
//   node birthdiff-an.mjs <outdir>   (exit 2 on a missing shard)
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const files = readdirSync(O).filter((f) => /^birthdiff-shard\d+\.json$/.test(f)).sort();
if (files.length !== 4) { console.log(`MISSING SHARDS: ${files.length} of 4`); process.exit(2); }
const rows = files.flatMap((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')).rows);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SIZES = ['village', 'town', 'city', 'metropolis'];
console.log(`births ${rows.length} (each born LIT and DARK on this tree); law stamps lit ${JSON.stringify([...new Set(rows.map((r) => JSON.stringify(r.lit.law)))])}, dark ${JSON.stringify([...new Set(rows.map((r) => JSON.stringify(r.dark.law)))])}`);
console.log('\npart size        births | powers moved (names,power,category,governing) | holder moved | contest moved | score moved | label moved | breakdown moved | merits>0 lit (dark) | rung moved | prosperity moved | hideable houses moved');
for (const part of ['A', 'B']) for (const size of SIZES) {
  const r = rows.filter((x) => x.part === part && x.size === size); if (!r.length) continue;
  const c = (fn) => r.filter(fn).length;
  const line = [r.length, c((x) => !eq(x.lit.powers, x.dark.powers)), c((x) => x.lit.holder !== x.dark.holder), c((x) => !eq(x.lit.contest, x.dark.contest)),
    c((x) => x.lit.standing.score !== x.dark.standing.score), c((x) => x.lit.standing.label !== x.dark.standing.label), c((x) => !eq(x.lit.standing.breakdown, x.dark.standing.breakdown)),
    `${c((x) => (x.lit.merits ?? 0) > 0)} (${c((x) => (x.dark.merits ?? 0) > 0)})`, c((x) => x.lit.rung !== x.dark.rung), c((x) => !eq(x.lit.prosperity, x.dark.prosperity)), c((x) => !eq(x.lit.held, x.dark.held))];
  console.log(`${part}    ${size.padEnd(10)} ${line.join(' | ')}`);
}
// the holder's rule, and the labels, by size (lit vs dark)
const tally = (arr) => arr.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
console.log('\nthe holder\'s rule (holderOf, owner), lit vs dark, by size:');
for (const size of SIZES) { const r = rows.filter((x) => x.size === size); console.log(`  ${size.padEnd(10)} lit ${JSON.stringify(tally(r.map((x) => x.lit.holder.split('|')[0])))}  dark ${JSON.stringify(tally(r.map((x) => x.dark.holder.split('|')[0])))}`); }
console.log('\nthe standing\'s label, lit vs dark, by size:');
for (const size of SIZES) { const r = rows.filter((x) => x.size === size); console.log(`  ${size.padEnd(10)} lit ${JSON.stringify(tally(r.map((x) => x.lit.standing.label)))}  dark ${JSON.stringify(tally(r.map((x) => x.dark.standing.label)))}`); }
console.log('\nbreakdown.merits (points), lit, by size: ');
for (const size of SIZES) { const r = rows.filter((x) => x.size === size); console.log(`  ${size.padEnd(10)} ${JSON.stringify(tally(r.map((x) => String(x.lit.merits))))}`); }
console.log('\nthe capture rung, lit vs dark, by size:');
for (const size of SIZES) { const r = rows.filter((x) => x.size === size); console.log(`  ${size.padEnd(10)} lit ${JSON.stringify(tally(r.map((x) => String(x.lit.rung))))}  dark ${JSON.stringify(tally(r.map((x) => String(x.dark.rung))))}`); }
// which law moves what: each field moved (against dark) by the seat law alone, the fortune law alone, and both together
console.log('\nwhich law moves it (births where the field differs from DARK): seat alone | fortune alone | both lit');
const F = { powers: (r) => r.powers, holder: (r) => r.holder, contest: (r) => r.contest, score: (r) => r.standing.score, label: (r) => r.standing.label, breakdown: (r) => r.standing.breakdown, merits: (r) => r.merits, rung: (r) => r.rung, prosperity: (r) => r.prosperity, held: (r) => r.held };
for (const size of SIZES) {
  const r = rows.filter((x) => x.size === size);
  console.log(`  ${size.padEnd(10)} ${Object.entries(F).map(([k, f]) => `${k} ${r.filter((x) => !eq(f(x.seatOnly), f(x.dark))).length}|${r.filter((x) => !eq(f(x.fortuneOnly), f(x.dark))).length}|${r.filter((x) => !eq(f(x.lit), f(x.dark))).length}`).join('  ')}`);
}
const ex = rows.filter((x) => !eq(x.lit.powers, x.dark.powers)).slice(0, 3);
for (const x of ex) console.log(`\nexample powers moved ${x.seed}:\n  dark ${x.dark.powers.join('; ')}\n  lit  ${x.lit.powers.join('; ')}`);
const hx = rows.filter((x) => !eq(x.lit.held, x.dark.held)).slice(0, 5);
for (const x of hx) console.log(`example houses moved ${x.seed}: dark [${x.dark.held.join(', ')}] lit [${x.lit.held.join(', ')}]`);
console.log(`\nBIRTHDIFF ${rows.length} births: powers moved ${rows.filter((x) => !eq(x.lit.powers, x.dark.powers)).length}, holder ${rows.filter((x) => x.lit.holder !== x.dark.holder).length}, contest ${rows.filter((x) => !eq(x.lit.contest, x.dark.contest)).length}, score ${rows.filter((x) => x.lit.standing.score !== x.dark.standing.score).length}, merits>0 ${rows.filter((x) => (x.lit.merits ?? 0) > 0).length}, hideable houses ${rows.filter((x) => !eq(x.lit.held, x.dark.held)).length}`);
