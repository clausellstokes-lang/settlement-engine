-- ────────────────────────────────────────────────────────────────────────────
-- 059_enforce_account_status_rls.sql — extend the account-status trust boundary
-- (banned / disabled / soft-deleted) from the two write RPCs (057) to the DIRECT
-- table-write path and EVERY gallery write path, in DEPTH (review B16 finding #1).
--
-- THE GAP 057 LEFT OPEN
--   057 gated spend_credits + mutate_settlement_batch on account_is_active(), so a
--   banned user could no longer spend credits or batch-mutate settlements through
--   THOSE RPCs. But the client also writes settlements/maps via the PLAIN PostgREST
--   table path (`.from('settlements').insert/update/delete`, `.from('saved_maps')…`)
--   which is governed by the 024 owner-RLS policies — and those policies check only
--   `auth.uid() = user_id AND access_state = 'active'` (access_state is a BILLING
--   state, NOT the moderation status). They never call account_is_active(). So a
--   banned/disabled/soft-deleted account with a still-valid JWT could STILL insert,
--   update, and delete its own active settlements/maps directly, and could STILL
--   vote / comment / report / publish / unpublish in the gallery. The RPC gate was
--   one door; these were the others, left unlocked.
--
-- THE FIX — defense-in-depth, two independent layers per table:
--   LAYER 1 (RLS): recreate the settlements + saved_maps INSERT/UPDATE/DELETE
--     owner policies with an added `AND public.account_is_active(auth.uid())`. Same
--     for every gallery write policy (gallery_votes / gallery_comments /
--     gallery_reports inserts + the comment self-update) and the profiles
--     self-UPDATE policy. Policies are recreated idempotently (drop if exists;
--     create), byte-for-byte their net-current bodies plus the one guard.
--   LAYER 2 (TRIGGER): a BEFORE INSERT/UPDATE/DELETE trigger on settlements AND
--     saved_maps that RAISES when the acting account is not active. A trigger fires
--     regardless of which policy admitted the row, so even a DROPPED or mis-edited
--     RLS policy (a future migration footgun) still cannot let a banned user's
--     direct write land. The trigger is scoped to end-user writes: a service_role
--     caller (the downgrade/retention/processor jobs) is exempt so admin/system
--     maintenance is never blocked by it.
--   The gallery write RPCs (publish/unpublish/add comment/vote/report/delete) are
--     SECURITY DEFINER and bypass RLS, so RLS alone would not stop them — each
--     gets the same explicit account_is_active() guard right after its auth check.
--
-- account_is_active() (057) is fail-closed: an unknown/missing profile is inactive.
--
-- Re-runnable: DROP POLICY IF EXISTS + CREATE; CREATE OR REPLACE FUNCTION; DROP
-- TRIGGER IF EXISTS + CREATE TRIGGER throughout. No behavior change for an active
-- account — the guard is a no-op when account_is_active() is true.
-- Depends on: 057 (account_is_active), 024 (settlements/saved_maps owner policies),
--             008/019/021 (gallery RPCs + policies), 045 (publish_map/unpublish_map),
--             009/033 (profiles self-UPDATE policy).
-- ────────────────────────────────────────────────────────────────────────────

-- ── LAYER 1a. settlements owner write policies + account-status gate ─────────
-- Net-current bodies are the 024 "active own settlements" policies; we add the
-- account_is_active(auth.uid()) conjunct to every INSERT WITH CHECK and the
-- UPDATE/DELETE USING (+ UPDATE WITH CHECK).
drop policy if exists "Users insert active own settlements" on public.settlements;
create policy "Users insert active own settlements" on public.settlements
  for insert with check (
    auth.uid() = user_id
    and access_state = 'active'
    and public.account_is_active(auth.uid())
  );
drop policy if exists "Users update active own settlements" on public.settlements;
create policy "Users update active own settlements" on public.settlements
  for update using (
    auth.uid() = user_id
    and access_state = 'active'
    and public.account_is_active(auth.uid())
  ) with check (
    auth.uid() = user_id
    and access_state = 'active'
    and public.account_is_active(auth.uid())
  );
drop policy if exists "Users delete active own settlements" on public.settlements;
create policy "Users delete active own settlements" on public.settlements
  for delete using (
    auth.uid() = user_id
    and access_state = 'active'
    and public.account_is_active(auth.uid())
  );

-- ── LAYER 1b. saved_maps owner write policies + account-status gate ──────────
-- Net-current bodies are the 024 "Premium users … own maps" policies; same added
-- conjunct. The premium-access check is preserved unchanged.
drop policy if exists "Premium users insert own maps" on public.saved_maps;
create policy "Premium users insert own maps" on public.saved_maps
  for insert with check (
    auth.uid() = user_id
    and public.current_user_has_premium_access()
    and public.account_is_active(auth.uid())
  );
drop policy if exists "Premium users update active own maps" on public.saved_maps;
create policy "Premium users update active own maps" on public.saved_maps
  for update using (
    auth.uid() = user_id and access_state = 'active'
    and public.current_user_has_premium_access()
    and public.account_is_active(auth.uid())
  ) with check (
    auth.uid() = user_id and access_state = 'active'
    and public.current_user_has_premium_access()
    and public.account_is_active(auth.uid())
  );
drop policy if exists "Premium users delete active own maps" on public.saved_maps;
create policy "Premium users delete active own maps" on public.saved_maps
  for delete using (
    auth.uid() = user_id and access_state = 'active'
    and public.current_user_has_premium_access()
    and public.account_is_active(auth.uid())
  );

-- ── LAYER 1c. profiles self-UPDATE policy + account-status gate ──────────────
-- Net-current body is the 009 column-lock policy: a self-UPDATE may change ONLY
-- display_name (role/tier/credits/is_founder pinned to current). We add the
-- account_is_active conjunct so a banned/disabled/soft-deleted account cannot even
-- rename itself. The "Developers update any profile" policy (033) is LEFT
-- UNCHANGED — admin moderation must keep working ON banned users (that is how the
-- flags get cleared). The soft-delete processor (054) runs as service_role and is
-- RLS-exempt, so clearing the email/display_name during anonymisation is unaffected.
-- NET-CURRENT body is 018's "safe preferences only" policy (NOT the older 009
-- "display_name only" name) — it locks role/tier/credits/is_founder AND
-- stripe_customer_id + email. PostgreSQL ORs coexisting permissive policies, so we
-- DROP BOTH the legacy 009 name AND the live 018 name and recreate ONE policy:
-- otherwise the un-gated 018 policy would still admit a banned account's
-- self-UPDATE and let an active account dodge the email/stripe_customer_id lock via
-- the looser policy. The recreated policy carries the FULL 018 column lock PLUS the
-- account_is_active conjunct.
drop policy if exists "Users update own profile (display_name only)" on public.profiles;
drop policy if exists "Users update own profile (safe preferences only)" on public.profiles;
create policy "Users update own profile (safe preferences only)"
  on public.profiles
  for update
  using (auth.uid() = id and public.account_is_active(auth.uid()))
  with check (
    auth.uid() = id
    and public.account_is_active(auth.uid())
    and role               is not distinct from (select role               from public.profiles where id = auth.uid())
    and tier               is not distinct from (select tier               from public.profiles where id = auth.uid())
    and credits            is not distinct from (select credits            from public.profiles where id = auth.uid())
    and is_founder         is not distinct from (select is_founder         from public.profiles where id = auth.uid())
    and stripe_customer_id is not distinct from (select stripe_customer_id from public.profiles where id = auth.uid())
    and email              is not distinct from (select email              from public.profiles where id = auth.uid())
  );

