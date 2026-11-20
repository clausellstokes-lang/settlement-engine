#!/bin/sh
# VEIL-24: THE GATE THROUGH THE SERVER, ONE COMMAND THAT TAKES THE COMMIT (PART 25 section 4).
#   sh docs/chair/2026-11-20/veil/out/v24/probes/gate.sh <commit> [N]
# Exports <commit> to /var/tmp/v18/t-<commit>, links node_modules, and takes the FOUR readings (the gallery read and the
# party link; the new stored shape (the tree's own generator, chain 212) and master's (master's generator at
# /home/user/wt/master, detached at db832c892, chain 203+211+212 of the tree)), each against the tree's own registry.
# Outputs: /var/tmp/v18/out/v24/gate-<commit>/{new-gallery,new-link,master-gallery,master-link}/gate.txt (first line:
# registered | diffuse | rng-only | UNREGISTERED). Needs: the cluster at /var/tmp/rv7, /var/tmp/v18/run-differ-server2.sh,
# /var/tmp/v18/rv9 and /var/tmp/v18/pgmod (PART 25 section 4); run from the main checkout.
set -u
C=$(git rev-parse --short=9 "$1") || exit 2; N=${2:-2}
T=/var/tmp/v18/t-$C; O=/var/tmp/v18/out/v24/gate-$C
[ -d $T ] || { mkdir -p $T && git archive $C | tar -x -C $T && cp -al node_modules $T/node_modules; } || exit 2
[ -d /home/user/wt/master/node_modules ] || { git worktree add --detach /home/user/wt/master db832c892 && cp -al node_modules /home/user/wt/master/node_modules; } || exit 2
export PGHOST=/var/tmp/rv7 PGUSER=postgres
export REG=$T/docs/chair/2026-11-19/veil/registry/registry.json RUL=$T/docs/chair/2026-11-19/veil/registry/rulings.json
mkdir -p $O
sh /var/tmp/v18/run-differ-server2.sh $T $O/new-gallery $N gallery $T 212 2
sh /var/tmp/v18/run-differ-server2.sh $T $O/new-link $N link $T 212 2
sh /var/tmp/v18/run-differ-server2.sh $T $O/master-gallery 1 gallery /home/user/wt/master 203+211+212 2
sh /var/tmp/v18/run-differ-server2.sh $T $O/master-link 1 link /home/user/wt/master 203+211+212 2
for r in new-gallery new-link master-gallery master-link; do echo "$r: $(head -1 $O/$r/gate.txt)"; done | tee $O/readings.txt
