/**
 * bandPolarity.test.js — the G9/G10 polarity pins (Wave R-5b batch 1, item #3;
 * atlas derived-influenceable gaps G9 + G10).
 *
 * WHAT WAS WRONG. The four-dimension layer banded every dimension through the
 * strictly higher-is-better `bandFor` ladder. Three of the four (volatility,
 * externalThreat, resourcePressure) are LOWER-is-better, so their band word and
 * colour said the opposite of the truth on every surface that reads `dim.band`:
 * a town with six factions, five conflicts and no legitimacy banded volatility
 * 95 "Stable" in green, a calm town banded volatility 17 "Critical" in oxblood,
 * and the two returned the byte-identical Library health pip. One layer down,
 * the causal substrate banded correctly but printed the raw word, so
 * criminal_opportunity at maximal crime printed "COLLAPSED" — read by a human as
 * "the crime is gone" — while `causalBandWord`, the function written to fix
 * exactly that, had no caller outside its own file.
 *
 * WHAT THESE PINS HOLD. Both directions for every band family: a lower-is-better
 * dimension must band BETTER as its number falls and WORSE as it rises, and a
 * higher-is-better dimension must do the reverse. A calm settlement and a crisis
 * settlement must be distinguishable by the health pip. The delta sentence's band
 * pair must agree with its own "pressure increased" clause. The authored-delta
 * layer that PERSISTS must band on the same orientation as the derivation. And
 * the one lower-is-better substrate variable must reach a reader as a problem
 * word, with a higher-is-better control proving the other fifteen did not move.
 *
 * Pure domain — no store, no React, no wall clock.
 */

import { describe, test, expect } from 'vitest';
import {
  bandFor,
  bandForDimension,
  dimensionPolarity,
  DIM_POLARITY,
} from '../../src/domain/state/bands.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { compareSystemState } from '../../src/domain/state/compareSystemState.js';
import { layerAuthoredDeltas } from '../../src/domain/events/eventPipeline.js';
import {
  CAUSAL_BANDS,
  deriveCausalState,
  causalBandWord,
  compareCausalState,
  variablePolarity,
} from '../../src/domain/causalState.js';
import { healthPip, needsAttention } from '../../src/components/settlements/livingWorldSignals.js';

/** Badness rank — higher is worse. Shared by the direction assertions below. */
const BAND_RANK = { Stable: 0, Strained: 1, Vulnerable: 2, Critical: 3 };

/** A settlement with nothing wrong: no factions to speak of, no conflicts, no
 *  crime, strong legitimacy, a safe region, a real road and diversified exports. */
const CALM = {
  id: 'calm',
  config: { monsterThreat: 'safe', nearbyResourcesState: {}, tradeRouteAccess: 'road' },
  economicState: {
    prosperity: { tier: 'Comfortable' },
    primaryExports: ['grain', 'wool', 'iron'],
    safetyProfile: { blackMarketCapture: 0 },
  },
  powerStructure: { factions: [{}], conflicts: [], publicLegitimacy: { score: 80 } },
  stressors: [],
};

/** The atlas's crisis fixture: six factions, five conflicts, heavy criminal
 *  capture, collapsed legitimacy, a plagued region, siege + raid + war. */
const CRISIS = {
  id: 'crisis',
  config: {
    monsterThreat: 'plagued',
    nearbyResourcesState: { iron: 'depleted', timber: 'depleted' },
    tradeRouteAccess: 'isolated',
  },
  economicState: {
    prosperity: { tier: 'Struggling' },
    primaryExports: ['grain'],
    safetyProfile: { blackMarketCapture: 60 },
  },
  powerStructure: {
    factions: [{}, {}, {}, {}, {}, {}],
    conflicts: [{}, {}, {}, {}, {}],
    publicLegitimacy: { score: 10 },
  },
  stressors: [{ type: 'siege' }, { type: 'raid' }, { type: 'war' }],
};

