// How often would a ruler's title become a culture word, once the table is wired? 300 fresh towns at untouched settings.
const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const T = await import(`${L}/src/data/cultureOfficeTitles.js`);
await loadGenerationLawPayloads();
const rows = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  const government = t.powerStructure.government; const culture = t.culturalIdentity?.key; const tier = t.tier;
  const family = T.officeFamilyOfForm(government);
  const withCulture = family ? T.officeTitleIn({ family, tier, culture, government }) : null;
  const without = family ? T.officeTitleIn({ family, tier, culture: null, government }) : null;
  rows.push({ tier, culture, government, family, withCulture, without, changed: !!family && withCulture !== without });
}
const pct = (a, n) => `${a}/${n} (${n ? Math.round(100 * a / n) : 0}%)`;
console.log(`towns ${rows.length}; a form with no family in the table: ${rows.filter((r) => !r.family).length}`);
console.log(`THE CULTURE CHANGES THE RULER'S WORD: ${pct(rows.filter((r) => r.changed).length, rows.length)}`);
for (const size of SIZES) { const g = rows.filter((r) => r.tier === size); console.log(`  ${size.padEnd(11)} ${pct(g.filter((r) => r.changed).length, g.length)}`); }
const byC = new Map(); for (const r of rows) { const o = byC.get(r.culture) || { n: 0, c: 0 }; o.n++; if (r.changed) o.c++; byC.set(r.culture, o); }
console.log('by culture: ' + [...byC].sort((a, b) => b[1].c / b[1].n - a[1].c / a[1].n).map(([k, o]) => `${k} ${Math.round(100 * o.c / o.n)}%`).join(' · '));
const seen = new Set(); console.log('EXAMPLES (today -> with the table):');
for (const r of rows.filter((x) => x.changed)) { const k = `${r.culture}|${r.family}|${r.tier}`; if (seen.has(k) || seen.size >= 18) continue; seen.add(k); console.log(`  ${r.culture} ${r.tier}, ${r.government}: ${typeof r.without === 'object' ? JSON.stringify(r.without) : r.without} -> ${typeof r.withCulture === 'object' ? JSON.stringify(r.withCulture) : r.withCulture}`); }
const fam = new Map(); for (const r of rows.filter((x) => !x.changed && x.family)) fam.set(`${r.family}`, (fam.get(r.family) || 0) + 1);
console.log('unchanged towns by family: ' + [...fam].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(' · '));
