/**
 * AccountSeatTransferPanel.jsx — Founder seat transfers (DESIGN_MONEY_WAVE §6.4,
 * slice M-6f) in the account Subscription section, beside the auto-reload panel.
 *
 * Self-fetching + component-local (the AccountAutoReloadPanel / Past-purchases idiom):
 * every read and write routes through the founder-transfer edge function via a LAZY
 * import of lib/founderTransferClient.js, so this panel + its data layer add ZERO eager
 * bytes. FLAT MATERIALS (kill-list): rule-framed rows and border-left status accents —
 * no rounded corners / shadows / rgba washes / tinted callouts.
 *
 * States rendered:
 *  · dark (master switch off / unconfigured) → the §12 promise line, no controls.
 *  · incoming (a nominee with a pending invitation) → accept → verify → pay.
 *  · outgoing, live case → the quiet register timeline + abort (+ payout controls
 *    once finalized: Connect onboarding for cash, re-election of a parked election).
 *  · outgoing, no live case (a founder) → the initiate flow (nominee + payout form).
 */
import { useCallback, useEffect, useState } from 'react';
import Section from './AccountSection.jsx';
import Button from '../primitives/Button.jsx';
import { INK, BODY, MUTED, SECOND, BORDER, sans, SP, FS, swatch } from '../theme.js';

const INCOMING_ACTIONABLE = ['initiated', 'nominee_verified', 'awaiting_payment'];
const OUTGOING_LIVE = ['initiated', 'nominee_verified', 'awaiting_payment', 'cooling'];

/** A 44px-tall rule-framed row (the register idiom): a label and its control. */
function Row({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.md,
      minHeight: 44, padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ fontSize: FS.sm, color: INK, fontWeight: 600 }}>{label}</span>
      <span style={{ flexShrink: 0 }}>{children}</span>
    </div>
  );
}

const textInputStyle = {
  width: 220, minHeight: 44, boxSizing: 'border-box',
  padding: `${SP.sm}px ${SP.sm}px`, border: `1px solid ${BORDER}`,
  background: 'transparent', color: INK, fontFamily: sans, fontSize: FS.sm,
};
const codeInputStyle = { ...textInputStyle, width: 140, letterSpacing: '0.3em', textAlign: 'center' };

/**
 * WCAG 4.1.3 Status Messages: danger is an assertive alert; success + muted
 * announce politely, so a screen-reader user hears the positive outcomes of a
 * money action ("code sent", "transfer confirmed", "seat sold back") instead of
 * being stranded mid-purchase — matching AccountAutoReloadPanel's role="status".
 * Exported pure so the a11y-2 regression pin can assert the mapping directly.
 * @param {'danger'|'success'|'muted'} tone
 * @returns {{ role: 'alert'|'status', 'aria-live': 'assertive'|'polite' }}
 */
export function noteAria(tone) {
  return tone === 'danger'
    ? { role: 'alert', 'aria-live': 'assertive' }
    : { role: 'status', 'aria-live': 'polite' };
}

function Note({ children, tone = 'muted' }) {
  const color = tone === 'danger' ? swatch.danger : tone === 'success' ? swatch.success : MUTED;
  const accent = tone === 'danger' ? swatch.danger : SECOND;
  const aria = noteAria(tone);
  return (
    <div
      role={aria.role}
      aria-live={aria['aria-live']}
      style={{ paddingLeft: SP.md, borderLeft: `3px solid ${accent}`, fontSize: FS.xs, color, marginTop: SP.sm, lineHeight: 1.55 }}
    >
      {children}
    </div>
  );
}

/** ISO → "Month D, YYYY, h:mm a"; best-effort, null on parse trouble. */
function when(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch { return null; }
}

const STATE_LABEL = {
  initiated: 'Awaiting the outgoing holder’s confirmation',
  nominee_verified: 'Verified — awaiting payment',
  awaiting_payment: 'Awaiting the $99 payment',
  cooling: 'In the 72-hour review period',
  finalized: 'Completed — the seat has transferred',
};
const PAYOUT_LABEL = {
  none: null,
  scheduled: 'Your $49.50 payout is scheduled',
  releasing: 'Your payout is being released',
  released: 'Your payout has been released',
  held: 'Your payout is on hold',
  failed: 'Your payout could not be completed — contact support',
};

