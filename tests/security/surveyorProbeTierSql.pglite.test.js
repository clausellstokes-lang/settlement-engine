/**
 * surveyorProbeTierSql.pglite.test.js — runs the REAL PL/pgSQL from migration 191
 * (THE COMPETENCY PROBE's earned-tier receipt) against in-process Postgres (pglite),
 * like surveyorByokHealth.pglite.test.js.
 *
 * What it proves by EXECUTION:
 *   - the five probe columns exist with the tier check constraint actually enforcing
 *     the three measured classes (and NULL, which means "never probed"), and the
 *     probe_version constraint admitting only a semver triple;
 *   - surveyor_byok_set_probe_tier stamps the tier + probe_checked_at + probe_model +
 *     probe_version + probe_profile, rejects a class outside the vocabulary, rejects
 *     NULL (only a rotate clears a tier), and no-ops on a user with no key row;
 *   - THE PROFILE WALL (wave L-7a): the setter accepts only a closed-vocabulary verdict
 *     list, so prose, ids, free-form keys, unknown reason classes and half-verdicts are
 *     all refused AT THE DATABASE rather than trusted from its one caller;
 *   - surveyor_byok_status returns EVERY column 143 returned PLUS the five new ones,
 *     still without the ciphertext;
 *   - surveyor_byok_set RESETS health AND the whole probe receipt on both the insert
 *     and the rotate path.
 *
 * ⚠ THE NET-CURRENT RULE IS THE POINT OF THIS FILE. Postgres keeps only the LAST
 * definition of a function, so a pin that reads one migration's file can go green over
 * a later migration that dropped a delta. That is not hypothetical here: 143 taught
 * surveyor_byok_set to reset health, 159 recreated it from 139's body to add the
 * entitlement gate and silently dropped the reset, and the 143-scoped source pin in
 * surveyorByokHealth.pglite.test.js could not see it. So this suite extracts every
 * function under test as the NET-CURRENT definition across the WHOLE migration corpus
 * and EXECUTES it. A future recreate that drops a delta reds here.
 *
 * pgcrypto is unavailable in pglite, so pgp_sym_encrypt and the vault secret are
 * stubbed with pass-through equivalents; that lets the real surveyor_byok_set body run
 * verbatim instead of being asserted by source. The stub never encrypts anything and
 * no key material is involved: the tests write the literal string 'k1'.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_191 = join(MIG_DIR, '191_surveyor_probe_tier.sql');
const haveMigration = existsSync(MIG_191);

const UID = '11111111-1111-1111-1111-111111111111';
const UID2 = '22222222-2222-2222-2222-222222222222';

/** Every migration's SQL, in applied (numeric-prefix sorted) order. */
function migrationSources() {
  return readdirSync(MIG_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort()
    .map((f) => readFileSync(join(MIG_DIR, f), 'utf-8'));
}

/**
 * The NET-CURRENT definition of `public.<name>` — the LAST `create or replace function`
 * for it anywhere in the corpus, which is the body the database actually ends up with.
 * Throws rather than returning nothing, so a renamed function can never make a suite
 * silently vacuous.
 *
 * ⚠ ANCHORED AT LINE START (`^` with the m flag) — not decoration. A migration HEADER
 * that quotes the create-or-replace statement in prose is matched by the unanchored
 * form, which then extracts the comment block instead of the function and hands
 * Postgres a page of English. That happened during wave L-5 of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md (192's own header quoted the statement), and it
 * is the same shape as the trap this file's ALTER extraction documents below, where an
 * @rollback note spelling an ALTER would have been executed in place of the migration.
 * It is live in the corpus today: 101's @rollback note quotes the statement for
 * current_user_is_privileged, and 098's wraps it mid-identifier. A comment line begins
 * with `--`, so anchoring makes the class impossible rather than merely absent. The
 * anchored form is shared with tests/security/tierCreditMultiplierSql.pglite.test.js
 * and tests/security/moneyRpcNetCurrentGuards.test.js — keep the three in step.
 */
function netCurrentFn(name) {
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'gim');
  let last = null;
  for (const src of migrationSources()) {
    for (const m of src.matchAll(re)) last = m[0];
  }
  if (!last) throw new Error(`could not extract a net-current body for public.${name}`);
  return last;
}

let db;
const scalar = async (q, params) => (await db.query(q, params)).rows[0];
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const setKey = async (provider = 'anthropic', key = 'k1') =>
  (await scalar('select public.surveyor_byok_set($1,$2) as r', [provider, key])).r;
const setTier = async (uid, provider, tier, model = null) =>
  (await scalar('select public.surveyor_byok_set_probe_tier($1,$2,$3,$4) as r', [uid, provider, tier, model])).r;
