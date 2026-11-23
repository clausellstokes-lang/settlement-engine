#!/bin/sh
# COHERENCE-VEIL-6, item 3 (the fifth review's V5-7): the early deploy of today's 211, then this seat's 211, on LOCAL chains only.
#   rehearse.sh <review native dir> <master migrations> <old 211 file> <new migrations dir> <new down file> <out dir>
# Needs PGHOST of a local scratch cluster (unix socket, trust). Builds its own chains with the review's chain.sh and compares
# the review's catalogue (catalog.sql: functions with ACL, config, owner and definition; relations; policies; default ACLs;
# triggers; constraints).
set -u
NAT=$1; MASTER=$2; OLD211=$3; NEW=$4; DOWN=$5; OUT=$6
export PGUSER=postgres
mkdir -p $OUT; export TMPDIR=$OUT
cat_of() { psql -qAt -d $1 -f $NAT/catalog.sql > $OUT/cat.$1.txt; }
apply() { psql -qd $1 -1 -v ON_ERROR_STOP=1 -f $2 >/dev/null 2>$OUT/err.txt || echo "FAILED $2 on $1: $(head -c 300 $OUT/err.txt)"; }
clone() { psql -qd postgres -c "drop database if exists $2 with (force)" -c "create database $2 template $1" >/dev/null 2>&1; }
d() { diff $OUT/cat.$1.txt $OUT/cat.$2.txt | grep -c '^[<>]'; }
sh $NAT/chain.sh r203 203 $MASTER >/dev/null
sh $NAT/chain.sh r210 210 $NEW >/dev/null
sh $NAT/chain.sh r211 211 $NEW >/dev/null
sh $NAT/chain.sh r203new 203+211 $NEW >/dev/null
clone r203 r203old; apply r203old $OLD211
clone r203old r203oldnew; apply r203oldnew $NEW/211_server_side_share_veil.sql
for db in r203 r210 r211 r203new r203old r203oldnew; do cat_of $db; done
echo "(a) 203 + today's 211 + this 211, against 203 + this 211 alone: $(d r203oldnew r203new) lines differ"
echo "    control, 203 + today's 211 against 203 + this 211: $(d r203old r203new) lines differ"
clone r203new r203new2; apply r203new2 $NEW/211_server_side_share_veil.sql; cat_of r203new2
echo "(b) 203 + this 211, then this 211 again over itself: $(d r203new r203new2) lines differ"
clone r211 r2112; apply r2112 $NEW/211_server_side_share_veil.sql; cat_of r2112
echo "    001..211, then this 211 again over itself: $(d r211 r2112) lines differ"
for src in r203oldnew r203new; do
  clone $src rb_$src; apply rb_$src $DOWN; apply rb_$src $NAT/unlisted203.sql; cat_of rb_$src
  echo "(c) $src, then this down file and 203's get_unlisted_dossier (the review's 7.6), against 203: $(d r203 rb_$src) lines differ"
done
clone r211 rb_full; apply rb_full $DOWN; cat_of rb_full
echo "(d) 001..211, then this down file, against a chain at 210: $(d r210 rb_full) lines differ"
apply rb_full $DOWN; cat_of rb_full; echo "    the down file a second time: $(d r210 rb_full)"
apply rb_full $NEW/211_server_side_share_veil.sql; cat_of rb_full; echo "    then this 211 again, against 001..211: $(d r211 rb_full)"
echo "    control, 210 against 211: $(d r210 r211)"
clone r203old rel; for f in $(ls $NEW | grep -E '^2(0[4-9]|10)_.*\.sql$' | sort); do sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $NEW/$f > $OUT/m.sql; apply rel $OUT/m.sql; done
apply rel $NEW/211_server_side_share_veil.sql; cat_of rel
echo "(e) the release after the early deploy: 203 + today's 211 + 204..210 + this 211, against 001..211 in order: $(d r211 rel) lines differ"
psql -qAt -d r203oldnew -c "select count(*), count(*) filter (where has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute')) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like '\_gallery\_veil%'" | sed 's/^/(f) helpers | callable by readers, after the early deploy and this 211: /'
