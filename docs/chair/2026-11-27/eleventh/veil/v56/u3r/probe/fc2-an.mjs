// FROZEN-COVERT MEASURE: the table of one fc.sh run (one set x one template). `node fc-an.mjs <outdir>`; FC_JSON=1 also
// writes <outdir>/summary.json. Exit 0 always (a measure), 1 when no document was read or a shard did not finish.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const O = process.argv[2];
const sh = readdirSync(O).filter((f) => /^fc-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const L = (...a) => console.log(a.join(' '));
const reads = sh.flatMap((s) => s.reads);
const docs = sh.reduce((a, s) => a + s.docs, 0);
L(`set ${sh[0]?.set} tpl ${sh[0]?.tpl}; documents ${docs}; all done ${sh.every((s) => s.done)}; faults ${sh.reduce((a, s) => a + s.faults.length, 0)}`);
for (const s of sh) for (const f of s.faults.slice(0, 5)) L('  FAULT', f);
const COPIES = ['M', 'T', 'live']; const DOORS = ['gallery', 'import', 'map', 'link'];
const sum = { docs, covertTowns: new Set(reads.filter((r) => r.covertTown).map((r) => r.seed)).size, red: {}, rule: {}, examples: {} };
L(`towns whose raw record holds a covert tie: ${sum.covertTowns}; of them, raw prominentRelationship tells one: ${new Set(reads.filter((r) => r.covertTown && r.rawPRtells).map((r) => r.seed)).size}, raw pressureSentence tells one: ${new Set(reads.filter((r) => r.covertTown && r.rawPStells).map((r) => r.seed)).size}`);
L('RED (covert towns only, Reveal off): copy | door | towns | no body | served PR tells | served PS tells | (cross-check: = raw telling PR | = raw telling PS)');
for (const c of COPIES) for (const d of DOORS) {
  const rs = reads.filter((r) => r.covertTown && r.copy === c && r.door === d);
  const v = { towns: rs.length, noBody: rs.filter((r) => !r.body).length, prTells: rs.filter((r) => r.prTells).length, psTells: rs.filter((r) => r.psTells).length,
    prEq: rs.filter((r) => r.prEqRawTell).length, psEq: rs.filter((r) => r.psEqRawTell).length,
    places: [...new Set(rs.filter((r) => r.prTells || r.psTells).map((r) => r.seed))].slice(0, 6) };
  sum.red[`${c}|${d}`] = v;
  L(`  ${c} | ${d} | ${v.towns} | ${v.noBody} | ${v.prTells} | ${v.psTells} | (${v.prEq} | ${v.psEq})${v.places.length ? `  e.g. ${v.places.join(', ')}` : ''}`);
}
L('THE RULE (every town, Reveal off): copy | door | reads | PR served | PS served | LEAKS LEFT PR | PS | clean withheld PR a/b/c/d | PS a/b/c/d | telling withheld PR | PS');
const ex = {}; const pushEx = (k, e) => { (ex[k] ||= []); if (ex[k].length < 5) ex[k].push(e); };
for (const c of COPIES) for (const d of DOORS) {
  const rs = reads.filter((r) => r.copy === c && r.door === d && r.body);
  const v = { reads: rs.length, prIn: 0, psIn: 0, leakPR: 0, leakPS: 0, cleanPR: { a: 0, b: 0, c: 0, d: 0, any: 0 }, cleanPS: { a: 0, b: 0, c: 0, d: 0, any: 0 }, tellWithheldPR: 0, tellWithheldPS: 0 };
  for (const r of rs) {
    for (const [key, inK, tells, text] of [['pr', 'prIn', 'prTells', 'prText'], ['ps', 'psIn', 'psTells', 'psText']]) {
      if (!r[inK]) continue; v[`${key}In`] += 1;
      const R = r.rule; const parts = [];
      if (R.A[key]) parts.push('a'); if (R.AB[key] && !R.A[key]) parts.push('b'); if (R.C[key]) parts.push('c'); if (R.D[key]) parts.push('d');
      const withheld = parts.length > 0; const K = key.toUpperCase();
      if (r[tells] && !withheld) { v[`leak${K}`] += 1; pushEx(`leak ${K}`, { seed: r.seed, copy: c, door: d, s: r[text] }); }
      if (r[tells] && withheld) v[`tellWithheld${K}`] += 1;
      if (!r[tells] && withheld) {
        v[`clean${K}`].any += 1;
        for (const p of parts) { v[`clean${K}`][p] += 1; pushEx(`clean ${K} (${p})`, { seed: r.seed, copy: c, door: d, srcRel: r.srcRel, s: r[text] }); }
      }
    }
  }
  sum.rule[`${c}|${d}`] = v;
  const P = (o) => `${o.a}/${o.b}/${o.c}/${o.d} (any ${o.any})`;
  L(`  ${c} | ${d} | ${v.reads} | ${v.prIn} | ${v.psIn} | ${v.leakPR} | ${v.leakPS} | ${P(v.cleanPR)} | ${P(v.cleanPS)} | ${v.tellWithheldPR} | ${v.tellWithheldPS}`);
}
sum.examples = ex;
for (const [k, es] of Object.entries(ex)) { L(`  EXAMPLES ${k}:`); for (const e of es) L(`    ${JSON.stringify(e)}`); }
// U3R (A2): THE SENTENCE BY ITS WRITER (genRelNarrative driven per tie); every town, every copy and door, Reveal off
{
  const towns = new Map(); for (const r of reads) if (r.w) towns.set(r.seed, r.w);
  const W = [...towns.values()];
  L(`A2 WRITER: towns ${towns.size}; stored sentence is a tie's phrasing: ${W.filter((w) => w.psIsTie).length}; a COVERT tie's: ${W.filter((w) => w.psIsCovertTie).length}; of those the name test misses: ${W.filter((w) => w.nameTestMiss).length}; a sentence two ties could have written: ${W.filter((w) => w.nTies > 1).length}`);
  L(`  covert-phrasing towns: ${[...towns].filter(([, w]) => w.psIsCovertTie).map(([k]) => k).join(', ') || 'none'}`);
  L('A2 SERVED (a LEAK is a served sentence that is a covert tie\'s phrasing): copy | door | reads with a body | PS served | served covert phrasing (LEAK)');
  for (const c of COPIES) for (const d of DOORS) {
    const rs = reads.filter((r) => r.copy === c && r.door === d && r.body);
    const lk = rs.filter((r) => r.psWriterCovert);
    sum[`a2|${c}|${d}`] = lk.length;
    L(`  ${c} | ${d} | ${rs.length} | ${rs.filter((r) => r.psIn).length} | ${lk.length}${lk.length ? `  LEAK ${lk.slice(0, 5).map((r) => r.seed).join(', ')}` : ''}`);
  }
  const dr = reads.find((r) => r.drift)?.drift; if (dr) L(`A3 DRIFT: ${dr} (the copies frozen from the record as born; the live row changed after)`);
}
if (process.env.FC_JSON === '1') writeFileSync(`${O}/summary.json`, JSON.stringify(sum, null, 1));
if (!docs || !sh.every((s) => s.done)) process.exitCode = 1;
