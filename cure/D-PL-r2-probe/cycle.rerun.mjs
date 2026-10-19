// PL-r1-6 verify probe: does a claimant's matured rung over its crown make foreignSeatOf a two-cycle
// even when vassalizationOutcomes never relabels (the edge keeps H as overlord)? Read-only import.
const W = process.argv[2];
const { foreignSeatOf } = await import(`${W}/src/domain/rulingPowerSeat.js`);
const edge = { id: 'H__M', from: 'H', to: 'M', relationshipType: 'vassal', status: 'confirmed' };
const key = 'H__M';
const worldState = {
  occupations: { H: { occupierId: 'M', state: 'vassalized', resistance: 0, sinceTick: 1, stateHeld: 0, lastTick: 9 } },
  relationshipStates: { [key]: { relationshipType: 'vassal', overlordSaveId: 'H', vassalSaveId: 'M', leverage: 0.6, dependency: 0.5, pactStrength: 0.4, fear: 0.3, resentment: 0.1 } },
};
const snapshot = { regionalGraph: { edges: [edge] }, settlements: [{ id: 'H' }, { id: 'M' }], byId: new Map([['H', { id: 'H', settlement: {} }], ['M', { id: 'M', settlement: {} }]]) };
const h = foreignSeatOf(worldState, snapshot, 'H');
const m = foreignSeatOf(worldState, snapshot, 'M');
console.log('H ->', h && { regime: h.regime, patron: h.patronSettlementId, basis: h.basis });
console.log('M ->', m && { regime: m.regime, patron: m.patronSettlementId, basis: m.basis });
