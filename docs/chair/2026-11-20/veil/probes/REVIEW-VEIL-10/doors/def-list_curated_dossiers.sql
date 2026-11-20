CREATE OR REPLACE FUNCTION public.list_curated_dossiers()
 RETURNS TABLE(id uuid, public_slug text, name text, tier text, published_at timestamp with time zone, view_count integer, curated_order integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select id, public_slug, name, tier, published_at, view_count, curated_order
    from public.settlements
    where is_public = true and is_curated = true
    order by curated_order nulls last, published_at desc;
$function$

