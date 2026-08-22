/**
 * RS-4 config generator — census + SK-4 array from the 9ed2436c archive's own modules.
 * Difference from RS-1 (recorded judgment): ca-row ids are CONTENT-DERIVED (fnv1a32 of the
 * row's rules JSON) so the seed ledger's densityKey never smears across array
 * regenerations; `dark-control`/`maximal-lawful` keep their structural names so RS-1's
 * standing finding identities (§206.2b KNOWN) still match.
 */
const RS4 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/rs5';
const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/rs5-config.json';

const { flagDomainCensus } = await import(`${RS4}/scripts/audit/soakRules.mjs`);
const { buildCoveringArray } = await import(`${RS4}/scripts/soak/coveringArray.mjs`);
const { manifestDefects } = await import(`${RS4}/scripts/soak/flagConstraints.mjs`);
const { tripwireRegistryDefects } = await import(`${RS4}/scripts/soak/tripwires.mjs`);
const { dispatchRefusals, ROLLING_PROFILE } = await import(`${RS4}/scripts/soak/rolling.mjs`);
const { ladderRefusals } = await import(`${RS4}/scripts/soak/ladder.mjs`);
const {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} = await import(`${RS4}/src/domain/worldPulse/simulationRules.js`);
const { writeFileSync } = await import('node:fs');

const gate = dispatchRefusals({ tmSkLanded: true, exposureIsTmSkOwn: false, fableAuditPassed: true });
console.log('dispatchRefusals:', JSON.stringify(gate));

const census = flagDomainCensus({
  defaults: DEFAULT_SIMULATION_RULES,
  presets: SIMULATION_RULE_PRESETS,
  virtualKeys: ENGINE_GATED_VIRTUAL_RULE_KEYS,
});
console.log('census:', JSON.stringify({
  governed: census.governed.length,
  ungoverned: census.ungoverned.length,
  virtual: census.virtual.length,
  union: census.union.length,
  nonBoolean: census.nonBoolean.length,
  overlap: census.overlap,
  hasAdvanceEpoch: census.union.includes('advanceEpochEnabled'),
}));
console.log('manifestDefects:', JSON.stringify(manifestDefects(census)));
console.log('tripwireRegistryDefects:', JSON.stringify(tripwireRegistryDefects()));

const built = buildCoveringArray(census);
console.log('coveringArray:', JSON.stringify({
  rows: built.rows.length,
  factors: built.factors.length,
  targetPairs: built.coverage.targetPairs,
  coveredPairs: built.coverage.coveredPairs,
  uncovered: built.coverage.uncovered.length,
  constraintForbidden: built.coverage.constraintForbidden,
  band: built.coverage.band,
  refusals: built.refusals,
}));

const seeds = ['w0-soak', 'w0-soak-b', 'w0-soak-c'];
const ladder = ladderRefusals({
  rung: 'cert-30', years: 30, sampledTicks: false,
  seedCount: seeds.length, fullSeedCount: seeds.length,
  atPhaseBoundary: false, differential: false,
});
console.log('ladderRefusals:', JSON.stringify(ladder));

if (gate.length || built.refusals.length || ladder.length
  || manifestDefects(census).length || tripwireRegistryDefects().length) {
  console.error('REFUSED — a gate above is non-empty; no config written.');
  process.exit(2);
}

function fnv1a32(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const rows = built.rows.map((rules, index) => ({
  id: index === 0 ? 'dark-control' : index === 1 ? 'maximal-lawful' : `ca-${fnv1a32(JSON.stringify(rules))}`,
  rules,
}));
const ids = new Set(rows.map((row) => row.id));
if (ids.size !== rows.length) { console.error('REFUSED — duplicate content-derived row id'); process.exit(2); }

const config = { profile: ROLLING_PROFILE, seeds, years: 30, settlements: 4, rows };
writeFileSync(OUT, `${JSON.stringify(config, null, 2)}\n`);
console.log('config written:', OUT, 'cells:', seeds.length * rows.length);
