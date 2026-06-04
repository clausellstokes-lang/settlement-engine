/**
 * wizardCloseout.test.js - P145 / W-2 contract over the pure summary
 * builder. WizardCloseout renders a config recap; buildCloseoutSummary()
 * derives that recap from the live config + toggle maps. Tested here in
 * isolation (no DOM).
 */

import { describe, it, expect } from 'vitest';
import { buildCloseoutSummary } from '../../src/components/generate/WizardCloseout.jsx';

const factValue = (summary, label) =>
  summary.facts.find(f => f.label === label)?.value;

describe('buildCloseoutSummary', () => {
  it('humanizes config facts; collapses any random* value to "Random"', () => {
    const s = buildCloseoutSummary({
      settType: 'village',
      culture: 'germanic',
      tradeRouteAccess: 'random_trade',
      monsterThreat: 'random_threat',
      magicExists: true,
    }, {});
    expect(factValue(s, 'Tier')).toBe('Village');
    expect(factValue(s, 'Culture')).toBe('Germanic');
    expect(factValue(s, 'Trade route')).toBe('Random');
    expect(factValue(s, 'Threat')).toBe('Random');
    expect(factValue(s, 'Magic')).toBe('On');
  });

  it('title-cases multi-word underscore values', () => {
    const s = buildCloseoutSummary({ tradeRouteAccess: 'major_road' }, {});
    expect(factValue(s, 'Trade route')).toBe('Major Road');
  });

  it('reports Magic Off only when magicExists is explicitly false', () => {
    expect(factValue(buildCloseoutSummary({ magicExists: false }, {}), 'Magic')).toBe('Off');
    expect(factValue(buildCloseoutSummary({}, {}), 'Magic')).toBe('On'); // default
  });

  it('emphasis lists sliders >= 65, sorted high-to-low; else null', () => {
    const s = buildCloseoutSummary({
      priorityEconomy: 80, priorityMagic: 70, priorityMilitary: 50, priorityCriminal: 64,
    }, {});
    expect(s.emphasis).toEqual(['Economy', 'Magic']); // 64 is below threshold
    // All baseline → no emphasis.
    expect(buildCloseoutSummary({}, {}).emphasis).toBeNull();
  });

  it('counts forced/excluded across institutions, services, and goods', () => {
    const s = buildCloseoutSummary({}, {
      institutionToggles: {
        'town::market::Bank':  { allow: true, require: true, forceExclude: false },  // forced
        'town::faith::Temple': { allow: false, require: false, forceExclude: true }, // excluded
        'town::misc::Inn':     { allow: true, require: false, forceExclude: false }, // neither
      },
      servicesToggles: {
        'banking': { allow: true, force: true, forceExclude: false },               // forced
      },
      goodsToggles: {
        'town_good_salt': { allow: false, force: false, forceExclude: true },        // excluded
        'town_good_iron': { allow: true, force: true, forceExclude: false },         // forced
      },
    });
    expect(s.forced).toBe(3);   // Bank + banking + iron
    expect(s.excluded).toBe(2); // Temple + salt
  });

  it('defends against missing config / toggles', () => {
    const s = buildCloseoutSummary();
    expect(s.forced).toBe(0);
    expect(s.excluded).toBe(0);
    expect(s.facts).toHaveLength(5);
    expect(s.emphasis).toBeNull();
  });
});
