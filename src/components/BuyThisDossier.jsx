/**
 * BuyThisDossier.jsx — the PDF-export purchase CTA, one control across the whole
 * export ladder (migration 108).
 *
 * It routes on the shared export-access gate (useDossierExportAccess) so the
 * decision lives in exactly one place. The four states it can render:
 *
 *   · reason 'tier' | 'entitled'  → render NOTHING. Cartographer / Founder /
 *       elevated already export freely; a free account that already holds the
 *       durable right on this save does too.
 *   · reason 'anon'               → an anonymous visitor. The button opens the
 *       LADDER POPUP (free account / Cartographer / one-time download) rather
 *       than jumping straight to Stripe.
 *   · reason 'unpurchased'        → a signed-in free account viewing a SAVED
 *       dossier it has not bought yet. Offers the $2.99 DURABLE purchase, keyed
 *       to this save (saveId threaded to create-checkout so the right binds to
 *       it).
 *   · reason 'unsaved'            → a signed-in free account viewing an UNSAVED
 *       draft. Durable rights attach to a save, so the honest CTA is "save it
 *       first" — wired to the same save action the wizard uses, and honest about
 *       a full save slot.
 *
 * Failure modes (anon one-time path): a secure-token or stash-write failure stops
 * the checkout BEFORE redirect so a buyer can never pay for a dossier we cannot
 * recover.
 */

import { useState } from 'react';
import { Download, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout } from '../lib/stripe.js';
import { createDossierCheckoutToken, stashPendingDossier } from '../lib/pendingDossier.js';
import { stashDossierClaim } from '../lib/dossierClaimStash.js';
import { SINGLE_DOSSIER } from '../config/pricing.js';
import { isConfigured } from '../lib/supabase.js';
import { useDossierExportAccess } from '../hooks/useDossierExportAccess.js';
import { t } from '../copy/index.js';
import { sans, FS, RED } from './theme.js';
import Button from './primitives/Button.jsx';
import DossierLadderModal from './dossier/DossierLadderModal.jsx';

/**
 * @param {object} props
 * @param {object} props.settlement       — the in-memory or saved settlement object.
 * @param {string|null} [props.saveId]     — the SAVED settlement id, or null for a draft.
 * @param {() => void} [props.onSignIn]    — open the auth flow (ladder "create account").
 * @param {(view: string) => void} [props.onNavigate] — app navigation (ladder "Cartographer").
 */
