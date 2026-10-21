#!/bin/bash
# CLOUD BOOTSTRAP — run once in a fresh cloud checkout of settlement-engine (default branch master).
# It fetches the FP ledger branch, unpacks the kit from its pushed preserve ref, creates the detached
# code-of-record worktree at master's sha, and links node_modules for the docs proof. READ IT FIRST.
set -eu
REPO="${1:-$PWD}"; cd "$REPO"
KITREF="${2:-refs/preserve/fp-final-kit-a73343ed-2026-10-21c}"
git fetch origin review-fixes-2026-07-08 "$KITREF:$KITREF" 2>/dev/null || git fetch origin review-fixes-2026-07-08
mkdir -p ../settlement-engine-kits/fp-final-a73343ed-2026-10-17
git archive "$KITREF" | tar -x -C ../settlement-engine-kits/fp-final-a73343ed-2026-10-17
KIT="$(cd ../settlement-engine-kits/fp-final-a73343ed-2026-10-17 && pwd)"
MASTER=$(git rev-parse --short origin/master)
git worktree add --detach "../master-code-of-record" "$MASTER" 2>/dev/null || true
[ -d node_modules ] || npm ci
ln -sfn "$REPO/node_modules" ../master-code-of-record/node_modules
# re-point the docs proof and the research-common note at this machine's paths
sed -i.bak "s#^KIT=.*#KIT=$KIT#; s#^WT=.*#WT=$(cd ../master-code-of-record && pwd)#; s#^LEDGER=.*#LEDGER=$REPO#" "$KIT/tools/docs-proof.sh"
echo "kit at $KIT · code of record at ../master-code-of-record ($MASTER) · ledger branch fetched (tip $(git rev-parse --short origin/review-fixes-2026-07-08))"
echo "NEXT: read $KIT/README.md (the top blocks) then $KIT/briefs/CLOUD-LANDING.md"
