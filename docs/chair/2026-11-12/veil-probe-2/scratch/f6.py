import re
p='211.sql'; s=open(p).read()
def rep(old, new, count=1):
    global s
    assert s.count(old)==count, (s.count(old), old[:90])
    s=s.replace(old,new)
def block(start, end_marker='$$;\n'):
    i=s.index(start); j=s.index(end_marker, i)+len(end_marker); return s[i:j]
# 1. helpers carry no setting (an invoker's search_path setting stops PostgreSQL inlining it)
n_before = s.count('immutable set search_path = public, pg_temp as $$')
s = s.replace('immutable set search_path = public, pg_temp as $$', 'immutable as $$')
# 2. jsstr: the array join in its own function, so jsstr itself inlines
rep(block("create or replace function public._gallery_veil_jsstr(j jsonb)"),
"""create or replace function public._gallery_veil_jsstr(j jsonb)
returns text language sql immutable as $$
  select case jsonb_typeof(j)
    when 'string' then j #>> '{}'
    when 'number' then public._gallery_veil_numstr(j #>> '{}')
    when 'boolean' then j #>> '{}'
    when 'object' then '[object Object]'
    when 'array' then public._gallery_veil_join(j, ',')
    when 'null' then 'null'
    else '' end
$$;

-- Array.prototype.join(sep): a null element reads '', every other String(element).
create or replace function public._gallery_veil_join(j jsonb, sep text)
returns text language sql immutable as $$
  select coalesce(string_agg(case when jsonb_typeof(e) = 'null' then '' else public._gallery_veil_jsstr(e) end, sep order by o), '')
    from jsonb_array_elements(j) with ordinality x(e, o)
$$;
""")
rep("""          then (select coalesce(string_agg(case when jsonb_typeof(e) = 'null' then '' else public._gallery_veil_jsstr(e) end, '-' order by eo), '')
                  from jsonb_array_elements(p) with ordinality y(e, eo))""","""          then public._gallery_veil_join(p, '-')""")
