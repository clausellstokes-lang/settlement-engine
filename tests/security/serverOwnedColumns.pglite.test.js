/**
 * serverOwnedColumns.pglite.test.js — what an OWNER may change on their own settlement or
 * campaign row (GRANTS-1, ruling G1 §6(iii); migration 211 part D).
 *
 * THE HOLE IT CLOSES: the owner's UPDATE policy on settlements and saved_maps scopes the ROW
 * and pins no column. Before 211, an owner whose settlement a staff member had banned and
 * soft-deleted could clear both (171 says "no user policy grants them"), publish it again,
 * and feature, curate and count it as they liked. 211 part D adds a SECURITY INVOKER guard
 * that refuses anon and authenticated a change to the columns the server owns. The server's
 * own SECURITY DEFINER writers run as their owner and still write: one call each below.
 *
 * Every column of both tables is classed. A column with no class reds.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { bootHostedChain } from './hostedDefaultHarness.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget

// OWNER: the owner may write it (a page writes it, or nothing yet says the server owns it).
// SERVER: written only by the server's definer functions or the service-role edge functions.
const COLUMN_CLASSES = Object.freeze({
  settlements: Object.freeze({
    id: 'OWNER',
    user_id: 'OWNER',
    name: 'OWNER',
    tier: 'OWNER',
    data: 'OWNER',
    config: 'OWNER',
    toggles: 'OWNER',
    seed: 'OWNER',
    neighbour_links: 'OWNER',
    created_at: 'OWNER',
    updated_at: 'OWNER',
    ai_data: 'OWNER',
    is_public: 'OWNER',
    public_slug: 'OWNER',
    published_at: 'OWNER',
    view_count: 'SERVER',
    is_curated: 'SERVER',
    curated_order: 'SERVER',
    campaign_state: 'OWNER',
    version_history: 'OWNER',
    gallery_description: 'OWNER',
    gallery_image_url: 'OWNER',
    gallery_image_alt: 'OWNER',
    gallery_tags: 'OWNER',
    gallery_updated_at: 'OWNER',
    access_state: 'OWNER',
    inactive_reason: 'SERVER',
    inactive_since: 'SERVER',
    retention_expires_at: 'SERVER',
    reactivated_free_at: 'SERVER',
    gallery_share_narrated: 'OWNER',
    gallery_share_dm: 'OWNER',
    gallery_importable: 'OWNER',
    admin_deleted_at: 'SERVER',
    gallery_facet_culture: 'OWNER',
    gallery_facet_prosperity: 'OWNER',
    gallery_facet_deity: 'OWNER',
    gallery_facet_at_war: 'OWNER',
    gallery_realm_arc_summary: 'OWNER',
    gallery_member_overrides: 'OWNER',
    gallery_title: 'OWNER',
    gallery_facet_aliveness: 'OWNER',
    is_featured: 'SERVER',
    featured_order: 'SERVER',
    visibility: 'OWNER',
    unlisted_slug: 'OWNER',
    moderation_banned_at: 'SERVER',
    moderation_banned_by: 'SERVER',
    moderation_ban_reason: 'SERVER',
  }),
  saved_maps: Object.freeze({
    id: 'OWNER',
    user_id: 'OWNER',
    name: 'OWNER',
    map_seed: 'OWNER',
    map_data: 'OWNER',
    burg_settlement_map: 'OWNER',
    supply_chain_config: 'OWNER',
    created_at: 'OWNER',
    updated_at: 'OWNER',
    access_state: 'OWNER',
    inactive_reason: 'SERVER',
    inactive_since: 'SERVER',
    retention_expires_at: 'SERVER',
    is_public: 'OWNER',
    public_slug: 'OWNER',
    published_at: 'OWNER',
    view_count: 'SERVER',
    share_kind: 'OWNER',
    gallery_share_campaign: 'OWNER',
    gallery_description: 'OWNER',
    gallery_tags: 'OWNER',
    import_count: 'SERVER',
    gallery_importable: 'OWNER',
    gallery_image_url: 'OWNER',
    gallery_image_alt: 'OWNER',
    gallery_share_world: 'OWNER',
    gallery_world_sections: 'OWNER',
    gallery_world_snapshot: 'OWNER',
    gallery_realm_arc_summary: 'OWNER',
    gallery_facet_member_band: 'OWNER',
    gallery_facet_at_war: 'OWNER',
    gallery_facet_dominant_culture: 'OWNER',
    gallery_facet_tier_spread: 'OWNER',
    gallery_facet_aliveness: 'OWNER',
    gallery_facet_world_age: 'OWNER',
    is_featured: 'SERVER',
    featured_order: 'SERVER',
    visibility: 'OWNER',
    unlisted_slug: 'OWNER',
    moderation_banned_at: 'SERVER',
    moderation_banned_by: 'SERVER',
    moderation_ban_reason: 'SERVER',
    admin_deleted_at: 'SERVER',
  }),
});

const OWNER_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_ID = '22222222-2222-2222-2222-222222222222';
const ADMIN_ID = '33333333-3333-3333-3333-333333333333';
let db;
let cols;
const ids = {};

const asRole = async (role, uid, sql) => {
  try {
    await db.exec(`set request.jwt.claim.role = '${role}'; set test.uid = '${uid || ''}'; set role ${role};`);
    const r = await db.query(sql);
    return { ok: true, rows: r.rows };
  } catch (e) {
    return { ok: false, err: String(e?.message || e) };
  } finally {
    await db.exec(`reset role; reset request.jwt.claim.role; set test.uid = '';`);
  }
};

async function seedSettlement(extra = '') {
  const r = await db.query(`insert into public.settlements (user_id, name, tier, data) values ('${OWNER_ID}', 'probe', 'village', '{}') returning id`);
  if (extra) await db.exec(`update public.settlements set ${extra} where id = '${r.rows[0].id}'`);
  return r.rows[0].id;
}

beforeAll(async () => {
  ({ db } = await bootHostedChain());
  await db.exec(`insert into auth.users (id, email) values ('${OWNER_ID}', 'o@probe.test'), ('${OTHER_ID}', 'x@probe.test'), ('${ADMIN_ID}', 'a@probe.test');
    update public.profiles set tier = 'premium' where id in ('${OWNER_ID}', '${OTHER_ID}');
    update public.profiles set role = 'admin' where id = '${ADMIN_ID}';`);
  cols = {};
  for (const t of ['settlements', 'saved_maps']) {
    cols[t] = (await db.query(`select column_name, data_type from information_schema.columns
      where table_schema = 'public' and table_name = $1 order by ordinal_position`, [t])).rows;
  }
  ids.settlement = await seedSettlement();
  ids.map = (await db.query(`insert into public.saved_maps (user_id, name) values ('${OWNER_ID}', 'probe') returning id`)).rows[0].id;
}, PGLITE_BOOT_TIMEOUT_MS);

describe('every column of settlements and saved_maps is classed (a column with no class reds)', () => {
  for (const t of ['settlements', 'saved_maps']) {
    it(`${t}: each column has a class, and each class names a column`, () => {
      const live = cols[t].map((c) => c.column_name);
      expect(live.filter((n) => !(n in COLUMN_CLASSES[t]))).toEqual([]);
      expect(Object.keys(COLUMN_CLASSES[t]).filter((n) => !live.includes(n))).toEqual([]);
      expect(Object.values(COLUMN_CLASSES[t]).filter((v) => v === 'SERVER').length).toBeGreaterThan(10);
    });
  }
});

/** A value different from the current one. */
const changed = (c) => (c.data_type === 'boolean' ? `not coalesce(${c.column_name}, false)`
  : /integer|bigint|numeric/.test(c.data_type) ? `coalesce(${c.column_name}, 0) + 1`
  : /timestamp|date/.test(c.data_type) ? `coalesce(${c.column_name} + interval '1 day', now())`
  : c.data_type === 'uuid' ? `'${OWNER_ID}'::uuid` : `coalesce(${c.column_name}, '') || 'x'`);

