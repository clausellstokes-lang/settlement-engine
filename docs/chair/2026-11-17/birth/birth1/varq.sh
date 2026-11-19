#!/bin/sh
# sh varq.sh <label>... : birth each variant, then fieldDiff and q4rules over it (wt-var holds the variant while it is read)
S=/tmp/claude-0/-home-user-settlement-engine/5055c99b-8231-592b-92f6-f61dec944beb/scratchpad; cd $S
for L in "$@"; do
  sh $S/variant.sh $L > $S/log.$L.txt 2>&1
  for p in 720 150 ref; do echo "== $L $p"; node probes/fieldDiff.mjs b/base/$p/corpus.ndjson.gz b/$L/$p/corpus.ndjson.gz out.fd.$L.$p.json | head -9; done
  BASE=/home/user/wt-base TIP=/home/user/wt-var OUT=$S/q4.$L.json node probes/q4rules.mjs 720=b/base/720/corpus.ndjson.gz,b/$L/720/corpus.ndjson.gz 150=b/base/150/corpus.ndjson.gz,b/$L/150/corpus.ndjson.gz
  echo "EXIT-$L $?"
done