/**
 * BuybackAffordance (§6.8, M-10) — the standing buyback, rendered for a founder with no
 * live transfer case. Self-contained (own availability read + state) so it is INDEPENDENT
 * of the transfer master switch: dark by default (its own founder_buyback switch), it
 * renders nothing until the owner lights it. Challenge-confirmed: start → emailed code →
 * confirm (the seat is released + a payout scheduled at the seat_buyback_cents amount).
 */
function BuybackAffordance({ onDone }) {
  const [available, setAvailable] = useState(null); // null = loading
  const [step, setStep] = useState('idle');         // 'idle' | 'code'
  const [payoutForm, setPayoutForm] = useState('connect_cash');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { fetchBuybackStatus } = await import('../../lib/founderTransferClient.js');
        const { available: avail } = await fetchBuybackStatus();
        if (alive) setAvailable(avail);
      } catch { if (alive) setAvailable(false); }
    })();
    return () => { alive = false; };
  }, []);

  const start = useCallback(async () => {
    setBusy(true); setError(null); setNotice(null);
    try {
      const { buybackStart } = await import('../../lib/founderTransferClient.js');
      await buybackStart();
      setStep('code');
      setNotice('We emailed you a confirmation code.');
    } catch (e) {
      setError(e?.message || 'The buyback could not be started.');
    } finally { setBusy(false); }
  }, []);

  const confirm = useCallback(async () => {
    setBusy(true); setError(null); setNotice(null);
    try {
      const { buybackConfirm } = await import('../../lib/founderTransferClient.js');
      await buybackConfirm({ code: code.trim(), payoutForm });
      setStep('idle'); setCode('');
      setNotice('Your seat has been sold back. Your payout will follow.');
      if (typeof onDone === 'function') await onDone();
    } catch (e) {
      setError(e?.message || 'The buyback could not be completed.');
    } finally { setBusy(false); }
  }, [code, payoutForm, onDone]);

  // Dark by default (own switch) or still loading → render nothing.
  if (available === null || available === false) return null;

  return (
    <div style={{ marginTop: SP.xl }}>
      <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>Sell your seat back</div>
      <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.6, margin: `${SP.xs}px 0 ${SP.sm}px` }}>
        You can sell your Founder seat back to SettlementForge at any time. The seat returns
        to the pool and you receive the standing buyback amount at the payout form you elect.
      </p>
      {step === 'idle' ? (
        <div>
          <Row label="Your payout">
            <select aria-label="Buyback payout form" value={payoutForm}
              onChange={(e) => setPayoutForm(e.target.value)} style={{ ...textInputStyle, width: 220 }}>
              <option value="connect_cash">Cash via Stripe (requires onboarding)</option>
              <option value="account_credits">Account credits</option>
            </select>
          </Row>
          <div style={{ marginTop: SP.md }}>
            <Button variant="secondary" size="md" disabled={busy} onClick={start}>
              {busy ? 'Working…' : 'Sell seat back — email me a code'}
            </Button>
          </div>
          <Note>You’ll confirm with an emailed code. Re-enter your password first if prompted.</Note>
        </div>
      ) : (
        <div>
          <Row label="Confirmation code">
            <input aria-label="Buyback confirmation code" style={codeInputStyle} value={code}
              inputMode="numeric" onChange={(e) => setCode(e.target.value)} />
          </Row>
          <div style={{ marginTop: SP.md }}>
            <Button variant="primary" size="md" disabled={busy || !code} onClick={confirm}>
              {busy ? 'Working…' : 'Confirm sale'}
            </Button>
          </div>
        </div>
      )}
      {error && <Note tone="danger">{error}</Note>}
      {notice && <Note tone="success">{notice}</Note>}
    </div>
  );
}

