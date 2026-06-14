-- ────────────────────────────────────────────────────────────────────────────
-- 037_settlement_snapshots.sql — structural snapshot store + research schema.
--
-- Companion to docs/simulation-intelligence-layer.md §4b. Hybrid layout:
-- normalized HOT columns for everything dashboards GROUP BY, plus one redacted
-- `structural` jsonb for everything researchers mine. Product-tier rows carry
-- the MINIMAL form (hot columns only); the full structural payload requires
-- research consent and is clamped server-side at ingest.
--
-- Privacy: the `structural` blob is built client-side by the ALLOWLIST extractor
-- (src/lib/structuralFingerprint.js) — prose/names/secrets cannot enter; a
-- redaction canary test proves it. RLS-on + zero policies => service-role only.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.settlement_snapshots (
  id                bigint generated always as identity primary key,
  actor_id          uuid,
  session_id        uuid,
  settlement_uuid   uuid not null,
  trigger_event_id  bigint,            -- co-occurring analytics_events.id (no FK; events get pruned)
  capture_point     text not null check (capture_point in
    ('generated','saved','canonized','exported','ai_polished','pulse_advanced')),
  consent_tier      text not null check (consent_tier in ('product','research')),
  schema_version    text,
  generator_version text,
  seed              text,              -- research-tier only; replays procedural output, never user content
  tier              text,
  population_band   text,
  -- hot columns (dashboards GROUP BY these)
  prosperity        text,
  food_resilience   smallint,
  legitimacy        smallint,
  defense_military  smallint,
  defense_monster   smallint,
  defense_internal  smallint,
  defense_economic  smallint,
  defense_magical   smallint,
  faction_count     smallint,
  institution_count smallint,
  npc_count         smallint,
  condition_count   smallint,
  stressor_count    smallint,
  condition_archetypes text[],
  campaign_phase    text,
  narrative_mode    text,
  ai_violation_count smallint,
  structural        jsonb not null default '{}'::jsonb check (pg_column_size(structural) <= 32768),
  fingerprint_hash  text not null,
  created_at        timestamptz not null default now(),
  unique (settlement_uuid, capture_point, fingerprint_hash)   -- unchanged re-capture = no-op
);
create index if not exists snapshots_capture_time   on public.settlement_snapshots (capture_point, created_at desc);
create index if not exists snapshots_settlement     on public.settlement_snapshots (settlement_uuid, created_at);
create index if not exists snapshots_actor          on public.settlement_snapshots (actor_id) where actor_id is not null;
create index if not exists snapshots_archetypes_gin on public.settlement_snapshots using gin (condition_archetypes);
alter table public.settlement_snapshots enable row level security;

-- ── research schema — consent filtering as STRUCTURE, not a forgettable WHERE ──
create schema if not exists research;

create or replace view research.snapshots as
  select id, capture_point, schema_version, generator_version, seed, tier, population_band,
         prosperity, food_resilience, legitimacy, faction_count, institution_count,
         npc_count, condition_count, stressor_count, condition_archetypes,
         campaign_phase, narrative_mode, ai_violation_count, structural, fingerprint_hash, created_at
    from public.settlement_snapshots
   where consent_tier = 'research';   -- actor_id / session_id deliberately NOT exposed

create or replace view research.edits as
  select id, settlement_uuid, kind, target_kind, payload_redacted, cascade,
         edit_seq, reverted, created_at
    from public.edit_events;          -- research-only by check constraint (migration 036)

-- service-role only (no anon/authenticated grants on the schema or views)
revoke all on schema research from public;
grant usage on schema research to service_role;
grant select on research.snapshots to service_role;
grant select on research.edits to service_role;
