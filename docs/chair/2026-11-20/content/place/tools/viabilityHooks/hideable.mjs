// PLACE-1 · viabilityHooks MEASURE, the chair's 17:13 condition: can any house that answers an atom the candidate rows
// need (market, institution: granary | mill | tavern | smith) be a HIDEABLE house (`people/cardVeil.js :: isHideableHouse`)?
// Two readings: (1) every catalogue row of every tier, matched by the atom's own home; (2) the 600 births' live rosters.
//   node hideable.mjs <repo> [rows.json is not needed] > out/hideable.txt
const [, , L] = process.argv;
const { institutionalCatalog } = await import(`${L}/src/data/institutionalCatalog.js`);
const { isHideableHouse } = await import(`${L}/src/domain/people/cardVeil.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
const { hasMarketInstitution } = await import(`${L}/src/domain/facts/market.js`);
const KINDS = ['granary', 'mill', 'tavern', 'smith'];
const rows = [];
for (const [tier, cats] of Object.entries(institutionalCatalog)) {
  for (const [cat, insts] of Object.entries(cats || {})) {
    for (const [name, def] of Object.entries(insts || {})) rows.push({ tier, category: cat, name, ...(typeof def === 'object' ? def : {}) });
  }
}
console.log(`catalogue rows read: ${rows.length}; hideable among them: ${rows.filter((r) => isHideableHouse(r)).length}`);
for (const atom of ['market', ...KINDS.map((k) => `institution: ${k}`)]) {
  const answers = (r) => (atom === 'market' ? hasMarketInstitution([r]) : hasInstitution({ institutions: [r] }, atom.split(': ')[1]));
  const hit = rows.filter((r) => { try { return answers(r) && isHideableHouse(r); } catch { return false; } });
  const any = rows.filter((r) => { try { return answers(r); } catch { return false; } }).length;
  console.log(`${atom.padEnd(22)} answered by ${String(any).padStart(3)} catalogue rows; by a hideable one: ${hit.length}${hit.length ? `  [${[...new Set(hit.map((r) => `${r.tier}/${r.name}`))].join('; ')}]` : ''}`);
}
