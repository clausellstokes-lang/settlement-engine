/**
 * loadTestHarness.test.js — the R-25 LOAD-TEST HARNESS safety + math guard.
 *
 * The load-bearing pins are the SAFETY LAW: no target sends nothing, and a production
 * host is hard-refused with no override. If either regresses, the harness could generate
 * load against live. The rest pins the summary math (percentiles, gate-health).
 */
import { describe, it, expect, vi } from 'vitest';
import {
  parseArgs,
  isProdHost,
  classifyTarget,
  buildPlan,
  percentile,
  summarize,
  runLoad,
  SCENARIOS,
  PROD_HOST_PATTERNS,
} from '../../scripts/load-test.mjs';

describe('THE SAFETY LAW', () => {
  it('no target is not runnable (plan only, nothing sent)', () => {
    expect(classifyTarget('').runnable).toBe(false);
    expect(classifyTarget('').reason).toBe('no-target');
  });

  it('the production domain is hard-refused', () => {
    expect(isProdHost('https://settlementforge.com/x')).toBe(true);
    expect(isProdHost('https://www.settlementforge.com/x')).toBe(true);
    expect(classifyTarget('https://settlementforge.com').reason).toBe('prod-refused');
  });

  it('any Supabase-hosted project is hard-refused', () => {
    expect(isProdHost('https://abcdefgh.supabase.co/functions/v1/x')).toBe(true);
    expect(classifyTarget('https://abcdefgh.supabase.co').reason).toBe('prod-refused');
  });

  it('localhost / loopback is runnable (the intended target)', () => {
    expect(classifyTarget('http://localhost:54321').runnable).toBe(true);
    expect(classifyTarget('http://127.0.0.1:54321').runnable).toBe(true);
  });

  it('--execute defaults OFF (a pasted target never fires by itself)', () => {
    expect(parseArgs([]).execute).toBe(false);
    expect(parseArgs(['--target', 'http://localhost:1']).execute).toBe(false);
    expect(parseArgs(['--target', 'http://localhost:1', '--execute']).execute).toBe(true);
  });

  it('there is at least one AI and one checkout scenario, all POSTs expecting a gate rejection', () => {
    expect(SCENARIOS.some((s) => s.name.startsWith('ai/'))).toBe(true);
    expect(SCENARIOS.some((s) => s.name.startsWith('checkout/'))).toBe(true);
    for (const s of SCENARIOS) expect(s.expectGate.length).toBeGreaterThan(0);
  });

  it('the prod pattern list is frozen (cannot be mutated at runtime to allow prod)', () => {
    expect(Object.isFrozen(PROD_HOST_PATTERNS)).toBe(true);
  });
});

describe('parseArgs defaults are conservative', () => {
  it('defaults to a small run and no target', () => {
    const a = parseArgs([]);
    expect(a.target).toBe('');
    expect(a.concurrency).toBe(5);
    expect(a.requests).toBe(50);
  });
});

describe('buildPlan', () => {
  it('joins the base URL to each scenario path, trimming a trailing slash', () => {
    const plan = buildPlan('http://localhost:54321/');
    expect(plan[0].url).toBe('http://localhost:54321/functions/v1/generate-narrative');
    expect(plan.length).toBe(SCENARIOS.length);
  });
});

describe('summary math', () => {
  it('percentile is nearest-rank', () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(xs, 50)).toBe(5);
    expect(percentile(xs, 95)).toBe(10);
  });

  it('summarize buckets statuses, counts errors, and flags gate health', () => {
    const results = [
      { status: 401, ms: 12, expectGate: [401, 429] },
      { status: 429, ms: 20, expectGate: [401, 429] },
      { status: null, ms: 0, expectGate: [401, 429], error: 'AbortError' },
    ];
    const r = summarize(results);
    expect(r.count).toBe(3);
    expect(r.errors).toBe(1);
    expect(r.byStatus[401]).toBe(1);
    expect(r.gateHealthy).toBe(true);
  });

  it('a response that slips PAST the gate flags gateHealthy false', () => {
    const r = summarize([{ status: 200, ms: 5, expectGate: [401, 429] }]);
    expect(r.gateHealthy).toBe(false);
  });
});

describe('runLoad uses an injected fetch (no real network in the suite)', () => {
  it('fires `requests` times across the plan with an injected fetch', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ status: 401 });
    const plan = buildPlan('http://localhost:54321');
    const report = await runLoad({ plan, requests: 8, concurrency: 4, timeoutMs: 100, fetchImpl });
    expect(fetchImpl).toHaveBeenCalledTimes(8);
    expect(report.count).toBe(8);
    expect(report.byStatus[401]).toBe(8);
  });
});
