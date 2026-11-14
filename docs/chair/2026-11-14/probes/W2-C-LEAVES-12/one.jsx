import { beforeAll, test } from 'vitest';
import fs from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { liveInstitutions } from '__TREE__/src/domain/institutions/institutionRoster.js';
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  const seed = process.env.SEED; const m = seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/);
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...(m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {}), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
  const want = process.env.GOOD;
  const chains = (s.economicState.activeChains || []).filter((c) => (c.outputs || []).includes(want)).map((c) => `${c.label}[${c.status}|${c.resourceInputKey}|${(c.processingInstitutions||[]).join('/')}]`);
  fs.writeFileSync(process.env.PROBE_OUT, JSON.stringify({ chains, roster: liveInstitutions(s).map((x) => x.name), stresses: s.config?.selectedStresses }, null, 0));
});
