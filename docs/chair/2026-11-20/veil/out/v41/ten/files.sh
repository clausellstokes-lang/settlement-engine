#!/bin/sh
# V41-TEN: each file of files.txt alone through the mutex (fast poll; exit 3 retried), one log each, a summary line each.
O=/var/tmp/v18/out/v41/ten/files; mkdir -p $O; : > $O/summary.txt
cd /home/user/wt/ten
while read f; do
  b=$(echo $f | tr '/' '_'); n=0
  while :; do n=$((n+1)); GATE_MUTEX_POLL_SECONDS=1 GATE_MUTEX_MAX_POLLS=3000 sh scripts/gate-mutex.sh --run -- env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE npx vitest run $f > $O/$b.log 2>&1; r=$?; [ $r -ne 3 ] && break; done
  echo "$f exit $r (tries $n) $(grep -E '^ +Tests ' $O/$b.log | tail -1)" >> $O/summary.txt
done < /var/tmp/v18/out/v41/ten/files.txt
echo END >> $O/summary.txt
