/**
 * ingestActorLinks.test.js — the analytics first-contact identity race, executed.
 *
 * ingest-events resolved an actor by select-then-insert and DISCARDED the insert
 * result. Two failures hid behind that:
 *
 *   1. concurrent first contact — the loser's 23505 was swallowed and its batch was
 *      written under an actor no mapping row names (analytics_events.actor_id has no
 *      FK, so the orphan persists);
 *   2. cross-user device adoption — analytics_identity_links.actor_id is UNIQUE
 *      (036:31-35) and `ON CONFLICT (user_id) DO NOTHING` does not arbitrate it, so a
 *      second user on a shared browser profile (sf_view_token is never rotated at
 *      sign-out) adopted the first user's actor, got NO mapping row of their own, and
 *      was PERMANENTLY attributed to the first user — including for erasure, where
 *      purge_analytics_for_user would answer 'no actor mapping' and delete nothing.
 *
 * The claiming logic lives in ingest-events/actorLinks.ts precisely so it can be RUN
 * here (index.ts carries remote deno.land/esm.sh imports and cannot be imported by
 * vitest). The fake below models the REAL 036 constraints — device_key primary key,
 * user_id primary key AND actor_id unique on the identity table, actor_id NOT unique
 * on the device table — and the last describe re-runs the OLD unchecked algorithm
 * against the same fake to prove these assertions are load-bearing, not vacuous.
 */
import { describe, it, expect } from 'vitest';
import {
  claimActorLink, readActorId, resolveDeviceActor, resolveUserActor,
  DEVICE_TABLE, IDENTITY_TABLE,
} from '../../supabase/functions/ingest-events/actorLinks.ts';

