cd /home/user/wt/tip
for i in 1 2 3 4 5 6; do
  [ -f /home/user/runs/suite/shard$i.done ] && continue
  sh scripts/gate-mutex.sh --run -- npx vitest run --shard=$i/6 --maxWorkers=3 --reporter=default --reporter=json --outputFile.json=/home/user/runs/suite/shard$i.json > /home/user/runs/suite/shard$i.log 2>&1
  echo "EXIT $?" >> /home/user/runs/suite/shard$i.log; touch /home/user/runs/suite/shard$i.done
done
echo ALLDONE > /home/user/runs/suite/done
