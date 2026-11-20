-- P2: a listed door (has_dossier_entitlement, check `auth.uid()`) with its caller check removed entirely: must red.
create or replace function public.has_dossier_entitlement(p_save_id uuid) returns boolean language plpgsql stable security definer
set search_path = public, pg_temp as $$
begin
  return exists (select 1 from public.dossier_entitlements where save_id = p_save_id and status = 'active');
end; $$;
