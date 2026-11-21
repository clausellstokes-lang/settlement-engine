// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/parity.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/parity.<when>.txt 2>&1
// PAGE-9 CAUSES-WIRING, point 2: THE PARITY MEASURE, BEFORE ANY WIRING. Over the chair's 300 (`hxd-<size>-<i>`) and the
// census's 720 (`censusPlan('r2')` + `configOf`; the births of build/CARD/bornHash.mjs), for every tension the served
// document still holds (matched by its kind: a town draws each kind once):
//   tensionCauseSentenceOf(owner, t) === tensionCauseSentenceOf(served, t')
// for EACH projection a non-owner page is given: toPublicSafe (the gallery/public default; dossierSearch's player view),
// toPublicSafe full (gallery_share_dm), publicVeiledRecordOf (the audience-gated readers' record), and each of the first two
// through the gallery veil's default set (galleryVeil.js :: projectShareVeil's applyVeil(resolveVeil(defaultVeilFor(pub)))).
// Any difference prints `DIFF` with the town, the kind and both sentences: it STOPS the builder. Also: how many tensions
// take a table's sentence (non-null) and how many keep the stored description (null), on the owner's document.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { toPublicSafe, publicVeiledRecordOf } = await import(`${L}/src/domain/display/publicSafe.js`);
const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${L}/src/domain/display/galleryVeil.js`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);

await loadGenerationLawPayloads();
const veiled = (/** @type {any} */ pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
/** @type {Record<string, (t: any) => any>} */
const PROJECTIONS = {
  'toPublicSafe': (t) => toPublicSafe(t),
  'toPublicSafe full': (t) => toPublicSafe(t, { full: true }),
  'publicVeiledRecordOf': (t) => publicVeiledRecordOf(t),
  'toPublicSafe + default veil': (t) => veiled(toPublicSafe(t)),
  'toPublicSafe full + default veil': (t) => veiled(toPublicSafe(t, { full: true })),
};
const c = { towns: 0, tensions: 0, sentence: 0, stored: 0, pairs: 0, same: 0, diff: 0, gone: 0 };
/** @type {Record<string, { pairs: number, diff: number, gone: number }>} */
const byProj = Object.fromEntries(Object.keys(PROJECTIONS).map((k) => [k, { pairs: 0, diff: 0, gone: 0 }]));
/** @type {Map<string, [number, number]>} */ const byKind = new Map();
/** @param {string} key @param {any} doc */
function measure(key, doc) {
  c.towns += 1;
  const ts = doc?.history?.currentTensions || [];
  const owner = ts.map((/** @type {any} */ t) => tensionCauseSentenceOf(doc, t));
  ts.forEach((/** @type {any} */ t, /** @type {number} */ i) => {
    c.tensions += 1;
    const k = byKind.get(t.type) || [0, 0];
    if (owner[i] === null) { c.stored += 1; k[1] += 1; } else { c.sentence += 1; k[0] += 1; }
    byKind.set(t.type, k);
  });
  for (const [proj, fn] of Object.entries(PROJECTIONS)) {
    const served = fn(doc);
    const sts = served?.history?.currentTensions || [];
    ts.forEach((/** @type {any} */ t, /** @type {number} */ i) => {
      const t2 = sts.find((/** @type {any} */ x) => x?.type === t.type);
      if (!t2) { c.gone += 1; byProj[proj].gone += 1; return; }
      c.pairs += 1; byProj[proj].pairs += 1;
      const s = tensionCauseSentenceOf(served, t2);
      if (s === owner[i]) { c.same += 1; return; }
      c.diff += 1; byProj[proj].diff += 1;
      console.log(`DIFF ${proj} ${key} ${t.type} owner ${JSON.stringify(owner[i])} served ${JSON.stringify(s)}`);
    });
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  measure(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
}
for (const row of censusPlan('r2')) measure(row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
for (const [k, [a, b]] of [...byKind].sort()) console.log(`KIND ${k} sentence ${a} stored ${b}`);
for (const [p, v] of Object.entries(byProj)) console.log(`PROJECTION ${p} ${JSON.stringify(v)}`);
console.log(`COUNTS ${JSON.stringify(c)}`);
