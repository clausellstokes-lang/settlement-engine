import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const SICK = new Set(['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Midwifery', ...(process.env.BA ? ['Birth assistance'] : [])]); // Birth assistance struck
const L = { H2: 'There is no healer here, and the sick are nursed at home.', H3: 'Nobody here heals by trade, and a visitor who falls ill must make do.',
  H7: 'Anyone who falls ill here is nursed by family, for there is no healer to send for.', H8: 'A visitor who falls sick here will find no healer to call on.',
  H9: 'Sickness is something people here deal with at home, as best they can.' };
const [REC, TEXT] = process.argv.slice(2);
const recs = readFileSync(REC, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const out = {}; let n = 0;
for (const r of recs) {
  const t = readFileSync(join(TEXT, `${r.seed}.txt`), 'utf8');
  const web = t.split(/^== /m).filter((s) => s.startsWith('web:')).join('\n');
  const lines = Object.entries(L).filter(([, x]) => web.includes(x)).map(([k]) => k);
  const care = (r.healing || []).filter((e) => e.resident && SICK.has(e.name));
  if (lines.length && (care.length || r.sickHouse)) { n++; console.log(`${r.seed}\t${lines.join(',')}\tsickHouse=${r.sickHouse}\t${care.map((e) => `${e.name}@${e.institution}`).join('; ')}`); }
}
console.log('TOTAL', n);
