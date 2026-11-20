#!/bin/sh
# VEIL-28 draft (for PART 29 §4): every instrument from a FRESH container, ONE command, run from the lane checkout.
#   sh make-instruments.sh <checkout> [outdir]   -> sha256, --check, walker, harnesses, acceptance (builds v27x211/v27x212),
#   the gate template (v28tpl = v27x211 + the tree's 212) and the gate. Every exit recorded in <outdir>/exits.txt.
set -u
C=$(cd "$1" && pwd); O=${2:-/var/tmp/v18/out/v28/seated}; mkdir -p $O; : > $O/exits.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
if [ ! -d /var/tmp/v18pg ]; then
  mkdir -p /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log && chown postgres:postgres /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log
  su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v18pg --locale=C.UTF-8 -E UTF8 --auth=trust -U postgres" > /var/tmp/v18log/initdb.txt 2>&1
  printf "listen_addresses = ''\nunix_socket_directories = '/var/tmp/rv7'\nfsync = off\n" >> /var/tmp/v18pg/postgresql.conf
fi
psql -Atc 'select 1' >/dev/null 2>&1 || su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"
[ -d /var/tmp/v18/pgmod/node_modules/pg ] || (mkdir -p /var/tmp/v18/pgmod && cd /var/tmp/v18/pgmod && npm init -y >/dev/null && npm i pg@8.13.1 >/dev/null)
L=/var/tmp/v18/lib; R7=$L/docs/chair/2026-11-13/probes/REVIEW-VEIL-7
if [ ! -d $R7 ]; then
  mkdir -p $L && (cd $C && git fetch -q origin lane/review-veil-3-2026-11-12 lane/review-veil-9-2026-11-19 \
   && git archive 72a3bb24f docs/chair/2026-11-13/probes/REVIEW-VEIL-6 docs/chair/2026-11-13/probes/REVIEW-VEIL-7 docs/chair/2026-11-14/probes/REVIEW-VEIL-8 | tar -x -C $L \
   && git archive origin/lane/review-veil-9-2026-11-19 docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9 | tar -x -C $L)
  mkdir -p /var/tmp/v18/rv9 && cp -r $L/docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9/* /var/tmp/v18/rv9/
  sed -i 's#/var/tmp/v16/rv9/#/var/tmp/v18/rv9/#g' /var/tmp/v18/rv9/names-unicode.mjs /var/tmp/v18/rv9/page-vocab.probe.jsx /var/tmp/v18/rv9/page.probe.jsx
fi
V=$C/docs/chair/2026-11-20/veil
cp $V/r1/instruments/* /var/tmp/v18/; cp $V/out/v27/seated/run-all-v27.sh $R7/; cp $V/out/v27/seated/g27.sh /var/tmp/v18/
cd $C; [ -d node_modules ] || $E npm ci > /var/tmp/v18log/npm-ci.txt 2>&1
sha256sum supabase/migrations/211_server_side_share_veil.sql supabase/rollback/211* supabase/migrations/212_share_veil_later_cures.sql supabase/rollback/212* > $O/sha256.txt
$E node scripts/veil/rosterChoiceRegistry.mjs --check > $O/check.txt 2>&1; echo "check $?" >> $O/exits.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint/rosterChoiceRegistry.walker.test.js > $O/walker.txt 2>&1; echo "walker $?" >> $O/exits.txt
$E sh scripts/gate-tail.sh npx vitest run --maxWorkers=1 tests/security/shareRenderTwice.pglite.test.jsx tests/security/rosterChoiceInversion.pglite.test.js tests/security/criminalSwitchHandReach.pglite.test.js > $O/harnesses.txt 2>&1; echo "harnesses $?" >> $O/exits.txt
(cd /var/tmp/v18 && RV6_PGMOD=/var/tmp/v18/pgmod sh $R7/run-all-v27.sh $C $O/accept > $O/accept.txt 2>&1); echo "accept $?" >> $O/exits.txt
dropdb --if-exists v28tpl && createdb -T v27x211 v28tpl && psql -q -v ON_ERROR_STOP=1 -d v28tpl -f supabase/migrations/212_share_veil_later_cures.sql > $O/tpl212.txt 2>&1; echo "tpl $?" >> $O/exits.txt
sh $V/out/v25/r3c5/measure/gate.sh $C $O/gate v28tpl 2 > $O/gate.txt 2>&1; echo "gate $?" >> $O/exits.txt
cat $O/exits.txt; grep -c '^PASS' $O/accept.txt; sed -n 2p $O/gate/gate-table.txt