/** The wave L-7a six-argument call: tier + model + exam version + per-task verdict profile. */
const setTierFull = async (uid, provider, tier, model, version, profile) =>
  (await scalar(
    'select public.surveyor_byok_set_probe_tier($1,$2,$3,$4,$5,$6::jsonb) as r',
    [uid, provider, tier, model, version, profile === null ? null : JSON.stringify(profile)],
  )).r;
/** A well-formed profile in migration 191's documented shape. */
const profileOf = (tasks) => ({
  tasks, passes: tasks.filter((t) => t.passed).length, tasksRun: tasks.length,
});
const passTask = (key) => ({ key, passed: true, reasonClass: null });
const failTask = (key, reasonClass) => ({ key, passed: false, reasonClass });
const status = async () => (await db.query('select * from public.surveyor_byok_status(null)')).rows;
const keyRow = async (uid) => scalar('select * from public.surveyor_byok_keys where user_id = $1', [uid]);

// Vacuity guard (runs unconditionally): if 191 is renamed or renumbered the runIf
// suite below would silently run ZERO assertions while reporting green.
it('targeted migration present (suite not vacuous)', () => {
  expect(haveMigration, '191_surveyor_probe_tier.sql missing').toBe(true);
});

/**
 * Wall-clock ceiling for the hook that boots PGlite and installs the migration bodies.
 *
 * A hook timeout is a DEADLOCK GUARD, not a performance budget, and the two want opposite
 * numbers. This hook previously carried 30000ms, chosen as "cold start is about 20s under
 * loaded runs" - a value tuned to the measurement, which means any run slower than the day
 * it was measured turns into a red. And a blown hook here is not one failing case: vitest
 * fails the hook and SKIPS every test that depended on it, so the file reports red with its
 * whole proof unexecuted. The sibling tierCreditMultiplierSql suite lost 13 of 15 cases
 * exactly that way on a plain `npx vitest run`, which is the gate these suites exist to run
 * on. Generous is the correct direction: a suite that genuinely hangs still fails, and a
 * suite that is merely sharing a machine still proves what it was written to prove.
 */
const PGLITE_BOOT_TIMEOUT_MS = 180_000;

