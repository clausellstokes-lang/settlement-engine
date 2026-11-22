// V33-JOINPROBE PASS 2: how many pool births show a signature part's value, by size and part (dark pool against lit pool).
//   node pool-part.mjs <dark pooldir> <lit pooldir> <setting e.g. off|own> <family.key e.g. r.powers.relations> [<k.powers.key>...]
import { readFileSync, readdirSync } from 'node:fs';
const [A, B, setting, ...parts] = process.argv.slice(2);
const load = (dir, re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const get = (o, p) => { const [fam, ...rest] = p.split('.'); const key = rest.join('.'); const v = o[fam]; if (!v) return 'a'; if (fam === 'k') { const [row, kk] = key.split('.'); return v[row]?.[kk] ?? 'a'; } return v[key] ?? 'a'; };
for (const [part, re] of [['A', /^pool-shard\d+\.json$/], ['B', /^poolb-shard\d+\.json$/]]) for (const p of parts) {
  const count = (dir) => { const t = {}; for (const s of load(dir, re)) for (const b of s.births) { const ix = b.sigs[setting]; if (ix === undefined) continue; const v = get(JSON.parse(s.sigs[ix]), p); const k = `${b.size}:${JSON.stringify(v)}`; t[k] = (t[k] || 0) + 1; } return t; };
  console.log(`PART ${part} ${setting} ${p}: dark ${JSON.stringify(count(A))}\n${' '.repeat(10 + setting.length + p.length)}lit  ${JSON.stringify(count(B))}`);
}
