I=/home/user/inst/docs/chair/2026-11-13/probes; R=/home/user/runs/reader
for t in $*; do
  mkdir -p $R/$t/dumps; i=0
  while [ $i -lt 4 ]; do awk -v j=$i '(NR-1)%4==j' $R/seeds1440.txt > $R/$t/seeds.$i; i=$((i+1)); done
  i=0; while [ $i -lt 4 ]; do ( cd /home/user/wt/$t && TREE=/home/user/wt/$t node $I/REVIEW-UPKEEP-3/render4.mjs $R/$t/seeds.$i $R/$t/dumps > $R/$t/render.$i.log 2>&1; echo "EXIT $?" >> $R/$t/render.$i.log ) & i=$((i+1)); done; wait
  ( cd /home/user/wt/$t && TREE=/home/user/wt/$t node $I/REVIEW-UPKEEP-3/scan4.mjs $R/seeds1440.txt $R/$t/scan.ndjson > $R/$t/scan.log 2>&1; echo "EXIT $?" >> $R/$t/scan.log )
  python3 $I/REVIEW-UPKEEP-2/classes3.py $R/$t/dumps $R/$t/scan.ndjson $R/$t/classes.json > $R/$t/classes.txt 2> $R/$t/classes.err; echo "EXIT $?" >> $R/$t/classes.txt
done
echo ALLDONE >> $R/done
