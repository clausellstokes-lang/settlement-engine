/**
 * BuyThisDossier.jsx — $2.99 single-dossier CTA for anonymous viewers.
 *
 * Shown in the dossier toolbar for anonymous users only. Clicking:
 *   1. Stashes the current settlement so it survives the redirect.
 *   2. Sends the user to Stripe Checkout (product='single_dossier').
 *   3. After payment, App.jsx routes them to SingleDossierSuccessPage
 *      which pulls the stash back out and downloads the PDF.
 *
 * Why anonymous-only:
 *   Signed-in users already have saves and exports; for them the
 *   subscription tiers are the right offer. For the anonymous "first
 *   touch" visitor, the $2.99 microtransaction is the lowest-friction
 *   conversion — pay once, get the dossier, optionally upgrade later.
 *
 * Failure modes:
 *   - Supabase not configured (local dev) → button shows but a click
 *     surfaces an inline error rather than 500-ing through Stripe.
 *   - Secure token or stash write fails → checkout is stopped before
 *     redirect so the buyer cannot pay for a dossier we cannot recover.
 */

import { useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout } from '../lib/stripe.js';
import { createDossierCheckoutToken, stashPendingDossier } from '../lib/pendingDossier.js';
import { SINGLE_DOSSIER } from '../config/pricing.js';
import { isConfigured } from '../lib/supabase.js';
import { sans, SP, FS, swatch, RED } from './theme.js';
import Button from './primitives/Button.jsx';

const MUTED = swatch['#6B5340'];

export default function BuyThisDossier({ settlement }) {
  const authTier = useStore(s => s.auth.tier);
  const isElevated = useStore(s => s.isElevated());

  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);

  if (authTier !== 'anon') return null;     // Signed-in users get the subscription CTA elsewhere
  if (isElevated) return null;              // Devs / admins shouldn't see purchase prompts
  if (!settlement) return null;

  async function handleBuy() {
    setBusy(true); setError(null);
    try {
      const checkoutToken = createDossierCheckoutToken();
      if (!stashPendingDossier(settlement, checkoutToken)) {
        throw new Error('This browser cannot safely retain the dossier through checkout. Enable local storage and try again.');
      }
      await startCheckout('single_dossier', { checkoutToken });
      // startCheckout redirects on success, so we only reach this
      // line on failure.
    } catch (e) {
      setError(e.message || 'Checkout failed');
      setBusy(false);
    }
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: SP.sm,
      flexWrap: 'wrap', fontFamily: sans,
    }}>
      {/* Outline (secondary), not a filled CTA: in the dossier chrome the
          purchase is a contextual offer, not the region's primary task, so it
          must not be the loudest control. Per P8, upgrade/credits CTAs are
          primary only on Pricing/Account and secondary elsewhere; it stays
          visually distinct (gold-bordered outline + Download glyph) without
          dominating the freshly generated dossier at its peak moment. (P8 / P9.) */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={<Download size={12} />}
        busy={busy}
        disabled={!isConfigured}
        onClick={handleBuy}
        // Purchase is a real money control, so it must clear the ~44px touch
        // target even though it renders at the dense `sm` size in dossier chrome.
        style={{ minHeight: 44 }}
        title={
          isConfigured
            ? `Buy this dossier as a PDF for ${SINGLE_DOSSIER.priceLabel}. No account required.`
            : 'Payments are not configured in this environment.'
        }
      >
        {busy ? 'Redirecting…' : `Buy this dossier for ${SINGLE_DOSSIER.priceLabel}`}
      </Button>
      <span style={{
        fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
      }}>
        One-time, no account needed.
      </span>
      {error && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: FS.xs, color: RED,
        }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}
