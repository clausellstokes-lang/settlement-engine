-- ════════════════════════════════════════════════════════════════════════════
-- 203 — THE SCRIBE: ONE RENDER, ONE CHARGE (the render session)
-- ════════════════════════════════════════════════════════════════════════════
-- ⛔ WRITTEN, NEVER APPLIED. `supabase db push` is the owner's act and has not been taken for
-- this file, for 202, or for 201. Nothing here runs anywhere today.
--
-- ── THE DEFECT THIS CLOSES (measured at lane-scribe 9a8ff7280) ──────────────────────────────
-- A render of one settlement's dossier is SEVEN TO TEN edge invocations, one per firing tab
-- (`src/store/scribeTransport.js` loops `firingTabs`), and every invocation ran the whole
-- `runCreditedCall` with its own `spend_credits('dossierProse')`. So migration 202's own header
-- ("one render of a settlement's dossier costs five credits whatever it draws") and the redraw
-- button's label were FALSE about the price of a render: a seven-tab render spent 35 credits and
-- a ten-tab render 50. The once-per-account FREE FIRST RENDER (202) was consumed by the FIRST
-- TAB, so a new account's free taste paid for the other six.
--
-- ── THE CURE: A SERVER-MINTED RENDER SESSION ────────────────────────────────────────────────
-- The whole-render identity is the tuple the OPEN TRIGGER already keys on
-- (`attemptKeyOf(saveId, advanceSeq, renderedFor)` in `src/store/scribeOpenTrigger.js`), plus the
-- account. The FIRST invocation to present that tuple inside the TTL mints the session and is
-- told `first: true`; every later tab of the same render is told `first: false` and SKIPS both
-- the spend and the free claim. The token is never client-supplied: the client sends the same
-- body it already sent, and the server derives the identity from it, so a forged token cannot buy
-- a render and a dropped one cannot double-charge.
--
-- ⭐ THE DATABASE IS THE SERIALISER, not the edge. Two tabs racing the first slot both run
-- `insert ... on conflict do nothing` against ONE partial unique index; exactly one insert
-- returns a row, and the loser re-selects the winner's session. There is no read-then-write
-- window in the edge function to lose.
--
-- ⭐ WHY `superseded_at` AND NOT A DELETE. An expired session must stop holding the tuple's slot,
-- but the row itself is the record of a render that happened: `scribe_usage_precheck` below counts
-- LANDED sessions per day, and deleting expired rows would delete the day's history along with
-- the slot. So the slot is released by stamping `superseded_at` and the unique index is PARTIAL on
-- `superseded_at is null`. Nothing is ever deleted on this path.
--
-- ⛔ AND NOTHING HERE IS A TIER GATE. This file makes the price the button quotes true. Whether
-- the Scribe is sold as a tier, at what price, and with what allowance is design §12 item 16 and
-- is the OWNER's signature (docs/DESIGN_SCRIBE_TIER_PROPOSAL.md). No entitlement is read here.
--
-- Depends on: 057 (account_is_active), 078 (ai_usage_events), 002 (system_config), auth.users.
-- Re-runnable (create-if-not-exists + create-or-replace + on-conflict).
-- @rollback: drop function if exists public.scribe_usage_precheck(uuid);
--   drop function if exists public.abort_scribe_render(uuid);
--   drop function if exists public.close_scribe_render_tab(uuid, uuid, boolean);
--   drop function if exists public.open_scribe_render(uuid, text, integer, text, text, integer);
--   drop table if exists public.scribe_render_sessions;
--   delete from public.system_config where key = 'scribe_daily_render_cap';
--   Safe at any time while FLAGS.scribe is dark: nothing calls any of it.

-- ── 1. THE SESSION TABLE ────────────────────────────────────────────────────────────────────
create table if not exists public.scribe_render_sessions (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  save_id        text        not null,
  advance_seq    integer     not null,
  rendered_for   text        not null,
  engine_version text        not null default '',
  -- The ONE spend of the whole render, stamped when the first tab lands. Null on a free render.
  spend_id       uuid,
  -- Null until the first tab settles; true when the account's free first render paid for this one.
  free           boolean,
  tabs_expected  integer     not null default 0,
  tabs_landed    integer     not null default 0,
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null default now() + interval '15 minutes',
  -- Set when the session stops holding the tuple's slot: the TTL ran out, or the first tab
  -- failed and landed nothing. The row survives as the record; only the slot is released.
  superseded_at  timestamptz
);

-- ⭐ THE ONE SERIALISER. Partial on `superseded_at is null`, so one LIVE session per
-- (account, save, epoch, seed) and any number of retired ones.
create unique index if not exists scribe_render_sessions_live_key
  on public.scribe_render_sessions (user_id, save_id, advance_seq, rendered_for)
  where superseded_at is null;

-- The per-day count the fair-use governor reads, and the only other way this table is queried.
create index if not exists scribe_render_sessions_user_created_idx
  on public.scribe_render_sessions (user_id, created_at);

alter table public.scribe_render_sessions enable row level security;

-- Deny-all: RLS is ON and NO policy exists, so anon/authenticated see nothing even if a grant is
-- ever added by accident. The revokes are the second belt; the edge reaches it through the
-- definer functions below with its service-role client.
revoke all on table public.scribe_render_sessions from anon;
revoke all on table public.scribe_render_sessions from authenticated;
grant select, insert, update on table public.scribe_render_sessions to service_role;

comment on table public.scribe_render_sessions is
  'ONE RENDER, ONE CHARGE (203). A render of a settlement''s dossier is many tab invocations of scribe-render; the first to present (user, save, advance_seq, rendered_for) inside the TTL mints this row and is the only one that spends. Service-role only; written, never applied while FLAGS.scribe is dark.';

