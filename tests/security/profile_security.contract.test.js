/**
 * tests/security/profile_security.contract.test.js — Tier 0.6 contract.
 *
 * The actual escalation-prevention assertions live in pgTAP SQL at
 * supabase/tests/profile_security.sql and must be executed against a
 * real Postgres instance via `supabase test db`. That requires
 * Docker + the Supabase CLI, which we can't assume in every CI lane.
 *
 * This file does the next-best thing: it reads the SQL file and
 * verifies it contains every required assertion. If somebody deletes
 * a check or weakens it, vitest fails immediately even without the
 * Postgres runner.
 *
 * What this DOESN'T verify:
 *   - That migration 009 is actually applied (the SQL would error)
 *   - That the policy actually rejects the escalation (the SQL would
 *     report the assertion failure)
 *
 * That's why the SQL file MUST also be run periodically via
 * `supabase test db` — typically pre-deploy. Once a Postgres test job
 * lands in CI, this contract test stays in place as the cheap guard.
 *
 * ── DEMOTED TO THE SECONDARY GUARD (A+ enforcement.6; LT36 car 4) ────────────
 * The three profile RPCs are NOW EXECUTED, in the ordinary `npm run test` and with no
 * Docker: tests/security/profileRpcs.pglite.test.js loads the NET-CURRENT DDL for
 * `update_display_name` (migration 195, not 009 — the redefinition that adds the civility
 * guard), `admin_set_role`, `admin_grant_credits`, `current_user_is_privileged` and
 * `_audit_action` into in-process Postgres and calls them, asserting the trim, both sides
 * of the 64-char cap, the privilege rejections, the audit and ledger writes, and — as a
 * standing suite member rather than a one-off — the MUTATION control that a loosened
 * privilege gate makes those rejections vanish.
 *
 * ⛔ THE GREPS BELOW ARE KEPT, DELIBERATELY, AND THIS IS NOT AN OVERSIGHT. They and the
 * pglite suite guard DIFFERENT ARTIFACTS: pglite guards the MIGRATION DDL (what production
 * runs), while these greps guard supabase/tests/profile_security.sql (the pgTAP superset a
 * pre-deploy `supabase test db` executes, which also covers spend_credits). Deleting them
 * because "it's executed now" would leave the pgTAP file with no guard at all and nobody
 * would notice it hollowing — which is the exact regression
 * tests/security/moneySecurityExecutionFloor.test.js exists to refuse. Each superseded
 * assertion therefore carries an inline pointer instead: it is the cheap secondary guard,
 * and the executed suite is the primary.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SQL_FILE = join(ROOT, 'supabase', 'tests', 'profile_security.sql');

describe('Tier 0.6 — profile_security.sql exists and is runnable', () => {
  it('the pgTAP test file is committed at supabase/tests/profile_security.sql', () => {
    expect(existsSync(SQL_FILE)).toBe(true);
  });

  it('the file wraps every assertion in a transaction it rolls back', () => {
    const sql = readFileSync(SQL_FILE, 'utf8');
    expect(sql).toMatch(/^begin;/m);
    expect(sql).toMatch(/^rollback;/m);
  });

  it('the file declares a plan() count matching its assertions', () => {
    const sql = readFileSync(SQL_FILE, 'utf8');
    const planMatch = sql.match(/select plan\((\d+)\)/);
    expect(planMatch).toBeTruthy();
    const planCount = parseInt(planMatch[1], 10);
    // Count meaningful assertion calls — throws_ok / is / isnt / lives_ok.
    // These are the pgTAP assertion verbs that increment the plan.
    const matches = sql.match(/^\s*select\s+(throws_ok|lives_ok|is|isnt)\s*\(/gm) || [];
    expect(matches.length).toBe(planCount);
  });

  it('calls finish() at the end', () => {
    const sql = readFileSync(SQL_FILE, 'utf8');
    expect(sql).toMatch(/select \* from finish\(\)/);
  });
});

describe('Tier 0.6 — every escalation path is asserted blocked', () => {
  let sql;
  beforeAll(() => { sql = readFileSync(SQL_FILE, 'utf8'); });

  it('asserts direct UPDATE of profiles.role is rejected', () => {
    expect(sql).toMatch(/update public\.profiles set role[^;]*\$\$,\s*null,\s*null,/);
  });

  it('asserts direct UPDATE of profiles.tier is rejected', () => {
    expect(sql).toMatch(/update public\.profiles set tier[^;]*\$\$,\s*null,\s*null,/);
  });

  it('asserts direct UPDATE of profiles.credits is rejected', () => {
    expect(sql).toMatch(/update public\.profiles set credits[^;]*\$\$,\s*null,\s*null,/);
  });

  it('asserts direct UPDATE of profiles.is_founder is rejected', () => {
    expect(sql).toMatch(/update public\.profiles set is_founder[^;]*\$\$,\s*null,\s*null,/);
  });

  it('asserts combined multi-column escalation is rejected (no bundling bypass)', () => {
    // The assertion sets ALL four protected columns in one UPDATE — a
    // common bypass attempt that the WITH CHECK clause must still block.
    expect(sql).toMatch(/role=['"]admin['"][\s\S]{0,200}tier=['"]premium['"][\s\S]{0,200}credits=[0-9]+[\s\S]{0,200}is_founder=true/);
  });
});

describe('Tier 0.6 — safe-path RPCs work for end users', () => {
  let sql;
  beforeAll(() => { sql = readFileSync(SQL_FILE, 'utf8'); });

  // SECONDARY GUARD — executed in profileRpcs.pglite.test.js ('trims the value it returns
  // AND the value it persists'). This arm keeps the pgTAP superset from being hollowed.
  it('asserts update_display_name returns the trimmed value', () => {
    expect(sql).toMatch(/update_display_name\(['"][^'"]+['"]\)[\s\S]{0,200}'Renamed Test User'/);
  });

  // SECONDARY GUARD — executed in profileRpcs.pglite.test.js, which asserts BOTH sides of
  // the boundary (64 accepted, 65 and 100 rejected); a cap checked only from above can be
  // off by one forever.
  it('asserts update_display_name enforces the 64-char length cap', () => {
    expect(sql).toMatch(/repeat\(['"]x['"],\s*100\)/);
  });

  it('asserts spend_credits returns ok=true on success', () => {
    expect(sql).toMatch(/spend_credits\(['"]narrative['"]\)->>'ok'[\s\S]{0,80}true/);
  });

  it('asserts spend_credits debits exactly the cost (10 → 7)', () => {
    expect(sql).toMatch(/credits[^=]+=[^=]+from public\.profiles where id = auth\.uid\(\)\)[\s\S]{0,80}7/);
  });

  it('asserts spend_credits returns ok=false on insufficient funds', () => {
    expect(sql).toMatch(/spend_credits\(['"]narrative['"]\)->>'ok'[\s\S]{0,200}false/);
  });

  it('asserts spend_credits returns reason=insufficient_funds on failure', () => {
    expect(sql).toMatch(/->>'reason'[\s\S]{0,200}'insufficient_funds'/);
  });

  it('asserts spend_credits rejects unknown feature keys', () => {
    expect(sql).toMatch(/spend_credits\(['"]not-a-feature['"]\)/);
  });
});

describe('Tier 0.6 — admin RPCs require privilege', () => {
  let sql;
  beforeAll(() => { sql = readFileSync(SQL_FILE, 'utf8'); });

  // SECONDARY GUARD — executed in profileRpcs.pglite.test.js, with the mutation control
  // proving the rejection comes from current_user_is_privileged() and not from a broken fixture.
  it('asserts admin_set_role rejects calls from regular users', () => {
    // Pattern: throws_ok wrapping a call to admin_set_role.
    expect(sql).toMatch(/throws_ok\([\s\S]{0,300}admin_set_role\(/);
  });

  // SECONDARY GUARD — executed in profileRpcs.pglite.test.js, which also asserts that the
  // rejected call mints NO credit_ledger, credit_transactions or admin_actions row.
  it('asserts admin_grant_credits rejects calls from regular users', () => {
    expect(sql).toMatch(/throws_ok\([\s\S]{0,300}admin_grant_credits\(/);
  });

  // SECONDARY GUARD — executed in profileRpcs.pglite.test.js, which additionally asserts the
  // applied role and the exactly-one audit row with its before/after values.
  it('asserts admin_set_role accepts a developer caller (lives_ok)', () => {
    expect(sql).toMatch(/lives_ok\([\s\S]{0,300}admin_set_role\(/);
  });

  it('asserts elevated users get spend_credits with elevated=true', () => {
    expect(sql).toMatch(/->>'elevated'[\s\S]{0,200}true/);
  });

  it('asserts elevated users\' balance is not debited (stays at 100)', () => {
    expect(sql).toMatch(/credits from public\.profiles where id = auth\.uid\(\)\)[\s\S]{0,80}100/);
  });
});

describe('Tier 0.6 — phase separation between regular and developer contexts', () => {
  let sql;
  beforeAll(() => { sql = readFileSync(SQL_FILE, 'utf8'); });

  it('seeds both a regular user and a developer', () => {
    // The two fixture rows use 'user' and 'developer' role strings —
    // verify both appear in the INSERT VALUES block.
    expect(sql).toMatch(/'user',\s*'free'/);
    expect(sql).toMatch(/'developer',\s*'premium'/);
  });

  it('switches JWT context via the _test_become helper before regular-user assertions', () => {
    expect(sql).toMatch(/_test_become\('00000000-0000-0000-0000-0000000000a1'\)/);
  });

  it('switches JWT context to the developer for the privileged assertions', () => {
    expect(sql).toMatch(/_test_become\('00000000-0000-0000-0000-0000000000d1'\)/);
  });

  it('the developer assertion comes AFTER the regular-user assertions', () => {
    const regularIdx = sql.indexOf("_test_become('00000000-0000-0000-0000-0000000000a1')");
    const devIdx     = sql.indexOf("_test_become('00000000-0000-0000-0000-0000000000d1')");
    expect(regularIdx).toBeGreaterThan(0);
    expect(devIdx).toBeGreaterThan(regularIdx);
  });
});

describe('Tier 0.6 — runner discovery + documentation', () => {
  let sql;
  beforeAll(() => { sql = readFileSync(SQL_FILE, 'utf8'); });

  it('documents how to run via `supabase test db`', () => {
    expect(sql).toMatch(/supabase test db/);
  });

  it('documents the pg_prove fallback for direct CI runs', () => {
    expect(sql).toMatch(/pg_prove/);
  });

  it('names the JS-side contract test so editors can find both files', () => {
    expect(sql).toMatch(/profile_security\.contract\.test\.js/);
  });
});