describe('bandForDimension — polarity, both directions, every band family', () => {
  test('the polarity table names exactly the four dimensions, one higher-is-better', () => {
    expect(Object.keys(DIM_POLARITY).sort()).toEqual(
      ['externalThreat', 'resilience', 'resourcePressure', 'volatility'],
    );
    expect(dimensionPolarity('resilience')).toBe('higher_is_better');
    expect(dimensionPolarity('volatility')).toBe('lower_is_better');
    expect(dimensionPolarity('externalThreat')).toBe('lower_is_better');
    expect(dimensionPolarity('resourcePressure')).toBe('lower_is_better');
  });

  test('an unknown dimension key falls back to higher-is-better (a fifth dim bands as before until declared)', () => {
    expect(dimensionPolarity('somethingNew')).toBe('higher_is_better');
    expect(bandForDimension('somethingNew', 90)).toBe(bandFor(90));
  });

  test('resilience walks the ladder upward — every band family, low to high', () => {
    expect(bandForDimension('resilience', 10)).toBe('Critical');
    expect(bandForDimension('resilience', 30)).toBe('Vulnerable');
    expect(bandForDimension('resilience', 60)).toBe('Strained');
    expect(bandForDimension('resilience', 90)).toBe('Stable');
  });

  test.each(['volatility', 'externalThreat', 'resourcePressure'])(
    '%s walks the ladder DOWNWARD — every band family, low to high',
    (key) => {
      expect(bandForDimension(key, 10)).toBe('Stable');
      expect(bandForDimension(key, 30)).toBe('Strained');
      expect(bandForDimension(key, 60)).toBe('Vulnerable');
      expect(bandForDimension(key, 90)).toBe('Critical');
    },
  );

  test('the exact pre-fix inversions now read the truth', () => {
    // The two figures the atlas probes produced, in both directions.
    expect(bandForDimension('volatility', 95)).toBe('Critical');   // was 'Stable'
    expect(bandForDimension('volatility', 17)).toBe('Stable');     // was 'Critical'
    expect(bandForDimension('externalThreat', 80)).toBe('Critical'); // was 'Stable'
    expect(bandForDimension('externalThreat', 25)).toBe('Stable');   // was 'Vulnerable'
    // Control: the higher-is-better dimension is byte-unchanged by the fix.
    expect(bandForDimension('resilience', 95)).toBe(bandFor(95));
    expect(bandForDimension('resilience', 17)).toBe(bandFor(17));
  });

  test('a non-finite score still lands on the neutral fallback for both polarities', () => {
    expect(bandForDimension('resilience', NaN)).toBe('Strained');
    expect(bandForDimension('volatility', NaN)).toBe('Strained');
    expect(bandForDimension('volatility', Infinity)).toBe('Strained');
  });
});

describe('deriveSystemState — a calm town and a crisis town band opposite ways', () => {
  const calm = deriveSystemState(CALM);
  const crisis = deriveSystemState(CRISIS);

  test('the calm town scores LOW on the three pressure dimensions and bands them WELL', () => {
    expect(calm.volatility.value).toBeLessThan(30);
    expect(calm.externalThreat.value).toBeLessThan(30);
    expect(calm.volatility.band).toBe('Stable');
    expect(calm.externalThreat.band).toBe('Stable');
  });

  test('the crisis town scores HIGH on the same dimensions and bands them BADLY', () => {
    expect(crisis.volatility.value).toBeGreaterThan(70);
    expect(crisis.externalThreat.value).toBeGreaterThan(70);
    expect(crisis.volatility.band).toBe('Critical');
    expect(crisis.externalThreat.band).toBe('Critical');
  });

  test.each(['volatility', 'externalThreat', 'resourcePressure'])(
    '%s: the higher raw score is never the better band (the defect, stated as a law)',
    (key) => {
      const worse = crisis[key].value >= calm[key].value ? crisis : calm;
      const better = worse === crisis ? calm : crisis;
      expect(BAND_RANK[worse[key].band]).toBeGreaterThanOrEqual(BAND_RANK[better[key].band]);
    },
  );

  test('resilience keeps its own direction — the higher score is the better band', () => {
    expect(calm.resilience.value).toBeGreaterThan(crisis.resilience.value);
    expect(BAND_RANK[calm.resilience.band]).toBeLessThanOrEqual(BAND_RANK[crisis.resilience.band]);
  });

  test('the raw 0-100 values are untouched by the fix — only the word flips', () => {
    for (const key of ['resilience', 'volatility', 'externalThreat', 'resourcePressure']) {
      expect(Number.isInteger(calm[key].value)).toBe(true);
      expect(calm[key].value).toBeGreaterThanOrEqual(0);
      expect(calm[key].value).toBeLessThanOrEqual(100);
      expect(calm[key].band).toBe(bandForDimension(key, calm[key].value));
    }
  });
});

