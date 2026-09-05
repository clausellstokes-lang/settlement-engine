#!/bin/sh
# retire-owed-898.sh — after the ratchet --update retires the two Tier-2 voice census rows (the refreeze turned them green):
# delete their two WALKER_ROWS_OWED entries and lower OWED_CEILING by exactly two, in ONE car, as the file's own law demands
# ("the census entry, this ledger entry and this ceiling all move together"). Proves with the meta-test under the mutex.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/lanePROSE2; cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
N=$(python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print(sum(1 for k in d['entries'] if 'E2 voiceMechanics' in k))")
[ "$N" = "0" ] || { echo "⛔ the census still holds $N Tier-2 voice rows — the ratchet has not retired them; nothing to do"; exit 1; }
python3 - <<'PY'
import io,re
p='tests/lint/testRatchet.test.js'; s=io.open(p,encoding='utf-8').read()
keys=["    'tests/copy/voiceMechanics.test.js :: E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) total debt never grows past its committed budget':",
      "    'tests/copy/voiceMechanics.test.js :: E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) per-file debt exactly matches the baseline (grew ⇒ rewrite; fell ⇒ bank the win)':"]
removed=0
for k in keys:
    i=s.find(k); assert i>=0, ('key not found', k[:70])
    j=s.find("\n    '", i+len(k)); assert j>0
    # the entry spans from the key line through its value line(s) up to the next key or comment at 4-space indent
    k2=s.find("\n    //", i+len(k)); j=min(x for x in (j,k2) if x>0)
    s=s[:i]+s[j+1:]; removed+=1
note=("    // ⭐⭐ 2026-09-05, THE PROSE LANDING (§898) — THE TWO TIER-2 VOICE ROWS ARE FREED, NOT FORGIVEN. The src/ prose\n"
      "    // car cured 1,001 reader sentences; the Tier-2 TOTAL fell 770 → 311 under a budget of 670 and the per-file\n"
      "    // arm's baseline was re-frozen through the documented shrink-only door (55 rows / em 311 / bang 8 — a FALL,\n"
      "    // which is the only refreeze that door accepts). A remove-only --update retired both census rows; these two\n"
      "    // ledger entries leave with them and OWED_CEILING drops by exactly two. The two Tier-3 JSX rows stay: the\n"
      "    // 34 mainline JSX dashes are VOICE-JSX's, and their refreeze would be a RISE the door refuses.\n")
anchor="    'tests/copy/voiceMechanics.test.js :: E-E voiceMechanics JSX extension"
i=s.find(anchor); assert i>=0; s=s[:i]+note+s[i:]
old='  const OWED_CEILING = 7;'; assert s.count(old)==1
s=s.replace(old,"  // 7 → 5 on 2026-09-05 (§898): the two Tier-2 voice rows FREED by the prose landing's refreeze — the golden-master\n  // row had entered at 7 the same day (owner-gated, waiting for the freeze act), so the two burned leave five.\n  const OWED_CEILING = 5;")
io.open(p,'w',encoding='utf-8').write(s); print('ledger: removed',removed,'entries; OWED_CEILING 7 -> 5')
PY
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js > "$SC/retire-owed-meta.log" 2>&1; E=$?; echo "META_EXIT=$E"; grep -E 'Test Files|Tests ' "$SC/retire-owed-meta.log" | cut -c1-80
[ "$E" = "0" ] || { echo "⛔ the meta-test refuses the retirement:"; grep -nE 'AssertionError|×' "$SC/retire-owed-meta.log" | head -6 | cut -c1-200; exit 1; }
npx eslint tests/lint/testRatchet.test.js > "$SC/retire-owed-eslint.log" 2>&1 || { echo "⛔ eslint"; exit 1; }
git add tests/lint/testRatchet.test.js
printf '%s\n' "PROSE landing: the two Tier-2 voice ledger entries retire with their census rows — freed, not forgiven; OWED_CEILING 7 -> 5" "" "The prose car's refreeze turned both Tier-2 arms green (total em 770 -> 311 under 670; the per-file baseline re-frozen as a FALL, the only refreeze the shrink-only door accepts); a remove-only --update retired the census rows, and the file's own law moves the ledger entries and the ceiling with them in one act. The JSX rows stay (VOICE-JSX's). Meta-test green under the mutex; eslint 0." "" "Seat: Fable 5.1 — validated" "" "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" > "$SC/msg-retire-owed.txt"
git commit -q -F "$SC/msg-retire-owed.txt"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; exit 1; }
echo "LEDGER CAR $(git rev-parse --short HEAD); cars over fd8b6df00=$(git rev-list --count fd8b6df00..HEAD)"
