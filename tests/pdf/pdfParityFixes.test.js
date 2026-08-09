/**
 * tests/pdf/pdfParityFixes.test.js — pdf-2 / pdf-3 / pdf-4.
 *
 *  pdf-2  Object-shaped coherence notes / structural suggestions / violations must
 *         print their PROSE, not their bare category key (noteText).
 *  pdf-3  By-design contradictions derive from the settlement-root structuralViolations
 *         (their real home) and are EXCLUDED from the violations list, so authored
 *         plot seeds stop printing as garbled STRUCTURAL VIOLATIONS.
 *  pdf-4  The PDF defense military-status set matches the web DefenseTab exactly
 *         (via the shared DEFENSE_STRESS_STATUS). Cycle-3 H3: that shared set is now
 *         DERIVED from the producer STRESS_TYPE_MAP and covers EVERY registered stress
 *         type (was 6 of 15) — so wartime/insurgency/etc now raise a callout on BOTH
 *         surfaces, where the earlier pdf-4 fix had instead shrunk the PDF to 6.
 */
import { describe, test, expect } from 'vitest';
import { noteText, label, hookText } from '../../src/pdf/lib/format.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { DEFENSE_STRESS_STATUS } from '../../src/domain/display/defenseDisplay.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';

describe('pdf-2 — noteText coerces object-shaped notes to prose', () => {
  test('a coherence note { type, severity, note } prints its note, not "Power Economic"', () => {
    expect(noteText({ type: 'power_economic', severity: 'warn', note: 'The guild owns the council it answers to.' }))
      .toBe('The guild owns the council it answers to.');
    // The old label() path dropped the prose down to the humanised type.
    expect(label({ type: 'power_economic', severity: 'warn', note: 'x' })).toBe('Power Economic');
  });

  test('a structural suggestion { reason, suggested[] } prints reason + the options', () => {
    const out = noteText({ type: 'suggestion', reason: 'A market with no road access.', suggested: ['river_dock', 'caravan_post'] });
    expect(out).toMatch(/A market with no road access\./);
    expect(out).toMatch(/Consider: River Dock, Caravan Post\./);
  });

  test('a structural violation { institution, reason } prints "Institution: reason"', () => {
    expect(noteText({ type: 'out_of_tier', institution: 'university', reason: 'A city-tier institution in a village.' }))
      .toBe('University: A city-tier institution in a village.');
  });

  test('a plain string and a label-shaped item still read exactly as before', () => {
    // Same as the old label() path for strings (snake_case humanised, prose kept).
    expect(noteText('food_security_low')).toBe(label('food_security_low'));
    expect(noteText('low food security')).toBe('low food security');
    expect(noteText({ label: 'Iron Ore' })).toBe('Iron Ore');
  });
});

describe('plot-hook formatting honors the canonical producer contract', () => {
  test('renders string/{hook}/{text} and rejects alias-only objects', () => {
    expect(hookText('Bare hook')).toBe('Bare hook');
    expect(hookText({ hook: 'Generator hook' })).toBe('Generator hook');
    expect(hookText({ text: 'Dossier hook' })).toBe('Dossier hook');
    for (const key of [
      'description', 'summary', 'prompt', 'title',
      'label', 'body', 'content', 'value',
    ]) {
      expect(hookText({ [key]: 'Unsupported alias' }), key).toBe('');
    }
  });
});

const settlementWith = (over) => ({
  name: 'Testburg', tier: 'village', population: 400,
  config: { tradeRouteAccess: 'road' },
  economicState: { primaryImports: [], primaryExports: [] },
  powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  institutions: [], npcs: [],
  ...over,
});

