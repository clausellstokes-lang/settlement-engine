/**
 * CaptchaGate.jsx — the flag-gated, lazy mount point for the Cloudflare Turnstile
 * human-verification widget (Wave-D perimeter, item 7 → code-complete WD-h).
 *
 * This is the ONE place the auth + purchase surfaces reach for the widget, so the
 * flag gate + Suspense + lazy-import idiom lives here once instead of being
 * duplicated at every call site. It renders NOTHING and imports NOTHING extra
 * while the `perimeterCaptcha` flag is off (the default): the `useFlag` short-
 * circuits before the lazy component is ever referenced, so TurnstileGate — and
 * the Cloudflare script it loads at mount — stay entirely out of the flag-off
 * path. TurnstileGate itself is a React.lazy chunk, so it contributes ZERO eager
 * bytes; only this ~20-line wrapper is eager (a flag read + a Suspense boundary).
 *
 * Managed / invisible-first: the widget is silent for humans and only surfaces an
 * interactive challenge under automation signals. GRACEFUL DEGRADATION is owned by
 * TurnstileGate (a blocked/expired/errored challenge emits a null token rather than
 * dead-ending the form); the honest gate is the server (Supabase-native auth captcha
 * + verifyTurnstile on the checkout edge functions). See docs/PERIMETER_RUNBOOK.md.
 *
 * @param {object} props
 * @param {(token: string | null) => void} props.onToken — receives the solved token, or null on degradation.
 * @param {string} [props.action] — a Turnstile action label for analytics ('signin' | 'signup' | 'checkout' | 'dossier' | 'verify').
 * @param {string} [props.className]
 */
import { lazy, Suspense } from 'react';
import { flag } from '../../lib/flags.js';

const TurnstileGate = lazy(() => import('./TurnstileGate.jsx'));

export default function CaptchaGate({ onToken, action, className }) {
  // INERT by default: with the flag off nothing below the guard is reached, so the
  // lazy chunk is never requested and no Cloudflare script is injected. Uses the
  // NON-reactive `flag()` (the house idiom — mirrors AuthPanel's flag('googleOauth')
  // and the codebase-wide test-mock convention) since perimeterCaptcha is a
  // build/load-time activation flag, not a runtime toggle.
  const enabled = flag('perimeterCaptcha');
  if (!enabled) return null;
  return (
    <Suspense fallback={null}>
      <TurnstileGate action={action} onToken={onToken} className={className} />
    </Suspense>
  );
}
