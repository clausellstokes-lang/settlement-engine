// BIRTH-AUDIT Q4 · A CANDIDATE RULE COUNTED: the base corpus read by the base tree, the rule's corpus read by the rule's
// tree (BIRTH_RULE in the environment selects the prototype's rule; the two trees load as two module graphs). Per town:
// the marks (`housesShortOf`), their cause (q1census.mjs's reading with every crisis taken away), and the PRINTABLE LINES
// the record gives the page without a render: each mark ("<house>: Short of <good>."), the Resources tab's gap lines
// (`validationOnPage.js :: resourceGapLines`), the Imports line's arriving items and its "Needed, and not brought in"
// items (`tradeListDisplay.js :: importsAsPrinted`). Lines new at the rule and lines gone, each with three towns.
//   BASE=<base root> TIP=<rule root> BIRTH_RULE=<rule> OUT=<out.json> \
//     node docs/chair/2026-11-17/birth/probes/q4rules.mjs <label>=<base.ndjson.gz>,<rule.ndjson.gz> ...
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const arr = (x) => (Array.isArray(x) ? x : []);
async function reader(root) {
  const F = await import(root + '/src/domain/facts/houseInputAtHand.js');
  const { resourceGapLines } = await import(root + '/src/domain/display/validationOnPage.js');
  const { importsAsPrinted } = await import(root + '/src/domain/display/tradeListDisplay.js');
  const { hasTradeRouteConnection } = await import(root + '/src/domain/tradeRouteSemantics.js');
  const calm = (s) => { const c = structuredClone(s); c.config = { ...(c.config || {}), stressTypes: [] }; for (const k of ['stressors', 'stress', 'stresses']) if (k in c) c[k] = Array.isArray(c[k]) ? [] : null; return c; };
  return (s) => {
    const short = F.housesShortOf(s), calmShort = F.housesShortOf(calm(s));
    const crises = arr(s?.config?.stressTypes);
    const connected = !crises.includes('under_siege') && hasTradeRouteConnection(String(s?.config?.tradeRouteAccess ?? ''));
    const spent = F.housesOnSpentGround(s);
    const marks = [...short].map(([h, g]) => ({ h, g, born: calmShort.has(h), spent: spent.has(h) }));
    const lines = new Set();
    for (const m of marks) lines.add(`MARK ${m.h}: Short of ${m.g}.`);
    for (const l of resourceGapLines(s)) lines.add(`GAP ${String(l.impact).replaceAll(String(s?.name || '\u0000'), '<town>')}`);
    const ip = importsAsPrinted(s);
    for (const x of ip.needed) lines.add(`NEEDED Needed, and not brought in: ${x}`);
    for (const x of arr(ip.arriving)) lines.add(`IMPORT ${x}`);
    return { marks, lines, calmTown: crises.length === 0 && connected };
  };
}
const BASE = path.resolve(process.env.BASE), TIP = path.resolve(process.env.TIP);
const readBase = await reader(BASE), readTip = await reader(TIP);
const report = { base: BASE, tip: TIP, rule: process.env.BIRTH_RULE || '', pops: {} };
for (const a of process.argv.slice(2)) {
  const [label, files] = a.split('='); const [fb, ft] = files.split(',');
  const B = load(fb), T = load(ft);
  const r = { towns: B.size, marksBase: 0, marksTip: 0, townsMarkedTip: 0, bornCalmTip: 0, bornCalmTownsTip: 0, bornCalmTownsBase: 0, spentCalmTip: 0, townsLinesMoved: 0, newLines: {}, goneLines: {}, leftCalm: {} };
  for (const [seed, sb] of B) {
    const st = T.get(seed); if (!st) continue;
    const b = readBase(sb), t = readTip(st);
    r.marksBase += b.marks.length; r.marksTip += t.marks.length; if (t.marks.length) r.townsMarkedTip++;
    const bc = t.calmTown ? t.marks.filter((m) => m.born && !m.spent) : [];
    r.bornCalmTip += bc.length; if (bc.length) r.bornCalmTownsTip++;
    if (b.calmTown && b.marks.some((m) => m.born && !m.spent)) r.bornCalmTownsBase++;
    if (t.calmTown) r.spentCalmTip += t.marks.filter((m) => m.born && m.spent).length;
    for (const m of bc) (r.leftCalm[`${m.h} · ${m.g}`] ||= []).push(seed);
    let moved = false;
    const shape = (l) => l.replace(/^MARK [^:]+:/, 'MARK <house>:');
    for (const l of t.lines) if (!b.lines.has(l)) { moved = true; (r.newLines[l] ||= []).push(seed); }
    for (const l of b.lines) if (!t.lines.has(l)) { moved = true; (r.goneLines[l] ||= []).push(seed); }
    if (moved) r.townsLinesMoved++;
  }
  const top = (o) => Object.fromEntries(Object.entries(o).sort((x, y) => y[1].length - x[1].length).map(([k, v]) => [k, { towns: v.length, three: v.slice(0, 3) }]));
  r.newLines = top(r.newLines); r.goneLines = top(r.goneLines); r.leftCalm = top(r.leftCalm);
  report.pops[label] = r;
  console.log(`${label}: marks ${r.marksBase} -> ${r.marksTip} · towns marked ${r.townsMarkedTip} · BORN-SHORT (no spent ground) in calm connected towns: houses ${r.bornCalmTip} in ${r.bornCalmTownsTip} towns (base ${r.bornCalmTownsBase} towns) · spent-ground marks in calm connected towns ${r.spentCalmTip} · towns whose lines moved ${r.townsLinesMoved} · new line kinds ${Object.keys(r.newLines).length} · gone ${Object.keys(r.goneLines).length}`);
}
if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(report, null, 1));
