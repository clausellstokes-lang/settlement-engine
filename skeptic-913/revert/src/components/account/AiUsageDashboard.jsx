/**
 * AiUsageDashboard.jsx — the BYOK MANAGEMENT SURFACE usage meter (#29). Reads the
 * caller's OWN ai_usage_events (read-own RLS) + the maintained price table and shows
 * tokens by day / task / model with an ESTIMATED cost. Dependency-free (theme vocab +
 * flex bars); lazy-loaded by AccountAiKeysSection so it is never in first paint.
 *
 * HONEST BOUNDARY (stated in-UI): costs are estimates from a maintained price table —
 * providers expose no balance API, so this is your TREND; your provider's console is
 * the truth.
 */
import { useEffect, useState } from 'react';
import { INK, BODY, MUTED, BORDER, GOLD, GOLD_BG, CARD_ALT, SP, FS, sans } from '../theme.js';
import { getUsageEvents, getPriceEstimates, estimateUsd } from '../../lib/surveyorByok.js';

const fmtInt = (n) => (Number(n) || 0).toLocaleString('en-US');
const fmtUsd = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const dayKey = (iso) => String(iso || '').slice(0, 10);

/**
 * Aggregate raw usage rows into the meter's views. Pure, so the pin exercises the real
 * math. Returns totals + byDay (last 14) + byTask + byModel token breakdowns.
 */
export function aggregateUsage(events) {
  const rows = Array.isArray(events) ? events : [];
  let totalTokens = 0;
  const byDay = new Map();
  const byTask = new Map();
  const byModel = new Map();
  for (const e of rows) {
    const tok = (Number(e.input_tokens) || 0) + (Number(e.output_tokens) || 0);
    totalTokens += tok;
    byDay.set(dayKey(e.created_at), (byDay.get(dayKey(e.created_at)) || 0) + tok);
    byTask.set(e.feature || 'other', (byTask.get(e.feature || 'other') || 0) + tok);
    byModel.set(e.model || 'unknown', (byModel.get(e.model || 'unknown') || 0) + tok);
  }
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = dayKey(new Date(Date.now() - i * 86400_000).toISOString());
    days.push({ day: d, tokens: byDay.get(d) || 0 });
  }
  const sortDesc = (m) => [...m.entries()].map(([k, v]) => ({ key: k, tokens: v })).sort((a, b) => b.tokens - a.tokens);
  return {
    requests: rows.length,
    totalTokens,
    activeDays: byDay.size,
    byDay: days,
    byTask: sortDesc(byTask),
    byModel: sortDesc(byModel),
  };
}

function Kpi({ label, value, sub }) {
  return (
    <div style={{ flex: '1 1 120px', minWidth: 0, padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, background: CARD_ALT }}>
      <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{label}</div>
      <div style={{ fontSize: FS.lg, fontWeight: 800, color: INK, fontFamily: sans }}>{value}</div>
      {sub && <div style={{ fontSize: FS.xs, color: MUTED }}>{sub}</div>}
    </div>
  );
}

function BarRow({ label, tokens, max }) {
  const pct = max > 0 ? Math.round((tokens / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
      <div style={{ width: 120, fontSize: FS.sm, color: BODY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 10, background: BORDER, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: GOLD }} />
      </div>
      <div style={{ width: 72, textAlign: 'right', fontSize: FS.xs, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{fmtInt(tokens)}</div>
    </div>
  );
}

export default function AiUsageDashboard({ provider = 'anthropic' }) {
  const [events, setEvents] = useState(null);
  const [prices, setPrices] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getUsageEvents(30), getPriceEstimates()])
      .then(([ev, pr]) => { if (alive) { setEvents(ev); setPrices(pr); } })
      .catch((e) => { if (alive) { setEvents([]); setError(e.message || 'Could not load usage.'); } });
    return () => { alive = false; };
  }, []);

  if (events === null) return <div style={{ fontSize: FS.sm, color: BODY }}>Loading usage…</div>;

  const agg = aggregateUsage(events);
  const usd = estimateUsd(events, prices, provider);
  const dayMax = Math.max(1, ...agg.byDay.map((d) => d.tokens));
  const taskMax = Math.max(1, ...agg.byTask.map((t) => t.tokens));
  const modelMax = Math.max(1, ...agg.byModel.map((m) => m.tokens));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {error && <div role="alert" style={{ fontSize: FS.sm, color: MUTED }}>{error}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm }}>
        <Kpi label="Tokens (30 days)" value={fmtInt(agg.totalTokens)} />
        <Kpi label="Est. cost (30 days)" value={fmtUsd(usd)} sub="estimate" />
        <Kpi label="Requests" value={fmtInt(agg.requests)} />
        <Kpi label="Active days" value={fmtInt(agg.activeDays)} />
      </div>

      {/* Tokens by day (last 14) */}
      <div>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, marginBottom: SP.xs }}>Tokens by day</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 56 }}>
          {agg.byDay.map((d) => (
            <div key={d.day} aria-label={`${d.day}: ${fmtInt(d.tokens)} tokens`}
              style={{ flex: 1, height: `${Math.max(2, Math.round((d.tokens / dayMax) * 100))}%`, background: d.tokens ? GOLD : BORDER, minHeight: 2 }} />
          ))}
        </div>
      </div>

      {/* By task */}
      {agg.byTask.length > 0 && (
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, marginBottom: SP.xs }}>By task</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {agg.byTask.map((t) => <BarRow key={t.key} label={t.key} tokens={t.tokens} max={taskMax} />)}
          </div>
        </div>
      )}

      {/* By model */}
      {agg.byModel.length > 0 && (
        <div>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, marginBottom: SP.xs }}>By model</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {agg.byModel.map((m) => <BarRow key={m.key} label={m.key} tokens={m.tokens} max={modelMax} />)}
          </div>
        </div>
      )}

      <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5, background: GOLD_BG, border: `1px solid ${BORDER}`, padding: `${SP.sm}px ${SP.md}px` }}>
        Costs are <strong>estimates</strong> from a maintained price table. No provider exposes a live balance,
        so this meter is your <em>trend</em>. Your provider’s console is the source of truth.
      </div>
    </div>
  );
}
