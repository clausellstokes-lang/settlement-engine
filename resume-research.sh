#!/bin/sh
# resume-research.sh [names...] — THE ONE COMMAND after a window cutoff (chair, 2026-09-06 08:10).
# For every sweep in prose-research/sweep/LAST-RUNS.json (or the names given): salvage finder results from the dead run's journal
# (extract-found.py searches every session dir), merge every verdict file (summary), fold found files (assemble; a found file with
# "complete": false is folded AND its angle re-run), re-split, and write sweep/args-<name>-<nexttag>.json carrying the regrade/synth
# notes. It PRINTS what to paste: one Workflow call per sweep with the args JSON inline (the argsFile loader is DISABLED — it
# hallucinated on 09-06). Nothing is launched by this script; a successor launches each and then updates LAST-RUNS.json.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
K=$SC/prose-research; S=$K/sweep
cd $K || exit 1
# ⛔ GUARD: split-chunks.py DELETES and REWRITES sweep/chunks/<name>-NN.json, which LIVE verifiers are reading. Run this only when
# every research run is dead (a cutoff, a TaskStop, a finished run). Confirm with CONFIRM_DEAD=1.
if [ "$CONFIRM_DEAD" != "1" ]; then echo "REFUSED: set CONFIRM_DEAD=1 only when no research run is alive (their verifiers read the chunk files this rewrites)."; exit 2; fi
NAMES="$*"; [ -z "$NAMES" ] && NAMES="tolkien kay leguin wolfe martin hobb dnd ai"
echo "== sweep state before =="; node sweep-state.mjs summary
for n in $NAMES; do
  RUN=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));print(d.get('$n',{}).get('runId',''))")
  PREV=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));print(d.get('$n',{}).get('argsFile',''))")
  TAG=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));t=d.get('$n',{}).get('tag','r3c');import re;m=re.match(r'r(\d+)([a-z]?)',t);print('r%d'%(int(m.group(1))+1) if m else t+'x')")
  echo "== $n: last run $RUN, prev args $PREV -> next tag $TAG =="
  if [ -n "$PREV" ] && [ -f "$S/$PREV" ]; then python3 $S/mk-round.py $n $TAG --prev $S/$PREV ${RUN:+--runs $RUN} --cap 4 | tail -1; else echo "  (no prev args in LAST-RUNS.json for $n — build by hand: python3 sweep/mk-round.py $n $TAG --prev sweep/args-$n-<lasttag>.json)"; fi
done
echo; echo "== PASTE, one Workflow call per sweep (scriptPath = $K/research-workflow-v3.js; args = the JSON of the file named) =="
for n in $NAMES; do f=$(ls -t $S/args-$n-r*.json 2>/dev/null | head -1); echo "  $n -> $f ($(wc -c < $f 2>/dev/null) bytes)"; done
echo "Then: update $S/LAST-RUNS.json with the new runIds/argsFiles/tags; the autosave seals the kit every 5 min."