describe('an owner cannot change a SERVER column of their own row (211 part D)', () => {
  for (const [t, key] of [['settlements', 'settlement'], ['saved_maps', 'map']]) {
    it(`${t}: every SERVER column is refused to its owner`, async () => {
      const passed = [];
      for (const c of cols[t].filter((x) => COLUMN_CLASSES[t][x.column_name] === 'SERVER')) {
        const r = await asRole('authenticated', OWNER_ID, `update public.${t} set ${c.column_name} = ${changed(c)} where id = '${ids[key]}' returning 1`);
        if (!(r.ok === false && /written by the server alone/.test(r.err))) passed.push(`${c.column_name}: ${r.ok ? 'changed' : r.err}`);
      }
      expect(passed).toEqual([]);
    });
    it(`${t}: a row an owner inserts cannot carry a SERVER value`, async () => {
      const sql = t === 'settlements'
        ? `insert into public.settlements (user_id, name, tier, data, is_featured) values ('${OWNER_ID}', 'x', 'village', '{}', true)`
        : `insert into public.saved_maps (user_id, name, is_featured) values ('${OWNER_ID}', 'x', true)`;
      const r = await asRole('authenticated', OWNER_ID, sql);
      expect(r.ok ? 'inserted' : r.err).toMatch(/written by the server alone/);
    });
  }
  it('an owner still changes an OWNER column (the name)', async () => {
    const r = await asRole('authenticated', OWNER_ID, `update public.settlements set name = 'renamed' where id = '${ids.settlement}' returning name`);
    expect(r).toMatchObject({ ok: true, rows: [{ name: 'renamed' }] });
  });
});

