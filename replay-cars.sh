#!/bin/sh
# replay-cars.sh <integration-dock> <product-base-sha> <dock:base> [<dock:base> ...]
# Cherry-picks every car of each source dock (its cars over ITS base, oldest first) onto the integration dock's HEAD.
# A conflict is resolved ONLY when the sole conflicted path is dossierMounts.js, and only by the registry's own law
# (resolve-mounts.py: keep-both mounts, complement-prune the dark list, verify; its EXIT gates add+continue).
# ⚠ The resolver opens its path RELATIVE to cwd and runs `git show base:path` inside <tree>, so it is invoked with
#   cwd = the integration dock and the REPO-RELATIVE path.
# Every resolved file is proven by MODULE EVALUATION. Anything else STOPS with the state described. POSIX sh.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
INT=$1; PBASE=$2; shift 2
MOUNTS=src/domain/display/stateProse/dossierMounts.js
[ -d "$INT/.git" ] || [ -f "$INT/.git" ] || { echo "⛔ not a dock: $INT"; exit 2; }
[ -z "$(git -C "$INT" status --porcelain -uall)" ] || { echo "⛔ integration dock dirty"; exit 2; }
START=$(git -C "$INT" rev-parse HEAD); echo "REPLAY onto $(git -C "$INT" rev-parse --short HEAD) (product base $PBASE)"
for pair in "$@"; do
  D=${pair%%:*}; B=${pair##*:}
  CARS=$(git -C "$D" rev-list --reverse "$B..HEAD"); N=$(printf '%s\n' "$CARS" | grep -c . || true)
  echo "--- $(basename "$D"): $N car(s) over $B"
  for c in $CARS; do
    S=$(git -C "$D" log -1 --format=%s "$c" | cut -c1-80)
    if git -C "$INT" cherry-pick -x --no-edit "$c" >/dev/null 2>&1; then echo "  ok   $(git -C "$INT" rev-parse --short HEAD)  $S"; continue; fi
    CONF=$(git -C "$INT" diff --name-only --diff-filter=U)
    if [ "$CONF" != "$MOUNTS" ]; then echo "  ⛔ STOP: conflict outside the registry on $c:"; printf '%s\n' "$CONF" | sed 's/^/       /'; echo "     dock left mid-cherry-pick for the chair; resolve by hand or 'git -C $INT cherry-pick --abort'"; exit 1; fi
    (cd "$INT" && python3 "$SC/resolve-mounts.py" "$MOUNTS" "$PBASE" "$INT") > "$SC/resolve-$(git -C "$D" rev-parse --short "$c").log" 2>&1 \
      && node -e "import('$INT/$MOUNTS').then(m=>{const u=m.UNMOUNTED_BLOCKS.length,r=m.DOSSIER_MOUNTS.length;const dup=m.DOSSIER_MOUNTS.filter(x=>x.rung==='sentence').map(x=>x.blockId);const s=new Set(dup);if(dup.length!==s.size){console.error('duplicate sentence mounts');process.exit(1)}console.log('   registry evaluates: mounts='+r+' dark='+u)}).catch(e=>{console.error('EVAL FAIL',e.message);process.exit(1)})" \
      && git -C "$INT" add "$MOUNTS" \
      && GIT_EDITOR=true git -C "$INT" cherry-pick --continue >/dev/null 2>&1 \
      || { echo "  ⛔ STOP: registry resolution failed on $c (see $SC/resolve-*.log); dock left mid-cherry-pick"; exit 1; }
    echo "  MERGED $(git -C "$INT" rev-parse --short HEAD)  $S  (registry resolved by law)"
  done
done
[ -z "$(git -C "$INT" status --porcelain -uall)" ] || { echo "⛔ porcelain not 0 after replay"; exit 1; }
echo "REPLAY OK: $(git -C "$INT" rev-list --count "$START..HEAD") cars added; HEAD=$(git -C "$INT" rev-parse --short HEAD)"
