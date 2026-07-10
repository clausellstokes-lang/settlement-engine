/**
 * tests/domain/aiGroundingLensSource.test.js — single-source-of-truth guard
 * for the AI payload's capacity lens set.
 *
 * aiGrounding's canonical capacity lenses used to be a private duplicate of
 * capacityModel's VISIBLE_CAPACITY_LENSES. This pins them to the SHARED
 * constant so the two cannot silently drift if a lens is added or removed.
 */

import { describe, it, expect } from 'vitest';
import { buildAiGroundingPayload } from '../../src/domain/aiGrounding.js';
import { deriveAllCapacities, VISIBLE_CAPACITY_LENSES } from '../../src/domain/capacityModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('aiGrounding capacity lens set is the shared VISIBLE_CAPACITY_LENSES', () => {
  it('exposes exactly the shared visible lenses, in the shared order', () => {
    const settlement = generateSettlementPipeline({ seed: 'lens-source-of-truth' });
    const payload = buildAiGroundingPayload(settlement);
    const keys = Object.keys(payload.bands.capacities);

    // The expected set is every shared visible lens the settlement genuinely
    // produces a band for, derived independently of `keys` (from the source
    // capacities, not filtered by keys.includes). So a visible lens dropped
    // OUT of the payload now fails, just as an internal lens leaked IN does.
    const sourceBands = deriveAllCapacities(settlement).bands;
    const expected = [...VISIBLE_CAPACITY_LENSES].filter(
      n => sourceBands?.[n] !== undefined,
    );
    // Order included, so the payload deep-equals the source set.
    expect(keys).toEqual(expected);
    for (const name of keys) {
      expect(VISIBLE_CAPACITY_LENSES).toContain(name);
    }
    // Internal-only lenses must never leak into the AI payload.
    for (const internal of ['labor', 'craft', 'transport', 'religious_welfare']) {
      expect(keys).not.toContain(internal);
    }
  });
});
