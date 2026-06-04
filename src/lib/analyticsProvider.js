/**
 * analyticsProvider.js — Tier 8.8 / 8.9 provider bridge.
 *
 * The analytics module (src/lib/analytics.js) calls
 * `window.__sf_analytics_provider(event, props)` for every tracked
 * event. This file installs that handler on app boot.
 *
 * Two providers are supported out of the box:
 *
 *   1. Plausible (default — privacy-first, single script tag).
 *      Activated when VITE_PLAUSIBLE_DOMAIN is set. The Plausible
 *      script tag goes in index.html (also env-gated via a small
 *      bootstrap script). Events fire via `window.plausible(name, opts)`.
 *
 *   2. PostHog (alternative — full product analytics).
 *      Activated when VITE_POSTHOG_KEY is set. Requires posthog-js
 *      via npm. If you switch to PostHog, uncomment the import
 *      below and run `npm i posthog-js`.
 *
 * Privacy:
 *   - Plausible doesn't use cookies and is GDPR-compliant by default.
 *     No consent banner required for EU traffic. The DNT check in
 *     analytics.js still applies on top.
 *   - PostHog uses cookies; you'll want a consent gate before activating.
 *
 * If neither env var is set, no provider is installed and analytics.js
 * falls back to its dev-console log (silent in prod). The call sites
 * keep working — they just don't surface anywhere visible.
 */

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_API    = import.meta.env.VITE_PLAUSIBLE_API || 'https://plausible.io';
const POSTHOG_KEY      = import.meta.env.VITE_POSTHOG_KEY;
// PostHog host is read inside installPostHog() — kept as a top-level
// constant once you uncomment the dispatch. Prefixed with _ to silence
// no-unused-vars while the PostHog path is commented out.
const _POSTHOG_HOST    = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

/**
 * Inject the Plausible script tag and install the provider hook.
 * Idempotent — calling twice does nothing on the second call.
 */
function installPlausible(domain) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (window.__sf_analytics_installed === 'plausible') return;

  // Plausible's default script is at /js/script.js on whatever host
  // serves it. For Plausible Cloud that's plausible.io; for self-hosted
  // it's wherever you host it. The data-domain attribute tells
  // Plausible which site this is.
  const existing = document.querySelector('script[data-sf-analytics="plausible"]');
  if (!existing) {
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', domain);
    s.setAttribute('data-sf-analytics', 'plausible');
    s.src = `${PLAUSIBLE_API.replace(/\/$/, '')}/js/script.js`;
    document.head.appendChild(s);
  }

  // Plausible exposes `window.plausible(name, { props, callback })`.
  // The script loads asynchronously, so we wrap in a check + queue
  // any events that fire before the script lands. Plausible's own
  // pattern uses `window.plausible.q` for this; we replicate it.
  if (typeof window.plausible !== 'function') {
    window.plausible = function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  // Bridge: every tracked event from analytics.js → window.plausible.
  // Plausible expects PascalCase event names; we map snake_case → Pascal
  // so the dashboard reads cleanly. The `props` object is passed via
  // the `props` option, which Plausible supports natively.
  window.__sf_analytics_provider = function (event, props) {
    if (typeof window.plausible !== 'function') return;
    const name = toPascal(event);
    window.plausible(name, props && Object.keys(props).length ? { props } : undefined);
  };

  window.__sf_analytics_installed = 'plausible';
}

/**
 * PostHog provider — alternative path. Requires `posthog-js` package.
 * Commented out by default; uncomment + install if you choose PostHog.
 */
function installPostHog(_key) {
  if (typeof window === 'undefined') return;
  if (window.__sf_analytics_installed === 'posthog') return;

  // import('posthog-js').then(({ default: posthog }) => {
  //   posthog.init(_key, { api_host: POSTHOG_HOST });
  //   window.__sf_analytics_provider = function (event, props) {
  //     posthog.capture(event, props);
  //   };
  //   window.__sf_analytics_installed = 'posthog';
  // }).catch(e => {
  //   if (import.meta?.env?.DEV) console.warn('[analyticsProvider] posthog-js import failed:', e.message);
  // });

  if (import.meta?.env?.DEV) {

    console.warn('[analyticsProvider] PostHog env var set but posthog-js is not installed. Run `npm i posthog-js` and uncomment the dispatch in src/lib/analyticsProvider.js.');
  }
}

function toPascal(snake) {
  if (!snake) return snake;
  return snake.split('_').map(part => {
    if (!part) return '';
    return part[0].toUpperCase() + part.slice(1);
  }).join(' ');
}

/**
 * Public entry — call once from src/main.jsx after the React tree mounts.
 * Selects a provider based on which env var is set; if neither is set
 * the function is a no-op and analytics.js falls back to its dev-log.
 */
export function installAnalyticsProvider() {
  if (PLAUSIBLE_DOMAIN) {
    installPlausible(PLAUSIBLE_DOMAIN);
    return;
  }
  if (POSTHOG_KEY) {
    installPostHog(POSTHOG_KEY);
    return;
  }
  // No provider configured — leave window.__sf_analytics_provider
  // unset. analytics.js logs to console in DEV, no-ops in PROD.
}
