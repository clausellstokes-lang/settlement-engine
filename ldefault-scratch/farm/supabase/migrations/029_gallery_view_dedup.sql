-- 029_gallery_view_dedup.sql
-- §6 — De-duplicated gallery view counts.
--
-- The original bump_public_view (migration 008) did a naive view_count++ on
-- every read, so a single reader refreshing (or a bot) inflated the number.
-- This replaces it with per-(dossier, viewer, day) dedup: the counter only
-- climbs on a genuinely new viewer/day pair, and obvious crawlers are skipped.
--
-- Viewer identity, most-trusted first:
--   1. signed-in user id          (auth.uid())
--   2. the client's anon device token (persisted in localStorage, passed in)
--   3. a coarse User-Agent hash    (last-resort fallback)
--
-- Re-runnable: IF NOT EXISTS / CREATE OR REPLACE throughout.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Dedup ledger ─────────────────────────────────────────────────────────────
-- One row per (settlement, viewer, UTC day). A repeat view in the same day is
-- a no-op insert. RLS on + no policies + grants revoked → only the SECURITY
-- DEFINER function below may touch it.
create table if not exists public.gallery_views (
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  viewer_key    text not null,
  viewed_on     date not null default (now() at time zone 'utc')::date,
  created_at    timestamptz not null default now(),
  primary key (settlement_id, viewer_key, viewed_on)
);

alter table public.gallery_views enable row level security;
revoke all on public.gallery_views from anon, authenticated;

-- ── Counter ──────────────────────────────────────────────────────────────────
-- Signature changes (adds viewer_token), so drop the old one-arg version first
-- to avoid an ambiguous overload. The new param defaults to NULL, so older
-- clients that still call with just { slug } keep working.
drop function if exists public.bump_public_view(text);

create or replace function public.bump_public_view(slug text, viewer_token text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id  uuid;
  v_ua  text;
  v_key text;
begin
  -- Resolve the target public dossier; bail quietly if it isn't public.
  select id into v_id
    from public.settlements
    where public_slug = slug and is_public = true;
  if v_id is null then
    return;
  end if;

  -- Best-effort User-Agent (PostgREST exposes request headers as a JSON GUC).
  begin
    v_ua := nullif(current_setting('request.headers', true), '')::json ->> 'user-agent';
  exception when others then
    v_ua := null;
  end;

  -- Skip obvious bots/crawlers/scripts — they shouldn't inflate vanity counts.
  if v_ua is not null and v_ua ~* '(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview|headless|monitor|uptime|curl|wget|python-requests|go-http|axios|node-fetch|libwww|okhttp)' then
    return;
  end if;

  -- Pick the most-trusted available identity.
  v_key := coalesce(
    case when auth.uid() is not null then 'u:' || auth.uid()::text end,
    case when viewer_token is not null and length(viewer_token) between 8 and 200
         then 't:' || viewer_token end,
    'a:' || md5(coalesce(v_ua, 'anon'))
  );

  -- New viewer/day → count it; repeat within the day → no-op.
  insert into public.gallery_views (settlement_id, viewer_key)
    values (v_id, v_key)
    on conflict (settlement_id, viewer_key, viewed_on) do nothing;

  if found then
    update public.settlements
      set view_count = coalesce(view_count, 0) + 1
      where id = v_id;
  end if;
end;
$$;

grant execute on function public.bump_public_view(text, text) to authenticated, anon;

comment on table public.gallery_views is
  'Per-(dossier, viewer, UTC day) dedup ledger for bump_public_view. Written only by that SECURITY DEFINER function; never read by clients.';
comment on function public.bump_public_view(text, text) is
  'De-duplicated public view counter. viewer_token is the client''s anon device token; counts at most one view per viewer per UTC day and skips obvious bots.';
