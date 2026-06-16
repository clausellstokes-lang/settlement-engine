-- ────────────────────────────────────────────────────────────────────────────
-- 041_system_mutation_capture.sql — Wave 1 of the "measure what the CODE does"
-- expansion (companion to 036–040). Adds:
--
--   • world_pulse_effects — a research-tier per-effect MUTATION LEDGER. The pulse
--     engine computes a rich record every tick (per-effect outcomes, magnitudes,
--     genesis) that was discarded; this stores one redacted row per applied
--     outcome. RLS-on + zero policies => service-role only, exactly like
--     analytics_events / edit_events. The client allowlist extractor
--     (src/lib/pulseFingerprint.js) guarantees no names/prose/coords enter.
--
--   • settlement_snapshots.config_signature / used_random_sentinels — the
--     deterministic, SEED-INDEPENDENT grouping key for "output distribution from
--     the EXACT SAME configuration". (The same key also rides generation_completed
--     props for the all-users / essential plane.)
--
--   • report_* functions for the new planes (pulse mutations, stressor genesis,
--     proposal accept/block, per-config variance), mirroring the 040 posture:
--     SECURITY DEFINER, hardcoded allowlists (anti-injection), service-role only.
-- ────────────────────────────────────────────────────────────────────────────

-- ════════════════════════════════════════════════════════════════════════════
-- world_pulse_effects — per-effect mutation ledger (research tier)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.world_pulse_effects (
  id                bigint generated always as identity primary key,
  actor_id          uuid,
  session_id        uuid,
  settlement_uuid   uuid,
  tick              smallint,
  interval          text,
  -- classification (all fixed catalog enums / bands — never names or prose)
  effect_kind       text,            -- birth|spread|escalate|residual|tier_change|npc_action|…
  subject_kind      text,            -- stressor|condition|npc|faction|relationship|population|tier|resource|institution|power_transfer|narrative
  candidate_type    text,            -- catalog candidate id (e.g. stressor_birth_famine)
  rule_family       text,
  stressor_type     text,
  genesis           text,            -- world_pulse|regional_propagation|party|…
  apply_mode        text,            -- auto|proposal
  was_proposal      boolean,
  severity_band     text,
  probability_band  text,
  population_delta_band text,
  tier_direction    text,            -- promotion|demotion|null
  affected_settlement_count smallint,
  consent_tier      text not null default 'research' check (consent_tier = 'research'),
  app_version       text,
  client_ts         timestamptz,
  created_at        timestamptz not null default now(),
  batch_id          uuid,
  seq               integer,
  unique (batch_id, seq)             -- idempotent re-ingest, like analytics_events
);
create index if not exists wpe_created      on public.world_pulse_effects (created_at desc);
create index if not exists wpe_genesis      on public.world_pulse_effects (genesis, created_at desc);
create index if not exists wpe_subject      on public.world_pulse_effects (subject_kind, created_at desc);
create index if not exists wpe_stressor     on public.world_pulse_effects (stressor_type) where stressor_type is not null;
create index if not exists wpe_settlement   on public.world_pulse_effects (settlement_uuid) where settlement_uuid is not null;
alter table public.world_pulse_effects enable row level security;  -- zero policies => service-role only

-- research schema view (consent filtering as STRUCTURE; mirrors research.edits)
create or replace view research.pulse_effects as
  select id, settlement_uuid, tick, interval, effect_kind, subject_kind, candidate_type,
         rule_family, stressor_type, genesis, apply_mode, was_proposal, severity_band,
         probability_band, population_delta_band, tier_direction, affected_settlement_count, created_at
    from public.world_pulse_effects;     -- research-only by check constraint
grant select on research.pulse_effects to service_role;

-- ── settlement_snapshots: the variance grouping key ──────────────────────────
alter table public.settlement_snapshots add column if not exists config_signature text;
alter table public.settlement_snapshots add column if not exists used_random_sentinels boolean;
create index if not exists snapshots_config_sig on public.settlement_snapshots (config_signature) where config_signature is not null;

