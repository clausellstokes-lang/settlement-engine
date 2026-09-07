-- ────────────────────────────────────────────────────────────────────────────
-- 134_intent_corpus_atlas.sql — the INTENT-ALIGNMENT CORPUS, pre-Surveyor slice
-- (DESIGN_ANALYTICS_V2.md §9).
--
-- WHAT THE DESIGN ASKS FOR (§9) vs WHAT IS CAPTURABLE NOW
--   §9's unit is the ALIGNMENT TRIPLE — what the human MEANT, what the compiler DID,
--   what the engine COULD HAVE DONE — "captured per Surveyor interaction." THE SURVEYOR
--   (the natural-language → engine-op compiler) DOES NOT EXIST YET, so the triple, its
--   labeled interpretation, the op-plan/correction capture, and the AI-half ENGINEERING
--   MAP are all Surveyor-gated → DEFERRED (see the DEFERRAL LEDGER at the foot).
--
--   The ONE piece §9 marks capturable WITHOUT the compiler is the MANUAL-USER ATLAS
--   feed: "Manual users feed the same atlas: when many users respond to the same
--   situation with the same hand-built op cluster, that cluster is a candidate macro/
--   primitive." That is what this migration builds — as a ROLLUP over the edit_events
--   already captured under the research plane (migration 036). ZERO new capture, ZERO
--   eager bytes, id-free by construction.
--
-- THE TWO PRE-SURVEYOR SIGNALS (both research-plane; enums/counts only, never content)
--   1. THE MANUAL OP-CLUSTER ATLAS (intent → primitive, manual half): each (session,
--      settlement) editing episode is one hand-built op cluster; its SIGNATURE is the
--      sorted DISTINCT set of edit kinds it used. Counting clusters per signature (summed
--      across days at read time) surfaces the RECURRING clusters — the macro/primitive
--      candidates, straight from the market's hands.
--   2. THE PRE-SURVEYOR CORRECTION SIGNAL: the edit_events `reverted` flag is the only
--      correction signal available without a compiler interpretation to classify against.
--      Per-kind total + reverted counts give a revert RATE per op kind (a coarse
--      dissatisfaction signal). The full §9 CORRECTION TYPOLOGY (misread / wrong-mechanism
--      / wrong-magnitude / over-/under-inference / protected-graze) is Surveyor-gated —
--      its vocabulary is versioned in src/domain/intent/correctionTypology.js, emitted as
--      the single 'unclassified_manual' class until the compiler ships.
--
-- ENDOGENEITY (§7): READ-ONLY over edit_events; writes only to analytics_daily_rollups.
--   Nothing feeds back into a running world or the generation path — telemetry never
--   tunes a live world (sim goldens untouched). Consent: edit_events is research-tier by
--   construction (036 CHECK consent_tier = 'research'), so this atlas is research-plane by
--   inheritance; the future Surveyor corpus moves to the model-development plane (§5 plane
--   2 / consent ai_prose) when that plane gates data.
--
-- House pattern: additive rollups into the EAV table (idempotent on-conflict overwrite —
-- the 038/133 ratchet-safe idiom); SECURITY DEFINER, search_path pinned, service-role
-- execute only. Re-runnable (CREATE OR REPLACE). WRITTEN, NOT DEPLOYED — `supabase db
-- push` stays the owner's step; the atlas rollup rides the already-scheduled nightly cron
-- via the analytics_nightly_maintenance amendment at the foot (latest-wins over 133).
-- ────────────────────────────────────────────────────────────────────────────

