#!/bin/sh
# land-899-prep.sh <base-sha-full> — prepare the CLAMP landing (§899) after §898 lands: a fresh dock at the new tip, replay the three
# wave-2 cars, run the edge-shared re-mint ritual (dispositionLedger is a bundle input), and stamp the §899 kit. CLAMP-W3 (the ceiling
# car) is then dispatched INTO this dock by the chair; its car lands before the registers. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine; BASE=$1
echo "$BASE" | grep -qE '^[0-9a-f]{40}$' || { echo "usage: <base-sha-full>"; exit 9; }
[ "$(git -C $REPO rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ the product tip is not $BASE — land the previous consist first"; exit 1; }
sh $SC/mkdock.sh laneCLAMP3 "$BASE" | tail -1
sh $SC/replay-cars.sh $SC/laneCLAMP3 "$BASE" $SC/laneCLAMPW2:df7cdd37e $SC/laneVOICE:fd8b6df00 $SC/laneENC4:fd8b6df00 | tail -8
echo "(DOCKET, ENC-4b and HORIZON-B1 are replayed LATER with a second replay-cars.sh run once their lanes report — never replay a dock mid-work)"
for f in src/domain/worldPulse/dispositionLedger.js src/domain/townCartography/cartographyBuildings.js src/domain/townCartography/cartographyMultiplicity.js; do (cd $SC/laneCLAMP3 && node -e "import('./$f').then(()=>console.log('  eval ok $f')).catch(e=>{console.log('  EVAL FAIL $f',e.message);process.exit(1)})"); done
echo "== edge-shared re-mint ritual"; sh $SC/edge-shared-ritual.sh $SC/laneCLAMP3
echo "== ENC-4's OWED vitest proofs at the composed tip (quiet window + mutex): the walker, kindPoolFloors, chooserTotality — the chair runs these before the registers; see rulings/RULING-ENC4-R1-R2-R9.md"
N=$(git -C $SC/laneCLAMP3 rev-list --count "$BASE"..HEAD); echo "laneCLAMP3: $N cars over $(echo $BASE | cut -c1-9); HEAD=$(git -C $SC/laneCLAMP3 rev-parse --short HEAD); porcelain=$(git -C $SC/laneCLAMP3 status --porcelain -uall | wc -l | tr -d ' ')"
# the kit: cars = replayed 3 + re-mint (0 or 1) + the W3 ceiling car (1) + the totals car (1) — stamp AFTER W3 lands; print the command
echo "NEXT: dispatch CLAMP-W3 into $SC/laneCLAMP3 (brief briefs/brief-CLAMP-W3.md); when its car is in: python3 $SC/mk-landing-kit.py 899 laneCLAMP3 $BASE landing-clamp3-2026-09-05 <cars> --prev-pickup 'PICKUP AT §898' ; then run-ratchet-899 → commit-totals → run-gate-899 → after-cas-899"
