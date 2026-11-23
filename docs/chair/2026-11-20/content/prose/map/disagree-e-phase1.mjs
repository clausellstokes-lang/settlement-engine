// PROSE-E PHASE 1, MEASURE ONLY (PROSE-6's builder; the chair's N64, brief `briefs/PROSE-E-PHASE1.md`). Read-only on a tree:
//   TREE=/home/user/wt-disagree node <script> [N=150]
// From a copy of `map/disagree-item4.mjs`: the four TRUE cell pairs of `map/DISAGREE-ITEM4.md` (P1-P4), every co-printing
// variant pair read WHOLE (no cap), over 900 births (`dz-<size>-<i>`, i < N). Pages are `buildPrintProse(s, {})`.
// WHICH VARIANT PRINTED (as item 4): the kernel's draw ledger (`withPresumptionLedger` around buildPrintProse) names the
// pool and vid a desk drew; a drawn vid counts as printed when the tooth's own matcher for that one vid hits the page
// (`matchersOf`, `pageTextsOf` of `tests/helpers/oppositeSentencePairs.mjs`, imported). All eight cells are on the helper's
// leaves (defense, economy, general).
// FOR EACH PAGE OF A PAIR: (a) the readings of every fact dimension that a variant of either cell declares in its marks, read
// through the vocabulary's own reader (`FACT_DIMENSIONS[dim].reader`; the crisis dimension through `atomHolds('crisis: <kind>')`);
// the facts are the desk entry's own (`factsAnswered(s, crisisAnswered(s, wallsAnswered(s, …)))`, as `disagree-phase2.mjs`);
// (b) each cell's eligible set (`eligibleVariants(pool, entry + audience 'dm' + the pool's own poolMeta brace)`), so the
// EMPTY-CELL test (remove one vid: is the set empty?) is answered per page and per vid.
const T = process.env.TREE || '/home/user/wt-disagree';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(R + 'domain/facts/presumptionLedger.js');
const { eligibleVariants } = await import(R + 'domain/display/stateProse/stateProseKernel.js');
const { factsAnswered } = await import(R + 'domain/facts/factsAnswered.js');
const { wallsAnswered } = await import(R + 'domain/defense/defenseFacts.js');
const { crisisAnswered } = await import(R + 'domain/crisis/crisisFacts.js');
const V = await import(R + 'domain/facts/factVocabulary.js');
const H = await import(T + '/tests/helpers/oppositeSentencePairs.mjs');
const LEAF = {};
for (const d of ['defense', 'economy', 'general']) LEAF[d] = Object.values(await import(R + `data/dossierStateProse/${d}.generated.js`))[0];
await loadGenerationLawPayloads();

const cell = (desk, position, pool) => Object.freeze({ desk, position, pool });
// THE FOUR CELL PAIRS (rows 1-4 of DISAGREE-ITEM4.md): [id, LACK cell, SUFFICIENCY cell].
const PAIRS = Object.freeze([
  ['P1', cell('general', 'DS-GEN-13', 'NO-MARKET'), cell('economy', 'DS-ECO-10', 'POSTURE: established')],
  ['P2', cell('defense', 'DS-DEF-3', 'Unsafe'), cell('defense', 'DS-DEF-2', 'Internal Security: full legal chain (court AND prison)')],
  ['P3', cell('economy', 'DS-ECO-9', 'PRESSURED'), cell('defense', 'DS-DEF-2', 'CHAIN: food trades working')],
  ['P4', cell('defense', 'DS-DEF-2', 'Economic Survival: CRITICAL'), cell('general', 'DS-GEN-17', 'GARRISONED')],
]);
const CELLS = PAIRS.flatMap(([, a, b]) => [a, b]);
const cellId = (c) => `${c.position}::${c.pool}`;
const poolOf = (c) => LEAF[c.desk][c.position].pools[c.pool];
const metaOf = (c) => LEAF[c.desk][c.position].poolMeta?.[c.pool] || {};
for (const c of CELLS) if (!Array.isArray(poolOf(c))) throw new Error(`no pool ${c.desk} ${cellId(c)}`);
const BY_ID = new Map(CELLS.map((c) => [cellId(c), c]));
const SIDES = new Map(); // `${cellId}::${vid}` -> one-vid side (held, so the helper's WeakMap cache holds)
const sideOf = (c, vid) => { const k = `${cellId(c)}::${vid}`; if (!SIDES.has(k)) SIDES.set(k, Object.freeze({ desk: c.desk, position: c.position, pool: c.pool, vids: Object.freeze([vid]) })); return SIDES.get(k); };
// The printed sentence itself: the shortest run of one to three whole sentences of a mount's text that the side matches.
const found = (res, texts) => {
  for (const t of texts) {
    if (!res.some((re) => re.test(t))) continue;
    const ss = t.split(/(?<=[.!?])\s+/);
    for (let w = 1; w <= 3; w++) for (let k = 0; k + w <= ss.length; k++) { const run = ss.slice(k, k + w).join(' '); if (res.some((re) => re.test(run))) return run; }
    for (const re of res) { const m = re.exec(t); if (m) return m[0]; }
  }
  return null;
};

