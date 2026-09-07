-- ════════════════════════════════════════════════════════════════════════════
-- 128 — strip the LATENT PANTHEON from every public projection
-- ════════════════════════════════════════════════════════════════════════════
-- Phase 4 W-F6, THE PREMIUM GATE (owner 2026-07-10). The generation pipeline now
-- bakes a STARTING PANTHEON latently into every seed — `config.latentPantheon`
-- (seedStartingPantheon step) — identical data for all account tiers, so the
-- golden stays single-per-seed and tier never touches generation. Premium
-- accounts turn the key post-generation (latentPantheon.js activation seam),
-- copying the latent patron/cults into the LIVE embeds; free/anon never activate.
--
-- THE LEAK: `config.latentPantheon` is UNREVEALED DM-secret content — the gods a
-- dossier has not yet named. But `config` is allowlisted at the top level of both
-- public projections, and `latentPantheon` matched NO denylist token, so it rode
-- through to the anon gallery surface (the settlement dossier AND, where a world
-- snapshot embeds settlement configs, the published map). The client mirror
-- (src/domain/display/publicSafe.js PRIVATE_KEY_RE) gained the `latentPantheon`
-- token in W-F6; this migration mirrors it server-side in BOTH sanitizers so a
-- client bypass (a hand-crafted publish_map / get_gallery_dossier call) cannot
-- leak it either. The ACTIVATED live embeds (primaryDeitySnapshot /
-- cultDeitySnapshots / primaryDeityRef / faithProfile) match none of these tokens
-- and stay visible — a shared premium pantheon displays read-only to all viewers
-- (the owner's premium-gate ruling), the latent seed never does.
--
-- FIX (net-current recreate; the denylist only ever GROWS):
--   § 1. _gallery_sanitize_public_json (net-current 123) — add `latentPantheon` to
--        the deeper-level DM-private denylist. This is the SETTLEMENT-DOSSIER path
--        where config.latentPantheon actually lives (get_gallery_dossier).
--   § 2. _gallery_world_snapshot_is_safe (net-current 127) — add `.*latentPantheon.*`
--        to the covert/private contains-group, mirroring the client PRIVATE_KEY_RE
--        token (publish_map / saved_maps guard reject a snapshot carrying it).
-- Both recreate the ENTIRE net-current body with `create or replace`, so every
-- caller re-points to the hardened body with no signature change and no re-grant.
-- ⚠️ inert until `supabase db push` + a PostgREST refresh.
--
-- Guarded by: tests/security/snapshotDenylistDrift.test.js (static: every client
-- PRIVATE_KEY_RE token — now incl. latentPantheon — must appear in the net-current
-- world-scanner SQL) + the latentPantheon execution cases in
-- tests/security/galleryWorldSnapshotScanner.pglite.test.js (world scanner) and
-- tests/security/gallerySanitize.pglite.test.js (dossier sanitizer).

-- ══ § 1. _gallery_sanitize_public_json — add latentPantheon (net-current 123) ══
create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
returns jsonb
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  key text;
  child jsonb;
  sanitized jsonb;
  out jsonb;
  is_toplevel boolean;
  is_npc_obj boolean;
  -- ══ PUBLIC TOP-LEVEL ALLOWLIST ══
  -- Character-identical (order-independent) to publicSafe.js PUBLIC_TOPLEVEL_KEYS.
  -- tests/security/gallerySanitizeAllowlist.contract.test.js parses THIS literal
  -- and pins it to the merged JS twin — the drift pin. (Unchanged from 123; a
  -- LATENT PANTHEON is a nested config key, so the top-level set does not move.)
  public_toplevel constant text[] := array[
    'activeConditions','arrivalScene','availableServices','coherenceNotes','config',
    'conflicts','crossSettlementConflicts','dailyLife','defenseProfile','economicState',
    'economicViability','factions','generatorVersion','history','id',
    'institutions','interSettlementRelationships','name','neighborRelationship','neighbourNetwork',
    'npcs','population','populationHistory','powerStructure','pressureSentence',
    'prominentRelationship','relationships','resourceAnalysis','schemaVersion','settlementReason',
    'simulationVersion','spatialLayout','stress','stressors','structuralSuggestions',
    'structuralViolations','thesis','tier'
  ];
  -- Mirrors src/domain/display/publicSafe.js toPublicSafe NPC allowlist (033).
  npc_allowed constant text[] := array[
    'id','name','role','title','category','personality','physical',
    'factionAffiliation','secondaryAffiliation','presentation','influence'
  ];
begin
  if value is null then
    return null;
  end if;

  if jsonb_typeof(value) = 'object' then
    -- The settlement ROOT is the only object reached with an empty path.
    is_toplevel := array_length(path, 1) is null;
    -- True when this object is a direct element of an `npcs` array (its parent
    -- key is 'npcs'); only then do we apply the NPC field allowlist.
    is_npc_obj := array_length(path, 1) is not null
              and path[array_length(path, 1)] = 'npcs';
    out := '{}'::jsonb;
    for key, child in select * from jsonb_each(value) loop
      -- TOP LEVEL: allowlist (fail closed). An unknown/future top-level key is
      -- dropped even if it misses the denylist — the whole point of the flip.
      if is_toplevel and not (key = any(public_toplevel)) then
        continue;
      end if;
      -- DEEPER LEVELS: keep the recursive DM-private denylist (defense-in-depth
      -- for private keys nested inside an allowed subtree). dm/gm use word
      -- boundaries (\m) so they match dmNotes/gm* but NOT landmarks/admin. `seed`
      -- (bare, conservative) + `_config` kill the generation seed / raw config at
      -- ANY depth — critical because `config` is allowlisted at top level, so
      -- config._seed would otherwise ride through (matches 099's denylist). 128:
      -- `latentPantheon` kills the UNREVEALED starting-pantheon channel (Phase 4
      -- premium gate) — config.latentPantheon would otherwise ride through the same
      -- allowlisted `config`. The ACTIVATED embeds carry no such key and stay.
      if not is_toplevel and key ~* '(secret|private|\m(dm|gm)|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|latentPantheon|seed|_config)' then
        continue;
      end if;
      -- NPC objects: keep ONLY the public allowlist (unchanged from 033).
      if is_npc_obj and not (key = any(npc_allowed)) then
        continue;
      end if;

      sanitized := public._gallery_sanitize_public_json(child, path || key);
      if sanitized is not null then
        out := out || jsonb_build_object(key, sanitized);
      end if;
    end loop;
    return out;
  end if;

  if jsonb_typeof(value) = 'array' then
    out := '[]'::jsonb;
    for child in select jsonb_array_elements(value) loop
      sanitized := public._gallery_sanitize_public_json(child, path);
      if sanitized is not null then
        out := out || jsonb_build_array(sanitized);
      end if;
    end loop;
    return out;
  end if;

  return value;
end;
$$;

-- Preserve the original grant posture (020 revoked from public).
revoke execute on function public._gallery_sanitize_public_json(jsonb, text[]) from public;

comment on function public._gallery_sanitize_public_json(jsonb, text[]) is
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099; and latentPantheon so the unrevealed starting pantheon cannot leak — 128) + NPC allowlist (033). search_path pinned public, pg_temp (111). _gallery_dm_full_json is left net-current at 121 (its _regenSeed strip preserved).';

-- ══ § 2. _gallery_world_snapshot_is_safe — add latentPantheon (net-current 127) ══
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
      -- 128: `.*latentPantheon.*` closes the PRIVATE_KEY_RE latentPantheon drift (the
      -- unrevealed starting-pantheon channel the Phase 4 premium gate made SECRET).
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
        || '|.*latentPantheon.*'
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
  'Defense-in-depth (089; 127 adds _config; 128 adds latentPantheon): true ONLY when a stored gallery world snapshot carries NONE of the HARD-DENY / covert keys at any depth. The hard-deny compare is case-insensitive; the covert regex covers the client COVERT_KEY_RE (src/domain/display/worldSnapshotPublic.js) tokens anchored to WHOLE-key matches plus the PRIVATE_KEY_RE (src/domain/display/publicSafe.js) tokens — including _config (127) and latentPantheon (128) — by contains-semantics. publish_map (089) and the saved_maps write guard (091) both call this to REJECT a client-supplied snapshot server-side.';
