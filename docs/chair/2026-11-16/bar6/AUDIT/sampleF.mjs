/**
 * BAR6-AUDIT seat F: the precision draw. Twenty instances of each LAW 10 rule, drawn at random (seeded) from a runF
 * output, each printed with its line, what it is read against and the reason, for a judge to read as the second check
 * reads (STANDS, WEAK, EXPLAINED). A rule with twenty or fewer instances is printed whole.
 *   node docs/chair/2026-11-16/bar6/AUDIT/sampleF.mjs <runF-out.json> <seed> <out.md>
 */
import fs from 'node:fs';
const [, , inFile, seedArg, outFile] = process.argv;
if (!inFile || !outFile) { console.error('usage: node sampleF.mjs <runF-out.json> <seed> <out.md>'); process.exit(2); }
const { instances } = JSON.parse(fs.readFileSync(inFile, 'utf8'));
let st = (Number(seedArg) >>> 0) || 1; const rnd = () => { st = (st * 1664525 + 1013904223) >>> 0; return st / 2 ** 32; };
const by = {}; for (const x of instances) (by[x.rule] ||= []).push(x);
const out = [`# LAW 10 precision draw · ${inFile.split('/').pop()} · seed ${seedArg}`, ''];
for (const [rule, xs] of Object.entries(by).sort()) {
  const pool = xs.slice(); const pick = [];
  while (pick.length < 20 && pool.length) pick.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  out.push(`## ${rule} · ${pick.length} of ${xs.length}`, '');
  pick.forEach((x, k) => out.push(`${k + 1}. \`${x.town}\` · ${x.tab || 'record'}`, `   - LINE: ${x.line.slice(0, 400)}`, `   - AGAINST: ${JSON.stringify(x.against).slice(0, 400)}`, `   - WHY: ${x.why}`, `   - VERDICT: `));
  out.push('');
}
fs.writeFileSync(outFile, out.join('\n'));
console.log(`wrote ${outFile}: ${Object.keys(by).length} rules`);
