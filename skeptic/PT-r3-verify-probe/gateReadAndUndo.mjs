// V-PT-r3 probe (read-only imports of master 81f1cd963; nothing edited).
// (1) enemy_in_service: PT §9.2's read (beliefMap.js :: readBeliefRelationship) vs CH §11 step 3's
//     read (embassyHazard.js :: relationshipTypeBetween === 'hostile'), in a belief preset.
// (2) PT §6 "BAN_PARTY's inverse lifts exactly the edges it wrote" after the strictest-wins merge.
const M = process.argv[2];
const B = await import(`${M}/src/domain/worldPulse/beliefMap.js`);
const E = await import(`${M}/src/domain/roads/embassyHazard.js`);
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const out = {};
// ---- (1) two reads of one reason ----
const ws = (label) => ({ tick: 100, spatialCanonVersion: 1, simulationRules: { infoMode: 'full' },
  spatialLedgers: { beliefMaps: { Kell: { seat: { Ashford: { allianceLabel: label, strengthBand: 'modest', confidence01: 0.6 } } } } } });
const graph = (rt) => ({ edges: [{ from: 'Ashford', to: 'Kell', relationshipType: rt }], channels: [] });
for (const [beliefLabel, truthLabel] of [['hostile', 'rival'], ['allied', 'hostile'], ['hostile', 'hostile']]) {
  const w = ws(beliefLabel); const g = graph(truthLabel);
  const truthType = E.relationshipTypeBetween(g, w, 'Kell', 'Ashford');
  out[`belief_${beliefLabel}__truth_${truthLabel}`] = {
    beliefsActive: B.beliefsActive(w),
    CH_enemy_in_service: E.relationshipTypeBetween(g, w, 'Kell', 'Ashford') === 'hostile',
    PT_enemy_in_service: B.readBeliefRelationship('Kell', 'Ashford', w, truthType) === 'hostile',
    PT_read_needs_truthType_from_graph: truthType,
    landed_atWarWith: E.atWarWith(g, w, 'Kell', 'Ashford'),
    atOpenWar: E.atOpenWar(g, 'Kell', 'Ashford'),
  };
}
// ---- (2) BAN_PARTY's inverse as written ("lifts exactly the edges it wrote") after the merge ----
const KIND = 'banishment_edict';
const base = () => ({ tick: 100, simulationRules: { npcConsequencesEnabled: true } });
const add = (w, edge) => L.addExclusionEdge(w, 'party', { kind: KIND, ...edge }).worldState;
{ const w0 = add(base(), { settlementId: 'Kell', untilTick: 152 });            // the court's emergent ban (windowed)
  const before = L.exclusionsOf(w0, 'party');
  const w1 = add(w0, { settlementId: 'Kell', indefinite: true });             // the DM's BAN_PARTY(Kell)
  const merged = L.exclusionsOf(w1, 'party');
  const inv = L.liftExclusionEdges(w1, 'party', { settlementId: 'Kell', kinds: [KIND] }); // the inverse "lifts exactly the edges it wrote"
  out.undoBanPartyAfterMerge = {
    beforeDmBan: before, afterDmBan: merged, liftedByInverse: inv.lifted,
    afterInverse: L.exclusionsOf(inv.worldState, 'party'),
    emergentBanRestored: L.isExcludedFrom(inv.worldState, 'party', 'Kell', 120),
    priorStateBannedAt120: L.isExcludedFrom(w0, 'party', 'Kell', 120),
  }; }
console.log(JSON.stringify(out, null, 1));
