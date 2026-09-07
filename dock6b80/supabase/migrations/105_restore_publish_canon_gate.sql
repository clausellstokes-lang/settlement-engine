-- ────────────────────────────────────────────────────────────────────────────
-- 105_restore_publish_canon_gate.sql — restore the canon-only server gate on
-- publish_settlement that 059's recreate silently dropped.
--
-- 018 added a server-side gate: only a CANONIZED settlement may be shared to
-- the public gallery ("Only canonized settlements can be shared publicly").
-- 059's account-status recreate rebuilt publish_settlement from the 008 shape
-- (auth + account_is_active + owner check + slug mint) and did not carry the
-- 018 canon gate forward; no later migration restored it. The client
-- (ShareToGallery.jsx) still enforces canon at three layers, so real users
-- never hit the gap — but a direct RPC call could publish an un-canonized
-- dossier, and the server is the trust boundary.
--
-- Fix: recreate publish_settlement from its NET-CURRENT body (059) with the
-- canon gate restored. The gate mirrors the CLIENT's semantics
-- (isCampaignCanonized), which are the product's current rules — NOT 018's
-- stricter literal, which also blocked settlements with NO campaign_state at
-- all (013: NULL = "no canon yet"; the client treats those as publishable and
-- always has since the gate was lost):
--   • campaign_state IS NULL            → publishable (no campaign lifecycle)
--   • phase = 'canon'                   → publishable
--   • canonizedAt set (top-level)       → publishable
--   • worldState.canonizedAt set        → publishable (the client's third path)
--   • anything else                     → reject.
--
-- Everything else (auth, 059's account_is_active gate, owner check, slug
-- mint/keep) is byte-identical to 059. Same signature — CREATE OR REPLACE,
-- safe to re-run. search_path pins pg_temp per 094.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.publish_settlement(target_id uuid)
returns text                                          -- the slug
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  existing_slug text;
  new_slug      text;
  state         jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  -- Trust-boundary gate (059): a banned/disabled/soft-deleted account cannot
  -- publish, even with a still-valid JWT.
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Owner check — the row must belong to the calling user.
  select public_slug, campaign_state into existing_slug, state
    from public.settlements
    where id = target_id and user_id = auth.uid();
  if not found then
    raise exception 'Not found or not owned by caller';
  end if;

  -- Canon gate (018, restored by 105): a settlement with a campaign lifecycle
  -- may only be shared once canonized. Mirrors the client's isCampaignCanonized:
  -- NULL campaign_state = no lifecycle = publishable.
  if state is not null
     and coalesce(state->>'phase', '') <> 'canon'
     and coalesce(state->>'canonizedAt', '') = ''
     and coalesce(state->'worldState'->>'canonizedAt', '') = ''
  then
    raise exception 'Only canonized settlements can be shared publicly';
  end if;

  if existing_slug is null then
    -- Mint a fresh slug; retry on the (vanishingly rare) collision.
    loop
      new_slug := public._make_public_slug();
      begin
        update public.settlements
          set is_public = true,
              public_slug = new_slug,
              published_at = now()
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then
        -- spin until we get one
      end;
    end loop;
  else
    -- Re-publish (was unshared, now sharing again): keep the existing
    -- slug so old links continue to resolve.
    update public.settlements
      set is_public = true,
          published_at = now()
      where id = target_id;
  end if;

  return existing_slug;
end;
$$;

grant execute on function public.publish_settlement(uuid) to authenticated;

comment on function public.publish_settlement(uuid) is
  'Set is_public=true and mint a slug if one does not yet exist. Returns the slug. Owner-only. 059: also rejects a banned/disabled/soft-deleted account. 105: restores the 018 canon-only gate (client-parity: NULL campaign_state publishes; otherwise phase=canon or a canonizedAt is required).';
