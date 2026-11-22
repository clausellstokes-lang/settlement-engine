-- ────────────────────────────────────────────────────────────────────────────
-- 172_gallery_comment_tombstone.sql — moderation-removed comments render as an
-- in-place TOMBSTONE, not a silent disappearance (owner-ordered 2026-07-21).
--
-- 169 shipped the moderator-hide state (gallery_comments.hidden_at / hidden_by /
-- hidden_reason + the service-role set_gallery_comment_hidden writer) and made
-- list_gallery_comments DROP hidden comments entirely. The owner wants the
-- distinction to SURVIVE to the reader: an AUTHOR delete (deleted_at) stays hidden
-- as today, but a MODERATION removal (hidden_at) stays IN PLACE as a tombstone so
-- the thread reads honestly. The tombstone carries only id / timestamps / a
-- `moderated` flag — NEVER the original body (kept server-side for audit, never
-- sent to the client) and never the author label.
--
-- This is the 169 list_gallery_comments body with ONE change: instead of the
-- `c.hidden_at is null` filter, hidden rows are PROJECTED as tombstones (body +
-- author_label nulled, can_delete forced false, moderated=true). Author-deleted
-- rows (deleted_at) remain filtered out. The return type gains a `moderated`
-- column, so the function is dropped + recreated (a return-type change).
--
-- WRITTEN-NOT-DEPLOYED (standing law): applies with 169 on the owner's next push;
-- applied-head.json stays behind both.
--
-- @rollback: forward-fix only. To reverse: restore list_gallery_comments to its
--   169 body (re-add the `c.hidden_at is null` filter and drop the `moderated`
--   return column). No schema/data change — this migration only redefines one
--   read function. (References public.profiles only via the unchanged author join
--   reproduced from 169 — note included per the money/PII discipline.)
-- ────────────────────────────────────────────────────────────────────────────

drop function if exists public.list_gallery_comments(uuid);
create or replace function public.list_gallery_comments(target_settlement_id uuid)
returns table (
  id uuid,
  body text,
  created_at timestamptz,
  updated_at timestamptz,
  can_delete boolean,
  author_label text,
  moderated boolean
)
language sql
stable
security definer
-- pg_temp LAST (094/111/131 convention) — this recreate also closes the bare
-- public-only search_path the 076/169 definition carried, so it drops out of the
-- search-path baseline (shrink-only ratchet).
set search_path = public, pg_temp
as $$
  select
    c.id,
    -- A moderation-removed comment NEVER sends its body to the client.
    case when c.hidden_at is not null then null else c.body end as body,
    c.created_at,
    c.updated_at,
    -- A tombstone is nobody's to delete; a live comment stays owner-deletable.
    case when c.hidden_at is not null then false else (auth.uid() = c.user_id) end as can_delete,
    -- No author identity leaks from a tombstone.
    case
      when c.hidden_at is not null then null
      else coalesce(ap.external_name, case when c.user_id = s.user_id then 'Creator' else 'A DM' end)
    end as author_label,
    (c.hidden_at is not null) as moderated
  from public.gallery_comments c
  join public.settlements s on s.id = c.settlement_id
  left join public.profiles ap on ap.id = c.user_id
  where c.settlement_id = target_settlement_id
    and c.deleted_at is null          -- author-deleted stays hidden (no tombstone)
    and s.is_public = true
  order by c.created_at desc
  limit 100;
$$;
revoke execute on function public.list_gallery_comments(uuid) from public;
grant execute on function public.list_gallery_comments(uuid) to authenticated, anon;

comment on function public.list_gallery_comments(uuid) is
  'Reader list for gallery comments. Author-deleted (deleted_at) rows are omitted; moderation-removed (hidden_at) rows are returned as TOMBSTONES (moderated=true, body/author nulled) so the removal is visible in place. The hidden body never reaches the client.';
