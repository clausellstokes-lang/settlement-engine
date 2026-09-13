#!/bin/sh
# autosave-handoff.sh — a SESSION-INDEPENDENT saver (nohup): every 5 minutes it exports the sweep state, rewrites the
# AUTOSTATUS block of RESUME-NOTE.md (between the markers; nothing else is touched), and seals the kit + resume-note refs
# with its OWN private index and a compare-and-swap ref update, so a chair seal running at the same moment cannot be
# clobbered (on a CAS miss it simply retries next cycle). Stop with: kill $(cat $SC/.autosave.pid)
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
REPO=/Users/cstokes/Desktop/settlement-engine
echo $$ > $SC/.autosave.pid
while true; do
  NOW=$(date '+%Y-%m-%d %H:%M:%S')
  STATE=$(cd $SC/prose-research && node sweep-state.mjs summary 2>/dev/null | cut -c1-300)
  PROD=$(git -C $REPO rev-parse --short claude/composite-r4 2>/dev/null); LEDG=$(git -C $REPO log -1 --format='%h %s' review-fixes-2026-07-08 2>/dev/null | cut -c1-90)
  LI=$(git -C $SC/laneLUIMAT log -1 --format='%h %s' 2>/dev/null | cut -c1-90); LIP=$(git -C $SC/laneLUIMAT status --porcelain -uall 2>/dev/null | wc -l | tr -d ' '); LIC=$(git -C $SC/laneLUIMAT rev-list --count dd5f13218..HEAD 2>/dev/null); AG=$(ls /Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/b43943b4-3b40-4fd9-bc63-9b9c9afb55b4/subagents/workflows/ 2>/dev/null | wc -l | tr -d ' ')
  GATE=$(ls -t $SC/gate-90*.log $SC/whole-901.log 2>/dev/null | head -1); GATES=$( [ -n "$GATE" ] && grep -E "GATE_DONE=|TRUE_EXIT=|PROOF_EXIT=" "$GATE" | tail -1 || echo none)
  PROCS=$(pgrep -fl "run-gate-90|run-ratchet-90|run-registers-90|build-90|proof-901" 2>/dev/null | cut -c1-60 | tr '\n' ';')
  RECEIPTS=$(ls -t $SC/receipt-*.md 2>/dev/null | head -3 | xargs -n1 basename | tr '\n' ' ')
  BLOCK="<!-- AUTOSTATUS -->
**AUTOSAVE $NOW** (autosave-handoff.sh, every 5 min; pid file .autosave.pid) · product claude/composite-r4 = $PROD · ledger = $LEDG · laneLUIMAT (the L-UI-MAT lane) = $LI ($LIC cars over dd5f13218, porcelain $LIP) · workflow runs this session: $AG · latest gate log: $(basename "$GATE" 2>/dev/null) → $GATES · chair processes alive: ${PROCS:-none} · newest receipts: $RECEIPTS · sweep state exported to prose-research/sweep/state-*.json: $STATE
<!-- /AUTOSTATUS -->"
  python3 - "$BLOCK" <<'PY'
import sys,io,re
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/RESUME-NOTE.md'
s=io.open(p,encoding='utf-8').read(); block=sys.argv[1]
if '<!-- AUTOSTATUS -->' in s: s=re.sub(r'<!-- AUTOSTATUS -->.*?<!-- /AUTOSTATUS -->', lambda m: block, s, flags=re.S)
else:
    i=s.find('\n**Seat:**'); s=s[:i+1]+block+'\n'+s[i+1:] if i>0 else block+'\n'+s
io.open(p,'w',encoding='utf-8').write(s)
PY
  cd $SC
  sh $SC/snapshot-lanes.sh >/dev/null 2>&1   # 09-06 14:25 owner: record every lane's progress — LANE-STATUS.md refreshed each cycle, sealed with the kit
  PREV=$(git -C $REPO rev-parse refs/preserve/chair-tools-2026-09-05)
  # THE SEAL LIST (2026-09-05 21:15, owner: "I will run out of the 5-hour window frequently — prepare"): EVERYTHING in the kit tree
  # except the docks (lane*/ are git worktrees), the probe farms, the copyrighted raw excerpts, the four fingerprint source texts,
  # pid/index scratch, and any file over 20 MB — plus every file the previous seal carried (so nothing ever drops out).
  git -C $REPO ls-tree -r --name-only $PREV > .kit-files.auto.txt
  find . -type f ! -path './lane*' ! -path './.farms/*' ! -path './prose-research/primary/raw/*' ! -name '*.pid' ! -name '.kit-*' ! -name '.rn-*' ! -name '.DS_Store' -size -20M | sed 's#^\./##' >> .kit-files.auto.txt
  sort -u .kit-files.auto.txt | grep -v "^prose-research/primary/raw/" | grep -vE "estate-state.txt|herald-pools.txt|herald-crier.txt|npc-ladder.txt" | while read f; do [ -f "$f" ] && echo "$f"; done > .kit-files.auto.present.txt
  # SEAL EVERY LANE DOCK'S TIP (a dock is not storage; refs/preserve is): refs/preserve/dock-<name>-live moves with the dock each cycle
  for d in $SC/lane*/; do n=$(basename "$d"); h=$(git -C "$d" rev-parse HEAD 2>/dev/null) && git -C $REPO update-ref "refs/preserve/dock-$n-live" "$h" 2>/dev/null; done
  export GIT_INDEX_FILE=$SC/.kit-index-auto; rm -f $GIT_INDEX_FILE
  git -C $REPO --work-tree=$SC add -f --pathspec-from-file=$SC/.kit-files.auto.present.txt 2>/dev/null
  TREE=$(git -C $REPO write-tree 2>/dev/null)
  if [ -n "$TREE" ] && [ "$TREE" != "$(git -C $REPO rev-parse $PREV^{tree})" ]; then
    NEW=$(git -C $REPO commit-tree $TREE -p $PREV -m "AUTOSAVE kit $NOW"); git -C $REPO update-ref refs/preserve/chair-tools-2026-09-05 $NEW $PREV 2>/dev/null && echo "$NOW kit sealed $NEW" >> $SC/autosave.log
  fi
  unset GIT_INDEX_FILE
  export GIT_INDEX_FILE=$SC/.rn-index-auto; rm -f $GIT_INDEX_FILE
  P2=$(git -C $REPO rev-parse refs/preserve/resume-note-2026-09-05); git -C $REPO --work-tree=$SC add -f RESUME-NOTE.md 2>/dev/null; T2=$(git -C $REPO write-tree 2>/dev/null)
  if [ -n "$T2" ] && [ "$T2" != "$(git -C $REPO rev-parse $P2^{tree})" ]; then N2=$(git -C $REPO commit-tree $T2 -p $P2 -m "AUTOSAVE resume-note $NOW"); git -C $REPO update-ref refs/preserve/resume-note-2026-09-05 $N2 $P2 2>/dev/null && echo "$NOW note sealed $N2" >> $SC/autosave.log; fi
  unset GIT_INDEX_FILE
  sleep 300
done
