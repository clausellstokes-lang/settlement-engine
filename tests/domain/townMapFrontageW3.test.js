import { describe, expect, it } from 'vitest';

import { subdivideFrontageBlock } from '../../src/domain/townMap/fabric/index.js';
import {
  MULTI_PLOT_AXES,
  makeFirstSliceFoundation,
} from '../fixtures/townMapFirstSliceFixtures.js';

const compile = (axes) => subdivideFrontageBlock(
  makeFirstSliceFoundation(),
  'block:market:001',
  axes,
);

describe('MF-VS1 frontage-first W3 routine', () => {
  it('emits frontage → plot → fitted rectilinear footprint lineage', () => {
    const result = compile(MULTI_PLOT_AXES);
    expect(result.frontages).toHaveLength(result.plots.length);
    expect(result.backlandCore).not.toBeNull();
    for (const plot of result.plots) {
      const frontage = result.frontages.find((row) => row.frontageId === plot.frontageId);
      expect(frontage?.plotId).toBe(plot.plotId);
      const xs = new Set(plot.fittedFootprint.map((point) => point[0]));
      const zs = new Set(plot.fittedFootprint.map((point) => point[1]));
      expect(xs.size).toBe(2);
      expect(zs.size).toBe(2);
    }
  });

  it('gives each of the four explicit axes a non-vacuous named metric', () => {
    const base = compile(MULTI_PLOT_AXES);
    const size = compile({ ...MULTI_PLOT_AXES, sizeFloorQ: 140 });
    const chaos = compile({ ...MULTI_PLOT_AXES, gridChaosQ: 0 });
    const variation = compile({ ...MULTI_PLOT_AXES, sizeVariationQ: 0 });
    const emptiness = compile({ ...MULTI_PLOT_AXES, emptinessQ: 0 });
    expect(size.metrics.stopThresholdQ).not.toBe(base.metrics.stopThresholdQ);
    expect(chaos.metrics.splitStaggerQ).not.toBe(base.metrics.splitStaggerQ);
    expect(variation.metrics.frontageWidthSpreadQ).not.toBe(base.metrics.frontageWidthSpreadQ);
    expect(emptiness.metrics.backlandAreaQ).not.toBe(base.metrics.backlandAreaQ);
  });

  it('accepts exactly the four axes and no tier/culture/wealth dial', () => {
    expect(() => compile({ ...MULTI_PLOT_AXES, tier: 'city' })).toThrow(/must be exactly/);
    expect(() => compile({ ...MULTI_PLOT_AXES, culture: 'anything' })).toThrow(/must be exactly/);
    expect(() => compile({ ...MULTI_PLOT_AXES, wealth: 900 })).toThrow(/must be exactly/);
  });
});
