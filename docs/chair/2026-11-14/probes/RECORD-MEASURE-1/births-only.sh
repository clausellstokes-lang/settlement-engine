#!/bin/sh
# births only: <tree> <out-dir> — the census's own births.mjs over its 720 seeds, the corpus alone (no render)
set -u
P=${CENSUS3_PROBES:?set CENSUS3_PROBES to the CENSUS-3 probes dir, git-archived out}
TREE=$(cd "$1" && pwd); mkdir -p "$2"; OUT=$(cd "$2" && pwd)
TREE=$TREE OUT=$OUT SEEDS=$P/seeds.txt node "$P/births.mjs"
