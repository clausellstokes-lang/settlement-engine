// node food-moved.mjs <foodA.jsonl> <foodB.jsonl> <pagesMoved.tsv> : seeds whose derived Daily Life slots differ, by slot,
// and their agreement with the battery's moved pages.
import { readFileSync } from 'node:fs';
const rd = (f) => Object.fromEntries(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [a, b] = [rd(process.argv[2]), rd(process.argv[3])];
const pages = new Set(readFileSync(process.argv[4], 'utf8').trim().split('\n').filter(Boolean).map((l) => l.split('\t')[0]));
const slots = ['food_culture', 'commoner_resentments', 'outsider_impressions', 'dawn_work'];
const by = {}; const moved = new Set();
for (const s of Object.keys(a)) { const d = slots.filter((k) => a[s][k] !== b[s][k]); if (d.length) { moved.add(s); for (const k of d) by[k] = (by[k] || 0) + 1; } }
const onlyPage = [...pages].filter((s) => !moved.has(s)); const onlyFood = [...moved].filter((s) => !pages.has(s));
console.log(`slots moved in ${moved.size} births ${JSON.stringify(by)}; battery pages moved ${pages.size}; page-only ${onlyPage.length} [${onlyPage.join(' ')}]; slot-only ${onlyFood.length} [${onlyFood.join(' ')}]`);
