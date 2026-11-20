// GOALS-1 measure: per kind (family/kind/vantage), TEMPLATES in the cell vs the most people of one town that hold that kind;
// repeats by template (names masked = the template itself) and by the chair's masker; ties by archetype index and masker.
const [, , L, nA = '50', out = ''] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { GOAL_FAMILY_LINES } = await import(`${L}/src/data/people/goalFamilies.js`);
const { STRESS_ECONOMIC_EFFECTS, HANDLER_TIE_ARCHETYPES, tieIndexOf } = await import(`${L}/src/data/npcData.js`);
await loadGenerationLawPayloads();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const masker = (t) => { const names = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name); for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) add(f.faction); add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const re = new RegExp([...names].sort((a, b) => b.length - a.length).map(esc).join('|'), 'gi');
  return (s) => typeof s === 'string' ? s.replace(re, '§').replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : ''; };
const tmplOf = (l) => typeof l === 'string' ? l : (l.line || l.text || '');
const reCache = new Map();
const cellRes = (fam, kind, v) => { const k = `${fam}/${kind}/${v}`; if (!reCache.has(k)) { const cell = GOAL_FAMILY_LINES[fam]?.[kind]?.[v] || []; reCache.set(k, cell.map((l, i) => { const t = tmplOf(l); const src = t.split(/\{[^}]+\}/).map(esc).join('.+?'); return { i, t, re: new RegExp('^' + src.replace(/^(.)/, (c) => c) + '$', 'is') }; })); } return reCache.get(k); };
const templateKey = (fam, kind, v, text) => { const rs = cellRes(fam, kind, v); if (!rs.length) return null; const hit = rs.filter((r) => r.re.test(text)); return hit.length ? `${fam}/${kind}/${v}#${hit[0].i}` : `${fam}/${kind}/${v}#?`; };
const archOf = (key) => STRESS_ECONOMIC_EFFECTS[key] || HANDLER_TIE_ARCHETYPES[key] || null;
const towns = [];
const t0 = Date.now();
for (const size of SIZES) for (let i = 0; i < +nA; i++) towns.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
const lines = [];
const log = (s) => lines.push(s);
log(`towns: ${towns.length} (${nA} per size) in ${((Date.now() - t0) / 1000).toFixed(0)}s; lib ${L}`);
// demand per kind: max people of one town; pool = templates in the cell
const kinds = new Map(); const unmatched = []; const perTown = [];
for (const t of towns) { const m = masker(t); const row = { tier: t.tier, tk: [], mk: { short: [], long: [] }, tie: [], tieD: [], tieT: [] };
  const c = new Map();
  for (const n of t.npcs || []) for (const v of ['short', 'long']) { const g = n.goal || {}; const it = g.intent?.[v]; const text = g[v]; if (!text) continue;
    const fam = it?.family || '?', kind = it?.kind || '?'; const pool = (GOAL_FAMILY_LINES[fam]?.[kind]?.[v] || []).length;
    const key = pool ? templateKey(fam, kind, v, text) : `${fam}/${kind}/${v}#${m(text)}`; if (key.endsWith('#?')) unmatched.push(`${key} :: ${text}`);
    row.tk.push(key); row.mk[v].push(m(text)); const kk = `${fam}/${kind}/${v}`; c.set(kk, (c.get(kk) || 0) + 1);
    const K = kinds.get(kk) || { pool, max: 0, draws: 0 }; K.draws++; kinds.set(kk, K); }
  for (const [kk, n] of c) { const K = kinds.get(kk); if (n > K.max) K.max = n; }
  const tc = new Map();
  for (const r of t.relationships || []) { const a = archOf(r.archetypeKey); row.tie.push(`${r.archetypeKey}#${tieIndexOf(r.proseVariant)}`); row.tieD.push(m(r.description)); row.tieT.push(m(r.tension)); tc.set(r.archetypeKey, (tc.get(r.archetypeKey) || 0) + 1);
    const K = kinds.get(`TIE:${r.archetypeKey}`) || { pool: a ? a.tension.size : -1, max: 0, draws: 0, type: r.type }; K.draws++; kinds.set(`TIE:${r.archetypeKey}`, K); }
  for (const [kk, n] of tc) { const K = kinds.get(`TIE:${kk}`); if (n > K.max) K.max = n; }
  perTown.push(row); }
log('\n== GOAL KINDS where the busiest town holds more people than the cell has templates (kind/vantage · draws · templates · max in one town · short by)');
for (const [kk, K] of [...kinds].filter(([k]) => !k.startsWith('TIE:')).sort((a, b) => (b[1].max - b[1].pool) - (a[1].max - a[1].pool))) if (K.pool && K.max > K.pool) log(`${kk.padEnd(36)} ${String(K.draws).padStart(5)} ${String(K.pool).padStart(3)} ${String(K.max).padStart(3)}  short by ${K.max - K.pool}`);
log('\n== TIE ARCHETYPES (key · type · draws · pool size · max in one town · short by)');
for (const [kk, K] of [...kinds].filter(([k]) => k.startsWith('TIE:')).sort((a, b) => (b[1].max - b[1].pool) - (a[1].max - a[1].pool))) log(`${kk.slice(4).padEnd(28)} ${String(K.type).padEnd(16)} ${String(K.draws).padStart(5)} ${String(K.pool).padStart(3)} ${String(K.max).padStart(3)}  ${K.max > K.pool ? 'short by ' + (K.max - K.pool) : 'ok'}`);
const dup = (a) => a.filter(Boolean).length - new Set(a.filter(Boolean)).size;
const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
log('\n== REPEATS IN ONE TOWN by size: share of towns with a repeat / mean repeats a town');
log('size        short(masker)   long(masker)    goal(template)  tie-desc(masker) tie-tension(masker) tie(index)');
for (const size of SIZES) { const g = perTown.filter((r) => r.tier === size); const f = (pick) => { const per = g.map(pick); return `${String(Math.round(100 * per.filter((x) => x > 0).length / g.length)).padStart(3)}% / ${mean(per).toFixed(2).padStart(5)}`; };
  log(`${size.padEnd(10)}  ${f((r) => dup(r.mk.short))}   ${f((r) => dup(r.mk.long))}   ${f((r) => dup(r.tk))}   ${f((r) => dup(r.tieD))}    ${f((r) => dup(r.tieT))}       ${f((r) => dup(r.tie))}`); }
