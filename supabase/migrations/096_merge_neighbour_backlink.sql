-- 096_merge_neighbour_backlink.sql
--
-- Fix the neighbour back-link read-modify-write race.
--
-- The bidirectional-save path (lib/saves.js + domain/relationships/neighbourBackLink.js)
-- writes a reciprocal "back-link" onto an EXISTING partner settlement when a new save
-- names it as a neighbour. Historically the client read the partner's FULL settlement
-- blob, merged the back-link in JS, and wrote the whole blob back via the generic
-- mutate_settlement_batch UPDATE. Two saves referencing the SAME partner within the
-- read→write window each merged onto their own stale snapshot, so the second write
-- dropped the first's back-link (last-write-wins).
--
-- This RPC moves the partner read-modify-write SERVER-SIDE and atomic: it locks the
-- partner row FOR UPDATE, reads its CURRENT data, applies ONLY the delta (prepend the
-- new neighbourNetwork entry after removing any prior entry for this link/new-save,
-- and replace this link's interSettlementRelationships), then writes. Concurrent
-- back-links to the same partner now serialize on the row lock and both survive.
--
-- Idempotent by construction: it removes any existing entry for (p_link_id /
-- p_new_save_id) before prepending, so a retry (or a duplicate call) converges to the
-- same result rather than duplicating the link — which lets the client treat the whole
-- neighbour save as retry-safe.
--
-- Owner-scoped + status-gated + pg_temp-pinned, matching the other write RPCs. A
-- missing/not-owned partner is a NO-OP (returns cleanly) — the reciprocal link simply
-- self-heals on the partner's next save, never an error for the primary save.

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
  select data
    into v_data
    from public.settlements
   where id = p_partner_id
     and user_id = v_uid
   for update;

  -- Partner gone / not owned by caller → no-op. The reciprocal link self-heals on
  -- the partner's next save; the caller's own (forward) link is unaffected.
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
     and user_id = v_uid;
end
$$;

revoke all on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) from public;
grant execute on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) to authenticated;

comment on function public.merge_neighbour_backlink(uuid, text, uuid, jsonb, jsonb) is
  'Atomically applies a reciprocal neighbour back-link to a partner settlement under FOR UPDATE (fixes the read-modify-write clobber race). Owner-scoped, status-gated, idempotent by link id. Caller: lib/saves.js bidirectional save path.';
