CREATE OR REPLACE FUNCTION public.import_gallery_map(p_slug text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_ok boolean;
begin
  select (is_public and coalesce(gallery_importable, false))
    into v_ok
    from public.saved_maps
   where public_slug = p_slug;
  if not coalesce(v_ok, false) or auth.uid() is null then
    return null;
  end if;
  return public.get_gallery_map(p_slug);
end $function$

