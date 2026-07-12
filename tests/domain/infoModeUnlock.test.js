/**
 * infoModeUnlock.test.js — STEP 3.5 CL wiring: the §11 information axis stops
 * being locked. Pins:
 *   • infoModeOf: live modes pass, the pre-3.5 'delayed' catalog token aliases
 *     to 'perfect_delayed', 'full' + garbage fail CLOSED to 'omniscient'.
 *   • normalizeSimulationRules preserves a live infoMode through the profile
 *     materialize branch; a VIRTUAL (untouched) profile still persists none.
 *   • Preset wiring: living_realm → perfect_delayed, full_simulation →
 *     unreliable; preset identity is STABLE for pre-3.5 saves that stored the
 *     old omniscient clamp (infoMode is deliberately not a comparison key).
 *   • Ruleset receipts fire on an infoMode change (prepareRulesUpdate:
 *     changedKeys + the rulesetLog receipt + the wizard-news realm entry) —
 *     the receipt the rumor network's PROSPECTIVE floor reads.
 */
import { describe, expect, it } from 'vitest';

import {
  SIMULATION_RULE_PRESETS,
  infoModeOf,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  INFO_MODES,
  prepareRulesUpdate,
  validateSimulationProfile,
} from '../../src/domain/worldPulse/simulationProfile.js';
import { prospectiveFloorTick } from '../../src/domain/spatial/rumorNetwork.js';

const NOW = '2026-01-01T00:00:00.000Z';

describe('infoModeOf — the effective read', () => {
  it('passes the live modes, aliases the old catalog token, fails closed otherwise', () => {
    expect(infoModeOf({ infoMode: 'perfect_delayed' })).toBe('perfect_delayed');
    expect(infoModeOf({ infoMode: 'unreliable' })).toBe('unreliable');
    expect(infoModeOf({ infoMode: 'delayed' })).toBe('perfect_delayed'); // pre-3.5 alias
    expect(infoModeOf({ infoMode: 'full' })).toBe('omniscient');         // Wave A+ — fails closed
    expect(infoModeOf({ infoMode: 'omniscient' })).toBe('omniscient');
    expect(infoModeOf({})).toBe('omniscient');
    expect(infoModeOf(null)).toBe('omniscient');
    expect(infoModeOf({ infoMode: 42 })).toBe('omniscient');
  });
});

describe('normalizeSimulationRules — the canonical write', () => {
  it('preserves a live infoMode when the profile materializes', () => {
    for (const mode of ['perfect_delayed', 'unreliable']) {
      const rules = normalizeSimulationRules({ infoMode: mode });
      expect(rules.infoMode).toBe(mode);
    }
    expect(normalizeSimulationRules({ infoMode: 'delayed' }).infoMode).toBe('perfect_delayed');
    expect(normalizeSimulationRules({ infoMode: 'full' }).infoMode).toBe('omniscient');
  });

  it('a VIRTUAL profile stays virtual: no profile key touched ⇒ none persisted', () => {
    const rules = normalizeSimulationRules({ warLayerEnabled: true });
    expect('infoMode' in rules).toBe(false);
  });

  it('is idempotent on a live mode (re-normalizing changes nothing)', () => {
    const once = normalizeSimulationRules({ infoMode: 'unreliable' });
    const twice = normalizeSimulationRules(once);
    expect(twice).toEqual(once);
  });
});

describe('preset wiring (§3.2-7)', () => {
  it('living_realm carries perfect_delayed; full_simulation carries unreliable', () => {
    expect(SIMULATION_RULE_PRESETS.living_realm.rules.infoMode).toBe('perfect_delayed');
    expect(SIMULATION_RULE_PRESETS.full_simulation.rules.infoMode).toBe('unreliable');
    // The legacy trio + the quieter §11 presets stay omniscient.
    for (const id of ['quiet_local', 'realistic_regional', 'dramatic_campaign', 'static_campaign', 'narrative_campaign']) {
      expect(SIMULATION_RULE_PRESETS[id].rules.infoMode, id).toBe('omniscient');
    }
  });

  it('applying the presets round-trips the mode through normalization', () => {
    const living = normalizeSimulationRules(SIMULATION_RULE_PRESETS.living_realm.rules);
    expect(living.infoMode).toBe('perfect_delayed');
    expect(living.presetId).toBe('living_realm');
    const full = normalizeSimulationRules(SIMULATION_RULE_PRESETS.full_simulation.rules);
    expect(full.infoMode).toBe('unreliable');
    expect(full.presetId).toBe('full_simulation');
  });

  it('a PRE-3.5 living_realm save (old omniscient clamp) keeps its preset identity byte-stably', () => {
    // What the old normalizer persisted for an applied living_realm preset:
    // the full profile materialized with infoMode clamped to omniscient.
    const pre35 = normalizeSimulationRules({
      ...SIMULATION_RULE_PRESETS.living_realm.rules,
      infoMode: 'omniscient',
    });
    expect(pre35.presetId).toBe('living_realm'); // identity survives
    expect(pre35.infoMode).toBe('omniscient');   // the stored choice survives (no silent upgrade)
    // …and re-normalizing is byte-stable.
    expect(JSON.stringify(normalizeSimulationRules(pre35))).toBe(JSON.stringify(pre35));
  });
});

