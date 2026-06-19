import { describe, it, expect } from 'vitest';

import {
  resolveMilitaryStress,
  isAtWar,
  PULSE_TO_GEN,
  WAR_CONDITION_TO_GEN,
} from '../../../src/domain/display/warStatusVocab.js';
import { GEN_TO_PULSE_TYPE } from '../../../src/domain/stressorPicker.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';

// ─────────────────────────────────────────────────────────────────────────────
// S1 — dual-stressor-vocab parity via ONE shared alias (warStatusVocab).
//
// A settlement reaches "under siege / at war" two ways:
//   - GENERATION-born: a settlement.stress[] entry with a generation type
//     (under_siege / occupied / wartime / insurgency).
//   - PULSE-born: the war layer stamps settlement.activeConditions[] — the
//     besieged VICTIM carries war_pressure; the AGGRESSOR carries war_drain +
//     army_deployed. It never writes a stress[] entry.
//
// Before S1 the two banners (PDF viewModel.defense.militaryStress + DefenseTab's
// STRESS_STATUS override) read ONLY generation stress, so a pulse-born siege lit
// NEITHER. resolveMilitaryStress folds BOTH vocabularies through the one alias so
// a pulse-born siege lights the SAME banner(s) as a generation-born one, while a
// generation-born siege resolves UNCHANGED (no fixture churn).
// ─────────────────────────────────────────────────────────────────────────────

// The PDF banner's scope (viewModel.js:648) and the DefenseTab banner's scope
// (DefenseTab.jsx STRESS_STATUS keys) — pinned here so the test asserts the
// faithful-superset relationship both sites rely on.
const PDF_TYPES = ['under_siege', 'occupied', 'wartime', 'insurgency'];
const DEFENSE_TAB_TYPES = [
  'under_siege', 'wartime', 'famine', 'occupied',
  'politically_fractured', 'recently_betrayed', 'plague_onset',
];

const baseSettlement = (patch = {}) => ({
  name: 'Testford',
  economicState: { prosperity: 'Moderate', primaryExports: ['grain'] },
  powerStructure: { factions: [{ faction: 'A' }, { faction: 'B' }] },
  institutions: [],
  config: {},
  ...patch,
});

describe('PULSE_TO_GEN — the single-source inverse alias', () => {
  it('is the mechanical inverse of GEN_TO_PULSE_TYPE (cannot drift)', () => {
    for (const [gen, pulse] of Object.entries(GEN_TO_PULSE_TYPE)) {
      expect(PULSE_TO_GEN[pulse]).toBe(gen);
    }
    // Frozen + same cardinality (GEN_TO_PULSE_TYPE is injective).
    expect(Object.isFrozen(PULSE_TO_GEN)).toBe(true);
    expect(Object.keys(PULSE_TO_GEN).length).toBe(Object.keys(GEN_TO_PULSE_TYPE).length);
  });

  it('maps the war archetypes to generation keys both banners already render', () => {
    expect(WAR_CONDITION_TO_GEN.war_pressure).toBe('under_siege');
    expect(WAR_CONDITION_TO_GEN.war_drain).toBe('wartime');
    expect(WAR_CONDITION_TO_GEN.army_deployed).toBe('wartime');
  });
});

describe('resolveMilitaryStress — generation-born (byte-identical, no churn)', () => {
  it('returns the real generation stress entry UNCHANGED', () => {
    const stressEntry = { type: 'under_siege', label: 'Under Siege', summary: 'The walls are surrounded.' };
    const s = baseSettlement({ stress: [stressEntry] });
    const out = resolveMilitaryStress(s, { types: PDF_TYPES });
    // Same object reference — the alias does not re-wrap a generation stress.
    expect(out).toBe(stressEntry);
    expect(out._synthetic).toBeUndefined();
  });

  it('preserves the prior first-match selection order', () => {
    const a = { type: 'wartime', label: 'Wartime' };
    const b = { type: 'under_siege', label: 'Under Siege' };
    // Array order decides — the FIRST war-type entry wins, exactly as the old
    // `stress.find(...)` did.
    const out = resolveMilitaryStress(baseSettlement({ stress: [a, b] }), { types: PDF_TYPES });
    expect(out).toBe(a);
  });

  it('returns null when no war stress and no war condition is present', () => {
    const s = baseSettlement({ stress: [{ type: 'famine' }], activeConditions: [{ archetype: 'plague', severity: 0.5 }] });
    expect(resolveMilitaryStress(s, { types: PDF_TYPES })).toBeNull();
    expect(isAtWar(s, { types: PDF_TYPES })).toBe(false);
  });

  it('a settlement with no stress and no conditions is null (legacy/empty)', () => {
    expect(resolveMilitaryStress(baseSettlement(), { types: PDF_TYPES })).toBeNull();
    expect(resolveMilitaryStress({}, { types: PDF_TYPES })).toBeNull();
  });
});

