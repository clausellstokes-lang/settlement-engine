-- ────────────────────────────────────────────────────────────────────────────
-- 126_email_preferences.sql — per-category email notification preferences +
-- one-click (token) unsubscribe backend (Wave 4d owner item).
--
-- WHY
--   The only email-preference signal today is a single `emailNotifications`
--   boolean threaded through the profile (authSlice). The retention/digest work
--   (Phase 6) needs finer control: a member may want the referral payout mail but
--   not the "your realm stirred" lifecycle nudge. CAN-SPAM / GDPR also require a
--   working one-click unsubscribe on every non-transactional message. This lays
--   the DATA substrate + the token machinery; the digest ENGINE that consults it
--   is Phase 6, and the account UI + unsubscribe route land alongside this in 4d.
--
-- WHAT THIS ADDS (all additive, idempotent, RLS-correct)
--   1. public.email_preferences — one row per user: three MARKETING/lifecycle
--      category flags (product_updates / referral / lifecycle), all default TRUE
--      (opt-out model, matching the existing emailNotifications default), plus a
--      per-user opaque `unsubscribe_token` (unguessable gen_random_uuid bearer
--      credential embedded in List-Unsubscribe links). RLS ENABLED with NO
--      policies + no client table grants — the token never SELECTs to a client;
--      all access is through the SECURITY DEFINER RPCs below (same server-only
--      intent as 066's security_answers).
--   2. get_my_email_preferences() — caller reads their OWN three category flags
--      (auth.uid()), defaulting all-true when no row exists yet. NEVER the token.
--   3. set_my_email_preference(category, enabled) — caller flips ONE of their own
--      category flags; upserts (mints the row + token on first write).
--   4. unsubscribe_via_token(token, category) — the LOGGED-OUT one-click path.
--      Possession of the unguessable token authorizes turning a category (or all)
--      OFF for that user. Opt-OUT only: it can never turn a flag ON, so a leaked
--      link is low-stakes. anon + authenticated (an email client may prefetch it).
--   5. can_email_user(user_id, category) — the Phase-6 digest engine's pre-send
--      gate. service_role ONLY. Defaults TRUE when no row (never sent one yet).
--   6. get_or_mint_unsubscribe_token(user_id) — service_role ONLY. Returns the
--      user's token (minting the row if absent) so the mailer can build the
--      List-Unsubscribe URL. TRANSACTIONAL mail (receipts, password recovery,
--      email confirmation) is exempt from all of this by never consulting
--      can_email_user — only marketing/lifecycle categories are gated.
--
-- Re-runnable: create-if-not-exists / create-or-replace / drop-if-exists.
-- Depends on: auth.users (FK). No pgcrypto needed — the token is gen_random_uuid
--             (Postgres core), so this is pglite-testable without an extension.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. email_preferences table ───────────────────────────────────────────────
-- @rollback: `drop function if exists public.is_allowed_email_category(text);
--   drop table if exists public.email_preferences;` DESTRUCTIVE: deletes every
--   stored per-category preference AND the one-click unsubscribe tokens (users
--   who unsubscribed via token would revert to the single legacy
--   emailNotifications flag). Forward-fix first.
--
-- One row per user. The three flags are the only CATEGORIES a user can opt out
-- of; transactional mail is never represented here (it is always sent). The
-- unsubscribe_token is an opaque, unguessable per-user bearer credential — the
-- server embeds it in List-Unsubscribe links; the client never sees it.
create table if not exists public.email_preferences (
  user_id           uuid        not null references auth.users(id) on delete cascade,
  product_updates   boolean     not null default true,
  referral          boolean     not null default true,
  lifecycle         boolean     not null default true,
  unsubscribe_token uuid        not null default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (user_id)
);

alter table public.email_preferences enable row level security;
-- NO policies: the table is reachable ONLY via the SECURITY DEFINER RPCs below.
-- RLS-on + no-policy denies all direct anon/authenticated access, so the
-- unsubscribe_token can never be SELECTed by a client.

-- Belt-and-suspenders: revoke any inherited privileges from the client roles so
-- even a future broad GRANT cannot expose the token column.
revoke all on table public.email_preferences from anon, authenticated;

-- The token is looked up on the (logged-out) unsubscribe path; make it fast and
-- enforce uniqueness so a token maps to at most one account.
create unique index if not exists email_preferences_unsub_token_idx
  on public.email_preferences (unsubscribe_token);

-- ── helper: the allowed category set ─────────────────────────────────────────
-- IMMUTABLE so every RPC validates the same way and the set lives in one place.
create or replace function public.is_allowed_email_category(p_category text)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select p_category is not null and p_category in (
    'product_updates',
    'referral',
    'lifecycle'
  );
$$;

comment on function public.is_allowed_email_category(text) is
  'True when p_category is one of the three opt-out email categories. Single source of truth the email-preference RPCs validate against.';

-- ── 2. get_my_email_preferences — caller reads their OWN flags ────────────────
-- Returns the three category booleans (NEVER the token). Defaults all-true when
-- the caller has no row yet (nothing minted until their first write), so the
-- account UI shows the honest "subscribed to everything" baseline.
create or replace function public.get_my_email_preferences()
returns table (product_updates boolean, referral boolean, lifecycle boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  return query
    select
      coalesce(ep.product_updates, true),
      coalesce(ep.referral, true),
      coalesce(ep.lifecycle, true)
    from (select v_uid as user_id) base
    left join public.email_preferences ep on ep.user_id = base.user_id;
end;
$$;

revoke all on function public.get_my_email_preferences() from public;
grant execute on function public.get_my_email_preferences() to authenticated;

comment on function public.get_my_email_preferences() is
  'Returns the caller''s three email-category flags (auth.uid()), all-true by default when no row exists. NEVER returns the unsubscribe token.';

-- ── 3. set_my_email_preference — caller flips ONE of their own flags ──────────
-- Upserts the caller's row (minting the token on first write) and sets exactly
-- one validated category column. Dynamic column write is safe: p_category is
-- checked against the fixed allow-list first, so no user string reaches the SQL
-- text unchecked.
create or replace function public.set_my_email_preference(
  p_category text,
  p_enabled  boolean
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_allowed_email_category(p_category) then
    raise exception 'unknown email category: %', p_category;
  end if;
  if p_enabled is null then
    raise exception 'enabled flag is required';
  end if;

  -- Ensure a row exists (mints the token), then set the one validated column.
  insert into public.email_preferences (user_id)
  values (v_uid)
  on conflict (user_id) do nothing;

  execute format(
    'update public.email_preferences set %I = $1, updated_at = now() where user_id = $2',
    p_category
  ) using p_enabled, v_uid;
end;
$$;

revoke all on function public.set_my_email_preference(text, boolean) from public;
grant execute on function public.set_my_email_preference(text, boolean) to authenticated;

comment on function public.set_my_email_preference(text, boolean) is
  'Caller flips ONE of their own email-category flags (auth.uid()). Validates the category against the fixed allow-list, upserts the row (minting the unsubscribe token on first write).';

-- ── 4. unsubscribe_via_token — LOGGED-OUT one-click unsubscribe ───────────────
-- Possession of the unguessable per-user token authorizes turning a category (or
-- 'all') OFF for that user. OPT-OUT ONLY — this function can never enable a flag,
-- so a leaked List-Unsubscribe link is low-stakes (worst case: an unwanted
-- unsubscribe the user can undo from Account). Granted to anon + authenticated
-- because an email client may follow the link without a session. Returns whether
-- the token matched so the route can render a confirmed / not-found page.
create or replace function public.unsubscribe_via_token(
  p_token    uuid,
  p_category text default 'all'
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid;
begin
  if p_token is null then
    return false;
  end if;
  if p_category <> 'all' and not public.is_allowed_email_category(p_category) then
    return false;
  end if;

  select ep.user_id into v_uid
  from public.email_preferences ep
  where ep.unsubscribe_token = p_token
  limit 1;
  if v_uid is null then
    return false;  -- unknown / rotated token
  end if;

  if p_category = 'all' then
    update public.email_preferences
      set product_updates = false, referral = false, lifecycle = false, updated_at = now()
      where user_id = v_uid;
  else
    execute format(
      'update public.email_preferences set %I = false, updated_at = now() where user_id = $1',
      p_category
    ) using v_uid;
  end if;

  return true;
end;
$$;

revoke all on function public.unsubscribe_via_token(uuid, text) from public;
grant execute on function public.unsubscribe_via_token(uuid, text) to anon, authenticated;

comment on function public.unsubscribe_via_token(uuid, text) is
  'LOGGED-OUT one-click unsubscribe. Possession of the unguessable token turns a category (or ''all'') OFF for that user. OPT-OUT ONLY — never enables a flag. anon + authenticated; returns true only when the token matched.';

-- ── 5. can_email_user — the Phase-6 digest engine's pre-send gate ─────────────
-- service_role ONLY. Returns whether the given non-transactional category is
-- enabled for the user; defaults TRUE when no row exists (opt-out model). The
-- digest engine calls this before dispatching a marketing/lifecycle message.
-- Transactional mail (receipts, recovery, confirmation) NEVER calls this.
create or replace function public.can_email_user(
  p_user_id  uuid,
  p_category text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_enabled boolean;
begin
  if p_user_id is null or not public.is_allowed_email_category(p_category) then
    return false;
  end if;

  execute format(
    'select %I from public.email_preferences where user_id = $1',
    p_category
  ) into v_enabled using p_user_id;

  -- No row → never touched their prefs → the opt-out default is subscribed.
  return coalesce(v_enabled, true);
end;
$$;

revoke all on function public.can_email_user(uuid, text) from public;
revoke all on function public.can_email_user(uuid, text) from anon, authenticated;
grant execute on function public.can_email_user(uuid, text) to service_role;

comment on function public.can_email_user(uuid, text) is
  'Phase-6 digest pre-send gate, service_role ONLY. True when the category is enabled for the user (default true when no row). Transactional mail never calls this.';

-- ── 6. get_or_mint_unsubscribe_token — mailer reads the List-Unsubscribe token ─
-- service_role ONLY. Returns the user's opaque token, minting the row (and token)
-- if absent, so every outbound marketing/lifecycle message can carry a working
-- one-click unsubscribe URL.
create or replace function public.get_or_mint_unsubscribe_token(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_token uuid;
begin
  if p_user_id is null then
    raise exception 'user id is required';
  end if;

  insert into public.email_preferences (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select ep.unsubscribe_token into v_token
  from public.email_preferences ep
  where ep.user_id = p_user_id
  limit 1;

  return v_token;
end;
$$;

revoke all on function public.get_or_mint_unsubscribe_token(uuid) from public;
revoke all on function public.get_or_mint_unsubscribe_token(uuid) from anon, authenticated;
grant execute on function public.get_or_mint_unsubscribe_token(uuid) to service_role;

comment on function public.get_or_mint_unsubscribe_token(uuid) is
  'Mailer helper, service_role ONLY. Returns the user''s opaque unsubscribe token, minting the row + token if absent, for building the List-Unsubscribe URL.';
