#!/bin/sh
# run-e2.sh <tree> <bundle> <plan.json> <out.jsonl> <end> <chunk> : resumable, chunked; RENAMES_FIRST from the env
TREE=$1; BUNDLE=$2; PLAN=$3; OUT=$4; END=$5; CHUNK=$6
while :; do
  node -e "const fs=require('fs');const f='$OUT';if(!fs.existsSync(f))process.exit(0);const s=fs.readFileSync(f,'utf8');if(s&&!s.endsWith('\n')){fs.writeFileSync(f,s.slice(0,s.lastIndexOf('\n')+1));console.log('trimmed torn line')}"
  N=$(cat "$OUT" 2>/dev/null | wc -l)
  [ "$N" -ge "$END" ] && break
  TO=$((N + CHUNK)); [ "$TO" -gt "$END" ] && TO=$END
  echo "$(date -u +%T) chunk $N..$TO"
  nice -n 10 node --max-old-space-size=4096 /home/user/scratch/tools/rboot-plain.mjs $TREE $BUNDLE $PLAN $OUT $N $TO > $OUT.chunk.log 2>&1 || { echo "chunk exit $?"; tail -5 $OUT.chunk.log; exit 3; }
done
echo "corpus done $(wc -l < $OUT)"
