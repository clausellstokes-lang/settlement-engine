/**
 * worldPulseAtomicPersist.pglite.test.js — EXECUTION test of the ATOMIC world-pulse
 * advance write (migration 069) against in-process Postgres (pglite).
 *
 * The residual the round-1/round-2 client guards could not close: the client wrote
 * a world-pulse advance as N serial settlement upserts PLUS a separate campaign
 * upsert. That can never be atomic from the client — a FORWARD partial (settlement
 * A lands, B fails) leaves A advanced in the cloud while the campaign + B stay
 * behind = a hybrid cloud timeline. Only a single DB transaction can roll A back too.
 *
 * 069 adds persist_world_pulse_advance: one SECURITY DEFINER transaction that writes
 * every affected settlement AND the campaign snapshot together, ownership-checked,
 * with an optional stale-tick guard. This RUNS the real, verbatim-extracted RPC body
 * from 069 against pglite and proves true all-or-nothing:
 *   (a) a PARTIAL failure (one settlement not owned) rolls EVERYTHING back — no
 *       settlement and no campaign change lands;
 *   (b) the happy path commits all member settlements + the campaign atomically;
 *   (c) the stale-version (tick) guard rejects a duplicate/stale double-apply.
 *
 * auth.uid() is faked with a session-GUC shim so the definer body's ownership checks
 * run verbatim (pglite has no GoTrue). Mirrors recoveryLockoutSelfheal.pglite.test.js.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase/migrations/069_world_pulse_atomic_persist.sql');
const exists = existsSync(MIG);

describe('069 pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 069 is present on disk', () => {
    expect(exists, 'supabase/migrations/069_world_pulse_atomic_persist.sql must exist').toBe(true);
  });
});

/** Extract the `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(name) {
  const src = readFileSync(MIG, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from 069`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const MALLORY = '22222222-2222-2222-2222-222222222222';
const CAMPAIGN = '33333333-3333-4333-8333-333333333333';
const ASH = '44444444-4444-4444-8444-444444444444';
const BARROW = '55555555-5555-4555-8555-555555555555';
// A settlement owned by MALLORY, not Alice — the cross-owner row that must abort.
const FOREIGN = '66666666-6666-4666-8666-666666666666';

let db;
const scalar = async (q) => (await db.query(q)).rows[0];

/**
 * Run a single statement as a given user. `set local` scopes auth.uid()'s GUC to
 * the surrounding transaction, so the call runs inside one tx — which also means a
 * raise inside the definer body rolls the whole thing back, exactly as in Postgres.
 * Returns the query result; rejections propagate (the tx aborts).
 */
async function asUser(uid, sql) {
  return db.transaction(async (tx) => {
    await tx.query(`set local request.jwt.claim.sub = '${uid}'`);
    return tx.query(sql);
  });
}

/** Build the map_data envelope the client passes (mapDataForCampaign shape). */
function envelope(tick) {
  return JSON.stringify({
    kind: 'settlementforge_campaign',
    version: 2,
    campaign: {
      id: CAMPAIGN,
      name: 'Realm of Ash',
      mapState: { seed: 'seed-9', placements: { b1: ASH } },
      regionalGraph: { channels: [{ from: ASH, to: BARROW }] },
      worldState: { tick, canonizedAt: '2026-01-01T00:00:00.000Z' },
    },
  });
}