-- ════════════════════════════════════════════════════════════════════════════
-- report_pulse_mutations — per-effect breakdown over the ledger.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_pulse_mutations(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(effect_kind text, subject_kind text, genesis text, apply_mode text, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(effect_kind, 'unknown'), coalesce(subject_kind, 'unknown'),
         coalesce(genesis, 'unknown'), coalesce(apply_mode, 'unknown'), count(*)::bigint
    from public.world_pulse_effects
   where created_at >= p_from and created_at < (p_to + 1)
   group by 1, 2, 3, 4
   order by 5 desc;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_stressor_genesis — per-type genesis, from BOTH planes:
--   • generation_completed.props.stressor_genesis  (essential, all users)
--   • world_pulse_effects (research, pulse births/spreads/escalates)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_stressor_genesis(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(stressor_type text, genesis text, source text, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  -- generation-time genesis (forced-pre / emergent / post-gen / suppressed)
  select g.key as stressor_type, g.value as genesis, 'generation'::text as source, count(*)::bigint
    from public.analytics_events e
    cross join lateral jsonb_each_text(e.props->'stressor_genesis') as g(key, value)
   where e.event = 'generation_completed'
     and jsonb_typeof(e.props->'stressor_genesis') = 'object'
     and e.created_at >= p_from and e.created_at < (p_to + 1)
   group by 1, 2
  union all
  -- pulse-time genesis (births/spreads/escalates that emerged during play)
  select coalesce(stressor_type, 'unknown'), coalesce(genesis, 'unknown'), 'pulse'::text, count(*)::bigint
    from public.world_pulse_effects
   where stressor_type is not null
     and created_at >= p_from and created_at < (p_to + 1)
   group by 1, 2
   order by 4 desc;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_proposal_decisions — accept-vs-block ratio per proposal type.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_proposal_decisions(
  p_from date default (current_date - 30),
  p_to   date default current_date
) returns table(resolution text, proposal_type text, subject_kind text, n bigint)
language sql security definer set search_path = public, pg_temp as $$
  select coalesce(props->>'resolution',
           case when event = 'world_pulse_proposal_dismissed' then 'dismissed' else 'applied' end) as resolution,
         coalesce(props->>'proposal_type', 'unknown') as proposal_type,
         coalesce(props->>'subject_kind', 'unknown') as subject_kind,
         count(*)::bigint
    from public.analytics_events
   where event in ('world_pulse_proposal_applied', 'world_pulse_proposal_dismissed')
     and created_at >= p_from and created_at < (p_to + 1)
   group by 1, 2, 3
   order by 4 desc;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- report_config_variance — "hold the config constant, vary the seed, measure the
-- spread". Aggregates generation_completed output metrics WHERE the deterministic
-- config_signature matches. distinct_content_hashes > 1 with a fixed signature is
-- normal (seed variance); a divergence at a FIXED seed would flag a determinism
-- bug (the ambient custom-content read the map surfaced).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.report_config_variance(
  p_config_signature text,
  p_from date default (current_date - 90),
  p_to   date default current_date
) returns table(metric text, n bigint, mean numeric, stddev numeric, p10 numeric, p50 numeric, p90 numeric)
language plpgsql security definer set search_path = public, pg_temp as $body$
declare
  metrics text[] := array[
    'institution_count','npc_count','faction_count','condition_count','stressor_count',
    'conflict_count','relationship_count','service_count','hook_count','duration_ms'
  ];
  m text;
begin
  if p_config_signature is null or length(p_config_signature) = 0 then
    raise exception 'config_signature required';
  end if;
  -- one row per whitelisted metric (the metric name is from a fixed array, never
  -- caller input → safe to interpolate as a json key).
  foreach m in array metrics loop
    return query execute format($q$
      with g as (
        select (props->>%1$L)::numeric as v
          from public.analytics_events
         where event = 'generation_completed'
           and props->>'config_signature' = %2$L
           and created_at >= %3$L and created_at < (%4$L::date + 1)
           and (props->>%1$L) ~ '^-?[0-9]+(\.[0-9]+)?$'
      )
      select %1$L::text, count(v)::bigint, round(avg(v), 2), round(coalesce(stddev_pop(v), 0), 2),
             percentile_cont(0.1) within group (order by v),
             percentile_cont(0.5) within group (order by v),
             percentile_cont(0.9) within group (order by v)
        from g
    $q$, m, p_config_signature, p_from, p_to);
  end loop;
  -- divergence diagnostics as pseudo-metric rows (n column carries the count)
  return query execute format($q$
    select 'samples'::text, count(*)::bigint, null::numeric, null::numeric, null::numeric, null::numeric, null::numeric
      from public.analytics_events
     where event='generation_completed' and props->>'config_signature' = %1$L
       and created_at >= %2$L and created_at < (%3$L::date + 1)
    union all
    select 'distinct_content_hashes'::text, count(distinct props->>'content_hash')::bigint,
           null, null, null, null, null
      from public.analytics_events
     where event='generation_completed' and props->>'config_signature' = %1$L
       and created_at >= %2$L and created_at < (%3$L::date + 1)
  $q$, p_config_signature, p_from, p_to);
end $body$;

-- extend the 040 dimension allowlist so report_distribution can group/list by
-- config_signature and used_random_sentinels (both generation_completed props).
create or replace function public._gc_dim_sql(p_field text)
returns text language sql immutable set search_path = pg_temp as $$
  select case p_field
    when 'tier'                  then $expr$ props->>'tier' $expr$
    when 'population_band'       then $expr$ props->>'population_band' $expr$
    when 'culture'              then $expr$ props->>'culture' $expr$
    when 'terrain'              then $expr$ props->>'terrainType' $expr$
    when 'trade_route'          then $expr$ props->>'tradeRouteAccess' $expr$
    when 'magic_level'          then $expr$ props->>'magicLevel' $expr$
    when 'monster_threat'       then $expr$ props->>'monsterThreat' $expr$
    when 'prosperity'           then $expr$ props->>'prosperity' $expr$
    when 'config_signature'     then $expr$ props->>'config_signature' $expr$
    when 'used_random_sentinels' then $expr$ props->>'used_random_sentinels' $expr$
    when 'defense_readiness'    then $expr$ props->>'defense_readiness' $expr$
    when 'neighbour_relationship_type' then $expr$ props->>'neighbour_relationship_type' $expr$
    else null
  end;
$$;

-- ── grants: service-role only (mirrors 040) ──────────────────────────────────
revoke all on function public.report_pulse_mutations(date, date)             from public;
revoke all on function public.report_stressor_genesis(date, date)            from public;
revoke all on function public.report_proposal_decisions(date, date)          from public;
revoke all on function public.report_config_variance(text, date, date)       from public;
grant execute on function public.report_pulse_mutations(date, date)          to service_role;
grant execute on function public.report_stressor_genesis(date, date)         to service_role;
grant execute on function public.report_proposal_decisions(date, date)       to service_role;
grant execute on function public.report_config_variance(text, date, date)    to service_role;
