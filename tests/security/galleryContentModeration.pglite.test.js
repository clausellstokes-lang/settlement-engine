/**
 * galleryContentModeration.pglite.test.js — applies the REAL 171 migration into
 * pglite and exercises the staff content-moderation contract:
 *   - admin_soft_delete_map / admin_remove_gallery_map / admin_set_content_banned
 *     are HIGHEST-role gated (a non-staff actor is rejected).
 *   - THE BAN CHOKEPOINT: a banned settlement/map cannot be re-published
 *     (is_public=true) NOR given an unlisted_slug — the trigger refuses it; unban
 *     restores the ability. This is the lifecycle-path guard (publish/re-publish/
 *     unlisted all flow through the row write).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_171 = resolve(dir, '171_gallery_content_moderation.sql');

const ADMIN = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const USER = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const S1 = '11111111-1111-1111-1111-111111111111'; // settlement
const M1 = '22222222-2222-2222-2222-222222222222'; // map

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
    end $do$;
    create table public.profiles (id uuid primary key, role text default 'user');
    create table public.settlements (
      id uuid primary key, user_id uuid, is_public boolean default false,
      is_featured boolean default false, is_curated boolean default false,
      featured_order int, curated_order int, unlisted_slug text, visibility text default 'public'
    );
    create table public.saved_maps (
      id uuid primary key, user_id uuid, is_public boolean default false,
      is_featured boolean default false, featured_order int,
      unlisted_slug text, visibility text default 'public'
    );
    create table public.audit_log (
      id serial primary key, action text, target_type text, target_id text, actor_id uuid,
      before_state jsonb, after_state jsonb, was_destructive boolean, was_reversible boolean,
      user_notified boolean, reason text, created_at timestamptz default now()
    );
    create function public.has_role(p_actor uuid, p_roles text[]) returns boolean
      language sql stable as $$ select exists(select 1 from public.profiles where id = p_actor and role = any(p_roles)) $$;
    create function public.write_audit(
      p_action text, p_target_user_id uuid, p_target_type text, p_target_id text, p_reason text,
      p_before jsonb, p_after jsonb, p_was_destructive boolean, p_was_reversible boolean,
      p_user_notified boolean, p_actor_id uuid
    ) returns void language sql as $$
      insert into public.audit_log(action, target_type, target_id, actor_id, before_state, after_state,
        was_destructive, was_reversible, user_notified, reason)
      values (p_action, p_target_type, p_target_id, p_actor_id, p_before, p_after,
        p_was_destructive, p_was_reversible, p_user_notified, p_reason)
    $$;
    insert into public.profiles(id, role) values ('${ADMIN}', 'admin'), ('${USER}', 'user');
    insert into public.settlements(id, user_id, is_public) values ('${S1}', '${USER}', true);
    insert into public.saved_maps(id, user_id, is_public) values ('${M1}', '${USER}', true);
  `);
  await db.exec(readFileSync(MIG_171, 'utf-8'));
  return db;
}

let db;
beforeEach(async () => { db = await makeDb(); }, PGLITE_BOOT_TIMEOUT_MS);

describe('role gate — HIGHEST only', () => {
  it('a non-staff actor cannot ban content', async () => {
    await expect(db.query(`select public.admin_set_content_banned('${USER}', 'settlement', '${S1}', true, 'x')`))
      .rejects.toThrow(/not authorized/i);
  });
  it('a non-staff actor cannot soft-delete a map', async () => {
    await expect(db.query(`select public.admin_soft_delete_map('${USER}', '${M1}', true, 'x')`))
      .rejects.toThrow(/not authorized/i);
  });
});

describe('THE BAN CHOKEPOINT — a banned item cannot become public again', () => {
  it('banning a settlement unpublishes it, and re-publish + unlisted are refused until unban', async () => {
    await db.query(`select public.admin_set_content_banned('${ADMIN}', 'settlement', '${S1}', true, 'abuse')`);
    const row = (await db.query(`select is_public, moderation_banned_at is not null as banned from public.settlements where id = '${S1}'`)).rows[0];
    expect(row.is_public).toBe(false);
    expect(row.banned).toBe(true);

    // Re-publish is blocked by the trigger.
    await expect(db.query(`update public.settlements set is_public = true where id = '${S1}'`))
      .rejects.toThrow(/moderation ban/i);
    // The unlisted-slug channel is blocked too.
    await expect(db.query(`update public.settlements set unlisted_slug = 'sneaky' where id = '${S1}'`))
      .rejects.toThrow(/moderation ban/i);

    // Unban clears the flag; re-publish now succeeds.
    await db.query(`select public.admin_set_content_banned('${ADMIN}', 'settlement', '${S1}', false, null)`);
    await db.query(`update public.settlements set is_public = true where id = '${S1}'`);
    const after = (await db.query(`select is_public from public.settlements where id = '${S1}'`)).rows[0];
    expect(after.is_public).toBe(true);
  });

  it('banning a map blocks its re-publish + unlisted the same way', async () => {
    await db.query(`select public.admin_set_content_banned('${ADMIN}', 'map', '${M1}', true, 'abuse')`);
    await expect(db.query(`update public.saved_maps set is_public = true where id = '${M1}'`))
      .rejects.toThrow(/moderation ban/i);
    await expect(db.query(`update public.saved_maps set unlisted_slug = 'sneaky' where id = '${M1}'`))
      .rejects.toThrow(/moderation ban/i);
  });

  it('a NON-banned item publishes normally (the trigger only bites banned rows)', async () => {
    // S1 starts public; toggling it is unaffected while unbanned.
    await db.query(`update public.settlements set is_public = false where id = '${S1}'`);
    await db.query(`update public.settlements set is_public = true where id = '${S1}'`);
    const row = (await db.query(`select is_public from public.settlements where id = '${S1}'`)).rows[0];
    expect(row.is_public).toBe(true);
  });
});

describe('map soft-delete + set-private (staff)', () => {
  it('admin_soft_delete_map unpublishes + flags, restore clears the flag', async () => {
    const del = (await db.query(`select public.admin_soft_delete_map('${ADMIN}', '${M1}', true, 'x') as r`)).rows[0].r;
    expect(del.deleted).toBe(true);
    const banned = (await db.query(`select admin_deleted_at is not null as d, is_public from public.saved_maps where id = '${M1}'`)).rows[0];
    expect(banned.d).toBe(true);
    expect(banned.is_public).toBe(false);
    await db.query(`select public.admin_soft_delete_map('${ADMIN}', '${M1}', false, null)`);
    const restored = (await db.query(`select admin_deleted_at is null as cleared from public.saved_maps where id = '${M1}'`)).rows[0];
    expect(restored.cleared).toBe(true);
  });

  it('admin_remove_gallery_map sets the map private (is_public=false) and audits', async () => {
    await db.query(`select public.admin_remove_gallery_map('${ADMIN}', '${M1}', 'moderation')`);
    const row = (await db.query(`select is_public from public.saved_maps where id = '${M1}'`)).rows[0];
    expect(row.is_public).toBe(false);
    const audit = (await db.query(`select count(*)::int n from public.audit_log where action = 'remove_gallery_map'`)).rows[0].n;
    expect(audit).toBe(1);
  });
});
