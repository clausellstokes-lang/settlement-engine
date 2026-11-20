#!/bin/sh
export PGHOST=/var/tmp/rv7 PGUSER=postgres
T=/var/tmp/v18/t-56cad; O=/var/tmp/v18/out/v24/gate-dry
export REG=$T/docs/chair/2026-11-19/veil/registry/registry.json
export RUL=$T/docs/chair/2026-11-19/veil/registry/rulings.json
sh /var/tmp/v18/run-differ-server2.sh $T $O/new-link 2 link $T 212 2
echo QDONE > $O.done
