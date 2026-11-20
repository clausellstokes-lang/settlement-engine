// GOALS final measure: per size, repeats inside one town of goal sentences, templates, mirrored name fills and ties; and
// closed-list venal secrets held beside a PERSONALITY conviction/duty want ("refusal").
// Usage: node goals-final.mjs <tree> [n=50] [out]
//   <tree>  a repository tree (an archive copy with node_modules symlinked, or the checkout itself)
//   n       towns per size (seeds hxd-<size>-<i>, i < n); out: also write the table there
// The closed list: <tree>/src/data/people/goalSecretRefusals.js :: GOAL_SECRET_REFUSAL_ROWS if the tree has it, else the same
// file under the checkout named by env GOALS_LEAF (e.g. GOALS_LEAF=/home/user/settlement-engine), else this folder's
// venal-betrayal-rows.closed-list.txt (one row a line: `<id>\t<sentence>`; `{token}` matches any text).
// Counts (per town, summed by size): identical = k-1 per sentence held k times (short+long pooled); mirror = per template and
// name-slot multiset, distinct slot orders beyond the first; template>2 = k-2 per template held k>2 times; template=2 =
// templates held exactly twice; tieDesc/tieTension = k-1 per masked description/tension (goals-ties-depth's masker);
// tieIndex = k-1 per (archetypeKey, proseVariant mod 65536); refusal = cards with a closed-list secret and a PERSONALITY
// conviction or duty want; venal = cards with a closed-list secret. Templates are keyed fam/kind/vantage#i, reserve lines
// indexed after the cell's; a holding with a cell but no matching line is `unmatched`; one whose intent has no cell, `nocell`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const [, , L, nA = '50', out = ''] = process.argv;
if (!L) { console.error('usage: node goals-final.mjs <tree> [n=50] [out]'); process.exit(2); }
const t0 = Date.now();
const imp = (p) => import(pathToFileURL(path.join(L, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
const GF = await imp('src/data/people/goalFamilies.js');
const LINES = GF.GOAL_FAMILY_LINES, RESERVE = GF.GOAL_RESERVE_LINES || {};
await loadGenerationLawPayloads();
// ── the closed list ──
const leafRel = 'src/data/people/goalSecretRefusals.js';
let rows, rowsFrom;
for (const base of [L, process.env.GOALS_LEAF].filter(Boolean)) { const f = path.join(base, leafRel); if (!rows && fs.existsSync(f)) { const m = await import(pathToFileURL(f).href); const R0 = m.GOAL_SECRET_REFUSAL_ROWS; rows = (Array.isArray(R0) ? R0 : Object.values(R0)).map((r) => typeof r === 'string' ? r : (r.text || r.line || r.secret || r.what || r[1])); rowsFrom = f; } }
if (!rows) { rowsFrom = path.join(path.dirname(fileURLToPath(import.meta.url)), 'venal-betrayal-rows.closed-list.txt'); rows = fs.readFileSync(rowsFrom, 'utf8').split('\n').filter((l) => l.trim()).map((l) => l.split('\t').slice(1).join('\t') || l); }
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => String(s || '').trim().replace(/[.\s]+$/, '');
const rowRes = rows.map((r) => new RegExp('^' + norm(r).split(/(\{faction\} \w+?s\b|\{[^}]+\})/).map((p) => { const fv = /^\{faction\} (\w+?)s$/.exec(p); return fv ? `.+? ${esc(fv[1])}s?` : /^\{[^}]+\}$/.test(p) ? '.+?' : esc(p); }).join('') + '$', 'is'));
const venal = (n) => { const s = norm(typeof n.secret === 'string' ? n.secret : n.secret?.what); return !!s && rowRes.some((re) => re.test(s)); };
// ── templates ──
const NAME_SLOTS = new Set(['above', 'below', 'other', 'handler', 'agent', 'target', 'priest', 'power', 'rival', 'guild', 'house', 'otherHouse', 'front', 'targetHouse', 'shrine', 'arcaneHouse']);
const tmplOf = (l) => typeof l === 'string' ? l : (l?.line || l?.text || '');
const cache = new Map();
const cellRes = (fam, kind, v) => { const k = `${fam}/${kind}/${v}`; if (!cache.has(k)) {
  const all = [...(LINES[fam]?.[kind]?.[v] || []), ...(RESERVE[fam]?.[kind]?.[v] || [])].map(tmplOf);
  cache.set(k, all.map((t, i) => { const slots = []; const src = t.split(/(\{[^}]+\})/).map((p) => { const m = /^\{([^}|]+)(?:\|([^}]*))?\}$/.exec(p);
    if (!m) return esc(p); if (m[2] !== undefined) return '(?:' + m[2].split('|').map(esc).join('|') + ')'; slots.push(m[1]); return '(.+?)'; }).join('');
    return { key: `${k}#${i}`, slots, re: new RegExp('^' + src + '$', 'is') }; })); } return cache.get(k); };
