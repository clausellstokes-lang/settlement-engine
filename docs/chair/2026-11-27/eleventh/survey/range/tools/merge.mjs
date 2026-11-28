// RANGE-MEASURE: two description pools keep their canonical line apart from its variants; join them into one key.
// node merge.mjs <tree> <keys.json> <out.json>
//  - institutions: [catalog at.<tier>.desc, ...INSTITUTION_DESC_VARIANTS[`${tier}|${shelf}|${name}`]] (assembleInstitutions)
//  - history events: [HISTORICAL_EVENTS_DATA[type].description, ...HISTORY_DESC_VARIANTS[type]] (historyData.js)
// The joined key replaces the variants' key and the canonical's one-line key (a canonical shared by several joined keys
// stays in the first). Twin sets (a line with `twinOf`) are marked so (A) reads no twin as an alternative.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [TREE, IN, OUT] = process.argv.slice(2);
const data = JSON.parse(readFileSync(IN, 'utf8'));
const { INSTITUTION_DESC_VARIANTS } = await import(join(TREE, 'src/data/institutionDescVariants.js'));
const { INSTITUTION_FAMILIES } = await import(join(TREE, 'src/data/institutionalCatalog.js'));
const { HISTORY_DESC_VARIANTS } = await import(join(TREE, 'src/data/historyDescVariants.js'));
const { HISTORICAL_EVENTS_DATA } = await import(join(TREE, 'src/data/historyData.js'));
const groups = new Map(); // signature -> { name, texts }
for (const f of INSTITUTION_FAMILIES) for (const [tier, at] of Object.entries(f.at || {})) {
  const name = at.name || f.shared?.name; const desc = at.desc || f.shared?.desc; const v = INSTITUTION_DESC_VARIANTS[`${tier}|${f.shelf}|${name}`];
  if (!desc || !v) continue;
  const texts = [desc, ...v]; const sig = texts.join('\u0000');
  if (!groups.has(sig)) groups.set(sig, { name: `src/data/institutionDescVariants.js :: [joined] ${tier}|${f.shelf}|${name}`, texts });
}
for (const e of HISTORICAL_EVENTS_DATA) {
  const v = HISTORY_DESC_VARIANTS[e.type]; if (!v || !e.description) continue;
  const texts = [e.description, ...v]; const sig = texts.join('\u0000');
  if (!groups.has(sig)) groups.set(sig, { name: `src/data/historyDescVariants.js :: [joined] ${e.type}`, texts });
}
// index the extracted lines by text, per key
const byText = new Map();
data.keys.forEach((k, ki) => k.lines.forEach((l, li) => { if (!byText.has(l.text)) byText.set(l.text, []); byText.get(l.text).push([ki, li]); }));
const drop = new Set(); const added = [];
for (const g of groups.values()) {
  const lines = [];
  for (const t of g.texts) {
    const hit = (byText.get(t) || []).find(([ki]) => /institutionDescVariants\.js :: PAIRS|historyDescVariants\.js :: HISTORY_DESC_VARIANTS|institutionalCatalog\.js :: INSTITUTION_FAMILIES|historyData\.js :: HISTORICAL_EVENTS_DATA/.test(data.keys[ki].key));
    if (hit) { const [ki, li] = hit; lines.push({ ...data.keys[ki].lines[li] }); if (data.keys[ki].lines.length <= 3) drop.add(ki); }
    else lines.push({ text: t, site: g.name.split(' :: ')[0], decl: [] });
  }
  added.push({ key: g.name, file: g.name.split(' :: ')[0], kind: 'joined', inFn: false, lines });
}
// a canonical shared by several joined keys: keep each joined key whole (they are different keys), but drop the
// extracted one-line canonical and the variants' key.
const keys = data.keys.filter((_, ki) => !drop.has(ki)).concat(added);
for (const k of keys) {
  const twins = k.lines.filter((l) => (l.decl || []).includes('twinOf')).length;
  if (twins) k.twinSet = twins;
}
writeFileSync(OUT, JSON.stringify({ keys, code: data.code }));
console.log(`joined keys ${added.length} (institutions + history); dropped ${drop.size} split keys; keys now ${keys.length}; keys holding a twin ${keys.filter((k) => k.twinSet).length}`);
