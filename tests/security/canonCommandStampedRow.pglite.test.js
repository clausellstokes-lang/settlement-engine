/**
 * canonCommandStampedRow.pglite.test.js — the canon commands on a STAMPED settlement (VEIL-FIX R9,
 * the re-review of 2026-11-10; the chair's R7 revised).
 *
 * Migrations 183 (apply_cut_trade_route_command) and 193 (apply_create_route_command), applied in
 * production, refuse any difference between the expected and the next record outside a short field
 * list, and `publicProse` is not on it ("changed an unrelated settlement field"). So the client must
 * carry the public prose stamp UNCHANGED on both sides of a command; stripping it from the next record
 * (R7's first canon-path cure) made Cut Trade Route and Create Route fail on every stamped settlement.
 *
 * Structural, because the earlier pin checked arguments against a stub: the REAL client functions
 * (src/lib/canonEventCommandPersistence.js :: commitCutTradeRouteCommand, commitCreateRouteCommand)
 * drive the REAL bodies of 183 and 193 in PGlite through a client whose `rpc` calls the function by
 * named arguments, on rows that carry a `publicProse` stamp, and must come back `applied`.
 */
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  commitCreateRouteCommand,
  commitCutTradeRouteCommand,
} from '../../src/lib/canonEventCommandPersistence.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const MIG_183 = readFileSync(resolve(process.cwd(), 'supabase/migrations/183_application_command_journal.sql'), 'utf8');
const MIG_193 = readFileSync(resolve(process.cwd(), 'supabase/migrations/193_create_route_command.sql'), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const SAVE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SAVE_B = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const REVISION = '2026-07-31T12:00:00.000Z';
const STAMP = { v: 'pp-1', blocks: { 'general:overview': { text: 'drawn at the last save' } } };
const EDGE = `route.${SAVE_A}.${SAVE_B}.land`;

let db;

const isJson = (v) => v !== null && typeof v === 'object';

/** A supabase-shaped client whose rpc runs the named function in PGlite as ALICE. */
const client = {
  async rpc(name, args) {
    const keys = Object.keys(args);
    const params = keys.map((k) => (isJson(args[k]) ? JSON.stringify(args[k]) : args[k]));
    const list = keys.map((k, i) => `${k} => $${i + 1}${isJson(args[k]) ? '::jsonb' : ''}`).join(', ');
    try {
      const out = await db.transaction(async (tx) => {
        await tx.query("select set_config('test.uid', $1, true)", [ALICE]);
        await tx.query('set local role authenticated');
        return tx.query(`select public.${name}(${list}) as result`, params);
      });
      return { data: out.rows[0].result, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message, code: error.code } };
    }
  },
};

const BASE_A = {
  id: 'town.ashford', name: 'Ashford', activeChains: ['Old North Road'], neighbourNetwork: [],
  config: { founded: 812 }, _config: { founded: 812 }, publicProse: STAMP,
};
const BASE_B = {
  id: 'town.brookmere', name: 'Brookmere', neighbourNetwork: [],
  config: { founded: 903 }, _config: { founded: 903 }, publicProse: STAMP,
};

const SCHEMA = [
  'do $roles$ begin',
  "  if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;",
  "  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;",
  "  if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;",
  'end $roles$;',
  'create schema if not exists auth;',
  'create table auth.users (id uuid primary key);',
  'create or replace function auth.uid() returns uuid language sql stable as $fn$',
  "  select nullif(current_setting('test.uid', true), '')::uuid $fn$;",
  'grant usage on schema auth to authenticated;',
  'grant execute on function auth.uid() to authenticated;',
  'create table public.profiles (id uuid primary key references auth.users(id), banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz);',
  'create or replace function public.account_is_active(p_uid uuid) returns boolean language sql stable',
  '  set search_path = public, pg_temp as $fn$',
  '  select exists (select 1 from public.profiles where id = p_uid and banned_at is null and disabled_at is null and deleted_at is null) $fn$;',
  'create table public.settlements (',
  '  id uuid primary key, user_id uuid not null references auth.users(id), name text not null,',
  '  data jsonb not null, campaign_state jsonb, ai_data jsonb, neighbour_links jsonb,',
  "  access_state text not null default 'active', updated_at timestamptz not null",
  ');',
].join('\n');

beforeAll(async () => {
  db = new PGlite();
  await db.exec(SCHEMA);
  await db.exec(MIG_183);
  await db.exec(MIG_193);
}, PGLITE_BOOT_TIMEOUT_MS);

