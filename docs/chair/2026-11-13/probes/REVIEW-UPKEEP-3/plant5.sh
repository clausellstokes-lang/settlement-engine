# REVIEW-UPKEEP-3: one plant per guard added since 65cb03ef1, each a one-line sed on the scratch worktree at
# 0a07f98c7, run against the test that claims the guard, reverted after. usage: sh plant5.sh <logdir>
set -u; L=$1
run(){ name=$1; shift; GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 "$@" > $L/plant5.$name.log 2>&1; e=$?; echo "plant $name: exit $e; $(grep -E '^ +Tests +[0-9]' $L/plant5.$name.log | tr -s ' ')"; grep -E '^ +(×|✗) ' $L/plant5.$name.log | head -4 | cut -c1-170; git checkout -- src; }
PAY="tests/generators/payOneHome.test.js tests/generators/upkeepHired.test.js"
SURF="tests/domain/display/prosperityInCrisis.test.js tests/ui/prosperityInCrisisSurfaces.test.jsx"
run clean-pay $PAY tests/generators/magicCountOnce.test.js tests/generators/defenceParts.test.js $SURF
sed -i 's/  const band = economicSurvivalBandOf(r);/  const band = "STRONG";/' src/domain/display/threatAssessment.js; run A-money-line $PAY
sed -i 's/  return band ? ({ STRONG/  return standing; return band ? ({ STRONG/' src/generators/safetyProfile.js; run A-purse-word $PAY
sed -i 's/  const contracted = partitionDefenseInstitutions(institutions).mercenary.length > 0;/  const contracted = true;/' src/generators/safetyProfile.js; run B-contracted $PAY
sed -i 's/  return `${article(subject)} ${subject}, ${warClauseOf(warStatus)}.`;/  return `${article(subject)} ${subject}, ${warClauseOf(warStatus)}. Moderate before the war; Poor while it lasts.`;/' src/components/map/heraldRegister.js; run C-register $SURF
sed -i "s/new Set(\['recently_betrayed', 'religious_conversion'\])/new Set([])/" src/domain/display/prosperityInCrisis.js; run D-since $SURF
sed -i 's/  return line ? `${LEAD_WORD}: ${line}` : null;/  return line ?? null;/' src/domain/display/prosperityInCrisis.js; run D-led-all $SURF
sed -i 's/{prosperityInCrisisLed(overview.prosperityInCrisis)}/{overview.prosperityInCrisis}/' src/pdf/sections/Cover.jsx; run D-led-cover-only $SURF
sed -i 's/? computeEffectiveMagicPresence(magicPresenceRosterOf(institutions),/? computeEffectiveMagicPresence(institutions,/' src/generators/defenseGenerator.js; run E-roster tests/generators/magicCountOnce.test.js tests/generators/defenceParts.test.js
sed -i "291s/    add('STANDS', 'will'/    paid('STANDS', 'will'/" src/generators/defenseGenerator.js; run W-will-paid tests/generators/defenceParts.test.js
sed -i 's/  wallKind: Object.freeze({ stone: 1, palisade: 0.6 }),/  wallKind: Object.freeze({ stone: 1, palisade: 0.6, earthwork: 0.4 }),/' src/data/defenceWeights.js; run X-earthwork tests/generators/defenceParts.test.js
