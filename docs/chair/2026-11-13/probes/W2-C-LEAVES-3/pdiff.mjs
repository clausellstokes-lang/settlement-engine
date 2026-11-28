// What a change moves on the page leaves: gap lines, the shown grade, Produced locally, the needs line; tree A vs tree B.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, A, B, outf] = process.argv.slice(2);
const load = async (T) => ({ v: await import(T+'/src/domain/display/validationOnPage.js'), t: await import(T+'/src/domain/display/tradeListDisplay.js') });
const a = await load(A), b = await load(B);
const snap = (m, s) => {
  const g = m.v.exploitationGroupsShown ? m.v.exploitationGroupsShown(s) : null;
  return { gap: m.v.resourceGapLines(s).map(x => x.impact),
    grade: g ? Object.entries(g).flatMap(([k, xs]) => xs.map(x => `${x.card.rawResource}=${k}`)) : [],
    local: m.t.localProductionAsPrinted(s), needs: m.t.importsAsPrinted(s).needed, arriving: m.t.importsAsPrinted(s).arriving };
};
const tally = {}; const rows = [];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const x = snap(a, s), y = snap(b, s); const d = { seed };
  for (const k of Object.keys(x)) { const gone = x[k].filter(q => !y[k].includes(q)), added = y[k].filter(q => !x[k].includes(q));
    if (gone.length || added.length) { d[k] = { gone, added }; tally[k] ??= { towns: 0, gone: 0, added: 0 }; tally[k].towns++; tally[k].gone += gone.length; tally[k].added += added.length; } }
  if (Object.keys(d).length > 1) rows.push(d);
}
console.log(JSON.stringify(tally)); fs.writeFileSync(outf, JSON.stringify(rows, null, 1));
