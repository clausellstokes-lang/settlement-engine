// VEIL-14, the chair's question (3): does the old keeping stand on origin/master's twin and page, over master's own
// chain (001..203) and over the line's chain through 210? Reveal DM on, every person switched off by hand (092/093).
import { it, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const H = vi.hoisted(() => ({ db: null, last: null }));
vi.mock('../../src/lib/supabase.js', () => {
  const supabase = { rpc: async (name, args = {}) => {
    if (name !== 'get_gallery_dossier') return { data: null, error: { message: `not served: ${name}` } };
    try { await H.db.exec("set test.uid = '';"); const r = await H.db.query('select * from public.get_gallery_dossier($1)', [args.dossier_slug]); H.last = r.rows; return { data: r.rows, error: null }; }
    catch (e) { return { data: null, error: { message: String(e.message) } }; } },
  from: () => ({ update: () => ({ eq: async () => ({ error: null }) }), select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }) };
  return { supabase, isConfigured: true, default: supabase };
});
const OWNER = '11111111-1111-1111-1111-111111111111';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
async function buildDb(dir) {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(`create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz, email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if; end $do$;
    create schema if not exists extensions; create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$ insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid, file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$ select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`);
  const failed = [];
  for (const f of readdirSync(dir).filter((x) => /^\d{3}_.*\.sql$/.test(x)).sort()) {
    try { await db.exec(readFileSync(join(dir, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1')); } catch (e) { failed.push(`${f}: ${String(e.message).slice(0, 100)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing; insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}';
    create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  return { db, failed, head: readdirSync(dir).filter((x) => /^\d{3}_/.test(x)).sort().at(-1) };
}
const told = (doc) => {
  const out = []; if (!isRec(doc) || !Array.isArray(doc.relationships)) return out;
  const cards = new Map((doc.npcs || []).filter((c) => isRec(c) && typeof c.id === 'string').map((c) => [c.id, c]));
  for (const t of doc.relationships.filter(isRec)) for (const [k, e] of [['npc1Role', t.from ?? t.npc1Id], ['npc2Role', t.to ?? t.npc2Id]]) {
    const c = cards.get(String(e)); if (typeof t[k] === 'string' && !(isRec(c) && typeof c.role === 'string')) out.push(`${k}=${t[k]}`);
  }
  return out;
};
it('master: the old keeping, by chain', async () => {
  const { generateSettlementPipeline: gen } = await import('../../src/generators/generateSettlementPipeline.js');
  const { galleryMemberKey } = await import('../../src/domain/display/publicSafe.js');
  const gallery = await import('../../src/lib/gallery.js');
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const TOWNS = [['server-veil-village-3', 'village'], ['server-veil-village-0', 'village'], ['server-veil-town-2', 'town'], ['server-veil-town-0', 'town'],
    ['server-veil-city-2', 'city'], ['server-veil-metropolis-3', 'metropolis'], ['server-veil-metropolis-7', 'metropolis']];
  const records = TOWNS.map(([seed, settType]) => [seed, gen({ ...BROWSER, settType }, null, { seed, customContent: {} })]);
  const veiled = ['ROLEMARK İß ✦', 'ΡΟΛΟΣ'].map((role, i) => ({ id: `v${i}`, name: `Veiled ${i}`, role, institution: { kind: 'house', key: 'rookery' } }));
  records.push(['PLANT (the line\'s stored shape: a house record)', { name: 'Plant', npcs: [...veiled, { id: 'p2', name: 'Other', role: 'the smith' }],
    relationships: veiled.map((v, i) => ({ id: `t${i}`, from: v.id, to: 'p2', npc1Role: v.role, npc2Role: 'the smith' })) }]);
  const result = { chains: {} };
  for (const [label, dir] of [['master 001..203', join(process.cwd(), 'supabase', 'migrations')], ['the line 001..210', '/var/tmp/v14/mig210']]) {
    const B = await buildDb(dir); H.db = B.db;
    const rows = []; let n = 0;
    for (const [seed, rec] of records) {
      n += 1; const id = `aaaaaaaa-0000-0000-0000-${String(n).padStart(12, '0')}`;
      const houseFaces = (rec.npcs || []).filter((p) => isRec(p?.institution) && ['house', 'power'].includes(p.institution.kind)).length;
      const ov = Object.fromEntries((rec.npcs || []).filter(isRec).map((p) => [galleryMemberKey(p), { revealDm: false }]));
      await B.db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, gallery_member_overrides, gallery_share_dm)
        values ($1, $2, $3, 'town', $4, true, $5, now(), $6, true)`, [id, OWNER, String(rec.name || seed), JSON.stringify(rec), `m${n}`, JSON.stringify(ov)]);
      const page = await gallery.fetchPublicDossier(`m${n}`);
      const resp = H.last?.[0]?.data;
      rows.push({ seed, houseFaces, people: (rec.npcs || []).length, responseTells: told(resp).length, pageTells: told(page?.settlement).length, ex: told(page?.settlement).slice(0, 2), respEx: told(resp).slice(0, 2) });
    }
    result.chains[label] = { head: B.head, failed: B.failed.slice(0, 3), rows };
  }
  writeFileSync('/var/tmp/v14/out/master-roles.json', JSON.stringify(result, null, 1));
  console.log('V14MASTER ' + JSON.stringify(result));
}, 3_600_000);
