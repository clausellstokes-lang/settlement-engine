#!/bin/sh
# run-plants.sh <scratch copy of the tree>: each plant as migration 214 in the COPY, the walker run alone, its verdict.
W=$1; HERE=$(cd "$(dirname "$0")" && pwd)
for p in $HERE/P*.sql; do
  n=$(basename $p .sql); cp $p $W/supabase/migrations/214_rg1_plant.sql
  (cd $W && npx vitest run tests/security/functionGrantsWalker.pglite.test.js > /var/tmp/rg1/w/walker-$n.log 2>&1); e=$?
  echo "$n exit=$e $(grep -E '^ +Tests ' /var/tmp/rg1/w/walker-$n.log | tr -s ' ')"
  grep -E "^ +(×|✗)|FAIL " /var/tmp/rg1/w/walker-$n.log | sed 's/^ *//' | sort -u | head -6 | cut -c1-170
  rm -f $W/supabase/migrations/214_rg1_plant.sql
done
