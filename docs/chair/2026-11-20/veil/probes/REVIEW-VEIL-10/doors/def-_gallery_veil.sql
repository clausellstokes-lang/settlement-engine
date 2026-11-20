CREATE OR REPLACE FUNCTION public._gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
declare
  -- the stored overrides, decompressed ONCE: every later look at them is in memory (a stored object
  -- of any size is read once per read, never once per operator)
  ov jsonb := coalesce(overrides #> '{}', '{}');
  doc jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}' end;
  -- every person of the document, by the client's member key (the served booleans and the card deltas)
  people text[] := array(select distinct public._gallery_veil_npc_id(c.card) from public._gallery_veil_cards(doc, 'npc') c);
  res jsonb;
  body jsonb;
begin
  if jsonb_typeof(ov) <> 'object' then ov := '{}'; end if;
  res := public._gallery_veil_resolve(pub, ov, link, people);
  if res is null then return jsonb_build_object('served', public._gallery_veil_served(ov, null, to_jsonb(people), copy)); end if;
  body := public._gallery_veil_apply(pub, res);
  -- a person card with neither a name nor a role is dropped, as the client's projection drops it
  -- (publicSafe.js :: toPublicSafe); a served page is not projected again (the third review's V3-2)
  if jsonb_typeof(body -> 'npcs') = 'array' then
    body := jsonb_set(body, '{npcs}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(body -> 'npcs') with ordinality x(e, o)
      where jsonb_typeof(e) <> 'object' or public._gallery_veil_truthy(e -> 'name') or public._gallery_veil_truthy(e -> 'role')), '[]'));
  end if;
  return jsonb_build_object(
    'body', body,
    'groupings', res -> 'groupings',
    'served', public._gallery_veil_served(ov, res -> 'groupings', to_jsonb(people), copy));
end $function$

