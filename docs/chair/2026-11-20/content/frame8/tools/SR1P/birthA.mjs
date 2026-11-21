// SR1-P proof (a), the births of one tree. usage: node birthA.mjs <tree/> <out.jsonl>
// CRISIS: B7's pool as SR0's dump.mjs births it (15 kinds x 6 sizes x 4, seed `b7-<kind>-<size>-<i>`, { settType, stressType }).
// CALM: frame6/tools/pool.mjs 55 (seed `frame-calm-<tier>-<i>`, { settType }, the first 55 calm towns a tier).
// One JSON line per town: hashes of the record and of composeCrisisPage(s, { audience: 'owner' }), the same two with every
// stress[].cast.stakes[].reason blanked (on a JSON clone; `stressors` is the same array, blanked too), and the stake rows.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const [R, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
const { composeCrisisPage } = await import(R + 'src/domain/crisis/crisisPage.js');
const H = (x) => createHash('sha256').update(JSON.stringify(x) ?? 'undefined').digest('hex').slice(0, 20);
const OWNER = { audience: 'owner' };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = 'famine,plague_onset,mass_migration,monster_pressure,politically_fractured,succession_void,insurgency,slave_revolt,religious_conversion,recently_betrayed,infiltrated,under_siege,occupied,wartime,indebted'.split(',');
const entriesOf = (s) => (Array.isArray(s?.stress) ? s.stress : s?.stress ? [s.stress] : []).filter(Boolean);
const blank = (doc) => {
  for (const k of ['stress', 'stressors']) for (const e of (Array.isArray(doc[k]) ? doc[k] : doc[k] ? [doc[k]] : [])) for (const r of e?.cast?.stakes || []) r.reason = '';
  return doc;
};
const fd = fs.openSync(OUT, 'w');
const one = (pool, seed, tier, s) => {
  const rec = H(s);
  const page = H(composeCrisisPage(s, OWNER));
  const b = blank(JSON.parse(JSON.stringify(s)));
  const rows = entriesOf(s).map((e) => ({ kind: e.type, stakes: (e.cast?.stakes || []).map((k) => [k.factionId, k.stake, k.reason]) }));
  fs.writeSync(fd, JSON.stringify({ pool, seed, tier, rec, page, recB: H(b), pageB: H(composeCrisisPage(b, OWNER)), rows }) + '\n');
};
let n = 0;
for (const k of KINDS) for (const z of SIZES) for (let i = 0; i < 4; i++) {
  const seed = `b7-${k}-${z}-${i}`;
  one('crisis', seed, z, generateSettlementPipeline({ settType: z, stressType: k }, null, { seed, customContent: {} })); n++;
}
let tried = 0, calm = 0;
for (const tier of SIZES) {
  let got = 0, i = 0;
  while (got < 55) {
    const seed = `frame-calm-${tier}-${i++}`; tried++;
    const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
    if (entriesOf(s).length) continue;
    one('calm', seed, tier, s); got++; calm++;
  }
}
fs.closeSync(fd);
console.log('crisis', n, 'calm', calm, 'tried', tried);
