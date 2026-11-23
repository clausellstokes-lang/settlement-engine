#!/bin/sh
# VEIL-39: re-make the machine by PART 38 (4) and run C1's stored gates. Each step's rc to $L.
L=/var/tmp/v18/out/v39/remake.log; R=/home/user/settlement-engine; LP=/home/user/wt/lp
st() { echo "$1 rc=$2 $(date -u +%H:%M:%S)" >> $L; }
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ)" > $L
mkdir -p /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log && chown postgres:postgres /var/tmp/v18pg /var/tmp/rv7 /var/tmp/v18log && su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v18pg --locale=C.UTF-8 -E UTF8 --auth=trust -U postgres" > /var/tmp/v18/out/v39/initdb.txt 2>&1 && printf "listen_addresses = ''\nunix_socket_directories = '/var/tmp/rv7'\nfsync = off\n" >> /var/tmp/v18pg/postgresql.conf && su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start" >> /var/tmp/v18/out/v39/initdb.txt 2>&1; st cluster $?
(mkdir -p /var/tmp/v18/pgmod && cd /var/tmp/v18/pgmod && npm init -y >/dev/null && npm i pg@8.13.1) > /var/tmp/v18/out/v39/pgmod.txt 2>&1; st pgmod $?
cd $R && git fetch -q origin lane/review-veil-3-2026-11-12:refs/remotes/origin/lane/review-veil-3-2026-11-12 lane/review-veil-9-2026-11-19:refs/remotes/origin/lane/review-veil-9-2026-11-19 > /var/tmp/v18/out/v39/lib.txt 2>&1 && mkdir -p /var/tmp/v18/lib && git archive 72a3bb24f docs/chair/2026-11-13/probes/REVIEW-VEIL-6 docs/chair/2026-11-13/probes/REVIEW-VEIL-7 docs/chair/2026-11-14/probes/REVIEW-VEIL-8 | tar -x -C /var/tmp/v18/lib && git archive origin/lane/review-veil-9-2026-11-19 docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9 2>>/var/tmp/v18/out/v39/lib.txt | tar -x -C /var/tmp/v18/lib; st lib $?
mkdir -p /var/tmp/v18/rv9 && cp -r /var/tmp/v18/lib/docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9/* /var/tmp/v18/rv9/ && sed -i 's#/var/tmp/v16/rv9/#/var/tmp/v18/rv9/#g' /var/tmp/v18/rv9/names-unicode.mjs /var/tmp/v18/rv9/page-vocab.probe.jsx /var/tmp/v18/rv9/page.probe.jsx; st probes $?
cat > /var/tmp/v18/rv9/vitest.config.mjs <<'EOC'
const SRC = process.env.RV6_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: SRC, plugins: [react()], server: { fs: { strict: false } },
  test: { environment: 'node', include: [process.env.RV9_PROBE], testTimeout: 14400000, pool: 'forks', setupFiles: [] } };
EOC
cp $R/docs/chair/2026-11-20/veil/r1/instruments/* /var/tmp/v18/ 2>/dev/null
mkdir -p /home/user/wt && git worktree add --detach $LP lane/veil-33-2026-11-22-legacy-wip > /var/tmp/v18/out/v39/wt.txt 2>&1; st worktree $?
(cd $LP && npm ci) > /var/tmp/v18/out/v39/npmci.txt 2>&1; st npmci $?
cp $R/docs/chair/2026-11-20/veil/out/v27/seated/run-all-v27.sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/ && cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all-v27.sh $LP /var/tmp/v18/out/v39/accept > /var/tmp/v18/out/v39/accept.txt 2>&1; st accept $?
export PGHOST=/var/tmp/rv7 PGUSER=postgres
dropdb --if-exists c1_tpl && createdb -T v27x211 c1_tpl && psql -q -v ON_ERROR_STOP=1 -d c1_tpl -f $LP/supabase/migrations/212_share_veil_later_cures.sql > /var/tmp/v18/out/v39/tpl.txt 2>&1; st c1_tpl $?
sha256sum $LP/supabase/migrations/212_share_veil_later_cures.sql $LP/supabase/migrations/211_server_side_share_veil.sql > /var/tmp/v18/out/v39/sha256.txt
cd $LP
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE sh scripts/gate-mutex.sh --run -- sh $LP/docs/chair/2026-11-20/veil/out/v27/tell2/measure/pool.sh $LP /var/tmp/v18/t2/pool-r5c-1 c1_tpl > /var/tmp/v18/out/v39/pool.txt 2>&1; st pool $?
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/stored/stored-dump.sh $LP /var/tmp/v18/stored/today > /var/tmp/v18/out/v39/dump.txt 2>&1; st dump $?
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/legacy/stored.sh $LP /var/tmp/v18/stored/today/docs /var/tmp/v18/stored/read-today c1_tpl c1 > /var/tmp/v18/out/v39/read.txt 2>&1; st read $?
echo "END $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $L
