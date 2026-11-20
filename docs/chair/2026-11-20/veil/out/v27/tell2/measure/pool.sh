#!/bin/sh
# R3-TELL-2 unit 1: THE POOL, ONE COMMAND (cached).   sh pool.sh <worktree> [pooldir=/var/tmp/v18/t2/pool-t2sig-1] [target=300] [tpl=t2_tpl]
# Four shards of tell2.probe.jsx (RV9_MODE=pool) on <worktree>: at least <target> nothing-hidden births per size (village,
# town, city, metropolis), each read by the twin under every setting (Reveal off/on x own, g:000..g:110, allOpen, off); every
# 10th accepted birth also by the server (own, off). Writes <pooldir>/pool-shard<s>.json and meta.txt. Skips if
# <pooldir>/done.txt holds four "rc=0" lines (the cache): delete done.txt to rebuild. The cure's runs re-check the cache with
# verify.sh.
W=$1; D=${2:-/var/tmp/v18/t2/pool-t2sig-1}; TG=${3:-300}; T=${4:-t2_tpl}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $D
if [ -f $D/done.txt ] && [ "$(grep -c 'rc=0' $D/done.txt)" = 4 ]; then echo "pool cached: $D"; cat $D/done.txt; exit 0; fi
rm -f $D/done.txt
{ echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)"; echo "tree $W at $(git -C $W rev-parse HEAD)"; echo "target $TG"; sha256sum $P/tell2-signature.mjs $P/tell2.probe.jsx $W/src/domain/display/galleryVeil.js $W/src/domain/display/criminalVeilSwitch.js $W/supabase/migrations/212_share_veil_later_cures.sql; } > $D/meta.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=t2_pool RV9_PROBE=$P/tell2.probe.jsx RV9_MODE=pool RV9_TARGET=$TG RV9_SERVER_SAMPLE=10 RV9_AUDIT=50 RV9_SHARD=$s/4 RV9_OUT=$D/pool-shard$s.json npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $D/pool-shard$s.log 2>&1; echo "shard $s rc=$?" >> $D/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $D/meta.txt
cat $D/done.txt; [ "$(grep -c 'rc=0' $D/done.txt)" = 4 ]
