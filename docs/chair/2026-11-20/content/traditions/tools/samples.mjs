// SAMPLES BY RULE, never by hand (rows from measure.mjs).
// (a) node samples.mjs <rows.json> <out> [perTier=4] [salt]: per tier, the printed rites ordered by fnv1a32(salt+seed|rec.id),
//     the first perTier.
// (b) TRAD-4 unit 6: node samples.mjs --crisis <calmRows.json> <out> <crisisRows.json>… : TWELVE FROM TOWNS IN CRISIS, each
//     beside the same rite's calm reading. Every printed rite of every crisis town is ordered by fnv1a32(crisis|seed|rec.id);
//     a rite is ELIGIBLE where the same seed's calm town prints the same rite (same id). Taken: first the first two eligible
//     of each crisis in that order, then the next eligible in that order, at most three a crisis, until twelve; printed in
//     that order. Then, over ALL crisis rites, how many read differently from their calm reading, and by which slots.
import { readFileSync, writeFileSync } from 'node:fs';
import { fnv1a32 } from '../../../../../../src/kernel/proseHash.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const drewOn = (r) => (r.facts.length ? r.facts.join('; ') : `(the motif alone: ${r.rec.motif.element} · ${r.rec.motif.act})`);
const stressNote = (r) => (r.stress && r.stress.length ? `the town holds a crisis of its own: ${r.stress.join(', ')}` : '');

function fairRule(rowsFile, outFile, perTier = '4', salt = '') {
  const rows = read(rowsFile);
  const picked = TIERS.flatMap((tier) => rows.filter((r) => r.tier === tier).map((r) => ({ r, h: fnv1a32(`${salt}${r.seed}|${r.rec.id}`) })).sort((a, b) => a.h - b.h).slice(0, Number(perTier)).map((x) => x.r));
  const out = [`Drawn by rule, not by hand: for each of the six sizes, every printed rite of the pool (${rows.length} rites, in the ${new Set(rows.map((r) => r.seed)).size} towns that print one) ordered by the hash fnv1a32(${salt ? `"${salt}" + ` : ''}seed|rite id), the first ${perTier}; ${picked.length} in all, in size order.`, ''];
  picked.forEach((r, i) => {
    out.push(`${i + 1}. ${r.town} (${r.tier}, ${r.culture}, ${r.terrain}) — ${r.rec.name}${r.short ? '  [SHORT FORM]' : ''}`);
    out.push(`   ${r.text}`);
    out.push(`   drew on: ${drewOn(r)}  [seed ${r.seed}, ${r.rec.id}]`);
    if (stressNote(r)) out.push(`   (${stressNote(r)})`);
    out.push('');
  });
  const cultures = new Set(picked.map((r) => r.culture));
  out.push(`cultures: ${cultures.size} (${[...cultures].join(', ')}); short forms: ${picked.filter((r) => r.short).length} of ${picked.length}; towns holding a crisis of their own: ${picked.filter((r) => stressNote(r)).length} of ${picked.length}`);
  writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.join('\n'));
}

/** a slot's group: S1's lead and gloss, S2's keeper, S3's origin */
const GROUP = { lead: 'lead', gloss: 'gloss', owner: 'keeper', house: 'keeper', power: 'keeper', keeper: 'keeper', cause: 'origin', economy: 'origin', origin: 'origin' };
const groups = (r) => { const m = {}; for (const s of r.slots) m[GROUP[s.kind] || s.kind] = s; return m; };
const said = (s) => (s.printed === null ? 'nothing' : `"${s.printed}"`);
const refusals = (r) => r.slots.filter((s) => s.resolvedBy !== 'drawn').map((s) => `${s.pool}: "${s.drawn}" refused → ${s.resolvedBy === 'none' ? 'nothing' : `${s.resolvedBy} ${said(s)}`}`);
/** the refusals the crisis reading makes that the calm one does not */
const crisisOnly = (c, k) => c.slots.filter((s) => s.resolvedBy !== 'drawn' && !k.slots.some((t) => t.pool === s.pool && t.resolvedBy === s.resolvedBy && t.printed === s.printed));
/** why a crisis reading differs from its calm one: its own refusals, and/or a record that differs (what each drew on) */
const causes = (c, k) => {
  const out = crisisOnly(c, k).map((s) => `${s.pool} refused → ${s.resolvedBy}`);
  if (c.facts.join('; ') !== k.facts.join('; ')) out.push('the record it drew on differs');
  if (!out.length) out.push('other (a line refused in the calm reading only)');
  return out;
};
/** the groups whose drawn pool or printed line differ between the crisis reading and the calm one */
const differing = (c, k) => {
  const a = groups(c); const b = groups(k);
  return ['lead', 'gloss', 'keeper', 'origin'].filter((g) => (a[g]?.pool ?? '') !== (b[g]?.pool ?? '') || (a[g]?.printed ?? null) !== (b[g]?.printed ?? null));
};

