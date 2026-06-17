-- ────────────────────────────────────────────────────────────────────────────
-- 036_analytics_core.sql — first-party analytics sink + privacy/identity model.
--
-- Companion to docs/simulation-intelligence-layer.md (§2 identity, §3 consent,
-- §4a core tables). Plane 1 (product telemetry) + the edit_events half of Plane
-- 2 (research). settlement_snapshots + the research schema land in 037; rollups
-- in 038; cron in 039.
--
-- Identity model: events carry a RANDOM actor_id. Two service-role-only mapping
-- tables tie real identities to actors; deleting a mapping row makes that
-- actor's history permanently anonymous, and purge_analytics_for_user() is the
-- hard-erase. The client never sends a raw user id to this sink.
--
-- Storage posture: plain tables + BRIN/GIN + (later) nightly rollups + monthly
-- prune. No partitioning, no ClickHouse — see the doc's scale math.
--
-- House security pattern (mirrors migration 029): every table here has RLS
-- ENABLED with ZERO policies and grants revoked from anon/authenticated, so the
-- ONLY access path is the service-role edge function. SECURITY DEFINER functions
-- pin search_path. Re-runnable (IF NOT EXISTS / CREATE OR REPLACE).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Consent column (§3) ──────────────────────────────────────────────────
-- Mirrors the email_notifications precedent (migration 018). Three flags; the
-- server clamps the effective tier to min(client-asserted, this).
alter table public.profiles
  add column if not exists telemetry_consent jsonb not null
    default '{"essential": true, "research": false, "ai_prose": false}'::jsonb;

-- ── 2. Identity + device mapping (§2) ───────────────────────────────────────
create table if not exists public.analytics_identity_links (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  actor_id   uuid not null unique,
  created_at timestamptz not null default now()
);

-- device_key = sha256(ANALYTICS_HASH_PEPPER || sf_view_token); the pepper lives
-- only in edge-function secrets, so a DB dump alone can't correlate tokens.
create table if not exists public.analytics_device_links (
  device_key text primary key,
  actor_id   uuid not null,
  created_at timestamptz not null default now()
);

alter table public.analytics_identity_links enable row level security;
alter table public.analytics_device_links   enable row level security;
-- RLS-on + zero policies => deny all direct anon/authenticated access.

-- ── 3. analytics_events — the canonical sink (§4a) ──────────────────────────
create table if not exists public.analytics_events (
  id           bigint generated always as identity primary key,
  event        text not null check (event ~ '^[a-z][a-z0-9_]{2,63}$'),
  actor_id     uuid,                       -- null => purged/orphaned (kept, anonymous)
  session_id   uuid,
  subject_id   uuid,                       -- settlement/map uuid when relevant; no FK
  props        jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 8192),
  consent_tier text not null check (consent_tier in ('product', 'research')),
  country      char(2),                    -- server-stamped from cf-ipcountry; IP never stored
  app_version  text,
  events_rev   smallint not null default 1,
  client_ts    timestamptz,               -- client clock (display only)
  created_at   timestamptz not null default now(),  -- server clock (canonical)
  batch_id     uuid not null,
  seq          smallint not null,
  unique (batch_id, seq)                   -- idempotency: retried batches no-op
);
create index if not exists analytics_events_event_time on public.analytics_events (event, created_at desc);
create index if not exists analytics_events_actor_time on public.analytics_events (actor_id, created_at desc) where actor_id is not null;
create index if not exists analytics_events_subject    on public.analytics_events (subject_id) where subject_id is not null;
create index if not exists analytics_events_brin_time  on public.analytics_events using brin (created_at);
create index if not exists analytics_events_props_gin  on public.analytics_events using gin (props jsonb_path_ops);
alter table public.analytics_events enable row level security;

