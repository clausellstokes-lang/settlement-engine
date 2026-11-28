#!/bin/sh
# U3R: the reds first, then the greens. Each line one mutex hold; rc and hour to /var/tmp/v56/runB.log.
set -u
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
H=/home/user/settlement-engine; T=/var/tmp/v56/tests; L=/var/tmp/v56/runB.log
mx() { W=$1; shift; (cd $H && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "cd $W && $E sh scripts/gate-tail.sh npx vitest run $*"); }
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S) $3" >> $L; }
for s in ${*:-u0r u0g r1 g1}; do case $s in
  # 662a9c207 proved: its own test RED on 2f849aa53's SQL and twin, GREEN on its own commit
  u0r) git -C $H show 662a9c207:tests/security/galleryCovertUnread.pglite.test.js > /home/user/wt/dsql/tests/security/galleryCovertUnread.pglite.test.js
       mx /home/user/wt/dsql tests/security/galleryCovertUnread.pglite.test.js > $T/u0r.log 2>&1; st u0r $? 2f849aa53; rm -f /home/user/wt/dsql/tests/security/galleryCovertUnread.pglite.test.js;;
  u0g) mx /home/user/wt/unread tests/security/galleryCovertUnread.pglite.test.js > $T/u0g.log 2>&1; st u0g $? 662a9c207;;
  # RED: my three test files on the base before (a)(b)(c) (662a9c207 = 2f849aa53 + (d))
  r1) for f in galleryCovertFrozen galleryMapCovert galleryCovertUnread; do cp /home/user/wt/u3rc/tests/security/$f.pglite.test.js $T/$f.mine.js; done
      cp /home/user/wt/u3rc/tests/security/galleryCovertFrozen.pglite.test.js /home/user/wt/unread/tests/security/
      cp /home/user/wt/unread/tests/security/galleryMapCovert.pglite.test.js $T/galleryMapCovert.base.js; cp /home/user/wt/unread/tests/security/galleryCovertUnread.pglite.test.js $T/galleryCovertUnread.base.js
      cp /home/user/wt/u3rc/tests/security/galleryMapCovert.pglite.test.js /home/user/wt/u3rc/tests/security/galleryCovertUnread.pglite.test.js /home/user/wt/unread/tests/security/
      mx /home/user/wt/unread tests/security/galleryCovertFrozen.pglite.test.js tests/security/galleryMapCovert.pglite.test.js tests/security/galleryCovertUnread.pglite.test.js > $T/r1.log 2>&1; st r1 $? 662a9c207+mytests
      git -C /home/user/wt/unread checkout -q -- tests/security/galleryMapCovert.pglite.test.js tests/security/galleryCovertUnread.pglite.test.js; rm -f /home/user/wt/unread/tests/security/galleryCovertFrozen.pglite.test.js;;
  g1) mx /home/user/wt/u3rc tests/security/galleryCovertFrozen.pglite.test.js tests/security/galleryMapCovert.pglite.test.js tests/security/galleryCovertUnread.pglite.test.js > $T/g1.log 2>&1; st g1 $? 5ab9caeb7;;
esac; done
echo "runB END $(date -u +%H:%M:%S)" >> $L