const fillNorm = (s) => s.trim().toLowerCase().replace(/^(the|a|an)\s+/, '');
// ── goals-ties-depth's masker ──
const masker = (t) => { const names = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name); for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) add(f.faction); add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const re = new RegExp([...names].sort((a, b) => b.length - a.length).map(esc).join('|') || '(?!)', 'gi');
  return (s) => typeof s === 'string' ? s.replace(re, '§').replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : ''; };
const counts = (a) => { const m = new Map(); for (const x of a) if (x) m.set(x, (m.get(x) || 0) + 1); return m; };
const extra = (a) => [...counts(a).values()].reduce((s, k) => s + k - 1, 0);
// ── the walk ──
const COLS = ['towns', 'cards', 'identical', 'mirror', 'template>2', 'template=2', 'tieDesc', 'tieTension', 'tieIndex', 'refusal', 'venal', 'unmatched', 'nocell'];
const tab = new Map(); const examples = []; let cards = 0;
for (const size of SIZES) { const R = Object.fromEntries(COLS.map((c) => [c, 0])); tab.set(size, R);
  for (let i = 0; i < +nA; i++) { const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    const m = masker(t); const texts = [], keys = [], mir = new Map(); R.towns++;
    for (const n of t.npcs || []) { R.cards++; cards++; const g = n.goal || {}; let refuses = false;
      for (const v of ['short', 'long']) { const text = g[v]; const it = g.intent?.[v]; if (!text) continue; texts.push(text);
        if (it?.family === 'PERSONALITY' && (it.kind === 'conviction' || it.kind === 'duty')) refuses = true;
        const rs = cellRes(it?.family, it?.kind, v); if (!rs.length) { R.nocell++; continue; }
        let hit = null, cap; for (const r of rs) { cap = r.re.exec(text); if (cap) { hit = r; break; } }
        if (!hit) { R.unmatched++; if (examples.length < 8) examples.push(`${size}-${i} ${it?.family}/${it?.kind}/${v}: ${text}`); continue; }
        keys.push(hit.key);
        const named = hit.slots.map((s, j) => [s, fillNorm(cap[j + 1])]).filter(([s]) => NAME_SLOTS.has(s));
        const seen = new Set(); const tuple = named.filter(([s]) => !seen.has(s) && seen.add(s)).map(([, f]) => f); // first fill per slot, slot order
        if (tuple.length > 1 && new Set(tuple).size > 1) { const mk = hit.key + '|' + [...tuple].sort().join('|'); const o = mir.get(mk) || new Set(); o.add(tuple.join('|')); mir.set(mk, o); } }
      const isVenal = venal(n); if (isVenal) R.venal++; if (isVenal && refuses) R.refusal++; }
    R.identical += extra(texts);
    for (const o of mir.values()) R.mirror += o.size - 1;
    for (const k of counts(keys).values()) { if (k > 2) R['template>2'] += k - 2; if (k === 2) R['template=2']++; }
    const rel = t.relationships || [];
    R.tieDesc += extra(rel.map((r) => m(r.description))); R.tieTension += extra(rel.map((r) => m(r.tension)));
    R.tieIndex += extra(rel.map((r) => `${r.archetypeKey}#${typeof r.proseVariant === 'number' ? r.proseVariant % 65536 : r.proseVariant}`)); } }
const TOT = Object.fromEntries(COLS.map((c) => [c, [...tab.values()].reduce((s, R) => s + R[c], 0)])); tab.set('TOTAL', TOT);
const out1 = [`cards: ${cards}; elapsed ${((Date.now() - t0) / 1000).toFixed(1)}s; tree ${L}; ${nA}/size; reserve ${GF.GOAL_RESERVE_LINES ? 'exported' : 'absent'}; closed list ${rows.length} rows from ${rowsFrom}`,
  'size'.padEnd(11) + COLS.map((c) => c.padStart(c.length > 6 ? c.length + 1 : 7)).join('')];
for (const [s, R] of tab) out1.push(s.padEnd(11) + COLS.map((c) => String(R[c]).padStart(c.length > 6 ? c.length + 1 : 7)).join(''));
if (examples.length) { out1.push('unmatched, first examples:'); for (const e of examples) out1.push('  ' + e); }
const text = out1.join('\n') + '\n';
process.stdout.write(text); if (out) fs.writeFileSync(out, text);
