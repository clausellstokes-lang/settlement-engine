// gate-an.mjs <dir>: the R3 gate's table from gate.probe.jsx's four shards. Per engine and Reveal setting: HIGHER / EQUAL /
// LOWER of the hidden-house towns (served Defense key against the regenerated counterfactual's); "Magical crime" served where
// the counterfactual has none; the LOWER towns with the field whose swap alone closes the gap; THE CONTROL by crime-dial
// stratum (served key distribution of the hidden-house pool against the towns with no hideable house); THE TELL COLUMN.
// Exit 1 on any HIGHER, any magic above the counterfactual, or a probe that threw.
import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const towns = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/shard${s}.json`, 'utf8')));
const RANK = { null: 0, diffuse: 1, 'semi-organized': 2, organized: 3 };
const rank = (k) => RANK[String(k)] ?? -1;
const pct = (n, d) => (d ? `${n}/${d} (${Math.round((100 * n) / d)}%)` : '0/0');
const stratum = (d) => (typeof d !== 'number' ? 'unknown' : d < 35 ? 'low (5-34)' : d <= 65 ? 'mid (35-65)' : 'high (66-95)');
let bad = 0;
const pool = towns.filter((t) => t.reads); const ctl = towns.filter((t) => t.control);
console.log(`births ${towns.length}; with a hidden house and a counterfactual ${pool.length}; control ${ctl.length}; threw ${towns.filter((t) => t.threw || t.Bthrew).length}`);
if (towns.some((t) => t.threw || t.Bthrew)) bad = 1;
const tally = {}; const lower = {};
for (const t of pool) for (const [k, r] of Object.entries(t.reads)) {
  const v = rank(r.key) > rank(r.cf) ? 'HIGHER' : rank(r.key) < rank(r.cf) ? 'LOWER' : 'EQUAL';
  ((tally[k] ||= { HIGHER: 0, EQUAL: 0, LOWER: 0, magicAbove: 0 })[v]) += 1;
  if (r.magic && !r.cfMagic) tally[k].magicAbove += 1;
  if (v === 'LOWER') (lower[t.seed] ||= {})[k] = `${r.key} < ${r.cf} closes: ${(r.closes || []).join('+') || '(none alone)'}`;
}
console.log(`tally (engine/Reveal): ${JSON.stringify(tally)}`);
for (const k of Object.keys(tally)) if (tally[k].HIGHER || tally[k].magicAbove) bad = 1;
console.log(`\nLOWER towns (${Object.keys(lower).length}): town | crisis | dial | per read: served < counterfactual, the field whose swap alone closes it`);
for (const [s, v] of Object.entries(lower).sort()) { const t = pool.find((x) => x.seed === s); console.log(`  ${s} | ${t.crisis} | ${t.dial} | ${Object.entries(v).map(([k, x]) => `${k}: ${x}`).join(' ; ')}`); }
console.log('\nTHE CONTROL BY CRIME-DIAL STRATUM (reported, not gated): served Defense key, hidden-house pool against the control (no hideable house), and the pool\'s counterfactual');
for (const k of ['server/off', 'server/dm', 'twin/off', 'twin/dm']) for (const st of ['low (5-34)', 'mid (35-65)', 'high (66-95)', 'unknown']) {
  const P = pool.filter((t) => stratum(t.dial) === st).map((t) => t.reads[k]); const C = ctl.filter((t) => stratum(t.dial) === st).map((t) => t.control[k]);
  if (!P.length && !C.length) continue;
  const row = ['organized', 'semi-organized', 'diffuse', null].map((key) => `${key} pool ${pct(P.filter((r) => r.key === key).length, P.length)} cf ${pct(P.filter((r) => r.cf === key).length, P.length)} control ${pct(C.filter((r) => r.key === key).length, C.length)}`).join(' | ');
  console.log(`  ${k} ${st}: ${row}`);
}
console.log('\nTHE TELL COLUMN (twin; ruling 41 (2)): per town whose key reads LOWER, the served page against the regenerated house-free page under the open read, the default veil and the criminal switch OFF; "equal under" names each setting under which EVERY criminal field is equal (no tell); else the differing fields');
let told = 0; let no = 0;
for (const t of pool.filter((x) => x.tell)) for (const [dm, r] of Object.entries(t.tell)) {
  told += 1; if (!r.equalUnder.length) no += 1;
  const best = Object.entries(r.differ).sort((a, b) => a[1].length - b[1].length)[0];
  console.log(`  ${t.seed} Reveal ${dm}: ${r.equalUnder.length ? `NO TELL (equal under ${r.equalUnder.join(', ')})` : `DIFFERS under every setting; fewest under ${best[0]}: ${best[1].join(' ; ')}`}`);
  if (!r.equalUnder.length) for (const [k, v] of Object.entries(r.differ)) if (k !== best[0]) console.log(`      under ${k}: ${v.join(' ; ')}`);
}
console.log(`tell column: ${told} town-reads judged; ${no} differ under every setting`);
process.exit(bad);
