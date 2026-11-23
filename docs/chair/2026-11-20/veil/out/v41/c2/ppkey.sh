#!/bin/sh
# VEIL-41: sh ppkey.sh <worktree> <stored dir> <outdir> <template db> [db prefix=pk]; env RV9_LIMIT, RV9_SERVER pass through.
# Four shards of ppkey.probe.jsx; then the summed table to <outdir>/ppkey-table.txt. Local PGHOST=/var/tmp/rv7 only.
W=$1; S=$2; O=$3; T=$4; X=${5:-pk}; P=$(cd "$(dirname "$0")" && pwd); mkdir -p $O; rm -f $O/done.txt $O/ppkey-shard*.json $O/shas-shard*.tsv $O/diffs-shard*.json
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) stored $S tpl $T" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${X}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/ppkey.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/ppkey-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A SHARD FAILED"; exit 2; }
node -e '
const fs=require("fs");const o=process.argv[1];const T={};let docs=0,stored=0;const ex={};const SH={equal:0,differ:0};
for(const f of fs.readdirSync(o).filter(f=>/^ppkey-shard\d+\.json$/.test(f))){const j=JSON.parse(fs.readFileSync(o+"/"+f,"utf8"));docs+=j.docs;stored+=j.stored;if(j.shas){SH.equal+=j.shas.equal;SH.differ+=j.shas.differ;}
for(const[k,v]of Object.entries(j.counts)){T[k]||={reads:0,carry:0};T[k].reads+=v.reads;T[k].carry+=v.carry;}for(const[k,v]of Object.entries(j.examples))(ex[k]||=[]).push(...v);}
console.log(`DOCUMENTS ${docs} (stored with publicProse ${stored})`);console.log(`SERVER = TWIN BY SHA (whole document, canonical): equal ${SH.equal}, differ ${SH.differ}`);for(const[k,v]of Object.entries(T).sort())console.log(`${k}: ${v.carry} of ${v.reads} reads carry publicProse`);
for(const[k,v]of Object.entries(ex))console.log(`e.g. ${k}: ${v.slice(0,3).join(" ; ")}`);' $O > $O/ppkey-table.txt
cat $O/ppkey-table.txt
