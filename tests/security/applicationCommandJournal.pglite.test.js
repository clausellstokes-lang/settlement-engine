/**
 * Executed SQL contract for migration 183.
 *
 * The test runs the real migration against in-process Postgres and proves the
 * properties source inspection cannot: owner isolation, one-transaction CAS,
 * completed replay, same-id fingerprint conflict, monotone reconciliation, and
 * a journal that clients may read but never mutate directly.
 */

import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const SAVE = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const FOREIGN_SAVE = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const REVISION = '2026-07-24T12:00:00.000Z';
let db;

async function asUser(ownerId, sql, params = []) {
  return db.transaction(async (transaction) => {
    await transaction.query(
      `select set_config('test.uid', $1, true)`,
      [ownerId],
    );
    await transaction.query(`set local role authenticated`);
    return transaction.query(sql, params);
  });
}

function request(overrides = {}) {
  return {
    ownerId: ALICE,
    commandId: 'cmd:canon-event-apply:review-1',
    saveId: SAVE,
    revision: REVISION,
    event: {
      id: 'event.cut-route.1',
      type: 'CUT_TRADE_ROUTE',
      targetId: 'Old North Road',
    },
    expectedSettlement: {
      id: 'town.ashford',
      name: 'Ashford',
      activeChains: ['Old North Road'],
    },
    expectedCampaignState: {
      phase: 'canon',
      eventLog: [],
    },
    expectedAiData: {},
    settlement: {
      id: 'town.ashford',
      name: 'Ashford',
      activeChains: ['Old North Road'],
      config: {
        _cutRoutes: [{
          name: 'Old North Road',
          atEventId: 'event.cut-route.1',
        }],
      },
    },
    campaignState: {
      phase: 'canon',
      eventLog: [{
        event: {
          id: 'event.cut-route.1',
          type: 'CUT_TRADE_ROUTE',
        },
      }],
      systemState: { resilience: { value: 42 } },
      editedAt: '2026-07-24T12:01:00.000Z',
    },
    aiData: null,
    ...overrides,
  };
}

