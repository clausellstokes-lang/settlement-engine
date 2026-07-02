/**
 * neighbourBacklinkMerge.pglite.test.js — proves migration 096's
 * merge_neighbour_backlink RPC applies the partner back-link ADDITIVELY against the
 * partner's CURRENT data (the anti-clobber fix), and is idempotent. Runs the REAL
 * 096 function against pglite.
 *
 * The bug it closes: the old path wrote the partner's full STALE settlement blob, so
 * a second concurrent save dropped the first's back-link. The additive-merge test
 * below is exactly what the old approach FAILED: apply link A, then link B, and
 * assert BOTH survive.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_096 = resolve(process.cwd(), 'supabase', 'migrations', '096_merge_neighbour_backlink.sql');
const have = existsSync(MIG_096);
const SRC = have ? readFileSync(MIG_096, 'utf-8') : '';

const UID = '11111111-1111-1111-1111-111111111111';
const PARTNER = '22222222-2222-2222-2222-222222222222';
const SAVE_A = '33333333-3333-3333-3333-333333333333';
const SAVE_B = '44444444-4444-4444-4444-444444444444';

// Vacuity guard (unconditional): a rename/removal of 096 must fail loudly.
it('migration 096 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('096 merge_neighbour_backlink — atomic additive merge (pglite)', () => {
  /** @type {any} */
  let db;

  const merge = (linkId, newSaveId, entry, rels = []) =>
    db.query('select public.merge_neighbour_backlink($1, $2, $3, $4::jsonb, $5::jsonb)', [
      PARTNER, linkId, newSaveId, JSON.stringify(entry), JSON.stringify(rels),
    ]);
  const partnerData = async () =>
    (await db.query(`select data from public.settlements where id = '${PARTNER}'`)).rows[0].data;
  const linkIds = async () => (await partnerData()).neighbourNetwork.map((/** @type {any} */ e) => e.linkId);

  beforeAll(async () => { db = new PGlite(); });

  beforeEach(async () => {
    await db.exec(`
      do $$ begin
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      end $$;
      drop schema if exists auth cascade; create schema auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$ select '${UID}'::uuid $fn$;
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$ select true $fn$;
      drop table if exists public.settlements;
      create table public.settlements (id uuid primary key, user_id uuid, data jsonb, neighbour_links jsonb);
      insert into public.settlements (id, user_id, data, neighbour_links) values
        ('${PARTNER}', '${UID}',
         '{"name":"Partner","neighbourNetwork":[],"interSettlementRelationships":[]}'::jsonb, '[]'::jsonb);
    `);
    await db.exec(SRC); // the real 096 function + grants
  });

  it('applies a back-link entry to the partner’s CURRENT data + mirrors neighbour_links', async () => {
    await merge('link_A', SAVE_A, { id: SAVE_A, linkId: 'link_A', name: 'A' });
    expect(await linkIds()).toContain('link_A');
    const mirror = (await db.query(`select neighbour_links from public.settlements where id = '${PARTNER}'`)).rows[0].neighbour_links;
    expect(mirror.map((/** @type {any} */ e) => e.linkId)).toContain('link_A');
  });

  it('two DIFFERENT back-links BOTH survive — the anti-clobber fix', async () => {
    await merge('link_A', SAVE_A, { id: SAVE_A, linkId: 'link_A', name: 'A' });
    await merge('link_B', SAVE_B, { id: SAVE_B, linkId: 'link_B', name: 'B' });
    const ids = await linkIds();
    // The OLD full-stale-blob write would have dropped link_A here.
    expect(ids).toContain('link_A');
    expect(ids).toContain('link_B');
  });

  it('is idempotent: re-applying the SAME link does not duplicate it', async () => {
    const entry = { id: SAVE_A, linkId: 'link_A', name: 'A' };
    await merge('link_A', SAVE_A, entry);
    await merge('link_A', SAVE_A, entry);
    expect((await linkIds()).filter((/** @type {any} */ id) => id === 'link_A')).toHaveLength(1);
  });

  it('replaces this link’s interSettlementRelationships rather than accumulating stale ones', async () => {
    await merge('link_A', SAVE_A, { id: SAVE_A, linkId: 'link_A' }, [{ linkId: 'link_A', npcId: 'n1' }]);
    await merge('link_A', SAVE_A, { id: SAVE_A, linkId: 'link_A' }, [{ linkId: 'link_A', npcId: 'n2' }]);
    const rels = (await partnerData()).interSettlementRelationships.filter((/** @type {any} */ r) => r.linkId === 'link_A');
    expect(rels.map((/** @type {any} */ r) => r.npcId)).toEqual(['n2']);
  });

  it('a not-owned / missing partner is a clean no-op (no throw)', async () => {
    await db.query(`update public.settlements set user_id = '${SAVE_B}' where id = '${PARTNER}'`); // now owned by someone else
    await expect(merge('link_X', SAVE_A, { id: SAVE_A, linkId: 'link_X' })).resolves.toBeDefined();
    expect(await linkIds()).not.toContain('link_X');
  });
});
