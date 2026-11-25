# V27 (5): the census with the writer oracle, red first on the pre-N2b table, then green. Waits for the tree's prior walker run.
cd /home/user/wt/v27 || exit 9
O=/var/tmp/v51/out/v27; P=/var/tmp/v51/out/p1/stored-today:/var/tmp/v51/out/p1/stored-master; MT=/home/user/wt/master
while ! grep -q '^rc=' $O/walk.log 2>/dev/null; do sleep 20; done
echo "walk done $(date -u +%T)" >> $O/oracle.exits
cp scripts/veil/standingForms.data.json $O/table.new.json
cp /var/tmp/v51/out/n/standingForms.data.old.json scripts/veil/standingForms.data.json
rm -f $O/oracle-old.txt $O/oracle-new.txt
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 STANDWALK_POOLS=$P STANDWALK_MASTER_TREE=$MT STANDWALK_MEASURES=$O/oracle-old.txt sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/standingFormsTotality.walker.test.js -t 'CENSUS' > $O/oracle-old.log 2>&1; echo "old rc=$? $(date -u +%T)" >> $O/oracle.exits
cp $O/table.new.json scripts/veil/standingForms.data.json
cmp -s scripts/veil/standingForms.data.json $O/table.new.json && echo "restored $(date -u +%T)" >> $O/oracle.exits
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 STANDWALK_POOLS=$P STANDWALK_MASTER_TREE=$MT STANDWALK_MEASURES=$O/oracle-new.txt sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/standingFormsTotality.walker.test.js > $O/oracle-new.log 2>&1; echo "new rc=$? $(date -u +%T)" >> $O/oracle.exits
