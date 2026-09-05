#!/bin/sh
# bank-voice-900.sh — RULED (Fable chair, 09-05): the Tier-2 voice per-file arm is banked as an OWED census row for §900. labelBands.js (5 em)
# and generalStateProse.js (3 em) are a total map over a producer's authored dashed vocabulary + its two parsed delimiters; the shrink-only
# refreeze door refuses the rise (311 → 319) and the generator import is forbidden in writing. The structural cure — a declared
# authored-vocabulary exemption class in the voice scanner — is §901's; banking keeps the guard visible, never silent (a hand entry with
# full attribution is the census's own law for a deferred debt). Adds the census entry BY HAND, the WALKER_ROWS_OWED ledger entry, and
# OWED_CEILING +1, in ONE car, then proves with the meta-test under the mutex. Run AFTER the whole-suite proof confirms the arm and BEFORE run-ratchet.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneDESKINT; cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "⛔ dock dirty"; exit 1; }
KEY=$(grep -E '^ FAIL  tests/copy/voiceMechanics.test.js > .*per-file debt exactly matches the baseline' "$SC/whole-900d.log" | grep -v JSX | head -1 | sed 's/^ FAIL  //; s/ > / :: /; s/ > / /g')
[ -n "$KEY" ] || { echo "⛔ the Tier-2 per-file arm is not red in whole-900d.log — nothing to bank"; exit 1; }
echo "KEY=$KEY"
python3 - "$KEY" <<'PY'
import io,json,sys,collections
key=sys.argv[1]
b='scripts/.test-ratchet-baseline.json'; raw=io.open(b,encoding='utf-8').read(); d=json.loads(raw,object_pairs_hook=collections.OrderedDict)
assert key not in d['entries'], 'already banked'
sample=next(iter(d['entries'].values())); print('entry shape (sibling):',json.dumps(sample)[:300])
entry=collections.OrderedDict(sample); entry['subsystem']='voice — Tier-2 src/domain string-literal ratchet (per-file arm)'
entry['cause']=('NOT FREED — labelBands.js carries 5 em dashes as the KEYS of a total map over the producer\'s authored complexity labels and generalStateProse.js carries 3 as parsed "<Band> — <Condition>" delimiters (DOCKET-2/3, DESK-900-TAIL measured: the scanner reads cooked values so an escape counts the same; the generator import is forbidden in writing by three files); the Tier-2 TOTAL is 319 against a budget of 670 (green) but the per-file arm is exact and the shrink-only door refuses a 311 → 319 refreeze. BANKED at §900 by the Fable chair with OWED_CEILING +1; the structural cure is a declared authored-vocabulary exemption class in the voice scanner (§901).')
entry['introducedAt']='§900 (the desk landing composition)'; entry['class']='owed'
d['entries'][key]=entry
io.open(b,'w',encoding='utf-8').write(json.dumps(d,indent=2,ensure_ascii=False)+('\n' if raw.endswith('\n') else '')); print('census: entry added by hand (',len(d['entries']),'entries )')
t='tests/lint/testRatchet.test.js'; s=io.open(t,encoding='utf-8').read()
anchor="  const WALKER_ROWS_OWED = Object.freeze({\n"; assert s.count(anchor)==1
row=("    // ⭐ 2026-09-05, THE DESK LANDING (§900) — the Tier-2 voice per-file arm RE-ENTERS as OWED, declared: two src/domain\n"
     "    // files spell a producer's authored dashed vocabulary (a total map's keys and two parsed delimiters); the shrink-only door\n"
     "    // refuses the 311 → 319 rise and the generator import is forbidden in writing. Structural cure: an authored-vocabulary\n"
     "    // exemption class in the voice scanner (§901). Banking keeps the guard visible; OWED_CEILING moves 2 → 3 with it.\n"
     "    '"+key.replace("'","\\'")+"':\n      'NOT FREED — banked at §900 with attribution in the census entry; the scanner exemption class is the cure (§901).',\n")
s=s.replace(anchor,anchor+row,1)
import re
m=re.search(r"  const OWED_CEILING = (\d+);",s); assert m; n=int(m.group(1))
s=s.replace(m.group(0),"  // %d → %d on 2026-09-05 (§900): the Tier-2 voice per-file row re-enters OWED (declared, attributed) — see WALKER_ROWS_OWED.\n  const OWED_CEILING = %d;"%(n,n+1,n+1))
io.open(t,'w',encoding='utf-8').write(s); print('ledger: entry + OWED_CEILING %d -> %d'%(n,n+1))
PY
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js > "$SC/bank-voice-900.log" 2>&1; E=$?; echo "META_EXIT=$E"; grep -E 'Tests ' "$SC/bank-voice-900.log" | cut -c1-80
[ "$E" = "0" ] || { grep -nE 'AssertionError|×' "$SC/bank-voice-900.log" | head -6 | cut -c1-200; exit 1; }
npx eslint tests/lint/testRatchet.test.js > /dev/null 2>&1 || { echo "⛔ eslint"; exit 1; }
git add scripts/.test-ratchet-baseline.json tests/lint/testRatchet.test.js
printf '%s\n' "Desk landing (chair car): the Tier-2 voice per-file row re-enters the census as OWED, declared and attributed — OWED_CEILING +1" "" "Two src/domain files spell a producer's authored dashed vocabulary (labelBands.js: the keys of a total map over the complexity labels; generalStateProse.js: two parsed band delimiters). DESK-900-TAIL measured every ruled cure shut: the scanner reads cooked values, the generator import is forbidden in writing, and the shrink-only door refuses the 311 -> 319 rise. The census never banks a regression silently, so the entry is added by hand with its cause, the WALKER_ROWS_OWED ledger entry rides with it and OWED_CEILING moves by exactly one. The structural cure - a declared authored-vocabulary exemption class in the voice scanner - is the lighting landing's. Proof: the meta-test green under the mutex; eslint 0." "" "Seat: Fable 5.1 — validated" "" "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" > "$SC/msg-bank-voice-900.txt"
git commit -q -F "$SC/msg-bank-voice-900.txt"; echo "BANK CAR $(git rev-parse --short HEAD); cars over 38474a59e=$(git rev-list --count 38474a59e..HEAD)"