-- ── 4. edit_events — typed research-plane edit rows (§4a) ────────────────────
-- snapshot_id is a SOFT reference (no FK): settlement_snapshots arrives in 037
-- and snapshots are independently prunable/deletable.
create table if not exists public.edit_events (
  id              bigint generated always as identity primary key,
  actor_id        uuid,
  session_id      uuid,
  settlement_uuid uuid not null,
  snapshot_id     bigint,
  kind            text not null check (kind in (
    'rename-npc','rename-faction','rename-settlement',
    'add-institution','remove-institution',
    'add-resource','remove-resource',
    'add-stressor','remove-stressor','edit-prose')),   -- verbatim EDIT_KINDS
  target_kind     text,
  payload_redacted jsonb not null default '{}'::jsonb check (pg_column_size(payload_redacted) <= 2048),
  cascade         jsonb,
  edit_seq        smallint not null,
  reverted        boolean not null default false,
  consent_tier    text not null default 'research' check (consent_tier = 'research'),
  client_ts       timestamptz,
  created_at      timestamptz not null default now(),
  batch_id        uuid not null,
  seq             smallint not null,
  unique (batch_id, seq)
);
create index if not exists edit_events_kind_time  on public.edit_events (kind, created_at desc);
create index if not exists edit_events_settlement on public.edit_events (settlement_uuid, edit_seq);
alter table public.edit_events enable row level security;

-- ── 5. Ingest rate buckets + check (§4a) ────────────────────────────────────
create table if not exists public.ingest_rate_buckets (
  bucket_key   text not null,
  window_start timestamptz not null,
  count        integer not null default 0,
  primary key (bucket_key, window_start)
);
create index if not exists ingest_rate_buckets_window on public.ingest_rate_buckets (window_start);
alter table public.ingest_rate_buckets enable row level security;

-- Atomic consume-and-check: increments the bucket for the current window and
-- returns whether the caller is still under the limit. Single row-locked upsert
-- (no TOCTOU). Default 120 batches/hr per key (conservative; false negatives
-- cheaper than blocking real users).
create or replace function public.ingest_check_rate(
  p_key            text,
  p_max            integer default 120,
  p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window timestamptz;
  v_count  integer;
begin
  if p_window_seconds is null or p_window_seconds < 1 then p_window_seconds := 3600; end if;
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.ingest_rate_buckets as b (bucket_key, window_start, count)
  values (coalesce(nullif(btrim(p_key), ''), 'anon'), v_window, 1)
  on conflict (bucket_key, window_start) do update set count = b.count + 1
  returning count into v_count;
  return v_count <= p_max;
end;
$$;
revoke all on function public.ingest_check_rate(text, integer, integer) from public;
grant execute on function public.ingest_check_rate(text, integer, integer) to service_role;

-- ── 6. Erasure (§2) ─────────────────────────────────────────────────────────
-- Hard-erase a user's analytics: delete events/edits/snapshots by actor, then
-- the mapping rows. Returns per-table counts. SECURITY DEFINER, service-role
-- only. The on-delete-cascade on the identity link is the belt (account deletion
-- instantly orphans history); this function is the suspenders.
create or replace function public.purge_analytics_for_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid;
  v_events integer := 0;
  v_edits  integer := 0;
begin
  select actor_id into v_actor from public.analytics_identity_links where user_id = p_user_id;
  if v_actor is null then
    return jsonb_build_object('events', 0, 'edits', 0, 'note', 'no actor mapping');
  end if;
  delete from public.analytics_events where actor_id = v_actor;
  get diagnostics v_events = row_count;
  delete from public.edit_events where actor_id = v_actor;
  get diagnostics v_edits = row_count;
  -- settlement_snapshots (037) are scrubbed there if present; soft no-op if absent.
  begin
    execute 'delete from public.settlement_snapshots where actor_id = $1' using v_actor;
  exception when undefined_table then null;
  end;
  delete from public.analytics_device_links where actor_id = v_actor;
  delete from public.analytics_identity_links where user_id = p_user_id;
  return jsonb_build_object('events', v_events, 'edits', v_edits, 'actor', v_actor);
end;
$$;
revoke all on function public.purge_analytics_for_user(uuid) from public;
grant execute on function public.purge_analytics_for_user(uuid) to service_role;
