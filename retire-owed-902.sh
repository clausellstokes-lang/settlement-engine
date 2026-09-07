#!/bin/sh
# retire-owed-902.sh — after run-ratchet-902's --update retires the TWO writer-reach census rows the rung-18 genesis turned green
# (corpusMeta.simulationFlagsLit 81 == the OSR register's 81; OSR-SCHEMA18, cars f20d5dd48 + a05a4646e): delete their two
# WALKER_ROWS_OWED entries and lower OWED_CEILING by exactly two, in ONE car, as the file's own law demands ("the census entry,
# this ledger entry and this ceiling all move together"). Proves with the meta-test under the mutex. Derived from retire-owed-899.sh.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneOSR18; cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
N=$(python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print(sum(1 for k in d['entries'] if 'writerReach.walker' in k))")
[ "$N" = "0" ] || { echo "⛔ the census still holds $N writer-reach row(s) — the ratchet has not retired them; nothing to do"; exit 1; }
python3 - <<'PY'
import io,re
p='tests/lint/testRatchet.test.js'; s=io.open(p,encoding='utf-8').read()
# the two entries: each is a `'tests/lint/writerReach.walker.test.js :: …':\n      '…',` pair preceded by the §900 comment paragraph
keys=["    'tests/lint/writerReach.walker.test.js :: writer-with-no-reader ratchet: the frozen register the frozen corpusMeta EQUALS",
      "    'tests/lint/writerReach.walker.test.js :: writer-with-no-reader ratchet: the frozen register the frozen shapesDigest EQUALS"]
removed=0
for k in keys:
    i=s.find(k); assert i>=0, ('key not found', k[:70])
    j=s.find("\n    '", i+10); k2=s.find("\n    //", i+10); j=min(x for x in (j,k2) if x>0)
    s=s[:i]+s[j+1:]; removed+=1
# the §900 comment paragraph that introduced them (starts '    // ⭐ 2026-09-05, THE DESK LANDING (§900) — TWO writer-reach arms ENTER OWED') is replaced by the retirement record
start=s.find("    // ⭐ 2026-09-05, THE DESK LANDING (§900) — TWO writer-reach arms ENTER OWED"); assert start>=0
end=s.find("    // ⭐ 2026-09-05, THE DESK LANDING (§900) — the Tier-2 voice per-file arm", start); assert end>start
note=("    // ⭐⭐ 2026-09-06, THE OSR RUNG-18 LANDING (§902) — THE TWO WRITER-REACH ROWS ARE FREED, NOT FORGIVEN. They entered at §900 as\n"
      "    // declared debt: the writer-reach register measured corpusMeta.simulationFlagsLit = 81 while the observed-shape register\n"
      "    // carried 80, because its schema-17 migration receipt's subjectSha lay outside the product lineage after a cherry-pick replay\n"
      "    // and the OSR CLI refused every --write. OSR-SCHEMA18 (cars f20d5dd48 + a05a4646e) re-executed the governed migration with a\n"
      "    // SUBJECT COMMIT INSIDE THE LINEAGE; the genesis froze 81 on the OSR side, both arms went green by title in the whole-suite\n"
      "    // proof at a05a4646e, and a remove-only --update retired both census rows; these two ledger entries leave with them and\n"
      "    // OWED_CEILING drops by exactly two. The voice per-file row, enforcement-claims and the owner-gated golden-master stay.\n")
s=s[:start]+note+s[end:]
old='  const OWED_CEILING = 5;'; assert s.count(old)==1
s=s.replace(old,"  // 5 → 3 on 2026-09-06 (§902): the two writer-reach rows FREED by the rung-18 re-anchoring (OSR-SCHEMA18); the voice\n  // per-file row, enforcement-claims and the owner-gated golden-master stay.\n  const OWED_CEILING = 3;")
io.open(p,'w',encoding='utf-8').write(s); print('ledger: removed',removed,'entries; OWED_CEILING 5 -> 3')
PY
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js > "$SC/retire-owed-902-meta.log" 2>&1; E=$?; echo "META_EXIT=$E"; grep -E 'Test Files|Tests ' "$SC/retire-owed-902-meta.log" | cut -c1-80
[ "$E" = "0" ] || { echo "⛔ the meta-test refuses the retirement:"; grep -nE 'AssertionError|×' "$SC/retire-owed-902-meta.log" | head -6 | cut -c1-200; exit 1; }
npx eslint tests/lint/testRatchet.test.js > "$SC/retire-owed-902-eslint.log" 2>&1 || { echo "⛔ eslint"; cat "$SC/retire-owed-902-eslint.log" | head -5; exit 1; }
git add tests/lint/testRatchet.test.js
cat > "$SC/msg-retire-owed-902.txt" <<'MSG'
OSR rung-18 landing: the two writer-reach owed ledger entries retire with their census rows — freed, not forgiven; OWED_CEILING 5 -> 3

They entered at §900 as declared debt (corpusMeta.simulationFlagsLit 81 on the writer-reach register against 80 on the
observed-shape register, whose schema-17 receipt lay outside the product lineage after a cherry-pick replay). OSR-SCHEMA18
re-executed the governed migration with a subject commit inside the lineage (f20d5dd48 + a05a4646e); the genesis froze 81,
both arms went green by title in the whole-suite proof at a05a4646e, and this landing's remove-only ratchet --update retired
both census rows. The census entries, these two ledger entries and the ceiling move together, as the file's own law demands;
the meta-test is the receipt (retire-owed-902-meta.log). The voice per-file row, enforcement-claims and the owner-gated
golden-master stay.

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
git commit -q -F "$SC/msg-retire-owed-902.txt"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
echo "RETIRE-OWED CAR -> $(git rev-parse --short HEAD) · cars over b0cbc67a1: $(git rev-list --count b0cbc67a1..HEAD)"
