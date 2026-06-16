/**
 * AdminTrendsPanel.jsx — owner-facing "interpret, don't manipulate" view over
 * the analytics planes (docs/simulation-intelligence-layer.md §9). Where
 * AdminAnalyticsPanel renders the fixed 038 report tables raw, this panel turns
 * the 040 period-bucketed report functions into a visual trends dashboard:
 *
 *   • a granularity + date-range control bar (day / week / month / quarter / year)
 *   • a KPI strip with period-over-period deltas              (report_summary)
 *   • activity over time, multi-metric line chart             (report_trend)
 *   • configuration mix over time, stacked bars               (report_distribution + granularity)
 *   • a distribution snapshot, horizontal bars                (report_distribution, overall)
 *   • a two-dimension heatmap (e.g. culture × terrain)        (report_crosstab)
 *   • edit-kind and lifecycle (capture-point) breakdowns      (report_distribution)
 *   • computed tuning signals (skew + big movers)
 *
 * Everything routes through the admin-actions edge function (server-side
 * privilege gate); this component assembles no SQL and reads no raw rows it
 * isn't shown. Charts are hand-rolled SVG/flex — no charting dependency. The
 * whole thing renders gracefully empty until migrations 036–040 are deployed
 * (each request is allSettled, so a missing function degrades one card, not all).
 *
 * The metric/field menus below MUST stay in sync with the allowlists in
 * supabase/migrations/040_analytics_trends.sql — that SQL is the security
 * boundary; an out-of-set key simply RAISES and the card shows the error.
 */
import { useState, useEffect, useCallback, useRef, useMemo, useId } from 'react';
import { supabase } from '../../lib/supabase.js';
import {
  GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH,
  VIOLET, RED, GREEN, AMBER, BLUE, sans, serif_, SP, R, FS, swatch,
} from '../theme.js';

// ── catalog (mirrors the 040 allowlists) ─────────────────────────────────────
const GRANULARITIES = ['day', 'week', 'month', 'quarter', 'year'];

const TREND_METRICS = [
  { key: 'generations', label: 'Generations' },
  { key: 'generations_started', label: 'Generations started' },
  { key: 'anon_generations', label: 'Anon generations' },
  { key: 'active_users', label: 'Active users' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'regenerations', label: 'Re-rolls' },
  { key: 'saves', label: 'Saves' },
  { key: 'pdf_exports', label: 'PDF exports' },
  { key: 'ai_generations', label: 'AI generations' },
  { key: 'ai_failures', label: 'AI failures' },
  { key: 'canonizations', label: 'Canonizations' },
  { key: 'pulse_advances', label: 'Pulse advances' },
  { key: 'gallery_publishes', label: 'Gallery publishes' },
  { key: 'neighbours', label: 'Neighbours' },
  { key: 'signups', label: 'Signups' },
  { key: 'premium_purchases', label: 'Premium buys' },
  { key: 'edits', label: 'Edits' },
  { key: 'edit_reverts', label: 'Edit reverts' },
  { key: 'avg_institution_count', label: 'Avg institutions' },
  { key: 'avg_npc_count', label: 'Avg NPCs' },
  { key: 'avg_faction_count', label: 'Avg factions' },
  { key: 'avg_condition_count', label: 'Avg conditions' },
  { key: 'avg_stressor_count', label: 'Avg stressors' },
];

// Distribution fields (config/output dims + behavioural breakdowns)
const DIST_FIELDS = [
  { key: 'tier', label: 'Tier' },
  { key: 'population_band', label: 'Population band' },
  { key: 'culture', label: 'Culture' },
  { key: 'terrain', label: 'Terrain' },
  { key: 'trade_route', label: 'Trade route access' },
  { key: 'magic_level', label: 'Magic level' },
  { key: 'monster_threat', label: 'Monster threat' },
  { key: 'prosperity', label: 'Prosperity' },
  { key: 'mode', label: 'Wizard mode' },
  { key: 'regen_mode', label: 'Re-roll mode' },
  { key: 'ai_type', label: 'AI request type' },
  { key: 'neighbour_relationship', label: 'Neighbour relationship' },
];
// Config/output dims only (valid for stacked-over-time + crosstab axes)
const CONFIG_FIELDS = DIST_FIELDS.slice(0, 8);

