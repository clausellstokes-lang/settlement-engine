#!/bin/sh
# gaps.sh <tree> <outdir> : the mapping seat's depth.mjs over the census corpus (base births)
SP=/tmp/claude-0/-home-user-settlement-engine/0e6c4fff-bdc8-5f8a-955c-3091ff150160/scratchpad
F=$SP/tools/docs/chair/2026-11-12/probes/LAYER-MAP
mkdir -p "$2"; cd "$1" && TREE=$PWD CORPUS=$SP/census-base/corpus.ndjson.gz LAYERS=$F/results/layers.json PERTURB=$F/results/perturb.json LAYER_MAP_HOOK=1 node --import $F/jsx-register.mjs $F/depth.mjs "$2" > "$2/run.log" 2>&1
echo "depth exit=$?"
cd "$1" && TREE=$PWD CORPUS=$SP/census-base/corpus.ndjson.gz LAYER_MAP_HOOK=1 node --import $F/jsx-register.mjs $SP/probe/caseprobe.mjs "$2/all.json" >> "$2/run.log" 2>&1
echo "probe exit=$?"
node -e "const g=require('$2/gaps.json');const n=g.gaps.filter(x=>x.flag==='NONE');console.log('cases',g.gaps.length,'none',n.length,'ownerNone',g.gaps.filter(x=>x.linesLeftOwnerView===0).length,'under3',g.gaps.filter(x=>x.flag==='UNDER3').length,'ownerUnder3',g.gaps.filter(x=>x.linesLeftOwnerView>0&&x.linesLeftOwnerView<3).length)"
