// CENSUS-2 counter: every pattern of patterns.mjs over OUT/dumps (one rendered dossier a seed) and OUT/corpus.ndjson.gz
// (the same seeds' records, born in TREE). Writes OUT/hits.json: one row a hit {pattern, sub, seed, view, line, norm,
// why}. `norm` is the line with the town's own names and every figure folded out, so one writer's line counts once.
// Prints one row a pattern: towns of the corpus, hits, distinct lines. Exits 1 when the corpus or a dump is missing
// or when no pattern counted anything (an empty census is a failed census, never a clean one).
import fs from 'node:fs';
import { loadCorpus, dump, views } from './load.mjs';
import { testA, testB, testC, rosterNames, npcRoles, crisisOf, loadCatalog } from './patterns.mjs';
import { EXTRA_TESTS } from './patterns-dh.mjs';
const R = process.env.TREE + '/src'; const OUT = process.env.OUT;
let displayName = (n) => n; try { ({ institutionDisplayName: displayName } = await import(R + '/domain/display/institutionDisplayName.js')); } catch { console.error('count2: no display leaf in this tree; raw names only'); }
const catalog = await loadCatalog(R, displayName); if (!catalog) console.error('count2: no catalogue in this tree; the house-name arm of kind a is off');
const corpus = loadCorpus(process.env.CORPUS);
if (!corpus.length) { console.error('count2: empty corpus'); process.exit(1); }
const ONLY = process.env.CENSUS_PATTERNS ? new Set(process.env.CENSUS_PATTERNS.split(',')) : null;
const TESTS = [['a', testA], ['b', testB], ['c', testC], ...EXTRA_TESTS].filter(([k]) => !ONLY || ONLY.has(k));
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function folder(s) {
  const ns = [s.name, ...(s.npcs || []).map((n) => n.name), ...(s.npcs || []).flatMap((n) => String(n.name || '').split(' ')),
    ...(s.powerStructure?.factions || []).map((f) => f.faction || f.name)].filter((x) => x && String(x).length > 2).map(String);
  const uniq = [...new Set(ns)].sort((a, b) => b.length - a.length);
  const re = uniq.length ? new RegExp(uniq.map(esc).join('|'), 'g') : null;
  return (line) => (re ? line.replace(re, '{N}') : line).replace(/\b(?:thorp|hamlet|village|town|city|metropolis)\b/g, '{T}').replace(/\d[\d,.]*/g, '#');
}
const hits = []; let missing = 0; const towns = {};
for (const { seed, s } of corpus) {
  const txt = dump(seed); if (!txt) { if (!process.env.CENSUS_PARTIAL) missing++; continue; }
  const V = views(txt);
  const ctx = { seed, s, tier: s.tier, population: s.population, roster: rosterNames(s, displayName), npcRoles: npcRoles(s), catalog, crisis: crisisOf(s), V, displayName };
  const fold = folder(s);
  for (const [view, ls] of Object.entries(V)) {
    if (view === '_') continue;
    for (let i = 0; i < ls.length; i++) { const line = ls[i]; if (!line || line.startsWith('[STYLE]')) continue;
      ctx.prev = ls[i - 1] || ''; ctx.next = ls[i + 1] || ''; ctx.view = view; ctx.index = i;
      for (const [k, fn] of TESTS) for (const h of fn(line, view, ctx)) { hits.push({ ...h, seed, view, line, norm: fold(line) }); (towns[h.pattern] ||= new Set()).add(seed); }
    }
  }
}
if (missing) { console.error(`count2: ${missing} dumps missing`); process.exit(1); }
fs.writeFileSync(OUT + '/hits.json', JSON.stringify(hits));
const by = {}; for (const h of hits) { const b = (by[h.pattern] ||= { hits: 0, norms: new Set(), subs: {} }); b.hits++; b.norms.add(h.norm); (b.subs[h.sub] ||= new Set()).add(h.seed); }
const rows = []; for (const [k] of TESTS) { const b = by[k]; rows.push(`pattern ${k}: towns ${towns[k]?.size || 0}/${corpus.length} · hits ${b?.hits || 0} · distinct lines ${b?.norms.size || 0}` + (b ? ' · ' + Object.entries(b.subs).sort((x, y) => y[1].size - x[1].size).map(([s2, v]) => `${s2} ${v.size}`).join(', ') : '')); }
fs.writeFileSync(OUT + '/counts.patterns.txt', rows.join('\n') + '\n'); console.log(rows.join('\n'));
if (!hits.length) { console.error('count2: no hits at all: a census that counts nothing is a failed census'); process.exit(1); }