// THE DECLARED DIMENSIONS of a pair: every mark of either cell's variants, as a vocabulary atom (a kernel mark dimension word
// through `MARK_DIMENSION_ATOM`, any other through `parseAtom`, a leading "no " dropped). One entry per dimension and key.
const atomOfMark = (m) => {
  for (const [d, words] of Object.entries(V.STATE_MARK_DIMENSIONS)) if (words.includes(m)) return V.MARK_DIMENSION_ATOM[d] ? V.parseAtom(V.MARK_DIMENSION_ATOM[d]) : null;
  return V.parseAtom(m.replace(/^no\s+/i, ''));
};
const dimsOf = (a, b) => {
  const out = new Map(); const unparsed = new Set();
  for (const c of [a, b]) for (const v of poolOf(c)) for (const m of [...(v.marks || []), ...(metaOf(c).declares || [])]) {
    const at = atomOfMark(m);
    if (!at) { unparsed.add(m); continue; }
    const k = at.dimension === 'crisis' ? 'crisis' : at.key ? `${at.dimension}: ${at.key}` : at.dimension;
    out.set(k, { dimension: at.dimension, key: at.key });
  }
  return { dims: [...out.entries()], unparsed: [...unparsed] };
};
const DIMS = new Map(PAIRS.map(([id, a, b]) => [id, dimsOf(a, b)]));
const readingOf = ({ dimension, key }, facts) => {
  if (dimension === 'crisis') { const on = V.CRISIS_KIND_WORDS.filter((k) => V.atomHolds(`crisis: ${k}`, facts) === true); return on.length ? on.join('+') : 'calm'; }
  const r = V.FACT_DIMENSIONS[dimension].reader;
  if (!r) return 'no reader';
  const x = r(facts, key, {});
  return x === undefined ? 'unanswered' : typeof x === 'number' ? (Math.round(x * 10) / 10) : String(x);
};

const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pages = new Map(CELLS.map((c) => [cellId(c), new Map()])); // cell -> seed -> Map(vid -> sentence)
const perPage = new Map(); // `${pairId}::${seed}` -> { readings, eligible: { a: vids[], b: vids[] } }
const sizeOf = {};
const tooth = { pairs: {}, old: 0 };
for (const settType of SIZES) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    sizeOf[seed] = settType;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const { result: pp, ledger } = withPresumptionLedger(() => buildPrintProse(s, {}));
    const texts = H.pageTextsOf(pp);
    const drawn = new Map();
    for (const e of ledger) if (BY_ID.has(e.pool) && typeof e.lineId === 'number') (drawn.get(e.pool) || drawn.set(e.pool, new Set()).get(e.pool)).add(e.lineId);
    for (const c of CELLS) {
      const said = new Map();
      for (const vid of drawn.get(cellId(c)) || []) { const t = found(H.matchersOf(sideOf(c, vid)), texts); if (t) said.set(vid, t.replaceAll(s.name, '{settlement}')); }
      if (said.size) pages.get(cellId(c)).set(seed, said);
    }
    const entry = { ...factsAnswered(s, crisisAnswered(s, wallsAnswered(s, { slots: { settlement: s.name } }))), audience: 'dm' };
    for (const [id, a, b] of PAIRS) {
      if (!pages.get(cellId(a)).has(seed) || !pages.get(cellId(b)).has(seed)) continue;
      const eligible = (c) => eligibleVariants(poolOf(c), { ...entry, ...(metaOf(c).declares ? { poolDeclares: metaOf(c).declares } : {}), ...(metaOf(c).crisisScoped ? { crisisScoped: true } : {}) }).map((v) => v.vid);
      perPage.set(`${id}::${seed}`, {
        readings: Object.fromEntries(DIMS.get(id).dims.map(([k, d]) => [k, readingOf(d, entry.facts)])),
        eligible: { a: eligible(a), b: eligible(b) },
      });
    }
    for (const pid of H.oppositePairsOnPage(texts)) (tooth.pairs[pid] ||= []).push(seed);
    for (const pin of H.PINNED_OLD_WORDS || []) if (H.sidePrinted(H.oldWordsMatchersOf(pin), texts)) tooth.old++;
  }
}

