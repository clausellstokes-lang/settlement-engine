#!/bin/sh
# autosave-handoff.sh — a SESSION-INDEPENDENT saver (nohup): every 5 minutes it exports the sweep state, rewrites the
# AUTOSTATUS block of RESUME-NOTE.md (between the markers; nothing else is touched), and seals the kit + resume-note refs
# with its OWN private index and a compare-and-swap ref update, so a chair seal running at the same moment cannot be
# clobbered (on a CAS miss it simply retries next cycle). Stop with: kill $(cat $SC/.autosave.pid)
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine
echo $$ > $SC/.autosave.pid
while true; do
  NOW=$(date '+%Y-%m-%d %H:%M:%S')
  STATE=$(cd $SC/prose-research && node sweep-state.mjs summary 2>/dev/null | cut -c1-300)
  PROD=$(git -C $REPO rev-parse --short claude/composite-r4 2>/dev/null); LEDG=$(git -C $REPO log -1 --format='%h %s' review-fixes-2026-07-08 2>/dev/null | cut -c1-90)
  LI=$(git -C $SC/laneLIGHTINT log -1 --format='%h %s' 2>/dev/null | cut -c1-90); LIP=$(git -C $SC/laneLIGHTINT status --porcelain -uall 2>/dev/null | wc -l | tr -d ' '); LIC=$(git -C $SC/laneLIGHTINT rev-list --count 04bb92d19..HEAD 2>/dev/null)
  GATE=$(ls -t $SC/gate-90*.log $SC/whole-901.log 2>/dev/null | head -1); GATES=$( [ -n "$GATE" ] && grep -E "GATE_DONE=|TRUE_EXIT=|PROOF_EXIT=" "$GATE" | tail -1 || echo none)
  PROCS=$(pgrep -fl "run-gate-90|run-ratchet-90|run-registers-90|build-90|proof-901" 2>/dev/null | cut -c1-60 | tr '\n' ';')
  RECEIPTS=$(ls -t $SC/receipt-*.md 2>/dev/null | head -3 | xargs -n1 basename | tr '\n' ' ')
  BLOCK="<!-- AUTOSTATUS -->
**AUTOSAVE $NOW** (autosave-handoff.sh, every 5 min; pid file .autosave.pid) · product claude/composite-r4 = $PROD · ledger = $LEDG · laneLIGHTINT = $LI ($LIC cars over 04bb92d19, porcelain $LIP) · latest gate log: $(basename "$GATE" 2>/dev/null) → $GATES · chair processes alive: ${PROCS:-none} · newest receipts: $RECEIPTS · sweep state exported to prose-research/sweep/state-*.json: $STATE
<!-- /AUTOSTATUS -->"
  python3 - "$BLOCK" <<'PY'
import sys,io,re
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/RESUME-NOTE.md'
s=io.open(p,encoding='utf-8').read(); block=sys.argv[1]
if '<!-- AUTOSTATUS -->' in s: s=re.sub(r'<!-- AUTOSTATUS -->.*?<!-- /AUTOSTATUS -->', lambda m: block, s, flags=re.S)
else:
    i=s.find('\n**Seat:**'); s=s[:i+1]+block+'\n'+s[i+1:] if i>0 else block+'\n'+s
io.open(p,'w',encoding='utf-8').write(s)
PY
  cd $SC
  PREV=$(git -C $REPO rev-parse refs/preserve/chair-tools-2026-09-05)
  git -C $REPO ls-tree -r --name-only $PREV > .kit-files.auto.txt
  for f in RESUME-NOTE.md prose-research/research-workflow.js prose-research/research-workflow-v2.js prose-research/sweep-state.mjs prose-research/export-sweep-state.mjs proof-901.sh; do echo "$f" >> .kit-files.auto.txt; done
  ls prose-research/sweep/state-*.json prose-research/sweep/verdicts-*.json prose-research/sweep/kept-*.json prose-research/sweep/merged-*.json prose-research/sweep/chunks/*.json prose-research/sweep/*.md 2>/dev/null >> .kit-files.auto.txt; ls receipt-*.md *.sh *.py *.log 2>/dev/null >> .kit-files.auto.txt
  sort -u .kit-files.auto.txt | grep -v "^prose-research/primary/raw/" | grep -vE "estate-state.txt|herald-pools.txt|herald-crier.txt|npc-ladder.txt" | while read f; do [ -f "$f" ] && echo "$f"; done > .kit-files.auto.present.txt
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
