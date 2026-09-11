import { readFileSync } from 'node:fs';
import { TRIPWIRES, evaluateTripwires } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/tripwires.mjs';

const path = process.argv[2];
const r = JSON.parse(readFileSync(path, 'utf8'));

const row = (id) => TRIPWIRES.find((t) => t.id === id);

console.log('receipt kind/years/settlements:', r.kind, r.years, r.settlements);
console.log('demographicsEnabled gate:', r?.subsystems?.rules?.demographicsEnabled);
console.log('yearlyPopulations present?', Array.isArray(r.yearlyPopulations), ' yearlyDiedFlags present?', Array.isArray(r.yearlyDiedFlags));
console.log('receipt.notExecutable:', JSON.stringify(r.notExecutable));
console.log('receipt.passed:', r.passed, ' failures:', JSON.stringify(r.failures));

// AS SHIPPED
for (const id of ['capacity_plateau', 'capacity_floor_thaw']) {
  console.log(`AS-SHIPPED ${id} ->`, JSON.stringify(row(id).detect(r)));
}
const ev = evaluateTripwires(r);
console.log('evaluateTripwires findings:', ev.findings.length, 'observability:', ev.observability.length);
console.log('findings ids:', ev.findings.map((f) => f.id).join(',') || '(none)');

// PATCH the series in from behavioral.yearly
const yearly = r?.behavioral?.yearly;
console.log('behavioral.yearly length:', Array.isArray(yearly) ? yearly.length : 'ABSENT');
if (Array.isArray(yearly) && yearly.length) {
  console.log('yearly[0] keys:', Object.keys(yearly[0]).join(','));
  const sv0 = yearly[0].stateVectors;
  console.log('stateVectors[0] shape:', sv0 ? JSON.stringify(Object.keys(sv0)) : 'ABSENT');
  const ids = sv0 ? Object.keys(sv0) : [];
  const yearlyPopulations = yearly.map((y) => ids.map((id) => Number(y?.stateVectors?.[id]?.population) || 0));
  const yearlyDiedFlags = yearly.map(() => ids.map(() => false));
  const patched = { ...r, yearlyPopulations, yearlyDiedFlags };
  console.log('PATCHED series length:', yearlyPopulations.length, 'settlements:', ids.length);
  for (const id of ['capacity_plateau', 'capacity_floor_thaw']) {
    const out = row(id).detect(patched);
    console.log(`PATCHED ${id} ->`, out.length ? '\n  ' + out.join('\n  ') : '[] (silent)');
  }
}
