#!/bin/bash
# INSTR-912 car 11 — execute the seven consist plants that touch a file this car changed.
# cp backup / cmp restore ONLY. The checkout family is forbidden in this shared-tree program,
# which is why scripts/mutation-sweep.sh itself is never invoked here: its check_caught reverts
# with `git checkout`. Each plant's perl line is taken VERBATIM from the shipped sweep, by line
# number, so what runs here is the plant the register ships and not a paraphrase of it.
set -u
D="$1"
cd "$D" || exit 2
SWEEP=scripts/mutation-sweep.sh

run_plant() {
  local num="$1" line="$2" target="$3" walker="$4"
  local bak="/tmp/plant-${num}.bak.$$"
  cp "$target" "$bak"
  local cmd
  cmd="$(sed -n "${line}p" "$SWEEP")"
  echo "───────────────────────────────────────────────────────────────"
  echo "PLANT #${num}  target=${target}"
  echo "  cmd: ${cmd}"
  eval "$cmd"
  if cmp -s "$target" "$bak"; then
    echo "  ⛔ PLANT DID NOT MUTATE THE FILE — the pattern no longer matches (a dead plant)."
    rm -f "$bak"; return 1
  fi
  local out
  out="$(npx vitest run "$walker" --no-file-parallelism 2>&1)"
  echo "  PLANTED: $(echo "$out" | grep -E '^ *Tests ' | head -1)"
  echo "$out" | grep -E '^ *(×|✕|FAIL)' | sed 's/^/    RED: /' | head -20
  cp "$bak" "$target"
  if cmp -s "$target" "$bak"; then echo "  RESTORED cmp-exact: yes"; else echo "  ⛔ RESTORE FAILED"; fi
  rm -f "$bak"
}

run_plant 78 1082 src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js
run_plant 81 1124 src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js
run_plant 82 1136 src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js
run_plant 83 1149 src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js
run_plant 85 1185 src/domain/institutions/institutionTable.js tests/lint/institutionTable.walker.test.js
run_plant 80 1111 src/domain/prose/wiringCensus.js tests/lint/proseWiringCensus.walker.test.js
run_plant 84 1166 src/domain/prose/wiringCensus.js tests/lint/proseWiringCensus.walker.test.js

echo "───────────────────────────────────────────────────────────────"
echo "porcelain after all plants: $(git status --porcelain | wc -l)"
git status --porcelain
