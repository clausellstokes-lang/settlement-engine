p='211.sql'; s=open(p).read()
old="""    when 'number' then case
      when public._gallery_veil_num_zero((j #>> '{}')::numeric) then '0'
      when public._gallery_veil_num_inf((j #>> '{}')::numeric) then case when (j #>> '{}')::numeric < 0 then '-Infinity' else 'Infinity' end
      when (j #>> '{}')::numeric = trunc((j #>> '{}')::numeric) and abs((j #>> '{}')::numeric) < 1e21
        then trunc((j #>> '{}')::numeric)::text
      else ((j #>> '{}')::float8)::text end"""
new="""    when 'number' then public._gallery_veil_numstr(j #>> '{}')"""
assert old in s; s=s.replace(old,new)
# numstr before jsstr
anchor="""-- String(v) of a JSON value"""
fn="""-- String(n) of a JSON number, as JavaScript spells the double it reads (the review's F2 (b)): the
-- shortest digits that read back to that double (PostgreSQL's float8 output with extra_float_digits
-- above zero is that same shortest form), laid out by Number::toString: plain from 1e-6 up to 1e21,
-- exponential outside it. An integer of at most 15 digits is that integer already. Zero, Infinity and
-- -Infinity come from the exact range tests, so no cast is asked of an out-of-range value (F3).
create or replace function public._gallery_veil_numstr(t text)
returns text language plpgsql immutable set search_path = public, pg_temp set extra_float_digits = 1 as $$
declare
  x numeric;
  f text;
  neg boolean;
  m text;
  e int := 0;
  digits text;
  k int;
  n int;
  lz int;
begin
  if t ~ '^-?[0-9]{1,15}$' then return t; end if;
  x := t::numeric;
  if public._gallery_veil_num_zero(x) then return '0'; end if;
  if public._gallery_veil_num_inf(x) then return case when x < 0 then '-Infinity' else 'Infinity' end; end if;
  f := (x::float8)::text;
  neg := left(f, 1) = '-';
  if neg then f := substr(f, 2); end if;
  m := split_part(f, 'e', 1);
  if position('e' in f) > 0 then e := split_part(f, 'e', 2)::int; end if;
  digits := split_part(m, '.', 1) || split_part(m, '.', 2);
  n := length(split_part(m, '.', 1)) + e;
  lz := length(digits) - length(ltrim(digits, '0'));
  digits := rtrim(ltrim(digits, '0'), '0');
  n := n - lz;
  if digits = '' then return '0'; end if;
  k := length(digits);
  if k <= n and n <= 21 then m := digits || repeat('0', n - k);
  elsif 0 < n and n <= 21 then m := left(digits, n) || '.' || substr(digits, n + 1);
  elsif -6 < n and n <= 0 then m := '0.' || repeat('0', -n) || digits;
  else m := left(digits, 1) || case when k > 1 then '.' || substr(digits, 2) else '' end
    || 'e' || case when n - 1 < 0 then '-' else '+' end || abs(n - 1)::text;
  end if;
  return case when neg then '-' else '' end || m;
end $$;

"""
assert anchor in s; s=s.replace(anchor, fn+anchor,1)
# event: first truthy of name, title, label
old="""    n := public._gallery_veil_or(c -> 'name', c -> 'title', c -> 'label');
    if n is not null then return 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(n)); end if;
    return null;"""
new="""    -- eventIdFor: the first TRUTHY of name, title and label (a falsy label is no name: the review's F2 (a))
    n := case when public._gallery_veil_truthy(c -> 'name') then c -> 'name'
              when public._gallery_veil_truthy(c -> 'title') then c -> 'title'
              when public._gallery_veil_truthy(c -> 'label') then c -> 'label' end;
    if n is not null then return 'event.' || public._gallery_veil_slug(public._gallery_veil_jsstr(n)); end if;
    return null;"""
assert old in s; s=s.replace(old,new)
old="""  if kind = 'npc' then return public._gallery_npc_key(c); end if;"""
new="""  if kind = 'npc' then return public._gallery_veil_npc_id(c); end if;"""
assert old in s; s=s.replace(old,new)
anchor="""-- The id the veil addresses a card by"""
fn="""-- galleryMemberKey (publicSafe.js), the npc's veil id and member key, as the client spells it:
-- String(id) when id is neither null nor absent and spells something, else npc.<snake(String(name || ''))>.
-- (092's _gallery_npc_key reads `->> 'id'`, which spells a number, an array or an object as jsonb does;
-- it keeps its one caller, the 093 splice, unchanged.)
create or replace function public._gallery_veil_npc_id(c jsonb)
returns text language sql immutable set search_path = public, pg_temp as $$
  select coalesce(nullif(case when coalesce(jsonb_typeof(c -> 'id'), 'null') <> 'null' then public._gallery_veil_jsstr(c -> 'id') end, ''),
    'npc.' || public._gallery_veil_lower(trim(both '_' from regexp_replace(
      case when public._gallery_veil_truthy(c -> 'name') then public._gallery_veil_jsstr(c -> 'name') else '' end, '[^a-zA-Z0-9]+', '_', 'g'))))
$$;

"""
assert anchor in s; s=s.replace(anchor, fn+anchor,1)
open(p,'w').write(s)
