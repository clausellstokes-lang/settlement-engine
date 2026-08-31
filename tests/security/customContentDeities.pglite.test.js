/**
 * customContentDeities.pglite.test.js — EXECUTION-level tests for migration 049
 * (Feature D / R1: the deities custom-content bucket).
 *
 * Loads the REAL 004 + 049 DDL into an in-process Postgres (pglite) and exercises
 * the constraints that actually protect the bucket:
 *
 *   1. The widened `custom_content_category_check` ADMITS `deities` AND the three
 *      drifted categories (`services`/`factions`/`supplyChains`) that 004 never
 *      allowed — and still REJECTS a genuinely unknown category.
 *   2. The new `custom_content_deity_axes_check` REJECTS a deity row with a bad
 *      axis (mirroring validateDeity) and ACCEPTS a valid one. NON-deity rows are
 *      unaffected by the axis check.
 *
 * Owner-scoped RLS is asserted SEPARATELY (static): pglite is single-connection
 * and does not enforce RLS role grants, so — exactly like creditLedger.pglite —
 * the owner read/write + premium-write policy DDL is asserted by scanning the
 * net migration SQL (004 establishes owner scoping; 017 tightens writes to
 * premium; 049 inherits both, table-level, unchanged).
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG004 = resolve(dir, '004_custom_content.sql');
const MIG017 = resolve(dir, '017_fix_credit_auth_integrity.sql');
const MIG049 = resolve(dir, '049_custom_content_deities.sql');
const MIG056 = resolve(dir, '056_deity_law_axis.sql');
// W-FAITH F1c: the authored-character widening (authoredTemper, chart positions,
// boon/bane). It is NOT deployed — it is written and owner-gated — so this suite is
// where its SQL is actually EXECUTED rather than merely read.
const MIG200 = resolve(dir, '200_deity_authored_character.sql');
const allExist = [MIG004, MIG017, MIG049, MIG056, MIG200].every(existsSync);

// Hard-fail (not a silent vacuous skip) when a target migration moves/renames:
// the runIf(allExist) suites below would otherwise go GREEN with 0 tests run.
describe('pglite targets exist (guards against silent vacuous skip)', () => {
  it('every required migration is present (a moved migration must fail loudly)', () => {
    const targets = { '004': MIG004, '017': MIG017, '049': MIG049, '056': MIG056, '200': MIG200 };
    const missing = Object.entries(targets).filter(([, p]) => !existsSync(p)).map(([k]) => k);
    expect(missing, `missing migrations: ${missing.join(', ')}`).toEqual([]);
    expect(allExist).toBe(true);
  });
});

const UID = '11111111-1111-1111-1111-111111111111';

/** Extract just the two ALTER TABLE ... custom_content ... CHECK statements from
 *  049 (skip the COMMENT, which references nothing pglite needs). We run the
 *  whole file; it's pure DDL on the table 004 created. */
function loadSql(path) {
  return readFileSync(path, 'utf-8');
}

let db;
const insert = (category, data) =>
  db.query(
    `insert into public.custom_content (user_id, category, data) values ($1, $2, $3::jsonb)`,
    [UID, category, JSON.stringify(data)],
  );

const VALID_DEITY = { name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' };

// Vacuity guard (runs unconditionally): if the targeted migration(s) are ever
// renamed/removed the condition below goes false and the runIf suite silently
// runs ZERO assertions while reporting green. Fail loudly here instead.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allExist).toBe(true);
});

