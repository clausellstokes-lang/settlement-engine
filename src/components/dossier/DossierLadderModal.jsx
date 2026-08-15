/**
 * DossierLadderModal.jsx — the anonymous pre-checkout ladder (migration 108).
 *
 * Shown when an ANONYMOUS visitor clicks "Buy this dossier". Rather than sending
 * them straight to the one-time Stripe checkout, it offers the three rungs of
 * the export ladder in calm, plain terms:
 *
 *   1. Create a free account — save this settlement, then buy its PDF once and
 *      keep re-downloading it. (Routes to the existing auth flow.)
 *   2. Consider Cartographer — unlimited PDFs of every saved settlement.
 *      (Routes to the Pricing page.)
 *   3. Continue with the one-time download — pay $2.99 once, download now.
 *      (Runs the UNCHANGED anonymous single-dossier checkout.)
 *
 * VOICE / PRODUCT RULE: the one-time option is presented AS one-time. We do NOT
 * promise the same-device retro auto-upgrade here — it is a grace that depends on
 * the browser keeping the purchase stash, so promising it would be dishonest.
 *
 * A11y: house dialog semantics (role=dialog, aria-modal), the shared focus trap
 * (focus-in, Tab cycle, Escape, restore), and 44px-minimum touch targets on all
 * three routes plus Cancel.
 */

import {
  BODY, BORDER, CARD, CARD_ALT, ELEV, FS, INK, SP, sans } from '../theme.js';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/index.js';
import { SINGLE_DOSSIER, TIERS } from '../../config/pricing.js';

const CARTOGRAPHER_PRICE = `$${(TIERS.cartographer.priceCents / 100).toFixed(2)}`;

/**
 * @param {object} props
 * @param {() => void} props.onClose        — dismiss (Cancel / Escape / backdrop).
 * @param {() => void} props.onCreateAccount — route to the auth flow.
 * @param {() => void} props.onCartographer  — route to the Pricing page.
 * @param {() => void} props.onOneTime        — run the anonymous one-time checkout.
 * @param {boolean} [props.busy]              — one-time checkout redirect in flight.
 */
export default function DossierLadderModal({ onClose, onCreateAccount, onCartographer, onOneTime, busy = false }) {
  const dialogRef = useDialogFocusTrap(true, onClose);

  const rungs = [
    {
      id: 'account',
      label: t('dossierExport.ladder.account.label'),
      description: t('dossierExport.ladder.account.description'),
      onClick: onCreateAccount,
      variant: 'gold',
    },
    {
      id: 'cartographer',
      label: t('dossierExport.ladder.cartographer.label'),
      description: t('dossierExport.ladder.cartographer.description', { price: CARTOGRAPHER_PRICE }),
      onClick: onCartographer,
      variant: 'secondary',
    },
    {
      id: 'oneTime',
      label: t('dossierExport.ladder.oneTime.label'),
      description: t('dossierExport.ladder.oneTime.description', { price: SINGLE_DOSSIER.priceLabel }),
      onClick: onOneTime,
      variant: 'secondary',
      busy,
    },
  ];

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: SP.lg, background: 'rgba(27,20,8,0.46)',
      }}
      onMouseDown={event => { if (event.target === event.currentTarget) onClose?.(); }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-ladder-title"
        tabIndex={-1}
        style={{
          width: 'min(100%, 460px)', maxHeight: 'min(90vh, 680px)', overflow: 'auto',
          border: `1px solid ${BORDER}`,
          background: CARD, boxShadow: ELEV[3], fontFamily: sans,
        }}
      >
        <header style={{ padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`, background: CARD_ALT }}>
          <h2 id="dossier-ladder-title" style={{ margin: 0, color: INK, fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900 }}>
            {t('dossierExport.ladder.title')}
          </h2>
          <p style={{ margin: `${SP.xs}px 0 0`, color: BODY, fontSize: FS.sm, lineHeight: 1.45 }}>
            {t('dossierExport.ladder.intro')}
          </p>
        </header>

        <div style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {rungs.map(rung => (
            <Button
              key={rung.id}
              type="button"
              variant={rung.variant}
              size="md"
              busy={rung.busy}
              onClick={rung.onClick}
              fullWidth
              data-rung={rung.id}
              // A rung is a rich two-line choice, so override the primitive's
              // centered single-line layout: top-aligned icon, left-aligned
              // label + description, wrapping text, 44px minimum.
              style={{
                justifyContent: 'flex-start', alignItems: 'flex-start',
                minHeight: 44, padding: SP.md, whiteSpace: 'normal', textAlign: 'left',
                fontWeight: 700,
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: FS.sm, fontWeight: 900, color: INK }}>
                  {rung.busy ? t('dossierExport.buySaved.busy') : rung.label}
                </span>
                <span style={{ display: 'block', marginTop: SP.xs, fontSize: FS.xs, color: BODY, lineHeight: 1.45, fontWeight: 500 }}>
                  {rung.description}
                </span>
              </span>
            </Button>
          ))}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'flex-end', padding: `0 ${SP.lg}px ${SP.lg}px` }}>
          <Button type="button" variant="ghost" size="md" onClick={onClose} style={{ minHeight: 44 }}>
            {t('dossierExport.ladder.cancel')}
          </Button>
        </footer>
      </section>
    </div>
  );
}
