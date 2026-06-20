import { describe, expect, test } from 'vitest';

import {
  describeDeityEffects,
  DEITY_AXIS_EFFECTS,
  DEITY_CORRUPTION_TUNING as RX_CORRUPTION,
  DEITY_LAW_TUNING as RX_LAW,
  DEITY_TEMPER_SIGN as RX_TEMPER,
  AGGRESSION_TUNING as RX_AGGRESSION,
  DEITY_RANK_AUTHORITY as RX_RANK,
  DEITY_MAGIC_LEGALITY_STEPS as RX_MAGIC,
} from '../../../src/domain/display/deityEffects.js';

// The ENGINE sources of truth (the inline couplings the engine actually applies).
import { DEITY_CORRUPTION_TUNING, DEITY_LAW_TUNING } from '../../../src/domain/corruption.js';
import { DEITY_TEMPER_SIGN, AGGRESSION_TUNING } from '../../../src/domain/worldPulse/disposition.js';
import { DEITY_RANK_AUTHORITY } from '../../../src/domain/causalState.js';
import {
  DEITY_MAGIC_LEGALITY_STEPS,
  deriveMagicProfile,
  magicLegalityBands,
} from '../../../src/domain/magicProfile.js';

// ─────────────────────────────────────────────────────────────────────────────
// P0.2 — the shared deity-coupling module. It is the SINGLE SOURCE the UI reads;
// these assertions prove the module re-exports the engine's own numbers (never a
// hand-copied drift), so a re-tune in the engine flows through automatically.
// ─────────────────────────────────────────────────────────────────────────────

describe('deityEffects constants are the ENGINE constants (proven equal)', () => {
  test('re-exports are referentially the engine objects', () => {
    expect(RX_CORRUPTION).toBe(DEITY_CORRUPTION_TUNING);
    expect(RX_TEMPER).toBe(DEITY_TEMPER_SIGN);
    expect(RX_AGGRESSION).toBe(AGGRESSION_TUNING);
    expect(RX_RANK).toBe(DEITY_RANK_AUTHORITY);
    expect(RX_MAGIC).toBe(DEITY_MAGIC_LEGALITY_STEPS);
  });

  test('the consolidated map reads the engine values verbatim', () => {
    expect(DEITY_AXIS_EFFECTS.alignment.evil.direction).toBe(DEITY_CORRUPTION_TUNING.axisSign.evil);
    expect(DEITY_AXIS_EFFECTS.alignment.good.direction).toBe(DEITY_CORRUPTION_TUNING.axisSign.good);
    expect(DEITY_AXIS_EFFECTS.alignment.evil.magnitude).toBe(DEITY_CORRUPTION_TUNING.span);
    expect(DEITY_AXIS_EFFECTS.temperament.warlike.direction).toBe(DEITY_TEMPER_SIGN.warlike);
    expect(DEITY_AXIS_EFFECTS.temperament.peacelike.direction).toBe(DEITY_TEMPER_SIGN.peacelike);
    expect(DEITY_AXIS_EFFECTS.temperament.warlike.magnitude).toBe(AGGRESSION_TUNING.W_DEITY);
    expect(DEITY_AXIS_EFFECTS.rank.major.authorityLift).toBe(DEITY_RANK_AUTHORITY.major);
    expect(DEITY_AXIS_EFFECTS.rank.minor.authorityLift).toBe(DEITY_RANK_AUTHORITY.minor);
    expect(DEITY_AXIS_EFFECTS.rank.cult.authorityLift).toBe(DEITY_RANK_AUTHORITY.cult);
  });
});

