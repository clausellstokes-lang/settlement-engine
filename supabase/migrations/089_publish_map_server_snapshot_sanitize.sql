-- ════════════════════════════════════════════════════════════════════════════
-- 089 — server-side world-snapshot sanitization for publish_map
-- ════════════════════════════════════════════════════════════════════════════
-- 088 is already applied in production, so the server-side defense-in-depth for
-- the gallery world snapshot ships as a FORWARD migration here rather than as an
-- in-place edit of 088 (an applied migration is never re-run by `supabase db push`).
--
-- WHY: 088's publish_map stored the client-supplied p_world_snapshot jsonb VERBATIM
-- and get_gallery_map serves it to anon, so the entire worldState privacy contract
-- rested on the unprivileged client serializer (serializeWorldSnapshotPublic). This
-- adds an immutable server scanner + recreates publish_map (net-current = forked
-- from 088) to REJECT, server-side, any snapshot that is malformed, lacks
-- schemaVersion = 1, or carries ANY HARD-DENY / covert key at any depth. The client
-- serializer is now convenience, not the sole guard. See the net-current-recreate
-- rule: publish_map is forked from 088 (its highest-numbered prior definition),
-- preserving the 059 account gate + 046 IDOR member-ownership guard + 072 importable
-- coalesce + all the 088 share params.
-- ⚠️ inert until `supabase db push` + a PostgREST schema refresh.

-- ── (1b) _gallery_world_snapshot_is_safe — server-side defense-in-depth ───────
-- An immutable, deterministic recursive scan over a stored world-snapshot jsonb.
-- Returns true ONLY when the snapshot carries NONE of the HARD-DENY / covert keys
-- at any depth (object key OR array element), so the worldState privacy contract no
-- longer rests on the unprivileged client serializer alone. Mirrors the HARD-DENY
-- list + COVERT_KEY_RE in src/domain/display/worldSnapshotPublic.js. Cheap: a single
-- depth-first walk, no allocation beyond the recursion, no clock / random.
--
-- The forbidden set is the exact HARD-DENY list (npcStates, factionStates,
-- relationshipStates, pendingEvents, proposals, stressors, pausedAdvance,
-- settlementTickStates, rngSeed, deferredImpacts, deferredWarFronts,
-- deferredPartyImpacts) plus the covert prose channels (the union of the client
-- COVERT_KEY_RE in worldSnapshotPublic.js and PRIVATE_KEY_RE in publicSafe.js) that
-- the client final-scrub drops. The hard-deny compare is case-insensitive (lower on
-- both sides) so a mixed/upper-cased key like NpcStates cannot bypass it, and the
-- covert regex is anchored to whole-key matches so a benign key that merely CONTAINS
-- a token (e.g. "Seedhaven", "seedTick") is not false-rejected.
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

-- Internal helper: not a public RPC. Revoke the implicit public grant.
revoke execute on function public._gallery_world_snapshot_is_safe(jsonb) from public;

comment on function public._gallery_world_snapshot_is_safe(jsonb) is
  'Defense-in-depth (088): true ONLY when a stored gallery world snapshot carries NONE of the HARD-DENY / covert keys at any depth. The hard-deny compare is case-insensitive and the covert regex mirrors the UNION of WORLD_SNAPSHOT_HARD_DENY + COVERT_KEY_RE (src/domain/display/worldSnapshotPublic.js) and PRIVATE_KEY_RE (src/domain/display/publicSafe.js), anchored to whole-key matches. publish_map calls this to REJECT a client-supplied p_world_snapshot server-side, so the worldState privacy contract no longer rests on the client alone.';

-- ── (2) publish_map — recreated net-current (forked from 088) ───────────────────────────
-- KEEPS every 073 guard verbatim: 059 auth + account_is_active gates, 046
-- map_with_campaign member-ownership IDOR guard, owner check, 072 gallery_importable
-- coalesce. ADDS 7 optional params (safe defaults — existing callers unaffected),
-- WIDENS gallery_description from left(...,500) to left(...,8000) (sanitized-HTML
-- budget; the client sanitizes), and WRITES the new columns (facets unpacked from
-- p_facets). The signature changes (new params), so drop the 073 5-arg version
-- first, then recreate (the 072/073 precedent for superseding a maps function).
drop function if exists public.publish_map(uuid, text, text, text[], boolean);

create or replace function public.publish_map(
  target_id           uuid,
  p_kind              text    default 'map',
  p_description       text    default null,
  p_tags              text[]  default null,
  p_importable        boolean default null,
  p_image_url         text    default null,
  p_image_alt         text    default null,
  p_share_world       boolean default null,
  p_world_sections    jsonb   default null,
  p_world_snapshot    jsonb   default null,
  p_realm_arc_summary text    default null,
  p_facets            jsonb   default null
) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing_slug text;
  new_slug      text;
  v_kind        text := case when p_kind = 'map_with_campaign' then 'map_with_campaign' else 'map' end;
  v_map         jsonb;
  v_unowned     int;
  -- 088: unpack the gallery facets from p_facets so a re-share that omits a facet
  -- preserves the prior column value (coalesce(..., current) in the UPDATE below).
  v_f_member_band      text    := nullif(p_facets->>'memberBand', '');
  v_f_dominant_culture text    := nullif(p_facets->>'dominantCulture', '');
  v_f_tier_spread      text    := nullif(p_facets->>'tierSpread', '');
  v_f_at_war           boolean := case when p_facets ? 'atWar' then (p_facets->>'atWar')::boolean else null end;
