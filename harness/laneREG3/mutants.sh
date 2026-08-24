#!/bin/zsh
# mutants.sh <workdir> — THE CONVICTING MUTATIONS (REG-3 exit 8), one per mechanism.
#
# ⛔ EACH RUNS OVER A FULL COPY OF THE TREE. The lane tree is never mutated — REG-2's discipline,
# kept verbatim, because a mutation left in place is a mutation that ships.
#
#   M1  the INN's pinned invariant is stripped (the gate passage is filled in)
#       → must move the SILHOUETTE FIXTURE'S ANSWER KEY, because the fixture chooses bodies by
#         drawn area and an inn with no passage is a different body.
#   M2  the CHURCH family is forced to a single roll (every slot pinned to its first value)
#       → must red the GALLERY SPREAD for `church`.
#   M3  the landmarks are UNTYPED (`typeBody` returns `rowHouse` for every institution)
#       → must return LANDMARK SALIENCE to its baseline shape: no family ⇒ no poché ⇒ the
#         anchors stop beating their matched decoys.
set -u
W="${1:?usage: mutants.sh <workdir>}"
T="$(cd "$(dirname "$0")/../.." && pwd)"
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
mkdir -p "$W"

copy() { rm -rf "$W/$1"; cp -R "$T" "$W/$1"; }

echo "=== M1 · the inn's GATE PASSAGE invariant stripped ==="
copy m1
/usr/bin/env node -e '
const fs=require("fs"); const p=process.argv[1]+"/src/domain/townMap/fabric/shapeCode.js";
let s=fs.readFileSync(p,"utf8");
const before=s;
s=s.replace("        if (i === slots.passageAt) continue;               // ⭐ THE PASSAGE IS A GAP, NOT A MARK","        // MUTATED: the gap is filled in — the invariant is gone.");
if (s===before) { console.error("M1 MUTATION DID NOT APPLY"); process.exit(3); }
fs.writeFileSync(p,s);
' "$W/m1" || exit 3
/usr/bin/env node "$W/m1/harness/laneREG3/silhouette.mjs" --out="$W/m1-sil" --n=12 >/dev/null 2>&1
if [ -f "$W/m1-sil/../silhouette-key/ANSWER-KEY.json" ]; then
  A=$(/usr/bin/env node -e 'const k=require(process.argv[1]);console.log(k.key.map(x=>x.id+":"+x.klass+":"+x.area).join(","))' "$SP/reg3work/silhouette-key/ANSWER-KEY.json")
  B=$(/usr/bin/env node -e 'const k=require(process.argv[1]);console.log(k.key.map(x=>x.id+":"+x.klass+":"+x.area).join(","))' "$W/silhouette-key/ANSWER-KEY.json")
  if [ "$A" = "$B" ]; then echo "  M1 RESULT: key UNCHANGED — THE ARM IS BLIND"; else
    D=$(/usr/bin/env node -e '
      const a=require(process.argv[1]).key, b=require(process.argv[2]).key;
      let n=0; for(let i=0;i<a.length;i++) if(!b[i]||a[i].klass!==b[i].klass||a[i].area!==b[i].area) n++;
      console.log(n+" of "+a.length+" fixtures moved");' "$SP/reg3work/silhouette-key/ANSWER-KEY.json" "$W/silhouette-key/ANSWER-KEY.json")
    echo "  M1 RESULT: **REDS** — the answer key moved: $D"
  fi
else echo "  M1 RESULT: the mutated tree produced no key (report, do not score)"; fi

echo "=== M2 · the CHURCH family forced to a single roll ==="
copy m2
/usr/bin/env node -e '
const fs=require("fs"); const p=process.argv[1]+"/src/domain/townMap/fabric/shapeCode.js";
let s=fs.readFileSync(p,"utf8"); const before=s;
// every church slot pinned to its first enumerated value — one roll for the whole family.
s=s.replace(/export function pick\(values, key, lift = 0\) \{/,
  "export function pick(values, key, lift = 0) {\n  if (String(key).includes(\"|shape|\") && MUT_PIN) return values[0];");
s=s.replace("export function roll(key, lift = 0) {","const MUT_PIN = true;\nexport function roll(key, lift = 0) {");
if (s===before) { console.error("M2 MUTATION DID NOT APPLY"); process.exit(3); }
fs.writeFileSync(p,s);
' "$W/m2" || exit 3
/usr/bin/env node "$W/m2/harness/laneREG3/gallery.mjs" --n=12 2>&1 | grep -E "^church|^SPREAD" | sed 's/^/  M2 /'

echo "=== M3 · the landmarks UNTYPED ==="
copy m3
/usr/bin/env node -e '
const fs=require("fs"); const p=process.argv[1]+"/src/domain/townMap/fabric/shapeCode.js";
let s=fs.readFileSync(p,"utf8"); const before=s;
s=s.replace("    const t = ARCHETYPE_FAMILY[a];","    const t = null;   // MUTATED: every institution is untyped");
if (s===before) { console.error("M3 MUTATION DID NOT APPLY"); process.exit(3); }
fs.writeFileSync(p,s);
' "$W/m3" || exit 3
rm -rf "$W/m3-out" "$W/m3-png"
/usr/bin/env node "$W/m3/harness/exemplars.mjs" "$W/m3-out" --shapes >/dev/null 2>&1
/usr/bin/env node "$W/m3/harness/laneREG3/salienceRun.mjs" --dir="$W/m3-out" --png="$W/m3-png" 2>&1 | tail -3 | sed 's/^/  M3 /'
echo "MUTANTS_DONE"
