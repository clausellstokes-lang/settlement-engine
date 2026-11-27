#!/bin/sh
# run-corpus.sh <plan.json> <out.jsonl> <end> <chunk> : resumes from the lines already in <out>, one fresh niced process per chunk
S=/tmp/claude-0/-home-user-settlement-engine/8577a21b-9ea6-5281-9a3b-a635c470c29d/scratchpad/rmeasure
PLAN=$1; OUT=$2; END=$3; CHUNK=$4
while :; do
  # drop a torn last line, if any
  node -e "const fs=require('fs');const f='$OUT';if(!fs.existsSync(f))process.exit(0);const s=fs.readFileSync(f,'utf8');if(s&&!s.endsWith('\n')){fs.writeFileSync(f,s.slice(0,s.lastIndexOf('\n')+1));console.log('trimmed torn line')}"
  N=$(cat "$OUT" 2>/dev/null | wc -l)
  [ "$N" -ge "$END" ] && break
  TO=$((N + CHUNK)); [ "$TO" -gt "$END" ] && TO=$END
  echo "$(date -u +%T) chunk $N..$TO"
  nice -n 10 node --max-old-space-size=3072 $S/tools/boot.mjs /home/user/wt/rmeasure $S/bundle.mjs $PLAN $OUT $N $TO || { echo "chunk exit $?"; exit 3; }
done
echo "corpus done $(wc -l < $OUT)"
