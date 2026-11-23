#!/bin/sh
export PGHOST=/var/tmp/rv7 PGUSER=postgres
until grep -q ALLDONE /var/tmp/v18/out/master-gallery/done.txt 2>/dev/null; do sleep 10; done
sh /var/tmp/v18/run-differ-server2.sh /var/tmp/v18/base /var/tmp/v18/out/base-link 2 link /var/tmp/v18/base 212
sh /var/tmp/v18/run-differ-server2.sh /var/tmp/v18/base /var/tmp/v18/out/master-link 1 link /home/user/wt/master 203+211+212
echo QDONE > /var/tmp/v18/out/queue.done
