#!/bin/sh
# PG: the V29 measure on both pools, this tree's shared read (one run, two pools in sequence)
cd /home/user/settlement-engine
for p in today master; do
  env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE SRC=/home/user/settlement-engine POOL=/var/tmp/v56/stored-$p OUT=/var/tmp/v56/measure-$p.json RV9_PROBE=/tmp/claude-0/-home-user-settlement-engine/3b32812f-8690-58d1-8200-dbc26569488b/scratchpad/probe/measure.probe.jsx npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > /var/tmp/v56/measure-$p.log 2>&1; echo "pool $p rc=$?" >> /var/tmp/v56/measure.done
done
