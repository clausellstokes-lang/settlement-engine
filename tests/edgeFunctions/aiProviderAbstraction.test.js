/**
 * aiProviderAbstraction.test.js — the AI-provider abstraction + switch-wiring
 * + safety-wiring contract suite.
 *
 * Two layers, both real:
 *
 *  1. RUNTIME behaviour of the pure abstraction helpers. The edge function is
 *     Deno TS that vitest can't import wholesale, so we EXTRACT the genuine
 *     source of the pure functions (normalizeProviderUsage, isProviderDownError,
 *     PEER_FALLBACK_PREFERENCE, estimateTokens), transpile them, and execute
 *     them — exercising the production logic, not a reimplementation. This
 *     proves the abstraction normalizes BOTH providers' usage shapes.
 *
 *  2. STRUCTURAL contracts the handler source must satisfy (the regressions
 *     that cost money or break the trust boundary): spend_credits is called
 *     exactly once, the spend cap is checked BEFORE the spend and fails closed,
 *     the rate limit is checked, the model preference is resolved server-side
 *     (not from the request body), and metering is persisted via the admin
 *     client. Mirrors the existing contracts.test.js source-inspection style.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const NARRATIVE = join(ROOT, 'supabase', 'functions', 'generate-narrative', 'index.ts');
const CHRONICLE = join(ROOT, 'supabase', 'functions', 'generate-chronicle', 'index.ts');

const src = readFileSync(NARRATIVE, 'utf8');
const chronicleSrc = readFileSync(CHRONICLE, 'utf8');

/** Pull a named declaration (function or const) verbatim from the TS source. */
function extractDecl(source, signature, endMarker) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`could not find: ${signature}`);
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error(`could not find end marker after: ${signature}`);
  return source.slice(start, end + endMarker.length);
}

