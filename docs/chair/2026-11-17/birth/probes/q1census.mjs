// BIRTH-AUDIT Q1 · THE CENSUS OF THE SHORT HOUSES (read-only; no draw, no write to any record).
// Every house `housesShortOf` marks, over PAGE-COPY corpora (corpus.ndjson.gz: one { seed, s } a line), with its catalogue
// id, its good, the reading that marked it ((i) a gap of the record, (ii) a spent ground, (iii) a trade's good), the
// reader's answer, the tier, the crises and the trade route's state; THEN ITS CAUSE: the same record read again with every
// crisis taken away AT THE READING (config.stressTypes emptied, the stress container emptied): still marked = BORN SHORT;
// no longer marked = MADE BY THE CRISIS. (The record's own birth is not re-drawn: a crisis that changed what the birth
// wrote stays written; that is counted apart as "born under a crisis".)
// RUN from the repository root at the base (node_modules present):
//   OUT=<out.json> node docs/chair/2026-11-17/birth/probes/q1census.mjs <label>=<corpus.ndjson.gz> ...
// TREE=<root> reads another tree's src (default: the current directory).
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE = path.resolve(process.env.TREE || '.');
const F = await import(TREE + '/src/domain/facts/houseInputAtHand.js');
const { catalogIdForName } = await import(TREE + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(TREE + '/src/domain/tradeRouteSemantics.js');
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const arr = (x) => (Array.isArray(x) ? x : []);
export const tierOf = (s, seed) => s?.tier || s?.config?.settType || (seed.match(/(thorp|hamlet|village|town|city|metropolis)/) || [])[1];
export const crisesOf = (s) => arr(s?.config?.stressTypes).map(String);
export const routeState = (s) => {
  const r = String(s?.config?.tradeRouteAccess ?? '');
  if (crisesOf(s).includes('under_siege')) return 'shut by a siege';
  return hasTradeRouteConnection(r) ? 'connected' : 'isolated';
};
/** The same record with every crisis taken away at the reading. */
export function calmCopy(s) {
  const c = structuredClone(s);
  c.config = { ...(c.config || {}), stressTypes: [] };
  for (const k of ['stressors', 'stress', 'stresses']) if (k in c) c[k] = Array.isArray(c[k]) ? [] : null;
  return c;
}
export function marksOf(s) {
  const short = F.housesShortOf(s);
  const spent = F.housesOnSpentGround(s);
  const want = F.housesWantingTradeInput(s);
  const gapped = new Set(arr(s?.resourceAnalysis?.gaps).map((g) => g?.institution).filter(Boolean));
  const out = [];
  for (const [house, good] of short) {
    const id = String(arr(s.institutions).find((i) => i?.name === house)?.catalogId || catalogIdForName(house) || '');
    const warIron = want.get(house)?.noun === 'iron' && F.warIronHookOutsideWar(s);
    const reading = warIron ? '(iii) war iron hook' : gapped.has(house) ? '(i) gap' : spent.has(house) ? '(ii) spent ground' : '(iii) trade good';
    const answer = reading === '(ii) spent ground' ? 'spent' : 'missing';
    out.push({ house, id, good, reading, answer });
  }
  return out;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = [];
  const towns = {};
  for (const a of process.argv.slice(2)) {
    const [label, file] = a.split('=');
    const corpus = load(file);
    let withAny = 0, withBorn = 0, calmConnectedBorn = 0, calmConnected = 0, chairs = 0;
    for (const { seed, s } of corpus) {
      const marks = marksOf(s);
      const calm = F.housesShortOf(calmCopy(s));
      const crises = crisesOf(s), route = routeState(s), tier = tierOf(s, seed);
      // the chair's count: a gap of kind `missing` on the record (BAR6-RECORD's BR1 table)
      if (arr(s?.resourceAnalysis?.gaps).some((g) => g?.institution && g?.kind === 'missing')) chairs++;
      let born = 0;
      for (const m of marks) {
        const cause = calm.has(m.house) ? (crises.length ? 'BORN SHORT (born under a crisis)' : 'BORN SHORT') : 'MADE BY THE CRISIS';
        if (cause.startsWith('BORN')) born++;
        rows.push({ pop: label, seed, tier, crises, route, routeAccess: s?.config?.tradeRouteAccess ?? null, ...m, cause });
      }
      if (marks.length) withAny++;
      if (born) withBorn++;
      const calmTown = crises.length === 0 && route === 'connected';
      if (calmTown) calmConnected++;
      if (calmTown && born) calmConnectedBorn++;
    }
    towns[label] = { towns: corpus.length, withAnyMark: withAny, withBornShort: withBorn, calmConnected, calmConnectedWithBornShort: calmConnectedBorn, chairsCount_gapMissing: chairs };
  }
  const res = { tree: TREE, towns, rows };
  if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(res, null, 1) + '\n');
  console.log(JSON.stringify(towns, null, 1)); console.log('rows', rows.length);
}
