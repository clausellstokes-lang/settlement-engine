p='211.sql'; s=open(p).read()
def rep(old, new):
    global s
    assert s.count(old)==1, old[:80]
    s=s.replace(old,new)
# (a) the legacy eyes, unioned once per read
rep("""create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb)""",
"""create or replace function public._gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)""")
rep("""  if id is null then
    own := (select jsonb_agg(x) from jsonb_each(byid) e(k, v), jsonb_array_elements(v) x where k like 'event.legacy-%');
  else""","""  if id is null then
    own := legacy;  -- every eye on any legacy event, unioned once per read (the review's F5)
  else""")
rep("""    when mode = 'eyes' then public._gallery_veil_card(kind, e, a -> 'cls', a -> 'byid', a -> 'exc')""",
"""    when mode = 'eyes' then public._gallery_veil_card(kind, e, a -> 'cls', a -> 'byid', a -> 'exc', a -> 'legacy')""")
rep("""    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj));""",
"""    s := public._gallery_veil_map(s, kind, 'eyes', jsonb_build_object('cls', classes -> kind, 'byid', fields -> kind, 'exc', excj,
      'legacy', case when kind = 'event' then coalesce((select jsonb_agg(distinct f) from jsonb_each(coalesce(fields -> 'event', '{}')) e(k, v),
                                                          jsonb_array_elements_text(v) f where k like 'event.legacy-%'), '[]') end));""")
# (b) the card-hidden houses, set-based
rep("""  if card_hides <> '{}' then
    for r in select c.card, public._gallery_veil_card_id('institution', c.card) as id from public._gallery_veil_cards(s, 'institution') c loop
      if not (card_hides ? r.id) then continue; end if;
      if public._gallery_veil_house(r.card) then
        gone_ids := gone_ids || jsonb_build_object(r.id, true);
        if public._gallery_veil_str(r.card -> 'name') <> '' then
          gone_houses := gone_houses || jsonb_build_object(r.card ->> 'name', true);
        end if;
      else
        fields := jsonb_set(fields, '{institution}', coalesce(fields -> 'institution', '{}'));
        fields := jsonb_set(fields, array['institution', r.id], (select jsonb_agg(distinct f) from (
          select jsonb_array_elements_text(coalesce(fields #> array['institution', r.id], '[]')) f
          union select unnest(array['description', 'function', 'services', 'people'])) u));
      end if;
    end loop;
  end if;""","""  -- (set-based, the review's F5: one pass, never a growing object rebuilt per house)
  if card_hides <> '{}' then
    with h as (
      select c.card, i.id, public._gallery_veil_house(c.card) as house
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_card_id('institution', c.card) as id) i
       where card_hides ? i.id
    )
    select coalesce((select jsonb_object_agg(id, true) from h where house), '{}'),
           coalesce((select jsonb_object_agg(card ->> 'name', true) from h where house and public._gallery_veil_str(card -> 'name') <> ''), '{}'),
           fields || jsonb_build_object('institution', coalesce(fields -> 'institution', '{}') || coalesce((
             select jsonb_object_agg(q.id, (select jsonb_agg(distinct f) from (
                 select jsonb_array_elements_text(coalesce(fields #> array['institution', q.id], '[]')) f
                 union select unnest(array['description', 'function', 'services', 'people'])) u))
               from (select distinct id from h where not house) q), '{}'))
      into gone_ids, gone_houses, fields;
    if fields -> 'institution' = '{}' then fields := fields - 'institution'; end if;
  end if;""")
# (c) the virtual eyes, set-based
rep("""  services_of := gone_houses;
  for r in select c.card, public._gallery_veil_card_id('institution', c.card) as id from public._gallery_veil_cards(s, 'institution') c loop
    if public._gallery_veil_str(r.card -> 'name') = '' then continue; end if;
    veiled_services := coalesce(fields #> array['institution', r.id], '[]') ? 'services'
      or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || r.id || ':services')));
    veiled_people := coalesce(fields #> array['institution', r.id], '[]') ? 'people'
      or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || r.id || ':people')));
    if veiled_services then services_of := services_of || jsonb_build_object(r.card ->> 'name', true); end if;
    if veiled_people then people_of := people_of || jsonb_build_object(r.card ->> 'name', true); end if;
  end loop;""","""  if fields -> 'institution' is not null or classes -> 'institution' is not null then
    with v as (
      select c.card ->> 'name' as name,
             coalesce(fields #> array['institution', i.id], '[]') ? 'services'
               or (coalesce(classes -> 'institution', '[]') ? 'services' and not (excj ? ('field:institution:' || i.id || ':services'))) as vs,
             coalesce(fields #> array['institution', i.id], '[]') ? 'people'
               or (coalesce(classes -> 'institution', '[]') ? 'people' and not (excj ? ('field:institution:' || i.id || ':people'))) as vp
        from public._gallery_veil_cards(s, 'institution') c, lateral (select public._gallery_veil_card_id('institution', c.card) as id) i
       where public._gallery_veil_str(c.card -> 'name') <> ''
    )
    select coalesce((select jsonb_object_agg(name, true) from v where vs), '{}'), coalesce((select jsonb_object_agg(name, true) from v where vp), '{}')
      into services_of, people_of;
  else
    services_of := '{}';
  end if;
  services_of := gone_houses || services_of;""")
open(p,'w').write(s); open('211.f5.sql','w').write(s)
