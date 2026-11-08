// PEOPLE-1 CAST aggregate: node aggregate.mjs <measure.jsonl> -> markdown on stdout
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const st = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; if (!n) return '—'; const mean = s.reduce((a, b) => a + b, 0) / n; return `${s[0]} / ${s[Math.floor((n - 1) / 2)]} / ${s[n - 1]} (μ ${mean.toFixed(1)})`; };
const out = []; const P = (...a) => out.push(a.join(''));
P(`Corpus: ${process.argv[2].split('/').pop()} · ${rows.length} settlements · cells read min / median / max (μ mean)\n`);
P('| tier | n | cards | house faces | powers | powers at zero faces | powers with ≥3 | governing power faced | minted seats | minted other | fallback titles fired | pool fallbacks (cards) | faces in 2+ powers | faces in no power | ties | groups |');
P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const t of TIERS) {
  const R = rows.filter((r) => r.tier === t); if (!R.length) continue;
  const pw = R.flatMap((r) => r.powers);
  const mints = R.flatMap((r) => r.mints);
  P(`| ${t} | ${R.length} | ${st(R.map((r) => r.cards))} | ${st(R.map((r) => r.houseFaces))} | ${st(R.map((r) => r.powers.length))} | ${pw.filter((p) => p.faces === 0).length}/${pw.length} (${R.filter((r) => r.powers.some((p) => p.faces === 0)).length} towns) | ${pw.filter((p) => p.faces >= 3).length}/${pw.length} (${(100 * pw.filter((p) => p.faces >= 3).length / pw.length).toFixed(0)}%) | ${R.filter((r) => r.govFaced).length}/${R.length} | ${mints.filter((m) => m.kind === 'seat').length} | ${mints.filter((m) => m.kind === 'other').length} | ${mints.filter((m) => m.fallback).length} | ${st(R.map((r) => r.fallbacks.length))} | ${st(R.map((r) => r.multiPower))} | ${st(R.map((r) => r.noPower))} | ${st(R.map((r) => r.rels))} | ${st(R.map((r) => r.groups))} |`);
}
P('\nPowers at zero faces, by archetype (corpus): ' + (() => { const c = {}; for (const r of rows) for (const p of r.powers) if (p.faces === 0) c[p.arch] = (c[p.arch] || 0) + 1; return Object.entries(c).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'; })());
P('\nZero-face powers, by name (top 20): ' + (() => { const c = {}; for (const r of rows) for (const p of r.powers) if (p.faces === 0) c[p.name] = (c[p.name] || 0) + 1; return Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 20).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'; })());
const mintCount = (kind) => { const c = {}; for (const r of rows) for (const m of r.mints) if (m.kind === kind) { const k = `${m.power} → ${m.title}${m.fallback ? ' (FALLBACK)' : ''}`; c[k] = (c[k] || 0) + 1; } return Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'none'; };
P('\nSeat mints fired (power → title: count): ' + mintCount('seat'));
P('\nOther mints fired (power → title: count): ' + mintCount('other'));
P('\nPool-map fallback titles (title: cards): ' + (() => { const c = {}; for (const r of rows) for (const t of r.fallbacks) c[t] = (c[t] || 0) + 1; return Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(' · '); })());
P('\nCard categories (corpus): ' + (() => { const c = {}; for (const r of rows) for (const [k, v] of Object.entries(r.cat)) c[k] = (c[k] || 0) + v; return Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(' · '); })());
console.log(out.join('\n'));
