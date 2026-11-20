#!/bin/sh
# salt.sh <db> <slug>: the catalogue arm, then 10 executions of one prepared read in ONE session (7 default, 3 forced generic)
export PGHOST=/var/tmp/rv7 PGUSER=postgres
psql -qd "$1" -v slug="$2" -f /var/tmp/v16/rv11/salt.sql 2>&1 | sed -n '1,200p' | grep -v '^$' | head -80
{ echo "set role anon;"; echo "prepare rd(text) as select md5(coalesce((select string_agg(n->>'id', ',' order by o) from jsonb_array_elements(data->'npcs') with ordinality x(n,o)),'')) from public.get_gallery_dossier(\$1);";
  for i in 1 2 3 4 5 6 7; do echo "execute rd('$2');"; done; echo "set plan_cache_mode = force_generic_plan;"; for i in 1 2 3; do echo "execute rd('$2');"; done; } | psql -qAt -d "$1" > /var/tmp/v16/rv11/salt-ids.txt 2>&1
echo "== 10 prepared reads: $(wc -l < /var/tmp/v16/rv11/salt-ids.txt) lines, $(sort -u /var/tmp/v16/rv11/salt-ids.txt | wc -l) distinct (must be 10 of 10)"
