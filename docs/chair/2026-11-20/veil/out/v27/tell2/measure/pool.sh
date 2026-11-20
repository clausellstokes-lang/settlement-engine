#!/bin/sh
# R3-TELL-2: THE POOL, ONE COMMAND (cached).   sh pool.sh <worktree> [pooldir=/var/tmp/v18/t2/pool-t2sig-2] [tpl=t2_tpl] [from=/var/tmp/v18/t2/pool-t2sig-1]
# PART A (ruling 54 (b)): 300 nothing-hidden births per size (village, town, city, metropolis), each read by the twin under
#   every setting (Reveal off/on x own, g:000..g:110, allOpen, off); every 10th also by the server (own, off). Where <from>
#   holds an earlier part A (four pool-shard*.json), its births are RE-READ whole (RV9_MODE=reread: no rejection, about a
#   third of the cost); else they are found afresh (RV9_MODE=pool: about 114 CPU-minutes, mostly rejected metropolises).
# PART B (ruling 58 1): 150 births per size that DO hold a hideable house, read under the settings that hide nothing they
#   hold (RV9_MODE=poolb). Files: <pooldir>/pool-shard<s>.json, poolb-shard<s>.json, meta.txt. Each part is skipped where its
#   done file holds four "rc=0" lines (the cache): delete doneA.txt / doneB.txt to rebuild. verify.sh re-checks it on a tree.
W=$1; D=${2:-/var/tmp/v18/t2/pool-t2sig-2}; T=${3:-t2_tpl}; F=${4:-/var/tmp/v18/t2/pool-t2sig-1}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $D
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_PROBE=$P/tell2.probe.jsx"
ok() { [ -f $D/$1 ] && [ "$(grep -c 'rc=0' $D/$1)" = 4 ]; }
{ echo "run $(date -u +%Y-%m-%dT%H:%M:%SZ)"; echo "tree $W at $(git -C $W rev-parse HEAD)"; sha256sum $P/tell2-signature.mjs $P/tell2.probe.jsx $W/src/domain/display/galleryVeil.js $W/src/domain/display/galleryRosterChoices.js $W/src/domain/display/criminalVeilSwitch.js $W/supabase/migrations/212_share_veil_later_cures.sql; } >> $D/meta.txt
cd $W
if ok doneA.txt; then echo "part A cached: $D"; else
  rm -f $D/doneA.txt; if [ "$(ls $F/pool-shard*.json 2>/dev/null | wc -l)" = 4 ]; then MODE="reread RV9_FROM_DIR=$F"; else MODE="pool RV9_TARGET=300 RV9_AUDIT=50"; fi
  echo "A start $(date -u +%Y-%m-%dT%H:%M:%SZ) mode $MODE" >> $D/meta.txt
  for s in 0 1 2 3; do (eval "$E RV9_SERVER_DB=t2_pool RV9_MODE=$MODE RV9_SERVER_SAMPLE=10 RV9_SHARD=$s/4 RV9_OUT=$D/pool-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs" > $D/pool-shard$s.log 2>&1; echo "shard $s rc=$?" >> $D/doneA.txt) & done; wait
  echo "A end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/meta.txt
fi
if ok doneB.txt; then echo "part B cached: $D"; else
  rm -f $D/doneB.txt; echo "B start $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/meta.txt
  for s in 0 1 2 3; do ($E RV9_MODE=poolb RV9_TARGET=150 RV9_SHARD=$s/4 RV9_OUT=$D/poolb-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $D/poolb-shard$s.log 2>&1; echo "shard $s rc=$?" >> $D/doneB.txt) & done; wait
  echo "B end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/meta.txt
fi
cat $D/doneA.txt $D/doneB.txt; ok doneA.txt && ok doneB.txt
