/**
 * mapLayerAnalytics.test.js — SM-5 (7) the map-layer capture helper.
 *
 * Pins the ONE feature-discriminated event (town_map_layer_used): the coarse
 * GENERATION profile (v2 enums/bands + v1 nulls) and the engagement emitter — all
 * counts/enums/bands/booleans, no PII. `track` is mocked so we assert the exact
 * event name + props shape without a transport.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { trackSpy } = vi.hoisted(() => ({ trackSpy: vi.fn() }));
vi.mock('../../src/lib/analytics.js', async () => {
  const actual = await vi.importActual('../../src/lib/analyticsEvents.js');
  return { track: trackSpy, EVENTS: actual.EVENTS };
});

import { mapRenderProps, trackMapRender, trackMapFeature } from '../../src/lib/mapLayerAnalytics.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

beforeEach(() => trackSpy.mockClear());

const s = () => makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'mla' });

describe('mapRenderProps — the coarse generation profile', () => {
  it('a v2 model reports layoutVersion 2 + enums + a Lynch BAND (never the raw score)', () => {
    const p = mapRenderProps(buildTownMapModel(s(), { layoutLawVersion: 2 }));
    expect(p.feature).toBe('render');
    expect(p.layoutVersion).toBe(2);
    expect(p.siteKind).toBe('coast');
    expect(['organic-radial', 'concentric', 'river-spine', 'harbor-fan', 'bastide-grid']).toContain(p.morphology);
    expect(['exploit', 'endure', 'fortify']).toContain(p.responseMode);
    expect(['low', 'mid', 'high']).toContain(p.lynchBand); // banded, not raw
    expect(typeof p.retryCount).toBe('number');
    expect(typeof p.hasFabric).toBe('boolean');
    // privacy: no name / prose / coordinate keys
    for (const k of Object.keys(p)) expect(['name', 'label', 'notes', 'x', 'y']).not.toContain(k);
  });

  it('a v1 model reports layoutVersion 1 + nulls (no site/morphology/response meta)', () => {
    const p = mapRenderProps(buildTownMapModel(s(), null));
    expect(p.layoutVersion).toBe(1);
    expect(p.siteKind).toBeNull();
    expect(p.morphology).toBeNull();
    expect(p.responseMode).toBeNull();
    expect(p.lynchBand).toBeNull();
    expect(p.retryCount).toBeNull();
  });

  it('null / garbage never throws', () => {
    expect(mapRenderProps(null).layoutVersion).toBe(1);
    expect(mapRenderProps(undefined).feature).toBe('render');
  });
});

describe('emission — the single feature-discriminated event', () => {
  it('trackMapRender fires town_map_layer_used with feature:render', () => {
    trackMapRender(buildTownMapModel(s(), { layoutLawVersion: 2 }));
    expect(trackSpy).toHaveBeenCalledTimes(1);
    const [event, props] = trackSpy.mock.calls[0];
    expect(event).toBe('town_map_layer_used');
    expect(props.feature).toBe('render');
  });

  it('trackMapFeature carries the feature discriminator + coarse props', () => {
    trackMapFeature('annotation_add', { count: 3 });
    trackMapFeature('lens_switch', { lens: 'accessible' });
    expect(trackSpy.mock.calls[0]).toEqual(['town_map_layer_used', { feature: 'annotation_add', count: 3 }]);
    expect(trackSpy.mock.calls[1]).toEqual(['town_map_layer_used', { feature: 'lens_switch', lens: 'accessible' }]);
  });
});
