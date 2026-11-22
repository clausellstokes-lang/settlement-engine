// U4 probe: the two findings' reach, both laws. F1: DS-ECO-1's high-rung lines naming the subsistence economy.
// F2: the trade line "Trade is brisk, the guilds are well run, ..." where the place holds no guild.
//   node findings.mjs <tree> [perCell=20]
import { resolve } from 'node:path';
const [, , treeArg, nArg = '20'] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { buildPrintProse } = await import(`${L}/src/domain/display/stateProse/printProse.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
await loadGenerationLawPayloads();
const t = {};
for (const law of [1, 2]) for (const size of ['thorp', 'hamlet', 'village']) for (const econ of [25, 50, 92]) for (let i = 0; i < +nArg; i++) {
  const base = birthConfig({ ...DEFAULT_CONFIG, settType: size, priorityEconomy: econ });
  const s = generateSettlementPipeline(law === 2 ? { ...base, _fortuneLawVersion: 2 } : base, null, { seed: `u4f-${size}-${econ}-${i}`, customContent: {} });
  const k = `law${law} ${size}`; t[k] ??= { births: 0, comfortableOrProsperous: 0, f1: 0, f2: 0, f1Lines: {}, f2Labels: {} };
  const row = t[k]; row.births++;
  if (['Comfortable', 'Prosperous'].includes(s.economicState?.prosperity)) row.comfortableOrProsperous++;
  const header = String(buildPrintProse(s)?.economics?.['economics.prosperityHeader'] || '');
  if (/subsistence living/.test(header) && /money to spare|does well all the same|keeps everyone/.test(header)) { row.f1++; row.f1Lines[header.replace(s.name, '{settlement}')] = (row.f1Lines[header.replace(s.name, '{settlement}')] || 0) + 1; }
  if (/^Trade is brisk, the guilds are well run/.test(String(s.economicState?.situationDesc)) && factsOf(s).guild !== true) { row.f2++; row.f2Labels[s.economicState.prosperity] = (row.f2Labels[s.economicState.prosperity] || 0) + 1; }
}
for (const [k, v] of Object.entries(t)) console.log(k.padEnd(14), JSON.stringify(v));
