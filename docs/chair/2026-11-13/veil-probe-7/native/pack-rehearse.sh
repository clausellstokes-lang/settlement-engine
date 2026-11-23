#!/bin/sh
# pack-rehearse.sh <pack dir> <native dir> <out dir> : the owner's four files, in order, on LOCAL clones only
set -u
P=$1; NAT=$2; OUT=$3; export PGUSER=postgres; mkdir -p $OUT
clone() { psql -qd postgres -c "drop database if exists $2 with (force)" -c "create database $2 template $1" >/dev/null 2>&1; }
# psql's own exit status, never a pipe's: the output goes to a file first
run() { echo "--- $2 on $1"; psql -qAt -d $1 -v ON_ERROR_STOP=1 -f $P/$2 > $OUT/run.txt 2>&1; rc=$?; grep -v '^NOTICE' $OUT/run.txt; echo "psql exit $rc"; }
cat_of() { { psql -qAt -d $1 -f $NAT/catalog.sql; psql -qAt -d $1 -f $NAT/comments.sql; } > $OUT/cat.$1.txt; }
for base in xp_f xf211; do
  clone $base pk_$base
  echo "=== on a clone of $base"
  run pk_$base 1-read-first.sql
  run pk_$base 3-check-after.sql
  run pk_$base 2-apply-212.sql
  run pk_$base 3-check-after.sql
  run pk_$base 1-read-first.sql
  run pk_$base 4-rollback-ONLY-IF-NEEDED.sql
  cat_of pk_$base; cat_of $base
  echo "after the rollback, against $base: $(diff $OUT/cat.pk_$base.txt $OUT/cat.$base.txt | grep -c '^[<>]') lines differ"
  run pk_$base 1-read-first.sql
done
echo "=== the read-first block on 203 (211 not applied): it must say STOP"
clone x203 pk_203; run pk_203 1-read-first.sql
echo "=== the read-first block cannot write: a write planted inside it is refused"
sed 's/^rollback;$/create table public.pk_probe(x int);\nrollback;/' $P/1-read-first.sql > $OUT/rf-write.sql
psql -qAt -d pk_203 -f $OUT/rf-write.sql 2>&1 | grep -i 'read-only\|read only' | head -1
psql -qAt -d pk_203 -c "select count(*) from pg_class where relname = 'pk_probe'"
