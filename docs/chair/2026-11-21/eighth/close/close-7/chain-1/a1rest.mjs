const root = '/home/user/wt/a1/src';
const { INSTITUTION_SERVICES } = await import(root + '/data/institutionServices.js');
const { classifyService } = await import(root + '/generators/services/serviceClassifier.js');
const SICK = new Set(['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Birth assistance', 'Midwifery']);
const RX = /sick|ill(ness)?\b|injur|wound|fever|disease|heal|medic|surg|cure|poison|plague|patient|remed|physician|ailment/i;
for (const [inst, svcs] of Object.entries(INSTITUTION_SERVICES)) for (const [name, d] of Object.entries(svcs)) {
  if (SICK.has(name)) continue;
  const cat = classifyService(name, inst);
  if (cat === 'healing' || RX.test(name) || RX.test(d.desc || '')) console.log(`${cat}\t${inst}\t${name}\tp=${d.p} on=${d.on}\t${d.desc}`);
}
