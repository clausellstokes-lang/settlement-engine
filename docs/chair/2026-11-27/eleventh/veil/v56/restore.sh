#!/bin/sh
# VEIL-56: RESTORE THIS SEAT'S MACHINE (a copy of v55/restore.sh WITHOUT its save loop, which pushes VEIL-55's branch name).
# AFTER A RESTART (files survive): PostgreSQL started. FROM A FRESH CONTAINER: npm ci in the checkout first, then this, detached:
#   setsid nohup sh restore.sh > /var/tmp/v56/restore.out 2>&1 < /dev/null &      Every step's rc to /var/tmp/v56/restore.log.
set -u
C=/home/user/settlement-engine; D=/home/user/wt/docs; S55=$D/docs/chair/2026-11-24/tenth/veil/v55; L=/var/tmp/v56/restore.log
mkdir -p /var/tmp/v56 /var/tmp/v55/out /home/user/wt
st() { echo "$1 rc=$2 $(date -u +%FT%TZ)" >> $L; }
if [ -d /var/tmp/v18pg ] && [ -d /var/tmp/v55/out/stored-today ]; then
  PGHOST=/var/tmp/rv7 psql -U postgres -Atc 'select 1' >/dev/null 2>&1 || su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"
  st restart $?; exit 0
fi
cd $C || exit 2
[ -d node_modules ] || { st npmci-missing 2; exit 2; }
[ -d $D ] || git worktree add $D lane/veil-56-2026-11-27 >/dev/null
for x in "tip b58abc48b" "master db832c892" "i41 ccc2e5473" "i42 d71a3ee44" "i43 b126c9813" "i44 6edc79094" "r4ids 8430edf5c"; do set -- $x
  [ -d /home/user/wt/$1 ] || { git -C $C worktree add --detach /home/user/wt/$1 $2 >/dev/null 2>&1; ln -sfn $C/node_modules /home/user/wt/$1/node_modules; }; done
[ -d /home/user/wt/tipm ] || { git -C $C worktree add --detach /home/user/wt/tipm lane/veil-56-2026-11-27-tip >/dev/null 2>&1; ln -sfn $C/node_modules /home/user/wt/tipm/node_modules; }
st worktrees "$(ls /home/user/wt | tr '\n' ' ')"
sh $S55/m0.sh ledger red instr tpl dumps; st m0 "$? $(tail -1 /var/tmp/v55/m0.log)"
PGHOST=/var/tmp/rv7 PGUSER=postgres sh -c 'dropdb --if-exists v55u1; createdb -T v27x211 v55u1 && psql -X -q -v ON_ERROR_STOP=1 -d v55u1 -f /home/user/wt/tipm/supabase/migrations/212_share_veil_later_cures.sql' > /var/tmp/v56/v55u1.txt 2>&1; st v55u1 $?
echo "restore END $(date -u +%FT%TZ)" >> $L
