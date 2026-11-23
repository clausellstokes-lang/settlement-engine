// search-an.mjs <dir>: the search's union (search.probe.jsx shards), every path with its tags, sorted by tag then path.
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const T = {}; let pages = 0;
for (const f of readdirSync(dir).filter((x) => /^shard\d+\.json$/.test(x))) {
  const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); pages += j.pages;
  for (const [p, r] of Object.entries(j.tally)) { const t = (T[p] ||= { switch: 0, house: 0, word: 0, key: 0, ex: null }); for (const k of ['switch', 'house', 'word', 'key']) t[k] += r[k]; t.ex ||= r.ex; }
}
const rows = Object.entries(T);
console.log(`pages read ${pages}; distinct normalized paths tagged ${rows.length}`);
for (const tag of ['switch', 'house', 'word', 'key']) console.log(`  ${tag}: ${rows.filter(([, r]) => r[tag]).length} paths`);
console.log('\npath | switch | house | word(leaves) | key(leaves) | an example criminal-worded value');
for (const [p, r] of rows.sort((a, b) => a[0].localeCompare(b[0]))) console.log(`${p || '(root)'} | ${r.switch} | ${r.house} | ${r.word} | ${r.key}${r.ex ? ` | ${r.ex}` : ''}`);
