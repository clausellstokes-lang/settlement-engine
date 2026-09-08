import { evaluateTripwires } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/tripwires.mjs';
const lit = (o) => ({ subsystems: { rules: { demographicsEnabled: true } }, ...o });
const show = (label, r) => { const o = evaluateTripwires(r); console.log(label, '| notExec=', JSON.stringify(o.notExecutable.map(e=>e.id)), '| fire=', JSON.stringify(o.findings.map(e=>e.id))); };
show('EMPTY top-level series + empty yearly', lit({ yearlyPopulations: [], yearlyDiedFlags: [], behavioral: { yearly: [] } }));
show('MISSING everything            ', lit({}));
show('EMPTY series, motion+realm present', lit({ yearlyPopulations: [], yearlyDiedFlags: [], behavioral: { yearly: [{ motion: { populationTransitions: 4, populationMoved: 4 }, realmDemography: { loadRatio01: 0.8, binding: {} } }] } }));