describe('pdf-3 — by-design contradictions are plot seeds, not garbled violations', () => {
  const settlement = settlementWith({
    structuralViolations: [
      { type: 'out_of_tier', institution: 'University', reason: 'City-tier institution in a village — deliberate override.', severity: 'by_design' },
      { type: 'missing_wall', institution: 'Palisade', reason: 'No defensive wall for the tier.', severity: 'critical' },
    ],
  });
  const vm = buildViewModel({ settlement });

  test('the by-design item is surfaced as a contradiction (derived from structuralViolations)', () => {
    const bdc = vm.viability.byDesignContradictions;
    expect(bdc.length).toBe(1);
    expect(bdc[0].institution).toBe('University');
    // And it renders as prose via noteText, not a bare "Out Of Tier".
    expect(noteText(bdc[0])).toMatch(/University: City-tier institution/);
  });

  test('the by-design item is EXCLUDED from structuralViolations (no double-print)', () => {
    const vios = vm.viability.structuralViolations;
    expect(vios.every(v => v.severity !== 'by_design')).toBe(true);
    expect(vios.map(v => v.institution)).toEqual(['Palisade']);
  });
});

describe('pdf-4 — defense military-status set matches the web DefenseTab', () => {
  test('plague_onset raises a military-status callout (M11a pestilence)', () => {
    const vm = buildViewModel({ settlement: settlementWith({ stress: [{ type: 'plague_onset', label: 'The Coughing Sickness', summary: 'Quarantine.' }] }) });
    expect(vm.defense.militaryStress).toBeTruthy();
    expect(vm.defense.militaryStress.type).toBe('plague_onset');
  });

  test('wartime / insurgency NOW raise a callout on both surfaces (H3 — was dark)', () => {
    const vmWar = buildViewModel({ settlement: settlementWith({ stress: [{ type: 'wartime', label: 'War' }] }) });
    expect(vmWar.defense.militaryStress).toBeTruthy();
    expect(vmWar.defense.militaryStress.type).toBe('wartime');
    const vmIns = buildViewModel({ settlement: settlementWith({ stress: [{ type: 'insurgency', label: 'Uprising' }] }) });
    expect(vmIns.defense.militaryStress).toBeTruthy();
    expect(vmIns.defense.militaryStress.type).toBe('insurgency');
  });

  test('the shared constant covers EVERY registered stress type (H3 — derived from the producer)', () => {
    expect(Object.keys(DEFENSE_STRESS_STATUS).sort()).toEqual(Object.keys(STRESS_TYPE_MAP).sort());
  });
});

describe('PDF/Foundry defense fields come from real producers', () => {
  const guardAssessment = 'The watch controls the gates but cannot patrol the outer ward.';
  const wallVulnerability = 'The north wall has no surviving garrison.';
  const settlement = settlementWith({
    economicState: {
      primaryImports: [],
      primaryExports: [],
      safetyProfile: { guardEffectivenessDesc: `  ${guardAssessment}  ` },
    },
    defenseProfile: {
      scores: {},
      guardAssessment: 'POISONED nested fallback',
      vulnerabilities: ['POISONED nested fallback'],
    },
    guardAssessment: 'POISONED root fallback',
    defenseVulnerabilities: ['POISONED root fallback'],
    publicOrder: 'POISONED dead field',
    lawEnforcement: 'POISONED dead field',
    structuralViolations: [
      { reason: wallVulnerability, severity: 'critical' },
      { reason: 'The market lacks covered drainage.', severity: 'warning' },
    ],
  });
  const vm = buildViewModel({ settlement });

  test('the view model derives guard prose and normalized defense vulnerabilities', () => {
    expect(vm.defense.guardAssessment).toBe(guardAssessment);
    expect(vm.defense.vulnerabilities).toEqual([wallVulnerability]);
    expect(vm.defense).not.toHaveProperty('publicOrder');
    expect(vm.defense).not.toHaveProperty('lawEnforcement');
  });

  test('the Foundry defense journal prints the derived vulnerability reason', () => {
    const page = buildJournalPages(vm, { variant: 'canon_dossier' })
      .find((candidate) => candidate.name === 'Defense & Security');
    expect(page).toBeTruthy();
    expect(page.markdown).toContain(wallVulnerability);
    expect(page.markdown).not.toContain('POISONED');
  });
});