log(`\nunmatched template keys: ${unmatched.length}`); for (const u of unmatched.slice(0, 10)) log('  ' + u);
const text = lines.join('\n') + '\n';
if (out) (await import('node:fs')).writeFileSync(out, text); else process.stdout.write(text);
// forced repeats (no rotation can avoid with today's templates) and the demand by size for the short kinds
{ const L2 = []; let forced = 0, total = 0; const bySize = new Map();
  for (const r of perTown) { const c = new Map(); for (const k of r.tk) { const kk = k.split('#')[0]; c.set(kk, (c.get(kk) || 0) + 1); }
    for (const [kk, n] of c) { const K = kinds.get(kk); total += n; if (K?.pool) forced += Math.max(0, n - K.pool); const m = bySize.get(kk) || {}; m[r.tier] = Math.max(m[r.tier] || 0, n); bySize.set(kk, m); } }
  L2.push(`\ngoal people-vantages: ${total}; repeats NO rotation could avoid with today's templates: ${forced} (${(100 * forced / total).toFixed(1)}%)`);
  L2.push('demand (max people of one town) by size, for the kinds short somewhere: thorp hamlet village town city metropolis · templates');
  for (const [kk, K] of kinds) if (!kk.startsWith('TIE:') && K.pool && K.max > K.pool) L2.push(`${kk.padEnd(36)} ${SIZES.map((s) => String(bySize.get(kk)?.[s] || 0).padStart(3)).join(' ')} · ${K.pool}`);
  let tf = 0, tt = 0; const tbs = new Map();
  for (const r of perTown) { const c = new Map(); for (const k of r.tie) { const kk = k.split('#')[0]; c.set(kk, (c.get(kk) || 0) + 1); } for (const [kk, n] of c) { tt += n; const K = kinds.get('TIE:' + kk); tf += Math.max(0, n - K.pool); const m = tbs.get(kk) || {}; m[r.tier] = Math.max(m[r.tier] || 0, n); tbs.set(kk, m); } }
  L2.push(`\nties: ${tt}; repeats NO rotation could avoid with today's pools: ${tf} (${(100 * tf / tt).toFixed(1)}%)`);
  for (const [kk, m] of tbs) { const K = kinds.get('TIE:' + kk); if (K.max > K.pool) L2.push(`${kk.padEnd(36)} ${SIZES.map((s) => String(m[s] || 0).padStart(3)).join(' ')} · ${K.pool}`); }
  (await import('node:fs')).appendFileSync(out, L2.join('\n') + '\n'); }
// THE CHAIR'S TABLE (c): per goal cell and tie archetype: pool; demand at the busiest city and metropolis; lines needed under T1/T2/T3
{ const L3 = ['\n== DEPTH TABLE (c): cell · pool · busiest city · busiest metropolis · max any town · T1 (≤2 a town) · T2 (unique in city, ≤2 in metropolis) · T3 (max+2)'];
  const demand = new Map(); // kk -> {city, metropolis, any}
  for (const r of perTown) { const c = new Map(); for (const k of r.tk) { const kk = k.split('#')[0]; c.set(kk, (c.get(kk) || 0) + 1); }
    for (const k of r.tie) { const kk = 'TIE:' + k.split('#')[0]; c.set(kk, (c.get(kk) || 0) + 1); }
    for (const [kk, n] of c) { const d = demand.get(kk) || { city: 0, metropolis: 0, any: 0 }; if (r.tier === 'city') d.city = Math.max(d.city, n); if (r.tier === 'metropolis') d.metropolis = Math.max(d.metropolis, n); d.any = Math.max(d.any, n); demand.set(kk, d); } }
  const tot = { g: [0, 0, 0], t: [0, 0, 0] }; const rows = [];
  for (const [kk, d] of demand) { const K = kinds.get(kk); if (!K || !(K.pool > 0)) continue;
    const t1 = Math.max(0, Math.ceil(d.any / 2) - K.pool), t2 = Math.max(0, Math.max(d.city, Math.ceil(d.metropolis / 2)) - K.pool), t3 = Math.max(0, d.any + 2 - K.pool);
    if (!t1 && !t2 && !t3) continue; const side = kk.startsWith('TIE:') ? 't' : 'g'; tot[side][0] += t1; tot[side][1] += t2; tot[side][2] += t3;
    rows.push([kk, K.pool, d.city, d.metropolis, d.any, t1, t2, t3]); }
  rows.sort((a, b) => b[6] - a[6] || b[7] - a[7]);
  for (const r of rows) L3.push(`${String(r[0]).padEnd(36)} ${r.slice(1).map((x) => String(x).padStart(4)).join(' ')}`);
  L3.push(`TOTAL goal lines  T1 ${tot.g[0]}  T2 ${tot.g[1]}  T3 ${tot.g[2]}`); L3.push(`TOTAL tie pairs   T1 ${tot.t[0]}  T2 ${tot.t[1]}  T3 ${tot.t[2]}`);
  (await import('node:fs')).appendFileSync(out, L3.join('\n') + '\n'); }
