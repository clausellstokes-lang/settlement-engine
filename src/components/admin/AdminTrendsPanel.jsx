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
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase.js';
import {
  GOLD, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, CARD,
  RED, sans, serif_, SP, R, FS, swatch,
} from '../theme.js';
import {
  PALETTE, fmtInt, deltaInfo, isoDaysAgo, todayIso,
} from './AdminTrendsShared.js';
import {
  Empty, Select, Card, Kpi, MultiLineChart, StackedBarChart, BarList, Heatmap, MiniTable,
} from './AdminTrendsCharts.jsx';
import Button from '../primitives/Button.jsx';

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
  // P5 anti-box-soup: render flat. This panel only mounts inside AdminPanel's
  // <Section>, which already supplies the card frame + the "Usage Trends" <h2>
  // and its body padding — so no self-framed card-in-card, no duplicate <h3>
  // title, no marginTop double-spacing inside the parent's padding.
  return (
    <section aria-label="Usage trends">
      {/* control bar — controls anchor right now that the title lives on the Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
          <div role="group" aria-label="Quick range" style={{ display: 'flex', gap: 2 }}>
            {PRESETS.map((p) => (
              <Button key={p.key} variant="ghost" size="sm" onClick={() => applyPreset(p)}>{p.label}</Button>
            ))}
          </div>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} aria-label="From"
            style={{ fontFamily: sans, fontSize: FS.xs, color: INK, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: `${SP.xs}px ${SP.sm}px`, background: CARD }} />
          <span style={{ color: MUTED, fontSize: FS.xs }}>→</span>
          <input type="date" value={to} min={from} max={todayIso()} onChange={(e) => setTo(e.target.value)} aria-label="To"
            style={{ fontFamily: sans, fontSize: FS.xs, color: INK, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: `${SP.xs}px ${SP.sm}px`, background: CARD }} />
          <Select label="by" value={granularity} onChange={setGranularity} options={GRANULARITIES.map((g) => ({ key: g, label: g }))} />
          <Button variant="gold" size="sm" onClick={load} busy={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
        </div>
      </div>
      {refreshedAt && <div style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans, marginTop: 4 }}>refreshed {new Date(refreshedAt).toLocaleString()}</div>}
      {softError && (
        <p style={{ fontSize: FS.xs, color: swatch.danger || RED, fontFamily: sans, marginTop: SP.xs }}>
          Some panels could not load: {softError}.
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
                  <Button key={m.key} variant={on ? 'gold' : 'ghost'} size="sm" aria-pressed={on} onClick={() => toggleMetric(m.key)}>{m.label}</Button>
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
        System behaviour <span style={{ fontFamily: sans, fontSize: FS.xxs, fontWeight: 500, color: MUTED }}>(what the simulation records)</span>
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
    if (share >= 70) out.push(`${label(DIST_FIELDS, distField)} is heavily concentrated: “${topKey}” is ${share.toFixed(0)}% of generations. Other options are barely exercised.`);
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
