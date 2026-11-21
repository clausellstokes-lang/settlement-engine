// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/SIDES/craftCases.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SIDES/craftCases.<when>.txt 2>&1
// PAGE-9 SIDES, THE CRAFT RULING (the chair, 20:30 UTC): 'craft power' is never named by the economy mark. Over the born
// pools (the 300, the 720), every side whose row means 'craft power' and the words the reader shows for it, with the seed
// and corpus of each town: the born cases the red test pins.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionSidesShown } = await import(`${L}/src/domain/display/tensionShown.js`);
const { TENSION_SIDE_MEANINGS } = await import(`${L}/src/data/tensionSideMeanings.js`);
await loadGenerationLawPayloads();
let n = 0; let named = 0;
/** @param {string} corpus @param {string} seed @param {any} doc */
function measure(corpus, seed, doc) {
  const econ = (doc?.powerStructure?.factions || []).filter((/** @type {any} */ f) => f?.category === 'economy').map((/** @type {any} */ f) => f.faction);
  for (const t of doc?.history?.currentTensions || []) {
    const shown = tensionSidesShown(doc, t);
    (t.factions || []).forEach((/** @type {string} */ s, /** @type {number} */ i) => {
      if (TENSION_SIDE_MEANINGS[s]?.means !== 'craft power') return;
      n += 1; if (shown[i] !== s) named += 1;
      console.log(`CRAFT ${corpus} ${seed} ${t.type} ${JSON.stringify(s)} -> ${JSON.stringify(shown[i])} (economy powers ${JSON.stringify(econ)})`);
    });
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) { const seed = `hxd-${size}-${i}`; measure('hxd300', seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })); }
for (const row of censusPlan('r2')) measure('census720', row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
console.log(`COUNTS craft sides ${n}; shown other than their own words ${named}`);
