import { beforeAll, test } from 'vitest';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { deriveSupportingCapabilities } from '__TREE__/src/domain/display/defenseDisplay.js';
import { recordNamesAMage } from '__TREE__/src/domain/facts/magic.js';
import { censusPlan, configOf } from '__TREE__/tests/components/pageCensusWalk.shared.mjs';
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  const [k, n] = (process.env.PART || '0/1').split('/').map(Number);
  for (const [i, row] of censusPlan(process.env.PREFIX || 'r2').entries()) {
    if (i % n !== k) continue;
    const s = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    const a = deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');
    const named = recordNamesAMage(s);
    if (named || (a && a.status === 'None')) appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed: row.seed, named, arcane: a ? a.status : 'LEFT OUT',
      gov: (s.powerStructure?.factions || []).filter((f) => f.category === 'magic').map((f) => `${f.faction}|gov=${!!f.isGoverning}`),
      mages: (s.npcs || []).filter((x) => /mage|wizard|arcan|sorcer/i.test(x.role || '')).map((x) => `${x.role}:${x.status || ''}`) }) + '\n');
  }
}, 3600000);
