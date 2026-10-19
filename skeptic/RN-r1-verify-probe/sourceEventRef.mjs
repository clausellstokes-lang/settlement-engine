// RN-r1-verify probe: what `sourceEventRef` the party door can supply, per RN §2.1's own definition
// ("the eventRef of the news entry the party door writes for the act"; the feed seeder's
// `String(entry.sourceEventId || entry.id)`). Read-only imports of master 81f1cd963.
const W = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const { buildPartyImpactOutcomes } = await import(`${W}/src/domain/worldPulse/partyImpact.js`);
const { newsEntryForOutcome } = await import(`${W}/src/domain/worldPulse/worldPulseFeedCuration.js`);
const { mapEventToPartyImpact } = await import(`${W}/src/domain/events/partyEventLinkage.js`);

const settlement = { id: 's1', npcs: [{ id: 'npc_3', name: 'Aldo' }, { id: 'npc_4', name: 'Berra' }] };
const snapshot = { byId: new Map([['s1', { settlement }]]), settlements: [] };
const worldState = { tick: 10, npcStates: {} };

function refFor(action, tick) {
  const built = buildPartyImpactOutcomes(action, { worldState: { ...worldState, tick }, snapshot, tick });
  return built.outcomes.map((o) => { const e = newsEntryForOutcome(o, tick); return String(e.sourceEventId || e.id); });
}
const out = {};
// (1) the composer door: a party-caused KILL_NPC with an event id
const ev = { id: 'evt_kill_aldo_t10', type: 'KILL_NPC', partyCaused: true, targetId: 'npc_3', description: 'Aldo slain' };
const action = mapEventToPartyImpact(ev, 's1');
out.composerAction = action;
out.composerActionCarriesEventId = Object.values(action || {}).includes(ev.id) || 'id' in (action || {});
out.partyDoorRefs_composerKill = refFor(action, 10);
// (2) two DIFFERENT removals in one settlement, same tick (R6) and a repeat years later
out.removeAldo_t10 = refFor({ kind: 'remove_npc', settlementId: 's1', npcId: 'npc_3', label: 'Remove an NPC' }, 10);
out.removeBerra_t10 = refFor({ kind: 'remove_npc', settlementId: 's1', npcId: 'npc_4', label: 'Remove an NPC' }, 10);
out.removeBerra_t200 = refFor({ kind: 'remove_npc', settlementId: 's1', npcId: 'npc_4', label: 'Remove an NPC' }, 200);
out.sameRefAcrossDistinctActs = out.removeAldo_t10[0] === out.removeBerra_t10[0] && out.removeBerra_t10[0] === out.removeBerra_t200[0];
out.composerRefEqualsEventId = out.partyDoorRefs_composerKill.includes(ev.id);
console.log(JSON.stringify(out, null, 2));
