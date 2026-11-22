// PAGE-7 HOOKS-BUILD measure (2026-11-20): the trouble hooks THROUGH THE BUILT GENERATOR (no pools replayed here). Towns:
// PAGE-5's 900 (hxd-<size>-<i>, i=0..n-1, every size), built as measure.mjs builds them; reads the FINAL record's
// history.currentTensions[].plotHooks.
// Usage: node built.mjs <checkout root> [n=150] [prefix=hxd]
// Count lines:
//   SHORT  the eight kinds' tensions whose stored list is not 3 long;
//   NEED   stored pool hooks whose declaration fails on the final record (a late write), by kind;
//   BAR    the chair's bar by size over every kind's hooks (as measure.mjs): top = the commonest hook's places / the places
//          holding any hook; seen = the mean over holders of the share of a place's hooks a second place also prints;
//   SHARE  by size and kind: each pool hook's places against its EXPECTED places (the sum, over the kind's tensions where
//          the line is admitted on the final record, of 3 / the admitted lines there); the largest ratio among hooks
//          expected in 5 or more places, and the largest overall. The chair's trigger for the mixed pick is about 1.5.
const [, , L = process.cwd(), nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { declarationAdmits, declarationOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { LEGITIMACY_HELD_TWINS } = await import(`${L}/src/data/historyData.js`);
const { TROUBLE_HOOKS, TROUBLE_HOOK_COUNT } = await import(`${L}/src/data/troubleHooks.js`);
await loadGenerationLawPayloads();
const KINDS = Object.keys(TROUBLE_HOOKS);
const FORM_OF = Object.fromEntries(Object.entries(LEGITIMACY_HELD_TWINS).map(([form, twin]) => [twin, form]));
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : '-');

const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const f = factsOf(t);
  const tens = (t.history?.currentTensions || []).map((x) => {
    const pool = TROUBLE_HOOKS[x.type];
    const admitted = pool ? pool.filter((r) => declarationAdmits(declarationOf(r), f).admitted).map((r) => r.text) : null;
    return { kind: x.type, hooks: [...(x.plotHooks || [])].map(String), admitted };
  });
  towns.push({ seed, size, tens });
}

const all = towns.flatMap((t) => t.tens.map((x) => ({ ...x, seed: t.seed, size: t.size })));
const ours = all.filter((x) => KINDS.includes(x.kind));
console.log(`TOWNS ${towns.length}, tensions ${all.length}, of the eight kinds ${ours.length}`);
const short = ours.filter((x) => x.hooks.length !== TROUBLE_HOOK_COUNT);
console.log(`SHORT ${short.length}/${ours.length}${short.length ? ': ' + short.slice(0, 10).map((x) => `${x.seed} ${x.kind} ${x.hooks.length}`).join(' · ') : ''}`);
const fails = ours.flatMap((x) => x.hooks.map((h) => FORM_OF[h] ?? h).filter((h) => !x.admitted.includes(h)).map((h) => `${x.seed} ${x.kind} "${h.slice(0, 50)}"`));
console.log(`NEED stored hooks whose need fails on the final record: ${fails.length}${fails.length ? ': ' + fails.join(' · ') : ''}`);

const bar = (m) => {
  const parts = [];
  for (const size of SIZES) {
    const g = towns.filter((t) => t.size === size).slice(0, m).map((t) => new Set(t.tens.flatMap((x) => x.hooks)));
    const holders = g.filter((h) => h.size > 0); const H = holders.length;
    const df = new Map(); for (const h of holders) for (const s of h) df.set(s, (df.get(s) || 0) + 1);
    const top = Math.max(0, ...df.values());
    let seen = 0; for (const h of holders) { let sh = 0; for (const s of h) sh += df.get(s) - 1; seen += sh / h.size / Math.max(1, H - 1); }
    parts.push(`${size} top ${top}/${H} ${pct(top, H)} seen ${H ? (100 * seen / H).toFixed(1) : '-'}%`);
  }
  console.log(`BAR built (${m} a size): ${parts.join(' · ')}`);
};
bar(+nA);
if (+nA > 50) bar(50);

