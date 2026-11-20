#!/bin/sh
# confine-two.sh <base> <tip> [--plant <file>:<from>:<to>]
# THE SEAT LANE'S CONFINEMENT PROOF (brief docs/chair/2026-11-20/content/seat/briefs/CONFINE.md).
# Makes two `git archive` trees (base, tip) under a temporary directory it names, symlinks the checkout's node_modules
# into each, runs this checkout's confine-hash.mjs from each tree's root (so each tree births with its OWN src/ and
# tests/), prints both trees' lines and EQUAL or DIFFER (on the `all` line), and removes the temporaries.
# It reads the repository only through `git archive` and `git rev-parse`: never the checkout's working tree, index or
# branches, and it sets none of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX.
# --plant (the instrument's own control): in the TIP's temporary tree ONLY, the first <from> in <file> becomes <to>
# (the run stops if <from> is not there). Exit: 0 EQUAL, 1 DIFFER, 2 a failure.
set -eu
[ $# -ge 2 ] || { echo "usage: confine-two.sh <base> <tip> [--plant <file>:<from>:<to>]" >&2; exit 2; }
BASE=$1; TIP=$2; shift 2
PLANT=
if [ $# -ge 2 ] && [ "$1" = "--plant" ]; then PLANT=$2; shift 2; fi
[ $# -eq 0 ] || { echo "unexpected argument: $1" >&2; exit 2; }

ROOT=$(git rev-parse --show-toplevel)
HASH="$ROOT/docs/chair/2026-11-20/content/seat/confine/confine-hash.mjs"
[ -f "$HASH" ] || { echo "no $HASH" >&2; exit 2; }
[ -d "$ROOT/node_modules" ] || { echo "no node_modules in $ROOT (npm ci first)" >&2; exit 2; }
BASE_SHA=$(git -C "$ROOT" rev-parse --verify "$BASE^{commit}")
TIP_SHA=$(git -C "$ROOT" rev-parse --verify "$TIP^{commit}")

TMP=$(mktemp -d "${TMPDIR:-/tmp}/confine-two.XXXXXX")
trap 'rm -rf "$TMP"' EXIT INT TERM
echo "temporary trees: $TMP"

for side in base tip; do
  if [ $side = base ]; then rev=$BASE_SHA; else rev=$TIP_SHA; fi
  mkdir "$TMP/$side"
  git -C "$ROOT" archive --format=tar "$rev" | tar -x -C "$TMP/$side"
  ln -s "$ROOT/node_modules" "$TMP/$side/node_modules"
done

if [ -n "$PLANT" ]; then
  node -e '
    const fs = require("fs");
    const [file, from, to] = process.argv[1].split(":");
    const path = process.argv[2] + "/" + file;
    const src = fs.readFileSync(path, "utf8");
    if (!from || !src.includes(from)) { console.error("plant: \"" + from + "\" is not in " + file); process.exit(2); }
    fs.writeFileSync(path, src.replace(from, to));
    console.log("plant (tip tree only): " + file + ": \"" + from + "\" -> \"" + to + "\"");
  ' "$PLANT" "$TMP/tip"
fi

for side in base tip; do
  if [ $side = base ]; then rev=$BASE_SHA; else rev=$TIP_SHA; fi
  (cd "$TMP/$side" && node "$HASH") > "$TMP/$side.out" || { echo "$side: the hash run failed" >&2; exit 2; }
  sed "s/^/$side $rev /" "$TMP/$side.out"
done

A=$(grep '^all ' "$TMP/base.out" | cut -d' ' -f2)
B=$(grep '^all ' "$TMP/tip.out" | cut -d' ' -f2)
[ -n "$A" ] && [ -n "$B" ] || { echo "no all line" >&2; exit 2; }
if [ "$A" = "$B" ]; then echo EQUAL; exit 0; else echo DIFFER; exit 1; fi
