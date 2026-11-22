-- 102_gate_pulse_persist_on_access_state.sql
--
-- Add the missing row-level access_state='active' gate to the two write RPCs
-- that bypassed it: persist_world_pulse_advance + merge_neighbour_backlink.
--
-- WHY
--   access_state ('active' | 'inactive_plan' | 'pending_delete', 023/024) is the
--   BILLING retention state on settlements and saved_maps: a downgraded plan
--   flips over-quota rows to 'inactive_plan' and they must become read-only
--   until reactivation. Every direct-write RLS policy (024/059) and the
--   mutate_settlement_batch RPC (024/057) enforce it. But the two newer
--   SECURITY DEFINER write RPCs gate only on ownership + account_is_active()
--   (the 057 MODERATION spine — a different axis):
--     - persist_world_pulse_advance (net-current 084) writes settlements + the
--       saved_maps campaign row,
--     - merge_neighbour_backlink (net-current 096) writes a partner settlement.
--   So a downgraded/retention-frozen user could keep advancing campaigns and
--   merging back-links onto rows every other write path treats as frozen.
--
-- WHAT (both bodies forked from their NET-CURRENT definitions — 084 and 096,
--   the only later touch being 094's search_path pass which both already
--   satisfy — with ONLY the access_state predicates added; every other line is
--   verbatim. Signatures, GRANTs, and the expected_tick semantics unchanged.)
--   persist_world_pulse_advance:
--     - the campaign FOR UPDATE lookup requires access_state='active' (an
--       inactive campaign now reads as not-found, same shape as an RLS deny);
--     - the settlement ownership pre-check counts only ACTIVE owned rows, so a
--       frozen settlement in the write-set aborts the whole transaction
--       (mirrors mutate_settlement_batch's in-body re-check + its wording);
--     - the settlement UPDATE loop + campaign UPDATE re-check access_state
--       (defense-in-depth, same belt-and-braces as the ownership predicates).
--   merge_neighbour_backlink:
--     - the partner FOR UPDATE lookup + the final UPDATE require
--       access_state='active'. A frozen partner is a NO-OP return — exactly the
--       existing missing/not-owned semantics: the back-link self-heals on the
--       partner's next save (which requires the row active again anyway).
--   No behavior change for fully-active rows. Idempotent: CREATE OR REPLACE +
--   re-affirmed grants; safe to re-run.
--
-- @rollback: re-run 084's persist_world_pulse_advance and 096's
--   merge_neighbour_backlink definitions (NOTE: that reopens the frozen-row
--   write bypass — rollback only to unblock a broken deploy, then re-close).

-- ── 1. persist_world_pulse_advance — 084 verbatim + access_state gates ───────
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
  -- Row-state gate (102): the campaign row must be BILLING-active — a downgraded
  -- (inactive_plan / pending_delete) campaign is read-only, matching the 024/059
  -- direct-write RLS. An inactive row reads as not-found, same as an RLS deny.
  select * into v_campaign
    from public.saved_maps
   where id = p_campaign_id
     and user_id = v_uid
     and access_state = 'active'
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
  -- Row-state gate (102): only BILLING-active rows count as writable, mirroring
  -- mutate_settlement_batch's in-body re-check — a frozen settlement in the
  -- write-set aborts the whole advance before any write.
  if v_update_count > 0 then
    select count(distinct (elem ->> 'saveId')) into v_distinct_count
      from jsonb_array_elements(p_settlement_updates) as elem
     where elem ->> 'saveId' is not null;

    select count(*) into v_owned_count
      from public.settlements s
     where s.user_id = v_uid
       and s.access_state = 'active'
       and s.id in (
         select (elem ->> 'saveId')::uuid
           from jsonb_array_elements(p_settlement_updates) as elem
          where elem ->> 'saveId' is not null
       );

    if v_owned_count <> v_distinct_count then
      raise exception 'one or more settlements are not active or not owned by the current user'
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
       and s.user_id = v_uid
       and s.access_state = 'active';

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
       and m.user_id = v_uid
       and m.access_state = 'active';
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
-- authenticated-only grant (the signature is unchanged, so this matches 069/074/084).
revoke all on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) from public;
grant execute on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) to authenticated;

-- ── 2. merge_neighbour_backlink — 096 verbatim + access_state gates ──────────
create or replace function public.merge_neighbour_backlink(
  p_partner_id          uuid,
  p_link_id             text,
  p_new_save_id         uuid,
  p_network_entry       jsonb,
  p_relationship_entries jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid     uuid := auth.uid();
  v_data    jsonb;
  v_network jsonb;
  v_rels    jsonb;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  if not public.account_is_active(v_uid) then
    raise exception 'account is not active';
  end if;

  -- Lock the partner row (serializes concurrent back-links) + ownership check.
  -- Row-state gate (102): the partner must be BILLING-active — a downgraded
  -- (inactive_plan / pending_delete) partner is read-only, matching the 024/059
  -- direct-write RLS.
  select data
    into v_data
    from public.settlements
   where id = p_partner_id
     and user_id = v_uid
     and access_state = 'active'
   for update;

  -- Partner gone / not owned by caller / not billing-active → no-op. The
  -- reciprocal link self-heals on the partner's next save (which itself requires
  -- the row active again); the caller's own (forward) link is unaffected.
  if v_data is null then
    return;
  end if;

  -- neighbourNetwork: drop any prior entry for this link OR this new-save id, then
  -- PREPEND the fresh entry (mirrors the JS buildNeighbourBackLink ordering).
  v_network := coalesce(v_data -> 'neighbourNetwork', '[]'::jsonb);
  v_network := (
    select coalesce(jsonb_agg(e), '[]'::jsonb)
      from jsonb_array_elements(v_network) e
     where coalesce(e ->> 'id', '')     <> p_new_save_id::text
       and coalesce(e ->> 'linkId', '') <> p_link_id
  );
  v_network := jsonb_build_array(p_network_entry) || v_network;

  -- interSettlementRelationships: drop this link's entries, then append the new ones.
  v_rels := coalesce(v_data -> 'interSettlementRelationships', '[]'::jsonb);
  v_rels := (
    select coalesce(jsonb_agg(e), '[]'::jsonb)
      from jsonb_array_elements(v_rels) e
     where coalesce(e ->> 'linkId', '') <> p_link_id
  );
  v_rels := v_rels || coalesce(p_relationship_entries, '[]'::jsonb);

  v_data := jsonb_set(
              jsonb_set(v_data, '{neighbourNetwork}', v_network, true),
              '{interSettlementRelationships}', v_rels, true
            );

  update public.settlements
     set data            = v_data,
         neighbour_links = v_network      -- keep the mirror column in sync
   where id = p_partner_id
     and user_id = v_uid
     and access_state = 'active';
end
$$;

revoke all on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) from public;
grant execute on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) to authenticated;

comment on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) is
  'Atomically applies a reciprocal neighbour back-link to a partner settlement under FOR UPDATE (fixes the read-modify-write clobber race). Owner-scoped, status-gated, access_state-gated (102: a billing-frozen partner is a no-op), idempotent by link id. Caller: lib/saves.js bidirectional save path.';
