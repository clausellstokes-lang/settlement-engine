#!/bin/sh
# predict-914.sh <dock> — the READ-ONLY prediction pass at the §914 dock tip BEFORE any register door (E4: every register figure is derived,
# never guessed). Same five reads as predict-906.log: OSR plain read, writer-reach dry, the FARMED lighting probe, the lighting register, prose-numerics dry.
# Refuses a dirty dock (the lane may still be editing). Zero writes into the tree (the probe farms). Chair, 2026-09-06 22:40.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=${1:-$SC/laneINSTR2}; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty ($(git status --porcelain -uall | wc -l | tr -d ' ') entries) — the lane is still editing"; exit 8; }
echo "PREDICT_HEAD=$(git rev-parse HEAD) cars_over_f3ab08f51=$(git rev-list --count f3ab08f51..HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')"
echo "--- OSR plain read (read-only):"; node scripts/check-observed-shape-readers.mjs 2>&1 | head -1; echo "OSR_DRY_EXIT=$?"
echo "--- writer-reach dry (read-only):"; node scripts/check-writer-reach.mjs 2>&1 | tail -1 | cut -c1-200; echo "WR_DRY_EXIT=$?"
echo "--- lighting probe (farmed, read-only):"; PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs "$D" 2>/dev/null | tail -1; echo "LIGHT_PROBE_EXIT=$?"
echo "--- lighting register:"; python3 -c "import json;d=json.load(open('tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles','measuredAtSha') if k in d}))"
echo "--- prose-numerics dry:"; node $SC/prose-numerics-rekey.mjs "$D" 2>&1 | tail -1 | cut -c1-200; echo "PN_DRY_EXIT=$?"
echo "--- negative-assertion frozen rows for the consist's files (all NEW at f3ab08f51 — expected: no frozen row exists for any of them; the anchor walker takes its rows from live anchors):"; grep -n -E "'tests/lint/(proseWiringCensus|proseEntryContradiction|proseMoveGrammar|proseMeasures|proseRegisterLoaders|institutionTable)\.walker\.test\.js'" tests/lint/negativeAssertionAnchor.walker.test.js scripts/.negative-assertion-baseline.json 2>/dev/null | cut -c1-160 || echo "  (none — as expected for new files)"
echo "PREDICT_PORCELAIN_AFTER=$(git status --porcelain -uall | wc -l | tr -d ' ') end $(date '+%H:%M:%S')"
