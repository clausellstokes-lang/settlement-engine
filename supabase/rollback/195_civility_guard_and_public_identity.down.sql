-- 195_civility_guard_and_public_identity.down.sql — reversal for migration 195.
--
-- PARTIAL and DATA-SAFE, per supabase/rollback/README.md: this reverses the
-- schema-additive, row-free half of 195 — the avatars RLS policies, the two
-- forked RPC bodies, and the four new guard functions. Nothing here deletes a
-- row, a column, a bucket, or a stored object.
--
-- Reverse order of the migration: §5 policies, then §4 bodies, then §3
-- functions. The §4 restore deliberately comes BEFORE the §3 drops:
-- update_display_name and add_gallery_comment call public.civility_blocked, so
-- dropping the guard first would leave both RPCs raising "function does not
-- exist" for the width of this script.
--
-- ⚠️ THIS SCRIPT ALONE IS NOT A SAFE RESTING STATE — REVERT THE CLIENT TOO.
-- profiles.public_identity_opt_in is deliberately left standing (see below), so
-- any account that already consented still reads as opted-IN while the civility
-- guard is gone: publicIdentityOf would publish a display name that nothing
-- server-side is checking any more. Either ship the matching client revert in
-- the same window, or blank the consent by hand first:
--   update public.profiles set public_identity_opt_in = false;
-- That is a reviewed data edit made with eyes open — not something a down script
-- does to a consent column on its own. (Same shape as 103's note: the reversal
-- is only correct alongside its companion revert.)
--
-- NOT reversed here (deliberately — see supabase/rollback/README.md):
--   • profiles.public_identity_opt_in — dropping the column erases every
--     account's recorded consent choice. That is a data migration; restore from
--     a point-in-time backup if the column itself must go. Re-applying 195 is
--     fail-closed (the column returns `not null default false`, i.e. everyone
--     opted out), so leaving it standing is the recoverable direction.
--   • public.civility_terms and public.civility_allow — the seeded blocklist is
--     re-creatable from 195's body, but the ALLOWLIST is operator-curated (§9
--     entries are added only when a real false positive is reported) and those
--     rows exist nowhere else in this repo. Same posture as 107/108: the
--     functions go, the curated tables stay. With the guard functions dropped
--     both tables are inert — nothing reads them.
--   • the RLS enable + `revoke all ... from anon, authenticated` on those two
--     tables — a security tightening, and the runbook forbids reversing one as a
--     blanket auto-down. Reverse per-table, reviewed, only if forced.
--   • the `avatars` storage bucket row — deleting it orphans (or refuses to
--     leave) every avatar object users have already uploaded. Data: forward-fix
--     or PITR. NOTE that 195's insert is `on conflict (id) do update`, so if a
--     bucket with id 'avatars' somehow pre-existed, its prior public/size/MIME
--     settings were overwritten and are NOT recoverable from this repo. No file
--     in supabase/migrations creates that bucket, so on a by-the-book schema 195
--     is its creator and there is no prior state to miss.
--
-- Run by hand during an incident:
--   psql "$DATABASE_URL" -f supabase/rollback/195_civility_guard_and_public_identity.down.sql

-- ── §5 reversal: the avatars RLS ────────────────────────────────────────────
-- Dropping these REMOVES public read and every user write on the bucket, which
-- is a tightening rather than a hole: the objects stay on disk and become
-- unreachable through the anon/authenticated API until 195 (or a forward fix)
-- re-creates the policies. Dropped in reverse creation order.
drop policy if exists "Users sweep their own avatar" on storage.objects;
drop policy if exists "Users replace their own avatar" on storage.objects;
drop policy if exists "Users write their own avatar" on storage.objects;
drop policy if exists "Avatar images are publicly readable" on storage.objects;

-- ── §4 reversal: the two ordered surfaces stop consulting the guard ─────────
-- Both bodies are restored to their PRIOR NET-CURRENT definitions, per the
-- runbook's "recreate from the prior migration's body, not a remembered shape".

-- add_gallery_comment — migration 131's body VERBATIM. 195's version is this
-- body plus the civility clause and nothing else, so this is an exact reversal.
create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  comment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to comment';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 20 accepted comments/hour/user. Comment storage
  -- is otherwise unbounded (the display list caps at 100 but the rows persist);
  -- 20/hour is generous for a human and useless as a flood vector.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_comment', 3600) > 20 then
    raise exception 'You are commenting too quickly — please slow down and try again shortly.';
  end if;

  if char_length(trim(coalesce(comment_body, ''))) < 1 then
    raise exception 'Comment cannot be empty';
  end if;
  if char_length(trim(comment_body)) > 2000 then
    raise exception 'Comment is too long';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_comments(settlement_id, user_id, body)
    values (target_settlement_id, auth.uid(), trim(comment_body))
    returning id into comment_id;
  return comment_id;
end;
$$;

-- update_display_name — migration 009's body, with the civility clause removed.
--
-- ⚠️ ONE DELIBERATE DIVERGENCE FROM VERBATIM-009: the search_path stays pinned
-- `public, pg_temp`. 009 spelled it bare `set search_path = public`, which leaves
-- pg_temp implicitly FIRST — the CVE-2018-1058 hijack shape that 094/111/131
-- exist to close, and which 131 missed on this one function. Restoring the bare
-- form would make this down script REVERSE A SECURITY TIGHTENING, which
-- supabase/rollback/README.md forbids doing as a blanket auto-down ("reversing a
-- security tightening re-opens the hole... never as a blanket auto-`down`"). The
-- pin is byte-neutral to what this body resolves (195's own header records that),
-- so keeping it changes no behaviour this reversal is meant to restore. If the
-- owner ever wants the literal 009 shape back, that is a reviewed security call
-- of its own, not a line in a rollback script.
create or replace function public.update_display_name(new_name text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  trimmed_name text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  trimmed_name := btrim(coalesce(new_name, ''));
  if length(trimmed_name) > 64 then
    raise exception 'display name too long (max 64 chars)';
  end if;
  if trimmed_name = '' then
    trimmed_name := null;
  end if;

  update public.profiles
    set display_name = trimmed_name,
        updated_at   = now()
    where id = auth.uid();

  return trimmed_name;
end;
$$;

-- `create or replace` keeps existing grants, so these are belt-and-braces for a
-- database where the functions were dropped rather than replaced. Both match the
-- net-current grants (009 for the name RPC, 125 for the comment RPC).
grant execute on function public.update_display_name(text) to authenticated;
grant execute on function public.add_gallery_comment(uuid, text) to authenticated;

-- ── §3 reversal: the server mirror of the civility guard ────────────────────
-- Safe to drop outright: no migration before 195 defines any of these four
-- names, and after the §4 restore above nothing calls them. Dropped in
-- reverse-dependency order (caller before callee).
--
-- ⚠️ EFFECT: BLOCK mode is no longer mirrored server-side. The client module
-- (src/lib/civility.js) still refuses the same strings, but client checks are
-- courtesy and this removes the law. Only run this if the guard itself is the
-- fault; prefer a forward fix.
drop function if exists public.civility_blocked(text);
drop function if exists public._civility_token_hits(text);
drop function if exists public._civility_stem_hits(text);
drop function if exists public.civility_normalize(text);
