import { useState } from 'react';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { startCheckout } from '../../lib/stripe.js';
import { createDossierCheckoutToken } from '../../lib/pendingDossier.js';
import { SINGLE_DOSSIER } from '../../config/pricing.js';
import { isConfigured } from '../../lib/supabase.js';
import { purchasesOpen } from '../../lib/launchGate.js';
import { t } from '../../copy/index.js';
import { FS, RED, sans } from '../theme.js';

/**
 * ExportUnlockDialog — the single-dossier export-unlock pitch shown as a POPUP
 * (owner order 2026-07-22) rather than an always-visible card. A free/unentitled
 * owner reaches it by CLICKING an export/unlock action; the same "Unlock all
 * exports for this settlement · $2.99" title + explainer paragraph live here now,
 * so the pitch never sits as a static block on the surface. Entitled users never
 * see it — their export runs directly.
 *
 * Built on the Dialog Shell (through ConfirmDialog) so it is keyboard-complete
 * (focus trap + Escape + focus restore) and bounds correctly on short viewports
 * (the shell caps at min(90vh,680px) with internal scroll — it does not hit the
 * H13 PurchaseModal clipping).
 *
 * Self-contained checkout: the durable single-dossier purchase runs through the
 * shared startCheckout('single_dossier', ...) seam keyed to this saveId — the
 * SAME seam BuyThisDossier.runSavedCheckout uses. $2.99 stays pinned from
 * SINGLE_DOSSIER (config/pricing.js); this is a relocation of the pitch, never a
 * repricing. (Wave-D captcha is INERT today; when it activates, thread its token
 * here — the same follow-up BuyThisDossier already carries.)
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {string|null} props.saveId  the SAVED settlement id the durable right binds to
 * @param {() => void} props.onClose
 */
export default function ExportUnlockDialog({ open, saveId, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // Pre-launch lockout (lib/launchGate.js): "Continue to checkout" renders disabled
  // and wears the Available at launch pill until purchases open. The pitch and
  // Not now stay as they are.
  const purchasesAreOpen = purchasesOpen();
  const checkoutLabel = busy ? t('dossierExport.buySaved.busy') : t('dossierExport.buySaved.checkout');

  const runCheckout = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await startCheckout('single_dossier', { checkoutToken: createDossierCheckoutToken(), saveId });
      // startCheckout redirects on success; control only returns here on failure.
    } catch (e) {
      setError(e?.message || t('dossierExport.buySaved.error'));
      setBusy(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      tone="default"
      title={t('dossierExport.buySaved.cta', { price: SINGLE_DOSSIER.priceLabel })}
      body={t('dossierExport.buySaved.subline')}
      confirmLabel={purchasesAreOpen ? checkoutLabel : (
        // The label and pill wrap as one unit, so on a phone the pill drops below
        // the label instead of pushing the button past the dialog edge.
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: 4 }}>
          {checkoutLabel}
          <AvailableAtLaunchPill style={{ marginLeft: 6 }} />
        </span>
      )}
      cancelLabel={t('dossierExport.buySaved.dismiss')}
      confirmDisabled={!purchasesAreOpen || busy || !isConfigured}
      onConfirm={runCheckout}
      onCancel={() => { if (!busy) onClose?.(); }}
      extra={error ? <div style={{ marginBottom: 12, fontSize: FS.sm, color: RED, fontFamily: sans }}>{error}</div> : null}
    />
  );
}