-- ── LAYER 1d. gallery write policies + account-status gate ───────────────────
-- gallery_votes INSERT (019): a banned account may not upvote.
drop policy if exists "Users can upvote public settlements" on public.gallery_votes;
create policy "Users can upvote public settlements"
  on public.gallery_votes
  for insert
  with check (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

-- gallery_comments INSERT (019): a banned account may not comment.
drop policy if exists "Users can comment on public settlements" on public.gallery_comments;
create policy "Users can comment on public settlements"
  on public.gallery_comments
  for insert
  with check (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
    and char_length(trim(body)) between 1 and 2000
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

-- gallery_comments self-UPDATE (019, used for soft-delete): a banned account may
-- not edit/soft-delete its own comments via the direct path either.
drop policy if exists "Users can soft delete their own gallery comments" on public.gallery_comments;
create policy "Users can soft delete their own gallery comments"
  on public.gallery_comments
  for update
  using (auth.uid() = user_id and public.account_is_active(auth.uid()))
  with check (auth.uid() = user_id and public.account_is_active(auth.uid()));

-- gallery_reports INSERT (021): a banned account may not file reports.
drop policy if exists "Users can report public gallery dossiers" on public.gallery_reports;
create policy "Users can report public gallery dossiers"
  on public.gallery_reports
  for insert
  with check (
    auth.uid() = user_id
    and public.account_is_active(auth.uid())
    and status = 'open'
    and char_length(trim(reason)) between 1 and 80
    and char_length(body) <= 2000
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

-- ── LAYER 2. BEFORE-write triggers on settlements + saved_maps ───────────────
-- Redundant with LAYER 1: a trigger fires no matter which RLS policy admitted the
-- write, so a dropped/mis-edited owner policy in a future migration still cannot
-- let a banned account's direct write land. Service-role callers (the system jobs:
-- handle_premium_downgrade / restore_premium_settlements / purge_* / the deletion
-- processor) are exempt so maintenance never trips on it. The acting account is
-- auth.uid() for a normal authed write; on DELETE there is no NEW row, so we read
-- auth.uid() directly (the RLS USING clause already scoped the row to the owner).
create or replace function public.enforce_account_active_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  acting uuid := auth.uid();
begin
  -- Service-role / system runs bypass the gate (they hold the trust boundary and
  -- legitimately touch banned/disabled/deleted accounts' rows during maintenance).
  if coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role' then
    return case when tg_op = 'DELETE' then old else new end;
  end if;
  -- Only an authenticated END-USER write carries a non-null auth.uid(). A null acting
  -- uid means a no-request-JWT system/definer write — e.g. GoTrue's own SECURITY
  -- DEFINER triggers handle_new_user (welcome-credit UPDATE on signup, 017) and
  -- sync_profile_email (email-mirror UPDATE on confirm/change, 003/033), which run
  -- with no request context and are NOT the supabase service_role. Those legitimately
  -- touch profiles and MUST pass (fail-closing on them would break ALL signups and
  -- email changes). RLS stays the primary gate for end-user writes (which always
  -- carry auth.uid() — a banned user can never present a null uid); this trigger is
  -- the redundant layer that still blocks a banned END-USER (non-null uid, inactive)
  -- even if an owner RLS policy is ever dropped/mis-edited.
  if acting is not null and not public.account_is_active(acting) then
    raise exception 'account is not active'
      using errcode = 'check_violation';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

comment on function public.enforce_account_active_write() is
  'BEFORE-write guard (059): RAISEs when the acting end-user account is not account_is_active() (banned/disabled/soft-deleted). Redundant second layer behind the owner RLS policies so a dropped/mis-edited policy still cannot admit a banned user''s direct settlement/saved_maps write. service_role (system jobs) is exempt.';

drop trigger if exists trg_enforce_account_active_settlements on public.settlements;
create trigger trg_enforce_account_active_settlements
  before insert or update or delete on public.settlements
  for each row execute function public.enforce_account_active_write();

drop trigger if exists trg_enforce_account_active_saved_maps on public.saved_maps;
create trigger trg_enforce_account_active_saved_maps
  before insert or update or delete on public.saved_maps
  for each row execute function public.enforce_account_active_write();

-- ── LAYER 1e. custom_content write policies + account-status gate ─────────────
-- The 017 owner write policies gate only on premium access, NOT account status, so
-- a banned/disabled/soft-deleted PREMIUM account could still insert/update/delete
-- custom_content via the direct PostgREST path. Recreate each with account_is_active.
drop policy if exists "premium users insert own custom content" on public.custom_content;
create policy "premium users insert own custom content"
  on public.custom_content
  for insert
  with check (auth.uid() = user_id and public.profile_has_premium_access(auth.uid()) and public.account_is_active(auth.uid()));
drop policy if exists "premium users update own custom content" on public.custom_content;
create policy "premium users update own custom content"
  on public.custom_content
  for update
  using (auth.uid() = user_id and public.profile_has_premium_access(auth.uid()) and public.account_is_active(auth.uid()))
  with check (auth.uid() = user_id and public.profile_has_premium_access(auth.uid()) and public.account_is_active(auth.uid()));
drop policy if exists "premium users delete own custom content" on public.custom_content;
create policy "premium users delete own custom content"
  on public.custom_content
  for delete
  using (auth.uid() = user_id and public.profile_has_premium_access(auth.uid()) and public.account_is_active(auth.uid()));

-- LAYER 2 (redundant triggers) extended to profiles + custom_content: the same
-- BEFORE-write guard fires regardless of which RLS policy admitted the row. profiles
-- is UPDATE-only here (signup INSERT runs service_role/definer and is exempt; the
-- self-rename path is the surface we gate); the admin "Developers update any profile"
-- path keeps working because the acting admin's own account is active.
drop trigger if exists trg_enforce_account_active_profiles on public.profiles;
create trigger trg_enforce_account_active_profiles
  before update on public.profiles
  for each row execute function public.enforce_account_active_write();

drop trigger if exists trg_enforce_account_active_custom_content on public.custom_content;
create trigger trg_enforce_account_active_custom_content
  before insert or update or delete on public.custom_content
  for each row execute function public.enforce_account_active_write();

-- ── LAYER 3. gallery write RPCs (SECURITY DEFINER) + account-status gate ─────
-- These bypass RLS by design (SECURITY DEFINER), so LAYER 1's gallery policies do
-- NOT cover the RPC path. Each net-current RPC body is reproduced verbatim with a
-- single account_is_active(auth.uid()) guard inserted right after its auth check.

-- publish_settlement (008): owner publish/re-publish. A banned account may not
-- (re)publish a dossier to the gallery.
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
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- Trust-boundary gate (059): a banned/disabled/soft-deleted account cannot
  -- publish, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

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

-- unpublish_settlement (008): a banned account may not toggle gallery state.
create or replace function public.unpublish_settlement(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

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

-- toggle_gallery_vote (019): a banned account may not vote.
create or replace function public.toggle_gallery_vote(target_settlement_id uuid)
returns table (net_votes integer, voted boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to vote';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  if exists (
    select 1 from public.gallery_votes
    where settlement_id = target_settlement_id and user_id = auth.uid()
  ) then
    delete from public.gallery_votes
      where settlement_id = target_settlement_id and user_id = auth.uid();
    return query
      select count(*)::integer, false
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  else
    insert into public.gallery_votes(settlement_id, user_id)
      values (target_settlement_id, auth.uid())
      on conflict do nothing;
    return query
      select count(*)::integer, true
      from public.gallery_votes
      where settlement_id = target_settlement_id;
  end if;
end;
$$;

revoke execute on function public.toggle_gallery_vote(uuid) from public;
grant execute on function public.toggle_gallery_vote(uuid) to authenticated;

-- add_gallery_comment (019): a banned account may not comment.
create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public
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

revoke execute on function public.add_gallery_comment(uuid, text) from public;
grant execute on function public.add_gallery_comment(uuid, text) to authenticated;

-- delete_gallery_comment (019): a banned account may not soft-delete its comments.
create or replace function public.delete_gallery_comment(target_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  update public.gallery_comments
    set deleted_at = now(), updated_at = now()
    where id = target_comment_id and user_id = auth.uid() and deleted_at is null;
  if not found then
    raise exception 'Comment not found or not owned by caller';
  end if;
end;
$$;

revoke execute on function public.delete_gallery_comment(uuid) from public;
grant execute on function public.delete_gallery_comment(uuid) to authenticated;

-- report_gallery_dossier (021): a banned account may not file reports.
create or replace function public.report_gallery_dossier(
  target_settlement_id uuid,
  report_reason text default 'other',
  report_body text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  report_id uuid;
  clean_reason text := left(trim(coalesce(report_reason, 'other')), 80);
  clean_body text := left(trim(coalesce(report_body, '')), 2000);
begin
  if auth.uid() is null then
    raise exception 'Sign in to report a dossier';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;
  if clean_reason = '' then
    clean_reason := 'other';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_reports(settlement_id, user_id, reason, body, status)
    values (target_settlement_id, auth.uid(), clean_reason, clean_body, 'open')
    on conflict (settlement_id, user_id)
    do update set
      reason = excluded.reason,
      body = excluded.body,
      status = 'open',
      updated_at = now()
    returning id into report_id;

  return report_id;
end;
$$;

revoke execute on function public.report_gallery_dossier(uuid, text, text) from public;
grant execute on function public.report_gallery_dossier(uuid, text, text) to authenticated;

-- publish_map (045): owner map publish/re-publish. A banned account may not share.
create or replace function public.publish_map(
  target_id    uuid,
  p_kind       text default 'map',
  p_description text default null,
  p_tags       text[] default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  perform 1 from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  select public_slug into existing_slug from public.saved_maps where id = target_id;
  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.saved_maps
          set is_public = true, public_slug = new_slug, published_at = now(),
              share_kind = v_kind,
              gallery_share_campaign = (v_kind = 'map_with_campaign'),
              gallery_description = left(coalesce(p_description, ''), 500),
              gallery_tags = p_tags
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then /* retry */
      end;
    end loop;
  else
    update public.saved_maps
      set is_public = true, published_at = now(), share_kind = v_kind,
          gallery_share_campaign = (v_kind = 'map_with_campaign'),
          gallery_description = left(coalesce(p_description, ''), 500),
          gallery_tags = p_tags
      where id = target_id;
  end if;
  return existing_slug;
end $$;

-- unpublish_map (045): a banned account may not toggle gallery state.
create or replace function public.unpublish_map(target_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;
  perform 1 from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;
  update public.saved_maps set is_public = false where id = target_id;  -- slug preserved for re-share
end $$;

revoke all on function public.publish_map(uuid, text, text, text[]) from public;
revoke all on function public.unpublish_map(uuid)                   from public;
grant execute on function public.publish_map(uuid, text, text, text[]) to authenticated;
grant execute on function public.unpublish_map(uuid)                   to authenticated;

comment on function public.publish_settlement(uuid) is
  'Set is_public=true and mint a slug if one does not yet exist. Returns the slug. Owner-only. 059: also rejects a banned/disabled/soft-deleted account.';
comment on function public.toggle_gallery_vote(uuid) is
  'Toggle the caller''s upvote on a public settlement. 059: rejects a non-active account.';
comment on function public.add_gallery_comment(uuid, text) is
  'Authenticated comment on a public settlement. 059: rejects a non-active account.';
comment on function public.report_gallery_dossier(uuid, text, text) is
  'Authenticated report of a public gallery dossier. Upserts the caller report. 059: rejects a non-active account.';
comment on function public.publish_map(uuid, text, text, text[]) is
  'Owner map publish/re-publish to the gallery. 059: rejects a non-active account.';