let worst = { r: 0 };
for (const size of SIZES) {
  const parts = [];
  for (const kind of KINDS) {
    const rows = ours.filter((x) => x.size === size && x.kind === kind); if (!rows.length) continue;
    const obs = new Map(); const exp = new Map();
    for (const x of rows) {
      for (const h of x.hooks) { const k = FORM_OF[h] ?? h; obs.set(k, (obs.get(k) || 0) + 1); }
      for (const a of x.admitted) exp.set(a, (exp.get(a) || 0) + Math.min(1, TROUBLE_HOOK_COUNT / x.admitted.length));
    }
    let big = { r: 0 }; let any = { r: 0 };
    for (const [text, e] of exp) { const o = obs.get(text) || 0; const r = o / e;
      if (r > any.r) any = { r, o, e, text };
      if (e >= 5 && r > big.r) big = { r, o, e, text }; }
    if (big.r > worst.r) worst = { ...big, size, kind };
    parts.push(`${kind} n${rows.length} max(e>=5) ${big.r ? `${big.r.toFixed(2)} (${big.o}/${big.e.toFixed(1)})` : '-'} max ${any.r.toFixed(2)} (${any.o}/${any.e?.toFixed(1)})`);
  }
  console.log(`SHARE ${size}: ${parts.join(' · ')}`);
}
console.log(`SHARE worst (expected >= 5): ${worst.r ? `${worst.r.toFixed(2)} x, ${worst.size} ${worst.kind} ${worst.o}/${worst.e.toFixed(1)} "${worst.text}"` : '-'}`);
for (const size of ['city', 'metropolis']) {
  const g = towns.filter((t) => t.size === size); const c = new Map();
  for (const t of g) for (const s of new Set(t.tens.flatMap((x) => x.hooks))) c.set(s, (c.get(s) || 0) + 1);
  console.log(`TOP ${size}: ` + [...c].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, n]) => `${n}/${g.length} "${s.slice(0, 60)}"`).join(' | '));
}

// REPLAY (for the chair's trigger only; nothing here is built): each tension's admitted lines on the FINAL record re-ranked
// by the ruled key `fnv1a32(key)` and by the mixed key `mix32(fnv1a32(key))` (murmur3 fmix32, as
// lane/kernel-mix-2026-11-20 :: proseHash.js :: mix32, inlined here: that branch is not merged). The same SHARE worst for
// each, so the mixed pick's effect is read before it is asked for.
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
for (const [label, keyed] of [['fnv', (k) => fnv1a32(k)], ['mixed', (k) => mix32(fnv1a32(k))]]) {
  let w = { r: 0 }; const over = [];
  for (const size of SIZES) for (const kind of KINDS) {
    const rows = ours.filter((x) => x.size === size && x.kind === kind); if (!rows.length) continue;
    const obs = new Map(); const exp = new Map();
    for (const x of rows) {
      const kept = [...x.admitted].sort((a, b) => keyed(`${x.seed}::trouble::${kind}::hook::${b}`) - keyed(`${x.seed}::trouble::${kind}::hook::${a}`)).slice(0, TROUBLE_HOOK_COUNT);
      for (const h of kept) obs.set(h, (obs.get(h) || 0) + 1);
      for (const a of x.admitted) exp.set(a, (exp.get(a) || 0) + Math.min(1, TROUBLE_HOOK_COUNT / x.admitted.length));
    }
    for (const [text, e] of exp) { const o = obs.get(text) || 0; const r = o / e; if (e < 5) continue;
      if (r > 1.5) over.push(`${size} ${kind} ${r.toFixed(2)}`);
      if (r > w.r) w = { r, o, e, size, kind, text }; }
  }
  console.log(`REPLAY ${label}: worst (expected >= 5) ${w.r.toFixed(2)} x, ${w.size} ${w.kind} ${w.o}/${w.e.toFixed(1)} "${w.text.slice(0, 60)}"; over 1.5: ${over.length} (${over.join(' · ')})`);
}
