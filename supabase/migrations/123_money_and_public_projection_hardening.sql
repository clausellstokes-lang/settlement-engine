-- ────────────────────────────────────────────────────────────────────────────
-- 123_money_and_public_projection_hardening.sql
--
-- MERGE PROVENANCE (Wave-1). This is our former 050, REBUILT onto the adopted
-- 047–121 chain per the two fusion specs in the Wave-0 audit:
--
--   § 1. refund_credits — FUSION A: their 087 FOR-UPDATE serialization + their
--        087 elevated-spend skip, fused with OUR 050 no-op idempotency (a
--        duplicate refund returns the balance instead of raising) and OUR 050
--        ledger-recompute counter. Backed by 087's applied ux_ index (never our
--        old idx_ name). This is the load-bearing money-path shape the edge
--        refund path depends on (an at-least-once retry MUST NOT raise).
--
--   § 3. _gallery_sanitize_public_json — FUSION B: OUR 050 fail-closed top-level
--        ALLOWLIST architecture, reconciled against their post-088 public field
--        surface (four served+rendered keys added), with '_seed'/'_config'
--        removed from the allowlist AND folded into the deeper denylist (per 099)
--        so nested config._seed can't leak, and 111's `public, pg_temp` pin. Their
--        121 _gallery_dm_full_json is left NET-CURRENT (not redefined here), so
--        its _regenSeed strip is preserved automatically.
--
--   NOTE — our old 050 §2 (get_gallery_map per-viewer/day view-count dedup) is
--   NOT in this migration. Their net-current get_gallery_map is the much richer
--   088 body (shared-world panel, cover image, member-ownership IDOR guard, sort
--   facets) and still carries the naive `view_count + 1`; a faithful dedup port
--   must rebuild onto the 088 body (+ a gallery_map_views table) — the same
--   pattern as the 059 gallery-guard fold — and is deferred to its own migration
--   so this money/sanitizer hardening stays scoped to fusion A + B. (Tracked as a
--   Wave-1 follow-up; the regression is cosmetic — vanity count inflation, no
--   money, no leak.)
--
-- Migrations 001–121 are immutable history; each fix here re-declares the current
-- object (the 033 precedent).
-- ════════════════════════════════════════════════════════════════════════════


-- ══ § 1. refund_credits — FUSION A ═══════════════════════════════════════════
-- Their 087 backstop index (idempotency), re-asserted idempotently. The
-- unique_violation catch in the body below fires on THIS index. Keep the APPLIED
-- name `ux_credit_ledger_one_refund_per_spend` (087, predicate `source='refund'`);
-- do NOT create our old `idx_…` name (it was never applied in prod). Every refund
-- grant carries both source='refund' and metadata->>'refund_of', so the two
-- predicates cover the same rows — one index is enough.
--
-- @rollback: `drop index if exists public.ux_credit_ledger_one_refund_per_spend;`
--   then re-create the PRIOR refund_credits from 103_service_adjust_credits.sql
--   (net-current pre-123 definition). NOTE: that reinstates the double-refund
--   window and re-opens execute grants this migration revoked — forward-fix
--   first; roll back only to unblock a broken deploy, then re-apply.
create unique index if not exists ux_credit_ledger_one_refund_per_spend
  on public.credit_ledger ((metadata->>'refund_of'))
  where source = 'refund';

create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row record;
  is_admin boolean;
  is_service boolean;
  new_balance integer;
begin
  -- Service-role is a FIRST-CLASS caller (085/047): the edge functions refund via
  -- the service-role client (auth.uid() NULL) after a server-verified failure.
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- FOR UPDATE (087): serialize concurrent refunds of the SAME spend so the
  -- idempotency below is atomic. A redelivered refund blocks until the first
  -- COMMITs, then trips the unique index — caught as a no-op (below).
  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row
    for update;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  -- Ownership gate — human callers only. The service role is trusted (reaches this
  -- path only after a server-verified generation failure; refunds by spend_id).
  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Elevated-spend skip (087). An ELEVATED (dev/admin) spend never debited credits
  -- or wrote allocations (spend_credits skips both for metadata.elevated=true), so
  -- refunding it would MINT phantom credits. No-op + return the live balance.
  -- Placed AFTER the ownership gate so a caller can't probe another user's balance
  -- via a non-owned elevated spend id.
  if coalesce(spend_row.metadata->>'elevated', 'false') = 'true' then
    return (select credits from public.profiles where id = spend_row.user_id);
  end if;

  -- Idempotency is STRUCTURAL (ux_credit_ledger_one_refund_per_spend), not a
  -- check-then-act guard. Attempt the refund grant; a duplicate — including one
  -- racing a concurrent retry — trips the unique index, which we treat as a NO-OP
  -- returning the current balance (OUR 050 semantics). Refund is safe to retry
  -- (the edge functions deliver at-least-once), so a second call MUST NOT be an
  -- error: their 085/087 raise-on-duplicate would fire false
  -- {refund:'failed', supportNote:'contact support'} alarms on the refund path
  -- (see generate-narrative). DO NOT restore this to a raise.
  begin
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (
        spend_row.user_id,
        'grant',
        spend_row.amount,
        'refund',
        jsonb_build_object('refund_of', spend_ledger_row, 'reason', refund_reason)
      );
  exception when unique_violation then
    -- Duplicate refund (this call or a concurrent one). Return the recomputed
    -- balance so the caller sees the settled state, and DO NOT write the legacy
    -- mirror row again — exactly one refund per spend, everywhere.
    return public.get_credit_balance(spend_row.user_id);
  end;

  -- Mirror into legacy table for dual-write parity (winning insert only).
  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  -- RECOMPUTE profiles.credits from the ledger — the SAME canonical expression as
  -- spend_credits / system_grant_credits (018). Incremental `credits + amount`
  -- arithmetic (085/087) carries any pre-existing drift forward and can diverge
  -- from get_credit_balance(); recompute keeps the counter and the balance reader
  -- in lockstep (OUR 050 semantics). SAFE under the 110 IDOR guard: this SECURITY
  -- DEFINER reaches get_credit_balance with auth.uid()=NULL (service_role/system)
  -- or as owner/admin — all exempt from 110's cross-user raise (system_grant_
  -- credits, 116, is a live post-110 precedent for a definer reading a target's
  -- balance).
  new_balance := public.get_credit_balance(spend_row.user_id);
  update public.profiles
    set credits = new_balance,
        updated_at = now()
    where id = spend_row.user_id;

  -- Audit if a privileged HUMAN initiated it (service-role refunds are system
  -- actions, audited via the edge-function logs). is_admin implies a non-null
  -- auth.uid() (current_user_is_privileged matches a profile row for auth.uid()).
  if is_admin and auth.uid() <> spend_row.user_id then
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