-- ── 2. open_scribe_render — THE FIRST TAB MINTS, THE REST JOIN ──────────────────────────────
-- Returns {session_id, first, free, tabs_landed}. `first` is true for EXACTLY ONE caller per live
-- tuple: the one whose insert won the partial unique index. An expired live row is superseded
-- first, so the next render of the same epoch after the TTL is a fresh, chargeable render.
create or replace function public.open_scribe_render(
  p_user         uuid,
  p_save         text,
  p_seq          integer,
  p_rendered_for text,
  p_engine       text default '',
  p_tabs         integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  v_id      uuid;
  v_free    boolean;
  v_landed  integer;
  v_first   boolean;
  v_try     integer := 0;
begin
  if p_user is null or coalesce(btrim(p_save), '') = '' or coalesce(btrim(p_rendered_for), '') = '' then
    raise exception 'open_scribe_render requires a user, a save and a seed';
  end if;

  -- Retire an EXPIRED live session for this tuple so the slot is free to mint again. The row is
  -- kept (it is the day's record); only its hold on the unique index is released.
  update public.scribe_render_sessions
     set superseded_at = now()
   where user_id = p_user
     and save_id = p_save
     and advance_seq = p_seq
     and rendered_for = p_rendered_for
     and superseded_at is null
     and expires_at <= now();

  -- ⭐ THE RACE IS DECIDED BY THE INDEX. `on conflict do nothing` leaves FOUND false for the
  -- loser, which then reads the winner's row. The loop exists for the one interleaving where the
  -- winner is superseded between the failed insert and the read; it is bounded, never a spin.
  loop
    v_try := v_try + 1;

    insert into public.scribe_render_sessions
      (user_id, save_id, advance_seq, rendered_for, engine_version, tabs_expected)
    values
      (p_user, p_save, p_seq, p_rendered_for, coalesce(p_engine, ''), greatest(coalesce(p_tabs, 0), 0))
    on conflict (user_id, save_id, advance_seq, rendered_for) where superseded_at is null
      do nothing
    returning id into v_id;

    if found then
      v_first := true;
      v_free := null;
      v_landed := 0;
      exit;
    end if;

    select s.id, s.free, s.tabs_landed
      into v_id, v_free, v_landed
      from public.scribe_render_sessions s
     where s.user_id = p_user
       and s.save_id = p_save
       and s.advance_seq = p_seq
       and s.rendered_for = p_rendered_for
       and s.superseded_at is null
     limit 1;

    if found then
      v_first := false;
      exit;
    end if;

    if v_try >= 3 then
      raise exception 'open_scribe_render could not mint or join a session';
    end if;
  end loop;

  return jsonb_build_object(
    'session_id', v_id,
    'first', v_first,
    'free', v_free,
    'tabs_landed', coalesce(v_landed, 0)
  );
end;
$fn$;

revoke all on function public.open_scribe_render(uuid, text, integer, text, text, integer) from public, anon, authenticated;
grant execute on function public.open_scribe_render(uuid, text, integer, text, text, integer) to service_role;

comment on function public.open_scribe_render(uuid, text, integer, text, text, integer) is
  'Mint or join the render session for (user, save, advance_seq, rendered_for) (203). Returns {session_id, first, free, tabs_landed}; `first` is true for exactly one caller per live tuple and is the only caller that may spend. Service-role only.';

-- ── 3. close_scribe_render_tab — ONE TAB LANDED ─────────────────────────────────────────────
-- Counts the landing and, on the first tab, stamps what the render cost. `coalesce` keeps the
-- FIRST answer, so a later tab passing nulls can never erase the receipt.
create or replace function public.close_scribe_render_tab(
  p_session uuid,
  p_spend   uuid    default null,
  p_free    boolean default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
begin
  if p_session is null then return; end if;
  update public.scribe_render_sessions
     set tabs_landed = tabs_landed + 1,
         spend_id    = coalesce(spend_id, p_spend),
         free        = coalesce(free, p_free)
   where id = p_session;
end;
$fn$;

revoke all on function public.close_scribe_render_tab(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.close_scribe_render_tab(uuid, uuid, boolean) to service_role;

comment on function public.close_scribe_render_tab(uuid, uuid, boolean) is
  'Record that one tab of a render session landed (203), stamping the render''s single spend id and free flag the first time they are supplied. Service-role only.';

-- ── 4. abort_scribe_render — THE FIRST TAB FAILED AND NOTHING LANDED ────────────────────────
-- ⭐ THIS IS A MONEY DECISION, WHICH IS WHY IT IS SQL AND NOT AN UPDATE SHAPED IN THE EDGE. It
-- decides whether the reader's NEXT attempt at this epoch is charged again. Guarded on
-- `tabs_landed = 0`: if any tab of this session has landed, the render DID land, the charge stands
-- and the session is not aborted — which is also what tells the edge whether to give the free
-- claim back. Returns true only when this call released the slot.
create or replace function public.abort_scribe_render(p_session uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
begin
  if p_session is null then return false; end if;
  update public.scribe_render_sessions
     set superseded_at = now()
   where id = p_session
     and superseded_at is null
     and tabs_landed = 0;
  return found;
end;
$fn$;

revoke all on function public.abort_scribe_render(uuid) from public, anon, authenticated;
grant execute on function public.abort_scribe_render(uuid) to service_role;

comment on function public.abort_scribe_render(uuid) is
  'Release a render session whose first tab landed nothing (203), so the reader''s next attempt is a fresh render. Refuses when any tab has landed. Returns true only when this call released it. Service-role only.';