const count = (seeds) => { const by = Object.fromEntries(SIZES.map((z) => [z, 0])); for (const sd of seeds) by[sizeOf[sd]]++; return by; };
const tally = (rows) => { const t = {}; for (const r of rows) for (const [k, v] of Object.entries(r)) { (t[k] ||= {}); t[k][v] = (t[k][v] || 0) + 1; } return Object.entries(t).map(([k, vs]) => `${k}=${Object.entries(vs).sort((x, y) => y[1] - x[1]).map(([v, n]) => `${v}:${n}`).join(',')}`).join(' | '); };
console.log(`RUN ${N * SIZES.length} births`);
for (const [id, a, b] of PAIRS) {
  const A = pages.get(cellId(a)), B = pages.get(cellId(b));
  const both = [...A.keys()].filter((sd) => B.has(sd));
  const by = count(both);
  console.log(`\n=== ${id} | L ${a.desk} ${cellId(a)} | S ${b.desk} ${cellId(b)} | ${SIZES.map((z) => by[z]).join('/')} = ${both.length}`);
  const { dims, unparsed } = DIMS.get(id);
  console.log(`  DIMENSIONS declared: ${dims.map(([k]) => k).join('; ')}${unparsed.length ? ` | NOT AN ATOM: ${unparsed.join('; ')}` : ''}`);
  for (const [side, c] of [['A', a], ['B', b]]) for (const v of poolOf(c)) console.log(`  TEXT ${side} v${v.vid} {${(v.marks || []).join('; ')}} :: ${v.text}`);
  const vp = new Map();
  for (const sd of both) for (const va of A.get(sd).keys()) for (const vb of B.get(sd).keys()) { const k = `${va}x${vb}`; if (!vp.has(k)) vp.set(k, { va, vb, seeds: [] }); vp.get(k).seeds.push(sd); }
  const ranked = [...vp.values()].sort((x, y) => y.seeds.length - x.seeds.length || x.va - y.va || x.vb - y.vb);
  for (const v of ranked) {
    const vb_ = count(v.seeds);
    const rows = v.seeds.map((sd) => perPage.get(`${id}::${sd}`));
    const emptyA = rows.filter((r) => r.eligible.a.filter((x) => x !== v.va).length === 0).length;
    const emptyB = rows.filter((r) => r.eligible.b.filter((x) => x !== v.vb).length === 0).length;
    const inA = rows.filter((r) => r.eligible.a.includes(v.va)).length, inB = rows.filter((r) => r.eligible.b.includes(v.vb)).length;
    console.log(`  VP v${v.va} x v${v.vb}: ${SIZES.map((z) => vb_[z]).join('/')} = ${v.seeds.length} | seeds ${v.seeds.slice(0, 3).join(' ')}`);
    for (const sd of v.seeds.slice(0, 2)) console.log(`     ${sd} A: ${A.get(sd).get(v.va)}\n     ${sd} B: ${B.get(sd).get(v.vb)}`);
    console.log(`     READINGS: ${tally(rows.map((r) => r.readings))}`);
    console.log(`     ELIGIBLE: printed vid eligible A ${inA}/${rows.length} B ${inB}/${rows.length} | set empties without it: A v${v.va} ${emptyA}, B v${v.vb} ${emptyB} | A sets ${[...new Set(rows.map((r) => r.eligible.a.join(',')))].slice(0, 4).join(' ; ')} | B sets ${[...new Set(rows.map((r) => r.eligible.b.join(',')))].slice(0, 4).join(' ; ')}`);
  }
}
console.log(`\nCONTROL (the tooth's rows): OPPOSITE_PAIRS ${JSON.stringify(Object.fromEntries(Object.entries(tooth.pairs).map(([k, v]) => [k, v.length])))} (none = 0), PINNED_OLD_WORDS pages ${tooth.old}`);
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${N * SIZES.length} births`);
