/**
 * AdminOperationalHealthPanel.jsx — the operator view over durable external
 * obligations (migration 182).
 *
 * Account erasure, payment refunds, and Stripe webhook deliveries each have a
 * different worker and lifecycle. This panel intentionally does not flatten
 * those domains into one mutation API: it reads the shared aggregate/attention
 * projection and can add or clear an acknowledgement overlay. Acknowledging an
 * item never retries, cancels, resolves, or hides it; only its authoritative
 * worker can make the row leave this surface.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import Button from '../primitives/Button.jsx';
import {
  BODY,
  BORDER,
  CARD_HDR,
  FS,
  GOLD_TXT,
  GREEN,
  INK,
  MUTED,
  RED,
  SP,
  sans,
} from '../theme.js';

const SOURCE_LABEL = Object.freeze({
  account_deletion: 'Account deletion',
  payment_refund: 'Payment refund',
  stripe_webhook: 'Stripe webhook',
});

const SEVERITY_COLOR = Object.freeze({
  healthy: GREEN,
  warning: GOLD_TXT,
  critical: RED,
});

const TABLE_CELL_STYLE = Object.freeze({
  padding: `${SP.xs}px ${SP.sm}px`,
  borderBottom: `1px solid ${BORDER}`,
  color: BODY,
});

const ACKNOWLEDGEMENT_CELL_STYLE = Object.freeze({
  ...TABLE_CELL_STYLE,
  minWidth: 260,
});

/** @param {unknown} value @returns {number} */
function finiteCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

/** @param {unknown} seconds @returns {string} */
function ageLabel(seconds) {
  const value = finiteCount(seconds);
  if (value < 60) return `${value}s`;
  if (value < 3600) return `${Math.floor(value / 60)}m`;
  if (value < 86400) return `${Math.floor(value / 3600)}h`;
  return `${Math.floor(value / 86400)}d`;
}

function QueueSummary({ label, facts }) {
  const visibleFacts = Object.entries(facts || {})
    .filter(([, value]) => typeof value === 'number' && value > 0);
  return (
    <div style={{
      padding: `${SP.sm}px 0`,
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <div style={{
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 700,
        color: INK,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, marginTop: 4 }}>
        {visibleFacts.length === 0 ? (
          <span style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED }}>
            No active obligations.
          </span>
        ) : visibleFacts.map(([key, value]) => (
          <span key={key} style={{ fontFamily: sans, fontSize: FS.xs, color: BODY }}>
            {key.replace(/([A-Z])/g, ' $1').toLowerCase()} {finiteCount(value)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminOperationalHealthPanel() {
  const [health, setHealth] = useState(null);
  const [attention, setAttention] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'admin-actions',
        { body: { action: 'get_operational_health' } },
      );
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      setHealth(data?.health && typeof data.health === 'object'
        ? data.health
        : null);
      setAttention(Array.isArray(data?.attention) ? data.attention : []);
      setRefreshedAt(data?.refreshedAt || null);
    } catch (loadError) {
      setHealth(null);
      setAttention([]);
      setError(loadError?.message || 'Operational health could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  // One operator read on mount; refresh remains explicit and repeatable.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const acknowledge = useCallback(async (item, clear) => {
    const key = `${item.source}:${item.obligation_key}`;
    setBusyKey(key);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'admin-actions',
        {
          body: {
            action: 'acknowledge_operational_obligation',
            obligationSource: item.source,
            obligationKey: item.obligation_key,
            note: clear ? null : (notes[key] || '').trim() || null,
            clear,
          },
        },
      );
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      await load();
    } catch (ackError) {
      setError(ackError?.message || 'Acknowledgement could not be recorded.');
    } finally {
      setBusyKey(null);
    }
  }, [load, notes]);

  const severity = health?.severity || 'unknown';

  return (
    <section aria-label="Operational obligation health">
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: SP.sm,
      }}>
        <div>
          <span style={{
            color: SEVERITY_COLOR[severity] || MUTED,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {severity}
          </span>
          <span style={{
            marginLeft: SP.sm,
            color: MUTED,
            fontFamily: sans,
            fontSize: FS.xs,
          }}>
            Acknowledged work remains active until its worker completes it.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          {refreshedAt && (
            <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
              refreshed {new Date(refreshedAt).toLocaleString('en-US')}
            </span>
          )}
          <Button variant="ghost" size="sm" busy={loading} onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            margin: `${SP.sm}px 0`,
            color: RED,
            fontFamily: sans,
            fontSize: FS.sm,
          }}
        >
          {error}
        </p>
      )}

      {health && (
        <div style={{ marginTop: SP.sm }}>
          <QueueSummary
            label="Account deletion"
            facts={health.accountDeletion}
          />
          <QueueSummary
            label="Payment refund"
            facts={health.paymentRefund}
          />
          <QueueSummary
            label="Stripe webhook"
            facts={health.stripeWebhook}
          />
        </div>
      )}

      {!loading && !error && health && attention.length === 0 && (
        <p style={{
          margin: `${SP.sm}px 0 0`,
          color: MUTED,
          fontFamily: sans,
          fontSize: FS.sm,
        }}>
          No obligation currently needs operator attention.
        </p>
      )}

      {attention.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: SP.md }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: sans,
            fontSize: FS.xs,
          }}>
            <caption style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}>
              Durable obligations that need operator attention
            </caption>
            <thead>
              <tr style={{ background: CARD_HDR }}>
                {['Source', 'State', 'Reason', 'Age', 'Attempts', 'Acknowledgement'].map((column) => (
                  <th
                    key={column}
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: `${SP.xs}px ${SP.sm}px`,
                      borderBottom: `1px solid ${BORDER}`,
                      color: INK,
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attention.map((item) => {
                const key = `${item.source}:${item.obligation_key}`;
                const acknowledged = Boolean(item.acknowledged_at);
                return (
                  <tr key={key}>
                    <td style={TABLE_CELL_STYLE}>
                      {SOURCE_LABEL[item.source] || item.source}
                    </td>
                    <td style={TABLE_CELL_STYLE}>
                      {item.status}
                    </td>
                    <td style={TABLE_CELL_STYLE}>
                      {String(item.reason || '').replaceAll('_', ' ')}
                    </td>
                    <td style={TABLE_CELL_STYLE}>
                      {ageLabel(item.age_seconds)}
                    </td>
                    <td style={TABLE_CELL_STYLE}>
                      {finiteCount(item.attempts)}
                    </td>
                    <td style={ACKNOWLEDGEMENT_CELL_STYLE}>
                      {acknowledged ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: SP.sm,
                          flexWrap: 'wrap',
                        }}>
                          <span style={{ color: BODY }}>
                            Seen{item.acknowledgement_note ? `: ${item.acknowledgement_note}` : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            busy={busyKey === key}
                            onClick={() => acknowledge(item, true)}
                          >
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
                          <input
                            aria-label={
                              `Operator note for ${SOURCE_LABEL[item.source] || item.source}`
                            }
                            value={notes[key] || ''}
                            maxLength={1000}
                            onChange={(event) => setNotes((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }))}
                            placeholder="Optional note"
                            style={{
                              flex: 1,
                              minWidth: 120,
                              border: `1px solid ${BORDER}`,
                              padding: `${SP.xs}px`,
                              color: INK,
                              fontFamily: sans,
                              fontSize: FS.xs,
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            busy={busyKey === key}
                            onClick={() => acknowledge(item, false)}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
