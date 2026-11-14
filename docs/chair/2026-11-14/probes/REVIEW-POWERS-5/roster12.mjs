// REVIEW-POWERS-5 roster12.mjs — TREE= node roster12.mjs <corpus>... : the conflict lines that name a market, merchants,
// a guard or a civilian court, counted where the town lacks what they name (the market fact of the vocabulary, the
// record's court system, a force), per corpus. Reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const { factsOf } = await import(process.env.TREE + '/src/domain/facts/factsOf.js');
const L = {
  murdered: 'Several merchants have been found murdered this season',
  outbuy: 'The merchant class is outbuying noble landholdings',
  contest: "A noble family is contesting a merchant's right to operate",
  courts: 'The military commanders are pushing for expanded authority over civilian courts',
  levies: 'has been debating market levies for three months',
};
for (const f of process.argv.slice(2)) {
  const c = {}; let n = 0;
  for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')) {
    const { s } = JSON.parse(l); n++; const t = String(s.powerStructure?.recentConflict || ''); const fa = factsOf(s);
    const names = (s.institutions || []).map((i) => String(i.name || ''));
    const court = names.some((x) => /court|magistrat|judge|justic|assiz|tribunal/i.test(x));
    for (const [k, v] of Object.entries(L)) { if (!t.includes(v)) continue; c[k + ' prints'] = (c[k + ' prints'] || 0) + 1;
      const bad = k === 'courts' ? !court : k === 'murdered' ? (!fa.market || !fa.guardPresence) : !fa.market; if (bad) c[k + ' FALSE'] = (c[k + ' FALSE'] || 0) + 1; }
  }
  console.log(f.split('/').slice(-2)[0], n, JSON.stringify(c));
}
