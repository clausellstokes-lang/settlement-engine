#!/bin/sh
# VEIL-52's MACHINE, from a fresh container or after a restart (VEIL-55's rule (5), 2026-11-25). Run from the main checkout
# (/home/user/settlement-engine). MEASURED TIMES (2026-11-24/25, this container): npm ci ~1 min; make-instruments.sh (PostgreSQL 16
# cluster, templates v27x211/v27x212/v28tpl, acceptance, gate) 6 min (21:27-21:33 UTC); the three stored sets 1 min (21:33-21:34);
# master's chain v52mst ~1 min (inside n115.sh); worktrees seconds. FRESH CONTAINER: about 10 minutes. AFTER A RESTART (files kept):
# step 1 alone, seconds. Every heavy step through the mutex.
set -u
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
H=/home/user/settlement-engine; V=docs/chair/2026-11-20/veil/out; Q=/var/tmp/v56/v52
# 1. PostgreSQL (after any restart: the cluster's files survive, the server does not)
if [ -d /var/tmp/v18pg ]; then psql -h /var/tmp/rv7 -U postgres -Atc 'select 1' >/dev/null 2>&1 || su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"; fi
[ -d /home/user/wt/tip ] && [ -d /var/tmp/v52/out/stored-today ] && { echo "restart restore done: PostgreSQL up; files present"; exit 0; }
# 2. a FRESH container: dependencies and the ledger ref
cd $H && [ -d node_modules ] || $E npm ci > /var/tmp/v52/log/npm-ci.log 2>&1
git fetch -q origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD
git fetch -q origin master lane/veil-41-2026-11-23-tip lane/veil-42-2026-11-23-meas-wip lane/veil-43-2026-11-23 lane/veil-44-2026-11-23-mapcovert-wip lane/veil-43-2026-11-23-join-wip lane/join-2026-11-14 lane/veil-55-2026-11-24-tip
# 3. worktrees (detached; node_modules linked)
mkdir -p /home/user/wt /var/tmp/v52/log /var/tmp/v52/out
for p in "tip b58abc48b" "master db832c892" "i42 d71a3ee44" "i43 b126c9813" "i44 6edc79094"; do set -- $p; [ -d /home/user/wt/$1 ] || git worktree add --detach /home/user/wt/$1 $2 >/dev/null; ln -sfn $H/node_modules /home/user/wt/$1/node_modules; done
if [ ! -d /home/user/wt/join ]; then git worktree add --detach /home/user/wt/join 9e6547f0f >/dev/null && (cd /home/user/wt/join && git -c user.name=scratch -c user.email=scratch@local merge --no-edit -q f03e9a868 && git -c user.name=scratch -c user.email=scratch@local merge --no-edit -q b58abc48b); ln -sfn $H/node_modules /home/user/wt/join/node_modules; fi
# 4. the instruments' machine (PostgreSQL 16, templates, the gate), VEIL-50's recipe, through the mutex
$E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh /home/user/wt/tip/$V/v28/seated/make-instruments.sh /home/user/wt/tip /var/tmp/v52/out/seated > /var/tmp/v52/log/m0.log 2>&1
cat /var/tmp/v52/out/seated/exits.txt
# 5. the three stored sets
sh $Q/q52.sh dumps
echo "fresh restore done $(date -u +%H:%M:%S)"
