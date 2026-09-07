import { describe, expect, it } from 'vitest';
import { activeSpatialDigest } from '../../src/domain/spatial/distanceRead.js';
import { beliefsActive } from '../../src/domain/worldPulse/beliefMap.js';
import {
  buildWholeWorldSoakSpatialCanon,
  WHOLE_WORLD_SOAK_SPATIAL_FIXTURE_PATH,
} from '../../scripts/audit/whole-world-soak-spatial-fixture.mjs';

const saves = ['soak-a', 'soak-b', 'soak-c', 'soak-d'].map((id) => ({
  id,
  settlement: { institutions: [] },
}));

describe('whole-world soak spatial fixture', () => {
  it('authors a valid active canon through the production digest seam', () => {
    const worldState = buildWholeWorldSoakSpatialCanon(saves);
    const digest = activeSpatialDigest(worldState);

    expect(WHOLE_WORLD_SOAK_SPATIAL_FIXTURE_PATH)
      .toBe('tests/fixtures/spatialPackFixtures.js');
    expect(digest).not.toBeNull();
    expect(Object.isFrozen(digest)).toBe(true);
    expect(digest?.settlementIds).toEqual(saves.map(({ id }) => id));
    expect(Object.keys(digest?.distanceMatrix || {})).toHaveLength(saves.length);
    expect(beliefsActive({
      ...worldState,
      simulationRules: { infoMode: 'full' },
    })).toBe(true);
  });

  it('strips both spatial-authority fields from the explicit dark control', () => {
    const worldState = buildWholeWorldSoakSpatialCanon(saves, { enabled: false });

    expect(worldState).toEqual({});
    expect(worldState).not.toHaveProperty('spatialCanonVersion');
    expect(worldState).not.toHaveProperty('spatialDigest');
    expect(activeSpatialDigest(worldState)).toBeNull();
    expect(beliefsActive({
      ...worldState,
      simulationRules: { infoMode: 'full' },
    })).toBe(false);
  });
});