describe('healthPip / needsAttention — the Library sort has ordering information again', () => {
  test('a calm town and a crisis town no longer return the identical pip', () => {
    const calmPip = healthPip(CALM);
    const crisisPip = healthPip(CRISIS);
    expect(calmPip).not.toBeNull();
    expect(crisisPip).not.toBeNull();
    expect(crisisPip.severity).toBeGreaterThan(calmPip.severity);
    expect(calmPip).not.toEqual(crisisPip);
  });

  test('a settlement with nothing wrong does NOT need attention', () => {
    expect(needsAttention(CALM)).toBe(false);
  });

  test('a settlement in crisis DOES need attention', () => {
    expect(needsAttention(CRISIS)).toBe(true);
  });
});

describe('compareSystemState — the band pair agrees with its own pressure clause', () => {
  const snap = (over) => ({
    resilience: { value: 50, drivers: [], risks: [] },
    volatility: { value: 40, drivers: [], risks: [] },
    externalThreat: { value: 30, drivers: [], risks: [] },
    resourcePressure: { value: 30, drivers: [], risks: [] },
    ...over,
  });

  test('a volatility RISE crosses to a worse band and says pressure increased', () => {
    const [delta] = compareSystemState(
      snap({ volatility: { value: 70 } }),
      snap({ volatility: { value: 80 } }),
    );
    expect(delta.explanation).toContain('pressure increased');
    expect(delta.explanation).toContain('Vulnerable → Critical');
    // The pre-fix string was "(Strained → Stable) — pressure increased".
    expect(delta.explanation).not.toContain('→ Stable');
  });

  test('a volatility FALL crosses to a better band and does NOT say pressure increased', () => {
    const [delta] = compareSystemState(
      snap({ volatility: { value: 80 } }),
      snap({ volatility: { value: 70 } }),
    );
    expect(delta.explanation).not.toContain('pressure increased');
    expect(delta.explanation).toContain('Critical → Vulnerable');
  });

  test('resilience keeps the opposite reading — a fall is the bad direction (control)', () => {
    const [delta] = compareSystemState(
      snap({ resilience: { value: 80 } }),
      snap({ resilience: { value: 60 } }),
    );
    expect(delta.explanation).toContain('pressure increased');
    expect(delta.explanation).toContain('Stable → Strained');
  });

  test.each([
    ['volatility', 30, 90],
    ['externalThreat', 30, 90],
    ['resourcePressure', 30, 90],
  ])('%s: the band never improves while the sentence says pressure increased', (key, lo, hi) => {
    const [delta] = compareSystemState(snap({ [key]: { value: lo } }), snap({ [key]: { value: hi } }));
    expect(delta.explanation).toContain('pressure increased');
    expect(BAND_RANK[bandForDimension(key, hi)]).toBeGreaterThan(BAND_RANK[bandForDimension(key, lo)]);
  });
});

describe('layerAuthoredDeltas — the layer that PERSISTS bands on the same orientation', () => {
  test('a resource-pressure rise from an authored delta bands worse, not better', () => {
    const before = deriveSystemState(CALM);
    const after = layerAuthoredDeltas(before, { type: 'DEPLETE_RESOURCE', targetId: 'iron' }, CALM);
    expect(after.resourcePressure.value).toBeGreaterThan(before.resourcePressure.value);
    expect(BAND_RANK[after.resourcePressure.band])
      .toBeGreaterThanOrEqual(BAND_RANK[before.resourcePressure.band]);
    expect(after.resourcePressure.band)
      .toBe(bandForDimension('resourcePressure', after.resourcePressure.value));
  });

  test('the same authored event drops resilience and bands IT worse too (opposite direction, same law)', () => {
    const before = deriveSystemState(CALM);
    const after = layerAuthoredDeltas(before, { type: 'DEPLETE_RESOURCE', targetId: 'iron' }, CALM);
    expect(after.resilience.value).toBeLessThan(before.resilience.value);
    expect(after.resilience.band).toBe(bandForDimension('resilience', after.resilience.value));
  });
});

