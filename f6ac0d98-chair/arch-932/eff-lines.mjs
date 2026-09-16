import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const ROOT = process.argv[2];
const require = createRequire(join(ROOT, 'package.json'));
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'flat' });
const LANG = { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } };
function eff(p) {
  const code = readFileSync(join(ROOT, p), 'utf8');
  const msgs = linter.verify(code, { languageOptions: LANG, rules: { 'max-lines': ['error', { max: 1, skipBlankLines: true, skipComments: true }] } });
  const m = msgs.find((x) => x.ruleId === 'max-lines');
  return m ? Number(String(m.message).match(/\((\d+)\)/)[1]) : 1;
}
const raw = JSON.parse(readFileSync(join(ROOT, 'scripts/.size-baseline.json'), 'utf8'));
const rows = [];
for (const [k, v] of Object.entries(raw)) { if (k.startsWith('_')) continue; const e = eff(k); rows.push([k, v, e]); }
rows.sort((a, b) => (a[1] - a[2]) - (b[1] - b[2]));
console.log('BASELINED', rows.length);
for (const [k, v, e] of rows) console.log(`${String(v - e).padStart(4)}  ${e}/${v}  ${k}`);
// also the named shared files that are NOT baselined (under their layer ceiling) — measure against 800
for (const p of ['src/domain/worldPulse/peaceTerms.js','src/domain/roads/roadsKernel.js','src/domain/worldPulse/pulseKernel.js','src/domain/worldPulse/applyWorldPulse.js','src/domain/worldPulse/settlementLifecycleKernel.js','src/domain/worldPulse/supplyKernel.js','src/domain/worldPulse/warDeployment.js','src/domain/worldPulse/armyTransitKernel.js','src/domain/worldPulse/settlementStrategy.js','src/domain/worldPulse/beliefMap.js','src/domain/worldPulse/commercialReceiptPools.js','src/domain/worldPulse/corruptionWeb.js','src/domain/worldPulse/peaceTermsCatalog.js','src/domain/certification/subsystemRowsVirtual.js','src/domain/worldPulse/simulationRules.js','src/domain/worldPulse/commodityFlow.js','src/domain/worldPulse/migration.js','src/domain/worldPulse/envoyErrandVocabulary.js','src/domain/worldPulse/treatyEnforcement.js','src/domain/worldPulse/pactFormation.js','src/domain/worldPulse/religiousContest.js','src/domain/worldPulse/relayNetwork.js','src/components/map/WorldMap.jsx','src/domain/worldPulse/stressorsCore.js','src/domain/worldPulse/rulingPower.js','src/domain/worldPulse/strategicPosture.js','src/domain/worldPulse/demographicsMigration.js','src/domain/worldPulse/espionage/espionageRider.js']) {
  try { console.log('NAMED', eff(p), p, raw[p] ? `(baselined ${raw[p]})` : '(under layer ceiling)'); } catch (e) { console.log('NAMED MISSING', p); }
}
