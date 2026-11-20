/**
 * @vitest-environment jsdom
 *
 * galleryWorldShare.pglite.test.jsx — A SHARED MAP'S WORLD SENDS NO CHRONICLE, AND SHARING IT WORKS (the seventh chair's
 * VR40, part (1); VEIL-DOORS-3).
 *
 * MEASURED (VEIL-DOORS-2, executed on master's code too): the share editor turned every world section on by default, the
 * chronicle among them; the world's serialized chronicle holds crime-worded headlines naming member towns ("Thieves and
 * racketeers are working Vysokoino's streets in the open."), a sentence and a cause of a house those towns' shares hide
 * (VR28 tier 1); and migration 089's guard refuses any world snapshot holding a `chronicle` key, so publishing a campaign
 * map with its world FAILED ("World snapshot contains a forbidden private key and cannot be shared").
 *
 * THE ARM, through the client's own path on a chain of every migration on disk: a BORN campaign world (the app's Instant
 * World birth, composeInstantWorld, its pulse advanced), its members stored as the owner's towns and the campaign as the
 * owner's map; the share editor (src/components/gallery/MapShareEditor.jsx) rendered with that world, "Map and campaign"
 * picked, nothing else touched, "Share to gallery" clicked: its own buildShareOpts -> shareMap -> publishMapParams ->
 * supabase.rpc('publish_map') as the signed-in owner. The publish SUCCEEDS, the stored snapshot and its section list hold
 * no chronicle, the other four sections travel, the chronicle's control is shown off and not shareable yet, and the
 * gallery read serves no chronicle. Red at the base (97efb7fcf): the publish raises. THE GUARD IS NOT LOOSENED: a
 * snapshot that holds a chronicle is still refused by publish_map.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;

const OWNER = '11111111-1111-1111-1111-111111111111';
// THE CLIENT'S PATH: the editor's rpc runs the named function on this chain as the signed-in owner.
const ROUTE = vi.hoisted(() => ({ db: null, uid: null }));
vi.mock('../../src/lib/supabase.js', () => {
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!ROUTE.db) return { data: null, error: { message: 'no chain' } };
      try {
        await ROUTE.db.exec(`set role authenticated; set test.uid = '${ROUTE.uid}';`);
        const keys = Object.keys(args);
        const r = await ROUTE.db.query(`select public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as out`, keys.map((k) => args[k]));
        return { data: r.rows[0]?.out ?? null, error: null };
      } catch (e) { return { data: null, error: { message: String(e?.message || e) } }; } finally { await ROUTE.db.exec('reset role; reset test.uid;'); }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock('../../src/lib/mapThumb.js', () => ({ captureMapThumb: async () => null, captureCampaignThumb: async () => null }));
const STORE = vi.hoisted(() => ({ auth: { tier: 'premium', role: 'user', user: { id: '11111111-1111-1111-1111-111111111111' } }, updateSavedCampaign: () => {} }));
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(STORE); }
  useStore.getState = () => STORE;
  useStore.subscribe = () => () => {};
  return { useStore };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
// The doors' scaffold (tests/security/galleryDoors.pglite.test.js), with Supabase's default privileges.
const SCAFFOLD = `
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
      email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    grant usage on schema public to anon, authenticated, service_role;
    create schema if not exists extensions;
    create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$
      insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid,
      file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text,
      owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$
      select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`;

const MAP_ID = '0e000000-0000-4000-8000-000000000001';
const uuidOf = (i) => `0d000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`;

afterEach(() => { cleanup(); });

describe('VR40 (1): a shared map\'s world sends no chronicle, and sharing it works (VEIL-DOORS-3)', () => {
  /** @type {PGlite} */ let db;
  let world;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    await db.exec(SCAFFOLD);
    const failed = [];
    for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d{3}_.*\.sql$/.test(n)).sort()) {
      const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
      try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
    }
    expect(failed).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';`);
    // THE BORN WORLD: the app's Instant World birth, its pulse advanced three months
    const { composeInstantWorld, loadGenerationLawPayloads } = await import('../../src/lib/instantWorld/composeInstantWorld.js');
    const { advanceCampaignWorld } = await import('../../src/domain/worldPulse/advanceCampaignWorld.js');
    await loadGenerationLawPayloads();
    const born = composeInstantWorld({ seed: 'vr40-share-world', clock: () => '2026-11-20T00:00:00.000Z' });
    let campaign = born.campaign;
    let saves = born.settlements.map((s) => ({ id: s.id, name: s.name, phase: 'canon', settlement: s.settlement || s, campaignState: { phase: 'canon', eventLog: [], locks: {} } }));
    for (let m = 0; m < 3; m += 1) {
      const r = advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: `2027-01-0${m + 1}T00:00:00.000Z` });
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph, wizardNews: r.wizardNews };
      saves = saves.map((s) => { const u = r.settlementUpdates.find((x) => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
    }
    // the owner's member towns and the owner's map, stored as the app stores them
    for (const [i, s] of saves.entries()) {
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,access_state) values ($1,$2,$3,$4,$5::jsonb,'active')`,
        [uuidOf(i), OWNER, s.name || `Town ${i}`, s.settlement?.tier || 'town', JSON.stringify(s.settlement)]);
    }
    await db.query(`insert into public.saved_maps (id,user_id,name,map_data) values ($1,$2,'Realm',$3::jsonb)`,
      [MAP_ID, OWNER, JSON.stringify({ campaign: { settlementIds: saves.map((_, i) => uuidOf(i)) } })]);
    world = { worldState: campaign.worldState, regionalGraph: campaign.regionalGraph,
      members: saves.map((s) => ({ name: s.name, tier: s.settlement?.tier, settlement: s.settlement })) };
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the editor\'s defaults publish a campaign map: the publish succeeds, the stored snapshot and its sections hold no chronicle, the other sections travel, the chronicle\'s control is off and not shareable yet, and the gallery read serves no chronicle', async () => {
    const { serializeWorldSnapshotPublic } = await import('../../src/domain/display/worldSnapshotPublic.js');
    const full = serializeWorldSnapshotPublic(world.worldState, world.regionalGraph, world.members, { chronicle: true });
    const headlines = JSON.stringify(full.chronicle || []);
    expect(headlines.length, 'the born world has a chronicle to withhold (else this arm proves nothing)').toBeGreaterThan(20);

    const { default: MapShareEditor } = await import('../../src/components/gallery/MapShareEditor.jsx');
    Object.assign(ROUTE, { db, uid: OWNER });
    try {
      render(<MapShareEditor campaign={{ id: MAP_ID, name: 'Realm' }} worldState={world.worldState} regionalGraph={world.regionalGraph}
        members={world.members} ownerId={OWNER} />);
      fireEvent.click(screen.getByRole('radio', { name: /Map and campaign/i }));
      const box = screen.getByRole('checkbox', { name: 'Share Chronicle' });
      const control = { checked: box.checked, disabled: box.disabled, notYet: !!screen.queryByText(/Not shareable yet/) };
      fireEvent.click(screen.getByRole('button', { name: /Share to gallery/i }));
      // the publish ends either way: the row turns public, or the editor shows the server's refusal
      await waitFor(async () => {
        const r = (await db.query('select is_public from public.saved_maps where id = $1', [MAP_ID])).rows[0];
        expect(r.is_public || !!screen.queryByText(/World snapshot|cannot be shared|failed/i)).toBe(true);
      }, { timeout: 60_000 });
      expect(screen.queryByText(/World snapshot|cannot be shared|failed/i)?.textContent ?? null, 'the publish raised').toBe(null);
      expect(control, 'the chronicle\'s control').toEqual({ checked: false, disabled: true, notYet: true });
    } finally { ROUTE.db = null; }

    const row = (await db.query(`select public_slug, gallery_share_world, gallery_world_snapshot as snap, gallery_world_sections as sections
      from public.saved_maps where id = $1`, [MAP_ID])).rows[0];
    expect(row.gallery_share_world).toBe(true);
    expect(Object.keys(row.snap).sort(), 'the stored snapshot').toEqual(['dashboard', 'pantheon', 'schemaVersion', 'sourceWorldStateSchemaVersion', 'warNetwork', 'worldClock']);
    expect(row.sections, 'the stored section list').toEqual(['worldClock', 'pantheon', 'warNetwork', 'dashboard']);
    const m = (await db.query('select public.get_gallery_map($1) as m', [row.public_slug])).rows[0].m;
    expect({ snapshot: Object.keys(m.world.snapshot).sort(), sections: m.world.sections }, 'the gallery read').toEqual({
      snapshot: ['dashboard', 'pantheon', 'schemaVersion', 'sourceWorldStateSchemaVersion', 'warNetwork', 'worldClock'],
      sections: ['worldClock', 'pantheon', 'warNetwork', 'dashboard'] });
    expect(m.members.length, 'the members travel').toBe(world.members.length);
  }, ARM_TIMEOUT_MS);

  it('THE GUARD IS NOT LOOSENED: publish_map still refuses a world snapshot holding a chronicle', async () => {
    await db.exec(`set role authenticated; set test.uid = '${OWNER}';`);
    let message = null;
    try {
      await db.query(`select public.publish_map($1, p_kind => 'map_with_campaign', p_share_world => true, p_world_snapshot => $2::jsonb)`,
        [MAP_ID, JSON.stringify({ schemaVersion: 1, chronicle: [] })]);
    } catch (e) { message = String(e?.message || e); } finally { await db.exec('reset role; reset test.uid;'); }
    expect(message).toMatch(/forbidden private key/);
  }, ARM_TIMEOUT_MS);
});
