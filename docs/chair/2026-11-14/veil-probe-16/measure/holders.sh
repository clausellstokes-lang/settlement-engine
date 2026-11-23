#!/bin/sh
# holders.sh <file...>: by content, each lane whose blob of the file differs from the integration line's (or exists where the line has none)
cd /var/tmp/v16/holders.git
for f in "$@"; do
  base=$(git rev-parse -q --verify refs/remotes/origin/lane/integration-2026-11-07:$f 2>/dev/null || echo none)
  own=$(git rev-parse -q --verify refs/remotes/origin/lane/coherence-veil-2026-11-11:$f 2>/dev/null || echo none)
  echo "== $f line=$base veil=$own"
  for r in $(git for-each-ref --format='%(refname)' refs/remotes/origin/lane); do
    b=$(git rev-parse -q --verify $r:$f 2>/dev/null || echo none)
    [ "$b" = "$base" ] && continue
    n=${r#refs/remotes/origin/}; [ "$n" = lane/coherence-veil-2026-11-11 ] && continue
    echo "  differs: $n blob=$b$( [ "$b" = "$own" ] && echo ' (= veil tip)')"
  done
done
