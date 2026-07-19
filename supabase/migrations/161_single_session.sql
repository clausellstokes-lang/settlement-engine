-- ────────────────────────────────────────────────────────────────────────────
-- 161_single_session.sql — SINGLE CONCURRENT SESSION, last-login-wins
-- (DESIGN_MONEY_WAVE §7 / M-9). ONE active session per account, uniform across
-- tiers (free included). A new sign-in ALWAYS succeeds and supersedes the previous
-- session — never blocked. Enforcement is OURS (plan-independent): the current
-- session id is stored here, and every paid surface + the spend_credits belt reject
-- a JWT carrying a superseded session id.
--
-- ⚠ NUMBERING: 161 per manager coordination (this wave takes 157-161; siblings hold
--   156; renumber contiguously at fold). See 157_money_events.sql's header.
--
-- THE ROLLOUT-SAFETY LAW (§7.1): a MISSING row RETURNS TRUE from is_current_session
--   — sessions minted before this deploy are adopted lazily on their next SIGNED_IN
--   claim, never mass-evicted on migration day. A token with no session_id claim also
--   ALLOWS (never brick an unexpected token shape into a support fire). Only a PRESENT
--   row whose session_id differs from the caller's JWT rejects.
--
-- SECURITY POSTURE: current_account_session is RLS-ON, owner SELECT own row (feeds
--   the account "Active session" panel); writes go ONLY through claim_current_session
--   (SECURITY DEFINER, authenticated). is_/assert_current_session are the read + the
--   DB-side belt. All definer functions pin search_path = public, pg_temp.
--
-- auth.jwt() ->> 'session_id' is the Supabase JWT session claim (present on every
--   user access token). Read fully qualified; the pglite probe shims auth.jwt().
--
-- Depends on: 001 (auth.users), auth.uid()/auth.jwt(). Re-runnable.
-- @rollback: drop function if exists public.assert_current_session();
--   drop function if exists public.is_current_session();
--   drop function if exists public.claim_current_session(text);
--   drop table if exists public.current_account_session;
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.current_account_session (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  session_id   uuid not null,                 -- the JWT's session_id claim
  signed_in_at timestamptz not null default now(),
  device_label text,                          -- coarse, server-derived; never PII
  updated_at   timestamptz not null default now()
);
alter table public.current_account_session enable row level security;
comment on table public.current_account_session is
  'The ONE active session per account (161, §7). Owner-readable (the account panel); written only via claim_current_session. is_current_session enforces last-login-wins; a MISSING row ALLOWS (rollout safety).';

drop policy if exists "Owner reads own current session" on public.current_account_session;
create policy "Owner reads own current session" on public.current_account_session
  for select using (auth.uid() = user_id);

-- ── claim_current_session — the SIGNED_IN write (last claim wins) ───────────────
create or replace function public.claim_current_session(p_device_label text default null)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_sid text;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  v_sid := auth.jwt() ->> 'session_id';
  if v_sid is null or btrim(v_sid) = '' then
    -- A token with no session_id claim cannot be adopted; do not brick the sign-in.
    return false;
  end if;
  insert into public.current_account_session (user_id, session_id, device_label, signed_in_at, updated_at)
    values (v_uid, v_sid::uuid, nullif(left(btrim(coalesce(p_device_label, '')), 120), ''), now(), now())
  on conflict (user_id) do update set
    session_id   = excluded.session_id,
    device_label = excluded.device_label,
    signed_in_at = now(),
    updated_at   = now();
  return true;
end;
$$;
revoke all on function public.claim_current_session(text) from public;
grant execute on function public.claim_current_session(text) to authenticated;

-- ── is_current_session — the read (MISSING ROW ALLOWS) ─────────────────────────
create or replace function public.is_current_session()
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_sid text; v_row uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then return true; end if;           -- no user context → not enforceable here
  v_sid := auth.jwt() ->> 'session_id';
  if v_sid is null or btrim(v_sid) = '' then return true; end if;  -- unexpected token shape → allow + (edge) log
  select session_id into v_row from public.current_account_session where user_id = v_uid;
  if v_row is null then return true; end if;            -- MISSING ROW ALLOWS (rollout safety)
  return v_row::text = v_sid;
end;
$$;
revoke all on function public.is_current_session() from public;
grant execute on function public.is_current_session() to authenticated, service_role;

-- ── assert_current_session — the DB-side belt for value-moving RPCs ─────────────
create or replace function public.assert_current_session()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_current_session() then
    raise exception 'session_superseded';
  end if;
end;
$$;
revoke all on function public.assert_current_session() from public;
grant execute on function public.assert_current_session() to authenticated, service_role;
