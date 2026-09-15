#!/bin/sh
# compose-and-trail.sh <dock-name> <base-for-3way> — compose one dock onto laneCONSIST-930 by the chair's compose.sh, add the
# Seat/Lane trailers by the message-only filter, then prove every file of the dock equals its clean three-way merge in the consist
# (base = the dock's cut point; ours = the consist before; theirs = the dock tip), except the regenerated files named. POSIX sh.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad; MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad; P=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f86a239c-ba8e-464d-a904-e4b70a0c4b2e/scratchpad
C=$SC/kit/laneCONSIST-930; DOCK=$1; BASE=$2
[ -n "$DOCK" ] && [ -n "$BASE" ] || { echo "usage: <dock-name> <base-sha>"; exit 9; }
cd $C || exit 9
[ -z "$(git status --porcelain)" ] || { echo "REFUSED: consist dirty"; exit 8; }
OURS=$(git rev-parse HEAD); TIP=$(git -C $SC/kit/$DOCK rev-parse HEAD)
echo "consist before=$(git rev-parse --short $OURS) dock $DOCK tip=$(git rev-parse --short $TIP) base=$BASE"
sh $P/c930/compose.sh $C f73bdbf16 $DOCK || { echo "COMPOSE FAILED"; exit 1; }
echo "--- trailers:"
git rev-list --reverse $OURS..HEAD | while read c; do echo "$c $(git log -1 --format='%T %ai %ci' $c)"; done > $MY/c931/trail-before-$DOCK.txt
SEAT_DEFAULT_LANE=$(echo $DOCK | sed 's/lane-\(LT[0-9]*\).*/\1/') FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter "python3 $MY/seat-msg-filter.py" $OURS..HEAD >/dev/null 2>&1
git rev-list --reverse $OURS..HEAD | while read c; do echo "$c $(git log -1 --format='%T %ai %ci' $c)"; done > $MY/c931/trail-after-$DOCK.txt
echo "trees+dates identical: $(cut -d" " -f2- $MY/c931/trail-before-$DOCK.txt > $MY/c931/tb.tmp; cut -d" " -f2- $MY/c931/trail-after-$DOCK.txt > $MY/c931/ta.tmp; cmp -s $MY/c931/tb.tmp $MY/c931/ta.tmp >/dev/null && echo YES || echo NO)"
git update-ref -d refs/original/HEAD 2>/dev/null
echo "seat census over the new cars: $(for c in $(git rev-list $OURS..HEAD); do git log -1 --format=%B $c | grep -c '^Seat: \(Opus 5 — Fable-unvalidated\|Fable 5\.1 — validated\)$'; done | sort | uniq -c | tr '\n' ' ')"
echo "--- three-way byte check (base $BASE / ours $(git rev-parse --short $OURS) / theirs $(git rev-parse --short $TIP)):"
T=$(mktemp -d)
for f in $(git diff --name-only $BASE $TIP); do
  git show $BASE:$f > $T/b 2>/dev/null || : > $T/b; git show $OURS:$f > $T/o 2>/dev/null || : > $T/o; git show $TIP:$f > $T/t 2>/dev/null || : > $T/t
  git merge-file -p $T/o $T/b $T/t > $T/m 2>/dev/null; rc=$?; git show HEAD:$f > $T/c 2>/dev/null || : > $T/c
  if cmp -s $T/m $T/c; then echo "OK   $f"; else echo "DIFF $f (merge rc=$rc; head==theirs: $(cmp -s $T/t $T/c && echo yes || echo no))"; fi
done
echo "CONSIST_TIP=$(git rev-parse --short HEAD) cars=$(git rev-list --count f73bdbf16..HEAD) porcelain=$(git status --porcelain | wc -l | tr -d ' ')"