async function applyCommand(input) {
  return asUser(
    input.ownerId,
    `select public.apply_cut_trade_route_command(
      $1::uuid,
      $2::text,
      $3::uuid,
      $4::timestamptz,
      $5::jsonb,
      $6::jsonb,
      $7::jsonb,
      $8::jsonb,
      $9::jsonb,
      $10::jsonb,
      $11::jsonb
    ) as result`,
    [
      input.ownerId,
      input.commandId,
      input.saveId,
      input.revision,
      JSON.stringify(input.event),
      JSON.stringify(input.expectedSettlement),
      JSON.stringify(input.expectedCampaignState),
      input.expectedAiData == null
        ? null
        : JSON.stringify(input.expectedAiData),
      JSON.stringify(input.settlement),
      JSON.stringify(input.campaignState),
      input.aiData == null ? null : JSON.stringify(input.aiData),
    ],
  );
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    do $roles$ begin
      if not exists (select from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
      if not exists (select from pg_roles where rolname = 'service_role') then
        create role service_role;
      end if;
    end $roles$;

    create schema if not exists auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid()
    returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;

    create table public.profiles (
      id uuid primary key references auth.users(id),
      banned_at timestamptz,
      disabled_at timestamptz,
      deleted_at timestamptz
    );
    create or replace function public.account_is_active(p_uid uuid)
    returns boolean language sql stable
    set search_path = public, pg_temp as $fn$
      select exists (
        select 1 from public.profiles
         where id = p_uid
           and banned_at is null
           and disabled_at is null
           and deleted_at is null
      )
    $fn$;

    create table public.settlements (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      name text not null,
      data jsonb not null,
      campaign_state jsonb,
      ai_data jsonb,
      neighbour_links jsonb,
      access_state text not null default 'active',
      updated_at timestamptz not null
    );
  `);
  await db.exec(migration);
}, 60_000);

beforeEach(async () => {
  await db.exec(`
    truncate public.application_command_journal;
    truncate public.settlements;
    truncate public.profiles;
    truncate auth.users cascade;

    insert into auth.users (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.settlements (
      id, user_id, name, data, campaign_state, ai_data, updated_at
    ) values
      (
        '${SAVE}', '${ALICE}', 'Ashford',
        '{"id":"town.ashford","name":"Ashford","activeChains":["Old North Road"]}',
        '{"phase":"canon","eventLog":[]}',
        '{}',
        '${REVISION}'
      ),
      (
        '${FOREIGN_SAVE}', '${MALLORY}', 'Mallory Keep',
        '{"id":"town.mallory","name":"Mallory Keep"}',
        '{"phase":"canon","eventLog":[]}',
        '{}',
        '${REVISION}'
      );
  `);
});

describe('migration 183 application command journal', () => {
  test('publishes one exact eleven-argument RPC signature and matching grants', async () => {
    const functions = await db.query(
      `select pronargs, pronargdefaults
         from pg_proc
         join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
        where pg_namespace.nspname = 'public'
          and pg_proc.proname = 'apply_cut_trade_route_command'`,
    );
    expect(functions.rows).toEqual([{
      pronargs: 11,
      pronargdefaults: 1,
    }]);

    const compactMigration = migration.replace(/\s+/g, '');
    const exactSignature = [
      'public.apply_cut_trade_route_command(',
      'uuid, text, uuid, timestamptz,',
      'jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb',
      ')',
    ].join('').replace(/\s+/g, '');
    // Rollback, REVOKE, and GRANT must all identify the overload created above.
    expect(compactMigration.split(exactSignature)).toHaveLength(4);
  });

  test('atomically applies, journals, and replays one identical command', async () => {
    const first = await applyCommand(request());
    expect(first.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: false,
      revisionKind: 'base-projection-v1',
      settlement: { activeChains: ['Old North Road'] },
      receipt: {
        projectionValidation: 'client-prepared-constrained-envelope-v1',
      },
    });
    expect(first.rows[0].result.fingerprint).toMatch(/^[0-9a-f]{64}$/);

    const rowAfterFirst = await db.query(
      `select data, campaign_state, updated_at
         from public.settlements where id = $1`,
      [SAVE],
    );
    const committedRevision = rowAfterFirst.rows[0].updated_at.toISOString();
    expect(rowAfterFirst.rows[0].data.activeChains).toEqual(['Old North Road']);
    expect(rowAfterFirst.rows[0].campaign_state.eventLog).toHaveLength(1);

    const replay = await applyCommand(request());
    expect(replay.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: true,
    });
    const afterReplay = await db.query(
      `select updated_at from public.settlements where id = $1`,
      [SAVE],
    );
    expect(afterReplay.rows[0].updated_at.toISOString()).toBe(committedRevision);

    const journal = await db.query(
      `select phase, status, fingerprint, receipt
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, request().commandId],
    );
    expect(journal.rows[0]).toMatchObject({
      phase: 'finalized',
      status: 'applied',
      receipt: { eventType: 'CUT_TRADE_ROUTE', saveId: SAVE },
    });
  });

  test('same owner+id with different behavior fails closed as a conflict', async () => {
    await applyCommand(request());
    const conflict = await applyCommand(request({
      campaignState: {
        ...request().campaignState,
        systemState: { resilience: { value: 7 } },
      },
    }));
    expect(conflict.rows[0].result).toMatchObject({
      status: 'conflict',
      reason: 'command_id_conflict',
      replayed: true,
    });
    const saved = await db.query(
      `select data from public.settlements where id = $1`,
      [SAVE],
    );
    expect(saved.rows[0].data.activeChains).toEqual(['Old North Road']);
  });

  test('a changed base projection finalizes stale without writing', async () => {
    await db.query(
      `update public.settlements
          set data = data || '{"serverOnlyChange":true}'::jsonb
        where id = $1`,
      [SAVE],
    );
    const stale = await applyCommand(request({
      commandId: 'cmd:canon-event-apply:stale',
    }));
    expect(stale.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'base_projection_changed',
    });
    const journal = await db.query(
      `select phase, status, failure_code
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, 'cmd:canon-event-apply:stale'],
    );
    expect(journal.rows[0]).toMatchObject({
      phase: 'finalized',
      status: 'stale',
      failure_code: 'base_projection_changed',
    });
  });

  test('an unrelated timestamp change does not masquerade as aggregate drift', async () => {
    await db.query(
      `update public.settlements
          set updated_at = '2026-07-24T12:30:00.000Z'
        where id = $1`,
      [SAVE],
    );
    const result = await applyCommand(request({
      commandId: 'cmd:canon-event-apply:metadata-only',
    }));
    expect(result.rows[0].result).toMatchObject({
      status: 'applied',
      revisionKind: 'base-projection-v1',
    });
  });

  test('rejects a replacement blob that does not contain the command delta', async () => {
    await expect(applyCommand(request({
      commandId: 'cmd:canon-event-apply:mismatched-projection',
      settlement: {
        id: 'town.ashford',
        name: 'Ashford',
        activeChains: ['Old North Road'],
      },
    }))).rejects.toThrow(/route annotation/i);
    const journal = await db.query(
      `select count(*)::integer as count
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, 'cmd:canon-event-apply:mismatched-projection'],
    );
    expect(journal.rows[0].count).toBe(0);
  });

  test('rejects unrelated prepared changes before claiming command identity', async () => {
    await expect(applyCommand(request({
      commandId: 'cmd:canon-event-apply:unrelated-change',
      settlement: {
        ...request().settlement,
        name: 'Quietly Replaced Name',
      },
    }))).rejects.toThrow(/unrelated settlement field/i);
    const journal = await db.query(
      `select count(*)::integer as count
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, 'cmd:canon-event-apply:unrelated-change'],
    );
    expect(journal.rows[0].count).toBe(0);
  });

  test('a foreign target is non-enumerating and never written', async () => {
    const response = await applyCommand(request({
      saveId: FOREIGN_SAVE,
    }));
    expect(response.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'save_unavailable',
    });
    const foreign = await db.query(
      `select data from public.settlements where id = $1`,
      [FOREIGN_SAVE],
    );
    expect(foreign.rows[0].data.name).toBe('Mallory Keep');
  });

  test('reconciliation is monotone and cannot overwrite a final result', async () => {
    const fingerprint = 'a'.repeat(64);
    await db.query(
      `select public.claim_application_command(
        $1, $2, $3, 'settlement.canon-event.apply', $4, $5
      )`,
      [ALICE, 'cmd:claimed', fingerprint, SAVE, REVISION],
    );
    expect((await db.query(
      `select public.mark_application_command_reconcile($1, $2, $3, $4) as ok`,
      [ALICE, 'cmd:claimed', fingerprint, 'answer_lost'],
    )).rows[0].ok).toBe(true);
    expect((await db.query(
      `select public.finalize_application_command(
        $1, $2, $3, 'applied', '{}'::jsonb, null
      ) as ok`,
      [ALICE, 'cmd:claimed', fingerprint],
    )).rows[0].ok).toBe(false);
    const row = await db.query(
      `select phase, status, failure_code
         from public.application_command_journal
        where owner_id = $1 and command_id = 'cmd:claimed'`,
      [ALICE],
    );
    expect(row.rows[0]).toEqual({
      phase: 'reconcile',
      status: 'reconcile-required',
      failure_code: 'answer_lost',
    });
  });

  test('authenticated owners can read only their rows and cannot write directly', async () => {
    await applyCommand(request());
    await applyCommand(request({
      ownerId: MALLORY,
      commandId: 'cmd:canon-event-apply:mallory',
      saveId: FOREIGN_SAVE,
      expectedSettlement: {
        id: 'town.mallory',
        name: 'Mallory Keep',
      },
      settlement: {
        id: 'town.mallory',
        name: 'Mallory Keep',
        config: {
          _cutRoutes: [{
            name: 'Old North Road',
            atEventId: 'event.cut-route.1',
          }],
        },
      },
    }));
    const ownRows = await db.transaction(async (transaction) => {
      await transaction.query(`set local role authenticated`);
      await transaction.query(
        `select set_config('test.uid', $1, true)`,
        [ALICE],
      );
      return transaction.query(
        `select command_id from public.application_command_journal`,
      );
    });
    expect(ownRows.rows).toEqual([{ command_id: request().commandId }]);

    await expect(db.transaction(async (transaction) => {
      await transaction.query(`set local role authenticated`);
      await transaction.query(
        `select set_config('test.uid', $1, true)`,
        [ALICE],
      );
      return transaction.query(
        `delete from public.application_command_journal
          where owner_id = $1`,
        [ALICE],
      );
    })).rejects.toThrow();

    await expect(asUser(
      ALICE,
      `select public.claim_application_command(
        $1, $2, $3, 'settlement.canon-event.apply', $4, $5
      )`,
      [ALICE, 'cmd:forbidden-client-claim', 'c'.repeat(64), SAVE, REVISION],
    )).rejects.toThrow();
  });
});