export default function AccountSeatTransferPanel({ auth }) {
  const signedIn = Boolean(auth?.user?.id);
  const isFounder = Boolean(auth?.isFounder);

  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [cases, setCases] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  // initiate flow
  const [toEmail, setToEmail] = useState('');
  const [payoutForm, setPayoutForm] = useState('connect_cash');
  const [initiateCaseId, setInitiateCaseId] = useState(null); // set once the code is issued
  const [initiateCode, setInitiateCode] = useState('');
  // incoming flow
  const [nomineeCode, setNomineeCode] = useState('');

  const refresh = useCallback(async () => {
    const { fetchTransferStatus } = await import('../../lib/founderTransferClient.js');
    const { cases: rows, available: avail } = await fetchTransferStatus();
    setCases(rows); setAvailable(avail);
  }, []);

  useEffect(() => {
    if (!signedIn) return undefined;
    let alive = true;
    (async () => {
      try { await refresh(); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [signedIn, refresh]);

  const run = useCallback(async (fn, okNotice) => {
    setBusy(true); setError(null); setNotice(null);
    try {
      const out = await fn();
      if (okNotice) setNotice(okNotice);
      await refresh();
      return out;
    } catch (e) {
      setError(e?.message || 'The request could not be completed.');
      return null;
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  if (!signedIn) return null;

  const incoming = cases.find((c) => c.viewer_role === 'incoming' && INCOMING_ACTIONABLE.includes(c.state));
  const outgoing = cases.find((c) => c.viewer_role === 'outgoing' && (OUTGOING_LIVE.includes(c.state) || c.state === 'finalized'));

  // Render nothing for a non-founder with no invitation — this surface is theirs only
  // when they hold a seat or have been offered one.
  if (!isFounder && !incoming) {
    if (loading) return null;
    return null;
  }

  // The buyback affordance is INDEPENDENT of the transfer switch (§6.8): a founder with no
  // live/incoming case can sell their seat back whenever the buyback switch is lit.
  const buybackEligible = isFounder && !incoming && !outgoing;

  return (
    <Section title="Founder seat transfer">
      {loading ? (
        <div style={{ fontSize: FS.sm, color: MUTED, padding: `${SP.sm}px 0` }}>Loading…</div>
      ) : !available ? (
        <>
          {/* KEY-INERT: the transfer master switch is off. Show the promise, not controls. */}
          <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.6, margin: `${SP.xs}px 0 0` }}>
            Founder seats can change hands through the official transfer process. Transfers
            are coming under the published terms.
          </p>
          {buybackEligible && <BuybackAffordance onDone={refresh} />}
        </>
      ) : (
        <div>
          {/* ── Incoming: a nominee with a pending invitation ── */}
          {incoming && (
            <div>
              <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.6, margin: `0 0 ${SP.sm}px` }}>
                You have been offered Founder seat #{incoming.seat_id} for $99, through the
                official transfer process.
              </p>
              {incoming.state === 'initiated' && (
                <Button variant="primary" size="md" disabled={busy}
                  onClick={() => run(async () => {
                    const { nomineeAcceptStart } = await import('../../lib/founderTransferClient.js');
                    return nomineeAcceptStart();
                  }, 'We emailed you a verification code.')}>
                  {busy ? 'Working…' : 'Accept — email me a code'}
                </Button>
              )}
              {(incoming.state === 'nominee_verified' || incoming.state === 'awaiting_payment') && (
                <div>
                  <Row label="Verification code">
                    <input aria-label="Verification code" style={codeInputStyle} value={nomineeCode}
                      inputMode="numeric" onChange={(e) => setNomineeCode(e.target.value)} />
                  </Row>
                  <div style={{ marginTop: SP.md }}>
                    <Button variant="primary" size="md" disabled={busy || !nomineeCode}
                      onClick={() => run(async () => {
                        const { nomineeConfirm } = await import('../../lib/founderTransferClient.js');
                        const out = await nomineeConfirm({ caseId: incoming.case_id, code: nomineeCode.trim() });
                        if (out?.url) window.location.assign(out.url);
                        return out;
                      })}>
                      {busy ? 'Working…' : 'Verify & pay $99'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Outgoing: a live or finalized case → the register timeline ── */}
          {!incoming && outgoing && (
            <div>
              <Row label="Seat">#{outgoing.seat_id}</Row>
              <Row label="Status">{STATE_LABEL[outgoing.state] || outgoing.state}</Row>
              {outgoing.counterparty_email && <Row label="Nominee">{outgoing.counterparty_email}</Row>}
              {outgoing.state === 'cooling' && outgoing.cooling_ends_at && (
                <Row label="Review ends">{when(outgoing.cooling_ends_at)}</Row>
              )}
              {outgoing.state === 'finalized' && PAYOUT_LABEL[outgoing.payout_status] && (
                <Row label="Payout">{PAYOUT_LABEL[outgoing.payout_status]}</Row>
              )}

              {/* Abort is legal from initiated..cooling (a paid case refunds). */}
              {OUTGOING_LIVE.includes(outgoing.state) && (
                <div style={{ marginTop: SP.md }}>
                  <Button variant="secondary" size="md" disabled={busy}
                    onClick={() => run(async () => {
                      const { abortTransfer } = await import('../../lib/founderTransferClient.js');
                      return abortTransfer({ caseId: outgoing.case_id });
                    }, 'The transfer has been stopped.')}>
                    {busy ? 'Working…' : 'Stop this transfer'}
                  </Button>
                </div>
              )}

              {/* Payout controls once finalized: Connect onboarding for a cash election,
                  re-election to credits for a parked ('held') cash payout. */}
              {outgoing.state === 'finalized' && outgoing.payout_form === 'connect_cash'
                && ['scheduled', 'held'].includes(outgoing.payout_status) && (
                <div style={{ display: 'flex', gap: SP.md, flexWrap: 'wrap', marginTop: SP.md }}>
                  <Button variant="primary" size="md" disabled={busy}
                    onClick={() => run(async () => {
                      const { payoutOnboarding } = await import('../../lib/founderTransferClient.js');
                      const out = await payoutOnboarding();
                      if (out?.url) window.location.assign(out.url);
                      return out;
                    })}>
                    {busy ? 'Working…' : 'Set up cash payout (Stripe)'}
                  </Button>
                  {outgoing.payout_status === 'held' && (
                    <Button variant="secondary" size="md" disabled={busy}
                      onClick={() => run(async () => {
                        const { reelectPayout } = await import('../../lib/founderTransferClient.js');
                        return reelectPayout({ caseId: outgoing.case_id });
                      }, 'Your payout will be delivered as account credits.')}>
                      {busy ? 'Working…' : 'Take $49.50 as account credits instead'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Outgoing: a founder with no live case → the initiate flow ── */}
          {!incoming && !outgoing && isFounder && (
            <div>
              <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.6, margin: `0 0 ${SP.sm}px` }}>
                Transfer your Founder seat to another person through the official process:
                a fixed $99 price ($49.50 to you), a 72-hour review period, and verification
                of both parties. This does not move your account, credits, or worlds.
              </p>
              {!initiateCaseId ? (
                <div>
                  <Row label="Nominee’s email">
                    <input aria-label="Nominee’s email" type="email" style={textInputStyle} value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)} placeholder="them@example.com" />
                  </Row>
                  <Row label="Your payout">
                    <select aria-label="Your payout form" value={payoutForm}
                      onChange={(e) => setPayoutForm(e.target.value)}
                      style={{ ...textInputStyle, width: 220 }}>
                      <option value="connect_cash">Cash via Stripe (requires onboarding)</option>
                      <option value="account_credits">Account credits ($49.50)</option>
                    </select>
                  </Row>
                  <div style={{ marginTop: SP.md }}>
                    <Button variant="primary" size="md" disabled={busy || !toEmail}
                      onClick={() => run(async () => {
                        const { initiateTransfer } = await import('../../lib/founderTransferClient.js');
                        const out = await initiateTransfer({ toEmail: toEmail.trim().toLowerCase(), payoutForm });
                        if (out?.case_id) setInitiateCaseId(out.case_id);
                        return out;
                      }, 'We emailed you a confirmation code.')}>
                      {busy ? 'Working…' : 'Begin transfer — email me a code'}
                    </Button>
                  </div>
                  <Note>You’ll confirm with an emailed code. Re-enter your password first if prompted.</Note>
                </div>
              ) : (
                <div>
                  <Row label="Confirmation code">
                    <input aria-label="Confirmation code" style={codeInputStyle} value={initiateCode}
                      inputMode="numeric" onChange={(e) => setInitiateCode(e.target.value)} />
                  </Row>
                  <div style={{ marginTop: SP.md }}>
                    <Button variant="primary" size="md" disabled={busy || !initiateCode}
                      onClick={() => run(async () => {
                        const { confirmInitiate } = await import('../../lib/founderTransferClient.js');
                        const out = await confirmInitiate({ caseId: initiateCaseId, code: initiateCode.trim() });
                        setInitiateCaseId(null); setInitiateCode(''); setToEmail('');
                        return out;
                      }, 'Confirmed. We’ve emailed your nominee their invitation.')}>
                      {busy ? 'Working…' : 'Confirm'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* The standing buyback — independent switch; only for a founder with no case. */}
          {buybackEligible && <BuybackAffordance onDone={refresh} />}

          {error && <Note tone="danger">{error}</Note>}
          {notice && <Note tone="success">{notice}</Note>}
        </div>
      )}
    </Section>
  );
}
