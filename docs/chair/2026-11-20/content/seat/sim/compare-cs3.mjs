#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/sim/compare-cs3.mjs — sets sim-cs3.mjs's outputs A beside B and writes
 * CS3-SIM.md + cs3-sim-compare.json beside itself. Reads only; runs nothing.
 *
 *   node docs/chair/2026-11-20/content/seat/sim/compare-cs3.mjs --runs <dir>
 * Expects <dir>/{born,low}{A1,A2,B}.json (A1/A2: arm A run twice, for the determinism diff).
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const RUNS = args[args.indexOf('--runs') + 1];
const load = (n) => JSON.parse(readFileSync(join(RUNS, `${n}.json`), 'utf8'));
const strip = (o) => JSON.stringify({ ...o, meta: { ...o.meta, seconds: 0 } });
const fmt = (m) => Object.entries(m || {}).map(([k, v]) => `${k} ${v}`).join(', ') || '—';
const diff = (a, b) => a.filter((x) => !b.includes(x));

const POOLS = { born: 'born legitimacy (as birthConfig mints it)', low: 'hand-lowered: every score capped at 25 at tick 0' };
const result = {}; const L = [];
L.push('# CS3 in a simulated campaign — A (shipped) beside B (the holder leaves the challengers)', '');
for (const [pool, label] of Object.entries(POOLS)) {
  const A = load(`${pool}A1`); const A2 = load(`${pool}A2`); const B = load(`${pool}B`);
  // keep the raw outputs beside the report
  for (const n of ['A1', 'A2', 'B']) copyFileSync(join(RUNS, `${pool}${n}.json`), join(HERE, `run-${pool}-${n}.json`));
  const a = A.totals; const b = B.totals;
  const winsByTown = (o) => Object.entries(o.townLog).filter(([, v]) => v.born > 0).map(([k]) => k).sort();
  const r = {
    label, meta: { A: A.meta, B: B.meta },
    determinism: { A1fp: A.eventsFingerprint, A2fp: A2.eventsFingerprint, fileIdenticalButSeconds: strip(A) === strip(A2) },
    sameTowns: A.meta.birthFingerprint === B.meta.birthFingerprint,
    rows: [
      ['town-ticks run (towns x worlds x ticks)', a.ranTicks * A.meta.towns, b.ranTicks * B.meta.towns],
      ['coup_detat births ROLLED (candidates)', a.coupCandidates, b.coupCandidates],
      ['coup_detat stressors BORN (landed)', a.coupBorn, b.coupBorn],
      ['verdicts reached', a.verdicts, b.verdicts],
      ['seats that FELL', a.fell, b.fell],
      ['seats that HELD', a.held, b.held],
      ['plots collapsed for want of challengers', a.collapsedNoChallengers, b.collapsedNoChallengers],
      ['falls with the incumbent ungated', a.ungatedFalls, b.ungatedFalls],
      ['winner was the seat\'s own holder', a.winnerWasHolder, b.winnerWasHolder],
      ['verdicts where the holder sat among the challengers', a.holderInChallengersAtVerdict, b.holderInChallengersAtVerdict],
      ['governing-row changes, every cause', a.govChanges, b.govChanges],
      ['town-ticks the gate\'s politics were open (legit<45, no occupation, a challenger)', a.gateOpenTownTicks, b.gateOpenTownTicks],
      ['town-ticks a holder stood / the holder contended', `${a.holderExistsTownTicks} / ${a.holderContendsTownTicks}`, `${b.holderExistsTownTicks} / ${b.holderContendsTownTicks}`],
      ['proposals ruled by full auto-resolve', a.adjudicated, b.adjudicated],
      ['throws', a.throws.length, b.throws.length],
    ],
    winners: { A: { contestKind: a.winnerContestKind, factionArchetype: a.winnerFactionArchetype, holderRule: a.holderRuleAtVerdict },
      B: { contestKind: b.winnerContestKind, factionArchetype: b.winnerFactionArchetype, holderRule: b.holderRuleAtVerdict } },
    gate: {
      politicsOpenAonly: diff(A.townsWithGateOpen, B.townsWithGateOpen), politicsOpenBonly: diff(B.townsWithGateOpen, A.townsWithGateOpen),
      politicsOpenA: A.townsWithGateOpen.length, politicsOpenB: B.townsWithGateOpen.length,
      candidateAonly: diff(A.townsWithCoupCandidate, B.townsWithCoupCandidate), candidateBonly: diff(B.townsWithCoupCandidate, A.townsWithCoupCandidate),
      candidateA: A.townsWithCoupCandidate.length, candidateB: B.townsWithCoupCandidate.length,
      bornAonly: diff(winsByTown(A), winsByTown(B)), bornBonly: diff(winsByTown(B), winsByTown(A)),
    },
    cs3: B.meta.cs3,
    falls: {
      A: Object.entries(A.townLog).flatMap(([k, v]) => v.winners.map((w) => ({ town: k, ...w }))),
      B: Object.entries(B.townLog).flatMap(([k, v]) => v.winners.map((w) => ({ town: k, ...w }))),
    },
  };
  result[pool] = r;
  L.push(`## Pool: ${label}`, '',
    `${A.meta.regions} regions x ${A.meta.towns} born towns x ${A.meta.seeds} world seeds x ${A.meta.ticks} one-week ticks; same towns in both arms: **${r.sameTowns}** (birth fingerprint ${A.meta.birthFingerprint}); born legitimacy by decade: ${fmt(A.meta.birthLegitDecades)}.`,
    `Determinism: arm A run twice, events fingerprint ${r.determinism.A1fp} / ${r.determinism.A2fp}, whole output identical but the clock: **${r.determinism.fileIdenticalButSeconds}**. Arm B's patch: coupContenders called ${B.meta.cs3.calls} times, a holder dropped ${B.meta.cs3.excluded} times, holderOf threw ${B.meta.cs3.throws} times.`, '',
    '| count | A (shipped) | B (CS3) |', '|---|---|---|');
  for (const [k, x, y] of r.rows) L.push(`| ${k} | ${x} | ${y} |`);
  L.push('', `Winners by contest kind (seat-draft contestKindOf): A ${fmt(a.winnerContestKind)} · B ${fmt(b.winnerContestKind)}.`,
    `Winners by factionArchetype: A ${fmt(a.winnerFactionArchetype)} · B ${fmt(b.winnerFactionArchetype)}.`,
    `The holder rule that answered at each verdict: A ${fmt(a.holderRuleAtVerdict)} · B ${fmt(b.holderRuleAtVerdict)}.`, '',
    `Gate: the gate's politics opened in ${r.gate.politicsOpenA} town-campaigns in A and ${r.gate.politicsOpenB} in B; open in A and never in B: ${r.gate.politicsOpenAonly.length}${r.gate.politicsOpenAonly.length ? ` (${r.gate.politicsOpenAonly.join(', ')})` : ''}; the reverse: ${r.gate.politicsOpenBonly.length}${r.gate.politicsOpenBonly.length ? ` (${r.gate.politicsOpenBonly.join(', ')})` : ''}.`,
    `A coup birth rolled (the gate opened on a pressure) in ${r.gate.candidateA} town-campaigns in A and ${r.gate.candidateB} in B; A only: ${r.gate.candidateAonly.join(', ') || '—'}; B only: ${r.gate.candidateBonly.join(', ') || '—'}.`,
    `A coup was born in A and never in B: ${r.gate.bornAonly.join(', ') || '—'}; the reverse: ${r.gate.bornBonly.join(', ') || '—'}.`, '',
    '### Every fall', '', '| arm | town | tick | winner | contest kind | holder (rule) | incumbent | challengers |', '|---|---|---|---|---|---|---|---|');
  for (const [arm, fs] of Object.entries(r.falls)) for (const f of fs) L.push(`| ${arm} | ${f.town} | ${f.tick} | ${f.winner} | ${f.contestKind} | ${f.holder ?? '—'} (${f.holderRule}) | ${f.incumbent} | ${f.challengers.join(', ')} |`);
  L.push('');
}
writeFileSync(join(HERE, 'cs3-sim-compare.json'), `${JSON.stringify(result, null, 1)}\n`);
writeFileSync(join(HERE, 'CS3-SIM.md'), `${L.join('\n')}\n`);
process.stderr.write('wrote CS3-SIM.md, cs3-sim-compare.json\n');
