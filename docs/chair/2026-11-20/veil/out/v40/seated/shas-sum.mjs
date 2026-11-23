// VEIL-40 ruling 114: totals of tell2sha.probe.jsx's shard tables.   node shas-sum.mjs <shasdir>
// Reads <shasdir>/shas-<shard>.tsv (seed, door, setting, reveal, serverSha, twinSha): reads, equal, differ; differ by
// setting and by Reveal. Caps the kept diffs (diff-<shard>-<n>.json, up to 50 per shard) at 50 overall: the first 50 in
// (shard, n) order are kept, the rest removed (each named). EXIT 2 when no shard table is found, else 0.
import { readFileSync, readdirSync, rmSync } from 'node:fs';

const dir = process.argv[2];
if (!dir) { console.error('usage: node shas-sum.mjs <shasdir>'); process.exit(2); }
const KEEP = 50;
const tables = readdirSync(dir).filter((f) => /^shas-\d+\.tsv$/.test(f)).sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
if (!tables.length) { console.log(`NO SHARD TABLE in ${dir}`); process.exit(2); }

const tot = { reads: 0, equal: 0, differ: 0, malformed: 0 };
const by = (m, k, differ) => { const r = (m[k] ||= { reads: 0, differ: 0 }); r.reads += 1; if (differ) r.differ += 1; };
const bySetting = {}; const byReveal = {}; const byBoth = {}; const differByShard = {};
for (const f of tables) {
  const shard = Number(f.match(/\d+/)[0]); differByShard[shard] = 0;
  for (const line of readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
    if (!line) continue;
    const c = line.split('\t');
    if (c.length !== 6 || !/^[0-9a-f]{64}$/.test(c[4]) || !/^[0-9a-f]{64}$/.test(c[5])) { tot.malformed += 1; continue; }
    const [, , setting, reveal, ss, ts] = c; const differ = ss !== ts;
    tot.reads += 1; if (differ) { tot.differ += 1; differByShard[shard] += 1; } else tot.equal += 1;
    by(bySetting, setting, differ); by(byReveal, reveal, differ); by(byBoth, `${reveal}|${setting}`, differ);
  }
}
console.log(`SHARDS ${tables.length} (${tables.join(' ')})`);
console.log(`READS ${tot.reads}  EQUAL ${tot.equal}  DIFFER ${tot.differ}${tot.malformed ? `  MALFORMED ${tot.malformed}` : ''}`);
const show = (title, m) => { console.log(title); for (const k of Object.keys(m).sort()) console.log(`  ${k}\treads ${m[k].reads}\tdiffer ${m[k].differ}`); };
show('DIFFER BY REVEAL', byReveal);
show('DIFFER BY SETTING', bySetting);
show('DIFFER BY REVEAL|SETTING', byBoth);

const diffs = readdirSync(dir).map((f) => f.match(/^diff-(\d+)-(\d+)\.json$/)).filter(Boolean)
  .map((m) => ({ f: m[0], shard: Number(m[1]), n: Number(m[2]) })).sort((a, b) => a.shard - b.shard || a.n - b.n);
for (const s of Object.keys(differByShard)) {
  const kept = diffs.filter((d) => d.shard === Number(s)).length; const want = Math.min(KEEP, differByShard[s]);
  if (kept !== want) console.log(`KEPT MISMATCH shard ${s}: ${kept} diff files, ${want} expected from its table`);
}
const drop = diffs.slice(KEEP);
for (const d of drop) rmSync(`${dir}/${d.f}`);
console.log(`KEPT DIFFS ${Math.min(KEEP, diffs.length)} of ${diffs.length}${drop.length ? ` (removed ${drop.map((d) => d.f).join(' ')})` : ''}`);
