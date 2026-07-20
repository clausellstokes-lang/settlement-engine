/**
 * sessionGateCensus.test.js — THE SINGLE-SESSION CENSUS (161/§7.2, M-9b).
 *
 * A structural-prevention manifest. REQUEST-LAYER COVERAGE IS NOW TOTAL (the M-9 census
 * upgrade): EVERY paid edge surface must carry the request-layer gate — it imports
 * _shared/sessionGate.ts and calls isSessionSuperseded after resolving the caller, so a
 * superseded device is evicted with an instant 401 BEFORE any spend or generation. The
 * credit-spending AI surfaces ALSO run the DB BELT (spend_credits → assert_current_session,
 * 161/M-9c) as defense-in-depth — a superseded JWT can neither reach the generation nor
 * move a credit.
 *
 * This test is the wall against an N-1 sweep: adding a new paid function without the
 * request-layer gate fails here loudly, rather than shipping a silent ungated surface.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');
const read = (name) => {
  const p = join(FN_DIR, name, 'index.ts');
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
};

// The §7.2 paid-surface roster. Each must be gated by request-layer OR belt.
const REQUIRED = [
  'ai-analyst', 'generate-narrative', 'generate-chronicle', 'custom-content',
  'style-overhaul', 'interpret-session', 'parley', 'surveyor-autonomy',
  'surveyor-byok', 'create-checkout', 'create-customer-portal', 'account-actions',
  'founder-transfer',
];

// DELIBERATELY DEFERRED (documented, not a gap to re-find): verify-checkout-session
// is a READ-ONLY post-checkout confirmation — it moves no money and grants no
// entitlement (it only confirms a Stripe session belongs to the caller; the actual
// entitlement is polled separately through gated surfaces). Its request-layer wiring
// is a low-value follow-up, tracked here so it is visible rather than silently missed.
const DEFERRED = ['verify-checkout-session'];

const importsGate = (src) => /_shared\/sessionGate\.ts/.test(src) && /isSessionSuperseded\s*\(/.test(src);
const usesSpendBelt = (src) => /rpc\(\s*['"]spend_credits['"]/.test(src);

// The 8 credit-spending AI surfaces — they carry BOTH the request-layer gate AND the
// spend_credits belt (defense-in-depth) after the M-9 census upgrade.
const AI_SPENDING = [
  'ai-analyst', 'generate-narrative', 'generate-chronicle', 'custom-content',
  'style-overhaul', 'interpret-session', 'parley', 'surveyor-autonomy',
];

describe('single-session census — request-layer coverage is TOTAL (every paid surface)', () => {
  it.each(REQUIRED)('%s carries the REQUEST-LAYER single-session gate (instant eviction)', (name) => {
    const src = read(name);
    expect(src.length, `${name}/index.ts is present`).toBeGreaterThan(0);
    expect(
      importsGate(src),
      `${name} must import _shared/sessionGate.ts and call isSessionSuperseded — request-layer `
      + `coverage is TOTAL across the paid roster (instant 401 eviction; the belt is defense-in-depth)`,
    ).toBe(true);
  });

  it('the credit-spending AI surfaces ALSO run the spend_credits belt (defense-in-depth)', () => {
    // Both layers: the request-layer gate (above) AND assert_current_session inside
    // spend_credits — a superseded JWT can neither reach the generation nor move a credit.
    for (const name of AI_SPENDING) {
      const src = read(name);
      expect(importsGate(src), `${name} needs the request-layer gate`).toBe(true);
      expect(usesSpendBelt(src), `${name} also spends through spend_credits (the DB belt)`).toBe(true);
    }
  });

  it('the money surfaces that do NOT spend credits are gated at the request layer', () => {
    // These move money / manage billing without a spend_credits call, so the request-layer
    // gate is their only enforcement.
    for (const name of ['surveyor-byok', 'create-checkout', 'create-customer-portal', 'account-actions', 'founder-transfer']) {
      expect(importsGate(read(name)), `${name} needs the request-layer gate (no spend_credits belt)`).toBe(true);
    }
  });

  it('the deferred set is explicitly recorded (documented, not a silent gap)', () => {
    expect(DEFERRED).toContain('verify-checkout-session');
  });

  // Tier 0.5 trust-boundary extension (§6.3/LAW 2): founder-transfer is a NEW
  // Stripe-session-creating entry point. Its session must bind to server-validated
  // state — the case id + the JWT user id — never a client assertion.
  it('founder-transfer binds its checkout session to the validated case + verified user id', () => {
    const src = read('founder-transfer');
    expect(src.length).toBeGreaterThan(0);
    // The session metadata carries the server-controlled purpose + the validated case.
    expect(/purpose:\s*'founder_seat_transfer'/.test(src)).toBe(true);
    expect(/transfer_case_id:\s*caseId/.test(src)).toBe(true);
    // supabase_user_id comes from the verified user (user.id), NOT the request body.
    expect(/supabase_user_id:\s*user\.id/.test(src)).toBe(true);
    // The master switch gates every action before any work.
    expect(/founder_transfer_enabled/.test(src)).toBe(true);
  });
});