// KPI strip order + which summary rows are averages (1-dp) vs counts
const KPI_META = {
  generations: { label: 'Generations' },
  active_users: { label: 'Active users' },
  regenerations: { label: 'Re-rolls' },
  saves: { label: 'Saves' },
  ai_generations: { label: 'AI generations' },
  pdf_exports: { label: 'PDF exports' },
  edits: { label: 'Edits' },
  canonizations: { label: 'Canonizations' },
  signups: { label: 'Signups' },
  premium_purchases: { label: 'Premium buys' },
  avg_institutions: { label: 'Avg institutions', avg: true },
  avg_npcs: { label: 'Avg NPCs', avg: true },
  avg_factions: { label: 'Avg factions', avg: true },
};
const KPI_ORDER = Object.keys(KPI_META);

// Series/category palette (cycled). 'other' bucket uses MUTED.
const PALETTE = [GOLD, BLUE, GREEN, AMBER, VIOLET, RED, '#0E7C7B', '#9B5DE5'];

// ── formatting helpers ───────────────────────────────────────────────────────
const NF = new Intl.NumberFormat('en-US');
const fmtInt = (n) => NF.format(Math.round(Number(n) || 0));
const fmtVal = (n, avg) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return avg ? x.toFixed(x % 1 === 0 ? 0 : 1) : fmtInt(x);
};
function deltaInfo(cur, prior) {
  const c = Number(cur) || 0, p = Number(prior) || 0;
  if (p === 0) return { dir: c > 0 ? 'up' : 'flat', label: c > 0 ? 'new' : '—' };
  const pct = ((c - p) / p) * 100;
  const dir = pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat';
  return { pct, dir, label: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%` };
}
function fmtBucket(s, g) {
  if (!s) return '';
  const d = new Date(`${s}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(s);
  const yy = String(d.getFullYear()).slice(2);
  if (g === 'year') return String(d.getFullYear());
  if (g === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1} '${yy}`;
  if (g === 'month') return `${d.toLocaleString('en-US', { month: 'short' })} '${yy}`;
  return `${d.getMonth() + 1}/${d.getDate()}`; // day / week
}
const isoDaysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const todayIso = () => new Date().toISOString().slice(0, 10);

// ── tiny UI atoms ────────────────────────────────────────────────────────────
const Empty = ({ msg = 'No data in range.' }) => (
  <p style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, margin: `${SP.sm}px 0`, fontStyle: 'italic' }}>{msg}</p>
);

function Select({ value, onChange, options, label }) {
  const selectId = useId();
  return (
    <label htmlFor={selectId} style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, fontFamily: sans, fontSize: FS.xs, color: SECOND }}>
      {label && <span style={{ color: MUTED }}>{label}</span>}
      <select
        id={selectId}
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: sans, fontSize: FS.xs, color: INK, background: CARD, cursor: 'pointer',
          border: `1px solid ${BORDER}`, borderRadius: R.md, padding: `${SP.xs}px ${SP.sm}px`,
        }}
      >
        {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Card({ title, control, children }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD, padding: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, flexWrap: 'wrap', marginBottom: SP.sm }}>
        <h4 style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK_DEEP, margin: 0 }}>{title}</h4>
        {control}
      </div>
      {children}
    </div>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function Kpi({ label, value, avg, delta }) {
  const color = delta.dir === 'up' ? swatch.success || GREEN : delta.dir === 'down' ? swatch.danger || RED : MUTED;
  const arrow = delta.dir === 'up' ? '▲' : delta.dir === 'down' ? '▼' : '·';
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD_ALT, padding: `${SP.sm}px ${SP.md}px`, minWidth: 116 }}>
      <div style={{ fontFamily: sans, fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 700, color: INK, lineHeight: 1.1, marginTop: 2 }}>{fmtVal(value, avg)}</div>
      <div style={{ fontFamily: sans, fontSize: FS.xxs, color, marginTop: 2 }}>{arrow} {delta.label} <span style={{ color: MUTED }}>vs prior</span></div>
    </div>
  );
}

