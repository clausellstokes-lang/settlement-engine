#!/bin/sh
# bite.sh: REVIEW-VEIL-11's r2a.probe.jsx (kept under probes/REVIEW-VEIL-12) on two chains; arm C counted per measure.
# Needs REVIEW-VEIL-13.md section R steps 0-4 done for chains pre212 (302850b0b) and x212 (<lane commit>).
# usage: sh bite.sh <lane commit short> ; writes /var/tmp/v16/out/bite-{base,lane}.json
set -u; R12=$PWD/docs/chair/2026-11-20/veil/probes/REVIEW-VEIL-12; L=$1; mkdir -p /var/tmp/v16/out
env RV6_SRC=/var/tmp/v16/wt-302850b0b RV11_PRE=/var/tmp/v16/wt-302850b0b RV10_TPL=pre212 RV11_PRE_TPL=pre212 RV10_OUT=/var/tmp/v16/out/bite-base.json sh $R12/run.sh $R12/r2a.probe.jsx /var/tmp/v16/out/bite-base.log
env RV6_SRC=/var/tmp/v16/wt-$L RV11_PRE=/var/tmp/v16/wt-302850b0b RV10_TPL=x212 RV11_PRE_TPL=pre212 RV10_OUT=/var/tmp/v16/out/bite-lane.json sh $R12/run.sh $R12/r2a.probe.jsx /var/tmp/v16/out/bite-lane.log
for f in base lane; do echo "== $f"; tail -1 /var/tmp/v16/out/bite-$f.log; node -e 'const j=require(process.argv[1]);const a={};for(const[k,v] of Object.entries(j.T)){if(!k.startsWith("C "))continue;const q=k.replace(/ \(.*\)$/,"");a[q]=a[q]||{n:0,b:0};a[q].n+=v.n;a[q].b+=v.bad}for(const[k,v] of Object.entries(a))console.log(v.b+"/"+v.n,k)' /var/tmp/v16/out/bite-$f.json; done