# 3. card_id as one SQL expression (a constant kind folds it to its own branch)
rep(block("create or replace function public._gallery_veil_card_id(kind text, c jsonb)", "end $$;\n"),
"""create or replace function public._gallery_veil_card_id(kind text, c jsonb)
returns text language sql immutable as $$
  select case kind
    when 'npc' then public._gallery_veil_npc_id(c)
    -- entityIdFor: String(id || refId || slugifyEntity(name || label || 'institution'))
    when 'institution' then case
      when public._gallery_veil_truthy(c -> 'id') then public._gallery_veil_jsstr(c -> 'id')
      when public._gallery_veil_truthy(c -> 'refId') then public._gallery_veil_jsstr(c -> 'refId')
      when public._gallery_veil_truthy(c -> 'name') then public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'name'))
      when public._gallery_veil_truthy(c -> 'label') then public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'label'))
      else 'institution' end
    when 'faction' then case
      when public._gallery_veil_str(c -> 'faction') <> '' then 'faction.' || public._gallery_veil_snake(public._gallery_veil_str(c -> 'faction'))
      when public._gallery_veil_str(c -> 'name') <> '' then 'faction.' || public._gallery_veil_snake(public._gallery_veil_str(c -> 'name'))
      else public._gallery_veil_own_id(c, 'faction', jsonb_build_array(c -> 'name')) end
    -- eventIdFor: a string id, else the first TRUTHY of name, title and label (a falsy label is no
    -- name: the review's F2 (a)), else NULL (an anonymous legacy event, read fail-closed)
    when 'event' then case
      when public._gallery_veil_str(c -> 'id') <> '' then c ->> 'id'
      when public._gallery_veil_truthy(c -> 'name') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'name'))
      when public._gallery_veil_truthy(c -> 'title') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'title'))
      when public._gallery_veil_truthy(c -> 'label') then 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(c -> 'label'))
      end
    when 'tension' then public._gallery_veil_own_id(c, 'tension', jsonb_build_array(public._gallery_veil_or(c -> 'name', c -> 'title', c -> 'type')))
    when 'conflict' then public._gallery_veil_own_id(c, 'conflict', jsonb_build_array(c -> 'parties', c -> 'issue'))
    when 'relationship' then public._gallery_veil_own_id(c, 'relationship', jsonb_build_array(
      public._gallery_veil_or(c -> 'from', c -> 'npc1Name'), public._gallery_veil_or(c -> 'to', c -> 'npc2Name'), c -> 'type'))
  end
$$;
""")
# 4. the address grammar: one regular expression, the whole of parseVeilAddress; a JS length past 300
#    is possible only past 300 bytes (a UTF-16 unit is never fewer bytes than one)
rep(block("create or replace function public._gallery_veil_parse(a text)", "end $$;\n"),
"""create or replace function public._gallery_veil_parse(a text)
returns jsonb language sql immutable as $$
  select case
    when m is null then null
    when m[1] is not null then jsonb_build_object('type', m[1], 'id', m[2])
    when m[3] = 'class' then jsonb_build_object('type', 'class', 'kind', m[4], 'field', m[5])
    when m[3] = 'card' then jsonb_build_object('type', 'card', 'kind', m[4], 'id', m[5])
    else jsonb_build_object('type', 'field', 'kind', m[6], 'id', m[7], 'field', m[8]) end
  from (select case when a is null or (octet_length(a) > 300 and public._gallery_veil_jslen(a) > 300) then null
                    else regexp_match(a, '^(?:(tab|block):(.+)|(class|card):([^:]+):(.+)|field:([^:]+):(.+):([^:]+))$') end as m) q
$$;
""")
# 5. isHideable over a parsed address (the grammar is never run twice)
rep(block("create or replace function public._gallery_veil_hideable(a text)", "end $$;\n"),
"""create or replace function public._gallery_veil_hideable_p(p jsonb, a text)
returns boolean language sql immutable as $$
  select case
    when p is null then false
    when p ->> 'type' in ('field', 'class') then coalesce(
      not (public._gallery_veil_kinds() -> (p ->> 'kind') -> 'floor' ? (p ->> 'field'))
      and not coalesce((public._gallery_veil_kinds() -> (p ->> 'kind') -> 'fields' -> (p ->> 'field'))
                         ?| array(select jsonb_array_elements_text(public._gallery_veil_kinds() -> (p ->> 'kind') -> 'floor')), false), false)
    when p ->> 'type' = 'card' then p ->> 'kind' = 'institution'
    else a = any(public._gallery_veil_groupings()) end
$$;

create or replace function public._gallery_veil_hideable(a text)
returns boolean language sql immutable as $$
  select public._gallery_veil_hideable_p(public._gallery_veil_parse(a), a)
$$;
""")
# 6. the served marker's time: the same byte-first length test
rep("public._gallery_veil_jslen(overrides #>> '{$veil,at}') <= 40",
    "(octet_length(overrides #>> '{$veil,at}') <= 40 or public._gallery_veil_jslen(overrides #>> '{$veil,at}') <= 40)")
