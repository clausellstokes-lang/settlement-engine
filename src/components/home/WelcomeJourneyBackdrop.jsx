/**
 * home/WelcomeJourneyBackdrop.jsx — THE WELCOME'S TRAVEL-AND-STOP FILM (Slice C2).
 *
 * A fixed, viewport-filling backdrop behind the scrollable Welcome page. It is
 * the microsite's mechanic (marketing/website/src/main.js) translated to React:
 * the crisp stop STILL is always the floor (engineering law #1); scrolling
 * through a `.leg` travel spacer SCRUBS the growth film between two tiers; and at
 * each stop the film freezes on that tier's still while the existing Welcome
 * section presents over it. It rides the SHARED presentation (JourneyFilmView)
 * and the SHARED projection (projectLegFrame) — the only thing new here is the
 * scroll driver (useScrollJourney) and the taste-gate wiring.
 *
 * ZERO EAGER JS (law #2): this module rides the lazy below-fold chunk (its only
 * importer is LandingBelowFold, itself lazy under HomeLanding, itself React.lazy
 * in AppViews). The load-bearing WELCOME_JOURNEY_FINGERPRINT (a data-attribute so
 * it survives minification) is asserted ABSENT from the entry's static closure by
 * tests/build/loadingJourneyLazy.test.js. Streamed media never touches the JS
 * closure; film-OFF retains the zero-network-weight fallback.
 *
 * TASTE-GATE (law #5): `welcomeJourneyFilm` toggles the video without a rebuild.
 * The walk selected the `bg` masters, now the sole media path. Film-off keeps the
 * full stills journey — the floor serves film-on and film-off alike.
 */

import { useEffect, useRef } from 'react';
import { flag } from '../../lib/flags.js';
import { JourneyFilmView } from '../loadingJourney/JourneyFilm.jsx';
import { useScrollJourney } from '../loadingJourney/useScrollJourney.js';
import { trackLandingJourneyStop } from '../../lib/landingFunnelAnalytics.js';

// Kept in sync with tests/build/loadingJourneyLazy.test.js (WELCOME_FINGERPRINT).
export const WELCOME_JOURNEY_FINGERPRINT = '::welcome-journey:v1:';

// The Welcome journey plays all six growth legs (desk → … → metropolis); a
// shorter-tier order never applies here — the marketing walk is the full arc.
export const WELCOME_LEGS = 6;

export default function WelcomeJourneyBackdrop({ rootRef }) {
  const filmEnabled = flag('welcomeJourneyFilm');
  const frame = useScrollJourney({ rootRef, legs: WELCOME_LEGS });

  // Funnel depth: emit one journey_stop as each new stop is first reached. The
  // floor still is monotonic as the viewer scrolls down, so tracking its running
  // max fires each intermediate stop exactly once (the helper double-dedups per
  // session). Independent of the film toggle — the stills journey has the same
  // stops, so film-off funnels are measured too.
  const maxStopRef = useRef(0);
  const stop = frame.floorStill | 0;
  useEffect(() => {
    if (stop > maxStopRef.current) {
      for (let s = maxStopRef.current + 1; s <= stop; s++) trackLandingJourneyStop(s);
      maxStopRef.current = stop;
    }
  }, [stop]);

  return (
    <div
      aria-hidden="true"
      data-welcome-journey={WELCOME_JOURNEY_FINGERPRINT}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <JourneyFilmView
        frame={frame}
        legsToPlay={WELCOME_LEGS}
        filmEnabled={filmEnabled}
        // No dim: the Welcome sections are opaque and occlude the backdrop, so the
        // film only shows in the transparent travel legs, where it should read at
        // full richness (the loading surface dims because UI overlays it).
        scrimOpacity={0}
      />
    </div>
  );
}
