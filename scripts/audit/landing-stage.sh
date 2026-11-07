#!/bin/sh
# scripts/audit/landing-stage.sh — THE STAGED-TREE METHOD'S PER-STEP DRIVER (DOORS-2 ruling 1; LANDING-3/-4's briefs).
#
# WHAT IT IS. The signed shift records of a landing are written one per MOVING first-parent step, each from
# the STAGE at that step: the tree of the step's commit with the DOOR PATHS carried from the landing branch
# (where the previous record's writes are committed), so the manifest bytes a stage produces differ from the
# previous stage's by that one step's cause and nothing else. LANDING-3 drove this from scratch scripts that
# died with its container (step.sh, drive.py); this is the driver on the tree, so the next seat has it.
#
# ⛔ IT WRITES NO FIXTURE ON THE BRANCH. `build` makes a scratch git worktree; `measure` runs the measuring
# tools (golden-master-stage.mjs, herald-stage.mjs, refence.mjs, prose-manifest-cells.mjs --out, witness-stage.mjs,
# the PDF view-model snapshot) and the registered suites PLAINLY inside the stage (GOLDEN-REHEARSAL finding 2: it
# read 3 of the 5 surfaces the people car moves; with a previous stage it compares stage to stage). Every golden byte still moves only through tests/helpers/goldenRecordDoor.js with a signed record,
# run inside the stage; the produced bytes are then copied to the branch and committed with the record.
#
# THE DOOR PATHS (carried from the branch): the freeze register, every registered manifest and suite (read
# from the register itself), docs/shift-records/, scripts/prose-manifest-cells.mjs, the door helper and the
# freeze walker, and scripts/audit/'s doors. A step that itself touched a door path cannot be staged this way
# (the carry would overwrite the lane's edit): `build` STOPS and names the path.
#
# Usage (from the landing branch's checkout):
#   sh scripts/audit/landing-stage.sh build   <step-commit> <stage-dir>
#   sh scripts/audit/landing-stage.sh guard   <step-commit>              # the build's door-path guard alone
#   sh scripts/audit/landing-stage.sh measure <stage-dir> <scratch-dir> [<previous stage's scratch-dir>]
#   sh scripts/audit/landing-stage.sh suites  <stage-dir>        # the registered suites + walker, plainly
set -eu

cmd=${1:-}
here=$(pwd)

door_paths() {
  # $1 = a tree whose register names the surfaces
  node -e '
    const r = JSON.parse(require("fs").readFileSync(process.argv[1] + "/tests/fixtures/.golden-freeze-register.json", "utf8"));
    const s = new Set(["tests/fixtures/.golden-freeze-register.json"]);
    for (const x of r.surfaces) { s.add(x.path); if (x.suite) s.add(x.suite); }
    console.log([...s].join("\n"));
  ' "$1"
  printf '%s\n' docs/shift-records scripts/prose-manifest-cells.mjs tests/helpers/goldenRecordDoor.js \
    tests/lint/goldenFreeze.walker.test.js scripts/audit/golden-master-stage.mjs scripts/audit/refence.mjs \
    scripts/audit/witness-stage.mjs scripts/audit/herald-stage.mjs scripts/audit/door-write.mjs \
    scripts/audit/landing-stage.sh scripts/audit/carry-calibration.mjs scripts/audit/stage-chain.mjs
}

case "$cmd" in
  guard|build)
    step=$2; stage=${3:-}
    full=$(git rev-parse "$step^{commit}")
    parent=$(git rev-parse "$full^1")
    carry=$(git rev-parse HEAD)
    # A step that touched a door path cannot be staged by carrying WHERE THE CARRY WOULD OVERWRITE ITS EDIT: the guard
    # compares CONTENT, not paths (the chair's ruling on PEOPLE-LAND's STOP at record 0b, 2026-11-07). A touched door
    # path whose blob at the step equals the carry's is carried with a receipt line (nothing is hidden: the bytes are
    # the same); any touched door path whose blob differs STOPs the build and is named. A merge's first-parent diff is
    # the whole lane, so the W0 merge fc834a6bd -- the first stage whose step is itself a signed door write the branch
    # already carries -- touched ten door paths, each equal to the carry.
    touched=$(git diff --name-only "$parent" "$full" -- $(door_paths "$here") || true)
    differ=''
    # The forward stack's own design (the chair's second ruling, 2026-11-07): a touched door path is also CARRIED when
    # (a) its blob at the step equals its blob at the parent of the first commit in step..carry that touches it -- the
    # step's bytes went forward unchanged until a record moved them -- AND (b) every commit in step..carry that touches
    # it carries an `Owner-Signed:` trailer -- every later move went through the door. Otherwise STOP, naming the path
    # and the first unsigned toucher (or the difference at the first toucher's parent).
    for p in $touched; do
      if git diff --quiet "$full" "$carry" -- "$p"; then
        echo "door path touched by the step, equal to the carry — carried: $p" >&2
        continue
      fi
      movers=$(git rev-list --reverse "$full..$carry" -- "$p")
      first=$(printf '%s\n' "$movers" | head -n 1)
      if [ -z "$first" ] || ! git diff --quiet "$full" "$first^1" -- "$p"; then
        differ="$differ$p (differs from the step before any later commit touches it)
"
        continue
      fi
      unsigned=''
      for c in $movers; do
        if [ -z "$(git log -1 --format='%(trailers:key=Owner-Signed,valueonly)' "$c" | tr -d '[:space:]')" ]; then
          unsigned=$c; break
        fi
      done
      if [ -n "$unsigned" ]; then
        differ="$differ$p (first unsigned toucher $(git rev-parse --short=9 "$unsigned"))
