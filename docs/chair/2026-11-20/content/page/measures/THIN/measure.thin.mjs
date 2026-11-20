#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/page/measures/THIN/measure.thin.mjs > docs/chair/2026-11-20/content/page/measures/THIN/measure.out.txt 2>&1
 *
 * PAGE-9's THIN-MEASURE brief, sections A and C (record level), and the record half of B (the exclusion lists).
 * The 300: { ...DEFAULT_CONFIG, settType }, seeds hxd-<size>-0..49, born by the names walker's recipe
 * (loadGenerationLawPayloads() then generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })).
 * Nothing is written to a born document: the records are read, never stored.
 * Also writes ./texts.json (every candidate text of every town) for render.thin.jsx / prints.thin.mjs.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLife, DAILY_LIFE_SLOTS } = await import(`${L}/src/domain/dailyLife.js`);
const { deriveMagicProfile } = await import(`${L}/src/domain/magicProfile.js`);
const VF = await import(`${L}/src/domain/display/viabilityFilter.js`);
const { toPublicSafe, PUBLIC_TOPLEVEL_KEYS, PRIVATE_KEY_RE } = await import(`${L}/src/domain/display/publicSafe.js`);
const CTX = {
  profiles: (await import(`${L}/src/domain/factionProfile.js`)).deriveAllFactionProfiles,
  chains: (await import(`${L}/src/domain/supplyChainState.js`)).deriveAllSupplyChainStates,
  conditions: (await import(`${L}/src/domain/activeConditions.js`)).deriveAllActiveConditions,
  threats: (await import(`${L}/src/domain/threatProfile.js`)).deriveAllThreatProfiles,
  capacities: (await import(`${L}/src/domain/capacityModel.js`)).deriveAllCapacities,
  causal: (await import(`${L}/src/domain/causalState.js`)).deriveCausalState,
  history: (await import(`${L}/src/domain/historyBeats.js`)).deriveHistoryBeats,
};
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SLOT_KEYS = DAILY_LIFE_SLOTS.map((s) => (typeof s === 'string' ? s : s.key));
// INFERRED (read from src/domain/dailyLife.js, each deriver's `ctx.<x>` / `s.<x>` uses):
const SLOT_CTX = {
  food_culture: ['capacities', 'chains', 'threats'], dawn_work: ['capacities', 'profiles', 'threats'],
  gathering_places: ['s.institutions'], child_warnings: ['threats'], commoner_resentments: ['causal', 'capacities', 'conditions'],
  outsider_impressions: ['capacities', 'profiles', 'threats'], unspoken_topics: ['threats', 'history', 'conditions'],
  recent_changes: ['history', 'conditions', 'threats'],
};

