CREATE OR REPLACE FUNCTION public.list_my_unlisted_dossiers()
 RETURNS TABLE(id uuid, unlisted_slug text, name text, tier text, published_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select id, unlisted_slug, name, tier, published_at
    from public.settlements
    where user_id = auth.uid() and unlisted_slug is not null
    order by published_at desc nulls last;
$function$