// ── multi-line chart (activity over time) ────────────────────────────────────
function MultiLineChart({ series, granularity }) {
  const W = 720, H = 240, padL = 46, padR = 14, padT = 14, padB = 30;
  const buckets = useMemo(
    () => [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))].sort(),
    [series],
  );
  if (!buckets.length) return <Empty />;
  const idx = Object.fromEntries(buckets.map((b, i) => [b, i]));
  const maxY = Math.max(1, ...series.flatMap((s) => s.points.map((p) => Number(p.y) || 0)));
  const xAt = (i) => (buckets.length === 1 ? padL + (W - padL - padR) / 2 : padL + (i * (W - padL - padR)) / (buckets.length - 1));
  const yAt = (v) => padT + (H - padT - padB) * (1 - (Number(v) || 0) / maxY);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxY * f));
  const xLabelIdx = buckets.length <= 8
    ? buckets.map((_, i) => i)
    : [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, marginBottom: SP.xs }}>
        {series.map((s) => (
          <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: sans, fontSize: FS.xxs, color: SECOND }}>
            <span style={{ width: 10, height: 3, borderRadius: 2, background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Activity over time" style={{ display: 'block' }}>
        {ticks.map((t, i) => {
          const y = yAt(t);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={BORDER} strokeWidth="1" />
              <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fontFamily="sans-serif" fill={MUTED}>{fmtInt(t)}</text>
            </g>
          );
        })}
        {xLabelIdx.map((i) => (
          <text key={i} x={xAt(i)} y={H - padB + 16} textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill={MUTED}>{fmtBucket(buckets[i], granularity)}</text>
        ))}
        {series.map((s) => {
          const pts = s.points.filter((p) => p.x in idx).sort((a, b) => idx[a.x] - idx[b.x]);
          if (!pts.length) return null;
          const dStr = pts.map((p) => `${xAt(idx[p.x])},${yAt(p.y)}`).join(' ');
          return (
            <g key={s.key}>
              <polyline points={dStr} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p) => (
                <circle key={p.x} cx={xAt(idx[p.x])} cy={yAt(p.y)} r="2.5" fill={s.color}>
                  <title>{`${fmtBucket(p.x, granularity)} · ${s.label}: ${fmtInt(p.y)}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── stacked bars (distribution over time) ────────────────────────────────────
function StackedBarChart({ rows, granularity }) {
  const W = 720, H = 250, padL = 40, padR = 14, padT = 14, padB = 30;
  const { buckets, cats, at, totalMax } = useMemo(() => {
    const byBucket = {}; const totals = {};
    for (const r of rows) {
      const b = r.bucket; const dim = r.dim ?? 'unknown'; const v = Number(r.value) || 0;
      (byBucket[b] ||= {})[dim] = (byBucket[b]?.[dim] || 0) + v;
      totals[dim] = (totals[dim] || 0) + v;
    }
    const ordered = Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([k]) => k);
    const top = ordered.slice(0, 7);
    const useOther = ordered.length > 7;
    const cats2 = useOther ? [...top, 'other'] : top;
    const at2 = (b, c) => {
      const row = byBucket[b] || {};
      if (c === 'other') return ordered.slice(7).reduce((s, k) => s + (row[k] || 0), 0);
      return row[c] || 0;
    };
    const bks = Object.keys(byBucket).sort();
    const tmax = Math.max(1, ...bks.map((b) => cats2.reduce((s, c) => s + at2(b, c), 0)));
    return { buckets: bks, cats: cats2, at: at2, totalMax: tmax };
  }, [rows]);

  if (!buckets.length) return <Empty />;
  const colorOf = (c, i) => (c === 'other' ? MUTED : PALETTE[i % PALETTE.length]);
  const band = (W - padL - padR) / buckets.length;
  const bw = Math.min(band * 0.68, 40);
  const yAt = (v) => padT + (H - padT - padB) * (1 - v / totalMax);
  const xLabelIdx = buckets.length <= 10 ? buckets.map((_, i) => i) : [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, marginBottom: SP.xs }}>
        {cats.map((c, i) => (
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: sans, fontSize: FS.xxs, color: SECOND }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: colorOf(c, i) }} /> {c}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Distribution over time" style={{ display: 'block' }}>
        {[0, 0.5, 1].map((f, i) => {
          const y = yAt(totalMax * f);
          return <line key={i} x1={padL} y1={y} x2={W - padR} y2={y} stroke={BORDER} strokeWidth="1" />;
        })}
        {buckets.map((b, bi) => {
          const cx = padL + bi * band + (band - bw) / 2;
          let acc = 0;
          return (
            <g key={b}>
              {cats.map((c, ci) => {
                const v = at(b, c);
                if (v <= 0) return null;
                const h = (H - padT - padB) * (v / totalMax);
                const y = yAt(acc + v);
                acc += v;
                return (
                  <rect key={c} x={cx} y={y} width={bw} height={Math.max(0, h)} fill={colorOf(c, ci)}>
                    <title>{`${fmtBucket(b, granularity)} · ${c}: ${fmtInt(v)}`}</title>
                  </rect>
                );
              })}
            </g>
          );
        })}
        {xLabelIdx.map((i) => (
          <text key={i} x={padL + i * band + band / 2} y={H - padB + 16} textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill={MUTED}>{fmtBucket(buckets[i], granularity)}</text>
        ))}
      </svg>
    </div>
  );
}

// ── horizontal bar list (overall distribution / top-N) ───────────────────────
function BarList({ rows, max = 12 }) {
  const items = useMemo(() => {
    const agg = {};
    for (const r of rows) agg[r.dim ?? 'unknown'] = (agg[r.dim ?? 'unknown'] || 0) + (Number(r.value) || 0);
    return Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, max);
  }, [rows, max]);
  if (!items.length) return <Empty />;
  const total = items.reduce((s, [, v]) => s + v, 0) || 1;
  const peak = items[0][1] || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {items.map(([k, v], i) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 64px', alignItems: 'center', gap: SP.sm, fontFamily: sans, fontSize: FS.xs }}>
          <span title={k} style={{ color: SECOND, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</span>
          <span style={{ background: PARCH, borderRadius: R.sm, height: 14, position: 'relative' }}>
            <span style={{ display: 'block', height: '100%', width: `${(v / peak) * 100}%`, background: PALETTE[i % PALETTE.length], borderRadius: R.sm }} />
          </span>
          <span style={{ color: INK, textAlign: 'right' }}>{fmtInt(v)} <span style={{ color: MUTED }}>({((v / total) * 100).toFixed(0)}%)</span></span>
        </div>
      ))}
    </div>
  );
}

// ── heatmap (crosstab) ───────────────────────────────────────────────────────
function Heatmap({ rows }) {
  const { rowKeys, colKeys, cell, max } = useMemo(() => {
    const rT = {}, cT = {}, m = {};
    for (const r of rows) {
      const rk = r.row_dim ?? 'unknown', ck = r.col_dim ?? 'unknown', v = Number(r.value) || 0;
      rT[rk] = (rT[rk] || 0) + v; cT[ck] = (cT[ck] || 0) + v; m[`${rk}|${ck}`] = (m[`${rk}|${ck}`] || 0) + v;
    }
    const rks = Object.entries(rT).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k]) => k);
    const cks = Object.entries(cT).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k]) => k);
    const mx = Math.max(1, ...Object.values(m));
    return { rowKeys: rks, colKeys: cks, cell: (rk, ck) => m[`${rk}|${ck}`] || 0, max: mx };
  }, [rows]);
  if (!rowKeys.length) return <Empty />;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontFamily: sans, fontSize: FS.xxs }}>
        <thead>
          <tr>
            <th aria-label="row versus column" style={{ padding: SP.xs }} />
            {colKeys.map((c) => (
              <th key={c} style={{ padding: SP.xs, color: MUTED, fontWeight: 600, textAlign: 'center', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rk) => (
            <tr key={rk}>
              <th scope="row" style={{ padding: SP.xs, color: SECOND, fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }} title={rk}>{rk}</th>
              {colKeys.map((ck) => {
                const v = cell(rk, ck);
                const a = v > 0 ? 0.12 + 0.85 * (v / max) : 0;
                return (
                  <td key={ck} title={`${rk} × ${ck}: ${fmtInt(v)}`} style={{
                    padding: SP.xs, textAlign: 'center', minWidth: 36,
                    background: v > 0 ? `rgba(176,141,87,${a.toFixed(3)})` : CARD_ALT,
                    color: a > 0.55 ? '#fff' : SECOND, border: `1px solid ${CARD}`,
                  }}>{v > 0 ? fmtInt(v) : '·'}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── compact grouped table (system-behaviour reports) ─────────────────────────
function MiniTable({ rows, columns, max = 60, numeric = [] }) {
  if (!rows || !rows.length) return <Empty />;
  const cols = columns || Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto', maxHeight: 320, overflowY: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: sans, fontSize: FS.xs }}>
        <thead>
          <tr style={{ background: CARD_HDR }}>
            {cols.map((c) => (
              <th key={c} scope="col" style={{ textAlign: numeric.includes(c) ? 'right' : 'left', padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: INK, fontWeight: 700, whiteSpace: 'nowrap', position: 'sticky', top: 0, background: CARD_HDR }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, max).map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c} style={{ padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`, color: SECOND, textAlign: numeric.includes(c) ? 'right' : 'left', whiteSpace: 'nowrap' }}>
                  {r[c] == null ? '—' : (numeric.includes(c) ? fmtVal(r[c], true) : String(r[c]))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── data layer ───────────────────────────────────────────────────────────────
async function callAdmin(body) {
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

const PRESETS = [
  { key: '7d', label: '7d', days: 7, g: 'day' },
  { key: '30d', label: '30d', days: 30, g: 'day' },
  { key: '90d', label: '90d', days: 90, g: 'week' },
  { key: '365d', label: '1y', days: 365, g: 'month' },
];

const DEFAULT_METRICS = ['generations', 'active_users', 'saves'];

export default function AdminTrendsPanel() {
  const [from, setFrom] = useState(isoDaysAgo(30));
  const [to, setTo] = useState(todayIso());
  const [granularity, setGranularity] = useState('day');
  const [activeMetrics, setActiveMetrics] = useState(DEFAULT_METRICS);
  const [mixField, setMixField] = useState('culture');
  const [distField, setDistField] = useState('tier');
  const [rowField, setRowField] = useState('culture');
  const [colField, setColField] = useState('terrain');

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [softError, setSoftError] = useState(null);
  const [refreshedAt, setRefreshedAt] = useState(null);
  const runRef = useRef(0);

  // Generation variance: a chosen config_signature → per-metric spread.
  const [configSig, setConfigSig] = useState('');
  const [variance, setVariance] = useState(null);
  const [varianceLoading, setVarianceLoading] = useState(false);

  // NPC distribution: a chosen dimension (goal / role / seat / …).
  const [npcField, setNpcField] = useState('goal');
  const [npcDist, setNpcDist] = useState(null);

  const toggleMetric = (key) => setActiveMetrics((cur) =>
    cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key].slice(-6));

  const applyPreset = (p) => {
    setFrom(isoDaysAgo(p.days));
    setTo(todayIso());
    setGranularity(p.g);
  };

  const load = useCallback(async () => {
    const run = ++runRef.current;
    setLoading(true); setSoftError(null);
    const reqs = {
      summary: callAdmin({ action: 'get_analytics_summary', from, to }),
      mix: callAdmin({ action: 'get_analytics_distribution', field: mixField, granularity, from, to }),
      dist: callAdmin({ action: 'get_analytics_distribution', field: distField, from, to }),
      editKinds: callAdmin({ action: 'get_analytics_distribution', field: 'edit_kind', from, to }),
      capture: callAdmin({ action: 'get_analytics_distribution', field: 'capture_point', from, to }),
      crosstab: callAdmin({ action: 'get_analytics_crosstab', rowField, colField, from, to }),
      // System-behaviour (what the CODE does)
      pulseMutations: callAdmin({ action: 'get_pulse_mutations', from, to }),
      stressorGenesis: callAdmin({ action: 'get_stressor_genesis', from, to }),
      proposalDecisions: callAdmin({ action: 'get_proposal_decisions', from, to }),
      configSignatures: callAdmin({ action: 'get_analytics_distribution', field: 'config_signature', from, to, limit: 25 }),
      // Regional / intersettlement
      regionalImpacts: callAdmin({ action: 'get_regional_impacts', from, to }),
      channelFunnel: callAdmin({ action: 'get_channel_funnel', from, to }),
      regionalArcs: callAdmin({ action: 'get_regional_arcs', from, to }),
      regionalPropagation: callAdmin({ action: 'get_regional_propagation', from, to }),
    };
    const metrics = activeMetrics.length ? activeMetrics : DEFAULT_METRICS;
    metrics.forEach((m) => { reqs[`trend_${m}`] = callAdmin({ action: 'get_analytics_trend', metric: m, granularity, from, to }); });

    const keys = Object.keys(reqs);
    const settled = await Promise.allSettled(keys.map((k) => reqs[k]));
    if (run !== runRef.current) return; // a newer load superseded this one
    const out = {}; const errs = [];
    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') out[keys[i]] = r.value;
      else errs.push(r.reason?.message || String(r.reason));
    });
    setData(out);
    setRefreshedAt(new Date().toISOString());
    setSoftError(errs.length ? errs[0] : null);
    setLoading(false);
  }, [from, to, granularity, mixField, distField, rowField, colField, activeMetrics]);

  useEffect(() => { load(); }, [load]);

  // Fetch per-config variance when a signature is chosen.
  useEffect(() => {
    if (!configSig) { setVariance(null); return; }
    let ignore = false;
    setVarianceLoading(true);
    callAdmin({ action: 'get_config_variance', configSignature: configSig, from, to })
      .then((d) => { if (!ignore) setVariance(Array.isArray(d?.rows) ? d.rows : []); })
      .catch(() => { if (!ignore) setVariance([]); })
      .finally(() => { if (!ignore) setVarianceLoading(false); });
    return () => { ignore = true; };
  }, [configSig, from, to]);

  // Fetch NPC distribution when the dimension (or range) changes.
  useEffect(() => {
    let ignore = false;
    callAdmin({ action: 'get_npc_distribution', field: npcField, from, to })
      .then((d) => { if (!ignore) setNpcDist(Array.isArray(d?.rows) ? d.rows : []); })
      .catch(() => { if (!ignore) setNpcDist([]); });
    return () => { ignore = true; };
  }, [npcField, from, to]);

  // ── derive view models ─────────────────────────────────────────────────────
  const summaryByMetric = useMemo(() => {
    const m = {};
    for (const r of (data.summary?.rows || [])) m[r.metric] = r;
    return m;
  }, [data.summary]);

  const lineSeries = useMemo(() => {
    const metrics = activeMetrics.length ? activeMetrics : DEFAULT_METRICS;
    return metrics.map((key, i) => ({
      key,
      label: TREND_METRICS.find((t) => t.key === key)?.label || key,
      color: PALETTE[i % PALETTE.length],
      points: (data[`trend_${key}`]?.rows || []).map((r) => ({ x: r.bucket, y: Number(r.value) || 0 })),
    })).filter((s) => s.points.length);
  }, [data, activeMetrics]);

  const signals = useMemo(() => buildSignals({ summaryByMetric, dist: data.dist?.rows || [], distField, mix: data.mix?.rows || [], mixField }), [summaryByMetric, data.dist, data.mix, distField, mixField]);

  const configSigOptions = useMemo(() => {
    const rows = data.configSignatures?.rows || [];
    const opts = rows
      .filter((r) => r.dim && r.dim !== 'unknown')
      .map((r) => ({ key: r.dim, label: `${String(r.dim).slice(0, 10)}… (${fmtInt(r.value)})` }));
    return [{ key: '', label: `Pick a config… (${opts.length})` }, ...opts];
  }, [data.configSignatures]);

  const proposalSummary = useMemo(() => {
    const rows = data.proposalDecisions?.rows || [];
    let applied = 0; let dismissed = 0;
    for (const r of rows) {
      if (r.resolution === 'applied') applied += Number(r.n) || 0;
      else if (r.resolution === 'dismissed') dismissed += Number(r.n) || 0;
    }
    const total = applied + dismissed;
    return { applied, dismissed, total, acceptRate: total ? Math.round((applied / total) * 100) : null };
  }, [data.proposalDecisions]);

  const hasAny = Object.values(data).some((d) => (d?.rows || []).length);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <section aria-label="Usage trends" style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD_HDR, padding: SP.lg, marginTop: SP.lg }}>
      {/* control bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK_DEEP, margin: 0 }}>Usage Trends</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
          <div role="group" aria-label="Quick range" style={{ display: 'flex', gap: 2 }}>
            {PRESETS.map((p) => (
              <button key={p.key} type="button" onClick={() => applyPreset(p)} style={{
                fontFamily: sans, fontSize: FS.xxs, fontWeight: 600, cursor: 'pointer',
                padding: `${SP.xs}px ${SP.sm}px`, border: `1px solid ${BORDER}`, borderRadius: R.sm,
                background: 'transparent', color: SECOND,
              }}>{p.label}</button>
            ))}
          </div>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} aria-label="From"
            style={{ fontFamily: sans, fontSize: FS.xs, color: INK, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: `${SP.xs}px ${SP.sm}px`, background: CARD }} />
          <span style={{ color: MUTED, fontSize: FS.xs }}>→</span>
          <input type="date" value={to} min={from} max={todayIso()} onChange={(e) => setTo(e.target.value)} aria-label="To"
            style={{ fontFamily: sans, fontSize: FS.xs, color: INK, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: `${SP.xs}px ${SP.sm}px`, background: CARD }} />
          <Select label="by" value={granularity} onChange={setGranularity} options={GRANULARITIES.map((g) => ({ key: g, label: g }))} />
          <button type="button" onClick={load} disabled={loading} style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            padding: `${SP.xs}px ${SP.md}px`, border: `1px solid ${GOLD}`, borderRadius: R.md,
            background: GOLD_BG, color: INK, opacity: loading ? 0.6 : 1,
          }}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
      </div>
      {refreshedAt && <div style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans, marginTop: 4 }}>refreshed {new Date(refreshedAt).toLocaleString()}</div>}
      {softError && (
        <p style={{ fontSize: FS.xs, color: swatch.danger || RED, fontFamily: sans, marginTop: SP.xs }}>
          Some panels couldn’t load: {softError}. (Needs migrations 036–040 deployed.)
        </p>
      )}

      {/* KPI strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, margin: `${SP.md}px 0` }}>
        {KPI_ORDER.map((k) => {
          const row = summaryByMetric[k];
          return (
            <Kpi key={k} label={KPI_META[k].label} avg={KPI_META[k].avg}
              value={row?.current_value ?? 0} delta={deltaInfo(row?.current_value, row?.prior_value)} />
          );
        })}
      </div>

      {/* tuning signals */}
      {signals.length > 0 && (
        <div style={{ border: `1px solid ${GOLD}`, background: GOLD_BG, borderRadius: R.md, padding: SP.md, margin: `0 0 ${SP.md}px` }}>
          <div style={{ fontFamily: serif_, fontSize: FS.sm, fontWeight: 700, color: INK_DEEP, marginBottom: SP.xs }}>Tuning signals</div>
          <ul style={{ margin: 0, paddingLeft: SP.lg, fontFamily: sans, fontSize: FS.xs, color: SECOND, lineHeight: 1.6 }}>
            {signals.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: SP.md }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Card title="Activity over time" control={
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: '70%', justifyContent: 'flex-end' }}>
              {TREND_METRICS.map((m) => {
                const on = activeMetrics.includes(m.key);
                return (
                  <button key={m.key} type="button" onClick={() => toggleMetric(m.key)} style={{
                    fontFamily: sans, fontSize: FS.pico, cursor: 'pointer', padding: '2px 6px', borderRadius: R.sm,
                    border: `1px solid ${on ? GOLD : BORDER}`, background: on ? GOLD_BG : 'transparent', color: on ? INK : MUTED,
                  }}>{m.label}</button>
                );
              })}
            </div>
          }>
            <MultiLineChart series={lineSeries} granularity={granularity} />
          </Card>
        </div>

        <Card title="Configuration mix over time" control={<Select value={mixField} onChange={setMixField} options={CONFIG_FIELDS} />}>
          <StackedBarChart rows={data.mix?.rows || []} granularity={granularity} />
        </Card>

        <Card title="Distribution (whole range)" control={<Select value={distField} onChange={setDistField} options={DIST_FIELDS} />}>
          <BarList rows={data.dist?.rows || []} />
        </Card>

        <Card title="Combination heatmap" control={
          <div style={{ display: 'flex', gap: SP.xs }}>
            <Select value={rowField} onChange={setRowField} options={CONFIG_FIELDS} />
            <span style={{ color: MUTED, fontSize: FS.xs, alignSelf: 'center' }}>×</span>
            <Select value={colField} onChange={setColField} options={CONFIG_FIELDS} />
          </div>
        }>
          <Heatmap rows={data.crosstab?.rows || []} />
        </Card>

        <Card title="What users edit">
          <BarList rows={data.editKinds?.rows || []} />
        </Card>

        <Card title="Lifecycle (capture points)">
          <BarList rows={data.capture?.rows || []} />
        </Card>
      </div>

      {/* ── System behaviour: what the CODE does (pulse / stressor / variance) ── */}
      <h3 style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK_DEEP, margin: `${SP.lg}px 0 ${SP.sm}px` }}>
        System behaviour <span style={{ fontFamily: sans, fontSize: FS.xxs, fontWeight: 500, color: MUTED }}>— what the engine mutates (much of this is research-tier)</span>
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: SP.md }}>
        <Card title="World-pulse mutations">
          <MiniTable rows={data.pulseMutations?.rows || []}
            columns={['effect_kind', 'subject_kind', 'genesis', 'apply_mode', 'n']} numeric={['n']} />
        </Card>

        <Card title="Stressor genesis (per type)">
          <MiniTable rows={data.stressorGenesis?.rows || []}
            columns={['stressor_type', 'genesis', 'source', 'n']} numeric={['n']} />
        </Card>

        <Card title="Proposal accept vs block" control={
          proposalSummary.acceptRate != null
            ? <span style={{ fontFamily: sans, fontSize: FS.xs, color: SECOND }}>
                {proposalSummary.acceptRate}% accepted <span style={{ color: MUTED }}>({fmtInt(proposalSummary.applied)}/{fmtInt(proposalSummary.total)})</span>
              </span>
            : null
        }>
          <MiniTable rows={data.proposalDecisions?.rows || []}
            columns={['resolution', 'proposal_type', 'subject_kind', 'n']} numeric={['n']} />
        </Card>

        <Card title="Generation variance (per config)" control={
          <Select value={configSig} onChange={setConfigSig} options={configSigOptions} />
        }>
          {!configSig && <Empty msg="Pick a config signature to see the output spread across seeds." />}
          {configSig && varianceLoading && <Empty msg="Loading variance…" />}
          {configSig && !varianceLoading && (
            <MiniTable rows={variance || []}
              columns={['metric', 'n', 'mean', 'stddev', 'p10', 'p50', 'p90']}
              numeric={['n', 'mean', 'stddev', 'p10', 'p50', 'p90']} />
          )}
        </Card>

        <Card title="Regional impacts (accept / block)">
          <MiniTable rows={data.regionalImpacts?.rows || []}
            columns={['resolution', 'impact_kind', 'channel_type', 'was_dm_action', 'n']} numeric={['n']} />
        </Card>

        <Card title="Channel funnel (suggested → confirmed)">
          <MiniTable rows={data.channelFunnel?.rows || []}
            columns={['to_status', 'provenance', 'channel_type', 'was_dm_action', 'n']} numeric={['n']} />
        </Card>

        <Card title="Realm / compound arcs">
          <MiniTable rows={data.regionalArcs?.rows || []}
            columns={['arc_kind', 'signature_key', 'scope', 'n']} numeric={['n']} />
        </Card>

        <Card title="Cross-settlement propagation">
          <MiniTable rows={data.regionalPropagation?.rows || []}
            columns={['trigger_genesis', 'events', 'total_impacts', 'direct_impacts', 'wave_impacts', 'max_wave_depth']}
            numeric={['events', 'total_impacts', 'direct_impacts', 'wave_impacts', 'max_wave_depth']} />
        </Card>

        <Card title="NPC distribution" control={
          <Select value={npcField} onChange={setNpcField} options={[
            { key: 'goal', label: 'Goal' }, { key: 'role_archetype', label: 'Role archetype' },
            { key: 'seat', label: 'Faction seat' }, { key: 'dotrank', label: 'Dot rank' },
            { key: 'category', label: 'Category' }, { key: 'influence', label: 'Influence' },
            { key: 'structural_rank', label: 'Structural rank' },
          ]} />
        }>
          <MiniTable rows={npcDist || []} columns={['dim', 'n']} numeric={['n']} />
        </Card>
      </div>

      {!loading && !hasAny && !softError && (
        <p style={{ fontSize: FS.sm, color: MUTED, fontFamily: sans, marginTop: SP.md }}>
          No analytics captured in this range yet. Data appears once the layer (migrations 036–040) is deployed and users generate.
        </p>
      )}
    </section>
  );
}

