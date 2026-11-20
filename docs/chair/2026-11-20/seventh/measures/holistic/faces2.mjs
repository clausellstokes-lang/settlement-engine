const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { faceOfInstitution } = await import(`${L}/src/data/institutionalCatalog.js`);
await loadGenerationLawPayloads();
for (const [size, i] of [['village', 0], ['thorp', 0], ['thorp', 3]]) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  console.log(`\n== ${size}-${i} ${t.name} pop ${t.population} government "${t.powerStructure.government}"`);
  console.log('places with a face: ' + t.institutions.filter((x) => faceOfInstitution(x)).map((x) => `${x.name} [${faceOfInstitution(x)}]`).join(' · '));
  console.log('places with none:   ' + t.institutions.filter((x) => !faceOfInstitution(x)).map((x) => x.name).join(' · '));
  for (const n of t.npcs) console.log(`  person: ${n.name} | role ${n.role} | title ${n.title} | place ${n.institution?.key} (${n.institution?.title}) | memberships ${JSON.stringify((n.memberships || []).map((m) => m.key || m.power || m.name)).slice(0, 120)}`);
}
// across 50 villages: is there a person of religious kind where "Priest (resident)" stands?
let withPriestRow = 0, religiousPerson = 0, priestTitle = 0;
for (let i = 0; i < 50; i++) { const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village' }), null, { seed: `hxd-village-${i}`, customContent: {} });
  if (t.institutions.some((x) => x.name === 'Priest (resident)')) { withPriestRow++; if (t.npcs.some((n) => n.category === 'religious')) religiousPerson++; if (t.npcs.some((n) => /priest|pastor|cleric|chaplain/i.test(`${n.title} ${n.role}`))) priestTitle++; } }
console.log(`\nvillages with the row "Priest (resident)": ${withPriestRow}/50; of them with a named person of religious kind: ${religiousPerson}; with a priest's title or role: ${priestTitle}`);
