-- 018_account_billing_models_credits.sql
-- Account preferences, owner fallback, Stripe customer IDs, expiring
-- Cartographer credits, monthly-first spend allocation, and canon-only sharing.

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists email_notifications boolean not null default true,
  add column if not exists model_preference text not null default 'claude_best',
  add column if not exists stripe_customer_id text;

alter table public.profiles
  drop constraint if exists profiles_model_preference_check;

alter table public.profiles
  add constraint profiles_model_preference_check
  check (model_preference in ('claude_best', 'claude_fast', 'chatgpt_best', 'chatgpt_fast'));

create index if not exists idx_profiles_stripe_customer_id
  on public.profiles(stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists idx_profiles_email_lower
  on public.profiles((lower(email)))
  where email is not null;

update public.profiles
  set role = 'admin'
  where lower(coalesce(email, '')) = 'clausellstokes@aol.com';

create or replace function public.current_user_is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (
        role in ('developer', 'admin')
        or lower(coalesce(email, '')) = 'clausellstokes@aol.com'
      )
  );
$$;

revoke all on function public.current_user_is_privileged() from public;
grant execute on function public.current_user_is_privileged() to authenticated;

drop policy if exists "Users update own profile (display_name only)" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users update own profile (safe preferences only)"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role               is not distinct from (select role               from public.profiles where id = auth.uid())
    and tier               is not distinct from (select tier               from public.profiles where id = auth.uid())
    and credits            is not distinct from (select credits            from public.profiles where id = auth.uid())
    and is_founder         is not distinct from (select is_founder         from public.profiles where id = auth.uid())
    and stripe_customer_id is not distinct from (select stripe_customer_id from public.profiles where id = auth.uid())
    and email              is not distinct from (select email              from public.profiles where id = auth.uid())
  );

create table if not exists public.credit_spend_allocations (
  spend_id uuid not null references public.credit_ledger(id) on delete cascade,
  grant_id uuid not null references public.credit_ledger(id) on delete cascade,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now(),
  primary key (spend_id, grant_id)
);

create index if not exists idx_credit_spend_allocations_grant
  on public.credit_spend_allocations(grant_id);

alter table public.credit_spend_allocations enable row level security;

drop policy if exists "Users read own spend allocations" on public.credit_spend_allocations;
create policy "Users read own spend allocations"
  on public.credit_spend_allocations
  for select
  using (
    exists (
      select 1 from public.credit_ledger spend
      where spend.id = spend_id
        and spend.user_id = auth.uid()
    )
  );

create unique index if not exists idx_credit_ledger_monthly_invoice
  on public.credit_ledger ((metadata->>'stripe_invoice_id'))
  where source = 'monthly_allowance' and metadata ? 'stripe_invoice_id';

