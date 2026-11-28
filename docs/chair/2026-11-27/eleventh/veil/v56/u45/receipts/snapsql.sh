#!/bin/sh
# U45B TERM (b) SNAPSHOT PLANT, THE SERVER, AT THE REAL DOORS: a fresh db from v27x211 + <tree>'s 212; the live row (Craft
# Guilds hand-hidden) stored twice, in snapshot mode (its frozen copy the client's projection) and in live mode; the gallery
# read and the party link read as anon. Usage: sh snapsql.sh <tree> <prepdir> <dbname>
T=$1; P=$2; D=$3; export PGHOST=/var/tmp/rv7 PGUSER=postgres
dropdb --if-exists $D && createdb -T v27x211 $D && psql -q -v ON_ERROR_STOP=1 -d $D -f $T/supabase/migrations/212_share_veil_later_cures.sql >/dev/null || { echo "212 apply failed"; exit 2; }
{ printf '\\set live `cat %s/live.json`\n\\set ovs `cat %s/ov-snap.json`\n\\set ovl `cat %s/ov-live.json`\n' $P $P $P; cat <<'SQL'
insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing;
insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing;
update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';
insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
  values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Snap', (:'live'::jsonb) ->> 'tier', :'live'::jsonb, true, 'u45b-snap', now(), 'u45b-snap-link', 'unlisted', :'ovs'::jsonb, false, true),
         (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Live', (:'live'::jsonb) ->> 'tier', :'live'::jsonb, true, 'u45b-live', now(), 'u45b-live-link', 'unlisted', :'ovl'::jsonb, false, true);
set role anon;
select 'gallery ' || q.slug as door,
       (select coalesce(case when f ? 'desc' then 'SERVED (names Craft Guilds: ' || ((f ->> 'desc') ~* 'craft guild')::text || ')' else 'WITHHELD' end, 'NO ROW')
          from jsonb_array_elements(g.data #> '{powerStructure,factions}') f where coalesce(f ->> 'name', f ->> 'faction') = 'The Trade Compact') as trade_compact_desc,
       (select count(*) from jsonb_array_elements(g.data #> '{powerStructure,factions}') f where coalesce(f ->> 'name', f ->> 'faction') = 'Craft Guilds') as craft_rows
  from (values ('u45b-snap'), ('u45b-live')) q(slug) left join lateral public.get_gallery_dossier(q.slug) g on true;
select 'link ' || q.slug as door,
       (select coalesce(case when f ? 'desc' then 'SERVED (names Craft Guilds: ' || ((f ->> 'desc') ~* 'craft guild')::text || ')' else 'WITHHELD' end, 'NO ROW')
          from jsonb_array_elements(g.j #> '{dossier,powerStructure,factions}') f where coalesce(f ->> 'name', f ->> 'faction') = 'The Trade Compact') as trade_compact_desc
  from (values ('u45b-snap-link'), ('u45b-live-link')) q(slug) left join lateral (select public.get_unlisted_dossier(q.slug) as j) g on true;
reset role;
SQL
} | psql -q -v ON_ERROR_STOP=1 -d $D
echo "snapsql rc=$?"
