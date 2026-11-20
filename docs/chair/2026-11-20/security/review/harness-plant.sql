-- harness-plant.sql (REVIEW-GRANTS-1): the wide harness's negative controls — two planted doors with no caller check,
-- created as a migration would (postgres, schema public: Supabase's default privileges open them to anon).
create function public.rg1_plant_rename(target uuid) returns void language sql security definer set search_path = public as
  $$ update public.settlements set name = 'PLANTED' where id = target $$;
create function public.rg1_plant_thread(p_id uuid) returns setof text language sql security definer set search_path = public as
  $$ select body from public.support_ticket_events where ticket_id = p_id $$;
