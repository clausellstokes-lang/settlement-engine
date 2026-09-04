const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/';
const { DOSSIER_STATE_PROSE_ECONOMY } = await import(D + 'src/data/dossierStateProse/economy.generated.js');
const b = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-9'];
console.log('DS-ECO-9 pool keys:', JSON.stringify(Object.keys(b.pools), null, 1));
for (const [k, v] of Object.entries(b.pools)) {
  console.log(`  ${k}: ${v.length} variant(s) | first="${(v[0]?.text || v[0]?.sentence || JSON.stringify(v[0])).slice(0,90)}"`);
}
