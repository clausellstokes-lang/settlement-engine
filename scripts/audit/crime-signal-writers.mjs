// F4 CRIME-SIGNAL (2026-11-04): the A-06 writers on the RECORD, by class, one JSON row per place.
// node scripts/audit/crime-signal-writers.mjs <from> <to> <out.jsonl>   (birth-only; no render)
// "pre" is the roster the narratives step saw (before the density law's trim at assembly).
import { cellFor, birth, ensureLaws, sha } from './soak-review/corpus.mjs';
await ensureLaws();
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { isCriminalInstitution } = await import('../../src/domain/corruption.js');
const [from, to, outPath] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4]];
const fs = await import('node:fs');
const ORG = /criminal network|thieves['’] guild|crime boss|kingpin/i;
const rows = [];
for (let i = from; i < to; i++) {
  const cell = cellFor(i);
  const b = birth(i);
  let pre = [];
  generateSettlementPipeline(b.config, null, { seed: cell.seed, onStep: (n, ctx) => { if (n === 'generateNarratives') pre = (ctx.powerStructure?.factions || []).map(f => ({ n: f.faction ?? f.name, c: f.category })); } });
  const s = b.settlement;
  const fin = (s.powerStructure?.factions || []).map(f => ({ n: f.faction ?? f.name, c: f.category }));
  const finNames = new Set(fin.map(f => f.n));
  const trimmed = pre.filter(f => !finNames.has(f.n));
  const crimFaction = fin.some(f => f.c === 'criminal');
  const crimHouse = (s.institutions || []).some(x => isCriminalInstitution(x));
  const signal = crimFaction || crimHouse;
  const rels = s.powerStructure?.factionRelationships || [];
  const relOff = rels.filter(r => (r.pair || []).some(p => !finNames.has(p)));
  const relOffCrim = relOff.filter(r => (r.pair || []).some(p => trimmed.find(t => t.n === p && t.c === 'criminal')));
  const npcs = s.npcs || [];
  const affOff = npcs.filter(n => n.factionAffiliation && trimmed.some(t => t.n === n.factionAffiliation)).length;
  const secAffTrim = npcs.filter(n => n.secondaryAffiliation && trimmed.some(t => t.n === n.secondaryAffiliation)).length;
  const secAffCrimNoSignal = signal ? 0 : npcs.filter(n => ORG.test(String(n.secondaryAffiliation || ''))).length;
  const goalNoSignal = signal ? 0 : npcs.filter(n => ORG.test(JSON.stringify([n.goal, n.goals, n.factionGoal]))).length;
  const secretNoSignal = signal ? 0 : npcs.filter(n => ORG.test(JSON.stringify(n.secret ?? ''))).length;
  const histNoSignal = signal ? 0 : (s.history?.currentTensions || []).filter(t => ORG.test(JSON.stringify(t))).length;
  const crimes = s.economicState?.safetyProfile?.crimeTypes || [];
  const debtNoSignal = signal ? 0 : crimes.filter(c => ORG.test(String(c.desc || ''))).length;
  const survivalBesideNet = crimFaction && crimes.some(c => /No criminal infrastructure/.test(String(c.desc || '')));
  rows.push({ i, tier: s.tier, signal, crimFaction, crimHouse, trimmedN: trimmed.length, trimmedCrim: trimmed.filter(t => t.c === 'criminal').map(t => t.n), relOff: relOff.length, relOffCrim: relOffCrim.length, affOff, secAffTrim, secAffCrimNoSignal, goalNoSignal, secretNoSignal, histNoSignal, debtNoSignal, survivalBesideNet, rec: sha(s) });
}
fs.writeFileSync(outPath, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
