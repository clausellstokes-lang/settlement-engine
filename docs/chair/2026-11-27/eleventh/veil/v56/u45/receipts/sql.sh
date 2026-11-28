#!/bin/sh
# U45B: 212 up, down, up on a fresh db from v27x211 (001..211), the catalogue (every public function's definition, volatility
# and grants) EQUAL after the down to before the up. Usage: sh sql.sh <tree> <tag>
T=$1; G=$2; D=u45b_sql_$G; O=/var/tmp/u45b/sql/$G; mkdir -p $O; export PGHOST=/var/tmp/rv7 PGUSER=postgres
cat_() { psql -Atq -d $D -c "select p.oid::regprocedure::text || ' ' || p.provolatile::text || ' ' || coalesce(p.proacl::text,'-') || ' ' || md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind = 'f' order by 1" > $1; }
dropdb --if-exists $D && createdb -T v27x211 $D || exit 9
cat_ $O/before.txt
psql -q -v ON_ERROR_STOP=1 -d $D -f $T/supabase/migrations/212_share_veil_later_cures.sql > $O/up1.txt 2>&1; u1=$?
cat_ $O/up.txt
psql -q -v ON_ERROR_STOP=1 -d $D -f $T/supabase/rollback/212_share_veil_later_cures.down.sql > $O/down.txt 2>&1; dn=$?
cat_ $O/after-down.txt
psql -q -v ON_ERROR_STOP=1 -d $D -f $T/supabase/migrations/212_share_veil_later_cures.sql > $O/up2.txt 2>&1; u2=$?
cmp -s $O/before.txt $O/after-down.txt; eq=$?
echo "sql $G tree=$(git -C $T rev-parse --short HEAD) up=$u1 down=$dn up=$u2 catalogue_after_down_equal=$([ $eq = 0 ] && echo yes || echo NO) functions before=$(wc -l < $O/before.txt) up=$(wc -l < $O/up.txt) after_down=$(wc -l < $O/after-down.txt)"
diff $O/before.txt $O/after-down.txt | head -5
grep -c . $O/up.txt >/dev/null; grep '_gallery_veil_stored_docs\|_gallery_veil(jsonb,jsonb,boolean,boolean,jsonb)' $O/up.txt | cut -c1-120
