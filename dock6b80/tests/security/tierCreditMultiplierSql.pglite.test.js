/**
 * tierCreditMultiplierSql.pglite.test.js — runs the REAL PL/pgSQL from migration
 * 192 (THE TIER MULTIPLIER) against in-process Postgres, like its siblings
 * creditLedger.pglite.test.js and surveyorProbeTierSql.pglite.test.js.
 *
 * WHAT IT PROVES BY EXECUTION (wave L-5 of docs/DESIGN_AI_CAPABILITY_LADDER.md):
 *   1. INERTNESS, MEASURED AS A DIFFERENCE. The same spend is run twice against
 *      two independently-built databases — one carrying the PRE-192 body (the
 *      net-current body as it stood at 174) and one carrying 192 — and the two
 *      ledgers are compared row for row. This is the wave's central claim: after
 *      the tier multiplier lands, every existing 2-arg caller is charged exactly
 *      what it was charged before. A source assertion could not establish that;
 *      only running both bodies can.
 *   2. A tier with no config row present charges the base price (absence of the
 *      'ai_tier_multipliers' row IS the inert state, and no migration seeds it).
 *   3. The machinery is REAL, not decorative: seed a multiplier of 2 and the
 *      charge doubles. Without this case, every green above would be consistent
 *      with a function that ignores p_tier entirely, and the wave would have
 *      shipped a no-op wearing a feature's name.
 *   4. An unrecognized tier string is treated as null and does NOT raise (the
 *      forward-compatibility contract: tier names are still an owner taste pick,
 *      so an edge deployed ahead of the database must degrade to the ordinary
 *      price rather than fail a paid call).
 *   5. The band holds at BOTH ends: a multiplier outside 0.5..3 is ignored, and
 *      an in-band multiplier is still clamped into 1..12.
 *
 * ⚠ THE NET-CURRENT RULE IS WHY THIS FILE EXTRACTS THE WAY IT DOES. Postgres
 * keeps only the LAST definition of a function, so a pin that reads one
 * migration's file goes green over a later migration that forked from a stale
 * ancestor and dropped a delta. Migration 191's header records the live instance
 * (159 recreated surveyor_byok_set from 139 and silently dropped 143's health
 * reset). So the suite resolves spend_credits as the NET-CURRENT body across the
 * WHOLE corpus, and separately reconstructs the PRE-192 body as the highest
 * definition BELOW 192 — which is what makes case 1 a real before/after rather
 * than a comparison of 192 against itself.
 *
 * The schema mirror and the auth/privileged GUC stubs follow
 * tests/security/creditLedgerHarness.js. assert_current_session (161's belt) is
 * stubbed permissive here: the belt has its own executed suite
 * (singleSessionBelt.pglite.test.js) and is asserted present by source below,
 * so re-proving it would only couple two suites together.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_192 = join(MIG_DIR, '192_tier_credit_multiplier.sql');
const haveMigration = existsSync(MIG_192);

const UID = '11111111-1111-1111-1111-111111111111';

/** Every migration file, in applied (numeric-prefix sorted) order. */
function migrationFiles() {
  return readdirSync(MIG_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort();
}

/**
 * ⚠ ANCHORED AT LINE START (`^` with the m flag) — not decoration. A migration
 * HEADER that quotes the create-or-replace statement in prose is matched by the
 * unanchored form, which then extracts the comment block instead of the function
 * and hands Postgres a page of English. That happened while this suite was being
 * written (192's own header quoted the statement), and it is the same shape as
 * the trap 191's suite documents, where an @rollback note spelling an ALTER
 * would have been executed in place of the migration. A comment line begins with
 * `--`, so anchoring makes the class impossible rather than merely absent.
 */
const SPEND_RE = /^create\s+or\s+replace\s+function\s+public\.spend_credits\b[\s\S]*?\$\$;/gim;

/**
 * The NET-CURRENT `public.spend_credits` — the last definition anywhere in the
 * corpus, i.e. the body the database actually ends up with. Throws rather than
 * returning nothing, so a rename can never make this suite silently vacuous.
 */
function netCurrentSpendCredits() {
  let last = null;
  for (const f of migrationFiles()) {
    for (const m of readFileSync(join(MIG_DIR, f), 'utf-8').matchAll(SPEND_RE)) last = { file: f, body: m[0] };
  }
  if (!last) throw new Error('could not extract a net-current public.spend_credits');
  return last;
}

/**
 * The `public.spend_credits` that WOULD be net-current if 192 did not exist —
 * the last definition in any migration numbered below 192. This is the honest
 * "before" for the inertness comparison: not a body hand-copied into this test
 * (which would drift), but the real previous body read off the corpus.
 */
function preTierSpendCredits() {
  let last = null;
  for (const f of migrationFiles()) {
    if (parseInt(f.slice(0, f.indexOf('_')), 10) >= 192) continue;
    for (const m of readFileSync(join(MIG_DIR, f), 'utf-8').matchAll(SPEND_RE)) last = { file: f, body: m[0] };
  }
  if (!last) throw new Error('could not extract a pre-192 public.spend_credits');
  return last;
}

/** Extract one function verbatim from a specific migration (line-anchored, as above). */
function extractFn(file, name) {
  const src = readFileSync(join(MIG_DIR, file), 'utf-8');
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name} from ${file}`);
  return m[0];
}

/**
 * A fresh database carrying the minimal credit schema plus ONE supplied
 * spend_credits body. Built per case so the two bodies can never contaminate
 * each other through a shared connection.
 */
async function makeDb(spendCreditsBody) {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    create or replace function public.current_user_is_privileged() returns boolean language sql stable as $fn$
      select coalesce(nullif(current_setting('test.privileged', true), '')::boolean, false)
    $fn$;
    -- 161's single-session belt: permissive stub (its own suite proves it).
    create or replace function public.assert_current_session() returns void
      language plpgsql as $fn$ begin return; end $fn$;
    -- 057's account gate: active unless a case flips the GUC.
    create or replace function public.account_is_active(p_user uuid) returns boolean
      language sql stable as $fn$
        select coalesce(current_setting('test.active', true), 'true') = 'true'
      $fn$;

    create table public.system_config (key text primary key, value jsonb not null);
    create table public.profiles (
      id uuid primary key, role text, tier text,
      credits integer not null default 0, is_founder boolean not null default false,
      updated_at timestamptz default now()
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
  await db.exec(extractFn('018_account_billing_models_credits.sql', 'get_credit_balance'));
  await db.exec(spendCreditsBody);
  await db.exec(`set test.uid = '${UID}';`);
  await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0);`);
  return db;
}

