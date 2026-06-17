/**
 * AdminAnalyticsPanel.jsx — owner-facing read view over the first-party analytics
 * dashboards (doc §9). Self-contained (mirrors GalleryModerationPanel): calls the
 * admin-actions `get_analytics_dashboard` action, which dispatches to the fixed
 * report_* SECURITY DEFINER functions (migration 038). The privilege gate is
 * server-side in admin-actions; this is read-only.
 *
 * Generic table render so all five dashboards (funnel / preferences / edit_heatmap
 * / ai_usage / retention) work from one component — columns come from the rows.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import { INK, MUTED, SECOND, BORDER, CARD, CARD_HDR, sans, serif_, SP, R, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DASHBOARDS = [
  { id: 'funnel', label: 'First-gen funnel' },
  { id: 'preferences', label: 'Settlement preferences' },
  { id: 'edit_heatmap', label: 'Edit heatmap' },
  { id: 'ai_usage', label: 'AI usage' },
  { id: 'retention', label: 'Retention' },
];

export default function AdminAnalyticsPanel() {
  const [dashboard, setDashboard] = useState('funnel');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);

  const load = useCallback(async (which) => {
    setLoading(true); setError(null);
    try {
      const { data, error: err } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'get_analytics_dashboard', dashboard: which },
      });
      if (err) throw err;
      if (data?.error) throw new Error(data.error);
      setRows(Array.isArray(data?.rows) ? data.rows : []);
      setRefreshedAt(data?.refreshedAt || null);
    } catch (e) {
      setError(e?.message || 'Failed to load dashboard');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(dashboard); }, [dashboard, load]);

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <section aria-label="Analytics dashboards" style={{
      border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, padding: SP.lg, marginTop: SP.lg,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: SP.sm }}>
        <h3 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: 0 }}>Analytics</h3>
        {refreshedAt && <span style={{ fontSize: FS.xs, color: MUTED }}>refreshed {new Date(refreshedAt).toLocaleString()}</span>}
      </div>

      <div role="tablist" aria-label="Dashboard" style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs, margin: `${SP.sm}px 0` }}>
        {DASHBOARDS.map(d => {
          const active = d.id === dashboard;
          return (
            <Button
              key={d.id} type="button" role="tab" aria-selected={active}
              variant={active ? 'gold' : 'ghost'} size="sm"
              onClick={() => setDashboard(d.id)}
            >
              {d.label}
            </Button>
          );
        })}
      </div>

      {loading && <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>Loading…</p>}
      {error && <p style={{ fontSize: FS.sm, color: swatch.danger, fontFamily: sans }}>Couldn’t load: {error}. (Needs migrations 036–038 deployed.)</p>}
      {!loading && !error && rows.length === 0 && (
        <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>No data yet for this dashboard.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: sans, fontSize: FS.xs }}>
            <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              {DASHBOARDS.find(d => d.id === dashboard)?.label} data
            </caption>
            <thead>
              <tr style={{ background: CARD_HDR }}>
                {columns.map(c => (
                  <th key={c} scope="col" style={{ textAlign: 'left', padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: INK, fontWeight: 700, whiteSpace: 'nowrap' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 200).map((row, i) => (
                <tr key={i}>
                  {columns.map(c => (
                    <td key={c} style={{ padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: SECOND, whiteSpace: 'nowrap' }}>
                      {row[c] == null ? '—' : (typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c]))}
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
