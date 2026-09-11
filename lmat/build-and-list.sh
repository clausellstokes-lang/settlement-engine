#!/bin/sh
# $1 = label
set -u
D="$2"
LABEL="$1"
OUT="$3"
cd "$D" || exit 9
date > "$OUT.meta"
git rev-parse HEAD >> "$OUT.meta"
rm -rf dist
sh scripts/gate-mutex.sh --run -- npm run build > "$OUT.buildlog" 2>&1
BUILD_EXIT=$?
echo "BUILD_EXIT=$BUILD_EXIT" >> "$OUT.meta"
date >> "$OUT.meta"
if [ -d dist ]; then
  find dist -type f | LC_ALL=C sort | while read -r f; do
    printf '%s\t%s\t%s\n' "$(wc -c < "$f" | tr -d ' ')" "$(md5 -q "$f")" "$f"
  done > "$OUT.listing"
fi
echo "LISTING_LINES=$(wc -l < "$OUT.listing" 2>/dev/null | tr -d ' ')" >> "$OUT.meta"
exit $BUILD_EXIT
