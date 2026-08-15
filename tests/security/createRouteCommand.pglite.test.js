/**
 * Executed SQL contract for migration 193 — the BILATERAL user-route command.
 *
 * The sibling battery (applicationCommandJournal.pglite.test.js) proves the
 * unilateral vertical. This one proves what only a second endpoint can break:
 * that a route which fails on its partner leaves the initiating settlement
 * untouched, that both halves are judged against the SAME server-recomputed edge
 * identity, and that the private provenance ledger is the only place a user route
 * is recorded outside the shared neighbour vocabulary.
 */

import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const journalMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');
const migration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/193_create_route_command.sql',
), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const SAVE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SAVE_B = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const FOREIGN_SAVE = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const REVISION = '2026-07-31T12:00:00.000Z';
const EVENT_ID = 'event.create-route.1';
// The deterministic edge identity, spelled out rather than computed, so the test
// asserts the DESIGN_ROUTE_LIFECYCLE section 3 convention instead of re-deriving
// whatever the implementation happens to produce.
const EDGE = `route.${SAVE_A}.${SAVE_B}.land`;
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

function neighbourEntry(otherId, otherName, linkId = EDGE) {
  return {
    id: otherId,
    linkId,
    name: otherName,
    neighbourName: otherName,
    tier: 'town',
    neighbourTier: 'town',
    relationshipType: 'neutral',
    relationshipFrom: SAVE_A,
    relationshipTo: SAVE_B,
    localRelationshipRole: 'neutral',
    displayRelationshipType: 'neutral',
    description: `A chartered road runs to ${otherName}.`,
    bidirectional: true,
  };
}

function provenanceRow(overrides = {}) {
  return {
    routeId: EDGE,
    atEventId: EVENT_ID,
    provenance: 'user',
    mode: 'land',
    createdTick: 0,
    band: 'steady',
    ...overrides,
  };
}

const BASE_A = {
  id: 'town.ashford',
  name: 'Ashford',
  neighbourNetwork: [],
  config: { founded: 812 },
  _config: { founded: 812 },
};
const BASE_B = {
  id: 'town.brookmere',
  name: 'Brookmere',
  neighbourNetwork: [],
  config: { founded: 903 },
  _config: { founded: 903 },
};

function nextA(overrides = {}) {
  return {
    ...BASE_A,
    neighbourNetwork: [neighbourEntry(SAVE_B, 'Brookmere')],
    config: { founded: 812, _userRoutes: [provenanceRow()] },
    _config: { founded: 812, _userRoutes: [provenanceRow()] },
    ...overrides,
  };
}

function nextB(overrides = {}) {
  return {
    ...BASE_B,
    neighbourNetwork: [neighbourEntry(SAVE_A, 'Ashford')],
    config: { founded: 903, _userRoutes: [provenanceRow()] },
    _config: { founded: 903, _userRoutes: [provenanceRow()] },
    ...overrides,
  };
}

function request(overrides = {}) {
  return {
    ownerId: ALICE,
    commandId: 'cmd:canon-event-apply:route-1',
    saveId: SAVE_A,
    partnerSaveId: SAVE_B,
    revision: REVISION,
    event: {
      id: EVENT_ID,
      type: 'CREATE_ROUTE',
      targetId: 'Brookmere',
      payload: { routeId: EDGE, mode: 'land' },
    },
    expectedSettlement: BASE_A,
    expectedCampaignState: { phase: 'canon', eventLog: [] },
    expectedAiData: {},
    partnerExpectedSettlement: BASE_B,
    settlement: nextA(),
    campaignState: {
      phase: 'canon',
      eventLog: [{ event: { id: EVENT_ID, type: 'CREATE_ROUTE' } }],
      systemState: { resilience: { value: 42 } },
      editedAt: '2026-07-31T12:01:00.000Z',
    },
    partnerSettlement: nextB(),
    aiData: null,
    ...overrides,
  };
}

