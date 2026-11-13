// REVIEW-VEIL-5 — fold the shards of a planted-marker run: every marker still in a payload, by origin and path.
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2); const T = { towns: 0, planted: 0, shares: 0, reads: 0, handHides: 0, threw: [], raised: [], sent: {}, towns_: {}, ex: {}, names: {}, ntowns: {}, origin: {}, step: {}, houses: 0 };
for (const f of files) { const o = JSON.parse(readFileSync(f, 'utf-8')); T.towns += o.towns; T.planted += o.planted; T.shares += o.shares; T.reads += o.reads; T.handHides += o.handHides; T.houses += o.housesHiddenWhole; T.threw.push(...o.birthsThatThrew); T.raised.push(...o.raised);
  for (const [k, v] of Object.entries(o.plantedByOrigin)) T.origin[k] = (T.origin[k] || 0) + v;
  for (const [k, v] of Object.entries(o.plantedAfterStep)) T.step[k] = (T.step[k] || 0) + v;
  for (const [src, dst, tw] of [[o.sent, T.sent, o.sentTowns], [o.houseNames, T.names, o.houseNameTowns]]) for (const [k, v] of Object.entries(src)) { dst[k] = dst[k] || {}; for (const [r, n] of Object.entries(v)) dst[k][r] = (dst[k][r] || 0) + n; T.towns_[k] = (T.towns_[k] || 0) + (tw[k] || 0); T.ex[k] = T.ex[k] || o.examples[k]; } }
console.log(`towns ${T.towns}; markers planted ${T.planted}; shares (every eye shut by hand) ${T.shares}; rows hidden by hand ${T.handHides}; reads ${T.reads}; births that threw ${T.threw.length}; reads that raised or sent no row ${T.raised.length}; houses hidden whole ${T.houses}`);
if (T.threw.length) console.log(T.threw.slice(0, 3)); if (T.raised.length) console.log(T.raised.slice(0, 3));
console.log('planted, by origin:', Object.entries(T.origin).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
console.log('planted, by origin and the step it first existed after:', Object.entries(T.step).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
for (const [title, S] of [['MARKERS STILL IN A PAYLOAD (a hidden string, sent)', T.sent], ['A HOUSE HIDDEN WHOLE, ITS NAME STILL IN A PAYLOAD', T.names]]) { console.log(`\n== ${title}`);
  for (const [k, v] of Object.entries(S).sort((a, b) => a[0].localeCompare(b[0]))) console.log(`${k}  ${JSON.stringify(v)}  towns ${T.towns_[k]}\n      e.g. ${(T.ex[k] || '').slice(0, 230)}`); }
