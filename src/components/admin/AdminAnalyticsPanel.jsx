/**
 * AdminAnalyticsPanel.jsx — owner-facing read view over the first-party analytics
 * dashboards (doc §9). Self-contained (mirrors GalleryModerationPanel): calls the
 * admin-actions `get_analytics_dashboard` action, which dispatches to the fixed
 * report_* SECURITY DEFINER functions (migration 038). The privilege gate is
 * server-side in admin-actions; this is read-only.
 *
 * Generic table render so all five dashboards (funnel / preferences / edit_heatmap
 * / ai_usage / retention) work from one component — columns come from the rows.
 *
 * Above them, ONE LINE for the engine service's cost log (ENGINE-5 unit 4,
 * EngineGenerationsLine): generations today and this month, by op and outcome, from
 * the same action's `engine_generations` dashboard (report_engine_generations,
 * migration 204).
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import { INK, MUTED, SECOND, BORDER, CARD_HDR, sans, SP, FS, swatch } from '../theme.js';
import Segmented from '../primitives/Segmented.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

const DASHBOARDS = [
  { id: 'funnel', label: 'First-gen funnel' },
  { id: 'preferences', label: 'Settlement preferences' },
  { id: 'edit_heatmap', label: 'Edit heatmap' },
  { id: 'ai_usage', label: 'AI usage' },
  { id: 'retention', label: 'Retention' },
];

/**
 * @typedef {{ op: string, outcome: string, generations_today: number|string, generations_month: number|string }} EngineGenerationRow
 */

/**
 * The engine line's default reader: admin-actions' `engine_generations` dashboard.
 * @returns {Promise<EngineGenerationRow[]>}
 */
async function readEngineGenerations() {
  const { data, error: err } = await supabase.functions.invoke('admin-actions', {
    body: { action: 'get_analytics_dashboard', dashboard: 'engine_generations' },
  });
  if (err) throw err;
  if (data?.error) throw new Error(data.error);
  return Array.isArray(data?.rows) ? data.rows : [];
}

/**
 * ONE LINE: the engine service's generations today and this month, by op and outcome.
 * @param {{ read?: () => Promise<EngineGenerationRow[]> }} [props] `read` is a seam for tests
 */
export function EngineGenerationsLine({ read = readEngineGenerations } = {}) {
  const mobile = useIsMobile();
  const [state, setState] = useState(/** @type {{ rows: EngineGenerationRow[]|null, error: string|null }} */ ({ rows: null, error: null }));
  useEffect(() => {
    let live = true;
    read().then(
      (rows) => { if (live) setState({ rows, error: null }); },
      (e) => { if (live) setState({ rows: null, error: e?.message || 'Failed to load' }); },
    );
    return () => { live = false; };
  }, [read]);
  const style = { margin: `0 0 ${SP.sm}px`, fontSize: chromeFontSize(FS.xs, mobile), color: SECOND, fontFamily: sans };
  if (state.error) return <p data-testid="engine-generations-line" style={style}>Engine generations: couldn’t load ({state.error}). (Needs migration 204 deployed.)</p>;
  if (!state.rows) return <p data-testid="engine-generations-line" style={style}>Engine generations: loading…</p>;
  const n = (/** @type {number|string} */ v) => Number(v) || 0;
  const today = state.rows.reduce((sum, r) => sum + n(r.generations_today), 0);
  const month = state.rows.reduce((sum, r) => sum + n(r.generations_month), 0);
  const parts = state.rows.map((r) => `${r.op} ${r.outcome} ${n(r.generations_today)} / ${n(r.generations_month)}`);
  return (
    <p data-testid="engine-generations-line" style={style}>
      Engine generations (today / this month): {today} / {month}{parts.length ? `; ${parts.join(' · ')}` : ''}
    </p>
  );
}

export default function AdminAnalyticsPanel() {
  const mobile = useIsMobile();
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

  // Data-load effect: load() sets loading/rows on mount + dashboard change. Intentional.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(dashboard); }, [dashboard, load]);

  const columns = rows.length ? Object.keys(rows[0]) : [];

  // P5 anti-box-soup: no outer frame/heading here. This panel only ever renders
  // inside AdminPanel's <Section> (which supplies the card + the "Analytics"
  // <h2>), so a self-framed card-in-card with a duplicate <h3> title would be a
  // nested-card false-floor. Render flat content; the parent owns the boundary.
  return (
    <section aria-label="Analytics dashboards">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', flexWrap: 'wrap', gap: SP.sm }}>
        {refreshedAt && <span style={{ fontSize: chromeFontSize(FS.xs, mobile), color: MUTED }}>refreshed {new Date(refreshedAt).toLocaleString('en-US')}</span>}
      </div>

      <EngineGenerationsLine />

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
      {error && <p style={{ fontSize: FS.sm, color: swatch.danger, fontFamily: sans }}>Couldn’t load: {error}. (Needs migrations 036–038 deployed.)</p>}
      {!loading && !error && rows.length === 0 && (
        <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans }}>No data yet for this dashboard.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile) }}>
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
