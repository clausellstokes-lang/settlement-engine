import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { discoverSimulationFlags } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/scripts/lib/observed-shape-corpus.mjs';
const files = execSync("find src/domain -name '*.js' -type f", { cwd: '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT' }).toString().trim().split('\n');
const now = discoverSimulationFlags(readFileSync, files.map(f => '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/' + f));
console.log('files scanned =', files.length);
console.log('DISCOVERED FLAGS at my tip =', now.length);
// BASE: same scan over the base blobs of the four src files my cars touched
const touched = ['src/domain/worldPulse/simulationRules.js','src/domain/compendium/generated/compendiumData.generated.js','src/domain/npc/livedExperienceSources.js','src/domain/npc/livedExperienceCatalog.js'];
const baseRead = (p, enc) => {
  const rel = String(p).replace('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/', '');
  if (touched.includes(rel)) return execSync('git show fd36f0298:' + rel, { cwd: '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT', maxBuffer: 1 << 28 }).toString();
  return readFileSync(p, enc);
};
const base = discoverSimulationFlags(baseRead, files.map(f => '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/' + f));
console.log('DISCOVERED FLAGS at BASE fd36f0298 =', base.length);
console.log('ADDED by my four cars   =', JSON.stringify(now.filter(f => !base.includes(f))));
console.log('REMOVED by my four cars =', JSON.stringify(base.filter(f => !now.includes(f))));
