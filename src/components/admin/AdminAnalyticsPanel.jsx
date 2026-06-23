/**
 * AdminAnalyticsPanel.jsx — owner-facing read view over the first-party analytics
 * dashboards. Self-contained (mirrors GalleryModerationPanel): calls the
 * admin-actions `get_analytics_dashboard` action, which dispatches to the fixed
 * report_* SECURITY DEFINER functions (migration 038). The privilege gate is
 * server-side in admin-actions; this is read-only.
 *
 * Generic table render so all five dashboards (funnel / preferences / edit_heatmap
 * / ai_usage / retention) work from one component — columns come from the rows.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import { INK, MUTED, SECOND, BORDER, CARD_HDR, sans, SP, FS, swatch } from '../theme.js';
import Segmented from '../primitives/Segmented.jsx';

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

  // P5 anti-box-soup: no outer frame/heading here. This panel only ever renders
  // inside AdminPanel's <Section> (which supplies the card + the "Analytics"
  // <h2>), so a self-framed card-in-card with a duplicate <h3> title would be a
  // nested-card false-floor. Render flat content; the parent owns the boundary.
  return (
    <section aria-label="Analytics dashboards">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', flexWrap: 'wrap', gap: SP.sm }}>
        {refreshedAt && <span style={{ fontSize: FS.xs, color: MUTED }}>refreshed {new Date(refreshedAt).toLocaleString()}</span>}
      </div>

      <div style={{ margin: `${SP.sm}px 0` }}>
        <Segmented
          options={DASHBOARDS.map(d => ({ id: d.id, label: d.label }))}
          value={dashboard}
          onChange={setDashboard}
          size="sm"
          ariaLabel="Dashboard"
        />
      </div>

      {loading && <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>Loading…</p>}
      {error && <p style={{ fontSize: FS.sm, color: swatch.danger, fontFamily: sans }}>Could not load: {error}. Confirm the analytics migrations are deployed.</p>}
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
                      {row[c] == null ? '–' : (typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c]))}
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
