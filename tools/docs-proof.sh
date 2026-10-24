#!/bin/bash
# THE DOCS PROOF — runs master's doc-scanning suites plus the kit's extra doc-reading suites
# (docs-test-extra.txt) in a checkout of the branch under test. Since 2026-10-23 (P10: one home
# for code and documents) the FP volumes, the fold, the spine and the records live on master, so
# nothing is copied in: the docs under test are the checkout's own. Advisory; CI is the gate.
# Two suites read the ledger branch by its local ref, so fetch it first (as CI does):
#   git fetch --no-tags origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08
# Usage: WT=<checkout of the branch> KIT=<this kit> bash docs-proof.sh <label>
# Writes $KIT/logs/docs-proof-<label>.log and prints the summary + exit line.
# Never read this through a pipe (CLAUDE.md): the exit is captured explicitly below.
set -u
KIT="${KIT:?set KIT to the kit folder}"
WT="${WT:?set WT to a checkout of the branch under test (master or a docs branch cut from it)}"
LABEL="${1:-run}"
LOG="$KIT/logs/docs-proof-$LABEL.log"
mkdir -p "$KIT/logs"
cd "$WT" || exit 9
git rev-parse --verify --quiet refs/heads/review-fixes-2026-07-08 >/dev/null || {
  echo "the ledger ref refs/heads/review-fixes-2026-07-08 is missing: fetch it first (see the header)"; exit 8; }
EXTRA=$(tr '\n' ' ' < "$KIT/docs-test-extra.txt")
# shellcheck disable=SC2086
npx vitest run tests/docs tests/lint $EXTRA > "$LOG" 2>&1
EXIT=$?
echo "exit=$EXIT" >> "$LOG"
grep -E 'Test Files|Tests  |exit=' "$LOG" | tail -4
exit $EXIT
