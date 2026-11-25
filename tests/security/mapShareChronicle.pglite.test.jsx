// @vitest-environment jsdom
/**
 * mapShareChronicle.pglite.test.jsx — SNAP-CHRONICLE (VEIL-52, the chair's V13, 2026-11-25): a shared map's
 * world carries no `chronicle`, so the share editor's DEFAULT publishes.
 *
 * THE DEFECT IT HOLDS SHUT: the net-current server scanner public._gallery_world_snapshot_is_safe refuses any key
 * matching `.*chronicle.*` at any depth (since 089). The share editor offered a `chronicle` section, ticked by
 * default, and serialized it as a top-level `chronicle` key, so publishing a campaign map at the editor's default was
 * refused with "World snapshot contains a forbidden private key and cannot be shared". The cure is CLIENT ONLY: the
 * editor stops offering and serializing the section; the server's pattern is untouched and nothing new is let through.
 *
 * THE DRIVE: the client's OWN publish path, end to end. MapShareEditor is rendered for an owned, cloud-synced campaign
 * that HAS a chronicle (an auto-applied pulse outcome), at its DEFAULT sections (no stored selection), and its own
 * "Share to gallery" control is clicked: buildShareOpts -> serializeWorldSnapshotPublic -> lib/gallery.js :: shareMap
 * -> publishMapParams -> supabase.rpc('publish_map'), the rpc routed into pglite running the NET-CURRENT publish_map
 * and _gallery_world_snapshot_is_safe (latest-wins across supabase/migrations, the galleryMapMemberCount loader).
 * A second arm drives a share SAVED EARLIER with `chronicle` in its stored selection: it must publish too.
 * GREEN: published; the stored row's world snapshot and the anon-served get_gallery_map world hold no chronicle key
 * at any depth, while the world the editor still offers (worldClock) is stored and served.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, fireEvent, waitFor, cleanup, screen } from '@testing-library/react';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all migrations (file order). */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  // ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form also matches header prose quoting the statement.
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'igm');
  let last = null;
  for (const f of files) {
    const matches = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8').match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const OWNER = '11111111-1111-1111-1111-111111111111';
const CAMPAIGN_FRESH = '33333333-3333-4333-8333-333333333333';
const CAMPAIGN_SAVED = '44444444-4444-4444-8444-444444444444';
const PORT = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

// publish_map's parameters by name, with the SQL type each binds as (089's 12-arg signature).
const PUBLISH_PARAM_TYPES = {
  target_id: 'uuid', p_kind: 'text', p_description: 'text', p_tags: 'text[]', p_importable: 'boolean',
  p_image_url: 'text', p_image_alt: 'text', p_share_world: 'boolean', p_world_sections: 'jsonb',
  p_world_snapshot: 'jsonb', p_realm_arc_summary: 'text', p_facets: 'jsonb',
};

const env = vi.hoisted(() => ({ db: null, calls: [] }));

vi.mock('../../src/lib/supabase.js', () => {
  const supabase = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }),
    rpc: async (name, args) => {
      if (name !== 'publish_map') return { data: null, error: { message: `unrouted rpc ${name}` } };
      const names = Object.keys(args);
      const values = [];
      const binds = names.map((key) => {
        const type = PUBLISH_PARAM_TYPES[key];
        if (!type) throw new Error(`publish_map has no parameter ${key}`);
        const raw = args[key];
        if (type === 'jsonb') { values.push(raw == null ? null : JSON.stringify(raw)); return `${key} => $${values.length}::jsonb`; }
        if (type === 'text[]') {
          values.push(raw == null ? null : JSON.stringify(raw));
          return `${key} => (select array_agg(t.x) from jsonb_array_elements_text($${values.length}::jsonb) as t(x))`;
        }
        values.push(raw == null ? null : raw);
        return `${key} => $${values.length}::${type}`;
      });
      const call = { args, error: null, data: null };
      env.calls.push(call);
      try {
        call.data = (await env.db.query(`select public.publish_map(${binds.join(', ')}) as slug`, values)).rows[0].slug;
        return { data: call.data, error: null };
      } catch (e) {
        call.error = e.message;
        return { data: null, error: { message: e.message } };
      }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock('../../src/lib/mapThumb.js', () => ({
  captureMapThumb: vi.fn().mockResolvedValue(null),
  captureCampaignThumb: vi.fn().mockResolvedValue(null),
}));
const storeState = { auth: { tier: 'premium', role: 'user', user: { id: OWNER } }, updateSavedCampaign: vi.fn() };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore, default: useStore };
});