begin
  -- Account-status gates (059, restored by 073): a banned / disabled / soft-deleted
  -- account may not publish.
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  select map_data into v_map from public.saved_maps where id = target_id and user_id = auth.uid();
  if not found then raise exception 'Not found or not owned by caller'; end if;

  -- map_with_campaign member-ownership IDOR guard (046): every member settlement
  -- must be owned by the caller.
  if v_kind = 'map_with_campaign' then
    select count(*) into v_unowned
      from jsonb_array_elements_text(coalesce(v_map->'campaign'->'settlementIds', v_map->'settlementIds', '[]'::jsonb)) as sid
      where not exists (select 1 from public.settlements s where s.id::text = sid and s.user_id = auth.uid());
    if v_unowned > 0 then
      raise exception 'Cannot share a campaign containing settlements you do not own';
    end if;
  end if;

  -- 088 DEFENSE-IN-DEPTH: a client-supplied world snapshot is no longer trusted
  -- verbatim. When present it MUST be a versioned (schemaVersion = 1) object that
  -- carries NO HARD-DENY / covert key at any depth — otherwise reject the publish
  -- rather than store a snapshot get_gallery_map would later serve to anon. (Null =
  -- no shared-world panel, which is fine; the opt-in gate handles projection.)
  if p_world_snapshot is not null then
    if jsonb_typeof(p_world_snapshot) <> 'object'
       or (p_world_snapshot->>'schemaVersion') is distinct from '1' then
      raise exception 'World snapshot is malformed or has an unsupported schemaVersion (expected 1)';
    end if;
    if not public._gallery_world_snapshot_is_safe(p_world_snapshot) then
      raise exception 'World snapshot contains a forbidden private key and cannot be shared';
    end if;
  end if;
  -- The world-sections array gets the same depth scan (it is the second stored,
  -- anon-served artifact). schemaVersion is snapshot-only, so sections is scanned
  -- for forbidden keys but not version-gated.
  if p_world_sections is not null and not public._gallery_world_snapshot_is_safe(p_world_sections) then
    raise exception 'World sections contain a forbidden private key and cannot be shared';
  end if;

  select public_slug into existing_slug from public.saved_maps where id = target_id;
  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.saved_maps
          set is_public = true, public_slug = new_slug, published_at = now(),
              share_kind = v_kind, gallery_share_campaign = (v_kind = 'map_with_campaign'),
              -- 088: widened to an 8000-char sanitized-HTML budget (client sanitizes).
              gallery_description = left(coalesce(p_description, ''), 8000), gallery_tags = p_tags,
              gallery_importable = coalesce(p_importable, gallery_importable),
              -- 088 new columns — coalesce(..., current) preserves a prior choice
              -- on a re-share that omits the field.
              gallery_image_url          = coalesce(p_image_url, gallery_image_url),
              gallery_image_alt          = coalesce(p_image_alt, gallery_image_alt),
              gallery_share_world        = coalesce(p_share_world, gallery_share_world, false),
              gallery_world_sections     = coalesce(p_world_sections, gallery_world_sections, '[]'::jsonb),
              gallery_world_snapshot     = coalesce(p_world_snapshot, gallery_world_snapshot),
              gallery_realm_arc_summary  = coalesce(p_realm_arc_summary, gallery_realm_arc_summary),
              gallery_facet_member_band     = coalesce(v_f_member_band, gallery_facet_member_band),
              gallery_facet_at_war          = coalesce(v_f_at_war, gallery_facet_at_war),
              gallery_facet_dominant_culture = coalesce(v_f_dominant_culture, gallery_facet_dominant_culture),
              gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread)
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then /* retry */
      end;
    end loop;
  else
    update public.saved_maps
      set is_public = true, published_at = now(), share_kind = v_kind,
          gallery_share_campaign = (v_kind = 'map_with_campaign'),
          gallery_description = left(coalesce(p_description, ''), 8000), gallery_tags = p_tags,
          gallery_importable = coalesce(p_importable, gallery_importable),
          gallery_image_url          = coalesce(p_image_url, gallery_image_url),
          gallery_image_alt          = coalesce(p_image_alt, gallery_image_alt),
          gallery_share_world        = coalesce(p_share_world, gallery_share_world, false),
          gallery_world_sections     = coalesce(p_world_sections, gallery_world_sections, '[]'::jsonb),
          gallery_world_snapshot     = coalesce(p_world_snapshot, gallery_world_snapshot),
          gallery_realm_arc_summary  = coalesce(p_realm_arc_summary, gallery_realm_arc_summary),
          gallery_facet_member_band     = coalesce(v_f_member_band, gallery_facet_member_band),
          gallery_facet_at_war          = coalesce(v_f_at_war, gallery_facet_at_war),
          gallery_facet_dominant_culture = coalesce(v_f_dominant_culture, gallery_facet_dominant_culture),
          gallery_facet_tier_spread     = coalesce(v_f_tier_spread, gallery_facet_tier_spread)
      where id = target_id;
  end if;
  return existing_slug;
end $$;

-- Grants mirror 073 exactly (revoke from public, grant to authenticated) on the
-- new 12-arg signature.
revoke all on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) from public;
grant execute on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) to authenticated;

comment on function public.publish_map(uuid, text, text, text[], boolean, text, text, boolean, jsonb, jsonb, text, jsonb) is
  'Owner map publish/re-publish to the gallery. Preserves the 059 account-status gate + 046 member-ownership IDOR guard + 072 importable opt-in (forked from 073). 088: adds cover image, opt-in shared-world snapshot, realm-arc summary, an 8000-char sanitized-HTML description, and map-level facets.';

