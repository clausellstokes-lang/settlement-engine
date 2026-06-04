/**
 * DevEmailBanner.jsx - Floating dev-only warning when Resend secrets are
 * missing on Supabase.
 *
 * Renders nothing in production (gated on import.meta.env.DEV). In DEV
 * it listens for the `sf:email-unconfigured` CustomEvent that
 * emailLifecycle.js dispatches the first time the send-email edge
 * function reports `{ ok: false, reason: 'unconfigured' }`, and shows
 * a slim banner with the exact `supabase secrets set` commands.
 *
 * Why a UI banner and not just a console.warn:
 * Lifecycle emails are fire-and-forget - they fail silently in
 * production by design (a Resend outage must not break sign-in). The
 * cost of that design is that a contributor who never sets the secrets
 * locally won't notice the lifecycle is broken until QA. The banner
 * trades a tiny corner of dev screen for a near-impossible-to-miss
 * "your local environment is missing Resend" signal.
 *
 * Usage: mount once at the App root, alongside DevFlagPanel.
 *
 *   import DevEmailBanner from './components/dev/DevEmailBanner.jsx';
 *   <DevEmailBanner />
 */

import { useEffect, useState } from 'react';
import { FS, swatch } from '../theme.js';

const DISMISS_KEY = 'sf.devEmailBanner.dismissed';
const IS_DEV = !!import.meta?.env?.DEV;

export default function DevEmailBanner() {
  // Hooks must always run in the same order - early-return AFTER hooks.
  // In prod the constant `IS_DEV` short-circuits before render returns
  // any markup; React still calls hooks, but with stable defaults so
  // there's no rules-of-hooks violation.
  const [unconfigured, setUnconfigured] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (!IS_DEV) return true;
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (!IS_DEV) return undefined;
    let cancelled = false;
    import('../../lib/emailLifecycle.js')
      .then(({ isEmailProviderUnconfigured }) => {
        if (!cancelled && typeof isEmailProviderUnconfigured === 'function' && isEmailProviderUnconfigured()) {
          setUnconfigured(true);
        }
      })
      .catch(e => {
        console.warn('[DevEmailBanner] email lifecycle status load failed:', e);
      });
    const onUnconfigured = () => setUnconfigured(true);
    window.addEventListener('sf:email-unconfigured', onUnconfigured);
    return () => {
      cancelled = true;
      window.removeEventListener('sf:email-unconfigured', onUnconfigured);
    };
  }, []);

  if (!IS_DEV || !unconfigured || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* storage unavailable - accept the redraw */ }
  };

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        right: 10,
        maxWidth: 720,
        margin: '0 auto',
        zIndex: 99999,
        background: swatch['#3A1A1A'],
        color: swatch['#FFCFCF'],
        border: '1px solid #8b1a1a',
        borderRadius: 6,
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontSize: FS.sm,
        lineHeight: 1.5,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
          [DEV] Lifecycle emails are not being delivered
        </div>
        <div>
          The <code>send-email</code> edge function reported{' '}
          <code>reason: &quot;unconfigured&quot;</code>. Set the Resend secrets:
        </div>
        <pre style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>
{`npx supabase secrets set RESEND_API_KEY=re_xxx
npx supabase secrets set RESEND_FROM_EMAIL="SettlementForge <hello@settlementforge.com>"`}
        </pre>
      </div>
      <button
        type="button"
        onClick={dismiss}
        style={{
          background: 'transparent',
          color: swatch['#FFCFCF'],
          border: '1px solid #8b1a1a',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: FS.xs,
        }}
        aria-label="Dismiss email-unconfigured banner"
      >
        Dismiss
      </button>
    </div>
  );
}
