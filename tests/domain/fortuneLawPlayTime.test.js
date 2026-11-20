/**
 * fortuneLawPlayTime.test.js — THE PLAY-TIME GUARD of the fortune law (FORTUNE-1, unit U3).
 *
 * ⭐ WHAT THIS FILE PROVES. The fortune law (FS2) moves how standing is BORN, never the cuts it is
 * banded by (75, 60, 45, 30: the chair's rulings of 2026-11-20 10:33 UTC). At play time
 * `src/domain/timeProgression.js` re-bands a moved score with its own private `reBand`, which
 * spells the cuts again rather than reading `LEGITIMACY_CUTS`; with the cuts unchanged it bands
 * both laws alike and needs NO edit (proposal section 3, "THE PLAY-TIME READER"). This file is the
 * guard that keeps that true:
 *   (i)  the play-time banding agrees with `LEGITIMACY_CUTS` at every cut and either side of it,
 *        driven through the module's exported advance path by a governing legitimacy delta
 *        (`reBand` is read only through behaviour). A future cut move that is not made law-aware
 *        reds HERE.
 *  (ii)  a town born under law 2 (the fixture arm) advanced one tick with no legitimacy delta keeps
 *        its born score and label (and so does one born under law 1).
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { advanceTime } from '../../src/domain/timeProgression.js';
import { LEGITIMACY_CUTS, legitimacyBandOf } from '../../src/data/bandLadders.js';
import { legitimacyBandFor } from '../../src/generators/factionDynamics.js';
import {
  DEFAULT_FORTUNE_LAW_VERSION,
  FORTUNE_LAW_CONFIG_KEY,
  SIZE_RELATIVE_FORTUNE_LAW_VERSION,
} from '../../src/domain/fortune/fortuneLaw.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const GOVERNING = 'Town Council';
/** A condition whose impact reaches the governing power's legitimacy. */
const CONDITION = 'plague';

/** A one-power town whose governing power carries the given legitimacy score. @param {number} score */
function townAt(score) {
  return {
    name: 'Greycairn',
    activeConditions: [],
    powerStructure: {
      governingName: GOVERNING,
      publicLegitimacy: { score, ...legitimacyBandFor(score) },
      factions: [{ faction: GOVERNING, power: 40, isGoverning: true, desc: '' }],
    },
  };
}

/** The governing legitimacy delta one month of the condition applies, read off the tick's own
 *  report (never quoted). @param {number} score */
function governingDeltaFrom(score) {
  const { tick } = advanceTime(townAt(score), { activeConditions: [CONDITION], interval: 'one_month' });
  return tick.factionDeltas
    .filter((d) => d.field === 'legitimacy' && d.factionName === GOVERNING)
    .reduce((sum, d) => sum + d.delta, 0);
}

describe('(i) the play-time banding agrees with LEGITIMACY_CUTS at every cut and either side of it', () => {
  const delta = governingDeltaFrom(50);

  it('the driving condition moves the governing legitimacy (non-vacuous)', () => {
    expect(delta).not.toBe(0);
  });

  for (const [cutName, cut] of Object.entries(LEGITIMACY_CUTS)) {
    for (const target of [cut - 1, cut, cut + 1]) {
      it(`a score moved to ${target} (the ${cutName} cut ${target < cut ? 'less one' : target > cut ? 'plus one' : 'itself'}) bands as the ladder does`, () => {
        const start = target - delta;
        expect(start).toBeGreaterThanOrEqual(0);
        expect(start).toBeLessThanOrEqual(100);
        const { newSettlement } = advanceTime(townAt(start), { activeConditions: [CONDITION], interval: 'one_month' });
        const moved = newSettlement.powerStructure.publicLegitimacy;
        expect(moved.score).toBe(target);
        const rung = legitimacyBandOf(target);
        expect(moved.label).toBe(rung.label);
        expect(moved.color).toBe(rung.color);
        expect(moved.govMultiplier).toBe(rung.govMultiplier);
        expect(moved.crimMultiplier).toBe(rung.crimMultiplier);
        const flags = legitimacyBandFor(target);
        for (const key of /** @type {const} */ (['isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis', 'governanceFractured'])) {
          expect(moved[key], `${target}: ${key}`).toBe(flags[key]);
        }
      });
    }
  }
});

describe('(ii) a town born under the fortune law keeps its born standing through a tick with no legitimacy delta', () => {
  /** @type {Record<number, any>} */
  const born = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const law of [SIZE_RELATIVE_FORTUNE_LAW_VERSION, DEFAULT_FORTUNE_LAW_VERSION]) {
      born[law] = generateSettlementPipeline(
        { ...birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), [FORTUNE_LAW_CONFIG_KEY]: law },
        null,
        { seed: 'fs2-playtime-city-0', customContent: {} },
      );
    }
  }, 120_000);

  for (const law of [SIZE_RELATIVE_FORTUNE_LAW_VERSION, DEFAULT_FORTUNE_LAW_VERSION]) {
    it(`born under law ${law}: one tick with no condition keeps the score and the label`, () => {
      const town = born[law];
      const before = town.powerStructure.publicLegitimacy;
      const { newSettlement, tick } = advanceTime(town, { activeConditions: [], interval: 'one_month' });
      expect(tick.factionDeltas.filter((d) => d.field === 'legitimacy')).toEqual([]);
      const after = newSettlement.powerStructure.publicLegitimacy;
      expect(after.score).toBe(before.score);
      expect(after.label).toBe(before.label);
      expect(after.label).toBe(legitimacyBandOf(before.score).label);
    });
  }
});