-- Preserve the 033/085/087 grant posture (service-role only; idempotent).
revoke execute on function public.refund_credits(uuid, text) from public;
revoke execute on function public.refund_credits(uuid, text) from anon;
revoke execute on function public.refund_credits(uuid, text) from authenticated;
grant  execute on function public.refund_credits(uuid, text) to service_role;

comment on function public.refund_credits(uuid, text) is
  'Service-role (or privileged human) refund of a spend ledger row. FOR UPDATE-serialized + elevated-spend skip (087). Idempotent: a duplicate refund is a NO-OP returning the current balance (050), backed by ux_credit_ledger_one_refund_per_spend (087) — never raises on an at-least-once retry. Recomputes profiles.credits from the ledger (never incremental arithmetic).';


-- ══ § 3. _gallery_sanitize_public_json — FUSION B (top-level ALLOWLIST) ═══════
-- OUR 050 fail-closed top-level allowlist, RECONCILED against their post-088
-- public field surface (four served+rendered keys added — see below), with
-- '_seed'/'_config' REMOVED from the allowlist and FOLDED into the deeper denylist
-- (per 099) so nested config._seed can't leak, and 111's `public, pg_temp` pin.
-- _gallery_dm_full_json is deliberately NOT redefined here → their 121 stays
-- net-current and its _regenSeed strip is preserved.
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
  -- and pins it to the merged JS twin — the drift pin. Derived from what the public
  -- dossier / gallery actually renders (gallery RPCs 020–033, publicChronicle,
  -- OutputContainer playerView) plus the two narrated-public fields (thesis,
  -- dailyLife) surfaced by the shareNarrated base (ai_data->'aiSettlement').
  --
  -- FUSION B reconciliation vs our pre-merge 050 list:
  --   • REMOVED '_seed' + '_config' — the deterministic generation seed and raw
  --     authoring config are secret on every shared surface (matches 099/121). At
  --     the top level the fail-closed allowlist now drops them by omission; nested
  --     copies (config._seed) are caught by the deeper denylist's seed/_config
  --     tokens below.
  --   • ADDED crossSettlementConflicts, interSettlementRelationships,
  --     neighbourNetwork, populationHistory — top-level keys their post-088 public
  --     dossier SERVES (no denylist token) AND RENDERS in the anonymous playerView
  --     (RelationshipsTab cross-settlement sections + OverviewTab population arc).
  --     Our pre-merge allowlist (derived from our ≤049 render) would have silently
  --     blanked those sections for campaign/world-simulated dossiers.
  -- Deliberately EXCLUDED (private / leak-prone / empty / store-sourced / not
  -- rendered from the served object): aiData, aiSettlement, aiDailyLife, aiOverlays,
  -- userCanon, dmNotes, dmCompass, dossierNotes, notes, narrativeNotes, tabNotes,
  -- plotHooks, pinnedNpc, identityMarkers, frictionPoints, connectionsMap,
  -- simulationTrace, pendingEdits, campaign, version_history.
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
      -- config._seed would otherwise ride through (matches 099's denylist).
      if not is_toplevel and key ~* '(secret|private|\m(dm|gm)|guidance|note|plotHook|plot_hooks|hook|compass|chronicle|pinnedNpc|aiData|aiSettlement|aiDailyLife|narrativeNotes|identityMarkers|frictionPoints|connectionsMap|seed|_config)' then
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
  'Public dossier JSON projection. TOP-LEVEL keys are gated by an explicit allowlist (fail closed — mirrors publicSafe.js PUBLIC_TOPLEVEL_KEYS); deeper levels keep the recursive DM-private denylist (incl. seed/_config so config._seed cannot leak — 099) + NPC allowlist (033). search_path pinned public, pg_temp (111). _gallery_dm_full_json is left net-current at 121 (its _regenSeed strip preserved).';