describe('resolveMilitaryStress — pulse-born (lights the banner)', () => {
  it('a war_pressure VICTIM resolves to under_siege (synthesized)', () => {
    const s = baseSettlement({ activeConditions: [{ archetype: 'war_pressure', severity: 0.6 }] });
    const out = resolveMilitaryStress(s, { types: PDF_TYPES });
    expect(out).not.toBeNull();
    expect(out.type).toBe('under_siege');
    expect(out._synthetic).toBe(true);
    expect(out._fromCondition).toBe('war_pressure');
    // It carries presentation fields both banners read (label / summary / icon).
    expect(out.label).toBe('Under Siege');
    expect(out.summary).toBeTruthy();
  });

  it('a war_drain / army_deployed AGGRESSOR resolves to wartime', () => {
    const s = baseSettlement({ activeConditions: [
      { archetype: 'war_drain', severity: 0.5 },
      { archetype: 'army_deployed', severity: 0.5 },
    ] });
    const out = resolveMilitaryStress(s, { types: PDF_TYPES });
    expect(out.type).toBe('wartime');
    expect(out._synthetic).toBe(true);
  });

  it('under_siege outranks wartime when both a victim and aggressor condition coexist', () => {
    const s = baseSettlement({ activeConditions: [
      { archetype: 'war_drain', severity: 0.5 },
      { archetype: 'war_pressure', severity: 0.6 },
    ] });
    expect(resolveMilitaryStress(s, { types: PDF_TYPES }).type).toBe('under_siege');
  });

  it('recovery conditions (siege_lifted) do NOT light the banner', () => {
    const s = baseSettlement({ activeConditions: [{ archetype: 'siege_lifted', severity: 0.3 }] });
    expect(resolveMilitaryStress(s, { types: PDF_TYPES })).toBeNull();
  });
});

describe('S1 parity — pulse-born siege lights BOTH banner paths via the shared alias', () => {
  // A pulse-born besieged victim: war_pressure condition, no generation stress.
  const pulseVictim = baseSettlement({ activeConditions: [{ archetype: 'war_pressure', severity: 0.6 }] });
  // A generation-born besieged settlement: the legacy stress[] entry.
  const genVictim = baseSettlement({ stress: [{ type: 'under_siege', label: 'Under Siege', summary: 'Surrounded.' }] });

  it('PDF banner (vm.defense.militaryStress) lights for the pulse-born siege', () => {
    const vm = buildViewModel({ settlement: pulseVictim });
    expect(vm.defense.militaryStress).not.toBeNull();
    expect(vm.defense.militaryStress.type).toBe('under_siege');
  });

  it('DefenseTab banner path resolves the pulse-born siege to a STRESS_STATUS key', () => {
    // The DefenseTab override picks STRESS_STATUS[resolved.type]; under_siege is a
    // key, so the banner lights. We assert the resolver returns a type the tab maps.
    const out = resolveMilitaryStress(pulseVictim, { types: DEFENSE_TAB_TYPES });
    expect(out.type).toBe('under_siege');
    expect(DEFENSE_TAB_TYPES).toContain(out.type);
  });

  it('both paths AGREE: pulse-born and generation-born resolve to the same canonical type', () => {
    const pdfPulse = buildViewModel({ settlement: pulseVictim }).defense.militaryStress;
    const pdfGen = buildViewModel({ settlement: genVictim }).defense.militaryStress;
    expect(pdfPulse.type).toBe(pdfGen.type); // under_siege ≡ under_siege

    const tabPulse = resolveMilitaryStress(pulseVictim, { types: DEFENSE_TAB_TYPES });
    const tabGen = resolveMilitaryStress(genVictim, { types: DEFENSE_TAB_TYPES });
    expect(tabPulse.type).toBe(tabGen.type);
    // And the PDF path and DefenseTab path agree with each other on the victim.
    expect(pdfPulse.type).toBe(tabPulse.type);
  });

  it('an aggressor lights both banners (wartime) — DefenseTab now has the wartime posture', () => {
    const aggressor = baseSettlement({ activeConditions: [{ archetype: 'war_drain', severity: 0.5 }] });
    expect(buildViewModel({ settlement: aggressor }).defense.militaryStress.type).toBe('wartime');
    expect(resolveMilitaryStress(aggressor, { types: DEFENSE_TAB_TYPES }).type).toBe('wartime');
    expect(DEFENSE_TAB_TYPES).toContain('wartime');
  });
});

describe('S1 no-churn — generation siege renders unchanged through the PDF viewModel', () => {
  it('vm.defense.militaryStress is the unchanged generation entry', () => {
    const stressEntry = { type: 'occupied', label: 'Under Occupation', summary: 'A foreign garrison holds the gate.' };
    const vm = buildViewModel({ settlement: baseSettlement({ stress: [stressEntry] }) });
    expect(vm.defense.militaryStress.type).toBe('occupied');
    expect(vm.defense.militaryStress.label).toBe('Under Occupation');
    expect(vm.defense.militaryStress.summary).toBe('A foreign garrison holds the gate.');
  });

  it('a peacetime settlement has no militaryStress banner (null)', () => {
    const vm = buildViewModel({ settlement: baseSettlement() });
    expect(vm.defense.militaryStress == null).toBe(true);
  });
});
