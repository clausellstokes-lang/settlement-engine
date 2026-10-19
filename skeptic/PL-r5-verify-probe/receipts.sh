#!/bin/sh
# V-PL-r5 receipts: counts and quoted lines behind the report (read-only; ledger docs + master).
D=/Users/cstokes/Desktop/settlement-engine/docs
echo "## volume"; shasum -a 256 $D/DESIGN_FP_ARCH_PL.md; wc -l < $D/DESIGN_FP_ARCH_PL.md; stat -f "%Sm" $D/DESIGN_FP_ARCH_PL.md
echo "## ST->PL route (D-ST-r5 §5): 'no force the member holds hostile' in PL / ST"
grep -c "no force the member holds hostile" $D/DESIGN_FP_ARCH_PL.md; grep -c "no force the member holds hostile" $D/DESIGN_FP_ARCH_ST.md
echo "## PR->PL route (D-PR-r5 §5): bannerCoverOf(...).weeks in PL; 'weeksCovered > 0' / '(\`> 0\`)' in PL"
grep -c "bannerCoverOf(worldState" $D/DESIGN_FP_ARCH_PL.md; grep -c "weeksCovered > 0" $D/DESIGN_FP_ARCH_PL.md
grep -o "bannerCoverOf(worldState, memberId, tick) → { weeks, seasonStartTick }" $D/DESIGN_FP_ARCH_PR.md | head -1
echo "## PS->PL route (D-PS-r5 §5): passageStandingOf in PL; the ladder row in §5.3"
grep -c "passageStandingOf" $D/DESIGN_FP_ARCH_PL.md; grep -c "THE PASSAGE's standing ladder for EVERY unit" $D/DESIGN_FP_ARCH_PL.md
echo "## PL-Y2: PS 'first sight' answer vs PL 'LIEGE BELIEVES'"
grep -c "takes the answer at first sight through PL's pure decider" $D/DESIGN_FP_ARCH_PS.md; grep -c "only once the LIEGE BELIEVES" $D/DESIGN_FP_ARCH_PL.md; grep -c "B\.11" $D/DESIGN_FP_ARCH_PS.md
echo "## PL-Y1: the sweep's trigger and the tally's power"
grep -c "riders of the banner not the lord's own PLACED" $D/DESIGN_FP_ARCH_PL.md; grep -c "a rider of ANY OTHER power stood placed" $D/DESIGN_FP_ARCH_PR.md; grep -c "a threat Kell's riders could not reach" $D/DESIGN_FP_ARCH_PR.md
echo "## PL-Y3: the liege's-creed credit and the mirror"
grep -c "a flock of the liege's own creed is SERVICE, never a default" $D/DESIGN_FP_ARCH_PL.md; grep -c "is SERVICE: ONE requested \`service_answered\` credit" $D/DESIGN_FP_ARCH_PL.md
echo "## stale patch lists (minor)"
grep -c "elsewhere in the record only \`renew\`'s deference-up" $D/DESIGN_FP_ARCH_PL.md; grep -c "patches only on answers, \`renew\` and every \`fealty_defied\` price" $D/DESIGN_FP_ARCH_PL.md
echo "## fold raid rows"; grep -n "^| \`raid\` \|^| \`supply_raid\` " $D/DESIGN_FP_COHERENCE_FOLD.md | cut -c1-140
