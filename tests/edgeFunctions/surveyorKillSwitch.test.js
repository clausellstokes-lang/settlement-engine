/**
 * tests/edgeFunctions/surveyorKillSwitch.test.js — the PER-STAGE KILL-SWITCH pins
 * (DESIGN_AI_CONTROL_SURFACE §2b). Launch-whole ships every write stage behind a
 * server-side kill-switch; this proves the FAIL-CLOSED contract at the pure-helper level
 * (Deno-testable, remote-import-free) AND that the edge functions wire it BEFORE any spend.
 *
 * (The full handler cannot be imported here — index.ts has a top-level remote `serve`
 * import, exactly like ai-analyst; the money/auth path is proven by the shared creditFlow
 * pin + these source-anchored assertions, the house pattern for the edge shells.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isStageEnabled, killSwitchRefusal } from '../../supabase/functions/_shared/surveyorStage.ts';

describe('kill-switch — fail-closed helper (§2b)', () => {
  it('isStageEnabled is TRUE only for the literal boolean true (fail-closed)', () => {
    expect(isStageEnabled(true)).toBe(true);
    // a disabled stage, an errored/absent RPC, and every non-true value read as NOT enabled
    for (const v of [false, null, undefined, 0, 1, '', 'true', 'enabled', {}, []]) {
      expect(isStageEnabled(v), `${JSON.stringify(v)} must not enable`).toBe(false);
    }
  });

  it('killSwitchRefusal names the paused stage + offers a live door (never a dead end)', () => {
    const r = killSwitchRefusal('interpret');
    expect(r.refused).toBe(true);
    expect(r.stage).toBe('interpret');
    expect(r.refusalClass).toBe('stage_disabled');
    expect(r.message).toContain('interpret');       // names the boundary (§3d)
    expect(r.doors.length).toBeGreaterThan(0);       // always a next step
    expect(r.doors).toContain('ask_readonly');       // the analyst still reads the same world
    // degrades gracefully on a missing stage name
    expect(killSwitchRefusal('').stage).toBe('this feature');
  });
});

describe('kill-switch — the edge wires it fail-closed, before any spend', () => {
  const interpretSrc = readFileSync(resolve(process.cwd(), 'supabase/functions/interpret-session/index.ts'), 'utf8');

  it('interpret-session consults surveyor_stage_enabled and guards with isStageEnabled', () => {
    expect(interpretSrc).toContain("surveyor_stage_enabled");
    expect(interpretSrc).toContain('isStageEnabled(stageData)');
    expect(interpretSrc).toContain('killSwitchRefusal');
  });

  it('the kill-switch check runs AFTER the entitlement gate and BEFORE the credit reserve', () => {
    // anchor on the actual .rpc() CALL SITES (code only), not the bare symbol (which also
    // appears in the header doc-comment).
    const entitlementAt = interpretSrc.indexOf("rpc('has_surveyor_entitlement'");
    const killSwitchAt = interpretSrc.indexOf("rpc('surveyor_stage_enabled'");
    const reserveAt = interpretSrc.indexOf("rpc('reserve_ai_spend'");
    expect(entitlementAt).toBeGreaterThan(0);
    expect(killSwitchAt).toBeGreaterThan(entitlementAt);   // gated behind entitlement
    expect(reserveAt).toBeGreaterThan(killSwitchAt);        // fail-closed BEFORE any money moves
  });

  it('interpret-session reuses the shared S1 money/BYOK/refusal machinery (no duplication)', () => {
    expect(interpretSrc).toContain("from '../ai-analyst/creditFlow.ts'");
    expect(interpretSrc).toContain("from '../ai-analyst/byok.ts'");
    expect(interpretSrc).toContain("from '../ai-analyst/providerErrors.ts'");
    expect(interpretSrc).toContain("from '../ai-analyst/analystCore.ts'");
    // the interpret task class + DM-only audience
    expect(interpretSrc).toContain("INTERPRET_FEATURE = 'interpret'");
    expect(interpretSrc).toContain('routeWorldDataAdapter');   // §3e retention floor
  });

  it('the botGuard result is consumed (validate:edge contract) and the packet carries the canary', () => {
    expect(interpretSrc).toContain('guard.reject');
    expect(interpretSrc).toContain('accountCanary');
  });
});

describe('kill-switch — the parley edge wires it fail-closed, before any spend', () => {
  const parleySrc = readFileSync(resolve(process.cwd(), 'supabase/functions/parley/index.ts'), 'utf8');

  it('parley consults surveyor_stage_enabled(parley) and guards fail-closed before reserve', () => {
    expect(parleySrc).toContain("PARLEY_STAGE = 'parley'");
    expect(parleySrc).toContain('isStageEnabled(stageData)');
    expect(parleySrc).toContain('killSwitchRefusal');
    const killSwitchAt = parleySrc.indexOf("rpc('surveyor_stage_enabled'");
    const entitlementAt = parleySrc.indexOf("rpc('has_surveyor_entitlement'");
    const reserveAt = parleySrc.indexOf("rpc('reserve_ai_spend'");
    expect(killSwitchAt).toBeGreaterThan(entitlementAt);
    expect(reserveAt).toBeGreaterThan(killSwitchAt);
  });

  it('parley reuses the shared money/BYOK/refusal machinery + is DM-only, musings-only', () => {
    expect(parleySrc).toContain("from '../ai-analyst/creditFlow.ts'");
    expect(parleySrc).toContain("from '../ai-analyst/byok.ts'");
    expect(parleySrc).toContain("PARLEY_FEATURE = 'parley'");
    expect(parleySrc).toContain('routeWorldDataAdapter');   // §3e retention floor
    expect(parleySrc).toContain('compileParley');
    // musings-only: the response returns speech + musings, never an ops array
    expect(parleySrc).not.toContain('interpretation:');     // no compiler output here
    expect(parleySrc).toContain('guard.reject');
    expect(parleySrc).toContain('accountCanary');
  });
});
