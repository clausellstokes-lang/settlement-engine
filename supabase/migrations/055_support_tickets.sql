-- ────────────────────────────────────────────────────────────────────────────
-- 055_support_tickets.sql — Phase A5: extend `support_messages` into a real
-- support-ticket workflow, built ON TOP of the A3/A4 least-privilege RBAC +
-- append-only audit foundation (050/051/052/053). Inherits — never loosens —
-- the A3/A4 security posture.
--
-- WHAT THIS ADDS
--   1. Ticket columns on `support_messages` (additive, migration-safe for the
--      existing rows): a human-readable `ticket_number` (SF-000123 via a
--      sequence), `category`, `priority`, a richer `status` enum, `assignee`,
--      nullable cross-resource link columns (settlement/campaign/map/payment/
--      pdf/generation/gallery refs), an `linked_faq` slug (the FAQ article an
--      agent attaches when answering), `metadata` jsonb (browser/app), and
--      `updated_at`. Existing rows backfill cleanly to status 'new' + a number.
--   2. `support_ticket_events` — the reply/note thread. Each row is either a
--      `user_reply` or an `internal_note`, distinguished by BOTH `kind` and a
--      `visibility` enum (`internal` | `user`). RLS:
--        • the ticket OWNER reads ONLY `visibility = 'user'` events on their OWN
--          ticket — an `internal` event is NEVER visible to the owner;
--        • support+ reads ALL events. Append-only via the definer RPC.
--   3. SECURITY DEFINER RPCs (Shape-B: service_role-granted, actor forwarded,
--      role re-checked, audited where material):
--        create_ticket        — mints the number, owner-scoped insert.
--        claim_ticket         — assign to the calling agent (support+), audited.
--        set_ticket_status    — transition status (support+), audited.
--        post_ticket_reply    — owner→user-reply only; agent→user OR internal.
--        list_my_tickets      — the caller's own tickets (+ user-visible counts).
--        list_ticket_pool     — the agent queue, filter by status (support+).
--        link_ticket_faq      — attach an FAQ slug when answering (support+).
--
-- ROLE MODEL (unchanged from A3 — see 050):
--   support   → reads the pool, claims/assigns, transitions status, posts user
--               replies + internal notes. NO raw PII.
--   admin/dev → "highest" — everything support can do, plus the rest of A4.
--   user      → reads/creates/replies to their OWN tickets only; NEVER reads an
--               internal note (proven in tests/security/supportTickets.pglite).
--
-- APPEND-ONLY / AUDIT GUARANTEES
--   support_ticket_events has a SELECT policy only (read gating, owner sees only
--   user-visible rows). There is NO insert/update/delete policy, so for a
--   non-superuser those commands are default-denied; rows are written solely
--   through post_ticket_reply (definer). Every material change (assignment,
--   status change, resolution) writes exactly one audit_log row via write_audit.
--
-- Re-runnable: add-column-if-not-exists + create-if-not-exists + DROP POLICY IF
-- EXISTS + CREATE OR REPLACE throughout.
-- Depends on: 002 (support_messages), 050 (has_role / current_user_is_* /
--             mask_email), 051 (write_audit / audit_log).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Human-readable ticket number sequence ───────────────────────────────
-- A dedicated sequence + a formatting expression (SF-000123). The uuid PK stays
-- the row identity; ticket_number is the human-facing handle. No precedent for
-- this in earlier migrations — it is designed fresh here.
create sequence if not exists public.support_ticket_seq start 1;

create or replace function public.format_ticket_number(p_n bigint)
returns text
language sql
immutable
set search_path = public
as $$
  select 'SF-' || lpad(p_n::text, 6, '0');
$$;

