/**
 * galleryVeilHandRows.pglite.test.js — THE VEIL'S DESIGN, HELD ON ROWS WRITTEN BY HAND (COHERENCE-VEIL-10; the
 * security read REVIEW-VEIL-212-FINAL-2026-11-13.md, V7-1 to V7-10; the chair's design of 2026-11-14, record 420).
 *
 * WHY ROWS BY HAND. Every finding of that read but two came from a row the generator never bears: custom content, a
 * house edited after its birth, a name in another script. gallerySecondHomes.pglite.test.js holds the born towns
 * (markers planted during the birth); this file holds what a sharer can STORE. Each arm stores its town three times
 * on a chain of every migration on disk (no veil record; the veil; the veil with Reveal DM), reads each by the
 * gallery read, the party link and the import, and runs THE CLIENT'S TWIN over the same stored row as a read of its
 * own (galleryPayloadFor, then projectShareVeil). A check is one of: a needle that MUST NOT ARRIVE in any key or
 * string, as written, lower-cased, or squeezed (lower case, every character that is not a letter or a digit of any
 * script removed); a string that MUST STILL ARRIVE; a path's value; a list's length; no record without a name.
 *
 * THE ARMS (one per cure, each red first at the commit before it):
 *   V7-3  a house hidden whole is removed whole BY ITS ID ALONE: the set is decided before the eyes trim anything
 *         (the `function` eye strips the tags, facets and service keys that put a house in the class) and is not
 *         tested again.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;

vi.mock('../../src/lib/supabase.js', () => {
  const supabase = { rpc: async () => ({ data: null, error: null }) };
  return { supabase, isConfigured: true, default: supabase };
});

const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
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

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
/** Lower case, every character that is not a letter or a digit of ANY script removed. */
const squeeze = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
/** Every KEY and every string VALUE of a document, with its path. */
function leaves(v, path = '$', acc = []) {
  if (typeof v === 'string') acc.push({ path, text: v, kind: 'value' });
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) { acc.push({ path: `${path}.${k}`, text: k, kind: 'KEY' }); leaves(x, `${path}.${k}`, acc); }
  return acc;
}
/** Where a needle arrives: as written, lower-cased, or squeezed. `unless`: a hit whose own text matches is not one. */
function arrivals(doc, needle, { at = null, notAt = null, unless = [] } = {}) {
  return leaves(doc).filter(({ path, text }) => (!at || at.test(path)) && !(notAt && notAt.test(path))
    && (text.includes(needle) || text.toLowerCase().includes(needle.toLowerCase()) || (squeeze(needle) !== '' && squeeze(text).includes(squeeze(needle))))
    && !unless.some(u => u.test(text))).map(({ path, text, kind }) => `${kind} ${path} = ${JSON.stringify(text.slice(0, 70))}`);
}
const valuesOf = (doc) => leaves(doc).filter(l => l.kind === 'value');

describe('COHERENCE-VEIL-10: the veil\'s design on rows written by hand (REVIEW-VEIL-7, V7-1 to V7-10)', () => {
  /** @type {PGlite} */ let db;
  let veil;
  let seq = 0;

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    await db.exec(SCAFFOLD);
    const failed = [];
    for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d{3}_.*\.sql$/.test(n)).sort()) {
      const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
      try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
    }
    expect(failed).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
  }, PGLITE_BOOT_TIMEOUT_MS);

  /**
   * Store one hand-written town three times and read each: {base|veil|dm: {gallery, link, import, client}}.
   * `base` is the share with no veil record (the link still takes the default veil; the twin leaves it unprojected).
   */
  async function sharesOf(town, deltas) {
    seq += 1;
    const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas } };
    const out = {};
    for (const [share, overrides, dm] of [['base', {}, false], ['veil', ov, false], ['dm', ov, true]]) {
      const slug = `hand${seq}-${share}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values (gen_random_uuid(), $1, $2, 'town', $3::jsonb, true, $4, now(), $5, 'unlisted', $6::jsonb, $7, true)`,
      [OWNER, town.name, JSON.stringify(town), slug, `${slug}-l`, JSON.stringify(overrides), dm]);
      await db.exec(`set test.uid = '';`);
      const gallery = (await db.query(`select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g`, [slug])).rows[0]?.d;
      const link = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' as d`, [`${slug}-l`])).rows[0]?.d;
      await db.exec(`set test.uid = '${READER}';`);
      const imported = (await db.query(`select to_jsonb(g.data) as d from public.import_gallery_dossier($1) g`, [slug])).rows[0]?.d;
      await db.exec(`set test.uid = '';`);
      const client = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(JSON.stringify(town)), { shareDm: dm, memberOverrides: overrides }), overrides);
      out[share] = { gallery, link, import: imported, client };
    }
    return out;
  }
  /** Each (share, read) of a result, by default the two veiled shares and the four reads. */
  const each = (r, shares = ['veil', 'dm'], reads = ['gallery', 'link', 'import', 'client']) =>
    shares.flatMap(s => reads.map(k => ({ tag: `${s}/${k}`, doc: r[s][k] })));
  const cardAddress = (card) => `card:institution:${veil.CARD_KINDS.institution.idOf(card)}`;

  it('V7-3: a house hidden whole is removed whole by its id alone: in the class by a declared facet, by a subterranean facet, or as an illegal brokerage alone, with the function eye shut', async () => {
    const hidden = [
      { name: 'Sunken chapel of the Tide', category: 'Religious', tags: ['facet:clandestine:clandestine'], desc: 'A chapel under the quay.' },
      { name: 'Cellar court', category: 'Civic', facets: { subterranean: 'subterranean' }, desc: 'A court below the street.' },
      { name: 'Whisper exchange', category: 'Economy', tags: ['brokerage', 'criminal'], serviceKeys: ['info_query'], desc: 'Answers, for a price.' },
      { id: 'inst-lodge', name: 'Lantern lodge', category: 'Civic', facets: { institutionFunction: 'clandestine' }, desc: 'A lodge that meets at night.' },
      { name: 'Cutpurse hall', category: 'Criminal', desc: 'Where purses go.' },
      // two records under ONE id, the second outside the class: the id is hidden whole, so both go (by the id alone)
      { id: 'inst-night', name: 'Night office', category: 'Criminal', desc: 'A desk nobody admits to.' },
      { id: 'inst-night', name: 'Night office', category: 'Civic', desc: 'The same door by day.' },
    ];
    const town = { name: 'Tidewick', tier: 'town',
      institutions: [...hidden, { name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [{ id: 'npc.una', name: 'Una Farrow', role: 'Factor' }] };
    const deltas = [...new Set(hidden.map(cardAddress))].map(address => ({ address, hidden: true }));
    const r = await sharesOf(town, deltas);
    const bad = [];
    // the unmarked link takes the default veil, which hides every house of the class whole
    for (const { tag, doc } of [...each(r), ...each(r, ['base'], ['link'])]) {
      expect(isRec(doc), tag).toBe(true);
      const listed = (doc.institutions || []).map(i => (isRec(i) ? i.name : i));
      if (JSON.stringify(listed) !== JSON.stringify(['Corn exchange'])) bad.push(`${tag}: institutions[] lists ${JSON.stringify(doc.institutions).slice(0, 200)}`);
      for (const h of hidden) bad.push(...arrivals(doc, h.name).map(a => `${tag}: ${a}`));
      if (!valuesOf(doc).some(l => l.text === 'Corn exchange')) bad.push(`${tag}: the open house is gone`);
    }
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
