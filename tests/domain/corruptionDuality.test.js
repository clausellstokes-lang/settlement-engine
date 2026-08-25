/**
 * tests/domain/corruptionDuality.test.js — the corrupted-institution duality.
 *
 * Pins:
 *   • A compromised security institution (covert stooge or public corruption
 *     impairment) drags ONSET-side security — criminals with a patron in the
 *     watch recruit more freely.
 *   • Organic EXPOSURE reads RAW security: a strong watch keeps catching
 *     people even while parts of it are bought (no guild-drag double-dip).
 *   • A publicly corrupt institution (corruption impairment) raises the
 *     exposure visibility of anyone still corrupt inside it.
 *   • An ousting emits a 'corruption' impairment on the home institution and
 *     a corruption_exposed activeCondition — scandals enter the causal loop.
 */

import { describe, expect, test } from 'vitest';
import {
  compromisedSecurityInstitutions,
  patronageSecurityDrag,
  PATRONAGE_TUNING,
  onsetHazard,
  exposureChance,
} from '../../src/domain/corruption.js';
import { advanceNpcCorruption } from '../../src/domain/worldPulse/npcAgency.js';
import { applyCorruptionImpairments } from '../../src/domain/worldPulse/corruptionImpair.js';

function settlementWith({ npcs = [], institutions = [], safetyRatio = 2.5, prosperity = 'modest', criminalEffective = 60 } = {}) {
  return {
    name: 'Ashford',
    npcs,
    institutions,
    economicState: { prosperity, safetyProfile: { safetyRatio, compound: { criminalEffective } } },
    activeConditions: [],
  };
}

const WATCH = { id: 'inst.watch', name: 'City Watch' };
const GUILD = { id: 'inst.guild', name: "Thieves' Guild", category: 'criminal' };

describe('compromisedSecurityInstitutions()', () => {
  test('an unexposed corrupt NPC homed in the watch makes it covert-compromised', () => {
    const s = settlementWith({
      institutions: [WATCH, GUILD],
      npcs: [{ name: 'Captain Vex', corrupt: true, institutionId: 'City Watch' }],
    });
    const { covert, revealed } = compromisedSecurityInstitutions(s);
    expect(covert).toContain('City Watch');
    expect(revealed).toHaveLength(0);
  });

  test('a corruption impairment makes it revealed-compromised', () => {
    const s = settlementWith({
      institutions: [{ ...WATCH, impairments: [{ type: 'corruption', severity: 0.45 }] }, GUILD],
    });
    const { covert, revealed } = compromisedSecurityInstitutions(s);
    expect(revealed).toContain('City Watch');
    expect(covert).toHaveLength(0);
  });

  test('an ousted NPC no longer compromises anything covertly', () => {
    const s = settlementWith({
      institutions: [WATCH],
      npcs: [{ name: 'Captain Vex', corrupt: false, ousted: true, institutionId: 'City Watch' }],
    });
    expect(compromisedSecurityInstitutions(s).covert).toHaveLength(0);
  });

  test('drag is capped at maxDrag', () => {
    const s = settlementWith({
      institutions: [WATCH, { id: 'i2', name: 'Garrison' }, { id: 'i3', name: 'Magistrate Court' }],
      npcs: [
        { name: 'A', corrupt: true, institutionId: 'City Watch' },
        { name: 'B', corrupt: true, institutionId: 'Garrison' },
        { name: 'C', corrupt: true, institutionId: 'Magistrate Court' },
      ],
    });
    expect(patronageSecurityDrag(s).drag).toBe(PATRONAGE_TUNING.maxDrag);
  });
});