const t0 = Date.now();
const towns = [];
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  towns.push({ seed, size, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
}
console.log(`RE-RUN: node docs/chair/2026-11-20/content/page/measures/THIN/measure.thin.mjs > docs/chair/2026-11-20/content/page/measures/THIN/measure.out.txt 2>&1`);
console.log(`births: ${towns.length} in ${((Date.now() - t0) / 1000).toFixed(0)}s; slots ${SLOT_KEYS.join(',')}`);

const s = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
/** candidate name -> (town, dl, mp) => string[] (the texts this town holds; [] = unfilled) */
const CANDS = {};
for (const k of SLOT_KEYS) CANDS[`dailyLife.${k}`] = (t, dl) => [s(dl.slots[k]?.text)].filter(Boolean);
CANDS['viability.warnings[].title'] = (t) => (t.economicViability?.warnings || []).map((w) => s(w?.title)).filter(Boolean);
CANDS['viability.warnings[].description'] = (t) => (t.economicViability?.warnings || []).map((w) => s(w?.description)).filter(Boolean);
CANDS['viability.dependencies[].title'] = (t) => (t.economicViability?.dependencies || []).map((w) => s(w?.title)).filter(Boolean);
CANDS['viability.dependencies[].description'] = (t) => (t.economicViability?.dependencies || []).map((w) => s(w?.description)).filter(Boolean);
CANDS['viability.summary'] = (t) => [s(t.economicViability?.summary)].filter(Boolean);
CANDS['magic.contributors[].reason'] = (t, dl, mp) => (mp?.contributors || []).map((c) => s(c?.reason)).filter(Boolean);

const rows = towns.map((x) => { const dl = deriveDailyLife(x.t); let mp = null; try { mp = deriveMagicProfile(x.t); } catch (e) { mp = null; } return { ...x, dl, mp }; });
const texts = {};
for (const r of rows) texts[r.seed] = { size: r.size, c: Object.fromEntries(Object.entries(CANDS).map(([n, f]) => [n, f(r.t, r.dl, r.mp)])) };
writeFileSync(join(HERE, 'texts.json'), JSON.stringify(texts));

// ── A ──
console.log(`\n════ A. CANDIDATES BY SIZE (50 towns a size): fill / distinct texts / top share of one text among the holders (FLAG > 25%)`);
const flags = [];
const summaryA = {};
for (const name of Object.keys(CANDS)) {
  console.log(`\n[${name}]`);
  summaryA[name] = {};
  const allDistinct = new Set();
  for (const size of SIZES) {
    const rs = rows.filter((r) => r.size === size);
    const holders = rs.filter((r) => texts[r.seed].c[name].length);
    const m = new Map();
    for (const r of holders) for (const tx of new Set(texts[r.seed].c[name])) { m.set(tx, (m.get(tx) || 0) + 1); allDistinct.add(tx); }
    const top = [...m].sort((a, b) => b[1] - a[1]);
    const share = holders.length ? top[0][1] / holders.length : 0;
    const flag = share > 0.25;
    summaryA[name][size] = { fill: holders.length, distinct: m.size, top: share, flag };
    // every text over 25% in this size is flagged, not only the first
    const over = top.filter(([, c]) => holders.length && c / holders.length > 0.25);
    for (const [tx, c] of over) flags.push(`${name} | ${size} | ${c}/${holders.length} (${(100 * c / holders.length).toFixed(0)}%) | "${tx}"`);
    console.log(`  ${size.padEnd(10)} fill ${String(holders.length).padStart(2)}/50  distinct ${String(m.size).padStart(3)}  top ${(100 * share).toFixed(0).padStart(3)}%${flag ? ' FLAG' : ''}  top text (${top[0]?.[1] ?? 0}): "${String(top[0]?.[0] ?? '').slice(0, 150)}"`);
  }
  console.log(`  ALL 300: distinct ${allDistinct.size}`);
}
console.log(`\n════ A. FLAGS (every text holding > 25% of a size's holders): ${flags.length}`);
for (const f of flags) console.log(`  FLAG ${f}`);

// ── B (record half): the exclusion lists ──
console.log(`\n════ B. viabilityFilter.js :: isViabilityItem over the 300: which list drops each item (first rule that fires, in the predicate's order)`);
const ruleOf = (it) => {
  if (VF.VIABILITY_EXCLUDED_TYPES.includes(it.type ?? '')) return `TYPES(${it.type})`;
  if (VF.VIABILITY_EXCLUDED_SEV.includes(it.severity ?? '')) return `SEV(${it.severity})`;
  if (VF.VIABILITY_EXCLUDED_CATEGORIES.includes(it.category ?? '')) return `CATEGORIES(${it.category})`;
  if (VF.VIABILITY_EXCLUDED_TITLES.includes(it.title ?? '')) return `TITLES(${it.title})`;
  return 'KEPT';
};
for (const list of ['warnings', 'dependencies']) {
  const m = new Map(); let n = 0;
  for (const r of rows) for (const it of r.t.economicViability?.[list] || []) { n++; const k = `${ruleOf(it)} | sev=${it.severity} type=${it.type ?? '-'} cat=${it.category ?? '-'} | "${it.title}"`; m.set(k, (m.get(k) || 0) + 1); }
  console.log(`\n  ${list}: ${n} items over 300 towns; by rule and title:`);
  for (const [k, c] of [...m].sort((a, b) => b[1] - a[1])) console.log(`    ${String(c).padStart(4)}  ${k}`);
  const byRule = new Map(); for (const r of rows) for (const it of r.t.economicViability?.[list] || []) { const k = ruleOf(it).replace(/\(.*$/, ''); byRule.set(k, (byRule.get(k) || 0) + 1); }
  console.log(`  ${list} COUNT LINE: ${[...byRule].map(([k, c]) => `${k} ${c}`).join(' · ')}`);
}
console.log(`\n  viability.summary: the record's spelling vs the trimmed display spelling (trimViabilitySummary ∘ stripViabilityToken); the tab prints deriveViability().summary (canonicalViewModel default-on) — see prints.out.txt for what is printed`);
const sumShapes = new Map();
for (const r of rows) { const k = String(r.t.economicViability?.summary || '').replace(/\d+/g, 'N').replace(/\(.*?\)/g, '(…)'); sumShapes.set(k, (sumShapes.get(k) || 0) + 1); }
console.log(`  record summary SHAPES (digits as N): ${sumShapes.size}`);
for (const [k, c] of [...sumShapes].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`    ${String(c).padStart(4)}  ${k.slice(0, 200)}`);

// ── C: the audience ──
console.log(`\n════ C. AUDIENCE. (1) the stored record paths each reader TOUCHES (a proxy over the record, EXECUTED on 12 towns, 2 a size); (2) whether the public projection toPublicSafe(record) serves it (top key on PUBLIC_TOPLEVEL_KEYS, no PRIVATE_KEY_RE segment), and (3) the re-derivation on toPublicSafe(record) equal to the owner's text over all 300 (EXECUTED).`);
const trace = (rec, fn) => {
  const seen = new Set();
  const wrap = (obj, path) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return new Proxy(obj, { get(o, k, rcv) {
      const v = Reflect.get(o, k, rcv);
      if (typeof k === 'symbol' || typeof v === 'function') return v;
      const seg = /^\d+$/.test(k) ? '[]' : k;
      const p = path ? (seg === '[]' ? `${path}[]` : `${path}.${seg}`) : seg;
      const depth = p.split(/\.|\[\]/).filter(Boolean).length;
      if (v !== undefined) seen.add(p.split('.').slice(0, 3).join('.')); // a read of an ABSENT key is not a read of a stored field
      return depth <= 6 ? wrap(v, p) : v;
    } });
  };
  try { fn(wrap(rec, '')); } catch (e) { seen.add(`!threw ${e.message.slice(0, 60)}`); }
  return seen;
};
const sample = rows.filter((r) => /-(0|1)$/.test(r.seed));
const READERS = { ...Object.fromEntries(Object.entries(CTX).map(([k, f]) => [`ctx.${k}`, (rec) => f(rec)])),
  's.institutions': (rec) => JSON.stringify(rec.institutions),
  'viability.warnings': (rec) => (rec.economicViability?.warnings || []).map((w) => [w.title, w.description]),
  'viability.dependencies': (rec) => (rec.economicViability?.dependencies || []).map((w) => [w.title, w.description]),
  'viability.summary': (rec) => rec.economicViability?.summary,
  'magicProfile': (rec) => deriveMagicProfile(rec) };
const touched = {};
const isPublic = (p) => { const segs = p.replace(/\[\]/g, '').split('.'); return PUBLIC_TOPLEVEL_KEYS.includes(segs[0]) && !segs.some((x) => PRIVATE_KEY_RE.test(x)) && p !== 'powerStructure.criminalCaptureState'; };
for (const [name, fn] of Object.entries(READERS)) {
  const all = new Set(); for (const r of sample) for (const p of trace(r.t, fn)) all.add(p);
  // keep the leaf-most distinct paths at depth <= 2 for the report
  const tops = [...new Set([...all].map((p) => p.split('.').slice(0, 2).join('.')))].sort();
  touched[name] = tops;
  const priv = tops.filter((p) => !isPublic(p));
  console.log(`\n  ${name}: touches ${tops.length} paths; NOT served by the public projection: ${priv.length ? priv.join(', ') : 'none'}\n    ${tops.join(', ')}`);
}
console.log(`\n  per candidate: the readers it uses (INFERRED, dailyLife.js) and the public re-derivation (EXECUTED, 300)`);
const pubRows = rows.map((r) => { const p = toPublicSafe(r.t); let dl = null, mp = null; try { dl = deriveDailyLife(p); } catch { /* */ } try { mp = deriveMagicProfile(p); } catch { /* */ } return { r, p, dl, mp }; });
const audience = {};
for (const name of Object.keys(CANDS)) {
  let same = 0, diff = 0, ex = null;
  for (const { r, p, dl, mp } of pubRows) {
    const own = JSON.stringify(texts[r.seed].c[name]);
    let pub; try { pub = JSON.stringify(CANDS[name](p, dl || { slots: {} }, mp)); } catch { pub = 'THREW'; }
    if (own === pub) same++; else { diff++; ex = ex || `${r.seed}: owner ${own.slice(0, 140)} | public ${pub.slice(0, 140)}`; }
  }
  const readers = name.startsWith('dailyLife.') ? SLOT_CTX[name.slice(10)].map((x) => (x.startsWith('s.') ? x : `ctx.${x}`)) : name.startsWith('magic') ? ['magicProfile'] : [name.replace(/\[\].*$/, '')];
  const privPaths = [...new Set(readers.flatMap((x) => (touched[x] || []).filter((p) => !isPublic(p))))];
  audience[name] = { same, diff, privPaths };
  console.log(`  ${name}: readers ${readers.join('+')}; private paths touched: ${privPaths.join(', ') || 'none'}; public re-derivation equal ${same}/300, differs ${diff}${ex ? `\n      e.g. ${ex}` : ''}`);
}
// the semantic DM facts the field test cannot see (threat visibility)
let hiddenUsed = 0;
for (const r of rows) { const th = CTX.threats(r.t); if (th.some((x) => x.visibility === 'hidden' || x.visibility === 'rumored')) hiddenUsed++; }
console.log(`\n  NOTE (INFERRED, read): the npcs[].secret / npcs[].plotHooks touch is deriveAllNpcProfiles (npcProfile.js:623,631) bundling them into a profile; causalState.js:1320 uses only p.rank of it, and the public re-derivation above is equal on 300/300 (EXECUTED): a TOUCH, not a value read (factLayers.js counts touch).`);
console.log(`\n  towns with a hidden/rumored threat in ctx.threats (unspoken_topics names them; outsider/child/recent may sort them in): ${hiddenUsed}/300`);
const woundUsed = rows.filter((r) => CTX.history(r.t)?.unresolvedWound).length;
console.log(`  towns with history.unresolvedWound (unspoken_topics' "the wound" line): ${woundUsed}/300`);
let childHidden = 0, outsiderHidden = 0, recentHidden = 0, dawnHidden = 0, foodHidden = 0;
for (const r of rows) {
  const th = CTX.threats(r.t).filter((x) => x.visibility === 'hidden' || x.visibility === 'rumored').map((x) => x.label.toLowerCase());
  const has = (k) => th.some((l) => String(r.dl.slots[k]?.text || '').toLowerCase().includes(l));
  if (has('child_warnings')) childHidden++; if (has('outsider_impressions')) outsiderHidden++; if (has('recent_changes')) recentHidden++; if (has('dawn_work')) dawnHidden++; if (has('food_culture')) foodHidden++;
}
console.log(`  a hidden/rumored threat's LABEL contained in the slot text (EXECUTED): child_warnings ${childHidden}, outsider_impressions ${outsiderHidden}, recent_changes ${recentHidden}, dawn_work ${dawnHidden}, food_culture ${foodHidden} (of 300)`);
writeFileSync(join(HERE, 'summaryA.json'), JSON.stringify({ summaryA, audience }, null, 1));
console.log(`\ndone in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
