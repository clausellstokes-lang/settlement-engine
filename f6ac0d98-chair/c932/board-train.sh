#!/bin/sh
# board-train.sh <lane-no> <brief-path> <dock-name> <FAMILY-CODE>  — cuts the dock at the slot and fills the train prompt
set -e
LANE="$1"; BRIEF="$2"; DOCK="$3"; FAM="$4"
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
[ -f "$BRIEF" ] || { echo "no brief at $BRIEF" >&2; exit 2; }
[ -d "$SC/kit/$DOCK" ] || sh "$SC/kit/mkdock.sh" "$DOCK" a5876c0ea
[ -z "$(git -C "$SC/kit/$DOCK" status --porcelain)" ] || { echo "dock $DOCK dirty" >&2; exit 3; }
sed -e "s#__LANE__#$LANE#g" -e "s#__BRIEF__#$BRIEF#g" -e "s#__DOCK__#$DOCK#g" -e "s#__FAMILY__#$FAM#g" "$MY/c932/dispatch-train.template.md" > "$MY/c932/dispatch-train-$LANE.md"
echo "dock $DOCK at $(git -C "$SC/kit/$DOCK" rev-parse --short HEAD) porcelain 0; prompt $MY/c932/dispatch-train-$LANE.md ($(wc -c < "$MY/c932/dispatch-train-$LANE.md") bytes)"
