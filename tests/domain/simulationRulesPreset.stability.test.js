import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_SIMULATION_RULES,
  DEFAULT_SIMULATION_PRESET_ID,
  CUSTOM_SIMULATION_PRESET_ID,
  ENGINE_GATED_DORMANT_RULE_KEYS,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  NEW_CAMPAIGN_SIMULATION_PRESET_ID,
  SIMULATION_RULE_PRESETS,
  newCampaignSimulationRules,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  createNewCampaignWorldState,
  ensureWorldState,
} from '../../src/domain/worldPulse/worldState.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// F0 structural tripwire (guards the RULE_COMPARISON_KEYS churn trap): preset
// identity must survive the addition of future default-false simulation flags
// (warLayerEnabled / settlementStrategyEnabled / religionDynamicsEnabled, all
// landing later defaulting false). Those flags ride through normalization via
// `...input` but are INVISIBLE to preset matching because they are not in
// RULE_COMPARISON_KEYS. The danger this file pins: if a future dev adds a key
// to RULE_COMPARISON_KEYS without defining it in EVERY preset, that preset
// suddenly compares `undefined` against the new default, mismatches, and
// silently collapses its presetId to 'custom'. Test #2 is the live wire that
// trips when that happens. Tests #1/#4 pin the round-trip baseline, #3 pins the
// safe forward-compat pattern, and #5 proves matching is not trivially
// always-true (custom detection still fires).
//
// RULE_COMPARISON_KEYS is module-private in the source. We reconstruct the
// canonical set from the PUBLIC surface so this oracle tracks the real defaults
// rather than a frozen copy: the three enum keys plus every boolean rule key
// derived from DEFAULT_SIMULATION_RULES (presetId/schemaVersion excluded).
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ENUM_COMPARISON_KEYS = ['propagationMode', 'intensity', 'migrationMode'];
const BOOLEAN_KEYS = Object.entries(DEFAULT_SIMULATION_RULES)
  .filter(([, value]) => typeof value === 'boolean')
  .map(([key]) => key);
const RULE_COMPARISON_KEYS = [...ENUM_COMPARISON_KEYS, ...BOOLEAN_KEYS];

const PRESET_IDS = Object.keys(SIMULATION_RULE_PRESETS);
// The legacy trio must stay resolvable forever (old saves carry these ids; the
// realm toolbar chips apply them) AND must stay FIRST in the catalog: the
// keyless inference in presetIdForRules returns the FIRST structural match, so
// a legacy default-rules save keeps inferring realistic_regional, never the
// structurally-identical living_realm.
const LEGACY_PRESET_IDS = ['quiet_local', 'realistic_regional', 'dramatic_campaign'];
const CL0_PRESET_IDS = ['static_campaign', 'narrative_campaign', 'living_realm', 'full_simulation'];