/** Grant the user credits, then run one spend and return the whole outcome. */
async function spendOnce(db, { feature, profile = null, tier = null, grant = 100 }) {
  await db.exec(`delete from public.credit_spend_allocations;`);
  await db.exec(`delete from public.credit_transactions;`);
  await db.exec(`delete from public.credit_ledger;`);
  await db.exec(`insert into public.credit_ledger (user_id, kind, amount, source) values ('${UID}', 'grant', ${grant}, 'test_grant');`);
  const call = tier === null && profile === null
    ? `select public.spend_credits($1) as r`
    : `select public.spend_credits($1, $2, $3) as r`;
  const params = tier === null && profile === null ? [feature] : [feature, profile, tier];
  const { rows } = await db.query(call, params);
  const ledger = await db.query(
    `select kind, amount, source from public.credit_ledger order by kind, amount, source`,
  );
  const txns = await db.query(`select amount, reason from public.credit_transactions order by amount, reason`);
  return { result: rows[0].r, ledger: ledger.rows, txns: txns.rows };
}

const seedMultipliers = (db, obj) =>
  db.query(`insert into public.system_config (key, value) values ('ai_tier_multipliers', $1)
            on conflict (key) do update set value = excluded.value`, [JSON.stringify(obj)]);

// Vacuity guards (run unconditionally): if 192 is renamed or renumbered the
// runIf suite below would silently run ZERO assertions while reporting green.
it('targeted migration present (suite not vacuous)', () => {
  expect(haveMigration, '192_tier_credit_multiplier.sql missing').toBe(true);
});

it('the net-current spend_credits carries the tier machinery, and the "before" body is a different file', () => {
  // Version-agnostic on purpose: a legitimate future recreate (193, 194…) just
  // becomes the new net-current and passes AS LONG AS it keeps the machinery —
  // the same shape moneyRpcNetCurrentGuards uses for the money guards. What may
  // never happen silently is a fork that drops the tier block.
  const current = netCurrentSpendCredits();
  expect(current.body, `${current.file} dropped the tier multiplier`).toContain('ai_tier_multipliers');
  expect(current.body, `${current.file} dropped the p_tier parameter`).toMatch(/p_tier\s+text\s+default\s+null/i);
  // The "before" body must be a DIFFERENT, earlier file — if these ever collapse
  // to the same one, the inertness case below would compare 192 against itself
  // and pass no matter what the migration did.
  expect(preTierSpendCredits().file).not.toBe(current.file);
});

