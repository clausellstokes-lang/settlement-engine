// The rows writer: every printed rite of the pool with its description, for the samples (samples.mjs).
// Usage: node measure.mjs <pool.ndjson> <out.txt> [audience] [crisis]
// TRAD-4 unit 6 (2026-11-20) re-pointed it from TRAD-1's PROTOTYPE (tools/describe.mjs, the leaf as proposed) to THE
// FINAL LEAF (src/domain/traditions/traditionDescription.js :: describeTradition) over the set the audience is shown
// (measure2.mjs :: shownFor, the one reading of it), each slot read as measure2.mjs reads it (describeWithSlots): the line
// drawn, the line printed, and the resolution. `crisis` labels the rows of a crisis pool (trad-pool.mjs <dir> <crisis>).
import { readFileSync, writeFileSync } from 'node:fs';
import { ECONOMY_FIT, ECONOMY_RANKS, DEAD_EVENT_TYPES } from '../../../../../../src/data/traditionDescriptionTable.js';
import { describeWithSlots, shownFor } from './measure2.mjs';

const [, , poolFile, outFile, audience = 'owner', crisis = ''] = process.argv;
const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
const stressOf = (t) => (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((s) => s?.type).filter(Boolean);

/** what the description drew on, read from the record by the leaf's own parts and names (the payer by its fit and rank) */
function drewOn(rec, t, d) {
  const out = [];
  if (d.parts.keeper === 'owner') out.push(`keeper: the rite's owner in play, ${[...d.named.powers, ...d.named.houses].join(', ')}`);
  if (d.parts.keeper === 'house') out.push(`keeper: house ${d.named.houses.join(', ')}${d.named.persons.length ? `; presides: ${d.named.persons.join(', ')}` : ''}${d.named.powers.length ? `; power: ${d.named.powers.join(', ')}` : ''}`);
  if (d.parts.keeper === 'power') out.push(`keeper: power ${d.named.powers.join(', ')}`);
  if (d.parts.origin === 'cause') {
    const f = t.history?.founding || {};
    // the event the leaf names, by its name, the most recent of its kind a year or more ago (its `yearsAgo` is in the text)
    const ev = (t.history?.historicalEvents || []).filter((e) => d.named.events.includes(e?.name) && DEAD_EVENT_TYPES.includes(e?.templateType) && Number(e?.yearsAgo) >= 1)
      .sort((a, b) => Number(a.yearsAgo) - Number(b.yearsAgo))[0];
    out.push(d.named.events.length ? `cause: history event "${d.named.events.join(', ')}"${ev ? `, ${ev.yearsAgo} years ago` : ''}` : `cause: the founding (age ${f.age}${f.foundedBy ? `, by "${f.foundedBy}"` : ''})`);
  }
  if (d.parts.origin === 'economy') {
    const incomes = t.economicState?.incomeSources || [];
    const fits = [...(ECONOMY_FIT[rec.coreMotif.element] || []), ...(ECONOMY_FIT[rec.coreMotif.act] || [])];
    for (const fit of fits) {
      const r = incomes.findIndex((i) => i?.source === fit.source);
      if (r < 0 || r >= ECONOMY_RANKS.length) continue;
      out.push(`payer: income "${fit.source}", ${incomes.length === 1 ? 'the only one' : `rank ${r + 1} of ${incomes.length}`}`); break;
    }
  }
  return out;
}

const tot = { n: 0, short: 0 }; const rows = [];
for (const t of towns) {
  for (const { rec } of shownFor(t, audience)) {
    if (!rec) continue;
    const r = describeWithSlots(rec, t, audience);
    if (!r) continue;
    const { d, slots } = r; const short = !d.parts.keeper && !d.parts.origin;
    tot.n++; if (short) tot.short++;
    rows.push({
      town: t.name, tier: t.tier, culture: t.config?.culture, terrain: t.config?.terrainType, seed: t._seed, crisis, stress: stressOf(t),
      rec: { id: rec.id, name: rec.name, motif: rec.coreMotif, foundedYear: rec.foundedYear }, text: d.text, parts: d.parts,
      facts: drewOn(rec, t, d), short, slots,
    });
  }
}
const out = [`# rows — audience=${audience}${crisis ? `; crisis=${crisis}` : ''}; towns=${towns.length}; printed rites=${tot.n}; short forms=${tot.short}`];
writeFileSync(outFile, `${out.join('\n')}\n`);
writeFileSync(outFile.replace(/\.txt$/, '.rows.json'), JSON.stringify(rows));
console.log(out.join('\n'));
