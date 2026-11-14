// node b3fast.mjs <corpus> <tree>: the chain rows the PDF and the journal print (resourcesSlice), by status: towns whose worked row
// (full/partial) names a house the roster does not hold (housesStillNeeded, the tab's reader), towns whose unexploited row names houses.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const { resourcesSlice } = await import(T + '/src/pdf/lib/viewModelBodySlices.js');
const { housesStillNeeded } = await import(T + '/src/domain/display/validationOnPage.js');
const c = { workedLacking: new Set(), workedHeld: new Set(), workedAny: new Set(), unexpNamed: new Set(), outputs: new Set() }; const ex = [];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const ra = s.resourceAnalysis?.exploitation || {}; const cards = [...(ra.fullyExploited || []), ...(ra.partiallyExploited || [])];
  for (const row of resourcesSlice(s).chainRows) {
    if (row.output) c.outputs.add(seed);
    if (row.status === 'unexploited') { if (row.processing) c.unexpNamed.add(seed); continue; }
    if (!row.processing) continue; c.workedAny.add(seed);
    const card = cards.find((x) => (x.rawResource || x.resource) === row.resource); const lack = card ? housesStillNeeded(s, card.processingInstitutions) : [];
    if (lack.length) { c.workedLacking.add(seed); if (ex.length < 3) ex.push(`${seed} ${s.tier}: ${row.resource} | ${row.processing} | lacks ${lack.join(', ')}`); } else c.workedHeld.add(seed);
  } }
for (const [k, v] of Object.entries(c)) console.log(k, v.size); ex.forEach((e) => console.log('  ' + e));
