/**
 * noRingNoteUnderStreetFighting.test.js — W2-C-LEAVES-SIDE (2026-11-13; the round-three increment, ROUND-3-CUT-INCREMENT
 * rww-town-slave_revolt-1): "Crime here answers to one ring. It keeps the streets quiet because trouble brings the law …"
 * printed under a slave revolt beside the tab's own "Rebels and guards are fighting in the contested districts". The
 * chair's ruling: the organised-ring notes do not print under a crisis in force whose own lines on the same tab say the
 * streets are fought over or the law has collapsed. `defenseDisplay.js :: deriveCriminalStructure` leaves the note out
 * there (key and label stand). The increment's other ring line (rww-city-recently_betrayed-1, "One criminal ring …" beside
 * the roster's "Multiple criminal factions", shown as "Rival gangs") reads semi-organized at this tip (82e8fab6e): pinned.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';

/** The increment's own shape (CENSUS-2 seedcfg.mjs, rww-): @param {string} seed */
const birthRww = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};

const ring = { faction: "Thieves' Guild", category: 'criminal' };
/** @param {string} safetyLabel the tab's safety label (a crisis in force prints its condition after a dash) @param {string} safetyDesc @param {Array<{type:string,desc:string}>} [crimeTypes] */
const town = (safetyLabel, safetyDesc, crimeTypes = []) => ({
  _seed: 'unit-1', powerStructure: { factions: [ring] }, institutions: [],
  economicState: { safetyProfile: { safetyLabel, safetyDesc, crimeTypes, criminalInstitutions: [] } },
});

describe('no one-ring note where the tab says the streets are fought over', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a revolt\'s fighting line, an insurgency\'s street confrontations, a lawless line under a crisis: no note; key and label stand', () => {
    for (const s of [
      town('Critical — Slave Revolt', 'Rebels and guards are fighting in the contested districts. People keep off certain streets, and the regular patrols have stopped.'),
      town('Dangerous — Insurgency', 'Calm.', [{ type: 'Political violence', desc: 'Street-level confrontations between insurgent supporters and the watch.' }]),
      town('Unsafe — Famine Conditions', 'Hungry.', [{ type: 'Lawlessness', desc: 'There is no meaningful law enforcement. Disputes are settled by whoever is stronger.' }]),
    ]) {
      const st = deriveCriminalStructure(s);
      expect(st?.key).toBe('organized');
      expect(st?.label).toBe('Organized Syndicate');
      expect(st?.note).toBe('');
    }
  });

  test('the guard: a crisis whose lines say nothing of fighting, and fighting words with no crisis in force, keep the note', () => {
    expect(deriveCriminalStructure(town('Unsafe — Famine Conditions', 'People are hungry and stealing to eat.'))?.note).toMatch(/\bring\b/i);
    expect(deriveCriminalStructure(town('Dangerous', 'Rebels and guards are fighting in the contested districts.'))?.note).toMatch(/\bring\b/i);
  });

  test('the reader\'s towns: the slave revolt prints no ring note; the betrayed city\'s rival gangs read semi-organized', () => {
    const revolt = birthRww('rww-town-slave_revolt-1');
    expect(revolt.economicState.safetyProfile.safetyDesc, 'anchored: the tab\'s fighting line').toMatch(/fighting in the contested districts/);
    const st = deriveCriminalStructure(revolt);
    expect(st?.key).toBe('organized');
    expect(st?.note).toBe('');
    const betrayed = birthRww('rww-city-recently_betrayed-1');
    expect(betrayed.economicState.safetyProfile.criminalInstitutions, 'anchored: the roster\'s rival gangs').toContain('Rival Gangs');
    expect(deriveCriminalStructure(betrayed)?.key).toBe('semi-organized');
  }, 60000);
});
