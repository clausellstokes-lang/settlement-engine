// PAGE-7 measure: guild_conflict current tensions in towns where the guild's own fact home
// (src/domain/facts/guild.js :: guildOf, read as factsOf(record).guild) answers "no guild".
// Towns: PAGE-5's 900 (hxd-<size>-<i>, i=0..149, every size in SIZES), built as page-5/sim.mjs builds them.
// Usage: node guildless.mjs <checkout root> [n=150] [prefix=hxd]
const [, , L = process.cwd(), nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { guildOf, guildHouseStands } = await import(`${L}/src/domain/facts/guild.js`);
await loadGenerationLawPayloads();
const by = {}; const records = []; let total = 0, guildless = 0, disagree = 0;
for (const size of SIZES) {
  by[size] = { towns: 0, gc: 0, guildless: 0 };
  for (let i = 0; i < +nA; i++) {
    const seed = `${prefix}-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    by[size].towns++;
    const g = !!factsOf(t).guild; if (g !== guildOf(t)) disagree++;
    const n = (t.history?.currentTensions || []).filter((x) => x.type === 'guild_conflict').length;
    if (!n) continue;
    by[size].gc += n; total += n;
    if (!g) {
      by[size].guildless += n; guildless += n;
      records.push({ seed, size, population: t.population, house: guildHouseStands(t),
        institutions: (t.institutions || []).map((x) => x.name), powers: (t.powerStructure?.factions || []).map((f) => `${f.faction || f.name} [${f.category}]`) });
    }
  }
}
console.log(`HOME src/domain/facts/guild.js :: guildOf (factsOf(record).guild); factsOf vs guildOf disagreements: ${disagree}`);
for (const size of SIZES) console.log(`SIZE ${size}: towns ${by[size].towns}, guild_conflict ${by[size].gc}, guildless ${by[size].guildless}`);
console.log(`TOTAL guild_conflict ${total}, guildless ${guildless}`);
for (const r of records) console.log(`REC ${r.seed} | ${r.size} | pop ${r.population} | house ${r.house} | inst: ${r.institutions.join('; ')} | powers: ${r.powers.join('; ')}`);
