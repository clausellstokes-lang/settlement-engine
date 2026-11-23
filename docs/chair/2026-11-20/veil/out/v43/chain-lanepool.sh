#!/bin/sh
# VEIL-43 unit (1)(a): THE LANE'S POOL at the veil's tip 23bb8b8ae (a detached scratch worktree, never committed into), then the
# probe's pool-compare (seeds, crises, dials, held houses, tries, rejections, signature tables) against the joined tree's pool-v43.
# Run as: sh scripts/gate-mutex.sh --run -- sh <this>   (from /home/user/join43)
T=/home/user/lanetip; O=/var/tmp/v18/out/v43/lanepool; P=/var/tmp/v18/t2/pool-v43lane; mkdir -p $O; L=$O/done.txt
export PGHOST=/var/tmp/rv7 PGUSER=postgres
echo "start $(date -u +%H:%M:%S)" > $L
[ -d $T ] || git -C /home/user/join43 worktree add --detach $T 23bb8b8ae1155e948bca4308e479fba7adc8639c >> $L 2>&1
[ -e $T/node_modules ] || ln -s /home/user/join43/node_modules $T/node_modules
echo "tree $(git -C $T rev-parse HEAD)" >> $L
sh $T/docs/chair/2026-11-20/veil/out/v27/tell2/measure/pool.sh $T $P v28tpl > $O/pool.txt 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> $L
git -C /home/user/settlement-engine show df7447e58fa42f11541f86bca44754715cdb9fae:docs/chair/2026-11-20/veil/out/v33/joinprobe/measure/pool-compare.mjs > $O/pool-compare.mjs
node $O/pool-compare.mjs $P /var/tmp/v18/t2/pool-v43 > $O/pool-compare.txt 2>&1; echo "compare rc=$?" >> $L
for f in pool-shard0 pool-shard1 pool-shard2 pool-shard3 poolb-shard0 poolb-shard1 poolb-shard2 poolb-shard3; do
  a=$(node -e "const j=JSON.parse(require('fs').readFileSync('$P/$f.json','utf8'));console.log(JSON.stringify({b:j.births,r:j.rejected,s:j.sigs}))" | sha256sum | cut -c1-16)
  b=$(node -e "const j=JSON.parse(require('fs').readFileSync('/var/tmp/v18/t2/pool-v43/$f.json','utf8'));console.log(JSON.stringify({b:j.births,r:j.rejected,s:j.sigs}))" | sha256sum | cut -c1-16)
  echo "$f lane $a join $b $([ $a = $b ] && echo EQUAL || echo DIFFER)" >> $L
done
echo "END $(date -u +%H:%M:%S)" >> $L
