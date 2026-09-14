const R = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepLIGHT';
const { generateSettlementPipeline } = await import(`${R}/src/generators/generateSettlementPipeline.js`);
const V = await import(`${R}/src/domain/content/livingContentLawVersion.js`);
const B = await import(`${R}/src/domain/density/densityCreateBoundary.js`);
const { rateGrid } = await import(`${R}/scripts/prose-rate-corpus.mjs`);
const PACK = await import(`${R}/tests/fixtures/customContentReferencePack.js`);
await B.loadGenerationLawPayloads();
const cc = PACK.identifyCustomContentPack(PACK.customContentReferencePack());
const towns = rateGrid();
let roster = 0, prov = 0, both = 0, n = 0, moved = 0;
const KEY = V.LIVING_CONTENT_LAW_CONFIG_KEY;
for (let i = 0; i < towns.length; i += 8) {
  const t = towns[i]; n++;
  const dark = generateSettlementPipeline({ ...t.config }, null, { seed: t.seed, customContent: cc });
  const lit = generateSettlementPipeline({ ...t.config, [KEY]: 2 }, null, { seed: t.seed, customContent: cc });
  const strip = (s) => { const c = { ...s }; delete c.customContentRoster;
    c.config = { ...c.config }; delete c.config[KEY];
    if (c._config) { c._config = { ...c._config }; delete c._config[KEY]; }
    return JSON.stringify(c); };
  if (strip(dark) !== strip(lit)) moved++;
  const hasR = Object.hasOwn(lit, 'customContentRoster');
  const hasP = Object.hasOwn(lit, 'customContentProvenance');
  if (hasR) roster++; if (hasP) prov++; if (hasR && hasP) both++;
}
console.log(`RATE sample every 8th town, N=${n} (reference pack loaded):`);
console.log(`  lit runs writing customContentRoster:     ${roster}/${n}`);
console.log(`  lit runs writing customContentProvenance: ${prov}/${n}`);
console.log(`  both:                                     ${both}/${n}`);
console.log(`  runs where any NON-roster NON-marker byte moved between law 1 and law 2: ${moved}/${n}`);
