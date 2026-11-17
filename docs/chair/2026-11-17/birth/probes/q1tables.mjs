// BIRTH-AUDIT Q1 tables: reads q1census.mjs's output and prints the tables of the hand-back (markdown).
//   node docs/chair/2026-11-17/birth/probes/q1tables.mjs <q1.json> [<pop>...]
import fs from 'node:fs';
const [file, ...popsArg] = process.argv.slice(2);
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const pops = popsArg.length ? popsArg : Object.keys(d.towns);
const calmConn = (r) => r.crises.length === 0 && r.route === 'connected';
const born = (r) => r.cause.startsWith('BORN');
const uniq = (xs) => new Set(xs).size;
for (const pop of pops) {
  const R = d.rows.filter((r) => r.pop === pop);
  const t = d.towns[pop];
  console.log(`\n#### Population ${pop} (${t.towns} towns)\n`);
  console.log(`towns with a marked house ${t.withAnyMark}; with a born-short house ${t.withBornShort}; calm (no crisis) on a connected road ${t.calmConnected}, of them with a born-short house **${t.calmConnectedWithBornShort}**; the chair's count (a gap of kind missing) ${t.chairsCount_gapMissing}.\n`);
  const byCause = {}; for (const r of R) byCause[r.cause] = (byCause[r.cause] || 0) + 1;
  console.log('| cause | houses marked | towns |\n|---|---|---|');
  for (const [k, v] of Object.entries(byCause).sort((a, b) => b[1] - a[1])) console.log(`| ${k} | ${v} | ${uniq(R.filter((r) => r.cause === k).map((r) => r.seed))} |`);
  const byReading = {}; for (const r of R) byReading[r.reading] = (byReading[r.reading] || 0) + 1;
  console.log('\n| reading that marked it | houses | towns | of them calm + connected (towns) |\n|---|---|---|---|');
  for (const [k, v] of Object.entries(byReading).sort((a, b) => b[1] - a[1])) { const S = R.filter((r) => r.reading === k); console.log(`| ${k} | ${v} | ${uniq(S.map((r) => r.seed))} | ${uniq(S.filter(calmConn).map((r) => r.seed))} |`); }
  console.log('\n| catalogue id | short of | reading | houses (towns) | born short | made by the crisis | calm + connected | isolated | shut by a siege | tiers |\n|---|---|---|---|---|---|---|---|---|---|');
  const groups = new Map();
  for (const r of R) { const k = `${r.id}\u0000${r.good}`; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const [k, S] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
    const [id, good] = k.split('\u0000');
    const tiers = {}; for (const r of S) tiers[r.tier] = (tiers[r.tier] || 0) + 1;
    const readings = [...new Set(S.map((r) => r.reading))].join(', ');
    console.log(`| ${id || '(no id)'} | ${good} | ${readings} | ${S.length} (${uniq(S.map((r) => r.seed))}) | ${S.filter(born).length} | ${S.filter((r) => !born(r)).length} | ${S.filter((r) => born(r) && calmConn(r)).length} | ${S.filter((r) => r.route === 'isolated').length} | ${S.filter((r) => r.route === 'shut by a siege').length} | ${Object.entries(tiers).map(([a, b]) => `${a} ${b}`).join(', ')} |`);
  }
  const made = R.filter((r) => !born(r));
  if (made.length) { console.log('\nMADE BY THE CRISIS (every row):\n'); for (const r of made) console.log(`- ${r.seed} · ${r.house} (${r.id}) · short of ${r.good} · ${r.reading} · crises ${r.crises.join('+')} · ${r.route}`); }
}
