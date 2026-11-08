// PEOPLE-3 HOOKS aggregate: per tier, the hooks by class and by source, the person hooks per card,
// the party kinds, against PEOPLE-0 §3's envelope. Reads one or two measure.mjs outputs:
//   node docs/chair/2026-11-07/people-3/aggregate.mjs <after.jsonl> [before.jsonl]
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const [afterFile, beforeFile] = process.argv.slice(2);
const after = read(afterFile);
const before = beforeFile ? read(beforeFile) : null;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const ENVELOPE = { thorp: [4, 15, 8], hamlet: [3, 20, 10], village: [8, 29, 18], town: [12, 54, 35], city: [32, 91, 66], metropolis: [58, 98, 82] };
const q = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))] : 0; };
const st = (xs) => `${Math.min(...xs)} / ${q(xs, 0.5)} / ${Math.max(...xs)}`;
const mean = (xs) => (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
const by = (rows) => Object.fromEntries(TIERS.map((t) => [t, rows.filter((r) => r.tier === t)]));
const A = by(after); const B = before ? by(before) : null;
const P = (s) => process.stdout.write(s + '\n');

P(`# PEOPLE-3 HOOKS — the hooks by class and party (${after.length} settlements${before ? `; before: ${before.length}` : ''})\n`);
P('Per settlement, min / median / max. "person/card" is the page\'s person hooks per card (after the truth gate and the dedupe), its min and max over the tier.\n');
P('| tier | n | total before | total after (μ) | envelope | person | person/card (min–max) | tension | history | median vs envelope |');
P('|---|---|---|---|---|---|---|---|---|---|');
for (const t of TIERS) {
  const R = A[t]; if (!R.length) continue;
  const tot = R.map((r) => r.nHooks); const [lo, hi, med] = ENVELOPE[t];
  const inside = R.filter((r) => r.nHooks >= lo && r.nHooks <= hi).length;
  const pmin = Math.min(...R.map((r) => r.perCardMin ?? 1)); const pmax = Math.max(...R.map((r) => r.perCardMax ?? 1));
  const m = q(tot, 0.5);
  P(`| ${t} | ${R.length} | ${B ? st(B[t].map((r) => r.nHooks)) : '—'} | ${st(tot)} (${mean(tot)}) | ${lo}–${hi} (${inside}/${R.length} inside) | ${st(R.map((r) => r.cls.person))} | ${pmin}–${pmax} | ${st(R.map((r) => r.cls.tension))} | ${st(R.map((r) => r.cls.history))} | ${m} vs ${med}: ${Math.abs(m - med) <= 2 ? 'within ±2' : `OUTSIDE ±2 (${m - med > 0 ? '+' : ''}${m - med})`} |`);
}
if (B) {
  P('\nThe class table, before → after (per-settlement medians; before classed by category: npc → person; faction, tension, crisis, traditions, economics, safety → tension; history → history):\n');
  P('| tier | person before → after | tension before → after | history before → after | cards (median) | person hooks on the record per card before (max) → after (min–max) |');
  P('|---|---|---|---|---|---|');
  for (const t of TIERS) {
    const R = A[t], S = B[t]; if (!R.length) continue;
    P(`| ${t} | ${q(S.map((r) => r.cls.person), 0.5)} → ${q(R.map((r) => r.cls.person), 0.5)} | ${q(S.map((r) => r.cls.tension), 0.5)} → ${q(R.map((r) => r.cls.tension), 0.5)} | ${q(S.map((r) => r.cls.history), 0.5)} → ${q(R.map((r) => r.cls.history), 0.5)} | ${q(R.map((r) => r.cards), 0.5)} | ${Math.max(...S.map((r) => r.recordMax ?? 0))} → ${Math.min(...R.map((r) => r.recordMin ?? 1))}–${Math.max(...R.map((r) => r.recordMax ?? 1))} |`);
  }
}
P('\nBy source (per-settlement medians, after):\n');
const srcs = [...new Set(after.flatMap((r) => Object.keys(r.src)))].sort();
P(`| tier | ${srcs.join(' | ')} |`); P(`|---|${srcs.map(() => '---').join('|')}|`);
for (const t of TIERS) { const R = A[t]; if (R.length) P(`| ${t} | ${srcs.map((c) => st(R.map((r) => r.src[c] || 0))).join(' | ')} |`); }
const kinds = (rows) => { const k = {}; for (const r of rows) for (const [n, v] of Object.entries(r.partyKinds)) k[n] = (k[n] || 0) + v; return k; };
const show = (k) => { const tot = Object.values(k).reduce((a, b) => a + b, 0); return `${tot} hooks — ` + Object.entries(k).sort((x, y) => y[1] - x[1]).map(([n, v]) => `${n}: ${v} (${(100 * v / tot).toFixed(1)}%)`).join(' · '); };
P('\nBy party kind (corpus totals; a hook between several kinds counts once under the joined kinds):\n');
if (B) P(`- before (by links): ${show(kinds(before))}`);
P(`- after (by parties): ${show(kinds(after))}`);
const sum = (rows, f) => rows.reduce((a, r) => a + (r[f] || 0), 0);
P(`\nThe person hooks: settlements with a card at other than one hook on the page: ${after.filter((r) => r.cards && (r.perCardMin !== 1 || r.perCardMax !== 1)).length}; on the record: ${after.filter((r) => r.cards && (r.recordMin !== 1 || r.recordMax !== 1)).length}. Cards ${sum(after, 'cards')}; temporary crisis persons ${sum(after, 'temps')} carrying ${sum(after, 'tempHooks')} hooks. Roster repeats (a line two cards hold) ${before ? `${sum(before, 'repeats')} → ` : ''}${sum(after, 'repeats')}.`);
P(`The gate's party arm, offered what the record does not hold: conflict parties not a power ${sum(after, 'strayConflictParties')}; crisis losers not a power ${sum(after, 'strayLosers')}; crisis role holders not on the roster ${sum(after, 'strayHolders')}.`);
