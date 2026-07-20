/**
 * AdminClientErrorsPanel.jsx — owner-facing read view over client crash reports
 * (client_error_events, migration 081). Mirrors AdminAnalyticsPanel: calls the
 * admin-actions `get_client_error_dashboard` action, which dispatches to the two
 * fixed migration-167 SECURITY DEFINER reads (report_client_errors +
 * report_client_error_alert). The privilege gate is server-side in admin-actions;
 * this is read-only.
 *
 * Two surfaces: an ALWAYS-VISIBLE alert banner (distinct error signatures in the
 * last hour vs. the threshold — the ops-alert signal, shown here even when the
 * grouped table below is empty) and the grouped-by-signature crash table.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import { INK, MUTED, SECOND, BORDER, CARD_HDR, sans, serif_, SP, FS, swatch } from '../theme.js';

const COLUMNS = [
  { key: 'signature', label: 'Signature' },
  { key: 'kind', label: 'Kind' },
  { key: 'event_count', label: 'Count' },
  { key: 'last_seen', label: 'Last seen' },
  { key: 'sample_message', label: 'Sample message' },
  { key: 'sample_url', label: 'URL' },
  { key: 'releases', label: 'Releases' },
];

function fmt(col, value) {
  if (value == null) return '—';
  if (col === 'last_seen') return new Date(value).toLocaleString('en-US');
  return String(value);
}

export default function AdminClientErrorsPanel() {
  const [rows, setRows] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data, error: err } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'get_client_error_dashboard' },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setAlert(data?.alert || null);
      setRefreshedAt(data?.refreshedAt || null);
    } catch (e) {
      setError(e?.message || 'Failed to load client errors');
      setRows([]); setAlert(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Data-load effect: load() sets loading/rows on mount. Intentional.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const over = alert?.over_threshold === true;

  // Renders inside AdminPanel's "Analytics & errors" <Section> beneath the
  // analytics dashboards, so it carries its own <h3> delimiter (a rule-topped
  // heading, not a native title= tooltip) rather than a second Section frame.
  return (
    <section aria-label="Client error reports">
      <h3 style={{ margin: `${SP.lg}px 0 ${SP.sm}px`, paddingTop: SP.md, borderTop: `1px solid ${BORDER}`, fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK }}>
        Client errors
      </h3>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', flexWrap: 'wrap', gap: SP.sm }}>
        {refreshedAt && <span style={{ fontSize: FS.xs, color: MUTED }}>refreshed {new Date(refreshedAt).toLocaleString('en-US')}</span>}
      </div>

      {/* Always-visible alert banner (the ops threshold signal). Rule-framed
          plate (left rule, no tint, no radius) per the deep-craft idiom — the
          over-threshold state reads in the oxblood rule + ink, not a wash. */}
      {alert && (
        <div
          role={over ? 'alert' : undefined}
          style={{
            margin: `${SP.sm}px 0`,
            padding: `${SP.xs}px ${SP.md}px`,
            fontFamily: sans,
            fontSize: FS.sm,
            borderLeft: `3px solid ${over ? swatch.danger : BORDER}`,
            color: over ? swatch.danger : SECOND,
          }}
        >
          <strong>{over ? 'Alert: ' : ''}</strong>
          {alert.distinct_signatures} distinct error signature{Number(alert.distinct_signatures) === 1 ? '' : 's'}
          {' '}({alert.total_events} event{Number(alert.total_events) === 1 ? '' : 's'}) in the last {alert.window_minutes} min
          {' — '}
          {over
            ? `over the alert threshold of ${alert.threshold}.`
            : `under the alert threshold of ${alert.threshold}.`}
        </div>
      )}

      {loading && <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>Loading…</p>}
      {error && <p style={{ fontSize: FS.sm, color: swatch.danger, fontFamily: sans }}>Couldn’t load: {error}. (Needs migrations 081 + 156 deployed.)</p>}
      {!loading && !error && rows.length === 0 && (
        <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>No client errors in the selected window.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: sans, fontSize: FS.xs }}>
            <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              Client error reports grouped by signature
            </caption>
            <thead>
              <tr style={{ background: CARD_HDR }}>
                {COLUMNS.map(c => (
                  <th key={c.key} scope="col" style={{ textAlign: 'left', padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: INK, fontWeight: 700, whiteSpace: 'nowrap' }}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 200).map((row, i) => (
                <tr key={i}>
                  {COLUMNS.map(c => (
                    <td key={c.key} style={{ padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: SECOND, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: c.key === 'sample_message' ? 'normal' : 'nowrap' }}>
                      {fmt(c.key, row[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
