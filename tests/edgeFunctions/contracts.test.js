/**
 * tests/edgeFunctions/contracts.test.js - Tier 3.3 comprehensive contract tests.
 *
 * Edge functions live in supabase/functions/<name>/index.ts. They use
 * Deno-specific APIs and esm.sh imports that vitest cannot import
 * directly. Full runtime integration tests (calling the real handler
 * against a Postgres test instance) require a parallel Deno test
 * runner - a separate infrastructure decision.
 *
 * This file is the next-best layer of defence: STATIC SOURCE
 * INSPECTION that catches the regressions that cost real money or
 * leak data:
 *
 *   • Missing env var → 500s at runtime
 *   • Missing signature verification → arbitrary writes from anyone
 *     who knows the URL
 *   • Missing role check → privilege escalation
 *   • Wrong status codes → broken client behaviour
 *   • Plaintext keys committed → credential leak
 *   • Specific Stripe events not handled → silent revenue loss
 *   • Missing CORS preflight → broken cross-origin clients
 *   • Catalog / SKU drift between client and server
 *
 * Every test is a structural assertion the source code MUST satisfy.
 * No mocks, no Deno globals required.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const FUNCTIONS_DIR = join(ROOT, 'supabase', 'functions');
const MIGRATIONS_DIR = join(ROOT, 'supabase', 'migrations');

function readFunction(name) {
  return readFileSync(join(FUNCTIONS_DIR, name, 'index.ts'), 'utf8');
}

function readMigrations() {
  // Read every .sql migration and concatenate for "did this migration
  // ever happen" assertions.
  const fs = require('node:fs');
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => readFileSync(join(MIGRATIONS_DIR, f), 'utf8')).join('\n');
}

function readMigration(name) {
  return readFileSync(join(MIGRATIONS_DIR, name), 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────
// stripe-webhook
// ─────────────────────────────────────────────────────────────────────────

describe('Tier 3.3 - stripe-webhook env vars + dependencies', () => {
  let src;
  beforeAll(() => { src = readFunction('stripe-webhook'); });

  it('reads STRIPE_SECRET_KEY', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]STRIPE_SECRET_KEY['"]\)/);
  });

  it('reads STRIPE_WEBHOOK_SECRET', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]STRIPE_WEBHOOK_SECRET['"]\)/);
  });

  it('reads SUPABASE_URL', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_URL['"]\)/);
  });

  it('reads SUPABASE_SERVICE_ROLE_KEY (admin client requires it)', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_SERVICE_ROLE_KEY['"]\)/);
  });

  it('imports the Stripe SDK', () => {
    expect(src).toMatch(/from\s+['"]https:\/\/esm\.sh\/stripe@/);
  });

  it('imports the Supabase JS client', () => {
    expect(src).toMatch(/from\s+['"]https:\/\/esm\.sh\/@supabase\/supabase-js/);
  });
});

describe('Tier 3.3 - stripe-webhook signature verification', () => {
  let src;
  beforeAll(() => { src = readFunction('stripe-webhook'); });

  it('verifies the signature before any database write', () => {
    // The signature check must come from Stripe's constructEvent helper.
    expect(src).toMatch(/constructEvent(Async)?\s*\(/);
  });

  it('reads the `stripe-signature` header from the request', () => {
    expect(src).toMatch(/headers\.get\(['"]stripe-signature['"]\)/);
  });

  it('returns 400 when the signature header is missing', () => {
    expect(src).toMatch(/Missing signature[\s\S]{0,80}status:\s*400/);
  });

  it('returns 400 on invalid signature with a clear message', () => {
    expect(src).toMatch(/Invalid signature[\s\S]{0,80}status:\s*400/);
  });

  it('verifies signature BEFORE creating the admin client', () => {
    const constructIdx = src.search(/constructEvent(Async)?\s*\(/);
    const adminIdx = src.search(/const supabase\s*=\s*adminClient\(/);
    expect(constructIdx).toBeGreaterThan(0);
    expect(adminIdx).toBeGreaterThan(0);
    expect(constructIdx).toBeLessThan(adminIdx);
  });
});

describe('Tier 3.3 - stripe-webhook event coverage', () => {
  let src;
  beforeAll(() => { src = readFunction('stripe-webhook'); });

  it('handles checkout.session.completed', () => {
    expect(src).toMatch(/['"]checkout\.session\.completed['"]/);
  });

  it('handles customer.subscription.deleted (for downgrades)', () => {
    expect(src).toMatch(/['"]customer\.subscription\.deleted['"]/);
  });

  it('logs unhandled event types (does not silently swallow)', () => {
    expect(src).toMatch(/Unhandled event type/i);
  });

  it('reads supabase_user_id from session metadata (not body)', () => {
    expect(src).toMatch(/session\.metadata\?\.\s*supabase_user_id/);
  });

  it('reads product key from session metadata', () => {
    expect(src).toMatch(/session\.metadata\?\.\s*product/);
  });

  it('reads credits amount from session metadata', () => {
    expect(src).toMatch(/session\.metadata\?\.\s*credits/);
  });

  it('handles the premium product → tier=premium', () => {
    expect(src).toMatch(/product\s*===\s*['"]premium['"]/);
    expect(src).toMatch(/tier:\s*['"]premium['"]/);
  });

  it('handles founder_lifetime product → tier=premium + is_founder=true', () => {
    expect(src).toMatch(/product\s*===\s*['"]founder_lifetime['"]/);
    expect(src).toMatch(/is_founder:\s*true/);
  });

  it('handles single_dossier without requiring a user account', () => {
    expect(src).toMatch(/product\s*===\s*['"]single_dossier['"]/);
    expect(src).toMatch(/single_dossier[\s\S]{0,500}(no account|no supabase_user_id|customer_email)/i);
  });

  it('handles bare credit pack purchase (credits > 0)', () => {
    expect(src).toMatch(/credits\s*>\s*0/);
  });

  it('founder_lifetime grants the one-time 30 credit bonus', () => {
    expect(src).toMatch(/grantCredits\([\s\S]{0,200}30[\s\S]{0,200}founder_grant/);
  });
});

describe('Tier 3.3 - stripe-webhook ledger consistency', () => {
  let src;
  beforeAll(() => { src = readFunction('stripe-webhook'); });

  it('uses the ledger-consistent system_grant_credits RPC', () => {
    expect(src).toMatch(/system_grant_credits/);
    expect(src).toMatch(/target_user/);
    expect(src).toMatch(/expires_at/);
  });

  it('surfaces grant RPC failures instead of falling back to direct writes', () => {
    expect(src).toMatch(/throw new Error\(`Credit grant failed:/);
    expect(src).not.toMatch(/exec_sql_increment_credits/);
    expect(src).not.toMatch(/falling back to legacy direct-write path/);
  });

  it('does not write grant rows directly from the edge function', () => {
    expect(src).not.toMatch(/from\(['"]credit_transactions['"]\)\.insert/);
    expect(src).not.toMatch(/from\(['"]credit_ledger['"]\)\.insert/);
    expect(src).not.toMatch(/profiles[\s\S]{0,250}\.update\(\{\s*credits/);
  });

  it('includes stripe_session_id in grant metadata for audit trail', () => {
    expect(src).toMatch(/stripe_session_id/);
  });
});

describe('Tier 3.3 - stripe-webhook response shape', () => {
  let src;
  beforeAll(() => { src = readFunction('stripe-webhook'); });

  it('returns JSON {received: true} on success', () => {
    expect(src).toMatch(/received:\s*true/);
  });

  it('sets Content-Type: application/json on success response', () => {
    expect(src).toMatch(/Content-Type['"]?:\s*['"]application\/json['"]/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// generate-narrative
// ─────────────────────────────────────────────────────────────────────────

describe('Tier 3.3 - generate-narrative env vars', () => {
  let src;
  beforeAll(() => { src = readFunction('generate-narrative'); });

  it('reads ANTHROPIC_API_KEY', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]ANTHROPIC_API_KEY['"]\)/);
  });

  it('reads SUPABASE_URL', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_URL['"]\)/);
  });
});

describe('Tier 3.3 - generate-narrative auth + authorization', () => {
  let src;
  beforeAll(() => { src = readFunction('generate-narrative'); });

  it('reads Authorization header from the request', () => {
    expect(src).toMatch(/headers\.get\(['"]Authorization['"]\)/i);
  });

  it('verifies the calling user via Supabase auth', () => {
    expect(src).toMatch(/auth\.getUser\s*\(/);
  });

  it('rejects unauthenticated requests with 401 or rejects with auth error', () => {
    expect(src).toMatch(/(status:\s*401|throw new Error\([^)]*[Nn]ot authenticated)/);
  });
});

describe('Tier 3.3 - generate-narrative credit handling', () => {
  let src;
  beforeAll(() => { src = readFunction('generate-narrative'); });

  it('spends credits via the atomic spend_credits RPC', () => {
    expect(src).toMatch(/rpc\(['"]spend_credits['"]/);
  });

  it('handles insufficient-credit case with clear error', () => {
    expect(src).toMatch(/Insufficient credits/);
  });

  it('refunds credits on failure via refund_credits RPC', () => {
    expect(src).toMatch(/rpc\(['"]refund_credits['"]/);
  });

  it('refund failures surface loudly on the stream (no silent racy fallback)', () => {
    // Tier 9.9 audit plan #4 - the legacy direct-write refund fallback
    // was dropped after migration 009 was confirmed in production.
    // Phase 5's "credit_transactions reason='refund'" fallback no
    // longer exists. Instead, refund_credits RPC failures emit a
    // `{refund: 'failed', spend_id, supportNote}` line on the
    // streaming response so the user can ticket support with the
    // spend_id rather than getting silently double-credited or
    // un-refunded.
    expect(src).toMatch(/refund:\s*['"]failed['"]/);
    expect(src).toMatch(/supportNote/);
    expect(src).toMatch(/spend_id/);
    // And confirm the legacy direct insert is genuinely gone.
    expect(src).not.toMatch(/credit_transactions[\s\S]{0,200}reason:\s*['"]refund['"]/);
  });

  it('elevated users (developer/admin) skip credit spend', () => {
    expect(src).toMatch(/isElevated|elevated|developer|admin/);
  });

  it('records spend_id to target refunds at the exact ledger row', () => {
    expect(src).toMatch(/spend_id|spendResult/);
  });
});

describe('Tier 3.3 - generate-narrative cost catalog must match pricing.js', () => {
  let src;
  let pricing;
  beforeAll(() => {
    src = readFunction('generate-narrative');
    pricing = readFileSync(join(ROOT, 'src', 'config', 'pricing.js'), 'utf8');
  });

  it('declares CREDIT_COSTS with narrative / dailyLife / progression', () => {
    expect(src).toMatch(/CREDIT_COSTS[\s\S]{0,200}narrative/);
    expect(src).toMatch(/dailyLife/);
    expect(src).toMatch(/progression/);
  });

  // pricing.js declares BOTH LEGACY_AI_COSTS (8/10/12, kept resolvable for
  // refund/replay) AND NEW_AI_COSTS (3/4/5, the active table). The server's
  // CREDIT_COSTS must match NEW_AI_COSTS, never the legacy table.
  function extractFromBlock(text, blockName, field) {
    const block = text.match(new RegExp(`${blockName}\\s*=\\s*Object\\.freeze\\(\\{[\\s\\S]*?\\}\\)`));
    if (!block) return null;
    const m = block[0].match(new RegExp(`${field}:\\s*(\\d+)`));
    return m ? m[1] : null;
  }

  it('narrative cost in server matches NEW_AI_COSTS in client', () => {
    const srv = src.match(/CREDIT_COSTS[\s\S]*?narrative:\s*(\d+)/)?.[1];
    const cli = extractFromBlock(pricing, 'NEW_AI_COSTS', 'narrative');
    expect(srv, 'server narrative cost not found').toBeTruthy();
    expect(cli, 'client NEW_AI_COSTS narrative not found').toBeTruthy();
    expect(srv).toBe(cli);
  });

  it('dailyLife cost in server matches NEW_AI_COSTS in client', () => {
    const srv = src.match(/CREDIT_COSTS[\s\S]*?dailyLife:\s*(\d+)/)?.[1];
    const cli = extractFromBlock(pricing, 'NEW_AI_COSTS', 'dailyLife');
    expect(srv, 'server dailyLife cost not found').toBeTruthy();
    expect(cli, 'client NEW_AI_COSTS dailyLife not found').toBeTruthy();
    expect(srv).toBe(cli);
  });

  it('progression cost in server matches NEW_AI_COSTS in client', () => {
    const srv = src.match(/CREDIT_COSTS[\s\S]*?progression:\s*(\d+)/)?.[1];
    const cli = extractFromBlock(pricing, 'NEW_AI_COSTS', 'progression');
    expect(srv, 'server progression cost not found').toBeTruthy();
    expect(cli, 'client NEW_AI_COSTS progression not found').toBeTruthy();
    expect(srv).toBe(cli);
  });

  it('server costs are NOT accidentally aligned with LEGACY_AI_COSTS', () => {
    const legacyNarrative = extractFromBlock(pricing, 'LEGACY_AI_COSTS', 'narrative');
    const serverNarrative = src.match(/CREDIT_COSTS[\s\S]*?narrative:\s*(\d+)/)?.[1];
    expect(serverNarrative, 'server narrative cost not found').toBeTruthy();
    // If these ever match, someone reverted to the legacy schedule -
    // the funnel argument (smaller pack must enable a full week of prep)
    // would no longer hold.
    expect(serverNarrative).not.toBe(legacyNarrative);
  });
});

describe('Tier 3.3 - generate-narrative AI invariants', () => {
  let src;
  beforeAll(() => { src = readFunction('generate-narrative'); });

  it('uses Opus for thesis (per the file header comment)', () => {
    expect(src).toMatch(/claude-opus-4-7/);
  });

  it('uses Haiku for refinement passes', () => {
    expect(src).toMatch(/claude-haiku-4-5/);
  });

  it('declares house-style fact-preservation rules', () => {
    expect(src).toMatch(/PRESERVATION_RULES/);
    expect(src).toMatch(/Do not invent/i);
    expect(src).toMatch(/Do not contradict/i);
  });

  it('declares a HOUSE_STYLE constant with explicit voice rules', () => {
    expect(src).toMatch(/HOUSE_STYLE/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// admin-actions
// ─────────────────────────────────────────────────────────────────────────

describe('Tier 3.3 - admin-actions env vars', () => {
  let src;
  beforeAll(() => { src = readFunction('admin-actions'); });

  it('reads SUPABASE_URL', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_URL['"]\)/);
  });

  it('reads SUPABASE_ANON_KEY (for user-scoped client)', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_ANON_KEY['"]\)/);
  });

  it('reads SUPABASE_SERVICE_ROLE_KEY (for admin operations)', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_SERVICE_ROLE_KEY['"]\)/);
  });
});

describe('Tier 3.3 - admin-actions authorization', () => {
  let src;
  beforeAll(() => { src = readFunction('admin-actions'); });

  it('requires Authorization header', () => {
    expect(src).toMatch(/Missing authorization[\s\S]{0,80},\s*401\)/);
  });

  it('verifies the calling user via auth.getUser', () => {
    expect(src).toMatch(/auth\.getUser\s*\(/);
  });

  it('returns 401 when token is invalid', () => {
    expect(src).toMatch(/Invalid token[\s\S]{0,80},\s*401\)/);
  });

  it('checks caller role against profiles.role', () => {
    expect(src).toMatch(/\.from\(['"]profiles['"]\)[\s\S]{0,200}role/);
  });

  it('requires role in (developer, admin)', () => {
    expect(src).toMatch(/\[['"]developer['"],\s*['"]admin['"]\]/);
  });

  it('returns 403 when role is insufficient', () => {
    expect(src).toMatch(/Insufficient privileges[\s\S]{0,80},\s*403\)/);
  });

  it('verifies caller BEFORE parsing the request body', () => {
    // Role check must precede `req.json()` so unauthorized callers
    // never trigger any privileged code path.
    const roleCheckIdx = src.search(/Insufficient privileges/);
    const bodyParseIdx = src.search(/await req\.json\(\)/);
    expect(roleCheckIdx).toBeGreaterThan(0);
    expect(bodyParseIdx).toBeGreaterThan(0);
    expect(roleCheckIdx).toBeLessThan(bodyParseIdx);
  });
});

describe('Tier 3.3 - admin-actions action coverage', () => {
  let src;
  beforeAll(() => { src = readFunction('admin-actions'); });

  it('handles update_user_metadata', () => {
    expect(src).toMatch(/['"]update_user_metadata['"]/);
  });

  it('handles update_user_credits', () => {
    expect(src).toMatch(/['"]update_user_credits['"]/);
  });

  it('handles get_stats', () => {
    expect(src).toMatch(/['"]get_stats['"]/);
  });

  it('returns 400 for unknown action with a clear error', () => {
    expect(src).toMatch(/Unknown action[\s\S]{0,80},\s*400\)/);
  });

  it('update_user_metadata requires userId AND metadata', () => {
    expect(src).toMatch(/Missing userId or metadata[\s\S]{0,80},\s*400\)/);
  });

  it('update_user_credits requires userId AND credits', () => {
    expect(src).toMatch(/Missing userId or credits[\s\S]{0,80},\s*400\)/);
  });

  it('update_user_credits coerces credits to integer (defence vs string injection)', () => {
    expect(src).toMatch(/parseInt\s*\(\s*String\(credits\)/);
  });
});

describe('Tier 3.3 - admin-actions audit trail (Phase 5 migration 009)', () => {
  let migrations;
  let src;
  beforeAll(() => {
    migrations = readMigrations();
    src = readFunction('admin-actions');
  });

  it('migration 009 provisions the admin_actions table', () => {
    expect(migrations).toMatch(/create table[\s\S]{0,80}admin_actions/i);
  });

  it('migration 009 indexes admin_actions by actor, target, and recency', () => {
    expect(migrations).toMatch(/idx_admin_actions_target/);
    expect(migrations).toMatch(/idx_admin_actions_actor/);
    expect(migrations).toMatch(/idx_admin_actions_recent/);
  });

  it('routes privileged writes through audited service-role RPCs', () => {
    expect(src).toMatch(/service_update_profile_metadata/);
    expect(src).toMatch(/service_set_credits/);
    expect(migrations).toMatch(/insert\s+into\s+public\.admin_actions/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// create-checkout
// ─────────────────────────────────────────────────────────────────────────

describe('Tier 3.3 - create-checkout env vars', () => {
  let src;
  beforeAll(() => { src = readFunction('create-checkout'); });

  it('reads STRIPE_SECRET_KEY', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]STRIPE_SECRET_KEY['"]\)/);
  });

  it('reads SUPABASE_URL', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_URL['"]\)/);
  });

  it('reads SUPABASE_ANON_KEY', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]SUPABASE_ANON_KEY['"]\)/);
  });

  it('reads CLIENT_URL for redirect targets', () => {
    expect(src).toMatch(/Deno\.env\.get\(['"]CLIENT_URL['"]\)/);
  });
});

describe('Tier 3.3 - create-checkout authentication', () => {
  let src;
  beforeAll(() => { src = readFunction('create-checkout'); });

  it('rejects requests with no Authorization header', () => {
    expect(src).toMatch(/Missing authorization header/);
  });

  it('verifies the user before creating any Stripe session', () => {
    const authIdx = src.search(/auth\.getUser\s*\(/);
    const sessIdx = src.search(/stripe\.checkout\.sessions\.create/);
    expect(authIdx).toBeGreaterThan(0);
    expect(sessIdx).toBeGreaterThan(0);
    expect(authIdx).toBeLessThan(sessIdx);
  });

  it('rejects unauthenticated calls with explicit error', () => {
    expect(src).toMatch(/Not authenticated/);
  });
});

describe('Tier 3.3 - create-checkout product catalog', () => {
  let src;
  beforeAll(() => { src = readFunction('create-checkout'); });

  it('exposes active credit packs (25 / 60 / 150)', () => {
    expect(src).toMatch(/credits_25/);
    expect(src).toMatch(/credits_60/);
    expect(src).toMatch(/credits_150/);
  });

  it('exposes premium subscription product', () => {
    expect(src).toMatch(/premium:\s*Deno\.env\.get\(['"]STRIPE_PRICE_PREMIUM['"]\)/);
  });

  it('exposes founder_lifetime product', () => {
    expect(src).toMatch(/founder_lifetime:\s*Deno\.env\.get\(['"]STRIPE_PRICE_FOUNDER_LIFETIME['"]\)/);
  });

  it('exposes single_dossier microtransaction', () => {
    expect(src).toMatch(/single_dossier:\s*Deno\.env\.get\(['"]STRIPE_PRICE_SINGLE_DOSSIER['"]\)/);
  });

  it('keeps legacy SKUs reachable for refund/replay (5/15/40/10/50)', () => {
    expect(src).toMatch(/credits_5:/);
    expect(src).toMatch(/credits_15:/);
    expect(src).toMatch(/credits_40:/);
    expect(src).toMatch(/credits_10:/);
    expect(src).toMatch(/credits_50:/);
  });

  it('CREDIT_AMOUNTS map matches PRICE_MAP keys', () => {
    expect(src).toMatch(/credits_25:\s*25/);
    expect(src).toMatch(/credits_60:\s*60/);
    expect(src).toMatch(/credits_150:\s*150/);
  });

  it('marks premium as subscription (not one-time)', () => {
    expect(src).toMatch(/SUBSCRIPTION_PRODUCTS[\s\S]{0,80}['"]premium['"]/);
  });

  it('rejects unknown products with 400 + listing valid ones', () => {
    expect(src).toMatch(/Invalid product[\s\S]{0,80}Valid:/);
  });
});

describe('Tier 3.3 - create-checkout metadata wiring (must align with webhook)', () => {
  let src;
  let webhookSrc;
  beforeAll(() => {
    src = readFunction('create-checkout');
    webhookSrc = readFunction('stripe-webhook');
  });

  it('attaches supabase_user_id to checkout metadata (when an authed user is present)', () => {
    // P95 changed create-checkout to make single_dossier anonymous-
    // allowed, so the assignment moved from `user.id` to `user?.id ?? ''`.
    // The contract is still: the user_id comes from the server-verified
    // JWT, never from the request body. Pattern updated to allow either
    // user.id or user?.id with an optional fallback to a literal empty
    // string. Negative assertions in the dedicated test below still
    // forbid request-body sourcing.
    expect(src).toMatch(/supabase_user_id:\s*user\??\.\s*id/);
  });

  it('attaches product key to checkout metadata', () => {
    expect(src).toMatch(/product,/);
  });

  it('attaches credits count to checkout metadata', () => {
    expect(src).toMatch(/credits:\s*String\(CREDIT_AMOUNTS\[product\]/);
  });

  it('webhook reads exactly the same three metadata fields', () => {
    // If checkout writes supabase_user_id but webhook reads user_id,
    // privilege paths break. Cross-check the wire contract.
    expect(webhookSrc).toMatch(/supabase_user_id/);
    expect(webhookSrc).toMatch(/session\.metadata\?\.\s*product/);
    expect(webhookSrc).toMatch(/session\.metadata\?\.\s*credits/);
  });
});

describe('Tier 3.3 - create-checkout CORS handling', () => {
  let src;
  beforeAll(() => { src = readFunction('create-checkout'); });

  it('handles OPTIONS preflight', () => {
    expect(src).toMatch(/req\.method\s*===\s*['"]OPTIONS['"]/);
  });

  it('declares an allowed-origins list (not "*")', () => {
    expect(src).toMatch(/settlementforge\.com/);
    expect(src).toMatch(/localhost/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Cross-function security
// ─────────────────────────────────────────────────────────────────────────

const ALL_FUNCTIONS = ['stripe-webhook', 'generate-narrative', 'admin-actions', 'create-checkout'];

describe('Tier 3.3 - no plaintext secrets committed', () => {
  it('no edge function contains a literal Stripe live key', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/sk_live_[A-Za-z0-9]+/), name).toBeNull();
    }
  });

  it('no edge function contains a literal Stripe test key', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/sk_test_[A-Za-z0-9]+/), name).toBeNull();
    }
  });

  it('no edge function contains a literal Stripe webhook secret (whsec_)', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/whsec_[A-Za-z0-9]{20,}/), name).toBeNull();
    }
  });

  it('no edge function contains a literal Stripe Price ID (price_)', () => {
    // Stripe Price IDs start with `price_` followed by ~24 chars. They
    // belong in env vars, not source.
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      // Exclude doc-comment references (file headers can mention 'price_').
      // The actual leaks would be assignment-shaped.
      const matches = src.match(/=\s*['"]price_[A-Za-z0-9]{20,}['"]/);
      expect(matches, `${name}: ${matches?.[0]}`).toBeNull();
    }
  });

  it('no edge function contains a literal Supabase service role JWT', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      // JWT pattern: 3 base64url segments joined with dots, total long.
      expect(src.match(/eyJ[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]+/), name).toBeNull();
    }
  });

  it('no edge function contains a literal Anthropic API key', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/sk-ant-[A-Za-z0-9_-]{40,}/), name).toBeNull();
    }
  });
});

describe('Tier 3.3 - every function uses Deno serve + ESM imports', () => {
  it('every function imports from deno.land/std http/server', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/from\s+['"]https:\/\/deno\.land\/std@[^/]+\/http\/server\.ts['"]/), name).toBeTruthy();
    }
  });

  it('every function calls serve()', () => {
    for (const name of ALL_FUNCTIONS) {
      const src = readFunction(name);
      expect(src.match(/^serve\s*\(/m), name).toBeTruthy();
    }
  });
});

describe('Tier 3.3 - Phase 5 migration 009 invariants', () => {
  let migrations;
  beforeAll(() => { migrations = readMigrations(); });

  it('provisions the credit_ledger table with kind/source/amount columns', () => {
    expect(migrations).toMatch(/create table[\s\S]{0,500}credit_ledger/i);
    expect(migrations).toMatch(/kind/);
    expect(migrations).toMatch(/source/);
    expect(migrations).toMatch(/amount/);
  });

  it('provisions spend_credits RPC (atomic decrement)', () => {
    expect(migrations).toMatch(/(create|create or replace)\s+function\s+(public\.)?spend_credits/i);
  });

  it('provisions refund_credits RPC (ledger-consistent refund)', () => {
    expect(migrations).toMatch(/(create|create or replace)\s+function\s+(public\.)?refund_credits/i);
  });

  it('provisions admin_actions audit table', () => {
    expect(migrations).toMatch(/create table[\s\S]{0,500}admin_actions/i);
  });

  it('allows system/webhook audit rows with actor_id NULL', () => {
    expect(migrations).toMatch(/alter\s+table\s+public\.admin_actions[\s\S]{0,120}actor_id\s+drop\s+not\s+null/i);
  });

  it('refund_credits writes a "grant" row (never modifies a spend row)', () => {
    // Look at the refund_credits function body. The function is ~50
    // lines so we need a generous window.
    const refundBlock = migrations.match(/function\s+(public\.)?refund_credits[\s\S]{0,4000}/i);
    expect(refundBlock, 'refund_credits function body not found').toBeTruthy();
    expect(refundBlock[0]).toMatch(/insert\s+into[\s\S]{0,500}credit_ledger/i);
    expect(refundBlock[0]).toMatch(/['"]grant['"]/);
  });

  it('refund_credits is idempotent (rejects double-refunds of the same spend row)', () => {
    const refundBlock = migrations.match(/function\s+(public\.)?refund_credits[\s\S]{0,4000}/i);
    expect(refundBlock).toBeTruthy();
    expect(refundBlock[0]).toMatch(/already refunded/i);
  });

  it('refund_credits checks that the target row is actually a spend (not another grant)', () => {
    const refundBlock = migrations.match(/function\s+(public\.)?refund_credits[\s\S]{0,4000}/i);
    expect(refundBlock).toBeTruthy();
    expect(refundBlock[0]).toMatch(/kind\s*<>\s*['"]spend['"]/);
  });
});

describe('Tier 9.10 - credit/auth integrity migration 017 invariants', () => {
  let sql;
  beforeAll(() => { sql = readMigration('017_fix_credit_auth_integrity.sql'); });

  it('replaces the broken welcome-credit trigger with the current ledger schema', () => {
    const handleBlock = sql.match(/create\s+or\s+replace\s+function\s+public\.handle_new_user[\s\S]*?comment\s+on\s+function\s+public\.handle_new_user/i);
    expect(handleBlock, 'handle_new_user block not found').toBeTruthy();
    expect(handleBlock[0]).toMatch(/insert\s+into\s+public\.credit_ledger\s*\(\s*user_id,\s*kind,\s*amount,\s*source,\s*metadata\s*\)/i);
    expect(handleBlock[0]).toMatch(/'grant'[\s\S]{0,80}'welcome'/i);
    expect(handleBlock[0]).not.toMatch(/\bdelta\b/i);
    expect(handleBlock[0]).not.toMatch(/credit_balance/i);
  });

  it('drops the obsolete auth_users_welcome_credit trigger', () => {
    expect(sql).toMatch(/drop\s+trigger\s+if\s+exists\s+auth_users_welcome_credit/i);
  });

  it('exposes welcome_credit_available for the client gift-card gate', () => {
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.welcome_credit_available/i);
    expect(sql).toMatch(/grant\s+execute\s+on\s+function\s+public\.welcome_credit_available\(uuid\)\s+to\s+authenticated/i);
  });

  it('adds service-role RPCs for audited admin writes', () => {
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.service_update_profile_metadata/i);
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.service_set_credits/i);
    expect(sql).toMatch(/_assert_service_admin_actor/i);
    expect(sql).toMatch(/insert\s+into\s+public\.admin_actions/i);
  });

  it('moves custom_content writes behind the premium/elevated profile gate', () => {
    expect(sql).toMatch(/profile_has_premium_access/);
    expect(sql).toMatch(/premium users insert own custom content/);
    expect(sql).toMatch(/premium users update own custom content/);
    expect(sql).toMatch(/premium users delete own custom content/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Catalog drift detector
// ─────────────────────────────────────────────────────────────────────────

describe('Tier 3.3 - product catalog drift between checkout + webhook', () => {
  it('every product the checkout function knows about is also handled (or no-op-logged) by the webhook', () => {
    const checkout = readFunction('create-checkout');
    const webhook  = readFunction('stripe-webhook');

    // Extract product keys from the PRICE_MAP in checkout. Pattern:
    // `  credits_25: Deno.env.get(...)`.
    const productKeys = [...checkout.matchAll(/^\s+(\w+):\s*Deno\.env\.get/gm)].map(m => m[1]);
    expect(productKeys.length, 'checkout PRICE_MAP keys not found').toBeGreaterThan(0);

    // Each product MUST either be handled by the webhook, OR be a
    // credit pack (handled by the generic `credits > 0` branch).
    const CREDIT_PACK_KEYS = ['credits_5', 'credits_10', 'credits_15', 'credits_25', 'credits_40', 'credits_50', 'credits_60', 'credits_150'];
    for (const key of productKeys) {
      if (CREDIT_PACK_KEYS.includes(key)) continue;
      expect(webhook, `webhook missing handler for ${key}`).toMatch(new RegExp(`['"]${key}['"]`));
    }
  });
});

// ─────────────────────────────────────────────────────────────────────
// Tier 0.5 - Webhook trust-boundary lock-in
//
// The webhook's case statements read session.metadata.supabase_user_id,
// product, and credits as if they were trusted. They ARE trusted, but
// only because:
//   - the signature is verified BEFORE any metadata read, AND
//   - the metadata is populated ONLY by create-checkout, which uses
//     the server-verified `user.id` and a server-controlled PRICE_MAP.
// These tests lock that chain in place so a future refactor can't
// accidentally introduce a user-attackable path.
// ─────────────────────────────────────────────────────────────────────

describe('Tier 0.5 - stripe-webhook trust boundary order', () => {
  let webhookSrc;
  beforeAll(() => { webhookSrc = readFunction('stripe-webhook'); });

  it('constructEvent (signature verification) runs before any session.metadata read', () => {
    const constructIdx = webhookSrc.search(/constructEvent\s*\(/);
    // Look for the specific metadata read pattern used by the case
    // statements - `session.metadata?.<key>`. The doc block earlier in
    // the file references `session.metadata` but does NOT read it; the
    // `?.` form is the live access.
    const metadataReadIdx = webhookSrc.search(/session\.metadata\?\./);
    expect(constructIdx).toBeGreaterThan(0);
    expect(metadataReadIdx).toBeGreaterThan(0);
    expect(constructIdx).toBeLessThan(metadataReadIdx);
  });

  it('rejects unsigned requests with 400 before touching the request body', () => {
    // Pattern: read header, if missing return 400. Body parse comes after.
    expect(webhookSrc).toMatch(/stripe-signature[\s\S]{0,200}status:\s*400/);
  });

  it('verifies signature with the STRIPE_WEBHOOK_SECRET env var', () => {
    expect(webhookSrc).toMatch(/STRIPE_WEBHOOK_SECRET/);
    expect(webhookSrc).toMatch(/constructEvent\([\s\S]{0,80}signature/);
  });

  it('failed signature verification short-circuits with 400 (no metadata read)', () => {
    expect(webhookSrc).toMatch(/Invalid signature[\s\S]{0,80}status:\s*400/);
  });

  it('founder_lifetime branch is gated on session.metadata.product (not on customer email or any client-controlled field)', () => {
    // Founder upgrade must come from the metadata.product check, which
    // was set server-side by create-checkout. Looking up by customer
    // email would let any user with a known target email upgrade.
    expect(webhookSrc).toMatch(/product\s*===\s*['"]founder_lifetime['"]/);
  });
});

describe('Tier 0.5 - create-checkout metadata population is server-controlled', () => {
  let checkoutSrc;
  beforeAll(() => { checkoutSrc = readFunction('create-checkout'); });

  it('supabase_user_id is set from user.id (the server-verified JWT) - NEVER from the request body', () => {
    // P95: allow optional-chained `user?.id` (anonymous single_dossier
    // path has no user). Contract is unchanged - the user id NEVER
    // comes from the request body.
    expect(checkoutSrc).toMatch(/supabase_user_id:\s*user\??\.\s*id/);
    // Negative: no path where the user can pass a different id.
    expect(checkoutSrc).not.toMatch(/supabase_user_id:\s*req\.|supabase_user_id:\s*body\./);
  });

  it('reads the request body BEFORE authentication so single_dossier can be anonymous', () => {
    // P95 inverted the original order: we need to know whether the
    // requested product is anonymous-allowed (single_dossier) before
    // deciding whether to require an Authorization header. The auth
    // path is still mandatory for every NON-single_dossier product,
    // and supabase_user_id still comes from the server-verified JWT
    // for any product that does provide auth.
    const bodyIdx = checkoutSrc.search(/const\s*\{\s*product\s*\}\s*=\s*await\s*req\.json/);
    const authIdx = checkoutSrc.search(/getUser\s*\(/);
    expect(bodyIdx).toBeGreaterThan(0);
    expect(authIdx).toBeGreaterThan(0);
    expect(bodyIdx).toBeLessThan(authIdx);
  });

  it('rejects non-single_dossier products when authentication is missing', () => {
    // P95 - auth is still required for credit packs, subscriptions,
    // and founder seats. Only single_dossier may proceed without it.
    expect(checkoutSrc).toMatch(/Not authenticated|Missing authorization header/);
    expect(checkoutSrc).toMatch(/isAnonymousProduct\s*=\s*product\s*===\s*['"]single_dossier['"]/);
  });

  it('product is validated against PRICE_MAP before being put into metadata', () => {
    // Pattern: !PRICE_MAP[product] → throw → never reaches checkout.create.
    const validateIdx = checkoutSrc.search(/!PRICE_MAP\[product\]/);
    const createIdx   = checkoutSrc.search(/stripe\.checkout\.sessions\.create/);
    expect(validateIdx).toBeGreaterThan(0);
    expect(createIdx).toBeGreaterThan(0);
    expect(validateIdx).toBeLessThan(createIdx);
  });

  it('credits in metadata are computed from server-side CREDIT_AMOUNTS - not from request body', () => {
    expect(checkoutSrc).toMatch(/credits:\s*String\(CREDIT_AMOUNTS\[product\]/);
    // Negative: no request-body credit injection.
    expect(checkoutSrc).not.toMatch(/credits:\s*String\(req\.|credits:\s*body\.credits/);
  });

  it('PRICE_MAP entries are env-driven (the keys are server-known, the values come from secrets)', () => {
    // Every PRICE_MAP value loads from Deno.env.get(). A hardcoded
    // price would be a deploy regression but not a trust break;
    // checking anyway because the same line carries the price-id
    // contract Stripe uses.
    expect(checkoutSrc).toMatch(/PRICE_MAP[\s\S]{0,200}Deno\.env\.get/);
  });
});

describe('Tier 0.5 - webhook documents its trust-boundary expectations', () => {
  let webhookSrc;
  beforeAll(() => { webhookSrc = readFunction('stripe-webhook'); });

  it('the file header or near-handler comment names create-checkout as the only metadata source', () => {
    expect(webhookSrc).toMatch(/create-checkout/i);
    // The documentation block points at the trust chain so future
    // editors don't add a second entry point without thinking about
    // the metadata it would populate.
    expect(webhookSrc).toMatch(/trust boundary|Trust boundary/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Tier 0.10 - Anonymous abuse defense baseline
//
// Every edge function (except stripe-webhook, which is signature-
// gated) imports botGuard from _shared/requestMeta.ts and calls it
// before any auth check. Locks the wiring in so a future function
// addition doesn't quietly skip the guard.
// ─────────────────────────────────────────────────────────────────────

describe('Tier 0.10 - shared bot-guard helper exists', () => {
  it('_shared/requestMeta.ts is present', () => {
    const path = join(FUNCTIONS_DIR, '_shared', 'requestMeta.ts');
    expect(readFileSync(path, 'utf8')).toMatch(/export function botGuard/);
  });

  it('exports readRequestMeta, rejectObviousBot, and botGuard', () => {
    const path = join(FUNCTIONS_DIR, '_shared', 'requestMeta.ts');
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/export function readRequestMeta/);
    expect(src).toMatch(/export function rejectObviousBot/);
    expect(src).toMatch(/export function botGuard/);
  });

  it('detects common scraper UAs (curl / python-requests / headless)', () => {
    const path = join(FUNCTIONS_DIR, '_shared', 'requestMeta.ts');
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/\\bcurl\\b/i);
    expect(src).toMatch(/python-requests/i);
    expect(src).toMatch(/headless/i);
  });

  it('allow-lists Stripe + monitoring UAs so infra integrations aren\'t broken', () => {
    const path = join(FUNCTIONS_DIR, '_shared', 'requestMeta.ts');
    const src = readFileSync(path, 'utf8');
    expect(src).toMatch(/Stripe/);
    expect(src).toMatch(/UptimeRobot/);
  });
});

describe('Tier 0.10 - every user-facing edge function uses the bot guard', () => {
  // stripe-webhook is INTENTIONALLY excluded: signature verification is
  // the real gate and Stripe's UA matches the allow-list anyway.
  const FUNCTIONS_WITH_GUARD = ['create-checkout', 'generate-narrative', 'admin-actions'];

  for (const name of FUNCTIONS_WITH_GUARD) {
    describe(name, () => {
      let src;
      beforeAll(() => { src = readFunction(name); });

      it('imports botGuard from _shared/requestMeta.ts', () => {
        expect(src).toMatch(/import\s+\{[\s\S]{0,80}botGuard[\s\S]{0,80}\}\s+from\s+['"]\.\.\/_shared\/requestMeta\.ts['"]/);
      });

      it('calls botGuard inside the request handler', () => {
        expect(src).toMatch(/botGuard\(req,\s*['"][^'"]+['"]\)/);
      });

      it('short-circuits with the rejection response when the guard fires', () => {
        // Pattern: const guard = botGuard(req, '<name>'); if (guard.reject) return guard.reject;
        expect(src).toMatch(/if\s*\(\s*guard\.reject\s*\)\s*return\s+guard\.reject/);
      });

      it('the bot guard runs BEFORE the auth header read', () => {
        // Anchor on the LIVE auth-read pattern (req.headers.get('Authorization')
        // or req.headers.get("Authorization")) so a comment in the file
        // header that mentions "Authorization" doesn't count.
        const guardIdx = src.search(/botGuard\s*\(/);
        const authIdx  = src.search(/req\.headers\.get\(\s*['"]Authorization['"]/);
        expect(guardIdx).toBeGreaterThan(0);
        expect(authIdx).toBeGreaterThan(0);
        expect(authIdx).toBeGreaterThan(guardIdx);
      });
    });
  }
});

describe('Tier 0.10 - stripe-webhook is correctly exempt from the bot guard', () => {
  let webhookSrc;
  beforeAll(() => { webhookSrc = readFunction('stripe-webhook'); });

  it('does NOT import botGuard (signature verification is the real gate)', () => {
    expect(webhookSrc).not.toMatch(/from\s+['"]\.\.\/_shared\/requestMeta\.ts['"]/);
  });

  it('still verifies the request via constructEvent', () => {
    expect(webhookSrc).toMatch(/constructEvent\s*\(/);
  });
});

describe('Tier 0.10 - threat model is documented', () => {
  it('docs/abuse-model.md exists', () => {
    expect(existsSync(join(ROOT, 'docs', 'abuse-model.md'))).toBe(true);
  });

  it('the doc covers every threat-actor category', () => {
    const doc = readFileSync(join(ROOT, 'docs', 'abuse-model.md'), 'utf8');
    expect(doc).toMatch(/Casual scraper/i);
    expect(doc).toMatch(/Credit thief/i);
    expect(doc).toMatch(/Privilege escalator/i);
    expect(doc).toMatch(/Stripe/i);
    expect(doc).toMatch(/Prompt injector/i);
  });

  it('the doc names the shared bot-guard helper as the baseline defense', () => {
    const doc = readFileSync(join(ROOT, 'docs', 'abuse-model.md'), 'utf8');
    expect(doc).toMatch(/botGuard/);
    expect(doc).toMatch(/requestMeta\.ts/);
  });

  it('the doc surfaces known gaps (not-yet-done items)', () => {
    const doc = readFileSync(join(ROOT, 'docs', 'abuse-model.md'), 'utf8');
    expect(doc).toMatch(/Gaps/i);
    expect(doc).toMatch(/anomaly logging|per-IP rate-limit/i);
  });
});
