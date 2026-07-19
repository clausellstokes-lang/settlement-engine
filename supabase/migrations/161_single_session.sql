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
-- THE spend_credits DB BELT (§7.2, M-9c): spend_credits is recreated from its
--   net-current body (153) VERBATIM with ONE delta — a perform assert_current_session()
--   at the top, so a superseded JWT can never move credits even if a request-layer
--   gate let it through. The missing-row-allows semantics keeps every existing
--   creditFlow pin green (a caller with no session row spends normally). CREATE OR
--   REPLACE preserves the existing grant (authenticated).
--
-- @rollback: re-apply 153's spend_credits definition (drop the assert_current_session
--   call); drop function if exists public.assert_current_session();
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
  -- auth.jwt() is Supabase-provided in prod; guard its absence (an unusual context /
  -- a minimal test scaffold) so the belt never bricks a spend — ALLOW when unreadable.
  begin
    v_sid := auth.jwt() ->> 'session_id';
  exception when undefined_function then
    return true;
  end;
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

-- ── THE spend_credits DB BELT (§7.2, M-9c) ─────────────────────────────────────
-- Recreated from 153's net-current body VERBATIM with ONE delta: a
-- `perform public.assert_current_session();` at the top (right after the auth check,
-- before the 057 active-account gate and any credit movement). A superseded session
-- raises 'session_superseded' here BEFORE a single credit is spent. The
-- missing-row-allows semantics (161) keeps every existing creditFlow pin green.
create or replace function public.spend_credits(feature text, p_profile text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cost integer;
  remaining integer;
  current_balance integer;
  user_role text;
  new_spend_id uuid;
  needed integer;
  grant_row record;
  allocation integer;
  base_feature text;
  cfg_cost integer;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- SINGLE-SESSION BELT (161, §7.2): a superseded JWT can never move credits.
  perform public.assert_current_session();
  -- Trust-boundary gate (057): a banned/disabled/soft-deleted account may not
  -- spend, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- CONFIG-FIRST cost resolution (114): strip a trailing '_fast' to the base feature,
  -- then — when a profile is supplied — read the per-profile config cost. Only an
  -- integer 1..12 is honoured; ANY miss/malformation falls through to the 057 CASE.
  base_feature := case when feature like '%\_fast' then left(feature, length(feature) - 5) else feature end;
  cfg_cost := null;
  if p_profile is not null then
    begin
      select nullif(v.value -> 'profiles' -> p_profile ->> base_feature, '')::integer
        into cfg_cost
        from public.system_config v
       where v.key = 'ai_credit_costs';
    exception when others then
      cfg_cost := null;
    end;
    if cfg_cost is not null and (cfg_cost < 1 or cfg_cost > 12) then
      cfg_cost := null;
    end if;
  end if;

  if cfg_cost is not null then
    cost := cfg_cost;
  else
    -- 057 CASE block + the Surveyor S1 (analysis, brief) + S3 (interpret, parley) +
    -- S4–S6 (customContent, styleOverhaul, constructSettlement, constructRealm) +
    -- S7 (autonomy) features.
    cost := case feature
      when 'chronicle' then 2
      when 'narrative' then 3
      when 'dailyLife' then 4
      when 'progression' then 5
      when 'narrative_fast' then 2
      when 'dailyLife_fast' then 3
      when 'progression_fast' then 4
      when 'analysis' then 3
      when 'brief' then 4
      when 'interpret' then 5
      when 'parley' then 3
      when 'customContent' then 6
      when 'styleOverhaul' then 3
      when 'constructSettlement' then 6
      when 'constructRealm' then 8
      when 'autonomy' then 4
      else null
    end;
    if cost is null then raise exception 'unknown feature: %', feature; end if;
  end if;

  select role into user_role from public.profiles where id = auth.uid() for update;
  if user_role in ('developer', 'admin') or public.current_user_is_privileged() then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (auth.uid(), 'spend', cost, feature, jsonb_build_object('elevated', true))
      returning id into new_spend_id;
    return jsonb_build_object('ok', true, 'balance', -2, 'spend_id', new_spend_id, 'elevated', true);
  end if;

  current_balance := public.get_credit_balance(auth.uid());
  if current_balance < cost then
    return jsonb_build_object('ok', false, 'reason', 'insufficient_funds', 'balance', coalesce(current_balance, 0));
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (auth.uid(), 'spend', cost, feature, '{}'::jsonb)
    returning id into new_spend_id;
  needed := cost;

  for grant_row in
    select g.id, greatest(g.amount - coalesce(a.amount, 0), 0)::integer as available
    from public.credit_ledger g
    left join (
      select grant_id, sum(amount)::integer as amount
      from public.credit_spend_allocations group by grant_id
    ) a on a.grant_id = g.id
    where g.user_id = auth.uid()
      and g.kind = 'grant'
      and (g.expires_at is null or g.expires_at > now())
      and greatest(g.amount - coalesce(a.amount, 0), 0) > 0
    order by case when g.source = 'monthly_allowance' then 0 else 1 end,
      g.expires_at nulls last, g.created_at
    for update of g
  loop
    allocation := least(needed, grant_row.available);
    if allocation > 0 then
      insert into public.credit_spend_allocations (spend_id, grant_id, amount)
        values (new_spend_id, grant_row.id, allocation);
      needed := needed - allocation;
    end if;
    exit when needed <= 0;
  end loop;
  if needed > 0 then raise exception 'credit allocation failed'; end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (auth.uid(), -cost, feature);
  remaining := public.get_credit_balance(auth.uid());
  update public.profiles set credits = remaining, updated_at = now() where id = auth.uid();
  return jsonb_build_object('ok', true, 'balance', remaining, 'spend_id', new_spend_id, 'elevated', false);
end;
$$;
