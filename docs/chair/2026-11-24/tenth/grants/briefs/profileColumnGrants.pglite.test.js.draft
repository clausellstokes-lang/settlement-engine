/**
 * profileColumnGrants.pglite.test.js — what a signed-in user may change on their OWN profile
 * row (GRANTS-1, ruling G1 §6(ii); migration 211 part C).
 *
 * THE HOLE IT CLOSES: the 087 self-update policy is a list of the columns a user may NOT
 * change, and every column a later migration added was writable until someone remembered
 * to pin it (059, 061, 075 and 087 each patched one). 118's `free_narrative_claimed_at` was
 * never pinned: a user could set it back to null and claim the free narrative again. 211
 * part C grants UPDATE on an ALLOWED list of columns instead, so a new column is closed
 * until it is classed.
 *
 * Every column of public.profiles is classed below. A column with no class reds. Each
 * column is then written alone, as the user, on the chain under the hosted default.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { bootHostedChain } from './hostedDefaultHarness.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget

// USER: a page writes it directly (src/components/account/AccountIdentitySection.jsx,
// src/lib/auth.js :: supabaseUpdateProfilePreferences). SERVER: only the server's own
// functions (which run as their owner) or the service-role edge functions write it.
const PROFILE_COLUMN_CLASSES = Object.freeze({
  id: 'SERVER',
  tier: 'SERVER',
  credits: 'SERVER',
  created_at: 'SERVER',
  updated_at: 'SERVER',
  role: 'SERVER',
  display_name: 'SERVER', // through update_display_name only (the 195 civility guard)
  email: 'SERVER',
  is_founder: 'SERVER',
  avatar_url: 'USER',
  email_notifications: 'USER',
  model_preference: 'USER',
  stripe_customer_id: 'SERVER',
  premium_downgraded_at: 'SERVER',
  premium_retention_expires_at: 'SERVER',
  telemetry_consent: 'SERVER', // through set_my_telemetry_consent only (194's consent journal)
  disabled_at: 'SERVER',
  banned_at: 'SERVER',
  deleted_at: 'SERVER',
  account_number: 'SERVER',
  external_name: 'SERVER', // through update_external_name only (075)
  first_name: 'SERVER',
  last_name: 'SERVER',
  preferred_name: 'SERVER',
  stripe_subscription_id: 'SERVER',
  free_narrative_claimed_at: 'SERVER',
  founder_credit_listed: 'SERVER', // through set_founder_credit_listed only (170)
  public_identity_opt_in: 'USER',
});

const UID = '11111111-1111-1111-1111-111111111111';
let db;
let cols;
let row;

beforeAll(async () => {
  ({ db } = await bootHostedChain());
  await db.exec(`insert into auth.users (id, email) values ('${UID}', 'u@probe.test');
    update public.profiles set free_narrative_claimed_at = now() where id = '${UID}';`);
  cols = (await db.query(`select column_name, data_type from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' order by ordinal_position`)).rows;
  row = (await db.query(`select * from public.profiles where id = '${UID}'`)).rows[0];
}, PGLITE_BOOT_TIMEOUT_MS);

/** A value different from the row's, that the column's own checks admit. */
function nextValue(c) {
  const cur = row[c.column_name];
  if (c.column_name === 'model_preference') return cur === 'openai_gpt_5_mini' ? "'anthropic_claude_haiku_4_5'" : "'openai_gpt_5_mini'";
  if (c.data_type === 'boolean') return cur ? 'false' : 'true';
  if (/integer|bigint|numeric|smallint/.test(c.data_type)) return `coalesce(${c.column_name}, 0) + 1`;
  if (/timestamp|date/.test(c.data_type)) return cur === null ? 'now()' : 'null';
  if (c.data_type === 'uuid') return 'gen_random_uuid()';
  if (/json/.test(c.data_type)) return `'{"probe": 1}'`;
  return cur === 'probe-x' ? "'probe-y'" : "'probe-x'";
}

/** Write one column as the signed-in owner, inside a rolled-back transaction. */
async function writeAsOwner(c) {
  try {
    await db.exec(`begin; set local request.jwt.claim.role = 'authenticated'; set local test.uid = '${UID}'; set local role authenticated;`);
    const r = await db.query(`update public.profiles set ${c.column_name} = ${nextValue(c)} where id = '${UID}' returning (${c.column_name})::text as v`);
    return r.rows.length === 1 && String(r.rows[0].v) !== String(row[c.column_name] ?? null) ? 'changed' : 'unchanged';
  } catch (e) {
    return String(e?.message || e);
  } finally {
    await db.exec('rollback;').catch(() => {});
    await db.exec('reset role;');
  }
}

describe('every column of public.profiles is classed (a column with no class reds)', () => {
  it('each column has a class', () => {
    expect(cols.map((c) => c.column_name).filter((n) => !(n in PROFILE_COLUMN_CLASSES))).toEqual([]);
  });
  it('each class names a column that exists', () => {
    const live = new Set(cols.map((c) => c.column_name));
    expect(Object.keys(PROFILE_COLUMN_CLASSES).filter((n) => !live.has(n))).toEqual([]);
  });
});

describe('a signed-in user changes ONLY the allowed columns of their own row (211 part C)', () => {
  it('every USER column can be changed by its owner', async () => {
    const refused = [];
    for (const c of cols.filter((x) => PROFILE_COLUMN_CLASSES[x.column_name] === 'USER')) {
      const r = await writeAsOwner(c);
      if (r !== 'changed') refused.push(`${c.column_name}: ${r}`);
    }
    expect(refused).toEqual([]);
  });
  it('no SERVER column can be changed by its owner, and each refusal is a privilege refusal', async () => {
    const changed = [];
    for (const c of cols.filter((x) => PROFILE_COLUMN_CLASSES[x.column_name] === 'SERVER' && x.column_name !== 'id')) {
      const r = await writeAsOwner(c);
      if (!/permission denied/.test(r)) changed.push(`${c.column_name}: ${r}`);
    }
    expect(changed).toEqual([]);
  });
  it('the F2 hole: the owner cannot set free_narrative_claimed_at back to null', async () => {
    expect(await writeAsOwner({ column_name: 'free_narrative_claimed_at', data_type: 'timestamp with time zone' })).toMatch(/permission denied/);
  });
  it('the classes are populated (no vacuous pass)', () => {
    expect(Object.values(PROFILE_COLUMN_CLASSES).filter((v) => v === 'USER').length).toBe(4);
    expect(cols.length).toBeGreaterThan(20);
  });
});
