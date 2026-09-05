#!/usr/bin/env node
/**
 * birth-fixtures.mjs — OUTPUT (f): A REAL-BIRTH NEW-CAMPAIGN FIXTURE PER PRESET.
 *
 * usage: node birth-fixtures.mjs --tree <TREE> --out <FILE.json> [--preset <id>] [--dry]
 *
 * ⛔⛔ THE FENCE, AND THE HALF OF IT THAT IS EASY TO MISREAD.
 * PLAN §6 POSITION 1: the fixture goes "through `createCampaign` -> `buildNewCampaign` /
 * `createImportedCampaign`, NEVER through `SIMULATION_RULE_PRESETS[id].rules`."
 *
 * That fence is about the OUTPUT, not the INPUT. Reading `SIMULATION_RULE_PRESETS[id].rules`
 * and calling the result "the preset's rules" is the error, because that table NEVER RUNS THE
 * NORMALIZER: the mirror-key lockstep (faithSpread <-> religionDynamics), the fail-closed
 * boolean coercion, the PROFILE_KEYS materialize branch and `presetId` inference all go
 * unmeasured. The product's OWN preset-application path feeds exactly that table in as a PATCH
 * (`useRealmInspector.js:244`: `updateCampaignSimulationRules(activeCampaignId, preset.rules)`),
 * so passing it as the patch here is the faithful act. What must never be done is taking it
 * as the ANSWER.
 *
 * ⚠ CORRECTION (L-OVERLAY, 2026-09-05) — THIS HEADER USED TO CALL THAT TABLE "A SPARSE
 * OVERRIDE TABLE … it omits every DEFAULT_SIMULATION_RULES key the preset does not override".
 * MEASURED FALSE at 38474a59e: `preset(id, label, overrides)` (simulationRules.js:501) builds
 * `rules` as `{ ...DEFAULT_SIMULATION_RULES, presetId: id, ...overrides }`, so every preset
 * table is ALREADY TOTAL over the 36 default keys — keys missing from DEFAULT: 0, for all
 * seven. And because no shipped override needs a coercion or a lockstep, the normalizer is a
 * FIXED POINT on each table (norm(table) === table, byte for byte, all seven). The fence above
 * is still right, but for the second reason only, and the fixed point is a MEASURED PROPERTY
 * OF TODAY'S TABLES rather than a guarantee — see `preset-seam.mjs`, which guards it.
 *
 * THE PATH, TERM FOR TERM FROM THE PRODUCT:
 *   1. `buildNewCampaign(state, name)`            src/store/campaignImportedCreation.js — the
 *      REAL birth. `createCampaign` (campaignSlice.js:588) and `createImportedCampaign`
 *      (:602 -> createImportedCampaignWithReceipt) BOTH call it, and it is the only place a
 *      new campaign envelope is minted.
 *   2. `prepareRulesUpdate(worldState, patch, wizardNews, now)`
 *      src/domain/worldPulse/simulationProfile.js — described in the store as "the single
 *      normalization/receipt choke point", and the ONE thing
 *      `runUpdateCampaignSimulationRules` does to the rules
 *      (src/store/campaignWorldPulseDeferred.js:395).
 *
 * WHY NOT DRIVE THE ZUSTAND ACTION ITSELF. `updateCampaignSimulationRules` is async and
 * fences on a live auth session, an in-flight-advance read, a cloud upsert and a device
 * cache write. Standing a store up to reach a PURE rules computation would put four
 * service mocks between the probe and the thing measured, and a fixture whose value
 * depends on a mock is not a control. The seam taken here is the product's own choke
 * point with the product's own arguments; the store layer around it moves no rule.
 *
 * DETERMINISM. `buildNewCampaign` legitimately reads the wall clock and mints a UUID (the
 * store boundary is where the estate's temporal law lets the clock in). Those two fields
 * are therefore EXCLUDED FROM THE HASH BY NAME, not smuggled out: the hash covers the
 * RESOLVED RULES ONLY, which is the thing the wave will move. `now` into
 * `prepareRulesUpdate` is PINNED.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const TREE = flag('tree');
const OUT = flag('out');
const ONLY = flag('preset');
const DRY = has('dry');

if (!TREE || !OUT) {
  console.error('usage: node birth-fixtures.mjs --tree <TREE> --out <FILE.json> [--preset <id>] [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const out = resolve(OUT);

// PINNED — one instant for every fixture, so the receipt half of prepareRulesUpdate is
// as reproducible as the rules half.
const PINNED_NOW = '2026-07-12T00:00:00.000Z';
// The two fields `buildNewCampaign` legitimately draws from ambience. NAMED, never hidden.
const VOLATILE_BIRTH_FIELDS = Object.freeze(['id', 'createdAt', 'updatedAt']);

if (DRY) {
  console.log(JSON.stringify({
    dry: true,
    tree,
    out,
    preset: ONLY ?? '(every id in SIMULATION_RULE_PRESETS)',
    pinnedNow: PINNED_NOW,
    volatileBirthFieldsExcludedFromHash: VOLATILE_BIRTH_FIELDS,
    wouldImport: [
      join(tree, 'src/store/campaignImportedCreation.js'),
      join(tree, 'src/domain/worldPulse/simulationRules.js'),
      join(tree, 'src/domain/worldPulse/simulationProfile.js'),
    ],
    path: ['buildNewCampaign(state, name)', 'prepareRulesUpdate(worldState, preset.rules, wizardNews, PINNED_NOW)'],
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const load = (rel) => import(pathToFileURL(join(tree, rel)).href);

let birth; let rules; let profile;
try {
  [birth, rules, profile] = await Promise.all([
    load('src/store/campaignImportedCreation.js'),
    load('src/domain/worldPulse/simulationRules.js'),
    load('src/domain/worldPulse/simulationProfile.js'),
  ]);
} catch (error) {
  console.error(`birth-fixtures: could not load the REAL birth path from ${tree}:\n${error?.stack ?? String(error)}`);
  process.exit(1);
}

const { buildNewCampaign } = birth;
const { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, CUSTOM_SIMULATION_PRESET_ID } = rules;
const { prepareRulesUpdate } = profile;
for (const [name, value] of Object.entries({ buildNewCampaign, SIMULATION_RULE_PRESETS, prepareRulesUpdate })) {
  if (value == null) {
    console.error(`birth-fixtures: the tree exports no ${name} — the birth path has moved. REFUSING.`);
    process.exit(1);
  }
}

const ids = ONLY ? [ONLY] : Object.keys(SIMULATION_RULE_PRESETS);
if (ONLY && !SIMULATION_RULE_PRESETS[ONLY]) {
  console.error(`birth-fixtures: no preset '${ONLY}'. Known: ${Object.keys(SIMULATION_RULE_PRESETS).join(', ')}`);
  process.exit(2);
}
// VACUITY GUARD. An empty roster would write a file of zero fixtures and read as a pass.
if (!ids.length) {
  console.error('birth-fixtures: the preset roster is EMPTY — refusing to write a vacuous fixture set.');
  process.exit(1);
}

const fixtures = [];
const refusals = [];
for (const id of ids) {
  // The bare state object: `accountRuntimeBinding` reads `getActiveCustomContentRuntime`
  // when present and otherwise composes the vanilla environment from these two fields, so
  // a plain object takes the product's own no-custom-content arm rather than a stub arm.
  const state = { activeContentEnvironment: null, customContent: {} };
  const campaign = buildNewCampaign(state, `L-PROBE ${id}`);
  const prepared = prepareRulesUpdate(
    campaign.worldState,
    SIMULATION_RULE_PRESETS[id].rules,
    campaign.wizardNews,
    PINNED_NOW,
  );
  const resolved = prepared.canonical;
  const roundTrips = resolved.presetId === id;
  if (!roundTrips) {
    // NOT a fallback that prints a finding — this IS the measurement, and it is recorded
    // as a refusal rather than smoothed away. A preset that does not round-trip to its own
    // id re-labels every installed world of that id at its next ensureWorldState.
    refusals.push({
      id,
      resolvedPresetId: resolved.presetId,
      why: resolved.presetId === CUSTOM_SIMULATION_PRESET_ID
        ? "the resolved rules match NO preset — presetIdForRules fell through to 'custom'"
        : `the resolved rules match a DIFFERENT preset ('${resolved.presetId}')`,
    });
  }
  const birthEnvelopeShape = Object.keys(campaign).sort();
  fixtures.push({
    presetId: id,
    label: SIMULATION_RULE_PRESETS[id].label ?? null,
    roundTripsToOwnId: roundTrips,
    resolvedPresetId: resolved.presetId,
    changedKeys: prepared.changedKeys,
    coercions: prepared.coercions ?? null,
    resolvedRules: resolved,
    resolvedRuleKeyCount: Object.keys(resolved).length,
    // The preset's own rules table, recorded so the DIFFERENCE between the table and the
    // resolved rules is legible rather than assumed. ⚠ At 38474a59e that difference is
    // EMPTY — the table is total over DEFAULT_SIMULATION_RULES and the normalizer is a
    // fixed point on it, so this array has the same length as resolvedRuleKeyCount for all
    // seven presets (37/37/56/36/37/55/70). It was called "the sparse override table" here
    // until L-OVERLAY measured it, 2026-09-05.
    overrideTableKeys: Object.keys(SIMULATION_RULE_PRESETS[id].rules).sort(),
    litBooleanCount: Object.values(resolved).filter((v) => v === true).length,
    darkBooleanCount: Object.values(resolved).filter((v) => v === false).length,
    birthEnvelopeShape,
    hash: sha256(resolved),
  });
}

const payload = {
  instrument: 'lprobe/birth-fixtures.mjs',
  output: '(f) a REAL-birth new-campaign fixture per preset',
  tree,
  takenAt: new Date().toISOString(),
  pinnedNow: PINNED_NOW,
  volatileBirthFieldsExcludedFromHash: VOLATILE_BIRTH_FIELDS,
  path: [
    'src/store/campaignImportedCreation.js :: buildNewCampaign(state, name)',
    'src/domain/worldPulse/simulationProfile.js :: prepareRulesUpdate(worldState, preset.rules, wizardNews, PINNED_NOW)',
  ],
  defaultRuleKeyCount: DEFAULT_SIMULATION_RULES ? Object.keys(DEFAULT_SIMULATION_RULES).length : null,
  presetIds: ids,
  refusals,
  fixtures,
};
payload.digest = sha256(fixtures.map((f) => `${f.presetId}:${f.hash}`).join('\n'));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('birth-fixtures: the written file does not read back to its own digest.');
  process.exit(1);
}
for (const f of back.fixtures) {
  console.log(`  ${f.presetId.padEnd(22)} lit=${String(f.litBooleanCount).padStart(3)}`
    + ` dark=${String(f.darkBooleanCount).padStart(3)} keys=${f.resolvedRuleKeyCount}`
    + ` roundTrip=${f.roundTripsToOwnId ? 'yes' : `NO -> ${f.resolvedPresetId}`}`
    + ` hash=${f.hash.slice(0, 12)}`);
}
console.log(`birth-fixtures OK  presets=${back.fixtures.length} refusals=${back.refusals.length}`
  + ` digest=${back.digest.slice(0, 12)} -> ${out}`);
process.exit(back.refusals.length ? 1 : 0);
