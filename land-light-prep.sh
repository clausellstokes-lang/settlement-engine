#!/bin/sh
# land-light-prep.sh <base-sha-full = the §900 CAS> — the LIGHTING landing's dock + replay (LIGHTING-LANDING-PLAN.md, order of acts 1).
# Refuses unless the product tip IS the base. Replays the seven built L-HOMES cars (5 and 7 were refused, zero bytes) and, if sealed, STRIPPER-UNIFY.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine; BASE=$1
echo "$BASE" | grep -qE '^[0-9a-f]{40}$' || { echo "usage: <base-sha-full>"; exit 9; }
[ "$(git -C $REPO rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ the product tip is not $BASE"; exit 1; }
sh $SC/mkdock.sh laneLIGHTINT "$BASE" | tail -1
# ⚠ EXPECTED CONFLICTS (hand-merge, never --ours/--theirs on a file the other side also touched — see the ViabilityTab memory):
#   LH8's densityCreateBoundary.js vs HORIZON-B2's EXECUTOR class (landed in §900) — keep both, then check B2's row against LH8 arm 5.
#   LH9 replays over LH1's tip (408d2e2b1): pass laneLH9:408d2e2b1 so only its own car is picked.
STRIP=""; [ -n "$(git -C $SC/laneSTRIP for-each-ref refs/preserve/stripper-unify-2026-09-05 2>/dev/null)" ] && STRIP="$SC/laneSTRIP:38474a59e"
sh $SC/replay-cars.sh $SC/laneLIGHTINT "$BASE" $SC/laneLH1:38474a59e $SC/laneLH2:38474a59e $SC/laneLH3:38474a59e $SC/laneLH4:38474a59e $SC/laneLH6:38474a59e $SC/laneLH8:38474a59e $SC/laneLH9:408d2e2b1 $STRIP | tail -30
D=$SC/laneLIGHTINT; cd $D
echo "LIGHT PREP: $(git rev-list --count $BASE..HEAD) cars over $(echo $BASE | cut -c1-9); HEAD=$(git rev-parse --short HEAD); porcelain=$(git status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: the chair cars (LIGHTING-LANDING-PLAN.md §Chair cars), the BUILD + listing diff STOP (margin − 100 B), the whole suite (no filter), then registers LAST, kit, gate, CAS, §901."