describe('duality through advanceNpcCorruption()', () => {
  // rng harness: each NPC's fork returns a fixed roll keyed off the fork name.
  function rngWith(rolls) {
    return {
      fork(key) {
        const match = Object.entries(rolls).find(([fragment]) => key.includes(fragment));
        const value = match ? match[1] : 0.999;
        return { random: () => value, fork: () => ({ random: () => value }) };
      },
      random: () => 0.999,
    };
  }

  function worldFor(settlement, npcStateById) {
    return {
      worldState: { npcStates: npcStateById },
      snapshot: { settlements: [{ id: 'a', settlement }] },
    };
  }

  function cleanState(id, name) {
    return {
      npcId: id, settlementId: 'a', name, corruption: false,
      corruptionProfile: { corrupted: false, vector: null },
      dotRank: 2, timesExposed: 0, corruptionHeat: 0,
    };
  }

  function corruptState(id, name) {
    return { ...cleanState(id, name), corruption: true, corruptionProfile: { corrupted: true, vector: 'greed' }, corruptionHeat: 0.3 };
  }

  test('patronage drag raises onset hazard: the recruit turns ONLY when the watch is bought', () => {
    // High security (ratio 2.5 -> 1.0) almost floors onset; the compromised
    // watch drags onset security to 0.85, lifting the hazard above the roll.
    const npcRecruit = { name: 'Aldous', flaw: 'greedy' };
    const stooge = { name: 'Captain Vex', corrupt: true, institutionId: 'City Watch' };
    const roll = (onsetHazard({ crime: 0.6, security: 1.0, prosperity: 0.4, priorExposures: 0 })
      + onsetHazard({ crime: 0.6, security: 0.85, prosperity: 0.4, priorExposures: 0 })) / 2;

    const compromised = settlementWith({ institutions: [WATCH, GUILD], npcs: [npcRecruit, stooge] });
    const cleanWatch = settlementWith({ institutions: [WATCH, GUILD], npcs: [npcRecruit] });

    const turnedWhenBought = advanceNpcCorruption(
      worldFor(compromised, { 'a:aldous': cleanState('a:aldous', 'Aldous'), 'a:captain_vex': corruptState('a:captain_vex', 'Captain Vex') }).worldState,
      worldFor(compromised).snapshot,
      rngWith({ aldous: roll, captain_vex: 0.999 }),
      { tick: 1 },
    );
    expect(turnedWhenBought.worldState.npcStates['a:aldous'].corruption).toBe(true);

    const heldWhenClean = advanceNpcCorruption(
      worldFor(cleanWatch, { 'a:aldous': cleanState('a:aldous', 'Aldous') }).worldState,
      worldFor(cleanWatch).snapshot,
      rngWith({ aldous: roll }),
      { tick: 1 },
    );
    expect(heldWhenClean.worldState.npcStates['a:aldous'].corruption).toBe(false);
  });

  test('a conspiracy traitor is exposable even with NO criminal institution (onset stays gated)', () => {
    // Betrayal-seeded traitors have a foreign patron, not a guild — without
    // this, settlements lacking criminal infrastructure could never discover
    // them, and each betrayal re-ignition would corrupt one more NPC forever.
    const s = settlementWith({
      institutions: [WATCH], // no criminal institution
      npcs: [
        { name: 'Captain Vex', corrupt: true, institutionId: 'City Watch' },
        { name: 'Aldous', flaw: 'greedy' },
      ],
    });
    const result = advanceNpcCorruption(
      {
        npcStates: {
          'a:captain_vex': corruptState('a:captain_vex', 'Captain Vex'),
          'a:aldous': cleanState('a:aldous', 'Aldous'),
        },
      },
      { settlements: [{ id: 'a', settlement: s }] },
      rngWith({ captain_vex: 0.05, aldous: 0.0001 }),
      { tick: 1 },
    );
    expect(result.exposures).toHaveLength(1);
    expect(result.exposures[0].name).toBe('Captain Vex');
    // Onset did NOT fire despite a near-zero roll: no criminal infrastructure.
    expect(result.worldState.npcStates['a:aldous'].corruption).toBe(false);
  });

  test('exposure reads RAW security: a strong dragged-down watch still catches its corrupt captain', () => {
    // Guild strength 0.9 would have dragged effective security to 0.55 under
    // the old wiring (exposure ~0.03); raw security 1.0 puts it ~0.12.
    const stooge = { name: 'Captain Vex', corrupt: true, institutionId: 'City Watch' };
    const s = settlementWith({ institutions: [WATCH, GUILD], npcs: [stooge] });
    const result = advanceNpcCorruption(
      { npcStates: { 'a:captain_vex': corruptState('a:captain_vex', 'Captain Vex') } },
      { settlements: [{ id: 'a', settlement: s }] },
      rngWith({ captain_vex: 0.08 }),
      { tick: 1, guildStrengthBy: new Map([['a', 0.9]]) },
    );
    expect(result.exposures).toHaveLength(1);
    expect(result.exposures[0].name).toBe('Captain Vex');
  });

  test('a revealed institution raises exposure visibility for those still inside', () => {
    const revealedWatch = { ...WATCH, impairments: [{ type: 'corruption', severity: 0.45 }] };
    const insider = { name: 'Sergeant Brann', corrupt: true, institutionId: 'City Watch' };
    // Pick a roll that passes ONLY with the proximity bonus (+0.25 visibility
    // -> +0.015 exposure chance).
    const base = settlementWith({ institutions: [WATCH, GUILD], npcs: [insider] });
    const revealed = settlementWith({ institutions: [revealedWatch, GUILD], npcs: [insider] });
    const states = () => ({ 'a:sergeant_brann': corruptState('a:sergeant_brann', 'Sergeant Brann') });

    const probe = (settlement, roll) => advanceNpcCorruption(
      { npcStates: states() },
      { settlements: [{ id: 'a', settlement }] },
      rngWith({ sergeant_brann: roll }),
      { tick: 1, guildStrengthBy: new Map([['a', 0.2]]) },
    ).exposures.length;

    // The wedge roll sits exactly between the two exposure probabilities —
    // the ONLY difference between the runs is the proximity visibility term.
    const pBase = exposureChance({ security: 1.0, prosperity: 0.4, guildStrength: 0.2, visibility: 2 / 3, priorExposures: 0 });
    const pRevealed = exposureChance({ security: 1.0, prosperity: 0.4, guildStrength: 0.2, visibility: Math.min(1, 2 / 3 + PATRONAGE_TUNING.proximityVisibilityBonus), priorExposures: 0 });
    expect(pRevealed).toBeGreaterThan(pBase);
    const wedge = (pBase + pRevealed) / 2;
    expect(probe(base, wedge)).toBe(0);
    expect(probe(revealed, wedge)).toBe(1);
  });
});

