-- ────────────────────────────────────────────────────────────────────────────
-- 173_gallery_map_reports_and_queue.sql — reporting for shared maps + campaigns,
-- and a UNIFIED moderation queue across all four public target kinds (owner-
-- ordered 2026-07-21).
--
-- STATE OF PLAY (verified): gallery reporting already exists for settlements
-- (021 gallery_reports + report_gallery_dossier, 022 list/resolve) and for
-- comments (169 gallery_comment_reports + report_gallery_comment). The gap was
-- SHARED MAPS + CAMPAIGNS (saved_maps rows) — no report path at all.
--
-- SCHEMA JUDGMENT (vetoable, recorded): maps/campaigns get their OWN report table
-- gallery_map_reports, mirroring 169's gallery_comment_reports, rather than adding
-- target_kind + nullable FK columns to the live gallery_reports table. Reason: a
-- nullable-column restructure of gallery_reports would touch its RLS, its
-- report_gallery_dossier writer, 022's list/resolve, and the live settlement
-- report client + tests (regression surface); a sibling per-kind table is exactly
-- how comments were already done (169) and adds ZERO risk to the settlement path.
-- A shared campaign IS a saved_maps row (share_kind='map_with_campaign'), so ONE
-- table + writer covers both maps and campaigns; the kind is derived from
-- share_kind at read time.
--
-- The unified queue (list_open_report_targets) and group-resolve
-- (resolve_report_target) span all three report tables so the moderation console
-- sees one list across settlement / map / campaign / comment, and resolving a
-- target clears ALL its open reports together.
--
-- WRITTEN-NOT-DEPLOYED (standing law): applied-head.json stays behind this file.
--
-- @rollback: forward-fix only. To reverse: drop functions resolve_report_target,
--   list_open_report_targets, report_gallery_map; drop table gallery_map_reports.
--   Purely additive; no data migration. Reads profiles only via
--   current_user_is_privileged / account_is_active (no profiles write) — note per
--   the money/PII discipline.
-- ────────────────────────────────────────────────────────────────────────────

