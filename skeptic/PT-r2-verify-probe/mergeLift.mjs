// PT-r2-verify probe: does a DM-authored indefinite party ban survive the seat-change lapse
// that PT §9.3 (round 2b) runs through "the same lift"? Uses master 81f1cd963's own writers.
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
let ws = { tick: 100, simulationRules: { npcConsequencesEnabled: true } };
// (1) emergent party_banned verdict at Kell: a windowed edge (enmity -> a_year)
ws = L.addExclusionEdge(ws, 'party', { settlementId: 'Kell', kind: 'banishment_edict', untilTick: 152 }).worldState;
const afterEmergent = L.exclusionsOf(ws, 'party');
// (2) the DM then authors BAN_PARTY at Kell: indefinite (PT §9.3 AUTHORED)
ws = L.addExclusionEdge(ws, 'party', { settlementId: 'Kell', kind: 'banishment_edict', indefinite: true }).worldState;
const afterAuthored = L.exclusionsOf(ws, 'party');
// (3) Kell's seat changes; PT §9.3 r2b: "each week an edge whose court reads seatChangedSince(...).changed === true
//     lapses through the same lift" -> liftExclusionEdges(party, { settlementId: Kell })
const lifted = L.liftExclusionEdges(ws, 'party', { settlementId: 'Kell' });
const afterLapse = L.exclusionsOf(lifted.worldState, 'party');
const isBanned = L.isExcludedFrom(lifted.worldState, 'party', 'Kell', 160);
console.log(JSON.stringify({ afterEmergent, afterAuthored, liftedEdges: lifted.lifted, afterLapse, stillBannedAtKell: isBanned }, null, 1));
