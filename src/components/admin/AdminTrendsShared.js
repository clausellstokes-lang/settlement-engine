/**
 * AdminTrendsShared.js — module-scope palette + formatting helpers shared by
 * AdminTrendsPanel.jsx and its extracted chart library (AdminTrendsCharts.jsx).
 *
 * Pure, presentation-only utilities moved verbatim out of AdminTrendsPanel so
 * both the panel and the charts can reuse them without a circular import. No
 * state, no store, no side effects.
 */
import {
  GOLD, BLUE, GREEN, AMBER, VIOLET, RED,
} from '../theme.js';

// Series/category palette (cycled). 'other' bucket uses MUTED.
export const PALETTE = [GOLD, BLUE, GREEN, AMBER, VIOLET, RED, '#0E7C7B', '#9B5DE5'];

// ── formatting helpers ───────────────────────────────────────────────────────
export const NF = new Intl.NumberFormat('en-US');
export const fmtInt = (n) => NF.format(Math.round(Number(n) || 0));
export const fmtVal = (n, avg) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return '–';
  return avg ? x.toFixed(x % 1 === 0 ? 0 : 1) : fmtInt(x);
};
export function deltaInfo(cur, prior) {
  const c = Number(cur) || 0, p = Number(prior) || 0;
  if (p === 0) return { dir: c > 0 ? 'up' : 'flat', label: c > 0 ? 'new' : '–' };
  const pct = ((c - p) / p) * 100;
  const dir = pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat';
  return { pct, dir, label: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%` };
}
export function fmtBucket(s, g) {
  if (!s) return '';
  const d = new Date(`${s}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(s);
  const yy = String(d.getFullYear()).slice(2);
  if (g === 'year') return String(d.getFullYear());
  if (g === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1} '${yy}`;
  if (g === 'month') return `${d.toLocaleString('en-US', { month: 'short' })} '${yy}`;
  return `${d.getMonth() + 1}/${d.getDate()}`; // day / week
}
export const isoDaysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
export const todayIso = () => new Date().toISOString().slice(0, 10);
