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
