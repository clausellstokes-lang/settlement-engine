-- ────────────────────────────────────────────────────────────────────────────
-- 077_ticket_show_account_number.sql — surface account_number to the operator.
--
-- OPERATOR NOTE
--   Recreates list_ticket_pool (forked VERBATIM from the NET-CURRENT 055 body —
--   the migration-recreate rule) to add `account_number` to the returns table,
--   resolved by a LEFT JOIN onto profiles keyed on the ticket's user_id. The
--   account_number (075) is the stable, NON-PII handle the support agent uses to
--   identify the writer — better than the masked email, which 055 already
--   surfaces and which this migration KEEPS.
--
--   PRESERVED EXACTLY from 055: the support-or-higher authorization gate, the
--   mask_email(email) projection, the priority/updated_at ordering, the limit
--   clamp, and the grants (revoke from public + grant to authenticated).
--
-- ADDITIVE/IDEMPOTENT: create-or-replace only; no data writes.
-- Depends on: 075 (account_number), 055 (the net-current list_ticket_pool).
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.list_ticket_pool(p_status text default null, p_limit int default 100)
returns table (
  id uuid,
  ticket_number text,
  user_id uuid,
  email_masked text,
  account_number text,
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
           pr.account_number,
           sm.subject, sm.status, sm.category, sm.priority,
           sm.assignee, sm.linked_faq, sm.created_at, sm.updated_at
      from public.support_messages sm
      left join public.profiles pr on pr.id = sm.user_id
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

comment on function public.list_ticket_pool(text, int) is
  'Support agent queue (support+). Returns the masked sender email PLUS the writer''s account_number (075) — the stable non-PII handle for identifying who is writing. Forked verbatim from 055; auth gate + mask_email + ordering preserved.';
