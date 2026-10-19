// D-RN-r2b probe: does advanceEnvoyDiplomacyPulse's early return (envoy gate shut) hand back its INPUT
// wizardNews and settlementUpdates by reference? (read-only import of master 81f1cd963)
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const { advanceEnvoyDiplomacyPulse } = await import(M + '/src/domain/worldPulse/envoyPulse.js');
const ws = { tick: 10, settlements: [], spatialLedgers: {} };
const news = [{ id: 'sentinel-news' }];
const updates = [{ id: 's1', sentinel: true }];
const out = advanceEnvoyDiplomacyPulse({ worldState: ws, snapshot: { settlements: [] }, regionalGraph: null, wizardNews: news, settlementUpdates: updates, tick: 10, now: '2026-10-18' });
console.log(JSON.stringify({
  worldStateSameRef: out.worldState === ws,
  wizardNewsSameRef: out.wizardNews === news,
  settlementUpdatesSameRef: out.settlementUpdates === updates,
  keys: Object.keys(out).slice(0, 8),
}, null, 1));
