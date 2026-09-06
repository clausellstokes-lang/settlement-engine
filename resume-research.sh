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
P=$S/inflight/.scan.pid; if ! { [ -f "$P" ] && kill -0 "$(cat "$P")" 2>/dev/null; }; then nohup python3 $S/inflight-scan.py > $S/inflight/scan.out 2>&1 & echo "inflight scanner restarted (pid $!)"; else echo "inflight scanner alive (pid $(cat $P))"; fi
python3 $S/inflight-scan.py --once >/dev/null 2>&1; echo "== in-flight progress (sweep/inflight/SUMMARY.md) =="; head -5 $S/inflight/SUMMARY.md
echo "== sweep state before =="; node sweep-state.mjs summary
for n in $NAMES; do
  RUN=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));print(d.get('$n',{}).get('runId',''))")
  PREV=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));print(d.get('$n',{}).get('argsFile',''))")
  TAG=$(python3 -c "import json;d=json.load(open('$S/LAST-RUNS.json'));t=d.get('$n',{}).get('tag','r3c');import re;m=re.match(r'r(\d+)([a-z]?)',t);print('r%d'%(int(m.group(1))+1) if m else t+'x')")
  echo "== $n: last run $RUN, prev args $PREV -> next tag $TAG =="
  # 09-06 14:25 (S-BOUND rule 3): every rebuild from here is round 5+ → --triage; then the FLAG post-step decides what this launch still owes
  if [ -n "$PREV" ] && [ -f "$S/$PREV" ]; then python3 $S/mk-round.py $n $TAG --prev $S/$PREV ${RUN:+--runs $RUN} --cap 4 --inflight --triage | tail -1; else echo "  (no prev args in LAST-RUNS.json for $n — build by hand: python3 sweep/mk-round.py $n $TAG --prev sweep/args-$n-<lasttag>.json --triage)"; fi
  python3 - "$S" "$n" "$TAG" <<'PY'
import json,glob,os,sys
S,n,tag=sys.argv[1:4]; p=f'{S}/args-{n}-{tag}.json'
if not os.path.exists(p): print('  no args written for',n); sys.exit(0)
a=json.load(open(p)); mt=os.path.getmtime
rg=sorted(glob.glob(f'{S}/verdicts-{n}-regrade-*.json'),key=mt); vf=[f for f in glob.glob(f'{S}/verdicts-{n}-*.json') if '-regrade-' not in f]
last_v=max((mt(f) for f in vf),default=0); sec=f'{S}/section-{n}.md'; cr=f'{S}/critic-{n}.md'
fresh=bool(a.get('chunks')) or bool(a.get('findAngles')) or bool(a.get('extraAngles'))
if rg and mt(rg[-1])>=last_v and not fresh: a['regrade']=False          # the last regrade already covers every verdict
if os.path.exists(sec) and not fresh:
    ref=mt(rg[-1]) if rg else last_v
    if mt(sec)>=ref:
        if (not os.path.exists(cr)) or mt(cr)<mt(sec): a['skipSynth']=True   # section current, critic missing → critic only (v3.3)
        else: a['nothingToRun']=True                                        # section AND critic current → DO NOT LAUNCH
json.dump(a,open(p,'w'),ensure_ascii=False)
print('  flags:',{k:a.get(k) for k in ('regrade','skipSynth','nothingToRun','cap')},'chunks',len(a.get('chunks') or []),'angles',a.get('findAngles',[]),[e['key'] for e in a.get('extraAngles',[])])
PY
done
echo; echo "== PASTE, one Workflow call per sweep (scriptPath = $K/research-workflow-v3.js; args = the JSON of the file named) =="
for n in $NAMES; do f=$(ls -t $S/args-$n-r*.json 2>/dev/null | head -1); echo "  $n -> $f ($(wc -c < $f 2>/dev/null) bytes)"; done
echo "Then: update $S/LAST-RUNS.json with the new runIds/argsFiles/tags; the autosave seals the kit every 5 min."
echo "⚠ TAG LAW: the tag (r6, r7…) is a LAUNCH COUNTER, not the owner's round. A launch with no findAngles/extraAngles COMPLETES the previous round."
echo "   The owner's S-BOUND rounds count FIND rounds only: tolkien/martin have none left; dnd/ai one targeted round (the PLACE register / the ARCHIVAL register);"
echo "   kay/leguin/wolfe/hobb one critic-driven top-up; NO further round after those. A file with nothingToRun=true is NOT launched."
