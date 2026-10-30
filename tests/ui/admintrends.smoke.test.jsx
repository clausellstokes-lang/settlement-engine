/**
 * @vitest-environment jsdom
 *
 * tests/ui/admintrends.smoke.test.jsx — Decomposition lock-in.
 *
 * AdminTrendsPanel.jsx was decomposed: its module-scope formatting helpers +
 * palette moved to src/components/admin/AdminTrendsShared.js, and its
 * presentational chart library (Empty/Select/Card/Kpi/MultiLineChart/
 * StackedBarChart/BarList/Heatmap/MiniTable) moved to
 * src/components/admin/AdminTrendsCharts.jsx. This is a behaviour-preserving
 * move, so the regression net is simply: the module still loads and wires the
 * extracted imports together. A broken relative-path/import in the split would
 * throw on the dynamic import below and fail this test.
 *
 * The panel fires Supabase edge-function calls (via callAdmin) from effects on
 * mount, so we stub supabase.functions.invoke to keep the import graph quiet and
 * network-free. We keep the assertion light: the default export is a function.
 */

import { describe, test, expect, vi } from 'vitest';

// The panel's data layer calls supabase.functions.invoke('admin-actions', …)
// from effects; stub it so importing the module pulls no real network wiring.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    functions: { invoke: vi.fn(() => Promise.resolve({ data: { rows: [] }, error: null })) },
  },
}));

describe('AdminTrendsPanel — decomposition smoke', () => {
  test('module loads and the default export is a function', async () => {
    const mod = await import('../../src/components/admin/AdminTrendsPanel.jsx');
    expect(typeof mod.default).toBe('function');
  });
});

// ── T7 survey (2026-10-30): the Usage Trends and Analytics dashboards exercised
//    in jsdom. Every read goes to the right admin-actions action with the right
//    keys, and a failed read is shown, never rendered as an empty table. ──
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { supabase as mockedSupabase } from '../../src/lib/supabase.js';
import { afterEach, beforeEach } from 'vitest';

afterEach(cleanup);

const trendInvoke = () => mockedSupabase.functions.invoke;
function routeTrends(fail = {}) {
  trendInvoke().mockImplementation(async (_fn, { body }) => {
    if (fail[body.action]) return { data: { error: fail[body.action] }, error: null };
    if (body.action === 'get_analytics_distribution' && body.field === 'config_signature') {
      return { data: { rows: [{ dim: 'sig-aaaaaaaaaaaa', value: 12 }] }, error: null };
    }
    return { data: { rows: [] }, error: null };
  });
}
const trendCalls = () => trendInvoke().mock.calls.map(([, { body }]) => body);

describe('AdminTrendsPanel — reads and refusals (T7 survey)', () => {
  beforeEach(() => { trendInvoke().mockReset(); });

  test('one load fires every report read with its keys and the date range', async () => {
    routeTrends();
    const Panel = (await import('../../src/components/admin/AdminTrendsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    const actions = new Set(trendCalls().map((b) => b.action));
    for (const a of ['get_analytics_summary', 'get_analytics_distribution', 'get_analytics_crosstab', 'get_referral_funnel',
      'get_pulse_mutations', 'get_stressor_genesis', 'get_proposal_decisions', 'get_regional_impacts', 'get_channel_funnel',
      'get_regional_arcs', 'get_regional_propagation', 'get_analytics_trend', 'get_npc_distribution']) {
      expect(actions.has(a), a).toBe(true);
    }
    for (const b of trendCalls()) {
      expect(b.from, b.action).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(b.to, b.action).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(trendCalls().find((b) => b.action === 'get_analytics_crosstab')).toMatchObject({ rowField: 'culture', colField: 'terrain' });
  });

  test('a refused report read surfaces the soft error line', async () => {
    routeTrends({ get_analytics_summary: 'Admin action failed' });
    const Panel = (await import('../../src/components/admin/AdminTrendsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    expect(await screen.findByText(/some panels could not load: admin action failed/i)).toBeTruthy();
  });

  test('a refused NPC distribution read is shown in its card, not as an empty table', async () => {
    routeTrends({ get_npc_distribution: 'Admin action failed' });
    const Panel = (await import('../../src/components/admin/AdminTrendsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    expect(await screen.findByText(/npc distribution could not load: admin action failed/i)).toBeTruthy();
  });

  test('picking a config signature reads get_config_variance; a refusal is shown, not an empty table', async () => {
    routeTrends({ get_config_variance: 'Admin action failed' });
    const Panel = (await import('../../src/components/admin/AdminTrendsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    const select = await screen.findByDisplayValue(/pick a config/i);
    await act(async () => { fireEvent.change(select, { target: { value: 'sig-aaaaaaaaaaaa' } }); });
    await waitFor(() => expect(trendCalls().some((b) => b.action === 'get_config_variance' && b.configSignature === 'sig-aaaaaaaaaaaa')).toBe(true));
    expect(await screen.findByText(/variance could not load: admin action failed/i)).toBeTruthy();
  });
});

describe('AdminAnalyticsPanel — dashboard switch and refusal (T7 survey)', () => {
  beforeEach(() => { trendInvoke().mockReset(); });

  test('mount reads the funnel; each segment reads its own dashboard', async () => {
    routeTrends();
    const Panel = (await import('../../src/components/admin/AdminAnalyticsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    expect(trendCalls()[0]).toEqual({ action: 'get_analytics_dashboard', dashboard: 'funnel' });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /retention/i })); });
    expect(trendCalls().at(-1)).toEqual({ action: 'get_analytics_dashboard', dashboard: 'retention' });
  });

  test('a refused dashboard read is shown in place of the table', async () => {
    routeTrends({ get_analytics_dashboard: 'Insufficient privileges' });
    const Panel = (await import('../../src/components/admin/AdminAnalyticsPanel.jsx')).default;
    await act(async () => { render(<Panel />); });
    expect(await screen.findByText(/couldn.t load: insufficient privileges/i)).toBeTruthy();
    expect(screen.queryByText(/no data yet for this dashboard/i)).toBeNull();
  });
});
