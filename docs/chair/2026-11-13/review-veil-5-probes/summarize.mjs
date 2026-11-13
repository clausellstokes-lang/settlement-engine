// REVIEW-VEIL-5 — fold the shards of an attack run into one table.
import { readFileSync } from 'node:fs';
const files = process.argv.slice(2).filter((a) => !a.startsWith('--')); const showEx = process.argv.includes('--examples');
const T = { shares: 0, reads: 0, raised: [], noRow: {}, diff: {}, examples: {}, tokenLeaks: [], postFreeze: {}, served: {}, pageShowMore: {}, secondHome: {}, hiddenPowerName: {}, covertTies: {}, secondHomeEx: [], hiddenPowerTowns: 0, powersCards: 0, handHides: 0, hiddenTokens: 0, hidden: {}, towns: 0 };
const add = (o, s) => { for (const [k, v] of Object.entries(s || {})) o[k] = (o[k] || 0) + v; };
for (const f of files) { const o = JSON.parse(readFileSync(f, 'utf-8')); T.shares += o.shares; T.reads += o.reads; T.towns += o.towns.length; T.handHides += o.handHides; T.hiddenTokens += o.hiddenTokens;
  T.raised.push(...o.raised); T.tokenLeaks.push(...o.tokenLeaks); for (const k of ['noRow', 'diff', 'postFreeze', 'served', 'pageShowMore', 'hidden', 'secondHome', 'hiddenPowerName', 'covertTies']) add(T[k], o[k]); T.secondHomeEx.push(...(o.secondHomeEx || [])); T.hiddenPowerTowns += o.hiddenPowerTowns || 0; T.powersCards += o.powersCards || 0;
  for (const [k, v] of Object.entries(o.examples)) T.examples[k] = [...(T.examples[k] || []), ...v].slice(0, 3); }
console.log(`towns ${T.towns}  shares ${T.shares}  reads ${T.reads}  hand hides ${T.handHides}  tokens the reference removed ${T.hiddenTokens}`);
console.log(`raised ${T.raised.length}`, T.raised.slice(0, 5));
console.log('tokens removed by the reference, per chain:read', JSON.stringify(T.hidden));
console.log(`TOKEN LEAKS ${T.tokenLeaks.length}`); const by = {}; for (const l of T.tokenLeaks) { const k = `${l.chain}:${l.read}:${l.tokens[0].split('~').slice(2, 3)}:${l.tokens[0].split('~').slice(4, 5)}`; by[k] = (by[k] || 0) + 1; }
console.log(by); for (const l of T.tokenLeaks.slice(0, 6)) console.log('  ', JSON.stringify(l).slice(0, 300));
console.log('secondHome', T.secondHome, T.secondHomeEx.slice(0, 4)); console.log('towns with a hidden power', T.hiddenPowerTowns, 'hiddenPowerName', T.hiddenPowerName, 'covertTies', T.covertTies, 'powers cards hidden', T.powersCards);
console.log('noRow', T.noRow, 'postFreeze', T.postFreeze, 'served', T.served, 'pageShowMore', T.pageShowMore);
const rows = Object.entries(T.diff).sort((a, b) => a[0].localeCompare(b[0]));
const fold = {}; for (const [k, v] of rows) { const [chain, read, kind, ...p] = k.split(':'); const kk = `${chain} ${kind} ${p.join(':')}`; fold[kk] = fold[kk] || {}; fold[kk][read] = v; }
for (const [k, v] of Object.entries(fold)) { console.log(k.padEnd(70), JSON.stringify(v)); if (showEx) { const [chain, kind, p] = k.split(' '); for (const r of Object.keys(v)) { const e = T.examples[`${chain}:${r}:${kind}:${p}`]; if (e) { console.log('      e.g.', e[0].slice(0, 260)); break; } } } }
for (const [k, v] of Object.entries(T.examples)) if (k.startsWith('pageShowMore') || k.startsWith('served') || k.startsWith('hiddenPowerName') || k.startsWith('covertTies')) console.log(k, v.slice(0, 2));
