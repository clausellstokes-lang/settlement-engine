import { beforeAll, test } from 'vitest';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { chainNeedLine } from '__TREE__/src/domain/display/chainNeedShown.js';
import { chainWorksResource } from '__TREE__/src/domain/facts/chainWorking.js';
import { RESOURCE_DATA } from '__TREE__/src/data/resourceData.js';
import { censusPlan, configOf } from '__TREE__/tests/components/pageCensusWalk.shared.mjs';
beforeAll(async () => { await loadGenerationLawPayloads(); });
const GOODS = Object.keys(RESOURCE_DATA).flatMap((k) => RESOURCE_DATA[k].commodities || []).filter((v, i, a) => a.indexOf(v) === i);
test('p', () => {
  const [k, n] = (process.env.PART || '0/1').split('/').map(Number);
  for (const [i, row] of censusPlan('r2').entries()) {
    if (i % n !== k) continue;
    const s = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    const near = (s.config?.nearbyResources || []).map(String); const avail = (s.resourceAnalysis?.availableResources || []).map(String);
    const chains = s.economicState?.activeChains || []; let first = true; const out = [];
    for (const c of chains) {
      const line = chainNeedLine(c, s, first); if (!line) continue; first = false;
      const form = /which the siege has cut off/.test(line) ? 'siege' : /run on stored|by magic/.test(line) ? 'isolated' : 'brought';
      for (const g of GOODS) {
        const word = g.replace(/_/g, ' ');
        if (!new RegExp(`depend on (?:[^.]*\\b)?${word}\\b|stored (?:[^.]*\\b)?${word}\\b`, 'i').test(line)) continue;
        const grounds = near.filter((r) => (RESOURCE_DATA[r]?.commodities || []).includes(g));
        out.push({ good: g, form, avail: avail.includes(g), grounds, worked: grounds.length > 0 && chainWorksResource(s, grounds, word), line: line.slice(0, 160) });
      }
    }
    appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed: row.seed, crisis: row.crisis, size: row.size, hits: out }) + '\n');
  }
}, 3600000);