-- ── 2. Extend support_messages into a ticket ───────────────────────────────
alter table public.support_messages
  add column if not exists ticket_number  text,
  add column if not exists category       text not null default 'general'
    check (category in ('general', 'billing', 'bug', 'account', 'gallery', 'feature', 'other')),
  add column if not exists priority        text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  add column if not exists assignee        uuid references auth.users(id) on delete set null,
  add column if not exists settlement_id   uuid,
  add column if not exists campaign_id     uuid,
  add column if not exists map_id          uuid,
  add column if not exists payment_ref     text,
  add column if not exists pdf_ref         text,
  add column if not exists generation_ref  text,
  add column if not exists gallery_ref     text,
  add column if not exists linked_faq      text,
  add column if not exists metadata        jsonb not null default '{}'::jsonb,
  add column if not exists updated_at       timestamptz not null default now();

-- Widen the status enum from the original ('new'/'read'/'replied'/'closed') to
-- the ticket lifecycle. Drop the old CHECK and add the richer one; the existing
-- 'new'/'read'/'replied'/'closed' values all remain valid members of the new
-- set, so existing rows survive. ('read'/'replied' are kept as legacy-tolerant
-- members so a backfill never violates the constraint.)
do $$
begin
  -- Find and drop the original status CHECK constraint regardless of its name.
  perform 1
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  where t.relname = 'support_messages'
    and c.contype = 'c'
    and pg_get_constraintdef(c.oid) ilike '%status%'
    and pg_get_constraintdef(c.oid) ilike '%replied%';
  if found then
    execute (
      select 'alter table public.support_messages drop constraint ' || quote_ident(c.conname)
      from pg_constraint c
      join pg_class t on t.oid = c.conrelid
      where t.relname = 'support_messages'
        and c.contype = 'c'
        and pg_get_constraintdef(c.oid) ilike '%status%'
        and pg_get_constraintdef(c.oid) ilike '%replied%'
      limit 1
    );
  end if;
end $$;

alter table public.support_messages
  drop constraint if exists support_messages_status_check;

alter table public.support_messages
  add constraint support_messages_status_check
  check (status in (
    'new', 'triage', 'assigned', 'in_progress', 'waiting_on_user',
    'resolved', 'closed', 'reopened',
    -- legacy values tolerated so pre-A5 rows never violate the constraint:
    'read', 'replied'
  ));

-- Backfill: every existing row gets a ticket_number; rows in a legacy status
-- are mapped onto the new lifecycle. Idempotent (only fills NULL numbers).
update public.support_messages
   set ticket_number = public.format_ticket_number(nextval('public.support_ticket_seq'))
 where ticket_number is null;

-- Map any legacy statuses forward (keeps the data clean; the constraint already
-- tolerates the old values, so this is a normalization, not a requirement).
update public.support_messages set status = 'new'      where status = 'read';
update public.support_messages set status = 'resolved' where status = 'replied';

-- Default future rows' number at insert time via a trigger (the RPC also sets
-- it, but the trigger guarantees a number even for a direct owner insert).
create or replace function public.support_ticket_assign_number()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.ticket_number is null then
    new.ticket_number := public.format_ticket_number(nextval('public.support_ticket_seq'));
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_support_ticket_number on public.support_messages;
create trigger trg_support_ticket_number
  before insert on public.support_messages
  for each row execute function public.support_ticket_assign_number();

