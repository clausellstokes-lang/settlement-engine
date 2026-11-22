// Is there a named person for every place that should have one, at every size? 300 fresh towns at untouched settings.
const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { faceOfInstitution } = await import(`${L}/src/data/institutionalCatalog.js`);
await loadGenerationLawPayloads();
const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const f1 = (x) => x.toFixed(1);
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
let shape = null;
console.log('size        places  places-that-carry-a-face  of-those-with-a-named-person  WITHOUT-one  named-people  people-with-no-place');
for (const size of SIZES) {
  const rows = []; const missing = []; const facedNames = [];
  for (let i = 0; i < +nA; i++) {
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    if (!shape) shape = JSON.stringify(t.npcs[0]?.institution)?.slice(0, 300);
    const instOf = (n) => { const v = n.institution; return typeof v === 'string' ? v : (v && (v.name || v.key || v.id)) || null; };
    const held = new Set((t.npcs || []).map(instOf).filter(Boolean).map(String));
    const faced = (t.institutions || []).filter((x) => faceOfInstitution(x));
    const withP = faced.filter((x) => held.has(String(x.name)) || held.has(String(x.catalogId)) || held.has(String(x.id)));
    for (const x of faced) { facedNames.push(x.name); if (!withP.includes(x)) missing.push(`${x.name} [${faceOfInstitution(x)}]`); }
    rows.push({ inst: t.institutions.length, faced: faced.length, withP: withP.length, npcs: t.npcs.length, noPlace: (t.npcs || []).filter((n) => !instOf(n)).length });
  }
  console.log(`${size.padEnd(11)} ${f1(mean(rows.map((r) => r.inst))).padStart(6)} ${f1(mean(rows.map((r) => r.faced))).padStart(14)} ${f1(mean(rows.map((r) => r.withP))).padStart(24)} ${f1(mean(rows.map((r) => r.faced - r.withP))).padStart(20)} ${f1(mean(rows.map((r) => r.npcs))).padStart(13)} ${f1(mean(rows.map((r) => r.noPlace))).padStart(14)}`);
  console.log(`            most often WITHOUT a named person: ${tally(missing).slice(0, 7).map(([k, c]) => `${k} ${c}/${nA}`).join(' · ') || '(none)'}`);
}
console.log('\nshape of a person\'s place field:', shape);
