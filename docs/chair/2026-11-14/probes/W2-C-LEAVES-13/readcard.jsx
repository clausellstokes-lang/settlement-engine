/** @vitest-environment jsdom */
import { beforeAll, test } from 'vitest';
import fs from 'node:fs';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  // rw3-<size>-<calm|s1+s2>-<i>: REVIEW-W2A-3's own cfgFor (the round-two list's towns), verbatim.
  m=seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m){ const stresses = m[2]==='calm' ? [] : m[2].split('+');
    return birthConfig({...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  // rr3p-<size>-<calm|s1+s2>-<route>-<i>: the app's shape with the Regional Threat select on 'plagued' and the sliders set by hand
  // (_randomizePriorities off), Military at 10, 20 or 30 by i: the user's route to the embattled-region rows.
  m=seed.match(/^rr3p-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, monsterThreat:'plagued', priorityMilitary:10+(+m[4]%3)*10}); }
  m=seed.match(/^rr[23][a-z]?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  throw new Error(seed);
}
beforeAll(async () => { await loadGenerationLawPayloads(); });
const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
const [K, N] = (process.env.PART || '0/1').split('/').map(Number);
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
import { createHash } from 'node:crypto';
import { composePublicProse } from '__TREE__/src/components/new/publicProseCompose.js';
import { exploitationForDesk } from '__TREE__/src/domain/display/validationOnPage.js';
import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, cleanup } from '@testing-library/react';
vi.mock('__TREE__/src/store/index.js', () => { const data = { campaigns: [] }; function useStore(sel) { return sel(data); } useStore.subscribe = () => () => {}; useStore.getState = () => data; return { useStore, default: useStore }; });
vi.mock('__TREE__/src/hooks/useIsMobile.js', () => ({ default: () => false }));
import { EconomicsTab } from '__TREE__/src/components/new/tabs/EconomicsTab.jsx';
test('read', () => {
  const want = (process.env.LABELS || '').split('|');
  for (const seed of SEEDS) {
    const s = birth(seed);
    const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
    for (const e of [...container.querySelectorAll('[aria-expanded="false"]')]) if (/Economic Flows/.test(e.textContent || '')) fireEvent.click(e);
    const t = container.textContent || ''; unmount(); cleanup();
    const out = [];
    for (const lab of want) { let i = t.indexOf(lab); while (i >= 0) { out.push(t.slice(Math.max(0, i - 40), i + 420).replace(/\s+/g, ' ')); i = t.indexOf(lab, i + 1); if (out.length > 3) break; } }
    fs.appendFileSync(process.env.PROBE_OUT, `== ${seed} (${s.config?.settType}, ${s.population}) ${JSON.stringify(s.config?.selectedStresses || [])}\n${out.join('\n--\n')}\n`);
  }
}, 600000);
