// COHERENCE-VEIL-8 — fold the shards of a planted8 run: every marker, hidden name and hidden text still in a payload,
// by chain, reveal, the form the eye saw it in, its origin and its path.  node planted8-summary.mjs <shard.json>...
import { readFileSync } from 'node:fs';
const T = { towns: 0, planted: 0, shares: 0, reads: 0, handHides: 0, texts: 0, houses: 0, aliases: 0, threw: [], raised: [], sent: {}, tw: {}, ex: {}, readsBy: {}, timing: {} };
for (const f of process.argv.slice(2)) { const o = JSON.parse(readFileSync(f, 'utf-8'));
  T.towns += o.towns; T.planted += o.planted; T.shares += o.shares; T.reads += o.reads; T.handHides += o.handHides; T.texts += o.hiddenTexts; T.houses += o.housesHiddenWhole; T.aliases += o.aliasesHidden;
  T.threw.push(...o.birthsThatThrew); T.raised.push(...o.raised);
  for (const [k, v] of Object.entries(o.readsBy)) T.readsBy[k] = (T.readsBy[k] || 0) + v;
  for (const [k, v] of Object.entries(o.timing)) (T.timing[k] = T.timing[k] || []).push(...v);
  for (const [k, v] of Object.entries(o.sent)) { T.sent[k] = T.sent[k] || {}; for (const [r, n] of Object.entries(v)) T.sent[k][r] = (T.sent[k][r] || 0) + n; T.tw[k] = (T.tw[k] || 0) + (o.sentTowns[k] || 0); T.ex[k] = T.ex[k] || o.examples[k]; } }
console.log(`towns ${T.towns}; markers planted ${T.planted}; hidden sentences ${T.texts}; shares (every eye shut by hand) ${T.shares}; rows hidden by hand ${T.handHides}; reads ${T.reads}; births that threw ${T.threw.length}; reads that raised or sent no row ${T.raised.length}; houses hidden whole ${T.houses}; chain names of hidden houses ${T.aliases}`);
if (T.threw.length) console.log(T.threw.slice(0, 3)); if (T.raised.length) console.log(T.raised.slice(0, 5));
console.log('reads:', Object.entries(T.readsBy).sort().map(([k, v]) => `${k} ${v}`).join(' · '));
if (process.env.RV8_TIMING) { const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  console.log('timing ms (median / p95 / max):', Object.entries(T.timing).sort().map(([k, v]) => `${k} ${q(v, 0.5)}/${q(v, 0.95)}/${Math.max(...v)}`).join(' · ')); }
const rows = Object.entries(T.sent).sort((a, b) => a[0].localeCompare(b[0]));
console.log(`\n== EVERYTHING HIDDEN BY HAND THAT IS STILL IN A PAYLOAD: ${rows.length} rows`);
for (const [k, v] of rows) console.log(`${k}  ${JSON.stringify(v)}  towns ${T.tw[k]}\n      e.g. ${(T.ex[k] || '').slice(0, 230)}`);