"
      else
        echo "door path touched by the step, moved after it only by signed records — carried: $p ($(printf '%s\n' "$movers" | cut -c1-9 | tr '\n' ' ' | sed 's/ $//'))" >&2
      fi
    done
    if [ -n "$differ" ]; then
      echo "STOP: step $step touched door paths; the carry would overwrite them:" >&2
      printf '%s' "$differ" >&2
      exit 1
    fi
    [ "$cmd" = guard ] && exit 0
    if [ -d "$stage" ]; then git worktree remove --force "$stage" 2>/dev/null || rm -rf "$stage"; fi
    git worktree prune
    git worktree add --detach "$stage" "$full" >/dev/null 2>&1
    (
      cd "$stage"
      for p in $(cd "$here" && door_paths "$here"); do
        if git -C "$here" cat-file -e "$carry:$p" 2>/dev/null; then
          git checkout -q "$carry" -- "$p"
        fi
      done
      # CARTOGRAPHY_CALIBRATION is written by hand with every corpus re-record: its block alone is carried.
      git -C "$here" show "$carry:src/domain/townCartography/cartographyTuning.js" > "$stage/.carry-tuning.js"
      mkdir -p "$stage/.carry/src/domain/townCartography"
      mv "$stage/.carry-tuning.js" "$stage/.carry/src/domain/townCartography/cartographyTuning.js"
      node "$here/scripts/audit/carry-calibration.mjs" "$stage/.carry" "$stage" >/dev/null
      rm -rf "$stage/.carry"
      ln -s "$here/node_modules" node_modules
      common=$(git rev-parse --git-common-dir)
      grep -qx '/node_modules' "$common/info/exclude" 2>/dev/null || echo '/node_modules' >> "$common/info/exclude"
      git add -A -- docs scripts tests src
      git -c user.name=stage -c user.email=stage@local commit -q --no-verify --allow-empty \
        -m "stage: tree of $full with the door paths carried from $carry"
      echo "{\"stage\":\"$stage\",\"step\":\"$full\",\"carry\":\"$carry\",\"stageCommit\":\"$(git rev-parse HEAD)\"}"
    )
    ;;
  measure)
    stage=$2; out=$3; prev=${4:-}   # prev: the PREVIOUS stage's scratch dir (was: its fence rows.tsv)
    mkdir -p "$out"
    node "$here/scripts/audit/golden-master-stage.mjs" "$stage" --out "$out/gm.json" \
      --against "${prev:+$prev/gm.json}${prev:-$stage/tests/fixtures/generator-golden-master.json}"
    node "$here/scripts/audit/herald-stage.mjs" "$stage" --out "$out/herald.json"
    node -e '
      const fs = require("fs");
      const a = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); const b = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
      let moved = 0, added = 0; for (const k of Object.keys(b)) { if (!(k in a)) added++; else if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) moved++; }
      const removed = Object.keys(a).filter((k) => !(k in b)).length;
      console.log(JSON.stringify({ surface: "herald-knowledge-desk-golden", rows: Object.keys(b).length, moved, added, removed }));
    ' "${prev:+$prev/herald.json}${prev:-$stage/tests/fixtures/herald-knowledge-desk-golden.json}" "$out/herald.json"
    if [ -n "$prev" ]; then
      node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv" --against "$prev/fence.tsv"
    else
      node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv"
    fi
    # the composed-prose manifest's rows (the door's bytes carry them under `rows`)
    ( cd "$stage" && node scripts/prose-manifest-cells.mjs --out "$out/prose-cells.json" >/dev/null )
    node -e 'const f=require("fs");const p=JSON.parse(f.readFileSync(process.argv[1],"utf8"));f.writeFileSync(process.argv[2],JSON.stringify(p.rows)+"\n");f.unlinkSync(process.argv[1])' \
      "$out/prose-cells.json" "$out/prose-rows.json"
    # the preset lighting witness (no capture arm)
    ( cd "$stage" && node "$here/scripts/audit/witness-stage.mjs" "$stage" --out "$out/witness.json" )
    # the PDF view-model snapshot: the matcher's own bytes, copied out, the stage restored
    ( cd "$stage" && { npx vitest run tests/pdf/goldenViewModel.test.js --update >/dev/null 2>&1 || true; }
      cp tests/pdf/__snapshots__/goldenViewModel.test.js.snap "$out/pdf.snap"
      git checkout -q -- tests/pdf/__snapshots__/goldenViewModel.test.js.snap )
    # rows moved against the previous stage, every surface (the rehearsal's chain.cjs, put on the tree)
    if [ -n "$prev" ]; then node "$here/scripts/audit/stage-chain.mjs" "$prev" "$out"; fi
    echo "measured: gm herald fence prose witness pdf -> $out"
    ;;
  suites)
    stage=$2
    files=$(door_paths "$stage" | grep -E '\.test\.(js|jsx)$' | sort -u | tr '\n' ' ')
    cd "$stage"
    npx vitest run --maxWorkers=2 $files 2>&1 | grep -E '^ (FAIL|×)| ✗|Test Files|Tests  ' || true
    ;;
  *)
    echo 'usage: landing-stage.sh build <step> <stage> | guard <step> | measure <stage> <scratch> [prev-scratch] | suites <stage>' >&2
    exit 2
    ;;
esac
