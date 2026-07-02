/**
 * RedeemCodeField.jsx — the inline "Have a code?" disclosure on the purchase
 * surfaces (PurchaseModal, PricingPage).
 *
 * Deliberately dumb: no client-side validation. The code is advisory input the
 * PARENT passes into `startCheckout(product, { redeemCode })`; create-checkout
 * re-validates and reserves it server-side, and a code that does not apply
 * comes back as a non-fatal `redeemNotice` while checkout proceeds at the
 * regular price. The Account page's redeem block (which DOES pre-validate via
 * RPC) feeds this field through the pending-code handoff.
 */

import { useState } from 'react';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import { INK, BODY, SECOND, BORDER, sans, SP, R, FS } from '../theme.js';

/**
 * @param {object} props
 * @param {string} props.code — controlled value, owned by the parent.
 * @param {(code: string) => void} props.onChange
 * @param {string} [props.idPrefix]
 */
export default function RedeemCodeField({ code, onChange, idPrefix = 'purchase' }) {
  // Opens pre-expanded when a code arrived via the Account-page handoff, so
  // the rider is visible rather than silently attached.
  const [open, setOpen] = useState(Boolean(code));
  const inputId = `${idPrefix}-redeem-code`;

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        style={{ alignSelf: 'flex-start', minHeight: 44, color: SECOND }}
      >
        {t('purchase.haveCode')}
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {/* House label idiom (AccountProfileSection): the label WRAPS the input
          and carries htmlFor + id, satisfying both association modes the a11y
          config demands. */}
      <label
        htmlFor={inputId}
        style={{
          display: 'flex', flexDirection: 'column', gap: SP.xs,
          fontSize: FS.xs, fontWeight: 700, color: SECOND,
        }}
      >
        {t('purchase.codeLabel')}
        <input
          id={inputId}
          aria-label={t('purchase.codeLabel')}
          value={code}
          onChange={e => onChange(e.target.value)}
          placeholder={t('purchase.codePlaceholder')}
          autoComplete="off"
          spellCheck={false}
          style={{
            minHeight: 44, maxWidth: 280,
            padding: `${SP.sm}px ${SP.md}px`,
            border: `1px solid ${BORDER}`, borderRadius: R.md,
            fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 400,
          }}
        />
      </label>
      {Boolean(code.trim()) && (
        <div role="status" style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, fontFamily: sans }}>
          {t('purchase.codeAttached')}
        </div>
      )}
    </div>
  );
}
