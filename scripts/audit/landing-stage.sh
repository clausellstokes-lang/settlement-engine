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
# tools (golden-master-stage.mjs, herald-stage.mjs, refence.mjs) and the registered suites PLAINLY inside the
# stage. Every golden byte still moves only through tests/helpers/goldenRecordDoor.js with a signed record,
# run inside the stage; the produced bytes are then copied to the branch and committed with the record.
#
# THE DOOR PATHS (carried from the branch): the freeze register, every registered manifest and suite (read
# from the register itself), docs/shift-records/, scripts/prose-manifest-cells.mjs, the door helper and the
# freeze walker, and scripts/audit/'s doors. A step that itself touched a door path cannot be staged this way
# (the carry would overwrite the lane's edit): `build` STOPS and names the path.
#
# Usage (from the landing branch's checkout):
#   sh scripts/audit/landing-stage.sh build   <step-commit> <stage-dir>
#   sh scripts/audit/landing-stage.sh measure <stage-dir> <scratch-dir> [<previous fence rows.tsv>]
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
    scripts/audit/landing-stage.sh scripts/audit/carry-calibration.mjs
}

case "$cmd" in
  build)
    step=$2; stage=$3
    full=$(git rev-parse "$step^{commit}")
    parent=$(git rev-parse "$full^1")
    # A step that touched a door path cannot be staged by carrying: STOP and name it.
    touched=$(git diff --name-only "$parent" "$full" -- $(door_paths "$here") || true)
    if [ -n "$touched" ]; then
      echo "STOP: step $step touched door paths; the carry would overwrite them:" >&2
      echo "$touched" >&2
      exit 1
    fi
    if [ -d "$stage" ]; then git worktree remove --force "$stage" 2>/dev/null || rm -rf "$stage"; fi
    git worktree prune
    git worktree add --detach "$stage" "$full" >/dev/null 2>&1
    carry=$(git rev-parse HEAD)
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
    stage=$2; out=$3; prev=${4:-}
    mkdir -p "$out"
    node "$here/scripts/audit/golden-master-stage.mjs" "$stage" --out "$out/gm.json" \
      --against "$stage/tests/fixtures/generator-golden-master.json"
    node "$here/scripts/audit/herald-stage.mjs" "$stage" --out "$out/herald.json"
    node -e '
      const fs = require("fs");
      const a = JSON.parse(fs.readFileSync(process.argv[1], "utf8")); const b = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
      let moved = 0, added = 0; for (const k of Object.keys(b)) { if (!(k in a)) added++; else if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) moved++; }
      const removed = Object.keys(a).filter((k) => !(k in b)).length;
      console.log(JSON.stringify({ surface: "herald-knowledge-desk-golden", rows: Object.keys(b).length, moved, added, removed }));
    ' "$stage/tests/fixtures/herald-knowledge-desk-golden.json" "$out/herald.json"
    if [ -n "$prev" ]; then
      node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv" --against "$prev"
    else
      node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv"
    fi
    ;;
  suites)
    stage=$2
    files=$(door_paths "$stage" | grep -E '\.test\.(js|jsx)$' | sort -u | tr '\n' ' ')
    cd "$stage"
    npx vitest run --maxWorkers=2 $files 2>&1 | grep -E '^ (FAIL|×)| ✗|Test Files|Tests  ' || true
    ;;
  *)
    echo 'usage: landing-stage.sh build <step> <stage> | measure <stage> <scratch> [prev.tsv] | suites <stage>' >&2
    exit 2
    ;;
esac
