// (4) TWENTY-FOUR SAMPLES, not picked by hand: per tier, the printed rites ordered by fnv1a(seed|rec.id), the first four.
import { readFileSync, writeFileSync } from 'node:fs';
import { fnv1a32 } from '../../../../../../src/kernel/proseHash.js';
const [, , rowsFile, outFile, perTier = '4', salt = ''] = process.argv;
const rows = JSON.parse(readFileSync(rowsFile, 'utf8'));
const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const picked = tiers.flatMap((tier) => rows.filter((r) => r.tier === tier).map((r) => ({ r, h: fnv1a32(`${salt}${r.seed}|${r.rec.id}`) })).sort((a, b) => a.h - b.h).slice(0, Number(perTier)).map((x) => x.r));
const out = [];
picked.forEach((r, i) => {
  out.push(`${i + 1}. ${r.town} (${r.tier}, ${r.culture}, ${r.terrain}) — ${r.rec.name}${r.short ? '  [SHORT FORM]' : ''}`);
  out.push(`   ${r.text}`);
  out.push(`   drew on: ${r.facts.length ? r.facts.join('; ') : '(the motif alone: ' + r.rec.motif.element + ' · ' + r.rec.motif.act + ')'}  [seed ${r.seed}, ${r.rec.id}]`);
  out.push('');
});
const cultures = new Set(picked.map((r) => r.culture));
out.push(`cultures: ${cultures.size} (${[...cultures].join(', ')}); short forms: ${picked.filter((r) => r.short).length} of ${picked.length}`);
writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.join('\n'));
