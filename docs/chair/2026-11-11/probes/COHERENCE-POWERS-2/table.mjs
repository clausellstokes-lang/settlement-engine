import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const groupOf = (r) => r.part === 'rand' ? (['thorp', 'hamlet'].includes(r.tier) ? 'rand:thorp+hamlet' : 'rand:4tiers') : r.part;
const groups = [...new Set(rows.map(groupOf))];
const inc = (o, k, d = 1) => { o[k] = (o[k] || 0) + d; };
const T = {};
for (const g of groups) T[g] = { births: 0, guard: {}, faceless: {}, houseless: {}, capture: {}, seeds: {} };
for (const r of rows) {
  const t = T[groupOf(r)];
  t.births++;
  for (const x of r.g) { inc(t.guard, `${x}`); (t.seeds[x] ||= []).push(`${r.seed}:${r.ruler}`); }
  for (const f of r.faceless) { inc(t.faceless, f.cause); (t.seeds['faceless:' + f.cause] ||= []).push(r.seed); }
  for (const f of r.houseless) inc(t.houseless, f.cause);
  inc(t.capture, r.capture);
}
for (const g of groups) {
  const t = T[g];
  console.log(`\n== ${g} (${t.births})`);
  console.log(' guard', JSON.stringify(t.guard));
  console.log(' faceless', JSON.stringify(t.faceless));
  console.log(' houseless contenders', JSON.stringify(t.houseless));
  console.log(' capture', JSON.stringify(t.capture));
  if (process.argv[3]) for (const [k, v] of Object.entries(t.seeds)) console.log('  ', k, v.slice(0, 8).join(' '));
}
