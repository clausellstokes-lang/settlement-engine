/**
 * aiSpendAlarm.test.js — the R-28 AI-SPEND ALARM guard.
 *
 * Two halves: the pure evaluator (thresholds, cap-off, dollars in the summary) and the
 * INERT PATH (the Turnstile-pattern gate: no webhook key ⇒ no dispatch, no behavior).
 * The inert-path pin is the load-bearing one — it proves the alarm ships off.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  evaluateSpendAlarm,
  describeSpendAlarm,
  normalizeThresholds,
  DEFAULT_SPEND_ALARM_THRESHOLDS,
} from '../../src/domain/ops/aiSpendAlarm.js';
import { dispatchSpendAlarm, readSnapshot, parseJsonEnv } from '../../scripts/ai-spend-alarm.mjs';

const CAP = { daily_cap: 100, monthly_cap: 1000, enabled: true };

describe('evaluateSpendAlarm — the pure evaluator', () => {
  it('reports ok well under both bands', () => {
    const v = evaluateSpendAlarm({ ...CAP, daily_spend: 10, monthly_spend: 100 });
    expect(v.level).toBe('ok');
    expect(v.over_threshold).toBe(false);
  });

  it('warns at 75% of a cap and goes critical at 90%', () => {
    expect(evaluateSpendAlarm({ ...CAP, daily_spend: 76, monthly_spend: 0 }).level).toBe('warning');
    expect(evaluateSpendAlarm({ ...CAP, daily_spend: 91, monthly_spend: 0 }).level).toBe('critical');
  });

  it('takes the more severe of the daily and monthly levels', () => {
    // daily ok, monthly critical ⇒ critical overall.
    const v = evaluateSpendAlarm({ ...CAP, daily_spend: 5, monthly_spend: 950 });
    expect(v.level).toBe('critical');
  });

  it('is ok (no ceiling to watch) when the cap is disabled', () => {
    const v = evaluateSpendAlarm({ daily_spend: 9999, daily_cap: 100, monthly_spend: 9999, monthly_cap: 1000, enabled: false });
    expect(v.level).toBe('ok');
    expect(v.capEnabled).toBe(false);
  });

  it('is ok when a cap is zero/absent (nothing to measure against)', () => {
    const v = evaluateSpendAlarm({ daily_spend: 50, daily_cap: 0, monthly_spend: 50, monthly_cap: 0 });
    expect(v.level).toBe('ok');
    expect(v.daily.fraction).toBeNull();
  });

  it('never throws on garbled input', () => {
    expect(() => evaluateSpendAlarm(null)).not.toThrow();
    expect(() => evaluateSpendAlarm({ daily_spend: 'x', daily_cap: 'y' })).not.toThrow();
  });

  it('describeSpendAlarm renders dollars and shares in plain register (no jargon, no em dash)', () => {
    const warn = describeSpendAlarm(evaluateSpendAlarm({ ...CAP, daily_spend: 80, monthly_spend: 0 }));
    expect(warn).toContain('$80.00');
    expect(warn).not.toContain('—');
    expect(warn).not.toMatch(/\bpayload|overlay|threshold=/i);
  });
});

describe('normalizeThresholds', () => {
  it('falls back to the PROPOSED defaults on garbage', () => {
    expect(normalizeThresholds(null)).toEqual(DEFAULT_SPEND_ALARM_THRESHOLDS);
    expect(normalizeThresholds({ warning: 5, critical: -1 })).toEqual(DEFAULT_SPEND_ALARM_THRESHOLDS);
  });
  it('never lets warning exceed critical', () => {
    const t = normalizeThresholds({ warning: 0.95, critical: 0.8 });
    expect(t.warning).toBeLessThanOrEqual(t.critical);
  });
});

describe('dispatchSpendAlarm — the INERT PATH (Turnstile pattern)', () => {
  const overVerdict = evaluateSpendAlarm({ ...CAP, daily_spend: 95, monthly_spend: 0 });

  it('is INERT with no webhook configured — dispatches nothing, changes nothing', async () => {
    const fetchImpl = vi.fn();
    const out = await dispatchSpendAlarm({ verdict: overVerdict, webhookUrl: '', fetchImpl });
    expect(out).toEqual({ dispatched: false, enforced: false, reason: 'unconfigured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('with a webhook set but spend within bands, sends nothing', async () => {
    const fetchImpl = vi.fn();
    const okVerdict = evaluateSpendAlarm({ ...CAP, daily_spend: 1, monthly_spend: 1 });
    const out = await dispatchSpendAlarm({ verdict: okVerdict, webhookUrl: 'https://ops.example/hook', fetchImpl });
    expect(out.dispatched).toBe(false);
    expect(out.reason).toBe('within_bands');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('with a webhook set AND a band crossed, POSTs the alarm', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const out = await dispatchSpendAlarm({ verdict: overVerdict, webhookUrl: 'https://ops.example/hook', fetchImpl });
    expect(out.dispatched).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://ops.example/hook');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.kind).toBe('ai_spend_alarm');
    expect(body.level).toBe('critical');
  });

  it('swallows a transport error (an alarm outage never crashes the job)', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));
    const out = await dispatchSpendAlarm({ verdict: overVerdict, webhookUrl: 'https://ops.example/hook', fetchImpl });
    expect(out.dispatched).toBe(false);
    expect(out.reason).toBe('dispatch_error');
  });
});

describe('script input helpers', () => {
  it('readSnapshot returns a zero snapshot when no path is given', () => {
    const snap = readSnapshot(undefined);
    expect(snap.daily_spend).toBe(0);
    expect(snap.enabled).toBe(true);
  });
  it('parseJsonEnv tolerates unset/garbled env', () => {
    expect(parseJsonEnv(undefined)).toBeUndefined();
    expect(parseJsonEnv('not json')).toBeUndefined();
    expect(parseJsonEnv('{"warning":0.5}')).toEqual({ warning: 0.5 });
  });
});
