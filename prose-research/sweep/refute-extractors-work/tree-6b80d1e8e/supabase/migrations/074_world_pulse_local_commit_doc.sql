-- ────────────────────────────────────────────────────────────────────────────
-- 074_world_pulse_local_commit_doc.sql — Phase 4b campaign-member change-queue
-- commit reuses the 069 atomic RPC for a NON-ADVANCE local edit. Documentation +
-- a forward-only re-grant guard. NO schema change, NO new column, NO new function.
--
-- WHY (the residual Phase 4b introduces)
--   A clock-bound CANON campaign member can now stage edits in the change-queue
--   and commit them with "Save N pending changes". That commit:
--     • applies the settlement-LOCAL change immediately, and
--     • DEFERS the cross-settlement (regional) propagation to the next Advance by
--       parking the computed impacts on the campaign snapshot under
--       worldState.deferredImpacts (a NEW key inside the EXISTING saved_maps.map_data
--       JSONB — no column, no DDL).
--   The commit's WRITE-SET (the committed settlement row(s) + the campaign snapshot
--   carrying that deferred-impact marker) must land all-or-nothing — exactly the
--   hazard migration 069 (persist_world_pulse_advance) already closes. So the client
--   routes a member COMMIT through the SAME RPC as an advance, with two deliberate
--   differences from the forward-advance call:
--
--     1. p_expected_tick = NULL. A commit is NOT a tick advance: the stored tick
--        already equals the current tick, so passing the forward convention
--        (expected = current) would make 069's stale-tick guard return
--        applied=false and SILENTLY DROP the commit. NULL skips the guard
--        (last-write-wins — the same value the undo path uses), so the commit
--        always lands. 069 ALREADY supports p_expected_tick = NULL (the guard is
--        opt-in); this migration only DOCUMENTS that the commit path depends on it.
--
--     2. The campaign snapshot does NOT bump worldState.tick. The client hands the
--        live (un-advanced) campaign, so the next REAL Advance's forward guard sees
--        a truthful, un-inflated tick. The deferred-impact marker rides in map_data
--        verbatim (069 writes map_data = p_campaign_snapshot), and the next Advance
--        folds worldState.deferredImpacts into regionalGraph.queuedImpacts EXACTLY
--        ONCE, then clears the bucket — so the regional ripple applies once, never
--        twice (the double-propagation guard lives entirely in client code).
--
-- WHAT THIS ADDS
--   Nothing functional beyond 069. The 069 function signature, ownership re-checks
--   (campaign + every settlement), single-transaction write-set, and optional tick
--   guard are exactly what the Phase 4b commit needs. This migration is a
--   DOCUMENTATION marker plus a re-affirmed, idempotent GRANT so an operator
--   applying migrations in order has a record that the RPC now serves TWO callers
--   (advance + member-commit), and so the authenticated-only grant is reasserted.
--
-- OPERATOR
--   • Apply via `supabase db push` (or the SQL editor). Fully idempotent: it only
--     re-affirms the existing grant on the existing function — safe to re-run, and
--     a NO-OP if 074 has already been applied.
--   • HARD DEPENDENCY: migration 069 MUST already be applied (this migration does
--     not create the function — it documents an additional caller of it). The guard
--     below RAISES a clear error if 069 is missing, so this never silently succeeds
--     against a database where the RPC does not exist.
--   • No data backfill. Existing campaign rows simply have no worldState.deferredImpacts
--     key until a member commit writes one; the absence reads as "nothing deferred".
--   • Rollback: nothing to roll back (no object is created here). Rolling back the
--     FEATURE means reverting the client; the 069 function is shared and stays.
-- ────────────────────────────────────────────────────────────────────────────

do $$
begin
  -- Defence: 074 documents an additional caller of the 069 RPC. If 069 was never
  -- applied, fail loudly rather than leave the client's commit path unsupported.
  if not exists (
    select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname = 'persist_world_pulse_advance'
  ) then
    raise exception
      'migration 074 requires 069 (public.persist_world_pulse_advance) to be applied first';
  end if;
end
$$;

-- Re-affirm the authenticated-only grant (idempotent — matches 069). The function
-- body re-checks auth.uid() ownership of the campaign AND every settlement, so the
-- member-commit caller is held to the same ownership bar as the advance caller.
revoke all on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) from public;
grant execute on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) to authenticated;

comment on function public.persist_world_pulse_advance(uuid, jsonb, jsonb, bigint) is
  'Atomic world-pulse write-set (settlement rows + campaign snapshot) in one '
  'transaction. Serves TWO callers: (1) a forward/undo ADVANCE (expectedTick = '
  'post-advance tick / null), and (2) a Phase 4b campaign-member change-queue '
  'COMMIT (expectedTick = null, no tick bump; the campaign snapshot carries '
  'worldState.deferredImpacts, the regional ripple the next Advance folds in once).';
