// REVIEW-W2B-4: institutionBudgetPromise's seed 41, born exactly as that test births it (densityFactor forced to 1), written whole.
import fs from 'node:fs'; import { createHash } from 'node:crypto';
import { vi, test } from 'vitest';
vi.mock('__TREE__/src/data/institutionBudget.js', async (importOriginal) => ({ ...(await importOriginal()), densityFactor: () => 1 }));
import { configForIndex } from '__TREE__/scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
test('seed 41', async () => {
  await loadGenerationLawPayloads();
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...configForIndex(41) }), null, { seed: 'x46-promise-41' });
  fs.writeFileSync('__OUT__', JSON.stringify(s));
  console.log('HASH41', createHash('sha256').update(JSON.stringify(s)).digest('hex').slice(0, 16));
}, 240000);
