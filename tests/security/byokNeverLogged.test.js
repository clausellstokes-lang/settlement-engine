/**
 * tests/security/byokNeverLogged.test.js — the BYOK NEVER-LOGGED scan (S1,
 * DESIGN_AI_CONTROL_SURFACE §3). The user's decrypted provider key must NEVER reach a
 * log line, a telemetry sink, the aiOperationLog, or any corpus. A stray log of the key
 * would defeat the whole vault, so this is a structural scan pinned in the gate.
 *
 * It asserts, by construction:
 *   1. The decrypted-key carriers (`providerKey.key`, the byok RPC `data`, the raw
 *      `key` returned by resolveProviderKey) never appear on a logging/telemetry sink
 *      line (console.*, logError, .insert, write_ai_operation_log).
 *   2. The BYOK boolean flag (`providerKey.byok`) is fine to log — only the KEY is
 *      forbidden.
 *   3. The migration grants surveyor_byok_get (the plaintext decrypt) to service_role
 *      ONLY — never authenticated/public.
 *   4. The ai_operation_log audit table carries NO key column.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const AI_DIR = join(ROOT, 'supabase/functions/ai-analyst');

const SINK_RE = /console\.\w+\(|logError\(|\.insert\(|write_ai_operation_log|ai_usage_events\b/;
// The decrypted-key carriers. `providerKey.byok` (the boolean) is deliberately excluded
// — only the KEY material is forbidden on a sink.
const KEY_CARRIER_RE = /providerKey\.key\b|resolveProviderKey|surveyor_byok_get|pgp_sym_decrypt/;

function lines(path) {
  return readFileSync(path, 'utf8').split('\n');
}

describe('BYOK — the decrypted key is never logged', () => {
  for (const file of ['byok.ts', 'index.ts']) {
    it(`${file}: no log/telemetry sink line references the decrypted key`, () => {
      const offenders = [];
      lines(join(AI_DIR, file)).forEach((line, i) => {
        if (SINK_RE.test(line) && KEY_CARRIER_RE.test(line)) offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      });
      expect(offenders).toEqual([]);
    });
  }

  it('byok.ts: the key is returned for the provider call, never console/logError-ed', () => {
    const src = readFileSync(join(AI_DIR, 'byok.ts'), 'utf8');
    // The only place `data` (the decrypted plaintext) is used is the return value.
    expect(/console\.\w+\([^)]*\bdata\b/.test(src)).toBe(false);
    expect(/logError\([^)]*\bdata\b/.test(src)).toBe(false);
    // The onLookupError note must be a keyless string literal (no interpolation of data/key).
    expect(/onLookupError\([`'"][^`'"]*\$\{/.test(src)).toBe(false);
  });

  it('index.ts: the aiOperationLog write args carry hashes/flags — never the key', () => {
    const src = readFileSync(join(AI_DIR, 'index.ts'), 'utf8');
    const call = src.slice(src.indexOf('write_ai_operation_log'), src.indexOf('write_ai_operation_log') + 900);
    expect(call).not.toContain('providerKey.key');
    expect(call).not.toContain('apiKey');
    // it DOES record the byok boolean flag (which key path was used) — that is safe.
    expect(call).toContain('p_byok: providerKey.byok');
  });

  it('index.ts: the ai_usage_events meter carries token counts — never the key', () => {
    const src = readFileSync(join(AI_DIR, 'index.ts'), 'utf8');
    const meterStart = src.indexOf('ai_usage_events');
    const meter = src.slice(meterStart, meterStart + 700);
    expect(meter).not.toContain('providerKey.key');
    expect(meter).not.toContain('apiKey');
  });

  it('migration 139: surveyor_byok_get (plaintext decrypt) is granted to service_role ONLY', () => {
    const mig = readFileSync(join(ROOT, 'supabase/migrations/139_surveyor_entitlement_and_byok.sql'), 'utf8');
    expect(mig).toContain('grant execute on function public.surveyor_byok_get(uuid, text) to service_role');
    expect(mig).toContain('revoke all on function public.surveyor_byok_get(uuid, text) from public');
    // never granted to authenticated (a user must not read their own plaintext back)
    expect(/grant execute on function public\.surveyor_byok_get\([^)]*\) to authenticated/.test(mig)).toBe(false);
    // the ciphertext table is RLS-on with no select policy (never selectable)
    expect(mig).toContain('alter table public.surveyor_byok_keys enable row level security');
    expect(/create policy[^;]*on public\.surveyor_byok_keys[^;]*for select/i.test(mig)).toBe(false);
  });

  it('migration 138: the aiOperationLog table carries NO key column', () => {
    const mig = readFileSync(join(ROOT, 'supabase/migrations/138_ai_operation_log.sql'), 'utf8');
    const table = mig.slice(mig.indexOf('create table'), mig.indexOf(');'));
    expect(/\bkey\b/i.test(table.replace(/primary key/gi, ''))).toBe(false);
    expect(/api_key|secret|token|ciphertext/i.test(table)).toBe(false);
  });
});

// ── BYOK MANAGEMENT SURFACE (#29): the verify edge + key-health writes ──────────────
describe('BYOK — the key never leaks through the management surface (#29)', () => {
  // .rpc( is a sink here: the surveyor-byok verify path writes key HEALTH via an RPC and
  // must pass only class/flags, never the key material.
  const SINK_RE2 = /console\.\w+\(|logError\(|\.insert\(|\.rpc\(|write_ai_operation_log|surveyor_byok_set_health|ai_usage_events\b/;
  const KEY_RE2 = /providerKey\.key\b|\bapiKey\b|surveyor_byok_get|pgp_sym_decrypt/;

  it('surveyor-byok/index.ts: no log/telemetry/rpc sink line references the decrypted key', () => {
    const offenders = [];
    readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/index.ts'), 'utf8')
      .split('\n').forEach((line, i) => {
        if (SINK_RE2.test(line) && KEY_RE2.test(line)) offenders.push(`${i + 1}: ${line.trim()}`);
      });
    expect(offenders).toEqual([]);
  });

  it('surveyor-byok: surveyor_byok_set_health is called with class/flags only — never the key', () => {
    const src = readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/index.ts'), 'utf8');
    const idx = src.indexOf('surveyor_byok_set_health');
    const call = src.slice(idx, idx + 400);
    expect(call).not.toContain('providerKey.key');
    expect(call).not.toContain('apiKey');
  });

  it('ai-analyst: the BYOK health-write on a provider error carries no key', () => {
    const src = readFileSync(join(AI_DIR, 'index.ts'), 'utf8');
    const idx = src.indexOf('surveyor_byok_set_health');
    expect(idx).toBeGreaterThan(-1);
    const call = src.slice(idx, idx + 400);
    expect(call).not.toContain('providerKey.key');
    expect(call).not.toContain('apiKey');
  });

  it('providerErrors.ts: the pure classifier is Deno-global-free and never names a key', () => {
    const src = readFileSync(join(AI_DIR, 'providerErrors.ts'), 'utf8');
    expect(/\bDeno\./.test(src)).toBe(false);
    expect(/apiKey|providerKey|pgp_sym|surveyor_byok_get/.test(src)).toBe(false);
  });
});
