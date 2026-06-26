-- ────────────────────────────────────────────────────────────────────────────
-- 084_world_pulse_persist_dedupe_ownership.sql — duplicate-saveId hardening for
-- persist_world_pulse_advance (the 069 atomic world-pulse advance RPC).
--
-- WHY
--   069's ownership pre-check compared the count of OWNED settlement ROWS matching
--   the payload's saveIds against `jsonb_array_length(p_settlement_updates)` — the
--   RAW array length. If the write-set ever carried a DUPLICATE saveId (the same
--   settlement twice), the owned-row count (DISTINCT rows) fell short of the array
--   length and the RPC aborted with a FALSE "one or more settlements are not owned
--   by the current user", failing a legitimate advance the caller fully owns.
--   It does not occur on today's one-entry-per-settlement write-set, but it is a
--   latent landmine: any future caller (or a settlement appearing in two roles)
--   that repeats a saveId would hit a confusing ownership error.
--
-- WHAT THIS CHANGES (one line of logic; everything else is 069 verbatim)
--   The ownership check now compares OWNED rows against the count of DISTINCT
--   referenced saveIds, so a repeated id can no longer make owned < referenced.
--   The settlement UPDATE loop is unchanged (a repeated id re-applies idempotently,
--   last-write-wins on the same row), and `settlementsRequested` still reports the
--   raw number of update entries sent.
--
-- NET-CURRENT RULE: forked from 069's body (074 only re-affirmed 069 + updated its
--   COMMENT — it did not change the body, so 069 is net-current). The signature is
--   unchanged, so the 074 COMMENT and the authenticated-only GRANT both survive this
--   CREATE OR REPLACE; the GRANT is re-affirmed below for safety.
--
-- OPERATOR: apply via `supabase db push`. Additive + idempotent (CREATE OR REPLACE
--   + guarded GRANT, safe to re-run). No data backfill. Rollback = re-apply 069.
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
  v_distinct_count integer;
  v_applied_settlements integer := 0;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Account-status gate (the 059 invariant): EVERY SECURITY DEFINER write RPC that
  -- mutates settlements/maps/profiles must reject a banned/disabled/soft-deleted
  -- account even with a valid JWT. persist_world_pulse_advance is a settlement+
  -- campaign write, so it carries the standard guard like 057/059/073.
  if not public.account_is_active(v_uid) then
    raise exception 'account is not active' using errcode = '42501';
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
  -- Compare owned rows against the count of DISTINCT referenced saveIds (NOT the
  -- raw array length): a duplicate saveId in the payload must not make the owned
  -- count fall short and trip a false "not owned" abort (084).
  if v_update_count > 0 then
    select count(distinct (elem ->> 'saveId')) into v_distinct_count
      from jsonb_array_elements(p_settlement_updates) as elem
     where elem ->> 'saveId' is not null;

    select count(*) into v_owned_count
      from public.settlements s
     where s.user_id = v_uid
       and s.id in (
         select (elem ->> 'saveId')::uuid
           from jsonb_array_elements(p_settlement_updates) as elem
          where elem ->> 'saveId' is not null
       );

    if v_owned_count <> v_distinct_count then
      raise exception 'one or more settlements are not owned by the current user'
        using errcode = '42501';
    end if;
  end if;

  -- Optional stale-apply guard: only advance if this tick is strictly ahead of the
  -- stored one. A duplicate re-apply of an already-landed tick is a no-op. The
  -- envelope mirrors mapDataForCampaign: the campaign lives under map_data.campaign,
  -- so the tick is at {campaign,worldState,tick} (legacy unwrapped rows fall back).
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

  -- 2) The campaign snapshot. Mirrors rowForCampaign EXACTLY: the full map_data
  --    envelope (mapDataForCampaign → { kind, version, campaign }) is stored
  --    verbatim, and each derived column is refreshed from the SAME paths
  --    rowForCampaign reads — campaign.name, campaign.mapState.seed/placements,
  --    campaign.regionalGraph.channels — so the atomic write lands a row
  --    byte-identical to the serial upsert path.
  if p_campaign_snapshot is not null and jsonb_typeof(p_campaign_snapshot) = 'object' then
    update public.saved_maps m
       set map_data            = p_campaign_snapshot,
           name                = coalesce(p_campaign_snapshot #>> '{campaign,name}', m.name),
           map_seed            = coalesce(p_campaign_snapshot #>> '{campaign,mapState,seed}', m.map_seed),
           burg_settlement_map = coalesce(p_campaign_snapshot #> '{campaign,mapState,placements}', m.burg_settlement_map),
           supply_chain_config = coalesce(p_campaign_snapshot #> '{campaign,regionalGraph,channels}', m.supply_chain_config),
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
-- auth.uid() ownership of the campaign AND every settlement). Re-affirm the
-- authenticated-only grant (the signature is unchanged, so this matches 069/074).
revoke all on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) from public;
grant execute on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) to authenticated;
