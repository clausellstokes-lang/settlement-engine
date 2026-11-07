/**
 * @vitest-environment jsdom
 */
/**
 * adminEngineGenerationsLine.test.jsx — the admin analytics panel's one engine line
 * (ENGINE-5 unit 4): generations today and this month, by op and outcome, rendered from a
 * stubbed reader of report_engine_generations' rows (migration 204), and the default reader
 * asks admin-actions for the `engine_generations` dashboard.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn(async () => ({ data: { rows: [] }, error: null })) }));
vi.mock('../../src/lib/supabase.js', () => ({ supabase: { functions: { invoke } } }));

import AdminAnalyticsPanel, { EngineGenerationsLine } from '../../src/components/admin/AdminAnalyticsPanel.jsx';

afterEach(() => { cleanup(); invoke.mockClear(); });

describe('the engine generations line', () => {
  it('renders the totals and each op × outcome from the reader\'s rows', async () => {
    const read = vi.fn(async () => [
      { op: 'derive', outcome: 'ok', generations_today: 1, generations_month: 3 },
      { op: 'generate', outcome: 'ok', generations_today: '2', generations_month: '20' },
      { op: 'generate', outcome: 'rate_limited', generations_today: 1, generations_month: 1 },
    ]);
    render(<EngineGenerationsLine read={read} />);
    await waitFor(() => expect(screen.getByTestId('engine-generations-line').textContent).toBe(
      'Engine generations (today / this month): 4 / 24; derive ok 1 / 3 · generate ok 2 / 20 · generate rate_limited 1 / 1',
    ));
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('says zero plainly when there were none, and says a failed read', async () => {
    render(<EngineGenerationsLine read={async () => []} />);
    await waitFor(() => expect(screen.getByTestId('engine-generations-line').textContent)
      .toBe('Engine generations (today / this month): 0 / 0'));
    cleanup();
    render(<EngineGenerationsLine read={async () => { throw new Error('function report_engine_generations does not exist'); }} />);
    await waitFor(() => expect(screen.getByTestId('engine-generations-line').textContent)
      .toMatch(/^Engine generations: couldn’t load \(function report_engine_generations does not exist\)/));
  });

  it('the panel carries the line, and its default reader asks for the engine_generations dashboard', async () => {
    render(<AdminAnalyticsPanel />);
    await waitFor(() => expect(screen.getByTestId('engine-generations-line').textContent)
      .toBe('Engine generations (today / this month): 0 / 0'));
    const bodies = invoke.mock.calls.map(([, opts]) => opts.body);
    expect(bodies).toContainEqual({ action: 'get_analytics_dashboard', dashboard: 'engine_generations' });
    expect(bodies).toContainEqual({ action: 'get_analytics_dashboard', dashboard: 'funnel' });
  });
});
