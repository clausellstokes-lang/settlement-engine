/** @vitest-environment jsdom */
/**
 * loadingJourneyFilm.test.jsx — STILLS ARE THE FLOOR (Slice C2L engineering law #1).
 *
 * The loading surface must render the COMPLETE journey with the film entirely
 * absent: the crisp stop still is the floor, the video a progressive enhancement.
 * This is the test-level equivalent of the network-blocked walk —
 *   (a) with no fine-pointer / no matchMedia (jsdom default) the film never mounts,
 *       yet a journey still still paints; and
 *   (b) even when the film IS live, a video error leaves the still floor intact.
 * Also pins the lazy-ratchet fingerprint on the rendered root.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import JourneyFilm from '../../src/components/loadingJourney/JourneyFilm.jsx';
import { JOURNEY_FILM_FINGERPRINT } from '../../src/components/loadingJourney/journeyManifest.js';
import RealmUnfurlLoading, { REALM_UNFURL_FINGERPRINT } from '../../src/components/loadingJourney/RealmUnfurlLoading.jsx';

const STILL_RE = /\/media\/journey-legs\/bg\/still-\d+-[a-z]+\.jpg$/;

afterEach(() => cleanup());

describe('THE FLOOR — the journey renders from stills with the film absent', () => {
  it('paints a stop still even with no fine-pointer / no matchMedia (film never mounts)', () => {
    // jsdom provides no window.matchMedia → filmLive stays false → stills only.
    const { container } = render(
      <JourneyFilm legsToPlay={3} arrived scriptWindowMs={1} startedAtMs={0} />,
    );
    const img = container.querySelector('img');
    expect(img, 'the stop still (the floor) must render').not.toBeNull();
    expect(img.getAttribute('src')).toMatch(STILL_RE);
    // Progressive enhancement only: no <video> when the film is not live.
    expect(container.querySelector('video'), 'no film without a fine pointer').toBeNull();
  });

  it('mints the lazy-ratchet fingerprint on the rendered root', () => {
    const { container } = render(
      <JourneyFilm legsToPlay={2} arrived scriptWindowMs={1} startedAtMs={0} />,
    );
    const root = container.querySelector('[data-journey-film]');
    expect(root).not.toBeNull();
    expect(root.getAttribute('data-journey-film')).toBe(JOURNEY_FILM_FINGERPRINT);
  });

  it('keeps the still floor intact when the live film errors', async () => {
    // Force the fine-pointer + motion-allowed path so the <video> mounts.
    const realMM = window.matchMedia;
    window.matchMedia = (q) => ({
      matches: q.includes('pointer: fine') ? true : !q.includes('reduced-motion') && false,
      media: q,
      addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {},
      onchange: null, dispatchEvent() { return false; },
    });
    try {
      const { container } = render(
        <JourneyFilm legsToPlay={3} arrived scriptWindowMs={1} startedAtMs={0} />,
      );
      const video = await waitFor(() => {
        const v = container.querySelector('video');
        expect(v).not.toBeNull();
        return v;
      });
      // The film errors — the still floor must survive.
      fireEvent.error(video);
      const img = container.querySelector('img');
      expect(img, 'the floor still survives a video error').not.toBeNull();
      expect(img.getAttribute('src')).toMatch(STILL_RE);
    } finally {
      window.matchMedia = realMM;
    }
  });
});

describe('THE REALM UNFURL FLOOR — parchment renders while the FMG iframe boots', () => {
  it('renders the parchment scroll floor with no film master (the drop-in seam is empty)', () => {
    const { container } = render(<RealmUnfurlLoading bridgeReady={false} />);
    const root = container.querySelector('[data-realm-unfurl]');
    expect(root, 'the unfurl backdrop must render while booting').not.toBeNull();
    expect(root.getAttribute('data-realm-unfurl')).toBe(REALM_UNFURL_FINGERPRINT);
    // The parchment texture is the floor material (existing shipped asset).
    const parchment = [...container.querySelectorAll('div')].find((d) => (d.getAttribute('style') || '').includes('paper-grain'));
    expect(parchment, 'the parchment floor renders film-independently').toBeDefined();
    // No master exists yet → no <video> even on a fine pointer.
    expect(container.querySelector('video'), 'the unfurl video seam is empty until a master ships').toBeNull();
  });
});
