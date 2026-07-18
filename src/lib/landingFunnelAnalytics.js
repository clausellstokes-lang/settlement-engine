/**
 * lib/landingFunnelAnalytics.js — W-DOC: the Welcome-landing funnel helper.
 *
 * The landing funnel joins the SM-5 map-layer pattern (lib/mapLayerAnalytics.js):
 * ONE feature-discriminated event (EVENTS.LANDING_FUNNEL_USED — one name, not a
 * name per moment) fired best-effort from the LAZY landing chunk, so the eager
 * closure gains nothing beyond the single event-name string in the (eager)
 * EVENTS registry. This lands the previously dormant Funnel.welcomeView /
 * Funnel.landingFixtureForge seams (both call sites were optional-chained
 * no-ops until this module).
 *
 * Features:
 *   - 'view'          — the Welcome landing mounted. Deduped once per session
 *                       (the Funnel.homepageView sessionStorage idiom) so a
 *                       scroll-away-and-back never double-counts.
 *   - 'fixture_forge' — the "Forge this exact town" determinism control was
 *                       clicked. Carries the fixture's CONSTANT seed (the same
 *                       value for every visitor — provenance, not user data).
 *
 * PRIVACY: coarse enums / constants only — never a settlement name, prose,
 * coordinate, or anything user-entered (the analytics props-hygiene lint bans
 * those keys anyway). Essential class; consent-tiering rides the seam.
 */
import { track, EVENTS } from './analytics.js';

/** Best-effort emit — never throws, never blocks the render. */
function emit(props) {
  try { track(EVENTS.LANDING_FUNNEL_USED, props); } catch { /* analytics is best-effort */ }
}

/**
 * The landing mounted. Once per session (best-effort dedup: on any storage
 * error we skip the guard and still fire, the Funnel.homepageView idiom).
 */
export function trackLandingView() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('sf_landing_view_sent') === '1') return;
      sessionStorage.setItem('sf_landing_view_sent', '1');
    }
  } catch { /* storage unavailable — fall through and fire */ }
  emit({ feature: 'view' });
}

/**
 * The one interactive artifact control fired (the determinism replay).
 * @param {{ seed?: string | number }} [opts] — the landing fixture's constant seed.
 */
export function trackLandingFixtureForge({ seed } = {}) {
  emit({ feature: 'fixture_forge', seed: seed ?? null });
}
