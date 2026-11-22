/**
 * galleryViewDedup.pglite.test.js — EXECUTION test for migration 029's
 * de-duplicated public view counter `bump_public_view` (the gallery view-dedup
 * the dossier flagged as never having a dedicated test — R9(a)).
 *
 * Migration 029 replaced the naive migration-008 `view_count++` on every read
 * with a per-(dossier, viewer, UTC day) dedup ledger + bot-skip. This proves the
 * function BEHAVES:
 *   • a genuinely new viewer/day counts exactly once (repeat within the day is a
 *     no-op — the anti-refresh-inflation contract);
 *   • distinct viewer identities (signed-in uid / anon token / UA hash) each count
 *     once and dedup independently;
 *   • obvious bots/crawlers are skipped;
 *   • a non-public (or unknown) slug is a quiet no-op.
 *
 * Scaffold: a minimal `public.settlements` (the FK target + counter), the Supabase
 * `auth.uid()` shim (reads a `test.uid` GUC) and the platform roles the 029
 * GRANT/REVOKE DDL references, then migration 029 verbatim.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIGRATION = resolve(process.cwd(), 'supabase', 'migrations', '029_gallery_view_dedup.sql');
const migExists = existsSync(MIGRATION);

/** @type {any} */
let db;

// Anti-vacuity ([tests-3]/[test-quality-2]): if migration 029 is renamed/renumbered
// (the master-merge reconciliation risk), the execution suite below would silently
// skip and vitest would stay green. This UNCONDITIONAL assert fails loudly instead.
describe('gallery-view-dedup migration fixture exists (guards against silent vacuous skip)', () => {
  it('029_gallery_view_dedup.sql is present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIGRATION), `migration 029 missing: ${MIGRATION}`).toBe(true);
    expect(migExists).toBe(true);
  });
});

describe.runIf(migExists)('bump_public_view — dedup + bot-skip (pglite, migration 029)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Supabase-managed objects 029's DDL references: auth.uid() (settable via a
    // GUC so we can exercise the signed-in identity path), the platform roles the
    // REVOKE/GRANT name, and a minimal settlements table (the FK target + the
    // public_slug / is_public / view_count columns the function reads & bumps).
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      end $do$;
      create table if not exists public.settlements (
        id          uuid primary key default gen_random_uuid(),
        public_slug text unique,
        is_public   boolean default false,
        view_count  integer default 0
      );
    `);
    await db.exec(readFileSync(MIGRATION, 'utf-8'));
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    // Fresh counters + ledger + session GUCs before every case.
    await db.exec(`
      truncate public.gallery_views;
      delete from public.settlements;
      insert into public.settlements (public_slug, is_public, view_count)
        values ('pub-1', true, 0), ('secret', false, 0);
    `);
    await db.query(`select set_config('request.headers', '', false)`);
    await db.query(`select set_config('test.uid', '', false)`);
  });

  /** Set the ambient request identity for the next bump call. */
  async function session({ ua = null, uid = null } = {}) {
    await db.query(`select set_config('request.headers', $1, false)`, [ua ? JSON.stringify({ 'user-agent': ua }) : '']);
    await db.query(`select set_config('test.uid', $1, false)`, [uid || '']);
  }
  async function bump(slug, token = null) {
    await db.query(`select public.bump_public_view($1, $2)`, [slug, token]);
  }
  async function views(slug) {
    const r = await db.query(`select view_count from public.settlements where public_slug = $1`, [slug]);
    return r.rows[0]?.view_count ?? null;
  }

  it('counts a genuinely new anon viewer exactly once; a same-day repeat is a no-op', async () => {
    await bump('pub-1');
    expect(await views('pub-1')).toBe(1);
    await bump('pub-1'); // same anon (same UA-hash key), same UTC day
    await bump('pub-1');
    expect(await views('pub-1')).toBe(1); // dedup — no refresh inflation
  });

  it('counts distinct anon device tokens independently, each deduping', async () => {
    await bump('pub-1', 'device-token-aaaa');
    await bump('pub-1', 'device-token-bbbb');
    expect(await views('pub-1')).toBe(2);
    await bump('pub-1', 'device-token-aaaa'); // repeat of the first token
    expect(await views('pub-1')).toBe(2);
  });

  it('counts a signed-in viewer once (uid identity outranks token/UA)', async () => {
    await session({ uid: '11111111-1111-1111-1111-111111111111' });
    await bump('pub-1', 'device-token-aaaa');
    await bump('pub-1', 'device-token-bbbb'); // same uid ⇒ same key ⇒ deduped
    expect(await views('pub-1')).toBe(1);
    await session({ uid: '22222222-2222-2222-2222-222222222222' });
    await bump('pub-1');
    expect(await views('pub-1')).toBe(2); // a different signed-in viewer
  });

  it('skips obvious bots/crawlers (no vanity inflation)', async () => {
    await session({ ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' });
    await bump('pub-1');
    expect(await views('pub-1')).toBe(0);
    await session({ ua: 'curl/8.4.0' });
    await bump('pub-1');
    expect(await views('pub-1')).toBe(0);
    // A real browser after the bots still counts.
    await session({ ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' });
    await bump('pub-1');
    expect(await views('pub-1')).toBe(1);
  });

  it('is a quiet no-op for a non-public or unknown slug', async () => {
    await bump('secret');       // exists but is_public = false
    await bump('does-not-exist');
    expect(await views('secret')).toBe(0);
    const ledger = await db.query(`select count(*)::int as n from public.gallery_views`);
    expect(ledger.rows[0].n).toBe(0); // nothing recorded for a non-public target
  });
});
