// REVIEW-W2B-3: precision by family and by word from draw.json + verdicts.json. node tally.mjs <draw.json> <verdicts.json>
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const v = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).not;
const isFalse = (e) => !(String(e.n) in v);
const t = (rows) => `${rows.filter(isFalse).length} of ${rows.length}`;
console.log('whole-list draw (first sixty):', t(d.drawn.filter((e) => e.why.includes('whole list'))));
console.log('all drawn:', t(d.drawn));
const fams = [...new Set(d.drawn.flatMap((e) => e.families))];
for (const f of fams) console.log('family', f.padEnd(18), t(d.drawn.filter((e) => e.families.includes(f))), ' (page-list lines on the 720:', d.familyLines[f] ?? 0, ')');
const words = [...new Set(d.drawn.flatMap((e) => e.words.map((w) => w.split('/')[0])))];
for (const w of words.sort()) console.log('  word', w.padEnd(18), t(d.drawn.filter((e) => e.words.some((x) => x.startsWith(w + '/')))));
