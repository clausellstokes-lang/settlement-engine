-- ────────────────────────────────────────────────────────────────────────────
-- 052_deletion_requests.sql — Phase A3 (3/3): the server side A2 left stubbed.
--
-- WHY THIS EXISTS
--   src/lib/accountData.js requestAccountDeletion() files a SOFT-DELETE request:
--   it prefers an `account-actions` edge function, else inserts a row into
--   `deletion_requests`. The table didn't exist. This is that table + its RLS:
--   a user files/reads their OWN request; elevated roles read all + advance the
--   status. Hard deletion (the actual erasure job) is OUT OF SCOPE here — see the
--   follow-up note at the bottom.
--
-- SOFT-DELETE-FIRST
--   A request is a flag, never an erasure. Status moves
--   requested -> processing -> done (or -> cancelled). The processor is a
--   service-role job (documented follow-up), not this migration.
--
-- Re-runnable: create-if-not-exists + DROP POLICY IF EXISTS.
-- Depends on: 050 (current_user_is_privileged widened) for the elevated-read.
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.deletion_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  email         text,                                  -- snapshot at request time (the client passes it)
  requested_at  timestamptz not null default now(),
  status        text not null default 'requested'
                  check (status in ('requested', 'processing', 'done', 'cancelled')),
  processed_by  uuid references auth.users(id) on delete set null,
  processed_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_deletion_requests_user   on public.deletion_requests(user_id);
create index if not exists idx_deletion_requests_status on public.deletion_requests(status);

alter table public.deletion_requests enable row level security;

comment on table public.deletion_requests is
  'Soft-delete account-deletion requests. A user files/reads their own; elevated roles read all + advance status. Erasure is a separate service-role job (follow-up).';

-- ── RLS ────────────────────────────────────────────────────────────────────
-- A user inserts ONLY their own request (user_id must be their own uid).
drop policy if exists "Users file own deletion request" on public.deletion_requests;
create policy "Users file own deletion request" on public.deletion_requests
  for insert
  with check (auth.uid() = user_id);

-- A user reads their own request; support+admin+developer read all (visibility
-- for triage — the request carries no payment PII, only the user's own email).
drop policy if exists "Users read own deletion request" on public.deletion_requests;
create policy "Users read own deletion request" on public.deletion_requests
  for select
  using (auth.uid() = user_id or public.current_user_is_support_or_higher());

-- Advancing the status (claim / process toward erasure) is a HIGH-privilege,
-- destructive-adjacent action — restricted to admin|developer (NOT support, and
-- NOT the requesting user, who has no UPDATE policy at all). A request is a
-- one-way flag for the user; only the highest roles can move it.
drop policy if exists "Elevated update deletion request" on public.deletion_requests;
create policy "Elevated update deletion request" on public.deletion_requests
  for update
  using (public.current_user_is_highest())
  with check (public.current_user_is_highest());

-- ── FOLLOW-UP (out of scope here, documented) ──────────────────────────────
-- The actual soft-delete PROCESSING is a service-role job: read 'requested'
-- rows past the grace window, anonymise/lock the profile, mark 'processing'
-- then 'done', and write an audit_log row (action='process_deletion',
-- was_destructive=true, was_reversible=false, user_notified=true). That job is
-- intentionally NOT in this migration — the table + the request path are the
-- A3 deliverable; the processor is a separate, scheduled follow-up.
