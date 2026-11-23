// R4I-PAGE-4, the chair's ruling (e)(i): the stored person ids that themselves have the fresh shape, over a stored set
// (dump.sh's `<seed>.json`). node fresh-shaped-count.mjs <tree> <stored dir>...  0 wanted.
import { readdirSync, readFileSync } from 'node:fs';
const [tree, ...dirs] = process.argv.slice(2);
const B = await import(`${tree}/tests/security/personIdBijection.shared.mjs`);
let bad = 0;
for (const d of dirs) {
  const files = readdirSync(d).filter((f) => f.endsWith('.json') && !/^index-shard/.test(f));
  let docs = 0; let ids = 0; const hits = [];
  for (const f of files) {
    const doc = JSON.parse(readFileSync(`${d}/${f}`, 'utf8')); docs += 1;
    const x = B.freshShapedStoredIds(doc); ids += x.length; if (x.length) hits.push(`${f}: ${x.slice(0, 3).join(', ')}`);
  }
  bad += ids;
  console.log(`${d}: ${docs} stored documents, ${ids} stored person ids of the fresh shape${hits.length ? `: ${hits.slice(0, 5).join('; ')}` : ''}`);
}
process.exit(bad ? 1 : 0);
