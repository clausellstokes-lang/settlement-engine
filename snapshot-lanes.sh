#!/bin/sh
# snapshot-lanes.sh — writes $SC/LANE-STATUS.md: every live lane's dock tip, cars, porcelain, receipt head; every sweep's
# verdict/section/critic state; the workflow run dirs of the CURRENT chair session. Run by autosave-handoff.sh every cycle
# (chair, 2026-09-06 14:40, owner: "record all of the progress in each lane — I'm going to switch accounts").
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
REPO=/Users/cstokes/Desktop/settlement-engine
# 09-06 23:57 (session 405b5e7e): the chair session is SELF-DETECTED — the session dir owning the most recently created workflow run dir
# (a new agent file bumps the run dir's mtime); CHAIR_SESSION overrides; the last chair's id is the fallback. A hardcoded id went stale at every switch.
SESS=${CHAIR_SESSION:-$(ls -td /Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/*/subagents/workflows/wf_*/ 2>/dev/null | head -1 | awk -F/ '{print $(NF-4)}')}
[ -z "$SESS" ] && SESS=b43943b4-3b40-4fd9-bc63-9b9c9afb55b4
O=$SC/LANE-STATUS.md; T=$O.tmp
{
echo "# LANE-STATUS — written $(date '+%Y-%m-%d %H:%M:%S') by snapshot-lanes.sh (auto every 5 min; a successor reads THIS first, then RESUME-NOTE.md)"
echo
echo "product claude/composite-r4 = $(git -C $REPO rev-parse --short claude/composite-r4) · ledger = $(git -C $REPO log -1 --format='%h %s' review-fixes-2026-07-08 | cut -c1-100)"
echo
echo "## BUILD / KIT LANES (dock · base · cars · porcelain · receipt)"
for pair in "laneRW-DEF11:f73bdbf16:receipt-rewrite.md:REWRITE 8b DS-DEF-11 (the validation block; cure round)" "laneRW-DEFW:f73bdbf16:receipt-rewrite.md:REWRITE 8b-W (the wiring car, landed in its dock = the consist lineage)" "laneRW-DEF2:f2da5a3ee:receipt-rewrite.md:DS-DEF-2 (waits for the tables)" "laneRW-DEF1:f2da5a3ee:receipt-rewrite.md:DS-DEF-1 (waits)" "laneRW-DEF5:f2da5a3ee:receipt-rewrite.md:DS-DEF-5 (waits)" "laneRW-DEF3:f2da5a3ee:receipt-rewrite.md:DS-DEF-3 (waits)" "laneRW-DEF4:f2da5a3ee:receipt-rewrite.md:DS-DEF-4 (waits)" "laneRW-DEF6:f2da5a3ee:receipt-rewrite.md:DS-DEF-6 (waits)" "laneRW-DEF8:f2da5a3ee:receipt-rewrite.md:DS-DEF-8 (waits)" "laneRW-DEF9:f2da5a3ee:receipt-rewrite.md:DS-DEF-9 (waits)"; do
  d=${pair%%:*}; rest=${pair#*:}; base=${rest%%:*}; rest=${rest#*:}; rec=${rest%%:*}; name=${rest#*:}
  D=$SC/$d; [ -d "$D" ] || { echo "- $name: dock $d ABSENT"; continue; }
  echo "- **$name** dock \`$d\` HEAD $(git -C $D rev-parse --short HEAD) · $(git -C $D rev-list --count $base..HEAD 2>/dev/null) cars over $base · porcelain $(git -C $D status --porcelain -uall | wc -l | tr -d ' ') · last commits:"
  git -C $D log --oneline -4 $base..HEAD 2>/dev/null | sed 's/^/    /'
  [ "$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')" != "0" ] && { echo "    porcelain (uncommitted work in the dock — commit it FIRST after re-proving):"; git -C $D status --porcelain -uall | head -12 | sed 's/^/      /'; }
  if [ -f "$SC/$rec" ]; then echo "    receipt \`$rec\` (mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/$rec)) head:"; head -14 "$SC/$rec" | cut -c1-220 | sed 's/^/      | /'; else echo "    receipt $rec: NOT WRITTEN YET"; fi
done
for rec in "receipt-horizon-b6.md:HORIZON-B6 (COMPLETE, landed §907)" receipt-s12a-checkpair.md:S12A-CHECKPAIR receipt-r15-tail.md:R15-TAIL; do f=${rec%%:*}; n=${rec#*:}
  if [ -f "$SC/$f" ]; then echo "- **$n** (kit/read-only lane) receipt \`$f\` (mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/$f)) head:"; head -14 "$SC/$f" | cut -c1-220 | sed 's/^/      | /'; else echo "- **$n**: receipt $f NOT WRITTEN YET"; fi; done
echo "- R15-TAIL checkpoint: $( [ -f $SC/prose-research/sweep/R15-tail-classification.json ] && python3 -c "import json;d=json.load(open('$SC/prose-research/sweep/R15-tail-classification.json'));print('rows',len(d.get('rows',[])),'files',len(d.get('perFile',{})),'complete',d.get('complete'))" 2>/dev/null || echo 'no JSON yet')"
echo "- S12A: check-pair.v1.mjs $( [ -f $SC/prose-research/check-pair.v1.mjs ] && echo present || echo absent ); check-pair.mjs mtime $(stat -f '%Sm' -t '%m-%d %H:%M' $SC/prose-research/check-pair.mjs)"
echo
echo "- **ANCHOR-905** dock \`laneANCHOR905\` HEAD $(git -C $SC/laneANCHOR905 rev-parse --short HEAD 2>/dev/null) · $(git -C $SC/laneANCHOR905 rev-list --count 6582958ce..HEAD 2>/dev/null) cars over 6582958ce · porcelain $(git -C $SC/laneANCHOR905 status --porcelain -uall 2>/dev/null | wc -l | tr -d ' ') · HOLD-VITEST $( [ -e $SC/HOLD-VITEST ] && echo PRESENT || echo absent ) · receipt head:"; [ -f $SC/receipt-anchor-905.md ] && head -6 $SC/receipt-anchor-905.md | sed 's/^/      | /'
echo "- **VIS-906** (same dock laneANCHOR905, on top of the anchor car) receipt head:"; [ -f $SC/receipt-vis-906.md ] && head -6 $SC/receipt-vis-906.md | sed 's/^/      | /'
echo "- **L-PROBE-2 (chair)**: cheap $(grep -c 'TRUE_EXIT=0' $SC/lprobe2-cheap.log 2>/dev/null)/6 tips · full: $(tail -1 $SC/lprobe2-full-904.log 2>/dev/null | cut -c1-120) · bracket: $(tail -1 $SC/lprobe2-certify-bracket.log 2>/dev/null | cut -c1-100)"
echo "## REWRITE 8b PACKETS (rewrite/DS-DEF-n/<pool>/: skeleton · draft-round-N · refine · kept · refute* · cure-round-N · cured-round-N; JUDGMENT.md / JUDGMENT-cure.md per block; the entailment + referent tables)"
for b in $SC/rewrite/DS-DEF-*; do case "$b" in *.attempt*) continue;; esac; n=$(ls -d $b/*/ 2>/dev/null | wc -l | tr -d ' '); [ "$n" = "0" ] && continue
  echo "- $(basename $b): pools $n · skeleton $(ls $b/*/skeleton.md 2>/dev/null | wc -l | tr -d ' ') · draft $(ls $b/*/draft-round-*.md 2>/dev/null | wc -l | tr -d ' ') · refine $(ls $b/*/refine.md 2>/dev/null | wc -l | tr -d ' ') · kept $(ls $b/*/kept.md 2>/dev/null | wc -l | tr -d ' ') · refute $(ls $b/*/refute*.md 2>/dev/null | wc -l | tr -d ' ') · cure $(ls $b/*/cure-round-*.md 2>/dev/null | wc -l | tr -d ' ') · cured $(ls $b/*/cured-round-*.md 2>/dev/null | wc -l | tr -d ' ') · JUDGMENT $( [ -f $b/JUDGMENT.md ] && echo yes || echo no ) · JUDGMENT-cure $( [ -f $b/JUDGMENT-cure.md ] && echo yes || echo no )"; done
echo "- entailment: surveys $(ls $SC/rewrite/entailment/*.survey.md 2>/dev/null | grep -vc referent) · refutes $(ls $SC/rewrite/entailment/*.refute.md 2>/dev/null | grep -vc referent) · ENTAILMENT-TABLE.draft.md $( [ -f $SC/rewrite/entailment/ENTAILMENT-TABLE.draft.md ] && stat -f '%Sm %z B' -t '%m-%d %H:%M' $SC/rewrite/entailment/ENTAILMENT-TABLE.draft.md || echo absent ) · referent surveys $(ls $SC/rewrite/entailment/*.referent.survey.md 2>/dev/null | wc -l | tr -d ' ') · referent refutes $(ls $SC/rewrite/entailment/*.referent.refute.md 2>/dev/null | wc -l | tr -d ' ') · REFERENT-TABLE.draft.md $( [ -f $SC/rewrite/entailment/REFERENT-TABLE.draft.md ] && stat -f '%Sm %z B' -t '%m-%d %H:%M' $SC/rewrite/entailment/REFERENT-TABLE.draft.md || echo absent )"
echo "- HOLD-VITEST $( [ -e $SC/HOLD-VITEST ] && echo PRESENT || echo absent ) · runner count $(pgrep -fl 'vit''est' | grep -v gate-mutex | wc -l | tr -d ' ')"
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
echo "- LAST-RUNS: $(python3 -c "import json;d=json.load(open('$SC/prose-research/sweep/LAST-RUNS.json'));print(', '.join('%s %s/%s'%(k,v['tag'],v['runId']) for k,v in d.items() if not k.startswith('_')))")"
echo
echo "## WORKFLOW RUNS of chair session $SESS — PER AGENT, PER LANE (owner 09-11: save progress per agent per lane; a run dies with the session, its journal + the packets + the dock commits are the checkpoint; journals mirrored under \$SC/_progress/<wf>/)"
python3 $SC/snapshot-agents.py $SESS 2>&1
echo
echo "## PROCESSES: $(pgrep -fl 'run-gate|run-ratchet|run-registers|proof-9|autosave|inflight-scan' | cut -c1-70 | tr '\n' ';')"
echo "load: $(uptime | sed 's/.*averages: //')"
} > $T 2>&1 && mv $T $O
