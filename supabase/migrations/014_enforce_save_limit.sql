-- ────────────────────────────────────────────────────────────────────────────
-- 014_enforce_save_limit.sql - Server-side enforcement of the per-tier
-- save limit.
--
-- Comprehensive review flagged:
--   "save limits are easy to bypass client-side. settlementSlice.js
--    (line 510) has max-save enforcement, but GenerateWizard.jsx
--    (line 191) and GenerateWizard.jsx (line 627) call savesService.save
--    directly after only checking canSave."
--
-- The client-side `canSave` gate is real friction but not security: any
-- client willing to bypass the React component can hit the supabase
-- upsert directly. A user could spam saves past their tier cap.
--
-- This migration adds a BEFORE INSERT trigger that consults the
-- profile's role + tier and the current save count, then rejects the
-- insert when the cap would be exceeded. Caps mirror src/store/authSlice.js
-- TIER_GATE:
--     anon                                 → 0 (can't even INSERT)
--     free / wanderer                      → 3
--     premium / cartographer / founder     → unlimited
--     elevated roles (developer / admin)   → unlimited (bypass)
--
-- Profile lookup is the only RLS-free read needed; we use SECURITY
-- DEFINER on the function so the trigger sees the row regardless of
-- RLS policies.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.enforce_save_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_tier   text;
  user_role   text;
  save_count  integer;
  save_limit  integer;
begin
  -- Pull the inserter's tier + role. NEW.user_id is the authenticated
  -- user id that the client provided; we cross-check against
  -- auth.uid() at the bottom to prevent a client from inserting on
  -- behalf of another user.
  select tier, role into user_tier, user_role
    from public.profiles
    where id = NEW.user_id;

  -- Cross-user inserts are not allowed. The settlements RLS policy
  -- already requires `auth.uid() = user_id` on INSERT, but defending
  -- in depth is cheap.
  if auth.uid() is not null and NEW.user_id is distinct from auth.uid() then
    raise exception 'cannot save a settlement for another user';
  end if;

  -- Elevated roles (developer, admin) bypass.
  if user_role in ('developer', 'admin') then
    return NEW;
  end if;

  -- Determine the per-tier cap. Default to 3 (free / wanderer) when
  -- tier is null or unrecognized - safer than treating an unknown
  -- tier as unlimited.
  save_limit := case user_tier
    when 'premium'      then null   -- unlimited
    when 'cartographer' then null
    when 'founder'      then null
    when 'free'         then 3
    when 'wanderer'     then 3
    else 3
  end;

  -- Null limit = unlimited; skip the count.
  if save_limit is null then
    return NEW;
  end if;

  -- Count current saves for this user. Trigger runs BEFORE INSERT so
  -- the row being inserted is NOT yet in the count.
  select count(*) into save_count
    from public.settlements
    where user_id = NEW.user_id;

  if save_count >= save_limit then
    raise exception 'save limit reached: % allows % saves. Upgrade to Cartographer for unlimited.',
      coalesce(user_tier, 'free'), save_limit;
  end if;

  return NEW;
end;
$$;

-- Drop existing trigger if it's there (re-runnable migration) then create.
drop trigger if exists settlements_enforce_save_limit on public.settlements;
create trigger settlements_enforce_save_limit
  before insert on public.settlements
  for each row
  execute function public.enforce_save_limit();

comment on function public.enforce_save_limit() is
  'Tier-aware save-count cap. Free/Wanderer = 3 saves. Premium tiers = unlimited. Elevated roles bypass. Runs BEFORE INSERT on settlements.';
