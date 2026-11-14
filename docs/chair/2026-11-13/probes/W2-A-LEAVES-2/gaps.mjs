// usage: node gaps.mjs <tree> <corpus.ndjson.gz> <out.json> — every gap line per seed, plus the leaf's lists
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, corpus, out] = process.argv.slice(2);
const v = await import(`${tree}/src/domain/display/validationOnPage.js`);
const t = await import(`${tree}/src/domain/display/tradeListDisplay.js`);
const lines = zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n').filter(Boolean);
const res = {};
for (const l of lines) {
  const r = JSON.parse(l); const s = r.s;
  const seed = r.seed || s._seed;
  const ip = t.importsAsPrinted ? t.importsAsPrinted(s) : null;
  res[seed] = { gaps: v.resourceGapLines(s).map((g) => g.impact), imports: ip,
    primary: s.economicState?.primaryImports || [], recGaps: (s.resourceAnalysis?.gaps || []).map((g) => `${g.institution}:${g.kind}`) };
}
fs.writeFileSync(out, JSON.stringify(res));
console.log('seeds', Object.keys(res).length);
