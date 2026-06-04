-- ────────────────────────────────────────────────────────────────────────────
-- 021_gallery_reports.sql - Abuse/moderation reporting for gallery dossiers.
--
-- Votes and comments make the gallery interactive; reports give readers a
-- controlled way to flag public dossiers for review without exposing author
-- identity or allowing anonymous spam.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.gallery_reports (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'other',
  body text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (settlement_id, user_id)
);

alter table public.gallery_reports enable row level security;

drop policy if exists "Users can read their own gallery reports" on public.gallery_reports;
create policy "Users can read their own gallery reports"
  on public.gallery_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can report public gallery dossiers" on public.gallery_reports;
create policy "Users can report public gallery dossiers"
  on public.gallery_reports
  for insert
  with check (
    auth.uid() = user_id
    and status = 'open'
    and char_length(trim(reason)) between 1 and 80
    and char_length(body) <= 2000
    and exists (
      select 1 from public.settlements s
      where s.id = settlement_id and s.is_public = true
    )
  );

create index if not exists idx_gallery_reports_status_created
  on public.gallery_reports(status, created_at desc);

create or replace function public.report_gallery_dossier(
  target_settlement_id uuid,
  report_reason text default 'other',
  report_body text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  report_id uuid;
  clean_reason text := left(trim(coalesce(report_reason, 'other')), 80);
  clean_body text := left(trim(coalesce(report_body, '')), 2000);
begin
  if auth.uid() is null then
    raise exception 'Sign in to report a dossier';
  end if;
  if clean_reason = '' then
    clean_reason := 'other';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_reports(settlement_id, user_id, reason, body, status)
    values (target_settlement_id, auth.uid(), clean_reason, clean_body, 'open')
    on conflict (settlement_id, user_id)
    do update set
      reason = excluded.reason,
      body = excluded.body,
      status = 'open',
      updated_at = now()
    returning id into report_id;

  return report_id;
end;
$$;

revoke execute on function public.report_gallery_dossier(uuid, text, text) from public;
grant execute on function public.report_gallery_dossier(uuid, text, text) to authenticated;

comment on table public.gallery_reports is
  'Authenticated abuse/moderation reports for public gallery dossiers. One open report per user per settlement.';
comment on function public.report_gallery_dossier(uuid, text, text) is
  'Authenticated helper for reporting a public gallery dossier. Upserts the caller report and keeps author identity private.';