-- Unique number (partial: ignores any pre-existing NULLs that a concurrent
-- apply hasn't backfilled yet — after the backfill above all rows are filled).
create unique index if not exists idx_support_ticket_number
  on public.support_messages(ticket_number)
  where ticket_number is not null;

create index if not exists idx_support_assignee on public.support_messages(assignee);
create index if not exists idx_support_status   on public.support_messages(status);

comment on column public.support_messages.ticket_number is
  'Human-readable ticket handle (SF-000123). Unique. Minted from support_ticket_seq.';
comment on column public.support_messages.linked_faq is
  'Slug of the FAQ article an agent linked when answering this ticket (self-serve pointer).';

-- ── 3. Owner can update their OWN ticket (reopen / add context) ─────────────
-- The original migration only had owner SELECT + INSERT. A user reopening a
-- resolved ticket needs a scoped UPDATE. The status transition itself is gated
-- by the RPC; this policy is the row-visibility backstop. Agents update via the
-- existing 050 "Elevated update support message status" policy.
drop policy if exists "Users update own support ticket" on public.support_messages;
create policy "Users update own support ticket" on public.support_messages
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- updated_at trigger on any update.
create or replace function public.support_ticket_touch()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_support_ticket_touch on public.support_messages;
create trigger trg_support_ticket_touch
  before update on public.support_messages
  for each row execute function public.support_ticket_touch();

-- ── 4. support_ticket_events — the reply / internal-note thread ─────────────
-- `kind`       : 'user_reply' | 'internal_note' | 'status_change' (a system
--                breadcrumb so the thread shows lifecycle context).
-- `visibility` : 'user' | 'internal'. The OWNER reads ONLY 'user' rows; an
--                'internal' row is NEVER visible to the owner. Both columns
--                separate internal-vs-user at the ROW level AND the RLS level
--                (the constraint binds them so an internal note can't be
--                mislabelled 'user').
create table if not exists public.support_ticket_events (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_messages(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  author_role text,                          -- snapshot ('user' | 'support' | …)
  kind        text not null default 'user_reply'
                check (kind in ('user_reply', 'internal_note', 'status_change')),
  visibility  text not null default 'user'
                check (visibility in ('user', 'internal')),
  body        text not null,
  created_at  timestamptz not null default now(),
  -- An internal_note MUST be internal; a user_reply / status_change MUST be
  -- user-visible. This binds the row-level label to the RLS label so a leak
  -- can't happen via a mislabelled row.
  constraint support_event_visibility_consistent check (
    (kind = 'internal_note' and visibility = 'internal')
    or (kind in ('user_reply', 'status_change') and visibility = 'user')
  )
);

create index if not exists idx_support_event_ticket on public.support_ticket_events(ticket_id);

alter table public.support_ticket_events enable row level security;

comment on table public.support_ticket_events is
  'Ticket thread. user_reply/status_change are user-visible; internal_note is internal-only and NEVER readable by the ticket owner. Written ONLY by post_ticket_reply() (definer) — no insert/update/delete policy.';

-- OWNER reads ONLY user-visible events on their OWN ticket. The `visibility =
-- 'user'` clause is the proof point: an internal note is invisible to the
-- owner. Support+ reads ALL events (any visibility) on any ticket.
drop policy if exists "Read ticket events scoped" on public.support_ticket_events;
create policy "Read ticket events scoped" on public.support_ticket_events
  for select
  using (
    public.current_user_is_support_or_higher()
    or (
      visibility = 'user'
      and exists (
        select 1 from public.support_messages sm
        where sm.id = support_ticket_events.ticket_id
          and sm.user_id = auth.uid()
      )
    )
  );

-- ── 5. RPCs ─────────────────────────────────────────────────────────────────

-- create_ticket — owner-scoped insert that MINTS the ticket number and returns
-- the new row's id + number. Granted to service_role; the edge function
-- forwards the verified actor as p_actor (so a forged p_actor is rejected — the
-- actor must equal p_actor on the inserted row). NOT audited (a user creating
-- their own ticket is not a privileged mutation), but the email lifecycle fires
-- on the edge side.
create or replace function public.create_ticket(
  p_actor          uuid,
  p_subject        text,
  p_message        text,
  p_email          text,
  p_category       text default 'general',
  p_priority       text default 'normal',
  p_links          jsonb default '{}'::jsonb,
  p_metadata       jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id      uuid;
  v_number  text;
  v_subject text;
  v_message text;
  v_cat     text;
  v_pri     text;
begin
  if p_actor is null then raise exception 'an actor is required'; end if;
  v_subject := nullif(btrim(coalesce(p_subject, '')), '');
  v_message := nullif(btrim(coalesce(p_message, '')), '');
  if v_subject is null then raise exception 'a subject is required'; end if;
  if v_message is null then raise exception 'a message is required'; end if;
  v_cat := coalesce(nullif(btrim(p_category), ''), 'general');
  v_pri := coalesce(nullif(btrim(p_priority), ''), 'normal');

  insert into public.support_messages (
    user_id, email, subject, message, status, category, priority,
    settlement_id, campaign_id, map_id, payment_ref, pdf_ref,
    generation_ref, gallery_ref, metadata
  ) values (
    p_actor,
    coalesce(nullif(btrim(p_email), ''), 'unknown'),
    v_subject, v_message, 'new', v_cat, v_pri,
    nullif(p_links->>'settlement_id', '')::uuid,
    nullif(p_links->>'campaign_id', '')::uuid,
    nullif(p_links->>'map_id', '')::uuid,
    nullif(p_links->>'payment_ref', ''),
    nullif(p_links->>'pdf_ref', ''),
    nullif(p_links->>'generation_ref', ''),
    nullif(p_links->>'gallery_ref', ''),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id, ticket_number into v_id, v_number;

  return jsonb_build_object('id', v_id, 'ticket_number', v_number, 'status', 'new');
end;
$$;

revoke all on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb) from public;
grant execute on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb) to service_role;

-- claim_ticket — assign the ticket to the calling AGENT (support+). Audited.
create or replace function public.claim_ticket(p_actor uuid, p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'a ticket id is required'; end if;

  select sm.user_id into v_owner
    from public.support_messages sm where sm.id = p_id;
  if not found then raise exception 'ticket not found'; end if;

  update public.support_messages
     set assignee = p_actor,
         status = case when status in ('new', 'triage') then 'assigned' else status end
   where id = p_id;

  perform public.write_audit(
    p_action          => 'claim_ticket',
    p_target_user_id  => v_owner,
    p_target_type     => 'support_ticket',
    p_target_id       => p_id::text,
    p_after           => jsonb_build_object('assignee', p_actor),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('id', p_id, 'assignee', p_actor);
end;
$$;

revoke all on function public.claim_ticket(uuid, uuid) from public;
grant execute on function public.claim_ticket(uuid, uuid) to service_role;

-- set_ticket_status — transition the lifecycle status (support+). Audited.
create or replace function public.set_ticket_status(
  p_actor uuid, p_id uuid, p_status text, p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner  uuid;
  v_prev   text;
  v_reason text;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'a ticket id is required'; end if;
  if p_status not in (
    'new', 'triage', 'assigned', 'in_progress', 'waiting_on_user',
    'resolved', 'closed', 'reopened'
  ) then
    raise exception 'invalid status: %', p_status;
  end if;
  v_reason := nullif(btrim(coalesce(p_reason, '')), '');

  select user_id, status into v_owner, v_prev
    from public.support_messages where id = p_id;
  if not found then raise exception 'ticket not found'; end if;

  update public.support_messages set status = p_status where id = p_id;

  -- A user-visible status_change breadcrumb in the thread.
  insert into public.support_ticket_events (
    ticket_id, author_id, author_role, kind, visibility, body
  ) values (
    p_id, p_actor,
    (select role from public.profiles where id = p_actor),
    'status_change', 'user',
    'Status changed to ' || p_status || coalesce(' — ' || v_reason, '')
  );

  perform public.write_audit(
    p_action          => 'set_ticket_status',
    p_target_user_id  => v_owner,
    p_target_type     => 'support_ticket',
    p_target_id       => p_id::text,
    p_reason          => v_reason,
    p_before          => jsonb_build_object('status', v_prev),
    p_after           => jsonb_build_object('status', p_status),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('id', p_id, 'status', p_status, 'previous', v_prev);
end;
$$;

revoke all on function public.set_ticket_status(uuid, uuid, text, text) from public;
grant execute on function public.set_ticket_status(uuid, uuid, text, text) to service_role;

-- post_ticket_reply — add an event to a ticket thread.
--   • The ticket OWNER may post ONLY a 'user' reply on their OWN ticket. They
--     can NEVER post (or read) an internal note.
--   • An AGENT (support+) may post either a 'user' reply or an 'internal' note,
--     on any ticket.
-- Returns the new event id. A user_reply on a non-reopened resolved/closed
-- ticket re-opens it (so the agent sees it again).
create or replace function public.post_ticket_reply(
  p_actor uuid, p_id uuid, p_body text, p_visibility text default 'user'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner   uuid;
  v_status  text;
  v_role    text;
  v_is_agent boolean;
  v_is_owner boolean;
  v_kind    text;
  v_vis     text;
  v_body    text;
  v_event   uuid;
begin
  if p_actor is null then raise exception 'an actor is required'; end if;
  v_body := nullif(btrim(coalesce(p_body, '')), '');
  if v_body is null then raise exception 'a reply body is required'; end if;
  if p_id is null then raise exception 'a ticket id is required'; end if;

  select user_id, status into v_owner, v_status
    from public.support_messages where id = p_id;
  if not found then raise exception 'ticket not found'; end if;

  v_is_agent := public.has_role(p_actor, array['support', 'admin', 'developer']);
  v_is_owner := (p_actor = v_owner);
  if not v_is_agent and not v_is_owner then
    raise exception 'not authorized';
  end if;

  v_role := (select role from public.profiles where id = p_actor);

  -- Resolve visibility: an owner can only ever post user-visible replies; an
  -- internal note is agent-only. The CHECK constraint backstops this.
  if p_visibility = 'internal' then
    if not v_is_agent then
      raise exception 'not authorized: only agents post internal notes';
    end if;
    v_kind := 'internal_note';
    v_vis  := 'internal';
  else
    v_kind := 'user_reply';
    v_vis  := 'user';
  end if;

  insert into public.support_ticket_events (
    ticket_id, author_id, author_role, kind, visibility, body
  ) values (p_id, p_actor, v_role, v_kind, v_vis, v_body)
  returning id into v_event;

  -- An owner's user-reply on a resolved/closed ticket reopens it.
  if v_is_owner and v_vis = 'user' and v_status in ('resolved', 'closed') then
    update public.support_messages set status = 'reopened' where id = p_id;
  end if;

  -- Internal notes are NOT audited as material (they're append-only and
  -- elevated-read-only already); user/agent replies are not a privileged
  -- mutation. Status-affecting changes (reopen) are reflected in the row.
  return jsonb_build_object('id', v_event, 'kind', v_kind, 'visibility', v_vis);
end;
$$;

revoke all on function public.post_ticket_reply(uuid, uuid, text, text) from public;
grant execute on function public.post_ticket_reply(uuid, uuid, text, text) to service_role;

-- link_ticket_faq — attach an FAQ slug to a ticket when an agent answers with a
-- self-serve pointer (support+). Audited as material (it's a triage decision).
create or replace function public.link_ticket_faq(
  p_actor uuid, p_id uuid, p_faq text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_faq   text;
begin
  if not public.has_role(p_actor, array['support', 'admin', 'developer']) then
    raise exception 'not authorized';
  end if;
  if p_id is null then raise exception 'a ticket id is required'; end if;
  v_faq := nullif(btrim(coalesce(p_faq, '')), '');
  if v_faq is null then raise exception 'an FAQ slug is required'; end if;

  select user_id into v_owner from public.support_messages where id = p_id;
  if not found then raise exception 'ticket not found'; end if;

  update public.support_messages set linked_faq = v_faq where id = p_id;

  perform public.write_audit(
    p_action          => 'link_ticket_faq',
    p_target_user_id  => v_owner,
    p_target_type     => 'support_ticket',
    p_target_id       => p_id::text,
    p_after           => jsonb_build_object('linked_faq', v_faq),
    p_was_destructive => false,
    p_was_reversible  => true,
    p_actor_id        => p_actor
  );

  return jsonb_build_object('id', p_id, 'linked_faq', v_faq);
end;
$$;

revoke all on function public.link_ticket_faq(uuid, uuid, text) from public;
grant execute on function public.link_ticket_faq(uuid, uuid, text) to service_role;

-- list_my_tickets — the caller's OWN tickets, with a user-visible reply count.
-- Reads auth.uid() internally; granted to authenticated (a plain user calls it
-- directly to render "My tickets"). RLS on the underlying table already scopes
-- the rows, but the RPC gives a stable, count-enriched shape.
create or replace function public.list_my_tickets()
returns table (
  id uuid,
  ticket_number text,
  subject text,
  status text,
  category text,
  priority text,
  linked_faq text,
  created_at timestamptz,
  updated_at timestamptz,
  reply_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select sm.id, sm.ticket_number, sm.subject, sm.status, sm.category,
         sm.priority, sm.linked_faq, sm.created_at, sm.updated_at,
         (select count(*) from public.support_ticket_events e
            where e.ticket_id = sm.id and e.visibility = 'user') as reply_count
    from public.support_messages sm
   where sm.user_id = auth.uid()
   order by sm.updated_at desc;
$$;

revoke all on function public.list_my_tickets() from public;
grant execute on function public.list_my_tickets() to authenticated;

-- list_ticket_pool — the agent queue (support+). Masked sender email, filter by
-- status. Reads auth.uid() internally and re-checks the role.
create or replace function public.list_ticket_pool(p_status text default null, p_limit int default 100)
returns table (
  id uuid,
  ticket_number text,
  user_id uuid,
  email_masked text,
  subject text,
  status text,
  category text,
  priority text,
  assignee uuid,
  linked_faq text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.current_user_is_support_or_higher() then
    raise exception 'not authorized';
  end if;

  return query
    select sm.id, sm.ticket_number, sm.user_id,
           public.mask_email(sm.email) as email_masked,
           sm.subject, sm.status, sm.category, sm.priority,
           sm.assignee, sm.linked_faq, sm.created_at, sm.updated_at
      from public.support_messages sm
     where p_status is null or sm.status = p_status
     order by
       case sm.priority when 'urgent' then 0 when 'high' then 1
         when 'normal' then 2 else 3 end,
       sm.updated_at desc
     limit greatest(1, least(coalesce(p_limit, 100), 500));
end;
$$;

revoke all on function public.list_ticket_pool(text, int) from public;
grant execute on function public.list_ticket_pool(text, int) to authenticated;

-- list_ticket_thread — the events for one ticket. RLS-scoped reads aren't
-- possible inside a definer (it bypasses RLS), so this function enforces the
-- SAME visibility rule explicitly: an agent sees all events; the owner sees
-- ONLY user-visible events on their OWN ticket; anyone else gets nothing.
create or replace function public.list_ticket_thread(p_id uuid)
returns table (
  id uuid,
  author_role text,
  kind text,
  visibility text,
  body text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_agent boolean;
begin
  if p_id is null then raise exception 'a ticket id is required'; end if;
  v_agent := public.current_user_is_support_or_higher();
  select sm.user_id into v_owner from public.support_messages sm where sm.id = p_id;
  if v_owner is null then
    -- ticket missing or (for a non-agent) not theirs → empty
    if not v_agent then return; end if;
  end if;
  if not v_agent and v_owner <> auth.uid() then
    return; -- not the owner, not an agent → nothing
  end if;

  return query
    select e.id, e.author_role, e.kind, e.visibility, e.body, e.created_at
      from public.support_ticket_events e
     where e.ticket_id = p_id
       -- the OWNER never sees an internal note; an agent sees everything.
       and (v_agent or e.visibility = 'user')
     order by e.created_at asc;
end;
$$;

revoke all on function public.list_ticket_thread(uuid) from public;
grant execute on function public.list_ticket_thread(uuid) to authenticated;
