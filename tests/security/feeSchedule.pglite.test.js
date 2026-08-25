/**
 * feeSchedule.pglite.test.js — the money-path fee-schedule PARITY PIN.
 *
 * "What does an AI generation cost?" is a two-source price fact on the paid
 * path, and the two sources live in different languages and repos:
 *
 *   · CLIENT quote  — src/config/pricing.js getAiCostForModel(feature, model)
 *                     picks NEW_AI_COSTS (standard) or FAST_AI_COSTS (fast).
 *                     This is the pre-flight number the UI shows the buyer.
 *   · SERVER charge — the spend_credits(feature) RPC (migration 024) has its
 *                     OWN internal CASE fee schedule and is the ONLY thing that
 *                     actually debits the ledger. The edge function passes just
 *                     the feature STRING; the RPC decides the price.
 *
 * If those two drift, the app quotes one price and charges another — a live
 * billing bug that no unit test on either side alone would catch, because each
 * side is internally consistent. (A third mirror, generate-narrative's
 * CREDIT_COSTS map, is the relay that turns modelPreference → feature string;
 * it is pinned by its own contract test. This pin nails the two ENDPOINTS: the
 * client's quote and the database's actual charge.)
 *
 * This runs the REAL RPC body (extracted verbatim from migration 024, with
 * get_credit_balance from 018) inside in-process Postgres (pglite) — the same
 * house pattern as creditLedger.pglite.test.js — and, for every feature × model
 * the client can request, asserts the ledger debit equals pricing.js's quote.
 *
 * The pin FAILS IF EITHER SOURCE CHANGES ALONE:
 *   · bump a number in pricing.js only → quote ≠ ledger debit → red.
 *   · bump a number in the 024 CASE only → ledger debit ≠ quote → red.
 * Restore parity (change both) and it goes green again — which is the point:
 * the two must move together.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AI_MODEL_OPTIONS,
  getAiCostForModel,
  isFastModelPreference,
} from '../../src/config/pricing.js';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG = {
  '018': resolve(dir, '018_account_billing_models_credits.sql'),
  '024': resolve(dir, '024_billing_retention_and_atomic_mutations.sql'),
};
const allExist = Object.values(MIG).every(existsSync);

/** Extract a function definition verbatim from a migration file: from
 *  `create or replace function public.<name>` to the first `$$;`. */
