#!/bin/sh
# V39-C2M M4 addendum: the build WITH the cloud path live (dummy, non-secret VITE_SUPABASE_* so saves.js :: supabaseSave and the composer are bundled), sourcemapped, scratch then base.
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE
O=/var/tmp/v18/out/v39/c2m
for T in scratch base; do
  [ $T = base ] && W=/home/user/wt/c2m-base || W=/home/user/wt/c2m-scratch
  cd $W
  while :; do sh /home/user/wt/c2m/scripts/gate-mutex.sh --run -- env VITE_SUPABASE_URL=https://example.supabase.co VITE_SUPABASE_ANON_KEY=dummy-anon node --max-old-space-size=4096 node_modules/vite/bin/vite.js build --sourcemap --outDir $O/dist-env-$T --emptyOutDir > $O/build-env-$T.log 2>&1; rc=$?; [ $rc -ne 3 ] && break; sleep 60; done
  echo "$T rc=$rc $(date -u +%H:%M:%S)" >> $O/envbuild.log
done
echo END >> $O/envbuild.log