/** Migration 036's real unique surface, per table. */
const UNIQUE_COLUMNS = {
  [DEVICE_TABLE]: ['device_key'],                 // actor_id deliberately NOT unique
  [IDENTITY_TABLE]: ['user_id', 'actor_id'],      // two independent unique indexes
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * An in-memory stand-in for the two mapping tables that enforces their unique
 * indexes and reports a violation the way postgrest does (`{ error }`, never a throw).
 */
function makeAdmin(options = {}) {
  const tables = { [DEVICE_TABLE]: [], [IDENTITY_TABLE]: [] };
  const inserts = [];
  const admin = {
    from: (table) => ({
      select: () => ({
        eq: (column, value) => ({
          maybeSingle: async () => {
            if (options.onSelect) options.onSelect();
            if (options.readsFail) return { data: null, error: { message: 'read unavailable' } };
            const row = tables[table].find((r) => r[column] === value);
            return { data: row ? { actor_id: row.actor_id } : null, error: null };
          },
        }),
      }),
      insert: async (row) => {
        if (options.beforeInsert) await options.beforeInsert();
        inserts.push({ table, row });
        if (options.writesFail) return { error: { code: '53300', message: 'write unavailable' } };
        for (const column of UNIQUE_COLUMNS[table]) {
          if (row[column] !== undefined && tables[table].some((r) => r[column] === row[column])) {
            return { error: { code: '23505', message: `duplicate key value violates unique constraint (${column})` } };
          }
        }
        tables[table].push({ ...row });
        return { error: null };
      },
    }),
  };
  return { admin, tables, inserts };
}

/**
 * THE RACE WINDOW, made deterministic: hold every INSERT until `reads` SELECTs have
 * been served, so both concurrent requests are guaranteed to have missed the mapping
 * before either writes. Without this the second request simply reads the first one's
 * committed row and the race never occurs.
 */
function raceBarrier(reads) {
  let seen = 0;
  let open;
  const gate = new Promise((resolve) => { open = resolve; });
  return {
    onSelect: () => { if (++seen >= reads) open(); },
    beforeInsert: () => gate,
  };
}

describe('guard the guard — the fake enforces exactly migration 036 uniqueness', () => {
  it('the identity table rejects a duplicate user_id AND a duplicate actor_id', async () => {
    const { admin, tables } = makeAdmin();
    expect(await admin.from(IDENTITY_TABLE).insert({ user_id: 'u1', actor_id: 'a1' })).toEqual({ error: null });
    expect((await admin.from(IDENTITY_TABLE).insert({ user_id: 'u1', actor_id: 'a9' })).error.code).toBe('23505');
    expect((await admin.from(IDENTITY_TABLE).insert({ user_id: 'u2', actor_id: 'a1' })).error.code).toBe('23505');
    expect(tables[IDENTITY_TABLE]).toHaveLength(1);
  });

  it('the device table rejects a duplicate device_key but SHARES an actor_id freely', async () => {
    const { admin, tables } = makeAdmin();
    expect(await admin.from(DEVICE_TABLE).insert({ device_key: 'd1', actor_id: 'a1' })).toEqual({ error: null });
    expect((await admin.from(DEVICE_TABLE).insert({ device_key: 'd1', actor_id: 'a2' })).error.code).toBe('23505');
    // 036 puts no unique index on analytics_device_links.actor_id — two devices may
    // legitimately map to one actor, and the code must not "recover" from that.
    expect(await admin.from(DEVICE_TABLE).insert({ device_key: 'd2', actor_id: 'a1' })).toEqual({ error: null });
    expect(tables[DEVICE_TABLE]).toHaveLength(2);
  });
});

describe('first contact — the happy path is unchanged', () => {
  it('a new device mints, stores, and re-reads the SAME actor', async () => {
    const { admin, tables, inserts } = makeAdmin();
    const first = await resolveDeviceActor(admin, 'dev-key-1');
    expect(first).toMatch(UUID_RE);
    expect(tables[DEVICE_TABLE]).toEqual([{ device_key: 'dev-key-1', actor_id: first }]);
    const second = await resolveDeviceActor(admin, 'dev-key-1');
    expect(second).toBe(first);
    expect(inserts).toHaveLength(1); // the second visit writes nothing
  });

  it('a signed-in first contact ADOPTS the device actor (the anon funnel stitches)', async () => {
    const { admin, tables } = makeAdmin();
    const deviceActor = await resolveDeviceActor(admin, 'dev-key-2', () => 'actor-device');
    const userActor = await resolveUserActor(admin, 'user-1', 'dev-key-2', () => 'actor-fresh');
    expect(userActor).toBe(deviceActor);
    expect(tables[IDENTITY_TABLE]).toEqual([{ user_id: 'user-1', actor_id: 'actor-device' }]);
  });

  it('with no device key the user simply gets a fresh actor', async () => {
    const { admin } = makeAdmin();
    expect(await resolveUserActor(admin, 'user-2', null, () => 'actor-solo')).toBe('actor-solo');
  });
});

describe('concurrent first contact — the loser yields to the stored row', () => {
  it('the losing claim returns the WINNER\'s actor, not the one it minted', async () => {
    const { admin, tables } = makeAdmin();
    const winner = await claimActorLink(admin, DEVICE_TABLE, 'device_key', 'dev-race', 'actor-A', () => 'actor-never');
    const loser = await claimActorLink(admin, DEVICE_TABLE, 'device_key', 'dev-race', 'actor-B', () => 'actor-never');
    expect(winner).toBe('actor-A');
    expect(loser).toBe('actor-A'); // NOT 'actor-B', and never a third minted id
    expect(tables[DEVICE_TABLE]).toHaveLength(1);
  });

  it('two device resolutions inside the real race window agree on one actor', async () => {
    const { admin, tables } = makeAdmin(raceBarrier(2)); // neither may write until both have read
    const [a, b] = await Promise.all([
      resolveDeviceActor(admin, 'dev-race-2', () => 'actor-P'),
      resolveDeviceActor(admin, 'dev-race-2', () => 'actor-Q'),
    ]);
    expect(a).toBe(b);
    expect(tables[DEVICE_TABLE]).toHaveLength(1);
    expect(a).toBe(tables[DEVICE_TABLE][0].actor_id);
  });

  it('two identity resolutions in the race window agree — one user never splits', async () => {
    const { admin, tables } = makeAdmin(raceBarrier(2));
    const [a, b] = await Promise.all([
      resolveUserActor(admin, 'user-race', null, () => 'actor-R'),
      resolveUserActor(admin, 'user-race', null, () => 'actor-S'),
    ]);
    expect(a).toBe(b);
    expect(tables[IDENTITY_TABLE]).toHaveLength(1);
    expect(a).toBe(tables[IDENTITY_TABLE][0].actor_id);
  });
});

describe('shared browser profile — a second user is never filed under the first', () => {
  it('user B does NOT inherit user A\'s actor from the shared device link', async () => {
    const { admin, tables } = makeAdmin();
    const deviceActor = await resolveDeviceActor(admin, 'shared-device', () => 'actor-A');
    const actorA = await resolveUserActor(admin, 'user-A', 'shared-device', () => 'actor-A2');
    expect(actorA).toBe(deviceActor); // A adopted it, as designed

    const actorB = await resolveUserActor(admin, 'user-B', 'shared-device', () => 'actor-B');
    expect(actorB).not.toBe(actorA);
    expect(actorB).toBe('actor-B');

    // A's mapping is untouched and the device link still belongs to A.
    expect(await readActorId(admin, IDENTITY_TABLE, 'user_id', 'user-A')).toBe(actorA);
    expect(tables[DEVICE_TABLE]).toEqual([{ device_key: 'shared-device', actor_id: 'actor-A' }]);
  });

  it('user B gets a REAL mapping row, so erasure can find them', async () => {
    // purge_analytics_for_user (036:160-162) early-returns 'no actor mapping' and
    // deletes nothing when the identity row is absent — which is exactly what the
    // swallowed 23505 produced for every second user of a shared browser.
    const { admin, tables } = makeAdmin();
    await resolveDeviceActor(admin, 'shared-device-2', () => 'actor-A');
    await resolveUserActor(admin, 'user-A', 'shared-device-2', () => 'actor-A2');
    await resolveUserActor(admin, 'user-B', 'shared-device-2', () => 'actor-B');
    expect(await readActorId(admin, IDENTITY_TABLE, 'user_id', 'user-B')).toBe('actor-B');
    expect(tables[IDENTITY_TABLE].map((r) => r.user_id).sort()).toEqual(['user-A', 'user-B']);
  });

  it('B\'s later visits stay B — the adoption is not retried on every request', async () => {
    const { admin } = makeAdmin();
    await resolveDeviceActor(admin, 'shared-device-3', () => 'actor-A');
    await resolveUserActor(admin, 'user-A', 'shared-device-3', () => 'actor-A2');
    const first = await resolveUserActor(admin, 'user-B', 'shared-device-3', () => 'actor-B');
    const second = await resolveUserActor(admin, 'user-B', 'shared-device-3', () => 'actor-B-again');
    expect(second).toBe(first);
  });
});

describe('fail-soft — telemetry never fails a request', () => {
  it('an unwritable mapping still yields an actor and never throws', async () => {
    const { admin, tables } = makeAdmin({ writesFail: true });
    const actor = await resolveDeviceActor(admin, 'dev-down');
    expect(actor).toMatch(UUID_RE);
    expect(tables[DEVICE_TABLE]).toHaveLength(0);
  });

  it('an unreadable mapping still yields an actor and never throws', async () => {
    const { admin } = makeAdmin({ readsFail: true, writesFail: true });
    expect(await resolveUserActor(admin, 'user-dark', 'dev-dark')).toMatch(UUID_RE);
  });
});

describe('SENTINEL — the OLD unchecked algorithm reproduces both defects', () => {
  // Without this, every assertion above could be green because the fake is toothless.
  // This is the pre-fix code, verbatim in behaviour: select, mint, insert, ignore the
  // result. It must FAIL the same scenarios the fixed helpers pass.
  const legacyResolveDevice = async (admin, deviceKey, mint) => {
    const { data } = await admin.from(DEVICE_TABLE).select('actor_id').eq('device_key', deviceKey).maybeSingle();
    if (data?.actor_id) return data.actor_id;
    const actor = mint();
    await admin.from(DEVICE_TABLE).insert({ device_key: deviceKey, actor_id: actor });
    return actor;
  };
  const legacyResolveUser = async (admin, userId, deviceKey, mint) => {
    const { data } = await admin.from(IDENTITY_TABLE).select('actor_id').eq('user_id', userId).maybeSingle();
    if (data?.actor_id) return data.actor_id;
    let actor = null;
    if (deviceKey) {
      const { data: dev } = await admin.from(DEVICE_TABLE).select('actor_id').eq('device_key', deviceKey).maybeSingle();
      if (dev?.actor_id) actor = dev.actor_id;
    }
    if (!actor) actor = mint();
    await admin.from(IDENTITY_TABLE).insert({ user_id: userId, actor_id: actor });
    return actor;
  };

  it('legacy: the concurrent loser walks away with an orphan actor', async () => {
    const { admin, tables } = makeAdmin(raceBarrier(2)); // the same window the fix survives
    const [a, b] = await Promise.all([
      legacyResolveDevice(admin, 'dev-legacy', () => 'actor-A'),
      legacyResolveDevice(admin, 'dev-legacy', () => 'actor-B'),
    ]);
    expect(a).not.toBe(b);                               // the defect: two actors, one device
    expect(tables[DEVICE_TABLE]).toHaveLength(1);
    const stored = tables[DEVICE_TABLE][0].actor_id;
    expect([a, b].filter((id) => id !== stored)).toHaveLength(1); // one batch is orphaned
  });

  it('legacy: user B is filed under user A, permanently and unerasably', async () => {
    const { admin, tables } = makeAdmin();
    await legacyResolveDevice(admin, 'shared-legacy', () => 'actor-A');
    const actorA = await legacyResolveUser(admin, 'user-A', 'shared-legacy', () => 'actor-A2');
    const actorB = await legacyResolveUser(admin, 'user-B', 'shared-legacy', () => 'actor-B');
    expect(actorB).toBe(actorA);                         // the defect
    expect(tables[IDENTITY_TABLE].map((r) => r.user_id)).toEqual(['user-A']); // B has no row
    // …so erasure finds nothing for B, which is the privacy half of the finding.
    expect(await readActorId(admin, IDENTITY_TABLE, 'user_id', 'user-B')).toBeNull();
  });
});
