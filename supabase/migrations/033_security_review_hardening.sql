-- 033_security_review_hardening.sql
--
-- Net-state security/correctness fixes from the comprehensive code review.
-- Migrations are append-only, so each fix re-declares the current object.
--
--   1. refund_credits: revoke from `authenticated` (CRITICAL) — any user could
--      refund their own SUCCESSFUL AI spend = free/unlimited generations. The
--      edge functions now call it via the service-role client (generate-narrative
--      and generate-chronicle), only after a verified generation failure.
--   2. _gallery_sanitize_public_json: NPC projection becomes an ALLOWLIST mirroring
--      the client toPublicSafe (11 fields) — the denylist let DM-relevant NPC
--      internals (power, *Contribution, potentialSuccessors, …) leak; also word-
--      boundary the dm/gm key regex so it stops stripping landmarks/admin.
--   3. enforce_save_limit: serialize the per-user count via an advisory lock
--      (closes the count-then-insert TOCTOU race).
--   4. version_history: server-side 50-entry cap (was client-only).
--   5. sync_profile_email: pin search_path (SECURITY DEFINER hardening).
--   6. "Developers update any profile": add WITH CHECK (was USING-only).

-- ── 1. refund_credits is service-role only ─────────────────────────────────
revoke execute on function public.refund_credits(uuid, text) from authenticated;
revoke execute on function public.refund_credits(uuid, text) from anon;
grant  execute on function public.refund_credits(uuid, text) to service_role;

-- ── 2. Gallery public sanitizer: NPC allowlist + boundaried dm/gm denylist ──
create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  key text;
  child jsonb;
  sanitized jsonb;
  out jsonb;
  is_npc_obj boolean;
  -- Mirrors src/domain/display/publicSafe.js toPublicSafe NPC allowlist.
  npc_allowed constant text[] := array[
    'id','name','role','title','category','personality','physical',
    'factionAffiliation','secondaryAffiliation','presentation','influence'
  ];
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    -- True when this object is a direct element of an `npcs` array (its parent
    -- key is 'npcs'); only then do we apply the NPC field allowlist.
    is_npc_obj := array_length(path, 1) is not null
              and path[array_length(path, 1)] = 'npcs';
    out := '{}'::jsonb;
    for key, child in select * from jsonb_each(value) loop
      -- DM-private key denylist. dm/gm use word boundaries (\m = start-of-word)
      -- so they match dmNotes/dmCompass/gm* but NOT landmarks/admin/judgment.
      if key ~* '(secret|private|\m(dm|gm)|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)' then
        continue;
      end if;
      -- NPC objects: keep ONLY the public allowlist (the denylist alone let
      -- power / *Contribution / potentialSuccessors / linked* etc. leak).
      if is_npc_obj and not (key = any(npc_allowed)) then
        continue;
      end if;

      sanitized := public._gallery_sanitize_public_json(child, path || key);
      if sanitized is not null then
        out := out || jsonb_build_object(key, sanitized);
      end if;
    end loop;
    return out;
  end if;

  if jsonb_typeof(value) = 'array' then
    out := '[]'::jsonb;
    for child in select jsonb_array_elements(value) loop
      sanitized := public._gallery_sanitize_public_json(child, path);
      if sanitized is not null then
        out := out || jsonb_build_array(sanitized);
      end if;
    end loop;
    return out;
  end if;

  return value;
end;
$$;

-- Preserve the original grant posture (020 revoked from public).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

-- ── 3. enforce_save_limit: serialize per-user accounting ───────────────────
create or replace function public.enforce_save_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_tier text;
  user_role text;
  save_count integer;
  save_limit integer;
begin
  select tier, role into user_tier, user_role
    from public.profiles where id = new.user_id;

  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'cannot save a settlement for another user';
  end if;
  if coalesce(new.access_state, 'active') <> 'active'
     and coalesce(current_setting('request.jwt.claim.role', true), auth.role()) <> 'service_role' then
    raise exception 'new settlements must be active';
  end if;
  if user_role in ('developer', 'admin') then return new; end if;

  save_limit := case user_tier
    when 'premium' then null
    when 'cartographer' then null
    when 'founder' then null
    else 3
  end;
  if save_limit is null or coalesce(new.access_state, 'active') <> 'active' then
    return new;
  end if;

  -- Serialize concurrent inserts for the SAME user so the count-then-insert
  -- below can't race two parallel saves past the limit (TOCTOU). The lock is
  -- released at transaction end.
  perform pg_advisory_xact_lock(hashtext('save_limit:' || new.user_id::text));

  select count(*)::integer into save_count
    from public.settlements
    where user_id = new.user_id and access_state = 'active';
  if save_count >= save_limit then
    raise exception 'save limit reached: % allows % active saves. Upgrade for unlimited saves.',
      coalesce(user_tier, 'free'), save_limit;
  end if;
  return new;
end;
$$;

-- ── 4. version_history: enforce the 50-entry cap server-side ────────────────
create or replace function public.enforce_version_history_cap()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.version_history is not null
     and jsonb_typeof(new.version_history) = 'array'
     and jsonb_array_length(new.version_history) > 50 then
    -- Keep the most recent 50 entries (newest is appended last) in order.
    new.version_history := (
      select coalesce(jsonb_agg(elem order by ord), '[]'::jsonb)
      from (
        select elem, ord
        from jsonb_array_elements(new.version_history) with ordinality as t(elem, ord)
        order by ord desc
        limit 50
      ) recent
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_version_history_cap on public.settlements;
create trigger trg_enforce_version_history_cap
  before insert or update of version_history on public.settlements
  for each row execute function public.enforce_version_history_cap();

-- ── 5. sync_profile_email: pin search_path ─────────────────────────────────
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

-- ── 6. "Developers update any profile": add WITH CHECK ─────────────────────
drop policy if exists "Developers update any profile" on public.profiles;
create policy "Developers update any profile" on public.profiles
  for update
  using (public.current_user_is_privileged())
  with check (public.current_user_is_privileged());