function extractFn(migKey, name) {
  const src = readFileSync(MIG[migKey], 'utf-8');
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration ${migKey}`);
  return m[0];
}

// The three generation types generate-narrative accepts (index.ts validates
// type ∈ these). Chronicle is a separate feature spent by a different function
// and is not quoted by pricing.js, so it is out of this pin's scope.
const FEATURES = ['narrative', 'dailyLife', 'progression'];

// Mirror of generate-narrative's spendFeatureFor(type, modelPreference):
//   profile.costTier === 'fast' ? `${type}_fast` : type
// isFastModelPreference reads the SAME AI_MODEL_OPTIONS costTier the edge
// function mirrors, so this reproduces the server's feature-string mapping
// from the client-facing model key alone.
const spendFeatureFor = (feature, modelKey) =>
  isFastModelPreference(modelKey) ? `${feature}_fast` : feature;

// The full client-requestable matrix: every model the picker offers × every
// generation type. Each row carries the feature STRING the RPC will see and the
// quote pricing.js shows the buyer for that exact combination.
const MATRIX = AI_MODEL_OPTIONS.flatMap(model =>
  FEATURES.map(feature => ({
    modelKey: model.key,
    modelLabel: model.label,
    costTier: model.costTier,
    feature,
    spendFeature: spendFeatureFor(feature, model.key),
    quote: getAiCostForModel(feature, model.key),
  })),
);

const UID = '11111111-1111-1111-1111-111111111111';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const setPrivileged = (v) => db.exec(`set test.privileged = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const grant = (uid, amount) =>
  db.query(
    `insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'grant',$2,'purchase')`,
    [uid, amount],
  );

// Anti-vacuity ([tests-3]/[test-quality-2]): a renamed/renumbered pinned migration
// (the master-merge reconciliation risk) would silently skip the execution suite
// below and vitest would stay green. This UNCONDITIONAL assert fails loudly instead.
describe('fee-schedule migration fixtures exist (guards against silent vacuous skip)', () => {
  it('every pinned migration is present (a renamed/renumbered file must fail loudly)', () => {
    for (const [k, p] of Object.entries(MIG)) {
      expect(existsSync(p), `migration ${k} missing: ${p}`).toBe(true);
    }
    expect(allExist).toBe(true);
  });
});

describe.runIf(allExist)('fee-schedule parity — pricing.js quote == spend_credits RPC charge (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Minimal harness: auth.uid()/privilege stubs + the four credit tables, then
    // the REAL get_credit_balance (018) and spend_credits (024) bodies.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
      $fn$;
      create table public.profiles (
        id uuid primary key, role text,
        credits integer not null default 0, updated_at timestamptz default now()
      );
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null check (kind in ('grant','spend')),
        amount integer not null check (amount > 0), source text not null,
        metadata jsonb not null default '{}'::jsonb,
        expires_at timestamptz, reversed_by uuid, created_at timestamptz not null default now()
      );
      create table public.credit_transactions (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        amount integer not null, reason text not null, created_at timestamptz not null default now()
      );
      create table public.credit_spend_allocations (
        spend_id uuid not null references public.credit_ledger(id) on delete cascade,
        grant_id uuid not null references public.credit_ledger(id) on delete cascade,
        amount integer not null check (amount > 0),
        created_at timestamptz not null default now(),
        primary key (spend_id, grant_id)
      );
    `);
    await db.exec(extractFn('018', 'get_credit_balance'));
    await db.exec(extractFn('024', 'spend_credits'));
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load — beyond the 10s default.

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0);`);
    await setPrivileged(false);
    await asUser(UID);
  });

  // ── the matrix is real and exercises BOTH schedules ───────────────────────
  it('covers every model × feature the client can request (standard AND fast)', () => {
    expect(MATRIX.length).toBe(AI_MODEL_OPTIONS.length * FEATURES.length);
    expect(MATRIX.some(r => r.spendFeature.endsWith('_fast'))).toBe(true);  // fast tier reached
    expect(MATRIX.some(r => !r.spendFeature.endsWith('_fast'))).toBe(true); // standard tier reached
    // Every quote is a real, positive price (never the pricing.js `?? 0`
    // fallback — that would mean a feature name drifted out of the schedule).
    for (const row of MATRIX) {
      expect(row.quote, `pricing.js quotes 0 for ${row.feature}/${row.modelKey}`).toBeGreaterThan(0);
    }
    // The two schedules are genuinely different, so the pin proves it discriminates
    // (a bug that collapsed fast→standard would be caught by a real mismatch).
    const standard = getAiCostForModel('narrative', 'anthropic_claude_opus_4_8');
    const fast = getAiCostForModel('narrative', 'anthropic_claude_haiku_4_5');
    expect(standard).not.toBe(fast);
  });

  // ── THE PIN: for each feature × model, the RPC debits exactly the quote ────
  it.each(MATRIX)(
    'charges the pricing.js quote for $feature via $modelLabel → feature "$spendFeature" costs $quote',
    async ({ spendFeature, quote }) => {
      const START = 50; // > any single-feature cost, so the spend always clears
      await grant(UID, START);

      const { r } = await scalar(`select public.spend_credits('${spendFeature}') as r`);
      expect(r.ok, `RPC rejected feature "${spendFeature}" (unknown to the 024 CASE?)`).toBe(true);

      // The amount the ledger actually debited — the SERVER's charged price.
      const charged = (await scalar(
        `select amount from public.credit_ledger where kind='spend' order by created_at desc limit 1`,
      )).amount;

      // Parity, both directions of the same fact:
      expect(charged).toBe(quote);           // ledger debit == client pre-flight quote
      expect(START - r.balance).toBe(quote); // and the running balance moved by exactly that
    },
  );
});
