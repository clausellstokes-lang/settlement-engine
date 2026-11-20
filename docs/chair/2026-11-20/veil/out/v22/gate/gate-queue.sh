#!/bin/sh
export PGHOST=/var/tmp/rv7 PGUSER=postgres
export REG=/var/tmp/v18/t-d1369/docs/chair/2026-11-19/veil/registry/registry.json
export RUL=/var/tmp/v18/t-d1369/docs/chair/2026-11-19/veil/registry/rulings.json
T=/var/tmp/v18/t-d1369; O=/var/tmp/v18/out/v22
sh /var/tmp/v18/run-differ-server2.sh $T $O/new-link 2 link $T 212 2
sh /var/tmp/v18/run-differ-server2.sh $T $O/master-gallery 1 gallery /home/user/wt/master 203+211+212 2
sh /var/tmp/v18/run-differ-server2.sh $T $O/master-link 1 link /home/user/wt/master 203+211+212 2
echo QDONE > $O/gate-queue.done
