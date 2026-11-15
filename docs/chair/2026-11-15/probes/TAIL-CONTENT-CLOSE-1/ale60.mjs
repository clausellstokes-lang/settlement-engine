const W = process.argv[2];
const sh = await import(W + '/tests/lint/presumedThings.shared.mjs');
const { generateSettlementPipeline } = await import(W + '/src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await import(W + '/src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
let printed = 0, withAle = 0; const without = [];
for (let i = 0; i < 60; i++) { const seed = `presume-village-${i}`;
  const s = generateSettlementPipeline({ ...sh.corpusConfig('village') }, null, { seed, customContent: {} });
  if (!(s.institutions || []).some(x => /alehouses and/.test(String(x.desc)))) continue; printed++;
  const names = (s.institutions || []).map(x => x.name);
  if (names.some(n => /ale ?house|tavern|inn\b/i.test(n))) withAle++; else without.push(seed + JSON.stringify(names));
}
console.log('printed', printed, 'with an ale house/tavern/inn', withAle, 'without', without.length, without.join(' | '));