describe.runIf(exists)('world-pulse atomic persist — execution against 069 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Minimal schema: an auth.uid() shim reading the session GUC, plus the two
    // tables the RPC touches with exactly the columns it reads/writes.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;

      create table public.saved_maps (
        id uuid primary key,
        user_id uuid not null,
        name text,
        map_seed text,
        map_data jsonb,
        burg_settlement_map jsonb,
        supply_chain_config jsonb,
        updated_at timestamptz not null default now()
      );

      create table public.settlements (
        id uuid primary key,
        user_id uuid not null,
        data jsonb,
        campaign_state jsonb,
        version_history jsonb,
        updated_at timestamptz not null default now()
      );
    `);

    // The real, verbatim RPC body from 069.
    await db.exec(extractFn('persist_world_pulse_advance'));
  });

  beforeEach(async () => {
    await db.exec(`truncate public.saved_maps; truncate public.settlements;`);
    // Alice owns the campaign (tick 0) and both member settlements; Mallory owns FOREIGN.
    await db.query(
      `insert into public.saved_maps (id, user_id, name, map_seed, map_data)
         values ($1, $2, 'Realm of Ash', 'seed-0', $3)`,
      [CAMPAIGN, ALICE, envelope(0)],
    );
    await db.query(
      `insert into public.settlements (id, user_id, data, campaign_state, version_history) values
         ($1, $3, '{"name":"Ashford","pop":1500}', '{"phase":"canon"}', '[]'),
         ($2, $3, '{"name":"Barrow","pop":900}',  '{"phase":"canon"}', '[]')`,
      [ASH, BARROW, ALICE],
    );
    await db.query(
      `insert into public.settlements (id, user_id, data) values ($1, $2, '{"name":"Mallory Keep"}')`,
      [FOREIGN, MALLORY],
    );
  });

  const ashData = async () => (await scalar(`select data->>'name' as n, data->>'pop' as p from public.settlements where id='${ASH}'`));
  const campTick = async () => (await scalar(`select map_data #>> '{campaign,worldState,tick}' as t from public.saved_maps where id='${CAMPAIGN}'`)).t;

  // ── (a) PARTIAL failure rolls EVERYTHING back ───────────────────────────────
  it('a foreign settlement in the update set rolls back ALL writes (no settlement, no campaign change)', async () => {
    // The update set advances Ashford AND a settlement Alice does NOT own (Mallory's
    // FOREIGN). The ownership pre-check must abort before ANY write lands.
    const updates = JSON.stringify([
      { saveId: ASH, settlement: { name: 'Ashford', pop: 2000 }, campaignState: { phase: 'canon', advanced: true } },
      { saveId: FOREIGN, settlement: { name: 'Seized Keep' } },
    ]);

    await expect(
      asUser(ALICE, `select public.persist_world_pulse_advance(
        '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${updates}'::jsonb, null)`),
    ).rejects.toThrow();

    // Nothing moved: Ashford's data, the foreign keep, and the campaign tick are all
    // exactly as seeded — the whole transaction rolled back.
    const ash = await ashData();
    expect(ash.n).toBe('Ashford');
    expect(ash.p).toBe('1500');             // NOT 2000 — Ashford did not advance
    expect(await campTick()).toBe('0');     // campaign tick unchanged
    const foreign = await scalar(`select data->>'name' as n from public.settlements where id='${FOREIGN}'`);
    expect(foreign.n).toBe('Mallory Keep'); // untouched — no cross-owner write
  });

  it('advancing a campaign the caller does not own aborts with no write', async () => {
    const updates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]);
    await expect(
      asUser(MALLORY, `select public.persist_world_pulse_advance(
        '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${updates}'::jsonb, null)`),
    ).rejects.toThrow();
    const ash = await ashData();
    expect(ash.p).toBe('1500');           // no settlement write under a foreign caller
    expect(await campTick()).toBe('0');   // no campaign write
  });

  // ── (b) the happy path commits all atomically ───────────────────────────────
  it('the happy path commits every member settlement AND the campaign snapshot together', async () => {
    const updates = JSON.stringify([
      { saveId: ASH, settlement: { name: 'Ashford', pop: 2000 }, campaignState: { phase: 'canon', advanced: true } },
      { saveId: BARROW, settlement: { name: 'Barrow', pop: 1100 } },
    ]);

    const res = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${updates}'::jsonb, 1) as r`);
    expect(res.rows[0].r.applied).toBe(true);
    expect(res.rows[0].r.settlementsWritten).toBe(2);

    // Both settlements advanced.
    expect((await ashData()).p).toBe('2000');
    const barrow = await scalar(`select data->>'pop' as p from public.settlements where id='${BARROW}'`);
    expect(barrow.p).toBe('1100');
    // The campaign snapshot landed verbatim AND the derived columns refreshed from
    // the {campaign,...} envelope (the round-3 path fix) — name/seed/placements.
    const camp = await scalar(`select name, map_seed,
        burg_settlement_map->>'b1' as placement,
        map_data #>> '{campaign,worldState,tick}' as tick
      from public.saved_maps where id='${CAMPAIGN}'`);
    expect(camp.name).toBe('Realm of Ash');
    expect(camp.map_seed).toBe('seed-9');
    expect(camp.placement).toBe(ASH);
    expect(camp.tick).toBe('1');
  });

  it('an absent campaignState/versionHistory key keeps the settlement row value', async () => {
    // Only `settlement` present for Ashford — campaign_state + version_history must
    // keep their seeded values (the RPC writes only keys present in each update).
    const updates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]);
    await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${updates}'::jsonb, null)`);
    const row = await scalar(`select campaign_state->>'phase' as phase, version_history::text as vh
      from public.settlements where id='${ASH}'`);
    expect(row.phase).toBe('canon');   // untouched — key absent in the update
    expect(row.vh).toBe('[]');         // untouched — key absent in the update
  });

  // ── (c) the stale-version guard rejects a double-apply ──────────────────────
  it('the stale-tick guard makes a duplicate re-apply a no-op (applied:false, nothing double-advances)', async () => {
    const updates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]);

    // First apply moves tick 0 → 1 (expected tick 1, strictly ahead of stored 0).
    const first = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${updates}'::jsonb, 1) as r`);
    expect(first.rows[0].r.applied).toBe(true);
    expect(await campTick()).toBe('1');

    // A duplicate re-apply of the SAME tick (expected 1, stored already 1) is a
    // no-op — applied:false, reason stale_tick, and NOTHING re-advances. This is the
    // double-apply the client's id-keyed retry could otherwise replay.
    const dupUpdates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 9999 } }]);
    const dup = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(1)}'::jsonb, '${dupUpdates}'::jsonb, 1) as r`);
    expect(dup.rows[0].r.applied).toBe(false);
    expect(dup.rows[0].r.reason).toBe('stale_tick');
    // The stale re-apply wrote NOTHING — Ashford still holds the first apply's value.
    expect((await ashData()).p).toBe('2000');  // NOT 9999

    // A genuine FORWARD advance (expected 2 > stored 1) is still accepted.
    const fwd = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(2)}'::jsonb, '${updates}'::jsonb, 2) as r`);
    expect(fwd.rows[0].r.applied).toBe(true);
    expect(await campTick()).toBe('2');
  });

  // ── (d) round-4: a NULL/BACKWARD expected tick is last-write-wins (undo) while a
  //         STALE forward one is a no-op ─────────────────────────────────────────
  it('a NULL expected tick applies a BACKWARD (undo) write that a forward guard would reject as stale', async () => {
    const fwdUpdates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]);

    // Forward advance tick 0 → 5 (guarded; expected 5 > stored 0).
    const fwd = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${envelope(5)}'::jsonb, '${fwdUpdates}'::jsonb, 5) as r`);
    expect(fwd.rows[0].r.applied).toBe(true);
    expect(await campTick()).toBe('5');
    expect((await ashData()).p).toBe('2000');

    // An undo restores the PRIOR (lower) tick 0. Routing THIS revert through the
    // forward guard — passing the lower restored tick 0 as p_expected_tick — would
    // be rejected (stored 5 >= expected 0 → stale_tick), so the cloud would never
    // revert. Confirm that pathology first.
    const undoSnapshot = JSON.stringify({
      kind: 'settlementforge_campaign', version: 2,
      campaign: {
        id: CAMPAIGN, name: 'Realm of Ash',
        mapState: { seed: 'seed-9', placements: { b1: ASH } },
        regionalGraph: { channels: [{ from: ASH, to: BARROW }] },
        worldState: { tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
      },
    });
    const undoUpdates = JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 1500 } }]);
    const guarded = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${undoSnapshot}'::jsonb, '${undoUpdates}'::jsonb, 0) as r`);
    expect(guarded.rows[0].r.applied).toBe(false);       // the bug: undo rejected
    expect(guarded.rows[0].r.reason).toBe('stale_tick');
    expect(await campTick()).toBe('5');                  // cloud never reverted

    // The FIX: an undo passes p_expected_tick = NULL (last-write-wins), so 069 skips
    // the forward guard and the reverted snapshot lands — tick 5 → 0, Ashford back.
    const applied = await asUser(ALICE, `select public.persist_world_pulse_advance(
      '${CAMPAIGN}'::uuid, '${undoSnapshot}'::jsonb, '${undoUpdates}'::jsonb, null) as r`);
    expect(applied.rows[0].r.applied).toBe(true);
    expect(await campTick()).toBe('0');                  // the undo reached the cloud
    expect((await ashData()).p).toBe('1500');            // settlement reverted too
  });
});
