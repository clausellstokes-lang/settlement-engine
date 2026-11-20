-- P1b: the same, with the habit that made V10-8 (`revoke … from public` only): must red as unlisted.
create function public.rg1_plant_open2(target uuid) returns void language sql security definer set search_path = public, pg_temp
  as $$ update public.settlements set name = 'PLANTED' where id = target $$;
revoke execute on function public.rg1_plant_open2(uuid) from public;
