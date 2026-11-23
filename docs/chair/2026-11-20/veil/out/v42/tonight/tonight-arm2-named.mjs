// R4I-TONIGHT-2 item C.4 (c): the NAMED lists of tonight-arm2.probe.jsx's shards, on the nothing-hidden places.
//   node tonight-arm2-named.mjs <outdir> [title]
// Each cast person once per (place, person, role), with the reads (twin|server x gallery|link x off|dm) that class them:
// ROLE MOVED (red: a role line on both, the line differs), GOAL WITHHELD (not red: the owner's card carries a goal the read
// withholds), OTHER MOVED (any other line that differs).
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2]; const title = process.argv[3] || dir;
const births = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births).filter((b) => !b.hidden);
const lists = { roleMoved: new Map(), goalWithheld: new Map(), otherMoved: new Map() };
for (const b of births) for (const [tag, x] of Object.entries(b.reads)) for (const [k, side] of [['ownerTwin', 'twin'], ['ownerServer', 'server']]) {
  if (!x[k]) continue;
  for (const cls of Object.keys(lists)) for (const m of x[k][cls]) {
    const key = `${b.seed}|${m.name}|${m.role}`;
    const e = lists[cls].get(key) || { seed: b.seed, name: m.name, role: m.role, kind: m.kind, owner: m.owner, served: new Set(), reads: [] };
    e.served.add(m.served); e.reads.push(`${side}|${tag}`); lists[cls].set(key, e);
  }
}
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
console.log(`# ${title}: the owner's half (c), NAMED (nothing-hidden places: ${births.length})\n`);
for (const [cls, label] of [['roleMoved', 'ROLE MOVED (RED)'], ['goalWithheld', 'GOAL WITHHELD BY THE READ (counted, named, NOT red)'], ['otherMoved', 'OTHER LINE MOVED (named)']]) {
  const rows = [...lists[cls].values()];
  console.log(`## ${label}: ${rows.length} cast persons in ${new Set(rows.map((r) => r.seed)).size} places\n`);
  if (!rows.length) { console.log('(none)\n'); continue; }
  console.log('| place | person | role (crisis) | the owner\'s line | the served line(s) | reads |\n|---|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${esc(r.seed)} | ${esc(r.name)} | ${esc(r.role)}${r.kind ? ` (${esc(r.kind)})` : ''} | ${esc(r.owner)} | ${esc([...r.served].join(' / '))} | ${r.reads.length}: ${esc([...new Set(r.reads)].join(', '))} |`);
  console.log('');
}
