// The chair's measure (2026-11-20): how many places of each size share their "recent conflict" sentence (powerStructure.recentConflict), names masked.
const [, , L, n = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const size of SIZES) {
  const counts = new Map(); let none = 0;
  for (let i = 0; i < +n; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    let s = t.powerStructure?.recentConflict;
    if (!s || typeof s !== 'string') { none++; continue; }
    // mask this town's own proper names so two towns sharing a sentence count as one
    const names = new Set([t.name, ...(t.npcs || []).flatMap((p) => String(p.name || '').split(/\s+/)), ...(t.powerStructure?.factions || []).map((f) => f.name || f.faction)].filter((x) => x && x.length > 2));
    for (const nm of [...names].sort((a, b) => b.length - a.length)) s = s.split(nm).join('#');
    counts.set(s, (counts.get(s) || 0) + 1);
  }
  const rows = [...counts].sort((a, b) => b[1] - a[1]);
  console.log(`== ${size}: ${n} places; none ${none}; distinct ${rows.length}; top share ${rows[0] ? rows[0][1] : 0}/${n}`);
  for (const [s, c] of rows.slice(0, 4)) console.log(`   ${String(c).padStart(3)}  ${s.slice(0, 150)}`);
}
