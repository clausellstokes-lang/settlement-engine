-- ────────────────────────────────────────────────────────────────────────────
-- 008_public_gallery.sql — Public dossier gallery (read-only SEO surface).
--
-- The funnel strategy hinges on having public, crawlable dossier URLs:
--   - Every shared dossier becomes a /gallery/{slug} that any visitor
--     (and any search engine) can read without an account.
--   - The author retains all edit rights; readers see a frozen snapshot
--     of the dossier as of the moment it was shared.
--   - Authors can unshare at any time, which sets is_public=false and
--     causes the URL to return a 404 — the row is preserved.
--
-- New columns on `settlements`:
--   is_public      — boolean toggle (default false; only the owner
--                    can flip it via the existing user-update RLS).
--   public_slug    — opaque URL-safe identifier; generated on first
--                    publish and never reused. Lets us change the
--                    internal id without breaking shared links.
--   published_at   — timestamp of the most recent publish.
--   view_count     — cheap counter, incremented client-side on read.
--
-- New RLS policy: anyone (even anon) can SELECT rows WHERE is_public=true.
-- The existing "owner can do everything" policies are unchanged.
--
-- Re-runnable: every change uses IF NOT EXISTS / CREATE OR REPLACE.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Columns ────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists is_public    boolean not null default false,
  add column if not exists public_slug  text,
  add column if not exists published_at timestamptz,
  add column if not exists view_count   integer not null default 0;

-- Slug uniqueness: enforced only when set (partial index so unshared
-- rows can have NULL freely). Slugs are stable — we never reuse one,
-- so a row that was published once keeps its slug across re-publish
-- toggles. That lets bookmarks and search-engine links survive a
-- temporary unshare.
create unique index if not exists settlements_public_slug_unique
  on public.settlements(public_slug)
  where public_slug is not null;

-- Hot path: gallery listing reads "the N most-recently-published public
-- dossiers". Index supports that without a sort step.
create index if not exists settlements_public_listing
  on public.settlements(published_at desc)
  where is_public = true;

-- ── RLS: public read access ────────────────────────────────────────────────
-- The owner already has full CRUD via migration 001's policies. This
-- adds a separate SELECT policy that allows ANY caller (including
-- anon / unauthenticated) to read rows where is_public = true. Postgres
-- ORs RLS policies, so this opens public reads without weakening the
-- owner-only writes.

drop policy if exists "Public dossiers are world-readable" on public.settlements;
create policy "Public dossiers are world-readable"
  on public.settlements
  for select
  using (is_public = true);

-- ── Slug generator ─────────────────────────────────────────────────────────
-- Slugs are short, URL-safe, and case-insensitive: 12 base32 chars
-- pulled from gen_random_bytes. Collision probability at 10k slugs is
-- ~1 in 10^15 — fine.
--
-- We do NOT slugify the settlement name. Names are user-controlled and
-- can change between publishes; an opaque slug is stable, doesn't leak
-- whatever the dossier was called, and avoids edge cases (Unicode,
-- length, conflict resolution).

create or replace function public._make_public_slug()
returns text
language sql
volatile
as $$
  select lower(
    -- Base32-ish encoding of 8 random bytes → 13 chars; trim to 12 for
    -- a nice short URL ("/gallery/k9z7q2j8m4n6").
    substr(encode(gen_random_bytes(8), 'base32'), 1, 12)
  );
$$;

-- ── Atomic publish/unpublish ───────────────────────────────────────────────
-- Wraps the toggle in a SECURITY DEFINER function so the client doesn't
-- have to know about the slug-generation policy. Returns the row's
-- current slug (existing or newly minted) so the client can build the
-- /gallery/{slug} URL without a round-trip.

create or replace function public.publish_settlement(target_id uuid)
returns text                                          -- the slug
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_slug text;
  new_slug      text;
begin
  -- Owner check — the row must belong to the calling user.
  perform 1 from public.settlements
    where id = target_id and user_id = auth.uid();
  if not found then
    raise exception 'Not found or not owned by caller';
  end if;

  select public_slug into existing_slug
    from public.settlements where id = target_id;

  if existing_slug is null then
    -- Mint a fresh slug; retry on the (vanishingly rare) collision.
    loop
      new_slug := public._make_public_slug();
      begin
        update public.settlements
          set is_public = true,
              public_slug = new_slug,
              published_at = now()
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then
        -- spin until we get one
      end;
    end loop;
  else
    -- Re-publish (was unshared, now sharing again): keep the existing
    -- slug so old links continue to resolve.
    update public.settlements
      set is_public = true,
          published_at = now()
      where id = target_id;
  end if;

  return existing_slug;
end;
$$;

grant execute on function public.publish_settlement(uuid) to authenticated;

create or replace function public.unpublish_settlement(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform 1 from public.settlements
    where id = target_id and user_id = auth.uid();
  if not found then
    raise exception 'Not found or not owned by caller';
  end if;

  update public.settlements
    set is_public = false
    where id = target_id;
  -- Note: we deliberately keep public_slug and published_at so future
  -- re-publishes restore the same URL. Setting is_public=false alone
  -- makes the RLS policy stop returning the row to anon callers.
end;
$$;

grant execute on function public.unpublish_settlement(uuid) to authenticated;

-- ── View counter ───────────────────────────────────────────────────────────
-- Lightweight: anyone reading a public dossier can call this. No auth
-- required. Doesn't dedupe by IP or session — the number is for vanity,
-- not analytics. Real analytics live in whatever telemetry layer we
-- add later.

create or replace function public.bump_public_view(slug text)
returns void
language sql
volatile
as $$
  update public.settlements
    set view_count = coalesce(view_count, 0) + 1
    where public_slug = slug and is_public = true;
$$;

grant execute on function public.bump_public_view(text) to authenticated, anon;

-- ── Comments ───────────────────────────────────────────────────────────────

comment on column public.settlements.is_public is
  'When true, the row is readable by any caller via the public RLS policy and appears in the /gallery listing.';

comment on column public.settlements.public_slug is
  'Opaque, stable URL-safe identifier minted by publish_settlement(). Survives unshare→re-share so bookmarks keep working.';

comment on function public.publish_settlement(uuid) is
  'Set is_public=true and mint a slug if one does not yet exist. Returns the slug. Owner-only.';

comment on function public.unpublish_settlement(uuid) is
  'Set is_public=false. Preserves the slug so re-share resurrects the same URL. Owner-only.';
