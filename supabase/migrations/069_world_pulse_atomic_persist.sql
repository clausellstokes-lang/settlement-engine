-- ────────────────────────────────────────────────────────────────────────────
-- 069_world_pulse_atomic_persist.sql — ONE-transaction world-pulse advance write.
--
-- WHY (the residual the round-1 persist guard could not close)
--   Advancing a campaign's world clock persists a WRITE-SET: every affected member
--   settlement's post-pulse state PLUS the campaign snapshot (its aged world graph
--   + tick). The client did this as N serial settlement upserts followed by one
--   separate campaign upsert. That can never be atomic from the client:
--     • FORWARD partial: settlement A lands, settlement B rejects. The round-1 fix
--       then SKIPS the campaign upsert (good — no campaign-ahead hybrid), but A is
--       already advanced in the cloud while the campaign + B are behind = a partial
--       cloud state. Only a single DB transaction can make A's write roll back too.
--     • INVERSE: every settlement lands but the campaign upsert rejects. Round 1
--       made the client swallow that as a retryable cloud-pending banner, but the
--       settlements are still advanced in the cloud ahead of the campaign snapshot.
--   Both leave the cloud internally inconsistent until a retry/reload reconciles.
--
-- WHAT THIS ADDS (additive, idempotent, RLS-correct, authenticated-only)
--   A SECURITY DEFINER RPC, persist_world_pulse_advance, that writes the ENTIRE
--   world-pulse write-set inside ONE transaction (a function body IS a single
--   transaction): it updates every affected settlement row AND the campaign
--   (saved_maps) snapshot row together. Any failure raises, so the WHOLE advance
--   rolls back — the cloud can never hold a partial or hybrid advance.
--
--   OWNERSHIP (defence in depth, because SECURITY DEFINER bypasses RLS):
--     • The caller must own the campaign (saved_maps.user_id = auth.uid()).
--     • The caller must own EVERY settlement named in the update set. A single
--       foreign id aborts the transaction before any write lands — no caller can
--       advance another user's settlement through this definer path.
--
--   IDEMPOTENCY / STALE-APPLY GUARD (optional, opt-in):
--     • p_expected_tick: when non-null, the advance applies only if the campaign's
--       CURRENT stored world tick is < p_expected_tick (i.e. this advance moves the
--       clock FORWARD to a not-yet-applied tick). A duplicate/stale re-apply of an
--       already-landed tick becomes a no-op that returns applied=false rather than
--       double-advancing. Pass NULL to skip the guard (last-write-wins, matching the
--       client's id-keyed retry semantics today).
--
--   The settlement payload mirrors the client's per-save partial (settlement →
--   data, campaignState → campaign_state, versionHistory → version_history); only
--   keys PRESENT in each update object are written, so a settlement with no
--   version-history change keeps its row's existing value.
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor). Additive + idempotent:
--     CREATE OR REPLACE FUNCTION + guarded GRANT, safe to re-run.
--   • Pairs with the client world-pulse persist tail. The client may continue to
--     use the serial-upsert path (the round-1 guard keeps THAT from producing a
--     campaign-ahead hybrid); call this RPC to additionally close the residual
--     settlement-ahead partial state described above. No data backfill required.
--   • Rollback: `DROP FUNCTION IF EXISTS public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint);`
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.persist_world_pulse_advance(
  p_campaign_id uuid,
  p_campaign_snapshot jsonb,
  p_settlement_updates jsonb,
  p_expected_tick bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_campaign public.saved_maps%rowtype;
  v_current_tick bigint;
  v_update jsonb;
  v_save_id uuid;
  v_owned_count integer;
  v_update_count integer;
  v_applied_settlements integer := 0;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Ownership: the caller must own the campaign. Lock the row so a concurrent
  -- advance of the SAME campaign serialises behind this transaction (the optional
  -- tick guard below then sees a consistent current tick).
  select * into v_campaign
    from public.saved_maps
   where id = p_campaign_id
     and user_id = v_uid
   for update;

  if not found then
    raise exception 'campaign % not found for current user', p_campaign_id
      using errcode = '42501';
  end if;

  -- Normalise the settlement update set to an array (empty array is a valid
  -- campaign-only advance, e.g. a single-settlement realm with nothing to write).
  if p_settlement_updates is null then
    p_settlement_updates := '[]'::jsonb;
  end if;
  if jsonb_typeof(p_settlement_updates) <> 'array' then
    raise exception 'p_settlement_updates must be a JSON array'
      using errcode = '22023';
  end if;

  v_update_count := jsonb_array_length(p_settlement_updates);

  -- Ownership: EVERY settlement named in the update set must belong to the caller.
  -- A single foreign id aborts before any write — no cross-owner advance.
  if v_update_count > 0 then
    select count(*) into v_owned_count
      from public.settlements s
     where s.user_id = v_uid
       and s.id in (
         select (elem ->> 'saveId')::uuid
           from jsonb_array_elements(p_settlement_updates) as elem
          where elem ->> 'saveId' is not null
       );

    if v_owned_count <> v_update_count then
      raise exception 'one or more settlements are not owned by the current user'
        using errcode = '42501';
    end if;
  end if;

  -- Optional stale-apply guard: only advance if this tick is strictly ahead of the
  -- stored one. A duplicate re-apply of an already-landed tick is a no-op.
  if p_expected_tick is not null then
    v_current_tick := coalesce(
      nullif(v_campaign.map_data #>> '{campaign,worldState,tick}', '')::bigint,
      nullif(v_campaign.map_data #>> '{worldState,tick}', '')::bigint,
      -1
    );
    if v_current_tick >= p_expected_tick then
      return jsonb_build_object(
        'applied', false,
        'reason', 'stale_tick',
        'currentTick', v_current_tick,
        'expectedTick', p_expected_tick
      );
    end if;
  end if;

  -- ── Single-transaction write-set ──────────────────────────────────────────
  -- 1) Each affected settlement. Only keys PRESENT in the update object are
  --    written, so an absent campaignState/versionHistory keeps the stored value.
  for v_update in
    select * from jsonb_array_elements(p_settlement_updates)
  loop
    v_save_id := nullif(v_update ->> 'saveId', '')::uuid;
    if v_save_id is null then
      continue;
    end if;

    update public.settlements s
       set data            = case when v_update ? 'settlement'
                                  then v_update -> 'settlement' else s.data end,
           campaign_state  = case when v_update ? 'campaignState'
                                  then v_update -> 'campaignState' else s.campaign_state end,
           version_history = case when v_update ? 'versionHistory'
                                  then v_update -> 'versionHistory' else s.version_history end,
           updated_at      = now()
     where s.id = v_save_id
       and s.user_id = v_uid;

    if found then
      v_applied_settlements := v_applied_settlements + 1;
    end if;
  end loop;

  -- 2) The campaign snapshot. Mirrors rowForCampaign: the full envelope lives in
  --    map_data; the derived columns are refreshed from it when present.
  if p_campaign_snapshot is not null and jsonb_typeof(p_campaign_snapshot) = 'object' then
    update public.saved_maps m
       set map_data            = p_campaign_snapshot,
           name                = coalesce(p_campaign_snapshot ->> 'name', m.name),
           map_seed            = coalesce(p_campaign_snapshot #>> '{mapState,seed}', m.map_seed),
           burg_settlement_map = coalesce(p_campaign_snapshot #> '{mapState,placements}', m.burg_settlement_map),
           supply_chain_config = coalesce(p_campaign_snapshot #> '{regionalGraph,channels}', m.supply_chain_config),
           updated_at          = now()
     where m.id = p_campaign_id
       and m.user_id = v_uid;
  end if;

  return jsonb_build_object(
    'applied', true,
    'settlementsWritten', v_applied_settlements,
    'settlementsRequested', v_update_count
  );
end;
$$;

-- RLS-correct grant: callable by signed-in users only (the body re-checks
-- auth.uid() ownership of the campaign AND every settlement). Revoke the implicit
-- PUBLIC/anon grant first so an unauthenticated role cannot reach the definer.
revoke all on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) from public;
grant execute on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) to authenticated;
