#!/bin/bash
# drift-forecast.sh — THE STANDING DRIFT FORECAST (efficiency item 9; the owner's "Do all of this", 2026-09-20).
# Run by the chair at EVERY move of the integration tip. READ-ONLY: plain git reads plus `merge-tree
# --write-tree` (loose objects only; no ref, index or worktree is touched; `--no-optional-locks` throughout).
# For every lane worktree with uncomposed work it prints: base, how far behind, own commits, dirty rows,
# the files it shares with what the integration branch changed since its base (the conflict forecast),
# and — for committed work — git's own merge forecast. A lane that shows OVERLAP or CONFLICT is looked at
# NOW, while its author's context is warm, not at composition.
# usage: bash drift-forecast.sh [integration-ref]     (default fixes-2026-09-18-consist)
set -u
REPO=/Users/cstokes/Desktop/settlement-engine
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
REF="${1:-fixes-2026-09-18-consist}"
G() { git --no-optional-locks "$@"; }
TIP="$(G -C "$REPO" rev-parse --short=9 "$REF")"
echo "drift forecast against $REF = $TIP — $(date '+%Y-%m-%d %H:%M:%S')"
printf "%-18s %-9s %-7s %-4s %-5s %-8s %s\n" "lane" "base" "behind" "own" "dirty" "overlap" "verdict"
for W in "$SP"/lane-* "$SP"/batch-*; do
  [ -d "$W/.git" ] || [ -f "$W/.git" ] || continue
  N="$(basename "$W")"
  HEAD="$(G -C "$W" rev-parse HEAD 2>/dev/null)" || continue
  BASE="$(G -C "$REPO" merge-base "$HEAD" "$REF" 2>/dev/null)" || continue
  OWN="$(G -C "$REPO" rev-list --count "$BASE..$HEAD")"
  DIRTY="$(G -C "$W" status --short | grep -c .)"
  [ "$OWN" = "0" ] && [ "$DIRTY" = "0" ] && continue            # nothing uncomposed here
  BEHIND="$(G -C "$REPO" rev-list --count "$BASE..$REF")"
  # the lane's change set: its commits + its staged + its unstaged work, against its base
  CS="$( { G -C "$W" diff --name-only "$BASE"; G -C "$W" ls-files --others --exclude-standard; } | sort -u )"
  OVER=0; OVERFILES=""
  if [ -n "$CS" ] && [ "$BEHIND" != "0" ]; then
    MOVED="$(G -C "$REPO" diff --name-only "$BASE" "$REF" | sort -u)"
    OVERFILES="$(comm -12 <(printf '%s\n' "$CS") <(printf '%s\n' "$MOVED"))"
    OVER="$(printf '%s\n' "$OVERFILES" | grep -c .)"
  fi
  VERDICT="clean"
  [ "$OVER" != "0" ] && VERDICT="OVERLAP (read the hunks)"
  if [ "$OWN" != "0" ]; then
    if ! MT="$(G -C "$REPO" merge-tree --write-tree --name-only "$REF" "$HEAD" 2>&1)"; then
      VERDICT="CONFLICT: $(printf '%s\n' "$MT" | grep -E '^CONFLICT' | head -2 | tr '\n' ' ')"
    fi
  fi
  printf "%-18s %-9s %-7s %-4s %-5s %-8s %s\n" "$N" "$(printf '%s' "$BASE" | cut -c1-9)" "$BEHIND" "$OWN" "$DIRTY" "$OVER" "$VERDICT"
  [ "$OVER" != "0" ] && printf '%s\n' "$OVERFILES" | sed 's/^/        shared: /'
done
