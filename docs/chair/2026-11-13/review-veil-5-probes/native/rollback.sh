#!/bin/sh
# REVIEW-VEIL-5 — the rollback of 211, exact both ways, on local chains (templates t203, t210, t211, t203p211 built by chain.sh).
#   (1) full chain:  211 -> down file            == a chain at 210;   then 211 again == the chain at 211
#   (2) 211 ALONE:   203+211 -> down file + 203's get_unlisted_dossier == a chain at 203; then 211 again == 203+211
# The catalogue compared is native/catalog.sql (functions with ACL, config, owner and definition md5; relations; policies;
# default ACLs; triggers; constraints).
set -u
HERE=$(cd "$(dirname "$0")" && pwd); DOWN=$1; UP=$2; OUT=${3:-/var/tmp}
export PGHOST=${PGHOST:-/var/tmp/rv5} PGUSER=postgres
cat_of() { psql -qAt -d $1 -f $HERE/catalog.sql > $OUT/cat.$2.txt; }
clone() { psql -qd postgres -c "drop database if exists $2 with (force)" -c "create database $2 template $1" >/dev/null 2>&1; }
for t in t203 t210 t211 t203p211; do cat_of $t $t; done
clone t211 rb_full; psql -qd rb_full -1 -v ON_ERROR_STOP=1 -f $DOWN >/dev/null 2>$OUT/rb.err || echo "DOWN FAILED (full): $(head -c 300 $OUT/rb.err)"
cat_of rb_full full.down; echo "(1) full chain, after the down file, lines differing from 210: $(diff $OUT/cat.t210.txt $OUT/cat.full.down.txt | grep -c '^[<>]')"
psql -qd rb_full -1 -v ON_ERROR_STOP=1 -f $DOWN >/dev/null 2>$OUT/rb.err || echo "DOWN TWICE FAILED: $(head -c 300 $OUT/rb.err)"
cat_of rb_full full.down2; echo "    the down file a second time: $(diff $OUT/cat.t210.txt $OUT/cat.full.down2.txt | grep -c '^[<>]')"
psql -qd rb_full -1 -v ON_ERROR_STOP=1 -f $UP >/dev/null 2>$OUT/rb.err || echo "UP FAILED: $(head -c 300 $OUT/rb.err)"
cat_of rb_full full.up; echo "    211 again, lines differing from the chain at 211: $(diff $OUT/cat.t211.txt $OUT/cat.full.up.txt | grep -c '^[<>]')"
echo "    control, 210 against 211: $(diff $OUT/cat.t210.txt $OUT/cat.t211.txt | grep -c '^[<>]')"
clone t203p211 rb_alone; psql -qd rb_alone -1 -v ON_ERROR_STOP=1 -f $DOWN >/dev/null 2>$OUT/rb.err || echo "DOWN FAILED (alone): $(head -c 300 $OUT/rb.err)"
cat_of rb_alone alone.down; echo "(2) 211 alone, after the down file ONLY, lines differing from 203: $(diff $OUT/cat.t203.txt $OUT/cat.alone.down.txt | grep -c '^[<>]')  ($(diff $OUT/cat.t203.txt $OUT/cat.alone.down.txt | grep '^[<>]' | cut -d'|' -f2 | sort -u | tr '\n' ' '))"
psql -qd rb_alone -1 -v ON_ERROR_STOP=1 -f $HERE/unlisted203.sql >/dev/null 2>$OUT/rb.err || echo "203 BODY FAILED: $(head -c 300 $OUT/rb.err)"
cat_of rb_alone alone.down203; echo "    then 203's get_unlisted_dossier: $(diff $OUT/cat.t203.txt $OUT/cat.alone.down203.txt | grep -c '^[<>]')"
psql -qd rb_alone -1 -v ON_ERROR_STOP=1 -f $UP >/dev/null 2>$OUT/rb.err || echo "UP FAILED (alone): $(head -c 300 $OUT/rb.err)"
cat_of rb_alone alone.up; echo "    211 again, lines differing from 203+211: $(diff $OUT/cat.t203p211.txt $OUT/cat.alone.up.txt | grep -c '^[<>]')"
echo "    control, 203 against 203+211: $(diff $OUT/cat.t203.txt $OUT/cat.t203p211.txt | grep -c '^[<>]')"
