// U7 PROBE (SEAT-10, the chair's order of 07:21Z): after a kept-form transfer under the lit law, does the page's
// ruling chain (powerStrata.js :: rulingChainOf) name the OLD house's person as ruler? Usage: node probe.mjs <root> <perSize>
import { createRequire } from 'node:module';
const [root, perSizeArg] = process.argv.slice(2); const PER = Number(perSizeArg || 20);
const imp = (rel) => import(`${root}/${rel}`);
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { mutateSettlementChecked } = await imp('src/domain/events/mutate.js');
const { applyWorldPulseOutcomes } = await imp('src/domain/worldPulse/applyWorldPulse.js');
const { buildWorldSnapshot } = await imp('src/domain/worldPulse/worldSnapshot.js');
const { ensureRegionalGraph } = await imp('src/domain/region/index.js');
const { buildSpatialDigest } = await imp('src/domain/spatial/index.js');
const { makeGridPack, placeSettlements } = await imp('tests/fixtures/spatialPackFixtures.js');
const { governingFactionOf } = await imp('src/domain/rulingPower.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
const { rulingChainOf, derivePowerStrata } = await imp('src/domain/dossier/powerStrata.js');
const { resolveSeatLawVersion } = await imp('src/domain/seat/seatLaw.js');
const { SEAT_CONTEST_LIT } = await imp('src/domain/seat/seatCircumstances.js');
await loadGenerationLawPayloads();
const NOW = '2026-01-01T00:00:00.000Z';
const nameOf = (f) => String(f?.faction || f?.name || '');
const holderName = (s) => { const h = holderOf(s, { audience: 'owner' })?.holder; return h ? nameOf(h) : null; };
const housesOf = (s, personName) => {
  const p = (s.npcs || []).find((n) => n?.name === personName); if (!p) return [];
  return [...new Set([...(p.memberships || []).map((m) => m.power), p.factionAffiliation].filter(Boolean))];
};
const SIZES = ['village', 'town', 'city', 'metropolis'];
const tally = { births: 0, lawTwo: 0, transfers: 0, keptForm: 0, chainNamesPerson: 0, chainPersonOldHouse: 0, chainPersonNewHouse: 0, chainPersonNeither: 0, strataGoverningIsForm: 0 };
const roads = { dm: { ...tally }, coup: { ...tally } }; const examples = [];
function judge(road, before, after, seed) {
  const t = roads[road]; t.transfers += 1;
  const formB = nameOf(governingFactionOf(before)), formA = nameOf(governingFactionOf(after));
  const hB = holderName(before), hA = holderName(after);
  if (!(formA === formB && hA && hA !== hB)) return; // kept form: the form row stays, the holder moved
  t.keptForm += 1;
  const chain = rulingChainOf(after);
  const strata = derivePowerStrata(after);
  if ((strata?.governing && nameOf(strata.governing) === formA) || strata?.powers?.some((p) => p.role === 'governing' && p.name === formA)) t.strataGoverningIsForm += 1;
  if (!chain.npc) return; t.chainNamesPerson += 1;
  const hs = housesOf(after, chain.npc.name);
  const old = hs.includes(hB) || (hB === formB && hs.includes(formB)); const neu = hs.includes(hA);
  if (neu) t.chainPersonNewHouse += 1; else if (old || hs.includes(formA)) t.chainPersonOldHouse += 1; else t.chainPersonNeither += 1;
  if (examples.length < 6) examples.push({ seed, road, form: formA, holderBefore: hB, holderAfter: hA, chainPower: chain.power?.name, chainPerson: chain.npc.name, chainRole: chain.npc.role, personHouses: hs });
}
for (const settType of SIZES) for (let i = 0; i < PER; i += 1) {
  const seed = `u7p-${settType}-${i}`;
  const s = generateSettlementPipeline(birthConfig({ settType, culture: 'germanic' }), null, { seed, customContent: {} });
  for (const t of Object.values(roads)) t.births += 1;
  if (resolveSeatLawVersion(s) !== 2) continue; for (const t of Object.values(roads)) t.lawTwo += 1;
  // the DM's road: CHANGE_RULING_POWER to each non-governing power in turn (roster order), first that moves the holder
  const g = governingFactionOf(s);
  for (const f of (s.powerStructure?.factions || []).filter((x) => x && x !== g && nameOf(x))) {
    const res = mutateSettlementChecked({ settlement: s, event: { id: `u7p.dm.${seed}`, type: 'CHANGE_RULING_POWER', targetId: nameOf(f), payload: {} }, now: NOW });
    if (res.veto || holderName(res.settlement) === holderName(s)) continue;
    judge('dm', s, res.settlement, seed); break;
  }
  // the coup road: the top contender through applyWorldPulseOutcomes
  const cont = coupContenders(s); const winner = cont?.challengers?.[0]?.name;
  if (!winner) continue;
  const id = 'u7p000'; const pack = makeGridPack({ cols: 10, rows: 8 }); const [place] = placeSettlements(pack, 1);
  const worldState = { rngSeed: 'u7p', tick: 1, simulationRules: {}, calendar: { elapsedWeeks: 20, year: 1 }, spatialCanonVersion: 1, spatialDigest: buildSpatialDigest({ pack, placements: [{ id, cellId: place.cellId }] }), relationshipStates: {}, stressors: [] };
  const regionalGraph = ensureRegionalGraph({ edges: [], channels: [] }); const wizardNews = { currentTick: 1, entries: [] };
  const save = { id, name: 'P', phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  const outcome = { id: `world_outcome.coup_verdict.u7p.1`, ruleFamily: 'stressor', probability: 1, targetSaveId: id,
    metadata: { verdict: { holds: false, winner, incumbent: cont.incumbent, challengers: cont.challengers, variant: null } },
    type: 'power_transfer', candidateType: 'coup_succeeded', ruleId: 'coup_verdict_fall', applyMode: 'auto', severity: 0.6, headline: `${winner} seizes power`, summary: 'probe', reasons: ['probe'],
    powerTransfer: { toPowerName: winner, cause: 'coup', tick: 1, losers: cont.challengers.filter((c) => c.name !== winner).map((c) => c.name), sourceStressorId: 'u7p.coup' },
    condition: { archetype: 'government_overthrown', severity: 0.5, triggeredAt: { tick: 1, sourceEventType: 'COUP_VERDICT', sourceEventTargetId: 'u7p.coup' }, causes: [{ source: 'u7p.coup', effect: 'government_overthrown', reason: 'probe' }] } };
  const snapshot = buildWorldSnapshot({ campaign: { id: 'u7p', settlementIds: [id], worldState, regionalGraph, wizardNews }, saves: [save], worldState, regionalGraph });
  const res = applyWorldPulseOutcomes({ snapshot, worldState, regionalGraph, wizardNews, settlementMap: new Map([[id, { saveId: id, save, settlement: s }]]), outcomes: [outcome], tick: 1, now: NOW, advanceNewsTick: false, advanceRegionalImpacts: false, simulationRules: {} });
  const upd = (res.settlementUpdates || []).find((u) => String(u.saveId) === id);
  if (upd?.settlement && holderName(upd.settlement) !== holderName(s)) judge('coup', s, upd.settlement, seed);
}
console.log(JSON.stringify({ SEAT_CONTEST_LIT, pool: `germanic ${SIZES.join('/')} x ${PER}, seeds u7p-<size>-<i>, birthConfig (lit)`, roads, examples }, null, 1));
