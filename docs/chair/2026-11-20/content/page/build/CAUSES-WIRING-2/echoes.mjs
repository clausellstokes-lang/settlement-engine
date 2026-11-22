// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/CAUSES-WIRING-2/echoes.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/CAUSES-WIRING-2/echoes.out.txt 2>&1
// PAGE-13's CAUSES-WIRING-2, step 2's "one trouble in two ways", MEASURED before the wiring (read-only): over the 300
// (`hxd-<size>-<i>`) and the census's 720, on the owner's document,
//   ECHO   a historical event whose stored description is, word for word, a live tension's stored description (the PDF's
//          B4 drops that event's description: "a sentence a live tension carries prints there only"); split by whether the
//          tension's kind takes a table's sentence (then the tension row prints the cause sentence and the event's echo
//          would be a SECOND wording of the same trouble);
//   MARK   an event whose "still relevant" mark (`historyOpenThreads.js :: eventHasOpenThread`) differs when the tensions'
//          text searched is the sentence shown (`cause ?? description`) instead of the stored description.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
const { eventHasOpenThread } = await import(`${L}/src/domain/display/historyOpenThreads.js`);
await loadGenerationLawPayloads();
const c = { towns: 0, events: 0, echoTabled: 0, echoStored: 0, markMoves: 0 };
/** @param {string} key @param {any} doc */
function measure(key, doc) {
  c.towns += 1;
  const h = doc?.history || {};
  const ts = (h.currentTensions || []).filter((/** @type {any} */ t) => t && typeof t === 'object');
  const shownH = { ...h, currentTensions: ts.map((/** @type {any} */ t) => ({ ...t, description: tensionCauseSentenceOf(doc, t) ?? t.description })) };
  for (const ev of h.historicalEvents || []) {
    c.events += 1;
    const t = ts.find((/** @type {any} */ x) => typeof x.description === 'string' && x.description === ev?.description);
    if (t) {
      const tabled = tensionCauseSentenceOf(doc, t) !== null;
      if (tabled) c.echoTabled += 1; else c.echoStored += 1;
      console.log(`ECHO ${key} ${t.type} ${tabled ? 'TABLED' : 'stored'} event ${JSON.stringify(ev?.name)} ${JSON.stringify(ev?.description)}`);
    }
    const a = eventHasOpenThread(ev, h); const b = eventHasOpenThread(ev, shownH);
    if (a !== b) { c.markMoves += 1; console.log(`MARK ${key} event ${JSON.stringify(ev?.name)} stored ${a} shown ${b}`); }
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  measure(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
}
for (const row of censusPlan('r2')) measure(row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
console.log(`COUNTS ${JSON.stringify(c)}`);