describe('a banned and soft-deleted settlement cannot be cleared and published by its owner', () => {
  it('the owner can neither clear the ban nor publish', async () => {
    const id = await seedSettlement(`moderation_banned_at = now(), moderation_banned_by = '${ADMIN_ID}', moderation_ban_reason = 'staff', admin_deleted_at = now()`);
    const clear = await asRole('authenticated', OWNER_ID, `update public.settlements set moderation_banned_at = null, moderation_banned_by = null, moderation_ban_reason = null, admin_deleted_at = null where id = '${id}'`);
    expect(clear.ok ? 'cleared' : clear.err).toMatch(/written by the server alone/);
    const publish = await asRole('authenticated', OWNER_ID, `update public.settlements set is_public = true where id = '${id}'`);
    expect(publish.ok ? 'published' : publish.err).toMatch(/moderation ban/);
    const [row] = (await db.query(`select is_public, moderation_banned_at is not null as banned, admin_deleted_at is not null as deleted from public.settlements where id = '${id}'`)).rows;
    expect(row).toEqual({ is_public: false, banned: true, deleted: true });
  });
});

describe("the server's own definer writers still write (one call each)", () => {
  it('bump_public_view (anon) counts a view of a public settlement', async () => {
    const id = await seedSettlement(`is_public = true, public_slug = 'probe-public'`);
    const r = await asRole('anon', null, `select public.bump_public_view('probe-public', 'viewer-token-1')`);
    expect(r.ok ? 'ok' : r.err).toBe('ok');
    const [row] = (await db.query(`select view_count from public.settlements where id = '${id}'`)).rows;
    expect(row.view_count).toBe(1);
  });
  it('bump_map_import (a signed-in non-owner) counts an import of a public, importable map', async () => {
    const id = (await db.query(`insert into public.saved_maps (user_id, name, is_public, public_slug, gallery_importable) values ('${OWNER_ID}', 'm', true, 'probe-map', true) returning id`)).rows[0].id;
    const r = await asRole('authenticated', OTHER_ID, `select public.bump_map_import('probe-map')`);
    expect(r.ok ? 'ok' : r.err).toBe('ok');
    const [row] = (await db.query(`select import_count from public.saved_maps where id = '${id}'`)).rows;
    expect(row.import_count).toBe(1);
  });
  it('admin_set_content_banned and admin_soft_delete_settlement (service_role) ban and delete', async () => {
    const id = await seedSettlement();
    const ban = await asRole('service_role', null, `select public.admin_set_content_banned('${ADMIN_ID}', 'settlement', '${id}', true, 'staff')`);
    expect(ban.ok ? 'ok' : ban.err).toBe('ok');
    const del = await asRole('service_role', null, `select public.admin_soft_delete_settlement('${ADMIN_ID}', '${id}', true, 'staff')`);
    expect(del.ok ? 'ok' : del.err).toBe('ok');
    const [row] = (await db.query(`select moderation_banned_at is not null as banned, admin_deleted_at is not null as deleted from public.settlements where id = '${id}'`)).rows;
    expect(row).toEqual({ banned: true, deleted: true });
  });
  it('handle_premium_downgrade (service_role) and reactivate_free_settlement (the owner) move the retention columns', async () => {
    const id = await seedSettlement();
    const down = await asRole('service_role', null, `select public.handle_premium_downgrade('${OWNER_ID}')`);
    expect(down.ok ? 'ok' : down.err).toBe('ok');
    const [mid] = (await db.query(`select access_state, retention_expires_at is not null as retained from public.settlements where id = '${id}'`)).rows;
    expect(mid).toEqual({ access_state: 'inactive_plan', retained: true });
    await db.exec(`update public.settlements set access_state = 'inactive_plan' where user_id = '${OWNER_ID}' and id <> '${id}'`);
    const up = await asRole('authenticated', OWNER_ID, `select public.reactivate_free_settlement('${id}') as r`);
    expect(up.ok ? up.rows[0].r.ok : up.err).toBe(true);
    const [after] = (await db.query(`select access_state, retention_expires_at, reactivated_free_at is not null as reactivated from public.settlements where id = '${id}'`)).rows;
    expect(after).toEqual({ access_state: 'active', retention_expires_at: null, reactivated: true });
  });
});