describe('organic institutional reform', () => {
  const lowRng = { fork: () => ({ random: () => 0.01 }) };
  const highRng = { fork: () => ({ random: () => 0.99 }) };
  const impairedWatch = {
    ...WATCH,
    status: 'impaired',
    impairments: [
      { type: 'corruption', severity: 0.45, causeEventId: 'c1' },
      { type: 'legitimacy', severity: 0.3, causeEventId: 'c2' },
    ],
  };

  test('a purged institution can reform: corruption impairment clears, legitimacy scar stays', async () => {
    const { advanceInstitutionReform } = await import('../../src/domain/worldPulse/corruptionImpair.js');
    const s = settlementWith({ institutions: [impairedWatch], npcs: [] });
    const { settlement, reformed } = advanceInstitutionReform(s, lowRng);
    expect(reformed).toEqual([{ name: 'City Watch' }]);
    const watch = settlement.institutions[0];
    expect(watch.impairments.some(i => i.type === 'corruption')).toBe(false);
    expect(watch.impairments.some(i => i.type === 'legitimacy')).toBe(true);
    expect(watch.status).toBe('impaired'); // legitimacy scar keeps it impaired
  });

  test('clearing the LAST impairment restores active status', async () => {
    const { advanceInstitutionReform } = await import('../../src/domain/worldPulse/corruptionImpair.js');
    const onlyCorruption = { ...WATCH, status: 'impaired', impairments: [{ type: 'corruption', severity: 0.45, causeEventId: 'c1' }] };
    const s = settlementWith({ institutions: [onlyCorruption], npcs: [] });
    const { settlement } = advanceInstitutionReform(s, lowRng);
    expect(settlement.institutions[0].status).toBe('active');
    expect(settlement.institutions[0].impairments).toHaveLength(0);
  });

  test('an institution still harboring an unexposed corrupt insider cannot reform', async () => {
    const { advanceInstitutionReform } = await import('../../src/domain/worldPulse/corruptionImpair.js');
    const s = settlementWith({
      institutions: [impairedWatch],
      npcs: [{ name: 'Sergeant Brann', corrupt: true, institutionId: 'City Watch' }],
    });
    const { reformed } = advanceInstitutionReform(s, lowRng);
    expect(reformed).toHaveLength(0);
  });

  test('a failed roll changes nothing (same settlement reference)', async () => {
    const { advanceInstitutionReform } = await import('../../src/domain/worldPulse/corruptionImpair.js');
    const s = settlementWith({ institutions: [impairedWatch], npcs: [] });
    const { settlement, reformed } = advanceInstitutionReform(s, highRng);
    expect(reformed).toHaveLength(0);
    expect(settlement).toBe(s);
  });
});

describe('public scandal surfaces', () => {
  test('an ousting stamps a corruption impairment on the home institution', () => {
    const s = settlementWith({ institutions: [WATCH, GUILD] });
    const next = applyCorruptionImpairments(s, [{
      npcId: 'a:vex', name: 'Captain Vex', kind: 'ousted',
      criminalInstitution: "Thieves' Guild", homeInstitution: 'City Watch',
    }], { now: '2026-01-01T00:00:00.000Z' });
    const watch = next.institutions.find(i => i.name === 'City Watch');
    expect((watch.impairments || []).some(imp => imp.type === 'corruption')).toBe(true);
    expect((watch.impairments || []).some(imp => imp.type === 'legitimacy')).toBe(true);
  });

  test('a demotion does NOT make the institution publicly corrupt', () => {
    const s = settlementWith({ institutions: [WATCH, GUILD] });
    const next = applyCorruptionImpairments(s, [{
      npcId: 'a:vex', name: 'Captain Vex', kind: 'demoted',
      criminalInstitution: "Thieves' Guild", homeInstitution: 'City Watch',
    }], { now: '2026-01-01T00:00:00.000Z' });
    const watch = next.institutions.find(i => i.name === 'City Watch');
    expect((watch.impairments || []).some(imp => imp.type === 'corruption')).toBe(false);
  });
});
