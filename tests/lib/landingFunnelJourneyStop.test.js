/** @vitest-environment jsdom */
/**
 * landingFunnelJourneyStop.test.js — the journey_stop enrichment.
 *
 * The Welcome travel-and-stop film now reports funnel depth by ENRICHING the one
 * existing LANDING_FUNNEL_USED event with a `journey_stop` feature (no new eager
 * event name). These pins lock the coarse payload and the once-per-stop-per-
 * session dedup.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const trackMock = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  track: (...a) => trackMock(...a),
  EVENTS: { LANDING_FUNNEL_USED: 'landing_funnel_used' },
}));

import { trackLandingJourneyStop } from '../../src/lib/landingFunnelAnalytics.js';

beforeEach(() => { trackMock.mockClear(); sessionStorage.clear(); });

describe('trackLandingJourneyStop', () => {
  it('emits journey_stop with only the coarse stop index', () => {
    trackLandingJourneyStop(3);
    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith('landing_funnel_used', { feature: 'journey_stop', stop: 3 });
  });

  it('dedups the same stop within a session', () => {
    trackLandingJourneyStop(2);
    trackLandingJourneyStop(2);
    expect(trackMock).toHaveBeenCalledTimes(1);
  });

  it('fires each distinct stop once', () => {
    trackLandingJourneyStop(1);
    trackLandingJourneyStop(2);
    expect(trackMock).toHaveBeenCalledTimes(2);
  });

  it('ignores stop 0 (the initial view, already counted by trackLandingView)', () => {
    trackLandingJourneyStop(0);
    expect(trackMock).not.toHaveBeenCalled();
  });
});
