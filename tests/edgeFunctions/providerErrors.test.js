/**
 * providerErrors.test.js — the PURE provider-error classification + §3d graceful-refusal
 * contract (BYOK MANAGEMENT SURFACE, owner commission #29). Imports the genuine edge
 * source (Deno-global-free), so the same code the edge runs is what is proven here.
 */
import { describe, it, expect } from 'vitest';
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from '../../supabase/functions/ai-analyst/providerErrors.ts';

describe('classifyProviderError — boundary classes', () => {
  it('2xx ⇒ ok', () => {
    expect(classifyProviderError(200)).toBe('ok');
    expect(classifyProviderError(201, 'anything')).toBe('ok');
  });

  it('401 / 403 ⇒ invalid (bad or unauthorized key)', () => {
    expect(classifyProviderError(401, 'authentication_error')).toBe('invalid');
    expect(classifyProviderError(403, 'permission_error')).toBe('invalid');
  });

  it('a billing/credit signal ⇒ out_of_credit, even on a 400 or 429 status', () => {
    expect(classifyProviderError(400, 'Your credit balance is too low to access the Anthropic API.')).toBe('out_of_credit');
    expect(classifyProviderError(429, 'insufficient_quota: billing hard limit reached')).toBe('out_of_credit');
    expect(classifyProviderError(402, '')).toBe('out_of_credit');
  });

  it('429 without a billing signal ⇒ rate_limited', () => {
    expect(classifyProviderError(429, 'rate_limit_error: too many requests')).toBe('rate_limited');
  });

  it('5xx incl. 529 overloaded ⇒ down', () => {
    for (const s of [500, 502, 503, 504, 529]) expect(classifyProviderError(s, 'overloaded_error')).toBe('down');
  });

  it('a non-billing 400 ⇒ other (NOT a key-health signal — must not flip a healthy key)', () => {
    expect(classifyProviderError(400, 'invalid_request_error: max_tokens too large')).toBe('other');
    expect(healthFromClass('other')).toBeNull();
  });

  it('never throws on garbage input', () => {
    expect(classifyProviderError(undefined)).toBe('other');
    expect(classifyProviderError('nope', null)).toBe('other');
  });
});

describe('classifyProviderThrow — network/timeout ⇒ down', () => {
  it('AbortError / TimeoutError / TypeError ⇒ down', () => {
    const abort = new Error('aborted'); abort.name = 'AbortError';
    const to = new Error('timed out'); to.name = 'TimeoutError';
    const net = new Error('fetch failed'); net.name = 'TypeError';
    expect(classifyProviderThrow(abort)).toBe('down');
    expect(classifyProviderThrow(to)).toBe('down');
    expect(classifyProviderThrow(net)).toBe('down');
  });
  it('a plain unknown error ⇒ other', () => {
    expect(classifyProviderThrow(new Error('weird content'))).toBe('other');
  });
});

describe('healthFromClass — the persisted key-health state', () => {
  it('maps each failure class to its health; ok⇒healthy; other⇒null (untouched)', () => {
    expect(healthFromClass('ok')).toBe('healthy');
    expect(healthFromClass('out_of_credit')).toBe('out_of_credit');
    expect(healthFromClass('invalid')).toBe('invalid');
    expect(healthFromClass('rate_limited')).toBe('rate_limited');
    expect(healthFromClass('down')).toBe('down');
    expect(healthFromClass('other')).toBeNull();
  });
});

describe('refusalForClass — §3d graceful refusal contract', () => {
  it('every provider-money class names the boundary AND offers switch-to-managed', () => {
    for (const cls of ['out_of_credit', 'invalid', 'rate_limited', 'down']) {
      const r = refusalForClass(cls);
      expect(r.class).toBe(cls);
      expect(r.message.length).toBeGreaterThan(0);
      expect(r.doors).toContain('managed');            // the always-available door
      expect(r.message).toMatch(/nothing was charged/i); // a failed attempt spent nothing
    }
  });

  it('out_of_credit points at the provider console AND managed credits', () => {
    const r = refusalForClass('out_of_credit');
    expect(r.doors).toEqual(expect.arrayContaining(['provider_console', 'managed']));
    expect(r.message).toMatch(/top up/i);
  });

  it('cap / paused name the AI-settings door (no dead ends)', () => {
    expect(refusalForClass('cap', { window: 'daily_tokens' }).message).toMatch(/cap/i);
    expect(refusalForClass('cap').doors).toContain('edit_caps');
    expect(refusalForClass('paused').doors).toContain('unpause');
  });

  it('no class produces an empty door list (a dead-end refusal is a failure)', () => {
    for (const cls of ['out_of_credit', 'invalid', 'rate_limited', 'down', 'cap', 'paused', 'read_only', 'other']) {
      expect(refusalForClass(cls).doors.length).toBeGreaterThan(0);
    }
  });
});
