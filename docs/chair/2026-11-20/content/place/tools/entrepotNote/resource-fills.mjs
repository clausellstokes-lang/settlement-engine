// PLACE-1 · entrepotNote BUILD: the chair's condition (c) of 17:18 UTC, "Print EVERY distinct {resource} fill inside its
// sentence over the 600 places". Births the 600 exactly as the chair's census births them (hxd-<size>-0..99, the birth
// line of measure.mjs), and for every noted chain whose carrier is the place's own lists each own row of its pool filled
// with the record's own resource label (`entrepotNotes.js :: entrepotNoteTextOf`): the sentence, the places where the row
// stood open to the draw (its needs held), and the places whose stored note is that sentence.
//   node docs/chair/2026-11-20/content/place/tools/entrepotNote/resource-fills.mjs <repo> > .../out/../resource-fills.txt
const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { declarationAdmits, declarationOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { ENTREPOT_NOTES, entrepotNotePoolOf, entrepotNoteTextOf } = await import(`${L}/src/data/entrepotNotes.js`);
const { SUPPLY_CHAIN_NEEDS } = await import(`${L}/src/data/supplyChainData.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const catalogue = (id) => { for (const n of Object.values(SUPPLY_CHAIN_NEEDS)) for (const c of n.chains) if (c.id === id) return c.entrepotNote; return null; };
const slotted = new Set(Object.values(ENTREPOT_NOTES).flat().filter((r) => typeof r.text === 'string' && r.text.includes('{resource}')).map((r) => r.id));
/** @type {Map<string, { open: number, stored: number, sizes: Set<string> }>} */
const seen = new Map();
let births = 0;
for (const size of SIZES) {
  for (let i = 0; i < 100; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    births++;
    const facts = factsOf(t);
    for (const c of (t.economicState?.activeChains || []).filter((x) => x && x.entrepotNote)) {
      const pool = entrepotNotePoolOf(c);
      if (!pool) continue;
      const rows = pool.map((r) => ({ ...r, text: entrepotNoteTextOf(r, c, t, catalogue(c.chainId)) }));
      for (const r of rows) {
        if (!slotted.has(r.id)) continue;
        if (!declarationAdmits(declarationOf(r), facts, { ctx: { chain: c } }).admitted) continue;
        const k = `${c.chainId}\t${r.id}\t${r.text}`;
        const e = seen.get(k) || { open: 0, stored: 0, sizes: new Set() };
        e.open++; e.sizes.add(size); if (c.entrepotNote === r.text) e.stored++;
        seen.set(k, e);
      }
    }
  }
}
console.log(`EVERY DISTINCT {resource} FILL, in its sentence, over the ${births} census births (hxd-<size>-0..99).`);
console.log('open = places where the own row stood admitted (the chain carried by the place\'s own resource); stored = places whose stored note is this sentence.');
console.log(`own rows with the slot: ${[...slotted].join(', ')}`);
console.log('');
for (const [k, e] of [...seen].sort((a, b) => a[0].localeCompare(b[0]))) {
  const [chain, id, text] = k.split('\t');
  console.log(`${chain.padEnd(14)} ${id.padEnd(14)} open ${String(e.open).padStart(3)}  stored ${String(e.stored).padStart(3)}  (${[...e.sizes].join(', ')})  "${text}"`);
}
console.log('');
console.log(`distinct fills: ${seen.size}`);
