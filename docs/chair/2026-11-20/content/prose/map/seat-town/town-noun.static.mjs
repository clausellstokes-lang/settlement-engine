/**
 * town-noun.static.mjs — TOWN-NOUN's static count (brief MEASURE-SEAT-TOWN, unit 2, items 1 and 3). MEASURE ONLY.
 * Plain node: `node town-noun.static.mjs <ROOT> <out.json>`. Reads the six `src/data/dossierStateProse/*.generated.js`
 * leaves and, for every variant, every word that holds "town" (case-insensitive). Each whole-word `town` / `town's` is
 * classed by the kernel's OWN pass (`stateProseKernel.js :: speakTierNoun` at 'village' and at 'city', and its kept list
 * `tierNounKeptSpans`): MOVED (the pass speaks it: the line calls the place a town), KEPT (a `TIER_NOUN_KEPT` phrase: a
 * comparison, an idiom, a title), or RESIDUAL (neither: listed for the eye). `towns` and the compounds (townsfolk,
 * townspeople, townsman, downtown, ...) are listed apart. Then each counted wording is spoken at the six sizes, and the
 * outputs are flagged by rule where they may not be good English. Tier eligibility is the vocabulary's own reader
 * (`factVocabulary.js :: atomHolds` over `{ tier }`) on the variant's `tier:` marks; any `population:` mark is reported.
 */
import { writeFileSync } from 'node:fs';

const [, , ROOT, OUTFILE] = process.argv;
const { speakTierNoun, tierNounKeptSpans } = await import(`${ROOT}/src/domain/display/stateProse/stateProseKernel.js`);
const { atomHolds, parseAtom } = await import(`${ROOT}/src/domain/facts/factVocabulary.js`);
const LEAVES = { defense: 'DOSSIER_STATE_PROSE_DEFENSE', economy: 'DOSSIER_STATE_PROSE_ECONOMY', general: 'DOSSIER_STATE_PROSE_GENERAL', power: 'DOSSIER_STATE_PROSE_POWER', stressors: 'DOSSIER_STATE_PROSE_STRESSORS', warFaith: 'DOSSIER_STATE_PROSE_WAR_FAITH' };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const WHOLE = /(?<![\p{L}\p{N}_])[Tt]own(?:['’]s)?(?![\p{L}\p{N}_])/gu;
const ANY = /[\p{L}\p{N}_'’-]*[Tt][Oo][Ww][Nn][\p{L}\p{N}_'’-]*/gu;
const countWhole = (s) => (String(s).match(WHOLE) || []).length;

function tierSizes(marks) {
  const tierMarks = (marks || []).filter((m) => { const w = String(m).replace(/^no /, ''); return parseAtom(w)?.dimension === 'tier'; });
  const sizes = SIZES.filter((tier) => tierMarks.every((m) => { const neg = /^no /.test(m); const h = atomHolds(String(m).replace(/^no /, ''), { tier }); return neg ? h === false : h === true; }));
  return { tierMarks, sizes, population: (marks || []).filter((m) => /^(no )?population/.test(String(m))) };
}
function flagsOf(out, size) {
  const f = [];
  if (/\ban (thorp|hamlet|village|city|metropolis)\b/i.test(out)) f.push('an+consonant noun');
  if (/\ba (?=[aeiou])/i.test(out) && !/\ba (?=[aeiou])/i.test(out.replace(new RegExp(size, 'g'), 'town'))) f.push('a+vowel');
  if (size !== 'town' && countWhole(out) > 0) f.push('town left beside the noun');
  if (/\bmetropolis['’]s\b/.test(out)) f.push("metropolis's");
  if (new RegExp(`\\b${size}\\b[\\s\\S]*\\b${size}\\b`, 'i').test(out) && size !== 'town') f.push('noun twice');
  if (/\b(thorp|hamlet|village|city|metropolis)s\b/.test(out)) f.push('plural');
  return f;
}

const rows = []; const apart = []; let variants = 0;
for (const [file, sym] of Object.entries(LEAVES)) {
  const C = (await import(`${ROOT}/src/data/dossierStateProse/${file}.generated.js`))[sym];
  for (const [blockId, blk] of Object.entries(C)) for (const [poolKey, pool] of Object.entries(blk.pools || {})) pool.forEach((v, i) => {
    variants += 1;
    const text = String(v.text ?? '');
    const words = text.match(ANY) || [];
    if (!words.length) return;
    const vid = v.vid ?? i;
    for (const w of words) if (!/^[Tt]own(['’]s)?$/.test(w)) apart.push({ file, blockId, poolKey, vid, word: w, text });
    const whole = countWhole(text);
    if (!whole) return;
    const atVillage = speakTierNoun(text, 'village');
    const atCity = speakTierNoun(text, 'city');
    const moved = whole - countWhole(atVillage);
    const movedCity = whole - countWhole(atCity);
    const keptPhrases = [...new Set([...tierNounKeptSpans(text, 'village'), ...tierNounKeptSpans(text, 'city')].map(([a, b]) => text.slice(a, b)))];
    const residual = whole - Math.max(moved, movedCity) - 0;
    const { tierMarks, sizes, population } = tierSizes(v.marks);
    const outputs = Object.fromEntries(SIZES.map((s) => [s, speakTierNoun(text, s)]));
    rows.push({
      file, blockId, poolKey, vid, text, marks: v.marks || [], dmOnly: (v.marks || []).includes('dm-only'),
      whole, moved, movedCity, keptPhrases, residual, tierMarks, eligibleSizes: sizes, population,
      outputs, flags: Object.fromEntries(SIZES.map((s) => [s, flagsOf(outputs[s], s)])),
    });
  });
}
const counted = rows.filter((r) => r.moved > 0 || r.movedCity > 0);
const byFile = {};
for (const r of counted) byFile[r.file] = (byFile[r.file] || 0) + 1;
const summary = { variants, withWholeTown: rows.length, counted: counted.length, byFile, notMoved: rows.filter((r) => !(r.moved > 0 || r.movedCity > 0)).length, apart: apart.length };
writeFileSync(OUTFILE, JSON.stringify({ summary, rows, apart }, null, 1));
console.log(JSON.stringify(summary));
