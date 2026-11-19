P=/home/user/inst/docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS
for t in base tipA; do
  sh $P/census.sh /home/user/wt/$t /home/user/runs/census1/$t 4 > /home/user/runs/census1/$t.log 2>&1; echo "CENSUS EXIT $?" >> /home/user/runs/census1/$t.log
  ( cd /home/user/wt/$t && TREE=/home/user/wt/$t OUT=/home/user/runs/census1/$t DUMPS=/home/user/runs/census1/$t/dumps CORPUS=/home/user/runs/census1/$t/corpus.ndjson.gz node $P/count.mjs > /home/user/runs/census1/$t/counts.direct.txt 2> /home/user/runs/census1/$t/counts.direct.err; echo "COUNT EXIT $?" >> /home/user/runs/census1/$t.log )
done
echo ALLDONE >> /home/user/runs/census1/done
