-- MC LOCAL TRIAL ONLY (never applied but to a local test database)
create or replace function public._gallery_veil_roster_choices(doc jsonb, pub jsonb)
returns jsonb language plpgsql immutable as $$
declare
  s jsonb := doc;
  p jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  served_ids text[];
  gone text[];
  whole boolean;
  fl jsonb;
  sfl jsonb;
  raised jsonb;
  names text[];
  n0 int;
  n1 int;
  withheld boolean;
  shares boolean;
  bas float8[];
  tot float8;
  bv float8;
  q float8[];
  sh int[];
  give int;
  ix int;
  es jsonb;
  tier text;
  cnt int;
  lbl text;
  mkt boolean;
  beneath boolean;
  sd text;
  signal boolean;
  crim_house boolean;
  -- R3-CURE (VEIL-23's builder): the governing powers' names, the powers power.entry withholds, the withheld powers' tokens
  gov_names text[];
  ps_out text[];
  wn text[];
  pth text[];
  -- R3-CURE-2 (VEIL-24's builder): the withheld powers' ids (a string, or a number by its text), the name search over the
  -- withheld powers' names and its hits over the structured copies; the operations list's label table (unit 2 (a))
  wn_ids text[];
  hz jsonb;   -- MC trial: `pub`'s copies that name a withheld power, found once
  hg jsonb;
  hm jsonb;
  -- R3-TELL-5 unit (ii): the crime types a shown house or a crisis raises (VR39 over `pub`'s list), and each criminal
  -- services tag by the types whose row it is (servicesGenerator.js: the stress rows and the crime-type rows)
  acc_types text[];
  svctags jsonb := '{"(street gang)": ["Street gang activity"], "(smuggling)": ["Smuggling"], "(arcane underground)": ["Magical crime", "Arcane black market"],
    "(state apparatus)": ["State predation"], "(criminal governance)": ["Criminal governance"], "(religious fraud)": ["Religious fraud"],
    "(commercial crime)": ["Commercial crime"]}';
  nt int;
  srch jsonb;
  hits jsonb;
  crimlabels jsonb := '{"thieves'' guild chapter": "Thieves'' Guild Chapter", "thieves'' guild (powerful)": "Thieves'' Guild (Powerful)",
    "assassins'' guild": "Assassins'' Guild", "multiple criminal factions": "Rival Gangs", "black market": "Black Market",
    "black market bazaar": "Black Market Bazaar", "smuggling operation": "Smuggling Operation", "smuggling network": "Smuggling Network",
    "street gang": "Street Gang", "front businesses": "Front Businesses", "underground city": "Underground City", "gambling den": "Gambling Den",
    "gambling halls": "Gambling Halls", "gambling district": "Gambling District", "red light district": "Red Light District"}';
  -- THE RAISERS of each crime type (the flags that raise it: safetyProfile.js's crime types and the stress flags they read,
  -- priorityHelpers.js :: getStressFlags; criminalEffective moves only with hasCriminalInst among the houses). R3-TELL-8: the
  -- list itself is withheld always (_gallery_veil_withhold_always); this map stays for the services rule's `acc_types` below
  -- R3-CURE (VEIL-23's builder, unit 3): EVERY type the engine writes is a key (tests/lint/rosterChoicePools.walker.test.js
  -- holds the map equal to safetyProfile.js's own set); a crisis's type is raised by no house ([]); 'contested property'
  -- by a standing religious house (safetyProfile.js, RELIGIOUS_HOUSE). A type the map does not hold: unsure, WITHHELD
  raisers jsonb := '{"Smuggling": ["hasSmuggling"], "Organized guild crime": ["hasThievesGuild", "hasCriminalInst"],
    "Street gang activity": ["hasGangInfra"], "Criminal governance": ["hasCriminalInst"], "Arcane black market": ["hasCriminalInst"],
    "Religious fraud": ["hasCriminalInst"], "Commercial crime": ["hasCriminalInst"], "Survival crime": ["hasCriminalInst"],
    "Magical crime": ["hasCriminalInst"], "Background crime": ["hasCriminalInst"], "Lawlessness": ["hasCriminalInst"],
    "State predation": [], "desperation theft": [], "black market food": [], "resistance activity": [], "collaboration fraud": [],
    "quarantine violation": [], "plague profiteering": [], "debt evasion": [], "political violence": [], "loyalty testing": [],
    "information trade": [], "revolt violence": [], "escape networks": [], "informant pressure": [], "weapons trade": [],
    "underground worship": [], "religious fraud": [], "contested property": ["religiousHouse"], "informant networks": [],
    "war profiteering": [], "deserter networks": [], "conscription fraud": [], "displacement crime": [], "cultural friction": [],
    "black market passage": []}';
  -- registry: safety.plotHooks (each hook of safetyProfile.js's closed pool by the flag that raises it; [] raised by no house)
  hooks jsonb := jsonb_build_object(
    'A local family wants evidence of tax extortion gathered quietly, but the extorter wears an official badge.', '[]'::jsonb,
    'The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.', '[]'::jsonb,
    'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is the guild.', '["hasCriminalInst"]'::jsonb,
    'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is whoever holds this quarter.', '["hasCriminalInst"]'::jsonb,
    'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is whoever holds this stretch of road.', '["hasCriminalInst"]'::jsonb,
    'A part from the wizard''s tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay.', '["hasCriminalInst"]'::jsonb,
    'A pilgrim paid a fortune for a holy relic that is obviously fake. They want the fraud exposed without losing their faith in the process.', '["hasCriminalInst"]'::jsonb,
    'A guild merchant hired the party, then asked for something the guild forbids; the pay is good, and someone else in the guild already knows.', '["hasCriminalInst"]'::jsonb,
    'The merchant guild''s private security force just detained someone, with no legal authority to do so. The watch is looking the other way.', '["merchantArmy"]'::jsonb,
    -- R3-CURE (unit 3): the two tellings safetyProfile.js :: said writes from SAFETY_LINE_SIBLINGS, each by its sibling's flags
    'The merchant guild''s private security force just detained someone, with no legal authority to do so. No one with the authority to stop it is trying.', '["merchantArmy"]'::jsonb,
    'The settlement''s chaplain also leads its armed men, and is authorizing military action for reasons that sound theological.', '[]'::jsonb,
    'The smuggling network is moving something unusual this week, not the normal contraband. Someone wants to know what it is before it arrives.', '["hasSmuggling"]'::jsonb,
    'A smuggler wants one crate moved quietly and will pay well, but will not say what is in it.', '["hasSmuggling"]'::jsonb,
    'The smugglers have stopped moving their usual goods this week, and nobody can say why.', '["hasSmuggling"]'::jsonb,
    'A smuggled load went missing on the way in, and the people who paid for it are asking questions.', '["hasSmuggling"]'::jsonb,
    'The smugglers have gone quiet since the siege closed the roads, and someone wants to know what their last load was.', '["hasSmuggling"]'::jsonb,
    'The last smuggled load before the siege went missing, and the people who paid for it are asking questions.', '["hasSmuggling"]'::jsonb);
  -- registry: institutions.desc (the three declared pairs a roster-moved fact, 'rival power', chooses between:
  -- institutionDescVariants.js, TAIL-HOUSES-5 batch 8)
  rival text[] := array[
    'Wealthy merchant families hold exclusive civic power; political office is effectively purchased.',
    'Wealthy merchant families hold the civic offices; political office is effectively purchased.',
    'Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.',
    'Civic power rests with the wealthy merchant families, and office is bought in all but name.',
    'A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.',
    'A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.'];
begin
  if jsonb_typeof(s) is distinct from 'object' then return doc; end if;
  -- registry: power.entry (VR42: THE GOVERNING POWER'S ROW IS NEVER REMOVED; any other criminal power, by its seat's mark or a
  -- thieves' name (factionDynamics.js's isCrim), where a house is hidden whole: the criminal power is raised by the crime
  -- reading a hidden house moves, rulingStructure.js). R3-CURE-4 (unit 2; the chair's ruling 37 (a)): the thieves' name is
  -- read only where the power carries NO category string (unsure: withheld); a power whose category says what it is (a
  -- civic "Old Thieves' Guild Watch", raised by no house) is not taken by the words of its name. Measured on the born pool:
  -- 0 of 1,478 born powers read differently (every born "Thieves' Guild" carries category 'criminal').
  served_ids := array(select public._gallery_veil_inst_id(e) from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                       where jsonb_typeof(e) = 'object');
  gone := array(select public._gallery_veil_case_fold(public._gallery_veil_str(e -> 'name'))
                  from jsonb_array_elements(case when jsonb_typeof(p -> 'institutions') = 'array' then p -> 'institutions' else '[]' end) e
                 where jsonb_typeof(e) = 'object' and not (public._gallery_veil_inst_id(e) = any(served_ids)));
  whole := cardinality(gone) > 0;
  -- R3-CURE (unit 1, the chair's ruling of 07:31: THE POWER RULE GOVERNS; a power a hidden house raises leaves WHOLE): the
  -- names of the governing powers (VR42: never removed, in either list) and of the powers withheld below
  gov_names := array(select v from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) f,
    lateral (select f ->> 'faction' as v where jsonb_typeof(f -> 'faction') = 'string' union select f ->> 'name' where jsonb_typeof(f -> 'name') = 'string') w
    where jsonb_typeof(f) = 'object' and f -> 'isGoverning' = 'true'::jsonb);
  ps_out := array(select v from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) e,
    lateral (select e ->> 'faction' as v where jsonb_typeof(e -> 'faction') = 'string' union select e ->> 'name' where jsonb_typeof(e -> 'name') = 'string') w
    where jsonb_typeof(e) = 'object' and coalesce(e -> 'isGoverning', 'null') <> 'true'::jsonb
      and (translate(public._gallery_veil_str(e -> 'category'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal'
           or (coalesce(jsonb_typeof(e -> 'category'), 'none') <> 'string' and public._gallery_veil_str(coalesce(e -> 'faction', e -> 'name')) ~* 'thie')));
  if whole and jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then
    s := jsonb_set(s, '{powerStructure,factions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{powerStructure,factions}') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and coalesce(e -> 'isGoverning', 'null') <> 'true'::jsonb
                 and (translate(public._gallery_veil_str(e -> 'category'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal'
                      or (coalesce(jsonb_typeof(e -> 'category'), 'none') <> 'string' and public._gallery_veil_str(coalesce(e -> 'faction', e -> 'name')) ~* 'thie')))), '[]'));
  end if;
  -- R3-CURE (unit 2): master's stored shape, the top-level factions[] (the powers' twin list, as R4 reads it): the same rule,
  -- an entry naming a power withheld above leaves too, and one naming a governing power stays (VR42)
  if whole and jsonb_typeof(s -> 'factions') = 'array' then
    s := jsonb_set(s, '{factions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'factions') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and coalesce(e -> 'isGoverning', 'null') <> 'true'::jsonb
                 and not (public._gallery_veil_str(e -> 'faction') = any(gov_names) or public._gallery_veil_str(e -> 'name') = any(gov_names))
                 and (translate(public._gallery_veil_str(e -> 'category'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal'
                      or (coalesce(jsonb_typeof(e -> 'category'), 'none') <> 'string' and public._gallery_veil_str(coalesce(e -> 'faction', e -> 'name')) ~* 'thie')
                      or public._gallery_veil_str(e -> 'faction') = any(ps_out) or public._gallery_veil_str(e -> 'name') = any(ps_out)))), '[]'));
    -- (VR11/VR31 on this list too: where the rule above took an entry, a share set left is re-derived to 100 by largest
    -- remainder, as below)
    n1 := (select count(*) from jsonb_array_elements(s -> 'factions') e where jsonb_typeof(e) = 'object');
    if n1 > 0 and n1 < (select count(*) from jsonb_array_elements(doc -> 'factions') e where jsonb_typeof(e) = 'object')
       and not exists (select 1 from jsonb_array_elements(s -> 'factions') e where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'power') is distinct from 'number') then
      bas := array(select case when (e ->> 'power')::numeric between 0 and 1e12
                               then case when public._gallery_veil_num_zero((e ->> 'power')::numeric) then 0::float8 else (e ->> 'power')::float8 end else 0::float8 end
                     from jsonb_array_elements(s -> 'factions') with ordinality x(e, o) where jsonb_typeof(e) = 'object' order by o);
      tot := 0;
      foreach bv in array bas loop tot := tot + bv; end loop;
      if not tot > 0 then bas := array_fill(1::float8, array[cardinality(bas)]); tot := cardinality(bas); end if;
      q := array(select (b / tot) * 100 from unnest(bas) with ordinality u(b, k) order by k);
      sh := array(select floor(v)::int from unnest(q) with ordinality u(v, k) order by k);
      give := 100 - coalesce((select sum(x) from unnest(sh) x), 0);
      for ix in select k from unnest(q) with ordinality u(v, k) order by v - floor(v) desc, k loop
        exit when give <= 0;
        sh[ix] := sh[ix] + 1;
        give := give - 1;
      end loop;
      s := jsonb_set(s, '{factions}', coalesce((
        select jsonb_agg(case when jsonb_typeof(e) = 'object' then e || jsonb_build_object('power', sh[r::int]) else e end order by o)
          from (select e, o, count(*) filter (where jsonb_typeof(e) = 'object') over (order by o) as r
                  from jsonb_array_elements(s -> 'factions') with ordinality x(e, o)) z), '[]'));
    end if;
  end if;
  -- registry: power.share (VR11, VR31: wherever any power is withheld, whatever withheld it, the served shares re-derived to
  -- 100 by LARGEST REMAINDER from the served `power` (a JSON number from 0 to 10^12, else 0; a sum of 0 shares equally),
  -- the floors, then one more to each of the largest remainders, ties by order: _gallery_veil_apply's income rule)
  n0 := (select count(*) from jsonb_array_elements(case when jsonb_typeof(p #> '{powerStructure,factions}') = 'array' then p #> '{powerStructure,factions}' else '[]' end) e where jsonb_typeof(e) = 'object');
  n1 := (select count(*) from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) e where jsonb_typeof(e) = 'object');
  -- (VR31: a power the projection itself withheld, a hidden one off a Reveal-DM read, leaves the stored shares short of 100:
  -- served shares that do not sum to 100 are re-derived too)
  -- (a share set is one where every served power carries a JSON number: a record whose powers carry none, an old one, has
  -- no shares to re-derive, and none is added)
  shares := n1 > 0 and not exists (select 1 from jsonb_array_elements(s #> '{powerStructure,factions}') e
                                    where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'power') is distinct from 'number');
  withheld := n1 < n0 or (shares and (select sum((e ->> 'power')::numeric) from jsonb_array_elements(s #> '{powerStructure,factions}') e
                                       where jsonb_typeof(e) = 'object') <> 100);
  if withheld and shares then
    bas := array(select case when jsonb_typeof(e -> 'power') = 'number' and (e ->> 'power')::numeric between 0 and 1e12
                             then case when public._gallery_veil_num_zero((e ->> 'power')::numeric) then 0::float8 else (e ->> 'power')::float8 end else 0::float8 end
                   from jsonb_array_elements(s #> '{powerStructure,factions}') with ordinality x(e, o) where jsonb_typeof(e) = 'object' order by o);
    tot := 0;
    foreach bv in array bas loop tot := tot + bv; end loop;
    if not tot > 0 then bas := array_fill(1::float8, array[cardinality(bas)]); tot := cardinality(bas); end if;
    q := array(select (b / tot) * 100 from unnest(bas) with ordinality u(b, k) order by k);
    sh := array(select floor(v)::int from unnest(q) with ordinality u(v, k) order by k);
    give := 100 - coalesce((select sum(x) from unnest(sh) x), 0);
    for ix in select k from unnest(q) with ordinality u(v, k) order by v - floor(v) desc, k loop
      exit when give <= 0;
      sh[ix] := sh[ix] + 1;
      give := give - 1;
    end loop;
    s := jsonb_set(s, '{powerStructure,factions}', coalesce((
      select jsonb_agg(case when jsonb_typeof(e) = 'object' then e || jsonb_build_object('power', sh[r::int]) else e end order by o)
        from (select e, o, count(*) filter (where jsonb_typeof(e) = 'object') over (order by o) as r
                from jsonb_array_elements(s #> '{powerStructure,factions}') with ordinality x(e, o)) z), '[]'));
  end if;
  -- registry: power.relation.entry
  -- registry: power.relation.direction (VR37 (b): the word goes with its relation): wherever a power is withheld, a relation
  -- stays only where both of its `pair` name a served power (one that is not an object or names none: unsure, withheld)
  if withheld and jsonb_typeof(s #> '{powerStructure,factionRelationships}') = 'array' then
    names := array(select v from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) f,
      lateral (select f ->> 'faction' as v where jsonb_typeof(f -> 'faction') = 'string' union select f ->> 'name' where jsonb_typeof(f -> 'name') = 'string') w);
    s := jsonb_set(s, '{powerStructure,factionRelationships}', coalesce((select jsonb_agg(e order by o)
      from jsonb_array_elements(s #> '{powerStructure,factionRelationships}') with ordinality x(e, o)
     where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'pair') = 'array' and jsonb_array_length(e -> 'pair') > 0
       and not exists (select 1 from jsonb_array_elements(e -> 'pair') pn where jsonb_typeof(pn) <> 'string' or not ((pn #>> '{}') = any(names)))
       -- R3-CURE-4 (unit 1: A HUSK IS A TELL): a relation whose PRE-SWEEP counterpart in `pub` named an unserved power leaves
       -- whole, though the name sweep took that name out of its pair (a remnant is held, `@>`, by what it was cut from)
       and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p #> '{powerStructure,factionRelationships}') = 'array' then p #> '{powerStructure,factionRelationships}' else '[]' end) r0
                         where jsonb_typeof(r0) = 'object' and r0 @> e
                           and (jsonb_typeof(r0 -> 'pair') <> 'array' or jsonb_array_length(r0 -> 'pair') = 0
                                or exists (select 1 from jsonb_array_elements(r0 -> 'pair') pn where jsonb_typeof(pn) <> 'string' or not ((pn #>> '{}') = any(names)))))), '[]'));
  end if;
  if not whole then return s; end if;

  -- R3-CURE (unit 2; the chair's ruling of 07:39: "LEAVES WHOLE" MEANS EVERY COPY): the withheld powers (every power of
  -- `pub`'s two lists that neither served list names) leave every STRUCTURED copy: a conflict between powers (both lists)
  -- and a tension naming one, whole; a power's `contestsNiche` naming one; a person's membership of one, an affiliation key
  -- naming one, and the goal that targets one or names one (its intent and its two sentences go together). R3-CURE-2 (units
  -- 1 and 4 (i); the chair's ruling 28 of 08:22 and 09:04): a NAME is searched FOLDED, as itself and as its BARE FORM (the
  -- lane's own search, _gallery_veil_name_search, the served powers' names its open names); an ID as a STRING (a number id
  -- by its text), the whole value (_gallery_veil_power_named). Prose composed over the powers is R5's (registry
  -- power.desc). What is left is dense, in order (VR21).
  names := array(select v from (select jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) f
                                union all select jsonb_array_elements(case when jsonb_typeof(s -> 'factions') = 'array' then s -> 'factions' else '[]' end)) q,
    lateral (select q.f ->> 'faction' as v where jsonb_typeof(q.f -> 'faction') = 'string' union select q.f ->> 'name' where jsonb_typeof(q.f -> 'name') = 'string') w);
  wn := array(select distinct v from (select jsonb_array_elements(case when jsonb_typeof(p #> '{powerStructure,factions}') = 'array' then p #> '{powerStructure,factions}' else '[]' end) f
                                      union all select jsonb_array_elements(case when jsonb_typeof(p -> 'factions') = 'array' then p -> 'factions' else '[]' end)) q,
    lateral (select q.f ->> 'faction' as v where jsonb_typeof(q.f -> 'faction') = 'string' union select q.f ->> 'name' where jsonb_typeof(q.f -> 'name') = 'string') w
    where jsonb_typeof(q.f) = 'object' and v <> ''
      and not (public._gallery_veil_str(q.f -> 'faction') = any(names) or public._gallery_veil_str(q.f -> 'name') = any(names)));
  wn_ids := array(select distinct v from (select jsonb_array_elements(case when jsonb_typeof(p #> '{powerStructure,factions}') = 'array' then p #> '{powerStructure,factions}' else '[]' end) f
                                          union all select jsonb_array_elements(case when jsonb_typeof(p -> 'factions') = 'array' then p -> 'factions' else '[]' end)) q,
    lateral (select case jsonb_typeof(q.f -> 'id') when 'string' then q.f ->> 'id' when 'number' then (q.f -> 'id')::text end as v) w
    where jsonb_typeof(q.f) = 'object' and v is not null and v <> ''
      and not (public._gallery_veil_str(q.f -> 'faction') = any(names) or public._gallery_veil_str(q.f -> 'name') = any(names)));
  srch := case when cardinality(wn) > 0 then public._gallery_veil_name_search(wn, names) end;
  if srch is not null or cardinality(wn_ids) > 0 then
    hits := case when srch is null then '{}'::jsonb
                 else public._gallery_veil_name_hits(jsonb_build_array(s #> '{powerStructure,conflicts}', s -> 'conflicts', s #> '{history,currentTensions}',
                                                                       s #> '{powerStructure,factions}', s -> 'factions', s -> 'npcs', s -> 'simulationTrace',
                                                                       -- R3-CURE-4 (unit 1): the same copies as `pub` held them, before any pass stripped them
                                                                       p #> '{powerStructure,conflicts}', p -> 'conflicts', p #> '{history,currentTensions}',
                                                                       public._gallery_veil_npc_copies(p -> 'npcs')), srch) end;
    foreach sd in array array['powerStructure', 'top'] loop
      pth := case when sd = 'top' then array['conflicts'] else array['powerStructure', 'conflicts'] end;
      if jsonb_typeof(s #> pth) = 'array' then
        -- R3-CURE-4 (unit 1; the chair, 11:12: "a husk is a tell"): a copy is ALSO judged on what it held before any pass
        -- stripped it: a served conflict leaves where a conflict of `pub`'s same list that names a withheld power holds it
        -- (`@>`: a remnant is held by what the sweep cut it from); _gallery_veil_copy_names, the one test for both
        hz := coalesce((select jsonb_agg(z) from jsonb_array_elements(case when jsonb_typeof(p #> pth) = 'array' then p #> pth else '[]' end) z
                         where public._gallery_veil_copy_names('conflict', z, wn_ids, hits)), '[]');
        s := jsonb_set(s, pth, coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> pth) with ordinality x(e, o)
          where not (public._gallery_veil_copy_names('conflict', e, wn_ids, hits)
                     or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(hz) z where z @> e)))), '[]'));
      end if;
    end loop;
    if jsonb_typeof(s #> '{history,currentTensions}') = 'array' then
      hz := coalesce((select jsonb_agg(z) from jsonb_array_elements(case when jsonb_typeof(p #> '{history,currentTensions}') = 'array' then p #> '{history,currentTensions}' else '[]' end) z
                       where public._gallery_veil_copy_names('tension', z, wn_ids, hits)), '[]');
      s := jsonb_set(s, '{history,currentTensions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{history,currentTensions}') with ordinality x(e, o)
        where not (public._gallery_veil_copy_names('tension', e, wn_ids, hits)
                   or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(hz) z where z @> e)))), '[]'));
    end if;
    foreach sd in array array['powerStructure', 'top'] loop
      pth := case when sd = 'top' then array['factions'] else array['powerStructure', 'factions'] end;
      if jsonb_typeof(s #> pth) = 'array' then
        s := jsonb_set(s, pth, (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'contestsNiche') = 'string'
                                                                   and public._gallery_veil_power_named(e -> 'contestsNiche', wn_ids, hits)
                                                              then e - 'contestsNiche' else e end order by o), '[]')
                                  from jsonb_array_elements(s #> pth) with ordinality x(e, o)));
      end if;
    end loop;
    if jsonb_typeof(s -> 'npcs') = 'array' then
      hg := coalesce((select jsonb_agg(jsonb_build_object('i', public._gallery_veil_id_text(pq -> 'id'), 'g', pq -> 'goal'))
                        from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq
                       where jsonb_typeof(pq) = 'object' and public._gallery_veil_copy_names('goal', pq -> 'goal', wn_ids, hits)), '[]');
      hm := coalesce((select jsonb_agg(jsonb_build_object('i', public._gallery_veil_id_text(pq -> 'id'), 'z', z))
                        from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq,
                             jsonb_array_elements(case when jsonb_typeof(pq -> 'memberships') = 'array' then pq -> 'memberships' else '[]' end) z
                       where jsonb_typeof(pq) = 'object' and public._gallery_veil_copy_names('member', z, wn_ids, hits)), '[]');
      s := jsonb_set(s, '{npcs}', (select coalesce(jsonb_agg(case when jsonb_typeof(n) <> 'object' then n else
          (n - (select coalesce(array_agg(k), '{}') from unnest(array['faction', 'factionAffiliation', 'affiliation', 'factionId']) k
                 where jsonb_typeof(n -> k) = 'string' and public._gallery_veil_power_named(n -> k, wn_ids, hits))
             -- (R3-CURE-4, unit 1: the goal leaves WHOLE where it names a withheld power now, or where the same person's goal
             -- in `pub` (by the person's id, a string) named one before the sweep stripped its sentence and its target id)
             - (case when jsonb_typeof(n -> 'goal') = 'object' and (public._gallery_veil_copy_names('goal', n -> 'goal', wn_ids, hits)
                   -- (R3-CURE-5, the chair 14:21: A GAP TOWARD SENDING: the person by its id AS TEXT for any scalar id, `->>`;
                   -- a person with no id, the empty string included, against every person of `pub`, where a naming goal holds it)
                   or exists (select 1 from jsonb_array_elements(hg) pq
                               where case when public._gallery_veil_id_text(n -> 'id') <> '' then (pq ->> 'i') = public._gallery_veil_id_text(n -> 'id')
                                          else (pq -> 'g') @> (n -> 'goal') end))
                then array['goal'] else '{}'::text[] end))
          || case when jsonb_typeof(n -> 'memberships') = 'array' then jsonb_build_object('memberships', (select coalesce(jsonb_agg(m order by mo), '[]')
               from jsonb_array_elements(n -> 'memberships') with ordinality y(m, mo)
              where not (public._gallery_veil_copy_names('member', m, wn_ids, hits)
                         or (jsonb_typeof(m) = 'object'
                             and exists (select 1 from jsonb_array_elements(hm) pz
                                          where (public._gallery_veil_id_text(n -> 'id') = '' or (pz ->> 'i') = public._gallery_veil_id_text(n -> 'id')) and (pz -> 'z') @> m))))) else '{}'::jsonb end
        end order by o), '[]') from jsonb_array_elements(s -> 'npcs') with ordinality x(n, o)));
    end if;
    -- R3-CURE-2 (found by the fold: "faction.thieves_guild" under Reveal DM): a simulation-trace entry a top-level string of
    -- which names a withheld power leaves whole; the trace renumbered dense after (VR21: the apply's own `ts` rule)
    if jsonb_typeof(s -> 'simulationTrace') = 'array' then
      nt := jsonb_array_length(s -> 'simulationTrace');
      s := jsonb_set(s, '{simulationTrace}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s -> 'simulationTrace') with ordinality x(e, o)
        where not (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_each(e) kv where public._gallery_veil_power_named(kv.value, wn_ids, hits) and jsonb_typeof(kv.value) = 'string'))), '[]'));
      if jsonb_array_length(s -> 'simulationTrace') < nt then
        s := jsonb_set(s, '{simulationTrace}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' and e ? 'ts' then jsonb_set(e, '{ts}', to_jsonb(o - 1)) else e end order by o), '[]')
                                                 from jsonb_array_elements(s -> 'simulationTrace') with ordinality x(e, o)));
      end if;
    end if;
  end if;

  -- R3-TELL-4 unit (i) (the chair's ruling 73 (2): WHAT NAMES OR DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN
  -- WOULD SERVE IT). registry: people.allegiance. A served person's `allegiance` ({power, house, ...}: allegiance.js ::
  -- dealAllegiances; a clean card carries none, and no nothing-hidden birth of the pool serves one) stays only BY POSITIVE
  -- ACCOUNT: an object whose `house` is the name of a house this read still lists and whose `power` is null, absent or the
  -- name of a power this read still serves (`names`, both served lists); else THE KEY leaves, the open place's form (ruling
  -- 47: no husk). A husk the name sweep left (its `house` taken) names no listed house, so it leaves (stated, not left to
  -- SQL's null: an absent `house` makes the test null, which would keep the husk). Twin:
  -- galleryRosterChoices.js :: applyRosterChoices, the same rule
  -- registry: people.allegiance
  if jsonb_typeof(s -> 'npcs') = 'array' then
    s := jsonb_set(s, '{npcs}', (select coalesce(jsonb_agg(case when jsonb_typeof(n) = 'object' and n ? 'allegiance'
        and not coalesce(jsonb_typeof(n -> 'allegiance') = 'object' and jsonb_typeof(n #> '{allegiance,house}') = 'string'
                 and (n #>> '{allegiance,house}') = any(array(select public._gallery_veil_str(h -> 'name')
                      from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) h
                     where jsonb_typeof(h) = 'object' and public._gallery_veil_str(h -> 'name') <> ''))
                 and (coalesce(jsonb_typeof(n #> '{allegiance,power}'), 'null') = 'null'
                      or (jsonb_typeof(n #> '{allegiance,power}') = 'string' and (n #>> '{allegiance,power}') = any(names))), false)
      then n - 'allegiance' else n end order by o), '[]') from jsonb_array_elements(s -> 'npcs') with ordinality x(n, o)));
  end if;

  -- the stored and the served house flags (economicState.safetyProfile.compound.inst, else economicState.compound.inst)
  fl := coalesce(case when jsonb_typeof(p #> '{economicState,safetyProfile,compound,inst}') = 'object' then p #> '{economicState,safetyProfile,compound,inst}' end,
                 case when jsonb_typeof(p #> '{economicState,compound,inst}') = 'object' then p #> '{economicState,compound,inst}' end, '{}');
  sfl := coalesce(case when jsonb_typeof(s #> '{economicState,safetyProfile,compound,inst}') = 'object' then s #> '{economicState,safetyProfile,compound,inst}' end,
                  case when jsonb_typeof(s #> '{economicState,compound,inst}') = 'object' then s #> '{economicState,compound,inst}' end, '{}');
  raised := (select jsonb_object_agg(k, not coalesce(sfl -> k = 'true'::jsonb, false) and not coalesce(fl -> k = 'false'::jsonb, false))
               from unnest(array['hasCriminalInst', 'hasSmuggling', 'hasThievesGuild', 'hasGangInfra', 'hasMarket']) k);
  -- R3-CURE (unit 3): a religious house hidden whole, where no served one stands, raised 'contested property' (safetyProfile.js)
  raised := raised || jsonb_build_object('religiousHouse',
    exists (select 1 from unnest(gone) g where g ~ '(church|cathedral|temple|monaster|friary|shrine|abbey|chapel)' and g !~ '^access to')
    and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                     where jsonb_typeof(e) = 'object' and public._gallery_veil_str(e -> 'name') ~* '(church|cathedral|temple|monaster|friary|shrine|abbey|chapel)'
                       and public._gallery_veil_str(e -> 'name') !~* '^access to'));
  -- R3-TELL-8 (TELL7 cause (f), TELL8 1f: the merchant-army hook's raiser is the engine's own stress flag): priorityHelpers.js ::
  -- getStressFlags raises merchantArmy on the priorities and fires(55), which read the config alone, AND (hasMerchantGuild or
  -- hasBank) AND (hasMercenary or hasGangInfra). A hidden house raised it where the record does not hold it false and the
  -- served flags (recomposed over the served houses, item C) no longer give the houses' half. Twin: the same rule
  raised := raised || jsonb_build_object('merchantArmy',
    coalesce(p #> '{economicState,safetyProfile,flags,merchantArmy}', 'null'::jsonb) <> 'false'::jsonb
    and not ((coalesce(sfl -> 'hasMerchantGuild' = 'true'::jsonb, false) or coalesce(sfl -> 'hasBank' = 'true'::jsonb, false))
             and (coalesce(sfl -> 'hasMercenary' = 'true'::jsonb, false) or coalesce(sfl -> 'hasGangInfra' = 'true'::jsonb, false))));
  beneath := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                      where jsonb_typeof(e) = 'object' and public._gallery_veil_str(e -> 'name') ~* 'smuggling (network|operation)|underground (network|city)');
  es := s -> 'economicState';

  -- R3-CURE-2 (unit 2, the chair's ruling 2: EVERY SERVED FIELD THAT FEEDS A DERIVED KEY IS RE-DERIVED OVER THE HOUSES THE
  -- READ SERVES, OR WITHHELD): (a) safety.criminalInstitutions, the operations list the Defense key reads
  -- (criminalStructureKey.js, `listed`): re-derived over the SERVED houses by the engine's own label table (`crimlabels`,
  -- safetyProfile.js's CRIMINAL_INST_LABELS), an entry kept, in order, only as many times as served houses carry its label
  -- (the hidden "Multiple criminal factions" wrote "Rival Gangs", which holds no house's name); (b) a covert criminal service
  -- (`institution` '(covert)', the key's covert rung), drawn from the criminal climate the houses moved
  -- (servicesGenerator.js), which no served field re-derives: withheld. R3-CURE-8 (ruling 55, the chair 16:45): (c) a
  -- criminal service with NO `institution` key (born without one, or left without one by the hidden-house name sweep): no
  -- served house accounts for it: withheld. Stated, not left to SQL's null: `e -> 'institution'` is null where the key is
  -- absent, and a null condition already took the row; the twin (galleryRosterChoices.js) now does the same
  if jsonb_typeof(s #> '{economicState,safetyProfile,criminalInstitutions}') = 'array' then
    s := jsonb_set(s, '{economicState,safetyProfile,criminalInstitutions}', coalesce((select jsonb_agg(e order by o) from (
        select e, o, row_number() over (partition by e order by o) as k
          from jsonb_array_elements(s #> '{economicState,safetyProfile,criminalInstitutions}') with ordinality x(e, o)) z
      where jsonb_typeof(e) = 'string'
        and k <= (select count(*) from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) h
                   where jsonb_typeof(h) = 'object'
                     and crimlabels ->> translate(public._gallery_veil_str(h -> 'name'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = (e #>> '{}'))), '[]'));
  end if;
  if jsonb_typeof(s #> '{availableServices,criminal}') = 'array' then
    s := jsonb_set(s, '{availableServices,criminal}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{availableServices,criminal}') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and (not (e ? 'institution') or e -> 'institution' = '"(covert)"'::jsonb))), '[]'));
    -- R3-TELL-5 unit (ii) (the chair's ruling 73 (2): WHAT DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN WOULD
    -- SERVE IT; ruling 74 (ii)): (e) BY POSITIVE ACCOUNT, a criminal services row stays only where its `institution` is the
    -- name of a house this read lists, or the tag of a crime type a shown house or a crisis raises (servicesGenerator.js
    -- writes each tag row from its type: `svctags`), the type kept by VR39's attribution over `pub`'s own list (the grouping
    -- that shuts the types does not shut the services: the house-free twin's row stands on its type, served or not). Every
    -- other row (the climate's '(lawless)' and '(informal)', drawn from the criminal climate the houses moved; a row that is
    -- not an object) leaves; what is left may be [] (VR29: the list stays a list; [] is an open place's form at every
    -- size). Twin: galleryRosterChoices.js :: applyRosterChoices, the same rule
    acc_types := array(select e ->> 'type'
                         from jsonb_array_elements(case when jsonb_typeof(p #> '{economicState,safetyProfile,crimeTypes}') = 'array' then p #> '{economicState,safetyProfile,crimeTypes}' else '[]' end) e
                        where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'type') = 'string' and raisers ? (e ->> 'type')
                          and not exists (select 1 from jsonb_array_elements_text(raisers -> (e ->> 'type')) fk where (raised -> fk) = 'true'::jsonb));
    s := jsonb_set(s, '{availableServices,criminal}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{availableServices,criminal}') with ordinality x(e, o)
      where jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'institution') = 'string'
        and ((e ->> 'institution') = any(array(select public._gallery_veil_str(h -> 'name')
                                                  from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) h
                                                 where jsonb_typeof(h) = 'object' and public._gallery_veil_str(h -> 'name') <> ''))
             or exists (select 1 from jsonb_array_elements_text(case when jsonb_typeof(svctags -> (e ->> 'institution')) = 'array' then svctags -> (e ->> 'institution') else '[]' end) t
                         where t = any(acc_types)))), '[]'));
  end if;
  -- R3-TELL-3 unit 4b (ruling 60, R3-CURE-8's STOP 1; the chair's word of 20:03 UTC): (d) A NON-CRIMINAL SERVICES ROW WHOSE
  -- `institution` NAMED A HIDDEN HOUSE LEAVES WHOLE (a husk, ruling 42 (1)): the name sweep takes the key only where its text
  -- names a hidden house in a spelling the fold finds, so a served row without the key whose pre-sweep counterpart in `pub`
  -- (the same family, `@>`) carried a string `institution` is such a row; a row born without the key, and one the sweep left,
  -- stay. Twin: galleryRosterChoices.js :: applyRosterChoices, the same rule
  if jsonb_typeof(s -> 'availableServices') = 'object' then
    s := jsonb_set(s, '{availableServices}', (select coalesce(jsonb_object_agg(kv.k, case when kv.k <> 'criminal' and jsonb_typeof(kv.v) = 'array' then
        coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(kv.v) with ordinality x(e, o)
                   where not (jsonb_typeof(e) = 'object' and not (e ? 'institution')
                              and exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p #> array['availableServices', kv.k]) = 'array' then p #> array['availableServices', kv.k] else '[]' end) z
                                           where jsonb_typeof(z) = 'object' and jsonb_typeof(z -> 'institution') = 'string' and z @> e))), '[]')
        else kv.v end), '{}'::jsonb) from jsonb_each(s -> 'availableServices') kv(k, v)));
  end if;

  -- registry: economy.complexity ((a): prosperity.js :: deriveEconomicComplexity over the SERVED rows: the tier, the income
  -- rows' count and shares, the exports' count, a served house whose name holds market, trading, merchant or guild, the
  -- food record; an input the ladder cannot read: withheld)
  if jsonb_typeof(es) = 'object' and es ? 'economicComplexity' then
    if jsonb_typeof(es -> 'tier') = 'string' and jsonb_typeof(es -> 'incomeSources') = 'array' and jsonb_typeof(es -> 'primaryExports') = 'array' then
      tier := es ->> 'tier';
      cnt := jsonb_array_length(es -> 'incomeSources');
      mkt := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e,
                            lateral (select public._gallery_veil_case_fold(public._gallery_veil_str(e -> 'name')) as n) h
                      where jsonb_typeof(e) = 'object' and (position('market' in h.n) > 0 or position('trading' in h.n) > 0 or position('merchant' in h.n) > 0 or position('guild' in h.n) > 0));
      if exists (select 1 from jsonb_array_elements(es -> 'incomeSources') r where jsonb_typeof(r -> 'percentage') = 'number' and (r ->> 'percentage')::numeric * 2 >= 100) then
        cnt := least(cnt, 5);
      elsif exists (select 1 from jsonb_array_elements(es -> 'incomeSources') r where jsonb_typeof(r -> 'percentage') = 'number' and (r ->> 'percentage')::numeric >= 20) then
        cnt := least(cnt, 8);
      end if;
      lbl := case when tier in ('metropolis', 'city') then case when cnt >= 9 then 'Highly diversified ' || chr(8212) || ' multiple major revenue streams'
                                                            when cnt >= 6 then 'Diversified ' || chr(8212) || ' broad institutional economic base'
                                                            else 'Concentrated ' || chr(8212) || ' fewer revenue streams than scale suggests' end
                  when tier = 'town' then case when mkt and cnt >= 6 then 'Diversified market economy'
                                               when cnt >= 4 then 'Specialized production and trade'
                                               else 'Limited ' || chr(8212) || ' narrow economic base for this scale' end
                  when tier = 'village' then case when mkt then 'Mixed subsistence and market'
                                                  when jsonb_array_length(es -> 'primaryExports') >= 4 then 'Agricultural surplus with trade links'
                                                  else 'Subsistence with minor surplus' end
                  when jsonb_array_length(es -> 'primaryExports') >= 3 then 'Subsistence with surplus'
                  else 'Subsistence ' || chr(8212) || ' survival economy' end;
      if public._gallery_veil_truthy(es #> '{foodSecurity,foodRecord}') and not public._gallery_veil_truthy(es #> '{foodSecurity,foodRecord,growsMoreThanEats}')
         and lbl ~* 'surplus' then
        lbl := 'Subsistence ' || chr(8212) || ' survival economy';
      end if;
      s := jsonb_set(s, '{economicState,economicComplexity}', to_jsonb(lbl));
    else
      s := s #- '{economicState,economicComplexity}';
    end if;
  end if;

  if jsonb_typeof(s #> '{economicState,safetyProfile}') = 'object' then
    -- registry: safety.economicDragDesc ((b): the line reads the black-market share, which moves with hasCriminalInst, the
    -- market flag and the organised crime the houses' names read (safetyProfile.js, factsOf(...).crime); withheld where a
    -- hidden house raised either flag or carried such a name; VR42: a criminal governing body moves none of them).
    -- R3-TELL-3 (ruling 62 (2)): SERVED AS null, the empty form nothing-hidden pages show; never deleted, never ''
    if (s #> '{economicState,safetyProfile}') ? 'economicDragDesc'
       and ((raised -> 'hasCriminalInst') = 'true'::jsonb or (raised -> 'hasMarket') = 'true'::jsonb
            or exists (select 1 from unnest(gone) g where position('thieves'' guild' in g) > 0 or position('thieves guild' in g) > 0
                         or position('multiple criminal' in g) > 0 or position('underground city' in g) > 0 or position('front business' in g) > 0)) then
      s := jsonb_set(s, '{economicState,safetyProfile,economicDragDesc}', 'null'::jsonb);
    end if;
    -- registry: safety.guardEffectivenessDesc ((a): safetyLineTruth.js :: gatesSmugglersLine for the served houses: where
    -- none moves goods beneath the walls, the twin, its force noun read back from the sentence)
    if not beneath and jsonb_typeof(s #> '{economicState,safetyProfile,guardEffectivenessDesc}') = 'string' then
      s := jsonb_set(s, '{economicState,safetyProfile,guardEffectivenessDesc}', to_jsonb(regexp_replace(s #>> '{economicState,safetyProfile,guardEffectivenessDesc}',
        ' The ([^.]+) keeps? the gates, but smugglers have ways in beneath the walls\.', ' Everyone comes and goes by the gates, so smugglers have to get past the \1.')));
    end if;
    -- registry: safety.safetyDesc ((a) the foothold word for the served houses, safetyLineTruth.js :: footholdWord; the Very
    -- Safe gates line, whose twin is resolved by the facts, and the criminal-governance line a hidden house raised: withheld)
    if jsonb_typeof(s #> '{economicState,safetyProfile,safetyDesc}') = 'string' then
      sd := s #>> '{economicState,safetyProfile,safetyDesc}';
      if (not beneath and position(' The guard keeps the gates, but smugglers have ways in beneath the walls.' in sd) > 0)
         or (position('The criminals are the government here.' in sd) > 0 and (raised -> 'hasCriminalInst') = 'true'::jsonb) then
        s := s #- '{economicState,safetyProfile,safetyDesc}';
      elsif position('organized crime has a limited foothold.' in sd) > 0
            and not coalesce(sfl -> 'hasCriminalInst' = 'true'::jsonb, false)
            and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                             where jsonb_typeof(e) = 'object' and (public._gallery_veil_str(e -> 'name') || ' ' || public._gallery_veil_str(e -> 'catalogId')) ~* 'thieves|criminal|gang|smuggler|fence|gambl') then
        s := jsonb_set(s, '{economicState,safetyProfile,safetyDesc}', to_jsonb(replace(sd, 'organized crime has a limited foothold.', 'organized crime has found no foothold.')));
      end if;
    end if;
    -- (R3-TELL-8: the crime list's attribution rule LEFT; the list is withheld on every read by _gallery_veil_withhold_always,
    -- and a rule here would only assure what no read sends: ruling 59)
    -- registry: safety.plotHooks ((b): a hook stays where it is of the pool and no flag that raises it was raised by a hidden
    -- house; a hook the pool does not hold: unsure, withheld)
    if jsonb_typeof(s #> '{economicState,safetyProfile,plotHooks}') = 'array' then
      s := jsonb_set(s, '{economicState,safetyProfile,plotHooks}', coalesce((select jsonb_agg(e order by o)
        from jsonb_array_elements(s #> '{economicState,safetyProfile,plotHooks}') with ordinality x(e, o)
       where jsonb_typeof(e) = 'string' and hooks ? (e #>> '{}')
         and not exists (select 1 from jsonb_array_elements_text(hooks -> (e #>> '{}')) fk where (raised -> fk) = 'true'::jsonb)), '[]'));
    end if;
  end if;

  -- the served crime signal (crimeSignal.js :: crimeSignalOf): a served power whose seat is criminal, a served criminal house
  crim_house := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'institutions') = 'array' then s -> 'institutions' else '[]' end) e
                         where jsonb_typeof(e) = 'object'
                           and (translate(public._gallery_veil_str(e -> 'category'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal'
                                or translate(public._gallery_veil_str(e -> 'priorityCategory'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal'));
  signal := crim_house or exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s #> '{powerStructure,factions}') = 'array' then s #> '{powerStructure,factions}' else '[]' end) e
                                   where jsonb_typeof(e) = 'object' and translate(public._gallery_veil_str(e -> 'category'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'criminal');
  -- R3-TELL-5b unit (iii) (the chair's ruling 73 (2); ruling 74 (iii)): WHERE THE SERVED CRIME SIGNAL IS FALSE (no criminal
  -- house and no criminal power this read serves), no served power (either list) and no relation carries `captureState`: the
  -- hall's birth seed on the governing row (hallCapture.js :: writeHallCapture) and a capture relation's rung
  -- (factionDynamics.js :: withCaptureRelations) leave, THE KEY only (the open place's form: no nothing-hidden page of the pool
  -- serves one without a criminal house or power, at any size; ruling 47: no husk). A criminal governing power (VR42) is a
  -- served criminal power: its row and its rung stay. criminalCaptureState is not touched here. Twin: galleryRosterChoices.js
  -- :: applyRosterChoices, the same rule
  -- registry: power.captureState
  if not signal then
    for pth in select v.p from (values (array['powerStructure', 'factions']), (array['factions']), (array['powerStructure', 'factionRelationships'])) v(p) loop
      if jsonb_typeof(s #> pth) = 'array' then
        s := jsonb_set(s, pth, (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' then e - 'captureState' else e end order by o), '[]')
                                  from jsonb_array_elements(s #> pth) with ordinality x(e, o)));
      end if;
    end loop;
  end if;
  -- registry: history.tension.crimeWave ((b): the crime_wave tension where the SERVED crime signal is false)
  if not signal and jsonb_typeof(s #> '{history,currentTensions}') = 'array' then
    s := jsonb_set(s, '{history,currentTensions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{history,currentTensions}') with ordinality x(e, o)
      where not (jsonb_typeof(e) = 'object' and e -> 'type' = '"crime_wave"'::jsonb)), '[]'));
  end if;
  -- registry: history.event.crimeWave ((b): an event of type crime_wave, and its timeline copy, where no served criminal house stands)
  if not crim_house then
    foreach sd in array array['historicalEvents', 'eventsTimeline'] loop
      if jsonb_typeof(s #> array['history', sd]) = 'array' then
        s := jsonb_set(s, array['history', sd], coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> array['history', sd]) with ordinality x(e, o)
          where not (jsonb_typeof(e) = 'object' and e -> 'type' = '"crime_wave"'::jsonb)), '[]'));
      end if;
    end loop;
  end if;
  -- registry: institutions.desc ((b): a description of a declared pair the roster-moved fact 'rival power' chose, withheld)
  if jsonb_typeof(s -> 'institutions') = 'array' then
    s := jsonb_set(s, '{institutions}', (select coalesce(jsonb_agg(case when jsonb_typeof(e) = 'object' and jsonb_typeof(e -> 'desc') = 'string' and (e ->> 'desc') = any(rival)
                                                                        then e - 'desc' else e end order by o), '[]')
                                           from jsonb_array_elements(s -> 'institutions') with ordinality x(e, o)));
  end if;
  -- registry: prose.criminal ((b): the criminal desk, composed from the crime key over the roster, by the house's eye)
  if jsonb_typeof(s #> '{publicProse,blocks}') = 'object' then
    s := jsonb_set(s, '{publicProse,blocks}', (s #> '{publicProse,blocks}') - 'defense:criminal');
  end if;
  return s;
end $$;
