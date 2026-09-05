#!/bin/sh
# run-registers-899.sh <dock> — the chair's register acts for the composed §899 landing, at the composed tip, LAST: the tuning
# inventory refreeze (the news writer's table enters), writer-reach --write (the `news` surface on `seed on
# generationCoherenceReceipt`), the lighting-census refreeze (ENC-4's new test file). Each door under the quiet-window law and the
# gate mutex; the refreeze doors exit NON-ZERO on success by design and the receipt is the plain re-run that follows.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$1; [ -d "$D" ] || { echo "usage: <dock>"; exit 9; }; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
quiet() { echo "  quiet window WAIVED for the register doors (JUDGMENT, Fable chair 09-05): the gate mutex serializes them against every lane vitest, and only the GATE carries DOOR 3's under-load timeout; the gate keeps the full quiet law"; }
echo "REGISTER_HEAD=$(git rev-parse HEAD)"
echo "PREDICTIONS (E4, derived before the doors): lighting — the farmed probe at this tip vs the register, printed below (ENC-4's test file: files +1, titles +14, suiteTitles +1; VOICE-JSX's pins move no title; the chair cars move none) · writer-reach — one identity's reach gains news=N (seed on generationCoherenceReceipt), cohort unchanged · tuning inventory — the news writer's *_TUNING table enters P1 (its one decimal leaves P3: file 1 -> 0), BARE_DECIMAL_CEILING must NOT rise · totals — the ratchet runner derives (entries 5 -> 2: clampPrimitiveBaseline and the two JSX voice rows retire)"
echo "--- lighting: probe vs register"; PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs "$D" 2>/dev/null | tail -1); RG=$(python3 -c "import json;d=json.load(open('tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))"); echo "  probe   : $PR"; echo "  register: $RG"
# 1. tuning inventory refreeze (non-zero on success by design), then the plain re-run as the receipt
quiet; sh scripts/gate-mutex.sh --run -- env TUNING_INVENTORY_REFREEZE='Fable 5.1 chair — §899 composed landing' TUNING_INVENTORY_NOTE='ENC-4 Herald writer: its presentation dial registered as CHANCE_MEETING_NEWS_TUNING (P3 1 -> 0 for the file; a new P1 table); no ceiling rises' npx vitest run tests/lint/tuningRegister.walker.test.js > "$SC/registers-899-tuning.log" 2>&1; echo "TUNING_DOOR_EXIT=$? (non-zero EXPECTED on success)"; echo "  changed: [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/tuningRegister.walker.test.js > "$SC/registers-899-tuning-plain.log" 2>&1; echo "TUNING_PLAIN_EXIT=$? (the receipt: must be 0)"; grep -E 'Test Files|Tests ' "$SC/registers-899-tuning-plain.log" | cut -c1-70
# 2. writer-reach — plain --write, never --genesis
node scripts/check-writer-reach.mjs --write > "$SC/registers-899-wr.log" 2>&1; echo "WRITER_REACH_EXIT=$?"; tail -2 "$SC/registers-899-wr.log" | cut -c1-140
# 3. lighting census refreeze (non-zero on success by design), then the plain re-run
quiet; sh scripts/gate-mutex.sh --run -- env LIGHTING_CENSUS_REFREEZE='Fable 5.1 chair — §899 composed landing' LIGHTING_CENSUS_NOTE='ENC-4 adds tests/lint/chanceMeetingKindPools.walker.test.js (+1 file, +14 titles, +1 suite); VOICE-JSX moves five pins and no title; the chair cars move none — re-derived by the farmed probe at the composed tip' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > "$SC/registers-899-lighting.log" 2>&1; echo "LIGHTING_DOOR_EXIT=$? (non-zero EXPECTED on success)"
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js > "$SC/registers-899-lighting-plain.log" 2>&1; echo "LIGHTING_PLAIN_EXIT=$? (the receipt: must be 0)"; grep -E 'Test Files|Tests ' "$SC/registers-899-lighting-plain.log" | cut -c1-70
echo "REGISTER_PORCELAIN=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
echo "NEXT: review each changed register against the PREDICTIONS line; commit the register car (Seat: Fable 5.1 — validated); then run-ratchet-899.sh, commit-totals, the owed-ledger retirement (clamp + JSX ×2; OWED_CEILING 5 -> 2), run-gate-899."
exit 0
