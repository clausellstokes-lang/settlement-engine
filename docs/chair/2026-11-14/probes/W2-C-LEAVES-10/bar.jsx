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
import { importsAsPrinted, localProductionAsPrinted } from '__TREE__/src/domain/display/tradeListDisplay.js';
import { chainNeedLine } from '__TREE__/src/domain/display/chainNeedShown.js';
const birth = (seed) => { const c = seed.match(/^(?:bar0|rr2s)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const st = c[2] === 'calm' ? [] : c[2].split('+'); const route = c[3] === 'rand' ? {} : { tradeRouteAccess: c[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: c[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} }); };
beforeAll(async () => { await loadGenerationLawPayloads(); });
test('p', () => {
  for (const seed of process.env.SEEDS.split(',')) {
    const s = birth(seed);
    const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
    const lines = [...container.querySelectorAll('div')].filter((d) => d.children.length === 0).map((d) => d.textContent || '').filter((t) => /depend on|run on stored/.test(t));
    unmount();
    const chains = (s.economicState?.activeChains || []).map((c) => ({ label: c.label, status: c.status, res: c.resourceInputKey, houses: c.processingInstitutions, dep: c.dependency ? `${c.dependency.institution} needs ${c.dependency.resource}` : null, line: chainNeedLine(c, s) })).filter((c) => c.line || /herb/i.test(`${c.label} ${c.res}`));
    appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed, crisis: s.config?.selectedStresses, near: s.config?.nearbyResources, avail: s.resourceAnalysis?.availableResources, arriving: importsAsPrinted(s).arriving, local: localProductionAsPrinted(s), houses: (s.institutions || []).map((i) => i.name).filter((n) => /apothec|herbal|hospital|healer|physician|infirm/i.test(n)), lines, chains }, null, 1) + '\n');
  }
}, 600000);
