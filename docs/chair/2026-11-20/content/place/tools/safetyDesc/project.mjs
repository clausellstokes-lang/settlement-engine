// PLACE-1 MEASURE, safetyDesc, section E: THE PROJECTION. The candidate composer (composer.mjs) simulated AT THE WRITER on
// the same 600 births (the chair's census births and mask, verbatim), through the read-only tap (tap-hooks.mjs).
// Run from this directory:   node --import ./tap-register.mjs project.mjs <repo> [n=100] > out/project.txt
// Prints: (1) the canonical-at-zero proof (a falsy seed composes today's line, every target birth); (2) the top share by size,
// before and after, whole line, first sentence, and any sentence; (3) the ten commonest after-sentences in the worst size;
// (4) every chosen row admitted by the FINAL record (the birth self-check's rule) and the coherence arms' words on the after-lines.
const [, , L, nArg = '100'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { drawDeclared } = await import(`${L}/src/domain/facts/drawDeclared.js`);
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { declarationAdmits, declarationOf, assertDeclarable, atomsOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { composeSafetyDesc, POOLS } = await import('./composer.mjs');
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const deps = { drawDeclared, pickVariant, factsOf, defenceOf };
const say = (s = '') => process.stdout.write(`${s}\n`);

// every declared atom parses and has a reader (the walker's own door)
let atoms = 0;
for (const [name, pool] of Object.entries(POOLS)) for (const r of pool) for (const a of atomsOf(declarationOf(r))) { assertDeclarable(a.replace(/^no /, '')); atoms++; }
say(`== declarations: ${Object.values(POOLS).reduce((a, p) => a + p.length, 0)} rows in ${Object.keys(POOLS).length} pools; ${atoms} declared atoms, every one declarable (factVocabulary.js :: assertDeclarable)`);

let calls = [];
globalThis.__safetyTap = (args, out, seed) => {
  const [config, tier, institutions] = args;
  const stresses = config?.stressTypes?.length ? config.stressTypes : config?.stressType ? [config.stressType] : [];
  const at = { label: out.safetyLabel, tier, institutions, config, seed, stresses };
  const canonical = composeSafetyDesc({ ...at, seed: null }, deps);
  const chosen = [];
  const composed = composeSafetyDesc({ ...at, chosen }, deps);
  calls.push({ original: out.safetyDesc, canonical, composed, chosen });
};

const rows = [];
let canonChecked = 0, canonBroken = 0;
const broken = [];
for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    calls = [];
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const nm = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) nm.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...nm].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
    const stored = String(t.economicState?.safetyProfile?.safetyDesc ?? '');
    for (const c of calls) if (c.canonical != null) { canonChecked++; if (c.canonical !== c.original) { canonBroken++; if (broken.length < 5) broken.push(`${seed}: "${c.original}" vs "${c.canonical}"`); } }
    const last = calls[calls.length - 1];
    // the stored line where the writer's own line survived to the record; a later pass's rewrite (the crime wave's twin) is kept as stored
    const after = last && last.composed != null && last.original === stored ? last.composed : stored;
    // the birth self-check's rule: every chosen row is admitted by the FINAL record
    const finalFacts = factsOf(t);
    const refused = last && last.composed != null && last.original === stored
      ? last.chosen.filter((c) => c.line && !declarationAdmits(declarationOf(c.line), finalFacts).admitted).map((c) => `${c.slot}: ${c.line.text.slice(0, 50)}`) : [];
    rows.push({ size, seed, before: mask(stored), after: mask(after), changed: after !== stored, refused, final: t, afterRaw: after });
  }
}
say(`== (1) canonical at zero: ${canonChecked} writer calls on a target branch; a falsy seed composes today's line in ${canonChecked - canonBroken}, differs in ${canonBroken}${broken.length ? `\n   ${broken.join('\n   ')}` : ''}`);

const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).filter(Boolean);
const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
const share = (rs, f) => { const m = new Map(); for (const r of rs) for (const k of f(r)) m.set(k, (m.get(k) || 0) + 1); return top(m); };
say('\n== (2) top share by size, BEFORE → AFTER (100 places a size; masked as the census masks)');
say(`${'size'.padEnd(11)} ${'whole line'.padEnd(18)} ${'first sentence'.padEnd(18)} ${'any sentence'.padEnd(18)} changed`);
let worst = null, worstN = -1;
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const fmt = (key) => { const b = share(rs, (r) => key(r.before))[0][1], a = share(rs, (r) => key(r.after))[0][1]; return `${b}% → ${a}%`; };
  const anyAfter = share(rs, (r) => [...new Set(sentences(r.after))])[0][1];
  if (anyAfter > worstN) { worstN = anyAfter; worst = size; }
  say(`${size.padEnd(11)} ${fmt((s) => [s]).padEnd(18)} ${fmt((s) => [sentences(s)[0]]).padEnd(18)} ${fmt((s) => [...new Set(sentences(s))]).padEnd(18)} ${rs.filter((r) => r.changed).length}`);
}
say('\n== (2b) the top AFTER sentence (any position) by size, and the top AFTER whole line');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const [s, c] = share(rs, (r) => [...new Set(sentences(r.after))])[0];
  const [w, wc] = share(rs, (r) => [r.after])[0];
  say(`${size.padEnd(11)} sentence ${String(c).padStart(3)} "${s.slice(0, 100)}"`);
  say(`${''.padEnd(11)} whole    ${String(wc).padStart(3)} "${w.slice(0, 100)}"`);
}
say(`\n== (3) the ten commonest AFTER sentences in the worst size (${worst}: ${worstN} of 100)`);
for (const [s, c] of share(rows.filter((r) => r.size === worst), (r) => [...new Set(sentences(r.after))]).slice(0, 10)) say(`  ${String(c).padStart(3)}  ${s}`);
for (const size of SIZES.filter((s) => s !== worst)) {
  say(`-- ${size}: the five commonest AFTER sentences`);
  for (const [s, c] of share(rows.filter((r) => r.size === size), (r) => [...new Set(sentences(r.after))]).slice(0, 5)) say(`  ${String(c).padStart(3)}  ${s}`);
}

// (4) the final record admits every chosen row; the coherence arms' words (generationCoherence.js) on the after-lines
const WATCH_NAMED = /(?<!\bno )\bthe watch\b/i, GATES_NAMED = /(?<!\bno )\bgates?\b/i, MERC = /\bmercenary compan/i;
const COURT_SITS = /\b(?:a court exists|the court can try|before the court|tried at the court|the court sits|functioning court|with a working court|only a court|prosecution is real|real prosecution)/i;
let refusedN = 0, coh = 0; const cohEx = [];
for (const r of rows) {
  refusedN += r.refused.length;
  const f = factsOf(r.final).defence;
  const hits = [f.watch === false && WATCH_NAMED.test(r.afterRaw) && 'watch', f.gate === false && GATES_NAMED.test(r.afterRaw) && 'gate', f.mercenary === false && MERC.test(r.afterRaw) && 'mercenary', f.court === false && COURT_SITS.test(r.afterRaw) && 'court'].filter(Boolean);
  if (hits.length && r.changed) { coh++; if (cohEx.length < 5) cohEx.push(`${r.seed} ${hits.join(',')}: ${r.afterRaw.slice(0, 80)}`); }
}
say(`\n== (4) chosen rows the FINAL record refuses: ${refusedN}; changed lines the coherence arms' words would flag: ${coh}${cohEx.length ? `\n   ${cohEx.join('\n   ')}` : ''}`);
say(`   changed lines in all: ${rows.filter((r) => r.changed).length} of ${rows.length}`);
