-- ────────────────────────────────────────────────────────────────────────────
-- 139_surveyor_entitlement_and_byok.sql — Surveyor S1 commercial: the entitlement
-- gate (interface only) + the BYOK vault (encrypted at rest, server-only decrypt).
--
-- WHY THIS EXISTS
--   DESIGN_AI_CONTROL_SURFACE §3/§4 (recorded decisions):
--     • The Surveyor tier gates the INTERFACE, never the sim. Rather than widen
--       profiles.tier's CHECK ('free','premium') — which ripples into TIER_GATE,
--       tierFacts, and every CHECK-pinned RLS clause — this adds a SEPARATE
--       entitlement table + a has_surveyor_entitlement() definer read gate (mirrors
--       has_dossier_entitlement). The sim never reads it; only the interface + the
--       ai-analyst edge function do. Constitution law 3 (sim is tier-blind) untouched.
--     • BYOK: the user's provider key lives ENCRYPTED server-side only, is decrypted
--       inside the edge function per request, and is NEVER selectable by the user,
--       never in client state, never in world state, never in any corpus.
--
-- SECURITY POSTURE
--   surveyor_entitlements: RLS owner-read own row; service-role writes (provisioning is
--     owner-gated / concierge-v1, like founder seats). No self-grant.
--   surveyor_byok_keys: RLS ON with ZERO select policy → the ciphertext is NEVER
--     readable by the user (default-deny). The plaintext is reachable ONLY through
--     surveyor_byok_get(), granted to service_role ONLY (the edge). The user sets/clears
--     their own key through the definer set/clear RPCs but can never read it back.
--
-- ENCRYPTION (vetoable — security posture is owner territory)
--   Symmetric pgcrypto (pgp_sym_encrypt/decrypt) under a server passphrase read from the
--   `app.settings.byok_secret` GUC (a Supabase Functions/DB secret — NEVER stored in the
--   DB or this migration). FAIL CLOSED: if the secret is unset, set/get RAISE, so BYOK is
--   simply unavailable until the operator configures it. An owner who prefers
--   pgsodium/Supabase Vault can swap the two crypto bodies without touching the surface.
--   Bodies are plpgsql (late-bound) so this migration DEFINES cleanly even where pgcrypto
--   is absent (pglite/migrationSequenceAll) — the crypto resolves only at CALL time.
--
-- Depends on: auth.users. Re-runnable. @rollback: drop the two tables + four functions.
-- ────────────────────────────────────────────────────────────────────────────

-- pgcrypto is standard on Supabase; guard the create so a test env without it (pglite)
-- still applies this migration (the function bodies are late-bound plpgsql).
do $$
begin
  create extension if not exists pgcrypto;
exception when insufficient_privilege or undefined_file or feature_not_supported then
  raise notice 'pgcrypto unavailable here (test env) — BYOK crypto resolves at call time in prod';
end $$;

-- ── surveyor entitlements (interface gate) ─────────────────────────────────────
create table if not exists public.surveyor_entitlements (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  status      text not null default 'active' check (status in ('active','revoked')),
  source      text,                          -- 'founder' | 'subscription' | 'grant' | …
  granted_at  timestamptz not null default now(),
  revoked_at  timestamptz
);

alter table public.surveyor_entitlements enable row level security;

comment on table public.surveyor_entitlements is
  'Surveyor interface entitlement (SEPARATE from profiles.tier; the sim never reads it). Owner-readable; service-role writes. Gates the AI control surface, not the simulation.';

drop policy if exists "Owner reads own surveyor entitlement" on public.surveyor_entitlements;
create policy "Owner reads own surveyor entitlement" on public.surveyor_entitlements
  for select
  using (auth.uid() = user_id);

create or replace function public.has_surveyor_entitlement()
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v_caller uuid;
begin
  v_caller := auth.uid();
  if v_caller is null then return false; end if;
  return exists (
    select 1 from public.surveyor_entitlements
    where user_id = v_caller and status = 'active'
  );