function crisisRule(calmFile, outFile, crisisFiles) {
  const calm = new Map(read(calmFile).map((r) => [`${r.seed}|${r.rec.id}`, r]));
  const all = crisisFiles.flatMap(read);
  const crises = [...new Set(all.map((r) => r.crisis))];
  const ordered = all.map((r) => ({ r, h: fnv1a32(`${r.crisis}|${r.seed}|${r.rec.id}`), k: calm.get(`${r.seed}|${r.rec.id}`) }))
    .sort((a, b) => a.h - b.h || (`${a.r.crisis}|${a.r.seed}|${a.r.rec.id}` < `${b.r.crisis}|${b.r.seed}|${b.r.rec.id}` ? -1 : 1));
  const taken = new Set(); const per = new Map(crises.map((c) => [c, 0]));
  for (const c of crises) { let n = 0; for (let i = 0; i < ordered.length && n < 2; i++) if (ordered[i].r.crisis === c && ordered[i].k) { taken.add(i); n++; per.set(c, n); } }
  for (let i = 0; i < ordered.length && taken.size < 12; i++) {
    const { r, k } = ordered[i]; if (!k || taken.has(i) || per.get(r.crisis) >= 3) continue;
    taken.add(i); per.set(r.crisis, per.get(r.crisis) + 1);
  }
  const idx = [...taken].sort((a, b) => a - b); const last = idx[idx.length - 1];
  const skippedWalk = ordered.slice(0, last + 1).filter((x) => !x.k).length;
  const skippedAll = ordered.filter((x) => !x.k).length;
  const out = [
    'Drawn by rule, not by hand: every printed rite of every crisis town (the same 432 seeds as the calm pool, each born with one crisis forced: '
    + `${crises.join(', ')}) ordered by the hash fnv1a32(crisis|seed|rite id); a rite is taken only where the same seed's calm town prints the same rite; first the first two such of each crisis, then the next in hash order, at most three a crisis, until twelve. Printed in hash order. Each is the owner's reading.`,
    `Skipped on the way (the calm town of that seed does not print the same rite): ${skippedWalk} of the ${last + 1} rites the walk passed, in hash order, to its twelfth pick. Over all crisis rites: ${skippedAll} of ${ordered.length} have no calm counterpart (${(100 * skippedAll / ordered.length).toFixed(1)}%).`,
    '',
  ];
  idx.forEach((i, n) => {
    const { r, k } = ordered[i];
    out.push(`${n + 1}. ${r.crisis.toUpperCase()} — ${r.town} (${r.tier}, ${r.culture}) — ${r.rec.name}${k.town !== r.town ? `  [the calm town of this seed is named ${k.town}]` : ''}`);
    out.push(`   IN CRISIS: ${r.text}`);
    out.push(`   CALM:      ${k.text}`);
    if (stressNote(k)) out.push(`   (the calm reading's town is not quite calm: ${stressNote(k).replace('the town holds a crisis of its own: ', 'it holds ')})`);
    if (r.text === k.text) out.push('   the same reading.');
    else {
      const ref = crisisOnly(r, k).map((s) => `${s.pool}: "${s.drawn}" refused → ${s.resolvedBy === 'none' ? 'nothing' : `${s.resolvedBy} ${said(s)}`}`);
      out.push(`   refused under the crisis: ${ref.length ? ref.join('; ') : 'nothing'}`);
      const kref = refusals(k); if (kref.length) out.push(`   refused in the calm reading too: ${kref.join('; ')}`);
      if (r.facts.join('; ') !== k.facts.join('; ')) out.push(`   the record differs — in crisis it drew on: ${r.facts.join('; ') || '(the motif alone)'}`, `                       calm, it drew on: ${k.facts.join('; ') || '(the motif alone)'}`);
      out.push(`   slots that read differently: ${differing(r, k).join(', ') || 'none (the same lines, filled differently)'}`);
    }
    out.push('');
  });
  // ALL crisis rites against their calm readings
  out.push('ALL CRISIS RITES AGAINST THEIR CALM READINGS (each crisis: rites printed; with a calm counterpart; reading differently; why, a rite counted under each cause it has)');
  for (const c of crises) {
    const xs = ordered.filter((x) => x.r.crisis === c); const paired = xs.filter((x) => x.k); const diff = paired.filter((x) => x.r.text !== x.k.text);
    const by = new Map(); const bump = (key) => by.set(key, (by.get(key) || 0) + 1);
    let wordOnly = 0; let recordOnly = 0; let both = 0;
    for (const { r, k } of diff) {
      const why = causes(r, k); why.forEach(bump);
      const rec = why.includes('the record it drew on differs'); const word = why.some((w) => w.includes(' refused → '));
      if (rec && word) both++; else if (rec) recordOnly++; else if (word) wordOnly++;
    }
    out.push(`  ${c}: ${xs.length} printed; ${paired.length} with a calm counterpart; ${diff.length} read differently (a line refused only: ${wordOnly}; the record only: ${recordOnly}; both: ${both}) — ${[...by].sort((a, b) => b[1] - a[1]).map(([a, b]) => `${a} ${b}`).join('; ') || '-'}`);
  }
  writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.slice(0, 3).join('\n')); console.log(out.slice(-6).join('\n'));
}

if (process.argv[2] === '--crisis') { const [, , , calmFile, outFile, ...crisisFiles] = process.argv; crisisRule(calmFile, outFile, crisisFiles); }
else { const [, , rowsFile, outFile, perTier, salt] = process.argv; fairRule(rowsFile, outFile, perTier, salt); }
