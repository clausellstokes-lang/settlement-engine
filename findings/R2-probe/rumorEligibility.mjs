// R2 probe: which landed party-impact kinds produce a feed entry that the rumor road would seed?
// Imports the master worktree's modules read-only (path passed as argv[2]).
const W = process.argv[2];
const { buildPartyImpactOutcomes, PARTY_IMPACT_KINDS } = await import(`${W}/src/domain/worldPulse/partyImpact.js`);
const { newsEntryForOutcome } = await import(`${W}/src/domain/worldPulse/worldPulseFeedCuration.js`);
const { passesSignificanceGate } = await import(`${W}/src/domain/spatial/rumorNetwork.js`);
const { ensureWorldState } = await import(`${W}/src/domain/worldPulse/worldState.js`);

const stressor = { id: 'st1', type: 'siege', label: 'Siege of A', severity: 0.8, status: 'active', originSettlementId: 'A', affectedSettlementIds: ['A'] };
const ws = ensureWorldState({ tick: 10, stressors: [stressor],
  npcStates: { 'A:npc_1': { settlementId: 'A', npcId: 'npc_1', name: 'Lord Varn', loyalty: 0.5 } },
  factionStates: { 'A:f1': { settlementId: 'A', factionId: 'f1', name: 'Guild' } },
  relationshipStates: {} }, { id: 'c1' });
const settlement = { name: 'A', npcs: [{ id: 'npc_1', name: 'Lord Varn' }], activeConditions: [{ archetype: 'plague', severity: 0.6 }] };
const snapshot = { byId: new Map([['A', { settlement }]]), settlements: [{ id: 'A', save: { name: 'A' }, settlement }], regionalGraph: { edges: [] } };
const actions = {
  resolve_stressor: { stressorId: 'st1' }, ease_stressor: { stressorId: 'st1' }, worsen_stressor: { stressorId: 'st1' },
  name_attacker: { stressorId: 'st1', attackerLabel: 'goblins' },
  broker_relationship: { relationshipKey: 'rel.A.B' }, inflame_relationship: { relationshipKey: 'rel.A.B' },
  clear_condition: { settlementId: 'A', condition: 'plague', recoveryArchetype: 'recovering' },
  impose_condition: { settlementId: 'A', archetype: 'plague' },
  bolster_faction: { settlementId: 'A', factionId: 'f1' }, undermine_faction: { settlementId: 'A', factionId: 'f1' },
  empower_npc: { settlementId: 'A', npcId: 'npc_1' }, remove_npc: { settlementId: 'A', npcId: 'npc_1' },
};
const rows = [];
for (const kind of Object.keys(PARTY_IMPACT_KINDS)) {
  for (const mag of [null, 1.0]) {
    const action = { id: 'd1', kind, label: PARTY_IMPACT_KINDS[kind].label, ...actions[kind], ...(mag == null ? {} : { magnitude: mag }) };
    let built;
    try { built = buildPartyImpactOutcomes(action, { worldState: ws, snapshot, tick: 10, now: null }); }
    catch (e) { rows.push({ kind, mag, error: String(e.message).slice(0, 80) }); continue; }
    const entries = built.outcomes.map((o) => newsEntryForOutcome(o, 10, 'applied'));
    rows.push({ kind, mag: mag ?? 'default', ok: built.ok, outcomes: built.outcomes.length,
      entries: entries.map((e) => ({ impactKind: e.impactKind, sig: e.significance, score: e.score, sids: e.settlementIds.length,
        rumorSeedable: passesSignificanceGate(e) && e.settlementIds.length > 0 })) });
  }
}
console.log(JSON.stringify(rows, null, 1));
