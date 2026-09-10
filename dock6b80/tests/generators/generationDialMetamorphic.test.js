/**
 * Metamorphic realization contract for the five major generation dials.
 *
 * A priority slider is a causal input, not descriptive metadata. For the same
 * seeds and all other inputs held constant, moving one dial from 0 to 100 must
 * materially increase that domain's institutional and political presence over
 * a cohort. We intentionally assert an aggregate direction instead of exact
 * per-seed rosters: a single settlement may express a priority through a
 * faction rather than a building, while the cohort must still move strongly.
 *
 * This complements the golden master. Goldens prove reviewed byte stability;
 * this test proves that the controls continue to do the job users selected.
 */

import { describe, expect, it } from 'vitest';
import {
  generateSettlementPipeline,
} from '../../src/generators/generateSettlementPipeline.js';

const COHORT_SIZE = 18;

const BASE_CONFIG = Object.freeze({
  settType: 'city',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
  contentProfile: 'grim',
  magicExists: true,
  priorityEconomy: 50,
  priorityMilitary: 50,
  priorityReligion: 50,
  priorityMagic: 50,
  priorityCriminal: 50,
});

const DIALS = Object.freeze([
  Object.freeze({
    id: 'economy',
    configKey: 'priorityEconomy',
    vocabulary: /\beconom|craft|market|trade|guild|agric/i,
  }),
  Object.freeze({
    id: 'military',
    configKey: 'priorityMilitary',
    vocabulary: /\bmilitar|defen|guard|watch|garrison|wall/i,
  }),
  Object.freeze({
    id: 'religion',
    configKey: 'priorityReligion',
    vocabulary: /\brelig|church|temple|shrine|monast|cathedral/i,
  }),
  Object.freeze({
    id: 'magic',
    configKey: 'priorityMagic',
    vocabulary: /\bmagic|arcane|wizard|mage|alchem|enchant/i,
  }),
  Object.freeze({
    id: 'criminal',
    configKey: 'priorityCriminal',
    vocabulary: /\bcriminal|thiev|smuggl|black market|slave/i,
  }),
]);

function generate(config, seed) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
  });
}

function realization(settlement, vocabulary) {
  const institutions = (settlement.institutions || [])
    .filter(institution => vocabulary.test(
      `${institution.category || ''} ${institution.name || ''}`,
    ))
    .length;
  const factionPower = (settlement.powerStructure?.factions || [])
    .filter(faction => vocabulary.test(
      `${faction.category || ''} ${faction.faction || ''}`,
    ))
    .reduce((sum, faction) => sum + (Number(faction.power) || 0), 0);

  return {
    institutions,
    factionPower,
  };
}

function cohortSignal(dial, priority) {
  const signal = {
    institutions: 0,
    factionPower: 0,
  };
  for (let index = 0; index < COHORT_SIZE; index += 1) {
    const settlement = generate(
      {
        ...BASE_CONFIG,
        [dial.configKey]: priority,
      },
      `generation-dial-${dial.id}-${index}`,
    );
    const result = realization(settlement, dial.vocabulary);
    signal.institutions += result.institutions;
    signal.factionPower += result.factionPower;
  }
  return signal;
}

describe('major generation dials are mechanically causal', () => {
  it.each(DIALS)(
    '$id priority moves both the institution roster and faction power',
    dial => {
      const low = cohortSignal(dial, 0);
      const high = cohortSignal(dial, 100);

      expect(
        high.institutions,
        `${dial.id} priority did not increase matching institutions`,
      ).toBeGreaterThan(low.institutions);
      expect(
        high.factionPower,
        `${dial.id} priority did not increase matching faction power`,
      ).toBeGreaterThan(low.factionPower);
    },
    30_000,
  );
});