describe('the coercion matrix (validateSimulationProfile)', () => {
  it('live modes coerce nothing; the alias reports nothing; full still reports', () => {
    for (const mode of ['perfect_delayed', 'unreliable', 'omniscient']) {
      const { canonical, coercions } = validateSimulationProfile({ infoMode: mode });
      expect(canonical.infoMode).toBe(mode);
      expect(coercions.filter((c) => c.key === 'infoMode')).toEqual([]);
    }
    // The alias is a rename, not a coercion — the DM's chosen mode IS stored.
    const alias = validateSimulationProfile({ infoMode: 'delayed' });
    expect(alias.canonical.infoMode).toBe('perfect_delayed');
    expect(alias.coercions.filter((c) => c.key === 'infoMode')).toEqual([]);
    // 'full' fails closed AND reports.
    const full = validateSimulationProfile({ infoMode: 'full' });
    expect(full.canonical.infoMode).toBe('omniscient');
    const hit = full.coercions.find((c) => c.key === 'infoMode');
    expect(hit?.law).toBe('information_not_yet_built');
    expect(hit?.kind).toBe('stored');
  });

  it('the catalog names the unlocked rung', () => {
    expect(INFO_MODES).toContain('perfect_delayed');
    expect(INFO_MODES).not.toContain('delayed');
  });
});

describe('ruleset receipts (the PROSPECTIVE floor substrate)', () => {
  it('an infoMode change mints a rulesetLog receipt + a wizard-news realm entry', () => {
    // A profile already materialized (any prior axis touch), so this edit's
    // changedKeys is exactly the infoMode change — the receipt reads clean.
    const worldState = { tick: 7, simulationRules: normalizeSimulationRules({ politicalAutonomy: 'routine' }) };
    const prepared = prepareRulesUpdate(worldState, { infoMode: 'unreliable' }, { currentTick: 7, entries: [] }, NOW);
    expect(prepared.changedKeys).toEqual(['infoMode']);
    const receipt = prepared.nextWorldState.rulesetLog?.rc_7_0;
    expect(receipt).toBeTruthy();
    expect(receipt.tick).toBe(7);
    expect(receipt.changedKeys).toContain('infoMode');
    expect(receipt.to.infoMode).toBe('unreliable');
    // The wizard-news receipt entry, in the house voice.
    const entry = prepared.nextWizardNews?.entries?.find((e) => e.kind === 'ruleset_change');
    expect(entry).toBeTruthy();
    expect(entry.headline).toContain('news now travels and twists');
    // …and the rumor network's prospective floor reads exactly this receipt.
    expect(prospectiveFloorTick(prepared.nextWorldState)).toBe(7);
  });

  it('dialling BACK to omniscient mints a receipt but never re-floors seeding', () => {
    const withLive = { tick: 3, simulationRules: normalizeSimulationRules({ infoMode: 'unreliable' }) };
    const prepared = prepareRulesUpdate(withLive, { infoMode: 'omniscient' }, { currentTick: 9, entries: [] }, NOW);
    expect(prepared.changedKeys).toContain('infoMode');
    // The floor tracks the last LIVE turn-on, not the turn-off.
    expect(prospectiveFloorTick(prepared.nextWorldState)).toBe(0);
  });

  it('no effective change ⇒ no receipt (byte-invisible)', () => {
    const worldState = { tick: 4, simulationRules: normalizeSimulationRules({ infoMode: 'unreliable' }) };
    const prepared = prepareRulesUpdate(worldState, { infoMode: 'unreliable' }, { currentTick: 4, entries: [] }, NOW);
    expect(prepared.changedKeys).toEqual([]);
    expect(prepared.nextWizardNews).toBe(null);
    expect('rulesetLog' in prepared.nextWorldState).toBe(false);
  });
});
