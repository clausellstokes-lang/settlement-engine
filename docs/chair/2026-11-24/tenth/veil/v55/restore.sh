#!/bin/sh
# VEIL-55: RESTORE THIS SEAT'S MACHINE from origin. AFTER A RESTART (files survive): PostgreSQL started, ~5 s. FROM A FRESH
# CONTAINER: ~12 min measured tonight (npm ci ~1.5 min; make-instruments with the cluster, templates v27x211/v28tpl and the R3 gate
# ~9 min; the 140 stored two ways ~30 s; templates u2r1/u2r2/u2g/v55u1 ~5 s). Run from the checkout:  sh restore.sh
set -u
C=/home/user/settlement-engine; S=$(cd "$(dirname "$0")" && pwd)
if [ -d /var/tmp/v18pg ] && [ -d /var/tmp/v55/out/stored-today ]; then
  PGHOST=/var/tmp/rv7 psql -U postgres -Atc 'select 1' >/dev/null 2>&1 || su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"
  pgrep -f 'v55/save.sh' >/dev/null || setsid nohup sh $S/save.sh loop > /var/tmp/v55/save.out 2>&1 < /dev/null &
  echo "restored after a restart"; exit 0
fi
cd $C && git fetch -q origin lane/veil-55-2026-11-24-tip lane/veil-55-2026-11-24 && [ -d node_modules ] || npm ci > /var/tmp/v55-npmci.log 2>&1
for x in "tip b58abc48b" "master db832c892" "i41 ccc2e5473" "i42 d71a3ee44" "i43 b126c9813" "i44 6edc79094"; do set -- $x
  [ -d /home/user/wt/$1 ] || { git -C $C fetch -q origin $(git -C $C ls-remote origin 'refs/heads/lane/veil-4*' | awk '{print $2}' | sed 's#refs/heads/##') 2>/dev/null; git -C $C worktree add --detach /home/user/wt/$1 $2 >/dev/null; ln -sfn $C/node_modules /home/user/wt/$1/node_modules; }; done
[ -e /home/user/wt/r4ids ] || ln -sfn $C /home/user/wt/r4ids
[ -d /home/user/wt/tipm ] || { git -C $C worktree add /home/user/wt/tipm lane/veil-55-2026-11-24-tip >/dev/null; ln -sfn $C/node_modules /home/user/wt/tipm/node_modules; }
sh $S/m0.sh ledger red instr tpl dumps
PGHOST=/var/tmp/rv7 PGUSER=postgres sh -c 'dropdb --if-exists v55u1; createdb -T v27x211 v55u1 && psql -X -q -v ON_ERROR_STOP=1 -d v55u1 -f /home/user/wt/tipm/supabase/migrations/212_share_veil_later_cures.sql'
setsid nohup sh $S/save.sh loop > /var/tmp/v55/save.out 2>&1 < /dev/null &
echo "restored from a fresh container: $(date -u +%FT%TZ)"
