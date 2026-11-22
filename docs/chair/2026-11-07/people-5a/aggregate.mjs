// PEOPLE-5A DISPLAY — aggregate prove.mjs's lines, per tier; with a base file, the veil compared.
//   node docs/chair/2026-11-07/people-5a/aggregate.mjs <tip.jsonl> [<base.jsonl>]
import { readFileSync } from 'node:fs';

const load = (p) => readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [tipPath, basePath] = process.argv.slice(2);
const tip = load(tipPath);
const base = basePath ? new Map(load(basePath).map((r) => [r.label, r])) : null;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

const rows = [];
let errors = 0;
for (const tier of TIERS) {
  const rs = tip.filter((r) => r.tier === tier);
  if (!rs.length) continue;
  const sum = (f) => rs.reduce((a, r) => a + f(r), 0);
  const veilSame = base ? rs.filter((r) => base.get(r.label) && base.get(r.label).veil?.cards === r.veil?.cards).length : null;
  rows.push({
    tier, settlements: rs.length, throws: sum((r) => r.errors.length), cards: sum((r) => r.npcs),
    cardsWithLine: sum((r) => r.cardsWithLine), strayLines: sum((r) => r.strayLines),
    pdfLines: sum((r) => r.pdfLines), pdfStray: sum((r) => r.pdfStray),
    groupsOk: rs.filter((r) => r.groupsOk).length, countsOk: rs.filter((r) => r.countsOk).length,
    veilSame,
  });
  errors += sum((r) => r.errors.length);
}
console.log('| tier | settlements | throws | cards | cards with a power line | lines naming a missing power | PDF rows with a power line | PDF rows naming a missing power | NPC tab groups every card once | Power tab counts = memberships |' + (base ? ' veiled card key sets = base |' : ''));
console.log('|---|---|---|---|---|---|---|---|---|---|' + (base ? '---|' : ''));
for (const r of rows) {
  console.log(`| ${r.tier} | ${r.settlements} | ${r.throws} | ${r.cards} | ${r.cardsWithLine} | ${r.strayLines} | ${r.pdfLines} | ${r.pdfStray} | ${r.groupsOk}/${r.settlements} | ${r.countsOk}/${r.settlements} |` + (base ? ` ${r.veilSame}/${r.settlements} |` : ''));
}
const pubKeys = [...new Set(tip.flatMap((r) => r.veil?.pubKeys || []))].sort();
console.log(`\npublic NPC keys (toPublicSafe, unchanged allowlist): ${pubKeys.join(', ')}`);
const errs = tip.flatMap((r) => r.errors.map((e) => `${r.label}: ${e}`));
console.log(`throws: ${errors}${errs.length ? `\n${errs.slice(0, 20).join('\n')}` : ''}`);
if (base) {
  const diff = tip.filter((r) => base.get(r.label) && base.get(r.label).veil?.cards !== r.veil?.cards).map((r) => r.label);
  console.log(`veil card-key-set digests differing from the base: ${diff.length}${diff.length ? ` (${diff.slice(0, 10).join(', ')})` : ''}`);
}
