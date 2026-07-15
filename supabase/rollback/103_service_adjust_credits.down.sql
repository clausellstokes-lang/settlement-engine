-- 103_service_adjust_credits.down.sql — reversal for migration 103.
--
-- Data-safe: 103 only created one new function and re-declared one existing
-- function body. This drops the new function and restores service_set_credits
-- to its prior net-current body (017 VERBATIM — the cached-counter prev and no
-- row lock, i.e. the exact pre-103 behavior, races included). No rows touched.
--
-- NOTE: after running this, the edge grant_credits action (admin-actions) will
-- fail loudly (unknown RPC service_adjust_credits) until the matching edge
-- function revert is deployed — fail-loud is intended; the money write must not
-- silently fall back to the racy path.

drop function if exists public.service_adjust_credits(uuid, uuid, integer, text);

-- 017's service_set_credits, verbatim.
create or replace function public.service_set_credits(
  actor_user uuid,
  target_user uuid,
  new_credits integer,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_credits integer;
  delta integer;
  after_row jsonb;
begin
  perform public._assert_service_admin_actor(actor_user);

  if target_user is null then
    raise exception 'target_user is required';
  end if;
  if new_credits is null or new_credits < 0 then
    raise exception 'new_credits must be a non-negative integer';
  end if;
  if new_credits > 100000 then
    raise exception 'new_credits exceeds per-call limit (100000)';
  end if;

  select credits into prev_credits
  from public.profiles
  where id = target_user;

  if prev_credits is null then
    raise exception 'target profile not found';
  end if;

  delta := new_credits - prev_credits;

  if delta <> 0 then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      target_user,
      case when delta > 0 then 'grant' else 'spend' end,
      abs(delta),
      'admin_set',
      jsonb_build_object(
        'admin_actor', actor_user,
        'previous_balance', prev_credits,
        'new_balance', new_credits,
        'reason', reason
      )
    );

    insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, delta, 'admin_set');
  end if;

  update public.profiles p
    set credits = new_credits,
        updated_at = now()
    where p.id = target_user
    returning to_jsonb(p.*) into after_row;

  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values
    (
      actor_user,
      target_user,
      'admin_set_credits',
      jsonb_build_object('credits', prev_credits),
      jsonb_build_object('credits', new_credits, 'delta', delta, 'profile', after_row),
      reason
    );

  return jsonb_build_object('prev', prev_credits, 'next', new_credits, 'delta', delta);
end;
$$;

grant execute on function public.service_set_credits(uuid, uuid, integer, text) to service_role;
