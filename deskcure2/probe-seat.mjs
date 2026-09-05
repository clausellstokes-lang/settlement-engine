import { defenseCriminalProse } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/laneINTEG-tree/src/domain/display/stateProse/defenseStateProse.js';
const underworld = (government, criminalCaptureState='capture') => ({
  name: 'Thornwall', _seed: 'seed-def4',
  powerStructure: { government, criminalCaptureState },
});
for (const gov of ['Grand Merchant Oligarchy', undefined]) {
  const d = defenseCriminalProse(underworld(gov), null, { seed: 'seat-a', audience: 'dm' });
  console.log('government =', JSON.stringify(gov));
  console.log('  poolKey  :', d.capture?.provenance?.poolKey);
  console.log('  sentence :', JSON.stringify(d.capture?.sentence));
}
