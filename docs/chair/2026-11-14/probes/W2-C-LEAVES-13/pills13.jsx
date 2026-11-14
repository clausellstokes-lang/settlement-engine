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
import { leadingExploitation } from '__TREE__/src/domain/display/stateProse/economyStateProse.js';
import { exportsAsPrinted, localProductionAsPrinted, chainOutputsShown } from '__TREE__/src/domain/display/tradeListDisplay.js';
import { liveInstitutions } from '__TREE__/src/domain/institutions/institutionRoster.js';
import { magicOf } from '__TREE__/src/domain/facts/magic.js';
const h = (x) => createHash('sha1').update(JSON.stringify(x) ?? 'u').digest('hex').slice(0, 12);
test('p', () => {
  for (const [i, seed] of SEEDS.entries()) {
    if (i % N !== K) continue;
    const s = birth(seed);
    const leaves = {}; for (const [k, v] of Object.entries(s)) leaves[k] = h(v);
    const pp = composePublicProse(s); const blocks = {}; for (const [k, v] of Object.entries(pp?.blocks || {})) blocks[k] = h(v);
    const chains = (s.economicState?.activeChains || []).filter((c) => c && typeof c === 'object');
    const cards = chains.map((c) => ({ id: c.chainId ?? c.id ?? c.label, label: c.label, status: c.status, houses: c.processingInstitutions, outs: chainOutputsShown(c, s), all: c.outputs }));
    const lead = leadingExploitation(exploitationForDesk(s));
    const full = lead?.bucket === 'fullyExploited' ? { raw: lead.row?.rawResource, house: lead.row?.processingInstitutions?.[0], good: lead.row?.finalProducts?.[0] } : null;
    const crises = [...(s.config?.selectedStresses || []), ...(Array.isArray(s.stresses) ? s.stresses.map((x) => x?.type ?? x) : [])];
    fs.appendFileSync(process.env.PROBE_OUT, JSON.stringify({ seed, size: s.config?.settType, pop: s.population, rec: h(s), leaves, blocks,
      exports: exportsAsPrinted(s), rawExports: s.economicState?.primaryExports, local: localProductionAsPrinted(s), cards, full,
      roster: liveInstitutions(s).map((x) => x.name), magic: magicOf(s).functions, crises }) + '\n');
  }
}, 7200000);