export default function BuyThisDossier({ settlement, saveId = null, onSignIn, onNavigate, size = 'sm' }) {
  const isElevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const canSave = useStore(s => (typeof s.canSave === 'function' ? s.canSave() : false));
  const setAuthModalOpen = useStore(s => s.setAuthModalOpen);
  const access = useDossierExportAccess(saveId);

  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);
  const [ladderOpen, setLadderOpen] = useState(false);

  if (!settlement) return null;
  if (isElevated) return null;              // Devs / admins never see purchase prompts.
  // Already covered: unlimited-export tier, or a durable right already held.
  if (access.allowed) return null;

  // ── The anonymous one-time checkout (unchanged mechanics) ───────────────────
  // Stashes the settlement so it survives the Stripe round-trip, AND records a
  // versioned claim stash so a later same-device sign-up + save of THIS
  // settlement can silently attach the durable right (the retro auto-upgrade).
  async function runOneTimeCheckout() {
    setBusy(true); setError(null);
    try {
      const checkoutToken = createDossierCheckoutToken();
      if (!stashPendingDossier(settlement, checkoutToken)) {
        throw new Error('This browser cannot safely retain the dossier through checkout. Enable local storage and try again.');
      }
      // Record the retro-claim stash BEFORE redirect (best-effort; a failure here
      // must not block a paid download — the one-shot still works, it just can't
      // be auto-upgraded later).
      try { stashDossierClaim({ settlement, checkoutToken }); } catch { /* non-fatal */ }
      await startCheckout('single_dossier', { checkoutToken });
      // startCheckout redirects on success; we only reach here on failure.
    } catch (e) {
      setError(e.message || t('dossierExport.buySaved.error'));
      setBusy(false);
      setLadderOpen(false);
    }
  }

  // ── The signed-in free-account durable purchase, keyed to this saved dossier ─
  async function runSavedCheckout() {
    setBusy(true); setError(null);
    try {
      await startCheckout('single_dossier', { checkoutToken: createDossierCheckoutToken(), saveId });
      // Redirects on success.
    } catch (e) {
      setError(e.message || t('dossierExport.buySaved.error'));
      setBusy(false);
    }
  }

  // ── State: ANON → the ladder popup ──────────────────────────────────────────
  if (access.reason === 'anon') {
    const openAccount = () => {
      setLadderOpen(false);
      if (typeof onSignIn === 'function') onSignIn();
      else setAuthModalOpen?.(true);
    };
    const openCartographer = () => {
      setLadderOpen(false);
      if (typeof onNavigate === 'function') onNavigate('pricing');
    };
    return (
      <div style={wrapStyle}>
        <Button
          type="button"
          variant="secondary"
          size={size}
          icon={<Download size={12} />}
          disabled={!isConfigured}
          onClick={() => { setError(null); setLadderOpen(true); }}
          style={{ minHeight: 44 }}
          title={isConfigured
            ? `Buy this dossier as a PDF for ${SINGLE_DOSSIER.priceLabel}. No account required.`
            : 'Payments are not configured in this environment.'}
        >
          {`Buy this dossier for ${SINGLE_DOSSIER.priceLabel}`}
        </Button>
        {error && <span style={errStyle}>{error}</span>}
        {ladderOpen && (
          <DossierLadderModal
            busy={busy}
            onClose={() => { if (!busy) setLadderOpen(false); }}
            onCreateAccount={openAccount}
            onCartographer={openCartographer}
            onOneTime={runOneTimeCheckout}
          />
        )}
      </div>
    );
  }

  // ── State: signed-in free, UNSAVED draft → save-first CTA ────────────────────
  if (access.reason === 'unsaved') {
    const openSignupOrSave = () => {
      // A free account that CAN save just needs to press Save (owned by
      // SaveToLibraryButton elsewhere in the flow); when they cannot (at cap), we
      // route to the auth/upgrade door and stay honest about the full slots.
      if (typeof onSignIn === 'function') onSignIn();
      else setAuthModalOpen?.(true);
    };
    return (
      <div style={wrapStyle}>
        <Button
          type="button"
          variant="secondary"
          size={size}
          icon={<Save size={12} />}
          onClick={openSignupOrSave}
          style={{ minHeight: 44 }}
          // Hover reveals the full context: the durable-rights explainer normally,
          // or the at-cap notice when the free save slots are full.
          title={canSave
            ? t('dossierExport.saveFirst.subline', { price: SINGLE_DOSSIER.priceLabel })
            : t('dossierExport.saveFirst.atCap')}
        >
          {t('dossierExport.saveFirst.cta')}
        </Button>
      </div>
    );
  }

  // ── State: signed-in free, SAVED, not entitled → the durable $2.99 purchase ──
  // (access.reason === 'unpurchased')
  return (
    <div style={wrapStyle}>
      <Button
        type="button"
        variant="secondary"
        size={size}
        icon={<Download size={12} />}
        busy={busy}
        disabled={!isConfigured}
        onClick={runSavedCheckout}
        style={{ minHeight: 44 }}
        title={t('dossierExport.buySaved.subline')}
      >
        {busy
          ? t('dossierExport.buySaved.busy')
          : t('dossierExport.buySaved.cta', { price: SINGLE_DOSSIER.priceLabel })}
      </Button>
      {error && <span style={errStyle}>{error}</span>}
    </div>
  );
}

// inline-GRID with a single min-content column pins this control to the BUTTON's
// intrinsic width (its label is white-space:nowrap, so its min-content IS its full
// width). The purchase caption now lives in the button's hover title, not an
// always-visible line — so the only thing that can render below the button is a
// checkout error, and the grid makes it WRAP within the button width instead of
// stretching the item and shoving the neighbouring Save / Edit / Share buttons
// off-centre.
const wrapStyle = {
  display: 'inline-grid', gridTemplateColumns: 'min-content', justifyItems: 'center',
  gap: 6, fontFamily: sans,
};
const errStyle = { fontSize: FS.xs, color: RED, textAlign: 'center' };
