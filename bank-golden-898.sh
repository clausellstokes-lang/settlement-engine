#!/bin/sh
# bank-golden-898.sh — the ruling's act: bank the generator-golden-master arm BY HAND with full attribution (class owner-gated)
# until the freeze act; prove the row with the census meta-test under the mutex; commit as a chair car. Guard + consequence.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
INTRO=$(git log --format=%H --grep='the em dashes leave the src/ reader prose' -1); [ -n "$INTRO" ] || { echo "⛔ the rebased prose car not found"; exit 1; }
python3 - "$INTRO" <<'PY'
import json,io,sys,collections
INTRO=sys.argv[1]; p='scripts/.test-ratchet-baseline.json'
raw=io.open(p,encoding='utf-8').read(); d=json.loads(raw, object_pairs_hook=collections.OrderedDict)
key='tests/property/generatorGoldenMaster.test.js :: generator golden master (cross-build output stability) every config produces byte-identical output to the golden master'
assert key not in d['entries'], 'already banked'
row=collections.OrderedDict([
 ('file','tests/property/generatorGoldenMaster.test.js'),
 ('test','generator golden master (cross-build output stability) every config produces byte-identical output to the golden master'),
 ('subsystem','golden-freeze / generator golden master'),
 ('cause',"DECLARED SAME-SEED TEXT SHIFT, owner-gated at the fixture: the src/ prose car (LGT-PROSE, cause (0) of the lighting wave's declarations; 1,001 reader sentences cured across 200 paths; emitted text moves on 133 engine-side paths; no rules value, preset or flag moved) changes every settlement's output text, so the committed generator-golden-master manifest moves on 525 of 525 rows (chair probe chair-tools/golden-count.mjs at the prose tip, CONTROL 0/525 at the base 272dbd2da). The fixture CANNOT be re-recorded before the freeze act: tests/helpers/goldenRecordDoor.js refuses an env var ([NO_SIGNATURE]) and, with a signed record, writes register-row values that tests/lint/goldenFreeze.walker.test.js:358 forbids while frozenAt is null. It regenerates at the owner-signed GENESIS, which records the lit + prose world (ledger §881.4). Declared in docs/GOLDEN_SHIFT_LEDGER.md and the §898 row; every control until the freeze is tree-vs-tree (lprobe/golden-control.sh, golden-count.mjs). Ruling: rulings/RULING-GOLDEN-PRE-FREEZE.md in the chair kit (refs/preserve/chair-tools-2026-09-05). Owner veto by name: 'sign the prose window now' or 'hold prose until the freeze'."),
 ('introducedAt',INTRO),
 ('class','owner-gated'),
 ('magnitude',[collections.OrderedDict([('name','movedRows'),('kind','capture'),('pattern','\\((\\d+)\\) \\] to deeply equal \\[\\]'),('ceiling',525),('unit','generator-golden-master rows whose settlement output hash differs from the committed manifest')])]),
])
d['entries'][key]=row
io.open(p,'w',encoding='utf-8').write(json.dumps(d,indent=2,ensure_ascii=False)+('\n' if raw.endswith('\n') else ''))
print('banked:',key[:80],'… entries now',len(d['entries']))
PY
echo "--- the meta-test that validates every entry (under the mutex):"; sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js > "$SC/bank-golden-meta.log" 2>&1; E=$?; echo "META_EXIT=$E"; grep -E 'Test Files|Tests ' "$SC/bank-golden-meta.log" | cut -c1-80
[ "$E" = "0" ] || { echo "⛔ the meta-test refuses the row:"; grep -nE 'AssertionError|Error:|✗|×' "$SC/bank-golden-meta.log" | head -6 | cut -c1-200; git checkout -q -- scripts/.test-ratchet-baseline.json 2>/dev/null; echo "(the hand edit was reverted — it was the chair's own, one minute old)"; exit 1; }
echo "--- the magnitude measures against the live failure message (the plain run's JSON):"; python3 - <<'PY'
import json,re
d=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/golden-plain.json'))
msg=[a['failureMessages'][0] for f in d['testResults'] for a in f['assertionResults'] if a['status']=='failed'][0]
m=re.search(r'\((\d+)\) \] to deeply equal \[\]', msg); print('  measured movedRows =', m.group(1) if m else 'NO MATCH'); assert m and m.group(1)=='525'
PY
git add scripts/.test-ratchet-baseline.json
cat > "$SC/msg-golden-bank.txt" <<MSG
PROSE landing: the generator golden master's movement is BANKED until the freeze act — 525 of 525 rows, declared, owner-gated at the fixture

The door is closed before the freeze act for every registered surface: UPDATE_GOLDEN writes nothing
([NO_SIGNATURE]), and a signed record would write register-row values that goldenFreeze.walker:358 forbids
while frozenAt is null. The prose car's declared same-seed text shift moves the manifest on 525/525 rows
(control 0/525 at the base). No chair-signed record, no door amendment: the arm is banked by hand with
full attribution (class owner-gated, magnitude capture ceiling 525), the shift is declared on the ledger,
and the fixture regenerates at the owner-signed genesis. Ruling: RULING-GOLDEN-PRE-FREEZE.md.

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
git commit -q -F "$SC/msg-golden-bank.txt"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
echo "BANKED CAR $(git rev-parse --short HEAD); cars over fd8b6df00=$(git rev-list --count fd8b6df00..HEAD)"
