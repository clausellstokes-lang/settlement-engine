import { beforeAll, test } from 'vitest';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
import { deriveSupportingCapabilities } from '__TREE__/src/domain/display/defenseDisplay.js';
const birthRww = (seed) => { const m = seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/); const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }); };
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  for (const seed of (process.env.SEEDS || 'rww-town-calm-1').split(',')) {
    const s = birthRww(seed);
    const fs = (s.powerStructure?.factions || []).map((f) => `${f.faction}|${f.category}|gov=${!!f.isGoverning}|${f.power}`);
    const mages = (s.npcs || []).filter((n) => /mage|wizard|arcan|sorcer/i.test(`${n.role} ${n.title||''}`)).map((n) => `${n.name}:${n.role}:${n.status||''}`);
    const a = deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');
    appendFileSync(process.env.PROBE_OUT, JSON.stringify({ tree: '__TREE__'.split('/').pop(), seed, gov: s.powerStructure?.governingFaction || null, factions: fs, mages, arcane: a ? `${a.status}: ${a.detail || a.description || ''}` : 'LEFT OUT' }) + '\n');
  }
}, 600000);
