// CENSUS-2 sampler: N hits of a pattern (and optional sub), spread across seeds by a fixed stride, printed with the
// fact the reader needs (roster, crisis, tier). node sample.mjs <hits.json> <corpus.gz> <pattern[:sub]> <n> [offset] [excludeSeedsRegex]
import fs from 'node:fs'; import { loadCorpus } from './load.mjs'; import { crisisOf } from './patterns.mjs';
const [hf, cf, ps, n, off = '0', exr] = process.argv.slice(2); const [p, sub] = ps.split(':').length > 1 ? [ps.split(':')[0], ps.split(':').slice(1).join(':')] : [ps, null];
let H = JSON.parse(fs.readFileSync(hf, 'utf8')).filter((h) => h.pattern === p && (!sub || h.sub === sub) && (!exr || !new RegExp(exr).test(h.seed)));
const seen = new Set(); H = H.filter((h) => { const k = h.norm; if (seen.has(k)) return false; seen.add(k); return true; }); // one per distinct line
const C = Object.fromEntries(loadCorpus(cf).map((x) => [x.seed, x.s]));
const step = Math.max(1, Math.floor(H.length / +n)); const out = [];
for (let i = +off; i < H.length && out.length < +n; i += step) out.push(H[i]);
console.log(`${p}${sub ? ':' + sub : ''}: ${H.length} distinct lines; showing ${out.length}`);
out.forEach((h, j) => { const s = C[h.seed]; const c = crisisOf(s);
  console.log(`#${j + 1} ${h.seed} [${s.tier} ${s.population}${c.types.size ? ' ' + [...c.types].join('+') : ''}] ${h.view} <${h.sub}> ${h.why}\n   ${h.line.slice(0, 330)}` + (p === 'a' || p === 'e' ? `\n   ROSTER: ${(s.institutions || []).map((i) => i.name).join('; ').slice(0, 600)}\n   POWERS: ${(s.powerStructure?.factions || []).map((f) => f.faction || f.name).join('; ').slice(0, 200)}` : '')); });
