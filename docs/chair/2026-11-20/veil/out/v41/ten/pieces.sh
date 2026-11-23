#!/bin/sh
# V41-TEN: arm (i) on the cured tree, the 86 hidden-power documents in four pieces, each one process through the mutex (short).
O=/var/tmp/v18/out/v41/ten/cured; mkdir -p $O; : > $O/summary.txt
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree at $(git -C /home/user/wt/ten rev-parse HEAD) 212 $(sha256sum /home/user/wt/ten/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16) tpl v41_ten_2" >> $O/summary.txt
cd /home/user/wt/ten
for k in 0 1 2 3; do n=0
  while :; do n=$((n+1)); GATE_MUTEX_POLL_SECONDS=1 GATE_MUTEX_MAX_POLLS=3000 sh scripts/gate-mutex.sh --run -- env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE PGHOST=/var/tmp/rv7 RV6_SRC=/home/user/wt/ten RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=v41_ten_2 RV9_SERVER_DB=tn_cured_p$k RV9_PROBE=/var/tmp/v18/out/v41/ten/mask.probe.jsx RV9_STORED_DIR=/var/tmp/v18/stored/today/docs RV9_OUT_DIR=$O/p$k RV9_SEEDS=/var/tmp/v18/out/v41/ten/seeds-$k.txt RV9_SHARD=0/1 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/p$k.log 2>&1; r=$?; [ $r -ne 3 ] && break; done
  echo "piece $k rc=$r tries $n $(date -u +%H:%M:%S)" >> $O/summary.txt
done
echo END >> $O/summary.txt
