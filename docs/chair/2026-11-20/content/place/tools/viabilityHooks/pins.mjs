// PLACE-1 · viabilityHooks MEASURE, section F: what the candidate composer would store in the pinned test towns and in
// section 0's towns. Born by the page census's plan (`configOf(censusPlan('r2'))`, as prove-prints.mjs). The facts are the
// final record's (equal to the proposed call line's on every atom the rows use: section C).
//   node pins.mjs <repo> > out/pins.txt
const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { compose } = await import('./composer.mjs');
const { templateOf } = await import('./templates.mjs');
await loadGenerationLawPayloads();
const plan = censusPlan('r2');
const SEEDS = [
  ['tests/generators/tailCrisisIronHooks.test.js', ['r2r-town-20', 'r2r-town-1', 'r2r-town-17', 'r2r-town-49', 'r2r-town-26']],
  ['tests/generators/tailDefeconBatch3Lines.test.js (row 20893)', ['r2r-town-1']],
  ['tests/generators/outlookHookDropRefused.test.js', ['r2r-thorp-17', 'r2r-town-9', 'r2r-village-24']],
  ['section 0', ['r2r-town-3', 'r2r-town-5', 'r2r-village-4']],
];
const INST = ['granary', 'mill', 'tavern', 'smith'];
for (const [file, seeds] of SEEDS) {
  console.log(`== ${file}`);
  for (const seed of seeds) {
    const row = plan.find((r) => r.seed === seed);
    const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
    const f = factsOf(t);
    const facts = { route: f.route, terrain: f.terrain, war: f.warState, market: f.market, guild: f.guild, inst: Object.fromEntries(INST.map((k) => [k, f.hasInstitution(k)])) };
    const place = { seed, atWriter: { facts } };
    for (const h of t.economicViability?.plotHooks || []) {
      const hook = { hook: h.hook, masked: h.hook, template: templateOf(h.hook) };
      const c = compose({ fnv1a32, hashKey }, place, hook);
      console.log(`   ${seed} [${hook.template}] ${c.id === null ? 'untouched' : c.text === h.hook ? `unchanged (${c.id})` : `-> ${c.id}: "${c.text}"`}`);
      if (c.id !== null) console.log(`      was: "${h.hook}"`);
    }
  }
}