const { default: MapShareEditor } = await import('../../src/components/gallery/MapShareEditor.jsx');

afterEach(() => { cleanup(); });

// A campaign that HAS a chronicle: one auto-applied pulse outcome (the surfaced kind the public chronicle keeps).
const WORLD_STATE = {
  schemaVersion: 3,
  tick: 4,
  calendar: { elapsedMonths: 4, month: 5, year: 1, season: 'summer' },
  pulseHistory: [{
    tick: 3,
    selectedOutcomes: [{ id: 'o-1', applyMode: 'auto', headline: 'Port raises its harbour walls', summary: 'The harbour wall rises.', settlementIds: [PORT] }],
    impactDigest: [],
  }],
};
const MEMBERS = [{ name: 'Port', tier: 'town', settlement: { id: PORT, name: 'Port', tier: 'town' } }];

/** Every object key at any depth of a JSON value. */
function keysDeep(value, out = []) {
  if (Array.isArray(value)) { for (const v of value) keysDeep(v, out); return out; }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { out.push(k); keysDeep(v, out); }
  }
  return out;
}
const chronicleKeys = (value) => keysDeep(value).filter((k) => /chronicle/i.test(k));

async function publishThroughEditor(campaignId, galleryWorldSections) {
  const before = env.calls.length;
  render(
    <MapShareEditor
      campaign={{ id: campaignId, name: 'Coastal Realm', isPublic: false, shareKind: 'map_with_campaign' }}
      worldState={WORLD_STATE}
      regionalGraph={{ channels: [] }}
      members={MEMBERS}
      bridge={null}
      ownerId={OWNER}
      galleryWorldSections={galleryWorldSections}
    />,
  );
  // The editor's own control, at its own defaults (details open on a private campaign).
  fireEvent.click(screen.getByRole('button', { name: /Share to gallery/i }));
  await waitFor(() => expect(env.calls.length).toBe(before + 1));
  await waitFor(() => expect(screen.queryByText(/Publishing…/)).toBeNull());
  return env.calls[before];
}

async function storedAndServed(campaignId, slug) {
  const stored = (await env.db.query('select gallery_world_snapshot as s, gallery_share_world as w from public.saved_maps where id = $1', [campaignId])).rows[0];
  const served = (await env.db.query('select public.get_gallery_map($1) as out', [slug])).rows[0].out;
  return { stored, served };
}

