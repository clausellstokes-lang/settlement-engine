CREATE OR REPLACE FUNCTION public._gallery_chronicle_json(entries jsonb)
 RETURNS jsonb
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case
    when entries is null or jsonb_typeof(entries) <> 'array' then null
    else coalesce(
      (
        select jsonb_agg(public._gallery_chronicle_entry(elem.value) order by elem.ord)
        from jsonb_array_elements(entries) with ordinality as elem(value, ord)
        where elem.ord > jsonb_array_length(entries) - 50
          and jsonb_typeof(elem.value) = 'object'
      ),
      '[]'::jsonb
    )
  end;
$function$

