-- ────────────────────────────────────────────────────────────────────────────
-- 168_gallery_comment_moderation.sql — the PERIMETER / MODERATION layer for
-- gallery comments (V-27f). WRITTEN, NOT DEPLOYED: rides the owner's next deploy
-- batch; supabase/applied-head.json stays behind it (the normal commit→deploy
-- window). Gallery comments already ship (019 table + add_gallery_comment /
-- list_gallery_comments RPCs); this is what makes them SAFE to enable post-launch
-- without a human moderator standing by from minute one:
--   • a per-comment abuse report path (mirror 021 gallery_reports, comment-level),
--   • a moderator HIDE that actually hides the comment from readers,
--   • all INERT until the owner lights the comment surface. No default-on surface.
-- Community needs humans; the SURFACE does not — this is the surface, posture-ready.
--
-- @rollback: forward-fix only. To retract: drop functions report_gallery_comment
--   and set_gallery_comment_hidden; restore list_gallery_comments to its 076 body
--   (remove the `c.hidden_at is null` gate); drop table gallery_comment_reports;
--   and drop the hidden_at / hidden_by / hidden_reason columns from
--   gallery_comments. All additions are additive + default-empty, so no data
--   migration is needed. (This migration references public.profiles only via the
--   unchanged author join reproduced from list_gallery_comments 076 — hence this
--   explicit rollback note per the money/PII discipline.)
-- ────────────────────────────────────────────────────────────────────────────

-- 1. MODERATOR-HIDE columns on the existing comments table — distinct from the
--    author's own deleted_at soft-delete. Written ONLY by the service-role RPC in
--    §4; no user UPDATE policy grants them and the 019 soft-delete policy is left
--    unchanged, so a user can never stamp their own (or anyone's) moderation state.
alter table public.gallery_comments
  add column if not exists hidden_at timestamptz,
  add column if not exists hidden_by uuid,
  add column if not exists hidden_reason text;

-- 2. Per-comment abuse reports (mirror 021 gallery_reports, one level down).
create table if not exists public.gallery_comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.gallery_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'other',
  body text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

alter table public.gallery_comment_reports enable row level security;

drop policy if exists "Users can read their own gallery comment reports" on public.gallery_comment_reports;
create policy "Users can read their own gallery comment reports"
  on public.gallery_comment_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can report gallery comments" on public.gallery_comment_reports;
create policy "Users can report gallery comments"
  on public.gallery_comment_reports
  for insert
  with check (
    auth.uid() = user_id
    and status = 'open'
    and char_length(trim(reason)) between 1 and 80
    and char_length(body) <= 2000
    and exists (
      select 1
      from public.gallery_comments c
      join public.settlements s on s.id = c.settlement_id
      where c.id = comment_id and c.deleted_at is null and s.is_public = true
    )
  );

create index if not exists idx_gallery_comment_reports_status_created
  on public.gallery_comment_reports(status, created_at desc);

-- 3. report_gallery_comment — authenticated per-comment report (mirror
--    report_gallery_dossier) with the 125 velocity guard on its OWN action key,
--    so it never burns the comment / vote / reaction budgets. One open report per
--    (comment, user); author identity of the comment stays private.
create or replace function public.report_gallery_comment(
  target_comment_id uuid,
  report_reason text default 'other',
  report_body text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  report_id uuid;
  clean_reason text := left(trim(coalesce(report_reason, 'other')), 80);
  clean_body text := left(trim(coalesce(report_body, '')), 2000);
begin
  if auth.uid() is null then
    raise exception 'Sign in to report a comment';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 30 comment reports/hour/user, own action key.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_comment_report', 3600) > 30 then
    raise exception 'You are reporting too quickly — please slow down and try again shortly.';
  end if;

  if clean_reason = '' then
    clean_reason := 'other';
  end if;

  perform 1
    from public.gallery_comments c
    join public.settlements s on s.id = c.settlement_id
    where c.id = target_comment_id and c.deleted_at is null and s.is_public = true;
  if not found then
    raise exception 'Comment is not available';
  end if;

  insert into public.gallery_comment_reports(comment_id, user_id, reason, body, status)
    values (target_comment_id, auth.uid(), clean_reason, clean_body, 'open')
    on conflict (comment_id, user_id)
    do update set
      reason = excluded.reason,
      body = excluded.body,
      status = 'open',
      updated_at = now()
    returning id into report_id;

  return report_id;
end;
$$;

revoke execute on function public.report_gallery_comment(uuid, text, text) from public;
grant execute on function public.report_gallery_comment(uuid, text, text) to authenticated;

-- 4. set_gallery_comment_hidden — the MODERATOR write. service_role ONLY: the
--    admin-actions edge function dispatches it AFTER its JWT role gate (developer/
--    admin/support). It is the sole writer of the hidden_* columns. `hide` toggles;
--    unhide clears the whole moderation triple.
create or replace function public.set_gallery_comment_hidden(
  target_comment_id uuid,
  hide boolean,
  hidden_reason_text text default null,
  moderator_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if hide then
    update public.gallery_comments
      set hidden_at = now(),
          hidden_by = moderator_id,
          hidden_reason = left(trim(coalesce(hidden_reason_text, '')), 200),
          updated_at = now()
      where id = target_comment_id;
  else
    update public.gallery_comments
      set hidden_at = null,
          hidden_by = null,
          hidden_reason = null,
          updated_at = now()
      where id = target_comment_id;
  end if;
end;
$$;

revoke execute on function public.set_gallery_comment_hidden(uuid, boolean, text, uuid) from public;
grant execute on function public.set_gallery_comment_hidden(uuid, boolean, text, uuid) to service_role;

-- 5. list_gallery_comments — the 076 body VERBATIM plus ONE added gate:
--    moderator-hidden comments drop out of the reader list (so §4's hide actually
--    hides). Behavior-neutral until a moderator hides (hidden_at defaults null).
--    Reproduced whole so the net-current definition stays in one place; its 076
--    `search_path = public` posture and author-label join are unchanged.
drop function if exists public.list_gallery_comments(uuid);
create or replace function public.list_gallery_comments(target_settlement_id uuid)
returns table (
  id uuid,
  body text,
  created_at timestamptz,
  updated_at timestamptz,
  can_delete boolean,
  author_label text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.body,
    c.created_at,
    c.updated_at,
    auth.uid() = c.user_id as can_delete,
    coalesce(
      ap.external_name,
      case when c.user_id = s.user_id then 'Creator' else 'A DM' end
    ) as author_label
  from public.gallery_comments c
  join public.settlements s on s.id = c.settlement_id
  left join public.profiles ap on ap.id = c.user_id
  where c.settlement_id = target_settlement_id
    and c.deleted_at is null
    and c.hidden_at is null
    and s.is_public = true
  order by c.created_at desc
  limit 100;
$$;
revoke execute on function public.list_gallery_comments(uuid) from public;
grant execute on function public.list_gallery_comments(uuid) to authenticated, anon;

comment on table public.gallery_comment_reports is
  'Authenticated per-comment abuse reports for gallery comments. One open report per user per comment. INERT until the comment surface is enabled post-launch.';
comment on function public.report_gallery_comment(uuid, text, text) is
  'Authenticated helper for reporting a gallery comment. Upserts one open report per user; own 125 velocity budget (gallery_comment_report).';
comment on function public.set_gallery_comment_hidden(uuid, boolean, text, uuid) is
  'Moderator hide/unhide for a gallery comment (service_role only; dispatched by admin-actions after its JWT role gate). The ONLY writer of the hidden_* columns.';
