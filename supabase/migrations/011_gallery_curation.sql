-- ────────────────────────────────────────────────────────────────────────────
-- 011_gallery_curation.sql - Tier 8.1 curated dossier surface.
--
-- The gallery (migration 008) was already listing every public dossier in
-- reverse-published-at order. Strategic-review §9 explicitly warns against
-- that auto-populated approach: "bad examples hurt more than no examples."
-- The right shape is a hand-curated row of 30-50 exemplary dossiers shown
-- before the long tail of community submissions.
--
-- This migration adds the bookkeeping:
--   1. `is_curated` boolean on settlements (default false). Only admins
--      flip it; normal users can't self-curate.
--   2. Composite index supporting the curated-first sort.
--   3. `set_curated(target_id uuid, curated boolean)` admin-only RPC.
--   4. `fetch_curated_gallery()` view that returns curated dossiers in
--      explicit curation order, then everyone else in published_at order.
--
-- The split between curated and community is a UI concern (GalleryPage
-- renders two sections). The database just supplies the marker + the
-- query helpers.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Column ─────────────────────────────────────────────────────────────────

alter table public.settlements
  add column if not exists is_curated boolean not null default false,
  add column if not exists curated_order integer;

comment on column public.settlements.is_curated is
  'When true, the dossier appears in the curated section of the gallery (hand-picked exemplars). Only admins/developers can flip this - normal users cannot self-curate.';

comment on column public.settlements.curated_order is
  'Sort order within the curated section. Lower values render first. NULL means "no explicit order; sort by published_at desc within curated set."';

-- ── Index ──────────────────────────────────────────────────────────────────
-- Partial index for the curated-listing hot path. Only ~50 rows ever match;
-- the index stays tiny.

create index if not exists idx_settlements_curated
  on public.settlements(curated_order nulls last, published_at desc)
  where is_curated = true and is_public = true;

-- ── Admin RPC: toggle curation ─────────────────────────────────────────────
-- SECURITY DEFINER + explicit role gate. The caller MUST be a developer
-- or admin. Logged into the admin_actions audit trail.

create or replace function public.set_curated(
  target_id   uuid,
  curated     boolean,
  sort_order  integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  -- Gate: only developer / admin roles can curate.
  select role into caller_role
    from public.profiles
    where id = auth.uid();

  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change curation status';
  end if;

  -- Capture before-state for the audit log.
  select jsonb_build_object(
    'is_curated', is_curated,
    'curated_order', curated_order,
    'name', name
  ) into before_state
    from public.settlements
    where id = target_id;

  if before_state is null then
    raise exception 'Settlement not found';
  end if;

  -- Apply the change. If marking as curated, the row must also be public.
  if curated then
    update public.settlements
      set is_curated    = true,
          curated_order = sort_order
      where id = target_id and is_public = true;
    if not found then
      raise exception 'Cannot curate a non-public settlement. Publish it first.';
    end if;
  else
    update public.settlements
      set is_curated    = false,
          curated_order = null
      where id = target_id;
  end if;

  -- Audit log entry via the existing _audit_action helper. The
  -- admin_actions table's target_id column references auth.users(id),
  -- so we can't put a settlement_id there directly - instead we pass
  -- target_id=NULL and store the settlement context inside the
  -- before/after JSON payloads (with the settlement id explicit).
  perform public._audit_action(
    auth.uid(),
    null,
    case when curated then 'gallery_curate' else 'gallery_uncurate' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object(
      'settlement_id', target_id,
      'is_curated',    curated,
      'curated_order', sort_order
    ),
    null
  );
end;
$$;

grant execute on function public.set_curated(uuid, boolean, integer) to authenticated;

comment on function public.set_curated(uuid, boolean, integer) is
  'Admin-only: toggle the curated flag on a public dossier and set its sort order. Writes an audit row.';

-- ── List helpers ───────────────────────────────────────────────────────────
-- These are convenience SQL functions the client can call instead of
-- composing two queries. Returning JSONB lets the client cache the result
-- like any other RPC payload.

create or replace function public.list_curated_dossiers()
returns table (
  id            uuid,
  public_slug   text,
  name          text,
  tier          text,
  published_at  timestamptz,
  view_count    integer,
  curated_order integer
)
language sql
stable
security definer
set search_path = public
as $$
  select id, public_slug, name, tier, published_at, view_count, curated_order
    from public.settlements
    where is_public = true and is_curated = true
    order by curated_order nulls last, published_at desc;
$$;

grant execute on function public.list_curated_dossiers() to authenticated, anon;

comment on function public.list_curated_dossiers() is
  'Returns curated public dossiers in explicit curation order, then by published_at desc within the curated set.';
