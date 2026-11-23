#!/bin/sh
# usage: light.sh <tree>: the flip's step 1 (three dials) and step 1b (the powersList row to layer 4 with its eight reads), CLOSE-RECIPE.md
set -e; cd "$1"
sed -i 's/^export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;$/export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;/' src/domain/seat/seatLaw.js
sed -i 's/^export const SEAT_CONTEST_LIT = false;$/export const SEAT_CONTEST_LIT = true;/' src/domain/seat/seatCircumstances.js
sed -i 's/^export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = DEFAULT_FORTUNE_LAW_VERSION;$/export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION;/' src/domain/fortune/fortuneLaw.js
python3 - <<'PY'
p='src/domain/facts/factLayers.js'; s=open(p).read()
old_row="  powersList: leaf({ layer: 3, module: 'domain/dossier/powerStrata.js', exported: 'derivePowerStrata', call: 'record', reads: ['powerStructure', 'config', '_config'],\n"
head="  // ── layer 4: over the cast ──\n"
i=s.index(old_row); j=s.index(head, i)
note=s[i+len(old_row):j]
assert note.strip().startswith("note:") and note.count("\n")==1, note
new_row=old_row.replace("layer: 3","layer: 4").replace("'_config'],","'_config', 'economicState', 'npcs', 'stress', 'stressors', 'tier'],")
s=s[:i]+head+new_row+note+s[j+len(head):]
open(p,'w').write(s)
PY
git diff --stat | tail -1
