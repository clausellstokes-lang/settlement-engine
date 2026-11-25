#!/bin/sh
# VEIL-51's MACHINE RESTORE (the chair's efficiency rule (5), 2026-11-25): run after a container restart, or on a fresh box.
# Idempotent. Every database LOCAL (socket /var/tmp/rv7). Prints what it found and what it did.
set -u
R=/home/user/settlement-engine; V=$R/docs/chair/2026-11-20/veil/out
export PGHOST=/var/tmp/rv7 PGUSER=postgres
# 1. the cluster: start it if it is down (a restart leaves it down); make it from scratch only if its data dir is gone
if [ -d /var/tmp/v18pg ]; then
  psql -Atc 'select 1' >/dev/null 2>&1 || { mkdir -p /var/tmp/v18log; su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"; }
else
  echo "NO CLUSTER: run make-instruments (VEIL-50's recipe): cd <tree> && sh scripts/gate-mutex.sh --run -- sh $V/v28/seated/make-instruments.sh <tree> /var/tmp/v51/out/seated"; exit 2
fi
for t in v27x211 v28tpl v51_c2; do printf '%s ' "$t"; psql -Atc "select count(*) from pg_database where datname='$t'"; done
# 2. the stale gate lock (a dead PID): gate-mutex reclaims it by itself; reported only
[ -f /tmp/settlementforge-vitest-gate.0.lock/pid ] && { p=$(cat /tmp/settlementforge-vitest-gate.0.lock/pid); kill -0 "$p" 2>/dev/null && echo "lock held by live $p" || echo "lock stale ($p): reclaimed on the next --run"; }
# 3. the trees (detached worktrees of the commits named in the hand-back), re-made if gone; node_modules linked
cd $R
mk() { [ -d "$1" ] || { git worktree add --detach "$1" "$2" >/dev/null 2>&1 && echo "made $1 at $2"; }; [ -e "$1/node_modules" ] || ln -s $R/node_modules "$1/node_modules"; }
mk /home/user/wt/i42 d71a3ee44; mk /home/user/wt/i43 b126c9813; mk /home/user/wt/master db832c892; mk /home/user/wt/r5d aa54a6791
[ -d /home/user/wt/r5desc ] || echo "CODE TREE MISSING: git worktree add /home/user/wt/r5desc lane/veil-51-2026-11-24-r5desc-wip (local branch; if gone, re-make it by the hand-back's merge plan M)"
# 4. the stored pools of the gate's 140 seeds
for s in stored-today stored-master; do n=$(ls /var/tmp/v51/out/p1/$s 2>/dev/null | grep -c '^r3m.*json$'); echo "$s: $n documents"; [ "$n" = 140 ] || echo "  re-make: sh $R/docs/chair/2026-11-24/tenth/veil/v51/p1.sh dumps"; done
echo "restore END $(date -u +%H:%M:%S)"
