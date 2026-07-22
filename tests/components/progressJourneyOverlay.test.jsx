/** @vitest-environment jsdom */
/**
 * progressJourneyOverlay.test.jsx — the dormant-safe socket, both states.
 *
 *   ABSENT  → renders the fallback (the current loading presentation), no <video>.
 *   PRESENT → mounts the scrub overlay at the contract src, with the lazy-ratchet
 *             fingerprint on the rendered root.
 *   REDUCED-MOTION → fallback even when present (E-I gate; also spares a 20 MB pull).
 *   TEARDOWN → the <video> is paused + its src dropped on unmount (no lingering decode).
 *
 * jsdom fires no media events, so `videoReady` stays false and the rAF chase never
 * runs — exactly the intended floor: the element mounts and covers, and the pure
 * chase law is proven decode-free in progressChase.test.js.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import ProgressJourneyOverlay, {
  PROGRESS_JOURNEY_FINGERPRINT,
} from '../../src/components/loadingJourney/ProgressJourneyOverlay.jsx';
import { __resetJourneyVideoProbeCache } from '../../src/components/loadingJourney/useJourneyVideoAsset.js';

function mm(matchesFor) {
  window.matchMedia = (q) => ({
    matches: matchesFor(q), media: q,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  });
}
const enableMotion = () => mm((q) => (q.includes('reduced-motion') ? false : q.includes('pointer: fine') ? true : true));
const reducedMotion = () => mm((q) => (q.includes('reduced-motion') ? true : q.includes('pointer: fine') ? true : false));

const present = () => Promise.resolve(true);
const absent = () => Promise.resolve(false);

afterEach(() => { cleanup(); __resetJourneyVideoProbeCache(); delete window.matchMedia; });

describe('ProgressJourneyOverlay — dormant-safe socket', () => {
  it('ABSENT asset → renders the fallback, no <video>', async () => {
    enableMotion();
    const { container } = render(
      <ProgressJourneyOverlay progress={0.5} probe={absent} fallback={<div data-testid="fb">current</div>} />,
    );
    await waitFor(() => expect(container.querySelector('[data-testid="fb"]')).not.toBeNull());
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('[data-progress-journey]')).toBeNull();
  });

  it('PRESENT asset + motion-ok → mounts the scrub overlay at the contract src + fingerprint', async () => {
    enableMotion();
    const { container } = render(<ProgressJourneyOverlay progress={0.3} probe={present} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const root = container.querySelector('[data-progress-journey]');
    expect(root).not.toBeNull();
    expect(root.getAttribute('data-progress-journey')).toBe(PROGRESS_JOURNEY_FINGERPRINT);
    const v = container.querySelector('video');
    expect(v.getAttribute('src')).toBe('/videos/realm-journey.mp4');
    expect(v.getAttribute('aria-hidden')).toBe('true');
  });

  it('REDUCED MOTION → fallback even when present (no video, no 20 MB pull)', async () => {
    reducedMotion();
    const { container } = render(
      <ProgressJourneyOverlay progress={0.5} probe={present} fallback={<div data-testid="fb">still</div>} />,
    );
    await waitFor(() => expect(container.querySelector('[data-testid="fb"]')).not.toBeNull());
    expect(container.querySelector('video')).toBeNull();
  });

  it('tears the <video> down on unmount (no lingering decode)', async () => {
    enableMotion();
    const { container, unmount } = render(<ProgressJourneyOverlay progress={0.3} probe={present} />);
    await waitFor(() => expect(container.querySelector('video')).not.toBeNull());
    const v = container.querySelector('video');
    const pauseSpy = vi.spyOn(v, 'pause').mockImplementation(() => {});
    v.load = vi.fn();                       // jsdom lacks load(); stub it
    unmount();
    expect(pauseSpy).toHaveBeenCalled();
    expect(v.getAttribute('src')).toBeNull();
    expect(v.load).toHaveBeenCalled();
  });
});