-- 1. Per-map/campaign abuse reports (mirror 169's gallery_comment_reports).
create table if not exists public.gallery_map_reports (
  id uuid primary key default gen_random_uuid(),
  map_id uuid not null references public.saved_maps(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'other',
  body text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (map_id, user_id),
  constraint gallery_map_reports_status_check check (status in ('open', 'resolved', 'dismissed'))
);

alter table public.gallery_map_reports enable row level security;

drop policy if exists "Users can read their own gallery map reports" on public.gallery_map_reports;
create policy "Users can read their own gallery map reports"
  on public.gallery_map_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can report public maps" on public.gallery_map_reports;
create policy "Users can report public maps"
  on public.gallery_map_reports
  for insert
  with check (
    auth.uid() = user_id
    and status = 'open'
    and char_length(trim(reason)) between 1 and 80
    and char_length(body) <= 2000
    and exists (
      select 1 from public.saved_maps m
      where m.id = map_id and m.is_public = true
    )
  );

create index if not exists idx_gallery_map_reports_status_created
  on public.gallery_map_reports(status, created_at desc);
create index if not exists idx_gallery_map_reports_map_status
  on public.gallery_map_reports(map_id, status, created_at desc);

-- 2. report_gallery_map — authenticated per-map/campaign report (mirror
--    report_gallery_comment 169): active-account + velocity guard on its OWN
--    action key, one open report per (map, user), public-only.
create or replace function public.report_gallery_map(
  target_map_id uuid,
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
    raise exception 'Sign in to report a map';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 30 map reports/hour/user, own action key.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_map_report', 3600) > 30 then
    raise exception 'You are reporting too quickly — please slow down and try again shortly.';
  end if;

  if clean_reason = '' then
    clean_reason := 'other';
  end if;

  perform 1 from public.saved_maps where id = target_map_id and is_public = true;
  if not found then
    raise exception 'Map is not available';
  end if;

  insert into public.gallery_map_reports(map_id, user_id, reason, body, status)
    values (target_map_id, auth.uid(), clean_reason, clean_body, 'open')
    on conflict (map_id, user_id)
    do update set
      reason = excluded.reason,
      body = excluded.body,
      status = 'open',
      updated_at = now()
    returning id into report_id;

  return report_id;
end;
$$;

revoke execute on function public.report_gallery_map(uuid, text, text) from public;
grant execute on function public.report_gallery_map(uuid, text, text) to authenticated;

-- 3. list_open_report_targets — the UNIFIED moderation queue. Staff-only
--    (current_user_is_privileged). One row per REPORTED TARGET (not per report),
--    aggregating the reporter count + distinct reasons + latest report time across
--    settlements, maps/campaigns, and comments. The comment label is a body
--    excerpt (the moderator must judge the content); no reporter identity leaks.
create or replace function public.list_open_report_targets()
returns table (
  kind text,
  target_id uuid,
  label text,
  is_public boolean,
  report_count integer,
  reasons text[],
  latest_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select 'settlement' as kind, r.settlement_id as target_id, s.name as label,
         s.is_public,
         count(*)::integer as report_count,
         array_agg(distinct r.reason) as reasons,
         max(r.created_at) as latest_at
    from public.gallery_reports r
    join public.settlements s on s.id = r.settlement_id
    where public.current_user_is_privileged() and r.status = 'open'
    group by r.settlement_id, s.name, s.is_public
  union all
  select case when m.share_kind = 'map_with_campaign' then 'campaign' else 'map' end as kind,
         mr.map_id, m.name, m.is_public,
         count(*)::integer, array_agg(distinct mr.reason), max(mr.created_at)
    from public.gallery_map_reports mr
    join public.saved_maps m on m.id = mr.map_id
    where public.current_user_is_privileged() and mr.status = 'open'
    group by mr.map_id, m.share_kind, m.name, m.is_public
  union all
  select 'comment', cr.comment_id, left(c.body, 140),
         (s.is_public and c.hidden_at is null),
         count(*)::integer, array_agg(distinct cr.reason), max(cr.created_at)
    from public.gallery_comment_reports cr
    join public.gallery_comments c on c.id = cr.comment_id
    join public.settlements s on s.id = c.settlement_id
    where public.current_user_is_privileged() and cr.status = 'open'
    group by cr.comment_id, c.body, s.is_public, c.hidden_at
  order by latest_at desc;
$$;

revoke execute on function public.list_open_report_targets() from public;
grant execute on function public.list_open_report_targets() to authenticated;

-- 4. resolve_report_target — transition ALL open reports for one target together
--    (a target is judged once, not per report). status: resolved | dismissed |
--    open (reopen). Staff-only + audited. Returns how many reports it moved.
create or replace function public.resolve_report_target(
  p_kind      text,
  p_target_id uuid,
  p_status    text default 'resolved',
  p_note      text default ''
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  clean_status text := lower(trim(coalesce(p_status, 'resolved')));
  clean_note text := left(trim(coalesce(p_note, '')), 2000);
  moved integer := 0;
begin
  if not public.current_user_is_privileged() then
    raise exception 'Only admins can resolve reports';
  end if;
  if clean_status not in ('open', 'resolved', 'dismissed') then
    raise exception 'Invalid report status: %', clean_status;
  end if;

  if p_kind = 'settlement' then
    update public.gallery_reports
      set status = clean_status,
          resolved_at = case when clean_status = 'open' then null else now() end,
          resolved_by = case when clean_status = 'open' then null else auth.uid() end,
          resolution_note = case when clean_status = 'open' then '' else clean_note end,
          updated_at = now()
      where settlement_id = p_target_id and status = 'open';
    get diagnostics moved = row_count;
  elsif p_kind in ('map', 'campaign') then
    update public.gallery_map_reports
      set status = clean_status, updated_at = now()
      where map_id = p_target_id and status = 'open';
    get diagnostics moved = row_count;
  elsif p_kind = 'comment' then
    update public.gallery_comment_reports
      set status = clean_status, updated_at = now()
      where comment_id = p_target_id and status = 'open';
    get diagnostics moved = row_count;
  else
    raise exception 'Invalid report kind: %', p_kind;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    'report_group_' || clean_status,
    jsonb_build_object('kind', p_kind, 'target_id', p_target_id),
    jsonb_build_object('resolved', moved, 'status', clean_status),
    clean_note
  );

  return moved;
end;
$$;

revoke execute on function public.resolve_report_target(text, uuid, text, text) from public;
grant execute on function public.resolve_report_target(text, uuid, text, text) to authenticated;

comment on table public.gallery_map_reports is
  'Authenticated per-map/campaign abuse reports (mirror of gallery_comment_reports). One open report per user per map. INERT until the report client is enabled.';
comment on function public.list_open_report_targets() is
  'Staff-only unified moderation queue: one row per reported target (settlement/map/campaign/comment) with reporter count + distinct reasons. No reporter identity.';
comment on function public.resolve_report_target(text, uuid, text, text) is
  'Staff-only: resolve/dismiss/reopen ALL open reports for one target together; audited. Returns the number of reports moved.';
