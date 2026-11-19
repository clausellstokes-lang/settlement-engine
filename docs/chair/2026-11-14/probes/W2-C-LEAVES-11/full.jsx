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
import { exploitationForDesk, exploitationGroupsShown, housesStillNeeded } from '__TREE__/src/domain/display/validationOnPage.js';
import { leadingExploitation } from '__TREE__/src/domain/display/stateProse/economyStateProse.js';
import { exportsAsPrinted } from '__TREE__/src/domain/display/tradeListDisplay.js';
import { liveInstitutions } from '__TREE__/src/domain/institutions/institutionRoster.js';
test('p', () => {
  for (const [i, seed] of SEEDS.entries()) {
    if (i % N !== K) continue;
    const s = birth(seed);
    const lead = leadingExploitation(exploitationForDesk(s));
    const g = exploitationGroupsShown(s);
    const full = g.full.map((x) => ({ raw: x.card.rawResource, moved: x.moved, filed: x.filed, houses: x.card.processingInstitutions, goods: x.card.finalProducts }));
    const out = { seed, bucket: lead?.bucket ?? null, raw: lead?.row?.rawResource ?? null, house: lead?.row?.processingInstitutions?.[0] ?? null, good: lead?.row?.finalProducts?.[0] ?? null,
      exports: exportsAsPrinted(s), full, roster: liveInstitutions(s).map((x) => x.name) };
    if (lead?.bucket === 'fullyExploited') { out.houseHeld = housesStillNeeded(s, [out.house]).length === 0; out.allHouses = lead.row.processingInstitutions; out.allGoods = lead.row.finalProducts; }
    fs.appendFileSync(process.env.PROBE_OUT, JSON.stringify(out) + '\n');
  }
}, 7200000);
