/**
 * surveyorByok.test.js — the BYOK MANAGEMENT SURFACE edge contracts (#29).
 *
 *  1. RUNTIME of the pure model-picker helper intersectModels + the adapter's
 *     supported-model / retention exports (the same code the edge runs).
 *  2. STRUCTURAL contracts the surveyor-byok verify handler must satisfy: the trust
 *     gates, verify-by-test-call, list-models on healthy, the key-health write, and —
 *     the load-bearing one — that verifying a key spends NO credits.
 *  3. STRUCTURAL contracts the ai-analyst handler must satisfy for the governors +
 *     graceful refusals: precheck BEFORE the credit flow, a receipted refusal, provider
 *     errors classified into key-health, and refusal_class on the audit row.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import {
  intersectModels, registerProviderAdapter,
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from '../../supabase/functions/ai-analyst/analystCore.ts';

const ROOT = resolve(process.cwd());
const BYOK = readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/index.ts'), 'utf8');
const ANALYST = readFileSync(join(ROOT, 'supabase/functions/ai-analyst/index.ts'), 'utf8');

// ── Layer 1: the pure model picker ──────────────────────────────────────────
describe('intersectModels — the dynamic model dropdown (key list-models ∩ adapter set)', () => {
  it('family-aware match: a provider id sharing the family stem counts', () => {
    // key ids carry a date/version suffix; the adapter uses aliases.
    const key = ['claude-opus-4-20250514', 'claude-sonnet-4-5-20250101', 'gpt-4o'];
    const out = intersectModels(key, ANTHROPIC_SUPPORTED_MODELS);
    expect(out).toContain('claude-opus-4-8');   // matched claude-opus-4-* by stem
    expect(out).toContain('claude-sonnet-4-5');  // exact-ish family
    expect(out).not.toContain('gpt-4o');         // not an adapter model
  });

  it('exact ids intersect', () => {
    expect(intersectModels(['claude-haiku-4-5'], ANTHROPIC_SUPPORTED_MODELS)).toContain('claude-haiku-4-5');
  });

  it('FAIL-OPEN: an empty/unavailable key list returns the full adapter set (never blank)', () => {
    expect(intersectModels([], ANTHROPIC_SUPPORTED_MODELS)).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
    expect(intersectModels(null, ANTHROPIC_SUPPORTED_MODELS)).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
  });

  it('a key that can access NOTHING the adapter supports returns empty (honest)', () => {
    expect(intersectModels(['some-other-model'], ANTHROPIC_SUPPORTED_MODELS)).toEqual([]);
  });
});

describe('adapter model/retention exports (§3e, shared with the picker)', () => {
  it('registerProviderAdapter carries the models set + retention class', () => {
    const a = registerProviderAdapter({ id: 'x', retentionClass: 'bounded', models: ANTHROPIC_SUPPORTED_MODELS, call: async () => new Response('') });
    expect(a.models).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
    expect(a.retentionClass).toBe('bounded');
  });
  it('the anthropic retention floor is a valid non-training class', () => {
    expect(['zero', 'bounded']).toContain(ANTHROPIC_RETENTION_CLASS);
  });
});

// ── Layer 2: surveyor-byok verify handler contracts ─────────────────────────
describe('surveyor-byok — verify handler contracts', () => {
  it('gates on account_is_active AND the Surveyor entitlement', () => {
    expect(BYOK).toContain("rpc('account_is_active'");
    expect(BYOK).toContain("rpc('has_surveyor_entitlement'");
  });

  it('refuses gracefully when the user has NO key of their own to verify', () => {
    expect(BYOK).toMatch(/if\s*\(\s*!providerKey\.byok\s*\)/);
    expect(BYOK).toMatch(/No key on file to verify/i);
  });

  it('VERIFY-BY-TEST-CALL then persists health via surveyor_byok_set_health', () => {
    expect(BYOK).toContain('pingAnthropic');
    expect(BYOK).toContain("rpc('surveyor_byok_set_health'");
    // healthy is set only after resp.ok — never presented as healthy unverified
    expect(BYOK).toMatch(/resp\.ok[\s\S]{0,120}setHealth\('healthy'/);
  });

  it('on healthy, returns the key list-models ∩ adapter set for the dropdown', () => {
    expect(BYOK).toContain('listAnthropicModels');
    expect(BYOK).toContain('intersectModels');
    expect(BYOK).toContain('retentionClass');
  });

  it('classifies a provider failure into a §3d graceful refusal', () => {
    expect(BYOK).toContain('classifyProviderError');
    expect(BYOK).toContain('classifyProviderThrow');
    expect(BYOK).toContain('refusalForClass');
  });

  it('verifying a key spends NO credits (no spend/reserve/release in this function)', () => {
    expect(BYOK).not.toContain("rpc('spend_credits'");
    expect(BYOK).not.toContain("rpc('reserve_ai_spend'");
    expect(BYOK).not.toContain("rpc('release_ai_spend_reservation'");
  });

  it('rate-limits the test-call (bounds provider-ping abuse)', () => {
    expect(BYOK).toContain("rpc('consume_ai_generate_rate_limit'");
  });
});

// ── Layer 3: ai-analyst governor + refusal wiring ───────────────────────────
describe('ai-analyst — usage governors + graceful refusals (#29)', () => {
  it('runs the usage precheck BEFORE the credit flow (over-cap spends nothing)', () => {
    const preIdx = ANALYST.indexOf("rpc('surveyor_usage_precheck'");
    const flowIdx = ANALYST.indexOf('runCreditedCall(');
    expect(preIdx).toBeGreaterThan(-1);
    expect(flowIdx).toBeGreaterThan(-1);
    expect(preIdx).toBeLessThan(flowIdx);
  });

  it('a blocked precheck receipts a refused turn (no spend) and returns a graceful refusal', () => {
    // the governor block: refused audit row + a refusalForClass response, no spend_id
    const gov = ANALYST.slice(ANALYST.indexOf("rpc('surveyor_usage_precheck'"), ANALYST.indexOf('runCreditedCall('));
    expect(gov).toMatch(/allowed\s*===\s*false/);
    expect(gov).toContain('refusalForClass');
    expect(gov).toContain('p_refused: true');
    expect(gov).toContain('p_spend_id: null');
    expect(gov).toContain('p_refusal_class');
  });

  it('fails OPEN on a precheck RPC error (the global cap still protects the operator)', () => {
    const gov = ANALYST.slice(ANALYST.indexOf("rpc('surveyor_usage_precheck'"), ANALYST.indexOf('runCreditedCall('));
    // only an explicit allowed===false blocks; an error path logs and proceeds
    expect(gov).toMatch(/allowed\s*===\s*false/);
    expect(gov).not.toMatch(/allowed\s*!==\s*true/); // would wrongly block on RPC hiccup
  });

  it('classifies a provider error into key-health (BYOK) and a graceful refusal', () => {
    expect(ANALYST).toContain('classifyProviderError');
    expect(ANALYST).toContain('applyProviderError');
    // health write is gated on the BYOK flag (never for the shared server key)
    expect(ANALYST).toMatch(/providerKey\.byok\s*&&\s*health/);
    expect(ANALYST).toContain("rpc('surveyor_byok_set_health'");
  });

  it('records the refusal_class on the audit row', () => {
    expect(ANALYST).toContain('p_refusal_class: capturedRefusalClass');
  });
});
