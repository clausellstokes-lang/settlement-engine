-- ════════════════════════════════════════════════════════════════════════════
-- 127 — close the `_config` drift in the server world-snapshot sanitizer
-- ════════════════════════════════════════════════════════════════════════════
-- The gallery world-snapshot denylist is hand-mirrored in THREE places: the
-- client PRIVATE_KEY_RE (src/domain/display/publicSafe.js) + COVERT_KEY_RE
-- (src/domain/display/worldSnapshotPublic.js), and the server-side scanner
-- public._gallery_world_snapshot_is_safe (net-current: 089), documented to mirror
-- their UNION as defense-in-depth.
--
-- THE DRIFT: the 099/121 seed-posture work added `_config` to the client
-- PRIVATE_KEY_RE (a settlement persists its RAW authoring config as `_config`,
-- SECRET on every shared / public projection — its keys can carry seeds, plot
-- hooks, DM notes). But the server scanner's covert/private regex mirror was
-- never updated, so a `_config` key would be dropped by the client final-scrub
-- yet ACCEPTED by the server scanner — a defense-in-depth hole if the client is
-- bypassed (a hand-crafted publish_map call, or the 091 saved_maps write guard).
--
-- FIX (net-current recreate from 089 — the scanner's only prior definition; 091
-- reused it verbatim): recreate public._gallery_world_snapshot_is_safe with the
-- ENTIRE 089 body preserved, adding `.*_config.*` to the PRIVATE-contains group of
-- the covert/private regex. The denylist only ever GROWS. Immutable + additive:
-- publish_map (089) and the saved_maps guard trigger (091) both call this by name,
-- so `create or replace` re-points both to the hardened body with no signature
-- change and no re-grant. ⚠️ inert until `supabase db push` + a PostgREST refresh.
--
-- Guarded by tests/security/snapshotDenylistDrift.test.js (static: every client
-- regex token must appear in the net-current SQL) + the `_config` execution case in
-- tests/security/galleryWorldSnapshotScanner.pglite.test.js.

create or replace function public._gallery_world_snapshot_is_safe(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  key   text;
  child jsonb;
  -- The exact HARD-DENY top-level-or-nested keys (no leak under any opt-in).
  hard_deny constant text[] := array[
    'npcStates','factionStates','relationshipStates','pendingEvents','proposals',
    'stressors','pausedAdvance','settlementTickStates','rngSeed','deferredImpacts',
    'deferredWarFronts','deferredPartyImpacts'
  ];
begin
  if value is null then
    return true;
  end if;

  if jsonb_typeof(value) = 'object' then
    for key, child in select * from jsonb_each(value) loop
      -- Reject an exact HARD-DENY key, CASE-INSENSITIVELY (lower on both sides) so a
      -- mixed/upper-cased forbidden key like NpcStates cannot slip past the literal
      -- camelCase list.
      if lower(key) = any (select lower(x) from unnest(hard_deny) as t(x)) then
        return false;
      end if;
      -- … and the covert / seed / prose channels the client final-scrub drops. This
      -- mirrors the UNION of the client COVERT_KEY_RE (worldSnapshotPublic.js) and
      -- PRIVATE_KEY_RE (publicSafe.js). It is ANCHORED to whole-key matches (^...$) so
      -- a benign key that merely CONTAINS a token is not false-rejected: the seed /
      -- covert / pre-prefix tokens match only as whole keys (so "Seedhaven" and
      -- "seedTick" pass), while the private substring tokens keep their .* contains
      -- semantics. The dm / gm tokens honour a Postgres ERE start-of-word boundary
      -- (\m) so they match dmNotes / gmGuidance without over-matching admin / isAdmin.
      -- 127: `.*_config.*` closes the PRIVATE_KEY_RE `_config` drift (the raw
      -- authoring config channel the seed-posture 099/121 work made SECRET).
      if key ~* ('^('
        -- covert / seed / dice / pre-prefix channels (COVERT_KEY_RE) — whole-key only.
        || 'covert|rngSeed|seed|rollExplanations?|diceDetail|explanation'
        || '|preSnapshot|preWorldState|preRegionalGraph|preSaves'
        -- DM-private channels (PRIVATE_KEY_RE) — contains-semantics via .* around the
        -- token, with \m word boundaries for the dm / gm prefixes.
        || '|.*secret.*|.*private.*|.*\mdm.*|.*\mgm.*|.*guidance.*|.*note.*'
        || '|.*plotHook.*|.*plot_hooks.*|.*hook.*|.*compass.*|.*chronicle.*'
        || '|.*pinnedNpc.*|.*aiData.*|.*aiSettlement.*|.*aiDailyLife.*'
        || '|.*narrativeNotes.*|.*identityMarkers.*|.*frictionPoints.*|.*connectionsMap.*'
        || '|.*_config.*'
        || ')$') then
        return false;
      end if;
      if not public._gallery_world_snapshot_is_safe(child) then
        return false;
      end if;
    end loop;
    return true;
  end if;

  if jsonb_typeof(value) = 'array' then
    for child in select jsonb_array_elements(value) loop
      if not public._gallery_world_snapshot_is_safe(child) then
        return false;
      end if;
    end loop;
    return true;
  end if;

  -- A scalar leaf carries no key, so it is always safe.
  return true;
end;
$$;

-- Internal helper: not a public RPC. Re-assert the 089 revoke of the implicit grant.
revoke execute on function public._gallery_world_snapshot_is_safe(jsonb) from public;

comment on function public._gallery_world_snapshot_is_safe(jsonb) is
  'Defense-in-depth (089; 127 adds _config): true ONLY when a stored gallery world snapshot carries NONE of the HARD-DENY / covert keys at any depth. The hard-deny compare is case-insensitive; the covert regex covers the client COVERT_KEY_RE (src/domain/display/worldSnapshotPublic.js) tokens anchored to WHOLE-key matches plus the PRIVATE_KEY_RE (src/domain/display/publicSafe.js) tokens — including _config (127) — by contains-semantics. publish_map (089) and the saved_maps write guard (091) both call this to REJECT a client-supplied snapshot server-side.';
