#!/bin/sh
# R3-TELL-2: THE CACHE STILL HOLDS on <worktree> (for the cure's runs).   sh verify.sh <worktree> <outdir> [pooldir=/var/tmp/v18/t2/pool-t2sig-2] [stride=10]
# Every <stride>-th cached pool birth (parts A and B) re-born on <worktree> and re-read by its twin under every setting, Reveal off and on;
# its signatures compared with the cache's. Exit 1 if any differs (the pool must then be rebuilt on that tree: pool.sh with
# a new <pooldir>).
W=$1; O=$2; D=${3:-/var/tmp/v18/t2/pool-t2sig-2}; ST=${4:-10}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/verify-done.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE RV6_SRC=$W RV9_PROBE=$P/tell2.probe.jsx RV9_MODE=verify RV9_POOL_DIR=$D RV9_VERIFY=$ST RV9_SHARD=$s/4 RV9_OUT=$O/verify-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/verify-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/verify-done.txt) & done; wait
node -e 'const fs=require("fs");const b=[0,1,2,3].flatMap(s=>JSON.parse(fs.readFileSync(process.argv[1]+"/verify-shard"+s+".json")).births);const bad=b.filter(x=>!x.same);console.log("verify: "+b.length+" cached births re-read, "+bad.length+" differ"+(bad.length?": "+bad.map(x=>x.seed+" "+x.diff.join(",")).join("; "):""));process.exit(bad.length||!b.length?1:0)' $O > $O/verify.txt; rc=$?; cat $O/verify.txt; exit $rc
