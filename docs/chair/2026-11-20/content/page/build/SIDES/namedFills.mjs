// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/SIDES/namedFills.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SIDES/namedFills.out.txt 2>&1
// PAGE-9 SIDES: every `named` fill the reader makes on the owner's document over the born pools (the 300 and the 720), by
// row and by the power it names (and that power's roster category): for the chair to read the MEANS_CATEGORY call
// ('craft power' and 'merchant power' both read the roster's `economy` mark).
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { tensionSidesShown } = await import(`${L}/src/domain/display/tensionShown.js`);
const { TENSION_SIDE_MEANINGS } = await import(`${L}/src/data/tensionSideMeanings.js`);
const { powerNameWithArticle } = await import(`${L}/src/data/people/powerSentenceName.js`);
await loadGenerationLawPayloads();
/** @type {Map<string, number>} */ const tally = new Map();
/** @param {any} doc */
function measure(doc) {
  const fs = doc?.powerStructure?.factions || [];
  for (const t of doc?.history?.currentTensions || []) {
    const shown = tensionSidesShown(doc, t);
    (t.factions || []).forEach((/** @type {string} */ s, /** @type {number} */ i) => {
      const row = TENSION_SIDE_MEANINGS[s];
      if (!row?.named || shown[i] === undefined || shown[i] === s) return;
      const f = fs.find((/** @type {any} */ x) => shown[i].includes(powerNameWithArticle(x.faction, true)));
      const k = `${JSON.stringify(s)} (${row.means}) -> ${f ? `${JSON.stringify(f.faction)} [${f.category}${f.isGoverning ? ', governing' : ''}]` : JSON.stringify(shown[i])}`;
      tally.set(k, (tally.get(k) || 0) + 1);
    });
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) measure(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
for (const row of censusPlan('r2')) measure(generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
for (const [k, n] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`FILL ${String(n).padStart(4)} ${k}`);