# 7. the resolver parses each address once and hands the applier its parts
i=s.index("  stored as (\n    select address, hidden, 1000000000 + ord as ord from (")
j=s.index("  return out;\nend $$;", i)
s=s[:i]+"""  stored as (
    select address, hidden, 1000000000 + ord as ord, p
      from (select address, hidden, ord, public._gallery_veil_parse(address) as p
              from (select * from stored_last order by ord desc offset 0) q offset 0) q2
     where p is not null
     limit 2000
  ),
  deltas as (
    select address, hidden, ord, jsonb_build_object('type', 'card', 'kind', 'npc', 'id', substr(address, 10)) as p from card_deltas
    union all select * from stored
  ),
  targets as (
    select tt.t, tt.pt, d.hidden, d.ord
      from deltas d, lateral (
        select 'field:' || (d.p ->> 'kind') || ':' || (d.p ->> 'id') || ':' || f as t,
               jsonb_build_object('type', 'field', 'kind', d.p ->> 'kind', 'id', d.p ->> 'id', 'field', f) as pt
          from jsonb_object_keys(coalesce(public._gallery_veil_kinds() -> (d.p ->> 'kind') -> 'fields', '{}')) f
         where d.p ->> 'type' = 'card' and d.p ->> 'kind' <> 'institution'
        union all
        select d.address, d.p where not (d.p ->> 'type' = 'card' and d.p ->> 'kind' <> 'institution')
      ) tt
     where public._gallery_veil_hideable_p(tt.pt, tt.t)
  ),
  last as (select distinct on (t) t, pt, hidden from targets order by t, ord desc),
  hidden as (
    select d.a, d.p from (select a, public._gallery_veil_parse(a) as p from defaults offset 0) d
     where public._gallery_veil_hideable_p(d.p, d.a) and d.a not in (select t from last where not hidden)
    union
    select t, pt from last where hidden
  )
  select jsonb_build_object(
    'groupings', coalesce((select jsonb_agg(a order by a collate "C") from hidden where p ->> 'type' in ('tab', 'block')), '[]'),
    'cards', coalesce((select jsonb_object_agg(p ->> 'id', true) from hidden where p ->> 'type' = 'card'), '{}'),
    'classes', coalesce((select jsonb_object_agg(k, fs) from (
        select p ->> 'kind' as k, jsonb_agg(distinct p ->> 'field') as fs from hidden where p ->> 'type' = 'class' group by 1) q), '{}'),
    'fields', coalesce((select jsonb_object_agg(k, ids) from (
        select k, jsonb_object_agg(i, fs) as ids from (
          select p ->> 'kind' as k, p ->> 'id' as i, jsonb_agg(distinct p ->> 'field') as fs from hidden
           where p ->> 'type' = 'field' group by 1, 2) q1 group by 1) q2), '{}'),
    'exc', coalesce((select jsonb_object_agg(t, true) from last where not hidden and t like 'field:%'), '{}'))
    into out;
"""+s[j:]
rep("""-- {hidden: [...], except: [...]}, or NULL for an unmarked share read as a listing (the page is
-- unchanged). `link`: the party link's R4 — an unmarked share takes the default veil.""",
"""-- The effective veil, already parsed for the applier: {groupings: [tab/block addresses, sorted],
-- cards: {institution id: true}, classes: {kind: [field]}, fields: {kind: {id: [field]}}, exc:
-- {field address: true}} (each address is parsed ONCE, by one regular expression). NULL for an
-- unmarked share read as a listing (the page is unchanged). `link`: the party link's R4 — an unmarked
-- share takes the default veil.""")
# 8. the applier takes the parts
i=s.index("create or replace function public._gallery_veil_apply(pub jsonb, hidden jsonb, exc jsonb)")
j=s.index("  -- X-21e: a card-hidden house goes whole only when the data puts it in the class.", i)
s=s[:i]+"""create or replace function public._gallery_veil_apply(pub jsonb, res jsonb)
returns jsonb language plpgsql immutable as $$
declare
  s jsonb := case when jsonb_typeof(pub) = 'object' then pub else '{}'::jsonb end;
  excj jsonb := coalesce(res -> 'exc', '{}');
  groupings text[] := array(select jsonb_array_elements_text(coalesce(res -> 'groupings', '[]')));
  card_hides jsonb := coalesce(res -> 'cards', '{}');
  classes jsonb := coalesce(res -> 'classes', '{}');
  fields jsonb := coalesce(res -> 'fields', '{}');
  gone_ids jsonb := '{}';
  gone_houses jsonb := '{}';
  services_of jsonb;
  people_of jsonb := '{}';
  kind text;
  g text;
begin
"""+s[j:]
rep("""    'body', public._gallery_veil_apply(pub, res -> 'hidden', res -> 'except'),
    'groupings', coalesce((select jsonb_agg(a order by a collate "C") from jsonb_array_elements_text(res -> 'hidden') a
                            where a like 'tab:%' or a like 'block:%'), '[]'));""","""    'body', public._gallery_veil_apply(pub, res),
    'groupings', res -> 'groupings');""")
open(p,'w').write(s); open('211.f6.sql','w').write(s)
print('helpers unpinned:', n_before)
