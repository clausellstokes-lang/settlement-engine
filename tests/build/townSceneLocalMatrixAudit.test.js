/**
 * Local TownScene matrix evidence is intentionally below the promotion line.
 *
 * The heavier default command writes representative CPU PNG/GLB artifacts.
 * This suite keeps CI compact by auditing the exact DM/Player privacy pair in
 * memory while separately pinning the complete pairwise matrix.
 */

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  buildTownSceneAuditMatrix,
  runTownSceneLocalMatrixAudit,
  townSceneMatrixMissingPairs,
} from '../../scripts/audit/town-scene-local-matrix.mjs';

const PRIVATE_SENTINEL = 'TS3D_PRIVATE_MATRIX_SENTINEL_8efbb410';

describe('TownScene deterministic local matrix audit', () => {
  it('covers every pair across tier, biome, enclosure, water, season, condition, and audience', () => {
    const first = buildTownSceneAuditMatrix();
    const second = buildTownSceneAuditMatrix();

    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(20);
    expect(first.length).toBeLessThan(80);
    expect(first.filter((entry) => entry.representative)).toHaveLength(7);
    expect(townSceneMatrixMissingPairs([...first])).toEqual([]);
  });

  it('proves the player wall against a live DM negative control without claiming promotion evidence', () => {
    const privacyPair = buildTownSceneAuditMatrix().filter((entry) => (
      entry.tier === 'thorp'
      && entry.biome === 'plains'
      && entry.walls === false
      && entry.water === false
      && entry.season === 'spring'
      && entry.condition === 'none'
    ));
    expect(privacyPair.map((entry) => entry.audience).sort()).toEqual([
      'dm',
      'player',
    ]);

    const report = runTownSceneLocalMatrixAudit({
      matrix: privacyPair,
      writeArtifacts: false,
      requirePairwiseCoverage: false,
    });
    const byAudience = new Map(
      report.cases.map((entry) => [entry.axes.audience, entry]),
    );

    expect(report.status).toBe('passed');
    expect(report.evidenceClass)
      .toBe('automated_local_deterministic_non_promotion');
    expect(report.promotionEligible).toBe(false);
    expect(report.artifacts).toEqual([]);
    expect(byAudience.get('dm').metrics.privacyProbe).toMatchObject({
      sentinelExpected: true,
      manifestContainsSentinel: true,
      glbContainsSentinel: true,
    });
    expect(byAudience.get('player').metrics.privacyProbe).toEqual({
      sentinelExpected: false,
      manifestContainsSentinel: false,
      glbContainsSentinel: false,
      pngContainsSentinel: false,
    });
    expect(JSON.stringify(report)).not.toContain(PRIVATE_SENTINEL);
  }, 15_000);
});
