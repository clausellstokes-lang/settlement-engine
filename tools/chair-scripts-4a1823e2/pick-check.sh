#!/bin/bash
# The chair's composition verb: cherry-pick ONE lane commit into the slot, then prove the pick
# reproduced the lane's proven bytes — equal file sets and byte-equal blobs — and that the tree is clean.
# usage: bash pick-check.sh <slot worktree> <sha>
set -u
SLOT="$1"; X="$2"
BEFORE="$(git -C "$SLOT" rev-parse --short HEAD)"
if ! git -C "$SLOT" cherry-pick "$X" > /dev/null 2>&1; then
  echo "PICK $X onto $BEFORE: CONFLICT OR FAILURE"; git -C "$SLOT" status --short | head -20; exit 1
fi
AFTER="$(git -C "$SLOT" rev-parse --short HEAD)"
A="$(git -C "$SLOT" diff-tree --no-commit-id --name-only -r "$X" | sort)"
B="$(git -C "$SLOT" diff-tree --no-commit-id --name-only -r HEAD | sort)"
NFILES="$(printf '%s\n' "$A" | grep -c .)"
if [ "$A" = "$B" ]; then FS="FILESET EQUAL ($NFILES)"; else FS="FILESET DIFFERS"; fi
BAD=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  bx="$(git -C "$SLOT" rev-parse -q --verify "$X:$f" 2>/dev/null || echo ABSENT)"
  bh="$(git -C "$SLOT" rev-parse -q --verify "HEAD:$f" 2>/dev/null || echo ABSENT)"
  if [ "$bx" != "$bh" ]; then BAD=$((BAD+1)); echo "  BLOB DIFFERS: $f ($bx vs $bh)"; fi
done <<< "$A"
DIRTY="$(git -C "$SLOT" status --short | grep -c .)"
echo "PICK $X: $BEFORE -> $AFTER | $FS | blobs differing: $BAD | dirty rows after: $DIRTY | $(git -C "$SLOT" log -1 --format=%s | cut -c1-90)"
[ "$A" = "$B" ] && [ "$BAD" = "0" ] && [ "$DIRTY" = "0" ]
