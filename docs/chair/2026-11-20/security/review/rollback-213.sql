-- rollback-213.sql (REVIEW-GRANTS-1): 213's @rollback comment made executable, as written there: the five §1 bodies as they
-- stood at 210 (pg_get_functiondef on the 001..210 chain: the net-current text with 094/131's pin), then the 21 §4
-- helpers re-granted to anon and authenticated. Nothing else (the 157 and the four doors' revokes are NOT reversed).
CREATE OR REPLACE FUNCTION public.set_curated(target_id uuid, curated boolean, sort_order integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  caller_role text;
  before_state jsonb;
begin
  -- Gate: only developer / admin roles can curate.
  select role into caller_role
    from public.profiles
    where id = auth.uid();

  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change curation status';
  end if;

  -- Capture before-state for the audit log.
  select jsonb_build_object(
    'is_curated', is_curated,
    'curated_order', curated_order,
    'name', name
  ) into before_state
    from public.settlements
    where id = target_id;

  if before_state is null then
    raise exception 'Settlement not found';
  end if;

  -- Apply the change. If marking as curated, the row must also be public.
  if curated then
    update public.settlements
      set is_curated    = true,
          curated_order = sort_order
      where id = target_id and is_public = true;
    if not found then
      raise exception 'Cannot curate a non-public settlement. Publish it first.';
    end if;
  else
    update public.settlements
      set is_curated    = false,
          curated_order = null
      where id = target_id;
  end if;

  -- Audit log entry via the existing _audit_action helper. The
  -- admin_actions table's target_id column references auth.users(id),
  -- so we can't put a settlement_id there directly — instead we pass
  -- target_id=NULL and store the settlement context inside the
  -- before/after JSON payloads (with the settlement id explicit).
  perform public._audit_action(
    auth.uid(),
    null,
    case when curated then 'gallery_curate' else 'gallery_uncurate' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object(
      'settlement_id', target_id,
      'is_curated',    curated,
      'curated_order', sort_order
    ),
    null
  );
end;
$function$

;
CREATE OR REPLACE FUNCTION public.set_featured(target_id uuid, featured boolean, sort_order integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.settlements where id = target_id;
  if before_state is null then raise exception 'Settlement not found'; end if;

  if featured then
    update public.settlements set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public settlement. Publish it first.'; end if;
  else
    update public.settlements set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature' else 'gallery_unfeature' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object('settlement_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$function$

;
CREATE OR REPLACE FUNCTION public.set_featured_map(target_id uuid, featured boolean, sort_order integer DEFAULT NULL::integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.saved_maps where id = target_id;
  if before_state is null then raise exception 'Map not found'; end if;

  if featured then
    update public.saved_maps set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public map. Publish it first.'; end if;
  else
    update public.saved_maps set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature_map' else 'gallery_unfeature_map' end,
    before_state || jsonb_build_object('map_id', target_id),
    jsonb_build_object('map_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$function$

;
CREATE OR REPLACE FUNCTION public.list_ticket_thread(p_id uuid)
 RETURNS TABLE(id uuid, author_role text, kind text, visibility text, body text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$

;
CREATE OR REPLACE FUNCTION public.get_credit_balance(target_user uuid)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  bal integer;
begin
  -- IDOR guard: a genuine end-user (non-NULL auth.uid()) may read only their own
  -- balance, unless they are elevated staff. service_role / pg_cron / migrations and
  -- the SECURITY DEFINER money functions reach here with auth.uid() = NULL and are
  -- trusted to read any target.
  if auth.uid() is not null
     and target_user is distinct from auth.uid()
     and not public.current_user_is_privileged()
  then
    raise exception 'get_credit_balance: not authorized to read another user''s credit balance'
      using errcode = '42501';  -- insufficient_privilege
  end if;

  -- Balance math verbatim from 018 (net-current): active grants minus their
  -- allocated spends, minus legacy un-allocated non-elevated spends.
  with active_grants as (
    select id, amount
    from public.credit_ledger
    where user_id = target_user
      and kind = 'grant'
      and (expires_at is null or expires_at > now())
  ),
  allocated as (
    select grant_id, sum(amount)::integer as amount
    from public.credit_spend_allocations
    group by grant_id
  ),
  legacy_spends as (
    select coalesce(sum(s.amount), 0)::integer as amount
    from public.credit_ledger s
    where s.user_id = target_user
      and s.kind = 'spend'
      and coalesce(s.metadata->>'elevated', 'false') <> 'true'
      and not exists (
        select 1 from public.credit_spend_allocations a
        where a.spend_id = s.id
      )
  )
  select (
    coalesce(sum(g.amount - coalesce(a.amount, 0)), 0)
    - (select amount from legacy_spends)
  )::integer
  into bal
  from active_grants g
  left join allocated a on a.grant_id = g.id;

  return bal;
end;
$function$

;
grant execute on function public._civility_stem_hits(text) to anon, authenticated;
grant execute on function public._civility_token_hits(text) to anon, authenticated;
grant execute on function public._gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean) to anon, authenticated;
grant execute on function public._gallery_chronicle_entry(jsonb) to anon, authenticated;
grant execute on function public._gallery_chronicle_json(jsonb) to anon, authenticated;
grant execute on function public._gallery_dm_full_json(jsonb) to anon, authenticated;
grant execute on function public._gallery_map_backdrop(jsonb) to anon, authenticated;
grant execute on function public._gallery_npc_key(jsonb) to anon, authenticated;
grant execute on function public._gallery_sanitize_public_json(jsonb,text[]) to anon, authenticated;
grant execute on function public._gc_dim_sql(text) to anon, authenticated;
grant execute on function public._make_public_slug() to anon, authenticated;
grant execute on function public._make_unlisted_slug() to anon, authenticated;
grant execute on function public._trunc_unit(text) to anon, authenticated;
grant execute on function public.civility_blocked(text) to anon, authenticated;
grant execute on function public.civility_normalize(text) to anon, authenticated;
grant execute on function public.is_allowed_email_category(text) to anon, authenticated;
grant execute on function public.is_allowed_security_question_id(text) to anon, authenticated;
grant execute on function public.market_k_min_campaigns() to anon, authenticated;
grant execute on function public.market_k_min_users() to anon, authenticated;
grant execute on function public.mask_email(text) to anon, authenticated;
grant execute on function public.normalize_external_name(text) to anon, authenticated;
