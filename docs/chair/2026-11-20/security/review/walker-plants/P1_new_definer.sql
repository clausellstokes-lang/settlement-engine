-- P1: a new SECURITY DEFINER function, no grant change (the V10-8 shape): must red as unlisted.
create function public.rg1_plant_open(target uuid) returns void language sql security definer set search_path = public, pg_temp
  as $$ update public.settlements set name = 'PLANTED' where id = target $$;
