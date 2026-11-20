// BIRTH-3: THE BIRTH'S PICK FOR EVERY HOUSE EQUALS THE STORY READ BACK FROM THE RECORD IT WROTE (BR8 point 7).
// TREE=<tree> node agree.mjs <corpus> : over every saved record, the page's supply reading with the birth's picks laid on
// (`birthPicksOn(record, record._seed)`) against the record alone: every live house's input answers, marks, the short
// reading, the source stories, the gap lines, the grounds.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const SS = await import(R + '/domain/facts/supplyStory.js');
const RG = await import(R + '/generators/resourceGenerator.js');
const RS = await import(R + '/domain/resourceSemantics.js');
const CSR = await import(R + '/domain/display/crisisStoppedRow.js');
const VP = await import(R + '/domain/display/validationOnPage.js');
const { RESOURCE_CHAINS } = await import(R + '/data/goods/chains.js');
const { HOUSE_TRADE_INPUT } = await import(R + '/data/crisisDependence.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const { catalogIdForName } = await import(R + '/data/institutionalCatalog.js');
const sig = (r) => {
  const out = {};
  for (const i of liveInstitutions(r).filter((x) => x && typeof x.name === 'string')) {
    const id = i.catalogId || catalogIdForName(i.name) || '';
    const keys = [...new Set([HOUSE_TRADE_INPUT[id], ...HI.chainsOfHouse(i.name, RESOURCE_CHAINS).map(([k]) => k)].filter((k) => k && HI.CHAIN_INPUTS[k]))];
    out[i.name] = { inputs: keys.map((k) => [k, HI.houseInputAtHand(r, k, i, RESOURCE_CHAINS[k] || { rawResource: HI.CHAIN_RAW_INPUT[k] })]), mark: CSR.rowMarkText(r, 'house', i), short: HI.housesShortOf(r).get(i.name) ?? null, story: SS.sourceStoryOf(r, i, RS.resourceShortageImport)?.story ?? null };
  }
  return { houses: out, lines: VP.resourceGapLines(r).map((l) => l.impact), grounds: HI.impliedGroundsOnPage(r), venture: HI.ventureHouseOf(r)?.name ?? null };
};
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
let towns = 0; const bad = []; const byKind = {};
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line); towns++;
  const A = sig(RG.birthPicksOn(s, s._seed)), B = sig(s);
  if (JSON.stringify(A) === JSON.stringify(B)) continue;
  const d = [];
  for (const h of Object.keys(A.houses)) if (JSON.stringify(A.houses[h]) !== JSON.stringify(B.houses[h])) { d.push([h, A.houses[h], B.houses[h]]); const id = catalogIdForName(h) || h; byKind[id] = (byKind[id] || 0) + 1; }
  if (JSON.stringify(A.grounds) !== JSON.stringify(B.grounds)) d.push(['grounds', A.grounds, B.grounds]);
  if (A.venture !== B.venture) d.push(['venture', A.venture, B.venture]);
  if (JSON.stringify(A.lines) !== JSON.stringify(B.lines)) d.push(['lines', A.lines.filter((l) => !B.lines.includes(l)), B.lines.filter((l) => !A.lines.includes(l))]);
  bad.push({ seed, d });
}
console.log(JSON.stringify({ towns, differ: bad.length, byKind }));
for (const b of bad.slice(0, Number(process.env.SHOW || 6))) console.log(b.seed, JSON.stringify(b.d).slice(0, 900));
