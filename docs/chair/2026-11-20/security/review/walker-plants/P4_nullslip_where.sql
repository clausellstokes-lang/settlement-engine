-- P4: a listed door (list_ticket_thread) whose guard moves into a WHERE filter that a NULL slips for a ticket with
-- no owner row match... here: `where sm.user_id is distinct from` misuse — the owner test written as `<> auth.uid()`
-- inside the query, not an if-line. anon is not granted; signed-in callers only: a NULL-slip arm blind spot probe.
create or replace function public.list_ticket_thread(p_id uuid)
returns table (id uuid, author_role text, kind text, visibility text, body text, created_at timestamptz)
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare v_agent boolean;
begin
  if p_id is null then raise exception 'a ticket id is required'; end if;
  v_agent := public.current_user_is_support_or_higher();
  return query
    select e.id, e.author_role, e.kind, e.visibility, e.body, e.created_at
      from public.support_ticket_events e join public.support_messages sm on sm.id = e.ticket_id
     where e.ticket_id = p_id and not (not v_agent and sm.user_id <> auth.uid())
       and (v_agent or e.visibility = 'user')
     order by e.created_at asc;
end; $$;
