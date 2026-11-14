import { beforeAll, test } from 'vitest';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import * as T from '__TREE__/src/domain/display/tradeListDisplay.js';
import { liveInstitutions } from '__TREE__/src/domain/institutions/institutionRoster.js';
import { censusPlan, configOf } from '__TREE__/tests/components/pageCensusWalk.shared.mjs';
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  const [k, n] = (process.env.PART || '0/1').split('/').map(Number);
  for (const [i, row] of censusPlan('r2').entries()) {
    if (i % n !== k) continue;
    const s = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    const chains = s.economicState?.activeChains || [];
    appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed: row.seed,
      names: liveInstitutions(s).map((x) => String(x?.name ?? '')),
      exp: T.exportsAsPrinted(s), loc: T.localProductionAsPrinted(s), imp: T.importsAsPrinted(s),
      outs: chains.map((c) => T.chainOutputsShown(c, s)) }) + '\n');
  }
}, 3600000);
