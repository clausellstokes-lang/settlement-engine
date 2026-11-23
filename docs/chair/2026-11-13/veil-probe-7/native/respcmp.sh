#!/bin/sh
# respcmp.sh <out dir> <rows db> <template A> <template B> <tag> : the stored rows of <rows db> (settlements, saved_maps)
# copied into a clone of each template, triggers off, the two profiles named alike; every read of every share run on both; lines that differ.
set -u
OUT=$1; ROWS=$2; A=$3; B=$4; TAG=$5; NAT=$(cd "$(dirname "$0")" && pwd)
export PGUSER=postgres; mkdir -p $OUT
pg_dump -a --disable-triggers -t public.settlements -t public.saved_maps $ROWS > $OUT/rows.$TAG.sql
for t in $A $B; do
  psql -qd postgres -c "drop database if exists rc_$t with (force)" -c "create database rc_$t template $t" >/dev/null 2>&1
  psql -qd rc_$t -v ON_ERROR_STOP=1 -f $OUT/rows.$TAG.sql >/dev/null 2>$OUT/err.txt || echo "LOAD FAILED $t: $(head -c 300 $OUT/err.txt)"
  # each chain build draws its two profiles' display names at random, and the reads print them: name them alike
  psql -qd rc_$t -v ON_ERROR_STOP=1 -c "update public.profiles set external_name = 'Author' || left(id::text, 4)" >/dev/null 2>$OUT/err.txt || echo "NAMES FAILED $t"
  psql -qAt -d rc_$t -v ON_ERROR_STOP=1 -f $NAT/reads.sql > $OUT/reads.$TAG.$t.txt 2>$OUT/err.txt || echo "READS FAILED $t: $(head -c 300 $OUT/err.txt)"
done
rm -f $OUT/rows.$TAG.sql
echo "$TAG: rows of $ROWS ($(grep -c '^G|' $OUT/reads.$TAG.$A.txt) shares, $(grep -c '^M|' $OUT/reads.$TAG.$A.txt) maps, $(wc -l < $OUT/reads.$TAG.$A.txt) responses), $A against $B: $(diff $OUT/reads.$TAG.$A.txt $OUT/reads.$TAG.$B.txt | grep -c '^[<>]') lines differ"
