#!/bin/sh
# the annex doors, in order, each exit read: projection, census, projection again, both checks
node scripts/generate-dossier-state-prose.mjs > /tmp/gen1.log 2>&1 || { echo "gen1 FAIL"; tail -5 /tmp/gen1.log; exit 1; }
node scripts/wiring-census.mjs > /tmp/wc1.log 2>&1 || { echo "wc FAIL"; tail -5 /tmp/wc1.log; exit 1; }
node scripts/generate-dossier-state-prose.mjs > /tmp/gen2.log 2>&1 || { echo "gen2 FAIL"; exit 1; }
node scripts/wiring-census.mjs --check > /tmp/wcc.log 2>&1 || { echo "wc check FAIL"; tail -3 /tmp/wcc.log; exit 1; }
node scripts/generate-dossier-state-prose.mjs --check > /tmp/genc.log 2>&1 || { echo "gen check FAIL"; exit 1; }
echo "doors ok: $(tail -1 /tmp/genc.log)"