/** Wall-clock ceiling for a hook that boots PGlite. See the note on the hook below. */
const PGLITE_BOOT_TIMEOUT_MS = 180_000;

describe.runIf(haveMigration)('192 tier credit multiplier — real SQL (pglite)', () => {
  let now;   // a db carrying 192
  let before; // a db carrying the pre-192 net-current body

  /**
   * PGLITE SPIN-UP NEEDS ITS OWN TIMEOUT, and the default is not it.
   *
   * This hook builds a whole in-process Postgres (two of them, in this file) and then
   * executes the extracted migration bodies against them. Unloaded that lands around 7
   * seconds; vitest's inherited hookTimeout is 10000ms. On a default `npx vitest run` the
   * pglite suites run CONCURRENTLY with everything else in the repo, and under that load the
   * hook blows the ceiling - at which point vitest fails the hook and SKIPS every test that
   * depended on it. The file then reports as red with almost all of its cases never
   * executed, so the inertness proof this suite exists to carry silently does not run on the
   * gate it was written for. That failure mode is measured, not theoretical: a plain
   * tests/security/ run on this machine skipped 379 cases and failed 48 files this way.
   *
   * The number below is deliberately generous rather than tuned. A hook timeout is a
   * deadlock guard, not a performance budget: the suite's real cost is what it is, and a
   * ceiling set near the measured time just converts machine load into a flaky red.
   */
  beforeAll(async () => {
    now = await makeDb(netCurrentSpendCredits().body);
    before = await makeDb(preTierSpendCredits().body);
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await now.exec(`delete from public.system_config where key = 'ai_tier_multipliers';`);
  });

  // ── 1. INERTNESS, measured against the real previous body ──────────────────
  describe('the 2-arg call is byte-identical to pre-192 behaviour', () => {
    const FEATURES = [
      'chronicle', 'narrative', 'dailyLife', 'progression',
      'narrative_fast', 'dailyLife_fast', 'progression_fast',
      'analysis', 'brief', 'interpret', 'parley',
      'customContent', 'styleOverhaul', 'constructSettlement', 'constructRealm', 'autonomy',
    ];

    it('every feature charges the same on a 153/174-shaped install and a 192 install', async () => {
      const drift = [];
      for (const feature of FEATURES) {
        const a = await spendOnce(before, { feature });
        const b = await spendOnce(now, { feature });
        if (JSON.stringify(a.ledger) !== JSON.stringify(b.ledger)) {
          drift.push(`${feature}: ledger ${JSON.stringify(a.ledger)} -> ${JSON.stringify(b.ledger)}`);
        }
        if (JSON.stringify(a.txns) !== JSON.stringify(b.txns)) {
          drift.push(`${feature}: txns ${JSON.stringify(a.txns)} -> ${JSON.stringify(b.txns)}`);
        }
        if (a.result.balance !== b.result.balance) {
          drift.push(`${feature}: balance ${a.result.balance} -> ${b.result.balance}`);
        }
      }
      expect(drift, `\n${drift.join('\n')}\n`).toEqual([]);
      // Non-vacuity: the loop really ran, and a spend really moved money.
      expect(FEATURES).toHaveLength(16);
      const probe = await spendOnce(now, { feature: 'narrative' });
      expect(probe.result.ok).toBe(true);
      expect(probe.ledger.some((r) => r.kind === 'spend' && r.amount === 5)).toBe(true);
    });

    it('an unknown feature still raises on both bodies', async () => {
      await expect(before.query(`select public.spend_credits('not_a_feature')`)).rejects.toThrow(/unknown feature/i);
      await expect(now.query(`select public.spend_credits('not_a_feature')`)).rejects.toThrow(/unknown feature/i);
    });
  });

  // ── 2. A tier with no config row is inert (the shipped state) ──────────────
  it('a tier with NO ai_tier_multipliers row charges the base price', async () => {
    const { rows } = await now.query(`select count(*)::int as n from public.system_config where key = 'ai_tier_multipliers'`);
    expect(rows[0].n, 'no migration may seed ai_tier_multipliers').toBe(0);
    for (const tier of ['scout', 'journeyman', 'master']) {
      const r = await spendOnce(now, { feature: 'narrative', tier });
      expect(r.ledger.find((x) => x.kind === 'spend').amount, `${tier} with no config row`).toBe(5);
    }
  });

  it('a multiplier of exactly 1 is byte-identical to no config row', async () => {
    await seedMultipliers(now, { scout: 1, journeyman: 1, master: 1 });
    for (const tier of ['scout', 'journeyman', 'master']) {
      const r = await spendOnce(now, { feature: 'progression', tier });
      expect(r.ledger.find((x) => x.kind === 'spend').amount, `${tier} at 1x`).toBe(6);
    }
  });

  // ── 3. The machinery is REAL (without this, everything above is a no-op) ───
  it('a multiplier of 2 actually doubles the charge', async () => {
    await seedMultipliers(now, { scout: 1, journeyman: 2, master: 3 });
    const base = await spendOnce(now, { feature: 'narrative' });
    expect(base.ledger.find((x) => x.kind === 'spend').amount).toBe(5);

    const doubled = await spendOnce(now, { feature: 'narrative', tier: 'journeyman' });
    expect(doubled.ledger.find((x) => x.kind === 'spend').amount).toBe(10);
    // The debit row and the transaction row must agree, or the ledger and the
    // balance would tell two different stories about the same spend.
    expect(doubled.txns.find((t) => t.reason === 'narrative').amount).toBe(-10);
    expect(doubled.result.balance).toBe(90);

    // Only the tier that was asked for is applied.
    const scouted = await spendOnce(now, { feature: 'narrative', tier: 'scout' });
    expect(scouted.ledger.find((x) => x.kind === 'spend').amount).toBe(5);
  });

  it('rounds to a whole credit (half away from zero)', async () => {
    await seedMultipliers(now, { journeyman: 1.5 });
    // analysis = 3; 3 * 1.5 = 4.5 -> 5.
    const r = await spendOnce(now, { feature: 'analysis', tier: 'journeyman' });
    expect(r.ledger.find((x) => x.kind === 'spend').amount).toBe(5);
  });

  // ── 4. Forward compatibility: an unknown tier degrades, never raises ───────
  it('an unrecognized tier string is treated as null and does NOT raise', async () => {
    await seedMultipliers(now, { scout: 1, journeyman: 2, master: 3, archmage: 3 });
    // 'archmage' is not in the function's vocabulary even though config names it:
    // the SQL's allow-list is the authority, so this must charge the base price.
    const r = await spendOnce(now, { feature: 'narrative', tier: 'archmage' });
    expect(r.result.ok).toBe(true);
    expect(r.ledger.find((x) => x.kind === 'spend').amount).toBe(5);
    // Empty string and a SQL-ish string are equally harmless.
    for (const bogus of ['', 'MASTER', "'; drop table public.profiles; --"]) {
      const b = await spendOnce(now, { feature: 'narrative', tier: bogus });
      expect(b.result.ok, `tier ${JSON.stringify(bogus)}`).toBe(true);
      expect(b.ledger.find((x) => x.kind === 'spend').amount).toBe(5);
    }
    // Guard-the-guard: the table the injection string named is still there.
    const { rows } = await now.query(`select count(*)::int as n from public.profiles`);
    expect(rows[0].n).toBe(1);
  });

  // ── 5. The band, at both ends ──────────────────────────────────────────────
  it('a multiplier outside the 0.5..3 band is ignored (config blast radius)', async () => {
    for (const bad of [30, 0, -2, 3.5, 0.4]) {
      await seedMultipliers(now, { master: bad });
      const r = await spendOnce(now, { feature: 'narrative', tier: 'master' });
      expect(r.ledger.find((x) => x.kind === 'spend').amount, `multiplier ${bad} must be ignored`).toBe(5);
    }
    // The edges of the band ARE honoured (proving the fence is at 0.5/3, not wider).
    // narrative = 5, tripled = 15, then clamped by the hard band to 12.
    await seedMultipliers(now, { master: 3 });
    expect((await spendOnce(now, { feature: 'narrative', tier: 'master' })).ledger
      .find((x) => x.kind === 'spend').amount).toBe(12);
    await seedMultipliers(now, { master: 0.5 });
    // analysis = 3; 3 * 0.5 = 1.5 -> 2.
    expect((await spendOnce(now, { feature: 'analysis', tier: 'master' })).ledger
      .find((x) => x.kind === 'spend').amount).toBe(2);
  });

  it('the result is clamped into the hard 1..12 band at both ends', async () => {
    // Ceiling: constructRealm = 8, tripled = 24, clamped to 12.
    await seedMultipliers(now, { master: 3 });
    const high = await spendOnce(now, { feature: 'constructRealm', tier: 'master' });
    expect(high.ledger.find((x) => x.kind === 'spend').amount).toBe(12);

    // Floor: chronicle = 2, halved = 1 — already the floor; and the floor holds
    // rather than ever reaching 0 (a free paid call is the failure this clamps).
    await seedMultipliers(now, { scout: 0.5 });
    const low = await spendOnce(now, { feature: 'chronicle', tier: 'scout' });
    expect(low.ledger.find((x) => x.kind === 'spend').amount).toBe(1);
  });

  // ── The config-first path still wins, and is multiplied consistently ───────
  it('the profile config cost is what gets multiplied (config-first survives the fork)', async () => {
    await now.query(`insert into public.system_config (key, value) values ('ai_credit_costs', $1)
                     on conflict (key) do update set value = excluded.value`,
      [JSON.stringify({ profiles: { anthropic_claude_opus_4_8: { narrative: 4 } } })]);
    // No tier: the config cost (4) beats the CASE (5).
    const plain = await spendOnce(now, { feature: 'narrative', profile: 'anthropic_claude_opus_4_8', tier: null });
    expect(plain.ledger.find((x) => x.kind === 'spend').amount).toBe(4);
    // With a tier: the multiplier applies to the CONFIG cost, not the CASE cost.
    await seedMultipliers(now, { journeyman: 2 });
    const tiered = await spendOnce(now, { feature: 'narrative', profile: 'anthropic_claude_opus_4_8', tier: 'journeyman' });
    expect(tiered.ledger.find((x) => x.kind === 'spend').amount).toBe(8);
    await now.exec(`delete from public.system_config where key = 'ai_credit_costs';`);
  });

  // ── Source-level: the deltas a future fork must not drop ───────────────────
  it('192 carries every delta of the body it forked (161 belt, 057 gate, 174 prices)', () => {
    const { body } = netCurrentSpendCredits();
    expect(body).toContain('assert_current_session');   // 161
    expect(body).toContain('account_is_active');        // 057
    expect(body).toMatch(/for\s+update/i);              // 024/087 serialization
    expect(body).toContain('ai_credit_costs');          // 114 config-first
    expect(body).toMatch(/set search_path = public, pg_temp/i); // 131
    expect(body).toMatch(/when 'narrative' then 5/i);   // 174 reprice
    expect(body).toMatch(/when 'progression' then 6/i); // 174 reprice
    expect(body).toMatch(/when 'autonomy' then 4/i);    // 153
    // Guard-the-guard: 192 must NOT reintroduce the pre-174 prices.
    expect(body).not.toMatch(/when 'narrative' then 3/i);
    expect(body).not.toMatch(/when 'progression' then 5/i);
  });

  it('the 2-arg overload is dropped so named-argument rpc() stays unambiguous', () => {
    const src = readFileSync(MIG_192, 'utf-8');
    expect(src).toMatch(/drop function if exists public\.spend_credits\(text, text\);/i);
    // The grants are re-issued on the new signature (the DROP forfeits them).
    expect(src).toMatch(/grant execute on function public\.spend_credits\(text, text, text\) to authenticated/i);
  });

  it('no migration seeds ai_tier_multipliers anywhere in the corpus (absence is the inert state)', () => {
    // Strip `--` comment lines before scanning. 192's header deliberately spells
    // the activation INSERT the owner will one day run, and documentation of a
    // thing is not the thing: this detector must see EXECUTABLE seeds only.
    const executable = (src) => src.split('\n').filter((l) => !/^\s*--/.test(l)).join('\n');
    const seeders = migrationFiles().filter((f) => (
      /insert\s+into\s+public\.system_config[\s\S]{0,400}ai_tier_multipliers/i
        .test(executable(readFileSync(join(MIG_DIR, f), 'utf-8')))
    ));
    expect(seeders, `these migrations seed the multiplier config: ${seeders.join(', ')}`).toEqual([]);

    // Guard-the-guard: the detector must still fire on a real seed, or this
    // green means only that the regex stopped working.
    const realSeed = "insert into public.system_config (key, value) values ('ai_tier_multipliers', '{}'::jsonb);";
    expect(/insert\s+into\s+public\.system_config[\s\S]{0,400}ai_tier_multipliers/i.test(executable(realSeed))).toBe(true);
    expect(executable(`-- ${realSeed}`)).not.toContain('insert');
  });
});
