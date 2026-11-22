// PLACE-1 · entrepotNote MEASURE, section F: what the candidate composer would store in the towns a test or a proof reads.
// tests/generators/bar3PlacesRows.test.js pins the canonical furs note on r2r-city-0 (its KEEP/CURED row "C14378 no
// northern furs"), born by the census's config (= pageCensusWalk.shared.mjs :: configOf, the same DIALS); section 0's two
// rendered towns are added. Usage (repo root): node <this> <repo> > out/pins.txt
const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { chainCarrierOf } = await import(`${L}/src/domain/facts/chainCarrier.js`);
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { compose } = await import('./composer.mjs');
await loadGenerationLawPayloads();
for (const seed of ['r2r-city-0', 'r2r-town-3', 'r2r-city-2']) {
  const row = censusPlan('r2').find((x) => x.seed === seed);
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  const f = factsOf(t);
  const r = { seed, route: tradeRouteOf(t), facts: { market: f.market, inst: Object.fromEntries(['tavern', 'bank', 'docks'].map((k) => [k, f.hasInstitution(k)])) } };
  console.log(`${seed} (route ${r.route})`);
  for (const c of (t.economicState?.activeChains || []).filter((x) => x.entrepotNote)) {
    const ch = { id: c.chainId, note: c.entrepotNote, carrier: chainCarrierOf(c, t).kind };
    const a = compose({ fnv1a32, hashKey }, r, ch);
    console.log(`   ${ch.id} (carrier ${ch.carrier}; printed ${!!(c.entrepot && !c.dependency)}): ${a.id} [${a.how}] "${a.text}"`);
  }
}
