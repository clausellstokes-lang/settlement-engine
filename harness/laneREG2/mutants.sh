#!/bin/zsh
# mutants.sh <mutdir> — ⭐⭐⭐ REG-2 EXIT LEG 8: THE CONVICTING MUTATIONS.
# Each mutation is a one-line source change to a FULL COPY of the tree (never the lane tree), and
# each must RED exactly the arm that is supposed to see it. A mutation that reds nothing means the
# arm is measuring nothing — the second rule of the instrument set.
set -u
T="${0:A:h}/../.."          # the lane worktree
M="$1"; mkdir -p "$M"
mk() {  # mk <name>  → a full copy of src+harness, printed as its path
  local n="$1"; rm -rf "$M/$n"; mkdir -p "$M/$n"
  cp -R "$T/src" "$T/harness" "$M/$n/" 2>/dev/null
  ln -sfn "$T/node_modules" "$M/$n/node_modules"
  cp "$T/package.json" "$M/$n/" 2>/dev/null
  print "$M/$n"
}
patch() { /usr/bin/env node -e '
const fs=require("fs");const f=process.argv[1],a=process.argv[2],b=process.argv[3];
let s=fs.readFileSync(f,"utf8");
if(!s.includes(a)){console.error("PATCH ANCHOR MISSING in "+f);process.exit(3);}
fs.writeFileSync(f,s.replace(a,b));' "$@"; }

echo "════ M1 · THE REGIME IS FORCED WRONG (every settlement derives TANGENT) ════"
D=$(mk m1)
patch "$D/src/domain/townMap/fabric/rampartWorks.js" \
  "const regime = peace > military ? 'tangent' : 'clear';" \
  "const regime = 'tangent';"
( cd "$D" && node harness/laneREG2/regimeFixtures.mjs --n=10 2>&1 | tail -6 )

# ⛔ THE FIRST SPELLING OF M2 POPPED THE **LAST** ACCEPTED JOINT AND THE COVERAGE COUNT DID NOT
# MOVE — the last accepted joint is a class-3 STATION, and a station is not a structural site, so
# deleting one uncovers nothing. ⭐ A mutation that reds nothing has not proved the arm is blind;
# it has proved the MUTATION was aimed at the wrong thing. Re-aimed at the class the arm is about.
echo "\n════ M2 · EVERY ANGLE-TURN WORK IS DELETED (the class the coverage arm is about) ════"
D=$(mk m2)
patch "$D/src/domain/townMap/fabric/rampartWorks.js" \
  "  /* ── THE COVERAGE ANSWER" \
  "  for (let z = joints.length - 1; z >= 0; z--) if (joints[z].cls === 2) joints.splice(z, 1);
  /* ── THE COVERAGE ANSWER"
( cd "$D" && node harness/laneREG2/probeRampart.mjs 2>&1 | tail -3 )

echo "\n════ M5 · THE WATER CUT IS DISARMED (the curtain is drawn across the harbour) ════"
D=$(mk m5)
patch "$D/src/domain/townMap/fabric/rampartWorks.js" \
  "      wetEdge[i] = wet > steps / 2;" \
  "      wetEdge[i] = false;"
( cd "$D" && node harness/laneREG2/probeOverGround.mjs 2>&1 | grep -E "^BASE|^ARMED" )

echo "\n════ M3 · A CURTAIN IS PUSHED OVER THE WATER (the band offset is doubled outward) ════"
D=$(mk m3)
patch "$D/src/domain/townMap/fabric/walls.js" \
  "        bandHalfOfRun: runBands.map((b) => b.stone / 2)," \
  "        bandHalfOfRun: runBands.map((b) => b.stone * 6),"
( cd "$D" && node harness/laneREG2/probeOverGround.mjs 2>&1 | grep -E "^BASE|^ARMED" )

echo "\n════ M4 · THE GROUND REFUSAL IS DISARMED (works may stand on a scarp) ════"
D=$(mk m4)
patch "$D/src/domain/townMap/fabric/rampartWorks.js" \
  "    if (!cliffs && !water) return null;" \
  "    if (true) return null;"
( cd "$D" && node harness/laneREG2/probeOverGround.mjs 2>&1 | grep -E "^BASE|^ARMED" )
echo "\nMUTANTS_DONE"
