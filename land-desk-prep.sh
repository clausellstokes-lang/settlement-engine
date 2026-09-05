#!/bin/sh
# land-desk-prep.sh <base-sha-full> — the desk landing's dock + replay (see DESK-LANDING-PLAN.md). Refuses unless the product tip
# IS the base and OSR-SCHEMA17's cars are in laneINTEG-tree. Registry conflicts resolved by law inside replay-cars.sh.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
REPO=/Users/cstokes/Desktop/settlement-engine; BASE=$1
echo "$BASE" | grep -qE '^[0-9a-f]{40}$' || { echo "usage: <base-sha-full>"; exit 9; }
[ "$(git -C $REPO rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ the product tip is not $BASE"; exit 1; }
git -C $SC/laneINTEG-tree log --format=%B 940d161ca..HEAD | grep -q 'Lane: OSR-SCHEMA17' || { echo "⛔ OSR-SCHEMA17's cars are not in laneINTEG-tree yet"; exit 1; }
sh $SC/mkdock.sh laneDESKINT "$BASE" | tail -1
# LATE DOCKS (plan addendum 09-05) replay AFTER the desk docks: ENC-4b+4c (6 over ENC-4's tip), HORIZON-B1 (7), HORIZON-B2 (2), SEAT-78 (3), PANTHEON-ROSTER (over the §899 composed tip). ⚠ ENC-4b car 4 CONFLICTS with §899 chair car 4 on pantheon A5 — the replay STOPS there; resolve by hand to 115/381 (two kinds), continue.
sh $SC/replay-cars.sh $SC/laneDESKINT "$BASE" $SC/laneINTEG-tree:90702c3e9 $SC/laneWARFAITH:940d161ca $SC/laneGEN2:940d161ca $SC/laneDEF2:940d161ca $SC/laneECON2:940d161ca $SC/laneDESK9:940d161ca $SC/laneENC4B:7be568047 $SC/laneCHARSET2:df7cdd37e $SC/laneHOR2:5e28d5c83 $SC/laneSEAT78:5e28d5c83 $SC/laneROSTER:ec1b5e3e9 $SC/laneTIMEBAND:a2af55cde | tail -24
D=$SC/laneDESKINT; cd $D
node -e "import('./src/domain/display/stateProse/dossierMounts.js').then(m=>{const r=m.DOSSIER_MOUNTS,u=m.UNMOUNTED_BLOCKS;const both=r.map(x=>x.blockId).filter(b=>u.includes(b));const sent=r.filter(x=>x.rung==='sentence').map(x=>x.tab+'|'+x.blockId);const dup=sent.filter((k,i)=>sent.indexOf(k)!==i);console.log('registry: mounts',r.length,'dark',u.length,'in-both',both.length,'dup-sentence-per-tab',dup.length);if(both.length||dup.length)process.exit(1)})"
for f in src/domain/display/stateProse/*StateProse.js; do node -e "import('./$f').then(()=>{}).catch(e=>{console.log('EVAL FAIL $f',e.message);process.exit(1)})"; done; echo "desk modules evaluate"
echo "DESK PREP OK: $(git rev-list --count $BASE..HEAD) cars over $(echo $BASE | cut -c1-9); HEAD=$(git rev-parse --short HEAD); porcelain=$(git status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: the walkers at the tip, then the registers in DESK-LANDING-PLAN.md §3 order, then mk-landing-kit.py <N> laneDESKINT $BASE landing-desk-2026-09-05 <cars>"
