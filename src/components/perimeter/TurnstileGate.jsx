/**
 * TurnstileGate.jsx — a lazy, feature-flagged Cloudflare Turnstile widget in
 * MANAGED / invisible-first mode (Wave-D perimeter, item 7).
 *
 * INERT BY DEFAULT. Nothing in the eager bundle imports this file, so while the
 * `perimeterCaptcha` flag is off it contributes ZERO eager bytes (tree-shaken
 * out entirely). The intended wiring is a React.lazy import gated on the flag:
 *
 *   const TurnstileGate = React.lazy(() => import('../perimeter/TurnstileGate.jsx'));
 *   ...
 *   {flag('perimeterCaptcha') && (
 *     <Suspense fallback={null}>
 *       <TurnstileGate action="signin" onToken={setCaptchaToken} />
 *     </Suspense>
 *   )}
 *
 * The Turnstile script is loaded LAZILY at mount (never bundled — no runtime
 * dependency), and only when a site key is configured. Managed mode is
 * PUZZLE-FREE for humans (the widget is invisible unless automation signals
 * appear), so there is no CAPTCHA cognitive-function test (WCAG 2.2 SC 3.3.8);
 * the container reserves a >=44px touch target for the interactive challenge
 * when it does surface. GRACEFUL DEGRADATION: on script block / expiry / error
 * the widget emits a null token rather than dead-ending the form — the honest
 * gate is the server (Supabase-side auth captcha + verifyTurnstile on checkout);
 * see docs/PERIMETER_RUNBOOK.md.
 *
 * Activation also needs the CSP to allow challenges.cloudflare.com in script-src
 * + frame-src (documented in the runbook) — NOT shipped while inert.
 */
import { useEffect, useRef, useCallback } from 'react';

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

// Module-level singleton so the script is injected at most once across all gates.
let _scriptPromise = null;
function loadTurnstileScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('no dom'));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (_scriptPromise) return _scriptPromise;
  _scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.turnstile));
      existing.addEventListener('error', () => reject(new Error('turnstile script error')));
      return;
    }
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => { _scriptPromise = null; reject(new Error('turnstile script failed to load')); };
    document.head.appendChild(s);
  });
  return _scriptPromise;
}

/**
 * @param {Object} props
 * @param {(token: string | null) => void} props.onToken called with the solved token, or null on expiry/error/degradation
 * @param {string} [props.action] optional Turnstile action label (e.g. 'signin')
 * @param {string} [props.className]
 */
export default function TurnstileGate({ onToken, action, className }) {
  const siteKey = (import.meta?.env?.VITE_TURNSTILE_SITE_KEY) || '';
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const emit = useCallback((t) => { try { onToken?.(t); } catch { /* caller's problem */ } }, [onToken]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined; // INERT without a key
    let cancelled = false;
    loadTurnstileScript()
      .then((ts) => {
        if (cancelled || !ts || !containerRef.current) return;
        widgetIdRef.current = ts.render(containerRef.current, {
          sitekey: siteKey,
          action,
          // Managed / invisible-first: the challenge is shown only when needed.
          appearance: 'interaction-only',
          callback: (token) => emit(token),
          'expired-callback': () => emit(null),
          'error-callback': () => emit(null), // graceful degradation, no dead-end
        });
      })
      .catch(() => emit(null)); // script blocked/unreachable → degrade, don't block
    return () => {
      cancelled = true;
      try {
        if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      } catch { /* widget already gone */ }
    };
  }, [siteKey, action, emit]);

  if (!siteKey) return null; // INERT: no key → render nothing at all
  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Human verification"
      // Reserve the interactive challenge's touch target (>=44px) + keep it
      // visible against the auth card; managed mode stays invisible until needed.
      style={{ minHeight: 44, minWidth: 44 }}
    />
  );
}