-- ── The manual intent-atlas daily rollup → analytics_daily_rollups ────────────
create or replace function public.rollup_intent_atlas_daily(p_day date default (now()::date - 1))
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_rows integer := 0; v_n integer;
begin
  -- §9 MANUAL OP-CLUSTER ATLAS: one cluster per (session, settlement) editing episode.
  -- cluster_actor coalesces session → actor → 'anon' so a session-less client still
  -- clusters per (actor, settlement). The signature is the sorted DISTINCT kinds; op_count
  -- is that signature's arity. Recurring signatures (summed across days) = macro candidates.
  -- id-free: emits only the kind-set string + arity + a count.
  with clusters as (
    select coalesce(session_id::text, actor_id::text, 'anon') as cluster_actor,
           settlement_uuid,
           string_agg(distinct kind, ',' order by kind) as signature,
           count(distinct kind) as op_count
    from public.edit_events
    where created_at::date = p_day
    group by 1, 2
  )
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'intent_manual_cluster',
         jsonb_build_object('signature', signature, 'op_count', op_count),
         count(*)
  from clusters
  group by signature, op_count
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §9 PRE-SURVEYOR CORRECTION SIGNAL (a): total manual edits per op kind (the denominator
  -- for the revert rate). id-free — the EDIT_KINDS enum only.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'intent_op_kind_total',
         jsonb_build_object('kind', kind),
         count(*)
  from public.edit_events
  where created_at::date = p_day
  group by kind
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  -- §9 PRE-SURVEYOR CORRECTION SIGNAL (b): reverted edits per op kind (the numerator). A
  -- high reverted/total ratio for a kind is a coarse dissatisfaction signal — the manual
  -- proxy for a correction, before the compiler exists to classify WHY.
  insert into public.analytics_daily_rollups (day, metric, dims, value)
  select p_day, 'intent_op_kind_reverted',
         jsonb_build_object('kind', kind),
         count(*)
  from public.edit_events
  where created_at::date = p_day and reverted = true
  group by kind
  on conflict (day, metric, dims) do update set value = excluded.value;
  get diagnostics v_n = row_count; v_rows := v_rows + v_n;

  return v_rows;
end;
$$;
revoke all on function public.rollup_intent_atlas_daily(date) from public;
grant execute on function public.rollup_intent_atlas_daily(date) to service_role;

-- ── Wire the intent atlas into the existing nightly maintenance (039/133) ─────
-- Latest-wins redefinition: this MUST carry every call the 133 version had (rollup_
-- analytics_daily + rollup_analytics_v2_daily + the materialized-view refreshes) PLUS the
-- new rollup_intent_atlas_daily, or a prior job would silently stop running. The already-
-- scheduled 'analytics-rollup-daily' cron picks this up on deploy — no new schedule.
create or replace function public.analytics_nightly_maintenance()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.rollup_analytics_daily();
  perform public.rollup_analytics_v2_daily();
  perform public.rollup_intent_atlas_daily();
  begin
    refresh materialized view concurrently public.mv_retention_cohorts;
  exception when others then null; end;
  begin
    refresh materialized view concurrently research.mv_archetype_clusters;
    refresh materialized view concurrently research.mv_edit_frequency;
  exception when others then null; end;
end;
$$;
revoke all on function public.analytics_nightly_maintenance() from public;
grant execute on function public.analytics_nightly_maintenance() to service_role;

-- ── DEFERRAL LEDGER (Surveyor-gated §9 pieces — documented, not a bug to re-find) ──
--   The following §9 elements are DELIBERATELY out of scope until the Surveyor (the
--   NL→engine-op compiler) ships; each is deferred, not dropped:
--     • the ALIGNMENT TRIPLE (utterance → labeled interpretation → op plan → corrections
--       → accepted plan → 7/30/90d retention) — needs the compiler to produce an
--       interpretation and an op plan to capture.
--     • the CORRECTION TYPOLOGY classification (the 6 classes) — needs an AI interpretation
--       to classify a correction against; the vocabulary is versioned in
--       src/domain/intent/correctionTypology.js and emits 'unclassified_manual' until then.
--     • the AI-half ENGINEERING MAP (intent-class → engine-primitive per ACCEPTED plan) and
--       the compiler's "unsupported" confessions (§AI-4) — needs the compiler's op plans.
--   The MANUAL half of the atlas (this migration) is the same intent→primitive table fed
--   from hand-built op clusters; the AI half merges into it when the compiler lands.
-- ────────────────────────────────────────────────────────────────────────────
