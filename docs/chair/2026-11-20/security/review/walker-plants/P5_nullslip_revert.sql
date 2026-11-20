-- P5: set_curated's guard reverted to its 210 form (`caller_role not in (…)`, NULL for a caller with no profile row): must red.
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
