/** @vitest-environment jsdom */
import React from 'react';
import { beforeAll, test, vi } from 'vitest';
import { appendFileSync } from 'node:fs';
import { render } from '@testing-library/react';
vi.mock('__TREE__/src/store/index.js', () => { const data = { campaigns: [] }; function useStore(s) { return s(data); } useStore.subscribe = () => () => {}; useStore.getState = () => data; return { useStore, default: useStore }; });
vi.mock('__TREE__/src/hooks/useIsMobile.js', () => ({ default: () => false }));
import { EconomicsTab } from '__TREE__/src/components/new/tabs/EconomicsTab.jsx';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
const birthApp = (seed) => { const m = seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }); };
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  for (const seed of process.env.SEEDS.split(',')) {
    const town = birthApp(seed);
    const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
    const under = (h) => { const head = [...container.querySelectorAll('div')].find((d) => d.textContent === h); return head ? [...(head.nextElementSibling?.children || [])].filter((e) => e.tagName === 'SPAN').map((e) => e.textContent || '') : []; };
    const t = container.textContent || '';
    appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed, exports: under('Exports'), local: under('Produced locally'), chains: (town.economicState.activeChains || []).map((c) => c.label || c.name), notes: (town.economicState.activeChains || []).map((c) => c.magicNote).filter(Boolean), head: t.slice(0, 600), hasSupply: /Supply Chains/i.test(t) }) + '\n');
    unmount();
  }
}, 600000);
