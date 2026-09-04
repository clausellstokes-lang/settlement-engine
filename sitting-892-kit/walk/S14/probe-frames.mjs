const mod = await import('file:///private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneNEWSTRAIN-tree/src/domain/region/wizardNews.js');
const { createWizardNewsEntryFromImpact, IMPACT_LABELS } = mod;
const graph = { nodes: [{ id: 't1', name: 'Elmspur' }, { id: 's1', name: 'Ashford' }], channels: [{ id: 'c1', type: 'road' }] };
const T = ['ready','applied','resolved','ignored','expired','queued'];
console.log('IMPACT_LABELS', Object.keys(IMPACT_LABELS).length, JSON.stringify(IMPACT_LABELS));
for (const kind of Object.keys(IMPACT_LABELS)) {
  for (const transition of T) {
    const impact = { id: 'imp_'+kind, kind, targetSettlementId: 't1', sourceSettlementId: 's1', channelId: 'c1', channelType: 'road', severity: 0.5, status: transition };
    try {
      const e = createWizardNewsEntryFromImpact(impact, { graph, transition, tick: 1, createdAt: '2026-01-01T00:00:00.000Z' });
      console.log(kind + ' | ' + transition + ' | H: ' + e.headline + ' | S: ' + e.summary);
    } catch (err) { console.log(kind + ' | ' + transition + ' | ERR ' + err.message); }
  }
}
// fallbacks: no names, no source
const e2 = createWizardNewsEntryFromImpact({ id: 'x', kind: 'route_disruption', targetSettlementId: 'zz', channelId: 'c1' }, { graph: { nodes: [], channels: [] }, transition: 'ready', tick: 1, createdAt: '2026-01-01T00:00:00.000Z' });
console.log('FALLBACK | H: ' + e2.headline + ' | S: ' + e2.summary);
const e3 = createWizardNewsEntryFromImpact({ id: 'y', kind: 'totally_unknown_kind', targetSettlementId: 't1', sourceSettlementId: 's1', channelId: 'c1' }, { graph, transition: 'applied', tick: 1, createdAt: '2026-01-01T00:00:00.000Z' });
console.log('UNREGISTERED | H: ' + e3.headline + ' | S: ' + e3.summary);