describe('describeDeityEffects — per-axis', () => {
  test('null / absent snapshot → [] (dormancy guarantee)', () => {
    expect(describeDeityEffects(null)).toEqual([]);
    expect(describeDeityEffects(undefined)).toEqual([]);
  });

  test('a fully-neutral deity says nothing', () => {
    expect(describeDeityEffects({ alignmentAxis: 'neutral', temperamentAxis: 'neutral' })).toEqual([]);
  });

  test('evil → corruption onset string', () => {
    expect(describeDeityEffects({ alignmentAxis: 'evil' })).toContain(
      "Evil — corrupts the faithful even without a thieves' guild",
    );
  });

  test('good → corruption purge string', () => {
    expect(describeDeityEffects({ alignmentAxis: 'good' })).toContain(
      'Good — purges corruption, installing incorruptible successors',
    );
  });

  test('warlike → aggression string', () => {
    expect(describeDeityEffects({ temperamentAxis: 'warlike' })).toContain(
      "Warlike — raises the realm's aggression",
    );
  });

  test('peacelike → aggression-tempering string', () => {
    expect(describeDeityEffects({ temperamentAxis: 'peacelike' })).toContain(
      "Peacelike — tempers the realm's aggression",
    );
  });

  test('rank strings for major / minor / cult', () => {
    expect(describeDeityEffects({ rankAxis: 'major' })).toContain('Major — anchors religious authority');
    expect(describeDeityEffects({ rankAxis: 'minor' })).toContain('Minor — lends modest religious authority');
    expect(describeDeityEffects({ rankAxis: 'cult' })).toContain('Cult — a fringe following with little authority');
  });

  test('ONLY a major god tightens magic legality', () => {
    expect(describeDeityEffects({ rankAxis: 'minor' }).some(s => /magic legality/.test(s))).toBe(false);
    expect(describeDeityEffects({ rankAxis: 'cult' }).some(s => /magic legality/.test(s))).toBe(false);
    expect(describeDeityEffects({ rankAxis: 'major' })).toContain('Tightens magic legality');
  });

  test('a warlike/evil major god is the OPENLY OPPOSED magic variant', () => {
    expect(describeDeityEffects({ rankAxis: 'major', temperamentAxis: 'warlike' })).toContain(
      'Tightens magic legality — magic is openly opposed',
    );
    expect(describeDeityEffects({ rankAxis: 'major', alignmentAxis: 'evil' })).toContain(
      'Tightens magic legality — magic is openly opposed',
    );
  });

  test('a full war-god lists alignment, temperament, rank, and magic in order', () => {
    const out = describeDeityEffects({ alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' });
    expect(out).toEqual([
      "Evil — corrupts the faithful even without a thieves' guild",
      "Warlike — raises the realm's aggression",
      'Major — anchors religious authority',
      'Tightens magic legality — magic is openly opposed',
    ]);
  });

  // ── B5: the 4th axis (lawful/chaotic) → law_order ──────────────────────────
  test('lawful → strengthens law & order', () => {
    expect(describeDeityEffects({ lawAxis: 'lawful' })).toContain('Lawful — strengthens law & order');
  });

  test('chaotic → erodes order, tolerates corruption', () => {
    expect(describeDeityEffects({ lawAxis: 'chaotic' })).toContain('Chaotic — erodes order, tolerates corruption');
  });

  test('a law-neutral deity (or a legacy 3-axis deity with no lawAxis) says nothing about law', () => {
    expect(describeDeityEffects({ lawAxis: 'neutral' }).some(s => /law & order|tolerates corruption/.test(s))).toBe(false);
    // Legacy 3-axis deity: rank still speaks, but NO law string.
    const legacy = describeDeityEffects({ alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor' });
    expect(legacy.some(s => /law & order|tolerates corruption/.test(s))).toBe(false);
    expect(legacy).toContain('Minor — lends modest religious authority');
  });

  test('law string is APPENDED last, leaving the first four axes order stable', () => {
    const out = describeDeityEffects({ alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major', lawAxis: 'chaotic' });
    expect(out).toEqual([
      "Evil — corrupts the faithful even without a thieves' guild",
      "Warlike — raises the realm's aggression",
      'Major — anchors religious authority',
      'Tightens magic legality — magic is openly opposed',
      'Chaotic — erodes order, tolerates corruption',
    ]);
  });
});

// The law-axis coupling constant is the ENGINE's (corruption.js DEITY_LAW_TUNING),
// re-exported verbatim — never a hand-copied drift.
describe('B5 law-axis constants are the ENGINE constants (proven equal)', () => {
  test('re-export is referentially the engine object', () => {
    expect(RX_LAW).toBe(DEITY_LAW_TUNING);
  });
  test('the consolidated map reads the engine law values verbatim', () => {
    expect(DEITY_AXIS_EFFECTS.law.lawful.direction).toBe(DEITY_LAW_TUNING.axisSign.lawful);
    expect(DEITY_AXIS_EFFECTS.law.chaotic.direction).toBe(DEITY_LAW_TUNING.axisSign.chaotic);
    expect(DEITY_AXIS_EFFECTS.law.lawful.lawOrderLift).toBe(DEITY_LAW_TUNING.axisSign.lawful * DEITY_LAW_TUNING.lawOrderSwing);
    expect(DEITY_AXIS_EFFECTS.law.chaotic.lawOrderLift).toBe(DEITY_LAW_TUNING.axisSign.chaotic * DEITY_LAW_TUNING.lawOrderSwing);
  });
});

// The magic-legality coupling is band-step logic, not a scalar — prove the
// module's "tightens legality" claim matches what deriveMagicProfile actually does
// (a major god moves legality DOWN the band ladder by DEITY_MAGIC_LEGALITY_STEPS).
describe('magic-legality coupling matches deriveMagicProfile', () => {
  const baseSettlement = (deity) => ({
    name: 'Theocropolis',
    config: { magicLevel: 'moderate', primaryDeitySnapshot: deity },
    institutions: [],
    powerStructure: { factions: [] },
    economicState: { prosperity: 'Moderate' },
  });

  const bands = magicLegalityBands();
  const legalityIndex = (s) => bands.indexOf(deriveMagicProfile(s).legality);

  test('a non-regulatory major god tightens legality by exactly the major step', () => {
    const none = legalityIndex(baseSettlement(undefined));
    const major = legalityIndex(baseSettlement({ rankAxis: 'major', alignmentAxis: 'good', temperamentAxis: 'peacelike' }));
    expect(none - major).toBe(DEITY_MAGIC_LEGALITY_STEPS.major);
  });

  test('a warlike/evil major god tightens by the regulatory step', () => {
    const none = legalityIndex(baseSettlement(undefined));
    const reg = legalityIndex(baseSettlement({ rankAxis: 'major', alignmentAxis: 'evil', temperamentAxis: 'warlike' }));
    expect(none - reg).toBe(DEITY_MAGIC_LEGALITY_STEPS.regulatory);
  });

  test('a minor god does NOT move magic legality (only a major god regulates)', () => {
    const none = legalityIndex(baseSettlement(undefined));
    const minor = legalityIndex(baseSettlement({ rankAxis: 'minor', alignmentAxis: 'evil', temperamentAxis: 'warlike' }));
    expect(none).toBe(minor);
  });
});
