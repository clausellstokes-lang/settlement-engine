# sh bornall.sh <seeds> <tag> <label>...: born.mjs at wt/<label> over <seeds>, 4 shards, into out/<tag>/<label>/ (.done when all 4 finish)
SCR=/tmp/claude-0/-home-user-settlement-engine/957f1a26-c08d-5601-a50f-d1918b9621a5/scratchpad; S=$1; G=$2; shift 2
for L in "$@"; do D=$SCR/out/$G/$L; rm -rf $D; mkdir -p $D
  for i in 0 1 2 3; do TREE=$SCR/wt/$L node $SCR/inst/born.mjs $S $D $i 4 > $D/log.$i 2>&1 & done; wait
  [ $(grep -l done $D/log.? | wc -l) = 4 ] && touch $D/.done; done
