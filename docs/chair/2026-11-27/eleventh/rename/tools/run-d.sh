#!/bin/sh
# run-d.sh <plan.json> <out.jsonl> <end> <chunk> : resumes from lines already in <out>, one fresh niced process per chunk
T=/tmp/rename/tools; W=/tmp/rename/work
PLAN=$1; OUT=$2; END=$3; CHUNK=$4
while :; do
  node -e "const fs=require('fs');const f='$OUT';if(!fs.existsSync(f))process.exit(0);const s=fs.readFileSync(f,'utf8');if(s&&!s.endsWith('\n')){fs.writeFileSync(f,s.slice(0,s.lastIndexOf('\n')+1));console.log('trimmed torn line')}"
  N=$(cat "$OUT" 2>/dev/null | wc -l)
  [ "$N" -ge "$END" ] && break
  TO=$((N + CHUNK)); [ "$TO" -gt "$END" ] && TO=$END
  echo "$(date -u +%T) chunk $N..$TO"
  nice -n 10 node --max-old-space-size=3072 $T/rboot.mjs /home/user/settlement-engine $W/bundle.mjs $PLAN $OUT $N $TO > $W/chunk.log 2>&1 || { echo "chunk exit $?"; tail -5 $W/chunk.log; exit 3; }
done
echo "corpus done $(wc -l < $OUT)"
