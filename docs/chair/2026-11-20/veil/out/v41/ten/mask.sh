#!/bin/sh
# V41-TEN: sh mask.sh <worktree> <stored dir> <outdir> <template db> [db prefix=tn]; env RV9_LIMIT, RV9_SERVER pass through. Local PGHOST=/var/tmp/rv7 only.
W=$1; S=$2; O=$3; T=$4; X=${5:-tn}; P=/var/tmp/v18/out/v41/ten; mkdir -p $O; rm -f $O/done.txt $O/mask-shard*.json
echo "start $(date -u +%Y-%m-%dT%H:%M:%SZ) tree $W at $(git -C $W rev-parse HEAD) 212 $(sha256sum $W/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16) stored $S tpl $T" > $O/window.txt
cd $W
for s in 0 1 2 3; do (env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE PGHOST=/var/tmp/rv7 RV6_SRC=$W RV6_PGMOD=/var/tmp/v18/pgmod RV9_SERVER_TPL=$T RV9_SERVER_DB=${X}_$(basename $O | tr -c 'a-z0-9\n' _) RV9_PROBE=$P/mask.probe.jsx RV9_STORED_DIR=$S RV9_OUT_DIR=$O RV9_SHARD=$s/4 npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs > $O/mask-shard$s.log 2>&1; echo "shard $s rc=$?" >> $O/done.txt) & done; wait
echo "end $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $O/window.txt
cat $O/done.txt; [ "$(grep -c 'rc=0' $O/done.txt)" = 4 ] || { echo "A SHARD FAILED"; exit 2; }
node -e '
const fs=require("fs");const o=process.argv[1];const T={};const EX={};let docs=0,srv=0;
for(const f of fs.readdirSync(o).filter(f=>/^mask-shard\d+\.json$/.test(f))){const j=JSON.parse(fs.readFileSync(o+"/"+f,"utf8"));docs+=j.docs;srv+=j.srvDocs;
for(const[k,v]of Object.entries(j.tally))T[k]=(T[k]||0)+v;for(const[k,v]of Object.entries(j.examples))(EX[k]||=[]).push(...v);}
console.log(`DOCUMENTS ${docs} (server ${srv})`);for(const[k,v]of Object.entries(T).sort())console.log(`${k}: ${v}`);
console.log("--- examples");for(const[k,v]of Object.entries(EX).sort())console.log(`e.g. ${k}: ${v.slice(0,4).join(" ; ")}`);' $O > $O/mask-table.txt
cat $O/mask-table.txt
