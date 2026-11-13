#!/bin/sh
# COHERENCE-VEIL-7: 211 frozen at 333b33973 + 212, against the lane's 211 at 28f52b1e4, on LOCAL chains only.
#   rehearse7.sh <native dir> <lane migrations at 28f52b1e4> <new migrations dir> <new rollback dir> <out dir>
# The comparison is the lane's own (veil-probe-6/native/rehearse.sh: the review's chain.sh and catalog.sql: every
# function's signature, body, volatility, definer flag, settings, grants, owner, return type and full definition;
# relations; policies; default ACLs; triggers; constraints), plus every comment (comments.sql).
set -u
NAT=$1; LANE=$2; NEW=$3; RB=$4; OUT=$5
export PGUSER=postgres
mkdir -p $OUT; export TMPDIR=$OUT
F211=$NEW/211_server_side_share_veil.sql; M212=$(ls $NEW/212_*.sql); D212=$(ls $RB/212_*.down.sql); D211=$RB/211_server_side_share_veil.down.sql
cat_of() { { psql -qAt -d $1 -f $NAT/catalog.sql; psql -qAt -d $1 -f $NAT/comments.sql; } > $OUT/cat.$1.txt; }
apply() { psql -qd $1 -1 -v ON_ERROR_STOP=1 -f $2 >/dev/null 2>$OUT/err.txt || echo "FAILED $2 on $1: $(head -c 300 $OUT/err.txt)"; }
clone() { psql -qd postgres -c "drop database if exists $2 with (force)" -c "create database $2 template $1" >/dev/null 2>&1; }
d() { diff $OUT/cat.$1.txt $OUT/cat.$2.txt | grep -c '^[<>]'; }
helpers() { psql -qAt -d $1 -c "select count(*) || ' | ' || count(*) filter (where has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute')) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like '\_gallery\_veil%'"; }
echo "frozen 211: $(sha256sum < $F211 | cut -c1-64)"; echo "212: $(sha256sum < $M212 | cut -c1-64) $(basename $M212)"
echo "212 down: $(sha256sum < $D212 | cut -c1-64)"; echo "lane 211 at 28f52b1e4: $(sha256sum < $LANE/211_server_side_share_veil.sql | cut -c1-64)"
sh $NAT/chain.sh x210 210 $NEW >/dev/null
sh $NAT/chain.sh xl211 211 $LANE >/dev/null           # the release chain with the lane's 211 (28f52b1e4)
sh $NAT/chain.sh xf211 211 $NEW >/dev/null            # 001..210 + the frozen 211
sh $NAT/chain.sh xf212 212 $NEW >/dev/null            # 001..210 + the frozen 211 + 212
sh $NAT/chain.sh x203 203 $NEW >/dev/null             # production's ledger
clone x203 xp_l; apply xp_l $LANE/211_server_side_share_veil.sql          # 203 + the lane's 211
clone x203 xp_f; apply xp_f $F211                                         # 203 + the frozen 211 (the owner's pack)
clone xp_f xp_f212; apply xp_f212 $M212                                   # 203 + the frozen 211 + 212
for db in x210 xl211 xf211 xf212 x203 xp_l xp_f xp_f212; do cat_of $db; done
echo "(1) 001..210 + frozen 211 + 212, against 001..210 + the lane's 211: $(d xl211 xf212) lines differ"
echo "    control, 001..210 + frozen 211 alone against the lane's 211: $(d xl211 xf211)"
echo "(2) 203 + frozen 211 + 212, against 203 + the lane's 211: $(d xp_l xp_f212) lines differ"
echo "    control, 203 + frozen 211 alone against 203 + the lane's 211: $(d xp_l xp_f)"
clone xf212 xr1; apply xr1 $D212; cat_of xr1
echo "(3) 001..212, then 212's down file, against 001..211 (frozen): $(d xf211 xr1) lines differ"
apply xr1 $D212; cat_of xr1; echo "    212's down file a second time: $(d xf211 xr1)"
apply xr1 $M212; cat_of xr1; echo "    then 212 again, against 001..212: $(d xf212 xr1)"
clone xp_f212 xr2; apply xr2 $D212; cat_of xr2
echo "(4) 203 + frozen 211 + 212, then 212's down file, against 203 + frozen 211: $(d xp_f xr2) lines differ"
clone xf212 xr3; apply xr3 $D212; apply xr3 $D211; cat_of xr3
echo "(5) 001..212, then 212's down file and 211's, against 001..210: $(d x210 xr3) lines differ"
clone xp_f212 xr4; apply xr4 $D212; apply xr4 $D211; apply xr4 $NAT/unlisted203.sql; cat_of xr4
echo "(6) 203 + 211 + 212, then both down files and 203's get_unlisted_dossier (the review's 7.6), against 203: $(d x203 xr4) lines differ"
clone xf212 xi; apply xi $M212; cat_of xi
echo "(7) 001..212, then 212 again over itself: $(d xf212 xi) lines differ"
clone xp_f212 xi2; apply xi2 $M212; cat_of xi2; echo "    203 + 211 + 212, then 212 again: $(d xp_f212 xi2)"
clone xp_f212 rel; for f in $(ls $NEW | grep -E '^2(0[4-9]|1[0-2])_.*\.sql$' | sort); do sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $NEW/$f > $OUT/m.sql; apply rel $OUT/m.sql; done; cat_of rel
echo "(8) the release after an early 211 and 212: 203 + 211 + 212 + 204..212 in order, against 001..212: $(d xf212 rel) lines differ"
clone xp_f rel2; for f in $(ls $NEW | grep -E '^2(0[4-9]|1[0-2])_.*\.sql$' | sort); do sed -E 's/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/select 1/gI' $NEW/$f > $OUT/m.sql; apply rel2 $OUT/m.sql; done; cat_of rel2
echo "    the release after an early 211 alone: 203 + 211 + 204..212, against 001..212: $(d xf212 rel2) lines differ"
echo "(9) _gallery_veil helpers | callable by anon or authenticated: 203 + frozen 211: $(helpers xp_f); 203 + 211 + 212: $(helpers xp_f212); 001..212: $(helpers xf212); the lane's 211: $(helpers xl211)"
echo "    function comments (K rows) in 001..212: $(grep -c '^K|pg_proc' $OUT/cat.xf212.txt)"
