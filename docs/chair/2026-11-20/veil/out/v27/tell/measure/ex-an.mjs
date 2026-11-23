// ex-an.mjs <dir> [setting=own]: per family, the commonest items today's page has more (a) and the target has more (b), with
// the count of town-reads carrying each (Reveal off and on), so the cost reads in words.
import { readFileSync } from 'node:fs';
const dir = process.argv[2]; const set = process.argv[3] || 'own';
const pool = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/shard${s}.json`, 'utf8'))).filter((t) => t.reads);
const F = {};
for (const t of pool) for (const dm of ['off', 'dm']) { const r = t.reads[`${dm}|${set}`]; if (!r) continue;
  for (const [f, v] of Object.entries(r.tell)) for (const [side, xs] of [['a', v.aEx], ['b', v.bEx]]) for (const x of new Set(xs)) { const k = `${f} ${side} ${dm}`; ((F[k] ||= {})[x.slice(0, 110)] = ((F[k] || {})[x.slice(0, 110)] || 0) + 1); } }
for (const k of Object.keys(F).sort()) { const top = Object.entries(F[k]).sort((a, b) => b[1] - a[1]).slice(0, 5); console.log(`${k}: ${top.map(([x, c]) => `${c}x ${x}`).join(' ;; ')}`); }
