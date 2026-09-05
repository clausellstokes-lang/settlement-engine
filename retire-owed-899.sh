#!/bin/sh
# retire-owed-899.sh — after run-ratchet-899's --update retires the THREE census rows the composed consist turned green
# (clampPrimitiveBaseline — the 62 → 69 ceiling car; the two Tier-3 JSX voice rows — VOICE-JSX cured all 34 mainline dashes):
# delete their three WALKER_ROWS_OWED entries and lower OWED_CEILING by exactly three, in ONE car, as the file's own law demands
# ("the census entry, this ledger entry and this ceiling all move together"). Proves with the meta-test under the mutex.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneCLAMP3; cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
N=$(python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));ks=list(d['entries']);print(sum(1 for k in ks if 'clampPrimitiveBaseline' in k or 'JSX extension' in k))")
[ "$N" = "0" ] || { echo "⛔ the census still holds $N of the three rows — the ratchet has not retired them; nothing to do"; exit 1; }
python3 - <<'PY'
import io
p='tests/lint/testRatchet.test.js'; s=io.open(p,encoding='utf-8').read()
subs=["E-E voiceMechanics JSX extension — src/**/*.jsx component ratchet (shrink-only) total JSX debt",
      "E-E voiceMechanics JSX extension — src/**/*.jsx component ratchet (shrink-only) per-file JSX debt",
      "clampPrimitiveBaseline.test.js :: clamp primitive baseline ratchet"]
removed=0
for sub in subs:
    i=s.find("    'tests/"+("copy/voiceMechanics.test.js :: " if 'JSX' in sub else "lint/")+sub); assert i>=0, ('key not found', sub[:60])
    j=s.find("\n    '", i+10); k2=s.find("\n    //", i+10); j=min(x for x in (j,k2) if x>0)
    s=s[:i]+s[j+1:]; removed+=1
note=("    // ⭐⭐ 2026-09-05, THE COMPOSED LANDING (§899) — THREE ROWS FREED, NOT FORGIVEN. VOICE-JSX cured all 34 mainline\n"
      "    // JSX em dashes (Tier-3 GREEN with no refreeze: 0 against a budget of 6, 0 against a per-file baseline of zero), and\n"
      "    // CLAMP-W3 lifted the clamp census ceiling 62 → 69 to match the tree after CLAMP-W2 migrated three writers (the\n"
      "    // absorbed copies are documented in the ceiling car; the census row's cause string had said 78, the tree measured\n"
      "    // 72 at DOCKET and 69 at the composed tip). A remove-only --update retired all three census rows; these three ledger\n"
      "    // entries leave with them and OWED_CEILING drops by exactly three. enforcement-claims and the golden-master\n"
      "    // (owner-gated, waiting for the freeze act) stay.\n")
anchor="    'tests/docs/enforcement-claims.test.js :: enforcement-claims meta-pin"
i=s.find(anchor); assert i>=0; s=s[:i]+note+s[i:]
old='  const OWED_CEILING = 5;'; assert s.count(old)==1
s=s.replace(old,"  // 5 → 2 on 2026-09-05 (§899): the two Tier-3 JSX voice rows and the clamp-primitive row FREED by the composed\n  // landing (VOICE-JSX + the CLAMP-W3 ceiling car); enforcement-claims and the owner-gated golden-master remain.\n  const OWED_CEILING = 2;")
io.open(p,'w',encoding='utf-8').write(s); print('ledger: removed',removed,'entries; OWED_CEILING 5 -> 2')
PY
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js > "$SC/retire-owed-899-meta.log" 2>&1; E=$?; echo "META_EXIT=$E"; grep -E 'Test Files|Tests ' "$SC/retire-owed-899-meta.log" | cut -c1-80
[ "$E" = "0" ] || { echo "⛔ the meta-test refuses the retirement:"; grep -nE 'AssertionError|×' "$SC/retire-owed-899-meta.log" | head -6 | cut -c1-200; exit 1; }
npx eslint tests/lint/testRatchet.test.js > "$SC/retire-owed-899-eslint.log" 2>&1 || { echo "⛔ eslint"; exit 1; }
git add tests/lint/testRatchet.test.js
printf '%s\n' "Composed landing: three owed ledger entries retire with their census rows — freed, not forgiven; OWED_CEILING 5 -> 2" "" "VOICE-JSX cured all 34 mainline JSX em dashes (Tier-3 green with no refreeze) and CLAMP-W3's ceiling car matched the clamp census to the tree (62 -> 69), so the remove-only --update retired the two Tier-3 JSX voice rows and the clamp-primitive row. The file's own law moves the census entry, the ledger entry and the ceiling together: these three WALKER_ROWS_OWED entries leave and OWED_CEILING drops by exactly three. enforcement-claims stays (six naked claims, not this landing's) and the golden-master row stays owner-gated until the freeze act. Proof: the meta-test green under the mutex; eslint 0." "" "Seat: Fable 5.1 — validated" "" "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" > "$SC/msg-retire-owed-899.txt"
git commit -q -F "$SC/msg-retire-owed-899.txt"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
echo "LEDGER CAR $(git rev-parse --short HEAD); cars over 5e28d5c83=$(git rev-list --count 5e28d5c83..HEAD)"