describe.runIf(haveMigration)('191 surveyor probe tier — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- pgcrypto stand-ins (pglite has no pgcrypto). Pass-through, never encryption:
      -- their only job is to let 139/159/191's real surveyor_byok_set body execute.
      create or replace function public._surveyor_byok_secret() returns text
        language sql stable as $fn$ select 'test-secret' $fn$;
      create or replace function public.pgp_sym_encrypt(p_data text, p_key text) returns bytea
        language sql immutable as $fn$ select convert_to(p_data || p_key, 'UTF8') $fn$;
      -- The decrypt half, added for wave L-WIRE's surveyor_byok_get. It INVERTS the
      -- pass-through above by stripping the appended secret, so a round-trip returns the
      -- original plaintext and a test that claims to read a key back is really reading it
      -- back rather than reading the stand-in's own bookkeeping.
      create or replace function public.pgp_sym_decrypt(p_data bytea, p_key text) returns text
        language sql immutable as $fn$
          select left(convert_from(p_data, 'UTF8'),
                      length(convert_from(p_data, 'UTF8')) - length(p_key))
        $fn$;
      -- The 159 entitlement-gate rider's two dependencies.
      create table public.profiles (id uuid primary key, is_founder boolean not null default false);
      create or replace function public.has_surveyor_entitlement() returns boolean
        language sql stable as $fn$ select coalesce(current_setting('test.entitled', true), 'true') = 'true' $fn$;
      create table public.surveyor_byok_keys (
        user_id uuid not null,
        provider text not null default 'anthropic',
        ciphertext bytea not null,
        created_at timestamptz not null default now(),
        rotated_at timestamptz not null default now(),
        health text not null default 'unverified'
          check (health in ('unverified','healthy','out_of_credit','invalid','rate_limited','down')),
        last_verified_at timestamptz,
        last_checked_at timestamptz,
        last_error_class text,
        primary key (user_id, provider)
      );
    `);
    // The migration's own column additions + constraint, executed verbatim.
    const src191 = readFileSync(MIG_191, 'utf-8');
    // Anchored on the first added column, NOT on `alter table` alone: the header's
    // @rollback note also spells an ALTER, and matching that would have executed the
    // reversal instead of the migration.
    const alter = src191.match(/alter table public\.surveyor_byok_keys\s+add column if not exists probe_tier[\s\S]*?;/i);
    expect(alter, '191 must ADD the probe columns to surveyor_byok_keys').not.toBeNull();
    // All FIVE, and probe_profile last: the non-greedy match stops at the first semicolon,
    // so this loop is also the truncation detector. A stray semicolon in one of the ALTER's
    // own comments would silently lop the tail off and this reds instead.
    for (const col of ['probe_tier', 'probe_checked_at', 'probe_model', 'probe_version', 'probe_profile']) {
      expect(alter[0], `the extracted ALTER must add ${col}`).toContain(col);
    }
    await db.exec(alter[0]);
    // The four functions, each as its NET-CURRENT body across the whole corpus.
    // surveyor_byok_get is the wave L-WIRE addition, and it is the one function here with
    // TWO definitions in the corpus (139's returns-text body and 191's returns-jsonb one),
    // so the net-current rule is doing real work rather than restating a single source.
    await db.exec(netCurrentFn('surveyor_byok_set'));
    await db.exec(netCurrentFn('surveyor_byok_status'));
    await db.exec(netCurrentFn('surveyor_byok_set_probe_tier'));
    await db.exec(netCurrentFn('surveyor_byok_get'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec('truncate public.surveyor_byok_keys; truncate public.profiles;');
    await db.exec(`insert into public.profiles (id, is_founder) values ('${UID}', false), ('${UID2}', false);`);
    await db.exec(`set test.entitled = 'true';`);
    await asUser(UID);
  });

  describe('the probe columns', () => {
    it('all five exist, and NULL is a legal tier (never probed is not a low score)', async () => {
      await setKey();
      const row = await keyRow(UID);
      expect(Object.keys(row)).toEqual(expect.arrayContaining([
        'probe_tier', 'probe_checked_at', 'probe_model', 'probe_version', 'probe_profile',
      ]));
      expect(row.probe_tier).toBeNull();
      expect(row.probe_checked_at).toBeNull();
      expect(row.probe_model).toBeNull();
      expect(row.probe_version).toBeNull();
      expect(row.probe_profile).toBeNull();
    });

    it('probe_version admits a semver triple and nothing else (never prose)', async () => {
      await setKey();
      await db.query('update public.surveyor_byok_keys set probe_version = $1 where user_id = $2', ['1.0.0', UID]);
      expect((await keyRow(UID)).probe_version).toBe('1.0.0');
      for (const bad of ['v1.0.0', '1.0', 'the first exam', '1.0.0 (revised)']) {
        await expect(
          db.query('update public.surveyor_byok_keys set probe_version = $1 where user_id = $2', [bad, UID]),
          `${bad} must be refused`,
        ).rejects.toThrow();
      }
    });

    it('the check constraint admits exactly the three measured classes', async () => {
      await setKey();
      for (const tier of ['scout', 'journeyman', 'master']) {
        await db.query('update public.surveyor_byok_keys set probe_tier = $1 where user_id = $2', [tier, UID]);
        expect((await keyRow(UID)).probe_tier).toBe(tier);
      }
      await expect(
        db.query('update public.surveyor_byok_keys set probe_tier = $1 where user_id = $2', ['grandmaster', UID]),
      ).rejects.toThrow();
    });
  });

  describe('surveyor_byok_set_probe_tier', () => {
    it('stamps the tier, the checked-at time, and the model that earned it', async () => {
      await setKey();
      expect(await setTier(UID, 'anthropic', 'journeyman', 'claude-haiku-4-5')).toBe(true);
      const row = await keyRow(UID);
      expect(row.probe_tier).toBe('journeyman');
      expect(row.probe_checked_at).not.toBeNull();
      expect(row.probe_model).toBe('claude-haiku-4-5');
      // The health half is untouched: a probe measures capability, not reachability.
      expect(row.health).toBe('unverified');
    });

    it('normalizes a blank model to null rather than storing an empty string', async () => {
      await setKey();
      await setTier(UID, 'anthropic', 'master', '   ');
      expect((await keyRow(UID)).probe_model).toBeNull();
    });

    it('rejects a tier outside the vocabulary, and rejects NULL (only a rotate clears one)', async () => {
      await setKey();
      await expect(setTier(UID, 'anthropic', 'grandmaster')).rejects.toThrow(/invalid byok probe tier/i);
      await expect(setTier(UID, 'anthropic', null)).rejects.toThrow(/invalid byok probe tier/i);
    });

    it('is a no-op (false) when the user has no key row for that provider', async () => {
      expect(await setTier(UID, 'anthropic', 'master')).toBe(false);
      expect(await setTier(null, 'anthropic', 'master')).toBe(false);
    });

    it('SOURCE PIN: revoked from PUBLIC and granted only to service_role', () => {
      const src = readFileSync(MIG_191, 'utf-8');
      // The wave L-7a signature. The revoke/grant name a SIGNATURE, so the two extra
      // parameters had to be carried into both lines: a stale 4-argument revoke would
      // leave the real 6-argument function with its inherited PUBLIC grant.
      expect(src).toMatch(/revoke\s+all\s+on\s+function\s+public\.surveyor_byok_set_probe_tier\(uuid, text, text, text, text, jsonb\)\s+from\s+public;/i);
      expect(src).toMatch(/grant\s+execute\s+on\s+function\s+public\.surveyor_byok_set_probe_tier\(uuid, text, text, text, text, jsonb\)\s+to\s+service_role;/i);
      // and never to the browser-reachable roles
      expect(src).not.toMatch(/grant\s+execute\s+on\s+function\s+public\.surveyor_byok_set_probe_tier\([^)]*\)\s+to\s+(authenticated|anon)/i);
      // no orphaned 4-argument grant left behind by the amendment
      expect(src).not.toMatch(/on\s+function\s+public\.surveyor_byok_set_probe_tier\(uuid, text, text, text\)/i);
    });
  });

  // ── wave L-7a: the exam receipt (version + per-task verdict profile) ───────────
  describe('surveyor_byok_set_probe_tier — the L-7a exam receipt', () => {
    const PROFILE = profileOf([
      passTask('construct'), failTask('customContent', 'unsupported_emitted'), passTask('interpret'),
    ]);

    it('ROUND TRIP: a seeded profile comes back byte-for-byte, with the exam version', async () => {
      await setKey();
      expect(await setTierFull(UID, 'anthropic', 'journeyman', 'claude-haiku-4-5', '1.0.0', PROFILE)).toBe(true);
      const row = await keyRow(UID);
      expect(row.probe_tier).toBe('journeyman');
      expect(row.probe_version).toBe('1.0.0');
      expect(row.probe_profile).toEqual(PROFILE);
      // and the same profile read back through the user-facing status function
      expect((await status())[0].probe_profile).toEqual(PROFILE);
    });

    it('the L-7a parameters are OPTIONAL: a four-argument call still records a tier', async () => {
      await setKey();
      expect(await setTier(UID, 'anthropic', 'master', 'claude-opus-4-8')).toBe(true);
      const row = await keyRow(UID);
      expect(row.probe_tier).toBe('master');
      expect(row.probe_version).toBeNull();
      expect(row.probe_profile).toBeNull();
    });

    it('a blank version normalizes to null rather than an empty string', async () => {
      await setKey();
      await setTierFull(UID, 'anthropic', 'scout', null, '   ', null);
      expect((await keyRow(UID)).probe_version).toBeNull();
    });

    it('a re-probe REPLACES the whole receipt (no half-updated profile survives)', async () => {
      await setKey();
      await setTierFull(UID, 'anthropic', 'journeyman', 'claude-haiku-4-5', '1.0.0', PROFILE);
      const next = profileOf([passTask('construct'), passTask('customContent'), passTask('interpret')]);
      await setTierFull(UID, 'anthropic', 'master', 'claude-opus-4-8', '1.1.0', next);
      const row = await keyRow(UID);
      expect(row.probe_tier).toBe('master');
      expect(row.probe_version).toBe('1.1.0');
      expect(row.probe_profile).toEqual(next);
    });
  });

  describe('THE PROFILE WALL — the setter stores verdicts, and only verdicts', () => {
    /** Every rejection below must be the setter talking, not a cast or a constraint. */
    const rejects = async (profile, why) => {
      await expect(
        setTierFull(UID, 'anthropic', 'master', null, '1.0.0', profile),
        why,
      ).rejects.toThrow(/invalid byok probe profile/i);
    };

    it('guard the guard: the well-formed profile this suite mutates is ACCEPTED', async () => {
      await setKey();
      // Without this, every rejection below could be passing for the wrong reason.
      expect(await setTierFull(
        UID, 'anthropic', 'master', null, '1.0.0',
        profileOf([passTask('construct'), failTask('interpret', 'below_floor')]),
      )).toBe(true);
    });

    it('refuses PROSE anywhere it could hide: a task key that is a sentence, or an id', async () => {
      await setKey();
      await rejects(profileOf([{ key: 'the model did badly on this one', passed: false, reasonClass: 'no_output' }]), 'a sentence is not a task key');
      await rejects(profileOf([{ key: 'user_88f3-4c21', passed: false, reasonClass: 'no_output' }]), 'an id is not a task key');
      await rejects(profileOf([{ key: '', passed: true, reasonClass: null }]), 'an empty key');
      await rejects(profileOf([{ key: 'x'.repeat(33), passed: true, reasonClass: null }]), 'a key long enough to hide text in');
      await rejects(profileOf([{ key: 42, passed: true, reasonClass: null }]), 'a non-string key');
    });

    it('refuses an EXTRA field on a verdict (the smuggling lane for model output)', async () => {
      await setKey();
      await rejects({
        tasks: [{ key: 'construct', passed: false, reasonClass: 'no_output', note: 'it apologised at length' }],
        passes: 0, tasksRun: 1,
      }, 'an extra per-task field');
      await rejects({
        tasks: [passTask('construct')], passes: 1, tasksRun: 1, answer: 'the raw model text',
      }, 'an extra top-level field');
    });

    it('refuses a reason class the vocabulary does not declare', async () => {
      await setKey();
      await rejects(profileOf([failTask('construct', 'wrong_family')]), 'an undeclared class');
      await rejects(profileOf([failTask('construct', 'no_output ')]), 'a class with stowaway whitespace');
    });

    it('refuses a HALF VERDICT: a pass carrying a reason, or a failure carrying none', async () => {
      await setKey();
      await rejects(profileOf([{ key: 'construct', passed: true, reasonClass: 'no_output' }]), 'a pass with a reason');
      await rejects(profileOf([{ key: 'construct', passed: false, reasonClass: null }]), 'a failure with no reason');
      await rejects(profileOf([{ key: 'construct', passed: 'yes', reasonClass: null }]), 'a non-boolean verdict');
    });

    it('refuses counts that do not match the verdicts they summarise', async () => {
      await setKey();
      await rejects({ tasks: [passTask('construct')], passes: 1, tasksRun: 3 }, 'tasksRun disagreeing with the array');
      await rejects({ tasks: [passTask('construct')], passes: 2, tasksRun: 1 }, 'more passes than tasks');
      await rejects({ tasks: [passTask('construct')], passes: -1, tasksRun: 1 }, 'a negative pass count');
      await rejects({ tasks: [passTask('construct')], passes: 'one', tasksRun: 1 }, 'a spelled-out count');
    });

    it('refuses a shape that is not a verdict list at all', async () => {
      await setKey();
      await rejects({ tasks: 'nope', passes: 0, tasksRun: 0 }, 'tasks that is a string');
      await rejects({ tasks: [], passes: 0, tasksRun: 0 }, 'an empty verdict list');
      await rejects({ tasks: ['construct'], passes: 0, tasksRun: 1 }, 'a bare string where a verdict belongs');
      await rejects({ passes: 0, tasksRun: 0 }, 'a missing tasks key');
      await rejects([passTask('construct')], 'an array at the top level');
      await rejects(
        profileOf(Array.from({ length: 9 }, (_, i) => passTask(`task${i}`))),
        'more verdicts than the bound allows',
      );
    });

    it('a REJECTED profile writes nothing at all (the tier does not sneak in beside it)', async () => {
      await setKey();
      await setTierFull(UID, 'anthropic', 'scout', 'claude-haiku-4-5', '1.0.0', profileOf([passTask('construct')]));
      await rejects(profileOf([failTask('construct', 'wrong_family')]), 'the plant');
      // the previous receipt is intact: the raise aborted the whole statement
      const row = await keyRow(UID);
      expect(row.probe_tier).toBe('scout');
      expect(row.probe_profile).toEqual(profileOf([passTask('construct')]));
    });

    it('NEGATIVE CONTROL: strip the wall and the prose lands in the column', async () => {
      // The plant, executed rather than argued: take the net-current setter, remove the
      // whole validation block, install it under a second name, and show that the same
      // profile this suite rejects is then stored verbatim. If this control ever stops
      // reproducing, the assertions above have stopped discriminating.
      const netCurrent = netCurrentFn('surveyor_byok_set_probe_tier');
      const stripped = netCurrent
        .replace(/public\.surveyor_byok_set_probe_tier\b/g, 'public.surveyor_byok_set_probe_tier_unwalled')
        // ` {2}end if;` is the OUTER guard's closer at two-space indent; every inner one
        // sits deeper, so the non-greedy match cannot stop early inside the block.
        .replace(/if p_profile is not null then[\s\S]*?\n {2}end if;\n/, '');
      expect(netCurrent, 'guard the plant: the wall is in the real body').toMatch(/invalid byok probe profile/);
      expect(stripped, 'guard the plant: the wall is gone from the copy').not.toMatch(/invalid byok probe profile/);
      await db.exec(stripped);

      await setKey();
      const smuggled = {
        tasks: [{ key: 'the model wrote this sentence', passed: false, reasonClass: 'no_output' }],
        passes: 0, tasksRun: 1,
      };
      await scalar(
        'select public.surveyor_byok_set_probe_tier_unwalled($1,$2,$3,$4,$5,$6::jsonb) as r',
        [UID, 'anthropic', 'master', null, '1.0.0', JSON.stringify(smuggled)],
      );
      expect(
        (await keyRow(UID)).probe_profile,
        'the stripped body must reproduce the leak the wall prevents',
      ).toEqual(smuggled);
    });
  });

  describe('surveyor_byok_status — latest-wins carried EVERY earlier column', () => {
    it('returns 143 seven columns plus the five probe fields, and never the ciphertext', async () => {
      await setKey();
      await setTierFull(UID, 'anthropic', 'master', 'claude-opus-4-8', '1.0.0', profileOf([passTask('construct')]));
      const rows = await status();
      expect(rows).toHaveLength(1);
      expect(Object.keys(rows[0]).sort()).toEqual([
        'has_key', 'health', 'last_checked_at', 'last_error_class', 'last_verified_at',
        'probe_checked_at', 'probe_model', 'probe_profile', 'probe_tier', 'probe_version',
        'provider', 'rotated_at',
      ]);
      expect(rows[0].has_key).toBe(true);
      expect(rows[0].probe_tier).toBe('master');
      expect(rows[0].probe_model).toBe('claude-opus-4-8');
      expect(rows[0].probe_version).toBe('1.0.0');
      expect(rows[0].probe_profile).toEqual(profileOf([passTask('construct')]));
      expect(Object.keys(rows[0])).not.toContain('ciphertext');
    });

    it('never returns another user row', async () => {
      await setKey();
      await asUser(UID2);
      await setKey();
      await setTier(UID2, 'anthropic', 'scout');
      await asUser(UID);
      const rows = await status();
      expect(rows).toHaveLength(1);
      expect(rows[0].probe_tier).toBeNull();
    });
  });

  describe('surveyor_byok_set — the NET-CURRENT body resets BOTH receipts', () => {
    it('a rotate clears health AND the measured tier (a new key re-earns both)', async () => {
      await setKey();
      // Simulate a verified, probed key.
      await db.query(
        `update public.surveyor_byok_keys
            set health='healthy', last_verified_at=now(), last_checked_at=now(), last_error_class=null
          where user_id=$1`, [UID],
      );
      await setTierFull(
        UID, 'anthropic', 'master', 'claude-opus-4-8', '1.0.0',
        profileOf([passTask('construct'), passTask('customContent'), passTask('interpret')]),
      );
      expect((await keyRow(UID)).probe_tier).toBe('master');

      // Rotate.
      expect(await setKey('anthropic', 'k2')).toBe(true);
      const row = await keyRow(UID);
      expect(row.health).toBe('unverified');       // 143's rule, repaired after 159 dropped it
      expect(row.last_verified_at).toBeNull();
      expect(row.last_checked_at).toBeNull();
      expect(row.last_error_class).toBeNull();
      expect(row.probe_tier).toBeNull();           // 191's rule
      expect(row.probe_checked_at).toBeNull();
      expect(row.probe_model).toBeNull();
      // L-7a: the exam receipt clears WITH the tier. A profile outliving its tier would
      // coach the next key about the previous key's mistakes.
      expect(row.probe_version).toBeNull();
      expect(row.probe_profile).toBeNull();
    });

    it('NEGATIVE CONTROL: the same assertions PASS a body that forgot the resets, if the resets are removed', async () => {
      // The planted mutation, executed rather than argued: take the net-current body,
      // strip exactly the four reset assignments from its on-conflict branch (which is
      // what 159 did to 143 by recreating from an older source), install it under a
      // second name, and show a rotate through it leaves the stale receipts standing.
      // If this control ever stops reproducing the regression, the assertion above has
      // stopped discriminating and is green on nothing.
      const netCurrent = netCurrentFn('surveyor_byok_set');
      const regressed = netCurrent
        .replace(/public\.surveyor_byok_set\b/g, 'public.surveyor_byok_set_regressed')
        .replace(/do update set[\s\S]*?;/, 'do update set ciphertext = excluded.ciphertext, rotated_at = now();');
      // Guard the plant: it must have actually removed the resets from the rotate path.
      expect(netCurrent).toMatch(/probe_tier\s*=\s*null/);
      expect(regressed).not.toMatch(/probe_tier\s*=\s*null,/);
      await db.exec(regressed);

      await setKey();
      await db.query(`update public.surveyor_byok_keys set health='healthy' where user_id=$1`, [UID]);
      await setTier(UID, 'anthropic', 'master', 'claude-opus-4-8');
      await scalar('select public.surveyor_byok_set_regressed($1,$2) as r', ['anthropic', 'k3']);

      const row = await keyRow(UID);
      expect(row.health, 'the stripped body must reproduce the regression').toBe('healthy');
      expect(row.probe_tier, 'the stripped body must reproduce the regression').toBe('master');
    });

    it('the 159 entitlement-gate rider survived the recreate (an unentitled caller is refused)', async () => {
      await db.exec(`set test.entitled = 'false';`);
      await expect(setKey()).rejects.toThrow(/Surveyor entitlement is required/i);
      // a founder still gets through the same gate
      await db.query('update public.profiles set is_founder = true where id = $1', [UID]);
      expect(await setKey()).toBe(true);
    });
  });

  // ── wave L-WIRE: the decrypt carries the exam receipt ──────────────────────
  //
  // WHY THIS EXISTS. The coaching block renders per model from the stored profile, and the
  // owner's ruling for the wiring wave was ZERO extra round-trips. So 191 §5 widens the
  // per-request decrypt to return the receipt beside the key instead of adding a second RPC
  // on the hot path of every Surveyor call. That is a RETURN-TYPE change to a function 139
  // already deployed, which makes two things worth executing rather than asserting: that
  // 139's whole behaviour survived the widening (carry-ALL), and that the new fields really
  // arrive.
  const byokGet = async (uid, provider = 'anthropic') =>
    (await scalar('select public.surveyor_byok_get($1,$2) as r', [uid, provider])).r;

  describe('surveyor_byok_get — 139 carried forward PLUS the exam receipt', () => {
    it('returns the DECRYPTED key, exactly as 139 did', async () => {
      await setKey('anthropic', 'super-secret-key');
      const row = await byokGet(UID);
      expect(row.key).toBe('super-secret-key');
    });

    it('returns null for a user with no key row (139 contract: the caller falls back)', async () => {
      expect(await byokGet(UID2)).toBeNull();
    });

    it('defaults a blank provider to anthropic, exactly as 139 did', async () => {
      await setKey('anthropic', 'k-default');
      expect((await byokGet(UID, '   ')).key).toBe('k-default');
      expect((await byokGet(UID, ''))?.key).toBe('k-default');
    });

    it('does NOT leak another user\'s key (the lookup is still user-scoped)', async () => {
      await setKey('anthropic', 'mine');
      await asUser(UID2);
      await setKey('anthropic', 'theirs');
      await asUser(UID);
      expect((await byokGet(UID)).key).toBe('mine');
      expect((await byokGet(UID2)).key).toBe('theirs');
    });

    it('carries the exam receipt: probe_tier, probe_model, probe_version and the verdict profile', async () => {
      await setKey('anthropic', 'k-probed');
      const profile = profileOf([passTask('construct'), failTask('interpret', 'below_floor')]);
      expect(await setTierFull(UID, 'anthropic', 'journeyman', 'claude-sonnet-4-5', '1.0.0', profile)).toBe(true);

      const row = await byokGet(UID);
      expect(row.key).toBe('k-probed');
      expect(row.probe_tier).toBe('journeyman');
      // probe_model is what binds the profile to a model. Without it the edge cannot tell
      // whether the model about to answer is the model that sat this exam, and a user who
      // switched their model preference would be coached on another model's failures.
      expect(row.probe_model).toBe('claude-sonnet-4-5');
      expect(row.probe_version).toBe('1.0.0');
      expect(row.probe_profile).toEqual(profile);
    });

    it('an UNPROBED key returns the key with null receipt fields (never-probed is honest)', async () => {
      await setKey('anthropic', 'k-fresh');
      const row = await byokGet(UID);
      expect(row.key).toBe('k-fresh');
      expect(row.probe_tier).toBeNull();
      expect(row.probe_model).toBeNull();
      expect(row.probe_version).toBeNull();
      expect(row.probe_profile).toBeNull();
    });

    it('a ROTATE clears the receipt the decrypt returns (no coaching from a previous key)', async () => {
      // The §2 reset and the §5 read are two halves of one guarantee: a profile that
      // outlived its key would coach the next key about the previous key's mistakes.
      await setKey('anthropic', 'k-old');
      await setTierFull(UID, 'anthropic', 'master', 'claude-opus-4-8', '1.0.0',
        profileOf([passTask('construct'), passTask('interpret'), passTask('customContent')]));
      expect((await byokGet(UID)).probe_tier).toBe('master');

      await setKey('anthropic', 'k-new');
      const row = await byokGet(UID);
      expect(row.key, 'the rotate really replaced the key').toBe('k-new');
      expect(row.probe_tier).toBeNull();
      expect(row.probe_model, 'a rotate must clear the model too, or the next key inherits its coaching').toBeNull();
      expect(row.probe_version).toBeNull();
      expect(row.probe_profile).toBeNull();
    });

    it('the returned envelope carries EXACTLY the five documented fields (no row leakage)', async () => {
      // The widening reads field by field rather than returning the row, so a column added
      // to the vault later cannot reach an edge function by accident. Asserted as an exact
      // key set so a future `select *` shortcut reds here.
      //
      // CARRY-ALL, stated as an assertion rather than a hope: every probe_* column the table
      // holds must appear. The one that was missing (probe_model) was the one that bound the
      // profile to a model, and its absence is what let coaching cross models.
      await setKey('anthropic', 'k-shape');
      expect(Object.keys(await byokGet(UID)).sort())
        .toEqual(['key', 'probe_model', 'probe_profile', 'probe_tier', 'probe_version']);
      const probeColumns = (await db.query(`
        select column_name from information_schema.columns
        where table_schema = 'public' and table_name = 'surveyor_byok_keys'
          and column_name like 'probe%'
      `)).rows.map((r) => r.column_name).sort();
      const returned = Object.keys(await byokGet(UID)).filter((k) => k.startsWith('probe')).sort();
      expect(
        probeColumns.filter((c) => c !== 'probe_checked_at'),
        'every probe column except the timestamp must ride the decrypt envelope',
      ).toEqual(returned);
    });

    it('NEGATIVE CONTROL: 139\'s original body cannot serve the receipt', async () => {
      // Guard the guard. Every assertion above would also pass if the suite had somehow
      // installed a function that returned a hard-coded object, and every one of them would
      // FAIL against the body this migration replaced. Install 139's returns-text shape
      // under a second name and show it returns a bare string with nowhere to put a tier,
      // which is precisely why §5 is a drop-and-create rather than a create-or-replace.
      await db.exec(`
        create or replace function public.surveyor_byok_get_legacy(p_user uuid, p_provider text)
        returns text language plpgsql security definer set search_path = public, pg_temp as $legacy$
        declare v_cipher bytea;
        begin
          select ciphertext into v_cipher from public.surveyor_byok_keys
          where user_id = p_user and provider = coalesce(nullif(btrim(p_provider), ''), 'anthropic');
          if v_cipher is null then return null; end if;
          return pgp_sym_decrypt(v_cipher, public._surveyor_byok_secret());
        end;
        $legacy$;
      `);
      await setKey('anthropic', 'k-legacy');
      await setTierFull(UID, 'anthropic', 'scout', 'claude-haiku-4-5', '1.0.0',
        profileOf([failTask('construct', 'no_output')]));

      const legacy = (await scalar(
        'select public.surveyor_byok_get_legacy($1,$2) as r', [UID, 'anthropic'],
      )).r;
      expect(typeof legacy, 'the pre-191 body returns a bare string').toBe('string');
      expect(legacy).toBe('k-legacy');
      // and the widened one carries what the legacy one structurally cannot
      expect((await byokGet(UID)).probe_tier).toBe('scout');
    });

    it('the migration DROPS before it creates (a return-type change cannot be replaced)', async () => {
      // Source-level, because the executed suite installs only the net-current body and so
      // cannot observe the ordering. Postgres refuses to change a function's return type
      // through CREATE OR REPLACE, so a migration that only carried the create would fail
      // on a database where 139 had already been applied - which is every real one.
      const src191 = readFileSync(MIG_191, 'utf-8');
      const dropIdx = src191.search(/^drop function if exists public\.surveyor_byok_get\(uuid, text\);/m);
      const createIdx = src191.search(/^create or replace function public\.surveyor_byok_get\(/m);
      expect(dropIdx, '191 must DROP surveyor_byok_get before recreating it').toBeGreaterThan(-1);
      expect(createIdx).toBeGreaterThan(-1);
      expect(dropIdx).toBeLessThan(createIdx);
      // DROP takes the grants with it, so they must be re-applied after the create.
      const grantIdx = src191.indexOf('grant execute on function public.surveyor_byok_get(uuid, text) to service_role;');
      expect(grantIdx, 'the service_role grant must be re-applied after the drop').toBeGreaterThan(createIdx);
      expect(src191).toMatch(/revoke all on function public\.surveyor_byok_get\(uuid, text\) from public;/);
      // and it must NOT have been granted to authenticated: the user never reads plaintext.
      expect(/grant execute on function public\.surveyor_byok_get\([^)]*\) to authenticated/.test(src191)).toBe(false);
    });
  });
});
