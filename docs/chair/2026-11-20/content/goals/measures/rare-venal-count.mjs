const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { rareRowOf } = await import(`${L}/src/generators/people/rareSecrets.js`);
await loadGenerationLawPayloads();
const VENAL = new Set(['thumbOnScale', 'paidToForget', 'sellsSecrets', 'deserter']);
let cards = 0, rare = 0, venalRare = 0, paired = 0; const byKey = {}; const ex = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  for (const n of t.npcs || []) { cards++; const r = rareRowOf(n.secret); if (!r) continue; rare++; byKey[r.row.key] = (byKey[r.row.key] || 0) + 1;
    if (!VENAL.has(r.row.key)) continue; venalRare++;
    const cl = ['short', 'long'].map((v) => n.goal?.intent?.[v]).filter((x) => x?.family === 'PERSONALITY' && ['conviction', 'duty'].includes(x.kind));
    if (cl.length) { paired++; ex.push(`${size} ${t.name}: ${n.name} ${r.row.key} | ${n.goal.short} / ${n.goal.long}`); } } }
console.log(`cards ${cards} · rare secrets dealt ${rare} · of the venal-betrayal rare rows (${[...VENAL].join(', ')}) ${venalRare} · beside a conviction/duty want ${paired}`);
console.log('rare keys dealt: ' + Object.entries(byKey).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
for (const e of ex) console.log('  ' + e);
