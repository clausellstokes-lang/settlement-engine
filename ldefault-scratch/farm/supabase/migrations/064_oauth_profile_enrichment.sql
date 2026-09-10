-- ---------------------------------------------------------------------------
-- 064_oauth_profile_enrichment.sql
--
-- Enriches profiles from the OAuth provider's identity so Google/Discord users
-- are fully recorded for admin + analytics.
--
-- The GAP this closes: on signup the on_auth_user_created trigger fires for
-- every path (including OAuth) and handle_new_user() (migration 017) inserts a
-- bare profile with id + email + tier + credits only. It never reads
-- NEW.raw_user_meta_data, so the provider's full_name/name and
-- avatar_url/picture were dropped: profiles.display_name and
-- profiles.avatar_url stayed NULL for OAuth users. The sync_profile_email
-- trigger (003, hardened in 033) only mirrors email, and only AFTER UPDATE OF
-- email — so it never filled name/avatar either.
--
-- This migration is ADDITIVE, IDEMPOTENT and BACKFILL-SAFE:
--   A) handle_new_user() now also pulls display_name + avatar_url from
--      NEW.raw_user_meta_data on insert (welcome-credit block unchanged), and
--      COALESCEs into the conflict path so a user-chosen name is never
--      clobbered.
--   B) sync_profile_email() now also refreshes name/avatar (only-if-null) and
--      its trigger fires on UPDATE OF email, raw_user_meta_data so a later
--      OAuth re-link refreshes the profile.
--   C) Backfill existing rows from auth.users (only-if-null).
--
-- Provider metadata shapes:
--   Google  → raw_user_meta_data.full_name / .name, .avatar_url / .picture
--   Discord → raw_user_meta_data.full_name / .name, .avatar_url / .picture
--
-- No RLS/grant changes: no new tables/columns (display_name from 002,
-- avatar_url from 018 already exist). SECURITY DEFINER + search_path hardening
-- preserved on both functions.
-- ---------------------------------------------------------------------------

-- ── A) handle_new_user(): enrich name/avatar from provider metadata on insert
-- Re-defined verbatim from migration 017 plus the metadata enrichment. The
-- conflict path COALESCEs onto the EXISTING profiles values, so a user who has
-- already set a custom display_name/avatar keeps it across future signups.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, tier, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    'free',
    0
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        avatar_url   = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

  -- Welcome-credit block, copied verbatim from migration 017 (unchanged).
  if not exists (
    select 1
    from public.credit_ledger
    where user_id = new.id
      and kind = 'grant'
      and source = 'welcome'
  ) then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      new.id,
      'grant',
      1,
      'welcome',
      jsonb_build_object('trigger', 'handle_new_user')
    );

    insert into public.credit_transactions (user_id, amount, reason)
    values (new.id, 1, 'welcome');

    update public.profiles
      set credits = coalesce(credits, 0) + 1,
          updated_at = now()
      where id = new.id;
  end if;

  return new;
end;
$$;

-- Re-attach the signup trigger idempotently (it already exists from 017; this
-- keeps the migration self-contained if applied against a fresh schema).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is
  'Creates a profile (enriched with email + display_name + avatar_url from auth.users.raw_user_meta_data) and grants the one-time welcome credit. COALESCEs name/avatar on conflict so a user-chosen value is never clobbered.';

-- ── B) sync_profile_email(): also refresh name/avatar on auth.users update ──
-- Keeps email mirroring (verbatim behaviour) and adds only-if-null name/avatar
-- refresh so a later OAuth (re-)link fills a profile that was created without
-- provider metadata, without overwriting a user-chosen display_name/avatar.
-- SECURITY DEFINER + search_path = public, pg_temp preserved from migration 033.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.profiles
     set email = new.email,
         display_name = coalesce(
           public.profiles.display_name,
           new.raw_user_meta_data->>'full_name',
           new.raw_user_meta_data->>'name'
         ),
         avatar_url = coalesce(
           public.profiles.avatar_url,
           new.raw_user_meta_data->>'avatar_url',
           new.raw_user_meta_data->>'picture'
         ),
         updated_at = now()
   where id = new.id;
  return new;
end;
$$;

-- The 003 DO-block guard left tgname=sync_email_on_user_update bound to
-- AFTER UPDATE OF email only. Recreate unconditionally (drop-if-exists) so it
-- also fires when raw_user_meta_data changes (provider re-link).
drop trigger if exists sync_email_on_user_update on auth.users;
create trigger sync_email_on_user_update
  after update of email, raw_user_meta_data on auth.users
  for each row execute function public.sync_profile_email();

comment on function public.sync_profile_email() is
  'Mirrors auth.users.email into profiles and fills display_name/avatar_url from raw_user_meta_data when they are null (provider re-link). COALESCEs so a user-chosen value is never overwritten.';

-- ── C) Backfill existing profiles from auth.users (only-if-null) ────────────
-- Fills already-signed-up OAuth users. Custom names/avatars survive because we
-- only touch rows where a field is null and COALESCE onto the existing value.
update public.profiles p
   set display_name = coalesce(p.display_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
       avatar_url   = coalesce(p.avatar_url,   u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
       email        = coalesce(p.email, u.email),
       updated_at   = now()
  from auth.users u
 where p.id = u.id
   and (p.display_name is null or p.avatar_url is null or p.email is null);
