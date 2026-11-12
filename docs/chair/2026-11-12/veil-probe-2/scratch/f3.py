c1075, cinf = open('../consts.txt').read().split()
p='211.sql'; s=open(p).read()
old="""-- JS truthiness of a JSON value (absent, null, false, '' and 0 are falsy).
create or replace function public._gallery_veil_truthy(j jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select case jsonb_typeof(j)
    when 'string' then (j #>> '{}') <> ''
    when 'number' then (j #>> '{}')::numeric <> 0"""
new="""-- THE DOUBLE A JSON NUMBER IS (the review's F3). jsonb keeps any decimal; JavaScript reads the
-- nearest double, rounding half to even: zero at or below 2^-1075, Infinity at or past 2^1024 - 2^970.
-- Both are decided by exact numeric comparison, so no cast is ever asked of an out-of-range value.
create or replace function public._gallery_veil_num_zero(x numeric)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  -- 2^1075
  select abs(x) * C1075 <= 1
$$;
create or replace function public._gallery_veil_num_inf(x numeric)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  -- 2^1024 - 2^970
  select abs(x) >= CINF
$$;

-- JS truthiness of a JSON value (absent, null, false, '' and 0 are falsy; a number JS reads as zero is 0).
create or replace function public._gallery_veil_truthy(j jsonb)
returns boolean language sql immutable set search_path = public, pg_temp as $$
  select case jsonb_typeof(j)
    when 'string' then (j #>> '{}') <> ''
    when 'number' then not public._gallery_veil_num_zero((j #>> '{}')::numeric)""".replace('C1075', c1075).replace('CINF', cinf)
assert old in s; s=s.replace(old,new)
old="""    when 'number' then case
      when (j #>> '{}')::numeric = trunc((j #>> '{}')::numeric) and abs((j #>> '{}')::numeric) < 1e21
        then trunc((j #>> '{}')::numeric)::text
      else ((j #>> '{}')::float8)::text end"""
new="""    when 'number' then case
      when public._gallery_veil_num_zero((j #>> '{}')::numeric) then '0'
      when public._gallery_veil_num_inf((j #>> '{}')::numeric) then case when (j #>> '{}')::numeric < 0 then '-Infinity' else 'Infinity' end
      when (j #>> '{}')::numeric = trunc((j #>> '{}')::numeric) and abs((j #>> '{}')::numeric) < 1e21
        then trunc((j #>> '{}')::numeric)::text
      else ((j #>> '{}')::float8)::text end"""
assert old in s; s=s.replace(old,new)
open(p,'w').write(s)