// ── Layer 1: real runtime behaviour of the pure helpers ─────────────────────
describe('provider abstraction — normalizes both providers\' usage shapes', () => {
  let mod;

  beforeAll(() => {
    // Assemble a self-contained TS snippet from the ACTUAL source of the pure
    // functions, transpile to JS, and eval into a module object.
    const estimateTokens = extractDecl(src, 'function estimateTokens', '}\n');
    const normalize = extractDecl(src, 'function normalizeProviderUsage', '\n}');
    const peerMap = extractDecl(src, 'const PEER_FALLBACK_PREFERENCE', '};');
    const isDown = extractDecl(src, 'function isProviderDownError', '\n}');

    const snippet = `
      ${estimateTokens}
      ${normalize}
      ${peerMap}
      ${isDown}
      export { estimateTokens, normalizeProviderUsage, PEER_FALLBACK_PREFERENCE, isProviderDownError };
    `;
    const js = ts.transpileModule(snippet, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText;
    const exports = {};
    new Function('exports', js)(exports);
    mod = exports;
  });

  it('captures REAL Anthropic usage (input_tokens/output_tokens) — not estimated', () => {
    const u = mod.normalizeProviderUsage({ input_tokens: 1234, output_tokens: 567 }, 'prompt', 'out');
    expect(u).toEqual({ inputTokens: 1234, outputTokens: 567, estimated: false });
  });

  it('captures REAL OpenAI Responses usage (same field names, different envelope)', () => {
    const u = mod.normalizeProviderUsage({ input_tokens: 80, output_tokens: 20, total_tokens: 100 }, 'p', 'o');
    expect(u).toEqual({ inputTokens: 80, outputTokens: 20, estimated: false });
  });

  it('accepts the OpenAI Chat-style spelling (prompt_tokens/completion_tokens)', () => {
    const u = mod.normalizeProviderUsage({ prompt_tokens: 40, completion_tokens: 10 }, 'p', 'o');
    expect(u).toEqual({ inputTokens: 40, outputTokens: 10, estimated: false });
  });

  it('falls back to the len/4 floor (estimated:true) when usage is absent', () => {
    const prompt = 'x'.repeat(400);  // → 100 tokens
    const output = 'y'.repeat(40);   // → 10 tokens
    const u = mod.normalizeProviderUsage(undefined, prompt, output);
    expect(u).toEqual({ inputTokens: 100, outputTokens: 10, estimated: true });
  });

  it('partial usage (only one side reported) is treated as estimated', () => {
    const u = mod.normalizeProviderUsage({ input_tokens: 500 }, 'p', 'yyyy');
    expect(u.estimated).toBe(true);
    expect(u.inputTokens).toBe(500);        // keeps the real side
    expect(u.outputTokens).toBe(1);         // estimates the missing side (len 4 → 1)
  });
});

describe('provider routing — peer fallback only on provider-down', () => {
  let mod;
  beforeAll(() => {
    const peerMap = extractDecl(src, 'const PEER_FALLBACK_PREFERENCE', '};');
    const isDown = extractDecl(src, 'function isProviderDownError', '\n}');
    const js = ts.transpileModule(
      `${peerMap}\n${isDown}\nexport { PEER_FALLBACK_PREFERENCE, isProviderDownError };`,
      { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
    ).outputText;
    const exports = {};
    new Function('exports', js)(exports);
    mod = exports;
  });

  it('maps each preference to a CROSS-provider peer (not same-provider)', () => {
    // Anthropic prefs fall back to OpenAI and vice-versa.
    expect(mod.PEER_FALLBACK_PREFERENCE.anthropic_claude_opus_4_8).toMatch(/^openai_/);
    expect(mod.PEER_FALLBACK_PREFERENCE.openai_gpt_5_2).toMatch(/^anthropic_/);
    expect(mod.PEER_FALLBACK_PREFERENCE.anthropic_claude_haiku_4_5).toMatch(/^openai_/);
    expect(mod.PEER_FALLBACK_PREFERENCE.openai_gpt_5_mini).toMatch(/^anthropic_/);
  });

  it('classifies provider-DOWN errors (5xx, 429, timeout, unconfigured, network)', () => {
    expect(mod.isProviderDownError(new Error('AI API error: 503 overloaded'))).toBe(true);
    expect(mod.isProviderDownError(new Error('AI API error: 500 boom'))).toBe(true);
    expect(mod.isProviderDownError(new Error('AI API error: 429 slow down'))).toBe(true);
    expect(mod.isProviderDownError(new Error('OpenAI API key is not configured'))).toBe(true);
    const abort = new Error('aborted'); abort.name = 'AbortError';
    expect(mod.isProviderDownError(abort)).toBe(true);
    const net = new Error('fetch failed'); net.name = 'TypeError';
    expect(mod.isProviderDownError(net)).toBe(true);
  });

  it('does NOT classify content errors as provider-down (no silent peer double-bill)', () => {
    expect(mod.isProviderDownError(new Error('Invalid JSON from model: bad'))).toBe(false);
    expect(mod.isProviderDownError(new Error('AI API error: 400 bad request'))).toBe(false);
    expect(mod.isProviderDownError(new Error('Empty response'))).toBe(false);
  });
});

// ── Layer 2: handler source contracts (money + trust boundary) ──────────────
describe('generate-narrative — single spend + safety ordering contracts', () => {
  it('calls spend_credits EXACTLY ONCE (no double-debit)', () => {
    const matches = src.match(/\.rpc\(\s*['"]spend_credits['"]/g) || [];
    expect(matches.length).toBe(1);
  });

  it('checks the spend cap BEFORE spending credits (capped window never debits)', () => {
    const capIdx = src.indexOf("rpc('check_ai_spend_cap')");
    const spendIdx = src.indexOf("rpc('spend_credits'");
    expect(capIdx).toBeGreaterThan(-1);
    expect(spendIdx).toBeGreaterThan(-1);
    expect(capIdx).toBeLessThan(spendIdx);
  });

  it('cap check FAILS CLOSED — blocks on non-true allowed', () => {
    // The handler must gate on `=== true` (capAllowed), never `=== false`, so
    // an RPC error / unexpected shape blocks rather than admits, then throw on
    // !capAllowed.
    expect(src).toMatch(/capAllowed\s*=[\s\S]{0,80}allowed\s*===\s*true/);
    expect(src).toMatch(/if\s*\(\s*!capAllowed\s*\)/);
  });

  it('checks the per-user rate limit', () => {
    expect(src).toContain("rpc('consume_ai_generate_rate_limit'");
  });

  it('rate limit FAILS OPEN — an RPC error logs and proceeds (does not block)', () => {
    // The rate-limit branch must only reject on an explicit allowed===false,
    // not on rlErr. Assert the explicit-false gate exists.
    expect(src).toMatch(/consume_ai_generate_rate_limit[\s\S]{0,400}allowed[^)]*===\s*false/);
  });

  it('resolves model preference SERVER-SIDE, not from the request body', () => {
    // selection comes from resolveModelPreference(admin, user.id); the body
    // value is explicitly voided.
    expect(src).toContain('resolveModelPreference(supabaseAdmin, user.id)');
    expect(src).toContain('void modelPreference;');
    // The selector must be the server-resolved value, NOT the old trusted-body
    // path `selectedModelPreference = normalizeModelPreference(modelPreference)`.
    expect(src).not.toMatch(/selectedModelPreference\s*=\s*normalizeModelPreference\(\s*modelPreference\s*\)/);
    expect(src).toMatch(/selectedModelPreference\s*=\s*await\s+resolveModelPreference/);
  });

  it('resolveModelPreference order: forced override → profile → global default → built-in', () => {
    const fn = src.slice(src.indexOf('async function resolveModelPreference'));
    expect(fn).toContain('forced_override');
    expect(fn).toContain("from('profiles')");
    expect(fn).toContain('global_default');
    expect(fn).toContain('DEFAULT_MODEL_PREFERENCE');
  });

  it('persists COGS to ai_usage_events via the admin client (service-role write)', () => {
    expect(src).toContain("from('ai_usage_events').insert");
    expect(src).toContain('persistAiUsageEvents(supabaseAdmin, user.id, spendId, usageTelemetry)');
  });

  it('metering write is best-effort — wrapped so it cannot fail the stream', () => {
    const fn = src.slice(src.indexOf('async function persistAiUsageEvents'));
    expect(fn).toMatch(/try\s*\{/);
    expect(fn).toContain('logError');
  });
});

describe('generate-chronicle — secondary seam shares the safety layer', () => {
  it('checks the shared spend cap (fail-closed) before spending', () => {
    const capIdx = chronicleSrc.indexOf("rpc('check_ai_spend_cap')");
    const spendIdx = chronicleSrc.indexOf("rpc('spend_credits'");
    expect(capIdx).toBeGreaterThan(-1);
    expect(spendIdx).toBeGreaterThan(-1);
    expect(capIdx).toBeLessThan(spendIdx);
    expect(chronicleSrc).toMatch(/allowed[^)]*!==\s*true/);
  });

  it('checks the shared per-user rate limit', () => {
    expect(chronicleSrc).toContain("rpc('consume_ai_generate_rate_limit'");
  });

  it('still calls spend_credits exactly once', () => {
    const matches = chronicleSrc.match(/\.rpc\(\s*['"]spend_credits['"]/g) || [];
    expect(matches.length).toBe(1);
  });

  it('meters its Anthropic call into ai_usage_events', () => {
    expect(chronicleSrc).toContain("from('ai_usage_events').insert");
  });
});
