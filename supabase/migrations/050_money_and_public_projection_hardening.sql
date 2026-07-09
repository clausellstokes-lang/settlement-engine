-- ────────────────────────────────────────────────────────────────────────────
-- 050_money_and_public_projection_hardening.sql
--
-- Net-state fixes from the exhaustive review — three independent hardenings that
-- all share one theme: a server projection that must be CORRECT and FAIL CLOSED,
-- not merely "usually right". Migrations 001–049 are immutable history, so each
-- fix re-declares the current object here (the 033 precedent).
--
--   § 1. refund_credits — counter drift + true idempotency (finding F1 residue).
--        047 made service-role a first-class caller and added a structural
--        idempotency index, but left TWO defects:
--          (a) it still updated profiles.credits by INCREMENTAL arithmetic
--              (`credits = credits + amount`) while spend_credits (024) and
--              admin_grant_credits (024) RECOMPUTE the counter from the ledger.
--              Any pre-existing drift (or a torn dual-write) is carried forward
--              forever, and the counter can diverge from get_credit_balance().
--          (b) its idempotency was an EXISTS-then-INSERT that RAISED
--              'already refunded'. An automatic refund is retried at-least-once
--              by the edge functions, so the correct behaviour is a NO-OP that
--              returns the current balance — not an error the caller must special
--              case. The check was also check-then-act (TOCTOU) ahead of the
--              index.
--        Fix: recompute the counter from the ledger (identical expression to
--        spend/grant) and treat a unique-index violation as the idempotent
--        no-op path.
--
--   § 2. get_gallery_map — view_count inflation (046 regressed 029's dedup).
--        029 de-duplicated settlement gallery views per (dossier, viewer, UTC
--        day); the maps gallery (045/046) shipped a naive `view_count + 1` on
--        every anonymous read, so one reader refreshing (or a crawler) inflates
--        the number. Fix: the 029 dedup pattern, applied to saved_maps via a
--        sibling ledger table.
--
--   § 3. _gallery_sanitize_public_json — DENYLIST → ALLOWLIST at the top level.
--        The public settlement projection was a recursive DENYLIST: it dropped
--        keys MATCHING a private-key regex and kept everything else. That fails
--        OPEN — any future DM-private top-level field whose key misses the regex
--        (the exact class that already let `aiOverlays` / `userCanon` leak today)
--        ships to anonymous readers. Fix: gate the settlement ROOT to an explicit
--        allowlist of known-public top-level fields (fail closed); keep the
--        recursive denylist + 033 NPC allowlist for DEEPER levels as
--        defense-in-depth. The allowlist is mirrored in the client twin
--        (src/domain/display/publicSafe.js PUBLIC_TOPLEVEL_KEYS) and pinned
--        identical by tests/security/gallerySanitizeAllowlist.contract.test.js.
-- ════════════════════════════════════════════════════════════════════════════


-- ══ § 1. refund_credits — ledger-recompute counter + idempotent no-op ═════════

-- Structural idempotency (supersedes 047's narrower index): at most one ledger
-- row per refunded spend. The predicate keys on the correlation field itself
-- (metadata->>'refund_of') rather than kind/source, so a refund written under
-- ANY future source label still cannot double-apply. Only refund grants ever
-- carry refund_of, so the covered row set is unchanged in practice.
drop index if exists public.idx_credit_ledger_one_refund_per_spend;
create unique index if not exists idx_credit_ledger_one_refund_per_spend
  on public.credit_ledger ((metadata->>'refund_of'))
  where metadata->>'refund_of' is not null;

create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row  record;
  is_service boolean;
  is_admin   boolean;
  new_balance integer;
begin
  -- Trusted server context? (edge functions call via the service-role client;
  -- keep 047's semantics EXACTLY — do not regress F1.)
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  -- A human caller must be authenticated; the service role need not be.
  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := (not is_service) and public.current_user_is_privileged();

  -- Ownership check applies only to human callers. The service role is trusted
  -- because it only reaches this path after a server-verified generation failure
  -- and never exposes the RPC to the client.
  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Idempotency is STRUCTURAL (idx_credit_ledger_one_refund_per_spend), not a
  -- check-then-act guard. Attempt the refund grant; a duplicate — including one
  -- racing a concurrent retry — trips the unique index, which we treat as a
  -- NO-OP that returns the current balance. Refund is safe to retry (the edge
  -- functions deliver at-least-once), so a second call must not be an error.
  begin
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (
        spend_row.user_id,
        'grant',
        spend_row.amount,
        'refund',
        jsonb_build_object(
          'refund_of', spend_ledger_row,
          'reason', refund_reason
        )
      );
  exception when unique_violation then
    -- Already refunded (this call or a concurrent one). Return the recomputed
    -- balance so the caller sees the settled state, and DO NOT write the legacy
    -- mirror row again — exactly one refund per spend, everywhere.
    return public.get_credit_balance(spend_row.user_id);
  end;

  -- Mirror into legacy table for dual-write parity (winning insert only).
  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  -- RECOMPUTE profiles.credits from the ledger — the SAME canonical expression
  -- as spend_credits/admin_grant_credits (024). Incremental `credits + amount`
  -- arithmetic (047) drifts from ledger truth; recompute keeps the counter and
  -- get_credit_balance() in lockstep after every refund.
  new_balance := public.get_credit_balance(spend_row.user_id);
  update public.profiles
    set credits = new_balance,
        updated_at = now()
    where id = spend_row.user_id;

  -- Audit if a privileged HUMAN initiated it (service-role refunds are system
  -- actions, audited via the edge-function logs instead).
  if is_admin and auth.uid() is not null and auth.uid() <> spend_row.user_id then
    perform public._audit_action(
      auth.uid(),
      spend_row.user_id,
      'refund_credits',
      jsonb_build_object('spend_row', spend_ledger_row, 'amount', spend_row.amount),
      jsonb_build_object('new_balance', new_balance),
      refund_reason
    );
  end if;

  return new_balance;
end;
$$;

-- Preserve the 033/047 grant posture (idempotent — safe to re-assert).
revoke execute on function public.refund_credits(uuid, text) from authenticated;
revoke execute on function public.refund_credits(uuid, text) from anon;
grant  execute on function public.refund_credits(uuid, text) to service_role;

comment on function public.refund_credits(uuid, text) is
  'Service-role (or privileged human) refund of a spend ledger row. Idempotent: a duplicate refund is a NO-OP returning the current balance, backed by idx_credit_ledger_one_refund_per_spend. Recomputes profiles.credits from the ledger (never incremental arithmetic).';


-- ══ § 2. get_gallery_map — per-(map, viewer, day) view dedup (029 pattern) ════

-- Sibling of gallery_views (029), keyed to saved_maps. One row per (map, viewer,
-- UTC day); a repeat view in the same day is a no-op insert. RLS on + no policies
-- + grants revoked → only the SECURITY DEFINER function below may touch it.
create table if not exists public.gallery_map_views (
  map_id     uuid not null references public.saved_maps(id) on delete cascade,
  viewer_key text not null,
  viewed_on  date not null default (now() at time zone 'utc')::date,
  created_at timestamptz not null default now(),
  primary key (map_id, viewer_key, viewed_on)
);

alter table public.gallery_map_views enable row level security;
revoke all on public.gallery_map_views from anon, authenticated;

comment on table public.gallery_map_views is
  'Per-(map, viewer, UTC day) dedup ledger for get_gallery_map. Written only by that SECURITY DEFINER function; never read by clients. Mirrors gallery_views (029) for the maps gallery.';

-- The read RPC gains an optional viewer_token (the client anon device token, as
-- in 029). Adding a defaulted parameter changes the signature, so drop the 1-arg
-- version first to avoid an ambiguous overload; existing callers that pass only
-- { p_slug } still resolve (viewer_token defaults NULL).
drop function if exists public.get_gallery_map(text);

create or replace function public.get_gallery_map(p_slug text, viewer_token text default null)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  row      public.saved_maps;
  v_camp   jsonb;
  v_members jsonb;
  v_ua     text;
  v_key    text;
begin
  select * into row from public.saved_maps where public_slug = p_slug and is_public = true;
  if not found then return null; end if;

  -- ── De-duplicated view count (029 pattern) ────────────────────────────────
  -- Best-effort User-Agent (PostgREST exposes request headers as a JSON GUC).
  begin
    v_ua := nullif(current_setting('request.headers', true), '')::json ->> 'user-agent';
  exception when others then
    v_ua := null;
  end;
  -- Skip obvious bots/crawlers/scripts — they shouldn't inflate vanity counts.
  if v_ua is null or v_ua !~* '(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview|headless|monitor|uptime|curl|wget|python-requests|go-http|axios|node-fetch|libwww|okhttp)' then
    -- Pick the most-trusted available identity (signed-in uid > anon device
    -- token > coarse UA hash), exactly like bump_public_view (029).
    v_key := coalesce(
      case when auth.uid() is not null then 'u:' || auth.uid()::text end,
      case when viewer_token is not null and length(viewer_token) between 8 and 200
           then 't:' || viewer_token end,
      'a:' || md5(coalesce(v_ua, 'anon'))
    );
    -- New viewer/day → count it; repeat within the day → no-op.
    insert into public.gallery_map_views (map_id, viewer_key)
      values (row.id, v_key)
      on conflict (map_id, viewer_key, viewed_on) do nothing;
    if found then
      update public.saved_maps set view_count = view_count + 1 where id = row.id;
    end if;
  end if;

  if row.share_kind = 'map_with_campaign' and row.gallery_share_campaign then
    v_camp := coalesce(row.map_data->'campaign', row.map_data);
    -- Member dossiers — public-safe via the SAME sanitizers as the settlement
    -- gallery. settlementIds that aren't cloud rows (local-only) simply drop out.
    select jsonb_agg(jsonb_build_object(
      'old_id',     s.id::text,
      'name',       s.name,
      'tier',       s.tier,
      'settlement', public._gallery_sanitize_public_json(s.data),
      'chronicle',  public._gallery_chronicle_json(s.campaign_state -> 'eventLog')
    )) into v_members
    from public.settlements s
    where s.id::text in (
      select jsonb_array_elements_text(coalesce(v_camp->'settlementIds', '[]'::jsonb))
    )
      -- CRITICAL (IDOR guard): the owner may only ever expose their OWN
      -- settlements. settlementIds is owner-controlled free-form jsonb and this
      -- fn is SECURITY DEFINER (bypasses settlements RLS), so without this an
      -- owner could list another user's settlement UUIDs and leak their dossiers.
      and s.user_id = row.user_id
      and s.access_state = 'active';

    return jsonb_build_object(
      'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
      'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
      -- ALLOWLIST the mapState fields the importer actually consumes (backdrop +
      -- placements + the sharer's published annotations). layers/viewport (which
      -- include GM display filters) are deliberately dropped; worldState /
      -- regionalGraph are siblings under v_camp and NEVER included.
      'mapState', (
        select jsonb_strip_nulls(jsonb_build_object(
          'fmgSnapshot',    ms->'fmgSnapshot',
          'seed',           ms->'seed',
          'customBackdrop', ms->'customBackdrop',
          'placements',     ms->'placements',
          'labels',         ms->'labels',
          'markers',        ms->'markers',
          'forests',        ms->'forests'
        )) from (select v_camp->'mapState' as ms) x
      ),
      'members', coalesce(v_members, '[]'::jsonb)
    );
  end if;

  -- Default / kind='map' = blank-canvas backdrop only (Phase 1).
  return jsonb_build_object(
    'slug', row.public_slug, 'name', row.name, 'kind', row.share_kind,
    'description', row.gallery_description, 'tags', to_jsonb(row.gallery_tags),
    'backdrop', public._gallery_map_backdrop(row.map_data)
  );
end $$;

grant execute on function public.get_gallery_map(text, text) to anon, authenticated;

comment on function public.get_gallery_map(text, text) is
  'Public map gallery read. De-duplicated view counter (per map/viewer/UTC day, bots skipped — 029 pattern); viewer_token is the client anon device token. map_with_campaign members are public-safe via _gallery_sanitize_public_json + _gallery_chronicle_json.';


-- ══ § 3. _gallery_sanitize_public_json — top-level ALLOWLIST (fail closed) ════

create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default '{}')
returns jsonb
language plpgsql
immutable
set search_path = public
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
  -- and asserts it equals the JS export — the drift pin. Derived from what the
  -- public dossier / gallery actually renders (gallery RPCs 020–033, publicChronicle,
  -- OutputContainer playerView) plus the two narrated-public fields (thesis,
  -- dailyLife) that the shareNarrated base — s.ai_data->'aiSettlement' — surfaces.
  -- Deliberately EXCLUDED (private / leak-prone / not rendered publicly):
  --   aiData, aiSettlement, aiDailyLife, aiOverlays, userCanon, dmNotes, dmCompass,
  --   dossierNotes, notes, narrativeNotes, tabNotes, plotHooks, pinnedNpc,
  --   identityMarkers, frictionPoints, connectionsMap, simulationTrace, pendingEdits,
  --   campaign, version_history — none of which are part of the public render.
  public_toplevel constant text[] := array[
    '_config','_seed','activeConditions','arrivalScene','availableServices',
    'coherenceNotes','config','conflicts','dailyLife','defenseProfile',
    'economicState','economicViability','factions','generatorVersion','history',
    'id','institutions','name','neighborRelationship','npcs',
    'population','powerStructure','pressureSentence','prominentRelationship','relationships',
    'resourceAnalysis','schemaVersion','settlementReason','simulationVersion','spatialLayout',
    'stress','stressors','structuralSuggestions','structuralViolations','thesis',
    'tier'
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
      -- boundaries (\m) so they match dmNotes/gm* but NOT landmarks/admin.
      if not is_toplevel and key ~* '(secret|private|\m(dm|gm)|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap)' then
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
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist + NPC allowlist (033) as defense-in-depth.';
