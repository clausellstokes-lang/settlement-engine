-- MC LOCAL TRIAL ONLY (never applied but to a local test database)
create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean default false)
returns jsonb language plpgsql volatile as $$
declare
  -- the stored overrides, decompressed ONCE: every later look at them is in memory (a stored object
  -- of any size is read once per read, never once per operator)
  ov jsonb := coalesce(overrides #> '{}', '{}');
  doc jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}' end;
  -- every person of the document, by the client's member key (the served booleans and the card deltas)
  people text[] := array(select distinct public._gallery_veil_npc_id(c.card) from public._gallery_veil_cards(doc, 'npc') c);
  res jsonb;
  body jsonb;
  served jsonb;
  -- R4-IDS (item 1): ONE salt a call, for the body AND the served marker of this call; never shipped
  salt text := 'mc-fixed-salt-for-the-differential';
begin
  if jsonb_typeof(ov) <> 'object' then ov := '{}'; end if;
  res := public._gallery_veil_resolve(pub, ov, link, people);
  -- VEIL-21 (R2): an unmarked listing is served as before (the reads take `body` where it is given), but for what no
  -- non-owner read sends whatever the veil (_gallery_veil_withhold_always): the gallery read, the import and the campaign
  -- map's member (get_gallery_map serves `body` where there is one), each its own projection less those rows
  -- VEIL-22 (R3): and the roster choices before it (nothing is hidden whole there: VR31's shares alone can move)
  -- R4-IDS (item 5): and every person id re-keyed between the two, the marker's person keys with it (registry: people.rekey)
  if res is null then
    body := case when jsonb_typeof(pub) = 'object' then public._gallery_veil_roster_choices(pub, pub) end;
    served := public._gallery_veil_rekey_served(public._gallery_veil_served(ov, null, to_jsonb(people), copy), coalesce(body, '{}'::jsonb), salt);
    return jsonb_build_object('served', served)
      || case when body is not null then jsonb_build_object('body', public._gallery_veil_withhold_always(public._gallery_veil_rekey(body, salt))) else '{}'::jsonb end;
  end if;
  body := public._gallery_veil_apply(pub, res);
  -- a person card with neither a name nor a role is dropped, as the client's projection drops it
  -- (publicSafe.js :: toPublicSafe); a served page is not projected again (the third review's V3-2)
  if jsonb_typeof(body -> 'npcs') = 'array' then
    body := jsonb_set(body, '{npcs}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(body -> 'npcs') with ordinality x(e, o)
      where jsonb_typeof(e) <> 'object' or public._gallery_veil_truthy(e -> 'name') or public._gallery_veil_truthy(e -> 'role')), '[]'));
  end if;
  -- VEIL-22 (R3): the drawn conditional rows (the roster choices), then R2's step
  body := public._gallery_veil_roster_choices(body, pub);
  -- R4-IDS (items 5, 6): the served marker by the cards as they stand, then every person id re-keyed under the call's salt
  -- (registry: people.rekey)
  served := public._gallery_veil_rekey_served(public._gallery_veil_served(ov, res -> 'groupings', to_jsonb(people), copy), body, salt);
  body := public._gallery_veil_rekey(body, salt);
  -- VEIL-21 (R2): last, what no non-owner read sends whatever the veil
  body := public._gallery_veil_withhold_always(body);
  return jsonb_build_object(
    'body', body,
    'groupings', res -> 'groupings',
    'served', served);
end $$;
