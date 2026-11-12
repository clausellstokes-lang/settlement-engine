// node f3sum.mjs <f3.jsonl> — F3's counts by corpus
import fs from 'node:fs';
const R = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const t = {}; const add = (c, k) => { t[c] ||= {}; t[c][k] = (t[c][k] || 0) + 1; };
for (const r of R) {
  const c = r.c === 'G' ? 'R' : r.c;
  if (r.succ) add(c, 'succession births');
  for (const x of r.claimants) { add(c, 'claimant powers'); if (!x.first) add(c, 'claimant with no first (the line prints)'); }
  for (const x of r.bodies) { add(c, "old families' bodies"); if (!x.first) add(c, 'body with no first'); if (!x.first && x.free.length) add(c, 'body with no first while a free landed rung stands'); }
  if (r.claimants.length && /claimants? circle/.test(r.seat || '') && r.claimants.some((x) => !x.first)) add(c, 'seat row naming a claimant with no person');
}
console.log(JSON.stringify(t, null, 1));