create or replace function public.get_credit_balance(target_user uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
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
  from active_grants g
  left join allocated a on a.grant_id = g.id;
$$;

grant execute on function public.get_credit_balance(uuid) to authenticated;

create or replace function public.spend_credits(feature text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cost integer;
  remaining integer;
  current_balance integer;
  user_role text;
  new_spend_id uuid;
  needed integer;
  grant_row record;
  allocation integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  cost := case feature
    when 'narrative'   then 3
    when 'dailyLife'   then 4
    when 'progression' then 5
    when 'narrative_fast'   then 2
    when 'dailyLife_fast'   then 3
    when 'progression_fast' then 4
    else null
  end;

  if cost is null then
    raise exception 'unknown feature: %', feature;
  end if;

  select role into user_role from public.profiles where id = auth.uid() for update;
  if user_role in ('developer', 'admin') or public.current_user_is_privileged() then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (auth.uid(), 'spend', cost, feature, jsonb_build_object('elevated', true))
      returning id into new_spend_id;
    return jsonb_build_object('ok', true, 'balance', -2, 'spend_id', new_spend_id, 'elevated', true);
  end if;

  current_balance := public.get_credit_balance(auth.uid());
  if current_balance < cost then
    return jsonb_build_object(
      'ok', false,
      'reason', 'insufficient_funds',
      'balance', coalesce(current_balance, 0)
    );
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (auth.uid(), 'spend', cost, feature, '{}'::jsonb)
    returning id into new_spend_id;

  needed := cost;

  for grant_row in
    select
      g.id,
      greatest(g.amount - coalesce(a.amount, 0), 0)::integer as available
    from public.credit_ledger g
    left join (
      select grant_id, sum(amount)::integer as amount
      from public.credit_spend_allocations
      group by grant_id
    ) a on a.grant_id = g.id
    where g.user_id = auth.uid()
      and g.kind = 'grant'
      and (g.expires_at is null or g.expires_at > now())
      and greatest(g.amount - coalesce(a.amount, 0), 0) > 0
    order by
      case when g.source = 'monthly_allowance' then 0 else 1 end,
      g.expires_at nulls last,
      g.created_at
    for update of g
  loop
    allocation := least(needed, grant_row.available);
    if allocation > 0 then
      insert into public.credit_spend_allocations (spend_id, grant_id, amount)
        values (new_spend_id, grant_row.id, allocation);
      needed := needed - allocation;
    end if;
    exit when needed <= 0;
  end loop;

  if needed > 0 then
    raise exception 'credit allocation failed';
  end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (auth.uid(), -cost, feature);

  remaining := public.get_credit_balance(auth.uid());
  update public.profiles
    set credits = remaining,
        updated_at = now()
    where id = auth.uid();

  return jsonb_build_object('ok', true, 'balance', remaining, 'spend_id', new_spend_id, 'elevated', false);
end;
$$;

grant execute on function public.spend_credits(text) to authenticated;

drop function if exists public.system_grant_credits(uuid, integer, text, jsonb);

create or replace function public.system_grant_credits(
  target_user uuid,
  amount      integer,
  source      text,
  metadata    jsonb default '{}'::jsonb,
  expires_at  timestamptz default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
  caller_role text;
begin
  caller_role := current_setting('request.jwt.claim.role', true);
  if caller_role is null then
    caller_role := auth.role();
  end if;
  if caller_role <> 'service_role' then
    raise exception 'system_grant_credits is service-role only (got: %)', caller_role;
  end if;
  if amount <= 0 then
    raise exception 'amount must be positive (got: %)', amount;
  end if;
  if amount > 10000 then
    raise exception 'amount exceeds per-call limit (10000)';
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required';
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata, expires_at)
    values (target_user, 'grant', amount, source, coalesce(metadata, '{}'::jsonb), expires_at);

  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, source);

  new_balance := public.get_credit_balance(target_user);
  update public.profiles
    set credits = new_balance,
        updated_at = now()
    where id = target_user;

  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object('new_balance', new_balance, 'expires_at', expires_at) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

grant execute on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) to service_role;

create or replace function public.publish_settlement(target_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_slug text;
  new_slug text;
  state jsonb;
begin
  select public_slug, campaign_state into existing_slug, state
    from public.settlements
    where id = target_id and user_id = auth.uid();
  if not found then
    raise exception 'Not found or not owned by caller';
  end if;

  if coalesce(state->>'phase', '') <> 'canon'
    and coalesce(state->>'canonizedAt', '') = ''
  then
    raise exception 'Only canonized settlements can be shared publicly';
  end if;

  if existing_slug is null then
    loop
      new_slug := public._make_public_slug();
      begin
        update public.settlements
          set is_public = true,
              public_slug = new_slug,
              published_at = now()
          where id = target_id;
        existing_slug := new_slug;
        exit;
      exception when unique_violation then
      end;
    end loop;
  else
    update public.settlements
      set is_public = true,
          published_at = now()
      where id = target_id;
  end if;

  return existing_slug;
end;
$$;

grant execute on function public.publish_settlement(uuid) to authenticated;

comment on function public.get_credit_balance(uuid) is
  'Current credit balance. Monthly allowance grants expire independently; allocated monthly spends do not consume purchased packs after expiry.';
comment on function public.spend_credits(text) is
  'User-callable credit spend. Allocates against active monthly allowance first, then purchased/perpetual grants.';
comment on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) is
  'Service-role-only ledger grant for Stripe and system jobs. Optional expires_at supports monthly allowances.';
