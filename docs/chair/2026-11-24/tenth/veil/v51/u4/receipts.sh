#!/bin/sh
# Copy RIVAL's partial receipts onto the documents branch (the chair, 01:04: every arm's partial result in a pushed file):
# exits.txt, every measures-*.txt, the last 40 lines of every arm log; then commit and push the documents branch (ls-remote first).
R=/var/tmp/v51/out/rival; D=/home/user/settlement-engine/docs/chair/2026-11-24/tenth/veil/v51/u4/rival-receipts
mkdir -p $D; cp $R/exits.txt $D/ 2>/dev/null; for f in $R/measures-*.txt; do [ -f "$f" ] && cp "$f" $D/; done
for f in $R/arm-*.log $R/*-whole.log $R/typecheck.log $R/eslint.log $R/cost.log; do [ -f "$f" ] && tail -40 "$f" > $D/$(basename "$f").tail; done
cp -r $R/interrupted-0103 $D/ 2>/dev/null
cd /home/user/settlement-engine && git add $D && git commit -q -m "docs(veil, VEIL-51): RIVAL's receipts so far ($(date -u +%H:%M) UTC)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1Rb66YNz4X5xJLwk3k" && git ls-remote origin lane/veil-51-2026-11-24 > /dev/null && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE git push origin lane/veil-51-2026-11-24:lane/veil-51-2026-11-24 > /var/tmp/v51/log/push-receipts.log 2>&1; echo "receipts push exit=$? $(date -u +%H:%M:%S)" >> /var/tmp/v51/log/push-receipts.log