describe.runIf(allExist)('migration 049 — deities bucket constraints (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Minimal auth schema so 004's RLS DDL (auth.uid()) parses. The CHECK
    // constraints we exercise don't need auth; RLS is not enforced single-conn.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- gen_random_uuid() is native to pglite (used by the table's id default).
      -- Minimal auth.users so 004's user_id FK resolves, plus a seed row for the
      -- owner UID we insert as.
      create table auth.users (id uuid primary key);
      insert into auth.users (id) values ('${UID}');
      -- minimal profiles table so 004's developer-read policy DDL parses.
      create table public.profiles (id uuid primary key, role text);
    `);
    // 004 creates the table + the original CHECK + RLS. 049 widens the CHECK and
    // adds the deity-axes CHECK. 056 (B5) widens that axes CHECK to also validate
    // the 4th axis (lawAxis). Run all three in order.
    await db.exec(loadSql(MIG004));
    await db.exec(loadSql(MIG049));
    await db.exec(loadSql(MIG056));
    // 200 (W-FAITH F1c) mints the chart-position predicate function and widens the
    // same named axes CHECK a third time. Executing it here is the only proof that
    // the SQL parses and enforces: it is deliberately NOT deployed.
    await db.exec(loadSql(MIG200));
    await db.exec(`set test.uid = '${UID}';`);
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec('truncate public.custom_content cascade;');
  });

  // ── Category CHECK ─────────────────────────────────────────────────────────
  it('admits the new deities category', async () => {
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
    const { rows } = await db.query(`select count(*)::int as n from public.custom_content where category = 'deities'`);
    expect(rows[0].n).toBe(1);
  });

  it('backfills the three drifted categories (services / factions / supplyChains)', async () => {
    await expect(insert('services', { name: 'Healer' })).resolves.toBeTruthy();
    await expect(insert('factions', { name: 'Guild' })).resolves.toBeTruthy();
    await expect(insert('supplyChains', { name: 'Iron line' })).resolves.toBeTruthy();
  });

  it('still rejects a genuinely unknown category', async () => {
    await expect(insert('wibble', { name: 'Nope' })).rejects.toThrow(/custom_content_category_check/);
  });

  // ── Deity axes CHECK ───────────────────────────────────────────────────────
  it('accepts a deity with all three valid axes', async () => {
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
  });

  it('rejects a deity with a bad alignment axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, alignmentAxis: 'lawful' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity with a bad temperament axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, temperamentAxis: 'sleepy' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity with a bad rank axis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, rankAxis: 'demigod' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a deity missing an axis entirely', async () => {
    await expect(insert('deities', { name: 'Axeless' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  // ── B5: the 4th axis (lawAxis) — migration 056 ─────────────────────────────
  it('accepts a deity with a valid 4th axis (lawAxis)', async () => {
    await expect(insert('deities', { ...VALID_DEITY, lawAxis: 'lawful' })).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, lawAxis: 'chaotic' })).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, lawAxis: 'neutral' })).resolves.toBeTruthy();
  });

  it('admits a legacy 3-axis deity with NO lawAxis (back-compat — tolerated as neutral)', async () => {
    // Unlike the first three axes, a MISSING lawAxis is ADMITTED (not rejected),
    // so deity content authored before B5 never hard-rejects on the next write.
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
  });

  it('rejects a deity with a PRESENT-but-invalid lawAxis', async () => {
    await expect(insert('deities', { ...VALID_DEITY, lawAxis: 'orderly' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  // ── W-FAITH F1c: the authored character — migration 200 ────────────────────
  it('admits a deity carrying NONE of the new fields (the legacy shape is untouched)', async () => {
    await expect(insert('deities', VALID_DEITY)).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, lawAxis: 'chaotic' })).resolves.toBeTruthy();
  });

  it('accepts each authoredTemper word and rejects one outside the vocabulary', async () => {
    await expect(insert('deities', { ...VALID_DEITY, authoredTemper: 'warlike' })).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, authoredTemper: 'peacelike' })).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, authoredTemper: 'neutral' })).resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, authoredTemper: 'brooding' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('accepts chart positions on distinct axes, including the full roster', async () => {
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:vice:defining'] }))
      .resolves.toBeTruthy();
    await expect(insert('deities', {
      ...VALID_DEITY,
      characterAxes: ['MERCY:vice:defining', 'CANDOR:virtue:a_touch', 'TEMPER:vice:marked'],
    })).resolves.toBeTruthy();
    const full = ['CANDOR', 'MERCY', 'COURAGE', 'TEMPER', 'GENEROSITY', 'HUMILITY', 'FIDELITY',
      'INDUSTRY', 'JUSTICE', 'PRUDENCE', 'TRUST', 'CHEER', 'FORBEARANCE', 'PROTECTION',
      'TEMPERANCE', 'CONTENT'].map((axis) => `${axis}:virtue:marked`);
    expect(full.length).toBe(16);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: full })).resolves.toBeTruthy();
  });

  it('accepts an empty position list (an all-neutral god is a real choice)', async () => {
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: [] })).resolves.toBeTruthy();
  });

  it('REJECTS two positions on the same axis (one signed position per axis)', async () => {
    await expect(insert('deities', {
      ...VALID_DEITY,
      characterAxes: ['MERCY:vice:defining', 'MERCY:virtue:a_touch'],
    })).rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a token outside the closed vocabulary, an unknown axis, and a bad level', async () => {
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:vice:consuming'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['AMBITION:vice:marked'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:middle:marked'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects DEVOTION, whose existence is still an open owner ruling', async () => {
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['DEVOTION:virtue:marked'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a malformed position shape rather than ERRORING on it', async () => {
    // The CASE ordering in _deity_chart_axes_valid is load-bearing: jsonb_array_elements
    // RAISES on a non-array, so a guard that only usually ran first would turn a
    // malformed value into a hard exception instead of a clean constraint refusal.
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: { MERCY: 'vice' } }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: [42] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: 7 }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a token with a TRAILING TAIL that split_part alone would ignore', async () => {
    // The arity guard. Without it `MERCY:vice:defining:extra` passes all three
    // split_part checks in the database while the JS wall, which compares against
    // a closed list, rejects it — a divergence in the dangerous direction.
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:vice:defining:extra'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: 'MERCY:vice:defining:extra' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:vice:defining:'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: ['MERCY:vice'] }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('honours the SCALAR arm exactly as every layer above it does', async () => {
    // The manifest types characterAxes `string-or-string-list`. The JS admission
    // wall, the edge validator and 185's own record validator all accept a bare
    // token, so the database must too: a DB that refused what the application
    // admits would fail a write only after deploy, on content already authored.
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: 'MERCY:vice:defining' }))
      .resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: 'MERCY:vice:consuming' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, characterAxes: 'DEVOTION:vice:marked' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('accepts pure buff, pure bane, both, and a shared channel', async () => {
    await expect(insert('deities', { ...VALID_DEITY, boonChannel: 'harvest', boonStrength: 'firm' }))
      .resolves.toBeTruthy();
    await expect(insert('deities', { ...VALID_DEITY, baneChannel: 'sea', baneStrength: 'heavy' }))
      .resolves.toBeTruthy();
    await expect(insert('deities', {
      ...VALID_DEITY,
      boonChannel: 'trade', boonStrength: 'faint', baneChannel: 'order', baneStrength: 'firm',
    })).resolves.toBeTruthy();
    await expect(insert('deities', {
      ...VALID_DEITY,
      boonChannel: 'sea', boonStrength: 'heavy', baneChannel: 'sea', baneStrength: 'faint',
    })).resolves.toBeTruthy();
  });

  it('REJECTS a half-authored boon or bane (channel and strength travel together)', async () => {
    await expect(insert('deities', { ...VALID_DEITY, boonChannel: 'harvest' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, baneStrength: 'heavy' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('rejects a channel or strength outside its vocabulary, and a float strength', async () => {
    await expect(insert('deities', { ...VALID_DEITY, boonChannel: 'vengeance', boonStrength: 'firm' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, baneChannel: 'craft', baneStrength: 'devastating' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, boonChannel: 'craft', boonStrength: 0.7 }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('200 does not weaken the three required axes it inherits from 049', async () => {
    await expect(insert('deities', { name: 'Axeless', authoredTemper: 'warlike' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
    await expect(insert('deities', { ...VALID_DEITY, alignmentAxis: 'lawful', authoredTemper: 'warlike' }))
      .rejects.toThrow(/custom_content_deity_axes_check/);
  });

  it('the new fields do not constrain non-deity rows either', async () => {
    await expect(insert('factions', { name: 'Guild', characterAxes: ['NOPE:sideways:loud'] }))
      .resolves.toBeTruthy();
  });

  it('the axes check does NOT constrain non-deity rows', async () => {
    // A faction row with a "bad axis"-looking field is fine — the check is
    // short-circuited to TRUE for every non-deity category.
    await expect(insert('factions', { name: 'Guild', alignmentAxis: 'lawful' })).resolves.toBeTruthy();
  });
});

// ── Owner-scoped + premium-write RLS (static contract) ───────────────────────
describe.runIf(allExist)('migration 049 — RLS is owner-scoped + premium-gated (inherited, static)', () => {
  const sql004 = loadSql(MIG004);
  const sql017 = loadSql(MIG017);

  it('004 enables RLS and scopes read/write to the owner', () => {
    expect(sql004).toMatch(/alter table public\.custom_content enable row level security/i);
    expect(sql004).toMatch(/users read own custom content[\s\S]*auth\.uid\(\) = user_id/i);
    expect(sql004).toMatch(/users delete own custom content[\s\S]*auth\.uid\(\) = user_id/i);
  });

  it('017 tightens writes to premium accounts (the server gate deities inherit)', () => {
    expect(sql017).toMatch(/premium users insert own custom content[\s\S]*profile_has_premium_access/i);
    expect(sql017).toMatch(/premium users update own custom content[\s\S]*profile_has_premium_access/i);
    expect(sql017).toMatch(/premium users delete own custom content[\s\S]*profile_has_premium_access/i);
  });

  it('049 adds NO tier predicate of its own (premium gate stays the inherited one — D.0)', () => {
    const sql049 = loadSql(MIG049);
    expect(sql049).not.toMatch(/profile_has_premium_access/i);
    // DELIBERATELY UNANCHORED (negative-presence): must catch a future re-creation at
    // ANY indentation — this corpus legally mints indented policies/triggers (005:69
    // DO-block EXECUTE; 003:65/004:49 DO-block DDL). Pinned in
    // netCurrentExtractorAnchor.walker FROZEN_UNANCHORED — do not "fix".
    expect(sql049).not.toMatch(/create policy/i);
  });
});