beforeEach(async () => {
  await db.exec([
    'truncate public.application_command_journal;',
    'truncate public.settlements;',
    'truncate public.profiles;',
    'truncate auth.users cascade;',
  ].join('\n'));
  await db.query('insert into auth.users (id) values ($1)', [ALICE]);
  await db.query('insert into public.profiles (id) values ($1)', [ALICE]);
  for (const [id, name, data] of [[SAVE_A, 'Ashford', BASE_A], [SAVE_B, 'Brookmere', BASE_B]]) {
    await db.query(
      'insert into public.settlements (id, user_id, name, data, campaign_state, ai_data, updated_at)'
      + " values ($1, $2, $3, $4::jsonb, '{\"phase\":\"canon\",\"eventLog\":[]}', '{}', $5)",
      [id, ALICE, name, JSON.stringify(data), REVISION]);
  }
});

const stored = async (id) => (await db.query('select data from public.settlements where id = $1', [id])).rows[0].data;

describe('R9: the canon commands apply on a stamped settlement (the real client against 183 and 193)', () => {
  test('Cut Trade Route on a stamped row comes back applied, the stamp carried unchanged', async () => {
    const result = await commitCutTradeRouteCommand({
      ownerId: ALICE,
      commandId: 'cmd:canon-event-apply:stamped-cut',
      saveId: SAVE_A,
      expectedRevision: REVISION,
      event: { id: 'event.cut-route.1', type: 'CUT_TRADE_ROUTE', targetId: 'Old North Road' },
      expectedSettlement: BASE_A,
      expectedCampaignState: { phase: 'canon', eventLog: [] },
      expectedAiData: {},
      settlement: { ...BASE_A, config: { founded: 812, _cutRoutes: [{ name: 'Old North Road', atEventId: 'event.cut-route.1' }] } },
      campaignState: {
        phase: 'canon',
        eventLog: [{ event: { id: 'event.cut-route.1', type: 'CUT_TRADE_ROUTE' } }],
        systemState: { resilience: { value: 42 } },
        editedAt: '2026-07-31T12:01:00.000Z',
      },
      aiData: null,
    }, { client }).catch((error) => ({ status: 'threw', reason: String(error?.message || error) }));
    expect(result.status, result.reason ?? '').toBe('applied');
    expect((await stored(SAVE_A)).publicProse).toEqual(STAMP);
  });

  test('Create Route between two stamped rows comes back applied, both stamps carried unchanged', async () => {
    const neighbour = (otherId, otherName) => ({
      id: otherId, linkId: EDGE, name: otherName, neighbourName: otherName, tier: 'town', neighbourTier: 'town',
      relationshipType: 'neutral', relationshipFrom: SAVE_A, relationshipTo: SAVE_B, localRelationshipRole: 'neutral',
      displayRelationshipType: 'neutral', description: `A chartered road runs to ${otherName}.`, bidirectional: true,
    });
    const userRoute = { routeId: EDGE, atEventId: 'event.create-route.1', provenance: 'user', mode: 'land', createdTick: 0, band: 'steady' };
    const result = await commitCreateRouteCommand({
      ownerId: ALICE,
      commandId: 'cmd:canon-event-apply:stamped-route',
      saveId: SAVE_A,
      partnerSaveId: SAVE_B,
      expectedRevision: REVISION,
      event: { id: 'event.create-route.1', type: 'CREATE_ROUTE', targetId: 'Brookmere', payload: { routeId: EDGE, mode: 'land' } },
      expectedSettlement: BASE_A,
      expectedCampaignState: { phase: 'canon', eventLog: [] },
      expectedAiData: {},
      partnerExpectedSettlement: BASE_B,
      settlement: {
        ...BASE_A, neighbourNetwork: [neighbour(SAVE_B, 'Brookmere')],
        config: { founded: 812, _userRoutes: [userRoute] }, _config: { founded: 812, _userRoutes: [userRoute] },
      },
      campaignState: {
        phase: 'canon',
        eventLog: [{ event: { id: 'event.create-route.1', type: 'CREATE_ROUTE' } }],
        systemState: { resilience: { value: 42 } },
        editedAt: '2026-07-31T12:01:00.000Z',
      },
      partnerSettlement: {
        ...BASE_B, neighbourNetwork: [neighbour(SAVE_A, 'Ashford')],
        config: { founded: 903, _userRoutes: [userRoute] }, _config: { founded: 903, _userRoutes: [userRoute] },
      },
      aiData: null,
    }, { client }).catch((error) => ({ status: 'threw', reason: String(error?.message || error) }));
    expect(result.status, result.reason ?? '').toBe('applied');
    expect((await stored(SAVE_A)).publicProse).toEqual(STAMP);
    expect((await stored(SAVE_B)).publicProse).toEqual(STAMP);
  });
});
