// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/firstTrouble.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/firstTrouble.out.txt 2>&1
// PAGE-9 CAUSES-WIRING, the chair's condition (d) of 20:44 UTC: on 150 towns a size (`hxd-<size>-0..149`, DEFAULT_CONFIG
// untouched), the commonest sentence the Overview list prints for the FIRST trouble, BEFORE the wiring (the stored
// `description`, as OverviewTab.jsx prints `t.description`) and AFTER it (`tensionCauseSentenceOf(record, t) ?? description`,
// the wiring's `tensionSentenceShown`), with its share per size. Read-only: nothing is wired by this script.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
await loadGenerationLawPayloads();
const N = 150;
/** @param {Map<string, number>} m */
const top = (m) => [...m].sort((a, b) => b[1] - a[1])[0] || ['(none)', 0];
for (const size of SIZES) {
  /** @type {Map<string, number>} */ const before = new Map();
  /** @type {Map<string, number>} */ const after = new Map();
  let withTrouble = 0;
  for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const t = doc?.history?.currentTensions?.[0];
    if (!t) continue;
    withTrouble += 1;
    const b = typeof t === 'object' ? String(t.description ?? '') : String(t);
    const a = (typeof t === 'object' ? tensionCauseSentenceOf(doc, t) : null) ?? b;
    before.set(b, (before.get(b) || 0) + 1);
    after.set(a, (after.get(a) || 0) + 1);
  }
  const [bs, bn] = top(before); const [as, an] = top(after);
  const pct = (/** @type {number} */ n) => `${((100 * n) / N).toFixed(1)}%`;
  console.log(`SIZE ${size} towns ${N} with a first trouble ${withTrouble}; distinct first sentences before ${before.size} after ${after.size}`);
  console.log(`  BEFORE ${pct(bn)} (${bn}/${N}) ${JSON.stringify(bs)}`);
  console.log(`  AFTER  ${pct(an)} (${an}/${N}) ${JSON.stringify(as)}`);
}
