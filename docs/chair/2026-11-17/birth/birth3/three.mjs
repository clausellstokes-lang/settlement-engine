// BIRTH-3: THE THREE EQUAL (BR8 point 7). TREE=<tree> node three.mjs <corpus.ndjson.gz> [out.json]
// For every born town: the page's supply reading (each live house's mark on the tab and in the PDF, the short reading,
// the gap lines, the Resources tab's grounds) read from (a) the record, (b) the record with its seed deleted, (c) its public
// projection (toPublicSafe) and (d) the share veil over it: the towns where any differs from (a).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const CSR = await import(R + '/domain/display/crisisStoppedRow.js');
const VP = await import(R + '/domain/display/validationOnPage.js');
const PDF = await import(R + '/pdf/lib/crisisMarksOnPage.js');
const { toPublicSafe } = await import(R + '/domain/display/publicSafe.js');
const { projectShareVeil } = await import(R + '/domain/display/galleryVeil.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const grounds = HI.groundsOnPage || HI.impliedGroundsOnPage;
const sig = (r) => {
  const houses = liveInstitutions(r).filter((i) => i && typeof i.name === 'string').map((i) => i.name).sort();
  const byName = new Map(liveInstitutions(r).map((i) => [i?.name, i]));
  const short = HI.housesShortOf(r);
  return {
    marks: houses.map((h) => [h, CSR.rowMarkText(r, 'house', byName.get(h)), PDF.markOnPage(r, 'house', byName.get(h)), short.get(h) ?? null]),
    lines: VP.resourceGapLines(r).map((l) => l.impact),
    grounds: grounds ? grounds(r) : null,
  };
};
const unseed = (s) => { const c = structuredClone(s); delete c._seed; delete c._regenSeed; if (c.config) delete c.config._seed; return c; };
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const out = { towns: 0, differ: { unseeded: [], public: [], veil: [] }, examples: {} };
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line); out.towns++;
  const a = JSON.stringify(sig(s));
  const forms = { unseeded: unseed(s), public: toPublicSafe(structuredClone(s)), veil: projectShareVeil(toPublicSafe(structuredClone(s)), null) };
  for (const [k, r] of Object.entries(forms)) {
    const b = JSON.stringify(sig(r));
    if (a !== b) { out.differ[k].push(seed); if (!out.examples[seed]) { const A = sig(s), B = sig(r); out.examples[seed] = { form: k, marks: A.marks.filter((m, i) => JSON.stringify(m) !== JSON.stringify(B.marks[i])).map((m, i) => [m, B.marks.find((x) => x[0] === m[0])]).slice(0, 4), linesA: A.lines.filter((l) => !B.lines.includes(l)), linesB: B.lines.filter((l) => !A.lines.includes(l)), groundsA: A.grounds, groundsB: B.grounds }; } }
  }
}
const summary = { towns: out.towns, unseeded: out.differ.unseeded.length, public: out.differ.public.length, veil: out.differ.veil.length, anyTown: new Set([...out.differ.unseeded, ...out.differ.public, ...out.differ.veil]).size };
console.log(JSON.stringify(summary));
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify({ summary, ...out }, null, 1));
