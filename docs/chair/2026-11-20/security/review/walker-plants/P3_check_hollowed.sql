-- P3: a listed door (welcome_credit_available, check `auth.uid()`) with the line that limits the TARGET removed, the
-- anon early-return kept: the text `auth.uid()` is still in the body. A signed-in user now reads any user's state.
create or replace function public.welcome_credit_available(target_user uuid) returns boolean language plpgsql stable security definer
set search_path = public, pg_temp as $$
declare welcome_created_at timestamptz;
begin
  if auth.uid() is null then return false; end if;
  if target_user is null then return false; end if;
  select cl.created_at into welcome_created_at from public.credit_ledger cl
   where cl.user_id = target_user and cl.kind = 'grant' and cl.source = 'welcome' order by cl.created_at asc limit 1;
  return welcome_created_at is not null;
end; $$;
