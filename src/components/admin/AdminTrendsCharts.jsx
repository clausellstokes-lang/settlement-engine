/**
 * AdminTrendsCharts.jsx — the presentational chart library for
 * AdminTrendsPanel.jsx. These are pure, props-driven UI atoms + hand-rolled
 * SVG/flex charts (no charting dependency, no state, no store access). They were
 * extracted verbatim from AdminTrendsPanel to keep the panel under the
 * max-lines budget; behaviour and rendered output are unchanged.
 */
import { useId, useMemo } from 'react';
import {
  INK, INK_DEEP, MUTED, SECOND, BORDER, CARD, CARD_ALT, CARD_HDR, PARCH,
  RED, GREEN, sans, serif_, SP, R, FS, swatch,
} from '../theme.js';
import { PALETTE, fmtInt, fmtVal, fmtBucket } from './AdminTrendsShared.js';

// ── tiny UI atoms ────────────────────────────────────────────────────────────
export const Empty = ({ msg = 'No data in range.' }) => (
  <p style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, margin: `${SP.sm}px 0`, fontStyle: 'italic' }}>{msg}</p>
);

export function Select({ value, onChange, options, label }) {
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

export function Card({ title, control, children }) {
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
export function Kpi({ label, value, avg, delta }) {
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
export function MultiLineChart({ series, granularity }) {
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
export function StackedBarChart({ rows, granularity }) {
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
export function BarList({ rows, max = 12 }) {
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
export function Heatmap({ rows }) {
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
                    color: a > 0.55 ? swatch.white : SECOND, border: `1px solid ${CARD}`,
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
export function MiniTable({ rows, columns, max = 60, numeric = [] }) {
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
                  {r[c] == null ? '–' : (numeric.includes(c) ? fmtVal(r[c], true) : String(r[c]))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
