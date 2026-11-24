import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const SICK = new Set(['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Midwifery']);
const NOTES = { fam: 'No healer is kept here; the sick are tended by their own families.', one: "No healer's house stands here; the sick are tended by one of the place's own.",
  gap1: 'keeps no house of healing at a size where one is assumed', gap2: 'The sick in this town are tended at home', gap3: 'can set a bone or bind a cut, but has nothing for a serious wound or illness' };
const [REC, TEXT] = process.argv.slice(2);
const cnt = {}; const ex = {};
for (const l of readFileSync(REC, 'utf8').trim().split('\n')) {
  const r = JSON.parse(l);
  const web = readFileSync(join(TEXT, `${r.seed}.txt`), 'utf8').split(/^== /m).filter((s) => s.startsWith('web:')).join('\n');
  const care = (r.healing || []).some((e) => e.resident && SICK.has(e.name));
  for (const [k, x] of Object.entries(NOTES)) if (web.includes(x)) { const kk = `${k} care=${care}`; cnt[kk] = (cnt[kk] || 0) + 1; if (care) (ex[k] ||= []).push(r.seed); }
}
console.log(cnt); for (const [k, v] of Object.entries(ex)) console.log(k, v.slice(0, 8).join(' '));
