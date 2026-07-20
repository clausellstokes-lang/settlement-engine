/**
 * ReferralRedeemBlocks.jsx — the two referral/redeem blocks of the Account
 * page's Subscription section (migration 107).
 *
 *   1. ReferralCard — shows the user's own account ID (the immutable SF-XXXXXXX
 *      handle from migration 075) with copy-to-clipboard, plus the one-line
 *      pitch. Founders get the credits variant of the line (a free month is
 *      worthless against a lifetime seat). OURS does not carry account_number in
 *      auth state, so the card fetches it once via authService.getAccountNumber().
 *   2. RedeemBlock — a single input + Apply that pre-validates a code via the
 *      read-only `validate_redeem_code` RPC for instant feedback, then stashes
 *      the accepted code in the pending handoff so it rides along on the next
 *      checkout (the purchase surfaces read it back). Validation here is a
 *      courtesy; create-checkout re-validates and reserves authoritatively.
 *
 * Self-contained on purpose: unlike the sibling section content these blocks
 * own their local state (copy feedback, validation round-trip) rather than
 * threading it through AccountPage — nothing here is shared page state.
 */

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { t } from '../../copy/index.js';
import { isConfigured } from '../../lib/supabase.js';
import { auth as authService } from '../../lib/auth.js';
import { validateRedeemCode, setPendingRedeemCode, clearPendingRedeemCode } from '../../lib/referralRedeem.js';
import Button from '../primitives/Button.jsx';
import {
  GOLD_BG, GOLD_TXT, INK, BODY, SECOND, BORDER, sans, SP, FS, swatch, AMBER_DEEP } from '../theme.js';
import { TINT_GOLD, TINT_VIOLET } from './accountTheme.js';

// Matches the "Purchase Credits" block-label idiom in the parent section.
const BLOCK_LABEL = {
  display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md,
  fontSize: FS.xs, fontWeight: 700, color: SECOND,
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

/**
 * Referral pitch + the reader's own account ID with copy-to-clipboard.
 * @param {object} props
 * @param {{ isFounder: boolean }} props.auth
 */
export function ReferralCard({ auth }) {
  const [copied, setCopied] = useState(false);
  // OURS doesn't thread account_number through auth state (THEIRS does), so the
  // card fetches the caller's own immutable handle once. null = still loading.
  const [accountNumber, setAccountNumber] = useState(null);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => {
    let alive = true;
    authService.getAccountNumber()
      .then((n) => { if (alive) setAccountNumber(n || ''); })
      .catch(() => { if (alive) setAccountNumber(''); });
    return () => { alive = false; };
  }, []);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, http) — the ID stays visible and
      // selectable in the chip, so there is nothing further to surface.
    }
  }

  return (
    <div style={{ marginTop: SP.lg }}>
      <div style={BLOCK_LABEL}>{t('account.referralLabel')}</div>
      <div style={{
        background: GOLD_BG, padding: SP.lg,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        <span style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.55, fontFamily: sans }}>
          {auth.isFounder ? t('account.referralBodyFounder') : t('account.referralBody')}
        </span>
        {accountNumber ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
            {/* data-allow-copy: the copy-guard exempts this chip so the ID can
                also be selected by hand if the clipboard API is blocked. */}
            <span
              data-allow-copy
              style={{
                padding: `${SP.xs}px ${SP.sm}px`,
                background: TINT_GOLD, color: GOLD_TXT,
                border: `1px solid ${BORDER}`,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: FS.sm, fontWeight: 700, letterSpacing: '0.04em',
              }}
            >
              {accountNumber}
            </span>
            <Button
              variant="secondary"
              size="md"
              icon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={copyId}
              aria-label={t('account.referralCopy')}
              style={{ minHeight: 44 }}
            >
              {copied ? t('account.referralCopied') : t('account.referralCopy')}
            </Button>
          </div>
        ) : (
          <span style={{ fontSize: FS.xs, color: SECOND }}>{t('account.referralNoId')}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Redeem-code input: validate for instant feedback, stash on success, and
 * offer the jump to Pricing with the code pre-attached.
 * @param {object} props
 * @param {() => void} props.onNavigatePricing
 */
export function RedeemBlock({ onNavigatePricing }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState(null); // { tone: 'ok'|'warn', text }
  const [accepted, setAccepted] = useState(false);

  function onCodeChange(v) {
    setCode(v);
    // Editing after an acceptance invalidates it — the stash must only ever
    // hold a code the validator actually accepted.
    if (accepted) {
      setAccepted(false);
      setNote(null);
      clearPendingRedeemCode();
    }
  }

  async function apply(e) {
    e.preventDefault();
    const v = code.trim();
    if (!v || checking) return;
    if (!isConfigured) {
      setNote({ tone: 'warn', text: t('account.redeemUnavailable') });
      return;
    }
    setChecking(true);
    setNote(null);
    try {
      const res = await validateRedeemCode(v);
      if (res.valid) {
        setPendingRedeemCode(v);
        setAccepted(true);
        setNote({ tone: 'ok', text: t('account.redeemValid') });
      } else if (res.reason === 'already_used') {
        setAccepted(false);
        setNote({ tone: 'warn', text: t('account.redeemAlreadyUsed') });
      } else {
        // unknown / inactive / expired / exhausted all read the same on
        // purpose (anti-enumeration, mirroring the RPC's collapse).
        setAccepted(false);
        setNote({ tone: 'warn', text: t('account.redeemInvalid') });
      }
    } catch {
      setNote({ tone: 'warn', text: t('account.redeemCheckFailed') });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div style={{ marginTop: SP.lg }}>
      <div style={BLOCK_LABEL}>{t('account.redeemLabel')}</div>
      <div style={{
        background: TINT_VIOLET, padding: SP.lg,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        <span style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>
          {t('account.redeemHint')}
        </span>
        <form onSubmit={apply} style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            aria-label={t('account.redeemLabel')}
            value={code}
            onChange={e => onCodeChange(e.target.value)}
            placeholder={t('account.redeemPlaceholder')}
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: '1 1 180px', minWidth: 180, minHeight: 44,
              padding: `${SP.sm}px ${SP.md}px`,
              border: `1px solid ${BORDER}`,
              fontSize: FS.sm, fontFamily: sans, color: INK,
            }}
          />
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={checking || !code.trim()}
            busy={checking}
            style={{ minHeight: 44 }}
          >
            {checking ? t('account.redeemChecking') : t('account.redeemApply')}
          </Button>
        </form>
        {note && (
          <div
            role="status"
            style={{
              fontSize: FS.xs, lineHeight: 1.5, fontFamily: sans,
              color: note.tone === 'ok' ? swatch['#2A7A2A'] : AMBER_DEEP,
            }}
          >
            {note.text}
          </div>
        )}
        {accepted && (
          <Button
            variant="secondary"
            size="md"
            trailingIcon={<ArrowRight size={14} />}
            onClick={onNavigatePricing}
            style={{ alignSelf: 'flex-start', minHeight: 44 }}
          >
            {t('account.redeemChoosePurchase')}
          </Button>
        )}
      </div>
    </div>
  );
}
