#!/bin/sh
# V43-PAGES: THE SMOKE AND THE COST, one mutex hold (sh scripts/gate-mutex.sh --run -- sh pages-cost.sh <worktree> <outroot> <tpl>)
# smoke: (F) the plan's first birth (with its server read), (N) the first hiding town; then the cost: (F) every 72nd birth
# (10, the server sample on each) and (N) every 19th hiding town (5), side by side, one shard each.
W=$1; R=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd)
PG_PICK=720 sh $P/pages.sh $W $R/smoke $T F 1 || { echo "SMOKE F FAILED"; exit 2; }
PG_PICK=92 sh $P/pages.sh $W $R/smoke $T N 1 || { echo "SMOKE N FAILED"; exit 2; }
(PG_PICK=72 sh $P/pages.sh $W $R/cost $T F 1; echo "cost F rc=$?" >> $R/cost-done.txt) &
(PG_PICK=19 sh $P/pages.sh $W $R/cost $T N 1; echo "cost N rc=$?" >> $R/cost-done.txt) &
wait; cat $R/cost-done.txt; [ "$(grep -c 'rc=0' $R/cost-done.txt)" = 2 ]
