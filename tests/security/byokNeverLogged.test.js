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
import { sinkStatementOffenders, sinkLineOffendersBlind } from '../helpers/sourceContract.js';

const ROOT = resolve(process.cwd());
const AI_DIR = join(ROOT, 'supabase/functions/ai-analyst');

const SINK_RE = /console\.\w+\(|logError\(|\.insert\(|write_ai_operation_log|ai_usage_events\b/;
// The decrypted-key carriers. `providerKey.byok` (the boolean) is deliberately excluded
// — only the KEY material is forbidden on a sink.
const KEY_CARRIER_RE = /providerKey\.key\b|resolveProviderKey|surveyor_byok_get|pgp_sym_decrypt/;

describe('BYOK — the decrypted key is never logged', () => {
  for (const file of ['byok.ts', 'index.ts']) {
    it(`${file}: no log/telemetry sink STATEMENT references the decrypted key`, () => {
      // STATEMENT-granular, never per physical line. A per-line conjunction requires
      // the sink and the key carrier to appear on ONE line, and prettier's multi-line
      // call form — the LIKELY shape for a long argument list, which is exactly the
      // shape a leaked secret travels in — puts them on different lines. The window
      // is bounded by the call's own brackets, so it restores the dimension without
      // widening the claim into a neighbouring statement.
      const offenders = sinkStatementOffenders(
        readFileSync(join(AI_DIR, file), 'utf8'), SINK_RE, KEY_CARRIER_RE, file,
      );
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
    // DELIBERATELY UNANCHORED (negative-presence): must catch a future re-creation at
    // ANY indentation — this corpus legally mints indented policies/triggers (005:69
    // DO-block EXECUTE; 003:65/004:49 DO-block DDL). Pinned in
    // netCurrentExtractorAnchor.walker FROZEN_UNANCHORED — do not "fix".
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

  it('surveyor-byok/index.ts: no log/telemetry/rpc sink STATEMENT references the decrypted key', () => {
    // THE SAME CURE, THE SAME LAW. This management surface carried the identical
    // per-physical-line conjunction as the ai-analyst loop above, so curing only the
    // loop would have left the BYOK management path blind to the exact prettier form
    // the cure exists to catch — and the anti-vacuity fold's same-line rule would
    // then convict a file this train had just "fixed".
    const offenders = sinkStatementOffenders(
      readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/index.ts'), 'utf8'),
      SINK_RE2, KEY_RE2, 'surveyor-byok/index.ts',
    );
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

// ── ANTI-VACUITY CONTROLS (§75 idiom) ──────────────────────────────────────────────
// ⛔ THE SCANS ABOVE ASSERT A UNIVERSALLY QUANTIFIED NEGATIVE, so a green run proves
// nothing on its own: an offender list is empty both when the estate is clean and
// when the scan has gone blind. These arms make the difference observable. The
// discriminating pair is the whole point — the multi-line fixture MUST be caught by
// the statement scan and MUST be missed by the per-physical-line shape the cure
// replaced. If a future edit narrows the window back to one line, the first arm reds
// and the second one names exactly what was lost.
describe('BYOK — the never-logged scan is statement-granular (anti-vacuity controls)', () => {
  // Prettier's own output shape for a call whose arguments do not fit one line.
  const MULTILINE_OFFENDER = [
    'const safe = 1;',
    'console.log(',
    '  "byok lookup failed",',
    '  providerKey.key,',
    ');',
  ].join('\n');
  const SINGLE_LINE_OFFENDER = 'console.log("byok", providerKey.key);';
  // A sink and a carrier that genuinely never meet: two separate statements.
  const CLEAN_SOURCE = [
    'console.log("no secret here");',
    'const material = providerKey.key;',
  ].join('\n');

  it('POSITIVE CONTROL — a sink whose key argument sits on a LATER line is caught', () => {
    const offenders = sinkStatementOffenders(MULTILINE_OFFENDER, SINK_RE, KEY_CARRIER_RE, 'fixture.ts');
    expect(offenders).toHaveLength(1);
    expect(offenders[0]).toContain('fixture.ts:2');
    expect(offenders[0]).toContain('console.log(');
  });

  it('MUTANT CONTROL — the pre-cure per-physical-line scan MISSES that same fixture', () => {
    // This is the defect, executed. It is what makes the arm above discriminating
    // rather than decorative, and it is why the cure is not cosmetic.
    expect(sinkLineOffendersBlind(MULTILINE_OFFENDER, SINK_RE, KEY_CARRIER_RE)).toEqual([]);
  });

  it('POSITIVE CONTROL — the single-line dimension the old scan already had survives', () => {
    const offenders = sinkStatementOffenders(SINGLE_LINE_OFFENDER, SINK_RE, KEY_CARRIER_RE, 'fixture.ts');
    expect(offenders).toHaveLength(1);
    expect(offenders[0]).toContain('fixture.ts:1');
    // …and the blind shape DOES catch this one, so the mutant control above is
    // proving a real difference and not simply that the blind scan never fires.
    expect(sinkLineOffendersBlind(SINGLE_LINE_OFFENDER, SINK_RE, KEY_CARRIER_RE)).toHaveLength(1);
  });

  it('NEGATIVE CONTROL — a sink and a carrier in SEPARATE statements are not flagged', () => {
    // The window must be bounded by the statement, or the cure would trade a blind
    // spot for a false-positive machine and get narrowed back within a wave.
    expect(sinkStatementOffenders(CLEAN_SOURCE, SINK_RE, KEY_CARRIER_RE, 'fixture.ts')).toEqual([]);
  });

  it('FAIL-CLOSED — an empty source throws instead of reporting a clean scan', () => {
    // "no offenders" and "nothing was scanned" must never be the same value.
    expect(() => sinkStatementOffenders('', SINK_RE, KEY_CARRIER_RE, 'fixture.ts')).toThrow(/empty or not a string/);
  });
});
