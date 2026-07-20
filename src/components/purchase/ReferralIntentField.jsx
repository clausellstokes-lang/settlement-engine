/**
 * ReferralIntentField.jsx — the optional "Referred by someone?" input shown on
 * the purchase surfaces (PurchaseModal, PricingPage) for a signed-in user with
 * no prior referral and no paid tier.
 *
 * Purely presentational: all state and gating live in useReferralIntent, which
 * the PARENT owns — the parent must also call `referral.recordIntent()` right
 * before `startCheckout` so an intent typed-but-not-submitted still lands.
 * A rejection renders as a quiet inline note and never blocks checkout.
 */

import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
// AMBER is this tree's house warning color (design token `warning` = amber-500);
// it stands in for the incoming tree's AMBER_DEEP (amber-700), which this
// tree's palette does not mint. The note is small inline text, never a fill.
import { INK, SECOND, BORDER, sans, SP, FS, swatch, AMBER } from '../theme.js';

/**
 * @param {object} props
 * @param {ReturnType<import('../../hooks/useReferralIntent.js').useReferralIntent>} props.referral
 * @param {string} [props.idPrefix] — keeps input ids unique when two purchase
 *   surfaces are mounted in the same document (modal over pricing).
 */
export default function ReferralIntentField({ referral, idPrefix = 'purchase' }) {
  if (!referral.eligible) return null;

  const inputId = `${idPrefix}-referrer-account-id`;
  const note = referral.note;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {/* Once the intent is recorded the input collapses to its confirmation —
          there is nothing further to type, and leaving a live-looking field
          up would invite a doomed second submission. */}
      {!referral.recorded && (
        <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* House label idiom (AccountProfileSection): the label WRAPS the
              input and carries htmlFor + id, satisfying both association
              modes the a11y config demands. */}
          <label
            htmlFor={inputId}
            style={{
              display: 'flex', flexDirection: 'column', gap: SP.xs,
              flex: '1 1 200px', minWidth: 200,
              fontSize: FS.xs, fontWeight: 700, color: SECOND,
            }}
          >
            {t('purchase.referredByLabel')}
            <input
              id={inputId}
              aria-label={t('purchase.referredByLabel')}
              value={referral.value}
              onChange={e => referral.setValue(e.target.value)}
              placeholder={t('purchase.referredByPlaceholder')}
              autoComplete="off"
              spellCheck={false}
              style={{
                minHeight: 44,
                padding: `${SP.sm}px ${SP.md}px`,
                border: `1px solid ${BORDER}`,
                fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 400,
              }}
            />
          </label>
          <Button
            variant="secondary"
            size="lg"
            onClick={referral.recordIntent}
            disabled={referral.busy || !referral.value.trim()}
            busy={referral.busy}
          >
            {referral.busy ? t('purchase.referredByRecording') : t('purchase.referredByRecord')}
          </Button>
        </div>
      )}
      {note && (
        <div
          role="status"
          style={{
            fontSize: FS.xs, lineHeight: 1.5, fontFamily: sans,
            color: note.tone === 'ok' ? swatch['#2A7A2A'] : AMBER,
          }}
        >
          {note.text}
        </div>
      )}
    </div>
  );
}
