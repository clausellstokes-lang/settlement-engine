#!/bin/sh
# BIRTH-2-COUNT, the counts of the owner's addendum, for each share born by births-all.sh (labels <L>-720, -150, -ref):
# against BIRTH-1 (R25s), the move (fieldDiff), the roster (q4roster), the marks (q4rules), the alignment (b2align).
#   sh b2-all.sh <base tree> <prototype tree> <births root> <out dir> <label> ...
BASE=$1; TIP=$2; R=$3; O=$4; shift 4; H=$(cd "$(dirname "$0")" && pwd); mkdir -p "$O"
for L in "$@"; do
  for p in 720 150 ref; do echo "== $L $p"; node "$H/fieldDiff.mjs" "$R/R25s-$p/corpus.ndjson.gz" "$R/$L-$p/corpus.ndjson.gz" "$O/diff.$L-$p.json" | head -1
    node "$H/q4roster.mjs" "$R/R25s-$p/corpus.ndjson.gz" "$R/$L-$p/corpus.ndjson.gz"; done
  BIRTH_RULE=R2,R5,K BASE=$BASE TIP=$TIP OUT="$O/q4.$L.json" node "$H/q4rules.mjs" 720="$R/base-720/corpus.ndjson.gz,$R/$L-720/corpus.ndjson.gz" 150="$R/base-150/corpus.ndjson.gz,$R/$L-150/corpus.ndjson.gz"
  for p in 720 150; do BIRTH_RULE=R2,R5,K BASE=$BASE TIP=$TIP node "$H/b2align.mjs" "$R/base-$p/corpus.ndjson.gz" "$R/$L-$p/corpus.ndjson.gz" > "$O/align.$L-$p.md"; echo "align $L $p:"; grep '^c[123]' "$O/align.$L-$p.md"; done
done
