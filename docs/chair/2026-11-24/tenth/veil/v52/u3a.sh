#!/bin/sh
# VEIL-52 unit 3, the merge's proofs on lane/veil-52-2026-11-24-dsql-wip (/home/user/wt/dsql): (R) galleryServerVeil with the
# member-vs-link arm PLAIN (red expected under R4-IDS: every person id differs), (G) the FOLDED arm and the map files, (L) tests/lint
# whole. One mutex hold per line; rc and hour to /var/tmp/v52/log/u3.log; logs /var/tmp/v52/u3/.
W=/home/user/wt/dsql; U=/var/tmp/v52/u3; L=/var/tmp/v52/log/u3.log; F=tests/security/galleryServerVeil.pglite.test.js
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "cd $W && $E sh scripts/gate-tail.sh npx vitest run $*"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S) $(git -C $W rev-parse --short HEAD)" >> $L; }
for s in ${*:-R G L}; do case $s in
  R) cp $U/gsv.plain.js $W/$F; mx $F > $U/R.log 2>&1; r=$?; cp $U/gsv.folded.js $W/$F; st R $r;;
  G) cp $U/gsv.folded.js $W/$F; mx $F tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryMapCovert.pglite.test.js tests/security/galleryImportEqualsRead.pglite.test.js > $U/G.log 2>&1; st G $?;;
  L) (cd /home/user/settlement-engine && git fetch -q origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD); mx tests/lint > $U/L.log 2>&1; st L $?;;
esac; done
echo "u3a END $(date -u +%H:%M:%S)" >> $L
