// BAR5-AUDIT-B tables for the hand-back, from a traced result (traceB.mjs):
//   node reportB.mjs <instances.traced.json> <label> > <table.md>
// The commonest distinct lines of each law (folded: digits and the town's own names left as printed), and the
// counts by writer file (which file wrote the false line) beside the file that holds the fact it should have read.
import fs from 'node:fs';

const [p, label] = process.argv.slice(2);
const inst = JSON.parse(fs.readFileSync(p, 'utf8'));
// the file that holds the fact each rule's false line should have read (read off the code, 2026-11-16)
export const FACT_FILE = {
  'L2.siege.abroad': 'src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy',
  'L2.siege.cutgood': 'src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`)',
  'L2.famine.meat': 'economicState.foodSecurity (src/generators/economy/foodBalance.js) read by crisisStoppedRow.js :: stoppedBy (the failed source only)',
  'L2.famine.grain': 'foodRecord.failedSource read by crisisStoppedRow.js :: stoppedBy',
  'L2.famine.work': 'src/data/stressTypes.js :: STRESS_TYPE_MAP.famine (viabilityNote) against src/data/institutionDescColour.js (the line declared colour)',
  'L2.war.iron': 'src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime)',
  'L2.war.animals': 'src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene\'s war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime)',
  'L2.law.collapsed': 'the Law & order band (src/domain/causalState.js law_order) against src/generators/safetyProfile.js :: NO_WATCH_SMALL (drawn on `watch` only)',
  'L3.outputs': 'crisisStoppedRow.js (the service rows\' marks) against src/domain/display/chainStateShown.js :: chainCrisisStateShown (the chain\'s state) — two deciders for one service',
  'L3.chainOverStopped': 'crisisStoppedRow.js (every service of the via houses stopped) against chainStateShown.js :: chainCrisisStateShown',
  'L3.failedFood': 'foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile\'s produced-locally list',
  'L3.foodLineStopped': 'crisisStoppedRow.js (the fishing marked stopped) against src/domain/foodways.js :: foodwaysLineOf',
  'L3.foodModel': 'economicState.foodSecurity.foodSources (src/generators/economy/foodBalance.js, which leaves out the Farmland house) printed by src/domain/foodways.js :: foodwaysLineOf',
  'L3.needed': 'resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft)',
  'L3.halfway': 'resourceAnalysis.gaps "Cannot produce final goods" (src/generators/resourceGenerator.js :: evaluateInstitutionDeps) against the chain\'s outputs (src/generators/computeActiveChains.js)',
};
const fold = (s) => s.replace(/\d[\d,.]*/g, '#').trim();
const lines = [];
lines.push(`### ${label}: by law and rule`, '', '| law · rule | towns | instances |', '|---|---|---|');
const group = (key) => { const m = new Map(); for (const x of inst) { const k = key(x); const v = m.get(k) || { n: 0, towns: new Set() }; v.n++; v.towns.add(x.town); m.set(k, v); } return m; };
for (const [k, v] of [...group((x) => x.law)].sort()) lines.push(`| **${k}** | **${v.towns.size}** | **${v.n}** |`);
for (const [k, v] of [...group((x) => x.rule)].sort()) lines.push(`| ${k} | ${v.towns.size} | ${v.n} |`);
for (const law of ['L2', 'L3']) {
  const g = new Map();
  for (const x of inst.filter((y) => y.law === law)) { const k = `${x.rule}|${fold(x.line)}`; const v = g.get(k) || { rule: x.rule, line: x.line, towns: new Set(), n: 0, writer: x.writer }; v.n++; v.towns.add(x.town); g.set(k, v); }
  lines.push('', `### ${label}: the thirty commonest distinct lines of ${law} (${g.size} distinct)`, '', '| towns | rule | line | writer |', '|---|---|---|---|');
  for (const v of [...g.values()].sort((a, b) => b.towns.size - a.towns.size || b.n - a.n).slice(0, 30))
    lines.push(`| ${v.towns.size} | ${v.rule} | ${v.line.slice(0, 140).replace(/\|/g, '/')} | \`${(v.writer || '').slice(0, 90)}\` |`);
  const w = new Map();
  for (const x of inst.filter((y) => y.law === law)) { const file = (x.writer || '(untraced)').split(' :: ')[0]; const k = `${file}|${x.rule}`; const v = w.get(k) || { file, rule: x.rule, n: 0, towns: new Set() }; v.n++; v.towns.add(x.town); w.set(k, v); }
  lines.push('', `### ${label}: ${law} by writer file (the false line) and the file holding the fact it should have read`, '', '| writer file | rule | towns | instances | the fact is in |', '|---|---|---|---|---|');
  for (const v of [...w.values()].sort((a, b) => b.n - a.n)) lines.push(`| \`${v.file}\` | ${v.rule} | ${v.towns.size} | ${v.n} | ${FACT_FILE[v.rule] || '-'} |`);
}
console.log(lines.join('\n'));
