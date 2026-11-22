-- ────────────────────────────────────────────────────────────────────────────
-- 060_enforce_account_status_support_tickets.sql — close the last two account-
-- status gaps on the SECURITY DEFINER write surface (adversarial finding on 055).
--
-- THE PROBLEM
--   057 gated the credit/settlement write RPCs and 059 added a redundant in-body
--   account_is_active() guard to every gallery / map definer write RPC
--   (publish_settlement, toggle_gallery_vote, add_gallery_comment,
--   delete_gallery_comment, report_gallery_dossier, publish_map). But the TWO
--   support-ticket definer WRITE RPCs from 055 — create_ticket and
--   post_ticket_reply — were never given the same guard. Today the only
--   enforcement is the account-actions edge gate
--   (supabase/functions/account-actions/index.ts), so a service_role caller
--   invoking either RPC directly bypasses a ban with NO database backstop.
--
-- THE FIX (defense-in-depth, mirrors 057/059)
--   Reproduce the net-current 055 bodies VERBATIM and insert ONE guard line —
--     if not public.account_is_active(p_actor) then
--       raise exception 'account is not active' using errcode = 'check_violation';
--     end if;
--   — right after each function's existing actor / ownership check. The gate is on
--   the forwarded p_actor (the verified actor the edge function passes), so a
--   banned/disabled/soft-deleted account cannot open a NEW ticket or post a reply
--   even via a forged direct RPC call. The post_ticket_reply guard is UNCONDITIONAL
--   on p_actor: it applies to BOTH owner and agent actors — a banned/disabled staff
--   account is equally cut off (account_is_active already trips on any 053/054 flag,
--   and a disabled staff account has no business posting). This is the strongest
--   defense-in-depth and matches the 057/059 "gate the actor, full stop" posture.
--
-- These are the only two 055 RPCs that WRITE on behalf of a forwarded actor;
-- claim_ticket / set_ticket_status / link_ticket_faq already require a privileged
-- role (a banned privileged account is an admin-side revocation, out of scope), and
-- the list_* RPCs are read-only.
--
-- Re-runnable: CREATE OR REPLACE; the bodies are byte-for-byte the 055 net-current
-- versions plus the single guard line, so no behavior changes for an active actor.
-- The revoke/grant lines are restated (idempotent) to keep the file self-contained.
-- Depends on: 055 (create_ticket / post_ticket_reply bodies + support_ticket_events),
--             057 (account_is_active), 050 (has_role).
-- ────────────────────────────────────────────────────────────────────────────

-- ── create_ticket — owner-scoped insert. Net-current 055 body + the account-
-- status guard right after the actor check. A banned actor may not open a ticket.
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
  -- Trust-boundary gate (060): a banned/disabled/soft-deleted account may not open
  -- a NEW ticket, even via a direct service_role RPC call that bypasses the
  -- account-actions edge gate. Mirrors the 057/059 account_is_active backstop.
  if not public.account_is_active(p_actor) then
    raise exception 'account is not active' using errcode = 'check_violation';
  end if;
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

-- ── post_ticket_reply — add an event to a ticket thread. Net-current 055 body +
-- the account-status guard right after the owner/agent authorization check. A
-- banned actor (owner OR agent) may not post a reply.
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
  -- Trust-boundary gate (060): a banned/disabled/soft-deleted actor may not post a
  -- reply, even via a direct service_role RPC call that bypasses the account-actions
  -- edge gate. UNCONDITIONAL on p_actor — applies to BOTH owner and agent actors (a
  -- disabled staff account is equally cut off). Mirrors the 057/059 backstop.
  if not public.account_is_active(p_actor) then
    raise exception 'account is not active' using errcode = 'check_violation';
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

comment on function public.create_ticket(uuid, text, text, text, text, text, jsonb, jsonb) is
  'Owner-scoped support-ticket insert (mints the number). Net-current 055 body plus the 060 account-status gate: a banned/disabled/soft-deleted actor cannot open a ticket even via a direct service_role RPC call.';
comment on function public.post_ticket_reply(uuid, uuid, text, text) is
  'Append a user reply or internal note to a ticket thread. Net-current 055 body plus the 060 account-status gate (unconditional on p_actor): a banned/disabled/soft-deleted actor — owner OR staff — cannot post a reply even via a direct service_role RPC call.';
