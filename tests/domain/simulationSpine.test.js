/**
 * tests/domain/simulationSpine.test.js - Spine derivation contract.
 *
 * The spine is exposed in the dossier rail, the AI grounding prompt,
 * and (eventually) the PDF chapter-1 callout. It needs to be reliable
 * over both rich settlements and bare ones - and tolerant of legacy
 * field-name aliases.
 */

import { describe, it, expect } from 'vitest';
import { deriveSimulationSpine, simulationSpineRows } from '../../src/domain/simulationSpine.js';

const richSettlement = () => ({
  name: 'Greycairn',
  tier: 'town',
  settlementReason: 'Founded at the river crossing where the salt road meets the road north.',
  history: { historicalCharacter: 'a quiet trade town, suspicious of strangers' },
  economicState: {
    topExport: 'Smoked river fish',
    prosperityBand: 'comfortable',
  },
  powerStructure: {
    governanceType: 'A merchant council',
    governingName: 'The Salt-Tongue Guild',
    publicLegitimacy: { label: 'Tolerated' },
    stability: 'unstable',
    factions: [
      { name: 'The Salt-Tongue Guild', power: 60 },
      { name: 'The Riverwarden Temple', power: 78 },
    ],
    recentConflict: 'a bread riot last winter',
  },
  stressors: [{ label: 'plague rumors' }, { label: 'cut trade route' }],
  defenseProfile: { threats: [{ label: 'bandits on the south road' }] },
  history2: { currentTensions: [] },
});

describe('deriveSimulationSpine()', () => {
  it('produces all seven lines on a rich settlement', () => {
    const s = deriveSimulationSpine(richSettlement());
    expect(s.existsBecause).toContain('river crossing');
    expect(s.survivesBy).toContain('smoked river fish');
    expect(s.ruledBy).toContain('merchant council');
    // Real power differs from formal authority - Temple has 78 vs guild's 60.
    expect(s.realPower).toContain('Riverwarden Temple');
    expect(s.strainedBy).toContain('plague rumors');
    expect(s.peopleFear).toContain('bandits');
    // history2 is the wrong key; tensions absent → falls back to stability.
    expect(s.likelyFuture).toContain('test whoever holds');
  });

  it('omits realPower when authority and top faction are aligned', () => {
    const s = deriveSimulationSpine({
      ...richSettlement(),
      powerStructure: {
        governanceType: 'A merchant council',
        governingName:  'The Salt-Tongue Guild',
        publicLegitimacy: { label: 'Endorsed' },
        factions: [{ name: 'The Salt-Tongue Guild', power: 90 }],
      },
    });
    expect(s.realPower).toContain('aligned');
  });

  it('flags low legitimacy in realPower even when authority is dominant', () => {
    const s = deriveSimulationSpine({
      ...richSettlement(),
      powerStructure: {
        governanceType: 'A merchant council',
        governingName:  'The Salt-Tongue Guild',
        publicLegitimacy: { label: 'Contested' },
        factions: [{ name: 'The Salt-Tongue Guild', power: 90 }],
      },
    });
    expect(s.realPower).toContain('legitimacy is contested');
  });

  it('respects legacy stress field (string form)', () => {
    const s = deriveSimulationSpine({ ...richSettlement(), stressors: undefined, stress: 'flood season' });
    expect(s.strainedBy).toContain('flood season');
  });

  it('falls back to a tier/route phrase when settlementReason is missing', () => {
    const s = deriveSimulationSpine({
      tier: 'town',
      config: { tradeRouteAccess: 'minor_road' },
    });
    expect(s.existsBecause).toContain('minor road');
  });

  it('handles a bare settlement without crashing', () => {
    const s = deriveSimulationSpine({});
    expect(s.existsBecause).toBeTruthy();
    expect(s.survivesBy).toBeTruthy();
    expect(s.ruledBy).toBeTruthy();
    expect(s.strainedBy).toBeTruthy();
    expect(s.peopleFear).toBeTruthy();
    expect(s.likelyFuture).toBeTruthy();
  });

  it('returns a placeholder spine for nullish input', () => {
    const s = deriveSimulationSpine(null);
    expect(s.existsBecause).toBe('Origin unknown.');
  });

  it('detects critical stability and forecasts crisis', () => {
    const s = deriveSimulationSpine({
      powerStructure: { stability: 'Critical', factions: [] },
    });
    expect(s.likelyFuture).toContain('crisis');
  });

  it('detects stable stability and forecasts continuity', () => {
    const s = deriveSimulationSpine({
      powerStructure: { stability: 'Stable', factions: [] },
    });
    expect(s.likelyFuture).toContain('Continuity');
  });
});

describe('simulationSpineRows()', () => {
  it('returns label/body pairs in canonical order', () => {
    const rows = simulationSpineRows(richSettlement());
    expect(rows[0][0]).toBe('This settlement exists because');
    expect(rows[1][0]).toBe('It survives by');
    expect(rows[2][0]).toBe('It is ruled by');
  });

  it('drops null body rows (realPower when aligned + legitimate)', () => {
    const rows = simulationSpineRows({
      powerStructure: {
        governanceType: 'A merchant council',
        governingName:  'The Salt-Tongue Guild',
        publicLegitimacy: { label: 'Endorsed' },
        factions: [{ name: 'The Salt-Tongue Guild', power: 90 }],
      },
    });
    const labels = rows.map(r => r[0]);
    expect(labels).toContain('Its real power lies with');
  });
});
