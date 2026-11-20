#!/bin/sh
# run.sh <probe> <log> : env RV6_SRC etc. given; GIT_* removed
for v in $(env | grep -o '^GIT_[A-Z_0-9]*'); do unset $v; done
export PGHOST=/var/tmp/rv7 PGUSER=postgres RV6_PGMOD=/var/tmp/v16/pgmod RV9_PROBE=$1
cd $RV6_SRC && npx vitest run --config /var/tmp/v16/rv10/vitest.config.mjs > $2 2>&1; echo "exit $?" >> $2
