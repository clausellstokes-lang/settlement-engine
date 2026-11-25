// THE MIRROR: per birth, which Daily Life slots changed between food-of before and after; and where K2, K1, C7, F6 print.
// node compare.mjs <before.jsonl> <after.jsonl>
import { readFileSync } from 'node:fs';
const load = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.seed, r]));
const [B, A] = process.argv.slice(2).map(load);
const K = ['food_culture', 'commoner_resentments', 'outsider_impressions', 'dawn_work'];
const moved = []; const by = Object.fromEntries(K.map((k) => [k, 0]));
for (const [seed, b] of B) { const a = A.get(seed); const ks = K.filter((k) => b[k] !== a[k]); if (ks.length) { moved.push(`${seed} (${b.prod}|${b.printed}): ${ks.join(', ')}`); for (const k of ks) by[k]++; } }
const has = (m, k, t) => [...m.values()].filter((r) => r[k].includes(t)).map((r) => r.seed);
const T = { K2: ['food_culture', 'Every fish that comes in is counted'], K1: ['dawn_work', 'what comes in is counted before it is eaten'], C7: ['food_culture', 'The catch is too small'], F6: ['dawn_work', 'looking for anything left to gather'] };
console.log(`births ${B.size}; pages whose Daily Life moved ${moved.length}; by slot ${JSON.stringify(by)}`);
for (const m of moved) console.log('  ' + m);
for (const [id, [k, t]] of Object.entries(T)) console.log(`${id}: before ${has(B, k, t).length} [${has(B, k, t).join(' ')}] after ${has(A, k, t).length} [${has(A, k, t).join(' ')}]`);
