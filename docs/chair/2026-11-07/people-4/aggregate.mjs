// PEOPLE-4 TIES aggregate: node docs/chair/2026-11-07/people-4/aggregate.mjs <in.jsonl> [<before.jsonl>]
// Prints, per tier: ties (min/median/max), out-degree = 1 for every card with a peer, the in-degree
// distribution (named by nobody / exactly one / two or more; max), and the kinds' shares (corpus),
// beside a "before" file (the lane's base, the undirected pair) when one is given.
import { readFileSync } from 'node:fs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const load = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [inFile, beforeFile] = process.argv.slice(2);
const rows = load(inFile); const before = beforeFile ? load(beforeFile) : null;
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) / 2)] : 0; };
const st = (a) => (a.length ? `${Math.min(...a)} / ${med(a)} / ${Math.max(...a)}` : '—');
const pct = (n, d, dp = 0) => (d ? `${(100 * n / d).toFixed(dp)}%` : "—");
const P = (s = '') => console.log(s);

P(`# PEOPLE-4 ties — ${inFile}${beforeFile ? ` (before: ${beforeFile})` : ''}\n`);
P(`Settlements ${rows.length}; shape ${[...new Set(rows.map((r) => r.shape))].join('/')}; self-ties ${rows.reduce((a, r) => a + r.self, 0)}; off-roster ends ${rows.reduce((a, r) => a + r.offRoster, 0)}.\n`);
P('| tier | n | cards | ties before → after (min / median / max) | out-degree = 1 for every card with a peer | lone faces (0 ties) | named by nobody | named by exactly one | named by two or more (hubs) | max in-degree |');
P('|---|---|---|---|---|---|---|---|---|---|');
for (const t of TIERS) {
  const R = rows.filter((r) => r.tier === t); if (!R.length) continue;
  const B = before ? before.filter((r) => r.tier === t) : [];
  const withPeer = R.filter((r) => r.cards >= 2);
  const outOk = withPeer.filter((r) => r.outDeg.every((d) => d === 1)).length;
  const lone = R.filter((r) => r.cards < 2);
  const loneOk = lone.filter((r) => r.ties === 0).length;
  const inD = withPeer.flatMap((r) => r.inDeg);
  P(`| ${t} | ${R.length} | ${st(R.map((r) => r.cards))} | ${B.length ? `${st(B.map((r) => r.ties))} → ` : ''}${st(R.map((r) => r.ties))} | ${outOk}/${withPeer.length} | ${loneOk}/${lone.length} | ${pct(inD.filter((d) => d === 0).length, inD.length)} | ${pct(inD.filter((d) => d === 1).length, inD.length)} | ${pct(inD.filter((d) => d >= 2).length, inD.length)} | ${inD.length ? Math.max(...inD) : 0} |`);
}
const kindTotals = (R) => { const k = {}; for (const r of R) for (const [kk, v] of Object.entries(r.kinds)) k[kk] = (k[kk] || 0) + v; return k; };
const after = kindTotals(rows); const prior = before ? kindTotals(before) : {};
const total = Object.values(after).reduce((a, b) => a + b, 0); const pt = Object.values(prior).reduce((a, b) => a + b, 0);
P('\n| kind | before (count, share) | after (count, share) |'); P('|---|---|---|');
for (const k of [...new Set([...Object.keys(after), ...Object.keys(prior)])].sort((a, b) => (after[b] || 0) - (after[a] || 0))) {
  P(`| ${k} | ${before ? `${prior[k] || 0} (${pct(prior[k] || 0, pt, 1)})` : '—'} | ${after[k] || 0} (${pct(after[k] || 0, total, 1)}) |`);
}
P(`| all | ${before ? pt : '—'} | ${total} |`);
