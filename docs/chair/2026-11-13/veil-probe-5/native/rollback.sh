#!/bin/sh
# rollback.sh <tag> <supabase dir>: the exact rollback, native: r211 down -> = r210; down again -> = r210; 211 again -> = 211.
set -u; T=$1; M=$2; S=/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad; export PGHOST=/var/tmp/cv5 PGUSER=postgres
cat_() { psql -qAt -d $1 -f $S/nat/catalog.sql > $S/nat/cat.$T.$2.txt; }
cat_ r210 210; cat_ r211 211
psql -qd postgres -c "drop database if exists rb$T with (force)" -c "create database rb$T template r211" >/dev/null
DOWN=$(ls $M/rollback/211_*.down.sql)
psql -qd rb$T -1 -v ON_ERROR_STOP=1 -f $DOWN >/dev/null 2>$S/nat/rb.err || echo "down FAIL $(head -c 300 $S/nat/rb.err)"; cat_ rb$T down1
psql -qd rb$T -1 -v ON_ERROR_STOP=1 -f $DOWN >/dev/null 2>$S/nat/rb.err || echo "down2 FAIL $(head -c 300 $S/nat/rb.err)"; cat_ rb$T down2
sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $M/migrations/211_server_side_share_veil.sql > $S/nat/m211.$T.sql
psql -qd rb$T -1 -v ON_ERROR_STOP=1 -f $S/nat/m211.$T.sql >/dev/null 2>$S/nat/rb.err || echo "re-211 FAIL $(head -c 300 $S/nat/rb.err)"; cat_ rb$T up2
echo "catalogue lines: $(wc -l < $S/nat/cat.$T.210.txt)"
echo "down vs 210: $(diff $S/nat/cat.$T.210.txt $S/nat/cat.$T.down1.txt | grep -c '^[<>]')"
echo "down twice vs 210: $(diff $S/nat/cat.$T.210.txt $S/nat/cat.$T.down2.txt | grep -c '^[<>]')"
echo "211 again vs 211: $(diff $S/nat/cat.$T.211.txt $S/nat/cat.$T.up2.txt | grep -c '^[<>]')"
echo "control 210 vs 211: $(diff $S/nat/cat.$T.210.txt $S/nat/cat.$T.211.txt | grep -c '^[<>]')"
echo "_gallery_veil left after down: $(grep -c '_gallery_veil' $S/nat/cat.$T.down1.txt)"