async function applyCommand(input) {
  return asUser(
    input.ownerId,
    `select public.apply_create_route_command(
      $1::uuid,
      $2::text,
      $3::uuid,
      $4::uuid,
      $5::timestamptz,
      $6::jsonb,
      $7::jsonb,
      $8::jsonb,
      $9::jsonb,
      $10::jsonb,
      $11::jsonb,
      $12::jsonb,
      $13::jsonb,
      $14::jsonb
    ) as result`,
    [
      input.ownerId,
      input.commandId,
      input.saveId,
      input.partnerSaveId,
      input.revision,
      JSON.stringify(input.event),
      JSON.stringify(input.expectedSettlement),
      JSON.stringify(input.expectedCampaignState),
      input.expectedAiData == null ? null : JSON.stringify(input.expectedAiData),
      JSON.stringify(input.partnerExpectedSettlement),
      JSON.stringify(input.settlement),
      JSON.stringify(input.campaignState),
      JSON.stringify(input.partnerSettlement),
      input.aiData == null ? null : JSON.stringify(input.aiData),
    ],
  );
}

async function rowFor(saveId) {
  const result = await db.query(
    `select data, campaign_state, neighbour_links, updated_at
       from public.settlements where id = $1`,
    [saveId],
  );
  return result.rows[0];
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
  await db.exec(journalMigration);
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
        '${SAVE_A}', '${ALICE}', 'Ashford',
        '${JSON.stringify(BASE_A)}',
        '{"phase":"canon","eventLog":[]}',
        '{}',
        '${REVISION}'
      ),
      (
        '${SAVE_B}', '${ALICE}', 'Brookmere',
        '${JSON.stringify(BASE_B)}',
        '{"phase":"canon","eventLog":[]}',
        '{}',
        '${REVISION}'
      ),
      (
        '${FOREIGN_SAVE}', '${MALLORY}', 'Mallory Keep',
        '{"id":"town.mallory","name":"Mallory Keep","neighbourNetwork":[]}',
        '{"phase":"canon","eventLog":[]}',
        '{}',
        '${REVISION}'
      );
  `);
});

describe('migration 193 bilateral user-route command', () => {
  test('publishes one exact fourteen-argument RPC signature and matching grants', async () => {
    const functions = await db.query(
      `select pronargs, pronargdefaults
         from pg_proc
         join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
        where pg_namespace.nspname = 'public'
          and pg_proc.proname = 'apply_create_route_command'`,
    );
    expect(functions.rows).toEqual([{ pronargs: 14, pronargdefaults: 1 }]);

    const compact = migration.replace(/\s+/g, '');
    const signature = [
      'public.apply_create_route_command(',
      'uuid, text, uuid, uuid, timestamptz,',
      'jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb',
      ')',
    ].join('').replace(/\s+/g, '');
    // Rollback note, REVOKE, GRANT, and COMMENT must all name this exact overload.
    expect(compact.split(signature)).toHaveLength(5);
  });

  test('writes both endpoints, both mirrors, and one journal receipt', async () => {
    const first = await applyCommand(request());
    expect(first.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: false,
      routeId: EDGE,
      revisionKind: 'base-projection-v1',
      receipt: {
        eventType: 'CREATE_ROUTE',
        routeId: EDGE,
        saveId: SAVE_A,
        partnerSaveId: SAVE_B,
        projectionValidation: 'client-prepared-constrained-envelope-v1',
      },
    });

    const a = await rowFor(SAVE_A);
    const b = await rowFor(SAVE_B);
    expect(a.data.neighbourNetwork).toHaveLength(1);
    expect(a.data.neighbourNetwork[0].linkId).toBe(EDGE);
    expect(a.data.neighbourNetwork[0].id).toBe(SAVE_B);
    expect(b.data.neighbourNetwork[0].id).toBe(SAVE_A);
    expect(a.data.config._userRoutes[0]).toMatchObject({
      routeId: EDGE,
      provenance: 'user',
    });
    // The raw config twin is what carries the mark through a regeneration.
    expect(a.data._config._userRoutes[0].routeId).toBe(EDGE);
    expect(b.data._config._userRoutes[0].routeId).toBe(EDGE);
    // The mirror column is refreshed on BOTH rows, not only the initiating one.
    expect(a.neighbour_links).toEqual(a.data.neighbourNetwork);
    expect(b.neighbour_links).toEqual(b.data.neighbourNetwork);
    expect(a.campaign_state.eventLog).toHaveLength(1);
    // The partner keeps its own timeline: a route is not an event in its history.
    expect(b.campaign_state.eventLog).toHaveLength(0);

    const journal = await db.query(
      `select phase, status, kind, receipt
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, request().commandId],
    );
    expect(journal.rows[0]).toMatchObject({
      phase: 'finalized',
      status: 'applied',
      kind: 'settlement.canon-event.apply',
      receipt: { routeId: EDGE },
    });
  });

  test('replays one identical command without moving either row', async () => {
    await applyCommand(request());
    const beforeA = await rowFor(SAVE_A);
    const beforeB = await rowFor(SAVE_B);

    const replay = await applyCommand(request());
    expect(replay.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: true,
      routeId: EDGE,
    });
    const afterA = await rowFor(SAVE_A);
    const afterB = await rowFor(SAVE_B);
    expect(afterA.updated_at.toISOString()).toBe(beforeA.updated_at.toISOString());
    expect(afterB.updated_at.toISOString()).toBe(beforeB.updated_at.toISOString());
    expect(afterA.data.neighbourNetwork).toHaveLength(1);
    expect(afterB.data.neighbourNetwork).toHaveLength(1);
  });

  test('the same command id with different behavior fails closed as a conflict', async () => {
    await applyCommand(request());
    const conflict = await applyCommand(request({
      partnerSettlement: nextB({
        config: { founded: 903, _userRoutes: [provenanceRow({ band: 'long' })] },
      }),
    }));
    expect(conflict.rows[0].result).toMatchObject({
      status: 'conflict',
      reason: 'command_id_conflict',
      replayed: true,
    });
    const b = await rowFor(SAVE_B);
    expect(b.data.config._userRoutes[0].band).toBe('steady');
  });

  // THE PROBE THE UNILATERAL RPC COULD NOT RUN. A stale partner must leave the
  // initiating settlement byte-identical: a half-edge is the corruption this whole
  // migration exists to make unrepresentable.
  test('a stale PARTNER base leaves the initiating settlement untouched', async () => {
    await db.query(
      `update public.settlements
          set data = data || '{"serverOnlyChange":true}'::jsonb
        where id = $1`,
      [SAVE_B],
    );
    const beforeA = await rowFor(SAVE_A);

    const result = await applyCommand(request());
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'partner_base_projection_changed',
      replayed: false,
      receipt: { reason: 'partner_base_projection_changed', routeId: EDGE },
    });

    const afterA = await rowFor(SAVE_A);
    expect(afterA.data).toEqual(beforeA.data);
    expect(afterA.data.neighbourNetwork).toEqual([]);
    expect(afterA.campaign_state.eventLog).toEqual([]);
    expect(afterA.updated_at.toISOString()).toBe(beforeA.updated_at.toISOString());

    const journal = await db.query(
      `select phase, status, failure_code
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, request().commandId],
    );
    expect(journal.rows[0]).toMatchObject({
      phase: 'finalized',
      status: 'stale',
      failure_code: 'partner_base_projection_changed',
    });
  });

  test('a stale INITIATING base leaves the partner untouched', async () => {
    await db.query(
      `update public.settlements
          set data = data || '{"serverOnlyChange":true}'::jsonb
        where id = $1`,
      [SAVE_A],
    );
    const beforeB = await rowFor(SAVE_B);

    const result = await applyCommand(request());
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'base_projection_changed',
    });
    const afterB = await rowFor(SAVE_B);
    expect(afterB.data).toEqual(beforeB.data);
    expect(afterB.data.neighbourNetwork).toEqual([]);
  });

  test('a partner owned by someone else refuses rather than half-applying', async () => {
    const beforeA = await rowFor(SAVE_A);
    const result = await applyCommand(request({
      partnerSaveId: FOREIGN_SAVE,
      partnerExpectedSettlement: {
        id: 'town.mallory',
        name: 'Mallory Keep',
        neighbourNetwork: [],
      },
      event: {
        id: EVENT_ID,
        type: 'CREATE_ROUTE',
        targetId: 'Mallory Keep',
        payload: {
          routeId: `route.${SAVE_A}.${FOREIGN_SAVE}.land`,
          mode: 'land',
        },
      },
      settlement: nextA({
        neighbourNetwork: [neighbourEntry(
          FOREIGN_SAVE,
          'Mallory Keep',
          `route.${SAVE_A}.${FOREIGN_SAVE}.land`,
        )],
        config: {
          founded: 812,
          _userRoutes: [provenanceRow({
            routeId: `route.${SAVE_A}.${FOREIGN_SAVE}.land`,
          })],
        },
        _config: {
          founded: 812,
          _userRoutes: [provenanceRow({
            routeId: `route.${SAVE_A}.${FOREIGN_SAVE}.land`,
          })],
        },
      }),
      partnerSettlement: {
        id: 'town.mallory',
        name: 'Mallory Keep',
        neighbourNetwork: [neighbourEntry(
          SAVE_A,
          'Ashford',
          `route.${SAVE_A}.${FOREIGN_SAVE}.land`,
        )],
      },
    }));
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'save_unavailable',
    });
    const afterA = await rowFor(SAVE_A);
    expect(afterA.data).toEqual(beforeA.data);
    const foreign = await rowFor(FOREIGN_SAVE);
    expect(foreign.data.neighbourNetwork).toEqual([]);
  });
});

describe('migration 193 guards', () => {
  test('refuses any event type other than CREATE_ROUTE', async () => {
    await expect(applyCommand(request({
      event: {
        id: EVENT_ID,
        type: 'CUT_TRADE_ROUTE',
        payload: { routeId: EDGE, mode: 'land' },
      },
    }))).rejects.toThrow(/only CREATE_ROUTE is server-authoritative/);
  });

  test('refuses a route whose two endpoints are the same settlement', async () => {
    await expect(applyCommand(request({
      partnerSaveId: SAVE_A,
    }))).rejects.toThrow(/two distinct settlements/);
  });

  test('refuses a mode outside the closed land/water vocabulary', async () => {
    await expect(applyCommand(request({
      event: {
        id: EVENT_ID,
        type: 'CREATE_ROUTE',
        payload: { routeId: `route.${SAVE_A}.${SAVE_B}.canal`, mode: 'canal' },
      },
    }))).rejects.toThrow(/land or water mode/);
  });

  test('recomputes the edge identity and refuses a client-invented route id', async () => {
    await expect(applyCommand(request({
      event: {
        id: EVENT_ID,
        type: 'CREATE_ROUTE',
        payload: { routeId: `route.${SAVE_B}.${SAVE_A}.land`, mode: 'land' },
      },
    }))).rejects.toThrow(/deterministic edge identity/);
  });

  test('refuses a write outside the mutation surface on either endpoint', async () => {
    await expect(applyCommand(request({
      settlement: nextA({ population: 4000 }),
    }))).rejects.toThrow(/outside its mutation surface/);
    await expect(applyCommand(request({
      partnerSettlement: nextB({ population: 4000 }),
    }))).rejects.toThrow(/partner field outside its mutation surface/);
  });

  test('refuses a config key this command does not own', async () => {
    await expect(applyCommand(request({
      settlement: nextA({
        config: { founded: 812, _userRoutes: [provenanceRow()], _cutRoutes: [] },
      }),
    }))).rejects.toThrow(/outside its mutation surface/);
  });

  test('refuses more than one neighbour entry, or a dropped prefix', async () => {
    await expect(applyCommand(request({
      settlement: nextA({
        neighbourNetwork: [
          neighbourEntry(SAVE_B, 'Brookmere'),
          neighbourEntry(SAVE_B, 'Brookmere'),
        ],
      }),
    }))).rejects.toThrow(/exactly one neighbour entry/);
  });

  test('refuses a partner neighbour entry pointing at the wrong settlement', async () => {
    await expect(applyCommand(request({
      partnerSettlement: nextB({
        neighbourNetwork: [neighbourEntry(SAVE_B, 'Brookmere')],
      }),
    }))).rejects.toThrow(/not this route \(partner\)/);
  });

  test('refuses a provenance row that does not name the user', async () => {
    await expect(applyCommand(request({
      settlement: nextA({
        config: {
          founded: 812,
          _userRoutes: [provenanceRow({ provenance: 'generated' })],
        },
        _config: {
          founded: 812,
          _userRoutes: [provenanceRow({ provenance: 'generated' })],
        },
      }),
    }))).rejects.toThrow(/not this user route/);
  });

  test('refuses a raw config twin that skips the provenance mirror', async () => {
    await expect(applyCommand(request({
      settlement: nextA({ _config: { founded: 812 } }),
    }))).rejects.toThrow(/must append a _config\._userRoutes row/);
  });

  test('refuses an event-log append that is not this command event', async () => {
    await expect(applyCommand(request({
      campaignState: {
        phase: 'canon',
        eventLog: [{ event: { id: 'event.other', type: 'CREATE_ROUTE' } }],
      },
    }))).rejects.toThrow(/does not match the command event/);
  });

  test('refuses an unauthenticated caller and a mismatched expected owner', async () => {
    await expect(db.query(
      `select public.apply_create_route_command(
        $1::uuid, $2::text, $3::uuid, $4::uuid, $5::timestamptz,
        $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb,
        $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb)`,
      [
        ALICE, 'cmd:x', SAVE_A, SAVE_B, REVISION,
        JSON.stringify(request().event), JSON.stringify(BASE_A),
        JSON.stringify({ phase: 'canon', eventLog: [] }), '{}',
        JSON.stringify(BASE_B), JSON.stringify(nextA()),
        JSON.stringify(request().campaignState), JSON.stringify(nextB()), null,
      ],
    )).rejects.toThrow(/not authenticated/);
  });

  test('refuses a caller whose session is not the expected owner', async () => {
    // MALLORY is authenticated, but the command claims ALICE as its owner.
    await expect(asUser(
      MALLORY,
      `select public.apply_create_route_command(
        $1::uuid, $2::text, $3::uuid, $4::uuid, $5::timestamptz,
        $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb,
        $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb)`,
      [
        ALICE, 'cmd:stolen', SAVE_A, SAVE_B, REVISION,
        JSON.stringify(request().event), JSON.stringify(BASE_A),
        JSON.stringify({ phase: 'canon', eventLog: [] }), '{}',
        JSON.stringify(BASE_B), JSON.stringify(nextA()),
        JSON.stringify(request().campaignState), JSON.stringify(nextB()), null,
      ],
    )).rejects.toThrow(/application command owner changed/);
    const a = await rowFor(SAVE_A);
    expect(a.data.neighbourNetwork).toEqual([]);
  });
});

describe('migration 193 direction independence', () => {
  test('the edge identity is the same whichever endpoint initiates', async () => {
    const fromB = await applyCommand(request({
      commandId: 'cmd:canon-event-apply:route-from-b',
      saveId: SAVE_B,
      partnerSaveId: SAVE_A,
      expectedSettlement: BASE_B,
      partnerExpectedSettlement: BASE_A,
      settlement: nextB(),
      partnerSettlement: nextA(),
    }));
    expect(fromB.rows[0].result).toMatchObject({
      status: 'applied',
      routeId: EDGE,
    });
    const b = await rowFor(SAVE_B);
    expect(b.campaign_state.eventLog).toHaveLength(1);
    expect(b.data.config._userRoutes[0].routeId).toBe(EDGE);
  });
});
