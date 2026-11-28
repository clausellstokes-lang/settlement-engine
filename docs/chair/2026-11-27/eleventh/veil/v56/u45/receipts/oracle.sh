#!/bin/sh
# U45B V27 (5): the writer oracle, RED FIRST on the pre-N2b tree (99e9fa43a + the arm), then GREEN on 535c7e956 + the arm
O=/var/tmp/u45b/v275; mkdir -p $O; P=/var/tmp/v51/out/p1/stored-today:/var/tmp/v51/out/p1/stored-master; MT=/home/user/wt/master
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
for k in red:/home/user/wt/u45red green:/home/user/wt/u45b; do n=${k%%:*}; t=${k#*:}; cd $t; rm -f $O/$n.txt
  $E GATE_MUTEX_MAX_POLLS=1000000 STANDWALK_POOLS=$P STANDWALK_MASTER_TREE=$MT STANDWALK_MEASURES=$O/$n.txt sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/standingFormsTotality.walker.test.js > $O/$n.log 2>&1; echo "rc=$? $(date -u +%T) tree $(git rev-parse --short HEAD)" >> $O/$n.log
done
