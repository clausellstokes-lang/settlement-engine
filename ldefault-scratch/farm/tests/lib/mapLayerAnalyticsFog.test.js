/**
 * mapLayerAnalyticsFog.test.js — DOOR 2 fog analytics ride SM-5's map-layer helper.
 *
 * The fog surfaces inherit trackMapFeature (the ONE feature-discriminated
 * town_map_layer_used event — no new event name, zero eager string bytes): the pane wires
 * useMapFog's onReveal/onSession to fire('fog_reveal', { kind }) / fire('fog_session',
 * { count }), and the chrome fires 'fog_handout'. These pins hold the emission shape:
 * the shared event name + the feature discriminator + coarse enums/counts ONLY (no label,
 * no session name, no coordinates — the props-hygiene law).
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { trackSpy } = vi.hoisted(() => ({ trackSpy: vi.fn() }));
vi.mock('../../src/lib/analytics.js', async () => {
  const actual = await vi.importActual('../../src/lib/analyticsEvents.js');
  return { track: trackSpy, EVENTS: actual.EVENTS };
});

import { trackMapFeature } from '../../src/lib/mapLayerAnalytics.js';
import { EVENTS } from '../../src/lib/analyticsEvents.js';

beforeEach(() => trackSpy.mockClear());

describe('DOOR 2 — fog features ride the ONE map-layer event', () => {
  it('fog_reveal emits town_map_layer_used with the kind enum only', () => {
    trackMapFeature('fog_reveal', { kind: 'districts' });
    expect(trackSpy).toHaveBeenCalledWith(EVENTS.TOWN_MAP_LAYER_USED, { feature: 'fog_reveal', kind: 'districts' });
  });

  it('fog_session emits the session count only; fog_handout is bare', () => {
    trackMapFeature('fog_session', { count: 2 });
    trackMapFeature('fog_handout');
    expect(trackSpy).toHaveBeenNthCalledWith(1, EVENTS.TOWN_MAP_LAYER_USED, { feature: 'fog_session', count: 2 });
    expect(trackSpy).toHaveBeenNthCalledWith(2, EVENTS.TOWN_MAP_LAYER_USED, { feature: 'fog_handout' });
  });

  it('the emitter never throws when the transport does (best-effort law)', () => {
    trackSpy.mockImplementationOnce(() => { throw new Error('transport down'); });
    expect(() => trackMapFeature('fog_reveal', { kind: 'streets' })).not.toThrow();
  });
});
