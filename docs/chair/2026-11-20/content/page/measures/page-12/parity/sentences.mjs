// PAGE-12, CAUSES-PARITY-2 step B (the brief `briefs/CAUSES-PARITY-2.md`): THE OWNER-SIDE CAUSE SENTENCES OF THE 900, IN ONE TREE.
// Run in each tree (before and after), on that tree's own births (`confinement/run.mjs <tree> <born> born --corpus=hxd`):
//   node sentences.mjs <tree> <born-dir> > <out>
// For every tension of every document of `<born-dir>/hxd.jsonl` whose kind has a table: one line
//   S <seed> <kind> <row> <sentence as JSON>
// where <row> is the cause row whose wording the sentence is (`plain`, `withoutItsHouse`), read off the tree's own data file.
// Then THE THREE PLAIN-toPublicSafe FAULTS (r2r-city-19, r2s-religious_conversion-city-0, r2s-wartime-metropolis-2; born as
// `censusPlan('r2')` + `configOf` births them): their crime_wave sentence on the owner record and on plain `toPublicSafe`:
//   FAULT <seed> owner <row> served <row> <same|DIFFERENT>
import { readFileSync } from 'node:fs';
const [, , L, BORN] = process.argv;
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);

/** text -> row, per kind; a `{power}` wording matches by its frame */
const rowsOf = Object.fromEntries(Object.entries(TENSION_CAUSES).map(([kind, t]) => {
  const list = [...t.causes.flatMap((c) => c.wordings.map((w) => [w.text, c.id])), ...t.plain.map((w) => [w.text, 'plain'])];
  if (t.withoutItsHouse) list.push([t.withoutItsHouse.text, 'withoutItsHouse']);
  return [kind, list];
}));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} kind @param {string|null} s */
const rowOf = (kind, s) => {
  for (const [text, row] of rowsOf[kind] || []) {
    if (text === s) return row;
    if (text.includes('{power}') && new RegExp(`^${text.split('{power}').map(esc).join('.+')}$`).test(String(s))) return row;
  }
  return '(none)';
};

for (const line of readFileSync(`${BORN}/hxd.jsonl`, 'utf8').split('\n')) {
  if (!line) continue;
  const { key, doc } = JSON.parse(line);
  for (const t of doc?.history?.currentTensions || []) {
    if (!Object.hasOwn(TENSION_CAUSES, t?.type)) continue;
    const s = tensionCauseSentenceOf(doc, t);
    console.log(`S ${key} ${t.type} ${rowOf(t.type, s)} ${JSON.stringify(s)}`);
  }
}

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const WANT = ['r2r-city-19', 'r2s-religious_conversion-city-0', 'r2s-wartime-metropolis-2'];
for (const row of censusPlan('r2').filter((r) => WANT.includes(r.seed))) {
  const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  const t = (doc.history?.currentTensions || []).find((x) => x?.type === 'crime_wave');
  const pub = toPublicSafe(doc);
  const t2 = (pub.history?.currentTensions || []).find((x) => x?.type === 'crime_wave');
  const own = tensionCauseSentenceOf(doc, t); const served = t2 ? tensionCauseSentenceOf(pub, t2) : null;
  console.log(`FAULT ${row.seed} owner ${rowOf('crime_wave', own)} served ${rowOf('crime_wave', served)} ${own === served ? 'same' : 'DIFFERENT'}`);
}
