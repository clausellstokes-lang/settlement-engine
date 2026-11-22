// PEOPLE-0 aggregate: node aggregate.mjs <measure.jsonl> -> markdown on stdout
import { readFileSync } from 'node:fs';
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const st = (xs) => { const s = [...xs].sort((a, b) => a - b); const n = s.length; if (!n) return '—'; const mean = s.reduce((a, b) => a + b, 0) / n; return `${s[0]} / ${s[Math.floor((n - 1) / 2)]} / ${s[n - 1]} (μ ${mean.toFixed(1)})`; };
const sum = (o) => Object.values(o || {}).reduce((a, b) => a + b, 0);
const out = [];
const P = (...a) => out.push(a.join(''));
P(`Corpus: ${process.argv[2].split('/').pop()} · ${rows.length} settlements · cells read min / median / max (μ mean)\n`);
P('| tier | n | houses (non-fabric) | faces | judgment houses | none+fabric | today NPCs | powers | powers w/ ≥3 faces | towns with a power <3 | towns with a power at 0 | seat face in governing power |');
P('|---|---|---|---|---|---|---|---|---|---|---|---|');
const byTier = {};
for (const t of TIERS) {
  const R = rows.filter((r) => r.tier === t); if (!R.length) continue; byTier[t] = R;
  const pw = R.flatMap((r) => r.powers);
  P(`| ${t} | ${R.length} | ${st(R.map((r) => (r.v.face || 0) + (r.v.judge || 0) + (r.v.none || 0) + (r.v.MISSING || 0) + (r.v.unplaced || 0)))} | ${st(R.map((r) => r.v.face || 0))} | ${st(R.map((r) => r.v.judge || 0))} | ${st(R.map((r) => (r.v.none || 0) + (r.v.fabric || 0)))} | ${st(R.map((r) => r.npcs))} | ${st(R.map((r) => r.powers.length))} | ${pw.filter((p) => p.reps >= 3).length}/${pw.length} (${(100 * pw.filter((p) => p.reps >= 3).length / pw.length).toFixed(0)}%) | ${R.filter((r) => r.powers.some((p) => p.reps < 3)).length} | ${R.filter((r) => r.powers.some((p) => p.reps === 0)).length} | ${R.filter((r) => r.govSeatFace).length}/${R.length} |`);
}
P('\nWith the judgment houses counted as faces (upper bound):\n');
P('| tier | faces+judge | powers w/ ≥3 | towns with a power <3 | towns with a power at 0 |'); P('|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const pw = R.flatMap((r) => r.powers); P(`| ${t} | ${st(R.map((r) => (r.v.face || 0) + (r.v.judge || 0)))} | ${pw.filter((p) => p.repsJ >= 3).length}/${pw.length} | ${R.filter((r) => r.powers.some((p) => p.repsJ < 3)).length} | ${R.filter((r) => r.powers.some((p) => p.repsJ === 0)).length} |`); }
P('\nFaces per power, by archetype (all tiers): powers · min/median/max faces · share with ≥3 · share at 0\n');
P('| archetype | powers | faces | ≥3 | 0 | governing |'); P('|---|---|---|---|---|---|');
const arch = {}; for (const r of rows) for (const p of r.powers) (arch[p.arch || '?'] ||= []).push(p);
for (const [a, ps] of Object.entries(arch).sort((x, y) => y[1].length - x[1].length)) P(`| ${a} | ${ps.length} | ${st(ps.map((p) => p.reps))} | ${(100 * ps.filter((p) => p.reps >= 3).length / ps.length).toFixed(0)}% | ${(100 * ps.filter((p) => p.reps === 0).length / ps.length).toFixed(0)}% | ${ps.filter((p) => p.gov).length} |`);
P('\nPower names by archetype (top 8 each):\n');
for (const [a, ps] of Object.entries(arch)) { const c = {}; for (const p of ps) c[p.name] = (c[p.name] || 0) + 1; P(`- **${a}**: ` + Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 8).map(([n, k]) => `${n} (${k})`).join(', ')); }
P('\nPowers per tier, by archetype (count of powers):\n');
P('| tier | ' + Object.keys(arch).join(' | ') + ' |'); P('|---|' + Object.keys(arch).map(() => '---').join('|') + '|');
for (const [t, R] of Object.entries(byTier)) P(`| ${t} | ` + Object.keys(arch).map((a) => R.flatMap((r) => r.powers).filter((p) => (p.arch || '?') === a).length).join(' | ') + ' |');
P('\nThe weighted roll\'s top three (house weights of the 1st/2nd/3rd face by share×weight), governing power only, and faces backing 2+ powers:\n');
P('| tier | gov top-1 weight (dist) | gov top-3 complete | faces backing 2+ powers | faces on the default (no share) |'); P('|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const g = R.map((r) => r.powers.find((p) => p.gov)).filter(Boolean); const d = {}; for (const p of g) { const k = p.top[0] ?? 'none'; d[k] = (d[k] || 0) + 1; } P(`| ${t} | ${Object.entries(d).map(([k, v]) => `w${k}:${v}`).join(' ')} | ${g.filter((p) => p.top.length >= 3).length}/${g.length} | ${st(R.map((r) => r.multiPower))} | ${st(R.map((r) => r.defaultOnly))} |`); }
P('\n## Today\'s NPCs, groups, hooks, relationships\n');
P('| tier | NPCs | faction groups | group size | rung roles (head/middle/lowest/yearner/none) | NPC hooks per NPC | NPCs with 2+ hooks |'); P('|---|---|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const rr = {}; for (const r of R) for (const [k, v] of Object.entries(r.rung)) rr[k] = (rr[k] || 0) + v; const h = R.flatMap((r) => r.hooksPerNpc); P(`| ${t} | ${st(R.map((r) => r.npcs))} | ${st(R.map((r) => r.groups.length))} | ${st(R.flatMap((r) => r.groups))} | ${['head', 'middle', 'lowest', 'yearner', 'none'].map((k) => rr[k] || 0).join('/')} | ${st(h)} | ${h.filter((x) => x >= 2).length}/${h.length} |`); }
P('\nHooks by source (collector class; crisis and traditions split out of `tension`), per settlement:\n');
const cats = [...new Set(rows.flatMap((r) => Object.keys(r.hk)))].sort();
P('| tier | total | ' + cats.join(' | ') + ' |'); P('|---|---|' + cats.map(() => '---').join('|') + '|');
for (const [t, R] of Object.entries(byTier)) P(`| ${t} | ${st(R.map((r) => r.nHooks))} | ` + cats.map((c) => st(R.map((r) => r.hk[c] || 0))).join(' | ') + ' |');
P('\nHooks by party kind (the hook\'s links), corpus totals:\n');
const party = {}; for (const r of rows) for (const [k, v] of Object.entries(r.party)) party[k] = (party[k] || 0) + v;
const tot = sum(party); P(Object.entries(party).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}: ${v} (${(100 * v / tot).toFixed(1)}%)`).join(' · '));
P('\nRaw writer counts per settlement: tension hooks (history.currentTensions) · event hooks (historicalEvents) · conflicts · current tensions · historical events:\n');
P('| tier | tension hooks | event hooks | conflicts | tensions | events |'); P('|---|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) P(`| ${t} | ${st(R.map((r) => r.rawHooks.tensions))} | ${st(R.map((r) => r.rawHooks.events))} | ${st(R.map((r) => r.rawHooks.conflicts))} | ${st(R.map((r) => r.rawHooks.currentTensions))} | ${st(R.map((r) => r.rawHooks.historicalEvents))} |`);
P('\nProposed hooks under the rule (faces + tension-class [tension+crisis+tradition+faction/conflict] + history), per settlement:\n');
P('| tier | faces (1 each) | tension-class | history | proposed total | today total |'); P('|---|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const tc = (r) => (r.hk.tension || 0) + (r.hk.crisis || 0) + (r.hk.tradition || 0) + (r.hk.faction || 0); P(`| ${t} | ${st(R.map((r) => r.v.face || 0))} | ${st(R.map(tc))} | ${st(R.map((r) => r.hk.history || 0))} | ${st(R.map((r) => (r.v.face || 0) + tc(r) + (r.hk.history || 0)))} | ${st(R.map((r) => r.nHooks))} |`); }
P('\nRelationships today:\n');
P('| tier | ties | NPC degree | NPCs in 0 ties | NPCs in 2+ ties |'); P('|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const d = R.flatMap((r) => r.degs); P(`| ${t} | ${st(R.map((r) => r.nRels))} | ${st(d)} | ${d.filter((x) => x === 0).length}/${d.length} | ${d.filter((x) => x >= 2).length}/${d.length} |`); }
const rk = {}; for (const r of rows) for (const [k, v] of Object.entries(r.rk)) rk[k] = (rk[k] || 0) + v; const rt = sum(rk);
P('\nTie kinds (corpus): ' + Object.entries(rk).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v} (${(100 * v / rt).toFixed(1)}%)`).join(' · '));
const pr = {}; for (const r of rows) for (const [k, v] of Object.entries(r.pairRoles)) pr[k] = (pr[k] || 0) + v;
P('\nTie pairs by NPC category (top 12): ' + Object.entries(pr).sort((x, y) => y[1] - x[1]).slice(0, 12).map(([k, v]) => `${k} ${v}`).join(' · '));
P('\nProposed: one outgoing tie per face (simulated, PLAUSIBLE: target weighted by house weight, ×3 when sharing a power):\n');
P('| tier | ties (= faces with a peer) | named by 0 | named by exactly 1 | named by 2+ | max in-degree |'); P('|---|---|---|---|---|---|');
for (const [t, R] of Object.entries(byTier)) { const d = R.flatMap((r) => r.inDeg); P(`| ${t} | ${st(R.map((r) => r.inDeg.reduce((a, b) => a + b, 0)))} | ${(100 * d.filter((x) => x === 0).length / d.length).toFixed(0)}% | ${(100 * d.filter((x) => x === 1).length / d.length).toFixed(0)}% | ${(100 * d.filter((x) => x >= 2).length / d.length).toFixed(0)}% | ${Math.max(0, ...d)} |`); }
P('\nUnclassified house names (missing from faces.mjs or unplaced by the catalogue): ' + JSON.stringify([...new Set(rows.flatMap((r) => r.missing))]));
const fc = {}; for (const r of rows) for (const f of r.judges) fc[f] = (fc[f] || 0) + 1;
P('\nJudgment houses by frequency (rosters carrying them): ' + Object.entries(fc).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(out.join('\n'));
