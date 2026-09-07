/**
 * AccountPurchaseHistoryPanel.jsx — the "Past purchases" ledger (DESIGN_MONEY_WAVE
 * §3 / #14) for the account Subscription section.
 *
 * Self-fetching + purely local state (the FounderTile idiom): reads OUR
 * money_events table through the owner-SELECT RLS policy via a LAZY import of
 * lib/purchaseHistory.js, so this panel + its data layer add ZERO eager bytes
 * (the account route is already lazy). No client Stripe calls.
 *
 * FLAT MATERIALS (organic-craft / kill-list): rule-framed rows, no rounded
 * corners, no drop shadows, no rgba washes, no tinted callouts — ink tones from
 * the ramp, refund/dispute status shown plainly in danger ink.
 */
import { useCallback, useEffect, useState } from 'react';
import Section from './AccountSection.jsx';
import Button from '../primitives/Button.jsx';
import { INK, BODY, MUTED, SECOND, BORDER, SP, FS, swatch } from '../theme.js';

const COL_DATE = '0 0 92px';
const COL_AMOUNT = '0 0 84px';
const COL_RECEIPT = '0 0 68px';

export default function AccountPurchaseHistoryPanel({ auth }) {
  const signedIn = Boolean(auth?.user?.id);
  const [rows, setRows] = useState(null);      // null = loading; [] = loaded/empty
  const [hasMore, setHasMore] = useState(false);
  const [nextBefore, setNextBefore] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Signed-out renders null anyway (below); don't fetch. fetchPurchaseHistory
    // itself fails closed to empty when the backend isn't configured, so all
    // setState happens inside the async callback (never synchronously in the
    // effect body).
    if (!signedIn) return undefined;
    let alive = true;
    (async () => {
      try {
        const { fetchPurchaseHistory } = await import('../../lib/purchaseHistory.js');
        const res = await fetchPurchaseHistory({});
        if (!alive) return;
        setRows(res.rows);
        setHasMore(res.hasMore);
        setNextBefore(res.nextBefore);
      } catch {
        if (alive) { setRows([]); setFailed(true); }
      }
    })();
    return () => { alive = false; };
  }, [signedIn]);

  const showEarlier = useCallback(async () => {
    if (!nextBefore || loadingMore) return;
    setLoadingMore(true);
    try {
      const { fetchPurchaseHistory } = await import('../../lib/purchaseHistory.js');
      const res = await fetchPurchaseHistory({ before: nextBefore });
      setRows((prev) => [...(prev || []), ...res.rows]);
      setHasMore(res.hasMore);
      setNextBefore(res.nextBefore);
    } catch {
      setFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }, [nextBefore, loadingMore]);

  // Nothing to show a signed-out visitor.
  if (!signedIn) return null;

  return (
    <Section title="Past purchases">
      {rows === null ? (
        <div style={{ fontSize: FS.sm, color: MUTED, padding: `${SP.sm}px 0` }}>Loading your purchases…</div>
      ) : rows.length === 0 ? (
        <div style={{ fontSize: FS.sm, color: MUTED, padding: `${SP.sm}px 0` }}>
          {failed ? "Couldn't load your purchases just now." : 'No purchases yet.'}
        </div>
      ) : (
        <div role="table" aria-label="Past purchases">
          <div
            role="row"
            style={{
              display: 'flex', gap: SP.md, padding: `${SP.xs}px 0`,
              borderBottom: `1px solid ${BORDER}`,
              fontSize: FS.xxs, fontWeight: 700, color: MUTED,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            <span role="columnheader" style={{ flex: COL_DATE }}>Date</span>
            <span role="columnheader" style={{ flex: 1, minWidth: 0 }}>Item</span>
            <span role="columnheader" style={{ flex: COL_AMOUNT, textAlign: 'right' }}>Amount</span>
            <span role="columnheader" style={{ flex: COL_RECEIPT, textAlign: 'right' }}>Receipt</span>
          </div>
          {rows.map((r) => {
            const reversed = r.status === 'refunded' || r.status === 'reversed';
            return (
              <div
                key={r.id}
                role="row"
                style={{
                  display: 'flex', gap: SP.md, alignItems: 'baseline',
                  padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}`,
                  fontSize: FS.sm, color: INK,
                }}
              >
                <span role="cell" style={{ flex: COL_DATE, color: BODY, fontSize: FS.xs }}>{r.dateLabel}</span>
                <span role="cell" style={{ flex: 1, minWidth: 0 }}>
                  {r.label}
                  {r.status !== 'paid' && (
                    <span style={{
                      marginLeft: SP.xs, fontSize: FS.xxs, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em', color: swatch.danger,
                    }}>
                      {r.status}
                    </span>
                  )}
                </span>
                <span
                  role="cell"
                  style={{
                    flex: COL_AMOUNT, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    textDecoration: reversed ? 'line-through' : 'none',
                    color: r.status === 'paid' ? INK : MUTED,
                  }}
                >
                  {r.amountLabel}
                </span>
                <span role="cell" style={{ flex: COL_RECEIPT, textAlign: 'right' }}>
                  {r.receiptUrl ? (
                    <a
                      href={r.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: FS.xs, color: SECOND, textDecoration: 'underline' }}
                    >
                      Receipt
                    </a>
                  ) : (
                    <span style={{ fontSize: FS.xs, color: MUTED }} aria-hidden="true">–</span>
                  )}
                </span>
              </div>
            );
          })}
          {hasMore && (
            <div style={{ marginTop: SP.md }}>
              <Button variant="secondary" size="sm" onClick={showEarlier} disabled={loadingMore}>
                {loadingMore ? 'Loading…' : 'Show earlier'}
              </Button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
