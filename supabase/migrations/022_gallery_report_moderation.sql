-- ────────────────────────────────────────────────────────────────────────────
-- 022_gallery_report_moderation.sql - Admin review queue for gallery reports.
--
-- Migration 021 lets authenticated readers submit reports. This migration
-- gives developer/admin accounts a narrow RPC surface to review and resolve
-- them without granting broad table access to normal users.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.gallery_reports
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users(id) on delete set null,
  add column if not exists resolution_note text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gallery_reports_status_check'
      and conrelid = 'public.gallery_reports'::regclass
  ) then
    alter table public.gallery_reports
      add constraint gallery_reports_status_check
      check (status in ('open', 'resolved', 'dismissed'));
  end if;
end $$;

create index if not exists idx_gallery_reports_settlement_status
  on public.gallery_reports(settlement_id, status, created_at desc);

create or replace function public.list_gallery_reports(
  report_status text default 'open',
  limit_count integer default 50
)
returns table (
  report_id uuid,
  settlement_id uuid,
  public_slug text,
  settlement_name text,
  tier text,
  gallery_image_url text,
  is_public boolean,
  report_reason text,
  report_body text,
  status text,
  report_created_at timestamptz,
  report_updated_at timestamptz,
  resolved_at timestamptz,
  resolution_note text,
  reporter_label text,
  report_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id as report_id,
    s.id as settlement_id,
    s.public_slug,
    s.name as settlement_name,
    s.tier,
    s.gallery_image_url,
    s.is_public,
    r.reason as report_reason,
    r.body as report_body,
    r.status,
    r.created_at as report_created_at,
    r.updated_at as report_updated_at,
    r.resolved_at,
    r.resolution_note,
    case
      when r.user_id = s.user_id then 'Creator'
      else 'Gallery reader'
    end as reporter_label,
    count(*) over (partition by r.settlement_id)::integer as report_count
  from public.gallery_reports r
  join public.settlements s on s.id = r.settlement_id
  where public.current_user_is_privileged()
    and (
      coalesce(report_status, 'open') = 'all'
      or r.status = coalesce(report_status, 'open')
    )
  order by
    case when r.status = 'open' then 0 else 1 end,
    r.updated_at desc,
    r.created_at desc
  limit greatest(1, least(limit_count, 100));
$$;

revoke execute on function public.list_gallery_reports(text, integer) from public;
grant execute on function public.list_gallery_reports(text, integer) to authenticated;

create or replace function public.resolve_gallery_report(
  target_report_id uuid,
  next_status text default 'resolved',
  resolution_note text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  before_state jsonb;
  clean_status text := lower(trim(coalesce(next_status, 'resolved')));
  clean_note text := left(trim(coalesce(resolution_note, '')), 2000);
begin
  if not public.current_user_is_privileged() then
    raise exception 'Only admins can resolve gallery reports';
  end if;

  if clean_status not in ('open', 'resolved', 'dismissed') then
    raise exception 'Invalid report status: %', clean_status;
  end if;

  select to_jsonb(r) into before_state
    from public.gallery_reports r
    where r.id = target_report_id;

  if before_state is null then
    raise exception 'Report not found';
  end if;

  update public.gallery_reports
    set status = clean_status,
        resolved_at = case when clean_status = 'open' then null else now() end,
        resolved_by = case when clean_status = 'open' then null else auth.uid() end,
        resolution_note = case when clean_status = 'open' then '' else clean_note end,
        updated_at = now()
    where id = target_report_id;

  perform public._audit_action(
    auth.uid(),
    null,
    'gallery_report_' || clean_status,
    before_state,
    jsonb_build_object(
      'report_id', target_report_id,
      'status', clean_status,
      'resolution_note', clean_note
    ),
    clean_note
  );
end;
$$;

revoke execute on function public.resolve_gallery_report(uuid, text, text) from public;
grant execute on function public.resolve_gallery_report(uuid, text, text) to authenticated;

comment on function public.list_gallery_reports(text, integer) is
  'Developer/admin-only RPC: list gallery reports for moderation review.';
comment on function public.resolve_gallery_report(uuid, text, text) is
  'Developer/admin-only RPC: resolve, dismiss, or reopen a gallery report and audit the action.';
