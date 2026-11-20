CREATE OR REPLACE FUNCTION public.bump_public_view(slug text, viewer_token text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_id  uuid;
  v_ua  text;
  v_key text;
begin
  -- Resolve the target public dossier; bail quietly if it isn't public.
  select id into v_id
    from public.settlements
    where public_slug = slug and is_public = true;
  if v_id is null then
    return;
  end if;

  -- Best-effort User-Agent (PostgREST exposes request headers as a JSON GUC).
  begin
    v_ua := nullif(current_setting('request.headers', true), '')::json ->> 'user-agent';
  exception when others then
    v_ua := null;
  end;

  -- Skip obvious bots/crawlers/scripts — they shouldn't inflate vanity counts.
  if v_ua is not null and v_ua ~* '(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview|headless|monitor|uptime|curl|wget|python-requests|go-http|axios|node-fetch|libwww|okhttp)' then
    return;
  end if;

  -- Pick the most-trusted available identity.
  v_key := coalesce(
    case when auth.uid() is not null then 'u:' || auth.uid()::text end,
    case when viewer_token is not null and length(viewer_token) between 8 and 200
         then 't:' || viewer_token end,
    'a:' || md5(coalesce(v_ua, 'anon'))
  );

  -- New viewer/day → count it; repeat within the day → no-op.
  insert into public.gallery_views (settlement_id, viewer_key)
    values (v_id, v_key)
    on conflict (settlement_id, viewer_key, viewed_on) do nothing;

  if found then
    update public.settlements
      set view_count = coalesce(view_count, 0) + 1
      where id = v_id;
  end if;
end;
$function$

