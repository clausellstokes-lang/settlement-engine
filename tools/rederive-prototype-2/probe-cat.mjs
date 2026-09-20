import { instrumentedRoot, runHeadless } from './instrument.mjs';
import { sample63, clone } from './lib.mjs';
const row = sample63().find(r => r.settType === 'town');
let cat = null;
const base = runHeadless(row, instrumentedRoot(row._seed).root, { onStep: (n, c) => { if (n === 'assembleInstitutions') cat = clone(c.catalogForTier); } });
console.log('typeof catalogForTier =', typeof cat, Array.isArray(cat) ? 'array' : '', cat && Object.keys(cat).slice(0, 12));
if (cat && !Array.isArray(cat)) {
  const k0 = Object.keys(cat)[0];
  console.log('first bucket', k0, JSON.stringify(cat[k0]).slice(0, 400));
}
const rec = base.settlement;
console.log('institution[0] keys:', Object.keys(rec.institutions[0]));
console.log('institution[0]:', JSON.stringify(rec.institutions[0]).slice(0, 400));
console.log('availableServices keys:', Object.keys(rec.availableServices || {}));
console.log('sample service entry:', JSON.stringify(Object.values(rec.availableServices||{})[0]?.[0]).slice(0,300));
console.log('powerStructure keys:', Object.keys(rec.powerStructure || {}));
console.log('powerStructure.factions[0]:', JSON.stringify(rec.powerStructure.factions?.[0]).slice(0, 400));
console.log('factions[0] keys:', Object.keys(rec.factions?.[0] || {}));