// ── tuning-signal heuristics (client-side, over already-fetched data) ─────────
function buildSignals({ summaryByMetric, dist, distField, mix, mixField }) {
  const out = [];
  const label = (fields, key) => fields.find((f) => f.key === key)?.label || key;

  // Big movers among the headline KPIs (need a meaningful prior base).
  for (const k of KPI_ORDER) {
    const row = summaryByMetric[k];
    if (!row) continue;
    const prior = Number(row.prior_value) || 0;
    const cur = Number(row.current_value) || 0;
    if (prior >= 10) {
      const pct = ((cur - prior) / prior) * 100;
      if (Math.abs(pct) >= 40) out.push(`${KPI_META[k].label} ${pct > 0 ? 'up' : 'down'} ${Math.abs(pct).toFixed(0)}% vs the prior period (${fmtInt(prior)} → ${fmtInt(cur)}).`);
    }
  }

  // Concentration / skew in the overall distribution being viewed.
  const agg = {};
  for (const r of dist) agg[r.dim ?? 'unknown'] = (agg[r.dim ?? 'unknown'] || 0) + (Number(r.value) || 0);
  const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total >= 20 && entries.length) {
    const [topKey, topVal] = entries[0];
    const share = (topVal / total) * 100;
    if (share >= 70) out.push(`${label(DIST_FIELDS, distField)} is heavily concentrated: “${topKey}” is ${share.toFixed(0)}% of generations — other options are barely exercised.`);
    const unused = entries.filter(([, v]) => v === 0).length;
    if (unused > 0) out.push(`${unused} ${label(DIST_FIELDS, distField).toLowerCase()} value(s) never appeared in range.`);
  }

  // Mix dominance over time (config dimension): a single value owning the chart.
  const mixAgg = {};
  let mixTotal = 0;
  for (const r of mix) { mixAgg[r.dim ?? 'unknown'] = (mixAgg[r.dim ?? 'unknown'] || 0) + (Number(r.value) || 0); mixTotal += Number(r.value) || 0; }
  const mixTop = Object.entries(mixAgg).sort((a, b) => b[1] - a[1])[0];
  if (mixTotal >= 20 && mixTop && (mixTop[1] / mixTotal) >= 0.6 && mixField !== distField) {
    out.push(`${label(CONFIG_FIELDS, mixField)} mix is dominated by “${mixTop[0]}” (${((mixTop[1] / mixTotal) * 100).toFixed(0)}%).`);
  }

  return out.slice(0, 6);
}
