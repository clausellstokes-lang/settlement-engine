#!/bin/sh
# snapshot-lanes.sh — writes $SC/LANE-STATUS.md: every live lane's dock tip, cars, porcelain, receipt head; every sweep's
# verdict/section/critic state; the workflow run dirs of the CURRENT chair session. Run by autosave-handoff.sh every cycle
# (chair, 2026-09-06 14:40, owner: "record all of the progress in each lane — I'm going to switch accounts").
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
SESS=${CHAIR_SESSION:-19ace14d-e63e-4584-ad77-d83bd8e2cd0f}
O=$SC/LANE-STATUS.md; T=$O.tmp
{
echo "# LANE-STATUS — written $(date '+%Y-%m-%d %H:%M:%S') by snapshot-lanes.sh (auto every 5 min; a successor reads THIS first, then RESUME-NOTE.md)"
echo
echo "product claude/composite-r4 = $(git -C $REPO rev-parse --short claude/composite-r4) · ledger = $(git -C $REPO log -1 --format='%h %s' review-fixes-2026-07-08 | cut -c1-100)"
echo
echo "## BUILD / KIT LANES (dock · base · cars · porcelain · receipt)"
for pair in "laneLUIMAT:dd5f13218:receipt-l-ui-mat.md:L-UI-MAT" "laneLDEFAULT:fd36f0298:receipt-l-default.md:L-DEFAULT(landed §903)"; do
  d=${pair%%:*}; rest=${pair#*:}; base=${rest%%:*}; rest=${rest#*:}; rec=${rest%%:*}; name=${rest#*:}
  D=$SC/$d; [ -d "$D" ] || { echo "- $name: dock $d ABSENT"; continue; }
  echo "- **$name** dock \`$d\` HEAD $(git -C $D rev-parse --short HEAD) · $(git -C $D rev-list --count $base..HEAD 2>/dev/null) cars over $base · porcelain $(git -C $D status --porcelain -uall | wc -l | tr -d ' ') · last commits:"
  git -C $D log --oneline -4 $base..HEAD 2>/dev/null | sed 's/^/    /'
  [ "$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')" != "0" ] && { echo "    porcelain (uncommitted work in the dock — commit it FIRST after re-proving):"; git -C $D status --porcelain -uall | head -12 | sed 's/^/      /'; }
  if [ -f "$SC/$rec" ]; then echo "    receipt \`$rec\` (mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/$rec)) head:"; head -14 "$SC/$rec" | cut -c1-220 | sed 's/^/      | /'; else echo "    receipt $rec: NOT WRITTEN YET"; fi
done
for rec in receipt-s12a-checkpair.md:S12A-CHECKPAIR receipt-r15-tail.md:R15-TAIL; do f=${rec%%:*}; n=${rec#*:}
  if [ -f "$SC/$f" ]; then echo "- **$n** (kit/read-only lane) receipt \`$f\` (mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/$f)) head:"; head -14 "$SC/$f" | cut -c1-220 | sed 's/^/      | /'; else echo "- **$n**: receipt $f NOT WRITTEN YET"; fi; done
echo "- R15-TAIL checkpoint: $( [ -f $SC/prose-research/sweep/R15-tail-classification.json ] && python3 -c "import json;d=json.load(open('$SC/prose-research/sweep/R15-tail-classification.json'));print('rows',len(d.get('rows',[])),'files',len(d.get('perFile',{})),'complete',d.get('complete'))" 2>/dev/null || echo 'no JSON yet')"
echo "- S12A: check-pair.v1.mjs $( [ -f $SC/prose-research/check-pair.v1.mjs ] && echo present || echo absent ); check-pair.mjs mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/prose-research/check-pair.mjs)"
echo
echo "## RESEARCH SWEEPS (state = claims/verdicts/kept; verdict files; section/critic mtimes) — round tags in sweep/LAST-RUNS.json"
cd $SC/prose-research && node sweep-state.mjs summary 2>/dev/null | python3 -c "
import json,sys,os,glob,time
d=json.loads(sys.stdin.read()); S='sweep'
for n in ['tolkien','martin','dnd','ai','kay','leguin','wolfe','hobb']:
    s=d.get(n,{}); vf=len(glob.glob(S+'/verdicts-%s-*.json'%n)); tri=len(glob.glob(S+'/verdicts-%s-triage-*.json'%n)); rg=sorted(glob.glob(S+'/verdicts-%s-regrade-*.json'%n))
    def mt(p): return time.strftime('%m-%d %H:%M',time.localtime(os.path.getmtime(p))) if os.path.exists(p) else 'absent'
    print('- **%s**: claims %s · verdicts %s (todo %s) · kept %s · partial %s · verdict files %d (triage %d, regrade %s) · section %s · critic %s'%(n,s.get('claims'),s.get('verdicts'),(s.get('claims',0)-s.get('verdicts',0)),s.get('kept'),s.get('partial'),vf,tri,(os.path.basename(rg[-1])[len('verdicts-%s-regrade-'%n):-5] if rg else 'none'),mt(S+'/section-%s.md'%n),mt(S+'/critic-%s.md'%n)))
"
echo "- LAST-RUNS: $(python3 -c "import json;d=json.load(open('$SC/prose-research/sweep/LAST-RUNS.json'));print(', '.join('%s %s/%s'%(k,v['tag'],v['runId']) for k,v in d.items() if k!='_doc'))")"
echo
echo "## WORKFLOW RUNS of chair session $SESS (journal lines; a run dies with the session — the FILES above are the checkpoint)"
for d in /Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/$SESS/subagents/workflows/wf_*; do [ -d "$d" ] && echo "- $(basename $d): $(wc -l < $d/journal.jsonl 2>/dev/null | tr -d ' ') journal lines, $(ls $d/agent-*.jsonl 2>/dev/null | wc -l | tr -d ' ') agents"; done
echo
echo "## PROCESSES: $(pgrep -fl 'run-gate|run-ratchet|run-registers|proof-9|autosave|inflight-scan' | cut -c1-70 | tr '\n' ';')"
echo "load: $(uptime | sed 's/.*averages: //')"
} > $T 2>&1 && mv $T $O