describe('SNAP-CHRONICLE: a campaign map shared at the editor default publishes, with no chronicle (pglite, net-current)', () => {
  beforeAll(async () => {
    const db = new PGlite();
    env.db = db;
    await db.exec('create schema if not exists public;');
    await db.exec(`
      create table public.settlements (
        id uuid primary key, user_id uuid not null, name text, tier text,
        data jsonb default '{}'::jsonb, campaign_state jsonb default '{}'::jsonb, access_state text default 'active',
        is_public boolean default false, public_slug text,
        gallery_share_narrated boolean not null default false,
        gallery_member_overrides jsonb not null default '{}'::jsonb,
        ai_data jsonb default '{}'::jsonb
      );
      create table public.saved_maps (
        id uuid primary key default gen_random_uuid(), user_id uuid not null, name text,
        share_kind text default 'map', gallery_share_campaign boolean default false,
        gallery_description text, gallery_tags text[], map_data jsonb default '{}'::jsonb,
        is_public boolean default false, public_slug text, published_at timestamptz default now(),
        view_count int default 0, import_count int default 0, gallery_importable boolean default false,
        gallery_image_url text, gallery_image_alt text, gallery_share_world boolean default false,
        gallery_world_sections jsonb default '[]'::jsonb, gallery_world_snapshot jsonb,
        gallery_realm_arc_summary text, gallery_facet_member_band text, gallery_facet_at_war boolean,
        gallery_facet_dominant_culture text, gallery_facet_tier_spread text,
        gallery_facet_aliveness integer, gallery_facet_world_age text
      );
      create table public.profiles (id uuid primary key, external_name text);
      insert into public.profiles (id, external_name) values ('${OWNER}', 'QuietCartographer418');
      create or replace function public._gallery_sanitize_public_json(p jsonb)
        returns jsonb language sql immutable as $$ select coalesce(p, '{}'::jsonb) $$;
      create or replace function public._gallery_chronicle_json(p jsonb)
        returns jsonb language sql immutable as $$ select coalesce(p, '[]'::jsonb) $$;
      create or replace function public.account_is_active(p uuid)
        returns boolean language sql immutable as $$ select true $$;
      create or replace function public._make_public_slug()
        returns text language sql volatile as $$ select 'slug-' || gen_random_uuid()::text $$;
      create schema if not exists auth;
      create or replace function auth.uid()
        returns uuid language sql stable as $$ select '${OWNER}'::uuid $$;
    `);
    // The member path of get_gallery_map runs 211's _gallery_veil* helpers (and 212's key): load them net-current.
    const veilHelpers = [...new Set(readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f))
      .flatMap((f) => [...readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8')
        .matchAll(/^create\s+or\s+replace\s+function\s+public\.(_gallery_veil\w*)\s*\(/gim)].map((m) => m[1])))];
    await db.exec(netCurrentFn('_gallery_npc_key'));
    for (const fn of veilHelpers) await db.exec(netCurrentFn(fn));
    for (const fn of ['_gallery_map_backdrop', '_gallery_world_snapshot_is_safe', 'get_gallery_map', 'publish_map']) {
      const body = netCurrentFn(fn);
      if (!body) throw new Error(`no net-current ${fn} in supabase/migrations`);
      await db.exec(body);
    }
    const mapData = JSON.stringify({ campaign: { settlementIds: [PORT], mapState: { seed: 42 } } });
    await db.query(`insert into public.settlements (id, user_id, name, tier) values ($1, $2, 'Port', 'town')`, [PORT, OWNER]);
    await db.query(
      `insert into public.saved_maps (id, user_id, name, map_data, share_kind) values
         ($1, $3, 'Coastal Realm', $4::jsonb, 'map_with_campaign'),
         ($2, $3, 'Coastal Realm Again', $4::jsonb, 'map_with_campaign')`,
      [CAMPAIGN_FRESH, CAMPAIGN_SAVED, OWNER, mapData],
    );
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the fixture campaign HAS a chronicle the serializer would emit when asked (the precondition)', () => {
    const asked = serializeWorldSnapshotPublic(WORLD_STATE, {}, MEMBERS, { chronicle: true });
    expect(asked.chronicle.length).toBe(1);
    expect(asked.chronicle[0].headlines[0].headline).toBe('Port raises its harbour walls');
  });

  it('the editor DEFAULT sections publish (no refusal), and neither the stored nor the served world holds a chronicle key', async () => {
    const call = await publishThroughEditor(CAMPAIGN_FRESH, null);
    expect(call.args.p_kind).toBe('map_with_campaign');
    expect(call.args.p_share_world).toBe(true);
    expect(call.error, 'publish_map refused the editor default').toBeNull();
    expect(call.data).toMatch(/^slug-/);
    await waitFor(() => expect(screen.getByText('Public')).toBeTruthy());

    const { stored, served } = await storedAndServed(CAMPAIGN_FRESH, call.data);
    expect(stored.w).toBe(true);
    // The anchor: the world the editor still offers IS stored and served (so the empty lists below measure removal).
    expect(Object.keys(stored.s)).toEqual(expect.arrayContaining(['schemaVersion', 'worldClock']));
    expect(served.world.snapshot.worldClock).toEqual(stored.s.worldClock);
    expect(chronicleKeys(stored.s)).toEqual([]);
    expect(chronicleKeys(served.world)).toEqual([]);
    expect(chronicleKeys(call.args.p_world_snapshot)).toEqual([]);
    expect((call.args.p_world_sections || []).filter((k) => /chronicle/i.test(k))).toEqual([]);
  });

  it('a share SAVED EARLIER with chronicle ticked publishes too (the stored selection cannot bring it back)', async () => {
    const call = await publishThroughEditor(CAMPAIGN_SAVED, ['worldClock', 'chronicle']);
    expect(call.error, 'publish_map refused a stored selection naming chronicle').toBeNull();
    expect(call.args.p_world_sections).toEqual(['worldClock']);
    const { stored, served } = await storedAndServed(CAMPAIGN_SAVED, call.data);
    expect(Object.keys(stored.s).sort()).toEqual(['schemaVersion', 'sourceWorldStateSchemaVersion', 'worldClock']);
    expect(chronicleKeys(stored.s)).toEqual([]);
    expect(chronicleKeys(served.world)).toEqual([]);
  });
});