describe('G10 — the substrate band WORD reaches the reader polarity-correct', () => {
  const CRIMINAL = {
    id: 'crime',
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    economicState: { prosperity: { tier: 'Moderate' }, safetyProfile: { blackMarketCapture: 95 } },
    powerStructure: {
      factions: [{ name: 'Syndicate', power: 90, type: 'criminal' }],
      conflicts: [],
      publicLegitimacy: { score: 10 },
    },
  };

  test('criminal_opportunity is the lone lower-is-better variable', () => {
    expect(variablePolarity('criminal_opportunity')).toBe('lower_is_better');
    expect(variablePolarity('food_security')).toBe('higher_is_better');
  });

  test('maximal crime carries the inverted MODEL band and the problem WORD', () => {
    const state = deriveCausalState(CRIMINAL);
    expect(state.variables.criminal_opportunity.score).toBeGreaterThanOrEqual(90);
    expect(state.bands.criminal_opportunity).toBe('collapsed');
    expect(causalBandWord('criminal_opportunity', 'collapsed')).toBe('Rampant');
    expect(causalBandWord('criminal_opportunity', 'critical')).toBe('Acute');
    expect(causalBandWord('criminal_opportunity', 'strained')).toBe('Elevated');
  });

  test('the other fifteen variables read their raw band unchanged (control, both benign and bad)', () => {
    for (const band of ['surplus', 'adequate', 'strained', 'critical', 'collapsed']) {
      expect(causalBandWord('food_security', band)).toBe(band);
      expect(causalBandWord('social_trust', band)).toBe(band);
    }
  });

  test('the BENIGN end of the same ladder is worded too (the ADEQUATE defect)', () => {
    // These two used to fall through to the raw band, so a settlement with almost
    // no crime printed "Criminal opportunity · ADEQUATE" — read by a human as the
    // crime being adequate, the same lie as COLLAPSED at the other end.
    expect(causalBandWord('criminal_opportunity', 'adequate')).toBe('Contained');
    expect(causalBandWord('criminal_opportunity', 'surplus')).toBe('Negligible');
  });

  test('the ladder is TOTAL — no band on the lower-is-better variable prints its raw word', () => {
    for (const band of CAUSAL_BANDS) {
      const word = causalBandWord('criminal_opportunity', band);
      expect(word, `band '${band}' fell through to the raw word`).not.toBe(band);
      expect(word.length).toBeGreaterThan(0);
    }
    // The five words are distinct, so two bands can never read the same.
    const words = CAUSAL_BANDS.map(b => causalBandWord('criminal_opportunity', b));
    expect(new Set(words).size).toBe(CAUSAL_BANDS.length);
  });

  test('an unknown band still falls through rather than throwing (tolerance control)', () => {
    expect(causalBandWord('criminal_opportunity', 'unheard_of')).toBe('unheard_of');
  });

  test('the delta sentence names the problem, not its opposite', () => {
    const clean = deriveCausalState(CALM);
    const dirty = deriveCausalState(CRIMINAL);
    const [delta] = compareCausalState(clean, dirty).filter(d => d.variable === 'criminal_opportunity');
    expect(delta).toBeTruthy();
    expect(delta.change).toBeGreaterThan(0);
    expect(delta.explanation).toContain('rampant');
    expect(delta.explanation).not.toContain('collapsed');
    expect(delta.explanation).toContain('Pressure increased');
  });

  test('a higher-is-better delta sentence is byte-unchanged (control)', () => {
    const before = { scores: { social_trust: 62 }, bands: {} };
    const after = { scores: { social_trust: 20 }, bands: {} };
    const [delta] = compareCausalState(before, after);
    expect(delta.explanation).toContain('adequate → critical');
  });

  test('a snapshot missing its bands map falls back on the ORIENTED score, not the raw one', () => {
    // deriveCausalState always fills `bands`; this is the defensive path. Banding
    // raw here would have produced the inverse of the band the model carries.
    const [delta] = compareCausalState(
      { scores: { criminal_opportunity: 10 }, bands: {} },
      { scores: { criminal_opportunity: 95 }, bands: {} },
    );
    expect(delta.bandBefore).toBe('surplus');   // low crime = healthy
    expect(delta.bandAfter).toBe('collapsed');  // high crime = the problem band
  });
});
