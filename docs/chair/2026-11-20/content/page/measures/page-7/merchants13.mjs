// PAGE-7 CAUSES-DATA addendum 4, item 4: the outside_debt sentence, through the built function, on every one of sim.mjs's
// 900 towns (hxd-<size>-0..149) whose governing power is of category economy and whose live tensions hold outside_debt.
// One line each: `<seed>: <sentence>` and the cause it speaks for. Run: node <this> $PWD 150 > merchants13.out.txt
const [, , L, nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
await loadGenerationLawPayloads();
const owner = (s) => {
  const t = TENSION_CAUSES.outside_debt;
  for (const c of t.causes) if (c.wordings.some((w) => w.text === s || (w.text.includes('{power}') && new RegExp(`^${w.text.split('{power}').map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+')}$`).test(s)))) return c.id;
  return t.plain.some((w) => w.text === s) ? 'plain' : '?';
};
let n = 0; const by = {};
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const gov = (t.powerStructure?.factions || []).find((f) => f.isGoverning);
  const debt = (t.history?.currentTensions || []).find((x) => x.type === 'outside_debt');
  if (gov?.category !== 'economy' || !debt) continue;
  const s = tensionCauseSentenceOf(t, debt); const c = owner(String(s)); by[c] = (by[c] || 0) + 1; n++;
  const econ = (t.powerStructure?.factions || []).filter((f) => f.category === 'economy').length;
  console.log(`${seed}: ${s}   [${c}; governing ${gov.faction}; economy powers ${econ}]`);
}
console.log(`TOWNS ${n} (governed by a power of trade, an outside_debt tension live) · ${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
