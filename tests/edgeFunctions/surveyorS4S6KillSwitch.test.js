/**
 * tests/edgeFunctions/surveyorS4S6KillSwitch.test.js — the S4–S6 write stages wire the
 * PER-STAGE KILL-SWITCH fail-closed, before any spend (DESIGN_AI_CONTROL_SURFACE §2b).
 *
 * The full handlers cannot be imported (index.ts has a top-level remote `serve` import —
 * the house pattern for edge shells); the money/auth path is proven by the shared creditFlow
 * pin + these source-anchored assertions (mirrors surveyorKillSwitch.test.js for S1/S3).
 *
 * Green-as-the-lane-builds: a stage whose edge fn is not yet present is SKIPPED; the
 * completeness test tightens to all four once the lane's last stage lands.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Each S4–S6 write stage: its edge fn dir + the stage key it must gate on.
const STAGES = [
  { fn: 'custom-content', stage: 'customContent' },
  { fn: 'style-overhaul', stage: 'styleOverhaul' },
  { fn: 'construct-settlement', stage: 'constructSettlement' },
  { fn: 'construct-realm', stage: 'constructRealm' },
];

const pathFor = (fn) => resolve(process.cwd(), `supabase/functions/${fn}/index.ts`);
const built = STAGES.filter((s) => existsSync(pathFor(s.fn)));

for (const { fn, stage } of built) {
  describe(`kill-switch — ${fn} wires it fail-closed, before any spend`, () => {
    const src = readFileSync(pathFor(fn), 'utf8');

    it(`consults surveyor_stage_enabled('${stage}') and guards with isStageEnabled`, () => {
      expect(src).toContain('surveyor_stage_enabled');
      expect(src).toContain(`'${stage}'`);
      expect(src).toContain('isStageEnabled(stageData)');
      expect(src).toContain('killSwitchRefusal');
    });

    it('the kill-switch check runs AFTER the entitlement gate and BEFORE the credit reserve/spend', () => {
      const entitlementAt = src.indexOf("rpc('has_surveyor_entitlement'");
      const killSwitchAt = src.indexOf("rpc('surveyor_stage_enabled'");
      const reserveAt = src.indexOf("rpc('reserve_ai_spend'");
      const spendAt = src.indexOf("rpc('spend_credits'");
      expect(entitlementAt).toBeGreaterThan(-1);
      expect(killSwitchAt).toBeGreaterThan(entitlementAt);
      expect(reserveAt).toBeGreaterThan(killSwitchAt);
      expect(spendAt).toBeGreaterThan(killSwitchAt);
    });

    it('carries the §2b honest early-access register + botGuard', () => {
      expect(src).toContain('earlyAccess');
      expect(src).toContain('botGuard');
    });
  });
}

describe('S4–S6 kill-switch coverage', () => {
  it('ALL FOUR write stages are present and each wires the kill-switch fail-closed', () => {
    // The lane's last stage (construct-realm) has landed — completeness is now strict: every
    // S4–S6 write stage must exist and have been exercised by the per-stage suites above.
    expect(built.length).toBe(STAGES.length);
  });
});