end;
$$;

revoke all on function public.has_surveyor_entitlement() from public;
grant execute on function public.has_surveyor_entitlement() to authenticated;

comment on function public.has_surveyor_entitlement is
  'True iff the CALLER holds an active Surveyor entitlement. The interface gate for the AI control surface; the sim never calls it.';

-- ── BYOK vault (encrypted at rest; server-only decrypt) ────────────────────────
create table if not exists public.surveyor_byok_keys (
  user_id     uuid not null references auth.users(id) on delete cascade,
  provider    text not null default 'anthropic',
  ciphertext  bytea not null,                -- pgp_sym_encrypt of the raw key
  created_at  timestamptz not null default now(),
  rotated_at  timestamptz not null default now(),
  primary key (user_id, provider)
);

-- RLS ON with NO policy → the ciphertext is NEVER readable by any non-superuser
-- (default-deny). Reads happen only through the SECURITY DEFINER get RPC (service-role).
alter table public.surveyor_byok_keys enable row level security;

comment on table public.surveyor_byok_keys is
  'BYOK vault: the user''s provider key, ENCRYPTED at rest. RLS ON + zero policy → the ciphertext is never selectable. Decrypted ONLY by surveyor_byok_get() (service-role, per request). Never in client state, world state, or any corpus.';

-- The server passphrase — read from a GUC secret, never stored. Fail-closed if unset.
create or replace function public._surveyor_byok_secret()
returns text
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare v text;
begin
  v := nullif(btrim(coalesce(current_setting('app.settings.byok_secret', true), '')), '');
  if v is null then
    raise exception 'BYOK is not configured (app.settings.byok_secret unset)';
  end if;
  return v;
end;
$$;
revoke all on function public._surveyor_byok_secret() from public;
-- not granted to anyone: reachable only from the definer set/get functions below.

-- The user sets/rotates their OWN key. The plaintext is encrypted and stored; it is
-- never returned. Grant to authenticated (a user manages their own key).
create or replace function public.surveyor_byok_set(p_provider text, p_key text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_provider text;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_key is null or btrim(p_key) = '' then raise exception 'key is required'; end if;
  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  insert into public.surveyor_byok_keys (user_id, provider, ciphertext, created_at, rotated_at)
  values (v_uid, v_provider, pgp_sym_encrypt(p_key, public._surveyor_byok_secret()), now(), now())
  on conflict (user_id, provider)
  do update set ciphertext = excluded.ciphertext, rotated_at = now();
  return true;
end;
$$;
revoke all on function public.surveyor_byok_set(text, text) from public;
grant execute on function public.surveyor_byok_set(text, text) to authenticated;

-- The user clears their OWN key (deletion is a §3 requirement).
create or replace function public.surveyor_byok_clear(p_provider text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  delete from public.surveyor_byok_keys
  where user_id = v_uid and provider = coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  return true;
end;
$$;
revoke all on function public.surveyor_byok_clear(text) from public;
grant execute on function public.surveyor_byok_clear(text) to authenticated;

-- The edge function decrypts a specific user's key PER REQUEST. SERVICE-ROLE ONLY —
-- the user can never read their own plaintext back (§3: never in client state).
create or replace function public.surveyor_byok_get(p_user uuid, p_provider text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_cipher bytea;
begin
  select ciphertext into v_cipher
  from public.surveyor_byok_keys
  where user_id = p_user and provider = coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  if v_cipher is null then return null; end if;
  return pgp_sym_decrypt(v_cipher, public._surveyor_byok_secret());
end;
$$;
revoke all on function public.surveyor_byok_get(uuid, text) from public;
grant execute on function public.surveyor_byok_get(uuid, text) to service_role;

comment on function public.surveyor_byok_get is
  'Decrypt a user''s BYOK provider key. SERVICE-ROLE ONLY — the ai-analyst edge function calls this per request and MUST NOT log the result. The user can never read their own plaintext back.';