describe('simulation rules preset — stability under future-flag churn', () => {
  // Anti-vacuity: the catalog and the comparison-key set are non-trivial. If
  // either collapsed to empty/one, the per-preset loops below would be vacuous.
  test('the catalog is the legacy trio FIRST plus the four §11 presets', () => {
    expect(PRESET_IDS).toEqual([...LEGACY_PRESET_IDS, ...CL0_PRESET_IDS]);
    // 3 enum keys + the boolean toggle bank — proves we actually reconstructed
    // a meaningful key set, not an empty array that makes #2 always pass.
    expect(BOOLEAN_KEYS.length).toBeGreaterThan(5);
    expect(RULE_COMPARISON_KEYS.length).toBe(ENUM_COMPARISON_KEYS.length + BOOLEAN_KEYS.length);
  });

  // CL-0 byte-stability: keyless default rules still infer the LEGACY default
  // preset (realistic_regional), not living_realm — the two were structurally
  // the same world until SEASONS-A lit seasonsEnabled on living_realm (catalog
  // order remains the guard either way, and keeps old saves byte-identical).
  test('keyless default rules keep inferring realistic_regional', () => {
    const keyless = { ...SIMULATION_RULE_PRESETS.realistic_regional.rules };
    delete keyless.presetId;
    expect(normalizeSimulationRules(keyless).presetId).toBe('realistic_regional');
    expect(normalizeSimulationRules({}).presetId).toBe('realistic_regional');
  });

  // #1 — each named preset round-trips to ITSELF (no collapse to 'custom').
  test('every named preset normalizes back to its own id', () => {
    for (const id of PRESET_IDS) {
      const preset = SIMULATION_RULE_PRESETS[id];
      // Sanity: the catalog id and the embedded rules.presetId agree.
      expect(preset.id).toBe(id);
      const normalized = normalizeSimulationRules(preset.rules);
      expect(normalized.presetId).toBe(id);
      expect(normalized.presetId).not.toBe(CUSTOM_SIMULATION_PRESET_ID);
    }
  });

  test('every moving preset lights the narrative tempo governor at an intentional tier', () => {
    expect(Object.fromEntries(PRESET_IDS.map(id => [
      id,
      SIMULATION_RULE_PRESETS[id].rules.narrativeTempo ?? null,
    ]))).toEqual({
      quiet_local: 'quiet_local',
      realistic_regional: 'realistic_regional',
      dramatic_campaign: 'dramatic_campaign',
      static_campaign: null,
      narrative_campaign: 'quiet_local',
      living_realm: 'realistic_regional',
      full_simulation: 'full_simulation',
    });

    // The axis remains virtual: old saves and explicit custom rules that never
    // selected a newly-wired preset keep the governor dormant byte-for-byte.
    expect(DEFAULT_SIMULATION_RULES).not.toHaveProperty('narrativeTempo');
    expect(normalizeSimulationRules({})).not.toHaveProperty('narrativeTempo');
  });

  // #2 — THE churn guard: every comparison key is DEFINED in every preset.
  // If a dev grows RULE_COMPARISON_KEYS but forgets a preset, that preset's
  // value for the new key is undefined here and this assertion fails first.
  test('every comparison key is defined (not undefined) in every preset', () => {
    for (const id of PRESET_IDS) {
      const { rules } = SIMULATION_RULE_PRESETS[id];
      for (const key of RULE_COMPARISON_KEYS) {
        expect(
          rules[key],
          `${id}.rules.${key} must be defined for stable preset matching`,
        ).not.toBeUndefined();
      }
    }
  });

  // #3 — forward-compat: a hypothetical NEW default-false flag rides through. Uses
  // SYNTHETIC flag names (not a real gate like warLayerEnabled, which graduated into
  // RULE_COMPARISON_KEYS) so the property stays testable as real flags land.
  test('a new default-false flag is invisible to matching yet survives normalization', () => {
    const base = SIMULATION_RULE_PRESETS.realistic_regional.rules;
    // Guard the premise: the synthetic flag is NOT a key the source compares on.
    expect(RULE_COMPARISON_KEYS).not.toContain('__hypotheticalFutureFlag');

    const withFutureFlag = { ...base, __hypotheticalFutureFlag: false };
    const normalized = normalizeSimulationRules(withFutureFlag);

    // (a) preset identity is untouched by the unknown flag.
    expect(normalized.presetId).toBe('realistic_regional');
    // (b) the new flag value passes through via `...input`.
    expect(normalized.__hypotheticalFutureFlag).toBe(false);

    // It also rides through when set true — value preserved, identity stable.
    const truthy = normalizeSimulationRules({ ...base, __anotherFutureFlag: true });
    expect(truthy.presetId).toBe('realistic_regional');
    expect(truthy.__anotherFutureFlag).toBe(true);
  });

  // #4 — default integrity: the frozen default and the no-arg call agree.
  test('default rules and no-arg normalize resolve to the default preset', () => {
    expect(DEFAULT_SIMULATION_RULES.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);

    const fromDefault = normalizeSimulationRules();
    expect(fromDefault.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);
    // The no-arg result equals the named default preset on every comparison key.
    const defaultPreset = SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID];
    for (const key of RULE_COMPARISON_KEYS) {
      expect(fromDefault[key]).toBe(defaultPreset.rules[key]);
    }
  });

  // W0-A3 — the Full Simulation preset runs the war stack AT DEPTH: the eight
  // war sub-flags ship lit in full_simulation ONLY. living_realm and the legacy
  // trio inherit the default-false bank, and full_simulation still round-trips
  // to its own id (the flags are comparison keys, defined in every preset via
  // the DEFAULT spread — churn-guard #2 covers the definedness half).
  const WAR_DEPTH_FLAGS = [
    'defenderAttritionEnabled',
    'warEconomyDrainEnabled',
    'warSupplyQualityEnabled',
    'defenderResolveEnabled',
    'allyDefenseEnabled',
    'warForageEnabled',
    'warLevyEnabled',
    'warDispositionEnabled',
  ];
  test('full_simulation lights ALL EIGHT war sub-flags; every other preset keeps them dark', () => {
    // The eight are real boolean rule keys (anti-drift: renaming one in the
    // source must fail here, not silently test a ghost key).
    for (const flag of WAR_DEPTH_FLAGS) {
      expect(BOOLEAN_KEYS, `${flag} is a real boolean rule key`).toContain(flag);
    }
    for (const flag of WAR_DEPTH_FLAGS) {
      expect(SIMULATION_RULE_PRESETS.full_simulation.rules[flag], `full_simulation.${flag}`).toBe(true);
      expect(DEFAULT_SIMULATION_RULES[flag], `default ${flag} stays false`).toBe(false);
    }
    for (const id of PRESET_IDS.filter(p => p !== 'full_simulation')) {
      for (const flag of WAR_DEPTH_FLAGS) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} stays dark`).toBe(false);
      }
    }
    // Round-trip: the lit preset still infers ITSELF, and a keyless copy of its
    // rules (an old save that lost its presetId) re-infers full_simulation.
    const keyless = { ...SIMULATION_RULE_PRESETS.full_simulation.rules };
    delete keyless.presetId;
    expect(normalizeSimulationRules(keyless).presetId).toBe('full_simulation');
  });

  // ── O-12: THE SUPERSEDED OWNER RULING, HELD HONEST IN BOTH DIRECTIONS ──────
  //
  // On 2026-09-03 the owner handed row O-12 to the chair: §881.4 supersedes the
  // in-file owner ruling that dramatic_campaign "stays LIGHTER than
  // full_simulation (no deep war sub-flags / religionDynamics ceiling)". The
  // supersession is RECORDED beside that ruling rather than overwriting it, and
  // these two arms are what stop the record from decaying in either direction:
  //
  //   • ARM 1 refuses a SILENT DELETION. A later lane that quietly strikes the
  //     old owner sentence, or lands the sub-flags without leaving the record,
  //     reds here. The whole point of O-12 is that the owner can SEE the change.
  //   • ARM 2 refuses a SILENT RE-LABEL, and it outlives the wave. The eight are
  //     RULE_COMPARISON_KEYS members, so lighting them on the LEGACY id would
  //     make every installed Dramatic Campaign infer 'custom' at its next
  //     ensureWorldState with no receipt minted. The lit successor id (row O-1's
  //     birth form) is the home; this arm holds the legacy id dark FOREVER, and
  //     it stays green after the successor lands, when the WAR_DEPTH_FLAGS
  //     roster above must be rewritten as a declared instrument edit.
  const RULES_SOURCE = readFileSync(
    join(ROOT, 'src/domain/worldPulse/simulationRules.js'),
    'utf-8',
  );

  test('the superseded owner ruling is kept VERBATIM, with its supersession recorded beside it', () => {
    // Liveness anchor first, so a moved/empty read reds HERE rather than making
    // every absence-and-presence claim below pass vacuously.
    expect(RULES_SOURCE).toContain("dramatic_campaign: preset('dramatic_campaign'");

    // The superseded sentence itself, word for word. It may be superseded; it
    // may not be quietly deleted.
    //
    // ⚠ AND IT IS ASSERTED IN THE ORIGINAL'S OWN CONTEXT, NOT BY THE BARE PHRASE.
    // A bare `toContain` on the sentence is VACUOUS here and was measured to be:
    // the supersession record below QUOTES the same sentence, so deleting the
    // original ruling outright still left the phrase in the file and the arm
    // passed a planted mutant. The original line carries words the quote does
    // not, and the pair must appear TWICE — once as the ruling, once as the
    // quote — so neither copy can stand in for the other.
    expect(
      RULES_SOURCE,
      'the superseded owner ruling was removed instead of being recorded as superseded',
    ).toContain('faith spread, seasons, and calamities. It stays LIGHTER than full_simulation');
    expect(
      RULES_SOURCE.split('It stays LIGHTER than full_simulation').length - 1,
      'the ruling and the record must BOTH carry the sentence: one as the superseded word, one as the quote of it',
    ).toBeGreaterThanOrEqual(2);

    // …and the record of what replaced it: dated, attributed, and naming the row.
    expect(RULES_SOURCE).toContain('SUPERSEDED 2026-09-03');
    expect(RULES_SOURCE).toContain('Row O-12');
    // The record names every flag it frees, so the reader never has to infer the
    // population from the phrase "deep war sub-flags".
    for (const flag of WAR_DEPTH_FLAGS) {
      const bare = flag.replace(/Enabled$/, '');
      expect(RULES_SOURCE, `the O-12 record must name ${bare}`).toContain(bare);
    }
  });

  test('the LEGACY dramatic_campaign id keeps the eight dark — no installed campaign is silently re-labelled', () => {
    for (const flag of WAR_DEPTH_FLAGS) {
      expect(
        SIMULATION_RULE_PRESETS.dramatic_campaign.rules[flag],
        `${flag} lit on the LEGACY dramatic_campaign id re-labels every installed Dramatic Campaign to 'custom' with no receipt — the lit SUCCESSOR id is the home`,
      ).toBe(false);
    }
    // The consequence stated as a behaviour rather than as a value: an installed
    // Dramatic Campaign that lost its presetId still infers dramatic_campaign.
    const keyless = { ...SIMULATION_RULE_PRESETS.dramatic_campaign.rules };
    delete keyless.presetId;
    expect(normalizeSimulationRules(keyless).presetId).toBe('dramatic_campaign');
    // And a save that carries the eight explicitly false — which is what every
    // normalized installed campaign carries — still matches this preset.
    const installed = { ...keyless };
    for (const flag of WAR_DEPTH_FLAGS) installed[flag] = false;
    expect(normalizeSimulationRules(installed).presetId).toBe('dramatic_campaign');
  });

  // WR-1 — termination is a VIRTUAL, declared-dark certification key. It is
  // intentionally absent from the default bank (so legacy preset matching does
  // not change), named only by the ceiling preset, and not lit before WR-9 can
  // measure its deciding-term distribution.
  test('war termination is declared false only in full_simulation and remains outside preset identity', () => {
    const flag = 'warTerminationEnabled';
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, flag)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS.full_simulation.rules, flag)).toBe(true);
    expect(typeof SIMULATION_RULE_PRESETS.full_simulation.rules[flag]).toBe('boolean');
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules[flag]).toBe(false);

    for (const id of PRESET_IDS.filter((presetId) => presetId !== 'full_simulation')) {
      expect(
        Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS[id].rules, flag),
        `${id}.${flag} must remain absent`,
      ).toBe(false);
    }

    // Virtual flags are excluded from RULE_COMPARISON_KEYS: even a future lit
    // value does not make an otherwise exact Full Simulation save lose its preset.
    expectAbsentWithAnchor(
      RULE_COMPARISON_KEYS,
      flag,
      'warLayerEnabled',
      'the comparison census is live while the virtual termination key stays outside preset identity',
    );
    const keylessLit = { ...SIMULATION_RULE_PRESETS.full_simulation.rules, [flag]: true };
    delete keylessLit.presetId;
    expect(normalizeSimulationRules(keylessLit).presetId).toBe('full_simulation');
    expect(normalizeSimulationRules(keylessLit)[flag]).toBe(true);
  });

  // WR-3 — the lineage claim follows the same virtual declaration law as the
  // two earlier war-rulings reads: visible to certification, behaviorally dark,
  // and absent from legacy preset identity until the measured lighting batch.
  test('lineage claim is declared false only in full_simulation and remains outside preset identity', () => {
    const flag = 'lineageClaimEnabled';
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, flag)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS.full_simulation.rules, flag)).toBe(true);
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules[flag]).toBe(false);

    for (const id of PRESET_IDS.filter((presetId) => presetId !== 'full_simulation')) {
      expect(
        Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS[id].rules, flag),
        `${id}.${flag} must remain absent`,
      ).toBe(false);
    }

    expectAbsentWithAnchor(
      RULE_COMPARISON_KEYS,
      flag,
      'warLayerEnabled',
      'the comparison census is live while the virtual lineage key stays outside preset identity',
    );
    const keylessLit = { ...SIMULATION_RULE_PRESETS.full_simulation.rules, [flag]: true };
    delete keylessLit.presetId;
    expect(normalizeSimulationRules(keylessLit).presetId).toBe('full_simulation');
    expect(normalizeSimulationRules(keylessLit)[flag]).toBe(true);
  });

  // WR-6 — the coalition graph uses the same virtual declaration law. It is
  // visible to certification now, but remains dark until WR-9 can distinguish
  // eligible calls, decisions, costs, payments, and all governed families.
  test('coalition ledger is declared false only in full_simulation and remains outside preset identity', () => {
    const flag = 'coalitionLedgerEnabled';
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, flag)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS.full_simulation.rules, flag)).toBe(true);
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules[flag]).toBe(false);

    for (const id of PRESET_IDS.filter((presetId) => presetId !== 'full_simulation')) {
      expect(
        Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS[id].rules, flag),
        `${id}.${flag} must remain absent`,
      ).toBe(false);
    }

    expectAbsentWithAnchor(
      RULE_COMPARISON_KEYS,
      flag,
      'warLayerEnabled',
      'the comparison census is live while the virtual coalition key stays outside preset identity',
    );
    const keylessLit = { ...SIMULATION_RULE_PRESETS.full_simulation.rules, [flag]: true };
    delete keylessLit.presetId;
    expect(normalizeSimulationRules(keylessLit).presetId).toBe('full_simulation');
    expect(normalizeSimulationRules(keylessLit)[flag]).toBe(true);
  });

  // W-R2-LIGHT — the nine post-close engine-wave gates light TOGETHER in the
  // three world-alive presets (owner ruling 2026-07-16). Unlike the eight war
  // sub-flags (which graduated INTO RULE_COMPARISON_KEYS), these are VIRTUAL —
  // ABSENT from DEFAULT_SIMULATION_RULES, so they are invisible to preset matching
  // (the disastersEnabled precedent): a legacy save missing them still infers its
  // preset, and every dark-config golden stays byte-identical. The list is spelled
  // out here independently (anti-drift: renaming a flag in the source WAVES object
  // must fail HERE, not silently test a ghost key).
  const ENGINE_WAVE_FLAGS = [
    'momentumEnabled',
    'navalEnabled',
    'interventionEnabled',
    'settlementLifecycleEnabled',
    'peaceEngineEnabled',
    'supplyWebWarfareEnabled',
    'upswingArcsEnabled',
    'resourceDynamicsEnabled',
    'constructiveFlowsEnabled',
  ];
  const WORLD_ALIVE_PRESET_IDS = ['dramatic_campaign', 'living_realm', 'full_simulation'];
  // ⭐ DECLARED EDIT, NEVER A RE-RECORD (lighting wave, L-DEFAULT hunk 1, 2026-09-06).
  // `realistic_regional` moved from the dark roster to the lit one because the wave
  // lit the DEFAULT preset with the class C+D virtual keys. This roster is the
  // instrument that announces that shift, so it is edited in the same commit as the
  // source and its old membership is stated here rather than erased: the dark roster
  // read ['quiet_local', 'realistic_regional', 'static_campaign', 'narrative_campaign'].
  // The identity assertions below are UNCHANGED and still green, which is the whole
  // point of lighting only virtual keys on a legacy id.
  const WAVE_LIT_PRESET_IDS = [...WORLD_ALIVE_PRESET_IDS, 'realistic_regional'];
  const WAVE_DARK_PRESET_IDS = ['quiet_local', 'static_campaign', 'narrative_campaign'];

  test('the nine engine-wave flags are VIRTUAL (absent from the default surface + comparison keys)', () => {
    // Anti-vacuity: exactly nine, no dupes.
    expect(new Set(ENGINE_WAVE_FLAGS).size).toBe(9);
    for (const flag of ENGINE_WAVE_FLAGS) {
      // Virtual: not a default key (so it never persists on an untouched campaign)…
      expect(DEFAULT_SIMULATION_RULES, `${flag} must stay absent from DEFAULT_SIMULATION_RULES`).not.toHaveProperty(flag);
      // …and therefore not a comparison key (invisible to preset identity matching).
      expect(RULE_COMPARISON_KEYS, `${flag} must NOT be a comparison key (would collapse legacy saves)`).not.toContain(flag);
    }
  });

  test('the world-alive presets and the lit default light ALL NINE waves; the rest keep them dark', () => {
    // Anti-vacuity on the rosters themselves: four lit, three dark, no overlap, and
    // together they are every preset in the catalog — so neither list can quietly
    // shed a preset and take its assertion with it.
    expect(WAVE_LIT_PRESET_IDS.length).toBe(4);
    expect(WAVE_DARK_PRESET_IDS.length).toBe(3);
    expect([...WAVE_LIT_PRESET_IDS, ...WAVE_DARK_PRESET_IDS].sort()).toEqual([...PRESET_IDS].sort());
    for (const id of WAVE_LIT_PRESET_IDS) {
      for (const flag of ENGINE_WAVE_FLAGS) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} must be lit`).toBe(true);
      }
    }
    for (const id of WAVE_DARK_PRESET_IDS) {
      for (const flag of ENGINE_WAVE_FLAGS) {
        // Absent (undefined) — the wave sleeps; the gate reads `=== true`.
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} must stay dark`).not.toBe(true);
      }
    }
    // Identity is UNTOUCHED by the new virtual keys: every lit preset (and a keyless
    // copy of its rules) still round-trips to itself — this is the byte-stability
    // property (legacy saves missing the waves keep their preset id).
    for (const id of WAVE_LIT_PRESET_IDS) {
      const keyless = { ...SIMULATION_RULE_PRESETS[id].rules };
      delete keyless.presetId;
      expect(normalizeSimulationRules(keyless).presetId, `${id} keyless re-infers itself`).toBe(id);
    }
  });

  // T5 THE ONE REGEN — eight chartered engine lifts plus the later Roads
  // adjunct. They use the same virtual-key law as WAVES, but stay a distinct
  // cohort so the charter does not silently absorb the separately commissioned
  // deep-couplings flags.
  const ONE_REGEN_FLAGS = [
    'distancePricedNewsEnabled',
    'reframeEnabled',
    'provenanceLedgerEnabled',
    'urbanFabricEnabled',
    'npcGrowthEnabled',
    'spatialConsequenceEnabled',
    'npcLadderEnabled',
    'traditionsEnabled',
    'roadsEnabled',
  ];

  test('the One-Regen eight plus Roads remain virtual and exclude Memory Weave', () => {
    expect(new Set(ONE_REGEN_FLAGS).size).toBe(9);
    expect(ONE_REGEN_FLAGS).not.toContain('memoryWeaveEnabled');
    for (const flag of ONE_REGEN_FLAGS) {
      expect(
        DEFAULT_SIMULATION_RULES,
        `${flag} must stay absent from DEFAULT_SIMULATION_RULES`,
      ).not.toHaveProperty(flag);
      expect(
        RULE_COMPARISON_KEYS,
        `${flag} must stay outside preset comparison keys`,
      ).not.toContain(flag);
    }
    expect(DEFAULT_SIMULATION_RULES).not.toHaveProperty('memoryWeaveEnabled');
    for (const id of PRESET_IDS) {
      expect(
        SIMULATION_RULE_PRESETS[id].rules,
        `${id} must not light the separately commissioned Memory Weave`,
      ).not.toHaveProperty('memoryWeaveEnabled');
    }
  });

  test('exactly the world-alive presets and the lit default light every One-Regen flag', () => {
    for (const id of WAVE_LIT_PRESET_IDS) {
      for (const flag of ONE_REGEN_FLAGS) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag}`).toBe(true);
      }
    }
    for (const id of WAVE_DARK_PRESET_IDS) {
      for (const flag of ONE_REGEN_FLAGS) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} stays dark`).not.toBe(true);
      }
    }
  });

  test('virtual One-Regen flags do not disturb legacy or keyless preset identity', () => {
    for (const id of PRESET_IDS) {
      const keyless = { ...SIMULATION_RULE_PRESETS[id].rules };
      delete keyless.presetId;
      expect(normalizeSimulationRules(keyless).presetId, `${id} keyless identity`).toBe(id);
    }

    // A legacy world-alive save predating the virtual cohort has none of the
    // nine keys, yet comparison-key identity remains unchanged.
    for (const id of WORLD_ALIVE_PRESET_IDS) {
      const legacy = { ...SIMULATION_RULE_PRESETS[id].rules };
      delete legacy.presetId;
      for (const flag of ONE_REGEN_FLAGS) delete legacy[flag];
      expect(normalizeSimulationRules(legacy).presetId, `${id} legacy identity`).toBe(id);
    }
  });

  // ⭐ LIT-1a (2026-09-24; J-EM-16 under the owner's word of 2026-09-23, "no just build it
  // all shipped lit"). The first REGISTER keys a preset declares, each lit ONLY in the
  // presets that carry every layer it reads. The rosters are spelled here independently of
  // the source fragments (FP_LIT_ALIVE / FP_LIT_WARPEACE), so a rename or a stray lighting
  // there reds HERE, and the two keys the unit HELD DARK are pinned dark beside them.
  const FP_LIT_ALIVE_FLAGS = ['faithUnseatingEnabled', 'pactFormationEnabled'];
  const FP_LIT_WARPEACE_FLAGS = ['oathHolderEnabled', 'treatyLifecycleVoiceEnabled', 'treatyRenewalEnabled'];
  const FP_WARPEACE_PRESET_IDS = ['dramatic_campaign', 'full_simulation'];
  const FP_HELD_DARK_FLAGS = ['errandSpineEnabled', 'merchantHousesEnabled'];

  test('LIT-1a: each lit FP layer is PRESENT exactly in the presets its unit names, and stays VIRTUAL', () => {
    const roster = Object.fromEntries([
      ...FP_LIT_ALIVE_FLAGS.map((flag) => [flag, WAVE_LIT_PRESET_IDS]),
      ...FP_LIT_WARPEACE_FLAGS.map((flag) => [flag, FP_WARPEACE_PRESET_IDS]),
    ]);
    // Anti-vacuity on the rosters: five distinct keys, every one a REGISTER member rather
    // than a name this file invented, and every one gone from the DERIVED dormant list.
    expect(Object.keys(roster).length).toBe(5);
    for (const [flag, litIds] of Object.entries(roster)) {
      expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(flag), `${flag} must stay registered`).toBe(true);
      expect(ENGINE_GATED_DORMANT_RULE_KEYS.includes(flag), `${flag} must leave the dormant list`).toBe(false);
      const darkIds = PRESET_IDS.filter((id) => !litIds.includes(id));
      // lit ∪ dark = PRESET_IDS and both sides are non-empty, so neither can quietly shed a
      // preset and take its assertion with it.
      expect([...litIds, ...darkIds].sort(), flag).toEqual([...PRESET_IDS].sort());
      expect(litIds.length, flag).toBeGreaterThan(0);
      expect(darkIds.length, flag).toBeGreaterThan(0);
      for (const id of litIds) {
        expect(SIMULATION_RULE_PRESETS[id].rules[flag], `${id}.${flag} must be lit`).toBe(true);
      }
      for (const id of darkIds) {
        // Dark is ABSENT, never a declared false (CR-WR10-C; the LIT-0/2 VIRTUAL law).
        expect(flag in SIMULATION_RULE_PRESETS[id].rules, `${id}.${flag} must stay absent`).toBe(false);
      }
      // VIRTUAL: no defaults entry, therefore no comparison key and no identity effect.
      expect(flag in DEFAULT_SIMULATION_RULES, `${flag} must stay absent from the defaults`).toBe(false);
      expect(RULE_COMPARISON_KEYS.includes(flag), `${flag} must not be a comparison key`).toBe(false);
    }
    // The treaty trio's presets are DERIVED, not only asserted: exactly where warLayerEnabled
    // and peaceEngineEnabled are both lit (peaceCausalActive), which is why they light there.
    const warPeace = PRESET_IDS.filter((id) => SIMULATION_RULE_PRESETS[id].rules.warLayerEnabled === true
      && SIMULATION_RULE_PRESETS[id].rules.peaceEngineEnabled === true);
    expect([...warPeace].sort()).toEqual([...FP_WARPEACE_PRESET_IDS].sort());
    // THE TWO HELD DARK: still registered, still dormant, absent from every preset.
    for (const flag of FP_HELD_DARK_FLAGS) {
      expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(flag), `${flag} must stay registered`).toBe(true);
      expect(ENGINE_GATED_DORMANT_RULE_KEYS.includes(flag), `${flag} must stay dormant`).toBe(true);
      for (const id of PRESET_IDS) {
        expect(flag in SIMULATION_RULE_PRESETS[id].rules, `${id}.${flag} must stay absent`).toBe(false);
      }
    }
    // IDENTITY, three ways (the 432ff6441 idiom): a keyless copy of every preset re-infers
    // itself (the One-Regen identity arm above covers all seven); an installed save carrying
    // NONE of the five re-infers its own id; and the keyless default still infers
    // realistic_regional.
    for (const id of WAVE_LIT_PRESET_IDS) {
      const installed = { ...SIMULATION_RULE_PRESETS[id].rules };
      delete installed.presetId;
      for (const flag of Object.keys(roster)) delete installed[flag];
      expect(normalizeSimulationRules(installed).presetId, `${id} installed identity`).toBe(id);
    }
    expect(normalizeSimulationRules({}).presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);
  });

  // #5 — custom detection still fires (proves matching is not always-true).
  test('flipping one comparison key away from every preset yields custom', () => {
    const base = SIMULATION_RULE_PRESETS.dramatic_campaign.rules;
    // Pick a boolean toggle and flip it; no preset has dramatic_campaign's
    // exact remaining shape with this single bit inverted, so it must be custom.
    const key = BOOLEAN_KEYS.find(k => base[k] === true);
    expect(key, 'fixture is hot: dramatic_campaign has at least one true toggle').toBeDefined();

    const mutated = normalizeSimulationRules({ ...base, [key]: false });
    expect(mutated.presetId).toBe(CUSTOM_SIMULATION_PRESET_ID);
    // Anti-vacuity contrast: the UNmutated base still matches its own preset,
    // so the 'custom' verdict above is caused by the flip, not by the fixture.
    expect(normalizeSimulationRules(base).presetId).toBe('dramatic_campaign');
  });
});

// ── THE BIRTH SEAM (LIGHTING row O-1 / CH-5 — car LGT-P1-BIRTH) ──────────────
// WHY THIS BLOCK EXISTS. Until this car, "which preset does a BRAND-NEW campaign
// start in?" had no address at all: a fresh campaign was minted by an argument-less
// `normalizeSimulationRules()` three modules away from the preset table, so lighting
// the table would have lit nothing for the only cohort a customer can create. The
// seam is one constant (NEW_CAMPAIGN_SIMULATION_PRESET_ID), one resolver
// (newCampaignSimulationRules), one door (createNewCampaignWorldState).
//
// It lands DARK: the successor id is null, so every assertion below is measured
// against the world the tree births today. Two of these tests are deliberate
// TRIPWIRES on the day L-DEFAULT names a successor — the byte-identity pin and the
// virtual-profile pin BOTH red, and that red is the DECLARED SHIFT being announced,
// never a re-record. The measured price of that day, taken here rather than
// discovered there: +7 persisted rule keys per new campaign (30 -> 37 at
// realistic_regional), because every preset spreads DEFAULT_SIMULATION_RULES, which
// carries PROFILE_DEFAULTS, so the normalizer's materialize branch fires.
// ⭐ AND THE TRIPWIRE EARNED ITS KEEP ON ITS FIRST DAY, WHICH IS WHY THE OLD FIGURE
// IS KEPT ABOVE VERBATIM RATHER THAN OVERWRITTEN. It fired one hunk EARLIER than the
// paragraph expected — not at the naming, but at L-DEFAULT hunk 1, which lit the
// default preset. The price is a property of the PRESET, not of the constant that
// names it, so lighting twenty-one virtual keys into that preset raised it from
// +7 (30 -> 37) to +28 (30 -> 58) before any successor was named at all. Whoever
// next prices a birth should price the preset's key count, not this sentence.
//
// ⛔ THE SOURCE SCANS BELOW READ EXECUTABLE TEXT, NOT RAW TEXT, AND THAT IS NOT A
// STYLE CHOICE. Both negatives reddened on their first run because the seam's own
// PROSE names the thing the negative forbids — `createNewCampaignWorldState`'s
// JSDoc says `newCampaignSimulationRules()`, and buildNewCampaign's comment quotes
// the `ensureWorldState(null, …)` call it replaced so the change can be read rather
// than discovered. A scanner that cannot tell a mention from a call convicts good
// prose and, far worse, would be satisfied by a comment on the day the call really
// came back.
const executable = source => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
const BIRTH_SOURCES = {
  worldState: executable(readFileSync(join(ROOT, 'src/domain/worldPulse/worldState.js'), 'utf8')),
  creation: executable(readFileSync(join(ROOT, 'src/store/campaignImportedCreation.js'), 'utf8')),
};

describe('new-campaign birth seam — one address, dark today, proven live', () => {
  const BIRTH_CAMPAIGN = Object.freeze({ id: 'birth-seam-pin', name: 'Birth Seam Pin' });

  test('the successor is null, and null means TODAY\u2019S rules to the byte', () => {
    expect(NEW_CAMPAIGN_SIMULATION_PRESET_ID).toBe(null);
    // JSON, not toEqual: KEY ORDER is what the persisted envelope is made of and
    // deep equality is blind to it.
    expect(JSON.stringify(newCampaignSimulationRules()))
      .toBe(JSON.stringify(normalizeSimulationRules()));
  });

  test('a dark birth keeps the profile VIRTUAL (the CL-0 constitutional law)', () => {
    const born = newCampaignSimulationRules();
    // Anti-vacuity first: the rules object is real and carries the ordinary bank,
    // so the absences below are absences from a live object.
    expect(born.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);
    expect(Object.keys(born).length).toBeGreaterThan(20);
    for (const key of ['worldProgression', 'politicalAutonomy', 'spatialMode', 'travelMode', 'infoMode', 'profileVersion', 'narrativeTempo']) {
      expect(key in born, `${key} must stay virtual at a dark birth`).toBe(false);
    }
    // ... and those seven are the FIRST half of what a named preset materializes.
    // ⭐ THE PRICE MOVED, AND IT MOVED BY THE WAVE'S OWN ACT (L-DEFAULT hunk 1,
    // 2026-09-06). It read 7 (30 -> 37) while the default preset was dark. Hunk 1
    // lit that preset with the twenty-one class C+D virtual keys, and a preset's
    // keys are what a birth INTO it persists, so the measured price of naming this
    // successor is now 28 (30 -> 58): the seven above plus those twenty-one. The
    // number is re-derived here rather than carried, and the split is asserted
    // separately so a future drift cannot hide inside a single total.
    // ⭐ AND IT MOVED AGAIN BY A DECLARED ACT (LIT-1a, 2026-09-24; J-EM-16 under the owner's
    // word of 2026-09-23, "no just build it all shipped lit"). The FP_LIT_ALIVE fragment lit
    // two virtual register keys in this preset, so the price is now 30 (30 -> 60): the
    // seven profile axes plus 23 gate keys. The figures it replaces, verbatim: 28, 58, 21.
    const lit = newCampaignSimulationRules(DEFAULT_SIMULATION_PRESET_ID);
    const added = Object.keys(lit).filter(key => !(key in born));
    expect(added.length).toBe(30);
    expect(Object.keys(lit).length).toBe(60);
    // The profile half is exactly the seven asserted absent above; everything else
    // is a virtual gate key, never a profile axis, which is what keeps the CL-0
    // constitutional law intact for the campaigns that never name a preset at all.
    expect(added.filter(key => key.endsWith('Enabled')).length).toBe(23);
    expect(Object.keys(born).length).toBe(30);
  });

  test('FORCED DOOR: naming a preset makes the resolver return THAT preset', () => {
    // The mechanism is exercised BEFORE any successor exists — otherwise the seam
    // ships unproven and its first proof would be the flip itself.
    for (const id of PRESET_IDS) {
      const resolved = newCampaignSimulationRules(id);
      expect(resolved.presetId, `${id} must round-trip through the birth resolver`).toBe(id);
    }
    const fat = newCampaignSimulationRules('full_simulation');
    expect(fat.warLayerEnabled).toBe(true);
    expect(Object.keys(fat).length).toBeGreaterThan(Object.keys(newCampaignSimulationRules()).length);
  });

  test('the resolver FAILS CLOSED on an id no catalog entry answers', () => {
    // A birth is not a place to throw: a customer who cannot create a campaign has
    // lost more than a preset. A miss births today's world, and it is loud HERE.
    expect(JSON.stringify(newCampaignSimulationRules('no_such_preset')))
      .toBe(JSON.stringify(normalizeSimulationRules()));
    expect(JSON.stringify(newCampaignSimulationRules(undefined)))
      .toBe(JSON.stringify(newCampaignSimulationRules()));
  });

  test('the birth DOOR is byte-identical to the birth it replaces (dark-inert)', () => {
    // `ensureWorldState(null, campaign)` IS the pre-car birth expression, kept here
    // as the control. TRIPWIRE: this reds the day a successor is named, and that
    // red is the declared shift.
    const before = ensureWorldState(null, BIRTH_CAMPAIGN);
    const after = createNewCampaignWorldState(BIRTH_CAMPAIGN);
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
    // Non-vacuity: the control is a real world, not an empty object.
    expect(before.rngSeed).toBe(`world-pulse:${BIRTH_CAMPAIGN.id}`);
    // The door carries the forced preset all the way into the world.
    const forcedWorld = createNewCampaignWorldState(BIRTH_CAMPAIGN, 'full_simulation');
    expect(forcedWorld.simulationRules.presetId).toBe('full_simulation');
    expect(JSON.stringify(forcedWorld)).not.toBe(JSON.stringify(before));
  });

  test('LOADING never re-decides a world: ensureWorldState keeps plain normalize', () => {
    // ⛔ THE PROMISE. A seed is a starting world forever. If birth resolution ever
    // migrates into ensureWorldState, an INSTALLED campaign acquires virtual keys
    // it was never created with, silently, at its next load.
    //
    // The behavioural half is vacuous while the successor is null (both paths
    // resolve the same rules), so the live wire is the SOURCE of the shared
    // materializer: it must read the raw and nothing else.
    const materializer = BIRTH_SOURCES.worldState.slice(
      BIRTH_SOURCES.worldState.indexOf('export function ensureWorldStateWithEnvoyNormalizer'),
      BIRTH_SOURCES.worldState.indexOf('export function createNewCampaignWorldState'),
    );
    // Liveness anchor: the slice is the real function body, not an empty string.
    expect(materializer.length).toBeGreaterThan(500);
    expect(materializer.includes('const simulationRules = normalizeSimulationRules(raw?.simulationRules);')).toBe(true);
    // anchored: the positive above proves this slice is the live materializer body
    expect(materializer.includes('newCampaignSimulationRules'), 'the load path must never resolve a BIRTH preset').toBe(false);

    // The behavioural half, kept because it is what the source claim MEANS: a
    // legacy world with no rules key at all loads to the plain default and gains
    // no profile keys.
    const loaded = ensureWorldState({ tick: 3 }, BIRTH_CAMPAIGN);
    expect(loaded.simulationRules.presetId).toBe(DEFAULT_SIMULATION_PRESET_ID);
    expect(JSON.stringify(Object.keys(loaded.simulationRules)))
      .toBe(JSON.stringify(Object.keys(normalizeSimulationRules())));
  });

  test('the store births THROUGH the door — the seam is wired, not merely built', () => {
    // A behavioural pin here would be vacuous today (both expressions resolve the
    // same world while the successor is null), so the wiring is asserted where it
    // can actually fail: the creation module's source.
    const creation = BIRTH_SOURCES.creation;
    expect(creation.includes('createNewCampaignWorldState({ id, name: campaignName })')).toBe(true);
    // anchored: the positive above proves this source is the live creation module
    expect(creation.includes('ensureWorldState(null'), 'buildNewCampaign must not re-open the old birth path').toBe(false);
    // Detector liveness, both halves. (i) the scan finds the old CALL when the old
    // call is present, so the negative above measures absence and not a rotted
    // search; (ii) the stripper really removes comments, so the negative cannot be
    // satisfied by commenting the call out.
    expect(`${creation}\nworldState: ensureWorldState(null, {}),`.includes('ensureWorldState(null')).toBe(true);
    expect(executable('// worldState: ensureWorldState(null, {}),').includes('ensureWorldState(null')).toBe(false);
    expect(executable('worldState: ensureWorldState(null, {}),').includes('ensureWorldState(null')).toBe(true);
  });
});
