// D-OP-r2 probe for OP-V1: a durable `wnpc_` id as a D-2 mouthpiece vs the roster's positional key.
// Imports the master worktree READ-ONLY; writes nothing there.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse';
const { advanceNpcCredibility, npcCredibilityWeightOf } = await import(`${M}/npcCredibility.js`);
const { npcId } = await import(`${M}/npcAgency.js`);
const positional = npcId('tolle', { id: 'npc_3', name: 'Ardo' }, 0);
const durable = 'wnpc_0f3a9c';
const live = new Set([positional]); // buildLiveNpcIds lists roster keys only
let ws = { simulationRules: { npcCredibilityEnabled: true }, spatialLedgers: {} };
const deltas = [
  { id: durable, kind: 'deception', magnitude01: 1, lieExposedBand: 2 },
  { id: positional, kind: 'deception', magnitude01: 1, lieExposedBand: 2 },
];
const r1 = advanceNpcCredibility({ worldState: ws, tick: 10, deltas, liveNpcIds: live });
const ledger = r1.worldState.spatialLedgers.npcCredibility || {};
console.log('positional key shape:', positional);
console.log('keys after the exposure pass:', Object.keys(ledger));
console.log('weight(durable wnpc_ id) =', npcCredibilityWeightOf(r1.worldState, durable, 11));
console.log('weight(positional key)    =', npcCredibilityWeightOf(r1.worldState, positional, 11));
// a second pass with no deltas: the positional entry persists (decay), the durable one never existed
const r2 = advanceNpcCredibility({ worldState: r1.worldState, tick: 12, deltas: [], liveNpcIds: live });
console.log('keys after the next pass:', Object.keys(r2.worldState.spatialLedgers.npcCredibility || {}));
