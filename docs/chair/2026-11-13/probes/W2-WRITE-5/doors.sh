#!/bin/sh
# doors.sh : the annex doors in order, each exit read: projection, wiring census, projection again, both --check.
: "${LANE:?set LANE}"; : "${OUT:?set OUT}"; cd "$LANE" || exit 1
node scripts/generate-dossier-state-prose.mjs > "$OUT/gen1.log" 2>&1 || { echo "gen1 FAIL"; tail -5 "$OUT/gen1.log"; exit 1; }
node scripts/wiring-census.mjs > "$OUT/wc1.log" 2>&1 || { echo "wc FAIL"; tail -5 "$OUT/wc1.log"; exit 1; }
node scripts/generate-dossier-state-prose.mjs > "$OUT/gen2.log" 2>&1 || { echo "gen2 FAIL"; exit 1; }
node scripts/wiring-census.mjs --check > "$OUT/wcc.log" 2>&1 || { echo "wc check FAIL"; tail -3 "$OUT/wcc.log"; exit 1; }
node scripts/generate-dossier-state-prose.mjs --check > "$OUT/genc.log" 2>&1 || { echo "gen check FAIL"; exit 1; }
echo "doors ok: $(tail -1 "$OUT/genc.log")"
