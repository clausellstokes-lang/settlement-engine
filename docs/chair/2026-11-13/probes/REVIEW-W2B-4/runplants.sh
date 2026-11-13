#!/bin/sh
# REVIEW-W2B-4: my plants of the nine commits' guards, through the third read's plant.sh, in a scratch worktree of the tip.
set -u
export TMPDIR=/tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/plantlogs
T1=tests/domain/coherence/vocabularyPageFindings.test.js; T2=tests/lint/presumedThings.walker.test.js
R=src/domain/facts/registeredWords.js; L=tests/lint/presumedThings.shared.mjs
cd /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/plant && npx vitest run --maxWorkers=1 $T1 $T2 > $TMPDIR/control.log 2>&1; echo "CONTROL exit $? ($(grep -E '^ +Tests ' $TMPDIR/control.log | tail -1))"
for p in p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12; do sh /home/user/settlement-engine/docs/chair/2026-11-13/probes/REVIEW-W2B-3/plant.sh /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/plant $p $R /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/probes/plants/$p.old /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/probes/plants/$p.new $T1 $T2; done
sh /home/user/settlement-engine/docs/chair/2026-11-13/probes/REVIEW-W2B-3/plant.sh /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/plant p13 $L /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/probes/plants/p13.old /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/probes/plants/p13.new $T2
cd /tmp/claude-0/-home-user-settlement-engine/90701a43-f3c2-541f-94eb-5ee148187f70/scratchpad/plant && git status --porcelain | head
