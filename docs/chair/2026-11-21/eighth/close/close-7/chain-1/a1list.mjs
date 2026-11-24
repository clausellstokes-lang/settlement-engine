import fs from 'node:fs';
const root = '/home/user/wt/a1/src';
const { INSTITUTION_SERVICES } = await import(root + '/data/institutionServices.js');
const src = fs.readFileSync(root + '/data/institutionServices.js', 'utf8').split('\n');
const SICK = ['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Birth assistance', 'Midwifery'];
// line lookup: find institution header line then service line after it
function lineOf(inst, svc) {
  const hi = src.findIndex((l) => l.trim().startsWith(JSON.stringify(inst) + ':'));
  if (hi < 0) return '?';
  for (let i = hi + 1; i < src.length; i++) {
    if (src[i].includes(JSON.stringify(svc) + ':')) return i + 1;
    if (/^  "[^"]+": \{/.test(src[i])) break;
  }
  return 'const?' + hi;
}
for (const name of SICK) {
  const rows = [];
  for (const [inst, svcs] of Object.entries(INSTITUTION_SERVICES)) if (svcs[name]) rows.push({ inst, ...svcs[name], line: lineOf(inst, name) });
  console.log(`## ${name} (${rows.length})`);
  for (const r of rows) console.log(`  L${r.line}  ${r.inst}  p=${r.p} on=${r.on} needs=${JSON.stringify(r.needs||[])} ${r.requires?'req='+JSON.stringify(r.requires):''} desc="${r.desc}"`);
}
