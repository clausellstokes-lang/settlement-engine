// L-CH probe 1: does the npcLedger's closed normalizer drop an unknown `paragon` field? (read-only import of master)
const M = process.argv[2];
const L = await import(M + '/src/domain/worldPulse/npcLedger.js');
const ws = { simulationRules: { npcConsequencesEnabled: true }, spatialLedgers: { npcLedger: {
  roamers: { wnpc_probe1: { identityFacets: { name: 'Vey', role: 'captain' }, sinceTick: 3, paragon: { domain: 'war', polarity: 'champion' } } },
  placed: {}, exclusions: {} } } };
const led = L.npcLedgerOf(ws);
console.log('roamer keys after read:', Object.keys(led.roamers.wnpc_probe1 || {}).join(','));
console.log('paragon survives read:', 'paragon' in (led.roamers.wnpc_probe1 || {}));
const mv = L.moveNpcRecord({ worldState: ws, wnpcId: 'wnpc_probe1', patch: { paragon: { domain: 'war' } } });
console.log('paragon survives moveNpcRecord patch:', 'paragon' in (L.npcLedgerOf(mv.worldState).roamers.wnpc_probe1 || {}));
const dark = L.moveNpcRecord({ worldState: { ...ws, simulationRules: {} }, wnpcId: 'wnpc_probe1', patch: { x: 1 } });
console.log('dark move returns same ref:', dark.worldState === undefined ? 'n/a' : (dark.changed === false));
const g = L.graduateNpc({ worldState: { simulationRules: {} }, settlementSeed: 's', settlementId: 'a', rosterIdentity: { rosterId: 'npc_1', name: 'X' }, tick: 1 });
console.log('graduate dark → wnpcId:', g.wnpcId);
